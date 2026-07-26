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
- **Documentation**: `docs/` (`project/`, `developers/`, `guides/`, `agents/`)
- **Public Assets**: `public/`
- **Test Suite**: `src/test/`

## 🛠️ Execution & Build Commands
When running tasks or validating code, use the following standard scripts:
- **Install Dependencies**: `npm install`
- **Development Server**: `npm run dev`
- **Production Build**: `npm run build` (`tsc -b --noEmit && vite build`)
- **Type Checking**: `npm run typecheck` (`tsc -b --noEmit`)
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
| tailwindcss + @tailwindcss/vite | ^4.x (Vite plugin, not CDN) |
| Transformers.js (CDN, Worker) | 3.4.0 (all-MiniLM-L6-v2, 384-dim) |
| Orama JS (CDN) | 3.0.0 (hybrid vector+keyword search) |

## Quick start

```bash
npm install          # only react + react-dom at runtime
npm run dev          # dev server on http://localhost:3000
npm run typecheck    # tsc -b --noEmit (run before build)
npm run build        # tsc -b --noEmit && vite build
npm run preview      # serve dist/ locally
```

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server, port **3000**, bound `0.0.0.0` |
| `npm run typecheck` | `tsc -b --noEmit` — run before `build` |
| `npm run build` | `tsc -b --noEmit && vite build` |
| `npm run test` | Vitest — 6 test files, 74 tests (memory, gemini, ICD-11, sandbox) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Vitest with V8 coverage |
| `npm run test:bench` | Vitest bench (no benchmarks exist) |
| `npm run test:bench:compare` | Bench with regression comparison |

All test commands are configured in `vitest.config.ts` (happy-dom, fake-indexeddb, coverage thresholds: 80/75/85/80).

## Architecture

Single-page React 19 app, no backend. All state lives in React + IndexedDB.

```
public/
  sw.js             # PWA service worker (offline-first, cache: oks-v2)
  manifest.json     # PWA manifest
  favicon.svg       # App icon

index.html          # Entry point — loads KaTeX/Mermaid from CDN; Tailwind via Vite plugin
src/
  index.tsx           # React entry (ReactDOM.createRoot)
  App.tsx             # Main app component — state partially extracted to hooks
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
    ErrorBoundary.tsx                   # Crash recovery wrapper
    KanbanBoardView.tsx                 # Task board with drag-drop columns
    ChatSessionSidebar.tsx              # Chat session list & management
    GmailCompose.tsx                    # Email compose & send via Gmail API
    MCPServerPanel.tsx                  # MCP server/tool configuration
    SettingsPanel.tsx                   # AI provider, sandbox, data management modal
    WorkspaceManager.tsx                # Workspace isolation & project management
    charts/SimpleCharts.tsx             # Pure SVG BarChart, LineChart, StatCard
    icons/lucide-shim.tsx               # Inline SVG Lucide icons (30+ icons)
  utils/
    markdown.ts         # Custom CommonMark parser (headings, tables, code fences, lists, KaTeX)
    highlight.ts        # Custom regex syntax highlighter (JS/TS/Python/Go/Bash/SQL/HTML/CSS/YAML/JSON)
  hooks/
    useChat.ts          # Chat session management & IndexedDB persistence
    useFiles.ts         # File/folder/version CRUD via IndexedDB
    usePersistence.ts   # Dark mode, online status, save/load utilities
```

## ⚠️ Key gotchas

- **Path alias `@/`** maps to `src/` in both `vite.config.ts` and `tsconfig.json`. Import from `@/types`, `@/components/...`, etc.
- **Only 2 npm runtime deps**: `react` and `react-dom`. Transformers.js and Orama JS are dynamically loaded from jsdelivr CDN in Web Workers / lazy imports.
- **API keys** are loaded from `import.meta.env.VITE_*` env vars (via Vite's built-in `VITE_` prefix convention) and also configurable at runtime through the Settings panel (stored in IndexedDB). The `.env.example` file documents all supported variables.
- **Google OAuth** (`src/services/googleAuthService.ts`) loads GIS script from CDN dynamically. Set `VITE_GOOGLE_OAUTH_CLIENT_ID` in `.env`.
- **The `docs/` directory** has been updated to reflect the current codebase state. If you find a discrepancy, trust the source code.
- **Coverage thresholds** in vitest config: statements 80%, branches 75%, functions 85%, lines 80%.
- **`memoryApi.ts`** (`src/services/memoryApi.ts`) wraps `src/db/indexedDB.ts` with a 6-tier memory API (Session, Episodic, Semantic, Procedural, Working, Long-Term). `computeEmbedding()` uses Transformers.js in a Web Worker for real 384-dim vector embeddings.

## Build & deploy

```bash
npm run build          # outputs to dist/
npm run preview        # serves dist/ locally
```

Build order matters: `typecheck` must pass before `vite build`.

## Testing quirks

- Test environment: `happy-dom` with `fake-indexeddb` setup
- Setup file at `src/test/setup.ts` — mocks BroadcastChannel, Worker, crypto.randomUUID
- Coverage excludes `src/test/**`, test files, and `src/index.tsx`
- Benchmarks write to `benchmark-results.json` (gitignored)
- 6 test files exist in `src/test/`:
  - `memory.unit.test.ts` (15 unit tests)
  - `memory.integration.test.ts` (6 integration tests)
  - `memory.benchmark.ts` (4 benchmarks)
  - `gemini.test.ts` (18 unit tests)
  - `sandbox.test.ts` (9 unit tests)
  - `icd11.test.ts` (18 unit tests)

## In-app agent system (product feature)

The product ships an in-app A2A debate panel with 6 agents (Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian). These are **not OpenCode agents** — they are characters defined in the app's UI (`A2AAgent` type, `ChatMessage` types). See `src/App.tsx:84-88` for the actual in-app agent definitions and `docs/guides/060-agents-configuration.md` for configuration details.


