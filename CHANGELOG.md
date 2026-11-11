# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Versionamento segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

Revisão do ECA Digital conferida no texto da Lei nº 15.211/2025, no Decreto nº 12.880/2026 e no PDF do Guia ANPD v1.0 (out/2026).

### Corrigido
- **`consent-ledger.ts`**: o consentimento parental era exigido para qualquer menor de 18 (`isMinor`), o que rejeitava adolescentes. Agora `subjectAgeBand` (`CHILD` | `ADOLESCENT` | `ADULT`) aplica o Art. 14, § 1º só a crianças (< 12) e exige `guardianId` identificado, conforme o Enunciado CD/ANPD nº 1/2023.
- **`dsar-sla.ts`**: a faixa `ADOLESCENT_12_TO_15` incluía 16 anos. Foi renomeada para `ADOLESCENT_12_TO_16`, e `ADOLESCENT_16_TO_17` para `ADOLESCENT_17`. A leitura "até 16 anos inclusive" do Art. 24 está documentada.
- **`lgpd-eca-digital-minors`**:
  - Presunção de acesso provável: agora com as **8 categorias** do Guia, incluindo IA generativa e e-commerce de itens proibidos a menores. Saiu "mensageria/comunidades", que o Guia exclui de rede social.
  - Sinais de idade: descritos pelo texto do Decreto (Art. 25: gratuidade, sem data de nascimento, alternativa mais protetiva). Saíram os termos "dois níveis" e "sinais criptográficos", que não constam no Decreto.
  - Escopo do Art. 24 marcado como controvertido: o caput é amplo, mas o artigo está no Capítulo "Das Redes Sociais".
  - Relatório do Art. 31 deixa de ser atribuído só a lojas e sistemas operacionais.
- **`consent-schema.prisma`**: CPF do `Guardian` passa a ser opcional (minimização), entra `guardianUserId` (Art. 24) e `os_age_signal` deixa de contar como prova de responsabilidade legal.

### Adicionado
- **`lgpd-eca-digital-minors`**:
  - Teste cumulativo de acesso provável (Art. 1º, parágrafo único) e tratamento diferenciado do Art. 39, com a dispensa do § 1º.
  - Dever de manter mecanismo próprio além do sinal (Art. 14, parágrafo único; Decreto, Art. 26, § 3º) e responsabilidade solidária da cadeia (Art. 15).
  - Prevenção de uso compulsivo (Art. 8º; Decreto, Art. 9º) e vedação de dark patterns (Art. 18, § 2º; Decreto, Art. 10).
  - Alternativas para loot boxes (Decreto, Art. 23, § 1º), interação limitada em jogos (Art. 21) e monetização de conteúdo com menores (Art. 23; Decreto, Art. 34).
  - Canal de denúncia, retirada e contestação (Arts. 28–30), uso abusivo de denúncias (Arts. 32–33), comunicação à Polícia Federal (Decreto, Arts. 36–37), avaliação de impacto com resumo público (Art. 16, parágrafo único; Decreto, Art. 47), representante legal (Art. 40) e Art. 35, § 5º.
  - Cronograma da ANPD, com fiscalização a partir de janeiro/2027.
  - Template `.lgpd/eca-digital.md` reestruturado.
- **`consent-schema.prisma`**: modelo `AgeAssurance`, que guarda o resultado da aferição de idade (faixa, origem, método) e nunca o documento bruto (Art. 13).
- **`lgpd-retention-erasure`**: retenção do Art. 27, §§ 2º e 3º. **`lgpd-ripd`**: avaliação de impacto do ECA Digital.
- **Testes**: consentimento de adolescente sem consentimento parental; 8 categorias, teste cumulativo e mecanismo próprio; ordem do ECA Digital no maestro.

### Alterado
- **`lgpd-audit`**: o Passo 0 pergunta se o produto é direcionado a menores ou acessível por eles. A aplicabilidade do ECA Digital é triada no mapeamento (F1/L2), e `lgpd-eca-digital-minors` passa a rodar **antes** de `lgpd-consent-schema` (F5/L7a).
- **`normative-reference.md`**: seção do ECA Digital reescrita com os artigos da Lei e do Decreto, os Decretos nº 12.622/2025 e nº 12.881/2026 e três novas linhas na matriz de decisão.

## [1.3.0] - 2026-11-10

