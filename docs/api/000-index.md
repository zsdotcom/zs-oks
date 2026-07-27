---
title: API Documentation — Index
order: 0
tags: [api, index, reference]
---

# API Documentation

Open Knowledge Studio's functionality is exposed through four primary API surfaces. All APIs run in-browser — there is no backend server.

## API Reference Documents

| # | Document | Description |
|---|----------|-------------|
| 010 | [Memory API Reference](./010-memory-api.md) | 6-tier memory system — session, episodic, semantic, procedural, working, long-term, plus cross-tier operations and embedding computation |
| 020 | [IndexedDB Schema Reference](./020-indexeddb.md) | Complete schema for all 22 object stores, CRUD operations, schema versioning, and data migration |
| 030 | [Gemini/LLM Service API](./030-gemini-service.md) | Multi-provider LLM router supporting 10+ providers, unified request/response, A2A debate, and orchestrated workflows |
| 040 | [Sandbox API Reference](./040-sandbox-api.md) | Secure code execution via iframe sandbox — `executeCode`, `cleanupSandbox`, security model |

## Architecture Overview

```mermaid
flowchart LR
  UI[React UI] --> Memory[Memory API]
  UI --> Gemini[Gemini/LLM Service]
  UI --> Sandbox[Sandbox API]
  Memory --> DB[IndexedDB 22 stores]
  Memory --> Orama[Orama Vector Search]
  Memory --> Worker[Embedding Web Worker]
  Gemini --> Providers[10+ LLM Providers]
  Sandbox --> Iframe[Sandbox Iframe]
  style DB fill:#bbf
  style Worker fill:#bfb
  style Providers fill:#fbb
```

## See Also

- [Architecture Decision Records](../architecture/000-index.md)
- [Security Documentation](../security/000-index.md)
