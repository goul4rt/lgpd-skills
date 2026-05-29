---
name: lgpd-legacy-retrofit
description: Run a gap analysis and retrofit plan for an existing system that wasn't built with LGPD in mind. Use when user asks 'auditar projeto legado LGPD', 'gap analysis LGPD', 'sistema antigo LGPD', 'temos LGPD?', 'estamos em compliance?', or when invoking lgpd-audit on a legacy codebase. Produces prioritized remediation plan in `.lgpd/gaps.md`. Entry point for Pipeline B.
---

# Legacy Retrofit — LGPD Gap Analysis

Skill de entrada para auditar e remediar sistemas legados. Não tenta resolver tudo de uma vez — produz **plano priorizado**.

## Workflow (em uma sessão)

### Fase 1: Discovery (1-2h)

Investigue o código existente:

1. **Schema do banco** — `prisma/schema.prisma`, migrations
2. **APIs** — rotas, controllers, GraphQL schemas
3. **SDKs de terceiros** — `package.json`, env vars
4. **Endpoints expostos** — OpenAPI, docs
5. **Cookies e tracking** — frontend code, GTM, pixels
6. **Mobile** — permissions no AndroidManifest/Info.plist
7. **Política de privacidade existente** — site, app, ToS
8. **Encarregado existente** — sítio público
9. **Incidentes anteriores** — registros, post-mortems
10. **Operadores ativos** — billing, integrações

Salve resultados em `.lgpd/discovery.md`.

### Fase 2: Gap analysis sistemático

Para cada item, marque GREEN/YELLOW/RED:

| Item | Status | Evidência | Severidade |
|---|---|---|---|
| Base legal documentada por atividade | RED | nenhuma | crítica |
| ROPA existe | RED | nenhum | crítica |
| Política de privacidade publicada | YELLOW | existe v desatualizada | alta |
| Encarregado designado | YELLOW | em DPA, sem div. pública | alta |
| Canal DSAR | RED | só e-mail genérico | alta |
| Endpoint de eliminação | RED | nenhum | alta |
| Audit log de acesso a PII | YELLOW | log básico, sem chain | média |
| Criptografia em repouso | GREEN | RDS TDE | - |
| Criptografia em trânsito | GREEN | TLS 1.3 | - |
| Runbook de incidente | RED | nenhum | crítica |
| DPA com operadores | RED | nenhum assinado | alta |
| Cláusulas-padrão intl | RED | nenhuma | alta |
| Coleta excessiva | YELLOW | telefone obrigatório sem necessidade | média |
| Retenção definida | RED | "indefinido" em tudo | alta |
| Treinamento equipe | RED | nunca | média |
| ECA Digital (se aplicável) | varia | | |

### Fase 3: Priorização

Use matriz:

```
Severidade × Esforço:
- Crítica + Baixo = FAZER JÁ (sprint atual)
- Crítica + Alto = Planejar próximas 2-4 semanas
- Alta + Baixo = Próximas 2 semanas
- Alta + Alto = Próximo trimestre
- Média = Backlog priorizado
- Baixa = Backlog
```

### Fase 4: Plano de remediação

Salve em `.lgpd/gaps.md`:

```markdown
# Gap Analysis e Plano de Remediação — {data}

## Resumo
- {N} gaps críticos
- {M} gaps altos
- {X} gaps médios
- {Y} gaps baixos

## Ações imediatas (próxima semana)
1. **Designar Encarregado e publicar contato** — {responsável}, prazo {data}
   - Skill a executar: lgpd-dpo-encarregado
2. **Publicar política de privacidade v1** — {responsável}, prazo {data}
   - Skill: lgpd-privacy-policy
3. **Implementar canal DSAR mínimo** — formulário + e-mail dedicado, {responsável}, prazo {data}
   - Skill: lgpd-dsar
4. **Publicar runbook de incidente** — {responsável}, prazo {data}
   - Skill: lgpd-incident-response

## Próximas 2-4 semanas
5. Inventário de dados completo (ROPA) — lgpd-data-mapping + lgpd-ropa
6. Inventário e DPA com operadores ativos — lgpd-vendor-audit + lgpd-dpa
7. Cláusulas-padrão para operadores intl — lgpd-international-transfer

## Próximo trimestre
8. Audit log encadeado — lgpd-audit-logging
9. Retenção e eliminação automatizadas — lgpd-retention-erasure
10. RIPD para atividades de alto risco — lgpd-ripd
11. Avaliação ECA Digital (se aplicável) — lgpd-eca-digital-minors

## Backlog
12. Treinamento equipe (anual)
13. Pentest e revisão de segurança
14. Programa de governança em privacidade (Art. 50)
```

### Fase 5: Comunicação

Apresente ao usuário:
- Resumo executivo (3 bullets do estado atual)
- Top 3 ações imediatas
- ⏸ CHECKPOINT — confirme antes de seguir para próxima skill do pipeline

## Status update

```markdown
## L1 — Legacy retrofit ✓
- Discovery completo
- {N} gaps identificados
- Plano em `.lgpd/gaps.md`
- ⏸ Aguardando aprovação para iniciar L2 (lgpd-data-mapping)
```

