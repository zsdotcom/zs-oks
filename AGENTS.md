# Open Knowledge Studio — Agent Instructions

## 🚀 Repository & Workspace Constraints
- **Local Project Folder Root**: `/home/codeandbrain/open-knowledge-studio`
- **GitHub Repository**: `https://github.com/codeandbrain/open-knowledge-studio`
- **Strict Boundary**: All code modifications, tests, and file searches MUST remain inside the project root.

## 📂 Project Structure & Paths
- **Source Code**: `src/`
- **Components**: `src/components/`
- **Services**: `src/services/`
- **Database Layer**: `src/db/`
- **Utilities**: `src/utils/`
- **Documentation**: `docs/`
- **Public Assets**: `public/`
- **Test Suite**: `src/test/`

## 🛠️ Execution & Build Commands
When running tasks or validating code, use the following standard scripts:
- **Install Dependencies**: `npm install`
- **Development Server**: `npm run dev`
- **Production Build**: `npm run build` (`tsc --noEmit && vite build`)
- **Type Checking**: `npm run typecheck` (`tsc --noEmit`)
- **Run Tests**: `npm run test`
- **Watch Tests**: `npm run test:watch`
- **Coverage**: `npm run test:coverage`
- **Benchmarks**: `npm run test:bench`


## 🧠 Memory Architecture Context
The application utilizes IndexedDB (`open-knowledge-studio` DB, v1) for persistent state across store modules (`episodic`, `semantic`, `procedural`, `working`, `long_term`, `files`, `sandbox`, `sessions`).

## Tech stack

| Dependency | Version |
| :--- | :--- |
| React / React DOM | 19.2.7 |
| Vite | 8.1.5 |
| TypeScript | 7.0.2 |
| @vitejs/plugin-react | 6.0.4 |
| Vitest | 4.1.10 |
| @vitest/coverage-v8 | 4.1.9 |
| happy-dom | 20.10.6 |
| fake-indexeddb | 6.2.5 |
| @types/node | 26.1.1 |
| @types/react / @types/react-dom | 19.2.17 / 19.2.3 |
| KaTeX (CDN) | 0.18.1 |
| Mermaid (CDN) | 11.16.0 |

## Quick start

```bash
npm install          # only react + react-dom at runtime
npm run dev          # dev server on http://localhost:3000
npm run typecheck    # tsc --noEmit (run before build)
npm run build        # tsc --noEmit && vite build
npm run preview      # serve dist/ locally
```

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server, port **3000**, bound `0.0.0.0` |
| `npm run typecheck` | `tsc --noEmit` — run before `build` |
| `npm run build` | `tsc --noEmit && vite build` |
| `npm run test` | Vitest — **no tests exist** (0 test files in repo) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Vitest with V8 coverage |
| `npm run test:bench` | Vitest bench (no benchmarks exist) |
| `npm run test:bench:compare` | Bench with regression comparison |

All test commands are configured in `vitest.config.ts` (happy-dom, fake-indexeddb, coverage thresholds: 80/75/85/80) but no test files have been written yet.

## Architecture

Single-page React 19 app, no backend. All state lives in React + IndexedDB.

```
public/
  sw.js             # PWA service worker (offline-first, cache: oks-v2)
  manifest.json     # PWA manifest
  favicon.svg       # App icon

index.html          # Entry point — loads Tailwind/KaTeX/Mermaid from CDN
src/
  index.tsx           # React entry (ReactDOM.createRoot)
  App.tsx             # Monolithic component — ALL state in one file
  types.ts            # ALL shared types/interfaces in one file
  index.css           # Dark/light theme CSS variables, prose styles
  db/
    indexedDB.ts      # 19 object stores, generic CRUD (dbGet/dbPut/dbDelete)
  services/
    geminiService.ts      # Multi-provider LLM router (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama)
    googleAuthService.ts  # Google OAuth (GIS) + Drive/Docs/Sheets REST API
    searchService.ts      # Client-side token-based fuzzy search
  components/
    ChatInterface.tsx                   # AI chat with voice input, context grounding
    WorkspaceDocumentEditor.tsx         # Split-pane markdown editor + KaTeX/Mermaid preview
    KnowledgeBaseManager.tsx            # File/folder tree with drag-drop
    A2AMetricsDashboard.tsx             # Observability dashboard with SVG charts
    GoogleWorkspacePanel.tsx            # Drive/Docs/Sheets/Gmail integration
    SearchPanel.tsx                     # Full-text search
    ThemeSwitcher.tsx                   # Dark/light toggle
    charts/SimpleCharts.tsx             # Pure SVG BarChart, LineChart, StatCard
    icons/lucide-shim.tsx               # Inline SVG Lucide icons (30+ icons)
  utils/
    markdown.ts         # Custom CommonMark parser (headings, tables, code fences, lists, KaTeX)
    highlight.ts        # Custom regex syntax highlighter (JS/TS/Python/Go/Bash/SQL/HTML/CSS/YAML/JSON)
```

## ⚠️ Key gotchas

- **Path alias `@/`** maps to *project root* in `vite.config.ts` (line: `'@': path.resolve(__dirname, '.')`) but tsconfig says `"./src/*"`. When using `@/` imports, resolve carefully — they are relative to root, not `src/`. E.g., `@/src/types` not `@/types`.
- **Zero new runtime deps** policy. All icons, charts, markdown parsing, and syntax highlighting are custom inline implementations. No `lucide-react`, no charting library, no Markdown library, no syntax highlighter.
- **API keys** are loaded via Vite's `define` from env vars (`process.env.GEMINI_API_KEY`, etc.) and also configurable at runtime through the Settings panel (stored in IndexedDB). The vite config uses `loadEnv` from the root `.` directory.
- **Google OAuth** (`src/services/googleAuthService.ts`) loads GIS script from CDN dynamically. Set `VITE_GOOGLE_OAUTH_CLIENT_ID` in `.env`.
- **The `docs/` directory** contains aspirational architecture docs that may be stale — trust the source code over them.
- **Coverage thresholds** in vitest config: statements 80%, branches 75%, functions 85%, lines 80% — but no tests exist to satisfy them yet.
- **No `memoryApi.ts`** exists despite docs referencing it. Memory operations go directly to `src/db/indexedDB.ts`.
- **No test files** exist at all — `src/test/` directory is absent, and `vitest.config.ts` references a non-existent `src/test/setup.ts`.

## Build & deploy

```bash
npm run build          # outputs to dist/
npm run preview        # serves dist/ locally
```

Build order matters: `typecheck` must pass before `vite build`.

## Testing quirks

- Test environment: `happy-dom` with `fake-indexeddb` setup
- Setup file expected at `src/test/setup.ts` — does not exist
- Coverage excludes `src/test/**`, test files, and `src/index.tsx`
- Benchmarks write to `benchmark-results.json` (gitignored)
- No test files exist in the repository

## In-app agent system (product feature)

The product ships an in-app multi-agent system (Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian). These are **not OpenCode agents** — they are characters defined in the app's UI (A2A debate panel, chat roles) and styled via `src/types.ts` (`A2AAgent`, `ChatMessage` types). The root-level docs describe this product feature; the source code implements a simpler version. See `docs/060-agents-configuration.md` and `src/App.tsx:81-85` for the actual in-app agent definitions.
