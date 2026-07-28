---
title: "000 — Project Overview"
description: "Mission, philosophy, key capabilities, quick start, and statistics for Open Knowledge Studio v2.0"
category: "project"
order: 0
tags: ["overview", "mission", "capabilities"]
last_updated: "2026-07-28"
audience: "stakeholders"
---
# 000 — Project Overview

**Open Knowledge Studio v2.0** is a zero-npm-dependency, browser-native, 6-agent A2A platform for offline-first research, writing, and data analysis. It operates entirely within the browser using IndexedDB for persistent memory, Transformers.js for vector embeddings, and Orama JS for semantic search — all loaded dynamically from CDN with only two build-time dependencies: `react` and `react-dom`.

---

## 1. Mission

Democratize access to powerful AI tooling for research and knowledge management without requiring users to rely on expensive cloud services or complex infrastructure.

## 2. Core Philosophy

| Principle | Implementation |
| :--- | :--- |
| **Zero Backend** | Entire application runs client-side. No servers, no databases to manage. |
| **Local-First** | All data persists in IndexedDB. Works offline. Privacy-preserving by design. |
| **Zero Deps** | Only `react` + `react-dom` at build time. ML, search, math, and diagram libraries load dynamically from CDN. |
| **Multi-Provider AI** | Unified router for Gemini, OpenAI, Anthropic, DeepSeek, Groq, and local Ollama. |
| **Multi-Agent A2A** | 6 debate agents with distinct roles, colors, and system prompts for collaborative analysis. |
| **Vector-Native Memory** | 384-dim embeddings via Transformers.js (Web Worker) for semantic search across a 6-tier memory architecture. |

## 3. Key Capabilities

| Capability | Description |
| :--- | :--- |
| **6-Agent A2A Debate** | Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian — all respond independently to user prompts. |
| **Vector Embeddings** | Transformers.js (`all-MiniLM-L6-v2`) in a Web Worker generates 384-dim vectors. |
| **Hybrid Semantic Search** | Orama JS provides vector + keyword search with fallback to token matching. |
| **6-Tier Memory** | Session, Episodic, Semantic (vector-indexed), Procedural, Working, Long-Term. |
| **Chat + Editor + Kanban** | Collaborative AI chat, split-pane markdown editor, drag-drop task board. |
| **Google Workspace** | OAuth-based Drive, Docs, Sheets, and Gmail integration. |
| **MCP Server** | Model Context Protocol server configuration for external tool integration. |
| **ICD-11 Lookup** | 50 curated medical codes across 23 chapters, with FHIR integration. |
| **Epi Map** | Leaflet.js epidemiological map with severity-coded markers. |
| **Sandboxed Execution** | Secure iframe-based JavaScript sandbox for agent code execution. |
| **PWA Offline-First** | Service Worker caches all assets for offline use. Installable as standalone app. |
| **Code Splitting** | React.lazy for heavy panels (A2A Metrics, Editor, Settings, MCP, Google). |
| **Diagrams + Math** | Mermaid diagrams and KaTeX math rendering in chat. |
| **PDF Export** | Client-side PDF generation with print styles and KaTeX support. |
| **Skills + Connectors** | Extensible skill registry for agents; GitHub, Slack, RSS, webhook connectors. |

## 4. Quick Start

```bash
git clone https://github.com/zsdotcom/zs-oks.git
cd open-knowledge-studio
npm install
npm run dev
```

Open `http://localhost:3000`.

## 5. Production Build

```bash
npm run build      # tsc --noEmit && vite build → dist/
npm run preview    # serve dist/ locally
```

## 6. Quick Stats

| Metric | Value |
| :--- | :--- |
| Runtime dependencies | 2 (`react`, `react-dom`) |
| Test count | 74 across 6 files |
| Test coverage | >80% statements, >75% branches, >85% functions, >80% lines |
| Build size | ~90 KB gzip |
| IndexedDB stores | 22 |
| Components | 25 |
| Services | 12 |
| Agents | 6 (built-in) + custom |
| AI providers | 6 (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama) |

---

## See Also

- [001 — Concept & Vision](001-concept.md) — User personas, value proposition, glossary
- [002 — Technical Specification](002-specification.md) — Features, capabilities, requirements
- [003 — Blueprint](003-blueprint.md) — Tech stack, metrics, roadmap
- [004 — Architecture](004-architecture.md) — System architecture, directory structure, data model
- [005 — Design](005-design.md) — UI/UX design system and visual language
- [Index](index.md) — Full documentation index

---

*Last updated: July 27, 2026*

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
