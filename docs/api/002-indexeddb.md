---
title: IndexedDB Schema Reference
order: 20
tags: [api, indexeddb, schema, reference]
---

# IndexedDB Schema Reference

Source: `src/db/indexedDB.ts` (245 lines)

The IndexedDB service provides the persistence layer for the entire application. It defines 22 object stores under a single database with version 2 schema.

---

## Database Info

| Property | Value |
|----------|-------|
| Name | `open-knowledge-studio` |
| Version | `2` |
| Key path | `id` (string) on all stores |
| Access | Generic CRUD via `dbGet`, `dbPut`, `dbDelete`, `dbGetAll`, `dbClear`, `dbGetByIndex` |

---

## Object Stores

### Memory Tiers

| # | Store | Type | Indexes | Purpose |
|---|-------|------|---------|---------|
| 1 | `episodic` | `DBSchema['episodic']` | `projectId_agentId` | Agent conversation logs, auto-purged at 90 days |
| 2 | `semantic` | `DBSchema['semantic']` | `projectId_agentId` | Vector + text searchable knowledge |
| 3 | `procedural` | `DBSchema['procedural']` | None | Skill instructions, never auto-purged |
| 4 | `working` | `DBSchema['working']` | None | In-progress task context, session-scoped |
| 5 | `long_term` | `DBSchema['long_term']` | `projectId_category` | User-curated knowledge, manual delete |

### Content Management

| # | Store | Type | Indexes | Purpose |
|---|-------|------|---------|---------|
| 6 | `files` | `DBSchema['files']` | `name`, `parentFolderId`, `type` | Knowledge base documents |
| 7 | `folders` | `DBSchema['folders']` | None | Knowledge base folder hierarchy |
| 8 | `urlGroups` | `DBSchema['urlGroups']` | None | Saved URL collections |
| 9 | `templates` | `DBSchema['templates']` | None | Document templates (WHO reports, etc.) |
| 10 | `tags` | `DBSchema['tags']` | None | Document tag definitions |
| 11 | `versions` | `DBSchema['versions']` | `documentId`, `createdAt` | Document version history |

### Configuration

| # | Store | Type | Indexes | Purpose |
|---|-------|------|---------|---------|
| 12 | `providers` | `DBSchema['providers']` | None | AI provider API keys & configs |
| 13 | `prompts` | `DBSchema['prompts']` | None | Saved system prompts |
| 14 | `sandbox` | `DBSchema['sandbox']` | None | Code sandbox settings |
| 15 | `sessions` | `DBSchema['sessions']` | None | Chat session history |
| 16 | `appState` | `DBSchema['appState']` | None | Key-value app state |

### Agents & Workflows

| # | Store | Type | Indexes | Purpose |
|---|-------|------|---------|---------|
| 17 | `a2aAgents` | `DBSchema['a2aAgents']` | None | A2A agent definitions |
| 18 | `skills` | `DBSchema['skills']` | None | Skill definitions |
| 19 | `connectors` | `DBSchema['connectors']` | None | External connector configs |
| 20 | `workspaceProjects` | `DBSchema['workspaceProjects']` | None | Workspace project definitions |

### Analytics & Board

| # | Store | Type | Indexes | Purpose |
|---|-------|------|---------|---------|
| 21 | `metrics` | `DBSchema['metrics']` | `timestamp`, `agentId` | A2A agent performance metrics |
| 22 | `kanban` | `DBSchema['kanban']` | None | Kanban board state (JSON-serialized) |

---

## CRUD Operations

### `dbGet(storeName, id)`

```typescript
async function dbGet<T extends { id: string }>(storeName: StoreName, id: string): Promise<T | undefined>
```

Retrieves a single record by primary key. Returns `undefined` if not found.

### `dbGetAll(storeName)`

```typescript
async function dbGetAll<T>(storeName: StoreName): Promise<T[]>
```

Returns all records in the store. For large stores (e.g., `episodic`), consider filtering via indexes instead.

### `dbPut(storeName, data)`

```typescript
async function dbPut<T>(storeName: StoreName, data: T): Promise<void>
```

Inserts or updates a record (upsert by `id`). Opens a readwrite transaction.

### `dbDelete(storeName, id)`

```typescript
async function dbDelete(storeName: StoreName, id: string): Promise<void>
```

Deletes a single record by primary key.

### `dbClear(storeName)`

```typescript
async function dbClear(storeName: StoreName): Promise<void>
```

Deletes all records from the store.

### `dbGetByIndex(storeName, indexName, query)`

```typescript
async function dbGetByIndex<T>(storeName: StoreName, indexName: string, query: string | string[]): Promise<T[]>
```

