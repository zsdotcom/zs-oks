---
title: "006 — Librarian Agent"
description: "Memory maintenance and knowledge organization agent for reference management and retrieval"
category: "agents"
order: 6
tags: ["agent", "librarian", "memory", "knowledge"]
last_updated: "2026-07-28"
audience: "users"
---

# A2A Agent: Librarian

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `librarian` |
| Name | Librarian |
| Role | Maintains memory and manages knowledge |
| Avatar | 📚 |
| Color | `#8B5CF6` (Purple) |
| CSS Variable | `--color-librarian` |
| Status | Active by default |
| Category | a2a |
| Order | 6 |

## System Prompt

```
You are the Librarian Agent of Open Knowledge Studio. Your role is to maintain memory, organize knowledge, manage references, and ensure information is properly indexed and retrievable.
```

## Capabilities

- Knowledge organization and taxonomy
- Reference management and citation formatting
- Memory maintenance and indexing
- Information retrieval strategy

## Skills

| Skill | Description | Triggers | Priority |
| :--- | :--- | :--- | :--- |
| Knowledge Organization | Categorize and tag information | New information or reference | high |
| Reference Management | Maintain citation databases and bibliographies | New source or citation | high |
| Memory Maintenance | Purge outdated episodic memories, promote important ones | Scheduled maintenance or threshold | medium |
| Information Retrieval | Efficient search and retrieval strategies | Search or recall request | high |

## Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| storeSemantic | src/services/memoryApi.ts | Store data with auto-embedding | user |
| searchSemantic | src/services/memoryApi.ts | Hybrid search across all memory tiers | user |
| promoteWorkingToEpisodic | src/services/memoryApi.ts | Move working memory to episodic memory | user |
| performMaintenance | src/services/memoryApi.ts | Episodic memory purge (90-day threshold) | admin |

## Configuration

The Librarian is configured via the Settings Panel. Key settings include:

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
You are the Librarian Agent of Open Knowledge Studio. Your role is to maintain memory, organize knowledge, manage references, and ensure information is properly indexed and retrievable.
```

## Usage

- The **Default System Prompt** is loaded automatically when the Librarian is activated in an A2A debate.
- The Librarian relies on the **Memory API** (`memoryApi.ts`) for storage and retrieval. See the [Memory Architecture Guide](../developers/005-memory-architecture.md) for details on the 6-tier memory system.


## Workflow Patterns


The Librarian agent typically operates within:

## Memory Maintenance Cycle

Periodic purging of outdated episodic memories, promotion of important information, and indexing optimization.

## On-Demand Retrieval

Responds to search and recall requests from other agents, leveraging the 6-tier memory system with vector embeddings.

See [Memory Architecture](../developers/005-memory-architecture.md) for detailed memory patterns.


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
