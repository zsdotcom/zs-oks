---
title: "010 — A2A Agents Guide"
category: "guides"
order: 10
tags: ["agents", "a2a", "debate", "configuration", "custom-agents"]
last_updated: "2026-07-27"
---

# 010 — A2A Agents Guide

---

## 1. Overview

Open Knowledge Studio ships with **6 A2A (Agent-to-Agent) debate agents** that provide multi-perspective analysis on user prompts. Each agent has a distinct role, color-coded identity, emoji avatar, memory type, and system prompt. All active agents receive the same user prompt in parallel and generate independent responses.

Agents are defined in `DEFAULT_A2A_AGENTS` at `src/App.tsx:108-151`.

---

## 2. Agent Roster

| ID | Name | Role | Avatar | Color | Memory | Provider | Model | Default |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `coord` | **Coordinator** | Orchestrates workflows, delegates tasks, validates outputs | 🎯 | `#8B5CF6` | Full | Gemini | 2.5 Pro | Active |
| `research` | **Researcher** | Searches and synthesizes information with citations | 🔬 | `#06B6D4` | Persistent | Groq | Llama 3.3 70B | Active |
| `data` | **Data Analyst** | Processes data, statistics, visualizations | 📊 | `#F59E0B` | Session | Groq | Llama 3.3 70B | Active |
| `writer` | **Writer** | Drafts documents, applies templates, formats outputs | ✍️ | `#10B981` | Session | Gemini | 2.5 Flash | Active |
| `review` | **Reviewer** | Quality checks, citation audit, compliance | 🔍 | `#EF4444` | Session | Gemini | 2.5 Flash | Active |
| `librarian` | **Librarian** | Maintains memory, organizes knowledge, references | 📚 | `#A855F7` | Full | Gemini | 2.5 Flash | Active |

### Memory Types

| Type | Persistence | Description |
| :--- | :--- | :--- |
| **Session** | Current chat session | Ephemeral context within a single session |
| **Persistent** | Across sessions | Survives browser restarts, used for accumulated knowledge |
| **Full** | All tiers | Access to all 6 memory tiers (Session, Episodic, Semantic, Procedural, Working, Long-Term) |

---

## 3. System Prompts

Each agent has a detailed system prompt that defines its behavior. Below are the verbatim prompts from the source code.

### Coordinator
> "You are the Coordinator Agent of Open Knowledge Studio. Your role is to receive user requests and analyze their complexity. If the task is simple, handle it directly. If the task is complex, decompose it into sub-tasks and delegate to the appropriate specialized agents. Monitor the progress of delegated agents using the A2A protocol. Validate each agent's output before merging it into the final response. Save all key decisions and outcomes to episodic memory. Use color-coded status updates: 🟢 Complete, 🟡 In Progress, 🔴 Error."

### Researcher
> "You are the Research Agent of Open Knowledge Studio. Your role is to identify the user's research query and determine the best sources. Query relevant free APIs (Wikipedia, arXiv, OpenAlex, PubMed, WHO, CDC). Synthesize findings into a structured summary with inline citations. Evaluate source credibility. Tag all findings with confidence levels (High/Medium/Low). Always include source URL, access date, and relevance score for each cited piece of information. Cache API results in IndexedDB to avoid redundant calls."

### Data Analyst
> "You are the Data Analyst Agent of Open Knowledge Studio. Your role is to read and parse datasets uploaded by the user (CSV, JSON). Clean the data: handle missing values, normalize formats, detect outliers. Perform statistical analysis using the calculate tool. Generate visualizations: charts, epi curves, and Mermaid diagrams. Compute epidemiological metrics: attack rates, R0, confidence intervals. Always include confidence intervals with all statistical estimates. Use color-coded charts: red for critical values, green for normal range. When presenting data, generate diagrams using Mermaid syntax inside \`\`\`mermaid code fences. Use KaTeX $$inline math$$ for statistical formulas."

