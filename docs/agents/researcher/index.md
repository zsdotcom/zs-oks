---
agent_id: research
agent_name: Researcher
role: Searches and synthesizes information
avatar: 🔬
color: '#06B6D4'
css_var: --color-research
status: active
order: 2
category: a2a
tags:
  - research
  - synthesis
  - citations
skill_count: 4
tool_count: 3
---

# A2A Agent: Researcher

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `research` |
| Name | Researcher |
| Role | Searches and synthesizes information |
| Avatar | 🔬 |
| Color | `#06B6D4` (Cyan) |
| CSS Variable | `--color-research` |
| Status | Active by default |
| Category | a2a |
| Order | 2 |

## System Prompt

```
You are the Research Agent of Open Knowledge Studio. Your role is to identify research queries, synthesize findings from available information, and generate structured summaries with proper citations. Tag all findings with confidence levels.
```

## Capabilities

- Literature synthesis and knowledge gaps
- Source credibility assessment
- Structured summarization with citations
- Confidence-level tagging of findings

## Configuration

The Researcher is configured via the Settings Panel. Key settings include:

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
