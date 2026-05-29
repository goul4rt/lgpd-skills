---
name: lgpd-legal-basis
description: Choose and document the lawful basis (base legal) for each personal data processing activity under LGPD Art. 7 (common data) or Art. 11 (sensitive data). Use when the user is designing a new feature that processes personal data, reviewing an existing activity, asking "qual base legal usar", "consentimento ou legítimo interesse", "podemos coletar isso", or running an LGPD audit step. Produces `.lgpd/legal-basis.md` with one entry per activity. Always cite the article. Use whenever someone is about to write code that touches personal data.
---

# Base Legal LGPD

Decida e documente a base legal de **cada atividade de tratamento** antes de qualquer outra coisa. Sem base legal válida, o tratamento é ilícito (Art. 7º e Art. 11 LGPD).

## Árvore de decisão

```
O dado é sensível? (Art. 5º, II — saúde, biometria, religião, política, sindicato, sexualidade, raça, genético)
├── SIM → Art. 11
│   ├── Consentimento específico e destacado (Art. 11, I)
│   └── OU uma das 7 hipóteses sem consentimento (Art. 11, II):
│       (a) obrigação legal, (b) política pública, (c) pesquisa anonimizada,
│       (d) exercício regular de direitos, (e) proteção da vida,
│       (f) tutela da saúde por profissional, (g) prevenção a fraude / segurança em autenticação
│
└── NÃO → Art. 7º — 10 bases:
    I    consentimento (livre, informado, inequívoco, finalidade determinada)
    II   obrigação legal ou regulatória
    III  administração pública (políticas públicas)
    IV   pesquisa por órgão de pesquisa (anonimização sempre que possível)
    V    execução de contrato OU procedimentos pré-contratuais a pedido do titular
    VI   exercício regular de direitos em processo judicial/administrativo/arbitral
    VII  proteção da vida ou incolumidade física
    VIII tutela da saúde por profissional ou autoridade sanitária
    IX   legítimo interesse (Art. 10 — apoio/promoção de atividades, proteção do titular,
         estritamente necessário, transparência, sujeito a LIA e possível RIPD)
    X    proteção do crédito (bureaus, Serasa, SPC)
```

## Regras de ouro

1. **Legítimo interesse e execução de contrato NÃO valem para dados sensíveis.**
2. **Consentimento** deve ser específico por finalidade — não use "concordo com tudo".
3. **Marketing direto** → consentimento (Art. 7º, I) ou legítimo interesse com opt-out (Art. 7º, IX + Art. 10).
4. **Analytics agregada** → legítimo interesse OU anonimização (sai do escopo da LGPD).
5. **Pagamento e autenticação** → execução de contrato (Art. 7º, V).
6. **Prevenção a fraude** → Art. 11, II, g para sensíveis; Art. 7º, IX para comuns.
7. **Dados de crianças** → consentimento parental específico (Art. 14, § 1º) + ECA Digital se aplicável.

## Workflow

1. Para cada atividade de tratamento (input vindo de `lgpd-data-mapping`), preencha uma entrada no template abaixo.
2. Se a base for **legítimo interesse**, complete o LIA (Legitimate Interest Assessment) — ver `assets/lia-template.md`.
3. Se a finalidade mudar, base legal precisa ser reavaliada e titular informado (Art. 9º, § 2º).
4. Salve em `.lgpd/legal-basis.md` no formato do template.
5. Atualize `.lgpd/STATUS.md` ao concluir.

## Template — `.lgpd/legal-basis.md`

```markdown
# Bases Legais por Atividade de Tratamento

**Última atualização**: {data}

## Atividade: {nome curto}

- **Finalidade**: {específica, determinada — Art. 6º, I}
- **Dados tratados**: {lista}
- **Sensíveis?**: Sim / Não
- **Base legal**: Art. {7º/11} inciso {N} — {nome}
- **Justificativa**: {por que esta base e não outra}
- **LIA**: (se Art. 7º, IX) link para `.lgpd/lia/{slug}.md`
- **Retenção**: {prazo + critério}
- **Revogação possível?**: (consentimento = sim, outras = depende)
- **Última revisão**: {data}
```

## Cláusulas armadilha (revise sempre)

- "Consentimento" via checkbox pré-marcado → **inválido** (não é livre).
- "Concordo com tudo" como base única → **inválido** (não é específico).
- Legítimo interesse para dados sensíveis → **proibido**.
- "Aceitar para usar o serviço" para finalidades não essenciais → **inválido** (Art. 9º, § 2º).

Ao terminar, escreva uma seção em `.lgpd/STATUS.md`:

```markdown
## F1 — Legal basis ✓
- {N} atividades mapeadas
- {N} usam consentimento
- {N} usam legítimo interesse (LIA pendente: {lista})
- {N} usam execução de contrato
- Próximo: lgpd-data-mapping
```
