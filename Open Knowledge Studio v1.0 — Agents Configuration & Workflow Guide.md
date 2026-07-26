# Open Knowledge Studio v1.0 — Agents Configuration & Workflow Guide

**Document Version:** 1.0
**Date:** July 25, 2026
**Status:** Active

---

## 1. Overview

This document defines the **multi-agent architecture** for Open Knowledge Studio v1.0. It specifies the roles, tasks, required skills, tools, plugins, and memory configurations for each agent in the system. The platform uses a **Harness Pattern** where agents operate within isolated workspaces and communicate through the **Agent-to-Agent (A2A) Protocol** [1] [2].

All agents run entirely in the browser using **IndexedDB** for persistent memory and **Transformers.js** for zero-cost vector embeddings [3] [4]. No backend server or paid subscriptions are required.

---

## 2. Agent Roster

The platform ships with six pre-configured agent types. Each agent has a distinct role, color-coded identity, and specific tool/skill permissions.

| Agent ID | Name | Role | Avatar | Color | Memory Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `coord` | **Coordinator** | Orchestrates workflows, delegates tasks, validates outputs | 🎯 | `#8b5cf6` | Full (Session + Persistent) |
| `research` | **Researcher** | Searches external sources, synthesizes findings, generates summaries | 🔬 | `#06b6d4` | Persistent (Project-scoped) |
| `data` | **Data Analyst** | Processes datasets, generates statistics, creates visualizations | 📊 | `#f59e0b` | Session + Working |
| `writer` | **Writer** | Drafts documents, applies templates, formats outputs | ✍️ | `#10b981` | Session + Working |
| `review` | **Reviewer** | Quality checks, peer review, consistency validation | 🔍 | Session |
| `knowledge` | **Librarian** | Maintains memory, updates knowledge bases, manages references | 📚 | Full (Global + Persistent) |

---

## 3. Agent Definitions

### 3.1 Coordinator Agent

The Coordinator is the primary orchestrator. It receives user requests, decomposes them into sub-tasks, delegates to specialized agents, and validates the final output before returning it to the user.

```
Agent: coord
Name: Coordinator
Role: Orchestrates multi-agent workflows. Decomposes complex tasks into sub-tasks,
      assigns them to specialized agents, monitors progress, and validates outputs.
Avatar: 🎯
Color: #8b5cf6
Memory: Full
  - Session: Active conversation context
  - Episodic: Past workflow executions and outcomes
  - Semantic: Project-level knowledge embeddings
  - Procedural: Workflow orchestration rules
Skills:
  - workflow-decompose      — Break complex tasks into sub-tasks
  - workflow-delegate       — Assign tasks to specialized agents
  - workflow-validate       — Quality-check agent outputs
  - workflow-merge          — Combine multiple agent outputs
Tools:
  - spawn-agent             — Create a sub-agent instance
  - status-track            — Monitor agent task progress
  - send-message            — A2A communication to other agents
  - read-memory             — Query any memory tier
  - write-memory            — Store findings across memory tiers
  - read-file               — Access workspace files
  - write-file              — Save outputs to workspace
Plugins:
  - None (Coordinator does not connect to external services)
Max Turn Depth: 50
Provider: Google Gemini (2.5 Pro) — requires complex reasoning
Model: gemini-2.5-pro
```

**System Prompt:**
```
You are the Coordinator Agent of Open Knowledge Studio. Your role is to:

1. Receive user requests and analyze their complexity.
2. If the task is simple (single-step), handle it directly.
3. If the task is complex (multi-step), decompose it into sub-tasks
   and delegate to the appropriate specialized agents.
4. Monitor the progress of delegated agents using the A2A protocol.
5. Validate each agent's output before merging it into the final response.
6. Maintain a task progress tracker that the user can view in real-time.

Rules:
- Never perform research or data analysis yourself. Delegate to the
  Researcher or Data Analyst.
- Never write final documents yourself. Delegate to the Writer.
- Always validate outputs from delegated agents before presenting
  to the user.
- Save all key decisions and outcomes to episodic memory.
- Update the progress tracker after each sub-task completes.
- Use color-coded status updates: 🟢 Complete, 🟡 In Progress, 🔴 Error.
```

---

### 3.2 Research Agent

The Research Agent specializes in searching external knowledge sources, synthesizing findings, and generating structured summaries with proper citations.

```
Agent: research
Name: Researcher
Role: Searches external knowledge sources (Wikipedia, arXiv, OpenAlex,
      PubMed, WHO, CDC), synthesizes findings, and generates structured
      summaries with citations.
Avatar: 🔬
Color: #06b6d4
Memory: Persistent (Project-scoped)
  - Session: Current research query context
  - Semantic: Embedded research findings for future recall
  - Episodic: Past research sessions and their outcomes
Skills:
  - literature-review       — Systematic literature search and synthesis
  - outbreak-research       — Disease-specific outbreak data gathering
  - guideline-research      — Clinical/public health guideline retrieval
  - source-evaluate         — Evaluate source credibility and relevance
Tools:
  - search-wikipedia        — Wikipedia REST API
  - search-arxiv            — arXiv API (academic papers)
  - search-openalex         — OpenAlex API (scholarly works)
  - search-pubmed           — NCBI E-utilities (biomedical)
  - search-cdc              — CDC WONDER API
  - search-who              — WHO GHO API
  - search-web              — DuckDuckGo HTML API
  - rss-fetch               — RSS feed monitoring
  - read-file               — Read uploaded documents
  - write-file              — Save research notes
  - embed                   — Generate vector embeddings
  - semantic-search         — Query semantic memory
Plugins:
  - None (All sources are free REST APIs)
Max Turn Depth: 30
Provider: Groq (Llama 3.3 70B) — fast, large context
Model: llama-3.3-70b-versatile
```

