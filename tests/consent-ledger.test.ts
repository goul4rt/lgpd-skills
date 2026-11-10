import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type ConsentEventCreateData,
  type ConsentEventRecord,
  type ConsentLedgerDb,
  extractValidIp,
  grantConsent,
  hasActiveConsent,
  recordPolicySupersession,
  revokeConsent,
} from "../skills/lgpd-consent-schema/assets/consent-ledger.ts";

function createInMemoryConsentLedger(): {
  db: ConsentLedgerDb;
  rows: ReadonlyArray<ConsentEventRecord>;
} {
  const rows: ConsentEventRecord[] = [];
  let nextSeq = 1n;

  const consentEvent = {
    async create({ data }: { data: ConsentEventCreateData }): Promise<ConsentEventRecord> {
      // Enforce Prisma non-nullable fields at runtime too
      assert.ok(data.subjectId, "subjectId required");
      assert.ok(data.purpose, "purpose required");
      assert.ok(data.policyVersionId, "policyVersionId required");
      assert.ok(data.evidenceHash, "evidenceHash required");
      assert.ok(data.channel, "channel required");
      assert.ok(data.occurredAt instanceof Date, "occurredAt Date required");

      const record: ConsentEventRecord = Object.freeze({
        id: `ce_${nextSeq.toString()}`,
        seq: nextSeq++,
        subjectId: data.subjectId,
        purpose: data.purpose,
        eventType: data.eventType,
        occurredAt: data.occurredAt,
        expiresAt: data.expiresAt ?? null,
        rootConsentId: data.rootConsentId ?? null,
        policyVersionId: data.policyVersionId,
        evidenceHash: data.evidenceHash,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        locale: data.locale ?? "pt-BR",
        channel: data.channel,
        uiSnapshot: data.uiSnapshot ?? null,
        isMinor: data.isMinor ?? false,
        parentalConsent: data.parentalConsent ?? null,
        guardianId: data.guardianId ?? null,
        propagatedTo: data.propagatedTo ?? null,
      });
      rows.push(record);
      return record;
    },

    async findFirst({
      where,
      orderBy,
    }: {
      where: { subjectId: string; purpose: string };
      orderBy: Array<{ occurredAt?: "asc" | "desc"; seq?: "asc" | "desc" }>;
    }): Promise<ConsentEventRecord | null> {
      const matching = rows.filter(
        (r) => r.subjectId === where.subjectId && r.purpose === where.purpose,
      );
      if (matching.length === 0) return null;

      matching.sort((a, b) => {
        for (const criterion of orderBy) {
          if (criterion.occurredAt) {
            const diff = a.occurredAt.getTime() - b.occurredAt.getTime();
            if (diff !== 0) return criterion.occurredAt === "desc" ? -diff : diff;
          }
          if (criterion.seq) {
            if (a.seq !== b.seq) {
              const cmp = a.seq < b.seq ? -1 : 1;
              return criterion.seq === "desc" ? -cmp : cmp;
            }
          }
        }
        return 0;
      });
      return matching[0] ?? null;
    },
  };

  return {
    rows,
    db: {
      consentEvent,
      async $transaction<T>(fn: (tx: { consentEvent: typeof consentEvent }) => Promise<T>) {
        return fn({ consentEvent });
      },
    },
  };
}

