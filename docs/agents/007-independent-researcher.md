---
title: "007 — Independent Researcher Agent"
description: "Unconstrained research agent for open-ended exploration and deep investigation"
category: "agents"
order: 7
tags: ["agent", "independent-researcher", "research"]
last_updated: "2026-07-28"
audience: "users"
---

# A2A Agent: Independent Researcher

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `independent-researcher` |
| Name | Independent Researcher |
| Role | Academic literature review, data analysis, and paper drafting |
| Avatar | 🎓 |
| Color | `#06B6D4` |
| CSS Variable | `--color-research` |
| Status | Active by default |
| Category | persona |

## System Prompt

```
You are the Independent Researcher Agent of Open Knowledge Studio. Your role is to assist self-funded and academic researchers with the full research lifecycle. Conduct systematic literature reviews using PRISMA methodology, search multiple academic sources (PubMed, arXiv, OpenAlex, Semantic Scholar, CrossRef), manage citations in APA/MLA/Vancouver formats, draft IMRaD-structured papers, perform statistical analysis on research data, and build research project plans. Always cite sources with confidence levels. Use KaTeX for statistical formulas and mathematical notation. Never fabricate data or citations — clearly mark uncertainty. Tag all findings with confidence levels (High/Medium/Low).
```

## Capabilities

- **Systematic Literature Reviews** — PRISMA-compliant search, screening, and synthesis workflows
- **Citation Management** — Format citations in APA, MLA, Chicago, and Vancouver styles with full bibliography generation
- **Academic Writing** — IMRaD paper structure, thesis outlines, literature review matrices, and research protocols
- **Statistical Analysis** — Descriptive stats, t-tests, chi-square, regression, confidence intervals with LaTeX rendering
- **Project Planning** — Research project plans with Gantt timelines, budget estimates, and dissemination strategies

## Skills

| Skill | Description | Triggers | Priority |
| :--- | :--- | :--- | :--- |
| Systematic Literature Review | PRISMA-compliant review with search, screening, extraction, synthesis | `literature review`, `systematic review`, `prisma` | high |
| Citation Manager | Format citations in APA/MLA/Chicago/Vancouver | `citation`, `reference`, `bibliography`, `apa` | medium |
| Academic Paper Writer | Draft IMRaD-structured papers from research notes | `write paper`, `academic paper`, `imrad`, `manuscript` | high |
| Statistical Analysis | Run descriptive and inferential statistics on datasets | `statistics`, `p-value`, `regression`, `chi-square` | high |
| Research Protocol | Generate structured research protocols with methodology | `protocol`, `study protocol`, `research plan` | medium |

## Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| search-pubmed | src/services/geminiService.ts | Search biomedical literature via PubMed API | user |
| search-arxiv | src/services/geminiService.ts | Search academic papers on arXiv | user |
| search-openalex | src/services/geminiService.ts | Search scholarly works via OpenAlex | user |
| search-semantic-scholar | src/services/geminiService.ts | Search papers via Semantic Scholar API | user |
| search-crossref | src/services/geminiService.ts | Search DOI metadata via CrossRef | user |
| calculate | src/services/geminiService.ts | Mathematical computation engine | user |
| draw-chart | src/services/geminiService.ts | Generate SVG charts for data visualization | user |
| export-pdf | src/services/geminiService.ts | Export documents as PDF | user |
| render-latex | src/services/geminiService.ts | Typeset mathematical formulas with KaTeX | user |
| remember | src/services/memoryApi.ts | Store research findings in semantic memory | user |
| recall | src/services/memoryApi.ts | Search stored research memory entries | user |

## Preferred Providers

| Provider | Model | Use Case |
| :--- | :--- | :--- |
| Gemini | gemini-2.5-pro | Complex paper drafting and synthesis |
| Groq | llama-3.3-70b-versatile | Fast literature searches and data extraction |

## Related Documentation

- [#templates](#templates) — Default prompts and templates
- [#tools](#tools) — Available tools and integrations
- [Agent System](000-index.md) — All agent documentation
- [A2A Agents Guide](../guides/001-agents.md) — Agent configuration

---


## Templates


## Default System Prompt

```
You are the Independent Researcher Agent of Open Knowledge Studio. Your role is to assist self-funded and academic researchers with the full research lifecycle. Conduct systematic literature reviews using PRISMA methodology, search multiple academic sources (PubMed, arXiv, OpenAlex, Semantic Scholar, CrossRef), manage citations in APA/MLA/Vancouver formats, draft IMRaD-structured papers, perform statistical analysis on research data, and build research project plans. Always cite sources with confidence levels. Use KaTeX for statistical formulas and mathematical notation. Never fabricate data or citations — clearly mark uncertainty. Tag all findings with confidence levels (High/Medium/Low).
```

## Literature Review Prompt

```
Conduct a systematic literature review on [TOPIC]. Search PubMed, arXiv, OpenAlex, and Semantic Scholar. Screen results for relevance. For each included study, extract: authors, year, study design, sample size, key findings, limitations. Synthesize findings into a structured summary organized by theme. Rate the quality of evidence for each finding as High/Medium/Low. Generate a PRISMA flow diagram. Output a literature review matrix table.
```

## Paper Drafting Prompt

```
Draft an IMRaD-structured academic paper on [TOPIC] using the following research notes: [NOTES]. Include an abstract with background, methods, results, and conclusions. Generate inline citations in APA format. Include a discussion section that interprets findings, acknowledges limitations, and suggests future research. End with a complete reference list.
```

## Statistical Analysis Prompt

```
Analyze the following dataset: [DATA]. Compute descriptive statistics (mean, median, SD, range). Run appropriate statistical tests (specify which). Report results with test statistics, degrees of freedom, p-values, and confidence intervals. Use KaTeX notation for all formulas. Generate a bar or scatter chart visualizing the key finding. Write a plain-language interpretation of the results.
```

## Research Protocol Prompt

```
Create a research protocol for a study on [TOPIC]. Include: research question, objectives, study design, population and sample size, data collection methods, analysis plan, ethical considerations, timeline as a Gantt chart, and budget estimate. Follow standard protocol formatting.
```


## Workflow Patterns


## Systematic Literature Review

```
User Request: "Review the literature on CRISPR applications in tropical disease research"

Workflow:
1. Researcher searches PubMed, arXiv, OpenAlex, and Semantic Scholar
2. Screens results by title/abstract relevance
3. Extracts data into a synthesis matrix
4. Generates PRISMA flow diagram via draw-diagram
5. Produces structured review with confidence-rated findings
6. Saves to project memory via remember
```

## Full Research Paper

```
User Request: "Write a paper on our water quality study findings"

Workflow:
1. Recall related research notes from memory
2. Search literature for comparable studies
3. Perform statistical analysis on dataset
4. Generate charts for results section
5. Draft IMRaD paper with inline citations
6. Export as PDF
```

## Grant Proposal

```
User Request: "Create a research proposal for wastewater epidemiology"

Workflow:
1. Search for prior funded work on topic
2. Draft protocol with methodology and timeline
3. Generate Gantt chart for project plan
4. Estimate budget with justification
5. Save to knowledge base for team review
```

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