**System Prompt:**
```
You are the Research Agent of Open Knowledge Studio. Your role is to:

1. Identify the user's research query and determine the best sources.
2. Query relevant free APIs (Wikipedia, arXiv, OpenAlex, PubMed, WHO, CDC).
3. Synthesize findings into a structured summary with inline citations.
4. Evaluate source credibility using the source-evaluate skill.
5. Store key findings in semantic memory for future recall.
6. Always include: source URL, access date, confidence level, and
   relevance score for each cited piece of information.

Rules:
- Only use free APIs. Never suggest paid databases.
- Always cite sources with full URLs and access dates.
- If a source is paywalled, note it and search for an open alternative.
- Tag all findings with confidence levels (High/Medium/Low).
- Save research notes to 05_working/ for the Writer agent to access.
- Cache API results in IndexedDB to avoid redundant calls.
```

---

### 3.3 Data Analyst Agent

The Data Analyst processes datasets, performs statistical calculations, and generates visualizations including charts, epi curves, and Mermaid diagrams.

```
Agent: data
Name: Data Analyst
Role: Processes datasets (CSV, JSON), performs statistical analysis,
      generates visualizations (charts, epi curves, diagrams), and
      computes epidemiological metrics.
Avatar: 📊
Color: #f59e0b
Memory: Session + Working
  - Session: Current dataset context
  - Working: Intermediate calculations and temporary data
Skills:
  - attack-rate-calc        — Calculate epidemiological attack rates
  - epi-curve               — Generate epidemic curves from case data
  - r0-estimator            — Estimate basic reproduction number
  - chi-square-test         — Chi-square statistical test
  - confidence-interval     — Calculate confidence intervals
  - data-clean              — Clean and normalize datasets
  - outbreak-detection      — Detect anomalies in surveillance data
Tools:
  - calculate               — Mathematical computation
  - draw-chart              — SVG/Canvas chart generation
  - draw-diagram            — Mermaid diagram rendering
  - render-latex            — LaTeX formula typesetting
  - read-file               — Read CSV, JSON, Excel files
  - write-file              — Save analysis results
  - vectorize               — Generate data embeddings
Plugins:
  - google-sheets           — Import/export data via Google Sheets API
Max Turn Depth: 25
Provider: Groq (Llama 3.3 70B) — fast computation
Model: llama-3.3-70b-versatile
```

**System Prompt:**
```
You are the Data Analyst Agent of Open Knowledge Studio. Your role is to:

1. Read and parse datasets uploaded by the user (CSV, JSON, Excel).
2. Clean the data: handle missing values, normalize formats, detect outliers.
3. Perform statistical analysis using the calculate tool.
4. Generate visualizations: charts, epi curves, and Mermaid diagrams.
5. Compute epidemiological metrics: attack rates, R0, confidence intervals.
6. Save all visualizations to 06_outputs/visualizations/.
7. Document the methodology step-by-step for reproducibility.

Rules:
- Always validate data before analysis (check for nulls, outliers).
- Use color-coded charts: red for critical values, green for normal range.
- Include confidence intervals with all statistical estimates.
- Save the analysis methodology to 05_working/ for the Reviewer to audit.
- If data is insufficient for analysis, report exactly what is missing.
```

---

### 3.4 Writer Agent

The Writer Agent drafts documents, applies templates, formats outputs, and ensures consistent citation styles.

```
Agent: writer
Name: Writer
Role: Drafts documents, applies project templates, formats outputs,
      ensures consistent citation styles, and produces final deliverables.
Avatar: ✍️
Color: #10b981
Memory: Session + Working
  - Session: Current document context
  - Working: Draft versions and template selections
Skills:
  - report-writer           — Generate structured reports from data
  - policy-brief            — Create policy briefs from research
  - literature-review       — Synthesize literature into review format
  - protocol-template       — Generate research protocol documents
  - citation-format         — Apply consistent citation styles (APA, Vancouver)
  - executive-summary       — Extract key findings into executive summary
Tools:
  - read-file               — Read research notes, data, templates
  - write-file              — Save drafts and final documents
  - export-pdf              — Export documents as PDF
  - render-latex            — Typeset mathematical formulas
  - speak                   — Read document aloud (TTS)
Plugins:
  - google-docs             — Create/edit Google Docs
  - google-drive            — Save to Google Drive
Max Turn Depth: 20
Provider: Google Gemini (2.5 Flash) — fast, good at writing
Model: gemini-2.5-flash
```

**System Prompt:**
```
You are the Writer Agent of Open Knowledge Studio. Your role is to:

1. Read research notes from 05_working/ and templates from 03_templates/.
2. Draft documents using the appropriate template.
3. Apply consistent citation formatting (APA by default, configurable).
4. Generate executive summaries for complex documents.
5. Export final documents as PDF using the export-pdf tool.
6. Maintain a consistent tone and style throughout the document.

Rules:
- Never invent facts. Only use information from provided research notes.
- Always cite sources using the project's configured citation style.
- Include a methodology section for all analytical documents.
- Save drafts to 05_working/ and finals to 06_outputs/reports/.
- If research notes are incomplete, flag gaps for the Researcher to fill.
```

