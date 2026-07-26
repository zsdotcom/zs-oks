# Skills Registry

## Epidemiology Skills

| Skill ID | Description | Assigned Agent(s) | Tools Used |
|----------|-------------|-------------------|------------|
| `attack-rate-calc` | Calculate epidemiological attack rates from case data | Data Analyst | `calculate` |
| `epi-curve` | Generate epidemic curves from case onset dates | Data Analyst | `draw-chart`, `calculate` |
| `r0-estimator` | Estimate basic reproduction number from epidemic data | Data Analyst | `calculate`, `draw-chart` |
| `chi-square-test` | Perform chi-square statistical test on categorical data | Data Analyst | `calculate` |
| `confidence-interval` | Calculate confidence intervals for proportions/means | Data Analyst | `calculate` |
| `data-clean` | Clean and normalize epidemiological datasets | Data Analyst | `read-file`, `write-file` |
| `outbreak-detection` | Detect anomalies in surveillance data streams | Data Analyst | `calculate` |

## Research Skills

| Skill ID | Description | Assigned Agent(s) | Tools Used |
|----------|-------------|-------------------|------------|
| `literature-review` | Systematic literature search and synthesis | Researcher, Writer | `search-arxiv`, `search-openalex`, `search-pubmed` |
| `outbreak-research` | Disease-specific outbreak data gathering | Researcher | `search-who`, `search-cdc`, `search-wikipedia` |
| `guideline-research` | Clinical and public health guideline retrieval | Researcher | `search-who`, `search-wikipedia` |
| `source-evaluate` | Evaluate source credibility using CRAAP test | Researcher | `read-file` |

## Writing Skills

| Skill ID | Description | Assigned Agent(s) | Tools Used |
|----------|-------------|-------------------|------------|
| `report-writer` | Generate structured reports from research and data | Writer | `read-file`, `write-file`, `export-pdf` |
| `policy-brief` | Create policy briefs from research findings | Writer | `read-file`, `write-file`, `export-pdf` |
| `literature-review` | Synthesize literature into review format | Writer | `read-file`, `write-file` |
| `protocol-template` | Generate research protocol documents from templates | Writer | `read-file`, `write-file` |
| `citation-format` | Apply consistent citation styles (APA, Vancouver, MLA) | Writer, Reviewer | `read-file`, `write-file` |
| `executive-summary` | Extract key findings into executive summary format | Writer | `read-file`, `write-file` |

## Workflow Skills (Coordinator Only)

| Skill ID | Description | Assigned Agent(s) | Tools Used |
|----------|-------------|-------------------|------------|
| `workflow-decompose` | Break complex tasks into sub-tasks | Coordinator | `spawn-agent`, `send-message` |
| `workflow-delegate` | Assign tasks to specialized agents via A2A | Coordinator | `spawn-agent`, `send-message` |
| `workflow-validate` | Quality-check agent outputs before merging | Coordinator | `send-message` |
| `workflow-merge` | Combine multiple agent outputs into unified response | Coordinator | `read-file`, `write-file` |

## Memory Skills (Librarian Only)

| Skill ID | Description | Assigned Agent(s) | Tools Used |
|----------|-------------|-------------------|------------|
| `memory-maintenance` | Organize, compress, and archive memory entries | Librarian | `remember`, `forget`, `recall` |
| `knowledge-refresh` | Update knowledge base from free external sources | Librarian | `search-wikipedia`, `search-openalex` |
| `index-rebuild` | Rebuild semantic search index with new embeddings | Librarian | `embed`, `vectorize`, `semantic-search` |
| `reference-manager` | Maintain bibliography and citation database | Librarian | `read-file`, `write-file` |
| `glossary-build` | Build project-specific terminology glossary | Librarian | `read-file`, `write-file` |

## Review Skills

| Skill ID | Description | Assigned Agent(s) | Tools Used |
|----------|-------------|-------------------|------------|
| `quality-check` | Validate output quality against project standards | Reviewer | `read-file`, `write-file` |
| `consistency-audit` | Check for contradictions across multiple outputs | Reviewer | `read-file`, `write-file`, `calculate` |
| `citation-audit` | Verify all citations are valid and complete | Reviewer | `read-file`, `write-file` |
| `methodology-review` | Review analytical methodology for logical flaws | Reviewer | `read-file`, `calculate` |
| `compliance-check` | Check outputs against WHO/CDC reporting standards | Reviewer | `read-file` |

## Skill Definition Format

Skills can be defined via the Settings panel GUI or by creating a Markdown file with frontmatter:

```markdown
---
name: my-custom-skill
description: Brief description that helps the LLM match user intent.
allowed-tools: tool1, tool2
priority: high | medium | low
agent-scope: all | agent-id
---

## Instructions

1. Step one of the skill's workflow
2. Step two with specific details
3. Step three including expected output format
```
