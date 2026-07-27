---
title: "000 — Documentation Publishing Pipeline"
category: "ops"
order: 0
tags: ["docs", "ci-cd", "github-pages", "docsify", "vitepress", "publishing"]
last_updated: "2026-07-27"
---

# 000 — Documentation Publishing Pipeline

## Strategy Overview

This document outlines the strategy for publishing the `docs/` directory as a browsable static documentation site. No pipeline is currently implemented — this document is the plan.

## Option Comparison

### Option 1: GitHub Pages (same deployment)

The [existing GitHub Pages deployment](../developers/098-cicd-pipeline.md) already copies `docs/` into the build artifact:

```yaml
- name: Copy documentation for docs viewer
  run: cp -r docs dist/docs
```

This makes documentation accessible at `https://{org}.github.io/open-knowledge-studio/docs/` without any additional tooling. The user navigates via file listing — no sidebar, no search, no theming.

**Pros:** Zero additional setup; already partially implemented.
**Cons:** No navigation chrome, search, or mobile-optimized reading experience; raw Markdown unless an index page is crafted.

### Option 2: Docsify (Recommended)

[Docsify](https://docsify.js.org/) is a zero-build documentation site generator that renders Markdown files client-side. It consists of a single `index.html` entry point served alongside the existing Markdown files.

**Configuration file:** `docs/index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Open Knowledge Studio — Docs</title>
  <link rel="stylesheet"
    href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css">
</head>
<body>
  <div id="app"></div>
  <script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
  <script src="//cdn.jsdelivr.net/npm/docsify@4/lib/plugins/search.min.js"></script>
  <script>
    window.$docsify = {
      name: 'Open Knowledge Studio',
      repo: 'https://github.com/anomalyco/open-knowledge-studio',
      basePath: '/open-knowledge-studio/docs/',
      search: 'auto',
      loadSidebar: '_sidebar.md',
      loadNavbar: '_navbar.md',
      coverpage: '_coverpage.md',
      maxLevel: 4,
      subMaxLevel: 2,
    };
  </script>
</body>
</html>
```

**Pros:** Zero build step; Markdown files remain the source of truth; full-text search; sidebar navigation; themable; CDN-loaded (no npm dependency).
**Cons:** Client-side rendering; SEO crawlers see empty page unless prerendered.

### Option 3: VitePress

[VitePress](https://vitepress.dev/) is a Vue-powered static site generator that compiles Markdown into pre-rendered HTML. It produces a full static site with excellent performance and SEO.

**Pros:** Static HTML (SEO-friendly); fast navigation; built-in search; beautiful default theme.
**Cons:** Adds a build step; requires installing `vitepress` as a dev dependency; not aligned with the zero-dep philosophy of the main app.

## Recommendation: Docsify

Docsify is recommended because:

- **Zero build step** — No additional npm dependency; docs are served as-is
- **Single `index.html`** — Drop into `docs/` and it works
- **CDN-loaded** — Consistent with the project's CDN loading pattern for KaTeX, Mermaid, and Leaflet
- **Search plugin** — Full-text search over all Markdown files
- **Sidebar** — Auto-generated or custom sidebar via `_sidebar.md`
- **Existing Markdown** — No need to rewrite or convert existing docs

## Configuration Plan

### Required Files in `docs/`

| File | Purpose |
|------|---------|
| `index.html` | Docsify entry point (single HTML file) |
| `_sidebar.md` | Sidebar navigation definition |
| `_coverpage.md` | Optional landing page cover |
| `_navbar.md` | Optional top navigation bar |

### GitHub Actions Integration

Add a docs deployment job to `deploy.yml` or create a separate workflow:

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'

jobs:
  deploy-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload docs artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

## No Current Implementation

This document serves as the plan. No Docsify configuration files, VitePress setup, or separate deployment workflow has been created. Implementation will proceed when there is demand for a proper docs browsing experience beyond the raw Markdown files.

## See Also

- [CI/CD Pipeline](../developers/098-cicd-pipeline.md) — Existing build and deploy workflow
- [Deployment Guide](../developers/099-deployment.md) — Docker, Vercel, Netlify deployment options
- [Documentation Style Guide](010-docs-style-guide.md) — Markdown and frontmatter conventions
