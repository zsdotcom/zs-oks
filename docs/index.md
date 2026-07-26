# Open Knowledge Studio — Documentation Index

**Documentation Version:** 2.0
**Last Updated:** July 26, 2026

---

**Open Knowledge Studio** is a zero-dependency, browser-native, 6-agent AI platform for offline-first research, writing, and data analysis. For a quick introduction, see the [Project Overview](project/000-overview.md).

---

## 📋 Project & Features

High-level project documentation covering vision, architecture, design, and status.

| # | Document | Description | Related |
|---|----------|-------------|---------|
| 000 | [Project Overview](project/000-overview.md) | Vision, mission, core features, 6-agent A2A system, zero-dependency architecture | [Agents](guides/060-agents.md) · [Memory](developers/070-memory-architecture.md) |
| 010 | [Blueprint](project/010-blueprint.md) | Core features, success metrics, coverage targets, build size goals | [Tests](developers/080-test-suite.md) · [Setup](developers/050-setup.md) |
| 020 | [Architecture](project/020-architecture.md) | System architecture, component tree, vector embedding pipeline, search pipeline, IndexedDB schema | [Memory](developers/070-memory-architecture.md) · [Dependencies](developers/100-dependency-removal.md) |
| 030 | [UI/UX Design](project/030-design.md) | Design decisions, 6-agent color identity system, theme system, layout | [Agents](guides/060-agents.md) · [Diagrams](guides/092-diagrams.md) |
| 090 | [Feature Status](project/090-feature-status.md) | Implementation status, gap analysis, tech stack status, build & test metrics | [Tests](developers/080-test-suite.md) · [Blueprint](project/010-blueprint.md) |
| 100 | [Reference](project/100-reference.md) | API keys, credentials, .env file format, environment variable reference, security notes | [Setup](developers/050-setup.md) · [Deployment](developers/099-deployment.md) |
| 110 | [Repository Tree](project/110-repository-tree.md) | Complete file structure with src/ and docs/ tree | [Dev Guide](developers/040-development.md) · [Architecture](project/020-architecture.md) |

## 🛠️ Developer Docs

Technical documentation for developers contributing to or extending the project.

| # | Document | Description | Related |
|---|----------|-------------|---------|
| 040 | [Development Guide](developers/040-development.md) | Coding standards, TypeScript strict mode, zero-dependency rule, git workflow, testing strategy (74 tests across 6 files) | [Setup](developers/050-setup.md) · [Tests](developers/080-test-suite.md) |
| 050 | [Setup Guide](developers/050-setup.md) | Prerequisites (Node.js, npm, Git), installation steps, environment variables, running dev server, troubleshooting | [Reference](project/100-reference.md) · [Deployment](developers/099-deployment.md) |
| 070 | [Memory Architecture](developers/070-memory-architecture.md) | 6-tier memory (Session, Episodic, Semantic, Procedural, Working, Long-Term), vector embedding pipeline, Orama search, cross-tier operations | [Overview](project/000-overview.md) · [Tests](developers/080-test-suite.md) |
| 080 | [Test Suite](developers/080-test-suite.md) | Test architecture (memory unit 25, memory integration 9, benchmarks 5, gemini 18, sandbox 9, ICD-11 18 = 74 total), coverage thresholds, mock worker behavior | [Development](developers/040-development.md) · [Blueprint](project/010-blueprint.md) |
| 095 | [Code Splitting](developers/095-code-splitting.md) | React.lazy lazy-loading strategy for heavy components (A2A, Editor, Settings, MCP, Google), Suspense fallbacks | [Dependencies](developers/100-dependency-removal.md) · [Architecture](project/020-architecture.md) |
| 098 | [CI/CD Pipeline](developers/098-cicd-pipeline.md) | GitHub Actions CI workflow (typecheck, test, build, E2E, bundle analysis), GitHub Pages deployment | [Deployment](developers/099-deployment.md) · [Reference](project/100-reference.md) |
| 099 | [Deployment](developers/099-deployment.md) | Docker (multi-stage build, nginx), Vercel (GitHub import, environment variables), Netlify (redirects, TOML config), comparison | [Setup](developers/050-setup.md) · [CI/CD](developers/098-cicd-pipeline.md) |
| 100 | [Dependency Removal](developers/100-dependency-removal.md) | Zero-dependency philosophy, removed dependencies table, CDN dynamic imports, native browser API alternatives | [Code Splitting](developers/095-code-splitting.md) · [Architecture](project/020-architecture.md) |

## 📖 User Guides

End-user documentation for features and workflows.

| # | Document | Description | Related |
|---|----------|-------------|---------|
| 060 | [A2A Agents](guides/060-agents.md) | 6 debate agents (Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian), system prompts, custom agent creation, debate flow | [Workflows](guides/091-workflows.md) · [Memory](developers/070-memory-architecture.md) |
| 091 | [Multi-Agent Workflows](guides/091-workflows.md) | Orchestrated (Coordinator decomposes → specialists execute → synthesis) and Sequential (agent chain) workflow modes | [Agents](guides/060-agents.md) · [Architecture](project/020-architecture.md) |
| 092 | [Diagram Generation](guides/092-diagrams.md) | KaTeX math rendering, Mermaid diagrams (flowcharts, pie, xy, sequence, class, Gantt), Data Analyst diagram prompt | [PDF Export](guides/093-pdf-export.md) · [Design](project/030-design.md) |
| 093 | [PDF Export](guides/093-pdf-export.md) | Print-to-PDF and Export PDF buttons, print styles, KaTeX support in exported HTML, `exportToPDF()` API | [Diagrams](guides/092-diagrams.md) · [Development](developers/040-development.md) |
| 094 | [Sandboxed Execution](guides/094-sandbox.md) | iframe sandbox with `allow-scripts`, eval with timeout, console capture, restricted globals, configuration | [Agents](guides/060-agents.md) · [Tests](developers/080-test-suite.md) |
| 096 | [Epidemiological Map](guides/096-epi-map.md) | Leaflet.js map with OpenStreetMap tiles, severity-coded markers (green/yellow/orange/red), popup details | [ICD-11](guides/097-icd11.md) · [Architecture](project/020-architecture.md) |
| 097 | [ICD-11 Lookup](guides/097-icd11.md) | 50 curated ICD-11 codes across 23 chapters, search by code/title/chapter/description, FHIR integration, collapsible group view | [Epi Map](guides/096-epi-map.md) · [Tests](developers/080-test-suite.md) |

## 🤖 In-App Agents

| Document | Description |
|----------|-------------|
| [Agent Index](agents/index.md) | All in-app agent documentation (skills, templates, tools, workflows) |

## Quick Reference

| Metric | Value |
|--------|-------|
| **Runtime dependencies** | 2 (`react`, `react-dom`) |
| **Test count** | 74 across 6 files |
| **Test coverage** | >80% statements, >75% branches, >85% functions, >80% lines |
| **Build size** | ~90 KB gzip |
| **IndexedDB stores** | 22 (6 memory tiers + 16 application stores) |
| **Tech stack** | React 19.2.7 · Vite 8.1.5 · TypeScript 7.0.2 · Vitest 4.1.10 |

---

*Start with the [Project Overview](project/000-overview.md) for a high-level introduction, or jump to the [Developer Setup Guide](developers/050-setup.md) to get started.*
