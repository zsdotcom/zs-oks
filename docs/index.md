# Open Knowledge Studio — Documentation Index

**Documentation Version:** 3.0
**Last Updated:** July 27, 2026

---

**Open Knowledge Studio** is a zero-dependency, browser-native, 6-agent A2A platform for offline-first research, writing, and data analysis. For a high-level introduction, see the [Project Overview](project/000-overview.md).

---

## 📋 Project Documentation

| # | Document | Description | Related |
|---|----------|-------------|---------|
| 000 | [Project Overview](project/000-overview.md) | Mission, philosophy, key capabilities, quick start, stats | [Concept](project/001-concept.md) · [Blueprint](project/003-blueprint.md) |
| 001 | [Concept & Vision](project/001-concept.md) | Product vision, user personas, value proposition, differentiators, glossary | [Overview](project/000-overview.md) · [Specification](project/002-specification.md) |
| 002 | [Technical Specification](project/002-specification.md) | Complete feature specs, component/service catalog, IndexedDB schema, CDN libs | [Architecture](project/004-architecture.md) · [Blueprint](project/003-blueprint.md) |
| 003 | [Blueprint](project/003-blueprint.md) | Tech stack, architecture principles, success metrics, CI pipeline, roadmap | [Overview](project/000-overview.md) · [Specification](project/002-specification.md) |
| 004 | [System Architecture](project/004-architecture.md) | Architecture diagram, component tree, data flow, state management, security | [Design](project/005-design.md) · [ADR](../architecture/000-index.md) |
| 005 | [UI/UX Design](project/005-design.md) | Cyber-minimalist design system: colors, typography, layout, elevation, components | [Architecture](project/004-architecture.md) · [Guides](../guides/000-getting-started.md) |

## 🛠️ Developer Documentation

| # | Document | Description | Related |
|---|----------|-------------|---------|
| 000 | [5-Minute Quickstart](developers/000-quickstart.md) | Clone, install, configure, run — from zero to running in 5 minutes | [Setup](developers/001-setup.md) · [Environment](developers/002-environment.md) |
| 001 | [Complete Setup Guide](developers/001-setup.md) | Prerequisites, installation steps, troubleshooting | [Quickstart](developers/000-quickstart.md) · [Deployment](developers/009-deployment.md) |
| 002 | [Environment Variables & API Keys](developers/002-environment.md) | All VITE_* env vars, where to get API keys, security best practices | [Setup](developers/001-setup.md) · [Security](../security/000-index.md) |
| 003 | [Non-Coder Guide](developers/003-non-coder-guide.md) | Click-by-click setup for non-developers: install Node, clone, get keys, run | [Quickstart](developers/000-quickstart.md) · [Environment](developers/002-environment.md) |
| 004 | [Development Guidelines](developers/004-development.md) | Coding standards, TypeScript strict mode, git workflow, contribution guide | [Tests](developers/006-test-suite.md) · [CI/CD](developers/008-ci-cd.md) |
| 005 | [Memory Architecture](developers/005-memory-architecture.md) | 6-tier memory deep dive, vector embedding pipeline, Orama search, cross-tier ops | [API: Memory](../api/001-memory-api.md) · [ADR-002](../architecture/002-6-tier-memory.md) |
| 006 | [Test Suite](developers/006-test-suite.md) | 74 tests across 6 files, coverage thresholds, mock behavior, benchmark suite | [Development](developers/004-development.md) · [Benchmarks](../benchmarks/000-index.md) |
| 007 | [Code Splitting & Performance](developers/007-code-splitting.md) | 5 lazy-loaded components, Suspense pattern, direct imports list, bundle targets | [ADR-004](../architecture/004-code-splitting.md) · [Dependencies](developers/010-dependency-removal.md) |
| 008 | [CI/CD Pipeline](developers/008-ci-cd.md) | GitHub Actions workflows (ci.yml, deploy.yml), secrets, local CI simulation | [Deployment](developers/009-deployment.md) · [Docs Ops](../ops/000-docs-ci-cd.md) |
| 009 | [Deployment Guide](developers/009-deployment.md) | Docker, Vercel, Netlify — step-by-step for each, comparison table | [CI/CD](developers/008-ci-cd.md) · [Environment](developers/002-environment.md) |
| 010 | [Zero-Dependency Architecture](developers/010-dependency-removal.md) | Dependency philosophy, removed libs table, CDN imports, native API alternatives | [Code Splitting](developers/007-code-splitting.md) · [ADR-001](../architecture/001-zero-npm-dependency.md) |
| 011 | [MCP Configuration](developers/011-mcp-configuration.md) | MCP server setup, built-in tools, add/configure, troubleshooting | [Deployment](developers/009-deployment.md) · [Guides](../guides/000-getting-started.md) |

