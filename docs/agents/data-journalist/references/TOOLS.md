---
agent_id: data-journalist
agent_name: Data Journalist
role: Data-driven storytelling, public data analysis, and investigative research
avatar: 📰
color: '#EF4444'
status: active
order: 13
category: persona
tags:
  - journalist
  - data-analysis
  - visualization
  - public-data
skill_count: 5
tool_count: 10
---

# Data Journalist — Tools

## Research Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| search-web | src/services/geminiService.ts | General web search for background research, source identification, and context gathering. | user |
| search-wikipedia | src/services/geminiService.ts | Query Wikipedia REST API for background articles, statistics, and references. Free, unlimited. | user |
| rss-fetch | src/services/geminiService.ts | Parse and monitor RSS feeds from news sources, blogs, and data portals. | user |

## Analysis Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| calculate | src/services/geminiService.ts | Statistical computations: descriptive stats, correlation, regression, chi-square, t-tests. | user |
| draw-chart | src/services/geminiService.ts | Generate data visualizations: bar, line, pie, scatter, xychart. Customizable colors and labels. | user |
| draw-diagram | src/services/geminiService.ts | Create explanatory diagrams: flowcharts for investigative methodology, infographics. | user |
| render-latex | src/services/geminiService.ts | Render statistical formulas with KaTeX for methodology transparency. | user |

## Publishing Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| export-pdf | src/services/geminiService.ts | Export articles, briefs, and reports as PDF with proper formatting. | user |
| write-file | src/services/geminiService.ts | Save research findings, cleaned datasets, and article drafts to project files. | user |

## Memory Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| remember | src/services/memoryApi.ts | Store datasets, source metadata, and research notes with vector embeddings. | user |
| recall | src/services/memoryApi.ts | Search stored research across projects using semantic search. | user |

## Public API Quick Reference

| API | Best For | Query Pattern |
| :--- | :--- | :--- |
| World Bank | Economic indicators, poverty, education | `https://api.worldbank.org/v2/country/{code}/indicator/{id}` |
| UN Data | Population, SDGs, trade | `https://data.un.org/ws/rest/data/{flow}` |
| WHO GHO | Health indicators, mortality | `https://ghoapi.azureedge.net/api/{indicator}` |
| Open-Meteo | Weather, climate, air quality | `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}` |
| GDELT | Global news events, sentiment | `https://api.gdeltproject.org/api/v2/doc/doc?query={q}` |

---

*Back to [Journalist SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
