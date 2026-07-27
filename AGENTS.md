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
| `npm test` | Vitest — 117 tests across 8 files in `src/test/` |
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
- Several panels are `React.lazy()` loaded: `A2AMetricsDashboard`, `GoogleWorkspacePanel`, `SettingsPanel` (imported as lazy but eagerly wrapped in Suspense), `MCPServerPanel`, `WorkspaceDocumentEditor`.
- 25 components total (13 direct + 5 lazy + 2 re-export aliases + 1 chart dir + 1 icon shim + 3 BD panel).
- 19 services: `bdGeographyService`, `bdTerminologyService`, `bdVaccineService`, `connectorService`, `embeddingWorker`, `geminiService`, `githubAuthService`, `googleAuthService`, `icd11Service`, `icfService`, `ichiService`, `whoFicIndex`, `memoryApi`, `oramaService`, `publicApiService`, `sandboxService`, `searchService`, `skillService`, `webhookService`.
- 120+ documentation files across 12 sections in `docs/` (see `docs/index.md` for full index).
- `.vscode/launch.json` has 3 debug configs: Chrome localhost:3000, Vitest, TypeCheck.

## Key gotchas
- **Path alias `@/`** maps to `src/`. Import from `@/types`, `@/components/...`, etc.
- **Only 2 npm runtime deps**: `react` and `react-dom`. Never add another. All other libs (Transformers.js, Orama, KaTeX, Mermaid, Leaflet) come from CDN.
- **API keys** come from `import.meta.env.VITE_*` env vars and are also configurable at runtime via Settings panel (stored in IndexedDB). `.env.example` documents all vars.
- **Google OAuth** (`src/services/googleAuthService.ts`) loads GIS script from CDN dynamically. Requires `VITE_GOOGLE_OAUTH_CLIENT_ID`.
- **GitHub OAuth** (`src/services/githubAuthService.ts`) uses device flow for authentication. Requires `VITE_GITHUB_OAUTH_CLIENT_ID`.
- **If docs conflict with source code**, trust the source.
- **Benchmarks** write to `benchmark-results.json` (gitignored).
- **CSP must allow all API domains** in `vite.config.ts` `connect-src` — currently blocks many external APIs at dev time.
- **BD FHIR APIs** use `https://tr.ocl.dghs.gov.bd`, `https://icd11.dghs.gov.bd`, `https://fhir.dghs.gov.bd`, `https://sandbox.fhir.dghs.gov.bd`.
- **ICD-11 system URI** must be consistent across services: `http://id.who.int/icd/release/11/mms` in `bdTerminologyService.ts` vs `http://id.who.int/icd11/mms` in `icd11Service.ts:272`.

## Testing quirks
- Test environment: `happy-dom` with `fake-indexeddb/auto`
- Setup file `src/test/setup.ts` mocks `BroadcastChannel`, `Worker` (returns random 384-dim vectors), `crypto.randomUUID` (returns `test-uuid-N`), and `navigator.storage.estimate`
- Coverage excludes `src/test/**`, test/spec/bench files, and `src/index.tsx`
- 8 test files: `memory.unit.test.ts` (25), `memory.integration.test.ts` (10), `memory.benchmark.ts` (5 bench), `gemini.test.ts` (8), `sandbox.test.ts` (9), `icd11.test.ts` (22), `icf.test.ts` (22), `ichi.test.ts` (22)
- E2E: requires `npx playwright install chromium` first; Playwright config auto-starts dev server; uses Chromium only

## In-app agent system (product feature, not OpenCode)
6 A2A debate agents (Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian) defined in `src/App.tsx`. These are UI characters, not OpenCode agents. See `docs/guides/001-agents.md` and `docs/agents/SKILL.md`.

## Documentation reference
Full documentation is in `docs/`. Key entry points:
- `docs/index.md` — Master table of contents (120 files, 12 sections)
- `docs/project/000-overview.md` — Project overview
- `docs/developers/000-quickstart.md` — 5-minute developer quickstart
- `docs/developers/003-non-coder-guide.md` — Click-by-click setup for non-developers
- `docs/developers/002-environment.md` — API keys & environment variables
- `docs/architecture/000-index.md` — Architecture Decision Records (6 ADRs)
- `docs/api/000-index.md` — API reference (Memory, IndexedDB, LLM, Sandbox)
- `docs/agents/SKILL.md` — In-app agent system overview
- `docs/guides/011-bd-health-system.md` — Bangladesh health ecosystem
- `docs/guides/012-bd-core-fhir.md` — BD Core FHIR integration

---

## Codebase Inventory

### Overview Stats
| Category | Count |
|---|---|
| Source files (`.ts`/`.tsx`) | 68 |
| Test files (8 unit/integration + 7 e2e) | 15 |
| Documentation files | 120+ in 12 sections |
| Components | 25 |
| Services | 19 |
| Hooks | 3 |
| Utilities | 4 |
| DB object stores | 22 |
| Lines of source code | ~12,400 |

