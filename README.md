# Open Knowledge Studio v1.0

**Open Knowledge Studio** is a zero-dependency, browser-native, multi-agent AI platform designed for offline-first research, writing, and data analysis. It operates entirely within your browser using IndexedDB for persistent memory.

## Tech Stack

| Category | Technology | Version |
| :--- | :--- | :--- |
| **Runtime** | React + React DOM | 19.2.7 |
| **Build** | Vite + Rolldown | 8.1.5 |
| **Language** | TypeScript | 7.0.2 |
| **Plugin** | @vitejs/plugin-react | 6.0.4 |
| **Test runner** | Vitest | 4.1.10 |
| **Coverage** | @vitest/coverage-v8 | 4.1.9 |
| **DOM env** | happy-dom | 20.10.6 |
| **IndexedDB mock** | fake-indexeddb | 6.2.5 |
| **Node types** | @types/node | 26.1.1 |
| **React types** | @types/react + @types/react-dom | 19.2.17 / 19.2.3 |
| **KaTeX** (CDN) | Math rendering | 0.18.1 |
| **Mermaid** (CDN) | Diagram rendering | 11.16.0 |
| **Tailwind CSS** (CDN) | Utility-first CSS | 3.x |

## Documentation Guide

All documentation is located in the `/docs` folder, serialized for easy navigation by both humans and AI agents:

| File | Description |
| :--- | :--- |
| `docs/000-project-overview.md` | High-level project vision and goals |
| `docs/010-blueprint.md` | Core features, target audience, and success metrics |
| `docs/020-architecture.md` | System architecture, harness pattern, and A2A protocol |
| `docs/030-design.md` | UI/UX specifications, color-coding, and theming |
| `docs/040-development.md` | Contribution guidelines, coding standards, and git workflow |
| `docs/050-setup.md` | Step-by-step environment setup and build instructions |
| `docs/060-agents-configuration.md` | Detailed agent roles, system prompts, and permissions |
| `docs/070-memory-architecture.md` | 6-tier memory system, IndexedDB schema, and vector search |
| `docs/080-test-suite.md` | Comprehensive testing strategy, benchmarks, and CI/CD |
| `docs/090-gap-analysis.md` | Technical debt, missing features, and enhancement roadmap |
| `docs/100-dependency-removal-notes.md` | Strategy for removing third-party dependencies |
| `docs/110-repository-architecture-tree.md` | Detailed breakdown of the `/src` directory |
| `docs/agents/` | Individual agent configuration files (9 files) |

For agent-specific implementation details, see `AGENTS.md` at the root of the repository.

---

## Key Features

- **Zero Dependency Architecture:** Runs entirely in the browser. Only 2 runtime packages (`react`, `react-dom`).
- **6-Tier Memory System:** Hierarchical memory (Session, Episodic, Semantic, Procedural, Working, Long-Term) powered by IndexedDB.
- **Client-Side Fuzzy Search:** Custom token-based search engine — no external search library required.
- **Multi-Agent Workflow:** 6 specialized agents (Coordinator, Researcher, Writer, Data Analyst, Reviewer, Librarian) communicating via the A2A protocol.
- **True Offline-First:** Service Worker (PWA) ensures the application works without an internet connection.
- **Workspace Isolation:** Each project has an isolated workspace to prevent data corruption across agents.
- **Color-Coded Real-Time Rendering:** Mermaid.js integration with live BroadcastChannel-based preview.

---

## Quick Start

### Prerequisites

- Node.js v22+
- npm v10+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codeandbrain/open-knowledge-studio.git
   cd open-knowledge-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

---

## Repository Structure

