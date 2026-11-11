import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = path.join(ROOT, "skills");

function readRepoFile(relPath: string): string {
  return readFileSync(path.join(ROOT, relPath), "utf8");
}

function collectSkillMarkdowns(dir: string): Array<{ rel: string; text: string }> {
  const out: Array<{ rel: string; text: string }> = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectSkillMarkdowns(full));
    } else if (entry.name.endsWith(".md")) {
      out.push({ rel: path.relative(ROOT, full), text: readFileSync(full, "utf8") });
    }
  }
  return out;
}

describe("Normative accuracy & orchestration regression suite (Nov/2026 baseline)", () => {
  const normativeRef = readRepoFile("skills/lgpd-audit/references/normative-reference.md");
  const allSkillMds = collectSkillMarkdowns(SKILLS_DIR);

  it("never prescribes '> 2 milhões' as an active high-risk or large-scale threshold", () => {
    for (const { rel, text } of allSkillMds) {
      assert.ok(
        !/Threshold[^.\n]*2\s*milh[oõ]es/i.test(text) && !/>\s*2\s*milh[oõ]es/i.test(text),
        `Found forbidden '> 2 milhões' threshold rule in ${rel}`,
      );
    }
    assert.match(normativeRef, /Voto nº 11\/2025\/DIR-MW/);
    assert.match(normativeRef, /arquivamento/i);
  });

  it("documents Resolução CD/ANPD nº 32/2026 (EU/EEA adequacy) and checks adequacy before SCCs", () => {
    const intlSkill = readRepoFile("skills/lgpd-international-transfer/SKILL.md");
    assert.ok(
      !/ainda não publicou/i.test(intlSkill),
      "lgpd-international-transfer must not claim ANPD has not published adequacy decisions",
    );
    assert.match(normativeRef, /Res\.\s*CD\/ANPD nº 32\/2026/);
    assert.match(intlSkill, /Resolução CD\/ANPD nº 32.*2026/);
    assert.match(intlSkill, /Islândia, Liechtenstein e Noruega/);
    const adequacyIdx = intlSkill.indexOf("Art. 33, I");
    const sccSectionIdx = intlSkill.indexOf("## Cláusulas-Padrão Contratuais brasileiras");
    assert.ok(
      adequacyIdx !== -1 && sccSectionIdx !== -1 && adequacyIdx < sccSectionIdx,
      "International transfer workflow must evaluate Art. 33, I adequacy decisions before SCCs",
    );
  });

  it("encodes ECA Digital nuances (Art. 9º § 1º scope, Decreto 12.880/2026, Oct 2026 IT Providers Guide)", () => {
    const ecaSkill = readRepoFile("skills/lgpd-eca-digital-minors/SKILL.md");
    assert.match(ecaSkill, /Decreto nº 12\.880/);
    assert.match(ecaSkill, /28 de outubro de 2026/);
    assert.match(ecaSkill, /impróprios, inadequados ou proibidos para menores de 18 anos/);
    assert.match(ecaSkill, /sinais de idade/i);
  });

  it("encodes the ANPD Guide's 8 presumed categories, cumulative likely-access test and own-mechanism duty", () => {
    const ecaSkill = readRepoFile("skills/lgpd-eca-digital-minors/SKILL.md");
    for (const text of [ecaSkill, normativeRef]) {
      assert.match(text, /intelig[eê]ncia artificial generativa|IA generativa/i);
      assert.match(text, /com[eé]rcio eletr[oô]nico|e-commerce/i);
      assert.match(text, /cumulativ/i);
      assert.match(text, /Art\. 14, parágrafo único/);
      assert.match(text, /Art\. 26, § 3º/);
    }
    // Private interpersonal messaging is NOT a presumed category (Guide, "Rede social").
    const presumedList = ecaSkill.slice(ecaSkill.indexOf("### 1.1"), ecaSkill.indexOf("### 1.2"));
    assert.doesNotMatch(presumedList, /^\d\.\s.*mensageria/im);
    // Obligations previously missing.
    for (const art of [/uso compulsivo/i, /Art\. 18, § 2º/, /Arts\. 28–30/, /Art\. 40/, /Art\. 47/, /Art\. 23, § 1º/]) {
      assert.match(ecaSkill, art);
    }
  });

  it("triages ECA Digital applicability at discovery and runs it before the consent ledger", () => {
    const maestro = readRepoFile("skills/lgpd-audit/SKILL.md");
    assert.match(maestro, /direcionado a menores de 18 anos ou pode ser acessado por eles/);
    const pipelineA = maestro.match(/### Pipeline A[\s\S]*?```text([\s\S]*?)```/)![1]!;
    assert.ok(
      pipelineA.indexOf("lgpd-eca-digital-minors") < pipelineA.indexOf("lgpd-consent-schema"),
      "ECA Digital must precede consent-schema (it defines Guardian/MinorLink and age assurance)",
    );
  });

  it("encodes Enunciado CD/ANPD nº 1/2023 and separates children (<12) from adolescents (12-17)", () => {
    const legalBasisSkill = readRepoFile("skills/lgpd-legal-basis/SKILL.md");
    assert.match(legalBasisSkill, /Enunciado CD\/ANPD nº 1\/2023/);
    assert.match(legalBasisSkill, /melhor interesse/i);
    assert.match(legalBasisSkill, /12 anos/);
    assert.match(legalBasisSkill, /adolescentes/i);
  });

  it("distinguishes ATPP simplified DSAR deadline (15d) from complete (30d) and avoids Res. 15/2024 Art. 10 confusion", () => {
    const dsarSkill = readRepoFile("skills/lgpd-dsar/SKILL.md");
    assert.match(dsarSkill, /Até 15 dias.*Art\. 14,\s*I/i);
    assert.match(dsarSkill, /Até 30 dias/i);
    assert.match(dsarSkill, /não cite o Art\. 10 da Resolução CD\/ANPD nº 15\/2024/i);
  });

  it("qualifies DPA 12-clause checklist as best practice and Art. 42 § 1º I joint liability as conditional", () => {
    const dpaSkill = readRepoFile("skills/lgpd-dpa/SKILL.md");
    const vendorSkill = readRepoFile("skills/lgpd-vendor-audit/SKILL.md");
    assert.match(dpaSkill, /checklist contratual de boas práticas/i);
    assert.match(dpaSkill, /Controlador Independente/);
    assert.match(dpaSkill, /Controlador Conjunto/);
    assert.match(
      dpaSkill,
      /descumprir as obrigações da legislação.*ou quando não tiver seguido as instruções lícitas/i,
    );
    assert.match(vendorSkill, /Art\. 42, § 1º, I/);
  });

  it("enforces correct orchestration order in lgpd-audit (emergency fast-path, mapping -> legal-basis, DPO -> ROPA)", () => {
    const maestro = readRepoFile("skills/lgpd-audit/SKILL.md");
    assert.match(maestro, /Fast-path para incidente ativo/i);

    // Extract Pipeline A block
    const pipelineAMatch = maestro.match(/### Pipeline A[\s\S]*?```text([\s\S]*?)```/);
    assert.ok(pipelineAMatch, "Missing Pipeline A block");
    const pipelineA = pipelineAMatch[1]!;

    const mapIdx = pipelineA.indexOf("lgpd-data-mapping");
    const legalIdx = pipelineA.indexOf("lgpd-legal-basis");
    const dpoIdx = pipelineA.indexOf("lgpd-dpo-encarregado");
    const ropaIdx = pipelineA.indexOf("lgpd-ropa");

    assert.ok(mapIdx !== -1 && legalIdx !== -1 && mapIdx < legalIdx, "data-mapping must precede legal-basis in Pipeline A");
    assert.ok(dpoIdx !== -1 && ropaIdx !== -1 && dpoIdx < ropaIdx, "dpo-encarregado must precede ropa in Pipeline A");
  });
});