### Writer
> "You are the Writer Agent of Open Knowledge Studio. Your role is to draft documents from research notes and data. Apply the appropriate template. Use consistent citation formatting (APA by default). Generate executive summaries for complex documents. Never invent facts. Only use information from provided research notes. Always cite sources using the project's configured citation style. Include a methodology section for all analytical documents."

### Reviewer
> "You are the Reviewer Agent of Open Knowledge Studio. Your role is to review documents and outputs from other agents for quality and accuracy. Check for internal consistency: do numbers match across sections? Audit citations: are they complete, valid, and properly formatted? Review methodology: are statistical methods appropriate and correctly applied? Check compliance with WHO/CDC reporting standards where applicable. Provide structured feedback with severity levels: Critical, Major, Minor. Rate overall quality on a scale of 1-5 with justification."

### Librarian
> "You are the Librarian Agent of Open Knowledge Studio. Your role is to maintain all six memory tiers: Session, Episodic, Semantic, Procedural, Working, and Long-Term. Run periodic knowledge refresh cycles using free sources (Wikipedia, OpenAlex, WHO, CDC). Rebuild the semantic search index when new documents are added. Manage references and build project-specific glossaries. Compress episodic memory by summarizing old sessions. Never delete memories without user confirmation. Always cite the source when refreshing knowledge."

---

## 4. Skills & Tools per Agent

### Coordinator

| Skills | Tools |
|:---|:---|
| `workflow-decompose` — Break tasks into sub-steps | `spawn-agent` — Launch sub-agent |
| `workflow-delegate` — Assign to specialists | `status-track` — Track task progress |
| `workflow-validate` — Check output quality | `send-message` — Communicate with agents |
| `workflow-merge` — Combine results | `read-file`, `write-file` — File I/O |
| | `list-agents` — Enumerate available agents |
| | `remember`, `recall` — Memory operations |

### Researcher

| Skills | Tools |
|:---|:---|
| `literature-review` — Find academic papers | `search-wikipedia`, `search-arxiv` |
| `outbreak-research` — Epidemic intelligence | `search-openalex`, `search-pubmed` |
| `guideline-research` — WHO/CDC protocols | `search-who`, `search-cdc`, `search-web` |
| `source-evaluate` — Credibility scoring | `rss-fetch` — Get RSS feeds |
| | `read-file`, `write-file` |
| | `vectorize`, `semantic-search` |
| | `remember`, `recall` |

### Data Analyst

| Skills | Tools |
|:---|:---|
| `attack-rate-calc` — Compute attack rates | `calculate` — Run arithmetic/statistics |
| `epi-curve` — Generate epidemic curves | `draw-chart` — Create charts |
| `r0-estimator` — Reproduction number | `draw-diagram` — Generate diagrams |
| `chi-square-test` — Statistical testing | `render-latex` — Render KaTeX formulas |
| `confidence-interval` — CI computation | `read-file`, `write-file` |
| `data-clean` — Preprocess datasets | `vectorize`, `remember`, `recall` |
| `outbreak-detection` — Identify clusters | |

### Writer

| Skills | Tools |
|:---|:---|
| `report-writer` — Compose reports | `read-file`, `write-file` |
| `policy-brief` — Write policy summaries | `export-pdf` — Generate PDF output |
| `protocol-template` — Apply templates | `render-latex` — Render math |
| `citation-format` — Format references (APA) | `speak` — Text-to-speech |
| `executive-summary` — Summarize documents | `remember`, `recall` |

### Reviewer

| Skills | Tools |
|:---|:---|
| `quality-check` — Overall quality audit | `read-file`, `write-file` |
| `consistency-audit` — Cross-section checks | `send-message` — Communicate feedback |
| `citation-audit` — Reference validation | `calculate` — Verify numbers |
| `methodology-review` — Statistical rigor | `semantic-search` — Find contradictions |
| `compliance-check` — WHO/CDC compliance | `recall` — Retrieve context |

