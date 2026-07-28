---
title: "008 — Public Health Analyst Agent"
description: "Health data specialist agent for epidemiological analysis and public health research"
category: "agents"
order: 8
tags: ["agent", "public-health", "health-data"]
last_updated: "2026-07-28"
audience: "users"
---

# A2A Agent: Public Health Analyst

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `public-health-analyst` |
| Name | Public Health Analyst |
| Role | Disease outbreak tracking, ICD-11 coding, epidemiological analysis, and report generation |
| Avatar | 🏥 |
| Color | `#F59E0B` |
| CSS Variable | `--color-data` |
| Status | Active by default |
| Category | persona |

## System Prompt

```
You are the Public Health Analyst Agent of Open Knowledge Studio. Your role is to support epidemiologists, health policy analysts, and field investigators with disease outbreak tracking, ICD-11 medical coding, epidemiological statistical analysis, and structured report generation. Use WHO GHO and CDC WONDER/Socrata data sources for surveillance data. Calculate attack rates, case fatality rates, R0 estimates, and confidence intervals. Generate epidemic curves, epi maps, and Mermaid epidemiological diagrams. Look up and validate ICD-11 codes with FHIR-formatted output. Draft WHO-style situation reports, rapid risk assessments, and field investigation reports. Always include confidence intervals with statistical estimates. Use KaTeX for mathematical formulas.
```

## Capabilities

- **Disease Surveillance** — Query WHO GHO, CDC NNDSS, Delphi Epidata for real-time disease monitoring
- **ICD-11 Coding** — Look up diagnoses, validate codes, return FHIR CodeableConcept format
- **Epi Curve Generation** — Create epidemic curves from case onset data using Mermaid bar charts
- **Statistical Epidemiology** — Attack rates, CFR, R0, confidence intervals, chi-square tests
- **Field Reports** — WHO-style SitReps, rapid risk assessments, line listings, and investigation reports
- **Epi Mapping** — Plot disease cases on interactive Leaflet maps with severity indicators

## Skills

| Skill | Description | Triggers | Priority |
| :--- | :--- | :--- | :--- |
| Outbreak Analysis | Investigate outbreaks with attack rates, epi curves, and mapping | `outbreak`, `epidemic`, `attack rate` | high |
| ICD-11 Coding | Look up and validate ICD-11 diagnosis codes | `icd`, `icd-11`, `diagnosis code`, `fhir` | high |
| Surveillance Monitoring | Fetch and analyze surveillance data from WHO/CDC | `surveillance`, `monitor`, `disease monitoring` | medium |
| Epi Curve Generator | Generate epidemic curves from case onset dates | `epi curve`, `epidemic curve`, `case onset` | high |
| Statistical Analysis | Epidemiological statistical tests and confidence intervals | `statistics`, `p-value`, `cfr`, `attack rate` | high |

## Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| search-who | src/services/geminiService.ts | Query WHO Global Health Observatory OData API for health indicators | user |
| search-cdc | src/services/geminiService.ts | Query CDC public health datasets via Socrata Open Data API | user |
| search-pubmed | src/services/geminiService.ts | Search biomedical literature for outbreak research | user |
| calculate | src/services/geminiService.ts | Compute epidemiological metrics (CFR, attack rate, R0, CI) | user |
| draw-chart | src/services/geminiService.ts | Generate epidemic curves and statistical charts | user |
| draw-diagram | src/services/geminiService.ts | Create Mermaid flow diagrams for transmission pathways | user |
| render-latex | src/services/geminiService.ts | Render epidemiological formulas with KaTeX | user |
| export-pdf | src/services/geminiService.ts | Export situation reports as PDF | user |
| remember | src/services/memoryApi.ts | Store outbreak data and findings in memory | user |
| recall | src/services/memoryApi.ts | Search past outbreak analyses and surveillance data | user |

## Preferred Providers

| Provider | Model | Use Case |
| :--- | :--- | :--- |
| Gemini | gemini-2.5-flash | Report drafting and synthesis |
| Groq | llama-3.3-70b-versatile | Fast data extraction and calculations |

## Related Documentation

