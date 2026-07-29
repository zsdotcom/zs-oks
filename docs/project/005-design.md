---
title: "005 — UI/UX Design System"
description: "Cyber-minimalist design system documentation: colors, typography, layout, elevation, and components"
category: "project"
order: 5
tags: ["design", "ui", "ux", "cyber-minimalist"]
last_updated: "2026-07-28"
audience: "stakeholders"
---
# 005 — UI/UX Design System

## 1. Design Philosophy: Cyber-Minimalism

Open Knowledge Studio's design system is built on **Cyber-minimalism** — blending the austerity of a professional terminal with the sophistication of high-end hardware interfaces. Every visual decision prioritizes focus, performance, and spatial awareness for power users, developers, and researchers.

### Visual Principles

| Principle | Description |
| :--- | :--- |
| **Minimalism** | Aggressive reduction of UI chrome. Functionality is revealed through intent, not chrome. |
| **Glassmorphism** | Semi-transparent panels with high-blur backdrops maintain depth without visual clutter. |
| **Precision** | Mathematical alignment and consistent technical details evoke high-fidelity engineering. |
| **Subtle Glow** | Soft outer-glow on accents to signify AI activity or active states — mimicking high-end electronics. |
| **Dark-First** | Strictly dark-mode palette optimized for long sessions, reduced eye strain, and the "obsidian vault" metaphor. |

---

## 2. Color System

### 2.1 Palette

```yaml
# Core Palette
surface: '#0b1326'              # Primary canvas
surface-dim: '#0b1326'          # Dim variant
surface-bright: '#31394d'       # Bright surface
surface-container-lowest: '#060e20'
surface-container-low: '#131b2e'
surface-container: '#171f33'
surface-container-high: '#222a3d'
surface-container-highest: '#2d3449'
on-surface: '#dae2fd'           # Text on surface
on-surface-variant: '#cbc3d7'
inverse-surface: '#dae2fd'
inverse-on-surface: '#283044'
outline: '#958ea0'
outline-variant: '#494454'
surface-tint: '#d0bcff'
background: '#0b1326'
on-background: '#dae2fd'
surface-variant: '#2d3449'

# Brand Accents
primary: '#d0bcff'              # Purple-white (brand)
on-primary: '#3c0091'
primary-container: '#a078ff'
on-primary-container: '#340080'
inverse-primary: '#6d3bd7'

# AI & Action Accents
secondary: '#4cd7f6'            # Cyan (AI actions, generative states)
on-secondary: '#003640'
secondary-container: '#03b5d3'
on-secondary-container: '#00424e'

# Success & Status
tertiary: '#4edea3'             # Emerald (success, complete)
on-tertiary: '#003824'
tertiary-container: '#00a572'
on-tertiary-container: '#00311f'

# Error States
error: '#ffb4ab'
on-error: '#690005'
error-container: '#93000a'
on-error-container: '#ffdad6'

# Agent Colors
agent-coord: '#8B5CF6'          # Electric Violet
agent-research: '#06B6D4'       # Neon Cyan
agent-data: '#F59E0B'           # Amber
agent-writer: '#10B981'         # Emerald
agent-review: '#EF4444'         # Ruby
agent-librarian: '#A855F7'      # Purple
```

### 2.2 Agent Color Identity

| Agent | CSS Variable | Color | Usage |
| :--- | :--- | :--- | :--- |
| Coordinator | `--color-coord` | `#8B5CF6` | Agent header, avatar border, response accent |
| Researcher | `--color-research` | `#06B6D4` | Agent header, avatar border, response accent |
| Data Analyst | `--color-data` | `#F59E0B` | Agent header, avatar border, response accent |
| Writer | `--color-writer` | `#10B981` | Agent header, avatar border, response accent |
| Reviewer | `--color-review` | `#EF4444` | Agent header, avatar border, response accent |
| Librarian | `--color-librarian` | `#A855F7` | Agent header, avatar border, response accent |
| Security Analyst | `--color-security` | `#EC4899` | Agent header, avatar border, response accent |
| Code Reviewer | `--color-code-review` | `#14B8A6` | Agent header, avatar border, response accent |
| Planning Agent | `--color-planner` | `#F97316` | Agent header, avatar border, response accent |
| Testing Agent | `--color-tester` | `#6366F1` | Agent header, avatar border, response accent |
| Code Generator | `--color-code-gen` | `#84CC16` | Agent header, avatar border, response accent |
| Knowledge Curator | `--color-knowledge` | `#F43F5E` | Agent header, avatar border, response accent |

### 2.3 Semantic Color Usage

