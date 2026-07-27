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
tags:
  - memory
  - knowledge
  - organization
skill_count: 4
tool_count: 4
---

# Librarian — Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| storeSemantic | src/services/memoryApi.ts | Store data with auto-embedding | user |
| searchSemantic | src/services/memoryApi.ts | Hybrid search across all memory tiers | user |
| promoteWorkingToEpisodic | src/services/memoryApi.ts | Move working memory to episodic memory | user |
| performMaintenance | src/services/memoryApi.ts | Episodic memory purge (90-day threshold) | admin |

## Integration

These tools integrate with the 6-tier memory system. See:

- [Memory Architecture](../../../developers/070-memory-architecture.md) — 6-tier memory with vector embeddings
- [Memory API Source](../../../developers/004-development.md) — Service layer architecture

---

*Back to [Librarian SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
