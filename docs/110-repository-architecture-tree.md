# 110 — Repository Architecture Tree

**Document Version:** 2.0
**Date:** July 26, 2026

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

### 1.7 `/src/test` (4 files)

| File | Tests | Type |
| :--- | :--- | :--- |
| `setup.ts` | — | Mocks (indexeddb, Worker, BroadcastChannel, crypto) |
| `memory.unit.test.ts` | 25 | Unit tests per tier + embeddings |
| `memory.integration.test.ts` | 9 | Cross-tier, sync, workspace, storage |
| `memory.benchmark.ts` | 5 | Write, search, key gen, batch, embedding |

---

## 2. `/docs` Structure

| File | Status |
| :--- | :--- |
| `000-project-overview.md` | Updated v2.0 |
| `010-blueprint.md` | Updated v2.0 |
| `020-architecture.md` | Updated v2.0 |
| `030-design.md` | Updated v2.0 |
| `040-development.md` | Updated v2.0 |
| `050-setup.md` | Updated v2.0 |
| `060-agents-configuration.md` | Updated v2.0 (6 agents) |
| `070-memory-architecture.md` | Updated v2.0 (embeddings + Orama) |
| `080-test-suite.md` | Updated v2.0 (35 tests) |
| `090-gap-analysis.md` | Updated v2.0 |
| `100-dependency-removal-notes.md` | Updated v2.0 |
| `110-repository-architecture-tree.md` | This file |
| `agents/` | 9 files, all updated v2.0 |