describe("Event-sourced Consent Ledger", () => {
  it("grants, revokes with full lineage/Prisma fields, and re-grants cleanly", async () => {
    const { db, rows } = createInMemoryConsentLedger();

    assert.equal(await hasActiveConsent(db, { subjectId: "usr_1", purpose: "marketing" }), false);

    const granted = await grantConsent(db, {
      subjectId: "usr_1",
      purpose: "marketing",
      policyVersionId: "pol_v1",
      evidence: {
        forwardedFor: "203.0.113.42, 10.0.0.5",
        userAgent: "Mozilla/5.0",
        channel: "WEB",
        uiSnapshot: "sha256:banner_v1",
      },
    });

    assert.equal(granted.ipAddress, "203.0.113.42");
    assert.equal(await hasActiveConsent(db, { subjectId: "usr_1", purpose: "marketing" }), true);

    const revocation = await revokeConsent(db, {
      subjectId: "usr_1",
      purpose: "marketing",
      evidence: { channel: "SETTINGS_PAGE" },
    });

    assert.equal(revocation.revoked, true);
    assert.equal(revocation.event?.rootConsentId, granted.id);
    assert.equal(revocation.event?.policyVersionId, "pol_v1");
    assert.equal(await hasActiveConsent(db, { subjectId: "usr_1", purpose: "marketing" }), false);

    // Second revoke is an idempotent no-op
    const secondRevoke = await revokeConsent(db, {
      subjectId: "usr_1",
      purpose: "marketing",
      evidence: { channel: "API" },
    });
    assert.equal(secondRevoke.revoked, false);
    assert.equal(rows.length, 2);

    // Re-grant creates a fresh active consent
    const regranted = await grantConsent(db, {
      subjectId: "usr_1",
      purpose: "marketing",
      policyVersionId: "pol_v1",
      evidence: { channel: "WEB" },
    });
    assert.equal(regranted.rootConsentId, null);
    assert.equal(await hasActiveConsent(db, { subjectId: "usr_1", purpose: "marketing" }), true);
  });

  it("never treats a revoked consent as active even when grant and revoke share the exact same millisecond", async () => {
    const { db } = createInMemoryConsentLedger();
    const sameInstant = new Date("2026-11-09T12:00:00.000Z");

    await grantConsent(db, {
      subjectId: "usr_race",
      purpose: "analytics",
      policyVersionId: "pol_v1",
      occurredAt: sameInstant,
      evidence: { channel: "COOKIE_BANNER" },
    });

    await revokeConsent(db, {
      subjectId: "usr_race",
      purpose: "analytics",
      occurredAt: sameInstant,
      evidence: { channel: "COOKIE_BANNER" },
    });

    assert.equal(
      await hasActiveConsent(db, { subjectId: "usr_race", purpose: "analytics", now: sameInstant }),
      false,
    );
  });

  it("enforces policy version supersession (Art. 8º, § 6º) and TTL expiration", async () => {
    const { db } = createInMemoryConsentLedger();
    const t0 = new Date("2026-01-01T00:00:00Z");
    const ttl = new Date("2026-06-01T00:00:00Z");

    await grantConsent(db, {
      subjectId: "usr_2",
      purpose: "personalization",
      policyVersionId: "pol_v1",
      occurredAt: t0,
      expiresAt: ttl,
      evidence: { channel: "SIGNUP" },
    });

    // Expired check
    assert.equal(
      await hasActiveConsent(db, {
        subjectId: "usr_2",
        purpose: "personalization",
        now: new Date("2026-06-02T00:00:00Z"),
      }),
      false,
    );

    // Before expiry, policy bump requiring reconsent invalidates old version
    assert.equal(
      await hasActiveConsent(db, {
        subjectId: "usr_2",
        purpose: "personalization",
        requiredPolicyVersionId: "pol_v2",
        now: new Date("2026-03-01T00:00:00Z"),
      }),
      false,
    );

    const superseded = await recordPolicySupersession(db, {
      subjectId: "usr_2",
      purpose: "personalization",
      newPolicyVersionId: "pol_v2",
      occurredAt: new Date("2026-03-02T00:00:00Z"),
    });
    assert.equal(superseded?.eventType, "SUPERSEDED");
    assert.equal(
      await hasActiveConsent(db, {
        subjectId: "usr_2",
        purpose: "personalization",
        now: new Date("2026-03-03T00:00:00Z"),
      }),
      false,
    );
  });

  it("requires parentalConsent=true when recording consent-based processing for children", async () => {
    const { db } = createInMemoryConsentLedger();

    await assert.rejects(
      () =>
        grantConsent(db, {
          subjectId: "child_1",
          purpose: "optional_feature",
          policyVersionId: "pol_v1",
          isMinor: true,
          parentalConsent: false,
          evidence: { channel: "MOBILE_RN" },
        }),
      /Art\. 14/,
    );

    const validChildGrant = await grantConsent(db, {
      subjectId: "child_1",
      purpose: "optional_feature",
      policyVersionId: "pol_v1",
      isMinor: true,
      parentalConsent: true,
      guardianId: "grd_123",
      evidence: { channel: "MOBILE_RN" },
    });
    assert.equal(validChildGrant.guardianId, "grd_123");
    assert.equal(extractValidIp("not-an-ip"), null);
  });
});