## 📖 User Guides

| # | Document | Description | Related |
|---|----------|-------------|---------|
| 000 | [Getting Started](guides/000-getting-started.md) | First-time user walkthrough: interface tour, first chat, first document | [Agents](guides/001-agents.md) · [Quickstart](developers/000-quickstart.md) |
| 001 | [A2A Agents](guides/001-agents.md) | 6 debate agents, system prompts, skills/tools, A2A panel, custom agent creation | [Workflows](guides/002-workflows.md) · [Memory](developers/005-memory-architecture.md) |
| 002 | [Multi-Agent Workflows](guides/002-workflows.md) | Orchestrated (decompose → execute → synthesize) and Sequential (chain) modes | [Agents](guides/001-agents.md) · [Architecture](project/004-architecture.md) |
| 003 | [Diagram Generation](guides/003-diagrams.md) | KaTeX math, Mermaid diagrams (8 types), Data Analyst diagram prompt, examples | [PDF Export](guides/004-pdf-export.md) · [Design](project/005-design.md) |
| 004 | [PDF Export](guides/004-pdf-export.md) | Print-to-PDF and Export PDF buttons, print styles, KaTeX in export | [Diagrams](guides/003-diagrams.md) · [Development](developers/004-development.md) |
| 005 | [Sandboxed Execution](guides/005-sandbox.md) | iframe sandbox, security model, available/restricted globals, configuration | [Agents](guides/001-agents.md) · [Tests](developers/006-test-suite.md) |
| 006 | [Epidemiological Map](guides/006-epi-map.md) | Leaflet.js map, severity-coded markers, popup details, auto-fit bounds | [ICD-11](guides/007-icd11.md) · [Architecture](project/004-architecture.md) |
| 007 | [ICD-11 Lookup](guides/007-icd11.md) | 50 curated ICD-11 codes across 23 chapters, FHIR integration, collapsible groups | [Epi Map](guides/006-epi-map.md) · [Tests](developers/006-test-suite.md) |
| 008 | [Connectors](guides/008-connectors.md) | GitHub, Slack, RSS, email connectors — setup guide for each | [Webhooks](guides/009-webhooks.md) · [Development](developers/004-development.md) |
| 009 | [Webhooks](guides/009-webhooks.md) | Webhook event system, creation flow, payload format, use cases | [Connectors](guides/008-connectors.md) · [MCP](developers/011-mcp-configuration.md) |
| 010 | [Public Data APIs](guides/010-public-data.md) | CDC, WHO, FluView, COVIDcast, Pathogen, Weather, Air Quality data browser | [ICD-11](guides/007-icd11.md) · [Epi Map](guides/006-epi-map.md) |

## 🏗️ Architecture Decisions

| # | Document | Status | Description |
|---|----------|--------|-------------|
| 000 | [ADR Index](architecture/000-index.md) | — | ADR format, status key, full ADR roster |
| 001 | [Zero NPM Dependency](architecture/001-zero-npm-dependency.md) | ✅ Accepted | Only react + react-dom at build time; CDN for ML/search/math/diagrams |
| 002 | [6-Tier Memory](architecture/002-6-tier-memory.md) | ✅ Accepted | Session → Episodic → Semantic (vector) → Procedural → Working → Long-Term |
| 003 | [Vector Embeddings in Web Worker](architecture/003-vector-web-worker.md) | ✅ Accepted | Transformers.js in background Worker with 30s timeout, zero-vector fallback |
| 004 | [Code Splitting Strategy](architecture/004-code-splitting.md) | ✅ Accepted | React.lazy for 5 heaviest panels; Suspense with centered loading UI |
| 005 | [IndexedDB Schema](architecture/005-indexeddb-schema.md) | ✅ Accepted | 22 object stores v2, generic CRUD, no backend dependency |
| 006 | [PWA & Offline Architecture](architecture/006-pwa-offline.md) | ✅ Accepted | Service Worker caches Vite assets; install prompt; offline-capable core |

## 📡 API Reference

| # | Document | Description |
|---|----------|-------------|
| 000 | [API Index](api/000-index.md) | Overview of all service APIs |
| 001 | [Memory API](api/001-memory-api.md) | Complete reference: all 6-tier memory functions with signatures, types, examples |
| 002 | [IndexedDB Schema](api/002-indexeddb.md) | All 22 object stores, key paths, indexes, CRUD operations |
| 003 | [Gemini/LLM Service](api/003-gemini-service.md) | 6-provider LLM router, unified API, streaming, A2A debate workflows |
| 004 | [Sandbox API](api/004-sandbox-api.md) | executeCode(), cleanupSandbox(), SandboxResult type, available globals |

## 🔒 Security & Trust

