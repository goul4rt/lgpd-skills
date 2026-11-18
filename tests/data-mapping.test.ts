import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = path.join(
  ROOT,
  "skills/lgpd-data-mapping/assets/extract-prisma-annotations.sh",
);

const FIXTURE = `generator client {
  provider = "prisma-client-js"
}

/// @lgpd: category=personal
/// Customer records
model Customer {
  id    Int    @id @default(autoincrement())
  /// @lgpd: pii=direct
  /// Full legal name
  cpf   String
  email String /// @lgpd:pii=direct
  address2 String /// @lgpd: category=location
  age   Int
}

model Order {
  id Int @id
  total Float
}
`;

function runExtractor(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "lgpd-prisma-"));
  try {
    const schema = path.join(dir, "schema.prisma");
    writeFileSync(schema, FIXTURE, "utf8");
    return execFileSync("bash", [SCRIPT, schema], { encoding: "utf8" });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("extract-prisma-annotations.sh field-level extraction", () => {
  const out = runExtractor();

  it("preserves a model annotation across an ordinary /// doc comment", () => {
    assert.match(out, /## Model: Customer\n- \/\/\/ @lgpd: category=personal/);
  });

  it("extracts an indented standalone annotation onto cpf", () => {
    assert.match(out, /- cpf: \/\/\/ @lgpd: pii=direct/);
  });

  it("extracts a trailing annotation onto email", () => {
    assert.match(out, /- email: \/\/\/ @lgpd:pii=direct/);
  });

  it("accepts field names containing digits (address2)", () => {
    assert.match(out, /- address2: \/\/\/ @lgpd: category=location/);
  });

  it("does not leak annotations into a later model without annotations", () => {
    const order = out.slice(out.indexOf("## Model: Order"));
    assert.doesNotMatch(order, /@lgpd:/);
  });
});
