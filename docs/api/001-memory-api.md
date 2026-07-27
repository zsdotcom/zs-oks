---
title: Memory API Reference
order: 10
tags: [api, memory, reference]
---

# Memory API Reference

Source: `src/services/memoryApi.ts` (312 lines)

The Memory API implements a 6-tier memory system. Each tier has distinct storage backend and retention policy. All tiers except Session Memory are persisted to IndexedDB. The API also provides cross-tier operations (promotion, summarization, maintenance) and embedding computation.

---

## Tier 1 — Session Memory

In-memory `Map<string, any>`, cleared on page refresh.

### `storeSession(key, value)`

```typescript
function storeSession(key: string, value: any): void
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `string` | Session storage key |
| `value` | `any` | Any serializable value |

**Example:**
```typescript
import { storeSession, getSession, clearSession } from '@/services/memoryApi';

storeSession('currentProject', 'proj-123');
const project = getSession<string>('currentProject'); // 'proj-123'
clearSession();
```

### `getSession(key)`

```typescript
function getSession<T>(key: string): T | undefined
```

Returns `undefined` if the key does not exist.

**Error scenarios:** None (synchronous in-memory operation).

### `clearSession()`

```typescript
function clearSession(): void
```

Removes all session entries.

---

## Tier 2 — Episodic Memory

Persisted to the IndexedDB `episodic` store. Auto-purged after 90 days by `performMaintenance()`.

### `storeEpisodic(entry)`

```typescript
async function storeEpisodic(entry: DBSchema['episodic']): Promise<void>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `entry` | `DBSchema['episodic']` | `{ id, projectId, agentId, text, summary?, createdAt }` |

### `getEpisodic(id)`

```typescript
async function getEpisodic(id: string): Promise<DBSchema['episodic'] | undefined>
```

### `getEpisodicByProject(projectId, agentId?)`

```typescript
async function getEpisodicByProject(projectId: string, agentId?: string): Promise<DBSchema['episodic'][]>
```

Uses the `projectId_agentId` compound index. If `agentId` is omitted, filters by `projectId` only.

### `purgeEpisodic(beforeDate)`

```typescript
async function purgeEpisodic(beforeDate: string): Promise<void>
```

Deletes all episodic entries with `createdAt < beforeDate`. Called by `performMaintenance()` with a 90-day threshold.

**Error scenarios:** If IndexedDB is unavailable, throws an `IDBDatabase` error. Wrap in try/catch.

**Example:**
```typescript
await storeEpisodic({
  id: 'ep-001',
  projectId: 'proj-123',
  agentId: 'research',
  text: 'Found R0 = 12-18 for measles in unvaccinated populations',
  summary: null,
  createdAt: new Date().toISOString(),
});
const entries = await getEpisodicByProject('proj-123', 'research');
```

---

## Tier 3 — Semantic Memory

Persisted to IndexedDB `semantic` store plus Orama vector search index. Supports embedding-based and keyword-based search.

### `storeSemantic(entry)`

```typescript
async function storeSemantic(entry: DBSchema['semantic']): Promise<void>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `entry` | `DBSchema['semantic']` | `{ id, projectId, agentId, topic, text, embedding, createdAt }` |

If `entry.embedding` is an empty array, an embedding is computed automatically via `computeEmbedding(entry.text)`. The entry is also inserted into the Orama full-text search index (silently fails if Orama is unavailable).

### `searchSemantic(query, topK?)`

```typescript
async function searchSemantic(query: string, topK?: number): Promise<DBSchema['semantic'][]>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | `string` | — | Search text |
| `topK` | `number` | `5` | Maximum results |

**Search strategy:**
1. Attempts Orama full-text + vector search (if available)
2. Falls back to keyword matching (counts query term occurrences in text)
3. Results sorted by relevance score descending

**Example:**
```typescript
const results = await searchSemantic('measles outbreak', 3);
// Returns top 3 matching semantic entries
```

### `deleteSemantic(id)`

```typescript
async function deleteSemantic(id: string): Promise<void>
```

Removes from both IndexedDB and Orama index.

### `rebuildSemanticIndex()`

```typescript
async function rebuildSemanticIndex(): Promise<void>
```

