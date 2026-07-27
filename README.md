<div align="center">

# ⬡ Open Knowledge Studio v2.0

**Zero-dependency · Browser-native · 6-Agent A2A Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-087EA4?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=flat)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-74-8B5CF6?style=flat)]()
[![Build](https://img.shields.io/badge/Build-~90KB_gzip-4CD7F6?style=flat)]()

A private AI research laboratory in your browser — 6 specialized agents collaborate on your work, all data stays local, zero backend required.

</div>

---

## ✦ Overview

**Open Knowledge Studio** operates entirely within your browser using IndexedDB for persistent memory, Transformers.js for vector embeddings, and Orama JS for semantic search — all ML/search libraries loaded dynamically from CDN. Only `react` + `react-dom` at build time.

### Core Stats

| Metric | Value |
|:-------|:------|
| ⚡ Runtime deps | 2 (`react`, `react-dom`) |
| 🧪 Tests | 74 across 6 files |
| 📦 Build size | ~90 KB gzip |
| 🗄️ IndexedDB stores | 22 |
| 🧩 Components | 25 (5 lazy-loaded) |
| 🔧 Services | 12 |
| 🤖 Built-in agents | 6 + custom |
| 🌐 AI providers | 6 |

---

## ✦ Tech Stack

<div align="center">

| Category | Technology | Version |
|:---------|:-----------|:--------|
| <span style="color:#8B5CF6">◆</span> **Runtime** | React + React DOM | 19.2.7 |
| <span style="color:#06B6D4">◆</span> **Build** | Vite + Rolldown | 8.1.5 |
| <span style="color:#F59E0B">◆</span> **Language** | TypeScript | 7.0.2 |
| <span style="color:#10B981">◆</span> **CSS** | Tailwind CSS + @tailwindcss/vite | 4.x |
| <span style="color:#8B5CF6">◆</span> **Test** | Vitest + Playwright | 4.1.10 |
| <span style="color:#06B6D4">◆</span> **Coverage** | @vitest/coverage-v8 | 4.1.9 |
| <span style="color:#4CD7F6">◆</span> **ML** | Transformers.js (CDN Worker) | 3.4.0 |
| <span style="color:#4CD7F6">◆</span> **Search** | Orama JS (CDN) | 3.0.0 |
| <span style="color:#4CD7F6">◆</span> **Math** | KaTeX (CDN) | 0.18.1 |
| <span style="color:#4CD7F6">◆</span> **Diagrams** | Mermaid (CDN) | 11.16.0 |
| <span style="color:#4CD7F6">◆</span> **Maps** | Leaflet.js (CDN) | 1.9.4 |

</div>

---

## ✦ Key Features

<div>
<table>
<tr>
<td width="50%">

### 🤖 6-Agent A2A Debate
Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian — each with unique color, avatar, and system prompt. All agents respond independently to user prompts.

</td>
<td width="50%">

### 🧠 Vector Embeddings
Transformers.js (`all-MiniLM-L6-v2`) in a Web Worker generates 384-dim vectors for all semantic memory entries. Zero-cost, privacy-preserving.

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Hybrid Semantic Search
Orama JS loaded from CDN provides hybrid (vector + keyword) search with automatic fallback to keyword matching.

</td>
<td width="50%">

### 🏛️ 6-Tier Memory
Session → Episodic → Semantic (vector-indexed) → Procedural → Working → Long-Term — all exposed via `memoryApi.ts`.

</td>
</tr>
<tr>
<td width="50%">

### 🌐 Multi-Provider AI
Unified router for Gemini, OpenAI, Anthropic, DeepSeek, Groq, and local Ollama — single API, 6 providers.

</td>
<td width="50%">

### 📦 Zero NPM Deps
Only `react` + `react-dom`. Transformers.js, Orama, KaTeX, Mermaid, Leaflet all loaded dynamically from CDN.

</td>
</tr>
</table>
</div>

---

## ✦ Agent Color Identity

<div align="center">

| Agent | Avatar | Color | CSS Variable | Role |
|:------|:------:|:-----:|:------------:|:-----|
| **Coordinator** | 🎯 | <span style="color:#8B5CF6">■</span> `#8B5CF6` | `--color-coord` | Orchestrates workflows, delegates tasks |
| **Researcher** | 🔬 | <span style="color:#06B6D4">■</span> `#06B6D4` | `--color-research` | Searches, synthesizes, cites |
| **Data Analyst** | 📊 | <span style="color:#F59E0B">■</span> `#F59E0B` | `--color-data` | Processes data, statistics, charts |
| **Writer** | ✍️ | <span style="color:#10B981">■</span> `#10B981` | `--color-writer` | Drafts, templates, formats |
| **Reviewer** | 🔍 | <span style="color:#EF4444">■</span> `#EF4444` | `--color-review` | QA, citations, compliance |
| **Librarian** | 📚 | <span style="color:#A855F7">■</span> `#A855F7` | `--color-librarian` | Memory, knowledge, references |

</div>

---

## ✦ Quick Start

```bash
# Clone & install
git clone https://github.com/codeandbrain/open-knowledge-studio.git
cd open-knowledge-studio
npm install

# Development
npm run dev        # → http://localhost:3000

# Production
npm run build      # → dist/
npm run preview

# Tests
npm test           # 74 tests across 6 files
npm run test:bench # Performance benchmarks
```

### Prerequisites

- **Node.js** v26.x (`.nvmrc` specifies 26)
- **npm** v11.x

---

## ✦ Documentation

Comprehensive documentation is available in the [`docs/`](docs/index.md) directory with **83 files across 12 sections**:

```
docs/
├── index.md                              # Master table of contents
│
├── project/                              # Core project docs (6 files)
│   ├── 000-overview.md                   # Project overview & quick start
│   ├── 001-concept.md                    # Vision, personas, glossary
│   ├── 002-specification.md              # Technical specifications
│   ├── 003-blueprint.md                  # Tech stack & roadmap
│   ├── 004-architecture.md               # System architecture
│   └── 005-design.md                     # UI/UX design system
│
├── developers/                           # Developer docs (12 files)
│   ├── 000-quickstart.md                 # 5-minute quickstart
│   ├── 001-setup.md                      # Complete setup guide
│   ├── 002-environment.md                # Environment variables & API keys
│   ├── 003-non-coder-guide.md            # Click-by-click non-developer guide
│   ├── 004-development.md                # Development guidelines
│   ├── 005-memory-architecture.md         # 6-tier memory deep dive
│   ├── 006-test-suite.md                 # Testing documentation
│   ├── 007-code-splitting.md             # Performance & code splitting
│   ├── 008-ci-cd.md                      # CI/CD pipeline
│   ├── 009-deployment.md                 # Docker, Vercel, Netlify guides
│   ├── 010-dependency-removal.md         # Zero-dependency architecture
│   └── 011-mcp-configuration.md          # MCP server configuration
│
├── guides/                               # User guides (11 files)
│   ├── 000-getting-started.md            # First-time user walkthrough
│   ├── 001-agents.md                     # A2A agents guide
│   ├── 002-workflows.md                  # Multi-agent workflows
│   ├── 003-diagrams.md                   # Diagram generation
│   ├── 004-pdf-export.md                 # PDF export
│   ├── 005-sandbox.md                    # Sandboxed execution
│   ├── 006-epi-map.md                    # Epidemiological map
│   ├── 007-icd11.md                      # ICD-11 lookup
│   ├── 008-connectors.md                 # Connectors guide
│   ├── 009-webhooks.md                   # Webhooks guide
│   └── 010-public-data.md               # Public data APIs
│
├── architecture/                         # Architecture Decision Records (7 files)
├── api/                                  # API reference (5 files)
├── security/                             # Security & trust model (4 files)
├── changelog/                            # Version history (1 file)
├── benchmarks/                           # Performance benchmarks (2 files)
├── i18n/                                 # Internationalization (1 file)
├── a11y/                                 # Accessibility (1 file)
├── ops/                                  # Docs operations (2 files)
└── agents/                               # Agent docs (30 files)
    ├── SKILL.md                          # Agent system overview
    ├── references/                       # System reference guide
    ├── coordinator/                      # 🎯 Coordinator (SKILL + refs + workflows)
    ├── researcher/                       # 🔬 Researcher (SKILL + refs + workflows)
    ├── data-analyst/                     # 📊 Data Analyst (SKILL + refs + workflows)
    ├── writer/                           # ✍️ Writer (SKILL + refs + workflows)
    ├── reviewer/                         # 🔍 Reviewer (SKILL + refs + workflows)
    ├── librarian/                        # 📚 Librarian (SKILL + refs + workflows)
    └── _template/                        # ❓ Custom agent template
```

> **Start here:** [`docs/index.md`](docs/index.md) → [`docs/project/000-overview.md`](docs/project/000-overview.md) → [`docs/developers/000-quickstart.md`](docs/developers/000-quickstart.md)

---

## ✦ Repository Structure

```
open-knowledge-studio/
├── .github/workflows/         # CI + Deploy GitHub Actions
├── docs/                      # 83 files, 12 sections (see above)
├── e2e/                       # Playwright E2E tests (7 spec files)
├── public/                    # Static assets (favicon, manifest, sw)
├── src/
│   ├── components/            # 25 React components (5 lazy-loaded)
│   ├── services/              # 12 application services
│   ├── db/                    # IndexedDB: 22 object stores
│   ├── hooks/                 # useChat, useFiles, usePWAInstall
│   ├── test/                  # 74 tests across 6 files
│   └── utils/                 # markdown parser, syntax highlighter
├── opencode.jsonc             # OpenCode agent configuration
├── AGENTS.md                  # Agent workspace instructions
├── vite.config.ts             # Vite + Tailwind + React config
└── vitest.config.ts           # Vitest + happy-dom + coverage
```

---

## ✦ Deployment

| Platform | Guide | Quick Command |
|:---------|:------|:--------------|
| <span style="color:#8B5CF6">◆</span> **GitHub Actions** | [`developers/008-ci-cd.md`](docs/developers/008-ci-cd.md) | `npm run typecheck && npm test && npm run build` |
| <span style="color:#06B6D4">◆</span> **Docker** | [`developers/009-deployment.md`](docs/developers/009-deployment.md) | `docker build -t oks . && docker run -p 8080:80 oks` |
| <span style="color:#10B981">◆</span> **Vercel** | [`developers/009-deployment.md`](docs/developers/009-deployment.md) | Import repo, preset Vite, deploy |
| <span style="color:#F59E0B">◆</span> **Netlify** | [`developers/009-deployment.md`](docs/developers/009-deployment.md) | Import repo, build `npm run build`, publish `dist` |

For API keys and credentials: [`developers/002-environment.md`](docs/developers/002-environment.md)

---

## ✦ License

<div align="center">

**MIT** — See [LICENSE](LICENSE) for details.

Built with React, Vite, Tailwind CSS, Transformers.js, Orama JS, KaTeX, Mermaid, Leaflet.

</div>
