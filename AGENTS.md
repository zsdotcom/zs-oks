# Open Knowledge Studio — Agent Instructions

## Repo constraints
- All work stays inside project root `/home/codeandbrain/open-knowledge-studio`.
- `opencode.jsonc` loads this file as instructions and permits `npm *`, `npx *`, `git status/diff/log/add` without confirmation.

## Commands (in order of use)
| Command | What it does |
|---------|-------------|
| `npm install` | Install deps (only react + react-dom at runtime) |
| `npm run dev` | Vite dev server on `http://localhost:3000`, bound `0.0.0.0` |
| `npm run typecheck` | `tsc -b --noEmit` — run before build |
| `npm test` | Vitest — 74 tests across 6 files in `src/test/` |
| `npm run test:e2e` | Playwright (7 spec files in `e2e/`) |
| `npm run test:coverage` | Vitest with V8 coverage (thresholds: 80/75/85/80) |
| `npm run build` | `tsc -b --noEmit && vite build` (outputs to `dist/`) |
| `npm run analyze` | `ANALYZE=true npm run build` — generates `dist/stats.html` |
| `npm run preview` | Serve `dist/` locally |

CI order (`ci.yml`): `typecheck` → `test` → `build`. E2E runs only on PRs. Deploy (`deploy.yml`) sets `BASE_PATH=/open-knowledge-studio/` and copies `index.html` to `404.html` for SPA routing.

## Paths & aliases
- `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)
- `tsconfig.json` is a project-reference root; `tsconfig.app.json` is the real app config, `tsconfig.node.json` covers vite/vitest/playwright config files
- `.nvmrc` specifies Node 26

## Architecture facts
- Single-page React 19 app, zero backend. All state in React + IndexedDB.
- `src/services/memoryApi.ts` wraps `src/db/indexedDB.ts` (22 object stores, v2) with 6-tier memory API. `computeEmbedding()` uses Transformers.js in a Web Worker.
- CDN deps loaded from `index.html`: KaTeX 0.18.1, Mermaid 11.16.0 (jsdelivr), Leaflet 1.9.4 (unpkg).
- Transformers.js and Orama JS are dynamically loaded from jsdelivr CDN in Workers/lazy imports — never installed via npm.
- Several panels are `React.lazy()` loaded: `A2AMetricsDashboard`, `GoogleWorkspacePanel`, `SettingsPanel`, `MCPServerPanel`, `WorkspaceDocumentEditor`.
- 25 components (13 direct + 5 lazy + 2 re-export aliases + 1 chart dir + 1 icon shim).
- 13 services: `connectorService`, `embeddingWorker`, `geminiService`, `githubAuthService`, `googleAuthService`, `icd11Service`, `memoryApi`, `oramaService`, `publicApiService`, `sandboxService`, `searchService`, `skillService`, `webhookService`.
- 84 documentation files across 12 sections in `docs/` (see `docs/index.md` for full index).

## Key gotchas
- **Path alias `@/`** maps to `src/`. Import from `@/types`, `@/components/...`, etc.
- **Only 2 npm runtime deps**: `react` and `react-dom`. Never add another. All other libs (Transformers.js, Orama, KaTeX, Mermaid, Leaflet) come from CDN.
- **API keys** come from `import.meta.env.VITE_*` env vars and are also configurable at runtime via Settings panel (stored in IndexedDB). `.env.example` documents all vars.
- **Google OAuth** (`src/services/googleAuthService.ts`) loads GIS script from CDN dynamically. Requires `VITE_GOOGLE_OAUTH_CLIENT_ID`.
- **GitHub OAuth** (`src/services/githubAuthService.ts`) uses device flow for authentication. Requires `VITE_GITHUB_OAUTH_CLIENT_ID`.
- **If docs conflict with source code**, trust the source.
- **Benchmarks** write to `benchmark-results.json` (gitignored).

## Testing quirks
- Test environment: `happy-dom` with `fake-indexeddb/auto`
- Setup file `src/test/setup.ts` mocks `BroadcastChannel`, `Worker` (returns random 384-dim vectors), `crypto.randomUUID` (returns `test-uuid-N`), and `navigator.storage.estimate`
- Coverage excludes `src/test/**`, test/spec/bench files, and `src/index.tsx`
- 6 test files: `memory.unit.test.ts` (25), `memory.integration.test.ts` (10), `memory.benchmark.ts` (5 bench), `gemini.test.ts` (8), `sandbox.test.ts` (9), `icd11.test.ts` (22)
- E2E: requires `npx playwright install chromium` first; Playwright config auto-starts dev server; uses Chromium only

## In-app agent system (product feature, not OpenCode)
6 A2A debate agents (Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian) defined in `src/App.tsx`. These are UI characters, not OpenCode agents. See `docs/guides/001-agents.md` and `docs/agents/SKILL.md`.

## Documentation reference
Full documentation is in `docs/`. Key entry points:
- `docs/index.md` — Master table of contents (83 files, 12 sections)
- `docs/project/000-overview.md` — Project overview
- `docs/developers/000-quickstart.md` — 5-minute developer quickstart
- `docs/developers/003-non-coder-guide.md` — Click-by-click setup for non-developers
- `docs/developers/002-environment.md` — API keys & environment variables
- `docs/architecture/000-index.md` — Architecture Decision Records (6 ADRs)
- `docs/api/000-index.md` — API reference (Memory, IndexedDB, LLM, Sandbox)
- `docs/agents/SKILL.md` — In-app agent system overview
