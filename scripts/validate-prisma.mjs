import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PRISMA_HEADER = `datasource db {
  provider = "postgresql"
  url      = "postgresql://postgres:postgres@localhost:5432/lgpd_test"
}

generator client {
  provider = "prisma-client-js"
}
`;

const SCHEMA_ASSETS = [
  "skills/lgpd-consent-schema/assets/consent-schema.prisma",
  "skills/lgpd-audit-logging/assets/audit-log.prisma",
  "skills/lgpd-retention-erasure/assets/retention.prisma",
];

const tempDir = mkdtempSync(path.join(tmpdir(), "lgpd-skills-prisma-"));

try {
  const prismaBin = path.join(
    ROOT,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "prisma.cmd" : "prisma",
  );

  const combinedParts = [PRISMA_HEADER];

  for (const relPath of SCHEMA_ASSETS) {
    const absPath = path.join(ROOT, relPath);
    const body = readFileSync(absPath, "utf8");
    combinedParts.push(`// --- Source: ${relPath} ---\n${body}`);

    const singleSchemaPath = path.join(tempDir, path.basename(relPath));
    writeFileSync(singleSchemaPath, `${PRISMA_HEADER}\n${body}`, "utf8");

    execFileSync(prismaBin, ["validate", "--schema", singleSchemaPath], {
      cwd: ROOT,
      stdio: "pipe",
      env: { ...process.env, PRISMA_HIDE_UPDATE_MESSAGE: "1" },
    });
    console.log(`✓ Prisma schema valid: ${relPath}`);
  }

  const unifiedSchemaPath = path.join(tempDir, "unified.prisma");
  writeFileSync(unifiedSchemaPath, combinedParts.join("\n\n"), "utf8");
  execFileSync(prismaBin, ["validate", "--schema", unifiedSchemaPath], {
    cwd: ROOT,
    stdio: "pipe",
    env: { ...process.env, PRISMA_HIDE_UPDATE_MESSAGE: "1" },
  });
  console.log("✓ Unified Prisma schema valid (zero model/enum collisions)");

  // Also test extract-prisma-annotations.sh against an annotated schema
  const annotatedFixturePath = path.join(tempDir, "annotated.prisma");
  writeFileSync(
    annotatedFixturePath,
    `/// @lgpd:activity=a001
/// @lgpd:purpose="autenticacao"
/// @lgpd:legal_basis="art_7_v"
model User {
  id    String @id @default(cuid())
  email String @unique /// @lgpd:pii=direct
}
`,
    "utf8",
  );

  const extractorPath = path.join(
    ROOT,
    "skills/lgpd-data-mapping/assets/extract-prisma-annotations.sh",
  );
  const extracted = execFileSync("bash", [extractorPath, annotatedFixturePath], {
    cwd: ROOT,
    encoding: "utf8",
  });

  if (!extracted.includes("## Model: User") || !extracted.includes("@lgpd:activity=a001")) {
    throw new Error("extract-prisma-annotations.sh failed to extract expected model annotations.");
  }
  console.log("✓ extract-prisma-annotations.sh verified");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
