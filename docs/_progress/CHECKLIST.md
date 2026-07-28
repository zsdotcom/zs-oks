# Documentation Master Checklist

**Generated:** 2026-07-28
**Status:** Populated after Phase 1 (Analysis) + Phase 2 (Research)

Status legend: ❌ Not started | 🔄 In progress | ✅ Complete | ➖ Not applicable

---

## P0 — Critical (Root Cause — Fix First)

These fix the root cause of ~200 broken links and make all downstream link fixes trivial.

### 0.1 Fix H1 Heading Serial Numbers (20 files)

_Align H1 headings to match frontmatter serial numbers (and therefore filenames)_

- [ ] ❌ `docs/developers/001-setup.md`: H1 `010 → 001`
- [ ] ❌ `docs/developers/002-environment.md`: H1 `020 → 002`
- [ ] ❌ `docs/developers/003-non-coder-guide.md`: H1 `030 → 003`
- [ ] ❌ `docs/developers/004-development.md`: H1 `040 → 004`
- [ ] ❌ `docs/developers/005-memory-architecture.md`: H1 `050 → 005`
- [ ] ❌ `docs/developers/006-test-suite.md`: H1 `060 → 006`
- [ ] ❌ `docs/developers/007-code-splitting.md`: H1 `070 → 007`
- [ ] ❌ `docs/developers/008-ci-cd.md`: H1 `080 → 008`
- [ ] ❌ `docs/developers/009-deployment.md`: H1 `090 → 009`
- [ ] ❌ `docs/developers/010-dependency-removal.md`: H1 `100 → 010`
- [ ] ❌ `docs/developers/011-mcp-configuration.md`: H1 `110 → 011`
- [ ] ❌ `docs/guides/001-agents.md`: H1 `010 → 001`
- [ ] ❌ `docs/guides/002-workflows.md`: H1 `020 → 002`
- [ ] ❌ `docs/guides/003-diagrams.md`: H1 `030 → 003`
- [ ] ❌ `docs/guides/004-pdf-export.md`: H1 `040 → 004`
- [ ] ❌ `docs/guides/005-sandbox.md`: H1 `050 → 005`
- [ ] ❌ `docs/guides/006-epi-map.md`: H1 `060 → 006`
- [ ] ❌ `docs/guides/007-icd11.md`: H1 `070 → 007`
- [ ] ❌ `docs/guides/008-connectors.md`: H1 `080 → 008`
- [ ] ❌ `docs/guides/009-webhooks.md`: H1 `090 → 009`
- [ ] ❌ `docs/guides/010-public-data.md`: H1 `100 → 010`

### 0.2 Fix All Cross-Reference Links Using Wrong Numbers

_After 0.1, fix all links that reference wrong-number filenames. This is a search-and-replace across ~30 files._

- [ ] ❌ `docs/developers/` — Fix all cross-references to wrong-number files
- [ ] ❌ `docs/guides/` — Fix all cross-references to wrong-number files
- [ ] ❌ `docs/benchmarks/` — Fix links to `010-results.md → 001-results.md`, `080-test-suite.md → 006-test-suite.md`
- [ ] ❌ `docs/accessibility/000-a11y.md` — Fix link to `080-test-suite.md → 006-test-suite.md`
- [ ] ❌ `docs/agents/003-data-analyst.md` — Fix links to `092-diagrams.md → 003-diagrams.md`, `094-sandbox.md → 005-sandbox.md`
- [ ] ❌ `docs/agents/004-writer.md` — Fix link to `093-pdf-export.md → 004-pdf-export.md`
- [ ] ❌ `docs/project/003-blueprint.md` — Fix link `050-setup.md → 001-setup.md`
- [ ] ❌ `docs/project/004-architecture.md` — Fix links with wrong `../` prefix
- [ ] ❌ `docs/operations/000-docs-ci-cd.md` — Fix links to non-existent files
- [ ] ❌ `docs/onboarding/014-project-complete.md` — Fix link to wrong path
- [ ] ❌ `docs/index.md` — Fix all `../`-prefixed links to use correct relative paths

---

## P1 — High Priority

### 1.1 Update Stale Agent Counts (6 → 12)