### Librarian

| Skills | Tools |
|:---|:---|
| `memory-maintenance` — Manage tiers | `remember`, `recall`, `forget` |
| `knowledge-refresh` — Update from sources | `vectorize` — Embed documents |
| `index-rebuild` — Rebuild search index | `semantic-search` — Query by meaning |
| `reference-manager` — Manage citations | `search-wikipedia`, `search-openalex` |
| `glossary-build` — Create term glossaries | `read-file`, `write-file` |

---

## 5. A2A Debate Flow

The A2A debate panel operates as follows:

1. User activates the A2A panel in the Chat Interface
2. User submits a prompt (research question, data analysis request, document draft)
3. Each **active** agent receives the prompt and generates a response based on its system prompt
4. Responses appear in the chat with the agent's name, avatar, and color-coding
5. The Coordinator (if active) may attempt to synthesize responses into a cohesive answer
6. Metrics (latency, token estimates) are tracked in the A2AMetricsDashboard

```mermaid
flowchart LR
  U[User Prompt] --> A2A{A2A Debate}
  A2A --> C[Coordinator]
  A2A --> R[Researcher]
  A2A --> D[Data Analyst]
  A2A --> W[Writer]
  A2A --> V[Reviewer]
  A2A --> L[Librarian]
  
  C --> |Decompose| S[Synthesize]
  R --> |Research| S
  D --> |Analysis| S
  W --> |Draft| S
  V --> |Audit| S
  L --> |Knowledge| S
  
  S --> Out[Final Response]

  style C fill:#8B5CF6,color:#fff
  style R fill:#06B6D4,color:#fff
  style D fill:#F59E0B,color:#fff
  style W fill:#10B981,color:#fff
  style V fill:#EF4444,color:#fff
  style L fill:#A855F7,color:#fff
```

---

## 6. Toggling Agents On/Off

You can enable or disable individual agents:

1. In the chat interface, locate the **agent indicators** (shown as colored dots or icons)
2. Click on an agent to toggle it between active/inactive
3. Inactive agents are grayed out and do not respond to prompts
4. Changes take effect immediately for the next prompt

This is useful when you want only specific perspectives (e.g., only Researcher + Data Analyst for a data-finding task).

---

## 7. Creating Custom Agents

Users can create custom agents through the **Settings Panel**:

1. Open **Settings** (Gear icon in the header)
2. Navigate to the **A2A Agents** section
3. Click **Add Custom Agent**
4. Configure:

| Field | Description | Example |
|:---|:---|:---|
| **Name** | Display name for the agent | "Epidemiologist" |
| **Avatar** | Single emoji character | 🦠 |
| **Color** | Hex color for UI differentiation | `#22C55E` |
| **System Prompt** | Expertise definition that guides behavior | "You are an epidemiologist..." |
| **Active** | Toggle on/off | On |

5. Click **Save**

The custom agent is persisted in IndexedDB's `a2aAgents` store alongside the defaults and will appear in the chat interface as an additional participant.

Custom agents can be assigned to workflows just like built-in agents. See [Multi-Agent Workflows](020-workflows.md) for details.

---

## 8. Metrics Dashboard

The `A2AMetricsDashboard` (lazy-loaded component) provides:

- Per-agent response latency
- Token usage estimates
- Active vs. inactive agent status
- Historical performance data

Access it from the tools panel after running an A2A debate.

---

## See Also

- [Getting Started](000-getting-started.md) — First-time user walkthrough
- [Multi-Agent Workflows](020-workflows.md) — Orchestrated and sequential modes
- [Sandboxed Code Execution](050-sandbox.md) — How agents run code safely
- [Connectors Guide](080-connectors.md) — External service connectors for agents
- [Developer Guide: Memory Architecture](../developers/070-memory-architecture.md) — 6-tier memory system
- [Portal Overview](../index.md) — Full documentation index

---

*Back to [Documentation Home](../index.md)*
