# Open Knowledge Studio — Agent Instructions

## Critical: You Work With a Solo Developer (No-Coder)

The person you work with is NOT a professional developer. They are a **solo creator** who:
- Does not understand technical jargon (TypeScript, npm, CI/CD, etc.)
- Needs everything explained in plain English with real-world analogies
- Wants step-by-step instructions, not high-level technical plans
- Needs verification and proof that things work, not assumptions
- Trusts you to be their technical partner — be worthy of that trust

### Communication Rules
| Don't Say | Say Instead |
|-----------|-------------|
| "Run `npm run typecheck`" | "Type this command to check the code: `npm run typecheck`" |
| "The type system..." | "The code checker..." |
| "Deploy to production" | "Push the app live for everyone to use" |
| Any unexplained acronym | Always expand + explain on first use |

**When in doubt, simpler is better. Explain WHY before HOW.**

## Repo constraints
- All work inside the repository directory. Setup scripts (`scripts/setup.sh` / `scripts/setup.ps1`) auto-configure paths.
- `opencode.jsonc` loads this file as instructions; permits `npm *`, `npx *`, `git status/diff/log/add` without confirmation; `git commit/push` requires approval.

## Commands (CI pipeline order: `npm ci` → `typecheck` → `test` → `build`; E2E on PRs only)
| Command | What It Does |
|---------|-------------|
| `npm install` | Download dependencies (only `react` + `react-dom` runtime deps) |
| `npm run dev` | Start dev server → http://localhost:3000 |
| `npm run typecheck` | TypeScript check (no output files) |
| `npm test` | Run all 227 automated tests (Vitest, happy-dom) |
| `npm test -- -t "pattern"` | Run a specific test file |
| `npm run test:e2e` | Run Playwright browser tests (chromium only) |
| `npm run test:coverage` | Run tests with coverage (thresholds: 80/75/85/80) |
| `npm run test:bench` | Run performance benchmarks |
| `npm run build` | Typecheck first, then build to `dist/` |
| `npm run analyze` | Build + bundle size treemap to `dist/stats.html` |
| `npm run preview` | Preview the production build locally |

## Paths & aliases
- `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)
- `.nvmrc`: Node.js 26; `.env.example` documents all API keys

## Architecture (Verified from source)
- **Frontend only** — everything runs in the browser, no backend server
- **Entrypoint**: `src/index.tsx` → `src/App.tsx` (1357 lines, main app component)
- **6-tier memory**: Session → Episodic → Semantic → Procedural → Working → Long-Term
- **10 AI providers**: Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama, OpenRouter, Cerebras, GitHub, Cloudflare
- **12 built-in agents**: Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian, Security Analyst, Code Reviewer, Planner, Tester, Code Generator, Knowledge Curator
- **CDN-loaded libraries**: Transformers.js, Orama, KaTeX, Mermaid, Leaflet (never install via npm)
- **Canonical types**: `src/types.ts` defines all shared types, providers, tools, knowledge sources
- **PWA**: `src/sw-register.ts` registers service worker for offline support
- **Theming**: 8 theme variants defined via CSS custom properties in `src/index.css`

## Key gotchas
- **Only `react` and `react-dom` as npm runtime dependencies.** All other libraries are CDN-loaded. Never add a third npm runtime dep.
- **Tailwind CSS v4**: No `tailwind.config.js`. Configured via `@import "tailwindcss"` in `src/index.css` + `@tailwindcss/vite` plugin in `vite.config.ts`.
- **`npm run build` runs typecheck first**: `tsc -b --noEmit && vite build`. Type errors will fail the build.
- **CSP connect-src** (`vite.config.ts:22`) must list every API domain the app calls. Add new API domains here.
- **API keys** come from `import.meta.env.VITE_*` or runtime Settings panel (stored in IndexedDB).
- **ESLint**: `@typescript-eslint/no-explicit-any` is **off**, `no-console` allows `warn`/`error`, unused vars are `warn` (with `_` prefix ignore).
- **Prettier**: single quotes, trailing commas, 120 print width, semicolons, lf line endings.
- **Vitest**: uses `happy-dom` environment, setup file at `src/test/setup.ts`, `fake-indexeddb` for IndexedDB mocking. Coverage thresholds: 80% statements, 75% branches, 85% functions, 80% lines.
- **E2E tests**: Playwright with chromium only. Run `npx playwright install chromium` before first run.
- **Cross-session memory**: `memoryApi.ts` exports `buildCrossSessionContext(agentId)` to aggregate memory across all sessions.
- **If docs conflict with source code, trust the source.**
- **Free resource catalog** at `docs/resources/000-free-resources.md`.
- **Brand guidelines** at `docs/project/006-brand-guidelines.md`.
- **Deployment**: Netlify (`netlify.toml`), Vercel (`vercel.json`), Docker (`docker-compose.yml` on port 8080), devcontainer (`.devcontainer/`).

## Documentation reference
- `docs/index.md` — Master table of contents
- `docs/llms.txt` — AI-readable documentation index
- `docs/_data/variables.yml` — Canonical project variables
- `docs/developers/000-quickstart.md` — 5-min setup
- `docs/developers/002-environment.md` — API keys guide
- `docs/architecture/000-index.md` — Architecture Decision Records
- `docs/api/000-index.md` — API reference
- `docs/guides/001-agents.md` — A2A agents guide
- `docs/operations/000-docs-ci-cd.md` — Docs publishing pipeline

## Skills
These are specialized abilities you can activate with `/skill`:

| Skill | When to Use | Location |
|-------|-------------|----------|
| **`/skill docs-manager`** | Documentation analysis, research, writing, publishing | `.opencode/skills/docs-manager/SKILL.md` |
| **`/skill developer`** | Full-stack dev, features, bugs, TDD, testing | `.opencode/skills/developer/SKILL.md` |

### How to Use Skills
1. The user asks for something (e.g., "build a search feature" or "update the docs")
2. Load the appropriate skill: `/skill docs-manager` or `/skill developer`
3. Follow the skill's workflow phases
4. Keep the user informed in plain English at every step

### Core Agents (always active)
- **Repository Maintainer** — keep everything organized, clean, and working
- **User's Technical Partner** — translate their ideas into working code
- **Quality Guardian** — never let code ship without testing
- **Documentation Steward** — ensure everything is documented for all skill levels

## Setup Script
New users run this after cloning:
```bash
./scripts/setup.sh      # Linux/macOS
# OR
.\scripts\setup.ps1     # Windows PowerShell
```
Checks the machine, installs missing tools, configures VS Code, and verifies everything works.