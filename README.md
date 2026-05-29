# lgpd-skills

> Conjunto modular e orquestrado de **skills para Claude** que cobre, ponta-a-ponta, conformidade com a **Lei nº 13.709/2018 (LGPD)**, resoluções da ANPD aplicáveis e a **Lei nº 15.211/2025 (ECA Digital)**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![LGPD](https://img.shields.io/badge/LGPD-Lei%2013.709%2F2018-blue)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
[![ECA Digital](https://img.shields.io/badge/ECA%20Digital-Lei%2015.211%2F2025-blue)](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm)

---

> **EN — Quick overview:** A Claude skill bundle (works in Claude Code, Claude.ai, and the Claude app) that runs an end-to-end Brazilian privacy-law compliance audit on your codebase. One orchestrator skill (`lgpd-audit`) chains 18 specialized sub-skills covering legal basis, data mapping, ROPA, DPIA (RIPD), consent ledger, DSAR endpoints, incident response (3 business days notification), encryption, retention, vendor DPAs, international transfer clauses, and ECA Digital (online safety for minors). Outputs versioned artifacts under `.lgpd/`. Triggered by phrases like *"audit our LGPD compliance"* or *"we had a data breach"*. MIT licensed.

---

## 📑 Índice

- [O que é](#-o-que-é)
- [Quando usar](#-quando-usar)
- [Instalação](#-instalação)
- [Como usar](#-como-usar)
- [As 19 skills](#-as-19-skills)
- [Living artifacts em `.lgpd/`](#-living-artifacts-em-lgpd)
- [Gatilhos](#-gatilhos)
- [Cobertura normativa](#-cobertura-normativa)
- [Stack assumida](#-stack-assumida)
- [Disclaimer](#%EF%B8%8F-disclaimer)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 O que é

Um pacote de skills para o **Claude** (Code, app web e desktop) que transforma uma conversa de "preciso adequar isso aqui à LGPD" em um pipeline executável, versionável e auditável.

Em vez de uma skill gigante e monolítica, aqui são **19 skills coordenadas**:

- **1 maestro** (`lgpd-audit`) que orquestra todo o fluxo, decide o pipeline, mantém estado e pausa em checkpoints críticos
- **18 sub-skills** especializadas — cada uma roda sozinha, ou em sequência sob comando do maestro

Cada sub-skill produz **artefatos vivos versionáveis em Git** sob `.lgpd/` (STATUS.md, ROPA.md, RIPD/, política, runbook de incidente, etc.) — combina com fluxo de ADR e spec-driven development.

## 🧭 Quando usar

| Cenário | Pipeline ativado | Tempo estimado |
|---|---|---|
| Projeto greenfield, privacy-by-design desde o início | Pipeline A | 1-2 semanas |
| Sistema legado em produção precisando de auditoria + retrofit | Pipeline B | 2-6 semanas |
| Codebase híbrida (legado + features novas) | Pipeline C | 3-8 semanas |
| Incidente de segurança em andamento — preciso comunicar a ANPD | Pipeline D | **3 dias úteis** (Res. 15/2024) |

Nenhum desses tempos é cravado — depende do tamanho do projeto, da equipe disponível, e do nível de maturidade atual.

## 📦 Instalação

### Opção 1: Por projeto (recomendado para times)

```bash
git clone https://github.com/goul4rt/lgpd-skills.git .claude/skills/lgpd-skills-temp
mv .claude/skills/lgpd-skills-temp/lgpd-* .claude/skills/
rm -rf .claude/skills/lgpd-skills-temp
git add .claude/skills/lgpd-* && git commit -m "feat: add lgpd-skills"
```

### Opção 2: Global (todos os seus projetos)

```bash
git clone https://github.com/goul4rt/lgpd-skills.git ~/.claude/skills/lgpd-skills-temp
mv ~/.claude/skills/lgpd-skills-temp/lgpd-* ~/.claude/skills/
rm -rf ~/.claude/skills/lgpd-skills-temp
```

### Opção 3: Via zip do release

Baixe o último `lgpd-skills.zip` em [Releases](https://github.com/goul4rt/lgpd-skills/releases) e descompacte em `.claude/skills/` ou `~/.claude/skills/`.

## 🚀 Como usar

Após instalar, o Claude detecta as skills automaticamente. Não precisa configurar nada.

### Fluxo típico: auditoria completa

```
Você: veja como estamos de LGPD

Claude: [ativa lgpd-audit]
  → Antes de começar, qual cenário descreve melhor o projeto?
    A) Greenfield  B) Legacy  C) Híbrido  D) Resposta a incidente

Você: B

Claude: [inicia Pipeline B — Legacy Retrofit]
  → Vou começar pelo lgpd-legacy-retrofit para gap analysis...
  → [lê código, schemas, package.json, env, ToS atual]
  → [produz .lgpd/discovery.md + .lgpd/gaps.md]
  → ⏸ CHECKPOINT — revise antes de seguir

Você: (revisa) Continue.

Claude: → lgpd-data-mapping...
  → lgpd-legal-basis...
  → (continua até a conclusão do pipeline)
```

### Uso individual

Pode invocar qualquer skill diretamente:

```
Você: implementa o endpoint de exclusão de conta

Claude: [ativa lgpd-dsar e gera código + schema + audit log]
```

```
Você: tivemos um vazamento de e-mails, preciso comunicar a ANPD

Claude: [ativa lgpd-incident-response em modo emergencial]
  → Vou guiar pelo runbook da Res. 15/2024. T+0...
```

## 🗂️ As 19 skills

```
lgpd-audit (maestro)
│
├── lgpd-legal-basis           Base legal por atividade (Art. 7/11) + LIA
├── lgpd-data-mapping          Inventário (reverse-eng em legado, schema annotations em greenfield)
├── lgpd-ropa                  Registro de Operações (Art. 37) — modelo ANPD ATPP
├── lgpd-ripd                  Relatório de Impacto (Art. 38) — metodologia ISO 31000
├── lgpd-consent-schema        Prisma ledger append-only + Better Auth + Guardian/MinorLink
├── lgpd-dsar                  Direitos do titular (Art. 18) — SLA 15 dias hard-coded
├── lgpd-privacy-policy        Política Art. 9 — 7 elementos + versionamento + CHECKPOINT
├── lgpd-incident-response     Res. 15/2024 — 3 dias úteis ANPD + titular, runbook + tabletop
├── lgpd-dpo-encarregado       Designação Res. 18/2024 — divulgação + conflito de interesse
├── lgpd-dpa                   12 cláusulas mínimas para contrato com operador
├── lgpd-international-transfer Res. 19/2024 — Cláusulas-Padrão BR
├── lgpd-vendor-audit          Due diligence em operadores + tiering por risco
├── lgpd-audit-logging         Log imutável encadeado (hash chain) — accountability
├── lgpd-encryption-keys       TLS, TDE, KMS, crypto-shredding, Argon2id
├── lgpd-anonymization         k-anonymity, pseudonimização, vault de tokens
├── lgpd-retention-erasure     Hierarquia retenção legal × eliminação (Art. 18, VI)
├── lgpd-eca-digital-minors    Lei 15.211/2025 — verificação de idade, vinculação ao responsável
└── lgpd-legacy-retrofit       Discovery + gap analysis + plano priorizado (entrada Pipeline B)
```

## 📂 Living artifacts em `.lgpd/`

Tudo que as skills produzem fica versionado:

```
.lgpd/
├── STATUS.md              ← estado da auditoria + próximos passos
├── data-map.md            ← inventário de tratamentos
├── legal-basis.md         ← base legal por atividade
├── ROPA.md                ← registro consolidado (Art. 37)
├── RIPD/                  ← relatórios de impacto (Art. 38)
│   └── ripd-{slug}.md
├── consent/               ← schema do ledger
├── dsar/                  ← workflow + endpoints
├── incidents/             ← runbook + log 5 anos (Art. 10 Res. 15/2024)
│   └── log.md
├── policies/              ← política versionada
│   └── privacy-policy-v{N}.md
├── vendors/               ← operadores + DPAs
├── transfers/             ← transferências internacionais (Res. 19/2024)
├── encarregado.md         ← designação + publicação
├── eca-digital.md         ← se aplicável
└── gaps.md                ← não-conformidades priorizadas
```

Versione em Git, revise em PR, audite em retrospectiva.

## 🔑 Gatilhos

O Claude detecta automaticamente — você não precisa decorar nada. Exemplos que ativam:

| Frase | Skill |
|---|---|
| "veja como estamos de LGPD" | `lgpd-audit` |
| "nos deixe LGPD-seguros" | `lgpd-audit` |
| "audite LGPD do projeto" | `lgpd-audit` |
| "gap analysis LGPD" | `lgpd-legacy-retrofit` (via maestro) |
| "tivemos um incidente" | `lgpd-incident-response` |
| "precisamos comunicar a ANPD" | `lgpd-incident-response` |
| "preciso de uma RIPD" | `lgpd-ripd` |
| "consent ledger no Prisma" | `lgpd-consent-schema` |
| "endpoint de exclusão de conta" | `lgpd-dsar` |
| "política de privacidade" | `lgpd-privacy-policy` |
| "DPA com a AWS" | `lgpd-dpa` |
| "menores na plataforma" | `lgpd-eca-digital-minors` |

## 📚 Cobertura normativa

- **Lei nº 13.709/2018** (LGPD), com alterações da Lei nº 15.352/2026
- **Resolução CD/ANPD nº 2/2022** — Agentes de Tratamento de Pequeno Porte (ATPP)
- **Resolução CD/ANPD nº 4/2023** — Dosimetria de sanções
- **Resolução CD/ANPD nº 15/2024** — Comunicação de Incidentes de Segurança (3 dias úteis)
- **Resolução CD/ANPD nº 18/2024** — Encarregado pelo Tratamento
- **Resolução CD/ANPD nº 19/2024** — Cláusulas-Padrão Contratuais para Transferência Internacional
- **Resoluções CD/ANPD nº 30 e 31/2025** — Agendas regulatória e de fiscalização
- **Lei nº 15.211/2025** (ECA Digital) — em vigor desde 17/03/2026

Encode rígido das normas em [`lgpd-audit/references/normative-reference.md`](./lgpd-audit/references/normative-reference.md). As skills citam o artigo e a fonte sempre.

## 🛠️ Stack assumida

As skills assumem (sem exigir) uma stack moderna comum:

- **Next.js 14+** com App Router
- **Prisma + PostgreSQL**
- **Better Auth** (autenticação)
- **React Native + Expo** (mobile)
- **AWS / GCP** (cloud)
- **Datadog / Sentry** (observabilidade)
- **Stripe / Pagar.me** (pagamento)

Os exemplos de código vêm nessa stack, mas os princípios e templates funcionam em qualquer stack — só adapte a sintaxe.

## ⚠️ Disclaimer

**Este projeto não constitui aconselhamento jurídico.** As skills codificam boas práticas e o texto das normas conforme encode rígido na referência normativa, mas:

- Decisões sobre comunicação à ANPD devem envolver o Encarregado e jurídico
- Avaliação de fato de incidente notificável é caso a caso
- Cláusulas contratuais negociadas devem ser revisadas por advogado
- Resposta a fiscalização deve ser conduzida por especialista
- Texto da política de privacidade deve passar por revisão jurídica antes de publicar

**Consulte um(a) advogado(a) especializado em proteção de dados** para tomada de decisão jurídica concreta.

As próprias skills lembram disso nos pontos críticos — quando você pedir "isso é legal?" ou "vamos ser multados?", a resposta inclui essa recomendação.

## 🤝 Contribuindo

Issues e PRs muito bem-vindos! Especialmente:

- Correções de normas (ANPD publica resoluções com frequência)
- Templates adicionais (LIA por setor, RIPD para casos específicos)
- Stacks adicionais (Django, Rails, Spring Boot, Laravel)
- Traduções

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para detalhes.

## 📄 Licença

[MIT](./LICENSE). Use à vontade, inclusive comercialmente. Atribuição é apreciada mas não obrigatória.

---

Construído por [goul4rt](https://github.com/goul4rt).
Feedback, dúvidas e sugestões: abra uma issue.
