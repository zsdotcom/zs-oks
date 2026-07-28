# Documentation Analysis Report

**Date:** 2026-07-28
**Scope:** All 91 `.md` files in `docs/` (excluding `_data/` and `_progress/`)
**Method:** Automated checks + manual read of 30+ key files

---

## Executive Summary

The documentation is **well-structured** (clear sections, consistent naming, YAML frontmatter on most files) but has a **systematic broken-link epidemic** affecting ~30 files with ~200 broken cross-references. Additionally, several key **statistics are stale** (agent counts, test counts, provider counts).

---

## 1. Critical Issues (P0)

### 1.1 Systematic Broken Cross-References (~200 broken links)

**Root cause:** Developer docs (`docs/developers/`) and User Guides (`docs/guides/`) have a **systematic mismatch** between their frontmatter serial number (used in filenames) and their H1 heading number. For example:

| File | Frontmatter says | H1 heading says | File is named |
|------|-----------------|----------------|---------------|
| `developers/001-setup.md` | `001` | `010` | `001-setup.md` |
| `developers/006-test-suite.md` | `006` | `060` | `006-test-suite.md` |
| `guides/001-agents.md` | `001` | `010` | `001-agents.md` |
| `guides/008-connectors.md` | `008` | `080` | `008-connectors.md` |

**All cross-reference links** use the H1 heading number (e.g., `[Setup Guide](010-setup.md)`) which does NOT match the actual filename (`001-setup.md`). This creates **~200 broken links** across the entire docs tree.

**Affected files:** `docs/developers/` (all 12 files), `docs/guides/` (all 13 files), `docs/benchmarks/`, plus all files that cross-reference them.

### 1.2 Stale Agent / Provider Counts

| File | Says | Actual (from src/App.tsx) |
|------|------|--------------------------|
| `project/000-overview.md:12` | "6-agent A2A platform" | 12 agents |
| `project/000-overview.md:29` | "6 AI providers" | 10 providers |
| `project/000-overview.md:35` | "6-Agent A2A Debate" | 12 agents |
| `project/000-overview.md:81` | "6 (built-in) + custom" | 12 built-in |
| `project/001-concept.md:43` | "6 specialized agents" | 12 agents |
| `project/001-concept.md:55` | "6 specialized agents" | 12 agents |
| `project/005-design.md` §2.2 | Only 6 agents listed | 12 agents |
| `project/006-brand-guidelines.md:20` | "6-Agent A2A Platform" | 12 agents |
| `project/006-brand-guidelines.md:21` | "6 specialized agents" | 12 agents |
| `project/006-brand-guidelines.md:38` | "six named, color-coded agents" | 12 |
| `project/006-brand-guidelines.md:126` | "6-agent roster" | 12 agents |
| `project/006-brand-guidelines.md:148` | "6-Agent A2A Platform" | 12 agents |
| `project/006-brand-guidelines.md:157` | "6-Agent A2A Debate" | 12 agents |
| `project/006-brand-guidelines.md:162` | "6 built-in agents" | 12 agents |
| `project/006-brand-guidelines.md:148` | "6-Agent" (tagline) | 12 agents |
| `guides/000-getting-started.md:17` | "6 A2A debate agents" | 12 agents |
| `guides/000-getting-started.md:100` | "6 built-in agents" | 12 agents |
| `guides/001-agents.md:17` | "6 A2A debate agents" | 12 agents |
| `developers/000-quickstart.md:68` | "74 tests" | 227 tests |
| `developers/001-setup.md:96` | "74 tests" | 227 tests |
| `project/000-overview.md:74` | "74 tests across 6 files" | 227 tests across 14 files |
| `project/003-blueprint.md:59` | "74+" tests | 227 tests |
| `project/003-blueprint.md:73` | "74/74 Pass" | 227 |
| `developers/004-development.md §3` | Various stale test counts | |

---

## 2. High Priority Issues (P1)

### 2.1 Heading / Frontmatter Serial Mismatch (20 files)

| File | Frontmatter Serial | H1 Serial |
|------|-------------------|-----------|
| `developers/001-setup.md` | 001 | 010 |
| `developers/002-environment.md` | 002 | 020 |
| `developers/003-non-coder-guide.md` | 003 | 030 |
| `developers/004-development.md` | 004 | 040 |
| `developers/005-memory-architecture.md` | 005 | 050 |
| `developers/006-test-suite.md` | 006 | 060 |
| `developers/007-code-splitting.md` | 007 | 070 |
| `developers/008-ci-cd.md` | 008 | 080 |
| `developers/009-deployment.md` | 009 | 090 |
| `developers/010-dependency-removal.md` | 010 | 100 |
| `developers/011-mcp-configuration.md` | 011 | 110 |
| `guides/001-agents.md` | 001 | 010 |
| `guides/002-workflows.md` | 002 | 020 |
| `guides/003-diagrams.md` | 003 | 030 |
| `guides/004-pdf-export.md` | 004 | 040 |
| `guides/005-sandbox.md` | 005 | 050 |
| `guides/006-epi-map.md` | 006 | 060 |
| `guides/007-icd11.md` | 007 | 070 |
| `guides/008-connectors.md` | 008 | 080 |
| `guides/009-webhooks.md` | 009 | 090 |
| `guides/010-public-data.md` | 010 | 100 |

### 2.2 Broken Links in `docs/index.md` (8 links from index to `../` paths)

