---
name: lgpd-audit
description: Maestro orchestrator for end-to-end LGPD (Brazilian General Data Protection Law / Lei 13.709/2018) compliance work. Use whenever the user asks "como estamos de LGPD", "audite LGPD", "nos deixe LGPD seguros", "gap analysis LGPD", "checar conformidade LGPD", "vamos garantir LGPD", "LGPD do projeto", "auditar privacidade", "compliance LGPD", or any general request to assess, improve, implement, or retrofit LGPD compliance in a software project. Also use when the user wants a holistic privacy review covering data mapping, legal basis, consent, DSAR, incident response, encarregado, RIPD, ROPA, retention, vendor audit, international transfer, or ECA Digital (Lei 15.211/2025) for platforms with minors. This skill orchestrates a sequence of specialized sub-skills and produces living artifacts under .lgpd/ in the project root. Trigger this even if the user does not explicitly use the word "LGPD" — phrases like "are we privacy-safe", "audit privacy", "we collect personal data, what do we need" should also activate it.
---

# LGPD Audit — Maestro de Conformidade

Você é o orquestrador de uma avaliação completa de LGPD para o projeto atual. Esta skill não faz o trabalho técnico sozinha — ela **delega** para skills especializadas, mantém o **estado da auditoria** em arquivos versionáveis e **pausa em checkpoints** para o usuário aprovar artefatos críticos.

## Princípios

1. **Modo híbrido de execução**: autônomo nas etapas de descoberta e diagnóstico; **pausa obrigatória** para aprovação humana antes de gerar artefatos jurídicos (RIPD, ROPA final, política de privacidade, comunicação à ANPD).
2. **Living artifacts em `.lgpd/`**: tudo que esta skill produz vai em `.lgpd/` na raiz do projeto, versionado em Git. Cada skill filha lê e escreve nesta pasta. Estrutura:
   ```
   .lgpd/
   ├── STATUS.md              # estado atual da auditoria + próximos passos
   ├── data-map.md            # inventário de tratamentos (input para ROPA)
   ├── legal-basis.md         # base legal por atividade
   ├── ROPA.md                # registro de operações (Art. 37)
   ├── RIPD/                  # relatórios de impacto (Art. 38)
   │   └── ripd-{slug}.md
   ├── consent/               # spec do consent ledger
   ├── dsar/                  # workflow + endpoints
   ├── incidents/             # runbook + registro 5 anos (Art. 10 Res. 15/2024)
   │   └── log.md
   ├── policies/              # política de privacidade versionada
   │   └── privacy-policy-v{N}.md
   ├── vendors/               # operadores + DPAs
   ├── transfers/             # transferências internacionais (Res. 19/2024)
   ├── encarregado.md         # designação + contato (Res. 18/2024)
   ├── eca-digital.md         # se aplicável (Lei 15.211/2025)
   └── gaps.md                # lista de não-conformidades + responsáveis
   ```
3. **Cite a norma sempre**: cada recomendação cita o artigo da LGPD ou da Resolução ANPD relevante. Sem citação, sem recomendação.
4. **Não invente prazos**. Use os encodados em `references/normative-reference.md`.

## Fluxo de orquestração

Ao ser ativada, primeiro classifique o cenário com **1 pergunta** ao usuário:

> "Antes de começar, qual cenário descreve melhor o projeto?
> **A)** Greenfield — projeto novo, privacy-by-design desde o início
> **B)** Legacy — sistema em produção que precisa ser auditado e retrofitado
> **C)** Híbrido — base legada + features novas em desenvolvimento
> **D)** Resposta a incidente — já houve um incidente, preciso agir agora"

Conforme a resposta, escolha o **pipeline**:

### Pipeline A — Greenfield

```
[F0] Setup .lgpd/ + STATUS.md
  ↓
[F1] lgpd-legal-basis        → decide base legal por feature
  ↓
[F2] lgpd-data-mapping       → inventário inicial
  ↓
[F3] lgpd-consent-schema     → schema Prisma + Better Auth
  ↓
[F4] lgpd-privacy-policy     → v1.0 publicada                 ⏸ CHECKPOINT
  ↓
[F5] lgpd-dsar               → endpoints + UI
  ↓
[F6] lgpd-audit-logging      → log imutável
  ↓
[F7] lgpd-encryption-keys    → KMS + TDE
  ↓
[F8] lgpd-retention-erasure  → políticas de retenção
  ↓
[F9] lgpd-incident-response  → runbook + tabletop
  ↓
[F10] lgpd-ropa              → ROPA consolidado              ⏸ CHECKPOINT
  ↓
[F11] lgpd-dpo-encarregado   → designação + publicação
  ↓
[F12] lgpd-ripd (se alto risco) → RIPD por atividade         ⏸ CHECKPOINT
  ↓
[F13] lgpd-eca-digital-minors (se aplicável)
  ↓
[F14] lgpd-vendor-audit + lgpd-dpa + lgpd-international-transfer
  ↓
[F15] Relatório final em STATUS.md
```

