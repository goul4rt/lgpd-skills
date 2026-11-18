#!/usr/bin/env python3
"""Track lgpd-skills submissions to awesome lists, registries and directories.

Usage: python scripts/directory-submissions.py [status|check]
  status  print the tracker (default)
  check   query GitHub for each PR and persist merged/closed state
"""

import json
import subprocess
import sys
from pathlib import Path

DATA_FILE = Path(__file__).parent / "directory-submissions.json"
ICONS = {"merged": "🟣", "listed": "🟣", "submitted": "🟢", "ready_to_submit": "⏳",
         "todo": "⬜", "manual": "👤", "blocked_by_upstream": "🔒", "closed": "🔴"}


def load():
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def save(data):
    DATA_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def status(data):
    for i, item in enumerate(data, 1):
        print(f"{i:2}. {ICONS.get(item['status'], '?')} {item['name']} [{item['status']}]")
        if item.get("pr_url"):
            print(f"    {item['pr_url']}")
        if item.get("notes"):
            print(f"    {item['notes']}")


def check(data):
    changed = False
    for item in data:
        if not item.get("pr_url") or item["status"] != "submitted":
            continue
        res = subprocess.run(["gh", "pr", "view", item["pr_url"], "--json", "state"],
                             capture_output=True, text=True)
        if res.returncode:
            print(f"⚠️  {item['name']}: {res.stderr.strip()}")
            continue
        state = json.loads(res.stdout)["state"]
        print(f"{ICONS.get(state.lower(), '🟢')} [{state}] {item['name']}")
        if state in ("MERGED", "CLOSED"):
            item["status"] = state.lower()
            changed = True
    if changed:
        save(data)
        print("Tracker atualizado.")


if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "status"
    {"status": status, "check": check}.get(action, lambda _: print(__doc__))(load())