- [ ] ❌ `docs/project/000-overview.md` — Update "6-agent" → "12-agent", "6 AI providers" → "10", "6 built-in agents" → "12"
- [ ] ❌ `docs/project/001-concept.md` — Update all "6 agents" references
- [ ] ❌ `docs/project/005-design.md` §2.2 — Add all 12 agent colors/identities
- [ ] ❌ `docs/project/006-brand-guidelines.md` — Update tagline, messaging library, agent count references
- [ ] ❌ `docs/guides/000-getting-started.md` — Update "6 agents" → "12 agents"
- [ ] ❌ `docs/guides/001-agents.md` — Update roster from 6 to 12, update description

### 1.2 Update Stale Test Counts (74 → 227)

- [ ] ❌ `docs/project/000-overview.md` — Update "74 tests across 6 files" → "227 tests across 14 files"
- [ ] ❌ `docs/project/003-blueprint.md` — Update test counts and pipeline diagram
- [ ] ❌ `docs/developers/000-quickstart.md` — Update "74 tests"
- [ ] ❌ `docs/developers/001-setup.md` — Update "74 tests"
- [ ] ❌ `docs/developers/004-development.md` — Update test counts in §3
- [ ] ❌ `docs/developers/006-test-suite.md` — Already has correct 227 count ✓

### 1.3 Fix Missing/Incomplete Frontmatter

- [ ] ❌ `docs/security/000-index.md` — Add `category` and `audience` fields
- [ ] ❌ `docs/architecture/000-index.md` — Add `category`, `audience`, `last_updated` fields
- [ ] ❌ `docs/api/000-index.md` — Add `category`, `audience` fields

### 1.4 Fix Missing/Incomplete Footer

- [ ] ❌ `docs/404.md` — Replace abbreviated footer with full standardized footer
- [ ] ❌ `docs/_sidebar.md` — Add standardized footer (or document as intentional)

---

## P2 — Medium Priority

### 2.1 Add Troubleshooting Sections

- [ ] ❌ Add "Troubleshooting" sections to all agent docs (17 files)
- [ ] ❌ Add "Troubleshooting" to all guide docs
- [ ] ❌ Add FAQs to onboarding docs

### 2.2 Improve No-Coder Friendliness

- [ ] ❌ Define technical terms on first use (e.g., "system prompt", "memory tier", "embedding")
- [ ] ❁ Add "What You'll See" descriptions after setup steps
- [ ] ❌ Add plain-English summaries to top of each agent doc

### 2.3 Fix Inconsistencies

- [ ] ❌ Consistent `audience` field across all frontmatter
- [ ] ❌ Section numbering style consistency
- [ ] ❌ Emoji usage compliance with style guide

### 2.4 Improve Cross-References

- [ ] ❌ Add Related Guides / See Also links to agent docs
- [ ] ❌ Link onboarding steps to relevant guides

---

## P3 — Low Priority / Nice to Have

### 3.1 Enhancements

- [ ] ❌ Add Mermaid diagrams to security threat model doc
- [ ] ❌ Add Mermaid diagram to CI/CD pipeline doc
- [ ] ❌ Expand persona-based agent guides with more templates
- [ ] ❌ Add search metadata optimization

### 3.2 Docsify Integration

- [ ] ❌ Create `docs/index.html` for Docsify (as described in operations/000-docs-ci-cd.md)
- [ ] ❌ Test Docsify rendering locally

---

## Progress Summary

- **Total items:** ~80
- **Completed:** 0 (0%)
- **In progress:** 0
- **Not started:** ~80

---

## Cross-Cutting Concerns

- [ ] ❌ Every `.md` file has valid YAML frontmatter
- [ ] ❌ Every `.md` file has the standardized project footer
- [ ] ❌ No broken internal links
- [ ] ❌ No stale version numbers or dates
- [ ] ❌ All undocumented features in `src/` have documentation
- [ ] ❌ `docs/index.md` accurately reflects all files
- [ ] ❌ `docs/llms.txt` accurately indexes all files
- [ ] ❌ Bidirectional cross-references between related docs
- [ ] ❌ GitHub Pages publishes correctly from `/docs`
