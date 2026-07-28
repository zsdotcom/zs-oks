---
title: "000 — Changelog"
category: "changelog"
order: 0
tags: ["changelog", "version-history", "releases", "v2"]
last_updated: "2026-07-27"
---

# 000 — Changelog

Version history for **Open Knowledge Studio**.

---

## v2.0.0 — *Current Release*

**Release Date:** July 27, 2026
**Status:** Active

### Breaking Changes

- Single-agent architecture replaced with 6-agent A2A (Agent-to-Agent) debate system
- Hardcoded AI provider replaced with 6-provider abstraction layer (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama)
- Session-only memory upgraded to 6-tier memory architecture (Session, Episodic, Semantic, Procedural, Working, Long-Term)
- Plain IndexedDB access replaced with 19-object-store abstraction via `memoryApi.ts`
- Transformer-based embeddings (Transformers.js Web Worker) replace keyword-only search
- Orama hybrid search (vector + keyword) supersedes basic filtering
- UI theme system redesigned (7 themes, 12 accent colors, CSS custom properties)
- Build toolchain upgraded: Vite 8.1.5, TypeScript 7.0.2, Tailwind 4.x, Vitest 4.1.10

### New Features

- **6 A2A Debate Agents:** Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian — with system prompts, skills, tools, templates
- **Vector Embeddings:** Transformers.js in a dedicated Web Worker for compute embedding, 384-dim vectors
- **Orama Hybrid Search:** Unified vector + keyword semantic search across all memory tiers
- **22 IndexedDB Object Stores:** Comprehensive schema covering all 6 memory tiers, settings, skills, connectors, webhooks, sandbox cache, knowledge sources
- **Zero-Dependency Architecture:** Only `react` and `react-dom` at runtime; all other libraries loaded dynamically from CDN (Transformers.js, Orama, KaTeX 0.18.1, Mermaid 11.16.0, Leaflet 1.9.4)
- **PWA Offline Support:** Service worker registration, manifest, offline-capable via IndexedDB persistence
- **ICD-11 Lookup:** 50 curated codes across 23 chapters with search by code/title/chapter, FHIR-like data model
- **Epi Map:** Leaflet.js map with OpenStreetMap tiles, severity-coded markers, auto-fit bounds
- **KaTeX Rendering:** Real-time math typesetting (pinned to v0.18.1)
- **Mermaid Diagrams:** Flowcharts, pie charts, xy charts, sequence diagrams, class diagrams, Gantt charts (pinned to v11.16.0)
- **PDF Export:** Client-side PDF generation via browser print API and `exportToPDF()` helper
- **Sandboxed Code Execution:** iframe sandbox with `allow-scripts`, eval timeout, console capture, restricted globals
- **Skills Registry:** Pluggable skill definitions for agents with specialized workflows
- **External Connectors:** Webhook manager (create, test, log history), Google Workspace auth (OAuth 2.0 via GIS)
- **Code Splitting:** 5 `React.lazy()` panels (A2A Metrics, Google Workspace, Settings, MCP Server, Workspace Document Editor)
- **7 UI Themes:** Dark, Light, Sepia, Forest, Ocean, Midnight, Solarized
- **12 Accent Colors:** Purple to Pink spectrum
- **74 Unit/Integration Tests:** 6 test files with coverage thresholds (80/75/85/80)
- **E2E Testing:** 7 Playwright spec files, Chromium-only, auto-starts dev server
- **CI/CD:** GitHub Actions — typecheck, test, build, E2E (PR only), bundle analysis (main only), GitHub Pages deploy
- **Benchmark Suite:** 5 Vitest benchmarks for IndexedDB write throughput, vector search, key generation, batch writes, embedding generation

### Bug Fixes

- N/A — First v2 release

---

## v1.0.0 — *Initial Release*

**Release Date:** June 1, 2026
**Status:** Archived

### New Features

- Basic chat interface with single AI provider (Gemini)
- Session-based memory management
- Basic file management (upload, download, delete)
- Simple dark/light theme toggle
- Minimal IndexedDB persistence (3 stores)
- Monolithic component architecture (no code splitting)
- 15 unit tests

---

## See Also

- [Project Overview](../project/000-overview.md) — High-level introduction
- [Technical Specification](../project/002-specification.md) — Detailed feature specs
- [CI/CD Pipeline](../developers/008-ci-cd.md) — Build and deploy workflow
- [Development Guide](../developers/004-development.md) — Contributing to the project


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
