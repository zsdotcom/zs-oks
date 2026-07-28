---
title: ADR-001 — Zero NPM Dependency Decision
status: Accepted
date: 2026-01
tags: [adr, dependencies, cdn, bundle-size]
---

# ADR-001: Zero NPM Dependency Decision

## Status

Accepted

## Context

Open Knowledge Studio is a single-page application that leverages ML models (Transformers.js), full-text search (Orama), diagram rendering (Mermaid, KaTeX), and mapping (Leaflet). The initial approach of using npm packages led to:

- Large bundle sizes (Mermaid alone is ~800KB minified)
- Frequent maintenance burden from version bumps
- Transitive dependency vulnerabilities requiring constant Dependabot triage
- Slow install times in CI (30s+ for `npm ci`)

The project wants to remain a zero-backend static app deployable to any static host (GitHub Pages, Netlify, etc.) with minimal CI complexity.

## Decision

**Only `react` and `react-dom` shall be installed as npm runtime dependencies.** All other libraries are loaded from CDN at runtime via dynamic `import()` or `<script>` tags in `index.html`:

| Library | CDN Source | Loading Mechanism |
|---------|-----------|-------------------|
| Transformers.js | `cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0` | Dynamic `import()` in Web Worker |
| Orama | `cdn.jsdelivr.net/npm/@orama/orama@3.0.0` | Dynamic `import()` in service |
| Mermaid | `cdn.jsdelivr.net/npm/mermaid@11.16.0` | `<script>` tag in `index.html` |
| KaTeX | `cdn.jsdelivr.net/npm/katex@0.18.1` | `<script>` + `<link>` in `index.html` |
| Leaflet | `unpkg.com/leaflet@1.9.4` | `<script>` + `<link>` in `index.html` |

## Consequences

| Positive | Negative |
|----------|----------|
| Smaller initial bundle: 0 deps means Vite can tree-shake to ~50KB gzip | CDN availability required for advanced features (ML, search, diagrams, maps) |
| Zero Dependabot alerts for transitive deps | CDN outage breaks certain features — graceful degradation is mandatory |
| Faster CI: `npm install` resolves in ~3s | Version pinning is less strict — CDN URLs must be manually updated |
| Easier security auditing (audit 2 packages vs 200+) | No offline access to CDN resources without Service Worker caching |

Graceful degradation is implemented: if Transformers.js fails to load, the app falls back to zero-vector embeddings (`embeddingWorker.ts:12`). If Orama fails, semantic search degrades to keyword matching (`memoryApi.ts:62-75`).

## See Also

- [ADR-003: Vector Embeddings in Web Worker](./003-vector-web-worker.md)
- [ADR-006: PWA & Offline Architecture](./006-pwa-offline.md)
- [API Documentation: IndexedDB Schema](../api/002-indexeddb.md)


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
