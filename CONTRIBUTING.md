# Contribuindo

Obrigado pelo interesse! Este projeto vive de contribuições da comunidade brasileira de privacy engineering, segurança e direito digital.

## Como contribuir

### 1. Reportando problemas

Abra uma issue. Tipos especialmente bem-vindos:

- **Imprecisão normativa** — citação errada, prazo desatualizado, resolução nova não coberta
- **Bug em template** — schema Prisma com erro, fluxo de DSAR quebrado, etc.
- **Gap de cobertura** — algum cenário comum que nenhuma skill resolve
- **Sugestão de melhoria** — fluxo mais natural, gatilho que falha, redação confusa

Use os labels: `bug`, `norma`, `template`, `enhancement`, `documentation`.

### 2. Pull requests

Para mudanças pequenas (typo, link quebrado, ajuste de redação): PR direto.

Para mudanças maiores (nova skill, mudança em arquitetura, refactor): abra uma issue primeiro para discussão.

#### Padrão de commit

Convencional commits:

```
feat(consent-schema): add LGPD Art. 14 parental consent fields
fix(dsar): correct 15-day SLA calculation for ATPP
docs(readme): clarify Pipeline B duration
chore(license): add MIT
```

#### Quando alterar uma skill

- Atualize o `description` no frontmatter se mudou o gatilho
- Mantenha PT-BR no corpo, EN no frontmatter
- Cite o artigo da lei ou resolução em toda recomendação nova
- Atualize o `references/normative-reference.md` se trouxer norma nova
- Teste com pelo menos um cenário real (use `.lgpd/` em um projeto seu)

#### Quando adicionar uma skill nova

- Crie `lgpd-{slug}/SKILL.md` seguindo o padrão das existentes
- Adicione assets em `lgpd-{slug}/assets/`
- Inclua a skill na tabela de roteamento em `lgpd-audit/references/skill-routing.md`
- Inclua no pipeline apropriado em `lgpd-audit/SKILL.md` se for parte do fluxo automático
- Atualize o README

## Diretrizes de conteúdo

### Sobre interpretação normativa

- **Fonte oficial sempre** — link para Planalto, ANPD, ou texto consolidado quando possível
- **Sem opinião sobre casos concretos** — skills dão informação e estrutura, não conselho jurídico
- **Distinção entre lei e prática** — quando a norma admite mais de uma leitura, deixar claro
- **Disclaimer ao final** — recomendação de consulta a advogado é obrigatória em pontos sensíveis

### Sobre código

- Stack base assumida: Next.js + Prisma + PostgreSQL + Better Auth + React Native (Expo)
- Para outras stacks, adicione exemplo em `assets/{stack}/` mantendo o template principal
- Código deve ser **executável**, não pseudocódigo — alguém deve conseguir copiar e adaptar

### Sobre tom

- PT-BR claro, sem juridiquês quando der pra evitar
- Linguagem técnica precisa, mas acessível pra eng não-especialista em privacidade
- Sem alarmismo nem minimização — riscos reais ditos em peso real

## Code of conduct

Seja respeitoso. Discordâncias técnicas e normativas são bem-vindas; ataques pessoais não.

## Licença das contribuições

Ao contribuir, você concorda em licenciar sua contribuição sob a mesma [MIT](./LICENSE) do projeto.
