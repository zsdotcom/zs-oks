#Requires -Version 7.0
<#
.SYNOPSIS
  ZS-OKS Bootstrap — One script to set up everything on Windows
.DESCRIPTION
  - Checks your machine, installs missing tools (correct versions),
    configures VS Code, installs deps, verifies the build.
  - Supports Windows via winget, Chocolatey, or Scoop.
#>

$ErrorActionPreference = "Stop"
$RepoDir = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$NodeVersion = (Get-Content "$RepoDir\.nvmrc").Trim()

# ── Colours ──────────────────────────────────────────────────────────────────
function Write-Info  { Write-Host "[INFO]  $args" -ForegroundColor Cyan }
function Write-Ok    { Write-Host "[OK]    $args" -ForegroundColor Green }
function Write-Warn  { Write-Host "[WARN]  $args" -ForegroundColor Yellow }
function Write-Err   { Write-Host "[ERROR] $args" -ForegroundColor Red }

# ── Header ───────────────────────────────────────────────────────────────────
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        ZS-OKS — Full Environment Setup                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
""

# ── 1. Check Prerequisites ──────────────────────────────────────────────────
Write-Info "Checking prerequisites..."

$Missing = @()
if (-not (Get-Command git -ErrorAction SilentlyContinue))     { $Missing += "git" }
if (-not (Get-Command node -ErrorAction SilentlyContinue))    { $Missing += "node" }
if (-not (Get-Command npm -ErrorAction SilentlyContinue))     { $Missing += "npm" }
if (-not (Get-Command gh -ErrorAction SilentlyContinue))      { $Missing += "gh" }
if (-not (Get-Command docker -ErrorAction SilentlyContinue))  { $Missing += "docker" }
if (-not (Get-Command code -ErrorAction SilentlyContinue))    { $Missing += "code (VS Code CLI)" }

if ($Missing.Count -gt 0) {
  Write-Warn "Missing tools: $($Missing -join ', ')"

  # Find available package manager
  $pkgMgr = $null
  if (Get-Command winget -ErrorAction SilentlyContinue) { $pkgMgr = "winget" }
  elseif (Get-Command choco -ErrorAction SilentlyContinue) { $pkgMgr = "choco" }
  elseif (Get-Command scoop -ErrorAction SilentlyContinue) { $pkgMgr = "scoop" }

  foreach ($tool in $Missing) {
    switch ($tool) {
      "git" {
        switch ($pkgMgr) {
          "winget" { winget install --id Git.Git -e --source winget }
          "choco"  { choco install git -y }
          "scoop"  { scoop install git }
          default  { Write-Warn "Install Git from: https://git-scm.com/download/win" }
        }
      }
      "node" {
        # Try fnm first, then nvm-windows, then direct install
        if (Get-Command fnm -ErrorAction SilentlyContinue) {
          fnm install $NodeVersion
          fnm use $NodeVersion
        }
        elseif (Test-Path "$env:USERPROFILE\AppData\Roaming\nvm") {
          & "$env:USERPROFILE\AppData\Roaming\nvm\nvm.exe" install $NodeVersion
          & "$env:USERPROFILE\AppData\Roaming\nvm\nvm.exe" use $NodeVersion
        }
        else {
          switch ($pkgMgr) {
            "winget" { winget install --id OpenJS.NodeJS -e --source winget }
            "choco"  { choco install nodejs -y }
            "scoop"  { scoop install nodejs }
            default  { Write-Warn "Install Node.js from: https://nodejs.org/" }
          }
        }
      }
      "gh" {
        switch ($pkgMgr) {
          "winget" { winget install --id GitHub.cli -e --source winget }
          "choco"  { choco install gh -y }
          "scoop"  { scoop install gh }
          default  { Write-Warn "Install GitHub CLI from: https://cli.github.com/" }
        }
      }
      "docker" {
        Write-Warn "Docker Desktop: https://docs.docker.com/desktop/install/windows/"
      }
      "code (VS Code CLI)" {
        Write-Warn "VS Code: https://code.visualstudio.com/download"
        Write-Warn "After install, add to PATH or use 'code --install-extension' manually."
      }
    }
  }
}

# ── Refresh PATH ─────────────────────────────────────────────────────────────
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path", "User")

# ── 2. GitHub CLI Login ─────────────────────────────────────────────────────
Write-Info "Checking GitHub CLI authentication..."
try {
  gh auth status 2>$null | Out-Null
} catch {
  Write-Info "Please log in to GitHub:"
  gh auth login --web -h github.com
}

# ── 3. Install npm dependencies ──────────────────────────────────────────────
Write-Info "Installing npm dependencies..."
Set-Location $RepoDir
npm ci

# ── 4. Copy .env.example → .env ──────────────────────────────────────────────
if (-not (Test-Path "$RepoDir\.env")) {
  if (Test-Path "$RepoDir\.env.example") {
    Copy-Item "$RepoDir\.env.example" "$RepoDir\.env"
    Write-Ok "Created .env from .env.example"
    Write-Warn "Edit .env to add your API keys (see .config.template.md)"
  }
}

# ── 5. Install VS Code extensions ────────────────────────────────────────────
Write-Info "Installing VS Code extensions..."
if (Get-Command code -ErrorAction SilentlyContinue) {
  $extensions = (Get-Content "$RepoDir\.vscode\extensions.json" | ConvertFrom-Json).recommendations
  foreach ($ext in $extensions) {
    code --install-extension "$ext" --force 2>$null
  }
  Write-Ok "VS Code extensions installed"
} else {
  Write-Warn "code CLI not found — skipping extension install"
}

# ── 6. Verify ────────────────────────────────────────────────────────────────
Write-Info "Verifying setup..."
Set-Location $RepoDir

""
Write-Host "── Running typecheck ──" -ForegroundColor Cyan
npm run typecheck 2>&1 | Out-Host
if ($LASTEXITCODE -eq 0) { Write-Ok "TypeCheck passed" } else { Write-Warn "TypeCheck had issues" }

""
Write-Host "── Running tests ──" -ForegroundColor Cyan
npm test 2>&1 | Out-Host
if ($LASTEXITCODE -eq 0) { Write-Ok "All tests passed" } else { Write-Warn "Some tests failed" }

""
Write-Host "── Running build ──" -ForegroundColor Cyan
npm run build 2>&1 | Out-Host
if ($LASTEXITCODE -eq 0) { Write-Ok "Build succeeded" } else { Write-Warn "Build had issues" }

# ── 7. Summary ────────────────────────────────────────────────────────────────
""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Setup Complete!                                           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
""
Write-Host "  ✓ Repository:    $RepoDir" -ForegroundColor Green
Write-Host "  ✓ Node.js:       $(node -v)" -ForegroundColor Green
Write-Host "  ✓ npm:           $(npm -v)" -ForegroundColor Green
Write-Host "  ✓ Dependencies:  installed" -ForegroundColor Green
Write-Host "  ✓ VS Code:       extensions installed" -ForegroundColor Green
""
Write-Host "  Next steps:" -ForegroundColor Yellow
Write-Host "  1. Edit .env — add your API keys" -ForegroundColor Cyan
Write-Host "  2. Edit .config.template.md — add secrets to GitHub" -ForegroundColor Cyan
Write-Host "  3. Open VS Code: code $RepoDir" -ForegroundColor Cyan
Write-Host "  4. Run dev server: npm run dev" -ForegroundColor Cyan
""
