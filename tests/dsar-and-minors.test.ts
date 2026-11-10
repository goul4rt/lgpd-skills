import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateDsarSla,
  classifyMinorAgeRules,
  planErasureDisposition,
} from "../skills/lgpd-dsar/assets/dsar-sla.ts";

describe("DSAR SLAs (Standard vs. ATPP), Erasure Disposition & Minor Age Rules", () => {
  const t0 = new Date("2026-11-09T10:00:00.000Z");

  it("distinguishes Standard Controller SLAs from ATPP SLAs (Res. CD/ANPD nº 2/2022, Art. 14)", () => {
    const stdSimplified = calculateDsarSla({
      right: "CONFIRMATION_SIMPLIFIED",
      regime: "STANDARD",
      requestedAt: t0,
    });
    assert.equal(stdSimplified.immediate, true);
    assert.equal(stdSimplified.maxCalendarDays, 0);

    const atppSimplified = calculateDsarSla({
      right: "CONFIRMATION_SIMPLIFIED",
      regime: "ATPP",
      requestedAt: t0,
    });
    assert.equal(atppSimplified.immediate, false);
    assert.equal(atppSimplified.maxCalendarDays, 15);
    assert.match(atppSimplified.normativeBasis, /Art\. 14, I/);

    const stdComplete = calculateDsarSla({
      right: "ACCESS_COMPLETE",
      regime: "STANDARD",
      requestedAt: t0,
    });
    assert.equal(stdComplete.maxCalendarDays, 15);

    const atppComplete = calculateDsarSla({
      right: "ACCESS_COMPLETE",
      regime: "ATPP",
      requestedAt: t0,
    });
    assert.equal(atppComplete.maxCalendarDays, 30);

    const revoke = calculateDsarSla({
      right: "CONSENT_REVOCATION",
      regime: "ATPP",
      requestedAt: t0,
    });
    assert.equal(revoke.immediate, true);
  });

  it("plans hard delete vs. selective statutory blocking with backup tombstone", () => {
    const now = new Date("2026-11-09T00:00:00Z");

    const fullDelete = planErasureDisposition(
      [
        {
          documentType: "Marco Civil Access Log",
          statutoryBasis: "Lei 12.965/2014 Art. 15",
          retainUntil: new Date("2026-05-01T00:00:00Z"), // already expired
          requiredFields: ["ipAddress", "accessTimestamp"],
        },
      ],
      now,
    );
    assert.equal(fullDelete.mode, "HARD_DELETE");
    assert.equal(fullDelete.recordSuppressionTombstone, true);

    const blocked = planErasureDisposition(
      [
        {
          documentType: "NF-e",
          statutoryBasis: "CTN Art. 173, I",
          retainUntil: new Date("2032-01-01T00:00:00Z"),
          requiredFields: ["cpf", "fullName", "invoiceXml"],
        },
        {
          documentType: "Marco Civil Access Log",
          statutoryBasis: "Lei 12.965/2014 Art. 15",
          retainUntil: new Date("2027-03-01T00:00:00Z"),
          requiredFields: ["ipAddress"],
        },
      ],
      now,
    );
    assert.equal(blocked.mode, "BLOCK_AND_MINIMIZE");
    assert.deepEqual(blocked.retainedFields, ["cpf", "fullName", "invoiceXml", "ipAddress"]);
    assert.equal(blocked.retainUntil?.toISOString(), "2032-01-01T00:00:00.000Z");
    assert.equal(blocked.recordSuppressionTombstone, true);
  });

  it("applies Enunciado CD/ANPD nº 1/2023 and ECA Digital Art. 24 across minor age bands", () => {
    // Child (< 12) processed under legal obligation / health tutelage (NOT consent)
    const childNonConsent = classifyMinorAgeRules(9, false);
    assert.equal(childNonConsent.band, "CHILD_UNDER_12");
    assert.equal(childNonConsent.requiresBestInterestAssessment, true);
    assert.equal(childNonConsent.requiresSpecificParentalConsentUnderArt14, false);
    assert.equal(childNonConsent.adProfilingProhibited, true);

    // Child (< 12) processed under consent -> requires Art. 14, § 1º parental consent
    const childConsent = classifyMinorAgeRules(9, true);
    assert.equal(childConsent.requiresSpecificParentalConsentUnderArt14, true);

    // Adolescent 14y -> up to 16 requires ECA Digital Art. 24 guardian link where applicable
    const teen14 = classifyMinorAgeRules(14, false);
    assert.equal(teen14.band, "ADOLESCENT_12_TO_15");
    assert.equal(teen14.requiresBestInterestAssessment, true);
    assert.equal(teen14.requiresEcaDigitalGuardianLinkIfApplicable, true);
    assert.equal(teen14.adProfilingProhibited, true);

    // Adolescent 17y -> best interest + ad profiling ban apply, Art. 24 up-to-16 link does not
    const teen17 = classifyMinorAgeRules(17, false);
    assert.equal(teen17.band, "ADOLESCENT_16_TO_17");
    assert.equal(teen17.requiresBestInterestAssessment, true);
    assert.equal(teen17.requiresEcaDigitalGuardianLinkIfApplicable, false);
    assert.equal(teen17.adProfilingProhibited, true);

    // Adult 18+
    const adult = classifyMinorAgeRules(18, true);
    assert.equal(adult.band, "ADULT_18_PLUS");
    assert.equal(adult.adProfilingProhibited, false);
  });
});
