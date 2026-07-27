---
title: A2A Debate Agents
description: Documentation index for all A2A debate agents and persona-based agent guides
section: agents
order: 0
type: agent-system
skill_count: 15
---

# A2A Debate Agents

Open Knowledge Studio ships with **6 built-in A2A debate agents** plus **9 persona-based agent guides** tailored to specific user roles.

## Built-in Agent Roster

| Agent | ID | Avatar | Color | Role |
| :--- | :--- | :--- | :--- | :--- |
| [Coordinator](coordinator/SKILL.md) | `coord` | 🎯 | `#8B5CF6` | Orchestrates workflows, delegates tasks |
| [Researcher](researcher/SKILL.md) | `research` | 🔬 | `#06B6D4` | Searches and synthesizes information |
| [Data Analyst](data-analyst/SKILL.md) | `data` | 📊 | `#F59E0B` | Processes data and statistics |
| [Writer](writer/SKILL.md) | `writer` | ✍️ | `#10B981` | Drafts documents and formats |
| [Reviewer](reviewer/SKILL.md) | `review` | 🔍 | `#EF4444` | Quality checks and peer review |
| [Librarian](librarian/SKILL.md) | `librarian` | 📚 | `#A855F7` | Maintains memory and knowledge |

## Persona-Based Agent Guides

Designed for specific user roles — each guide provides tailored system prompts, skill selections, tool configurations, and workflow patterns for that audience.

| Persona | ID | Avatar | Color | Role |
| :--- | :--- | :--- | :--- | :--- |
| [Independent Researcher](independent-researcher/SKILL.md) | `independent-researcher` | 🎓 | `#06B6D4` | Academic literature review, data analysis, and paper drafting |
| [Public Health Analyst](public-health-analyst/SKILL.md) | `public-health-analyst` | 🏥 | `#F59E0B` | Disease outbreak tracking, ICD-11 coding, epi analysis |
| [Technical Writer](technical-writer/SKILL.md) | `technical-writer` | ✍️ | `#10B981` | AI-assisted documentation, diagrams, template management |
| [Data Journalist](data-journalist/SKILL.md) | `data-journalist` | 📰 | `#EF4444` | Data-driven storytelling, public data analysis |
| [Knowledge Manager](knowledge-manager/SKILL.md) | `knowledge-manager` | 📚 | `#A855F7` | Knowledge base management, taxonomy, reference organization |
| [Developer](developer/SKILL.md) | `developer` | 🛠️ | `#3B82F6` | MCP servers, custom agents, API integration |
| [Student](student/SKILL.md) | `student` | 📖 | `#8B5CF6` | Thesis research, literature review, exam prep |
| [NGO Field Worker](ngo-field-worker/SKILL.md) | `ngo-field-worker` | 🌍 | `#10B981` | Offline field research, health assessments, SitReps |
| [Privacy-Conscious User](privacy-user/SKILL.md) | `privacy-user` | 🔒 | `#6B7280` | Local-first AI, offline mode, data sovereignty |

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

Custom agents persist in IndexedDB's `a2aAgents` store. Use the [_template](_template/SKILL.md) as a starting point.

## Documentation Structure

Each agent directory follows the opencode agent/skill pattern:

- **SKILL.md** — Agent identity, overview, system prompt, skills table, and tools table (consolidated entry point)
- **references/TEMPLATES.md** — Default prompts and reusable templates
- **references/TOOLS.md** — Available tools and service integrations
- **workflows/** — Agent-specific workflow patterns

For a full reference guide, see [references/index.md](references/index.md).

---

*Back to [Documentation Home](../index.md)*
