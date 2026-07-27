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

# Coordinator — Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | Decompose tasks via LLM call | user |
| runOrchestratedWorkflow | src/services/geminiService.ts | Execute parallel agent workflow | user |
| runSequentialWorkflow | src/services/geminiService.ts | Execute chain-of-agents workflow | user |

## Integration

These tools integrate with the core LLM routing service. See:

- [Gemini Service](../../../developers/004-development.md) — LLM provider architecture
- [Multi-Agent Workflows](../../../guides/091-workflows.md) — Orchestrated and sequential patterns
- [Memory Architecture](../../../developers/070-memory-architecture.md) — Agent memory context

---

*Back to [Coordinator SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
