---
name: lgpd-eca-digital-minors
description: Assess and implement obligations under Lei nº 15.211/2025 (ECA Digital), Decreto nº 12.880/2026, and ANPD's Oct 2026 Guide for IT Providers for digital products directed to or likely accessed by children and adolescents. Use when user mentions 'ECA Digital', 'menores', 'crianças e adolescentes', 'verificação de idade', 'sinais de idade', 'acesso provável', 'controle parental', or when the product may have users under 18. Modulates controls by ecosystem role (platform/OS, app/feature provider, community admin) and risk.
---

# ECA Digital — Lei nº 15.211/2025 e Decreto nº 12.880/2026

A **Lei nº 15.211/2025** entrou em vigor em **17 de março de 2026** e foi regulamentada pelo **Decreto nº 12.880, de 18 de março de 2026**, tendo a **ANPD** como autoridade administrativa central de regulamentação e fiscalização. Em **28 de outubro de 2026**, a ANPD publicou o **Guia Orientativo "Fornecedores de produtos ou serviços de tecnologia da informação: escopo e obrigações gerais do ECA Digital"**.

> **Monitoramento regulatório (novembro/2026):** o guia específico da ANPD sobre **mecanismos técnicos de aferição de idade** encontra-se em consolidação para publicação prevista até o fim de 2026. **Não trate minutas preliminares ou tomadas de subsídios como padrão técnico definitivo**; implemente controles proporcionais ao risco e preparados para consumir sinais de idade padronizados.

## 1. Escopo: direcionamento ou "acesso provável"

A lei alcança produtos ou serviços de TI (fornecidos à distância, por meio eletrônico e mediante solicitação individual) **direcionados** a crianças (< 12 anos) e adolescentes (12 a < 18 anos) **ou de acesso provável** por eles.

Conforme o Guia da ANPD de 28/10/2026:
- **Autodeclaração da empresa não vincula a ANPD**: escrever nos Termos de Uso que o serviço é "exclusivo para maiores de 18 anos" **não afasta o ECA Digital** se o produto apresentar elementos atrativos, cadastro sem barreiras proporcionais ou presença real de menores.
- **Presunção de atenção reforçada**: redes sociais, jogos eletrônicos, lojas de aplicativos, sistemas operacionais, mensageria/comunidades e plataformas de conteúdo adulto exigem avaliação imediata.
- **Software B2B corporativo fechado** (ex.: ERP interno com provisionamento via SSO empresarial sem acesso público ou infantojuvenil provável): documente a não aplicabilidade por ausência de direcionamento e de acesso provável.

## 2. Modulação por papel no ecossistema (Guia ANPD out/2026 + Dec. 12.880/2026)

As obrigações **não são uniformes** — variam conforme atividade, funcionalidades, porte, número de usuários e **capacidade técnica de interferência**:

| Papel do agente | Grau de controle | Obrigações típicas |
|---|---|---|
| **A. Plataforma base / SO / Loja de apps** (iOS, Android, consoles, grandes plataformas) | Alto (infraestrutura e distribuição) | Primeira camada de verificação e emissão de **sinais de idade** via API (Dec. 12.880/2026), bloqueio etário na distribuição, relatórios semestrais se > 1M menores no Brasil (Art. 31) |
| **B. Fornecedor de aplicação ou funcionalidade de TI** (SaaS consumer, app mobile, jogo, edtech) | Médio a Alto (produto próprio) | Consumir sinais de idade do SO/loja quando disponíveis, ajustar imediatamente UX/algoritmos/privacidade por padrão, aplicar verificação confiável onde houver conteúdo/serviço restrito a 18+ (Art. 9º, § 1º), supervisão/vinculação parental quando cabível, zero perfilamento publicitário |
| **C. Administrador de comunidade/canal em plataforma de terceiro** (ex.: servidor Discord, canal) | Limitado pelas APIs/regras da plataforma hospedeira | Configurar flags etárias nativas (NSFW/18+ onde aplicável), moderação ativa e canais de denúncia, não realizar coleta externa ou patrocínio segmentado a menores sem salvaguardas legais |

## 3. Obrigações materiais (sem generalizações indevidas)

### 3.1 Verificação de idade e sinais de idade (Art. 9º, § 1º + Decreto 12.880/2026)
- **Atenção ao texto exato do Art. 9º, § 1º**: a exigência de mecanismos confiáveis de verificação de idade **a cada acesso** (vedada a autodeclaração) incide sobre o acesso a **conteúdos, produtos ou serviços impróprios, inadequados ou proibidos para menores de 18 anos** (pornografia, apostas/jogos de azar, álcool, tabaco, armas, chat adulto etc.).
- **Não generalize indevidamente**: isso **não significa** exigir upload de documento oficial ou biometria facial a cada login em qualquer funcionalidade inócua de qualquer aplicativo (o que violaria o princípio da necessidade — Art. 6º, III LGPD — e a minimização na aferição etária).
- **Arquitetura de dois níveis (Dec. 12.880/2026)**: priorize sinais de idade criptográficos/preservadores de privacidade emitidos por sistemas operacionais, lojas de aplicativos ou provedores credenciados, aplicando verificação suplementar proporcional apenas nas rotas/funcionalidades de risco etário.
- **Vedação de desvio de finalidade**: dados coletados para aferir idade **jamais** podem ser reutilizados para perfilamento, marketing ou enriquecimento comercial.

