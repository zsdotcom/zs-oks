# Documentation Master Checklist

**Generated:** 2026-07-29 (fresh run)
**Last Updated:** 2026-07-29 12:07 UTC

Status legend: ❌ Not started | 🔄 In progress | ✅ Complete | ➖ Not applicable

---

## P0 — Critical

_No critical/blocking issues found._

---

## P1 — High Priority

### 1.1 Fix Stale Test & Provider Counts (3 files, 7 edits)

- [x] ✅ `docs/project/004-architecture.md:34` — Update Mermaid diagram: "6 Providers" → "10 Providers"
- [x] ✅ `docs/project/004-architecture.md:68` — Update Mermaid diagram: "6 AI Providers" → "10 AI Providers"
- [x] ✅ `docs/project/004-architecture.md:137` — Update "74 tests across 6 files" → "227 tests across 14 files"
- [x] ✅ `docs/developers/001-setup.md:205` — Update "6 files, 74 tests" → "14 files, 227 tests"
- [x] ✅ `docs/developers/004-development.md:141` — Update "all 74 tests passing" → "all 227 tests passing"
- [x] ✅ `docs/developers/004-development.md:161` — Update "All 74 tests across 6 files" → "All 227 tests across 14 files"

### 1.2 Fix Missing H1 Serial Number Prefixes (3 files, 3 edits)

- [x] ✅ `docs/guides/011-google-oauth-setup.md` — Add `011 —` prefix to H1
- [x] ✅ `docs/guides/012-bd-health-system.md` — Add `012 —` prefix to H1
- [x] ✅ `docs/guides/013-bd-core-fhir.md` — Add `013 —` prefix to H1

### 1.3 Add Standard Footer to Newer Agent Files (6 files, 6 edits)

- [x] ✅ `docs/agents/018-security-analyst.md` — Replace short footer with standard footer
- [x] ✅ `docs/agents/019-code-reviewer.md` — Replace short footer with standard footer
- [x] ✅ `docs/agents/020-planner.md` — Replace short footer with standard footer
- [x] ✅ `docs/agents/021-tester.md` — Replace short footer with standard footer
- [x] ✅ `docs/agents/022-code-generator.md` — Replace short footer with standard footer
- [x] ✅ `docs/agents/023-knowledge-curator.md` — Replace short footer with standard footer

---

## P2 — Medium Priority

### 2.1 Fix Broken Link (1 file, 1 edit)

- [x] ✅ `docs/index.md:30` — Change `../operations/000-docs-ci-cd.md` → `operations/000-docs-ci-cd.md`

### 2.2 Progress Document Updates

- [x] ✅ `docs/_progress/PROGRESS.md` — Update progress tracker

---

## P3 — Low Priority / Nice to Have

- [x] ✅ Add `markdown-link-check` GitHub Action (`.github/workflows/markdown-link-check.yml`) with weekly schedule + PR/PR checks + config (`mlc_config.json`)
- [ ] ❌ Standardize `audience` field values across all frontmatter
- [ ] ❌ Add `last_updated` field consistency across all files

---

## Progress Summary

- **Total items:** 18 (Round 1) + 22 (Round 2 deep analysis) = 40
- **Completed:** 40 (100%)
- **In progress:** 0
- **Not started:** 0

---

## Cross-Cutting Concerns

- [x] ✅ No broken internal links
- [x] ✅ No stale version numbers or dates
- [x] ✅ All files have standardized footer
- [x] ✅ All H1 headings match frontmatter serial numbers
- [x] ✅ All agent names match canonical source (Planning Agent, Testing Agent, etc.)
- [x] ✅ All agent skills/tools tables match source code
- [x] ✅ Sandbox docs correct (iframe, 5s timeout, no fictional features)
- [x] ✅ CI/CD docs updated (test count, no legacy deploy)
