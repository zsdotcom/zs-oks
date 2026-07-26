---
title: A2A Debate Agents
description: Documentation index for all A2A debate agents
section: agents
order: 0
---

# A2A Debate Agents

Open Knowledge Studio ships with **6 built-in A2A debate agents** that provide multi-perspective analysis on user prompts. Each agent has a distinct role, color-coded identity, avatar, and system prompt.

## Agent Roster

| Agent | ID | Avatar | Color | Role |
| :--- | :--- | :--- | :--- | :--- |
| [Coordinator](coordinator/index.md) | `coord` | 🎯 | `#8B5CF6` | Orchestrates workflows, delegates tasks |
| [Researcher](researcher/index.md) | `research` | 🔬 | `#06B6D4` | Searches and synthesizes information |
| [Data Analyst](data-analyst/index.md) | `data` | 📊 | `#F59E0B` | Processes data and statistics |
| [Writer](writer/index.md) | `writer` | ✍️ | `#10B981` | Drafts documents and formats |
| [Reviewer](reviewer/index.md) | `review` | 🔍 | `#EF4444` | Quality checks and peer review |
| [Librarian](librarian/index.md) | `librarian` | 📚 | `#8B5CF6` | Maintains memory and knowledge |

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

Custom agents persist in IndexedDB's `a2aAgents` store. Use the [_template](_template/index.md) as a starting point.

## Documentation Structure

Each agent has its own directory with:

- **index.md** — Agent overview, identity, system prompt
- **SKILLS.md** — Core competencies and capabilities
- **TEMPLATES.md** — Default prompts and reusable templates
- **TOOLS.md** — Available tools and service integrations

---

*Back to [Documentation Home](../index.md)*