Re-indexes all semantic entries. Useful after Orama corruption. Clears the store and re-inserts all entries (regenerating embeddings for those with empty vectors).

---

## Tier 4 — Procedural Memory

Persisted to IndexedDB `procedural` store. Never auto-purged by design.

### `storeProcedural(entry)`

```typescript
async function storeProcedural(entry: DBSchema['procedural']): Promise<void>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `entry` | `DBSchema['procedural']` | `{ id, projectId, skillId, instructions, triggers, createdAt }` |

### `getProceduralBySkill(skillId)`

```typescript
async function getProceduralBySkill(skillId: string): Promise<DBSchema['procedural'] | undefined>
```

Returns the first procedural entry matching the given `skillId`.

### `purgeAllProcedural()`

```typescript
async function purgeAllProcedural(): Promise<void>
```

**No-op by design.** Procedural memory is never auto-purged.

---

## Tier 5 — Working Memory

Session-scoped data persisted to IndexedDB `working` store. Must be explicitly flushed per-session.

### `storeWorking(entry)`

```typescript
async function storeWorking(entry: DBSchema['working']): Promise<void>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `entry` | `DBSchema['working']` | `{ id, projectId, agentId, sessionId, key, value, createdAt }` |

### `getWorking(sessionId)`

```typescript
async function getWorking(sessionId: string): Promise<DBSchema['working'][]>
```

Returns all working entries for the given session ID.

### `flushWorking(sessionId)`

```typescript
async function flushWorking(sessionId: string): Promise<void>
```

Deletes all working entries for the given session ID.

---

## Tier 6 — Long-Term Memory

User-curated knowledge persisted to IndexedDB `long_term` store. Manual delete only.

### `storeLongTerm(entry)`

