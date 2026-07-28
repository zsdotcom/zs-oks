---
title: "003 — Data Analyst Agent"
description: "Statistical analysis and data visualization agent for data cleaning, analysis, and chart generation"
category: "agents"
order: 3
tags: ["agent", "data-analyst", "statistics", "visualization"]
last_updated: "2026-07-28"
audience: "users"
---

# A2A Agent: Data Analyst

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `data` |
| Name | Data Analyst |
| Role | Processes data and generates statistics |
| Avatar | 📊 |
| Color | `#F59E0B` (Amber) |
| CSS Variable | `--color-data` |
| Status | Active by default |
| Category | a2a |
| Order | 3 |

## System Prompt

```
You are the Data Analyst Agent of Open Knowledge Studio. Your role is to process datasets, perform statistical analysis, generate visualizations, and compute metrics. Always sanitize inputs, handle missing data gracefully, and provide confidence intervals. When presenting data, generate diagrams using Mermaid syntax (flowcharts, bar charts, pie charts, xy charts) inside ```mermaid code fences. Use KaTeX $$inline math$$ for statistical formulas.
```

## Capabilities

- Statistical analysis and interpretation
- Data quality and missing data handling
- Visualization recommendations
- Confidence intervals and uncertainty

## Skills

| Skill | Description | Triggers | Priority |
| :--- | :--- | :--- | :--- |
| Statistical Analysis | Compute metrics, distributions, confidence intervals | Dataset or numerical query | high |
| Data Cleaning | Sanitize inputs, handle missing data, detect outliers | Raw or unprocessed data | high |
| Visualization | Design charts and diagrams (Mermaid syntax) | Request for graphical output | high |
| Uncertainty Quantification | Provide confidence intervals and error margins | Statistical estimation task | medium |

## Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | Data analysis and visualization generation | user |
| executeCode | src/services/sandboxService.ts | Run JS data processing in sandbox | user |

## Configuration

The Data Analyst is configured via the Settings Panel. Key settings include:

- **System Prompt** — Customize the base instructions
- **Active/Inactive** — Toggle participation in A2A debates
- **Memory Type** — Choose between session, persistent, or full memory

## Related Documentation

- [#templates](#templates) — Default prompts and reusable templates
- [#tools](#tools) — Available tools and service integrations
- [Agent System](000-index.md) — All agent documentation
- [A2A Agents Guide](../guides/001-agents.md) — Agent configuration and management
- [Multi-Agent Workflows](../guides/002-workflows.md) — Orchestrated and sequential workflows
- [Diagram Generation Guide](../guides/092-diagrams.md) — KaTeX math and Mermaid diagrams
- [Sandboxed Execution](../guides/094-sandbox.md) — Secure code execution

---


## Templates


## Default System Prompt

```
You are the Data Analyst Agent of Open Knowledge Studio. Your role is to process datasets, perform statistical analysis, generate visualizations, and compute metrics. Always sanitize inputs, handle missing data gracefully, and provide confidence intervals. When presenting data, generate diagrams using Mermaid syntax (flowcharts, bar charts, pie charts, xy charts) inside ```mermaid code fences. Use KaTeX $$inline math$$ for statistical formulas.
```

## Usage

- The **Default System Prompt** is loaded automatically when the Data Analyst is activated in an A2A debate.
- The prompt instructs the agent to use **Mermaid** for diagrams and **KaTeX** for mathematical formulas. See the [Diagram Generation Guide](../guides/092-diagrams.md) for supported syntax.


## Workflow Patterns


The Data Analyst agent typically operates within:

## Data Processing Pipeline

Raw data ingested, cleaned, analyzed, visualized, and reported in a sequential pipeline.

## On-Demand Analysis

Ad-hoc statistical queries answered with confidence intervals and visualization recommendations.

See [Multi-Agent Workflows](../guides/002-workflows.md) for detailed patterns.


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
