---
agent_id: ngo-field-worker
agent_name: NGO Field Worker
role: Offline-capable field research, health assessments, and situation reporting
avatar: 🌍
color: '#10B981'
status: active
order: 22
category: persona
tags:
  - ngo
  - field-work
  - offline
  - health
skill_count: 5
tool_count: 7
---

# NGO Field Worker — Tools

## Field Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| draw-diagram | src/services/geminiService.ts | Create response workflow diagrams, supply chain flowcharts, and organizational charts for field coordination. | user |
| calculate | src/services/geminiService.ts | Compute coverage rates, attack rates, supply gap percentages, and budget estimates. Works offline. | user |
| render-latex | src/services/geminiService.ts | Render epidemiological and statistical formulas for field reports and training materials. | user |

## Documentation Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| export-pdf | src/services/geminiService.ts | Export field reports, assessments, and surveys as PDF for printing or offline sharing via USB/Bluetooth. | user |
| write-file | src/services/geminiService.ts | Save field assessments, situation reports, and survey instruments locally for later sync. | user |

## Memory Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| remember | src/services/memoryApi.ts | Store field observations, community data, and assessment results in local IndexedDB. All data stays on device. | user |
| recall | src/services/memoryApi.ts | Search past field assessments and local knowledge — fully offline via local semantic search. | user |

## Offline-First Features

| Feature | Online | Offline | Fallback |
| :--- | :--- | :--- | :--- |
| PWA Installation | Available | Works | Install before going to field |
| Document Drafting | Full | Full | No change |
| Template Access | CDN-loaded | Cached | Works after first load |
| Semantic Search | Vector index | Local index | No change |
| PDF Export | Full | Full | Works offline |
| Data Storage | IndexedDB | IndexedDB | No change |
| CDN Diagrams | Mermaid/KaTeX | Cached | Pre-load before field work |

---

*Back to [Field Worker SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
