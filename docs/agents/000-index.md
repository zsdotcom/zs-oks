---
title: "000 — Agent System Index"
description: "Complete index of all 12 built-in A2A agents plus custom agent creation template"
category: "agents"
order: 0
tags: ["agents", "index", "a2a"]
last_updated: "2026-07-28"
audience: "users"
---

# A2A Debate Agents

Open Knowledge Studio ships with **6 built-in A2A debate agents** plus **9 persona-based agent guides** tailored to specific user roles.

## Built-in Agent Roster

| Agent | ID | Avatar | Color | Role |
| :--- | :--- | :--- | :--- | :--- |
| [Coordinator](001-coordinator.md) | `coord` | 🎯 | `#8B5CF6` | Orchestrates workflows, delegates tasks |
| [Researcher](002-researcher.md) | `research` | 🔬 | `#06B6D4` | Searches and synthesizes information |
| [Data Analyst](003-data-analyst.md) | `data` | 📊 | `#F59E0B` | Processes data and statistics |
| [Writer](004-writer.md) | `writer` | ✍️ | `#10B981` | Drafts documents and formats |
| [Reviewer](005-reviewer.md) | `review` | 🔍 | `#EF4444` | Quality checks and peer review |
| [Librarian](006-librarian.md) | `librarian` | 📚 | `#A855F7` | Maintains memory and knowledge |

## Persona-Based Agent Guides

Designed for specific user roles — each guide provides tailored system prompts, skill selections, tool configurations, and workflow patterns for that audience.

| Persona | ID | Avatar | Color | Role |
| :--- | :--- | :--- | :--- | :--- |
| [Independent Researcher](007-independent-researcher.md) | `independent-researcher` | 🎓 | `#06B6D4` | Academic literature review, data analysis, and paper drafting |
| [Public Health Analyst](008-public-health-analyst.md) | `public-health-analyst` | 🏥 | `#F59E0B` | Disease outbreak tracking, ICD-11 coding, epi analysis |
| [Technical Writer](009-technical-writer.md) | `technical-writer` | ✍️ | `#10B981` | AI-assisted documentation, diagrams, template management |
| [Data Journalist](010-data-journalist.md) | `data-journalist` | 📰 | `#EF4444` | Data-driven storytelling, public data analysis |
| [Knowledge Manager](011-knowledge-manager.md) | `knowledge-manager` | 📚 | `#A855F7` | Knowledge base management, taxonomy, reference organization |
| [Developer](012-developer.md) | `developer` | 🛠️ | `#3B82F6` | MCP servers, custom agents, API integration |
| [Student](013-student.md) | `student` | 📖 | `#8B5CF6` | Thesis research, literature review, exam prep |
| [NGO Field Worker](014-ngo-field-worker.md) | `ngo-field-worker` | 🌍 | `#10B981` | Offline field research, health assessments, SitReps |
| [Privacy-Conscious User](015-privacy-user.md) | `privacy-user` | 🔒 | `#6B7280` | Local-first AI, offline mode, data sovereignty |

## How Agents Work

1. User activates the A2A panel in Chat Interface
2. User submits a prompt
3. Each active agent generates a response based on its system prompt
4. Responses appear color-coded with agent name and avatar
5. Metrics tracked in A2AMetricsDashboard

## Creating Custom Agents

Custom agents can be created via the Settings Panel with:

- Name and avatar (emoji)
- System prompt (expertise description)
- Color for UI differentiation
- Active/inactive toggle

Custom agents persist in IndexedDB's `a2aAgents` store. Use the [template](016-template.md) as a starting point.

## Documentation Structure

Each agent is documented in a single consolidated file:

- **Overview & System Prompt** — Agent identity, role, and base instructions
- **Skills & Tools** — Core competencies and service integrations
- **Templates** — Default prompts and reusable patterns
- **Workflow Patterns** — Common agent-specific workflows

For a system-level reference, see [Agent System Reference](000-index.md#how-agents-work).

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._

