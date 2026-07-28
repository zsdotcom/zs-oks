---
title: "001 — Complete Setup Guide"
description: "Full prerequisites, installation steps, and troubleshooting for setting up the development environment"
category: "developers"
order: 1
tags: ["setup", "prerequisites", "installation", "troubleshooting"]
last_updated: "2026-07-28"
audience: "developers"
---

# 010 — Complete Setup & Installation

This guide covers everything needed to set up the Open Knowledge Studio development environment from scratch.

---

## 1. Prerequisites

### 1.1 Node.js v26

The project requires **Node.js v26.0.0 or higher** (tested on v26.5.0).

**Install via nvm (recommended):**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 26
nvm use 26
node --version   # Should show v26.x.x
```

**Install via direct download:**
1. Go to [nodejs.org](https://nodejs.org)
2. Download **Node.js 26.x** LTS
3. Run the installer

### 1.2 npm v11

npm ships with Node.js. Verify the version:

```bash
npm --version   # Should show 11.x.x
```

### 1.3 Git

```bash
git --version   # Should show v2.x.x
```

Download from [git-scm.com](https://git-scm.com) if not installed.

---

## 2. Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/zsdotcom/zs-oks.git
cd open-knowledge-studio
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all **devDependencies** (TypeScript, Vite, Vitest, Playwright, Tailwind CSS) and the only two **runtime dependencies** (`react` and `react-dom`).

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_client_id_here
```

> **Security:** Never commit your `.env` file — it is in `.gitignore`.

### Step 4: Verify Installation

```bash
npm run typecheck   # TypeScript type checking (should pass with 0 errors)
npm test            # 74 tests across 6 files (should all pass)
```

---

## 3. Running the Application

### Development Mode

```bash
npm run dev
```

Starts Vite dev server at `http://localhost:3000` (bound to `0.0.0.0`). Hot module reload is enabled.

### Production Build

```bash
npm run build       # tsc -b --noEmit && vite build → outputs to dist/
npm run preview     # Serves dist/ locally for testing
```

### Bundle Analysis

```bash
npm run analyze     # Builds with rollup-plugin-visualizer, generates dist/stats.html
```

---

## 4. Running Tests

| Command | Description |
| :--- | :--- |
| `npm test` | All unit + integration tests (74 cases) |
| `npm run test:watch` | Watch mode for development |
| `npm run test:coverage` | Generate V8 coverage report |
| `npm run test:bench` | Performance benchmarks (4 cases) |
| `npm run test:e2e` | Playwright E2E tests (7 spec files) |

---

## 5. Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors after pull

```bash
npm run typecheck
```

If errors persist, ensure you're on Node.js 26+.

### IndexedDB quota exceeded

Clear browser site data:
- **Chrome:** Settings → Privacy and security → Site settings → Clear data
- **Firefox:** Settings → Privacy & Security → Cookies and Site Data → Clear Data

### Google OAuth not working

1. Verify `VITE_GOOGLE_OAUTH_CLIENT_ID` is set in `.env`
2. Check the redirect URI in Google Cloud Console includes `http://localhost:3000`
3. Ensure the OAuth consent screen is configured

### Port 3000 already in use

```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

Or let Vite auto-assign the next available port.

### E2E tests fail

```bash
npx playwright install chromium
npm run test:e2e
```

### Vitest not found

Ensure you ran `npm install`. If the issue persists:

```bash
npm install --include=dev
```

---

## 6. Directory Structure

```
open-knowledge-studio/
├── src/
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Entry point
│   ├── components/          # React components
│   ├── db/                  # IndexedDB layer
│   │   └── indexedDB.ts     # 22 object stores, v2 schema
│   ├── services/            # Business logic (memory, AI, ICD-11, etc.)
│   ├── test/                # Test files (6 files, 74 tests)
│   └── types.ts             # TypeScript type definitions
├── docs/                    # Documentation
├── e2e/                     # Playwright E2E spec files (7 files)
├── .github/workflows/       # CI/CD (ci.yml, deploy.yml)
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
├── tsconfig.json            # TypeScript project references
├── tsconfig.app.json        # App TypeScript config (strict mode)
├── tsconfig.node.json       # Node tooling TypeScript config
├── .env.example             # Environment variable template
├── .nvmrc                   # Node.js version (26)
├── nginx.conf               # Docker nginx config
├── Dockerfile               # Docker build
└── package.json             # Only react + react-dom as runtime deps
```

---

## See Also

- [5-Minute Quick Start](000-quickstart.md) — Faster setup for experienced developers
- [Environment Variables](020-environment.md) — All VITE_* vars reference
- [Non-Coder Guide](030-non-coder-guide.md) — Step-by-step for non-developers
- [Development Guidelines](040-development.md) — Coding standards
- [Deployment Guide](090-deployment.md) — Docker, Vercel, Netlify

---

*Back to [Documentation Home](../index.md)*

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
