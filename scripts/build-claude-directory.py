#!/usr/bin/env python3
"""Build the Anthropic directory flavour of the plugin into OUT_DIR.

The directory only accepts Markdown/text/JSON/YAML/images from non-verified
publishers, so code assets (.ts, .prisma, .sql, .sh) are wrapped into
`<file>.md` fenced blocks and every `assets/<file>` reference is rewritten.

Usage: python3 scripts/build-claude-directory.py OUT_DIR
"""

import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KEEP = [".claude-plugin/plugin.json", "skills", "README.md", "LICENSE", "assets/icon.png", "assets/logo.png"]
ALLOWED = {".md", ".txt", ".json", ".yaml", ".yml", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico"}
LANG = {".ts": "typescript", ".prisma": "prisma", ".sql": "sql", ".sh": "bash"}


def build(out: Path):
    if out.exists():
        shutil.rmtree(out)
    for rel in KEEP:
        src, dst = ROOT / rel, out / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        (shutil.copytree if src.is_dir() else shutil.copy2)(src, dst)

    wrapped = []
    for f in sorted((out / "skills").rglob("*")):
        if f.is_file() and f.suffix.lower() not in ALLOWED:
            if f.suffix not in LANG:
                sys.exit(f"extensão sem mapeamento: {f.relative_to(out)}")
            code = f.read_text(encoding="utf-8")
            f.with_name(f.name + ".md").write_text(
                f"# {f.name}\n\nSalve o bloco abaixo como `{f.name}` no projeto antes de usar.\n\n"
                f"```{LANG[f.suffix]}\n{code.rstrip()}\n```\n", encoding="utf-8")
            f.unlink()
            wrapped.append(f.name)

    pattern = re.compile(r"(assets/)(" + "|".join(map(re.escape, wrapped)) + r")\b(?!\.md)")
    for md in [out / "README.md", *(out / "skills").rglob("*.md")]:
        text = md.read_text(encoding="utf-8")
        new = pattern.sub(r"\1\2.md", text)
        if new != text:
            md.write_text(new, encoding="utf-8")

    bad = [p for p in out.rglob("*") if p.is_file() and p.suffix.lower() not in ALLOWED and p.name != "LICENSE"]
    assert not bad, f"arquivos não permitidos: {bad}"
    print(f"ok: {len(wrapped)} assets embrulhados em .md → {out}")


if __name__ == "__main__":
    build(Path(sys.argv[1]).resolve())
