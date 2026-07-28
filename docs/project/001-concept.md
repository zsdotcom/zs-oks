---
title: "001 — Concept & Vision"
description: "Product vision, user personas, value proposition, differentiators, and glossary"
category: "project"
order: 1
tags: ["vision", "personas", "value-proposition"]
last_updated: "2026-07-28"
audience: "stakeholders"
---
# 001 — Concept & Vision

## 1. Product Vision

Open Knowledge Studio envisions a world where **every researcher, writer, and analyst has access to a private AI-powered research laboratory** that runs entirely in their browser — no cloud costs, no data leaks, no vendor lock-in.

The product is a **single-page application** that replaces a suite of tools (chat assistants, document editors, knowledge bases, diagram tools, code sandboxes, mapping tools) with a unified, local-first, AI-augmented workspace.

## 2. Target Audience

### Primary Personas

| Persona | Description | Primary Use Case | Pain Point Solved |
| :--- | :--- | :--- | :--- |
| **Independent Researcher** | Academic or self-funded researcher working on literature reviews, data analysis, and paper drafting | Multi-agent A2A research workflows with citation management | Expensive cloud tools, fragmented research workflows |
| **Public Health Analyst** | Epidemiologist or health policy analyst tracking disease outbreaks and analyzing health data | Epi mapping, ICD-11 lookups, statistical analysis, report generation | Need for integrated mapping + coding + analysis tools |
| **Technical Writer** | Developer advocate or documentation specialist creating technical content | AI-assisted drafting, diagram generation, PDF export, template management | Manual formatting, disconnected writing tools |
| **Data Journalist** | Journalist working with public datasets to produce data-driven stories | Data cleaning, statistical analysis, visualization, collaborative review | Lack of privacy-first analysis tools, complex setup |
| **Knowledge Manager** | Librarian or information architect organizing institutional knowledge | Knowledge base management, semantic search, reference management, taxonomy building | Information silos, poor discoverability |

### Secondary Personas

| Persona | Description | Primary Use Case |
| :--- | :--- | :--- |
| **Developer** | Building custom tools or integrating Open Knowledge Studio into workflows | MCP server configuration, custom agent creation, API integration |
| **Privacy-Conscious User** | Anyone who wants AI assistance without sending data to third parties | Local-first operation, offline mode, no data leaves the browser |
| **Student** | Graduate or postgraduate student working on thesis or research projects | Literature review, citation management, writing assistance |
| **NGO/Field Worker** | Worker in low-connectivity environments needing offline-capable research tools | Offline-first operation, PWA installability, sandboxed execution |

## 3. Value Proposition

| For | Value |
| :--- | :--- |
| **Researchers** | A private AI research lab in the browser. 12 specialized agents collaborate on your work. Zero cost for ML compute (local embeddings). |
| **Public Health Analysts** | Integrated epidemiological tools: ICD-11 coding, disease mapping, statistical analysis, report generation — all in one app. |
| **Technical Writers** | AI-assisted drafting with Mermaid diagrams, KaTeX math, markdown editing, and one-click PDF export. |
| **Developers** | Extensible architecture: MCP protocol, custom agents, skills registry, connector system, sandboxed code execution. |
| **Privacy Advocates** | All computation happens locally. No data leaves the browser. Optional offline mode. Open source (MIT). |

## 4. Key Differentiators

| Differentiator | Open Knowledge Studio | Alternatives |
| :--- | :--- | :--- |
| **Local ML** | Transformers.js in a Web Worker — zero-cost, privacy-preserving embeddings | Cloud APIs charge per token or per query |
| **Zero Backend** | Entire app runs client-side. No servers, no databases, no DevOps | Most AI tools require backend infrastructure |
| **Multi-Agent A2A** | 12 specialized agents debate and collaborate on user prompts | Single-chat models with no role specialization |
| **6-Tier Memory** | Structured memory architecture with vector search | Flat chat history or no persistent memory |
| **Offline-First** | PWA with service worker caching. Installable, works without internet | Web-only, require constant connectivity |
| **CDN-Dynamic ML** | Heavy libraries loaded from CDN at runtime, not bundled | Bundled ML libraries bloat initial load |
| **Open Source** | MIT license. Fork, modify, self-host freely | Proprietary SaaS with usage limits and data policies |

## 5. Glossary

| Term | Definition |
| :--- | :--- |
| **A2A** | Agent-to-Agent protocol. Multiple AI agents communicate and collaborate within a shared context. |
| **A2A Agent** | An AI agent with a defined role, system prompt, color identity, skills, and tools participating in A2A debates. |
| **Semantic Memory** | Memory tier that stores text with 384-dim vector embeddings for similarity search. |
| **Embedding** | A numerical vector (384 dimensions) representing the semantic meaning of text, generated by Transformers.js. |
| **Orama** | Client-side vector search library dynamically loaded from CDN. Enables hybrid (vector + keyword) search. |
| **Transformers.js** | JavaScript port of Hugging Face Transformers. Runs in a Web Worker for local ML inference. |
| **Web Worker** | Background thread for running ML inference without blocking the UI thread. |
| **IndexedDB** | Browser-native NoSQL database for persistent client-side storage. Scales to GBs. |
| **MCP** | Model Context Protocol — a standard for connecting AI agents to external tools and services. |
| **PWA** | Progressive Web Application. Installable, offline-capable web app. |
| **Service Worker** | Script the browser runs in the background to enable offline caching and PWA features. |
| **ICD-11** | International Classification of Diseases, 11th Revision. WHO standard for medical coding. |
| **FHIR** | Fast Healthcare Interoperability Resources. HL7 standard for healthcare data exchange. |
| **KaTeX** | JavaScript library for rendering LaTeX math expressions. Loaded from CDN. |
| **Mermaid** | JavaScript library for generating diagrams from text definitions. Loaded from CDN. |
| **Leaflet.js** | JavaScript library for interactive maps. Loaded from CDN. Uses OpenStreetMap tiles. |
| **Skill** | A registered capability in the skill registry. Skills define what agents can do and when they activate. |
| **Connector** | Integration with external services (GitHub, Slack, RSS, email, webhooks). |
| **Sandbox** | Secured iframe environment for executing untrusted code with restricted globals and timeout. |
| **Ollama** | Local LLM server. Supported as a provider alongside cloud APIs. |

## 6. Design Principles

1. **Privacy First** — All data stays in the browser. No telemetry, no cloud sync without explicit user action.
2. **Offline Capable** — The app must function without internet for core features. CDN-dependent features degrade gracefully.
3. **Performance Obsession** — Bundle size under 100 KB gzip. Sub-50ms for semantic search. Sub-100ms for embedding generation.
4. **Zero Lock-In** — Open source (MIT), standard protocols (MCP), portable data (IndexedDB → JSON export).
5. **Progressive Enhancement** — Features tier up with connectivity. Basic functionality works offline; CDN-dependent features (ML, search, diagrams) enhance when online.
6. **Extensibility** — Custom agents, skills, connectors, and MCP tools can be added without modifying core code.

---

## See Also

- [000 — Project Overview](000-overview.md) — High-level introduction and quick start
- [002 — Technical Specification](002-specification.md) — Detailed features and capabilities
- [003 — Blueprint](003-blueprint.md) — Tech stack and success metrics
- [Index](../index.md) — Full documentation index

---

*Last updated: July 27, 2026*

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
