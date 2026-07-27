---
agent_id: public-health-analyst
agent_name: Public Health Analyst
role: Disease outbreak tracking, ICD-11 coding, epidemiological analysis, and report generation
avatar: 🏥
color: '#F59E0B'
status: active
order: 11
category: persona
tags:
  - epidemiology
  - public-health
  - disease-surveillance
  - icd11
skill_count: 5
tool_count: 10
---

# Public Health Analyst — Tools

## Surveillance Data Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| search-who | src/services/geminiService.ts | Query WHO Global Health Observatory API. Free, no key. Indicators for 1000+ health metrics across 194 countries. | user |
| search-cdc | src/services/geminiService.ts | Query CDC Open Data via Socrata. NNDSS notifiable diseases, PLACES health measures, 70+ datasets. | user |
| search-pubmed | src/services/geminiService.ts | Search biomedical literature via PubMed. Free, 10 req/sec. | user |

## Analysis Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| calculate | src/services/geminiService.ts | Compute epidemiological metrics: attack rate, CFR, R0, odds ratio, relative risk, chi-square, confidence intervals. | user |
| draw-chart | src/services/geminiService.ts | Generate epidemic curves (bar charts of cases over time), scatter plots, and statistical charts. | user |
| draw-diagram | src/services/geminiService.ts | Create Mermaid flow diagrams for transmission chains, investigation workflows, and response algorithms. | user |
| render-latex | src/services/geminiService.ts | Render epidemiological formulas using KaTeX display math. | user |

## Report Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| export-pdf | src/services/geminiService.ts | Export situation reports and risk assessments as PDF documents. | user |
| write-file | src/services/geminiService.ts | Save investigation reports and line listings to project files. | user |

## Memory Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| remember | src/services/memoryApi.ts | Store outbreak data, surveillance thresholds, and findings in semantic memory. | user |
| recall | src/services/memoryApi.ts | Search historical outbreak data and previous analyses. | user |

## Key Data Sources

| Source | Coverage | API Type | Rate Limit |
| :--- | :--- | :--- | :--- |
| WHO GHO | 1000+ health indicators, 194 countries | OData REST | Unlimited |
| CDC NNDSS | Notifiable diseases by state/year | Socrata Open Data | 1000/hr |
| CDC PLACES | County-level health measures | Socrata Open Data | 1000/hr |
| Delphi Epidata | COVID-19, flu, dengue surveillance | REST | 10000/day |

---

*Back to [Analyst SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
