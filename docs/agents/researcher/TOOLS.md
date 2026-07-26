---
agent_id: research
agent_name: Researcher
role: Searches and synthesizes information
avatar: 🔬
color: '#06B6D4'
css_var: --color-research
status: active
order: 2
category: a2a
tags:
  - research
  - synthesis
  - citations
skill_count: 4
tool_count: 3
---

# Researcher — Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | Generate research summaries via LLM | user |
| search | src/services/searchService.ts | Keyword search across knowledge base | user |
| searchSemantic | src/services/memoryApi.ts | Hybrid vector+keyword semantic search | user |

## Integration

These tools integrate with the search and memory services. See:

- [Gemini Service](../../developers/040-development.md) — LLM provider architecture
- [Memory Architecture](../../developers/070-memory-architecture.md) — 6-tier memory with vector embeddings
- [Search Service Source](../../developers/040-development.md) — Token-based fuzzy search

---

*Back to [Agent Index](../index.md) | [Documentation Home](../../index.md)*
