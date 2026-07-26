---
title: "020 — System Architecture"
category: "project"
order: 20
tags: ["architecture", "components", "indexeddb", "pipeline"]
last_updated: "2026-07-26"
---

# 020 — System Architecture

**Open Knowledge Studio v2.0** architecture with 6-agent A2A system, Transformers.js vector embeddings, and Orama JS semantic search.

---

## 1. Component Architecture

```
App.tsx
├── ChatInterface.tsx              ← useChat (IndexedDB)
├── WorkspaceDocumentEditor.tsx    ← useFiles
├── KnowledgeBaseManager.tsx       ← useFiles
├── A2AMetricsDashboard.tsx        ← A2A metrics
├── SettingsPanel.tsx              ← A2A agent management
├── Other components...
└── services/
    ├── geminiService.ts            ← LLM router (6 providers)
    ├── memoryApi.ts               ← 6-tier memory + embeddings + Orama
    ├── embeddingWorker.ts         ← Web Worker (Transformers.js CDN)
    ├── oramaService.ts            ← Orama JS (CDN) vector search
    └── searchService.ts           ← Token-based fuzzy search
```

## 2. Vector Embedding Pipeline

```
User saves semantic memory
  → memoryApi.storeSemantic()
  → computeEmbedding() → Web Worker
  → embeddingWorker.ts
    → Dynamic CDN import of @huggingface/transformers
    → pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    → Returns 384-dim Float32Array
  → Stored in IndexedDB + Orama index
```

## 3. Search Pipeline

```
searchSemantic(query, topK)
  → Try Orama hybrid search (vector + keyword)
  → If CDN unavailable, fallback to keyword matching
  → Returns ranked DBSchema['semantic'][] entries
```

## 4. 6-Agent A2A System

6 agents (Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian) defined in `DEFAULT_A2A_AGENTS`. Each agent:
- Has a unique color, avatar, role, and system prompt
- Responds independently to user prompts in debate panel
- Configurable on/off toggle
- Persisted in IndexedDB `a2aAgents` store

## 5. IndexedDB Schema

19 object stores including `episodic`, `semantic`, `procedural`, `working`, `long_term` (memory tiers) plus application data stores. Generic CRUD via `dbGet`, `dbPut`, `dbDelete`, `dbGetAll`, `dbClear`, `dbGetByIndex`.

## 6. Zero Runtime Dependencies

All heavy ML/search libraries are dynamically imported from CDN at runtime:
- `@huggingface/transformers` from jsdelivr CDN (in Web Worker)
- `@orama/orama` from jsdelivr CDN (lazy, on first semantic search)

---

## See Also

- [Developer Guide: Memory Architecture](../developers/070-memory-architecture.md) — 6-tier memory with vector embeddings
- [Developer Guide: Code Splitting](../developers/095-code-splitting.md) — Performance optimization strategy
- [Developer Guide: Dependency Removal](../developers/100-dependency-removal.md) — Zero-dependency migration notes
- [User Guide: Multi-Agent Workflows](../guides/091-workflows.md) — Orchestrated and sequential workflows

---

*Back to [Documentation Home](../index.md) | [Developer Docs](../developers/040-development.md) | [User Guides](../guides/060-agents.md)*
