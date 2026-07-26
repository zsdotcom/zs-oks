# Product Requirements Document (PRD)

# Open Knowledge Studio v1.0

**Document Version:** 1.0
**Date:** July 25, 2026
**Author:** Manus AI
**Status:** Draft
**Repository:** [github.com/codeandbrain/open-knowledge-studio](https://github.com/codeandbrain/open-knowledge-studio)

---

## 1. Executive Summary

Open Knowledge Studio v1.0 is a **free, zero-dependency, no-code-friendly knowledge management and multi-agent platform** designed primarily for field epidemiologists, public health researchers, and interdisciplinary research teams. The platform leverages the latest browser-native technologies — including IndexedDB, Service Workers, the File System Access API, and the Web Speech API — to deliver a secure, offline-first environment where users can configure custom AI agents, manage isolated workspaces per project, and execute complex research workflows without relying on expensive SaaS subscriptions or backend infrastructure.

By integrating the **Model Context Protocol (MCP)** and **Agent-to-Agent (A2A) Protocol** standards, the platform enables agents to connect to free external data sources (such as the WHO Global Health Observatory, CDC WONDER, arXiv, OpenAlex, and Wikipedia) and collaborate across tasks through standardized communication protocols. The user interface emphasizes a simple, GUI-based setup for AI provider configuration — requiring only an API key paste — and features a **color-coded, real-time visual rendering system** powered by Mermaid.js to help users intuitively understand complex workflows, data structures, and agent interactions.

The overarching goal is to deliver a **world-class, production-ready platform** that provides the capabilities of enterprise-grade AI agent systems at **zero cost**, with no npm package dependencies at runtime and no backend server requirements.

---

## 2. Vision and Goals

### 2.1 Vision Statement

To create the world's first fully browser-native, multi-agent knowledge studio that empowers field researchers and data scientists to orchestrate AI-powered workflows with custom agents, persistent memory, and real-time visual collaboration — all without a single paid subscription or server-side dependency.

### 2.2 Strategic Goals

| Goal | Description | Target |
| :--- | :--- | :--- |
| **G1: Zero-Cost Operation** | Every feature, agent, and data source must be accessible through free tiers, open APIs, or browser-native capabilities. | 100% free |
| **G2: No-Code Accessibility** | All configuration — provider setup, agent creation, skill definition, workspace management — must be achievable through GUI interactions only. | No code required |
| **G3: Offline-First** | The platform must function fully without an internet connection after initial load, with background sync when connectivity returns. | PWA-compliant |
| **G4: Zero Dependencies** | The runtime bundle must contain no npm packages beyond React and Vite. All other capabilities are browser-native or CDN-loaded. | 2 runtime packages |
| **G5: Multi-Agent Orchestration** | Support custom agents with persistent memory, custom skills, tools, and inter-agent communication. | v1.0 |
| **G6: Workspace Isolation** | Each project must have its own isolated workspace with dedicated agents, skills, inputs, and outputs. | v1.0 |
| **G7: Real-Time Visual Rendering** | Color-coded diagrams, live previews, and instant visual feedback for all agent activities and data structures. | v1.0 |

---

## 3. Architecture

### 3.1 The Harness Pattern

The platform's architecture is built on the **Harness Pattern**, a composable set of files, scripts, and conventions that wrap an AI coding agent in deterministic infrastructure. This pattern, pioneered in the agentic engineering community, ensures that agent behavior is reliable, auditable, and constrained by user-defined rules — rather than relying solely on probabilistic prompt engineering [1].

> "An AI coding agent is a programmable runtime with an LLM kernel. Every action the model takes passes through hooks you control. You define policies, not prompts." — Blake Crosley [1]

The platform is divided into **four distinct layers**, each with a clear responsibility:

| Layer | Components | Responsibility |
| :--- | :--- | :--- |
| **Core Layer** | LLM kernel, context window | Primary conversation handling and immediate user interactions. |
| **Instruction Layer** | Project context files, rules, memory definitions | Defines what each agent knows about its project. Loads automatically at session start. |
| **Extension Layer** | Skills registry, tool gateway, memory system, plugin connectors | Domain expertise auto-activation, deterministic action gates, persistent state, external service integration. |
| **Orchestration Layer** | Multi-agent coordinator, sub-agent spawner, consensus validator | Manages deliberation, parallel research, and quality validation across multiple specialized agents. |

### 3.2 Workspace Isolation Model

To ensure data integrity and security across multiple concurrent agents, the platform implements **strict workspace isolation** [2]. This is the technical precondition for safe parallel agent execution in any domain where agents modify state, including documents, databases, and data files.

The workspace isolation lifecycle follows a five-stage model:

1. **Initialize:** A new workspace is created for each agent or sub-agent, providing a private copy of the shared environment.
2. **Clone:** The workspace receives a snapshot of the parent project's relevant context (inputs, templates, agent definitions).
3. **Work:** The agent performs all state-mutating actions within its isolated workspace. Other agents cannot see or be affected by these changes.
4. **Compare:** A comparison operation evaluates the agent's changes against the baseline or against outputs of other agents.
5. **Merge or Discard:** If changes are accepted, they merge into the main project. If rejected, the workspace is deleted without side effects [2].

### 3.3 Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        OPEN KNOWLEDGE STUDIO v1.0                        │
├─────────────────────────────────────────────────────────────────────────┤
│  UI LAYER                                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │  Chat     │ │  Editor  │ │  Search   │ │  Metrics │ │  Settings│     │
│  │  Panel    │ │  Panel   │ │  Panel    │ │  Panel   │ │  Panel   │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
├─────────────────────────────────────────────────────────────────────────┤
│  ORCHESTRATION LAYER                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │  Agent        │ │  Sub-Agent   │ │  Consensus   │ │  Router      │   │
│  │  Coordinator  │ │  Spawner     │ │  Validator   │ │  (MCP/A2A)   │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  EXTENSION LAYER                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │  Skills   │ │  Tools   │ │  Memory  │ │  Plugins │ │  Connectors│   │
│  │  Registry │ │  Gateway │ │  System  │ │  Manager │ │  (MCP)    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
├─────────────────────────────────────────────────────────────────────────┤
│  INSTRUCTION LAYER                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Project Context Files  +  Agent Definitions  +  Memory.md       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  CORE LAYER                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Multi-Provider LLM Router (Gemini/Groq/OpenRouter/Anthropic)   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  STORAGE LAYER                                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │IndexedDB │ │Service   │ │File      │ │Cache API │ │Clipboard │     │
│  │(Main DB) │ │Worker    │ │System API│ │(PWA)     │ │API       │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Feature Specifications

### 4.1 Multi-Agent System

The platform supports a hierarchical multi-agent architecture where a primary **Coordinator Agent** can spawn, delegate to, and validate the work of specialized **Sub-Agents**.

#### 4.1.1 Agent Types

| Agent Type | Role | Example |
| :--- | :--- | :--- |
| **Coordinator Agent** | Manages workflow orchestration, delegates tasks, validates outputs | Research Director |
| **Research Agent** | Searches external sources, synthesizes findings, generates summaries | Literature Reviewer |
| **Data Agent** | Processes datasets, generates statistics, creates visualizations | Statistician |
| **Writing Agent** | Drafts documents, applies templates, formats outputs | Report Writer |
| **Review Agent** | Quality checks, peer review, consistency validation | Peer Reviewer |
| **Knowledge Agent** | Maintains memory, updates knowledge bases, manages references | Librarian |

#### 4.1.2 Agent Definition Schema

Each agent is defined through a GUI-based form (no code required) with the following properties:

```
Agent Definition:
  name: string          — Display name
  role: string          — Domain expertise description
  avatar: emoji         — Visual identifier (color-coded)
  systemPrompt: string  — Core behavioral instructions
  color: hex            — UI color coding (#4f46e5, #10b981, etc.)
  isActive: boolean     — Enabled/disabled toggle
  skills: string[]      — List of skill IDs this agent can use
  tools: string[]       — List of tool IDs this agent can access
  memoryType: enum      — None | Session | Persistent | Full
  maxTurnDepth: number  — Conversation depth limit
  provider: string      — Preferred LLM provider for this agent
  modelName: string     — Preferred model for this agent
```

#### 4.1.3 Inter-Agent Communication (A2A Protocol)

Agents communicate through the **Agent-to-Agent (A2A) Protocol**, an open standard that enables different, specialized AI agents to communicate directly with each other, delegate tasks, and coordinate actions [3] [4]. The protocol supports three communication patterns:

| Pattern | Description | Use Case |
| :--- | :--- | :--- |
| **Direct** | One agent sends a task to another and waits for the result | Coordinator assigns research task to Research Agent |
| **Swarm** | Multiple agents communicate directly without a central coordinator | Peer review among multiple Review Agents |
| **Hierarchical** | A coordinator delegates to sub-agents and collects results | Multi-stage report generation pipeline |

### 4.2 Agent Memory System

The memory architecture operates entirely in the browser using IndexedDB, providing GB-scale persistent storage without any external database service [5] [6].

#### 4.2.1 Memory Tiers

| Memory Type | Storage | Scope | Auto-Purge | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Session** | JavaScript variables | Current conversation | On page refresh | Short-term context for the active chat. |
| **Episodic** | IndexedDB `sessions` store | Per-project | Configurable | Records of past conversations with timestamps and summaries. |
| **Semantic** | IndexedDB `vectors` store (HNSW) | Per-project | Configurable | Vector embeddings of key concepts for semantic search [5]. |
| **Procedural** | IndexedDB `skills` store | Global + per-project | Never | Encoded domain expertise and operational rules [1]. |
| **Working** | IndexedDB `working` store | Per-session | On session end | Temporary scratchpad for agent computation. |
| **Long-Term** | IndexedDB `memory` store | Global | Manual only | Persistent knowledge base that agents reference across all sessions. |

#### 4.2.2 Memory Operations

The memory system supports the following operations through the agent's tool interface:

- **`remember(key, value, type)`** — Store a memory with a key, value, and type classification.
- **`recall(query)`** — Search across all memory types using fuzzy or semantic matching.
- **`forget(key)`** — Remove a specific memory entry.
- **`summarize(sessionId)`** — Compress a past conversation into a concise summary for episodic memory.
- **`embed(text)`** — Generate a vector embedding for semantic storage using browser-native Transformers.js [6].

### 4.3 Skills System

The skills system encodes domain expertise that auto-activates based on the LLM's reasoning. Rather than using keyword matching, the system leverages the model's own understanding to determine when a skill should be applied [1].

#### 4.3.1 Skill Definition Format

Skills are defined through a GUI form or by importing Markdown files. Each skill follows this format:

```markdown
---
name: outbreak-analysis
description: >
  Analyze epidemiological outbreak data including attack rates,
  incubation periods, and epi curves. Use when the user mentions
  outbreak, case counts, attack rate, or provides surveillance data.
allowed-tools: calculate, draw-chart, query-who
priority: high
---

## Instructions

1. Calculate the attack rate using: (new cases / population at risk) x 100
2. Determine the incubation period from case onset dates
3. Generate an epi curve visualization
4. Cross-reference with WHO disease thresholds
```

#### 4.3.2 Skill Categories

| Category | Description | Pre-Built Skills |
| :--- | :--- | :--- |
| **Epidemiology** | Outbreak analysis, surveillance, statistics | Attack Rate Calculator, Epi Curve Generator, R0 Estimator |
| **Research** | Literature review, citation management, synthesis | arXiv Searcher, PubMed Summarizer, Citation Formatter |
| **Writing** | Document drafting, formatting, template application | Report Writer, Policy Brief Generator, Protocol Template |
| **Data** | Statistical analysis, visualization, transformation | Chi-Square Test, Confidence Interval, Data Cleaner |
| **Integration** | External API access, data fetching, connector management | WHO Data Fetcher, CDC API Reader, Wikipedia Lookup |

#### 4.3.3 Skill Auto-Activation

The auto-activation mechanism works as follows:

1. The user sends a message to any agent.
2. The agent's system prompt includes a list of available skill descriptions.
3. The LLM evaluates whether any skill description matches the user's intent.
4. If a match is found, the skill's instructions are injected into the agent's working context.
5. The agent executes the skill's instructions and returns the result.

This process requires **no code, no configuration changes, and no manual trigger** — the LLM's reasoning handles the matching automatically [1].

### 4.4 Tools System

Tools are deterministic, pre-built functions that agents can invoke through a standardized interface. Unlike skills (which are instructional), tools are executable.

#### 4.4.1 Built-In Tools

| Tool | Type | Description | Free Source |
| :--- | :--- | :--- | :--- |
| `search-web` | API | Search the web via a free API endpoint | DuckDuckGo HTML API (no key) |
| `search-wikipedia` | API | Fetch Wikipedia articles and summaries | Wikipedia REST API (free, no key) |
| `search-arxiv` | API | Search academic papers on arXiv | arXiv API (free, no key) |
| `search-openalex` | API | Search scholarly works via OpenAlex | OpenAlex API (free, no key) |
| `search-pubmed` | API | Search biomedical literature | NCBI E-utilities (free) |
| `search-cdc` | API | Query CDC public health datasets | CDC WONDER API (free) |
| `search-who` | API | Query WHO Global Health Observatory | WHO GHO API (free) |
| `calculate` | Local | Mathematical computation engine | Built-in JavaScript |
| `draw-chart` | Local | Generate SVG charts and epi curves | Canvas/SVG native |
| `draw-diagram` | Local | Render Mermaid diagrams in real-time | Mermaid.js (CDN) |
| `render-latex` | Local | Typeset mathematical formulas | KaTeX (CDN) |
| `translate` | Local | Text translation (common languages) | Browser Intl API |
| `speak` | Local | Text-to-speech synthesis | Web Speech API |
| `dictate` | Local | Speech-to-text dictation | Web Speech API |
| `read-file` | Local | Read uploaded or local files | File System Access API |
| `write-file` | Local | Save outputs to local filesystem | File System Access API |
| `vectorize` | Local | Generate text embeddings | Transformers.js (WASM) |
| `semantic-search` | Local | Vector similarity search | IndexedDB + HNSW [5] |
| `export-pdf` | Local | Export documents as PDF | jsPDF (CDN) |
| `rss-fetch` | API | Parse and monitor RSS feeds | Built-in fetch + DOMParser |

#### 4.4.2 Tool Permission Levels

| Level | Scope | Example |
| :--- | :--- | :--- |
| **Safe** | Read-only, no external network | `calculate`, `draw-chart`, `read-file` |
| **Standard** | Read external APIs, no write | `search-wikipedia`, `search-arxiv` |
| **Elevated** | Write to project workspace | `write-file`, `export-pdf` |
| **Admin** | Modify system settings, install skills | Requires explicit user confirmation |

### 4.5 Plugin and Connector System

The platform implements an **MCP-compatible connector system** that allows agents to interact with external services through a standardized protocol [7].

#### 4.5.1 Connector Architecture

```
User → Platform UI → Connector Manager → MCP Client → External Service
                                                    ↓
                                          (REST / WebSocket / SSE)
```

Each connector is a self-contained module that implements the MCP interface:

- **Tools:** Functions the connector exposes to agents
- **Resources:** Data the connector can provide for context
- **Prompts:** Template instructions the connector can inject

#### 4.5.2 Pre-Built Connectors (All Free)

| Connector | Service | Protocol | Cost |
| :--- | :--- | :--- | :--- |
| **Google Drive** | File sync, document access | Google Drive API v3 | Free (15GB) |
| **Google Docs** | Document creation/editing | Google Docs API | Free |
| **Google Sheets** | Data import/export | Google Sheets API | Free |
| **GitHub** | Repository access, issue tracking | GitHub REST API | Free (unlimited public repos) |
| **Slack** | Team communication | Slack Web API | Free tier |
| **Email** | Notification, reporting | Browser mailto: + SMTP relay | Free |
| **RSS** | News/research feed monitoring | Built-in fetch + XML parser | Free |

#### 4.5.3 Connector GUI

The connector management interface provides:

- A visual list of available connectors with status indicators (connected, disconnected, error)
- One-click authentication for OAuth-based connectors (Google, GitHub)
- API key input fields for token-based connectors
- Connection health monitoring and automatic retry logic
- Permission scope display showing what data each connector can access

### 4.6 GUI-Based Provider Settings

All LLM provider configuration is handled through a dedicated **Settings Panel** accessible from any screen via a gear icon. The panel requires **zero coding** — users simply paste their API keys.

#### 4.6.1 Supported Providers (Free Tier)

| Provider | Free Models | Rate Limit (Free) | Context Window | OpenAI Compatible |
| :--- | :--- | :--- | :--- | :--- |
| **Google Gemini** | Gemini 2.5 Flash, 2.5 Pro | 5-15 RPM | 1M tokens | Partial |
| **Groq** | Llama 3.3 70B, Mixtral | 30 RPM | 128K tokens | Yes |
| **OpenRouter** | 20+ models (multi-provider) | 20 RPM | Up to 1M | Yes |
| **Cerebras** | Llama 3.3 70B | 30 RPM | 1M tokens | Yes |
| **GitHub Models** | GPT-4o, Claude 3.5 Sonnet | 15 RPM | 128K tokens | Yes |
| **Cloudflare Workers AI** | 20+ models | High | 2K-8K | Partial |
| **DeepSeek** | DeepSeek R1, V3 | 10M token trial | 64K | Yes |

#### 4.6.2 Provider Configuration Flow

1. User navigates to **Settings > AI Providers**.
2. User sees a list of supported providers with "Add Provider" buttons.
3. User clicks "Add Provider" and selects from the list (or enters a custom OpenAI-compatible endpoint).
4. User pastes their API key into a secure input field.
5. Platform validates the key by making a test request.
6. User can set preferences: default model, fallback provider, rate limit awareness.
7. Platform stores the configuration in IndexedDB (encrypted at rest).

#### 4.6.3 Intelligent Provider Routing

The platform includes a **Smart Router** that automatically selects the best provider based on:

- **Query complexity:** Simple queries route to fast, free models (Groq Llama 3.3 70B). Complex reasoning routes to Gemini 2.5 Pro.
- **Rate limit awareness:** If a provider's rate limit is approaching, the router fails over to an alternative.
- **Context window optimization:** Long documents route to providers with 1M+ token context windows (Gemini, Cerebras).
- **Cost prioritization:** The router always prefers free-tier models before falling back to paid options.

### 4.7 Workspace and Project Management

Each project in the platform is a **self-contained workspace** with its own agents, skills, inputs, outputs, and memory. Workspaces are completely isolated from one another.

#### 4.7.1 Workspace Creation Flow

1. User clicks **"New Project"** in the sidebar.
2. User enters a project name, description, and optional URL (e.g., a GitHub repo URL or Google Drive folder URL).
3. Platform scaffolds the workspace directory structure automatically.
4. User can immediately start adding agents, uploading files, or defining skills.

#### 4.7.2 Workspace Directory Structure

Inspired by the **Model Workspace Protocol (MWP)**, which demonstrates that folder structure can serve as the agent architecture itself [8]:

```
project-name/
├── 01_inputs/               # Raw user inputs, uploaded files, datasets
│   ├── datasets/            # CSV, JSON, Excel files
│   ├── documents/           # PDFs, DOCX, Markdown files
│   └── media/               # Images, videos, audio
├── 02_agents/               # Agent definitions and system prompts
│   ├── coordinator.md       # Main coordinator agent config
│   ├── researcher.md        # Research agent config
│   ├── writer.md            # Writing agent config
│   └── reviewer.md          # Review agent config
├── 03_templates/            # Pre-defined output templates
│   ├── outbreak-report.md   # Outbreak report template
│   ├── literature-review.md # Literature review template
│   └── policy-brief.md      # Policy brief template
├── 04_skills/               # Custom skills for this project
│   ├── outbreak-analysis/   # Skill definition directory
│   │   ├── SKILL.md         # Skill instructions
│   │   └── examples.md      # Few-shot examples
│   └── data-cleaning/
│       └── SKILL.md
├── 05_working/              # Agent working memory (ephemeral)
│   ├── draft-001.md         # Working drafts
│   └── analysis-001.json    # Intermediate data
├── 06_outputs/              # Final organized outputs
│   ├── reports/             # Completed reports
│   ├── visualizations/      # Charts, diagrams, maps
│   └── exports/             # PDF, HTML, DOCX exports
├── 07_memory/               # Persistent agent memory
│   ├── knowledge-base.md    # Accumulated project knowledge
│   ├── lessons-learned.md   # Procedural memory
│   └── glossary.md          # Project-specific terminology
├── 08_versions/             # Version history snapshots
│   └── (auto-generated)     # Timestamped snapshots
└── 09_config/               # Project configuration
    ├── providers.json       # LLM provider settings for this project
    ├── agents.json          # Agent roster for this project
    └── workspace.json       # Workspace metadata
```

#### 4.7.3 Workspace Operations

| Operation | Description |
| :--- | :--- |
| **Import from URL** | Pull files from a GitHub repo URL, Google Drive folder URL, or any public URL |
| **Drag & Drop** | Drop files or folders directly into any workspace directory via the File System Access API |
| **Clone Workspace** | Duplicate an existing workspace structure with all agents and skills |
| **Archive** | Compress and export an entire workspace as a ZIP file |
| **Share** | Generate a read-only link to share workspace outputs |

### 4.8 Real-Time Visual Rendering

The platform features a comprehensive visual rendering engine that provides immediate, color-coded feedback for all agent activities and data structures.

#### 4.8.1 Diagram Types

| Diagram Type | Library | Use Case | Color Coding |
| :--- | :--- | :--- | :--- |
| **Flowchart** | Mermaid.js | Workflow visualization, decision trees | Blue (start), Orange (process), Green (end) |
| **Sequence** | Mermaid.js | Agent-to-agent communication flows | Each agent gets its assigned color |
| **Gantt** | Mermaid.js | Project timelines, task scheduling | Red (overdue), Yellow (in progress), Green (done) |
| **Mind Map** | Mermaid.js | Knowledge organization, brainstorming | Color-coded by topic cluster |
| **Pie Chart** | Canvas/SVG | Data distribution, proportional analysis | Agent-defined palette |
| **Bar Chart** | Canvas/SVG | Comparative statistics, metrics | Color-coded by category |
| **Epi Curve** | Canvas/SVG | Epidemiological outbreak visualization | Red (cases), Blue (population) |
| **Heat Map** | Canvas/SVG | Geographic disease mapping | Color gradient (green to red) |
| **Tree** | Mermaid.js | Hierarchical data, organizational structure | Color-coded by level |

#### 4.8.2 Real-Time Features

- **Live Preview:** As agents type or process data, a live preview pane updates in real-time using the BroadcastChannel API for cross-tab synchronization [9].
- **Color-Coded Status Indicators:** Every agent activity is tagged with a color: green (success), yellow (processing), red (error), blue (info).
- **Animated Transitions:** CSS animations provide smooth visual feedback when agents transition between states.
- **Diagram Auto-Refresh:** Mermaid diagrams re-render automatically when the underlying data changes, providing instant visual feedback.

### 4.9 Knowledge Update System

The platform includes a **Real-Time Knowledge Update System** that enables agents to access the most current information from free, open sources.

#### 4.9.1 Free Knowledge Sources

| Source | API | Key Required | Update Frequency | Data Type |
| :--- | :--- | :--- | :--- | :--- |
| **Wikipedia** | REST | No | Real-time | Encyclopedic articles |
| **arXiv** | REST | No | Daily | Academic preprints |
| **OpenAlex** | REST | No (optional) | Weekly | Scholarly works, citations |
| **PubMed/PMC** | REST (E-utilities) | No | Daily | Biomedical literature |
| **Semantic Scholar** | REST | Optional | Daily | Paper summaries, TLDRs |
| **WHO GHO** | REST | No | Monthly | Global health indicators |
| **CDC WONDER** | REST | No | Weekly | US public health data |
| **GDELT** | REST | No | Every 15 min | Global news monitoring |
| **CrossRef** | REST | No | Real-time | DOI lookup, paper metadata |
| **RSS Feeds** | Built-in | No | User-defined | News, blogs, journals |

#### 4.9.2 Agent Knowledge Refresh Workflow

1. **Trigger:** Agent identifies a knowledge gap during task execution.
2. **Source Selection:** Agent selects the most appropriate free source based on the query type.
3. **Fetch:** Agent uses the built-in tool to query the source's API.
4. **Parse:** Results are parsed into structured data.
5. **Embed:** Key findings are embedded using Transformers.js and stored in the semantic memory [6].
6. **Cite:** All retrieved information is automatically cited with source, date, and URL.
7. **Cache:** Results are cached in IndexedDB to avoid redundant API calls.

#### 4.9.3 Output Standards

All agent outputs follow these standards:

| Standard | Description | Implementation |
| :--- | :--- | :--- |
| **Citation Format** | All claims backed by sources with dates | Auto-generated reference lists |
| **Confidence Scoring** | Each output tagged with confidence level | High/Medium/Low based on source quality |
| **Timestamp** | Every output includes creation timestamp | ISO 8601 format |
| **Version Tracking** | Outputs linked to their source version | Git-like hash for content |
| **Reproducibility** | All data processing steps documented | Step-by-step methodology |

---

## 5. User Interface Specifications

### 5.1 Layout Architecture

The platform uses a **four-panel layout** that adapts to screen size:

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Project Selector | Active Agents | Settings | Theme  │
├──────────┬───────────────────────────────────────────┬──────────────┤
│          │                                           │              │
│ SIDEBAR  │          MAIN CONTENT AREA                │  RIGHT PANEL │
│          │                                           │              │
│ Project  │  ┌─────────────────────────────────────┐ │  Context     │
│ Selector │  │                                     │ │  Panel       │
│          │  │   Chat / Editor / Dashboard /       │ │  (Agent      │
│ Agent    │  │   Search / Metrics / Kanban         │ │   Status,    │
│ Roster   │  │                                     │ │   Memory,    │
│          │  │                                     │ │   Tools)     │
│ Skills   │  │                                     │ │              │
│ Library  │  │                                     │ │              │
│          │  │                                     │ │              │
│ Templates│  └─────────────────────────────────────┘ │              │
│          │                                           │              │
│ Folders  ├───────────────────────────────────────────┤              │
│          │  BOTTOM BAR: Input | Send | Voice | Tools │              │
└──────────┴───────────────────────────────────────────┴──────────────┘
```

### 5.2 Color System

| Element | Dark Mode | Light Mode | Purpose |
| :--- | :--- | :--- | :--- |
| **Background** | `#0f0f1a` | `#f8f9fa` | Primary surface |
| **Panel** | `#1a1a2e` | `#ffffff` | Secondary surface |
| **Accent** | `#4f46e5` | `#4f46e5` | Primary action color |
| **Success** | `#10b981` | `#059669` | Positive feedback |
| **Warning** | `#f59e0b` | `#d97706` | Caution indicators |
| **Danger** | `#ef4444` | `#dc2626` | Error states |
| **Info** | `#3b82f6` | `#2563eb` | Informational elements |
| **Agent 1** | `#8b5cf6` | `#7c3aed` | Coordinator agent |
| **Agent 2** | `#06b6d4` | `#0891b2` | Research agent |
| **Agent 3** | `#10b981` | `#059669` | Writing agent |
| **Agent 4** | `#f59e0b` | `#d97706` | Review agent |

### 5.3 Theme System

The platform supports both **Dark** and **Light** themes with automatic detection of the user's system preference. The theme toggle is accessible from the header at all times.

### 5.4 Responsive Design

The layout adapts to three breakpoints:

| Breakpoint | Layout | Behavior |
| :--- | :--- | :--- |
| **Desktop (>1024px)** | Four-panel layout | All panels visible simultaneously |
| **Tablet (768-1024px)** | Three-panel layout | Right panel collapses to overlay |
| **Mobile (<768px)** | Single-panel layout | Panels switch via tab navigation |

---

## 6. Technology Stack

### 6.1 Verified Latest Stable Versions

All versions were verified against npm registries on July 25, 2026:

| Package | Version | Purpose | Notes |
| :--- | :--- | :--- | :--- |
| **react** | 19.2.8 | UI rendering | Concurrent features, Server Components ready |
| **react-dom** | 19.2.8 | DOM rendering | Must match react version |
| **vite** | 8.1.5 | Build tooling | Rolldown-based, 10-30x faster builds [10] |
| **typescript** | 7.0.2 | Type safety | Use `ignoreDeprecations: "7.0"` for paths without baseUrl |
| **@vitejs/plugin-react** | 6.0.4 | React Fast Refresh | Required for Vite 8 |
| **mermaid** | 11.16.0 | Diagram rendering | Real-time, dark/light themes, AI generation |
| **katex** | 0.18.1 | Math rendering | Auto-render extension included |
| **@types/react** | 19.2.17 | React type definitions | |
| **@types/react-dom** | 19.2.3 | ReactDOM type definitions | |
| **@types/node** | 26.1.1 | Node.js type definitions | |
| **@huggingface/transformers** | 4.2.0 | Browser-native ML models | Embeddings via WASM [6] |

### 6.2 CDN-Loaded Dependencies (Zero Runtime Cost)

These libraries are loaded via CDN and incur no npm install cost:

| Library | Version | CDN URL | Purpose |
| :--- | :--- | :--- | :--- |
| **Tailwind CSS** | Latest | `cdn.tailwindcss.com` | Utility-first CSS (dev mode) |
| **Mermaid.js** | 11.16.0 | `cdn.jsdelivr.net/npm/mermaid@11.16.0` | Diagram rendering |
| **KaTeX** | 0.18.1 | `cdn.jsdelivr.net/npm/katex@0.18.1` | Math formula rendering |
| **Google Identity** | Latest | `accounts.google.com/gsi/client` | OAuth authentication |

### 6.3 Browser-Native APIs (Zero Dependency)

| API | Capability | Browser Support |
| :--- | :--- | :--- |
| **IndexedDB** | Persistent storage (50GB+) | All modern browsers |
| **Service Worker** | Offline caching, background sync | Chrome, Firefox, Safari, Edge |
| **File System Access** | Read/write local files and folders | Chrome, Edge, Opera |
| **Web Speech (STT)** | Voice-to-text dictation | Chrome, Edge, Safari |
| **Web Speech (TTS)** | Text-to-speech synthesis | Chrome, Firefox, Edge, Safari |
| **BroadcastChannel** | Cross-tab real-time communication | All modern browsers |
| **Cache API** | Store large assets for offline use | All modern browsers |
| **Intl API** | Internationalization and translation | All modern browsers |
| **Canvas/SVG** | Chart and diagram rendering | All modern browsers |
| **Web Workers** | Background computation | All modern browsers |

### 6.4 Vite 8 Migration Notes

Vite 8 introduces the **Rolldown bundler**, a Rust-based replacement for Rollup that delivers 10-30x faster builds [10]. Key migration considerations:

| Change | Vite 7 (esbuild) | Vite 8 (Rolldown) | Action Required |
| :--- | :--- | :--- | :--- |
| **manualChunks** | Object format | Must be a function | Convert to arrow function |
| **Plugin API** | Rollup-compatible | Same plugin API | Most plugins work unchanged |
| **esbuild plugins** | Supported | Removed | Migrate to Rolldown-compatible plugins |
| **Build speed** | Standard | 10-30x faster | No action needed |

---

## 7. Free LLM Provider Matrix

This table summarizes the free-tier capabilities of all supported LLM providers, verified as of July 2026 [11]:

| Provider | Free Models | RPM | RPD | Context | OpenAI Compatible | Data Training Opt-in |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Gemini** | 2.5 Flash, 2.5 Pro, 1.5 Pro | 5-15 | 1,500 | 1M tokens | Partial | Yes (outside EU) |
| **Groq** | Llama 3.3 70B, Mixtral | 30 | 1,000 | 128K | Yes | No |
| **OpenRouter** | 20+ (multi-provider) | 20 | 50 | 1M | Yes | No |
| **Cerebras** | Llama 3.3 70B | 30 | ~1M tokens/day | 1M | Yes | No |
| **GitHub Models** | GPT-4o, Claude 3.5 Sonnet | 15 | 150-1,000 | 128K | Yes | No |
| **Cloudflare AI** | 20+ models | High | ~10K neurons/day | 8K | Partial | No |
| **DeepSeek** | R1, V3 | 10M token trial | Time-limited | 64K | Yes | No |

---

## 8. Security and Privacy

### 8.1 Data Handling

- All data is stored **locally** in the user's browser (IndexedDB). No data leaves the browser unless explicitly shared via a connector.
- API keys are stored in IndexedDB with encryption at rest. They are never transmitted to any server except the respective API provider.
- The platform never transmits user data to third-party analytics or tracking services.

### 8.2 Authentication

- Google OAuth 2.0 for connector authentication (Google Drive, Docs, Sheets).
- API key-based authentication for LLM providers (stored locally, encrypted).
- No user accounts, no passwords, no server-side authentication required.

### 8.3 Privacy Guarantees

| Concern | Mitigation |
| :--- | :--- |
| Data sent to LLM providers | User controls which provider handles which query |
| Connector data access | OAuth scopes are displayed and user-approved before connection |
| Browser storage | IndexedDB is sandboxed per origin; cannot be accessed by other websites |
| Service Worker | Only caches app assets, never user data |
| No tracking | No analytics, no telemetry, no fingerprinting |

---

## 9. Performance Targets

| Metric | Target | Measurement |
| :--- | :--- | :--- |
| **Initial Load Time** | < 2 seconds | Time to Interactive (TTI) |
| **Search Response** | < 100ms | Client-side IndexedDB query |
| **Diagram Render** | < 500ms | Mermaid.js SVG generation |
| **Chart Render** | < 200ms | Canvas/SVG native rendering |
| **Voice Input** | < 300ms latency | Web Speech API |
| **Offline Mode** | 100% functional | Service Worker cache hit |
| **Build Time** | < 5 seconds | Vite 8 Rolldown bundler |
| **Production Bundle** | < 100KB (gzip) | Excluding CDN-loaded libraries |

---

## 10. Roadmap

### 10.1 Version 1.0 (Current — This PRD)

The features described in this document constitute the complete v1.0 specification.

### 10.2 Future Enhancements (v1.1+)

| Feature | Description | Priority |
| :--- | :--- | :--- |
| **Transformers.js Integration** | Browser-native embedding models for semantic memory [6] | High |
| **WebGPU Acceleration** | GPU-accelerated vector search and ML inference | Medium |
| **Collaborative Editing** | Real-time multi-user document editing via CRDTs | Medium |
| **Plugin Marketplace** | Community-contributed skills and connectors | Low |
| **Voice Commands** | Full voice-controlled navigation and agent management | Low |
| **DHIS2 Integration** | Health information system data import/export | Medium |
| **Geographic Mapping** | Leaflet.js integration for disease mapping | High |

---

## 11. Constraints and Assumptions

### 11.1 Constraints

1. **Zero Budget:** No paid services, subscriptions, or API costs beyond free tiers.
2. **No Backend:** The platform runs entirely in the browser. No server-side code, no database, no hosting costs.
3. **Browser Compatibility:** Primary support for Chrome/Edge (full feature set). Graceful degradation for Firefox/Safari.
4. **No npm Dependencies:** Only React and Vite at runtime. All other capabilities are browser-native or CDN-loaded.

### 11.2 Assumptions

1. Users have access to at least one free LLM API key (Google AI Studio, Groq, or OpenRouter).
2. Users are running a modern browser (Chrome 120+, Firefox 121+, Safari 17.2+, Edge 120+).
3. Users understand the distinction between free-tier rate limits and paid tiers.
4. The platform is used primarily in field settings where internet connectivity may be intermittent.

---

## 12. Success Criteria

| Criterion | Measurement | Target |
| :--- | :--- | :--- |
| **Feature Completeness** | All features in Sections 4.1-4.9 implemented | 100% |
| **Zero Dependency** | No runtime npm packages beyond React + Vite | 2 packages |
| **Offline Capability** | Full functionality without internet | 100% |
| **Build Success** | TypeScript compiles, Vite builds successfully | 0 errors |
| **Performance** | Meets all targets in Section 9 | 100% |
| **Documentation** | All docs in docs/ folder complete and accurate | 100% |
| **Git Ready** | Repository structured for immediate git init + push | Ready |

---

## References

[1]: Blake Crosley. "Agent Architecture: Building AI-Powered Development Harnesses." https://blakecrosley.com/guides/agent-architecture

[2]: AI21 Labs. "What is Workspace Isolation?" https://www.ai21.com/glossary/ai-agent/what-is-workspace-isolation/

[3]: Anthropic. "Model Context Protocol (MCP)." https://modelcontextprotocol.io/

[4]: Google Developers. "Announcing the Agent2Agent Protocol (A2A)." https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/

[5]: Jason Mayes. "VectorSearch.js." https://github.com/jasonmayes/VectorSearch.js

[6]: Hugging Face. "Transformers.js." https://huggingface.co/docs/transformers.js/en/index

[7]: Google Developers. "Getting Started with Agent2Agent (A2A) Protocol." https://codelabs.developers.google.com/intro-a2a-purchasing-concierge

[8]: Jake Van Clief, David McDermott. "Interpretable Context Methodology: Folder Structure as Agent Architecture." arXiv:2603.16021v1. https://arxiv.org/html/2603.16021v1

[9]: MDN Web Docs. "BroadcastChannel API." https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel

[10]: Vite Team. "Vite 8.0 is out!" https://vite.dev/blog/announcing-vite8

[11]: OpenRouter. "Free LLM APIs Compared: Rate Limits, Models, and Real Costs (2026)." https://openrouter.ai/blog/tutorials/free-llm-apis-compared/

[12]: OpenAlex. "The open catalog to the global research system." https://openalex.org/

[13]: Centers for Disease Control and Prevention. "Data." https://data.cdc.gov/

[14]: Google AI. "Gemini API Rate Limits." https://ai.google.dev/gemini-api/docs/rate-limits
