---
title: "002 — Researcher Agent"
description: "Literature synthesis agent specializing in source evaluation, citation management, and research synthesis"
category: "agents"
order: 2
tags: ["agent", "researcher", "literature"]
last_updated: "2026-07-28"
audience: "users"
---

# A2A Agent: Researcher

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `research` |
| Name | Researcher |
| Role | Searches and synthesizes information |
| Avatar | 🔬 |
| Color | `#06B6D4` (Cyan) |
| CSS Variable | `--color-research` |
| Status | Active by default |
| Category | a2a |
| Order | 2 |

## System Prompt

```
You are the Research Agent of Open Knowledge Studio. Your role is to identify research queries, synthesize findings from available information, and generate structured summaries with proper citations. Tag all findings with confidence levels.
```

## Capabilities

- Literature synthesis and knowledge gaps
- Source credibility assessment
- Structured summarization with citations
- Confidence-level tagging of findings

## Skills

| Skill | Description | Triggers | Priority |
| :--- | :--- | :--- | :--- |
| Literature Synthesis | Identify and combine findings from multiple sources | Research query or knowledge gap | high |
| Source Evaluation | Assess credibility, relevance, and timeliness of sources | New source or citation provided | high |
| Citation Management | Generate structured citations with confidence levels | Finding requiring attribution | high |
| Knowledge Gap Analysis | Identify missing or inconclusive information | Incomplete or conflicting data | medium |

## Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | Generate research summaries via LLM | user |
| search | src/services/searchService.ts | Keyword search across knowledge base | user |
| searchSemantic | src/services/memoryApi.ts | Hybrid vector+keyword semantic search | user |

## Configuration

The Researcher is configured via the Settings Panel. Key settings include:

- **System Prompt** — Customize the base instructions
- **Active/Inactive** — Toggle participation in A2A debates
- **Memory Type** — Choose between session, persistent, or full memory

## Related Documentation

- [#templates](#templates) — Default prompts and reusable templates
- [#tools](#tools) — Available tools and service integrations
- [Agent System](000-index.md) — All agent documentation
- [A2A Agents Guide](../guides/001-agents.md) — Agent configuration and management
- [Multi-Agent Workflows](../guides/002-workflows.md) — Orchestrated and sequential workflows
- [Memory Architecture](../developers/005-memory-architecture.md) — 6-tier memory with vector embeddings

---


## Templates


## Default System Prompt

```
You are the Research Agent of Open Knowledge Studio. Your role is to identify research queries, synthesize findings from available information, and generate structured summaries with proper citations. Tag all findings with confidence levels.
```

## Usage

- The **Default System Prompt** is loaded automatically when the Researcher is activated in an A2A debate.
- Skills such as **Literature Synthesis** and **Citation Management** are invoked by the system prompt during research tasks.


## Workflow Patterns


The Researcher agent typically operates within:

## Parallel Research

Multiple research queries executed simultaneously across different knowledge sources, with results synthesized at the end.

## Iterative Deep-Dive

Initial findings trigger follow-up queries to fill knowledge gaps, with confidence-level tracking per finding.

See [Multi-Agent Workflows](../guides/002-workflows.md) for detailed patterns.


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
