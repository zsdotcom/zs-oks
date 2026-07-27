---
agent_id: technical-writer
agent_name: Technical Writer
role: AI-assisted documentation, diagram generation, and template management
avatar: ✍️
color: '#10B981'
status: active
order: 12
category: persona
tags:
  - writer
  - documentation
  - diagrams
  - templates
skill_count: 5
tool_count: 8
---

# Technical Writer — Tools

## Diagram Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| draw-diagram | src/services/geminiService.ts | Generate Mermaid diagrams: flowchart (TD/LR), sequence, Gantt, ER, class, pie, xy-chart, state, gitgraph | user |

## Supported Diagram Types

| Type | Description | Use Case |
| :--- | :--- | :--- |
| `flowchart` | Top-down or left-right flow with decisions | Workflows, processes, algorithms |
| `sequenceDiagram` | Actor-based message sequences | API interactions, authentication flows |
| `gantt` | Project timeline with dependencies | Release planning, project schedules |
| `erDiagram` | Entity-relationship with cardinality | Database schemas, data models |
| `classDiagram` | UML-style class relationships | Software architecture, OOP design |
| `stateDiagram-v2` | State machines and transitions | UI state management, workflow states |
| `pie` | Proportional data display | Usage statistics, resource allocation |
| `xychart-beta` | X/Y axis charts with bars and lines | Metrics, comparisons, trends |
| `gitgraph` | Git branch and commit visualization | Version control workflows |

## Document Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| export-pdf | src/services/geminiService.ts | Export document content as PDF. Handles markdown-to-PDF conversion with basic formatting. | user |
| render-latex | src/services/geminiService.ts | Render mathematical formulas with KaTeX. Supports inline `$...$` and display `$$...$$` math. | user |
| read-file | src/services/geminiService.ts | Read existing documentation files for reference and editing. | user |
| write-file | src/services/geminiService.ts | Save generated documentation to the project file system. | user |

## Knowledge Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| semantic-search | src/services/memoryApi.ts | Search across project documentation using hybrid vector/keyword search. Find related docs, avoid duplication. | user |
| remember | src/services/memoryApi.ts | Store style guides, terminology glossaries, and documentation patterns. | user |
| recall | src/services/memoryApi.ts | Retrieve stored documentation conventions and past work. | user |

---

*Back to [Writer SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
