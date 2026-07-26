# 100 — Dependency Removal Strategy & Notes

**Document Version:** 1.0
**Date:** July 25, 2026
**Author:** Manus AI
**Target Repository:** Open Knowledge Studio v1.0

---

## 1. Core Philosophy

The primary philosophy of **Open Knowledge Studio v1.0** is to maintain a **zero-dependency architecture** for the runtime environment. 

When evaluating new features or libraries, the following strict criteria must be applied:
1. **Cost:** The library must be free and open-source (MIT, Apache 2.0, etc.).
2. **Size:** The library must not significantly impact the initial load time (target: < 50KB gzipped).
3. **Maintenance:** The library must have an active community and a clear maintenance path.
4. **Necessity:** The functionality cannot be achieved using native browser APIs (e.g., `Web Workers`, `BroadcastChannel`, `IndexedDB`, `Canvas API`).

---

## 2. Removed Dependencies (v0.9 to v1.0)

The following dependencies were actively removed from the codebase to achieve the zero-dependency goal:

### 2.1 State Management & Storage
- **Redux / Zustand:** Removed in favor of native React Context and direct IndexedDB access (`db/indexedDB.ts`).
- **localForage:** Removed in favor of direct, optimized IndexedDB transactions with Web Worker support.

### 2.2 Search & Vectorization
- **Elasticsearch / Algolia:** Removed in favor of **Orama JS** for client-side, HNSW-based vector search.
- **OpenAI Embeddings API:** Removed in favor of **Transformers.js** (WebGPU/WebAssembly) running locally in the browser.

### 2.3 UI & Rendering
- **Tailwind CSS (JIT):** Replaced with native CSS variables for theming and simple, custom utility classes to reduce build size.
- **External Icon Libraries (e.g., FontAwesome):** Replaced with custom SVG components (`src/components/icons/lucide-shim.tsx`) to avoid large icon fonts.

### 2.4 Data Visualization
- **D3.js / Chart.js:** Removed in favor of lightweight, custom SVG charting components (`src/components/charts/SimpleCharts.tsx`) and native Canvas API for specific epidemiological curves.

---

## 3. Strict Dependency Addition Rules

If a new dependency is deemed absolutely necessary, the following process must be followed:

1. **Proposal:** A formal proposal must be made in the `docs/` directory outlining the necessity of the library and how it meets the core philosophy criteria.
2. **Evaluation:** The proposal must be reviewed by the Coordinator Agent or a project maintainer.
3. **Implementation:** If approved, the library must be imported dynamically (e.g., `import('library-name')`) to ensure it does not block the initial load of the application.
4. **Documentation:** The `docs/100-dependency-removal-notes.md` file must be updated to reflect the new addition.

---

## 4. Native Browser API Alternatives

Whenever a new feature is requested, developers should first explore native browser APIs before considering external libraries:

| Feature Request | External Library Alternative | Native Browser API Equivalent |
| :--- | :--- | :--- |
| Real-time cross-tab sync | Socket.io / Firebase | `BroadcastChannel` API |
| Background heavy computation | Node.js Worker Threads | `Web Workers` |
| Persistent storage | localForage / PouchDB | `IndexedDB` |
| Speech-to-text | OpenAI Whisper API | `Web Speech API` |
| File system access | Upload to S3 | `File System Access API` |
| Markdown parsing | marked / remark | Custom lightweight parser (`src/utils/markdown.ts`) |
| Syntax highlighting | highlight.js / Prism | Custom regex parser (`src/utils/highlight.ts`) |
