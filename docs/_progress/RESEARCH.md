# Documentation Research Findings

**Generated:** 2026-07-29
**Status:** Complete

---

## Research Topics

| # | Topic | Status | Findings |
|---|-------|--------|----------|
| 1 | Automated link checking in CI | ✅ Complete | See below |
| 2 | Docs-as-code best practices | ✅ Complete | See below |
| 3 | Documentation freshness tooling | ✅ Complete | See below |

---

## Key Findings

### 1. Automated Link Checking — GitHub Actions

**Best option: `tcort/github-action-markdown-link-check`**
- GitHub Action that checks all markdown links on push/PR
- Supports quiet mode, verbose mode, config file exclusions
- Can run on schedule
- Easy to add to existing `.github/workflows/`

**Alternative: `linklint` (npx)**
- Internal-only link checking (no network)
- Checks anchors, cross-file links, images
- Runs locally, no CI needed
- Good for pre-commit checks

### 2. Docs-as-Code Best Practices

Key patterns for keeping docs in sync with code:
1. **Version control**: Docs live in same repo as code (already done ✓)
2. **PR reviews for docs**: Treat doc changes like code changes
3. **CI gate for links**: Auto-check links on every PR
4. **Frontmatter TTL**: Per-page "review by" dates to prevent staleness
5. **Source mapping**: Map doc pages to source files they reference

### 3. Documentation Freshness Tools

- **`docfresh`**: Maps docs to source files, uses git history to detect staleness
- **Frontmatter TTL contracts**: Each page declares its own shelf life
- **Symbol-level drift**: Detect when referenced functions/classes change

---

## Recommendations for This Project

| Recommendation | Priority | Effort | Impact |
|---------------|----------|--------|--------|
| Add `markdown-link-check` GitHub Action to CI | Medium | Small (copy workflow) | Prevents future broken links |
| Standardize `audience` field across frontmatter | Low | Medium | Better categorization |
| Add `ttl_days` or `last_reviewed` to frontmatter | Low | Large | Freshness tracking |

---

## Resource Catalog

| Resource | URL | Description | Integration Potential | Priority | Effort |
|----------|-----|-------------|----------------------|----------|--------|
| markdown-link-check Action | https://github.com/tcort/github-action-markdown-link-check | GitHub Action for checking markdown links | Add to CI workflow to prevent broken link regressions | Medium | Small |
| linklint | https://github.com/didrod205/linklint | Internal-only link checker, no network | Pre-commit hook for local link validation | Low | Medium |
| docfresh | https://github.com/os-tack/docfresh | Track doc freshness against source files | Track which source files each doc references | Low | Large |
