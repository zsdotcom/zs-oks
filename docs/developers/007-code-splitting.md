---
title: "007 — Code Splitting and Performance"
description: "Five lazy-loaded components, Suspense patterns, direct imports list, and bundle size targets"
category: "developers"
order: 7
tags: ["code-splitting", "lazy-loading", "performance", "bundling"]
last_updated: "2026-07-28"
audience: "developers"
---

# 007 — Code Splitting & Performance

Optimization strategies used to keep the initial JavaScript bundle minimal and load heavy components on demand.

---

## 1. Lazy-Loaded Components

Five UI panels are lazy-loaded using `React.lazy()` to reduce initial bundle size:

| Component | File | Est. Size | Trigger |
| :--- | :--- | :--- | :--- |
| `A2AMetricsDashboard` | `components/A2AMetricsDashboard` | ~8 KB | Opening the A2A metrics tab |
| `WorkspaceDocumentEditor` | `components/WorkspaceDocumentEditor` | ~12 KB | Opening a document for editing |
| `SettingsPanel` | `components/SettingsPanel` | ~6 KB | Clicking the Settings button |
| `MCPServerPanel` | `components/MCPServerPanel` | ~4 KB | Opening the MCP tab |
| `GoogleWorkspacePanel` | `components/GoogleWorkspacePanel` | ~5 KB | Opening the Google Workspace panel |

**Total deferred:** ~35 KB that would otherwise be in the initial bundle.

---

## 2. Implementation Pattern

### Lazy Import Definition

Each lazy component is defined at the top of `src/App.tsx`:

```typescript
const A2AMetricsDashboard = React.lazy(
  () => import('./components/A2AMetricsDashboard')
    .then(m => ({ default: m.A2AMetricsDashboard }))
);

const WorkspaceDocumentEditor = React.lazy(
  () => import('./components/WorkspaceDocumentEditor')
    .then(m => ({ default: m.WorkspaceDocumentEditor }))
);

const SettingsPanel = React.lazy(
  () => import('./components/SettingsPanel')
    .then(m => ({ default: m.SettingsPanel }))
);

const MCPServerPanel = React.lazy(
  () => import('./components/MCPServerPanel')
    .then(m => ({ default: m.MCPServerPanel }))
);

const GoogleWorkspacePanel = React.lazy(
  () => import('./components/GoogleWorkspacePanel')
    .then(m => ({ default: m.GoogleWorkspacePanel }))
);
```

### Suspense Wrapper

Each usage site is wrapped in `React.Suspense`:

```tsx
<React.Suspense fallback={
  <div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 text-xs">
    Loading...
  </div>
}>
  {activeView === 'settings' && <SettingsPanel ... />}
</React.Suspense>
```

The fallback renders a centered "Loading..." message with minimum 200px height to prevent layout shift.

---

## 3. Direct Import Components

These components are small or always-visible, so they are direct imports (not lazy-loaded):

| Component | Reason |
| :--- | :--- |
| `ChatInterface` | Main UI — always visible |
| `KnowledgeBaseManager` | Always visible sidebar panel |
| `SearchPanel` | Always accessible |
| `ThemeSwitcher` | Tiny component |
| `ErrorBoundary` | Must be available immediately |
| `KanbanBoardView` | Core project view |
| `ChatSessionSidebar` | Always visible |
| `GmailCompose` | Small compose widget |
| `ICD11Lookup` | Medical code lookup |
| `EpiMap` | Map component (loads Leaflet from CDN separately) |
| `SimpleCharts` | Custom zero-dep SVG charts |
| All icons (`lucide-shim.tsx`) | Inline SVGs, negligible size |

---

## 4. Bundle Optimization

### Vite Manual Chunks

In `vite.config.ts`, React and ReactDOM are split into a separate `vendor` chunk:

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks(id: string) {
        if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
          return 'vendor';
        }
      },
    },
  },
},
```

This creates:
- `vendor.js` — React + ReactDOM (~35 KB gzip)
- `main.js` — Application code (varies)
- `A2AMetricsDashboard.js`, `SettingsPanel.js`, etc. — Lazy-loaded on demand

### Bundle Analysis

```bash
npm run analyze
```

Generates `dist/stats.html` — an interactive treemap visualization of bundle composition:

- Opens in browser automatically
- Shows gzip sizes
- Helps identify large modules

### CDN Dynamic Imports (Not in Bundle)

These libraries are loaded at runtime from CDN, never bundled:

| Library | CDN URL | Size |
| :--- | :--- | :--- |
| Transformers.js | `cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0` | ~20 MB (WASM model) |
| Orama JS | `cdn.jsdelivr.net/npm/@orama/orama@3.0.0` | ~50 KB |
| KaTeX | `cdn.jsdelivr.net/npm/katex@0.18.1` (from index.html) | ~200 KB |
| Mermaid | `cdn.jsdelivr.net/npm/mermaid@11.16.0` (from index.html) | ~500 KB |
| Leaflet | `unpkg.com/leaflet@1.9.4` (from index.html) | ~150 KB |

---

## 5. Performance Targets

| Metric | Target |
| :--- | :--- |
| Initial JS bundle (gzip) | <50 KB (React + ReactDOM only) |
| Time to interactive | <2 seconds |
| Lazy component load | <500 ms each |
| IndexedDB write | <50 ms per record |
| Vector search | <100 ms per query |
| First contentful paint | <1 second |

---

## 6. Best Practices for Adding Components

1. **Is it always visible?** → Direct import
2. **Is it shown on demand?** → `React.lazy()` + `React.Suspense`
3. **Does it use a heavy library?** → CDN dynamic import instead of npm dependency
4. **Is it a small icon/snippet?** → Inline SVG or custom implementation

---

## See Also

- [Development Guidelines](004-development.md) — Zero-dependency rule
- [Zero-Dependency Architecture](010-dependency-removal.md) — CDN loading philosophy
- [CI/CD Pipeline](008-ci-cd.md) — Bundle analysis in CI
- [Setup Guide](001-setup.md) — Running the app

---

*Back to [Documentation Home](../index.md)*

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