Queries by a named index. For compound indexes (e.g., `['projectId', 'agentId']`), pass the array as `query`.

---

## Key-Value Helpers

### `dbGetKey(key)`

```typescript
async function dbGetKey(key: string): Promise<string | null>
```

Reads a value from the `appState` store by key.

### `dbSetKey(key, value)`

```typescript
async function dbSetKey(key: string, value: string): Promise<void>
```

Writes a key-value pair to the `appState` store.

---

## Utility Functions

### `dbInit()`

```typescript
async function dbInit(): Promise<void>
```

Opens the database connection (idempotent).

### `dbClose()`

```typescript
async function dbClose(): Promise<void>
```

Closes the database connection and resets the singleton.

### `migrateLocalStorage()`

```typescript
async function migrateLocalStorage(): Promise<void>
```

Migrates data from localStorage (legacy format) to IndexedDB. Checks `countStore > 0` before migrating to prevent double-migration. Handles 8 localStorage keys.

### `exportAllData()`

```typescript
async function exportAllData(): Promise<string>
```

Exports 14 stores as a JSON string. Does not include memory tiers (episodic, semantic, procedural, working, long_term), skills, connectors, or workspaceProjects — these are excluded from export.

### `importAllData(jsonStr)`

```typescript
async function importAllData(jsonStr: string): Promise<void>
```

Imports data from a previously exported JSON string. Parses all arrays and inserts each record.

---

## Complete `DBSchema` Type

```typescript
interface DBSchema {
  episodic: { id: string; projectId: string; agentId: string; text: string; summary?: string | null; createdAt: string };
  semantic: { id: string; projectId: string; agentId: string; topic: string; text: string; embedding: number[]; createdAt: string };
  procedural: { id: string; projectId: string; skillId: string; instructions: string; triggers: string[]; createdAt: string };
  working: { id: string; projectId: string; agentId: string; sessionId: string; key: string; value: any; createdAt: string };
  long_term: { id: string; projectId: string; category: string; text: string; references: string[]; createdAt: string };
  files: { id: string; name: string; type: string; content: string; size: string; url?: string; parentFolderId?: string | null; isActive: boolean; createdAt: string; metadata?: Record<string, any> };
  folders: { id: string; name: string; parentFolderId?: string | null };
  providers: { id: string; config: string };
  urlGroups: { id: string; name: string; urls: string[] };
  prompts: { id: string; title: string; description: string; content: string; category: string; createdAt: string };
  a2aAgents: { id: string; name: string; role: string; avatar: string; systemPrompt: string; color: string; isActive: boolean; skills?: string[]; tools?: string[]; memoryType?: string; maxTurnDepth?: number; provider?: string; modelName?: string };
  metrics: { id: string; timestamp: string; topic: string; agentId: string; agentName: string; latencyMs: number; thinkingSeconds?: number; tokensEstimated: number; status: string };
  skills: { id: string; name: string; description: string; category: string; instructions: string; allowedTools: string[]; priority: string; triggers: string[]; createdAt: string; updatedAt: string };
  connectors: { id: string; name: string; type: string; enabled: boolean; config: string; status: string; lastSync: string };
  workspaceProjects: { id: string; name: string; description: string; createdAt: string; agentIds: string[]; tags: string[]; sourceUrl?: string };
  sandbox: { id: string; settings: string };
  sessions: { id: string; title: string; messages: string; provider: string; modelName: string; createdAt: string };
  versions: { id: string; documentId: string; content: string; createdAt: string; size: string; label?: string };
  kanban: { id: string; boards: string };
  templates: { id: string; name: string; description: string; category: string; content: string; icon?: string };
  tags: { id: string; name: string; color: string };
  appState: { id: string; key: string; value: string };
}
```

---

## Schema Versioning

Current version: **2**

Version 2 added: `skills`, `connectors`, `workspaceProjects` stores, and the `projectId_agentId` compound index on `episodic` and `semantic`.

When upgrading, the `onupgradeneeded` handler (`indexedDB.ts:48-78`) creates missing stores and indexes. No data migration is performed — stores are created empty.

---

## Error Handling

All CRUD functions reject their promises on IndexedDB errors:

```typescript
// Connection error
await dbGet('files', 'abc'); // throws "IndexedDB open error: ..."

// Store not found (should not happen — typed at compile time)
await dbGet('nonexistent' as any, 'x'); // throws IDBDatabase error
```

Wrap IndexedDB operations in try/catch for defensive programming.

---

## See Also

- [ADR-005: IndexedDB Schema Design](../architecture/005-indexeddb-schema.md)
- [Memory API Reference](./010-memory-api.md)
- [ADR-002: 6-Tier Memory Architecture](../architecture/002-6-tier-memory.md)
