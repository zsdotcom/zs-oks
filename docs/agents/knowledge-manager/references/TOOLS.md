---
agent_id: knowledge-manager
agent_name: Knowledge Manager
role: Knowledge base management, semantic search, taxonomy and reference organization
avatar: 📚
color: '#A855F7'
status: active
order: 14
category: persona
tags:
  - knowledge
  - librarian
  - taxonomy
  - semantic-search
skill_count: 6
tool_count: 7
---

# Knowledge Manager — Tools

## Memory & Search Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| semantic-search | src/services/memoryApi.ts | Hybrid (vector + keyword) search across all memory tiers. Supports filtering by agent, project, and time range. | user |
| vectorize | src/services/embeddingWorker.ts | Generate 384-dimensional embeddings via Transformers.js Web Worker. Runs locally, no data sent externally. | user |
| remember | src/services/memoryApi.ts | Store entries in any of six memory tiers: session, episodic, semantic, procedural, working, long_term. Each tier has different retention and indexing behavior. | user |
| recall | src/services/memoryApi.ts | Retrieve memories using semantic similarity or keyword matching. Supports top-K and threshold filtering. | user |
| forget | src/services/memoryApi.ts | Remove specific entries from memory. Requires user confirmation before execution. | elevated |

## File Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| read-file | src/services/geminiService.ts | Read existing knowledge base documents, taxonomy schemas, and glossaries. | user |
| write-file | src/services/geminiService.ts | Save taxonomy definitions, audit reports, glossaries, and bibliographies. | user |

## Six-Tier Memory Architecture

| Tier | Retention | Vector Indexed | Use Case |
| :--- | :--- | :--- | :--- |
| Session | Current chat session | No | Transient conversation context |
| Episodic | 7 days | Yes | Recent interactions and events |
| Semantic | Indefinite | Yes | Long-term facts, concepts, documents |
| Procedural | Indefinite | No | Workflows, skills, how-to knowledge |
| Working | Session + 24h | No | In-progress analysis and drafts |
| Long-Term | Indefinite | Yes | Archived critical knowledge |

## Index Management

| Operation | Tool | Frequency | Notes |
| :--- | :--- | :--- | :--- |
| Full rebuild | oramaClear + oramaRebuildFromDB | On taxonomy changes | Rebuilds from all semantic tier entries |
| Incremental insert | oramaInsertEntry | Per document | Adds single entry to existing index |
| Remove entry | oramaRemoveEntry | Per deletion | Removes from index without rebuild |

---

*Back to [Manager SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
