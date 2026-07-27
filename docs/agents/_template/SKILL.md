---
agent_id: template
agent_name: Custom Agent
role: Describe your agent's role here
avatar: ❓
color: '#6B7280'
css_var: --color-template
status: draft
order: 0
category: a2a
type: a2a-agent
tags:
  - template
  - custom
skills: []
tools:
  - queryLLM
references: [TEMPLATES.md, TOOLS.md]
---

# A2A Agent: {Agent Name}

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `{agent-id}` |
| Name | {Display Name} |
| Role | {Brief role description} |
| Avatar | {Emoji} |
| Color | `{Hex Color}` |
| CSS Variable | `--color-{id}` |
| Status | Active by default |
| Category | a2a |

## System Prompt

```
You are the {Agent Name} Agent of Open Knowledge Studio. {Detailed role description with behavioral instructions}.
```

## Capabilities

- {Focus area 1}
- {Focus area 2}
- {Focus area 3}

## Skills

| Skill | Description | Triggers | Priority |
| :--- | :--- | :--- | :--- |
| {Skill 1} | {Description} | {Trigger condition} | {low/medium/high} |
| {Skill 2} | {Description} | {Trigger condition} | {low/medium/high} |
| {Skill 3} | {Description} | {Trigger condition} | {low/medium/high} |

## Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | {Tool description} | user |

## Related Documentation

- [references/TEMPLATES.md](references/TEMPLATES.md) — Default prompts and reusable templates
- [references/TOOLS.md](references/TOOLS.md) — Available tools and service integrations
- [Agent System](../SKILL.md) — All agent documentation
- [A2A Agents Guide](../../guides/060-agents.md) — Agent configuration and management
- [Custom Agent Creation Guide](../../guides/060-agents.md#5-custom-agent-creation)

---

*Back to [Agent System](../SKILL.md) | [Documentation Home](../../index.md)*
