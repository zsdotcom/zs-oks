---
title: "100 — Zero-Dependency Architecture"
category: "developers"
order: 100
tags: ["dependencies", "optimization", "architecture", "cdn", "native-apis"]
last_updated: "2026-07-26"
---

# 100 — Zero-Dependency Architecture

The architectural philosophy, removed dependencies, CDN strategy, and native browser API alternatives that keep Open Knowledge Studio's runtime footprint minimal.

---

## 1. Core Philosophy

**Two runtime npm dependencies only: `react` + `react-dom`.**

Everything else — state management, vector search, embedding computation, chart rendering, markdown parsing, syntax highlighting — is implemented with either:

1. **Native browser APIs** (IndexedDB, BroadcastChannel, Web Workers, Web Speech API)
2. **Dynamic CDN imports** (Transformers.js, Orama JS, KaTeX, Mermaid, Leaflet)
3. **Custom zero-dependency implementations** (inline SVG icons, custom markdown parser)

This philosophy ensures:
- **Minimal bundle size** (~35 KB gzip for React + ReactDOM)
- **No version conflicts** from transitive dependencies
- **No supply chain risk** from compromised packages
- **Offline-first architecture** with no server-side dependencies
- **Instant CI/CD** without waiting for dependency resolution

---

## 2. Removed Dependencies (v0.9 → v2.0)

| Library | Replaced By | Rationale |
| :--- | :--- | :--- |
| **Redux / Redux Toolkit** | React hooks + IndexedDB | State management via `useState`, `useReducer`, `useContext` + persistent storage in IndexedDB |
| **Zustand** | React hooks + IndexedDB | Same as Redux — no external state library needed |
| **Elasticsearch / Algolia** | Orama JS (CDN) | Client-side vector search, no backend required |
| **OpenAI Embeddings API** | Transformers.js (CDN Worker) | Zero-cost local embeddings in Web Worker, no API calls |
| **FontAwesome** | Custom inline SVG (`lucide-shim.tsx`) | Zero-icon-dependency policy — only used icons are inlined |
| **lucide-react** | Custom inline SVG (`lucide-shim.tsx`) | Same as FontAwesome — hand-picked icons extracted as inline SVGs |
| **D3.js / Chart.js** | Custom SVG (`SimpleCharts.tsx`) | Simple charting needs met with ~200 lines of SVG rendering |
| **highlight.js** | Custom regex highlighter (`highlight.ts`) | Code highlighting for a handful of languages (JS, Python, JSON, HTML) |
| **Prism.js** | Custom regex highlighter (`highlight.ts`) | Same as highlight.js — custom implementation covers all needed patterns |
| **marked** | Custom parser (`markdown.ts`) | Markdown to HTML conversion for subset of GFM used (headings, lists, code, bold, italic, links, images) |
| **remark** | Custom parser (`markdown.ts`) | Same as marked — custom parser avoids 30+ transitive dependencies |
| **Tailwind CDN 3.x** | @tailwindcss/vite 4.x (dev) | Vite plugin processes CSS at build time, not runtime CDN |

---

## 3. CDN Dynamic Imports (Allowed)

These libraries are loaded at runtime from CDN — they are **not** bundled into the application:

| Library | CDN URL | Loaded Where | Fallback |
| :--- | :--- | :--- | :--- |
| **@huggingface/transformers** | `cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0/dist/transformers.min.js` | Web Worker (`embeddingWorker.ts`) via dynamic `import()` | Zero vector `[]` |
| **@orama/orama** | `cdn.jsdelivr.net/npm/@orama/orama@3.0.0/dist/index.js` | Lazy import on first search (`oramaService.ts`) via dynamic `import()` | Keyword-based fallback |
| **KaTeX** | `cdn.jsdelivr.net/npm/katex@0.18.1/dist/katex.min.js` and CSS | Loaded in `index.html` via `<script>` and `<link>` | Raw LaTeX display |
| **Mermaid** | `cdn.jsdelivr.net/npm/mermaid@11.16.0/dist/mermaid.min.js` | Loaded in `index.html` via `<script>` | Raw mermaid code block |
| **Leaflet** | `unpkg.com/leaflet@1.9.4/dist/leaflet.js` and CSS | Loaded in `index.html` via `<script>` and `<link>` | "Map unavailable" message |

### Loading Pattern

**Web Worker dynamic import (Transformers.js):**

