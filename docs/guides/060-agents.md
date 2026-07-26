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

| ID | Name | Role | Avatar | Color | Default Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `coord` | **Coordinator** | Orchestrates workflows, delegates tasks, validates outputs | 🎯 | `#8B5CF6` | Active |
| `research` | **Researcher** | Searches and synthesizes information with citations | 🔬 | `#06B6D4` | Active |
| `data` | **Data Analyst** | Processes data, statistics, visualizations | 📊 | `#F59E0B` | Active |
| `writer` | **Writer** | Drafts documents, applies templates, formats outputs | ✍️ | `#10B981` | Active |
| `review` | **Reviewer** | Quality checks, citation audit, compliance | 🔍 | `#EF4444` | Active |
| `librarian` | **Librarian** | Maintains memory, organizes knowledge, references | 📚 | `#8B5CF6` | Active |

---

## 3. System Prompts

### Coordinator
"Orchestrates workflows, decomposes complex tasks, delegates to specialists, monitors progress, validates outputs."

### Researcher
"Identifies research queries, synthesizes findings, generates structured summaries with citations, tags with confidence levels."

### Data Analyst
"Processes datasets, performs statistical analysis, generates visualizations, computes metrics, handles missing data."

### Writer
"Drafts documents from structured data, applies templates, formats outputs, ensures claims are evidence-backed."

### Reviewer
"Performs quality checks, audits citations, validates compliance, identifies contradictions, provides constructive feedback."

### Librarian
"Maintains memory, organizes knowledge, manages references, ensures information is properly indexed and retrievable."

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
