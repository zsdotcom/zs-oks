---
agent_id: data
agent_name: Data Analyst
role: Processes data and generates statistics
avatar: 📊
color: '#F59E0B'
css_var: --color-data
status: active
order: 3
category: a2a
tags:
  - data
  - statistics
  - visualization
skill_count: 4
tool_count: 2
---

# Data Analyst — Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | Data analysis and visualization generation | user |
| executeCode | src/services/sandboxService.ts | Run JS data processing in sandbox | user |

## Integration

These tools integrate with the sandboxed execution environment. See:

- [Sandboxed Execution Guide](../../../guides/094-sandbox.md) — Secure code execution
- [Gemini Service](../../../developers/004-development.md) — LLM provider architecture

---

*Back to [Data Analyst SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