---

### 3.5 Review Agent

The Review Agent performs quality checks, peer review, consistency validation, and compliance auditing.

```
Agent: review
Name: Reviewer
Role: Performs quality checks on agent outputs, validates consistency,
      audits methodology, and ensures compliance with project standards.
Avatar: 🔍
Color: #ef4444
Memory: Session
  - Session: Current review context
Skills:
  - quality-check           — Validate output quality against standards
  - consistency-audit       — Check for contradictions across outputs
  - citation-audit          — Verify all citations are valid and complete
  - methodology-review      — Review analytical methodology for flaws
  - compliance-check        — Check against WHO/CDC reporting standards
Tools:
  - read-file               — Read documents for review
  - write-file              — Save review notes
  - send-message            — Return feedback to source agent
  - calculate               — Verify statistical calculations
Plugins:
  - None (Review is internal)
Max Turn Depth: 15
Provider: Google Gemini (2.5 Flash) — fast, cost-effective
Model: gemini-2.5-flash
```

**System Prompt:**
```
You are the Review Agent of Open Knowledge Studio. Your role is to:

1. Review documents and outputs from other agents for quality and accuracy.
2. Check for internal consistency: do numbers match across sections?
3. Audit citations: are they complete, valid, and properly formatted?
4. Review methodology: are statistical methods appropriate and correctly applied?
5. Check compliance with WHO/CDC reporting standards where applicable.
6. Provide structured feedback with severity levels: Critical, Major, Minor.

Rules:
- Never modify the original document. Only write review notes.
- Always provide specific line/section references for each issue found.
- Rate overall quality on a scale of 1-5 with justification.
- Save review reports to 06_outputs/ with "review-" prefix.
- Flag any uncited claims as Critical issues.
```

---

### 3.6 Knowledge Agent (Librarian)

The Librarian maintains the platform's memory systems, manages the knowledge base, handles references, and keeps the semantic search index updated.

```
Agent: knowledge
Name: Librarian
Role: Maintains all memory systems, manages the knowledge base,
      handles references, keeps the semantic search index updated,
      and ensures knowledge freshness.
Avatar: 📚
Color: #a855f7
Memory: Full (Global + Persistent)
  - Session: Current memory operation context
  - Episodic: All past memory operations
  - Semantic: Full vector index of project knowledge
  - Procedural: Memory management rules and policies
  - Long-Term: Global knowledge base
Skills:
  - memory-maintenance      — Organize, compress, and archive memory
  - knowledge-refresh       — Update knowledge base from free sources
  - index-rebuild           — Rebuild semantic search index
  - reference-manager       — Maintain bibliography and citations
  - glossary-build          — Build project-specific glossary
Tools:
  - remember                — Store memories
  - recall                  — Search memories
  - forget                  — Remove memories
  - embed                   — Generate vector embeddings
  - semantic-search         — Query semantic index
  - search-wikipedia        — Knowledge refresh source
  - search-openalex         — Knowledge refresh source
  - read-file               — Read memory files
  - write-file              — Update memory files
  - vectorize               — Batch embed documents
Plugins:
  - None (Librarian works entirely with internal memory)
Max Turn Depth: 30
Provider: Google Gemini (2.5 Flash) — memory operations are routine
Model: gemini-2.5-flash
```

**System Prompt:**
```
You are the Librarian Agent of Open Knowledge Studio. Your role is to:

1. Maintain all six memory tiers: Session, Episodic, Semantic,
   Procedural, Working, and Long-Term.
2. Run periodic knowledge refresh cycles using free sources
   (Wikipedia, OpenAlex, WHO, CDC).
3. Rebuild the semantic search index when new documents are added.
4. Manage references and build project-specific glossaries.
5. Compress episodic memory by summarizing old sessions.
6. Report memory usage statistics to the Coordinator.

Rules:
- Never delete memories without user confirmation (except auto-purge
  of expired session memory).
- Always cite the source when refreshing knowledge.
- Run knowledge refresh weekly or when the user triggers it.
- Maintain a knowledge freshness log with last-update timestamps.
- Alert the Coordinator if any knowledge source becomes unavailable.
```

---

## 4. Required Skills Registry

### 4.1 Epidemicology Skills

| Skill ID | Description | Assigned Agent(s) | Tools Used |
| :--- | :--- | :--- | :--- |
| `attack-rate-calc` | Calculate epidemiological attack rates from case data | Data Analyst | `calculate` |
| `epi-curve` | Generate epidemic curves from case onset dates | Data Analyst | `draw-chart`, `calculate` |
| `r0-estimator` | Estimate basic reproduction number from epidemic data | Data Analyst | `calculate`, `draw-chart` |
| `chi-square-test` | Perform chi-square statistical test on categorical data | Data Analyst | `calculate` |
| `confidence-interval` | Calculate confidence intervals for proportions/means | Data Analyst | `calculate` |
| `data-clean` | Clean and normalize epidemiological datasets | Data Analyst | `read-file`, `write-file` |
| `outbreak-detection` | Detect anomalies in surveillance data streams | Data Analyst | `calculate`, `search-cdc` |

### 4.2 Research Skills

