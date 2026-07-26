# Research Notes — Agent Architecture & Workspace PRD

## Agent Architecture Patterns (from Blake Crosley & Fmind)

### The Harness Pattern
- Instruction Layer: Project context files (CLAUDE.md equivalent), rules directories, cross-session memory
- Extension Layer: Skills (domain expertise auto-activates), Hooks (deterministic gates), Memory (persistent state), Agents (specialized subagents)
- Orchestration Layer: Multi-agent deliberation, parallel research, voting/consensus

### AI Agent Platform Containers (7 layers)
1. Interaction: Frontend where users meet agents (chat, custom UI, external channels)
2. Development: Workbench for building/deploying (code-based + no-code)
3. Core: Runtime engine (session management, memory bank, code sandbox)
4. Foundation: Model serving + routing (mix MaaS + custom hosting)
5. Information: Knowledge base (RAG), operational data, data lake
6. Observability: Monitoring, evaluation, telemetry
7. Trust: Security, governance, audit trails

### Memory Architecture
- Browser-native: IndexedDB vector storage (HNSW algorithm, 50GB+ per origin)
- Session-tiering: Short-term (context window) → Medium-term (session files) → Long-term (IndexedDB/metadata index)
- No vector database needed: Use SQLite/IndexedDB + metadata indexing
- Agent memory: Semantic + keyword + episodic + procedural memory types

### Key Design Decisions for OKS v1
- Memory: IndexedDB-based with 4 tiers (session, episodic, semantic, procedural)
- Skills: File-based skill definitions with auto-activation via LLM matching
- Tools: Registered tool registry with permission levels
- Plugins: MCP-compatible connector system
- Workspace: Per-project isolation with own agents/skills/inputs/outputs
- GUI: Drag-drop provider setup, workspace creation, project folder management
- Real-time rendering: Color-coded diagrams, live preview, visual feedback
- Zero dependencies: All browser-native, no backend

## Tech Stack (Latest Stable)
- React 19.2.7
- Vite 8.1.5 (Rolldown bundler)
- TypeScript 6.0.3
- IndexedDB for all storage
- Service Worker for PWA
- Web Speech API for voice
- File System Access API for local files
- BroadcastChannel API for cross-tab communication
- Web Workers for background processing
- SharedArrayBuffer for parallel computation
## Workspace Isolation & MWP Research

### Workspace Isolation (AI21)
- Each agent gets sandboxed execution environment
- Initialize-clone-work-compare-merge-or-discard lifecycle
- Enforced at infrastructure level (git worktrees, containers, IndexedDB branches)
- Enables parallel agent execution without data corruption
- Compliance/auditability: inspect what changes were made by which agent

### Model Workspace Protocol (MWP) — arxiv 2603.16021
- Replaces framework-level orchestration with filesystem structure
- Numbered folders represent stages
- Plain markdown files carry prompts and context
- Local scripts handle mechanical work
- One orchestrating agent reads right files at right moment
- Applies Unix pipeline design, modular decomposition, multi-pass compilation
- Key insight: folder structure IS the agent architecture
- Stage-specific context loading prevents context window pollution

### Folder Structure as Agent Architecture
```
workspace/
  01_inputs/        ← Raw user inputs, uploaded files
  02_agents/        ← Agent definitions, system prompts, skills
  03_templates/     ← Pre-defined templates for outputs
  04_skills/        ← Custom skills, tools, plugins
  05_working/       ← Agent working memory, intermediate outputs
  06_outputs/       ← Final organized outputs
  07_versions/      ← Version history snapshots
  08_memory/        ← Long-term agent memory
  09_config/        ← Provider configs, settings
```

### Color-Coded Real-Time Rendering
- Mermaid.js for flowcharts, sequence diagrams, Gantt charts
- SVG-based charts for real-time metrics
- CSS custom properties for dynamic color coding
- BroadcastChannel API for cross-tab real-time sync
- Web Workers for background rendering
- CSS animations for live feedback
## Latest Stable Versions (Verified July 2026)

