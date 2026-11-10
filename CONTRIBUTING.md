# Contribuindo

Obrigado pelo interesse! Este projeto vive de contribuições da comunidade brasileira de privacy engineering, segurança da informação e direito digital.

## Como contribuir

### 1. Reportando problemas

Abra uma issue usando os labels `bug`, `norma`, `template`, `enhancement` ou `documentation`:

- **Imprecisão normativa** — citação desatualizada, nova resolução/enunciado/guia da ANPD, simplificação jurídica excessiva
- **Bug em implementação** — schema Prisma inválido, condição de corrida, falha de tipos nos módulos TypeScript
- **Gap de cobertura** — cenário relevante para projetos modernos de software ainda não coberto

### 2. Pull requests e verificações obrigatórias

Antes de abrir um PR, execute localmente toda a suíte de validação:

```bash
npm install
npm run check
```

O comando `npm run check` executa:
1. **Validação estrutural e multi-agente** (`skills-validation.test.ts`): frontmatters YAML, limite de 1024 caracteres em `description`, integridade de todos os links/assets e sincronia de versão nos 5 agentes;
2. **Suíte de regressão normativa** (`normative-regression.test.ts`): impede reintrodução de thresholds inventados ou referências revogadas/arquivadas;
3. **Checagem estrita de tipos** (`tsc --noEmit`);
4. **Validação de schemas Prisma** (`prisma validate`);
5. **Testes unitários e de concorrência** (`node --test`).

#### Padrão de commit (Conventional Commits)

```text
fix(normative): update international transfer with Res. CD/ANPD 32/2026
feat(consent-schema): refactor ledger to immutable ConsentEvent model
test(audit-logging): add concurrent hash-chain serialization test
```

#### Quando alterar ou criar uma skill

- Mantenha EN no frontmatter (`description <= 1024` caracteres) e PT-BR no corpo
- Cite sempre o dispositivo normativo exato e **separe obrigação legal expressa de boa prática/referência de engenharia**
- Atualize `skills/lgpd-audit/references/normative-reference.md` sempre que incorporar ato normativo novo
- Todo exemplo de código ou schema deve estar respaldado por arquivo executável/validado pela suíte de testes

## Governança de atualização normativa

A regulamentação da ANPD e do ECA Digital evolui continuamente. Mantemos revisão periódica da referência normativa contra publicações oficiais (DOU e portal gov.br/anpd):
- **Novas Resoluções ou Enunciados CD/ANPD**: revisão prioritária (P0) de `normative-reference.md` + testes de regressão;
- **Guias Orientativos e Tomadas de Subsídios**: identificar claramente o caráter orientativo (*soft law*) ou preliminar, sem converter minutas não aprovadas em obrigações legais automáticas.

## Diretrizes de conteúdo e tom

- **Fonte oficial sempre** — Planalto e portal da ANPD
- **Fronteira clara** — documente o que pode ser verificado no código vs. o que depende de validação jurídica/organizacional externa
- **Código real e testado** — nada de pseudocódigo que não compila ou omite campos obrigatórios do ORM

## Licença das contribuições

Ao contribuir, você concorda em licenciar sua contribuição sob a mesma licença [MIT](./LICENSE) do projeto.
