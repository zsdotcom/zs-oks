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
type: a2a-agent
tags:
  - quality
  - review
  - audit
skills:
  - quality-auditing
  - citation-verification
  - compliance-checking
  - contradiction-detection
  - constructive-feedback
tools:
  - queryLLM
references: [TEMPLATES.md, TOOLS.md]
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

## Skills

| Skill | Description | Triggers | Priority |
| :--- | :--- | :--- | :--- |
| Quality Auditing | Verify outputs against requirements | Completed document or response | high |
| Citation Verification | Check source credibility and accuracy | Citation or reference detected | high |
| Compliance Checking | Validate against standards and guidelines | Regulatory or standards context | high |
| Contradiction Detection | Identify inconsistent or conflicting claims | Multiple claims or sources | medium |
| Constructive Feedback | Provide specific, actionable improvement suggestions | Issue or error identified | medium |

## Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | Generate quality review via LLM | user |

## Configuration

The Reviewer is configured via the Settings Panel. Key settings include:

- **System Prompt** — Customize the base instructions
- **Active/Inactive** — Toggle participation in A2A debates
- **Memory Type** — Choose between session, persistent, or full memory

## Related Documentation

- [references/TEMPLATES.md](references/TEMPLATES.md) — Default prompts and reusable templates
- [references/TOOLS.md](references/TOOLS.md) — Available tools and service integrations
- [Agent System](../SKILL.md) — All agent documentation
- [A2A Agents Guide](../../guides/060-agents.md) — Agent configuration and management
- [Multi-Agent Workflows](../../guides/091-workflows.md) — Orchestrated and sequential workflows

---

*Back to [Agent System](../SKILL.md) | [Documentation Home](../../index.md)*