| Skill ID | Description | Assigned Agent(s) | Tools Used |
| :--- | :--- | :--- | :--- |
| `literature-review` | Systematic literature search and synthesis | Researcher | `search-arxiv`, `search-openalex`, `search-pubmed` |
| `outbreak-research` | Disease-specific outbreak data gathering | Researcher | `search-who`, `search-cdc`, `search-wikipedia` |
| `guideline-research` | Clinical and public health guideline retrieval | Researcher | `search-who`, `search-wikipedia` |
| `source-evaluate` | Evaluate source credibility using CRAAP test | Researcher | `read-file` |

### 4.3 Writing Skills

| Skill ID | Description | Assigned Agent(s) | Tools Used |
| :--- | :--- | :--- | :--- |
| `report-writer` | Generate structured reports from research and data | Writer | `read-file`, `write-file`, `export-pdf` |
| `policy-brief` | Create policy briefs from research findings | Writer | `read-file`, `write-file`, `export-pdf` |
| `protocol-template` | Generate research protocol documents | Writer | `read-file`, `write-file` |
| `citation-format` | Apply consistent citation styles (APA, Vancouver, etc.) | Writer, Reviewer | `read-file`, `write-file` |
| `executive-summary` | Extract key findings into executive summary format | Writer | `read-file`, `write-file` |

### 4.4 Workflow Skills (Coordinator Only)

| Skill ID | Description | Assigned Agent(s) | Tools Used |
| :--- | :--- | :--- | :--- |
| `workflow-decompose` | Break complex tasks into sub-tasks | Coordinator | `spawn-agent`, `send-message` |
| `workflow-delegate` | Assign tasks to specialized agents via A2A | Coordinator | `spawn-agent`, `send-message` |
| `workflow-validate` | Quality-check agent outputs before merging | Coordinator | `send-message` |
| `workflow-merge` | Combine multiple agent outputs into unified response | Coordinator | `read-file`, `write-file` |

### 4.5 Memory Skills (Librarian Only)

| Skill ID | Description | Assigned Agent(s) | Tools Used |
| :--- | :--- | :--- | :--- |
| `memory-maintenance` | Organize, compress, and archive memory entries | Librarian | `remember`, `forget`, `recall` |
| `knowledge-refresh` | Update knowledge base from free external sources | Librarian | `search-wikipedia`, `search-openalex` |
| `index-rebuild` | Rebuild semantic search index with new embeddings | Librarian | `embed`, `vectorize`, `semantic-search` |
| `reference-manager` | Maintain bibliography and citation database | Librarian | `read-file`, `write-file` |
| `glossary-build` | Build project-specific terminology glossary | Librarian | `read-file`, `write-file` |

### 4.6 Review Skills

| Skill ID | Description | Assigned Agent(s) | Tools Used |
| :--- | :--- | :--- | :--- |
| `quality-check` | Validate output quality against project standards | Reviewer | `read-file`, `write-file` |
| `consistency-audit` | Check for contradictions across multiple outputs | Reviewer | `read-file`, `write-file`, `calculate` |
| `citation-audit` | Verify all citations are valid and complete | Reviewer | `read-file`, `write-file` |
| `methodology-review` | Review analytical methodology for logical flaws | Reviewer | `read-file`, `calculate` |
| `compliance-check` | Check outputs against WHO/CDC reporting standards | Reviewer | `read-file`, `search-who`, `search-cdc` |

---

## 5. Tools Registry

### 5.1 Core Tools (Available to All Agents)

| Tool ID | Type | Description | Permission Level |
| :--- | :--- | :--- | :--- |
| `read-file` | Local | Read files from workspace via File System Access API | Safe |
| `write-file` | Local | Save files to workspace via File System Access API | Elevated |
| `calculate` | Local | Mathematical computation engine (built-in JS) | Safe |
| `speak` | Local | Text-to-speech synthesis via Web Speech API | Safe |
| `dictate` | Local | Speech-to-text dictation via Web Speech API | Safe |
| `send-message` | Local | A2A inter-agent communication via BroadcastChannel | Safe |
| `status-track` | Local | Update and broadcast task progress status | Safe |

### 5.2 Research Tools (Researcher + Librarian)

| Tool ID | Type | Description | Permission Level | Source |
| :--- | :--- | :--- | :--- | :--- |
| `search-wikipedia` | API | Fetch Wikipedia articles and summaries | Standard | Wikipedia REST API (free) |
| `search-arxiv` | API | Search academic papers on arXiv | Standard | arXiv API (free) |
| `search-openalex` | API | Search scholarly works via OpenAlex | Standard | OpenAlex API (free) |
| `search-pubmed` | API | Search biomedical literature via NCBI E-utilities | Standard | NCBI E-utilities (free) |
| `search-cdc` | API | Query CDC public health datasets | Standard | CDC WONDER API (free) |
| `search-who` | API | Query WHO Global Health Observatory | Standard | WHO GHO API (free) |
| `search-web` | API | Search the web via free API | Standard | DuckDuckGo HTML API |
| `rss-fetch` | API | Parse and monitor RSS feeds | Standard | Built-in fetch + DOMParser |

### 5.3 Visualization Tools (Data Analyst)

| Tool ID | Type | Description | Permission Level | Source |
| :--- | :--- | :--- | :--- | :--- |
| `draw-chart` | Local | Generate SVG/Canvas charts and epi curves | Safe | Canvas/SVG native |
| `draw-diagram` | Local | Render Mermaid diagrams in real-time | Safe | Mermaid.js (CDN) |
| `render-latex` | Local | Typeset mathematical formulas | Safe | KaTeX (CDN) |
| `export-pdf` | Local | Export documents as PDF | Elevated | jsPDF (CDN) |

