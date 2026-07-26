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

# Reviewer — Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | Generate quality review via LLM | user |

## Integration

This tool integrates with the core LLM routing service. See:

- [Gemini Service](../../developers/040-development.md) — LLM provider architecture
- [Multi-Agent Workflows](../../guides/091-workflows.md) — Orchestrated and sequential patterns

---

*Back to [Agent Index](../index.md) | [Documentation Home](../../index.md)*
