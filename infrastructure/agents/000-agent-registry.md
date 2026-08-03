# 000-agent-registry.md
## Agent Registry
### Overview of all A2A Agents in Open Knowledge Studio

**Document type:** Reference
**Date:** August 03, 2026
**Author:** Mohammad Ariful Islam / ZarishSphere Foundation
**License:** Apache 2.0 (code) · CC BY 4.0 (documentation)
**Status:** V1 — Active

## 1. Introduction

Open Knowledge Studio utilizes a multi-agent architecture (A2A) to handle complex research, writing, and analysis tasks. This registry defines the roles and capabilities of each agent.

## 2. Agent List

| ID | Name | Role | Primary Expertise |
| :--- | :--- | :--- | :--- |
| `coord` | Coordinator | Orchestrator | Task decomposition, delegation, and validation |
| `research` | Researcher | Information Gatherer | Web search, document analysis, and fact-checking |
| `analyst` | Data Analyst | Statistical Expert | Data processing, visualization, and insight generation |
| `writer` | Writer | Content Creator | Drafting, creative writing, and report generation |
| `reviewer` | Reviewer | Quality Assurance | Proofreading, consistency checking, and peer review |
| `lib` | Librarian | Knowledge Manager | Indexing, categorization, and reference management |
| `sec` | Security Analyst | Safety Expert | Threat modeling, privacy audit, and compliance |
| `code-rev` | Code Reviewer | Technical Auditor | Code quality, bug detection, and optimization |
| `planner` | Planning Agent | Strategy Expert | Long-term planning, roadmap development, and logistics |
| `tester` | Testing Agent | Validation Expert | Unit testing, E2E testing, and bug verification |
| `code-gen` | Code Generator | Developer | Implementation, refactoring, and feature development |
| `curator` | Knowledge Curator | Context Manager | Knowledge base maintenance and context enrichment |

## 3. Workflow Patterns

### 3.1. Orchestrated Workflow (Parallel)
The Coordinator decomposes a task and assigns sub-tasks to multiple agents who work in parallel.

### 3.2. Sequential Workflow (Chain)
Agents work in a sequence where the output of one agent becomes the input for the next.

---
*ZarishSphere Foundation · V1 · August 03, 2026*
*License: Apache 2.0 (code) · CC BY 4.0 (documentation)*
*GitHub: https://github.com/zsdotcom/zs-oks*
