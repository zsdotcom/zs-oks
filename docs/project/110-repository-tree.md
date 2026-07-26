---
title: "110 — Repository Tree"
category: "project"
order: 110
tags: ["repository", "structure", "files", "codebase"]
last_updated: "2026-07-26"
---

# 110 — Repository Tree

---

## 1. `/src` Folder Structure

### 1.1 Entry & Types

| File | Purpose |
| :--- | :--- |
| `index.tsx` | ReactDOM entry point |
| `index.css` | Tailwind directives + agent CSS variables + theme |
| `App.tsx` | Main shell, 6 A2A agents, global state |
| `types.ts` | All shared TypeScript interfaces |

### 1.2 `/src/components` (16 files)

| File | Purpose |
| :--- | :--- |
| `A2AMetricsDashboard.tsx` | Agent latency/success charts |
| `ChatInterface.tsx` | AI chat with A2A debate integration |
| `ChatSessionSidebar.tsx` | Session list management |
| `ErrorBoundary.tsx` | Crash recovery |
| `GmailCompose.tsx` | Gmail API email compose |
| `GoogleWorkspacePanel.tsx` | Drive/Docs/Sheets integration |
| `KanbanBoardView.tsx` | Drag-drop task board |
| `KnowledgeBaseManager.tsx` | File/folder tree |
| `MCPServerPanel.tsx` | MCP tool configuration |
| `SearchPanel.tsx` | Full-text search |
| `SettingsPanel.tsx` | AI provider, A2A agents, sandbox |
| `ThemeSwitcher.tsx` | Dark/light toggle |
| `WorkspaceDocumentEditor.tsx` | Markdown editor with preview |
| `WorkspaceManager.tsx` | Project/workspace management |
| `DocumentEditor.tsx` | Re-export alias |
| `MetricsDashboard.tsx` | Re-export alias |
| `charts/SimpleCharts.tsx` | SVG bar/line/stat charts |
| `icons/lucide-shim.tsx` | 36 inline SVG icons |

### 1.3 `/src/services` (5 files)

| File | Purpose |
| :--- | :--- |
| `geminiService.ts` | 6-provider LLM router |
| `googleAuthService.ts` | Google OAuth + Drive/Docs/Sheets/Gmail |
| `memoryApi.ts` | 6-tier memory + embeddings + Orama integration |
| `embeddingWorker.ts` | Web Worker: Transformers.js CDN → 384-dim vectors |
| `oramaService.ts` | Orama JS CDN → hybrid vector search |
| `searchService.ts` | Token-based fuzzy file search |

### 1.4 `/src/db`

| File | Purpose |
| :--- | :--- |
| `indexedDB.ts` | 19 object stores, generic CRUD |

### 1.5 `/src/hooks`

| File | Purpose |
| :--- | :--- |
| `useChat.ts` | Chat session CRUD |
| `useFiles.ts` | File/folder/version CRUD |
| `usePersistence.ts` | Theme, online status |

### 1.6 `/src/utils`

| File | Purpose |
| :--- | :--- |
| `markdown.ts` | Custom CommonMark parser |
| `highlight.ts` | Custom regex syntax highlighter |

### 1.7 `/src/test` (7 files)

| File | Tests | Type |
| :--- | :--- | :--- |
| `setup.ts` | — | Mocks (indexeddb, Worker, BroadcastChannel, crypto) |
| `memory.unit.test.ts` | 25 | Unit tests per tier + embeddings |
| `memory.integration.test.ts` | 10 | Cross-tier, sync, workspace, storage |
| `memory.benchmark.ts` | 5 | Write, search, key gen, batch, embedding (benchmarks) |
| `gemini.test.ts` | 8 | LLM provider router tests |
| `sandbox.test.ts` | 9 | Sandbox execution tests |
| `icd11.test.ts` | 22 | ICD-11 lookup + FHIR integration tests |

---

## 2. `/docs` Structure

| File | Status |
| :--- | :--- |
| `project/000-overview.md` | Updated v2.0 |
| `project/010-blueprint.md` | Updated v2.0 |
| `project/020-architecture.md` | Updated v2.0 |
| `project/030-design.md` | Updated v2.0 |
| `project/090-feature-status.md` | Updated v2.0 |
| `project/100-reference.md` | Updated v2.0 |
| `project/110-repository-tree.md` | This file |
| `developers/040-development.md` | Updated v2.0 |
| `developers/050-setup.md` | Updated v2.0 |
| `developers/070-memory-architecture.md` | Updated v2.0 |
| `developers/080-test-suite.md` | Updated v2.0 |
| `developers/095-code-splitting.md` | Updated v2.0 |
| `developers/098-cicd-pipeline.md` | Updated v2.0 |
| `developers/099-deployment.md` | Updated v2.0 |
| `developers/100-dependency-removal.md` | Updated v2.0 |
| `guides/060-agents.md` | Updated v2.0 (6 agents) |
| `guides/091-workflows.md` | Updated v2.0 |
| `guides/092-diagrams.md` | Updated v2.0 |
| `guides/093-pdf-export.md` | Updated v2.0 |
| `guides/094-sandbox.md` | Updated v2.0 |
| `guides/096-epi-map.md` | Updated v2.0 |
| `guides/097-icd11.md` | Updated v2.0 |
| `agents/` | 9 files, all updated v2.0 |

---

## See Also

- [Project Overview](000-overview.md) — Vision, mission, and core features
- [Project Architecture](020-architecture.md) — System architecture and component pipeline
- [Developer Guide: Development](../developers/040-development.md) — Coding standards and contribution
- [User Guide: A2A Agents](../guides/060-agents.md) — Agent configuration and management

---

*Back to [Documentation Home](../index.md) | [Developer Docs](../developers/040-development.md) | [User Guides](../guides/060-agents.md)*
