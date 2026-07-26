# 095 — Code Splitting & Performance

**Date:** July 26, 2026

---

## 1. Description

Heavy UI components are lazy-loaded using `React.lazy()` and `React.Suspense` to reduce the initial bundle size.

## 2. Components split

| Component | Import | Size (est.) | When loaded |
| :--- | :--- | :--- | :--- |
| `A2AMetricsDashboard` | `React.lazy()` | ~8 KB | When A2A tab is opened |
| `WorkspaceDocumentEditor` | `React.lazy()` | ~12 KB | When a document is opened |
| `SettingsPanel` | `React.lazy()` | ~6 KB | When Settings button is clicked |
| `MCPServerPanel` | `React.lazy()` | ~4 KB | When MCP tab is opened |
| `GoogleWorkspacePanel` | `React.lazy()` | ~5 KB | When Google panel is opened |

## 3. Implementation

Each component is imported with a dynamic import wrapper:

```typescript
const A2AMetricsDashboard = React.lazy(
  () => import('./components/A2AMetricsDashboard')
    .then(m => ({ default: m.A2AMetricsDashboard }))
);
```

Each usage site is wrapped in:

```tsx
<React.Suspense fallback={
  <div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 text-xs">
    Loading...
  </div>
}>
  <ComponentName ...props />
</React.Suspense>
```

## 4. Still direct imports

`ChatInterface`, `KnowledgeBaseManager`, `SearchPanel`, `ThemeSwitcher`, `ErrorBoundary`, `KanbanBoardView`, `ChatSessionSidebar`, `GmailCompose`, `ICD11Lookup`, `EpiMap`, `SimpleCharts`, all icons — these are small or always-visible components.
