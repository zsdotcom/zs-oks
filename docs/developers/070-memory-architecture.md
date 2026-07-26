---
title: "070 — Memory Architecture"
category: "developers"
order: 70
tags: ["memory", "indexeddb", "vector", "embeddings", "workers"]
last_updated: "2026-07-26"
---

# 070 — Memory Architecture

---

## 1. Executive Summary

The 6-Tier Memory Architecture provides structured state management and knowledge persistence. It is implemented across:
- `src/db/indexedDB.ts` — Generic IndexedDB CRUD (19 object stores)
- `src/services/memoryApi.ts` — Domain-specific memory tier API
- `src/services/embeddingWorker.ts` — Web Worker for Transformers.js vector embeddings
- `src/services/oramaService.ts` — Orama JS hybrid vector search

---

## 2. Memory Tiers

### Tier 1: Session Memory (In-Memory Map)

| Operations | `storeSession(key, value)`, `getSession(key)`, `clearSession()` |
| Purge | On page refresh |

### Tier 2: Episodic Memory (IndexedDB)

| Store | `episodic` |
| Indexes | `projectId_agentId`, `createdAt` |
| Purge | Configurable (90-day default via `performMaintenance()`) |

### Tier 3: Semantic Memory (IndexedDB + Orama)

| Store | `semantic` |
| Vector Dimension | 384 (all-MiniLM-L6-v2 via Transformers.js) |
| Search | Orama hybrid (vector + keyword) with keyword fallback |
| Embedding | Auto-generated on store via Web Worker |

### Tier 4: Procedural Memory (IndexedDB)

| Store | `procedural` |
| Purge | Never auto-purged |

### Tier 5: Working Memory (IndexedDB)

| Store | `working` |
| Purge | Flushed on session end via `flushWorking()` |

### Tier 6: Long-Term Memory (IndexedDB)

| Store | `long_term` |
| Purge | Manual only |

---

## 3. Vector Embedding Pipeline

```
storeSemantic(entry)
  → entry.embedding is empty?
    → computeEmbedding(text) → Web Worker
    → embeddingWorker.ts loads Transformers.js from CDN
    → pipeline('feature-extraction', 'all-MiniLM-L6-v2')
    → Returns 384-dim Float32Array
  → Store in IndexedDB
  → Also insert into Orama index (if CDN available)
```

## 4. Search Pipeline

```
searchSemantic(query, topK)
  → Try oramaSearchEntries(query, topK)  [hybrid vector+keyword]
  → If CDN unavailable, fallback:
    → dbGetAll('semantic')
    → Token-based keyword matching
    → Sort by match count, return topK
```

## 5. Cross-Tier Operations

| Operation | Description |
| :--- | :--- |
| `promoteWorkingToEpisodic()` | Moves working memory to episodic, flushes working |
| `summarizeEpisodicToSemantic()` | Copies episodic entries to semantic with auto-embedding |
| `performMaintenance()` | Purges episodic entries older than 90 days |

## 6. Embedding Worker

`src/services/embeddingWorker.ts` runs in a dedicated Web Worker:
- Dynamically imports Transformers.js from jsdelivr CDN
- Loads `all-MiniLM-L6-v2` model (WASM backend)
- Processes batches of texts, returns 384-dim arrays
- 30-second timeout fallback to zero vector

## 7. Orama Search

`src/services/oramaService.ts`:
- Dynamically imports Orama JS from jsdelivr CDN
- Creates in-memory index with 384-dim vector schema
- Supports hybrid (term + vector) search
- Graceful fallback if CDN unavailable

---

## See Also

- [Developer Guide: Test Suite](080-test-suite.md) — Memory test coverage and benchmarks
- [Developer Guide: Dependency Removal](100-dependency-removal.md) — CDN loading and native API alternatives
- [Project Overview](../project/000-overview.md) — 6-tier memory architecture overview
- [User Guide: Multi-Agent Workflows](../guides/091-workflows.md) — Memory usage in workflow orchestration

---

*Back to [Documentation Home](../index.md) | [Project Docs](../project/000-overview.md) | [User Guides](../guides/060-agents.md)*
