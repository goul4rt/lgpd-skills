# app-com-vazamento

App Node/TypeScript **vulnerável de propósito**, para testar o `/lgpd-audit` em poucos minutos, gravar demos e conferir mudanças nas skills. Não é para produção e não precisa rodar: é só código plausível para a auditoria ler.

Os dados são todos falsos (CPF `123.456.789-09`, e-mails `@example.com`).

## Problemas plantados

| Arquivo | Problema |
|---|---|
| [`prisma/schema.prisma`](./prisma/schema.prisma) | `User.cpf` e `User.birthDate` sem anotação `@lgpd` e sem criptografia de campo. |
| [`src/auth/login.ts`](./src/auth/login.ts) | O `logger.info` do login grava `cpf` e `email` do usuário. |
| [`src/lib/analytics.ts`](./src/lib/analytics.ts) | `analytics.identify` envia CPF e e-mail ao Segment, um SDK de analytics de terceiro. |

Um login bem-sucedido deixa no log algo como:

```json
{"level":30,"userId":"cm3x0","cpf":"123.456.789-09","email":"maria@example.com","msg":"login ok"}
```

## Como rodar a auditoria

1. Instale o lgpd-skills no seu agente (veja [Instalação](../../README.md#-instalação)).
2. Abra o agente dentro de `examples/app-com-vazamento/`.
3. Peça `/lgpd-audit` (ou "faça um diagnóstico de LGPD deste projeto").

Os artefatos vão para `.lgpd/`, que já está no `.gitignore` do repositório.

Esta pasta não entra no pacote do plugin: `scripts/build-claude-directory.py` copia só o que está em `KEEP`.
