---
title: "004 — Writer Agent"
description: "Document drafting agent for applying templates, formatting, and content generation"
category: "agents"
order: 4
tags: ["agent", "writer", "documentation"]
last_updated: "2026-07-28"
audience: "users"
---

# A2A Agent: Writer

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `writer` |
| Name | Writer |
| Role | Drafts documents and formats outputs |
| Avatar | ✍️ |
| Color | `#10B981` (Emerald) |
| CSS Variable | `--color-writer` |
| Status | Active by default |
| Category | a2a |
| Order | 4 |

## System Prompt

```
You are the Writer Agent of Open Knowledge Studio. Your role is to draft documents from structured data, apply templates, format outputs, and maintain consistent formatting. Ensure all claims are backed by evidence.
```

## Capabilities

- Document structure and formatting
- Template application and customization
- Evidence-backed claim construction
- Consistency and readability

## Skills

| Skill | Description | Triggers | Priority |
| :--- | :--- | :--- | :--- |
| Document Drafting | Create structured documents from data | Structured input or outline | high |
| Template Application | Apply formatting templates consistently | Document creation request | high |
| Evidence-Based Writing | Ensure all claims are backed by evidence | Claim or assertion in draft | high |
| Formatting | Maintain consistent style, tone, and structure | Output generation | medium |

## Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | Document generation via LLM | user |
| exportToPDF | src/components/WorkspaceDocumentEditor.tsx | PDF export | user |

## Configuration

The Writer is configured via the Settings Panel. Key settings include:

- **System Prompt** — Customize the base instructions
- **Active/Inactive** — Toggle participation in A2A debates
- **Memory Type** — Choose between session, persistent, or full memory

## Related Documentation

- [#templates](#templates) — Default prompts and reusable templates
- [#tools](#tools) — Available tools and service integrations
- [Agent System](000-index.md) — All agent documentation
- [A2A Agents Guide](../guides/001-agents.md) — Agent configuration and management
- [Multi-Agent Workflows](../guides/002-workflows.md) — Orchestrated and sequential workflows
- [PDF Export Guide](../guides/093-pdf-export.md) — Client-side PDF generation

---


## Templates


## Default System Prompt

```
You are the Writer Agent of Open Knowledge Studio. Your role is to draft documents from structured data, apply templates, format outputs, and maintain consistent formatting. Ensure all claims are backed by evidence.
```

## Document Template

```markdown
# {Title}

**Author:** {Agent Name}
**Date:** {Date}
**Status:** Draft

## Executive Summary
{Summary}

## Key Findings
{Findings}

## Recommendations
{Recommendations}

## References
{References}
```

## Usage

- The **Default System Prompt** is loaded automatically when the Writer is activated in an A2A debate.
- The **Document Template** provides a reusable structure for generating reports, summaries, and briefs. Fill in the `{placeholder}` fields with relevant content.


## Workflow Patterns


The Writer agent typically operates within:

## Document Generation Pipeline

Research data structured into formatted documents using templates, with evidence-backed claims.

## Collaborative Editing

Receives reviewed content from Reviewer, incorporates feedback, and produces final output.

See [Multi-Agent Workflows](../guides/002-workflows.md) for detailed patterns.


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
