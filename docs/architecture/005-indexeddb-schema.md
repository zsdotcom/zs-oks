---
title: ADR-005 — IndexedDB Schema Design
status: Accepted
date: 2026-01
tags: [adr, indexeddb, schema, storage, persistence]
audience: "developers"
last_updated: "2026-07-30"
---

# ADR-005: IndexedDB Schema Design

## Status

Accepted

## Context

Open Knowledge Studio is a zero-backend application. All user data — files, folders, configuration, chat sessions, memory tiers, metrics, and app state — must be persisted in the browser. LocalStorage (5-10MB limit) is insufficient. A relational/NoSQL database via a server is out of scope.

IndexedDB provides GB-scale storage, structured data support, and built-in indexing — all within the browser, requiring zero infrastructure.

## Decision

**Use IndexedDB as the single persistence layer** with 22 object stores, all sharing a generic `{ id: string }` primary key pattern. The database is named `open-knowledge-studio` at version **v2**.

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
  workspaceProjects: { id: string; name: string; description: string; createdAt: string; updatedAt: string; fileCount: number; agentCount: number; agentIds: string[]; tags: string[]; sourceUrl?: string };
  sandbox: { id: string; settings: string };
  sessions: { id: string; title: string; messages: string; provider: string; modelName: string; createdAt: string };
  versions: { id: string; documentId: string; content: string; createdAt: string; size: string; label?: string };
  kanban: { id: string; boards: string };
  templates: { id: string; name: string; description: string; category: string; content: string; icon?: string };
  tags: { id: string; name: string; color: string };
  appState: { id: string; key: string; value: string };
}
```

Indexes are created on stores requiring filtered lookups:

| Store | Index | Key |
|-------|-------|-----|
| `metrics` | `timestamp` | `timestamp` |
| `metrics` | `agentId` | `agentId` |
| `files` | `name` | `name` |
| `files` | `parentFolderId` | `parentFolderId` |
| `files` | `type` | `type` |
| `versions` | `documentId` | `documentId` |
| `versions` | `createdAt` | `createdAt` |
| `episodic` | `projectId_agentId` | `[projectId, agentId]` |
| `semantic` | `projectId_agentId` | `[projectId, agentId]` |
| `long_term` | `projectId_category` | `[projectId, category]` |

Generic CRUD operations (`dbGet`, `dbPut`, `dbDelete`, `dbGetAll`, `dbClear`, `dbGetByIndex`) provide a uniform interface across all stores (`indexedDB.ts:100-167`). Two convenience functions wrap the `appState` store: `dbGetKey` and `dbSetKey`.

## Consequences

| Positive | Negative |
|----------|----------|
| GB-scale storage — sufficient for thousands of documents | In-browser only — data loss on cache clear / browser uninstall |
| Generic `{ id: string }` pattern enables uniform CRUD | No server-side sync — export/import (`exportAllData` / `importAllData`) is the only backup mechanism |
| Version 2 schema with migration path from localStorage (`migrateLocalStorage()`) | Schema changes require manual version bump + `onupgradeneeded` handler |
| Zero infrastructure — no backend, no API | Large blob storage (file content as string) can be memory-intensive |
| IndexedDB works in all modern browsers | iOS Safari may purge IndexedDB under storage pressure |

## See Also

- [ADR-002: 6-Tier Memory Architecture](./002-6-tier-memory.md)
- [API Documentation: IndexedDB Schema](../api/002-indexeddb.md)
- [API Documentation: Memory API](../api/001-memory-api.md)


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
