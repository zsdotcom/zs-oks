---
title: "001 — Coordinator Agent"
description: "Workflow orchestration agent that manages task decomposition, delegation, and validation"
category: "agents"
order: 1
tags: ["agent", "coordinator", "orchestration"]
last_updated: "2026-07-28"
audience: "users"
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

## Skills

| Skill | Description | Triggers | Priority |
| :--- | :--- | :--- | :--- |
| Task Decomposition | Break complex requests into manageable sub-tasks | Complex multi-step user request | high |
| Workflow Orchestration | Plan and sequence multi-agent workflows | Task requiring multiple specialist agents | high |
| Delegation | Assign sub-tasks to appropriate specialist agents | Identified sub-task requiring specific expertise | high |
| Output Validation | Verify completeness, coherence, and quality of agent responses | Agent task completion | medium |
| Progress Tracking | Monitor and report on workflow status | Active multi-step workflow | medium |

## Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | Decompose tasks via LLM call | user |
| runOrchestratedWorkflow | src/services/geminiService.ts | Execute parallel agent workflow | user |
| runSequentialWorkflow | src/services/geminiService.ts | Execute chain-of-agents workflow | user |

## Configuration

The Coordinator is configured via the Settings Panel. Key settings include:

- **System Prompt** — Customize the base instructions
- **Active/Inactive** — Toggle participation in A2A debates
- **Memory Type** — Choose between session, persistent, or full memory

## Related Documentation

- [#templates](#templates) — Default prompts and reusable templates
- [#tools](#tools) — Available tools and service integrations
- [Agent System](000-index.md) — All agent documentation
- [A2A Agents Guide](../guides/001-agents.md) — Agent configuration and management
- [Multi-Agent Workflows](../guides/002-workflows.md) — Orchestrated and sequential workflows
- [Memory Architecture](../developers/005-memory-architecture.md) — 6-tier memory with vector embeddings

---


## Templates


## Default System Prompt

```
You are the Coordinator Agent of Open Knowledge Studio. Your role is to receive user requests and analyze their complexity. If the task is simple, handle it directly. If the task is complex, decompose it into sub-tasks and delegate to the appropriate specialized agents. Monitor progress and validate outputs before presenting to the user.
```

## Orchestrated Workflow Decomposition Prompt

```
Analyze the following user request and decompose it into sub-tasks.
For each sub-task, specify:
- agentId: The specialist agent best suited for this task
- subTask: A clear description of what needs to be done
- rationale: Why this agent was chosen

Return the result as a valid JSON array of {agentId, subTask, rationale} objects.
```

## Usage

- The **Default System Prompt** is loaded automatically when the Coordinator is activated in an A2A debate.
- The **Orchestrated Workflow Decomposition Prompt** is used by the `runOrchestratedWorkflow` function in `geminiService.ts` to decompose complex requests.


## Workflow Patterns


The Coordinator agent manages two primary workflow types:

## Orchestrated Workflow (Parallel)

Multiple agents work simultaneously on different sub-tasks. The Coordinator decomposes the request, dispatches sub-tasks in parallel, then aggregates results.

## Sequential Workflow (Chain)

Agents work in sequence, where each agent's output feeds into the next. Used for dependent tasks that require step-by-step processing.

See [Multi-Agent Workflows](../guides/002-workflows.md) for detailed patterns.


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
