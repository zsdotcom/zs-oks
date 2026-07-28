---
title: "017 — Documentation Analysis & Management Agent"
description: "Comprehensive documentation analysis, web research, content creation/update, progress tracking, and GitHub Pages publishing agent"
category: "agents"
order: 17
tags: ["agent", "docs-manager", "documentation", "analysis", "publishing"]
last_updated: "2026-07-28"
audience: "users"
---

# 017 — Documentation Analysis & Management Agent

## Overview

The Documentation Analysis & Management Agent is a specialized agent that comprehensively manages the entire `/docs` folder lifecycle. It performs deep documentation audits, web researches for best practices and open-source resources, plans improvements, executes documentation updates with real-time progress tracking, verifies correctness through the full CI pipeline, and publishes to GitHub Pages.

This agent is implemented as an OpenCode skill at `.opencode/skills/docs-manager/SKILL.md` and can be loaded via the `/skill docs-manager` command.

## Capabilities

| Capability | Description |
|------------|-------------|
| **Deep Audit** | Analyzes every file in `/docs` for frontmatter, footers, broken links, stale content, consistency |
| **Feature Mapping** | Cross-references documented features against actual source code to find gaps |
| **Web Research** | Searches for best practices, open-source tools, integrations, and competitor patterns |
| **Prioritized Planning** | Creates dependency-ordered checklists (P0-P3) for systematic execution |
| **Real-Time Tracking** | Updates `docs/_progress/PROGRESS.md` after every significant action |
| **Batch Execution** | Processes files in dependency order with link validation after every edit |
| **Full CI Verification** | Runs typecheck, tests, and build before marking work complete |
| **GitHub Pages Publishing** | Handles the full commit/push/publish workflow (with user approval) |

## 6-Phase Workflow

### Phase 0: Load
On activation, reads current progress state and asks the user for scope:
- Full run (Phases 1-6)
- Resume from checkpoint
- Specific task
- Quick audit only
- Checklist review

### Phase 1: Analyze
Reads and catalogs every `.md` file in `/docs`. For each file, checks:
- Frontmatter validity
- Footer presence
- Content accuracy vs. actual app features (in `src/`)
- Broken internal links
- Outdated information
- Cross-references
- Consistency with style guide
- Completeness

### Phase 2: Research
Uses web search to discover:
- Documentation best practices and patterns
- Open-source documentation tools
- Mermaid/Diagram-as-code tools
- GitHub Pages enhancement options
- Accessibility and i18n documentation tools
- API documentation best practices
- Integration opportunities (free APIs, MCP servers, CDN libraries)
- Competitor documentation inspirations

### Phase 3: Plan
Generates a prioritized checklist (`docs/_progress/CHECKLIST.md`) with:
- P0: Critical blocking issues
- P1: High priority (content accuracy, missing frontmatter)
- P2: Medium priority (new content, diagrams, cross-references)
- P3: Low priority / nice to have

### Phase 4: Execute
Processes checklist items one at a time with:
- Read → Plan → Edit → Verify → Mark Complete cycle
- Real-time progress updates to `docs/_progress/PROGRESS.md`
- Batch processing rules (fix all occurrences of a pattern)
- Standards enforcement (frontmatter schema, footer format, link format)

### Phase 5: Verify
Runs automated checks and manual review:
- Link checker (grep for broken patterns)
- Frontmatter presence check
- Footer presence check
- Cross-reference resolution
- Full CI pipeline: `npm run typecheck && npm test && npm run build`

### Phase 6: Publish
With user approval:
- Commits all changes
- Pushes to GitHub
- Verifies CI passes and GitHub Pages updates
- Writes session summary

## Progress Tracking

All progress is tracked in the `docs/_progress/` directory:

| File | Purpose |
|------|---------|
| `PROGRESS.md` | Real-time activity log and phase status |
| `CHECKLIST.md` | Prioritized action items with completion status |
| `ANALYSIS.md` | Deep audit findings per section |
| `RESEARCH.md` | Web research findings and resource catalog |

## Usage

To invoke this agent in OpenCode:

```
/skill docs-manager
```

Or to invoke for a specific task:

```
/skill docs-manager
> Just run a quick audit (Phase 1 only)
```

## Standards Enforced

- **Frontmatter:** YAML with title, description, category, order, tags, last_updated, audience
- **Footer:** Standardized project identity footer
- **Links:** Relative paths, verified to resolve
- **Diagrams:** Mermaid for architecture/flow, KaTeX for math, alt text required
- **Cross-references:** Bidirectional linking between related documents
- **Dates:** Always updated to current date on modification

## Related

- [OpenCode Skill Definition](../../.opencode/skills/docs-manager/SKILL.md) — Full implementation
- [Documentation Operations](../operations/000-docs-ci-cd.md) — Publishing pipeline
- [Documentation Style Guide](../operations/001-docs-style-guide.md) — Markdown conventions
- [Master Documentation Index](../index.md) — All documentation
- [AI Documentation Index](../llms.txt) — Machine-readable index

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
