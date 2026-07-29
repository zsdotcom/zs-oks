---
title: "002 — Technical Specification"
description: "Complete feature specifications, component and service catalog, IndexedDB schema, and CDN library inventory"
category: "project"
order: 2
tags: ["specification", "features", "components", "indexeddb"]
last_updated: "2026-07-28"
audience: "stakeholders"
---
# 002 — Technical Specification

## 1. System Requirements

### Browser Requirements

| Browser | Minimum Version | Status |
| :--- | :--- | :--- |
| Chrome | 120+ (for Web Worker dynamic import compatibility) | ✅ Primary target |
| Firefox | 120+ | ✅ Tested |
| Safari | 17+ | ✅ Compatible |
| Edge | 120+ | ✅ Compatible |

### Runtime Requirements

| Requirement | Minimum | Recommended |
| :--- | :--- | :--- |
| RAM | 512 MB | 2 GB+ (for Transformers.js) |
| Storage | 50 MB (app) | 1 GB+ (IndexedDB data) |
| Network | Required for first load and CDN libraries | Broadband for ML model download |

## 2. Feature Specification

### 2.1 Core Application Shell

| Feature | Specification |
| :--- | :--- |
| **SPA Architecture** | Single-page application with client-side routing via conditional rendering |
| **Navigation** | Header toolbar with app title, online status indicator, view tabs, Google sign-in, theme toggle, settings |
| **Responsive Design** | Desktop-first with collapsible sidebar; mobile optimizations |
| **Theme** | Dark mode default with light mode toggle. Persisted in IndexedDB. |
| **PWA** | Service Worker caches all Vite-built assets. Manifest includes install prompt. |

### 2.2 A2A Multi-Agent System

| Feature | Specification |
| :--- | :--- |
| **Built-in Agents** | Coordinator (🎯), Researcher (🔬), Data Analyst (📊), Writer (✍️), Reviewer (🔍), Librarian (📚), Security Analyst (🛡️), Code Reviewer (🔎), Planning Agent (📋), Testing Agent (🧪), Code Generator (⚡), Knowledge Curator (🏛️) |
| **Agent Identity** | Each agent has: `id`, `name`, `role`, `avatar` (emoji), `color` (hex), `isActive`, `memoryType`, `maxTurnDepth`, `provider`, `modelName`, `skills[]`, `tools[]`, `systemPrompt` |
| **A2A Debate** | All active agents receive the same user prompt and respond independently. Responses rendered with agent color, avatar, and name. |
| **Agent Configuration** | Settings panel for: system prompt editing, active/inactive toggle, provider/model selection, skill/tool assignment |
| **Custom Agents** | Users can create agents with custom name, avatar, prompt, color, and configuration. Persisted in `a2aAgents` IndexedDB store. |
| **Workflow Orchestration** | `runOrchestratedWorkflow()`: Coordinator decomposes → specialists execute → Coordinator synthesizes. `runSequentialWorkflow()`: agents execute in chain passing context. |
| **Metrics** | Per-agent latency, token estimates, timestamps tracked in `metrics` IndexedDB store. Visualized in A2AMetricsDashboard. |

### 2.3 6-Tier Memory Architecture

| Tier | Storage | Indexing | Auto-Purge |
| :--- | :--- | :--- | :--- |
| 1 — Session | In-memory `Map` | Key-value | On page refresh |
| 2 — Episodic | IndexedDB `episodic` | `projectId_agentId`, `createdAt` | 90 days (via `performMaintenance()`) |
| 3 — Semantic | IndexedDB `semantic` + Orama | 384-dim vector index | Manual |
| 4 — Procedural | IndexedDB `procedural` | Key-value | Never |
| 5 — Working | IndexedDB `working` | `projectId_agentId_sessionId` | On session end (`flushWorking()`) |
| 6 — Long-Term | IndexedDB `long_term` | `projectId_category` | Manual only |

### 2.4 Vector Embedding Pipeline

| Step | Component | Details |
| :--- | :--- | :--- |
| Trigger | `storeSemantic()` | Automatically generates embedding via Web Worker |
| Compute | `embeddingWorker.ts` | `new Worker()` runs Transformers.js from CDN |
| Model | `Xenova/all-MiniLM-L6-v2` | 384-dim output, ~80MB WASM (loaded once, cached) |
| Timeout | 30 seconds | Falls back to zero vector `[]` |
| Store | IndexedDB | Embedding stored in `semantic` entries |
| Index | Orama | On successful embedding, also inserted into Orama index |

### 2.5 Semantic Search Pipeline

| Step | Component | Fallback |
| :--- | :--- | :--- |
| `searchSemantic(query, topK)` | `oramaService.ts` | Orama hybrid search |
| CDN unavailble | `dbGetAll('semantic')` | Token-based keyword matching |
| Sort | By match count | Returns top K entries |