| # | Document | Description |
|---|----------|-------------|
| 000 | [Security Index](security/000-index.md) | Security philosophy, trust model overview |
| 001 | [Threat Model](security/001-threat-model.md) | Assets, threats, mitigations — mapped to code-level implementation |
| 002 | [Data Privacy](security/002-data-privacy.md) | Data residency, telemetry policy, user controls, offline isolation |
| 003 | [API Key Management](security/003-api-key-management.md) | Key storage, env vars, rotation, Settings panel workflow |

## 📊 Performance & Benchmarks

| # | Document | Description |
|---|----------|-------------|
| 000 | [Benchmarks Overview](benchmarks/000-index.md) | How to run benchmarks, environment, results summary table |
| 001 | [Detailed Results](benchmarks/001-results.md) | Write throughput, vector search, key gen, batch write, embedding — methodology & results |

## ♿ Accessibility

| # | Document | Description |
|---|----------|-------------|
| 000 | [A11Y Documentation](a11y/000-a11y.md) | Current features, not-yet-implemented items, roadmap |

## 🌐 Internationalization

| # | Document | Description |
|---|----------|-------------|
| 000 | [i18n Strategy](i18n/000-i18n.md) | Current state, Intl API approach, RTL considerations, community contributions |

## 📝 Changelog

| # | Document | Description |
|---|----------|-------------|
| 000 | [Changelog](changelog/000-changelog.md) | Full version history (v1.0.0 → v2.0.0) with dates and features |

## ⚙️ Operations

| # | Document | Description |
|---|----------|-------------|
| 000 | [Docs Publishing Pipeline](ops/000-docs-ci-cd.md) | Strategy for publishing docs as a static site (Docsify, VitePress, GitHub Pages) |
| 001 | [Documentation Style Guide](ops/001-docs-style-guide.md) | Markdown conventions, frontmatter schema, cross-reference format, tone |

## 🤖 In-App Agents

| Area | Documentation | Description |
|------|--------------|-------------|
| **Agent System** | [SKILL.md](agents/SKILL.md) · [Reference](agents/references/index.md) | All agent documentation (skills, templates, tools, workflows) |
| **Coordinator** 🎯 | [SKILL.md](agents/coordinator/SKILL.md) · [Templates](agents/coordinator/references/TEMPLATES.md) · [Tools](agents/coordinator/references/TOOLS.md) | Workflow orchestration, delegation, validation |
| **Researcher** 🔬 | [SKILL.md](agents/researcher/SKILL.md) · [Templates](agents/researcher/references/TEMPLATES.md) · [Tools](agents/researcher/references/TOOLS.md) | Literature synthesis, source evaluation, citation management |
| **Data Analyst** 📊 | [SKILL.md](agents/data-analyst/SKILL.md) · [Templates](agents/data-analyst/references/TEMPLATES.md) · [Tools](agents/data-analyst/references/TOOLS.md) | Statistical analysis, data cleaning, visualization |
| **Writer** ✍️ | [SKILL.md](agents/writer/SKILL.md) · [Templates](agents/writer/references/TEMPLATES.md) · [Tools](agents/writer/references/TOOLS.md) | Document drafting, template application, formatting |
| **Reviewer** 🔍 | [SKILL.md](agents/reviewer/SKILL.md) · [Templates](agents/reviewer/references/TEMPLATES.md) · [Tools](agents/reviewer/references/TOOLS.md) | Quality checks, citation audit, compliance validation |
| **Librarian** 📚 | [SKILL.md](agents/librarian/SKILL.md) · [Templates](agents/librarian/references/TEMPLATES.md) · [Tools](agents/librarian/references/TOOLS.md) | Memory maintenance, reference management, knowledge organization |
| **Template** ❓ | [SKILL.md](agents/_template/SKILL.md) · [Templates](agents/_template/references/TEMPLATES.md) · [Tools](agents/_template/references/TOOLS.md) | Custom agent creation template |

---

## Quick Reference

| Metric | Value |
|--------|-------|
| **Runtime dependencies** | 2 (`react`, `react-dom`) |
| **Test count** | 74 across 6 files |
| **Test coverage thresholds** | >80% statements, >75% branches, >85% functions, >80% lines |
| **Build size** | ~90 KB gzip |
| **IndexedDB stores** | 22 |
| **Components** | 25 (5 lazy-loaded) |
| **Services** | 12 |
| **Built-in agents** | 6 (Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian) |
| **AI providers** | 6 (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama) |
| **CDN libraries** | 5 (Transformers.js, Orama, KaTeX, Mermaid, Leaflet) |
| **License** | MIT |

---

*Start with the [Project Overview](project/000-overview.md) for a high-level introduction, or the [5-Minute Quickstart](developers/000-quickstart.md) to get running immediately.*
