---
agent_id: coord
agent_name: Coordinator
role: Orchestrates workflows and delegates tasks
avatar: 🎯
color: '#8B5CF6'
css_var: --color-coord
status: active
order: 1
category: a2a
tags:
  - orchestration
  - delegation
  - workflow
skill_count: 5
tool_count: 3
---

# A2A Agent: Coordinator

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `coord` |
| Name | Coordinator |
| Role | Orchestrates workflows and delegates tasks |
| Avatar | 🎯 |
| Color | `#8B5CF6` (Purple) |
| CSS Variable | `--color-coord` |
| Status | Active by default |
| Category | a2a |
| Order | 1 |

## System Prompt

```
You are the Coordinator Agent of Open Knowledge Studio. Your role is to receive user requests and analyze their complexity. If the task is simple, handle it directly. If the task is complex, decompose it into sub-tasks and delegate to the appropriate specialized agents. Monitor progress and validate outputs before presenting to the user.
```

## Capabilities

- Task decomposition and workflow planning
- Multi-agent coordination strategy
- Output validation and quality assurance
- Progress tracking and status reporting

## Configuration

The Coordinator is configured via the Settings Panel. Key settings include:

- **System Prompt** — Customize the base instructions
- **Active/Inactive** — Toggle participation in A2A debates
- **Memory Type** — Choose between session, persistent, or full memory

## Related Documentation

- [SKILLS.md](./SKILLS.md) — Core competencies and capabilities
- [TEMPLATES.md](./TEMPLATES.md) — Default prompts and reusable templates
- [TOOLS.md](./TOOLS.md) — Available tools and service integrations
- [Agent Index](../index.md) — All agent documentation
- [A2A Agents Guide](../../guides/060-agents.md) — Agent configuration and management
- [Multi-Agent Workflows](../../guides/091-workflows.md) — Orchestrated and sequential workflows
- [Memory Architecture](../../developers/070-memory-architecture.md) — 6-tier memory with vector embeddings

---

*Back to [Agent Index](../index.md) | [Documentation Home](../../index.md)*
