import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { describe, it } from "node:test";
import {
  type AuditLogCreateData,
  type AuditLogDb,
  type AuditLogRecord,
  computeAuditSelfHash,
  logAudit,
  verifyAuditChain,
} from "../skills/lgpd-audit-logging/assets/audit-log.ts";

function createConcurrentAuditDb(): {
  db: AuditLogDb;
  entries: AuditLogRecord[];
} {
  const entries: AuditLogRecord[] = [];
  let nextSeq = 1n;

  // Simulates PostgreSQL pg_advisory_xact_lock queueing
  let lockChain: Promise<void> = Promise.resolve();

  const ALLOWED_PRISMA_COLUMNS = new Set([
    "actorId",
    "actorType",
    "action",
    "resource",
    "subjectId",
    "legalBasis",
    "purpose",
    "ipAddress",
    "userAgent",
    "payloadHash",
    "prevHash",
    "selfHash",
    "timestamp",
  ]);

  const db: AuditLogDb = {
    async $transaction<T>(fn: (tx: Parameters<AuditLogDb["$transaction"]>[0] extends (arg: infer U) => unknown ? U : never) => Promise<T>): Promise<T> {
      let releaseLock!: () => void;
      const acquireLock = async () => {
        const prev = lockChain;
        lockChain = new Promise<void>((resolve) => {
          releaseLock = resolve;
        });
        await prev;
      };

      let locked = false;
      try {
        return await fn({
          async $executeRawUnsafe(sql: string) {
            if (sql.includes("pg_advisory_xact_lock")) {
              await acquireLock();
              locked = true;
            }
          },
          auditLogEntry: {
            async findFirst() {
              // Random jitter to expose race conditions if lock were missing!
              await delay(Math.floor(Math.random() * 5));
              const last = entries[entries.length - 1];
              return last ? { seq: last.seq, selfHash: last.selfHash } : null;
            },
            async create({ data }: { data: AuditLogCreateData }) {
              // Strict Prisma column guard: throws if `req` or `payload` leaked into `data`!
              for (const key of Object.keys(data)) {
                assert.ok(
                  ALLOWED_PRISMA_COLUMNS.has(key),
                  `Unknown column "${key}" passed to prisma.auditLogEntry.create`,
                );
              }
              await delay(Math.floor(Math.random() * 5));
              const rec: AuditLogRecord = {
                id: `aud_${nextSeq.toString()}`,
                seq: nextSeq++,
                ...data,
              };
              entries.push(rec);
              return rec;
            },
          },
        });
      } finally {
        if (locked) releaseLock();
      }
    },
  };

  return { db, entries };
}

describe("Serialized Hash-Chained Audit Log", () => {
  it("strips req/payload cleanly, parses multi-hop IP, and preserves chain under 25 concurrent writes", async () => {
    const { db, entries } = createConcurrentAuditDb();

    const mockReq = {
      headers: new Map([
        ["x-forwarded-for", "198.51.100.77, 172.16.0.1"],
        ["user-agent", "TestAgent/1.0"],
      ]),
    };

    await Promise.all(
      Array.from({ length: 25 }, (_, idx) =>
        logAudit(db, {
          actorId: `usr_${idx}`,
          actorType: "USER",
          action: "DSAR_EXPORT",
          resource: `User:usr_${idx}`,
          subjectId: `usr_${idx}`,
          redactedMetadata: { idx, format: "json" },
          req: { headers: { get: (k) => mockReq.headers.get(k.toLowerCase()) ?? null } },
        }),
      ),
    );

    assert.equal(entries.length, 25);
    assert.equal(entries[0]?.ipAddress, "198.51.100.77");

    // Verify zero duplicate prevHashes (no chain forks)
    const prevHashes = new Set(entries.map((e) => e.prevHash));
    assert.equal(prevHashes.size, 25);

    const verification = verifyAuditChain(entries);
    assert.deepEqual(verification, { valid: true, checkedCount: 25 });
  });

  it("detects column tampering, row deletion, and privileged full-chain rewrite via external anchor", async () => {
    const { db, entries } = createConcurrentAuditDb();

    for (let i = 0; i < 4; i++) {
      await logAudit(db, {
        actorId: "admin_1",
        actorType: "ADMIN",
        action: `READ_${i}`,
        resource: "User:usr_99",
        subjectId: "usr_99",
      });
    }

    const externalWormAnchor = {
      seq: entries[3]!.seq,
      selfHash: entries[3]!.selfHash,
    };

    // 1. Mutate a single field -> detected
    const tamperedSingle = entries.map((e, i) =>
      i === 1 ? { ...e, action: "INNOCENT_ACTION" } : e,
    );
    const res1 = verifyAuditChain(tamperedSingle);
    assert.equal(res1.valid, false);
    assert.equal(res1.failedAtSeq, 2n);

    // 2. Delete row seq=2 -> detected via seq gap
    const deletedRow = entries.filter((e) => e.seq !== 2n);
    const res2 = verifyAuditChain(deletedRow);
    assert.equal(res2.valid, false);
    assert.match(res2.reason ?? "", /Sequence gap/);

    // 3. Privileged DB attacker alters seq=1 AND recomputes the entire chain -> caught by external anchor!
    const rewritten: AuditLogRecord[] = [];
    let prev = "GENESIS";
    for (const orig of entries) {
      const action = orig.seq === 1n ? "FORGED_ACTION" : orig.action;
      const selfHash = computeAuditSelfHash({
        prevHash: prev,
        timestampIso: orig.timestamp.toISOString(),
        actorType: orig.actorType,
        actorId: orig.actorId,
        action,
        resource: orig.resource,
        subjectId: orig.subjectId,
        payloadHash: orig.payloadHash,
      });
      rewritten.push({ ...orig, action, prevHash: prev, selfHash });
      prev = selfHash;
    }

    // Without external anchor, internal chain looks self-consistent:
    assert.equal(verifyAuditChain(rewritten).valid, true);
    // With external WORM/SIEM anchor, the full-chain rewrite is caught immediately:
    const res3 = verifyAuditChain(rewritten, externalWormAnchor);
    assert.equal(res3.valid, false);
    assert.match(res3.reason ?? "", /anchor mismatch/i);
  });
});