### What's GOOD
1. **Architecture**: Clean zero-dependency (only `react`+`react-dom` at runtime). All external libs via CDN. Well-structured 6-tier memory API with IndexedDB.
2. **LLM routing**: `geminiService.ts` handles 10 providers (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama, OpenRouter, Cerebras, GitHub, Cloudflare) in one unified interface.
3. **Multi-agent A2A system**: 6 default agents with 3 collaboration modes (parallel debate, orchestrated, sequential). 28+ built-in tools. 28 skill definitions.
4. **Public health APIs**: `publicApiService.ts` integrates CDC Socrata, WHO GHO, Delphi Epidata, InfectoNET, Open-Meteo — all with in-memory TTL cache. 18 knowledge sources defined.
5. **WHO-FIC classification**: Full ICD-11 (238 codes), ICF (205 codes), ICHI (62 codes) datasets with FHIR conversion. OCL terminology client for BD FHIR.
6. **Bangladesh integration**: Complete BD geography (8 divisions, 64 districts, 495+ upazilas), EPI vaccine codes, OCL `$validate-code`/`$lookup`, ICD-11 cluster validator.
7. **Content**: 13 epidemiology templates, 12 research templates, 4 Mermaid diagram templates, 11 clinical/project templates. Rich seed data.
8. **Tests**: 117 tests with 80% coverage thresholds. 7 Playwright e2e specs. CI pipeline (typecheck → test → build).
9. **Offline-first**: PWA with service worker, IndexedDB for persistent state, Google Drive cloud sync, BroadcastChannel cross-tab sync.
10. **Developer experience**: Vite dev server, Tailwind v4, TypeScript strict, `@/` alias, `.vscode/launch.json`.

### GAPS (Missing Features)
| # | Gap | Location | Severity |
|---|---|---|---|
| 1 | No global Cmd+K search — search is a separate view, not accessible from anywhere | `App.tsx` | Medium |
| 2 | No file upload — KB files are only text/JSON typed in; no PDF/DOCX/image upload | `useFiles.ts`, `KnowledgeBaseManager.tsx` | High |
| 3 | No real MCP tool execution — MCP servers have tool definitions but no API call logic | `App.tsx` lines 254+ | High |
| 4 | No real connector sync — connectors stored but never poll GitHub/Slack/RSS | `connectorService.ts` | Medium |
| 5 | Orama CDN URL may break — `@orama/orama@3.0.0` from jsdelivr; no local fallback | `oramaService.ts:25` | Medium |
| 6 | No streaming LLM responses — full response fetched then displayed | `geminiService.ts` | Medium |
| 7 | No chat history export (Markdown/PDF/JSON) | `ChatInterface.tsx` | Low |
| 8 | No image/chart rendering pipeline — tools define `draw-chart`/`draw-diagram` but no impl | `SimpleCharts.tsx` | Low |
| 9 | No periodic connector polling — `fetchGitHubIssues`/`fetchGitHubRepoInfo` exist but unscheduled | `connectorService.ts` | Low |
| 10 | No in-app notification system — webhooks fire externally but no toast/badge | `App.tsx` | Low |
| 11 | InfectoNET API URLs (`infectonet.org`) may be stale/unreachable | `publicApiService.ts` | Medium |
| 12 | No lazy pagination — ICD-11, ICF, ICHI datasets loaded fully in memory | WHO-FIC services | Low |
| 13 | No keyboard shortcuts (Cmd+K, Cmd+Enter, Ctrl+/) | `App.tsx` | Low |
| 14 | No non-JSON data import/export (CSV, Markdown, Excel) | `App.tsx` lines 540+ | Low |
| 15 | No BD geography map visualization — hierarchy exists but no Leaflet map | `BdCorePanel.tsx` | Low |

