# Documentation Analysis Report

**Date:** 2026-07-29
**Scope:** All 97 `.md` files in `docs/` (excluding `_data/` and `_progress/`)
**Method:** Automated checks (frontmatter, footer, broken links) + manual reading + source code cross-reference

---

## Executive Summary

The documentation is in **good shape overall** — the major systematic issues (200+ broken links, 20 H1 heading mismatches, frontmatter gaps) have been resolved. However, **12 specific issues remain**, concentrated in 3 areas: stale stats in 3 files, 3 missing H1 prefixes in newer guides, and 6 missing footers in newer agent docs.

---

## 1. Issues Found

### 1.1 Stale Statistics (4 files, 7 occurrences)

| File | Line | What It Says | Should Be |
|------|------|-------------|-----------|
| `project/004-architecture.md` | 34 | `geminiService - 6 Providers` | 10 Providers |
| `project/004-architecture.md` | 68 | `LLM --> Providers{6 AI Providers}` | 10 AI Providers |
| `project/004-architecture.md` | 137 | `test/ — 74 tests across 6 files` | 227 tests across 14 files |
| `developers/001-setup.md` | 205 | `6 files, 74 tests` | 14 files, 227 tests |
| `developers/004-development.md` | 141 | `all 74 tests passing` | all 227 tests passing |
| `developers/004-development.md` | 161 | `All 74 tests across 6 files` | All 227 tests across 14 files |

The `changelog/000-changelog.md` also mentions "6-agent" and "6-provider" but these are historically accurate entries describing what changed in v2.0.0 — they should NOT be updated.

### 1.2 Missing H1 Serial Number Prefix (3 files)

| File | Order | Current H1 | Should Be |
|------|-------|-----------|-----------|
| `guides/011-google-oauth-setup.md` | 11 | `# Google OAuth Setup Guide` | `# 011 — Google OAuth Setup Guide` |
| `guides/012-bd-health-system.md` | 12 | `# Bangladesh Digital Health Ecosystem` | `# 012 — Bangladesh Digital Health Ecosystem` |
| `guides/013-bd-core-fhir.md` | 13 | `# BD Core FHIR IG Integration` | `# 013 — BD Core FHIR IG Integration` |

### 1.3 Missing Standard Footer (6 files)

These 6 agent files have a short custom footer instead of the full standardized footer:

| File | Current Footer |
|------|---------------|
| `agents/018-security-analyst.md` | `_Built-in A2A agent of Open Knowledge Studio v2.0._` |
| `agents/019-code-reviewer.md` | `_Built-in A2A agent of Open Knowledge Studio v2.0._` |
| `agents/020-planner.md` | `_Built-in A2A agent of Open Knowledge Studio v2.0._` |
| `agents/021-tester.md` | `_Built-in A2A agent of Open Knowledge Studio v2.0._` |
| `agents/022-code-generator.md` | `_Built-in A2A agent of Open Knowledge Studio v2.0._` |
| `agents/023-knowledge-curator.md` | `_Built-in A2A agent of Open Knowledge Studio v2.0._` |

### 1.4 Broken Links (1 issue)

| Source File | Line | Link | Issue |
|-------------|------|------|-------|
| `index.md` | 30 | `../operations/000-docs-ci-cd.md` | Should be `operations/000-docs-ci-cd.md` (no `../`) — the `../` makes it resolve relative to repo root instead of `docs/` |

---

## 2. What's Working Well

- **Frontmatter**: All 101 content files have valid YAML frontmatter ✓
- **H1 headings**: 94 of 97 files have correct H1 serial numbers matching frontmatter ✓
- **Links**: Only 1 broken link found across 1159 links checked ✓
- **Footer**: 91 of 97 content files have the standard footer ✓
- **Stats accuracy**: Most files have correct agent counts (12), provider counts (10), test counts (227)
- **Onboarding journey**: Complete 14-step walkthrough, well-structured
- **Non-coder guide**: Excellent click-by-click instructions for absolute beginners
- **Master index** (`docs/index.md`): Comprehensive, well-organized

---

## 3. Previously Fixed Issues (No Longer Present)

The following issues from earlier analysis rounds have been resolved and are confirmed clean:
- H1 heading mismatches in `docs/developers/` (all 12 files) ✓
- H1 heading mismatches in `docs/guides/001-010` (first 10 guides) ✓
- Stale "6 agents" counts across project/ and guides/ files ✓
- Missing frontmatter fields in security/, architecture/, api/ indexes ✓
- Broken links caused by filename/heading mismatches (~200 links) ✓
- Footer issues in `docs/404.md` ✓

---

## Methodology

1. **Automated checks**: Frontmatter presence (grep), footer presence (grep for `zs-oks`), link resolution (regex extraction + file existence check)
2. **Manual reading**: Key files read in full
3. **Cross-reference**: Stats checked against `docs/_data/variables.yml` and `AGENTS.md`
4. **Source code check**: Agent count, provider count, test count verified against `AGENTS.md`
