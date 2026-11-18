#!/usr/bin/env bash
# Extract @lgpd: annotations from prisma/schema.prisma to seed data-map.md
# Usage: ./extract-prisma-annotations.sh prisma/schema.prisma > .lgpd/data-map-draft.md

set -euo pipefail

SCHEMA="${1:-prisma/schema.prisma}"

if [[ ! -f "$SCHEMA" ]]; then
  echo "Schema not found: $SCHEMA" >&2
  exit 1
fi

echo "# Data Map Draft — extracted from $SCHEMA"
echo
echo "**Generated**: $(date -Iseconds)"
echo

# Collect `/// @lgpd:...` annotations (standalone blocks and trailing field
# comments), then flush them onto the next model/field line. A buffer avoids
# leaking a preceding annotation onto an unrelated field.
awk '
  function annot(s,   p, t) {
    p = index(s, "///")
    if (p == 0) return ""
    t = substr(s, p)
    if (t !~ /^\/\/\/[[:space:]]*@lgpd:/) return ""
    return t
  }
  function flush(field,   j) {
    if (field == "") return
    for (j = 1; j <= np; j++) print "  - " field ": " pending[j]
    if (inline != "") print "  - " field ": " inline
    np = 0
    inline = ""
  }
  /^[[:space:]]*\/\/\/[[:space:]]*@lgpd:/ {
    line = $0
    sub(/^[[:space:]]*/, "", line)
    pending[++np] = line
    next
  }
  /^model[[:space:]]/ {
    model = $2
    print "\n## Model: " model
    for (j = 1; j <= np; j++) print "- " pending[j]
    np = 0
    next
  }
  /^[[:space:]]+[a-zA-Z_]+[[:space:]]+[A-Z]/ {
    inline = annot($0)
    flush($1)
    next
  }
  NF == 0 { next }
  { np = 0; inline = "" }
' "$SCHEMA"
