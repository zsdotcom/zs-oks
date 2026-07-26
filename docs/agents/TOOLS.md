# Tools Registry

## Core Tools (Available to All Agents)

| Tool ID | Type | Description | Permission Level |
|---------|------|-------------|-----------------|
| `read-file` | Local | Read files from workspace via File System Access API | Safe |
| `write-file` | Local | Save files to workspace | Elevated |
| `calculate` | Local | Mathematical computation engine (built-in JS) | Safe |
| `speak` | Local | Text-to-speech synthesis via Web Speech API | Safe |
| `dictate` | Local | Speech-to-text dictation via Web Speech API | Safe |
| `send-message` | Local | A2A inter-agent communication via BroadcastChannel | Safe |
| `status-track` | Local | Update and broadcast task progress status | Safe |
| `read-memory` | Local | Query any memory tier from IndexedDB | Safe |
| `write-memory` | Local | Store data to any memory tier | Elevated |

## Research Tools (Researcher + Librarian)

| Tool ID | Type | Description | Source |
|---------|------|-------------|--------|
| `search-wikipedia` | API | Fetch Wikipedia articles and summaries | Wikipedia REST API (free) |
| `search-arxiv` | API | Search academic papers on arXiv | arXiv API (free) |
| `search-openalex` | API | Search scholarly works via OpenAlex | OpenAlex API (free) |
| `search-pubmed` | API | Search biomedical literature via NCBI E-utilities | NCBI E-utilities (free) |
| `search-cdc` | API | Query CDC public health datasets | CDC WONDER API (free) |
| `search-who` | API | Query WHO Global Health Observatory | WHO GHO API (free) |
| `search-web` | API | Search the web via free API | DuckDuckGo HTML API |
| `rss-fetch` | API | Parse and monitor RSS feeds | Built-in fetch + DOMParser |

## Visualization Tools (Data Analyst)

| Tool ID | Type | Description | Source |
|---------|------|-------------|--------|
| `draw-chart` | Local | Generate SVG/Canvas charts and epi curves | Canvas/SVG native |
| `draw-diagram` | Local | Render Mermaid diagrams in real-time | Mermaid.js (CDN) |
| `render-latex` | Local | Typeset mathematical formulas | KaTeX (CDN) |
| `export-pdf` | Local | Export documents as PDF | jsPDF (CDN) |

## Memory Tools (Librarian)

| Tool ID | Type | Description | Source |
|---------|------|-------------|--------|
| `remember` | Local | Store a memory with key, value, and type | IndexedDB |
| `recall` | Local | Search memories using fuzzy/semantic matching | IndexedDB + searchService |
| `forget` | Local | Remove a specific memory entry | IndexedDB |
| `embed` | Local | Generate vector embeddings for text | Transformers.js (WASM) |
| `semantic-search` | Local | Vector similarity search across memory | IndexedDB + searchService |
| `vectorize` | Local | Batch-generate embeddings for documents | Transformers.js (WASM) |

## Spawn & Orchestration Tools (Coordinator)

| Tool ID | Type | Description | Permission Level |
|---------|------|-------------|-----------------|
| `spawn-agent` | Local | Create a sub-agent instance with isolated workspace | Safe |
| `kill-agent` | Local | Terminate a sub-agent and clean up its workspace | Admin |
| `list-agents` | Local | List all active agents and their status | Safe |

## Permission Levels

| Level | Scope | Example |
|-------|-------|---------|
| **Safe** | Read-only, no external network | `calculate`, `draw-chart`, `read-file` |
| **Standard** | Read external APIs, no write | `search-wikipedia`, `search-arxiv` |
| **Elevated** | Write to project workspace | `write-file`, `export-pdf` |
| **Admin** | Modify system settings, install skills | Requires explicit user confirmation |

## Connector Tools (Plugin System)

| Connector ID | Service | Protocol | Authentication |
|-------------|---------|----------|---------------|
| `google-drive` | Google Drive | REST API v3 | OAuth 2.0 |
| `google-docs` | Google Docs | REST API | OAuth 2.0 |
| `google-sheets` | Google Sheets | REST API | OAuth 2.0 |
| `github` | GitHub | REST API | Personal Access Token |
| `rss` | RSS Feeds | Built-in fetch | None |

Connectors are implemented in `src/services/googleAuthService.ts` for Google services.