### Adicionado
- **Suíte automatizada de qualidade, regressão normativa e CI (`.github/workflows/ci.yml`)**:
  - Validação de frontmatters YAML, tamanho de `description`, links relativos, assets e sincronia dos manifests nos 5 agentes;
  - Testes de regressão normativa garantindo aderência às normas da ANPD até novembro de 2026;
  - Validação automatizada de schemas Prisma (`prisma validate`) e script `extract-prisma-annotations.sh`;
  - Implementações TypeScript estritas e testadas para *consent ledger* (`consent-ledger.ts`), *audit log* concorrente (`audit-log.ts`), criptografia de campos com rotação e *blind index* (`field-encryption.ts`) e cálculo de SLAs/disposição DSAR (`dsar-sla.ts`);
  - Trigger SQL real de proteção append-only para PostgreSQL (`consent-append-only.sql`) e schemas de retenção/outbox (`retention.prisma`, `audit-log.prisma`).
- **Atualizações normativas de 2026**:
  - **Resolução CD/ANPD nº 32/2026 (26/01/2026)**: primeira decisão de adequação brasileira reconhecendo União Europeia e EEE (Islândia, Liechtenstein e Noruega);
  - **Decreto nº 12.880/2026 (18/03/2026)** e **Guia Orientativo da ANPD para Fornecedores de Produtos ou Serviços de TI (28/10/2026)** no ECA Digital, incluindo sinais de idade e modulação de obrigações por papel/controle;
  - **Enunciado CD/ANPD nº 1/2023**: aplicabilidade de todas as bases legais dos Arts. 7º e 11 a crianças e adolescentes sob prevalência do melhor interesse;
  - **Deliberação CD/ANPD de setembro/2026 (Voto nº 11/2025/DIR-MW)**: arquivamento da minuta isolada do Guia de Tratamento de Dados Pessoais de Alto Risco para consolidação futura na regulamentação de RIPD.

### Alterado
- **Reposicionamento do projeto**: `LGPD Privacy Engineering Toolkit — AI-assisted privacy auditing, implementation and governance for software projects`, explicitando limites entre auditoria de repositório e conformidade jurídica/organizacional.
- **Orquestração (`lgpd-audit`)**:
  - *Fast-path* imediato para incidentes ativos antes de perguntas genéricas de discovery;
  - Correção da dependência circular: `lgpd-data-mapping` agora executa antes de `lgpd-legal-basis`;
  - `lgpd-dpo-encarregado` (incluindo rota de dispensa formal para ATPP de baixo risco com canal obrigatório — Res. 2/2022, Art. 11) executa antes da consolidação do `lgpd-ropa`.
- **Expansão de skills existentes**:
  - `lgpd-data-mapping`: cobertura explícita de cookies, pixels, SDKs mobile/web, telemetria e classificação do papel jurídico de cada terceiro (`Operador`, `Controlador Independente` ou `Controlador Conjunto`);
  - `lgpd-dsar`: tratamento de representantes legais, ex-funcionários/candidatos, canais informais e verificação proporcional de identidade;
  - `lgpd-ripd`: modelagem de ameaças LINDDUN, riscos de inferência, viés algorítmico e exposição em sistemas de IA/LLMs.

### Corrigido
- **Alto risco e larga escala**: removido o threshold automático inventado de `> 2 milhões de titulares`, aplicando o teste cumulativo multifatorial do Art. 4º da Res. CD/ANPD nº 2/2022 e diferenciando obrigação normativa de RIPD preventivo por boa prática.
- **ECA Digital (`lgpd-eca-digital-minors`)**: ajustado o escopo do Art. 9º, § 1º (verificação confiável a cada acesso voltada a conteúdos, produtos ou serviços impróprios, inadequados ou proibidos para menores de 18 anos).
- **DSAR para ATPP (`lgpd-dsar`)**: incluído o prazo de até 15 dias para declaração simplificada (Res. 2/2022, Art. 14, I) ao lado dos 30 dias para declaração completa, e corrigido o fundamento de retenção de logs DSAR (sem confundi-lo com o Art. 10 da Res. 15/2024 sobre incidentes).
- **DPA e responsabilidade (`lgpd-dpa`, `lgpd-vendor-audit`)**: identificadas as 12 cláusulas como checklist de boas práticas e precisada a responsabilidade solidária condicional do operador no Art. 42, § 1º, I da LGPD.
- **Retenção (`lgpd-retention-erasure`)**: contextualizada a conservação pós-contratual e detalhados documento específico, fundamento legal, prazo e marco inicial (*dies a quo*).
- **Implementações técnicas**:
  - `lgpd-consent-schema`: refatorado para modelo de eventos imutáveis (`ConsentEvent`) com `occurredAt`, `seq`, `rootConsentId` e todos os campos obrigatórios do Prisma;
  - `lgpd-audit-logging`: removido spread inválido de `req`/payload no Prisma, sanitizado `x-forwarded-for` para `@db.Inet` e adicionada serialização transacional (`pg_advisory_xact_lock` + `seq`) e verificação contra âncora externa;
  - `lgpd-encryption-keys`: corrigida a distinção entre criptografia de storage gerenciada pela nuvem e TDE nativo no PostgreSQL, e ampliados os handlers de extensão Prisma para cobrir leitura/escrita em lote, `update` e `upsert` com *keyring* versionado e *blind index* HMAC.