### 3.2 Vinculação a responsável legal e supervisão parental (Arts. 17, 18 e 24)
- Para serviços abrangidos pelo **Art. 24**, contas de usuários de **até 16 anos** exigem vinculação à conta ou instrumento verificável do responsável legal (ver modelos `Guardian` e `MinorLink` em `lgpd-consent-schema`).
- Ferramentas de supervisão parental acessíveis (Arts. 17, § 4º e 18): gestão de tempo de uso, restrição de contato com desconhecidos, desativação de geolocalização precisa e controle de sistemas de recomendação.
- **Nota de coordenação com a LGPD**: a vinculação de supervisão do Art. 24 do ECA Digital não se confunde com a escolha da base legal da LGPD (que segue o Art. 14 + **Enunciado CD/ANPD nº 1/2023** — ver `lgpd-legal-basis`).

### 3.3 Privacidade por padrão e vedações absolutas
- **Configuração mais protetiva por padrão (*high privacy by default*)**: contas de menores iniciam privadas, sem indexação pública desnecessária e sem geolocalização aberta.
- **Vedação de perfilamento publicitário (Arts. 22 e 26)**: proibido construir perfis comportamentais de crianças e adolescentes para direcionamento comercial/publicitário (incluindo inferências grupais e ambientes de RA/RV).
- **Vedação de *loot boxes* (Art. 20)**: proibidas caixas de recompensa pagas/aleatórias em jogos direcionados a menores ou de acesso provável.
- **Remoção e notificação de ilícitos graves (Art. 27)**: dever de remoção célere e comunicação às autoridades competentes diante de indícios de exploração, abuso ou crimes contra crianças e adolescentes.
- **Relatórios semestrais em português (Art. 31)**: obrigatórios para provedores com **mais de 1.000.000 de usuários crianças ou adolescentes no Brasil**.

## 4. Sanções (Art. 35)
- Advertência, multa simples de **até 10% do faturamento do grupo econômico no Brasil** (ou R$ 10 a R$ 1.000 por usuário cadastrado, até R$ 50 milhões por infração), suspensão ou proibição de atividades.

## Workflow de engenharia

1. **Classificar aplicabilidade e papel**: produto fora de escopo (ex.: B2B estrito) vs. direcionado vs. acesso provável; papel A, B ou C.
2. **Mapear funcionalidades por faixa de risco etário**: separar funcionalidades gerais daquelas impróprias/proibidas para < 18 anos (Art. 9º, § 1º).
3. **Integrar sinais de idade / verificação proporcional**: consumir APIs de sinal etário de loja/SO (Dec. 12.880/2026) e exigir verificação reforçada (sem autodeclaração) apenas onde a lei/risco exigir, sem reter documentos brutos após validação.
4. **Implementar defaults protetivos e vinculação parental (até 16 anos)** quando aplicável.
5. **Bloquear pipelines de ad-tech/tracking comportamental** para sessões/contas sinalizadas como `< 18`.
6. **Auditar mecânicas de monetização/gamificação** (zero *loot boxes* se houver acesso provável de menores).
7. **Documentar avaliação e controles** em `.lgpd/eca-digital.md`.

## Template `.lgpd/eca-digital.md`

```markdown
# Avaliação ECA Digital — Lei nº 15.211/2025 e Decreto nº 12.880/2026

- **Aplicabilidade**: {Não aplicável (justificar ausência de acesso provável) | Aplicável — direcionado | Aplicável — acesso provável}
- **Papel do agente no ecossistema**: {Plataforma/SO | Fornecedor de aplicação/funcionalidade | Administrador de comunidade}
- **Data da avaliação**: {data} | **Próxima revisão**: {data + 6 meses}

## Mapeamento de risco etário por funcionalidade
| Funcionalidade | Contém material/serviço impróprio ou proibido < 18 (Art. 9º, § 1º)? | Mecanismo etário adotado |
|---|---|---|
| {ex.: Feed educacional} | Não | Consumo de sinal de idade da loja + defaults de alta privacidade |
| {ex.: Chat aberto / loja 18+} | Sim | Verificação confiável a cada acesso (vedada autodeclaração) |

## Controles implementados
- [ ] Consumo de sinais de idade / verificação proporcional (Dec. 12.880/2026): {detalhe}
- [ ] Vinculação a responsável legal até 16 anos (Art. 24): {implementado | N/A justificado}
- [ ] Supervisão parental e defaults de alta privacidade (Arts. 17–18): {detalhe}
- [ ] Bloqueio de perfilamento publicitário para < 18 (Arts. 22 e 26): {detalhe}
- [ ] Ausência de *loot boxes* (Art. 20): {confirmado | N/A}
- [ ] Relatório semestral (Art. 31 — > 1M usuários menores no BR): {Sim | N/A}

## Monitoramento normativo pendente
- Acompanhar publicação final do Guia de Aferição de Idade da ANPD para eventual calibração técnica.
```

## Status update

```markdown
## F6 / L7b — ECA Digital ✓ (ou N/A documentado)
- Aplicabilidade e papel: {resumo}
- Controles ativos: {lista}
- Pendências técnicas/jurídicas: {lista}
```
