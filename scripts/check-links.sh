#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------------
# Local Markdown Link Checker
# ---------------------------
# Checks all markdown files in the repository for broken links.
# Uses the config at mlc_config.json instead of running in CI.
#
# Usage:
#   ./scripts/check-links.sh          # Check all markdown files
#   ./scripts/check-links.sh README.md # Check a single file
#
# Requires: Node.js (npx markdown-link-check)
# ------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
CONFIG="$REPO_DIR/mlc_config.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_file() {
  local file="$1"
  local rel="${file#$REPO_DIR/}"
  echo -e "${YELLOW}→ Checking: $rel${NC}"
  if npx --yes markdown-link-check "$file" --config "$CONFIG" --quiet 2>/dev/null; then
    echo -e "${GREEN}✓ OK${NC}"
    return 0
  else
    echo -e "${RED}✗ BROKEN LINKS: $rel${NC}"
    return 1
  fi
}

if [ $# -gt 0 ]; then
  # Check specific files passed as arguments
  failed=0
  for arg in "$@"; do
    check_file "$arg" || failed=1
  done
  exit $failed
fi

# Find all markdown files, excluding node_modules
echo -e "${YELLOW}Checking all markdown files in repository...${NC}"
echo ""

mapfile -t files < <(find "$REPO_DIR" -name '*.md' -not -path '*/node_modules/*' -not -path '*/dist/*' -not -path '*/.git/*' | sort)

total=${#files[@]}
failed=0
passed=0

for file in "${files[@]}"; do
  if check_file "$file"; then
    ((passed++))
  else
    ((failed++))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Results: ${GREEN}$passed passed${NC}, ${RED}$failed failed${NC}, $total total"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit $failed
