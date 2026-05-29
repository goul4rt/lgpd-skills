---
name: lgpd-encryption-keys
description: Configure encryption at rest, in transit, and key management aligned with LGPD Art. 46 (security duty) and the ANPD's Guia de Segurança da Informação para ATPP. Use when user asks 'criptografia LGPD', 'KMS', 'TDE', 'encryption at rest', 'rotação de chaves', 'pgcrypto', 'column-level encryption'. Tailored for Prisma/PostgreSQL/Better Auth stack.
---

# Encryption & Key Management

Art. 46 LGPD + Guia de Segurança da Informação para ATPP (ANPD, 2021).

## Camadas

### 1. Em trânsito
- **TLS 1.3** em toda comunicação (cliente ↔ servidor, serviço ↔ serviço)
- **HSTS** habilitado (`max-age=31536000; includeSubDomains; preload`)
- **Certificate pinning** em apps mobile (React Native — `react-native-ssl-pinning` ou equivalente)
- **mTLS** para comunicação entre serviços internos quando viável

### 2. Em repouso
- **TDE (Transparent Data Encryption)** no PostgreSQL — habilitado pelo provider (AWS RDS, GCP Cloud SQL)
- **Volume encryption** (EBS, persistent disks) — geralmente padrão hoje
- **Backups criptografados** — mesma chave do volume, ou KMS dedicado
- **Storage de arquivos** (S3, GCS): server-side encryption (SSE-KMS preferível a SSE-S3)

### 3. Nível de aplicação (campos sensíveis)
Para CPF, biometria, dados de saúde, tokens de auth — criptografia adicional em coluna:

```ts
// lib/crypto/field-encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const KEY = await loadKeyFromKMS(); // 32 bytes

export function encryptField(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", KEY, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

export function decryptField(encoded: string): string {
  const buf = Buffer.from(encoded, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}
```

Prisma extension para criptografia transparente:
```ts
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        if (args.data.cpf) args.data.cpf = encryptField(args.data.cpf);
        return query(args);
      },
      async findUnique({ args, query }) {
        const r = await query(args);
        if (r?.cpf) r.cpf = decryptField(r.cpf);
        return r;
      }
    }
  }
});
```

## KMS

Use KMS gerenciado (AWS KMS, GCP KMS, Azure Key Vault) ou HashiCorp Vault para chaves de aplicação.

- **Chaves separadas por finalidade** (PII identidade vs. PII financeiro vs. PII saúde)
- **Rotação anual** no mínimo (data key automática + master key manual)
- **Acesso por IAM com least privilege**
- **Log de uso da chave** (CloudTrail / equivalente)
- **Backup das chaves** (KMS já faz, mas atestar)

## Crypto-shredding

Para suportar Art. 18, VI (eliminação):
- Cada titular tem **uma chave de envelope** (encrypted by master key)
- Dados sensíveis cifrados com a chave do titular
- Eliminação = **deletar a chave do titular** no KMS
- Dado em repouso torna-se irrecuperável sem necessidade de varrer 100% do storage

Útil quando há retenção legal de outros campos mas o restante deve ser eliminável.

## Better Auth + senhas

Better Auth usa hash padrão (Argon2id ou bcrypt). Configure:
- Argon2id com memória ≥ 64MB, paralelismo 2, iterações ≥ 3
- OU bcrypt com cost ≥ 12

## Status update

```markdown
## F7 — Encryption ✓
- TLS 1.3 + HSTS confirmados
- TDE habilitado no Postgres
- KMS configurado com 3 chaves (identidade, financeiro, saúde)
- Crypto-shredding implementado para campos críticos
- Rotação anual em calendário
- Próximo: lgpd-retention-erasure
```

