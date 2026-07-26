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
tags:
  - template
  - custom
skill_count: 0
tool_count: 0
---

# {Agent Name} — Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | {Tool description} | user |

## Integration

This tool integrates with the core LLM routing service. See:

- [Gemini Service](../../developers/040-development.md) — LLM provider architecture
- [Development Guide](../../developers/040-development.md) — Service integration patterns

---

*Back to [Agent Index](../index.md) | [Documentation Home](../../index.md)*
