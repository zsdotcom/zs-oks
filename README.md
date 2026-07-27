<div align="center">

# ⬡ Open Knowledge Studio v2.0

**Zero-dependency · Browser-native · 12-Agent A2A Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-087EA4?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=flat)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-227-8B5CF6?style=flat)]()
[![Build](https://img.shields.io/badge/Build-~90KB_gzip-4CD7F6?style=flat)]()

A private AI research laboratory in your browser — 6 specialized agents collaborate on your work, all data stays local, zero backend required.

</div>

---

## ✦ Overview

A private AI research laboratory in your browser — 12 specialized agents collaborate on your work, all data stays local, zero backend required.

Open Knowledge Studio operates entirely within your browser using IndexedDB for persistent memory, Transformers.js for vector embeddings, and Orama JS for hybrid semantic search — all ML/search libraries loaded dynamically from CDN. Only `react` + `react-dom` at build time. Cross-session memory aggregates agent learnings across all conversations.

### Core Stats

| Metric | Value |
|:-------|:------|
| ⚡ Runtime deps | 2 (`react`, `react-dom`) |
| 🧪 Tests | 227 across 14 files |
| 📦 Build size | ~90 KB gzip |
| 🗄️ IndexedDB stores | 22 |
| 🧩 Components | 25 (5 lazy-loaded) |
| 🔧 Services | 19 |
| 🤖 Built-in agents | 12 + custom |
| 🌐 AI providers | 10 (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama, OpenRouter, Cerebras, GitHub, Cloudflare) |

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

### 🤖 12-Agent A2A Debate
Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian, Security Analyst, Code Reviewer, Planning Agent, Testing Agent, Code Generator, Knowledge Curator — each with unique color, avatar, and system prompt. Cross-session memory aggregates past learnings.

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
Unified router for Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama, OpenRouter, Cerebras, GitHub, Cloudflare — single API, 10 providers.

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
| **Security Analyst** | 🛡️ | <span style="color:#EF4444">■</span> `#EF4444` | `--color-security` | Code security, vulnerability audit |
| **Code Reviewer** | 🔎 | <span style="color:#6366F1">■</span> `#6366F1` | `--color-codereview` | Code quality, best practices |
| **Planning Agent** | 📋 | <span style="color:#14B8A6">■</span> `#14B8A6` | `--color-planner` | Task decomposition, execution plans |
| **Testing Agent** | 🧪 | <span style="color:#84CC16">■</span> `#84CC16` | `--color-tester` | Test generation, validation |
| **Code Generator** | ⚡ | <span style="color:#F97316">■</span> `#F97316` | `--color-codegen` | Source code generation |
| **Knowledge Curator** | 🏛️ | <span style="color:#A855F7">■</span> `#A855F7` | `--color-curator` | Knowledge organization, cross-linking |

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
npm test           # 227 tests across 14 files
npm run test:bench # Performance benchmarks
```

### Prerequisites

- **Node.js** v26.x (`.nvmrc` specifies 26)
- **npm** v11.x

---

## ✦ Brand Assets

- **Brand guidelines:** [`docs/project/006-brand-guidelines.md`](docs/project/006-brand-guidelines.md) — positioning, voice, tone, messaging, visual identity rules
- **Free resource catalog:** [`docs/free-resources.md`](docs/free-resources.md) — free MCP servers, Cloudflare tier, CDN libraries, public-health APIs

---

## ✦ Documentation

Comprehensive documentation is available in the [`docs/`](docs/index.md) directory with **130+ files across 13 sections**:

```
docs/
├── index.md                              # Master table of contents
│
├── project/                              # Core project docs (7 files)
│   ├── 000-overview.md                   # Project overview & quick start
│   ├── 001-concept.md                    # Vision, personas, glossary
│   ├── 002-specification.md              # Technical specifications
│   ├── 003-blueprint.md                  # Tech stack & roadmap
│   ├── 004-architecture.md               # System architecture
│   ├── 005-design.md                     # UI/UX design system
│   └── 006-brand-guidelines.md           # Brand guidelines & messaging
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
├── guides/                               # User guides (14 files)
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
│   ├── 010-public-data.md                # Public data APIs
│   ├── 011-google-oauth-setup.md         # Google OAuth setup guide
│   ├── 012-bd-health-system.md           # Bangladesh Health Ecosystem
│   └── 013-bd-core-fhir.md               # Bangladesh Core FHIR IG
│
├── architecture/                         # Architecture Decision Records (7 files)
├── api/                                  # API reference (5 files)
├── security/                             # Security & trust model (4 files)
├── changelog/                            # Version history (1 file)
├── benchmarks/                           # Performance benchmarks (2 files)
├── i18n/                                 # Internationalization (1 file)
├── a11y/                                 # Accessibility (1 file)
├── ops/                                  # Docs operations (2 files)
├── agents/                               # Agent docs (66 files)
│   ├── SKILL.md / references/            # Agent system overview
│   ├── Built-in (12): coordinator, researcher, data-analyst, writer, reviewer, librarian, security-analyst, code-reviewer, planner, tester, code-generator, knowledge-curator
│   ├── Persona guides (9): epistemologist, bioinformatician, field-epidemiologist,
│   │                      clinical-trialist, data-journalist, genomic-analyst,
│   │                      environmental-epidemiologist, health-economist, vaccinologist
│   └── _template/                        # Custom agent template
├── onboarding/                           # Onboarding journey (15 files)
└── free-resources.md                     # Free MCPs, Cloudflare, APIs, CDN libs
```

> **Start here:** [`docs/index.md`](docs/index.md) → [`docs/project/000-overview.md`](docs/project/000-overview.md) → [`docs/developers/000-quickstart.md`](docs/developers/000-quickstart.md)

---

## ✦ Repository Structure

```
open-knowledge-studio/
├── .github/workflows/         # CI + Deploy GitHub Actions
├── docs/                      # 130+ files, 13 sections (see above)
├── e2e/                       # Playwright E2E tests (7 spec files)
├── public/                    # Static assets (favicon, manifest, sw)
├── src/
│   ├── components/            # 30+ React components (5 lazy-loaded)
│   ├── services/              # 16 application services
│   ├── db/                    # IndexedDB: 22 object stores
│   ├── hooks/                 # useChat, useFiles, usePWAInstall
│   ├── data/                  # Extracted constants (mcpServers, navigation)
│   ├── test/                  # 227 tests across 14 files
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