### 2.6 LLM Provider Router

| Provider | Base URL | Authentication | Models |
| :--- | :--- | :--- | :--- |
| **Gemini** | `generativelanguage.googleapis.com` | `VITE_GEMINI_API_KEY` | `gemini-2.5-pro`, `gemini-2.5-flash` |
| **OpenAI** | `api.openai.com` | `VITE_OPENAI_API_KEY` | GPT-4o, GPT-4, GPT-3.5 |
| **Anthropic** | `api.anthropic.com` | `VITE_ANTHROPIC_API_KEY` | Claude 3.5 Sonnet, Claude 3 Haiku |
| **DeepSeek** | `api.deepseek.com` | `VITE_DEEPSEEK_API_KEY` | DeepSeek V3, DeepSeek R1 |
| **Groq** | `api.groq.com` | `VITE_GROQ_API_KEY` | Llama 3.3 70B, Mixtral, Gemma |
| **Ollama** | User-configured URL | None (local) | Any pulled model |
| **OpenRouter** | `openrouter.ai` | `VITE_OPENROUTER_API_KEY` | Unified access to 200+ models |
| **Cerebras** | `api.cerebras.ai` | `VITE_CEREBRAS_API_KEY` | Cerebras models |
| **GitHub** | `models.inference.ai.azure.com` | `VITE_GITHUB_TOKEN` | GitHub Marketplace models |
| **Cloudflare** | `api.cloudflare.com` | Cloudflare API token | Workers AI models |

### 2.7 IndexedDB Schema (22 Object Stores)

| Store | Key | Indexes | Purpose |
| :--- | :--- | :--- | :--- |
| `episodic` | `id` | `projectId_agentId`, `createdAt` | Conversation history |
| `semantic` | `id` | `projectId_agentId` | Text + 384-dim vector embeddings |
| `procedural` | `id` | — | Operational rules |
| `working` | `id` | — | Session scratchpads |
| `long_term` | `id` | `projectId_category` | Persistent knowledge |
| `files` | `id` | `name`, `parentFolderId`, `type` | Documents |
| `folders` | `id` | — | File organization |
| `providers` | `id` | — | LLM provider configs |
| `urlGroups` | `id` | — | URL collections |
| `prompts` | `id` | — | Saved prompts |
| `a2aAgents` | `id` | — | Agent configurations |
| `metrics` | `id` | `timestamp`, `agentId` | A2A performance metrics |
| `skills` | `id` | — | Skill definitions |
| `connectors` | `id` | — | External service connectors |
| `workspaceProjects` | `id` | — | Project definitions |
| `sandbox` | `id` | — | Sandbox settings |
| `sessions` | `id` | — | Chat sessions |
| `versions` | `id` | `documentId`, `createdAt` | Document version history |
| `kanban` | `id` | — | Kanban board state |
| `templates` | `id` | — | Document templates |
| `tags` | `id` | — | Tag definitions |
| `appState` | `id` | — | App-level state |

### 2.8 Components

#### Directly Imported (13)

| Component | Purpose |
| :--- | :--- |
| `ChatInterface` | AI chat with A2A debate integration |
| `KnowledgeBaseManager` | File/folder tree and document management |
| `SearchPanel` | Full-text search across knowledge base |
| `ThemeSwitcher` | Dark/light theme toggle |
| `ErrorBoundary` | Crash recovery wrapper |
| `KanbanBoardView` | Drag-and-drop task board |
| `ChatSessionSidebar` | Session list management |
| `GmailCompose` | Gmail API email composition |
| `ICD11Lookup` | Medical code browser |
| `EpiMap` | Epidemiological map visualization |
| `WorkspaceManager` | Project/workspace management |
| `ConnectorPanel` | External service connector management |
| `WebhookManager` | Webhook configuration |
| `AgentBuilder` | Custom agent creation UI |
| `PublicDataPanel` | Public health data API browser |
| `DocumentationViewer` | In-app documentation viewer |
| `SimpleCharts` | SVG bar/line/stat chart components |
| `lucide-shim` | 36 inline SVG icons |

#### Lazy-Loaded (10)

| Component | Trigger | Fallback UI |
| :--- | :--- | :--- |
| `WorkspaceDocumentEditor` | Document opened | Centered "Loading..." |
| `ObservabilityDashboard` | Observability tab opened | Centered "Loading..." |
| `GoogleWorkspacePanel` | Google panel opened | Centered "Loading..." |
| `SettingsPanel` | Settings button clicked | Centered "Loading..." |
| `MCPServerPanel` | MCP tab opened | Centered "Loading..." |
| `ICD11Lookup` | ICD-11 tab opened | Centered "Loading..." |
| `BdCorePanel` | BD Core tab opened | Centered "Loading..." |
| `EpiMap` | Epi Map tab opened | Centered "Loading..." |
| `ConnectorPanel` | Connectors tab opened | Centered "Loading..." |
| `PublicDataPanel` | Public Data tab opened | Centered "Loading..." |

