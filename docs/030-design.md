# 030 — UI/UX Design Specifications

This document outlines the visual design and agent identity system for **Open Knowledge Studio v2.0**.

---

## 1. 6-Agent Color Identity

| Agent | ID | Avatar | Color (Hex) | CSS Variable |
| :--- | :--- | :--- | :--- | :--- |
| Coordinator | `coord` | 🎯 | `#8B5CF6` | `--color-coord` |
| Researcher | `research` | 🔬 | `#06B6D4` | `--color-research` |
| Data Analyst | `data` | 📊 | `#F59E0B` | `--color-data` |
| Writer | `writer` | ✍️ | `#10B981` | `--color-writer` |
| Reviewer | `review` | 🔍 | `#EF4444` | `--color-review` |
| Librarian | `librarian` | 📚 | `#8B5CF6` | `--color-librarian` |

CSS variables are defined in `src/index.css`:
```css
:root {
  --color-coord: #8B5CF6;
  --color-research: #06B6D4;
  --color-data: #F59E0B;
  --color-writer: #10B981;
  --color-review: #EF4444;
  --color-librarian: #8B5CF6;
}
```

---

## 2. Theme System

Dark/light mode via CSS variables in `src/index.css`. Toggled by `ThemeSwitcher` component, persisted in IndexedDB via `usePersistence` hook.

---

## 3. Layout

- **Header:** App title, navigation tabs, online status, Google sign-in, theme toggle, settings.
- **Sidebar (collapsible):** Workspace Manager + Knowledge Base Manager.
- **Main pane:** Chat, Editor, Search, Kanban, Dashboard, Templates, MCP views.
- **Floating panels:** Google Workspace, Gmail Compose, Chat Sessions sidebar, Settings modal.