| State | Color | HEX | Applied To |
| :--- | :--- | :--- | :--- |
| Active/Online | Emerald | `#10B981` | Status indicators |
| AI Processing | Cyan | `#06B6D4` | Sparkline, loading glow, pulsing border |
| Error | Ruby | `#E11D48` | Alerts, error states |
| Warning | Amber | `#F59E0B` | Warnings, degraded states |
| Success | Emerald | `#10B981` | Confirmation, completion |
| Link | Violet | `#8B5CF6` | Interactive links, primary buttons |
| Muted Text | Slate | `#64748B` | Secondary text, markdown syntax |

### 2.4 Surface Overlay Values

Glass surfaces use white with extremely low alpha to create subtle light-traps:

| Layer | Value | Usage |
| :--- | :--- | :--- |
| Glass subtle | `rgba(255,255,255,0.02)` | Card backgrounds |
| Glass medium | `rgba(255,255,255,0.04)` | Sidebar panels |
| Glass prominent | `rgba(255,255,255,0.06)` | Hover states, floating toolbars |

---

## 3. Typography

### 3.1 Font System

| Font | Type | Usage |
| :--- | :--- | :--- |
| **Inter** | Sans-serif (primary) | Prose, headings, interface elements |
| **JetBrains Mono** | Monospace (technical) | Code blocks, markdown syntax, metadata labels, status bar |

### 3.2 Type Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-lg` | Inter | 32px | 700 | 1.2 | -0.02em | Page titles |
| `headline-lg-mobile` | Inter | 26px | 700 | 1.2 | -0.02em | Page titles (mobile) |
| `headline-md` | Inter | 24px | 600 | 1.3 | -0.01em | Section headings |
| `body-lg` | Inter | 18px | 400 | 1.6 | normal | Lead paragraphs |
| `body-md` | Inter | 16px | 400 | 1.6 | normal | Body text |
| `code-md` | JetBrains Mono | 14px | 400 | 1.5 | normal | Code, technical content |
| `label-sm` | JetBrains Mono | 12px | 500 | 1.0 | 0.05em | Labels, metadata (uppercase) |

### 3.3 Typography Conventions

- **Headlines** use tighter letter-spacing and heavier weights to feel "locked in."
- **Body text** uses generous line-height (1.6) for comfortable long-form reading.
- **Labels** are always JetBrains Mono, frequently uppercase with tracking.
- **Markdown syntax** rendered at 50% opacity to keep focus on content.

---

## 4. Layout & Spacing

### 4.1 Grid

| Token | Value |
| :--- | :--- |
| Baseline unit | 4px |
| Gutter (md) | 24px |
| Page margin (desktop) | 32px |
| Page margin (mobile) | 16px |
| Container max width | 800px (writing canvas) |

### 4.2 Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Header Bar (Title, Tabs, Status, Theme, Settings)  │
├───────────┬─────────────────────────────────────────┤
│           │                                         │
│  Sidebar  │           Main Content                  │
│  (240px)  │                                         │
│  Glass    │    [Writing Canvas: max 800px]          │
│  Collaps. │                                         │
│           │  ┌──────────────────────────────────┐   │
│  ─ Files  │  │                                  │   │
│  ─ KBase  │  │   Markdown Editor / Chat /       │   │
│           │  │   Kanban / Dashboard             │   │
│           │  │                                  │   │
│           │  └──────────────────────────────────┘   │
│           │                                         │
├───────────┴─────────────────────────────────────────┤
│  Status Bar (Online status, provider, memory stats)  │
└─────────────────────────────────────────────────────┘
```

### 4.3 Responsive Behavior

| Breakpoint | Layout Change |
| :--- | :--- |
| >1024px | Full layout: sidebar visible, 32px margins |
| 768–1024px | Collapsed sidebar (toggle via hamburger), 24px margins |
| <768px | Stacked layout, full-width panels, 16px margins, bottom nav |

### 4.4 AI Sidebar

A secondary, right-aligned panel (320px) appears for AI chat active state or transformations, pushing main content left to maintain balance.

---

## 5. Elevation & Depth

Hierarchy is established through **luminance and blur** rather than traditional box-shadows.

| Level | Name | Value | Usage |
| :--- | :--- | :--- | :--- |
| 0 | Base | `#020617` (Obsidian) | Deep background |
| 1 | Sub-surface | `#0F172A` (Deep Charcoal) | Gutters, inactive sidebar |
| 2 | Glass Layer | `rgba(15,23,42,0.6)` + `backdrop-blur(12px)` | Floating toolbars, modals, sidebar |
| 3 | Interactive | 1px inner `rgba(255,255,255,0.1)` border | Active/hovered elements |
| Glow | AI State | `box-shadow: 0 0 15px rgba(6,182,212,0.3)` | AI processing indicator, Focus Mode cursor |

---

## 6. Shapes & Corners

