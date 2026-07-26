---
agent_id: data
agent_name: Data Analyst
role: Processes data and generates statistics
avatar: 📊
color: '#F59E0B'
css_var: --color-data
status: active
order: 3
category: a2a
tags:
  - data
  - statistics
  - visualization
skill_count: 4
tool_count: 2
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

## Configuration

The Data Analyst is configured via the Settings Panel. Key settings include:

- **System Prompt** — Customize the base instructions
- **Active/Inactive** — Toggle participation in A2A debates
- **Memory Type** — Choose between session, persistent, or full memory

## Related Documentation

- [SKILLS.md](./SKILLS.md) — Core competencies and capabilities
- [TEMPLATES.md](./TEMPLATES.md) — Default prompts and reusable templates
- [TOOLS.md](./TOOLS.md) — Available tools and service integrations
- [Agent Index](../index.md) — All agent documentation
- [A2A Agents Guide](../../guides/060-agents.md) — Agent configuration and management
- [Multi-Agent Workflows](../../guides/091-workflows.md) — Orchestrated and sequential workflows
- [Diagram Generation Guide](../../guides/092-diagrams.md) — KaTeX math and Mermaid diagrams
- [Sandboxed Execution](../../guides/094-sandbox.md) — Secure code execution

---

*Back to [Agent Index](../index.md) | [Documentation Home](../../index.md)*
