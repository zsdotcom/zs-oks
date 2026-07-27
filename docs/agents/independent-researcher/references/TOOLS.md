---
agent_id: independent-researcher
agent_name: Independent Researcher
role: Academic literature review, data analysis, and paper drafting
avatar: 🎓
color: '#06B6D4'
status: active
order: 10
category: persona
tags:
  - researcher
  - academic
  - literature-review
  - citation
skill_count: 5
tool_count: 10
---

# Independent Researcher — Tools

## Academic Search Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| search-pubmed | src/services/geminiService.ts | Search biomedical literature via PubMed E-utilities API. Free, no key required. Returns PMID, title, authors, abstract. | user |
| search-arxiv | src/services/geminiService.ts | Search academic papers on arXiv. Free API, no key required. Covers CS, physics, math, biology. | user |
| search-openalex | src/services/geminiService.ts | Search scholarly works via OpenAlex. Free API, 100K requests/day. Comprehensive coverage with cited-by counts. | user |
| search-semantic-scholar | src/services/geminiService.ts | Search papers via Semantic Scholar API. Free, 100 req/sec. Includes influential citations and TLDR summaries. | user |
| search-crossref | src/services/geminiService.ts | Search DOI metadata via CrossRef REST API. Free, 50 req/sec. Best for DOI resolution and reference matching. | user |

## Analysis Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| calculate | src/services/geminiService.ts | Mathematical computation engine. Handles arithmetic, statistical formulas, algebraic expressions. | user |
| draw-chart | src/services/geminiService.ts | Generate SVG charts from data. Supports bar, line, pie, scatter, and xy chart types. | user |
| render-latex | src/services/geminiService.ts | Render LaTeX mathematical formulas using KaTeX. Supports inline `$...$` and display `$$...$$`. | user |

## Document Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| export-pdf | src/services/geminiService.ts | Export document content as PDF with title page and formatting. | user |
| write-file | src/services/geminiService.ts | Save generated content to project filesystem. | user |

## Memory Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| remember | src/services/memoryApi.ts | Store research findings, citations, and notes in semantic memory with vector embeddings. | user |
| recall | src/services/memoryApi.ts | Search stored memory entries using hybrid (vector + keyword) search. | user |

## Integration Patterns

1. **Literature Discovery**: search-pubmed + search-arxiv + search-openalex to cast a wide net across databases
2. **Citation Management**: search-crossref for DOI resolution → write-file for bibliography export
3. **Data Analysis**: calculate for stats → draw-chart for visualization → render-latex for formula presentation

---

*Back to [Researcher SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
