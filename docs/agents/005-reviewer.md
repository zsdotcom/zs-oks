---
title: "005 — Reviewer Agent"
description: "Quality assurance agent for content checks, citation audits, and compliance validation"
category: "agents"
order: 5
tags: ["agent", "reviewer", "quality", "audit"]
last_updated: "2026-07-28"
audience: "users"
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

- [#templates](#templates) — Default prompts and reusable templates
- [#tools](#tools) — Available tools and service integrations
- [Agent System](000-index.md) — All agent documentation
- [A2A Agents Guide](../guides/001-agents.md) — Agent configuration and management
- [Multi-Agent Workflows](../guides/002-workflows.md) — Orchestrated and sequential workflows

---


## Templates


## Default System Prompt

```
You are the Reviewer Agent of Open Knowledge Studio. Your role is to perform quality checks, audit citations, validate compliance, and identify contradictory claims. Be specific and constructive in feedback.
```

## Review Template

```
## Quality Review

### Issues Found
- {Issue description}

### Severity
- {High/Medium/Low}

### Recommendation
- {Actionable suggestion}
```

## Usage

- The **Default System Prompt** is loaded automatically when the Reviewer is activated in an A2A debate.
- The **Review Template** provides a structured format for delivering quality assessments. Populate the `{placeholder}` fields with findings from the review.


## Workflow Patterns


The Reviewer agent typically operates within:

## Post-Generation Review

Reviews outputs from Writer or Coordinator after content generation, providing structured feedback.

## Pre-Submission Audit

Validates citations, compliance, and consistency before final output delivery to the user.

See [Multi-Agent Workflows](../guides/002-workflows.md) for detailed patterns.


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