| Token | Radius | Usage |
| :--- | :--- | :--- |
| `rounded-sm` | 2px | Status dots, selection indicators |
| `rounded-md` | 4px | Buttons, inputs, standard elements |
| `rounded-lg` | 8px | Cards, panels, containers |
| `rounded-full` | 9999px | Avatars (avoid for buttons — too organic) |

**Rule:** Avoid pill-shaped buttons. Stick to soft-cornered rectangles (4px) for the cyber-minimalist aesthetic.

---

## 7. Component Design

### 7.1 Buttons

| Type | Style | Hover |
| :--- | :--- | :--- |
| **Primary** | Solid `#8B5CF6` bg, white text, 1px light-violet top border (rim lighting) | Slightly brighter bg |
| **AI Action** | Translucent bg, 1px `#06B6D4` border | Soft cyan outer glow |
| **Ghost** | Transparent, no border | 50% opacity text |
| **Danger** | Solid `#E11D48` bg, white text | Brighter bg |

### 7.2 Inputs

| Type | Default | Focus |
| :--- | :--- | :--- |
| **Ghost Input** | No background, no border, `code-md` typography | 1px bottom border activation |
| **Standard Input** | `surface-container` bg, `outline` border | `primary` border |

### 7.3 Cards & Surfaces

| Type | Style | Usage |
| :--- | :--- | :--- |
| **Glass Card** | 1px `rgba(255,255,255,0.05)` border, 12px backdrop-blur | File previews, AI suggestions |
| **Surface Card** | `surface-container` bg, 8px rounded | Settings panels, metrics |
| **Agent Card** | Agent color left border (4px), glass bg | A2A agent responses |

### 7.4 AI Interface Elements

| Element | Style |
| :--- | :--- |
| **AI Sparkline** | 2px pulsing line, `#06B6D4`, at top of editor during AI processing |
| **Contextual Menu** | Dark, blurred glass bg, minimalist icons, appears on text selection |
| **Active Line** | Subtle `surface-container-high` bg highlight + 2px `#8B5CF6` vertical bar in left gutter |

### 7.5 Markdown Editor

| Element | Style |
| :--- | :--- |
| **Split Pane** | Left: editor (`code-md`, `surface-container` bg). Right: preview (rendered markdown, `body-md`). |
| **Markdown Syntax** | 50% opacity `on-surface` text to de-emphasize markers |
| **Active Line** | `surface-container-high` bg + 2px Electric Violet left border |
| **TOC** | Generated from `#` headings, pinned to right gutter |

---

## 8. Agent UI

### 8.1 Agent Response Card

```
┌─────────────────────────────────────────────┐
│ 🎯 Coordinator    #8B5CF6 accent   12:34 PM │
│─────────────────────────────────────────────│
│                                             │
│  Agent response content rendered in         │
│  standard body-md typography.               │
│                                             │
│  May include: mermaid diagrams,             │
│  KaTeX math, code blocks, lists.            │
│                                             │
└─────────────────────────────────────────────┘
```

### 8.2 A2A Debate Panel

- Active agents toggle on/off
- Each agent occupies horizontal space proportional to response length
- Color-coded agent indicator bar at top
- Metrics dashboard: latency, token count, success rate

---

## 9. Animation & Transitions

| Element | Animation | Duration | Easing |
| :--- | :--- | :--- | :--- |
| Panel open/close | Slide + fade | 200ms | ease-out |
| Sidebar toggle | Slide from left | 250ms | ease-in-out |
| AI Processing | Pulsing glow on active agent | 1.5s loop | ease-in-out |
| Agent response | Fade in + slide up | 300ms | ease-out |
| Theme switch | Instant (no transition) | 0ms | — |
| Notification | Slide from top | 300ms | ease-out |

---

## 10. Accessibility

| Consideration | Implementation |
| :--- | :--- |
| **Color Contrast** | All text meets WCAG AA (4.5:1) minimum on surface backgrounds |
| **Focus Indicators** | 2px `#8B5CF6` outline on keyboard focus |
| **Reduced Motion** | `prefers-reduced-motion` disables all animations |
| **Screen Readers** | Semantic HTML, aria-labels on icon buttons |
| **Font Scaling** | `rem`-based sizing respects browser font size settings |

---

## See Also

- [000 — Project Overview](000-overview.md) — High-level introduction
- [002 — Technical Specification](002-specification.md) — Detailed component specifications
- [004 — Architecture](004-architecture.md) — System architecture
- [006 — Brand Guidelines](006-brand-guidelines.md) — Brand positioning, voice & tone, messaging library
- [Index](../index.md) — Full documentation index
- [A2A Agents Guide](../guides/001-agents.md) — Agent UI and color identity
- [Diagram Generation Guide](../guides/003-diagrams.md) — KaTeX and Mermaid rendering

---

*Last updated: July 27, 2026*

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
