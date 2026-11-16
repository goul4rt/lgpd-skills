#!/usr/bin/env python3
"""
Workflow script to manage and track community submissions of lgpd-skills
to awesome lists, plugin registries, and skill directories.
"""

import json
import os
import subprocess
import sys
from pathlib import Path

SUBMISSIONS = [
    {
        "name": "Awesome Codex Plugins (HOL Registry)",
        "repo": "hashgraph-online/awesome-codex-plugins",
        "category": "Development & Workflow",
        "type": "pull_request",
        "status": "submitted",
        "pr_url": "https://github.com/hashgraph-online/awesome-codex-plugins/pull/732",
        "notes": "Direct response to issue #2. Centralized HOL scanner runs automatically."
    },
    {
        "name": "Awesome Privacy Engineering",
        "repo": "mplspunk/awesome-privacy-engineering",
        "category": "Data Deletion, Data Mapping, and DSAR",
        "type": "pull_request",
        "status": "submitted",
        "pr_url": "https://github.com/mplspunk/awesome-privacy-engineering/pull/30",
        "notes": "Covers data mapping, LINDDUN threat modeling, DSAR, and retention."
    },
    {
        "name": "Awesome OpenCode",
        "repo": "awesome-opencode/awesome-opencode",
        "category": "Plugins",
        "type": "pull_request",
        "status": "submitted",
        "pr_url": "https://github.com/awesome-opencode/awesome-opencode/pull/1052",
        "notes": "Lists lgpd-skills as an OpenCode plugin with .opencode integration."
    },
    {
        "name": "Awesome Brasil",
        "repo": "vinicius73/awesome-brasil",
        "category": "Javascript > Node.js",
        "type": "pull_request",
        "status": "submitted",
        "pr_url": "https://github.com/vinicius73/awesome-brasil/pull/41",
        "notes": "Brazilian open source repository list."
    },
    {
        "name": "Awesome Agent Skills (VoltAgent)",
        "repo": "VoltAgent/awesome-agent-skills",
        "category": "Specialized Domains",
        "type": "pull_request",
        "status": "submitted",
        "pr_url": "https://github.com/VoltAgent/awesome-agent-skills/pull/1427",
        "notes": "Production-grade multi-agent skills list for Claude, Codex, Gemini, Cursor."
    },
    {
        "name": "Awesome Claude Skills (travisvn)",
        "repo": "travisvn/awesome-claude-skills",
        "category": "Individual Skills",
        "type": "pull_request",
        "status": "submitted",
        "pr_url": "https://github.com/travisvn/awesome-claude-skills/pull/1442",
        "notes": "Community collection of Claude Code skills."
    },
    {
        "name": "Awesome Claude Code (hesreallyhim)",
        "repo": "hesreallyhim/awesome-claude-code",
        "category": "Security / Skills",
        "type": "issue_template",
        "status": "blocked_by_upstream",
        "pr_url": None,
        "notes": "Repository currently restricted to collaborators only. Can be submitted when restrictions are lifted."
    },
    {
        "name": "Awesome Cursor Rules (PatrickJS)",
        "repo": "PatrickJS/awesome-cursorrules",
        "category": "Security",
        "type": "pull_request",
        "status": "ready_to_submit",
        "pr_url": None,
        "notes": "Requires adding a .mdc rule to rules/ and listing in README.md."
    }
]

DATA_FILE = Path(__file__).parent / "directory-submissions.json"


def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def load_data():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return SUBMISSIONS


def cmd_status():
    data = load_data()
    print("=" * 80)
    print(f"📊 lgpd-skills Community Submissions Tracker ({len(data)} registries)")
    print("=" * 80)
    for idx, item in enumerate(data, 1):
        status_icon = "✅" if item["status"] == "submitted" else "⏳" if item["status"] == "ready_to_submit" else "🔒"
        print(f"\n{idx}. {status_icon} {item['name']} ({item['repo']})")
        print(f"   Category : {item['category']}")
        print(f"   Status   : {item['status']}")
        if item.get("pr_url"):
            print(f"   PR URL   : {item['pr_url']}")
        print(f"   Notes    : {item['notes']}")
    print("\n" + "=" * 80)


def cmd_check_prs():
    data = load_data()
    print("Checking live PR statuses via GitHub CLI...")
    for item in data:
        pr_url = item.get("pr_url")
        if not pr_url:
            continue
        try:
            res = subprocess.run(["gh", "pr", "view", pr_url, "--json", "state,title"], capture_output=True, text=True, check=True)
            info = json.loads(res.stdout)
            state = info.get("state")
            state_emoji = "🟢" if state == "OPEN" else "🟣" if state == "MERGED" else "🔴"
            print(f"{state_emoji} [{state}] {item['name']}: {pr_url}")
        except Exception as e:
            print(f"⚠️  Could not fetch status for {pr_url}: {e}")


def main():
    if not DATA_FILE.exists():
        save_data(SUBMISSIONS)

    action = sys.argv[1] if len(sys.argv) > 1 else "status"

    if action == "status":
        cmd_status()
    elif action == "check":
        cmd_check_prs()
    else:
        print("Usage: python directory-submissions.py [status|check]")


if __name__ == "__main__":
    main()
