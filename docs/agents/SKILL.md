---
title: A2A Debate Agents
description: Documentation index for all A2A debate agents
section: agents
order: 0
type: agent-system
skill_count: 6
---

# A2A Debate Agents

Open Knowledge Studio ships with **6 built-in A2A debate agents** that provide multi-perspective analysis on user prompts. Each agent has a distinct role, color-coded identity, avatar, and system prompt.

## Agent Roster

| Agent | ID | Avatar | Color | Role |
| :--- | :--- | :--- | :--- | :--- |
| [Coordinator](coordinator/SKILL.md) | `coord` | 🎯 | `#8B5CF6` | Orchestrates workflows, delegates tasks |
| [Researcher](researcher/SKILL.md) | `research` | 🔬 | `#06B6D4` | Searches and synthesizes information |
| [Data Analyst](data-analyst/SKILL.md) | `data` | 📊 | `#F59E0B` | Processes data and statistics |
| [Writer](writer/SKILL.md) | `writer` | ✍️ | `#10B981` | Drafts documents and formats |
| [Reviewer](reviewer/SKILL.md) | `review` | 🔍 | `#EF4444` | Quality checks and peer review |
| [Librarian](librarian/SKILL.md) | `librarian` | 📚 | `#8B5CF6` | Maintains memory and knowledge |

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
