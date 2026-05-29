# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Versionamento segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

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
- Endpoints DSAR de referência para Next.js + Better Aut h + React Native
- Cobertura: LGPD, Res. ANPD 2/2022, 4/2023, 15/2024, 18/2024, 19/2024, 30/2025, 31/2025
- Cobertura: Lei 15.211/2025 (ECA Digital) em vigor desde 17/03/2026
- README bilíngue (PT-BR principal + visão geral em EN)
- Licença MIT

[1.1.1]: https://github.com/goul4rt/lgpd-skills/releases/tag/v1.1.1
[1.1.0]: https://github.com/goul4rt/lgpd-skills/releases/tag/v1.1.0
[1.0.0]: https://github.com/goul4rt/lgpd-skills/releases/tag/v1.0.0
