# Open Knowledge Studio v1.0

**Open Knowledge Studio** is a zero-dependency, browser-native, multi-agent AI platform designed for offline-first research, writing, and data analysis. It operates entirely within your browser using IndexedDB for persistent memory and Transformers.js for zero-cost vector embeddings.

## 📖 Documentation Guide

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

For agent-specific implementation details, see `AGENTS.md` at the root of the repository.

---

## 🌟 Key Features

- **Zero Dependency Architecture:** Runs entirely in the browser. Only 2 runtime packages (`react`, `react-dom`).
- **6-Tier Memory System:** Hierarchical memory (Session, Episodic, Semantic, Procedural, Working, Long-Term) powered by IndexedDB.
- **Browser-Native AI:** Uses Transformers.js (WebGPU/WebAssembly) for semantic embeddings and Orama JS for 5-10ms vector search.
- **Multi-Agent Workflow:** 6 specialized agents (Coordinator, Researcher, Writer, Data Analyst, Reviewer, Librarian) communicating via the A2A protocol.
- **True Offline-First:** Service Worker (PWA) ensures the application works without an internet connection.
- **Workspace Isolation:** Each project has an isolated 9-directory structure to prevent data corruption across agents.
- **Color-Coded Real-Time Rendering:** Mermaid.js integration with live BroadcastChannel-based preview.

---

## 🚀 Quick Start

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

4. Open your browser to `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏗️ Repository Structure

```text
open-knowledge-studio/
├── README.md                          # This file
├── AGENTS.md                          # Comprehensive agent definitions and tasks
├── LICENSE.md                         # MIT License
├── .env.example                       # Environment variable template
├── .gitignore                         # Git ignore rules
├── index.html                         # Application entry point
├── package.json                       # Project metadata and scripts
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite build configuration
├── vitest.config.ts                   # Vitest testing configuration
├── docs/                              # Serialized documentation (000-110)
│   ├── 000-project-overview.md
│   ├── 010-blueprint.md
│   ├── ...
│   └── agents/                        # Individual agent documentation
│       ├── coordinator.md
│       └── ...
├── public/                            # Static assets
│   ├── favicon.svg
│   ├── manifest.json
│   └── sw.js                          # Service Worker for offline support
└── src/                               # Source code
    ├── index.css                      # Global styles (Dark/Light themes)
    ├── index.tsx                      # React entry point
    ├── types.ts                       # TypeScript interfaces and types
    ├── components/                    # UI Components
    │   ├── App.tsx
    │   ├── ChatInterface.tsx
    │   ├── DocumentEditor.tsx
    │   ├── GoogleWorkspacePanel.tsx
    │   ├── KnowledgeBaseManager.tsx
    │   ├── MetricsDashboard.tsx
    │   ├── SearchPanel.tsx
    │   ├── SettingsPanel.tsx
    │   ├── ThemeSwitcher.tsx
    │   ├── WorkspaceManager.tsx
    │   ├── charts/SimpleCharts.tsx
    │   └── icons/lucide-shim.tsx
    ├── db/                            # Database services
    │   └── indexedDB.ts
    ├── services/                      # Core application services
    │   ├── geminiService.ts
    │   ├── googleAuthService.ts
    │   ├── memoryApi.ts
    │   └── searchService.ts
    ├── test/                          # Test suite
    │   ├── setup.ts
    │   ├── memory.unit.test.ts
    │   ├── memory.integration.test.ts
    │   └── memory.benchmark.test.ts
    └── utils/                         # Utility functions
        ├── highlight.ts
        └── markdown.ts
```

---

## 🧪 Testing

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

## 🤝 Contributing

Please read `docs/040-development.md` for our contribution guidelines, coding standards, and git workflow.

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE.md` for details.