## [1.2.0] - 2026-05-30

### Adicionado
- **Distribuição multi-agente**: manifests nativos para Codex (`.codex-plugin/plugin.json`),
  Cursor (`.cursor-plugin/plugin.json`), Gemini CLI (`gemini-extension.json`) e OpenCode
  (`.opencode/plugins/lgpd-skills.js` + `package.json`).
- `skills/lgpd-audit/references/skill-activation.md` — como ativar sub-skills em cada agente.
- README: seção de instalação com o comando de cada um dos 5 agentes.

### Alterado
- **Reestruturação para o layout canônico agentskills.io**: skills movidas de
  `plugins/lgpd-skills/skills/` para `skills/` na raiz; o repo-raiz passa a ser o plugin.
  `marketplace.json` agora usa `source: "./"`. Instalação via Claude Code permanece igual.

## [1.1.1] - 2026-05-29

### Corrigido
- Adicionados 3 assets referenciados mas ausentes (referências órfãs que quebravam a skill ao rodar):
  - `lgpd-anonymization/assets/anonymization-recipes.md` (receitas SQL/Python)
  - `lgpd-dpa/assets/dpa-template.md` (template das 12 cláusulas Art. 39)
  - `lgpd-vendor-audit/assets/vendor-checklist.md` (checklist de due diligence)
- `lgpd-audit`: `description` enxugada (1023 → 768 chars) para folga sob o limite de 1024 da spec de skills

## [1.1.0] - 2026-05-29

### Adicionado
- Suporte a instalação como **plugin do Claude Code** via marketplace:
  `/plugin marketplace add goul4rt/lgpd-skills` + `/plugin install lgpd-skills@lgpd-skills`
- Manifests `.claude-plugin/marketplace.json` e `.claude-plugin/plugin.json`

### Alterado
- Skills reorganizadas sob `skills/` (auto-descobertas pelo plugin)
- README: instalação via plugin como opção recomendada; instalação manual mantida (`cp -r skills/lgpd-* ...`)

## [1.0.0] - 2026-05-28

### Adicionado
- 1 skill maestro: `lgpd-audit`
- 18 sub-skills cobrindo todo o ciclo de conformidade LGPD
- Pipelines A (Greenfield), B (Legacy retrofit), C (Híbrido), D (Incidente)
- Encode normativo rígido em `lgpd-audit/references/normative-reference.md`
- Templates para ROPA, RIPD, LIA, política de privacidade, notificações ANPD e a titulares
- Schemas Prisma para consent ledger, audit logging encadeado, Guardian/MinorLink (ECA Digital)
- Endpoints DSAR de referência para Next.js + Better Auth + React Native
- Cobertura: LGPD, Res. ANPD 2/2022, 4/2023, 15/2024, 18/2024, 19/2024, 30/2025, 31/2025
- Cobertura: Lei 15.211/2025 (ECA Digital) em vigor desde 17/03/2026
- README bilíngue (PT-BR principal + visão geral em EN)
- Licença MIT

[1.3.0]: https://github.com/goul4rt/lgpd-skills/releases/tag/v1.3.0
[1.2.0]: https://github.com/goul4rt/lgpd-skills/releases/tag/v1.2.0
[1.1.1]: https://github.com/goul4rt/lgpd-skills/releases/tag/v1.1.1
[1.1.0]: https://github.com/goul4rt/lgpd-skills/releases/tag/v1.1.0
[1.0.0]: https://github.com/goul4rt/lgpd-skills/releases/tag/v1.0.0
