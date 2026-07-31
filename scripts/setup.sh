#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# ZS-OKS Bootstrap — One script to set up everything
#   - Checks your machine, installs missing tools (correct versions),
#     configures VS Code, installs deps, verifies the build.
#   - Supports Linux (apt, dnf, pacman) and macOS (Homebrew).
# =============================================================================

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE_VERSION="$(cat "$REPO_DIR/.nvmrc")"

# ── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; NC='\033[0m' # No Color
info()  { echo -e "${CYAN}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
err()   { echo -e "${RED}[ERROR]${NC} $*"; }

# ── Header ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        ZS-OKS — Full Environment Setup                      ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ── OS Detection ──────────────────────────────────────────────────────────────
OS="$(uname -s)"
case "$OS" in
  Linux*)  OS="linux" ;;
  Darwin*) OS="macos" ;;
  *)       err "Unsupported OS: $OS"; exit 1 ;;
esac
info "Detected OS: $OS"

# ── Helper: install packages via system pkg manager ───────────────────────────
install_system_pkgs() {
  if command -v apt-get &>/dev/null; then
    sudo apt-get update -qq && sudo apt-get install -y -qq "$@"
  elif command -v dnf &>/dev/null; then
    sudo dnf install -y "$@"
  elif command -v pacman &>/dev/null; then
    sudo pacman -S --noconfirm "$@"
  elif command -v brew &>/dev/null; then
    brew install "$@"
  else
    warn "No known package manager found. Please install manually: $*"
  fi
}

# ── 1. Prerequisites ──────────────────────────────────────────────────────────
info "Checking prerequisites..."

MISSING=()
command -v git       &>/dev/null || MISSING+=("git")
command -v node      &>/dev/null || MISSING+=("node")
command -v npm       &>/dev/null || MISSING+=("npm")
command -v gh        &>/dev/null || MISSING+=("gh")
command -v docker    &>/dev/null || MISSING+=("docker")
command -v code      &>/dev/null || MISSING+=("code (VS Code CLI)")

if [ ${#MISSING[@]} -gt 0 ]; then
  warn "Missing tools: ${MISSING[*]}"
  info "Installing missing prerequisites..."

  for tool in "${MISSING[@]}"; do
    case "$tool" in
      "git")
        install_system_pkgs git
        ;;
      "node"|"npm")
        if command -v nvm &>/dev/null || [ -d "$HOME/.nvm" ]; then
          source "$HOME/.nvm/nvm.sh" 2>/dev/null || true
          nvm install "$NODE_VERSION"
        elif command -v fnm &>/dev/null; then
          fnm install "$NODE_VERSION"
        else
          if [ "$OS" = "macos" ]; then
            brew install node@"$NODE_VERSION"
          else
            curl -fsSL https://deb.nodesource.com/setup_"$NODE_VERSION".x | sudo -E bash -
            sudo apt-get install -y nodejs
          fi
        fi
        ;;
      "gh")
        install_system_pkgs gh
        ;;
      "docker")
        warn "Docker requires manual installation: https://docs.docker.com/get-docker/"
        warn "Skipping Docker for now."
        ;;
      "code (VS Code CLI)")
        warn "VS Code CLI required for extension installation."
        warn "Install VS Code from: https://code.visualstudio.com/download"
        ;;
    esac
  done
fi

# ── Verify Node version ───────────────────────────────────────────────────────
info "Checking Node.js version..."
CURRENT_NODE="$(node -v | sed 's/v//')"
MAJOR="${CURRENT_NODE%%.*}"
if [ "$MAJOR" != "$NODE_VERSION" ]; then
  warn "Node.js v$CURRENT_NODE detected, expected v$NODE_VERSION."
  if command -v nvm &>/dev/null || [ -d "$HOME/.nvm" ]; then
    source "$HOME/.nvm/nvm.sh" 2>/dev/null || true
    nvm use "$NODE_VERSION" 2>/dev/null || nvm install "$NODE_VERSION"
  fi
fi

# ── 2. GitHub CLI Login ────────────────────────────────────────────────────────
info "Checking GitHub CLI authentication..."
if ! gh auth status &>/dev/null; then
  info "Please log in to GitHub:"
  gh auth login --web -h github.com
fi

# ── 3. Install npm dependencies ───────────────────────────────────────────────
info "Installing npm dependencies..."
cd "$REPO_DIR"
npm ci

# ── 4. Copy .env.example → .env (if not exists) ──────────────────────────────
if [ ! -f "$REPO_DIR/.env" ]; then
  if [ -f "$REPO_DIR/.env.example" ]; then
    cp "$REPO_DIR/.env.example" "$REPO_DIR/.env"
    ok "Created .env from .env.example"
    warn "Edit .env to add your API keys"
  fi
fi

# ── 5. Install VS Code extensions ─────────────────────────────────────────────
info "Installing VS Code extensions..."
if command -v code &>/dev/null; then
  EXTENSIONS=$(python3 -c "
import json
with open('$REPO_DIR/.vscode/extensions.json') as f:
    data = json.load(f)
    for ext in data.get('recommendations', []):
        print(ext)
  " 2>/dev/null || node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$REPO_DIR/.vscode/extensions.json', 'utf8'));
data.recommendations.forEach(e => console.log(e));
  ")
  for ext in $EXTENSIONS; do
    code --install-extension "$ext" --force 2>/dev/null || true
  done
  ok "VS Code extensions installed"
else
  warn "code CLI not found — skipping extension install"
fi

# ── 6. Verify ─────────────────────────────────────────────────────────────────
info "Verifying setup..."
cd "$REPO_DIR"

echo ""
echo -e "${CYAN}── Running typecheck ──${NC}"
npm run typecheck 2>&1 && ok "TypeCheck passed" || warn "TypeCheck had issues"

echo ""
echo -e "${CYAN}── Running tests ──${NC}"
npm test 2>&1 && ok "All tests passed" || warn "Some tests failed"

echo ""
echo -e "${CYAN}── Running build ──${NC}"
npm run build 2>&1 && ok "Build succeeded" || warn "Build had issues"

# ── 7. Summary ────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  Setup Complete!                                           ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GREEN}✓${NC} Repository:    $REPO_DIR"
echo -e "  ${GREEN}✓${NC} Node.js:       $(node -v)"
echo -e "  ${GREEN}✓${NC} npm:           $(npm -v)"
echo -e "  ${GREEN}✓${NC} Dependencies:  installed"
echo -e "  ${GREEN}✓${NC} VS Code:       extensions installed"
echo ""
echo -e "  ${YELLOW}Next steps:${NC}"
echo -e "  1. Edit ${CYAN}.env${NC} — add your API keys"
echo -e "  2. Open VS Code: ${CYAN}code $REPO_DIR${NC}"
echo -e "  3. Run dev server: ${CYAN}npm run dev${NC}"
echo -e "  4. Configure GitHub secrets (see below)${NC}"
echo ""
echo -e "  ${YELLOW}GitHub secrets (set via gh CLI or GitHub UI):${NC}"
echo -e "  ${CYAN}gh secret set VERCEL_TOKEN${NC}"
echo -e "  ${CYAN}gh secret set VERCEL_ORG_ID${NC}"
echo -e "  ${CYAN}gh secret set VERCEL_PROJECT_ID${NC}"
echo -e "  ${CYAN}gh secret set DOCKER_HUB_TOKEN${NC}"
echo ""
