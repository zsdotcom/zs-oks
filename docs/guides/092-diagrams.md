---
title: "092 — Diagram Generation"
category: "guides"
order: 92
tags: ["diagrams", "mermaid", "katex", "visualization"]
last_updated: "2026-07-26"
---

# 092 — Diagram Generation

---

## 1. Description

Chat messages from A2A agents are now rendered through the markdown parser (`src/utils/markdown.ts`), enabling inline KaTeX math and Mermaid diagrams.

## 2. How it works

- Model messages in `ChatInterface.tsx` use `parse(msg.text)` to convert markdown → HTML
- A `useEffect` hook scans the rendered output for `.katex-math`, `.katex-inline`, and `.language-mermaid` elements
- KaTeX elements are rendered using the KaTeX CDN library
- Mermaid code blocks are converted to rendered SVG diagrams via the Mermaid CDN library

## 3. Data Analyst Prompt

The Data Analyst agent's system prompt now includes:

> When presenting data, generate diagrams using Mermaid syntax (flowcharts, bar charts, pie charts, xy charts) inside ```mermaid code fences. Use KaTeX $$inline math$$ for statistical formulas.

## 4. Supported diagram types

- Flowcharts: `graph TD` / `graph LR`
- Pie charts: `pie title ...`
- XY charts: `xychart-beta`
- Bar charts (via xychart or pie)
- Sequence diagrams: `sequenceDiagram`
- Class diagrams, state diagrams, Gantt charts, git graphs

---

## See Also

- [User Guide: PDF Export](093-pdf-export.md) — Exporting diagrams to PDF
- [User Guide: A2A Agents](060-agents.md) — Data Analyst agent diagram generation
- [Project Design](../project/030-design.md) — UI/UX design and theme system
- [Developer Guide: Development](../developers/040-development.md) — Markdown parser implementation

---

*Back to [Documentation Home](../index.md) | [Project Docs](../project/000-overview.md) | [Developer Docs](../developers/040-development.md)*
