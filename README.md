# Open Knowledge Studio v2.0

**Open Knowledge Studio** is a zero-npm-dependency, browser-native, **6-agent A2A platform** with Transformers.js vector embeddings and Orama JS semantic search. It operates entirely within your browser using IndexedDB for persistent memory — all ML/search libraries are loaded dynamically from CDN.

## Tech Stack

| Category | Technology | Version |
| :--- | :--- | :--- |
| **Runtime** | React + React DOM | 19.2.7 |
| **Build** | Vite + Rolldown | 8.1.5 |
| **Language** | TypeScript | 7.0.2 |
| **Plugin** | @vitejs/plugin-react | 6.0.4 |
| **CSS** | Tailwind CSS + @tailwindcss/vite | 4.x |
| **Test runner** | Vitest | 4.1.10 |
| **Coverage** | @vitest/coverage-v8 | 4.1.9 |
| **CDN: Transformers.js** | Vector embeddings (384-dim, all-MiniLM-L6-v2, Web Worker) | 3.4.0 |
| **CDN: Orama JS** | Hybrid vector + keyword search | 3.0.0 |
| **CDN: KaTeX** | Math rendering | 0.18.1 |
| **CDN: Mermaid** | Diagram rendering | 11.16.0 |

## Key Features

- **6-Agent A2A Debate Panel:** Coordinator 🎯, Researcher 🔬, Data Analyst 📊, Writer ✍️, Reviewer 🔍, Librarian 📚 — each with unique color and system prompt.
- **Vector Embeddings:** Transformers.js (`all-MiniLM-L6-v2`) in a Web Worker generates 384-dim vectors for all semantic memory entries.
- **Hybrid Vector Search:** Orama JS loaded dynamically from CDN provides hybrid (vector + keyword) search, with automatic fallback to keyword matching.
- **6-Tier Memory:** Session (in-memory), Episodic, Semantic (vector-indexed), Procedural, Working, Long-Term — all exposed via `memoryApi.ts`.
- **Zero NPM Dependencies:** Only `react` + `react-dom` at build time — Transformers.js and Orama JS are loaded from jsdelivr CDN at runtime.
- **35 tests** across unit, integration, and benchmark suites.

## Agent Color Reference

| Agent | Color | Avatar | CSS Variable |
| :--- | :--- | :--- | :--- |
| Coordinator | `#8B5CF6` Purple | 🎯 | `--color-coord` |
| Researcher | `#06B6D4` Cyan | 🔬 | `--color-research` |
| Data Analyst | `#F59E0B` Amber | 📊 | `--color-data` |
| Writer | `#10B981` Emerald | ✍️ | `--color-writer` |
| Reviewer | `#EF4444` Red | 🔍 | `--color-review` |
| Librarian | `#8B5CF6` Purple | 📚 | `--color-librarian` |

---

## Quick Start

### Prerequisites

- Node.js v22+ (tested with v26)
- npm v10+ (tested with v11)

### Installation

```bash
git clone https://github.com/codeandbrain/open-knowledge-studio.git
cd open-knowledge-studio
npm install
npm run dev
```

Open your browser to `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

---

## Repository Structure

```
open-knowledge-studio/
├── README.md
├── AGENTS.md                          # OpenCode agent workspace configuration
├── LICENSE
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── opencode.jsonc
├── docs/                              # Serialized documentation (000-110)
│   ├── 000-project-overview.md
│   ├── 010-blueprint.md
│   ...
│   └── agents/
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   └── sw.js
└── src/
    ├── index.css
    ├── index.tsx
    ├── App.tsx
    ├── types.ts
    ├── components/
    │   ├── A2AMetricsDashboard.tsx
    │   ├── ChatInterface.tsx
    │   ├── ChatSessionSidebar.tsx
    │   ├── ErrorBoundary.tsx
    │   ├── GmailCompose.tsx
    │   ├── GoogleWorkspacePanel.tsx
    │   ├── KanbanBoardView.tsx
    │   ├── KnowledgeBaseManager.tsx
    │   ├── MCPServerPanel.tsx
    │   ├── SearchPanel.tsx
    │   ├── SettingsPanel.tsx
    │   ├── ThemeSwitcher.tsx
    │   ├── WorkspaceDocumentEditor.tsx
    │   ├── WorkspaceManager.tsx
    │   ├── charts/SimpleCharts.tsx
    │   └── icons/lucide-shim.tsx
    ├── db/
    │   └── indexedDB.ts
    ├── hooks/
    │   ├── useChat.ts
    │   ├── useFiles.ts
    │   └── usePersistence.ts
    ├── services/
    │   ├── geminiService.ts
    │   ├── googleAuthService.ts
    │   ├── memoryApi.ts
    │   ├── embeddingWorker.ts
    │   ├── oramaService.ts
    │   └── searchService.ts
    ├── test/
    │   ├── setup.ts
    │   ├── memory.unit.test.ts
    │   ├── memory.integration.test.ts
    │   └── memory.benchmark.ts
    └── utils/
        ├── highlight.ts
        └── markdown.ts
```

---

## Testing (35 tests)

```bash
npm test               # Run all 35 tests (2 suites)
npm run test:watch     # Watch mode
npm run test:coverage  # With V8 coverage
npm run test:bench     # Performance benchmarks (5 cases)
```

---

## Deploy

| Platform | Docs | Quick command |
| :--- | :--- | :--- |
| GitHub Actions (CI/CD) | [`docs/098-cicd-pipeline.md`](docs/098-cicd-pipeline.md) | `npm run typecheck && npm test && npm run build` |
| Docker | [`docs/099-deployment.md`](docs/099-deployment.md) | `docker build -t oks . && docker run -p 8080:80 oks` |
| Vercel | [`docs/099-deployment.md`](docs/099-deployment.md) | Import repo, preset Vite, deploy |
| Netlify | [`docs/099-deployment.md`](docs/099-deployment.md) | Import repo, build `npm run build`, publish `dist` |

For credentials and API key setup see [`docs/100-reference.md`](docs/100-reference.md).

---

## License

MIT License. See `LICENSE` for details.