### 5.4 Memory Tools (Librarian)

| Tool ID | Type | Description | Permission Level | Source |
| :--- | :--- | :--- | :--- | :--- |
| `remember` | Local | Store a memory with key, value, and type | Safe | IndexedDB |
| `recall` | Local | Search memories using fuzzy/semantic matching | Safe | IndexedDB + HNSW |
| `forget` | Local | Remove a specific memory entry | Safe | IndexedDB |
| `embed` | Local | Generate vector embeddings for text | Safe | Transformers.js (WASM) |
| `semantic-search` | Local | Vector similarity search across memory | Safe | IndexedDB + HNSW |
| `vectorize` | Local | Batch-generate embeddings for documents | Safe | Transformers.js (WASM) |
| `summarize` | Local | Compress a conversation into episodic memory | Safe | LLM inference |

### 5.5 Translation and Language Tools

| Tool ID | Type | Description | Permission Level | Source |
| :--- | :--- | :--- | :--- | :--- |
| `translate` | Local | Text translation (common languages) | Safe | Browser Intl API |

### 5.6 Spawn and Orchestration Tools (Coordinator)

| Tool ID | Type | Description | Permission Level | Source |
| :--- | :--- | :--- | :--- | :--- |
| `spawn-agent` | Local | Create a sub-agent instance with isolated workspace | Safe | Platform runtime |
| `kill-agent` | Local | Terminate a sub-agent and clean up its workspace | Admin | Platform runtime |
| `list-agents` | Local | List all active agents and their status | Safe | Platform runtime |

---

## 6. Plugin and Connector System

### 6.1 Pre-Built Connectors

| Connector ID | Service | Protocol | Authentication | Permission Scope |
| :--- | :--- | :--- | :--- | :--- |
| `google-drive` | Google Drive | REST API v3 | OAuth 2.0 | Read/Write files, folders |
| `google-docs` | Google Docs | REST API | OAuth 2.0 | Create/edit documents |
| `google-sheets` | Google Sheets | REST API | OAuth 2.0 | Read/write spreadsheet data |
| `github` | GitHub | REST API | Personal Access Token | Read repos, create issues |
| `slack` | Slack | Web API | OAuth 2.0 | Send messages, read channels |
| `email` | Email | mailto: protocol | None (browser-native) | Compose and send emails |
| `rss` | RSS Feeds | Built-in fetch | None | Parse RSS/Atom feeds |

### 6.2 Connector Implementation Pattern

Each connector implements the **MCP (Model Context Protocol)** interface [5]:

```typescript
interface MCPConnector {
  id: string;                    // Unique connector ID
  name: string;                  // Display name
  service: string;               // Service name
  protocol: "rest" | "websocket" | "sse" | "native";
  authType: "oauth" | "token" | "none";
  scopes: string[];              // Permission scopes
  tools: MCPTool[];              // Tools exposed to agents
  resources: MCPResource[];      // Context resources
  prompts: MCPPrompt[];          // Template prompts
  healthCheck: () => Promise<boolean>;
  connect: (credentials: Record<string, string>) => Promise<void>;
  disconnect: () => Promise<void>;
}

interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, SchemaType>;
  execute: (params: Record<string, unknown>) => Promise<unknown>;
}

interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  read: () => Promise<string>;
}

interface MCPPrompt {
  name: string;
  description: string;
  arguments: MCPPromptArg[];
  template: string;
}
```

### 6.3 Connector GUI Configuration

The connector settings panel provides:

- **Status indicators:** Green (connected), Yellow (expiring), Red (disconnected)
- **One-click OAuth:** For Google and GitHub connectors
- **Token input:** For API key-based connectors
- **Scope display:** Visual representation of what data each connector can access
- **Health monitoring:** Automatic ping every 60 seconds with retry logic
- **Permission audit:** Log of all API calls made through each connector

---

## 7. Memory Architecture

