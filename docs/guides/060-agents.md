---
title: "060 — A2A Agents Guide"
category: "guides"
order: 60
tags: ["agents", "a2a", "debate", "configuration"]
last_updated: "2026-07-26"
---

# 060 — A2A Agents Guide

---

## 1. Overview

Open Knowledge Studio ships with **6 A2A debate agents** that provide multi-perspective analysis on user prompts. Each agent has a distinct role, color-coded identity, avatar, and system prompt. All agents respond independently to the same user prompt in the A2A debate panel.

Agents are defined in `DEFAULT_A2A_AGENTS` in `src/App.tsx:85-92`.

---

## 2. Agent Roster

| ID | Name | Role | Avatar | Color | Memory | Provider | Default Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `coord` | **Coordinator** | Orchestrates workflows, delegates tasks, validates outputs | 🎯 | `#8B5CF6` | Full | Gemini 2.5 Pro | Active |
| `research` | **Researcher** | Searches and synthesizes information with citations | 🔬 | `#06B6D4` | Persistent | Groq Llama 3.3 70B | Active |
| `data` | **Data Analyst** | Processes data, statistics, visualizations | 📊 | `#F59E0B` | Session | Groq Llama 3.3 70B | Active |
| `writer` | **Writer** | Drafts documents, applies templates, formats outputs | ✍️ | `#10B981` | Session | Gemini 2.5 Flash | Active |
| `review` | **Reviewer** | Quality checks, citation audit, compliance | 🔍 | `#EF4444` | Session | Gemini 2.5 Flash | Active |
| `librarian` | **Librarian** | Maintains memory, organizes knowledge, references | 📚 | `#A855F7` | Full | Gemini 2.5 Flash | Active |

### Skills & Tools per Agent

| Agent | Assigned Skills | Assigned Tools |
|:---|:---|:---|
| Coordinator | `workflow-decompose`, `workflow-delegate`, `workflow-validate`, `workflow-merge` | `spawn-agent`, `status-track`, `send-message`, `read-file`, `write-file`, `list-agents`, `remember`, `recall` |
| Researcher | `literature-review`, `outbreak-research`, `guideline-research`, `source-evaluate` | `search-wikipedia`, `search-arxiv`, `search-openalex`, `search-pubmed`, `search-who`, `search-cdc`, `search-web`, `rss-fetch`, `read-file`, `write-file`, `vectorize`, `semantic-search`, `remember`, `recall` |
| Data Analyst | `attack-rate-calc`, `epi-curve`, `r0-estimator`, `chi-square-test`, `confidence-interval`, `data-clean`, `outbreak-detection` | `calculate`, `draw-chart`, `draw-diagram`, `render-latex`, `read-file`, `write-file`, `vectorize`, `remember`, `recall` |
| Writer | `report-writer`, `policy-brief`, `protocol-template`, `citation-format`, `executive-summary` | `read-file`, `write-file`, `export-pdf`, `render-latex`, `speak`, `remember`, `recall` |
| Reviewer | `quality-check`, `consistency-audit`, `citation-audit`, `methodology-review`, `compliance-check` | `read-file`, `write-file`, `send-message`, `calculate`, `semantic-search`, `recall` |
| Librarian | `memory-maintenance`, `knowledge-refresh`, `index-rebuild`, `reference-manager`, `glossary-build` | `remember`, `recall`, `forget`, `vectorize`, `semantic-search`, `search-wikipedia`, `search-openalex`, `read-file`, `write-file` |

---

## 3. System Prompts

### Coordinator
"Orchestrates workflows, decomposes complex tasks, delegates to specialists, monitors progress, validates outputs. Saves key decisions to episodic memory. Uses color-coded status: 🟢 Complete, 🟡 In Progress, 🔴 Error."

### Researcher
"Identifies research queries, synthesizes findings from free APIs (Wikipedia, arXiv, OpenAlex, PubMed, WHO, CDC), generates structured summaries with citations, tags with confidence levels (High/Medium/Low). Caches API results in IndexedDB."

### Data Analyst
"Processes datasets, performs statistical analysis, generates visualizations (Mermaid diagrams, KaTeX formulas), computes epidemiological metrics, handles missing data. Provides confidence intervals. Color-codes charts."

### Writer
"Drafts documents from research notes and data. Applies templates, formats outputs, uses APA citations. Never invents facts. Generates executive summaries. Saves drafts to working memory."

### Reviewer
"Performs quality checks, audits citations for validity, validates compliance with WHO/CDC standards, identifies contradictions. Provides severity-rated feedback (Critical/Major/Minor). Rates quality 1-5."

### Librarian
"Maintains all 6 memory tiers, runs periodic knowledge refresh cycles from free sources, rebuilds semantic search index, manages references, builds glossaries. Never deletes memories without confirmation."

---

## 4. A2A Debate Flow

1. User activates the A2A panel in Chat Interface.
2. User submits a prompt (e.g., a design proposal, research question).
3. Each active agent receives the prompt and generates a response based on its system prompt.
4. Responses appear in the chat with agent name, avatar, and color.
5. Metrics are tracked in A2AMetricsDashboard.

---

## 5. Custom Agent Creation

Users can create custom agents through the Settings Panel:
1. Name and avatar (emoji).
2. System prompt (expertise description).
3. Color for UI differentiation.
4. Active/inactive toggle.

Custom agents persist in IndexedDB's `a2aAgents` store alongside defaults.

---

## See Also

- [User Guide: Multi-Agent Workflows](091-workflows.md) — Orchestrated and sequential workflow modes
- [Developer Guide: Memory Architecture](../developers/070-memory-architecture.md) — 6-tier memory for agent context
- [Project Overview](../project/000-overview.md) — Agent color-coding and roles
- [Project Feature Status](../project/090-feature-status.md) — Extended agent schema with skills, tools, and memory types

---

*Back to [Documentation Home](../index.md) | [Project Docs](../project/000-overview.md) | [Developer Docs](../developers/040-development.md)*
