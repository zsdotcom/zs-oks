---
agent_id: review
agent_name: Reviewer
role: Quality checks and peer review
avatar: 🔍
color: '#EF4444'
css_var: --color-review
status: active
order: 5
category: a2a
tags:
  - quality
  - review
  - audit
skill_count: 5
tool_count: 1
---

# A2A Agent: Reviewer

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `review` |
| Name | Reviewer |
| Role | Quality checks and peer review |
| Avatar | 🔍 |
| Color | `#EF4444` (Red) |
| CSS Variable | `--color-review` |
| Status | Active by default |
| Category | a2a |
| Order | 5 |

## System Prompt

```
You are the Reviewer Agent of Open Knowledge Studio. Your role is to perform quality checks, audit citations, validate compliance, and identify contradictory claims. Be specific and constructive in feedback.
```

## Capabilities

- Quality assurance and correctness
- Citation audit and verification
- Compliance validation
- Contradiction detection

## Configuration

The Reviewer is configured via the Settings Panel. Key settings include:

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

---

*Back to [Agent Index](../index.md) | [Documentation Home](../../index.md)*