```typescript
async function storeLongTerm(entry: DBSchema['long_term']): Promise<void>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `entry` | `DBSchema['long_term']` | `{ id, projectId, category, text, references, createdAt }` |

### `getLongTermByCategory(category, projectId?)`

```typescript
async function getLongTermByCategory(category: string, projectId?: string): Promise<DBSchema['long_term'][]>
```

### `purgeAllLongTerm()`

```typescript
async function purgeAllLongTerm(): Promise<void>
```

**No-op by design.** Long-term memory is never auto-purged.

---

## Cross-Tier Operations

### `promoteWorkingToEpisodic(sessionId, projectId)`

```typescript
async function promoteWorkingToEpisodic(sessionId: string, projectId: string): Promise<void>
```

Reads all working memory entries for `sessionId`, stores each as an episodic entry with generated `id` and current timestamp, then flushes the working memory.

### `summarizeEpisodicToSemantic(projectId)`

```typescript
async function summarizeEpisodicToSemantic(projectId: string): Promise<void>
```

Finds all episodic entries for `projectId` that lack a summary, then stores them as semantic entries with `topic: 'auto-summary'`. Text is truncated to 500 characters.

---

## Embedding Computation

### `computeEmbedding(text)`

```typescript
async function computeEmbedding(text: string): Promise<number[]>
```

Returns a 384-dimensional vector embedding via the Web Worker.

**Error scenarios:**
- Transformers.js fails to load → returns empty array `[]`
- Web Worker times out (30s) → returns empty array `[]`
- Worker crashes → returns empty array `[]`

### `computeEmbeddingsParallel(texts)`

```typescript
async function computeEmbeddingsParallel(texts: string[]): Promise<number[][]>
```

Batched embedding computation. Same error handling as `computeEmbedding`.

---

## Storage Management

### `performMaintenance()`

```typescript
async function performMaintenance(): Promise<{ purged: number }>
```

Purges episodic entries older than 90 days. Returns the count of purged entries.

### `getStorageEstimate()`

```typescript
async function getStorageEstimate(): Promise<{ quota: number; usage: number }>
```

Returns the browser's storage quota estimate (bytes). Uses `navigator.storage.estimate()` if available.

---

## Workspace Isolation

### `generateIsolatedKey(projectId, agentId, actionId)`

```typescript
function generateIsolatedKey(projectId: string, agentId: string, actionId: string): string
```

Returns `${projectId}:${agentId}:${actionId}` for scoped memory lookups.

---

## Cross-Tab Sync

### `broadcastMemoryUpdate(projectId, storeName)`

```typescript
function broadcastMemoryUpdate(projectId: string, storeName: string): void
```

Posts a message on the `oks_memory_sync` BroadcastChannel.

### `subscribeMemoryUpdates(callback)`

```typescript
function subscribeMemoryUpdates(
  callback: (data: { projectId: string; storeName: string; action: string }) => void
): () => void
```

Subscribes to cross-tab memory updates. Returns a cleanup function.

---

## Cross-Session Memory

### `getAllEpisodicForAgent(agentId, limit?)`

```typescript
function getAllEpisodicForAgent(agentId: string, limit?: number): Promise<EpisodicMemory[]>
```

Retrieves the most recent episodic memory entries for a specific agent across all sessions. Used by `buildCrossSessionContext` to provide agents with context from prior conversations.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `agentId` | `string` | — | Agent ID to filter by |
| `limit` | `number` | `20` | Maximum entries to return |

### `buildCrossSessionContext(agentId)`

```typescript
function buildCrossSessionContext(agentId: string): Promise<string>
```

Aggregates recent Episodic (by agent), Semantic (by topic), and Long-Term memories into a Markdown context string suitable for LLM injection. Called by A2A debate handlers in `App.tsx` to give agents awareness of past session learnings.

**Returns:** A Markdown string with sections "Recent Memories from Previous Sessions", "Learned Knowledge", and "Long-Term References".

### `getAllMemoryStats()`

```typescript
function getAllMemoryStats(): Promise<{ tier: string; count: number }[]>
```

Returns the count of entries across all 6 memory tiers. Used by the A2A Observability Dashboard for memory visualization.

---

## Full Function Summary

| Function | Tier | Async | Persistence |
|----------|------|-------|-------------|
| `storeSession` | 1 | No | In-memory |
| `getSession` | 1 | No | In-memory |
| `clearSession` | 1 | No | In-memory |
| `storeEpisodic` | 2 | Yes | IndexedDB |
| `getEpisodic` | 2 | Yes | IndexedDB |
| `getEpisodicByProject` | 2 | Yes | IndexedDB |
| `purgeEpisodic` | 2 | Yes | IndexedDB |
| `storeSemantic` | 3 | Yes | IndexedDB + Orama |
| `searchSemantic` | 3 | Yes | Orama + IndexedDB |
| `deleteSemantic` | 3 | Yes | IndexedDB + Orama |
| `rebuildSemanticIndex` | 3 | Yes | IndexedDB + Orama |
| `storeProcedural` | 4 | Yes | IndexedDB |
| `getProceduralBySkill` | 4 | Yes | IndexedDB |
| `purgeAllProcedural` | 4 | Yes | No-op |
| `storeWorking` | 5 | Yes | IndexedDB |
| `getWorking` | 5 | Yes | IndexedDB |
| `flushWorking` | 5 | Yes | IndexedDB |
| `storeLongTerm` | 6 | Yes | IndexedDB |
| `getLongTermByCategory` | 6 | Yes | IndexedDB |
| `purgeAllLongTerm` | 6 | Yes | No-op |
| `computeEmbedding` | Cross | Yes | Web Worker |
| `computeEmbeddingsParallel` | Cross | Yes | Web Worker |
| `promoteWorkingToEpisodic` | Cross | Yes | IndexedDB |
| `summarizeEpisodicToSemantic` | Cross | Yes | IndexedDB |
| `performMaintenance` | Cross | Yes | IndexedDB |
| `generateIsolatedKey` | Cross | No | None |
| `getStorageEstimate` | Cross | Yes | Browser API |
| `broadcastMemoryUpdate` | Cross | No | BroadcastChannel |
| `subscribeMemoryUpdates` | Cross | No | BroadcastChannel |
| `getAllEpisodicForAgent` | Cross | Yes | IndexedDB |
| `buildCrossSessionContext` | Cross | Yes | IndexedDB |
| `getAllMemoryStats` | Cross | Yes | IndexedDB |

## See Also

- [ADR-002: 6-Tier Memory Architecture](../architecture/002-6-tier-memory.md)
- [IndexedDB Schema Reference](./020-indexeddb.md)
- [ADR-003: Vector Embeddings in Web Worker](../architecture/003-vector-web-worker.md)