### 7.1 Memory Tier Definitions

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MEMORY ARCHITECTURE (IndexedDB)                   │
├──────────────┬──────────────────────────────────────────────────────┤
│  Tier         │  Description                                          │
├──────────────┼──────────────────────────────────────────────────────┤
│  Session      │  JS variables. Lives for current conversation only.  │
│               │  Auto-purged on page refresh.                        │
│               │  Store: JavaScript Map                               │
├──────────────┼──────────────────────────────────────────────────────┤
│  Episodic     │  Past conversation records with summaries.           │
│               │  Per-project scope. Configurable retention.          │
│               │  Store: IndexedDB `sessions` object store            │
├──────────────┼──────────────────────────────────────────────────────┤
│  Semantic     │  Vector embeddings of key concepts and findings.     │
│               │  Per-project scope. Enables semantic search.         │
│               │  Store: IndexedDB `vectors` store (HNSW index)       │
├──────────────┼──────────────────────────────────────────────────────┤
│  Procedural   │  Encoded domain expertise and operational rules.     │
│               │  Global + per-project scope. Never auto-purged.      │
│               │  Store: IndexedDB `skills` object store              │
├──────────────┼──────────────────────────────────────────────────────┤
│  Working      │  Temporary scratchpad for agent computation.         │
│               │  Per-session scope. Auto-purged on session end.      │
│               │  Store: IndexedDB `working` object store             │
├──────────────┼──────────────────────────────────────────────────────┤
│  Long-Term    │  Persistent knowledge base across all sessions.      │
│               │  Global scope. Manual purge only.                    │
│               │  Store: IndexedDB `memory` object store              │
└──────────────┴──────────────────────────────────────────────────────┘
```

### 7.2 Memory Operations Schema

| Operation | Parameters | Returns | Used By |
| :--- | :--- | :--- | :--- |
| `remember(key, value, tier, metadata)` | key: string, value: string, tier: MemoryTier, metadata: object | `{ success: boolean, id: string }` | All agents |
| `recall(query, tier?, filters?)` | query: string, tier?: MemoryTier[], filters?: object | `MemoryEntry[]` (sorted by relevance) | All agents |
| `forget(key, tier?)` | key: string, tier?: MemoryTier | `{ success: boolean, removed: number }` | Librarian |
| `embed(text)` | text: string | `number[]` (vector embedding, 384-dim) | Librarian, Researcher |
| `semantic-search(query, topK?, filters?)` | query: string, topK?: number, filters?: object | `{ entry: MemoryEntry, score: number }[]` | All agents |
| `summarize(sessionId)` | sessionId: string | `{ summary: string, tokens: number }` | Librarian, Coordinator |
| `list-memories(tier, projectId?)` | tier: MemoryTier, projectId?: string | `MemoryEntry[]` (metadata only) | Librarian |
| `purge(expiredBefore?)` | expiredBefore?: Date | `{ purged: number }` | Librarian (auto) |

### 7.3 Real-Time Memory Saving Protocol

The platform implements a **real-time memory saving protocol** that ensures no agent output is lost:

1. **Auto-Save Trigger:** Every agent response is automatically saved to episodic memory within 500ms of generation.
2. **Semantic Indexing:** Key findings from each response are embedded and added to the semantic index within 2 seconds.
3. **Version Snapshots:** Before any agent modifies a workspace file, a version snapshot is created in the `08_versions/` directory.
4. **Working Memory Flush:** On agent termination, all working memory is either merged into episodic memory or discarded.
5. **Cross-Tab Sync:** All memory operations are broadcast via the BroadcastChannel API so all open tabs have synchronized state [6].

---

## 8. Progress Tracking System

### 8.1 Task Progress Schema

The Coordinator maintains a real-time progress tracker using the following schema:

```typescript
interface TaskProgress {
  taskId: string;               // Unique task ID (UUID)
  projectId: string;            // Project workspace ID
  title: string;                // Human-readable task title
  description: string;          // Detailed task description
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  assignedTo: string;           // Agent ID
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;            // ISO 8601 timestamp
  updatedAt: string;            // ISO 8601 timestamp
  estimatedDuration: number;    // Estimated seconds to complete
  elapsedTime: number;          // Actual elapsed seconds
  subTasks: SubTask[];          // Decomposed sub-tasks
  output: TaskOutput | null;    // Final output (if completed)
  errors: TaskError[];          // Errors encountered
  color: string;                // Agent's assigned color
}

interface SubTask {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "failed";
  assignedTo: string;
  startedAt: string | null;
  completedAt: string | null;
  result: string | null;
}

