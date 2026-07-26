---
title: "100 — Dependency Removal"
category: "developers"
order: 100
tags: ["dependencies", "optimization", "architecture", "cdn"]
last_updated: "2026-07-26"
---

# 100 — Dependency Removal

---

## 1. Core Philosophy

Runtime npm dependencies: **only `react` + `react-dom`**. All non-trivial libraries are loaded dynamically from CDN at runtime to avoid increasing the bundle size or adding maintenance burden.

## 2. Removed Dependencies (v0.9 to v2.0)

| Library | Replaced By | Rationale |
| :--- | :--- | :--- |
| Redux / Zustand | React hooks + IndexedDB | Native state management |
| Elasticsearch / Algolia | Orama JS (CDN) | Client-side vector search |
| OpenAI Embeddings API | Transformers.js (CDN Worker) | Zero-cost local embeddings |
| Tailwind CDN 3.x | @tailwindcss/vite 4.x | Vite plugin, smaller builds |
| FontAwesome / lucide-react | Custom inline SVG (`lucide-shim.tsx`) | Zero-icon-dep policy |
| D3.js / Chart.js | Custom SVG (`SimpleCharts.tsx`) | Custom zero-dep charts |
| highlight.js / Prism | Custom regex highlighter (`highlight.ts`) | Custom zero-dep highlighting |
| marked / remark | Custom parser (`markdown.ts`) | Custom zero-dep parsing |

## 3. CDN Dynamic Imports (Allowed)

These libraries are loaded from CDN at runtime, not bundled:

| Library | CDN URL | Loaded Where | Fallback |
| :--- | :--- | :--- | :--- |
| `@huggingface/transformers` | `cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0` | Web Worker (`embeddingWorker.ts`) | Zero vector `[]` |
| `@orama/orama` | `cdn.jsdelivr.net/npm/@orama/orama@3.0.0` | Lazy on first search (`oramaService.ts`) | Keyword matching |

## 4. Native Browser API Alternatives

| Feature | External Library | Native Alternative |
| :--- | :--- | :--- |
| Cross-tab sync | Socket.io | `BroadcastChannel` API |
| Background compute | Worker Threads | `Web Workers` |
| Persistent storage | localForage / PouchDB | `IndexedDB` |
| Speech-to-text | Whisper API | `Web Speech API` |
| File system | Upload to S3 | `File System Access API` |

---

## See Also

- [Developer Guide: Development](040-development.md) — Zero dependency rule in coding standards
- [Developer Guide: Code Splitting](095-code-splitting.md) — Lazy loading strategy
- [Project Architecture](../project/020-architecture.md) — Zero runtime dependencies overview
- [Project Overview](../project/000-overview.md) — Architecture philosophy

---

*Back to [Documentation Home](../index.md) | [Project Docs](../project/000-overview.md) | [User Guides](../guides/060-agents.md)*
