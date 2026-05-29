---
name: lgpd-audit-logging
description: Design and implement immutable, hash-chained audit logging for accountability (LGPD Art. 6, X) and incident registration (Res. 15/2024 Art. 10, 5-year retention). Use when user asks 'audit log', 'log de auditoria', 'logging LGPD', 'accountability log', or as part of audit pipeline. Outputs schema + middleware patterns for Next.js.
---

# Audit Logging

Log imutável encadeado para prova de conformidade (Art. 6º, X — responsabilização) e registro de incidentes (Art. 10 Res. 15/2024 — 5 anos).

## Princípios

1. **Append-only** — sem updates nem deletes
2. **Hash chain** — cada entry referencia o hash da anterior (tamper-evident)
3. **Minimização** — log evento e hash do payload, NÃO o payload em claro
4. **PII out** — nunca logar PII completa (mascarar)
5. **Retenção** — mínimo 5 anos para eventos relacionados a incidentes; 6m+ para eventos correntes

## Eventos a logar

- Autenticação (login, logout, MFA, falhas)
- Acesso a dados pessoais (especialmente sensíveis)
- Mudanças em consentimento (grant, revoke)
- DSAR (recebimento, fulfillment, rejeição)
- Mudanças de configuração de privacidade
- Acesso administrativo a dados de outros usuários
- Exports e downloads em massa
- Mudanças em RBAC

## Schema Prisma

```prisma
model AuditLogEntry {
  id          String   @id @default(cuid())
  actorId     String?  // null se sistema
  actorType   ActorType
  action      String   // "READ", "WRITE", "DELETE", "EXPORT", "DSAR_FULFILLED", "CONSENT_REVOKED"
  resource    String   // "User:abc123", "Order:xyz"
  subjectId   String?  // titular afetado (se aplicável)
  legalBasis  String?
  purpose     String?
  ipAddress   String?  @db.Inet
  userAgent   String?
  payloadHash String   // SHA-256 do payload (sem PII)
  prevHash    String?  // hash do registro anterior
  selfHash    String   // SHA-256(prevHash || timestamp || action || resource || payloadHash)
  timestamp   DateTime @default(now())

  @@index([subjectId, timestamp])
  @@index([actorId, timestamp])
  @@index([action, timestamp])
}

enum ActorType { USER ADMIN SYSTEM OPERATOR }
```

## Middleware Next.js

```ts
// lib/audit.ts
import { createHash } from "crypto";
import { db } from "./db";

export async function logAudit(entry: {
  actorId?: string;
  actorType: ActorType;
  action: string;
  resource: string;
  subjectId?: string;
  legalBasis?: string;
  purpose?: string;
  payload?: object;
  req?: Request;
}) {
  const last = await db.auditLogEntry.findFirst({
    orderBy: { timestamp: "desc" },
    select: { selfHash: true }
  });

  const payloadHash = createHash("sha256")
    .update(JSON.stringify(entry.payload ?? {}))
    .digest("hex");

  const timestamp = new Date();

  const selfHash = createHash("sha256")
    .update(`${last?.selfHash ?? ""}|${timestamp.toISOString()}|${entry.action}|${entry.resource}|${payloadHash}`)
    .digest("hex");

  return db.auditLogEntry.create({
    data: {
      ...entry,
      payload: undefined,
      payloadHash,
      prevHash: last?.selfHash,
      selfHash,
      ipAddress: entry.req?.headers.get("x-forwarded-for") ?? null,
      userAgent: entry.req?.headers.get("user-agent") ?? null,
      timestamp
    }
  });
}
```

## Verificação de integridade

Script periódico que percorre todas as entries em ordem e verifica que cada `selfHash` bate. Qualquer divergência = tampering ou bug.

## Status update

```markdown
## F6 — Audit logging ✓
- Schema implementado
- Middleware ativo em rotas críticas
- Verificação de integridade agendada (semanal)
- Retenção configurada (5 anos para eventos críticos)
- Próximo: lgpd-encryption-keys
```

