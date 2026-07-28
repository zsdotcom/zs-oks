---
title: "016 — Custom Agent Creation Template"
description: "Template for creating custom A2A agents with configurable roles, skills, and system prompts"
category: "agents"
order: 16
tags: ["agent", "template", "custom"]
last_updated: "2026-07-28"
audience: "users"
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

- [#templates](#templates) — Default prompts and reusable templates
- [#tools](#tools) — Available tools and service integrations
- [Agent System](000-index.md) — All agent documentation
- [A2A Agents Guide](../guides/001-agents.md) — Agent configuration and management
- [Custom Agent Creation Guide](../guides/001-agents.md#5-custom-agent-creation)

---


## Templates


## Default System Prompt

```
You are the {Agent Name} Agent of Open Knowledge Studio. {Full system prompt describing expertise, behavior, and constraints}.
```

## Usage

- The **Default System Prompt** is loaded automatically when the agent is activated in an A2A debate.
- Customize the prompt to define the agent's expertise, response style, and any constraints or guidelines.


## Workflow Patterns


Define your custom agent's workflow patterns here. Common patterns include:

## Standalone Response

The agent responds directly to user prompts based on its system prompt without delegating.

## Multi-Agent Collaboration

The agent participates in orchestrated or sequential workflows coordinated by the Coordinator.

See [Multi-Agent Workflows](../guides/002-workflows.md) for detailed patterns.


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
