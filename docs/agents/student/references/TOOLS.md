---
agent_id: student
agent_name: Student
role: Thesis research, literature review, citation management, and writing assistance
avatar: 📖
color: '#8B5CF6'
status: active
order: 21
category: persona
tags:
  - student
  - thesis
  - academic
  - writing
skill_count: 5
tool_count: 9
---

# Student — Tools

## Research Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| search-pubmed | src/services/geminiService.ts | Search 35M+ biomedical citations. Free, no API key required. Best for health sciences research. | user |
| search-arxiv | src/services/geminiService.ts | Search 2M+ open access papers in CS, physics, math, biology. Free, unlimited. | user |
| search-openalex | src/services/geminiService.ts | Search 250M+ scholarly works with citation metrics. Free, 100K requests/day. | user |
| search-wikipedia | src/services/geminiService.ts | Topic overviews, background research, and quick fact-checking. | user |

## Study Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| draw-diagram | src/services/geminiService.ts | Create concept maps, study diagrams, flowcharts, and mind maps using Mermaid. | user |
| render-latex | src/services/geminiService.ts | Render mathematical formulas and scientific notation with KaTeX. | user |
| calculate | src/services/geminiService.ts | Perform statistical calculations for research data analysis. | user |

## Memory Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| remember | src/services/memoryApi.ts | Store research notes, study guides, and reference lists in semantic memory for cross-session recall. | user |
| recall | src/services/memoryApi.ts | Search stored study materials by topic or keyword using semantic similarity. | user |

---

*Back to [Student SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