| Package | Latest Stable | Notes |
|---------|--------------|-------|
| react | 19.2.8 | Concurrent features, Server Components ready |
| react-dom | 19.2.8 | Match react version |
| vite | 8.1.5 | Rolldown-based, 10-30x faster builds |
| typescript | 7.0.2 | ignoreDeprecations: "7.0" for paths without baseUrl |
| @vitejs/plugin-react | 6.0.4 | Required for Vite 8 |
| mermaid | 11.16.0 | Real-time diagram rendering, dark/light themes |
| katex | 0.18.1 | Math rendering |
| @types/react | 19.2.17 | TypeScript definitions |
| @types/react-dom | 19.2.3 | TypeScript definitions |
| @types/node | 26.1.1 | Node.js type definitions |
| tsconfig paths | use "./src/*" | No baseUrl needed with TS 7 |

## MCP Protocol Summary
- Open standard connecting LLMs to external tools/data
- Client-Server architecture: Host → Client → Server
- Tools, Resources, Prompts as core primitives
- Already has free connectors: GitHub, Google Drive, Slack, Jira, Salesforce, SAP
- Google Cloud offers 100+ integration connectors
- Can be implemented client-side via fetch/WebSocket

## A2A Protocol Summary
- Open protocol for agent-to-agent communication
- Standardizes task delegation, status exchange, artifact sharing
- JSON-based, REST-compatible
- Swarm pattern: no central coordinator
- Enables multi-agent collaboration across platforms
## Free Knowledge Update Sources for Agents

### Academic & Research
| Source | API | Key | Notes |
|--------|-----|-----|-------|
| Wikipedia API | REST | Free, no key | Real-time articles, summaries, links |
| arXiv API | REST | Free, no key | Latest papers, abstracts, full-text |
| OpenAlex | REST | Free, no key | Global scholarly knowledge graph, agent-optimized |
| PubMed/PMC | REST | Free, no key | Medical/biomedical literature |
| Semantic Scholar | REST | Free, optional key | Paper search, citation graph, TLDRs |

### Public Health & Epidemiology
| Source | API | Key | Notes |
|--------|-----|-----|-------|
| CDC WONDER | REST | Free | US mortality, birth, cancer data |
| WHO GHO API | REST | Free | Global health observatory, indicators |
| ECDC Data | REST | Free | European disease surveillance |
| IHME GBD | REST | Free | Global Burden of Disease estimates |
| Our World in Data | REST | Free | Global development indicators |

### News & RSS (Free)
| Source | API | Key | Notes |
|--------|-----|-----|-------|
| RSS Feeds | Built-in | Free | Real-time news from any source |
| GDELT Project | REST | Free | Global news monitoring, 100+ languages |
| CrossRef | REST | Free, no key | DOI lookup, paper metadata |

## Browser-Native AI Capabilities (Zero Dependency)

### Transformers.js (Hugging Face)
- Runs ML models directly in browser via WebAssembly (ONNX Runtime)
- Can run embedding models (sentence-transformers) client-side
- Enables vector search, semantic similarity, classification
- Zero server, zero API key, fully offline after model download
- ~50-100MB model files, cached in IndexedDB

### File System Access API
- Read/write local files and folders directly from browser
- Drag-and-drop folder access
- Persistent file handles across sessions
- Works in Chrome, Edge, Opera (not Firefox/Safari)

### Vector Search in Browser
- HNSW (Hierarchical Navigable Small World) algorithm in pure JS
- Stores vectors in IndexedDB (50GB+ per origin)
- Sub-100ms query for millions of vectors
- No external service, no server, no cost

### Web Speech API
- Built-in browser speech-to-text (dictation)
- Built-in text-to-speech (synthesis)
- Zero dependency, zero cost

### Service Worker + Cache API
- PWA offline-first capability
- Cache API for storing large assets
- Background sync for deferred operations
- Push notifications (optional)