### ISSUES (Bugs / Code Problems)
| # | Issue | File:Line | Severity |
|---|---|---|---|
| 1 | **CSP blocks OCL/BD APIs** — `connect-src` missing `tr.ocl.dghs.gov.bd`, `icd11.dghs.gov.bd`, `fhir.dghs.gov.bd`, `sandbox.fhir.dghs.gov.bd` | `vite.config.ts:22` | **High** |
| 2 | **CSP blocks GitHub API** — `api.github.com` not in `connect-src` | `vite.config.ts:22` | **High** |
| 3 | **CSP blocks many more APIs** — WHO GHO, Delphi, CDC, Open-Meteo, InfectoNET, Google APIs all missing from `connect-src` | `vite.config.ts:22` | **High** |
| 4 | **ICD-11 system URI mismatch** — `http://id.who.int/icd/release/11/mms` vs `http://id.who.int/icd11/mms` | `bdTerminologyService.ts:2` vs `icd11Service.ts:272` | **High** |
| 5 | **BD upazila duplicates** — `Eidgaon` twice (codes `20220032`, `20220075`), `Naldanga` twice (codes `50690066`, `50690055`) | `bdGeographyService.ts` | Low |
| 6 | **Compound index query bug** — `dbGetByIndex` uses `IDBKeyRange.only()` where `bound()` needed for prefix queries | `indexedDB.ts:145` | Medium |
| 7 | **epiDataPoints hardcoded** — 8 hand-coded outbreak locations, not API-fetchable | `App.tsx:186-195` | Low |
| 8 | **MCP servers stored as single blob** — serialized into one `sandbox` record with key `mcp-servers` | `App.tsx:605` | Medium |
| 9 | **No panel-level error boundaries** — single `ErrorBoundary` wraps entire app | `App.tsx:680` | Medium |
| 10 | **No `.vscode/tasks.json`** — launch.json references removed `preLaunchTask` | `.vscode/` | Low |
| 11 | **webhookService uses localStorage** — inconsistent with rest of app on IndexedDB | `webhookService.ts:16` | Low |
| 12 | **handleImport doesn't restore all state** — misses webhooks, connectors, skills, workspaceProjects | `App.tsx:540-556` | Medium |
| 13 | **SettingsPanel not truly lazy** — wrapped in Suspense but eagerly imported via `import SettingsPanel` | `App.tsx:1120` | Low |

---

## Work Plan & Progress

### Progress Legend
[ ] = pending &nbsp; [~] = in progress &nbsp; [x] = completed &nbsp; [-] = blocked

### Phase 0: Critical Fixes
- [ ] Fix `vite.config.ts` CSP `connect-src` to allow all required API domains
- [ ] Fix `ICD11_SYSTEM` URI inconsistency (`bdTerminologyService.ts` vs `icd11Service.ts:272`)
- [ ] Fix `dbGetByIndex` compound key query for prefix searches (`indexedDB.ts:145`)
- [ ] Add `.vscode/tasks.json` for `npm: dev` build task

### Phase 1: Core UX & Ergonomics
- [ ] Add global Cmd+K search overlay
- [ ] Add keyboard shortcuts (Cmd+K, Cmd+Enter, Ctrl+/ help)
- [ ] Add file upload (PDF, images, .docx via drag-and-drop)
- [ ] Add streaming LLM responses (SSE/chunked fetch)
- [ ] Add chat history export (Markdown/JSON)
- [ ] Add panel-level error boundaries (lazy per panel)

### Phase 2: Missing Integrations
- [ ] Implement real MCP tool execution (actual API calls from tool definitions)
- [ ] Implement connector background sync (periodic GitHub/Slack/RSS polling)
- [ ] Implement in-app notification system (toasts + badge count)
- [ ] Add non-JSON data import/export (CSV, Markdown)
- [ ] Move `webhookService.ts` from localStorage to IndexedDB
- [ ] Fix `handleImport` to restore all state stores

### Phase 3: Feature Expansion
- [ ] Add BD Geography map visualization (Leaflet + `bdGeographyService.ts`)
- [ ] Add BD Drug Registry lookup (DGDA 39,196 OCL concepts)
- [ ] Implement true ICD-11 WHO API live search (fallback to local dataset)
- [ ] Add data visualization dashboard (actual chart rendering for `SimpleCharts.tsx`)
- [ ] Add file version diff view in DocumentEditor
- [ ] Add workspace project dashboard (overview stats per project)

### Phase 4: Tests & Polish
- [ ] Write tests for `bdTerminologyService` (OCL validate/lookup, cluster validation)
- [ ] Write tests for `bdGeographyService` (search, drill-down, path resolution)
- [ ] Write tests for `bdVaccineService` (vaccine codes, EPI schedule)
- [ ] Write tests for `geminiService.ts` multi-provider routing (mock fetch)
- [ ] Write tests for `connectorService.ts` (GitHub/Slack/RSS operations)
- [ ] Write tests for `webhookService.ts` (fire, add, remove, update)
- [ ] Fix BD upazila duplicates (`bdGeographyService.ts`)
- [ ] Lazy import `SettingsPanel`, `ICD11Lookup`, `BdCorePanel`, `EpiMap`, `ConnectorPanel`, `PublicDataPanel`
- [ ] Replace hardcoded `epiDataPoints` with API-fetched surveillance data

### Phase 5: Advanced Features (Stretch)
- [ ] Add real-time collaborative editing (WebRTC/BroadcastChannel)
- [ ] Add offline-first data sync queue with retry
- [ ] Add AI-powered natural language query for ICD-11/ICF/ICHI
- [ ] Add real-time WHO/CDC surveillance dashboard
- [ ] Add automated outbreak detection from surveillance feeds
- [ ] Add report auto-generation from templates with live data
- [ ] Add multi-language support (i18n)
