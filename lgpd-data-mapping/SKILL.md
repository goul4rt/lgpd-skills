---
name: lgpd-data-mapping
description: Build and maintain a data inventory (mapa de dados) of all personal data processing activities in the project. Use when user asks "mapa de dados", "data mapping LGPD", "que dados pessoais coletamos", "inventário de tratamento", or as part of an LGPD audit pipeline. Produces `.lgpd/data-map.md`. Especially important for legacy systems where the inventory is built reverse-engineered from code (Prisma schemas, API endpoints, third-party SDKs, log statements).
---

# Data Mapping LGPD

Inventário canônico de **todas** as atividades de tratamento de dados pessoais no projeto. É o pré-requisito para ROPA (Art. 37), RIPD (Art. 38), retenção e DSAR.

## Workflow

### Para greenfield

Liste atividades por feature/módulo do produto antes de codar. Cada feature que toca dado pessoal = uma atividade.

### Para legacy (reverse-engineering)

1. **Schemas de banco**: leia `prisma/schema.prisma` (ou equivalente). Toda tabela com referência a usuário = candidato.
2. **APIs**: leia rotas REST/tRPC/GraphQL. Endpoints recebendo PII = atividade.
3. **SDKs de terceiros**: grep por nomes (Sentry, Datadog, Mixpanel, Amplitude, Segment, Stripe, Discord SDK, Firebase, OneSignal). Cada um é compartilhamento.
4. **Logs**: cuidado — logs podem vazar PII inadvertidamente (audit também).
5. **Cookies e localStorage** em frontends.
6. **Coletas mobile**: device ID, geolocation, push tokens, biometria, contatos, fotos.

## Por atividade, capture:

- **Nome curto** (slug)
- **Descrição** (1 linha)
- **Finalidade específica** (Art. 6º, I)
- **Base legal** (link para `.lgpd/legal-basis.md`)
- **Categorias de titulares**: usuários, prospects, funcionários, dependentes, terceiros. **Flag**: contém crianças? adolescentes? idosos?
- **Categorias de dados**:
  - Comuns: nome, e-mail, CPF (atenção — alguns tratam como sensível operacional), telefone, endereço, IP, device ID
  - Sensíveis (Art. 5º, II): saúde, biometria, raça, religião, política, sindicato, sexualidade, genético
- **Fonte/origem**: coletado do titular? observado? inferido? terceiro?
- **Sistemas que armazenam**: tabelas, caches, S3 buckets, BigQuery, planilhas
- **Compartilhamentos**:
  - Internos: outros times/empresas do grupo
  - Externos operadores: lista
  - Transferência internacional: lista (link para `.lgpd/transfers/`)
- **Retenção**: prazo + critério
- **Medidas de segurança**: criptografia, RBAC, audit log
- **Alto risco?**: Aplicar teste Res. 2/2022 Art. 4 → se sim, marca para RIPD
- **Owner**: pessoa/time responsável

## Template — `.lgpd/data-map.md`

```markdown
# Mapa de Dados — {projeto}

**Versão**: v{N}
**Data**: {data}
**Owner global**: Encarregado / DPO

## Atividades de Tratamento

### A001 — {nome}

| Campo | Valor |
|---|---|
| Slug | a001-{slug} |
| Finalidade | {específica} |
| Base legal | Art. {N}, {inciso} ([detalhes](./legal-basis.md#a001)) |
| Categorias de titulares | usuários adultos + adolescentes |
| Sensíveis? | Não / Sim ({quais}) |
| Dados | nome, e-mail, IP, user-agent |
| Fonte | coletado do titular no signup |
| Sistemas | `users` (Postgres), `auth_sessions` (Redis), Datadog logs |
| Operadores | AWS RDS (US-East-1), Datadog (US), Better Auth (lib local) |
| Transferência intl. | Sim — AWS US, Datadog US (ver `.lgpd/transfers/`) |
| Retenção | 5 anos após inatividade (obrig. legal — prescrição CDC) |
| Segurança | TLS 1.3, TDE, RBAC, audit log |
| Alto risco? | Não |
| RIPD | N/A |
| Owner | @aroldo |

### A002 — ...
```

## Annotations no schema (greenfield)

Sugira ao usuário anotações em comentários do Prisma schema:

```prisma
/// @lgpd:activity=a001
/// @lgpd:purpose="autenticação e gestão de conta"
/// @lgpd:legal_basis="art_7_v"  // execução de contrato
/// @lgpd:retention="5y_after_inactivity"
/// @lgpd:sensitive=false
model User {
  id        String   @id
  email     String   @unique  /// @lgpd:pii=high
  cpf       String?  /// @lgpd:pii=high @lgpd:masked=true
  // ...
}
```

Script auxiliar para extrair anotações: `assets/extract-prisma-annotations.sh`.

## Checklist de qualidade

- [ ] Toda tabela com FK para `User` está coberta
- [ ] Toda integração de terceiro está listada como compartilhamento
- [ ] Toda atividade tem base legal explícita
- [ ] Atividades de alto risco estão flagadas
- [ ] Atividades com menores estão flagadas (ECA Digital aplicável)
- [ ] Retenção definida (sem "indefinido")

Ao terminar, atualize `.lgpd/STATUS.md`:

```markdown
## F2 — Data mapping ✓
- {N} atividades inventariadas
- {N} envolvem dados sensíveis
- {N} envolvem menores
- {N} marcadas como alto risco → RIPD pendente: {lista}
- Próximo: lgpd-consent-schema (greenfield) ou lgpd-legal-basis (legacy)
```