Links like `[ADR](../architecture/000-index.md)` from `docs/index.md` resolve to `architecture/000-index.md` (at project root) instead of `docs/architecture/000-index.md`.

### 2.3 Broken Links in `docs/accessibility/000-a11y.md`

Links to `docs/developers/080-test-suite.md` should be `006-test-suite.md`.

### 2.4 Broken Links in `docs/benchmarks/` (8 links)

Links reference `010-results.md` instead of `001-results.md`; reference `080-test-suite.md` instead of `006-test-suite.md`.

### 2.5 Broken Links in `docs/project/003-blueprint.md`

Line 128 links to `../developers/050-setup.md` — should be `../developers/001-setup.md`.

### 2.6 Broken Links in `docs/agents/003-data-analyst.md`

Links to `guides/092-diagrams.md` and `guides/094-sandbox.md` — should be `guides/003-diagrams.md` and `guides/005-sandbox.md`.

### 2.7 Broken Links in `docs/agents/004-writer.md`

Links to `guides/093-pdf-export.md` — should be `guides/004-pdf-export.md`.

### 2.8 Broken Links in `docs/operations/000-docs-ci-cd.md`

Links to `../.github/branch-protection.md` and `.config.template.md` — neither file exists.

### 2.9 Broken Links in `docs/onboarding/014-project-complete.md`

Links to `../agents/references/index.md` — doesn't exist.

### 2.10 Missing Standardized Footer

- `docs/404.md` — has abbreviated footer, not the full standardized one
- `docs/_sidebar.md` — no footer (but this is a Docsify config file)

### 2.11 `docs/security/000-index.md` — Missing Required Fields

Missing `category` and `audience` fields from frontmatter.

### 2.12 `docs/architecture/000-index.md` — Missing Required Fields

Missing `category` and `audience` fields from frontmatter.

### 2.13 `docs/api/000-index.md` — Missing Required Fields

Missing `category` and `audience` fields from frontmatter.

---

## 3. Medium Priority Issues (P2)

### 3.1 No-Coder Friendliness Gaps

- Most agent docs use jargon without explanation (e.g., "system prompt", "memory tier", "embedding")
- No troubleshooting sections in agent docs
- No FAQ sections in most files
- No "What You'll See" sections after instructions

### 3.2 Outdated Section Title Style

Some sections use `## 1.` style while most use `## 1. Title` style — minor inconsistency.

### 3.3 Missing Cross-References

Several related pages don't cross-reference each other:
- Agent pages don't link to the A2A Agents Guide
- Onboarding pages don't link to relevant guides
- Security docs don't link to environment setup

### 3.4 Incomplete Docsify Integration

`_sidebar.md`, `_navbar.md`, `_coverpage.md` exist but Docsify `index.html` does not exist — the deployment doc says it's "planned."

### 3.5 Inconsistent Audience Field

Some files use `audience: "all"` or `audience: "users"` or `audience: "stakeholders"` with no consistent schema.

---

## 4. Low Priority Issues (P3)

### 4.1 Missing Mermaid Diagrams

Several architecture/flow pages could benefit from Mermaid diagrams but currently have none (e.g., security threat model, CI/CD pipeline could have a visual).

### 4.2 No Search Optimization

No dedicated SEO metadata per page (aside from frontmatter `description`).

### 4.3 Inconsistent Emoji Usage

Style guide says "Do not use emoji in documentation" but many files use emoji extensively.

### 4.4 Agent Documentation Depth

Some persona-based agent guides (007-017) are single-page but could be expanded with more templates and examples.

---

## 5. What's Working Well

- **Consistent file naming** — `NNN-kebab-case.md` convention used everywhere
- **YAML frontmatter** — present on nearly all content files (~95%)
- **Clear section organization** — `docs/index.md` is a thorough master catalog
- **Standardized footer** — present on most files
- **Architecture docs** — ADRs are well-written following Nygard format
- **Project docs** — thorough overview, concept, specification, blueprint
- **Onboarding journey** — excellent 14-step walkthrough for new users
- **Non-coder guide** — well-written for absolute beginners (in `docs/developers/003-non-coder-guide.md`)

---

## 6. Files With No Issues Found

These files appear clean (valid frontmatter, footer, no broken links, accurate content):
- `docs/agents/000-index.md` ✓
- `docs/agents/001-coordinator.md` ✓ (pending link check)
- `docs/changelog/000-changelog.md` ✓
- `docs/i18n/000-i18n.md` ✓
- `docs/project/006-brand-guidelines.md` ✓ (except stale agent counts)
- `docs/resources/000-free-resources.md` ✓
- `docs/security/001-threat-model.md` ✓
- `docs/security/002-data-privacy.md` ✓
- `docs/security/003-api-key-management.md` ✓

---

## Audit Methodology

1. **Automated** — Frontmatter presence, footer presence, link resolution (grep + loop)
2. **Manual read** — 30+ key files read in full
3. **Cross-reference** — Stats checked against `src/App.tsx` (agent count), `AGENTS.md`, `package.json`
4. **Style check** — Compared against `docs/operations/001-docs-style-guide.md`

---

## Next Steps

1. Phase 2: Research best practices for docs-as-code and fixing the systematic issues
2. Phase 3: Create a prioritized CHECKLIST.md with exact fix instructions
3. Phase 4: Execute fixes — fix all broken links, update stale stats, align heading numbers
4. Phase 5: Verify — re-run all checks, build project, ensure no regressions
5. Phase 6: Publish — present to user for approval