```text
open-knowledge-studio/
├── README.md                          # This file
├── AGENTS.md                          # Comprehensive agent definitions and tasks
├── LICENSE                            # MIT License
├── .env.example                       # Environment variable template
├── .gitignore                         # Git ignore rules
├── index.html                         # Application entry point (KaTeX, Mermaid, Tailwind CDN)
├── package.json                       # Project metadata and scripts
├── tsconfig.json                      # TypeScript configuration (strict mode)
├── vite.config.ts                     # Vite build configuration (Rolldown)
├── vitest.config.ts                   # Vitest testing configuration
├── opencode.jsonc                     # OpenCode agent workspace configuration
├── docs/                              # Serialized documentation (000-110)
│   ├── 000-project-overview.md
│   ├── 010-blueprint.md
│   ├── 020-architecture.md
│   ├── 030-design.md
│   ├── 040-development.md
│   ├── 050-setup.md
│   ├── 060-agents-configuration.md
│   ├── 070-memory-architecture.md
│   ├── 080-test-suite.md
│   ├── 090-gap-analysis.md
│   ├── 100-dependency-removal-notes.md
│   ├── 110-repository-architecture-tree.md
│   └── agents/
│       ├── coordinator.md
│       ├── data-analyst.md
│       ├── librarian.md
│       ├── researcher.md
│       ├── reviewer.md
│       ├── writer.md
│       ├── SKILLS.md
│       ├── TEMPLATES.md
│       └── TOOLS.md
├── public/                            # Static assets
│   ├── favicon.svg
│   ├── manifest.json
│   └── sw.js                          # Service Worker for offline support
└── src/                               # Source code
    ├── index.css                      # Global styles (Dark/Light themes)
    ├── index.tsx                      # React entry point
    ├── App.tsx                        # Main app shell (monolithic state)
    ├── types.ts                       # TypeScript interfaces and types
    ├── components/                    # UI Components
    │   ├── A2AMetricsDashboard.tsx    # Observability dashboard with SVG charts
    │   ├── ChatInterface.tsx          # AI chat with voice input, context grounding
    │   ├── DocumentEditor.tsx         # Re-export alias for WorkspaceDocumentEditor
    │   ├── GoogleWorkspacePanel.tsx   # Drive/Docs/Sheets/Gmail integration
    │   ├── KnowledgeBaseManager.tsx   # File/folder tree with drag-drop
    │   ├── MetricsDashboard.tsx       # Re-export alias for A2AMetricsDashboard
    │   ├── SearchPanel.tsx            # Full-text search
    │   ├── SettingsPanel.tsx          # AI provider, sandbox, data management modal
    │   ├── ThemeSwitcher.tsx          # Dark/light toggle
    │   ├── WorkspaceDocumentEditor.tsx # Split-pane markdown editor + preview
    │   ├── WorkspaceManager.tsx       # Workspace isolation & project management
    │   ├── charts/SimpleCharts.tsx    # Pure SVG charts (Bar, Line, StatCard)
    │   └── icons/lucide-shim.tsx      # Inline SVG Lucide icons (30+ icons)
    ├── db/                            # Database services
    │   └── indexedDB.ts               # 19 object stores, generic CRUD
    ├── services/                      # Core application services
    │   ├── geminiService.ts           # Multi-provider LLM router
    │   ├── googleAuthService.ts       # Google OAuth + Drive/Docs/Sheets REST
    │   ├── memoryApi.ts               # 6-tier memory API wrapper (session→long-term)
    │   └── searchService.ts           # Client-side token-based fuzzy search
    ├── test/                          # Test suite
    │   ├── setup.ts                   # Global test setup (IndexedDB, BroadcastChannel mocks)
    │   ├── memory.unit.test.ts        # 15 unit tests across all 6 memory tiers
    │   ├── memory.integration.test.ts # 6 integration tests (cross-tier, sync, storage)
    │   └── memory.benchmark.ts        # 4 benchmarks (write, search, key gen, batch)
    └── utils/                         # Utility functions
        ├── highlight.ts               # Custom regex syntax highlighter
        └── markdown.ts                # Custom CommonMark parser
```

---

## Testing

We use Vitest for unit, integration, and performance testing.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run performance benchmarks
npm run test:bench
```

---

## Contributing

Please read `docs/040-development.md` for our contribution guidelines, coding standards, and git workflow.

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.