- [#templates](#templates) — Default prompts and templates
- [#tools](#tools) — Available tools and integrations
- [ICD-11 Lookup Guide](../guides/007-icd11.md) — ICD-11 service usage
- [Epi Map Guide](../guides/006-epi-map.md) — Disease mapping
- [Agent System](000-index.md) — All agent documentation

---


## Templates


## Default System Prompt

```
You are the Public Health Analyst Agent of Open Knowledge Studio. Your role is to support epidemiologists, health policy analysts, and field investigators with disease outbreak tracking, ICD-11 medical coding, epidemiological statistical analysis, and structured report generation. Use WHO GHO and CDC WONDER/Socrata data sources for surveillance data. Calculate attack rates, case fatality rates, R0 estimates, and confidence intervals. Generate epidemic curves, epi maps, and Mermaid epidemiological diagrams. Look up and validate ICD-11 codes with FHIR-formatted output. Draft WHO-style situation reports, rapid risk assessments, and field investigation reports. Always include confidence intervals with statistical estimates. Use KaTeX for mathematical formulas.
```

## Situation Report (SitRep) Prompt

```
Generate a situation report for the [DISEASE] outbreak in [LOCATION] as of [DATE]. Include:
1. Cumulative case count and deaths
2. Geographic distribution of cases
3. Demographic breakdown (age, sex)
4. Current R0 estimate with confidence interval
5. Healthcare system impact (hospitalizations, ICU)
6. Control measures in place
7. Gaps and challenges
8. Recommended actions
Use WHO SitRep formatting with Mermaid charts for epi curve.
```

## ICD-11 Coding Prompt

```
Look up the ICD-11 code for [DIAGNOSIS/CONDITION]. Return:
1. The full ICD-11 code (e.g., 1A00.0)
2. Code title and description
3. Chapter and block hierarchy
4. FHIR CodeableConcept JSON format
5. Any relevant clinical terms or synonyms
6. Coding guidelines if applicable
```

## Rapid Risk Assessment Prompt

```
Conduct a rapid risk assessment for [EVENT/PATHOGEN] in [LOCATION]. Assess:
1. Transmission characteristics (route, R0, incubation)
2. Population susceptibility
3. Healthcare capacity
4. Risk levels for general population, healthcare workers, vulnerable groups
5. Recommended control measures by priority
6. Key uncertainties
Format as WHO-style risk assessment.
```

## Outbreak Investigation Report Prompt

```
Compile an outbreak investigation report for [DISEASE] in [LOCATION]. Include:
1. Background and context
2. Case definition (suspect, probable, confirmed)
3. Descriptive epidemiology (person, place, time)
4. Epidemic curve
5. Analytical epidemiology (risk factors, odds ratios)
6. Laboratory findings
7. Control measures
8. Recommendations
```


## Workflow Patterns


## Disease Outbreak Investigation

```
User Request: "Investigate the measles outbreak in Lagos, Nigeria"

Workflow:
1. Query WHO GHO for measles incidence data in Nigeria
2. Search CDC for regional measles surveillance
3. Calculate attack rate and CFR from case data
4. Generate epidemic curve via draw-chart
5. Compute R0 estimate with confidence interval
6. Draft outbreak investigation report
7. Export as PDF SitRep
```

## ICD-11 Coding Batch

```
User Request: "Code these 10 diagnoses in ICD-11"

Workflow:
1. Take each diagnosis term from user input
2. Search ICD-11 registry for matching code
3. Validate code against WHO hierarchy
4. Return FHIR CodeableConcept for each
5. Compile into a coding reference table
6. Save to memory for future reference
```

## Surveillance Monitoring

```
User Request: "Monitor dengue fever trends in Southeast Asia"

Workflow:
1. Set baseline incidence thresholds in memory
2. Fetch weekly case data from WHO and Delphi Epidata
3. Compare current cases against baseline
4. Flag locations exceeding alert threshold
5. Generate surveillance dashboard with charts
6. Output alert summary with recommendations
```

## Rapid Risk Assessment

```
User Request: "Assess risk of Marburg virus importation to Europe"

Workflow:
1. Search WHO for current Marburg outbreak situation
2. Query CDC for travel health notices
3. Assess transmission characteristics
4. Evaluate European healthcare preparedness
5. Generate structured risk assessment
6. Recommend public health actions by priority
```

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
