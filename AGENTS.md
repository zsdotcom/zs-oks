# Open Knowledge Studio — Agent Instructions

## Repo constraints
- All work inside `/home/codeandbrain/open-knowledge-studio`.
- `opencode.jsonc` loads this file as instructions; permits `npm *`, `npx *`, `git status/diff/log/add` without confirmation; `git commit/push` requires approval.

## Commands (CI: `typecheck` → `test` → `build`; E2E on PRs only)
| Command | Notes |
|---------|-------|
| `npm install` | Only deps: `react` + `react-dom` at runtime |
| `npm run dev` | Vite on `http://localhost:3000`, bound `0.0.0.0` |
| `npm run typecheck` | Run before build (`tsc -b --noEmit`) |
| `npm test` | Vitest, 117 tests in `src/test/`, happy-dom + fake-indexeddb |
| `npm test -- -t "pattern"` | Run single test file or filter by name |
| `npm run test:e2e` | Playwright (7 specs in `e2e/`); requires `npx playwright install chromium` first |
| `npm run test:coverage` | V8 coverage; thresholds: statements 80%, branches 75%, functions 85%, lines 80% |
| `npm run test:bench` | Benchmarks in `src/**/*.bench*.ts`; writes `benchmark-results.json` |
| `npm run build` | `tsc -b --noEmit && vite build` → `dist/` |
| `npm run analyze` | `ANALYZE=true npm run build` → `dist/stats.html` |
| `npm run preview` | Serve `dist/` locally |

## Paths & aliases
- `@/` → `src/` (in `vite.config.ts` and `tsconfig.app.json`)
- `tsconfig.json` is project-reference root; `tsconfig.app.json` = app config; `tsconfig.node.json` = vite/vitest/playwright configs
- `.nvmrc`: Node 26; `.env.example` documents all `VITE_*` env vars

## Architecture facts
- SPA (React 19), zero backend. State in React + IndexedDB (22 object stores, v2).
- `src/services/memoryApi.ts` wraps `src/db/indexedDB.ts` with 6-tier memory (Session→Episodic→Semantic→Procedural→Working→Long-Term).
- `computeEmbedding()` in `src/services/memoryApi.ts:202` delegates to a Web Worker (`embeddingWorker.ts`) that dynamically loads Transformers.js 3.4.0 from CDN.
- CDN-only deps in `index.html`: KaTeX 0.18.1, Mermaid 11.16.0 (jsdelivr), Leaflet 1.9.4 (unpkg). Orama JS 3.0.0 loaded dynamically in `oramaService.ts`. **Never use npm for these.**
- `geminiService.ts` routes 10 providers (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama, OpenRouter, Cerebras, GitHub, Cloudflare) in one `queryLLM()` call.
- 6 A2A UI agents (Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian) — product features, not OpenCode agents. See `docs/agents/SKILL.md`.
- App entrypoint: `src/index.tsx` → `src/App.tsx` (1168 lines, one monolithic component with all state). 5 lazy-loaded panels via `React.lazy()`.

## Testing quirks
- Environment: `happy-dom` + `fake-indexeddb/auto`. Setup in `src/test/setup.ts` mocks `BroadcastChannel`, `Worker` (returns random 384-dim vectors), `crypto.randomUUID` (`test-uuid-N`), `navigator.storage.estimate`.
- Coverage excludes `src/test/**`, test/spec/bench files, and `src/index.tsx`.
- 8 test files: `memory.unit.test.ts` (25), `memory.integration.test.ts` (10), `memory.benchmark.ts` (5 bench), `gemini.test.ts` (8), `sandbox.test.ts` (9), `icd11.test.ts` (22), `icf.test.ts` (22), `ichi.test.ts` (22).
- E2E: Chromium only; Playwright config auto-starts `npm run dev`; `npx playwright install chromium` first.

## Key gotchas
- **Only `react` and `react-dom` as npm dependencies.** All other libraries are CDN-loaded. Never add a third npm runtime dep.
- **ICD-11 system URI mismatch:** `bdTerminologyService.ts` uses `http://id.who.int/icd/release/11/mms` but `icd11Service.ts:272` uses `http://id.who.int/icd11/mms`. Fix both if touching ICD-11 URI logic.
- **CSP connect-src in dev mode** (`vite.config.ts:22`) must list every API domain the app calls. Most are now included (BD FHIR, GitHub, WHO, CDC, Delphi, Open-Meteo, HDX, OpenRouter, Cerebras, Cloudflare), but add any new external API domain there.
- **`dbGetByIndex` compound key bug** (`indexedDB.ts:145`): uses `IDBKeyRange.only()` where `bound()` is needed for prefix queries on compound indices.
- **`webhookService.ts` uses `localStorage`**, not IndexedDB like the rest of the app.
- **`handleImport` in `App.tsx:540-556`** doesn't restore webhooks, connectors, skills, or workspaceProjects.
- **If docs conflict with source code, trust the source.**
- **API keys** come from `import.meta.env.VITE_*` or runtime Settings panel (stored in IndexedDB).
- **Free resource catalog** at `docs/free-resources.md` — MCP servers, Cloudflare free tier, CDN libraries, public-health APIs.
- **Brand guidelines** at `docs/project/006-brand-guidelines.md` — voice, tone, messaging, visual identity rules.

## Documentation reference (120+ files, 12 sections)
- `docs/index.md` — Master TOC
- `docs/developers/000-quickstart.md` — 5-min dev setup
- `docs/developers/002-environment.md` — API keys
- `docs/architecture/000-index.md` — 6 ADRs
- `docs/api/000-index.md` — Memory, IndexedDB, LLM, Sandbox API ref
- `docs/guides/001-agents.md` — A2A agents (product feature)
- `docs/guides/011-bd-health-system.md` / `012-bd-core-fhir.md` — Bangladesh integration
