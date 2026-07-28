---
title: ADR-004 — Code Splitting Strategy
status: Accepted
date: 2026-02
tags: [adr, code-splitting, react-lazy, performance, bundle]
---

# ADR-004: Code Splitting Strategy

## Status

Accepted

## Context

The initial `main.js` bundle (before code splitting) approached 150KB+ gzip, driven by:

- A2A Metrics Dashboard (charting, tables)
- Google Workspace Panel (drive picker, Gmail compose)
- Settings Panel (all configuration forms)
- MCP Server Panel (server configuration UI)
- Workspace Document Editor (rich text editing, KaTeX, Mermaid)

Not every user navigates to every panel. Loading all panels upfront wastes bandwidth and increases Time-to-Interactive (TTI), especially on mobile connections.

## Decision

**Use `React.lazy()` + dynamic `import()` for the 5 heaviest panels**, defined in `src/App.tsx:32-36`:

```typescript
const WorkspaceDocumentEditor = React.lazy(() =>
  import('./components/WorkspaceDocumentEditor').then(m => ({ default: m.WorkspaceDocumentEditor }))
);
const A2AMetricsDashboard = React.lazy(() =>
  import('./components/A2AMetricsDashboard').then(m => ({ default: m.A2AMetricsDashboard }))
);
const GoogleWorkspacePanel = React.lazy(() =>
  import('./components/GoogleWorkspacePanel').then(m => ({ default: m.GoogleWorkspacePanel }))
);
const SettingsPanel = React.lazy(() =>
  import('./components/SettingsPanel')
);
const MCPServerPanel = React.lazy(() =>
  import('./components/MCPServerPanel').then(m => ({ default: m.MCPServerPanel }))
);
```

All lazy components are wrapped inside `<React.Suspense>` with a loading fallback in the rendering tree. Components used on initial view (ChatInterface, KnowledgeBaseManager, SearchPanel, WorkspaceManager) remain eagerly loaded.

Lazy-loaded panels with their approximate size contributions:

| Component | Estimated Size | Trigger |
|-----------|---------------|---------|
| A2AMetricsDashboard | 15KB gzip | User clicks Metrics tab |
| GoogleWorkspacePanel | 20KB gzip | User opens GDrive panel |
| SettingsPanel | 12KB gzip | User opens Settings |
| MCPServerPanel | 8KB gzip | User opens MCP config |
| WorkspaceDocumentEditor | 25KB gzip | User opens a document |

## Consequences

| Positive | Negative |
|----------|----------|
| Initial JS bundle reduced by ~80KB gzip | Lazy components show a loading state on first render |
| Faster initial page load (lower TTI) | Slightly more complex import syntax with `.then()` unwrapping |
| Users on mobile download only what they use | Dynamic imports add a few extra network requests |
| Vite automatically code-splits at dynamic `import()` boundaries | Module-level CSS might flash unstyled content |

## See Also

- [ADR-001: Zero NPM Dependency Decision](./001-zero-npm-dependency.md)
- [API Documentation Index](../api/000-index.md)


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