```typescript
// embeddingWorker.ts — runs in a separate thread
const { pipeline } = await import(
  'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0/dist/transformers.min.js'
);
```

**Lazy service import (Orama):**

```typescript
// oramaService.ts — first call triggers import
const mod = await import(
  'https://cdn.jsdelivr.net/npm/@orama/orama@3.0.0/dist/index.js'
);
```

**Script tag (KaTeX, Mermaid, Leaflet):**

```html
<!-- index.html -->
<script src="https://cdn.jsdelivr.net/npm/katex@0.18.1/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11.16.0/dist/mermaid.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

### CSP Configuration

The Content Security Policy in `vite.config.ts` explicitly allows these CDN origins:

```typescript
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com
style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com
connect-src 'self' https://*.tile.openstreetmap.org https://generativelanguage.googleapis.com ...
```

---

## 4. Native Browser API Alternatives

| Feature | External Library | Native Alternative | API |
| :--- | :--- | :--- | :--- |
| **Cross-tab synchronization** | Socket.io, WebSocket | `BroadcastChannel` | `new BroadcastChannel('channel')` |
| **Background computation** | Worker Threads (Node.js) | Web Workers | `new Worker('worker.js')` |
| **Persistent storage** | localForage, PouchDB, Dexie | IndexedDB | `indexedDB.open()` |
| **Speech-to-text** | Whisper API, Google Speech | Web Speech API | `SpeechRecognition` |
| **Text-to-speech** | AWS Polly, Google TTS | Web Speech API | `SpeechSynthesis` |
| **File system access** | AWS S3 SDK, Dropbox SDK | File System Access API | `showOpenFilePicker()` |
| **Clipboard** | clipboard.js | Clipboard API | `navigator.clipboard` |
| **History / navigation** | React Router (partial) | History API | `pushState`, `popState` |
| **Internationalization** | i18next | Intl API | `Intl.DateTimeFormat` |
| **UUID generation** | uuid | `crypto.randomUUID()` | `crypto.randomUUID()` |
| **Storage estimation** | — | StorageManager API | `navigator.storage.estimate()` |
| **Data export/import** | FileSaver.js | Blob + download | `URL.createObjectURL()` |
| **Drag and drop** | react-dnd | HTML5 DnD API | `onDragStart`, `onDrop` |

---

## 5. Dev Dependencies (Allowed)

The following are **dev-only** dependencies — they don't affect the runtime bundle:

| Package | Purpose |
| :--- | :--- |
| `@vitejs/plugin-react` | Vite plugin for React JSX transform |
| `@tailwindcss/vite` | Vite plugin for Tailwind CSS 4.x |
| `tailwindcss` | CSS utility framework (build-time only) |
| `typescript` | TypeScript compiler (build-time only) |
| `vitest` | Test runner (dev-only) |
| `happy-dom` | Test environment (dev-only) |
| `fake-indexeddb` | IndexedDB mock for tests (dev-only) |
| `@vitest/coverage-v8` | Code coverage (dev-only) |
| `@playwright/test` | E2E testing (dev-only) |
| `rollup-plugin-visualizer` | Bundle analysis (dev-only) |
| `@types/react` | React type definitions (dev-only) |
| `@types/react-dom` | ReactDOM type definitions (dev-only) |
| `@types/node` | Node.js type definitions (dev-only) |

---

## 6. Adding a New Dependency

Before adding any new npm dependency, evaluate against these criteria:

1. **Can it be replaced by a native browser API?** Yes → use native
2. **Can it be loaded dynamically from CDN?** Yes → use CDN import
3. **Can it be implemented in <100 lines?** Yes → write custom code
4. **Is it a build-time/dev tool?** Yes → add as devDependency
5. **Is it absolutely essential at runtime and not replaceable?** Only then add to `dependencies`

**Runtime dependency change process:**

1. Open a discussion in the repository
2. Justify why native/CDN/custom approaches are insufficient
3. Get maintainer approval
4. Add dependency and update this document

---

## See Also

- [Development Guidelines](040-development.md) — Zero-dependency coding standard
- [Code Splitting & Performance](070-code-splitting.md) — Lazy loading and bundle optimization
- [Memory Architecture](050-memory-architecture.md) — CDN-loaded embedding and search
- [Setup Guide](010-setup.md) — Dependencies installation

---

*Back to [Documentation Home](../index.md)*