interface TaskOutput {
  type: "text" | "document" | "chart" | "diagram" | "data";
  content: string;
  filePath?: string;
  confidence: "high" | "medium" | "low";
}
```

### 8.2 Progress Visualization

Progress is displayed in the UI using:

| Visual Element | Description | Color Coding |
| :--- | :--- | :--- |
| **Gantt Chart** | Timeline view of all tasks and sub-tasks | Mermaid.js Gantt (red/yellow/green) |
| **Progress Bar** | Percentage completion of current task | CSS gradient (red → yellow → green) |
| **Kanban Board** | Tasks organized by status column | Color-coded cards per agent |
| **Agent Status Dot** | Real-time agent activity indicator | Green (idle), Blue (active), Yellow (thinking), Red (error) |
| **Timeline Log** | Chronological log of all agent actions | Timestamped entries with agent color |

### 8.3 Real-Time Updates

Progress updates are broadcast in real-time through the following channels:

- **BroadcastChannel API:** Cross-tab progress synchronization [6]
- **EventSource / SSE:** Server-sent events for streaming progress (if using any API-based connector)
- **Custom Events:** DOM-level custom events for local component updates
- **IndexedDB Change Events:** Memory-level change notifications

---

## 9. Project-Specific Configuration

### 9.1 Configuration File Structure

Each project workspace contains a `09_config/` directory with the following configuration files:

**`workspace.json`** — Project metadata:
```json
{
  "id": "uuid-v4",
  "name": "Project Name",
  "description": "Project description",
  "createdAt": "2026-07-25T00:00:00Z",
  "updatedAt": "2026-07-25T00:00:00Z",
  "sourceUrl": "https://github.com/...",
  "theme": "dark",
  "citationStyle": "apa",
  "defaultLanguage": "en",
  "agents": ["coord", "research", "data", "writer", "review", "knowledge"],
  "skills": ["attack-rate-calc", "epi-curve", "report-writer"],
  "connectors": ["google-drive", "github"],
  "providers": ["gemini", "groq"],
  "defaultProvider": "gemini",
  "fallbackProvider": "groq",
  "memoryRetentionDays": 90,
  "autoKnowledgeRefresh": true,
  "refreshInterval": "weekly"
}
```

**`agents.json`** — Agent roster configuration:
```json
{
  "agents": {
    "coord": {
      "isActive": true,
      "provider": "gemini",
      "model": "gemini-2.5-pro",
      "maxTurnDepth": 50,
      "memoryScope": "full",
      "skills": ["workflow-decompose", "workflow-delegate", "workflow-validate", "workflow-merge"],
      "tools": ["spawn-agent", "status-track", "send-message", "read-file", "write-file"]
    },
    "research": {
      "isActive": true,
      "provider": "groq",
      "model": "llama-3.3-70b-versatile",
      "maxTurnDepth": 30,
      "memoryScope": "persistent",
      "skills": ["literature-review", "outbreak-research", "guideline-research", "source-evaluate"],
      "tools": ["search-wikipedia", "search-arxiv", "search-openalex", "search-pubmed", "search-cdc", "search-who", "search-web", "rss-fetch", "read-file", "write-file", "embed", "semantic-search"]
    },
    "data": {
      "isActive": true,
      "provider": "groq",
      "model": "llama-3.3-70b-versatile",
      "maxTurnDepth": 25,
      "memoryScope": "session",
      "skills": ["attack-rate-calc", "epi-curve", "r0-estimator", "chi-square-test", "confidence-interval", "data-clean", "outbreak-detection"],
      "tools": ["calculate", "draw-chart", "draw-diagram", "render-latex", "read-file", "write-file", "vectorize"],
      "plugins": ["google-sheets"]
    },
    "writer": {
      "isActive": true,
      "provider": "gemini",
      "model": "gemini-2.5-flash",
      "maxTurnDepth": 20,
      "memoryScope": "session",
      "skills": ["report-writer", "policy-brief", "literature-review", "protocol-template", "citation-format", "executive-summary"],
      "tools": ["read-file", "write-file", "export-pdf", "render-latex", "speak"],
      "plugins": ["google-docs", "google-drive"]
    },
    "review": {
      "isActive": true,
      "provider": "gemini",
      "model": "gemini-2.5-flash",
      "maxTurnDepth": 15,
      "memoryScope": "session",
      "skills": ["quality-check", "consistency-audit", "citation-audit", "methodology-review", "compliance-check"],
      "tools": ["read-file", "write-file", "send-message", "calculate"]
    },
    "knowledge": {
      "isActive": true,
      "provider": "gemini",
      "model": "gemini-2.5-flash",
      "maxTurnDepth": 30,
      "memoryScope": "full",
      "skills": ["memory-maintenance", "knowledge-refresh", "index-rebuild", "reference-manager", "glossary-build"],
      "tools": ["remember", "recall", "forget", "embed", "semantic-search", "search-wikipedia", "search-openalex", "read-file", "write-file", "vectorize"]
    }
  }
}
```

**`providers.json`** — LLM provider configuration:
```json
{
  "providers": {
    "gemini": {
      "apiKey": "<stored-in-indexeddb-encrypted>",
      "baseUrl": "https://generativelanguage.googleapis.com/v1beta",
      "models": {
        "gemini-2.5-pro": { "contextWindow": 1048576, "maxOutputTokens": 8192 },
        "gemini-2.5-flash": { "contextWindow": 1048576, "maxOutputTokens": 8192 }
      },
      "rateLimit": { "rpm": 15, "rpd": 1500 },
      "isActive": true
    },
    "groq": {
      "apiKey": "<stored-in-indexeddb-encrypted>",
      "baseUrl": "https://api.groq.com/openai/v1",
      "models": {
        "llama-3.3-70b-versatile": { "contextWindow": 131072, "maxOutputTokens": 4096 },
        "mixtral-8x7b-32768": { "contextWindow": 32768, "maxOutputTokens": 4096 }
      },
      "rateLimit": { "rpm": 30, "rpd": 1000 },
      "isActive": true
    }
  },
  "router": {
    "defaultProvider": "gemini",
    "fallbackProvider": "groq",
    "routingRules": {
      "simple": "groq",
      "complex": "gemini",
      "long-context": "gemini",
      "fast": "groq"
    }
  }
}
```

### 9.2 Workspace Isolation Protocol

Each agent operates within an isolated workspace following the five-stage lifecycle [7]:

| Stage | Description | Implementation |
| :--- | :--- | :--- |
| **Initialize** | Create private workspace copy | IndexedDB transaction with `cloneStore()` |
| **Clone** | Snapshot relevant parent context | Deep copy of `01_inputs/` and `02_agents/` |
| **Work** | Agent performs all actions in isolation | All file writes go to isolated store |
| **Compare** | Diff changes against baseline | `diff3` merge algorithm on file contents |
| **Merge/Discard** | Accept or reject agent's changes | Coordinator validates before merge |

### 9.3 A2A Communication Protocol

Agents communicate through the **Agent-to-Agent Protocol** using the following message schema [8]:

```typescript
interface A2AMessage {
  id: string;                     // Unique message ID
  from: string;                   // Sender agent ID
  to: string;                     // Recipient agent ID
  type: "task" | "response" | "status" | "error" | "heartbeat";
  payload: {
    taskId?: string;
    action?: string;
    data?: Record<string, unknown>;
    status?: "accepted" | "in-progress" | "completed" | "failed";
    message?: string;
    timestamp: string;            // ISO 8601
  };
  priority: "low" | "medium" | "high" | "urgent";
  requiresAck: boolean;           // Whether sender expects acknowledgment
}
```

---

## 10. Skill Creation Guide

### 10.1 Creating a Custom Skill

Users can create custom skills through the GUI or by adding a Markdown file to `04_skills/<skill-name>/SKILL.md`. The format is:

```markdown
---
name: my-custom-skill
description: >
  A brief description of what this skill does and when it should
  be activated. The LLM uses this description to match user intent.
