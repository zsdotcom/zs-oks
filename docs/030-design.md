# 030 — UI/UX Design Specifications

This document outlines the visual design, theming, and real-time rendering specifications for **Open Knowledge Studio v1.0**.

---

## 1. Color-Coded Agent Identity

To enhance visual clarity and tracking, each agent is assigned a specific color and avatar. These colors are used consistently throughout the UI, including chat interfaces, task progress trackers, and diagram nodes.

| Agent ID | Role | Avatar | Color (Hex) | Color (CSS) |
| :--- | :--- | :--- | :--- | :--- |
| `coord` | Coordinator | 🎯 | `#8b5cf6` | `var(--color-coord)` |
| `research` | Researcher | 🔬 | `#06b6d4` | `var(--color-research)` |
| `data` | Data Analyst | 📊 | `#f59e0b` | `var(--color-data)` |
| `writer` | Writer | ✍️ | `#10b981` | `var(--color-writer)` |
| `review` | Reviewer | 🔍 | `#ef4444` | `var(--color-review)` |
| `knowledge` | Librarian | 📚 | `#8b5cf6` | `var(--color-librarian)` |

---

## 2. Theming System

The application supports both **Dark** and **Light** modes, controlled via a `ThemeSwitcher` component.

### 2.1 CSS Variables
Theming is implemented using native CSS variables defined in `src/index.css`:

```css
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --border-color: #334155;
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --border-color: #e2e8f0;
}
```

### 2.2 Theme Persistence
The user's theme preference is stored in `localStorage` (not IndexedDB, to ensure immediate application on load) and applied synchronously before the React tree renders.

---

## 3. Real-Time Diagram Rendering

The platform integrates **Mermaid.js** for dynamic, color-coded diagram generation.

### 3.1 Supported Diagram Types
1. Flowcharts (`graph TD`)
2. Sequence Diagrams (`sequenceDiagram`)
3. Gantt Charts (`gantt`)
4. Mind Maps (`mindmap`)
5. Pie Charts (`pie`)
6. Entity Relationship Diagrams (`erDiagram`)

### 3.2 Live Preview via BroadcastChannel
To ensure real-time updates without blocking the main thread, diagram rendering is handled via a dedicated Web Worker and synchronized across tabs using the `BroadcastChannel` API.

```typescript
// When a diagram is updated in the editor
const diagramChannel = new BroadcastChannel('oks_diagrams');
diagramChannel.postMessage({
  type: 'update',
  payload: mermaidCode
});
```

### 3.3 Error Handling
If Mermaid.js fails to render a diagram (e.g., syntax error), the UI displays a fallback error state with the raw code and a descriptive error message, preventing the entire application from crashing.

---

## 4. Responsive Layout

The UI is designed with a responsive, split-pane layout:

- **Sidebar:** Contains the Workspace Manager, Knowledge Base, and Settings.
- **Main Pane:** Hosts the Chat Interface (Coordinator) and the Document Editor (Writer).
- **Right Pane (Collapsible):** Displays the Metrics Dashboard and Real-Time Diagram Preview.

The layout adapts to mobile screens by collapsing side panels into a hamburger menu.
