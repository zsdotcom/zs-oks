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
- `src/services/memoryApi.ts` wraps `src/db/indexedDB.ts` (19 object stores) with 6-tier memory API. `computeEmbedding()` uses Transformers.js in a Web Worker.
- CDN deps loaded from `index.html`: KaTeX 0.18.1, Mermaid 11.16.0 (jsdelivr), Leaflet 1.9.4 (unpkg — not mentioned elsewhere).
- Transformers.js and Orama JS are dynamically loaded from jsdelivr CDN in Workers/lazy imports — never installed via npm.
- Several panels are `React.lazy()` loaded: `A2AMetricsDashboard`, `GoogleWorkspacePanel`, `SettingsPanel`, `MCPServerPanel`, `WorkspaceDocumentEditor`.
- Additional components not listed elsewhere: `AgentBuilder`, `ICD11Lookup`, `EpiMap`, `DocumentEditor`, `MetricsDashboard`, `WebhookManager`, `WebhookManager`.
- Additional services: `embeddingWorker.ts`, `oramaService.ts`, `webhookService.ts`, `skillService.ts`, `connectorService.ts`, `sandboxService.ts`, `toolService.ts`, `icd11Service.ts`, `knowledgeSourceService.ts`.

## Key gotchas
- **Path alias `@/`** maps to `src/`. Import from `@/types`, `@/components/...`, etc.
- **Only 2 npm runtime deps**: `react` and `react-dom`. Never add another. All other libs (Transformers.js, Orama, KaTeX, Mermaid, Leaflet) come from CDN.
- **API keys** come from `import.meta.env.VITE_*` env vars and are also configurable at runtime via Settings panel (stored in IndexedDB). `.env.example` documents all vars.
- **Google OAuth** (`src/services/googleAuthService.ts`) loads GIS script from CDN dynamically. Requires `VITE_GOOGLE_OAUTH_CLIENT_ID`.
- **If docs conflict with source code**, trust the source.
- **Benchmarks** write to `benchmark-results.json` (gitignored).

## Testing quirks
- Test environment: `happy-dom` with `fake-indexeddb/auto`
- Setup file `src/test/setup.ts` mocks `BroadcastChannel`, `Worker` (returns random 384-dim vectors), `crypto.randomUUID` (returns `test-uuid-N`), and `navigator.storage.estimate`
- Coverage excludes `src/test/**`, test/spec/bench files, and `src/index.tsx`
- 6 test files: `memory.unit.test.ts` (15), `memory.integration.test.ts` (6), `memory.benchmark.ts` (4 bench), `gemini.test.ts` (18), `sandbox.test.ts` (9), `icd11.test.ts` (18)
- E2E: requires `npx playwright install chromium` first; Playwright config auto-starts dev server; uses Chromium only

## In-app agent system (product feature, not OpenCode)
6 A2A debate agents (Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian) defined in `src/App.tsx:97-104`. These are UI characters, not OpenCode agents. See `docs/guides/060-agents-configuration.md`.
