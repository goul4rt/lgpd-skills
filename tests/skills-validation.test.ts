import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = path.join(ROOT, "skills");

function parseFrontmatter(content: string, filePath: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(match, `Missing YAML frontmatter in ${filePath}`);
  const yamlBlock = match[1]!;
  const result: Record<string, string> = {};
  for (const line of yamlBlock.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const colonIdx = line.indexOf(":");
    assert.ok(colonIdx > 0, `Malformed frontmatter line "${line}" in ${filePath}`);
    const key = line.slice(0, colonIdx).trim();
    const rawVal = line.slice(colonIdx + 1).trim();
    result[key] = rawVal.replace(/^['"]|['"]$/g, "");
  }
  return result;
}

function collectMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".lgpd") {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

describe("Skills structure, frontmatters, links, and 5-agent manifests", () => {
  const skillDirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  it("discovers all 19 expected skills (1 maestro + 18 specialized)", () => {
    assert.equal(skillDirs.length, 19);
    assert.ok(skillDirs.includes("lgpd-audit"));
  });

  it("validates YAML frontmatter of every SKILL.md against Agent Skills spec", () => {
    for (const dirName of skillDirs) {
      const skillMdPath = path.join(SKILLS_DIR, dirName, "SKILL.md");
      assert.ok(existsSync(skillMdPath), `Missing SKILL.md in skills/${dirName}`);

      const content = readFileSync(skillMdPath, "utf8");
      const fm = parseFrontmatter(content, skillMdPath);

      assert.equal(
        fm.name,
        dirName,
        `Frontmatter name "${fm.name}" does not match directory "${dirName}"`,
      );
      assert.ok(fm.description && fm.description.length >= 40, `Description too short in ${dirName}`);
      assert.ok(
        fm.description.length <= 1024,
        `Description in ${dirName} exceeds 1024-char limit (${fm.description.length} chars)`,
      );
    }
  });

  it("resolves every relative markdown link and inline asset/reference path", () => {
    const mdFiles = collectMarkdownFiles(ROOT);
    assert.ok(mdFiles.length >= 25);

    const markdownLinkRegex = /\[[^\]]*\]\(([^)]+)\)/g;

    for (const mdFile of mdFiles) {
      const raw = readFileSync(mdFile, "utf8");
      // Strip fenced code blocks before checking links so template placeholders like
      // `([detalhes](./legal-basis.md))` inside `.lgpd/` markdown examples aren't treated as repo links
      const withoutCodeFences = raw.replace(/```[\s\S]*?```/g, "");

      let match: RegExpExecArray | null;
      while ((match = markdownLinkRegex.exec(withoutCodeFences)) !== null) {
        const target = match[1]!.trim();
        if (
          target.startsWith("http://") ||
          target.startsWith("https://") ||
          target.startsWith("#") ||
          target.startsWith("mailto:")
        ) {
          continue;
        }
        const cleanTarget = target.split("#")[0]!;
        if (!cleanTarget || cleanTarget.includes("{")) continue;

        const resolved = path.resolve(path.dirname(mdFile), cleanTarget);
        assert.ok(
          existsSync(resolved),
          `Broken relative link "${target}" in ${path.relative(ROOT, mdFile)} (expected ${resolved})`,
        );
      }

      // Also verify backtick references like `assets/foo.ext` or `references/bar.md` outside code blocks
      const inlineAssetRegex = /`((?:assets|references)\/[A-Za-z0-9._/-]+)`/g;
      while ((match = inlineAssetRegex.exec(withoutCodeFences)) !== null) {
        const relRef = match[1]!;
        if (relRef.endsWith("/")) continue;
        const resolved = path.resolve(path.dirname(mdFile), relRef);
        assert.ok(
          existsSync(resolved) && statSync(resolved).isFile(),
          `Orphan asset/reference "${relRef}" in ${path.relative(ROOT, mdFile)}`,
        );
      }
    }
  });

  it("keeps routing table, maestro pipelines, and README synchronized with all 18 sub-skills", () => {
    const routingMd = readFileSync(
      path.join(SKILLS_DIR, "lgpd-audit/references/skill-routing.md"),
      "utf8",
    );
    const maestroMd = readFileSync(path.join(SKILLS_DIR, "lgpd-audit/SKILL.md"), "utf8");
    const readmeMd = readFileSync(path.join(ROOT, "README.md"), "utf8");

    for (const dirName of skillDirs) {
      assert.ok(readmeMd.includes(dirName), `README.md is missing skill ${dirName}`);
      if (dirName === "lgpd-audit") continue;
      assert.ok(
        routingMd.includes(`\`${dirName}\``),
        `skill-routing.md is missing sub-skill ${dirName}`,
      );
      assert.ok(
        maestroMd.includes(dirName),
        `lgpd-audit/SKILL.md pipelines are missing sub-skill ${dirName}`,
      );
    }
  });

  it("validates all 5 agent manifests (Claude, Codex, Cursor, Gemini CLI, OpenCode) and version parity", async () => {
    const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8")) as {
      version: string;
      main: string;
      dependencies?: Record<string, string>;
    };
    const expectedVersion = pkg.version;
    assert.match(expectedVersion, /^\d+\.\d+\.\d+$/);
    assert.equal(
      pkg.dependencies,
      undefined,
      "package.json must keep zero runtime dependencies for clean OpenCode git plugin installs",
    );

    const claudePlugin = JSON.parse(
      readFileSync(path.join(ROOT, ".claude-plugin/plugin.json"), "utf8"),
    ) as { version: string };
    const claudeMarketplace = JSON.parse(
      readFileSync(path.join(ROOT, ".claude-plugin/marketplace.json"), "utf8"),
    ) as { plugins: Array<{ version: string; source: string }> };
    const codexPlugin = JSON.parse(
      readFileSync(path.join(ROOT, ".codex-plugin/plugin.json"), "utf8"),
    ) as { version: string; skills: string; interface: { logo: string } };
    const cursorPlugin = JSON.parse(
      readFileSync(path.join(ROOT, ".cursor-plugin/plugin.json"), "utf8"),
    ) as { version: string; skills: string };
    const geminiExt = JSON.parse(
      readFileSync(path.join(ROOT, "gemini-extension.json"), "utf8"),
    ) as { version: string };

    assert.equal(claudePlugin.version, expectedVersion);
    assert.equal(claudeMarketplace.plugins[0]?.version, expectedVersion);
    assert.equal(codexPlugin.version, expectedVersion);
    assert.equal(cursorPlugin.version, expectedVersion);
    assert.equal(geminiExt.version, expectedVersion);

    assert.ok(existsSync(path.resolve(ROOT, codexPlugin.skills)));
    assert.ok(existsSync(path.resolve(ROOT, codexPlugin.interface.logo)));
    assert.ok(existsSync(path.resolve(ROOT, cursorPlugin.skills)));

    // OpenCode dynamic plugin activation test
    const openCodeModuleUrl = pathToFileURL(path.resolve(ROOT, pkg.main)).href;
    const mod = (await import(openCodeModuleUrl)) as {
      LgpdSkillsPlugin: () => Promise<{
        config: (cfg: { skills?: { paths?: string[] } }) => Promise<void>;
      }>;
    };
    const plugin = await mod.LgpdSkillsPlugin();
    const cfg: { skills?: { paths?: string[] } } = {};
    await plugin.config(cfg);
    await plugin.config(cfg); // idempotency check
    assert.deepEqual(cfg.skills?.paths, [SKILLS_DIR]);
  });
});
