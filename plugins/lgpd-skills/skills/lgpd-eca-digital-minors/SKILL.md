---
name: lgpd-eca-digital-minors
description: Implement obligations under Lei nº 15.211/2025 (ECA Digital), in force since 17 March 2026, for platforms accessed by minors or 'likely to be accessed' by them. Use when user mentions 'ECA Digital', 'menores', 'crianças e adolescentes', 'verificação de idade', 'controle parental', or when the project may have users under 18 (Discord, gaming, social media, education, content streaming). Covers age verification, parental linking, profiling ban, loot box ban, transparency reports.
---

# ECA Digital — Lei nº 15.211/2025

Em vigor desde **17 de março de 2026**. Fiscalizada pela ANPD (Decreto 12.622/2025). Aplicável a fornecedores direcionados a menores **OU de acesso provável** por eles — captura plataformas generalistas (Discord, redes sociais, jogos, lojas, sistemas operacionais).

## Quando aplica

Pergunte:
1. Há expectativa razoável de menores entre os usuários? (qualquer plataforma social, comunidade, educacional, jogos, conteúdo)
2. A faixa etária mínima nos termos é < 18?
3. Estatística de base indica presença de menores?

Se SIM em qualquer → ECA Digital aplica.

## Obrigações principais

### 1. Verificação de idade (Art. 9º, § 1º)
- Mecanismos confiáveis a **cada acesso**
- **Autodeclaração é vedada** explicitamente
- Métodos aceitáveis: documento de identidade, biometria com vendor especializado, validação por sistema operacional / loja de aplicativos, validação por responsável

### 2. Vinculação a responsável (Art. 24)
- Usuários **até 16 anos** vinculados à conta de responsável legal
- Responsável precisa autenticar e autorizar
- Schema sugerido: `Guardian` + `MinorLink` (já no `lgpd-consent-schema`)

### 3. Vedação de perfilamento publicitário (Arts. 22 e 26)
- Não criar perfis comportamentais de menores para fins publicitários
- Inclusive dados grupais e dados obtidos na verificação de idade
- Não usar RA/RV/realidade estendida para direcionar publicidade

### 4. Vedação de loot boxes (Art. 20)
- Jogos direcionados a menores ou de acesso provável: **vedadas** caixas de recompensa

### 5. Supervisão parental (Arts. 17, § 4º e 18)
- Limitação de tempo
- Controle de sistema de recomendação
- Restrição de funcionalidades sensíveis (geolocalização, contato com estranhos)

### 6. Relatórios de transparência (Art. 31)
- **Obrigatórios para plataformas com > 1.000.000 usuários menores no Brasil**
- Semestrais, em PT-BR
- Conteúdo: canais de denúncia, número de denúncias, moderação por tipo, identificação de contas infantis, aprimoramentos técnicos, métodos e resultados de avaliações de impacto

### 7. Remoção rápida de conteúdo ilícito (Art. 27)
- Comunicação obrigatória a autoridades
- Remoção imediata, independentemente de ordem judicial, para crimes contra crianças/adolescentes

## Sanções (Art. 35, II)
- Multa **até 10% do faturamento do grupo econômico no Brasil**
- OU R$ 10 a R$ 1.000 por usuário cadastrado
- Limite: R$ 50 milhões por infração
- Responsabilidade **solidária** de empresas brasileiras coligadas a fornecedores estrangeiros (§ 2º)

## Workflow

1. Avaliar aplicabilidade
2. Implementar verificação de idade
3. Implementar vinculação a responsável até 16 anos
4. Auditar pipelines de publicidade (zero perfilamento de menores)
5. Auditar jogos/gamificação (loot boxes)
6. Implementar controles parentais
7. Avaliar threshold de relatório semestral
8. Atualizar política de privacidade
9. Documentar em `.lgpd/eca-digital.md`

## Caso Discord / comunidade

Para um servidor Discord ou plataforma comunitária:
- Discord ToS exige 13+; ECA Digital captura adolescentes 13-17 com obrigação de vinculação a responsável até 16
- Verificação de idade real é tecnicamente difícil via API Discord — considerar:
  - Restrição etária explícita (18+) nos termos do servidor/comunidade
  - Verificação por handshake com responsável (DM + e-mail do responsável + confirmação)
  - Documentar limitações em RIPD
- Vedação de perfilamento publicitário: se vende patrocínio segmentado, não pode segmentar menores

## Template `.lgpd/eca-digital.md`

```markdown
# Aderência à Lei nº 15.211/2025 (ECA Digital)

**Aplicabilidade**: Sim — público inclui adolescentes
**Avaliação realizada em**: {data}
**Próxima revisão**: {data + 6 meses}

## Mecanismos implementados

- [x] Verificação de idade: {método}
- [x] Vinculação a responsável (até 16): {fluxo}
- [x] Vedação de perfilamento: pipelines de ads excluem flagged-minor
- [x] Controles parentais: {funcionalidades}
- [ ] Relatório semestral: N/A (< 1M usuários menores) | Sim — próximo em {data}

## Riscos residuais
{lista}

## Owner
Encarregado: {nome}
```

## Status update

```markdown
## F13 — ECA Digital ✓ (ou N/A)
- Aplicabilidade: {sim/não}
- Mecanismos: {lista}
- Pendências: {lista}
- Próximo: lgpd-vendor-audit
```