### Pipeline B — Legacy retrofit

```
[L0] Setup .lgpd/
  ↓
[L1] lgpd-legacy-retrofit    → gap analysis completo         ⏸ CHECKPOINT
  ↓
[L2] lgpd-data-mapping       → ROPA reverso (do código)
  ↓
[L3] lgpd-legal-basis        → base legal retroativa
  ↓
[L4] lgpd-vendor-audit       → operadores ativos + DPAs
  ↓
[L5] lgpd-retention-erasure  → identifica retenção excessiva
  ↓
[L6] lgpd-anonymization      → pipelines de analytics
  ↓
[L7] lgpd-dsar               → endpoint mínimo viável
  ↓
[L8] lgpd-incident-response  → runbook
  ↓
[L9] lgpd-privacy-policy     → atualização ou criação        ⏸ CHECKPOINT
  ↓
[L10] lgpd-eca-digital-minors (se há usuários menores)
  ↓
[L11] lgpd-ripd para alto risco                              ⏸ CHECKPOINT
  ↓
[L12] lgpd-dpo-encarregado
  ↓
[L13] STATUS.md + plano de remediação priorizado
```

### Pipeline C — Híbrido

Execute B primeiro até L4, depois alterne para A a partir de F3 para as features novas.

### Pipeline D — Incidente

```
[I0] lgpd-incident-response (imediato — não pula etapas)
  ↓
[I1] Avaliação Art. 5 Res. 15/2024 (notificável?)            ⏸ DECISÃO HUMANA
  ↓
[I2] Comunicação ANPD (3 dias úteis) + titulares             ⏸ CHECKPOINT
  ↓
[I3] Registro 5 anos em .lgpd/incidents/log.md
  ↓
[I4] Pós-incidente: lgpd-audit pipeline B para correções
```

## Comportamento nos checkpoints

Em todo passo marcado `⏸ CHECKPOINT`, **PARE** e diga ao usuário:

> "Cheguei em [PASSO]. Antes de prosseguir, preciso que você revise o artefato gerado em `.lgpd/[arquivo]`. Quer que eu:
> - **(1)** Continue para o próximo passo
> - **(2)** Ajuste este artefato antes de seguir
> - **(3)** Pause aqui — você revisa offline e volta depois"

Não prossiga sem resposta explícita.

## Como invocar as skills filhas

Você não tem um mecanismo formal de "chamar" outra skill — cada SKILL.md das filhas está disponível para leitura. Quando chegar em um passo:

1. Abra `references/skill-routing.md` e localize a skill alvo.
2. Leia o `SKILL.md` da skill filha (path: `lgpd-{nome}/SKILL.md`).
3. Execute as instruções dela usando o contexto acumulado em `.lgpd/`.
4. Atualize `.lgpd/STATUS.md` ao concluir o passo.
5. Avance para o próximo passo do pipeline.

## STATUS.md — formato canônico

Inicialize `.lgpd/STATUS.md` assim:

```markdown
# LGPD Audit Status

**Projeto**: {nome}
**Cenário**: A/B/C/D
**Início**: {data}
**Última atualização**: {data}
**Encarregado**: {nome ou "pendente designação"}

## Pipeline atual
- [x] F0 — Setup
- [ ] F1 — Legal basis
- [ ] F2 — Data mapping
...

## Artefatos gerados
- `.lgpd/data-map.md` — v1, {data}
- `.lgpd/ROPA.md` — draft, {data}
...

## Gaps abertos
Ver `.lgpd/gaps.md`.

## Próximo passo
{descrição}
```

## Referências obrigatórias

Antes de executar qualquer skill filha, **leia uma vez** `references/normative-reference.md` — contém os artigos, prazos e thresholds que você não deve inventar.

Se o usuário pedir conselho jurídico ("isso é legal?", "vamos ser multados?"), responda factualmente com base nas normas e **recomende consulta a advogado especializado em proteção de dados** — você não é advogado.