allowed-tools: tool1, tool2, tool3
priority: high | medium | low
agent-scope: all | specific-agent-id
---

## Instructions

1. Step one of the skill's workflow
2. Step two with specific details
3. Step three including expected output format

## Examples

### Input Example
[Describe a typical input scenario]

### Expected Output
[Show the expected output format]
```

### 10.2 Skill Auto-Activation Logic

The auto-activation follows this decision tree:

```
User Message → LLM receives message with skill list
         ↓
    LLM evaluates: Does any skill description match user intent?
         ↓
    YES → Inject skill instructions into working context
         ↓         Execute skill steps using allowed tools
         ↓         Return result to user
         ↓
    NO → Proceed with normal conversation flow
```

---

## 11. Free Knowledge Sources Configuration

### 11.1 Source Registry

| Source | Endpoint | Rate Limit | Authentication | Update Schedule |
| :--- | :--- | :--- | :--- | :--- |
| **Wikipedia** | `api.wikimedia.org/rest_v1` | 90 req/min | None | Real-time |
| **arXiv** | `export.arxiv.org/api/query` | Unlimited | None | Daily |
| **OpenAlex** | `api.openalex.org` | Polite pool (no key) | Optional (free key) | Weekly |
| **PubMed** | `eutils.ncbi.nlm.nih.gov` | 3 req/sec | None | Daily |
| **Semantic Scholar** | `api.semanticscholar.org` | 100 req/5min | Optional (free key) | Daily |
| **WHO GHO** | `apps.who.int/gho/api` | Generous | None | Monthly |
| **CDC WONDER** | `wonder.cdc.gov/api` | Generous | None | Weekly |
| **GDELT** | `api.gdeltproject.org` | Unlimited | None | Every 15 min |
| **CrossRef** | `api.crossref.org` | 50 req/sec | Polite mailto | Real-time |

### 11.2 Knowledge Refresh Agent Workflow

The Librarian agent runs a weekly knowledge refresh cycle:

1. **Check freshness:** Compare last-refresh timestamps against current date.
2. **Identify gaps:** Find topics that haven't been updated in >7 days.
3. **Fetch updates:** Query relevant free APIs for new content.
4. **Embed new content:** Generate vector embeddings via Transformers.js.
5. **Update index:** Add new vectors to the HNSW index in IndexedDB.
6. **Update citations:** Refresh citation metadata (publication dates, DOIs).
7. **Log refresh:** Write a refresh log entry to episodic memory.

---

## 12. Color-Coded Visual Rendering Configuration

### 12.1 Agent Color Mapping

| Agent | Primary Color | Secondary Color | Background Tint | Status Color |
| :--- | :--- | :--- | :--- | :--- |
| Coordinator | `#8b5cf6` | `#a78bfa` | `rgba(139,92,246,0.1)` | `#8b5cf6` |
| Researcher | `#06b6d4` | `#22d3ee` | `rgba(6,182,212,0.1)` | `#06b6d4` |
| Data Analyst | `#f59e0b` | `#fbbf24` | `rgba(245,158,11,0.1)` | `#f59e0b` |
| Writer | `#10b981` | `#34d399` | `rgba(16,185,129,0.1)` | `#10b981` |
| Reviewer | `#ef4444` | `#f87171` | `rgba(239,68,68,0.1)` | `#ef4444` |
| Librarian | `#a855f7` | `#c084fc` | `rgba(168,85,247,0.1)` | `#a855f7` |

### 12.2 Diagram Rendering Rules

| Diagram Type | When to Use | Color Logic |
| :--- | :--- | :--- |
| Flowchart | Workflow visualization | Start: Blue, Process: Agent color, End: Green |
| Sequence | Agent communication | Each agent line uses its assigned color |
| Gantt | Task timelines | Overdue: Red, In progress: Agent color, Done: Green |
| Mind Map | Knowledge organization | Branches color-coded by topic cluster |
| Epi Curve | Outbreak visualization | Cases: Red, Population: Blue, Threshold: Yellow |

---

## 13. References

[1]: Blake Crosley. "Agent Architecture: Building AI-Powered Development Harnesses." https://blakecrosley.com/guides/agent-architecture

[2]: AI21 Labs. "What is Workspace Isolation?" https://www.ai21.com/glossary/ai-agent/what-is-workspace-isolation/

[3]: Jason Mayes. "VectorSearch.js." https://github.com/jasonmayes/VectorSearch.js

[4]: Hugging Face. "Transformers.js." https://huggingface.co/docs/transformers.js/en/index

[5]: Anthropic. "Model Context Protocol (MCP)." https://modelcontextprotocol.io/

[6]: MDN Web Docs. "BroadcastChannel API." https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel

[7]: AI21 Labs. "What is Workspace Isolation?" https://www.ai21.com/glossary/ai-agent/what-is-workspace-isolation/

[8]: Google Developers. "Announcing the Agent2Agent Protocol (A2A)." https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
