---
title: Architecture Decision Records — Index
category: "architecture"
order: 0
tags: [adr, architecture, index]
last_updated: "2026-07-28"
audience: "developers"
---

# Architecture Decision Records

Architecture Decision Records (ADRs) capture significant architectural decisions made during the development of Open Knowledge Studio. Each ADR follows the [Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) format:

| Field | Description |
|-------|-------------|
| **Title** | Short description of the decision |
| **Status** | Proposed / Accepted / Deprecated / Superseded |
| **Context** | Why the decision was needed |
| **Decision** | What was decided |
| **Consequences** | Trade-offs, constraints, and effects |

## ADR Table

| # | Title | Status | Date |
|---|-------|--------|------|
| 001 | [Zero NPM Dependency Decision](./001-zero-npm-dependency.md) | Accepted | 2026-01 |
| 002 | [6-Tier Memory Architecture](./002-6-tier-memory.md) | Accepted | 2026-01 |
| 003 | [Vector Embeddings in Web Worker](./003-vector-web-worker.md) | Accepted | 2026-01 |
| 004 | [Code Splitting Strategy](./004-code-splitting.md) | Accepted | 2026-02 |
| 005 | [IndexedDB Schema Design](./005-indexeddb-schema.md) | Accepted | 2026-01 |
| 006 | [PWA & Offline Architecture](./006-pwa-offline.md) | Accepted | 2026-02 |

## See Also

- [API Documentation Index](../api/000-index.md)
- [Security Documentation Index](../security/000-index.md)


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