### 2.9 Services (19+)

| Service | Purpose | Dependencies |
| :--- | :--- | :--- |
| `geminiService` | 10-provider LLM router with unified API | None (fetch API) |
| `memoryApi` | 6-tier memory API + embedding + Orama integration | IndexedDB, Worker |
| `embeddingWorker` | Web Worker: Transformers.js CDN → 384-dim vectors | CDN (jsdelivr) |
| `oramaService` | Orama JS CDN → hybrid vector search | CDN (jsdelivr) |
| `searchService` | Token-based fuzzy search | None |
| `googleAuthService` | Google OAuth + Drive/Docs/Sheets/Gmail APIs | CDN (GIS) |
| `icd11Service` | ICD-11 medical code lookup + FHIR conversion | None (curated data) |
| `publicApiService` | Public health data APIs (CDC, WHO, FluView, COVIDcast, weather, air quality) | fetch API |
| `sandboxService` | iframe sandboxed JavaScript execution | None (iframe) |
| `skillService` | Skill registry with priority, triggers, categories, auto-activation | IndexedDB |
| `connectorService` | GitHub, Slack, RSS, email, webhook connectors | IndexedDB |
| `webhookService` | Webhook dispatch for event-driven integration | IndexedDB |
| `mcpService` | MCP tool execution with 40+ known API endpoints (CDC, WHO, Delphi, Brave, GitHub, World Bank, Open Library, Europe PMC, CrossRef, Google Books, NewsAPI, Discord, Telegram) | Known endpoint map |

### 2.10 CDN Libraries

| Library | Version | URL | Purpose | Fallback |
| :--- | :--- | :--- | :--- | :--- |
| `@huggingface/transformers` | 3.4.0 | `cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0` | Vector embeddings in Web Worker | Zero vector `[]` |
| `@orama/orama` | 3.0.0 | `cdn.jsdelivr.net/npm/@orama/orama@3.0.0` | Hybrid vector+keyword search | Keyword matching |
| KaTeX | 0.18.1 | `cdn.jsdelivr.net/npm/katex@0.18.1/dist/katex.min.js` + CSS | Math rendering | Raw LaTeX display |
| Mermaid | 11.16.0 | `cdn.jsdelivr.net/npm/mermaid@11.16.0/dist/mermaid.min.js` | Diagram generation | Code block display |
| Leaflet | 1.9.4 | `unpkg.com/leaflet@1.9.4/dist/leaflet.js` + CSS | Interactive maps | "Map unavailable" |

### 2.11 UI Components

| Component | Notes |
| :--- | :--- |
| **WorkspaceDocumentEditor** | Split-pane markdown editor with live preview, TOC, version history, PDF export |
| **A2AMetricsDashboard** | Per-agent latency/success charts with Mermaid |
| **SettingsPanel** | AI provider config, A2A agent management, sandbox settings, skills, connectors, webhooks, theme |
| **MCPServerPanel** | MCP server URL/port configuration, tool registry, connection status |
| **GoogleWorkspacePanel** | Drive file browser, Docs editor, Sheets viewer |
| **GmailCompose** | Minimal email compose with OAuth |
| **ICD11Lookup** | Debounced search, chapter-grouped browse, FHIR conversion |
| **EpiMap** | Leaflet.js map with severity-coded markers, popups, auto-fit bounds |
| **KanbanBoardView** | Drag-drop columns, task creation, status tracking |
| **ConnectorPanel** | GitHub, Slack, RSS, webhook, Discord, Telegram, Notion, Linear, Jira add/manage/test |
| **WebhookManager** | Create, edit, test, and delete custom webhooks |
| **AgentBuilder** | Custom agent creation form with preview |
| **PublicDataPanel** | CDC, WHO, FluView, COVIDcast, Pathogen, Weather, Air Quality data browser |
| **ChatSessionSidebar** | Session list with search, delete, new session |
| **KnowledgeBaseManager** | Tree view file/folder browser |
| **WorkspaceManager** | Project CRUD, file browsing |
| **DocumentationViewer** | In-app docs with markdown rendering |

---

## See Also

- [000 — Project Overview](000-overview.md) — High-level introduction
- [001 — Concept & Vision](001-concept.md) — User personas and value proposition
- [003 — Blueprint](003-blueprint.md) — Tech stack and success metrics
- [004 — Architecture](004-architecture.md) — System architecture and directory structure
- [Index](../index.md) — Full documentation index

---

*Last updated: July 27, 2026*

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
