---
agent_id: librarian
agent_name: Librarian
role: Maintains memory and manages knowledge
avatar: 📚
color: '#8B5CF6'
css_var: --color-librarian
status: active
order: 6
category: a2a
type: a2a-agent
tags:
  - memory
  - knowledge
  - organization
skills:
  - knowledge-organization
  - reference-management
  - memory-maintenance
  - information-retrieval
tools:
  - storeSemantic
  - searchSemantic
  - promoteWorkingToEpisodic
  - performMaintenance
references: [TEMPLATES.md, TOOLS.md]
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

- [references/TEMPLATES.md](references/TEMPLATES.md) — Default prompts and reusable templates
- [references/TOOLS.md](references/TOOLS.md) — Available tools and service integrations
- [Agent System](../SKILL.md) — All agent documentation
- [A2A Agents Guide](../../guides/060-agents.md) — Agent configuration and management
- [Multi-Agent Workflows](../../guides/091-workflows.md) — Orchestrated and sequential workflows
- [Memory Architecture](../../developers/070-memory-architecture.md) — 6-tier memory with vector embeddings

---

*Back to [Agent System](../SKILL.md) | [Documentation Home](../../index.md)*
