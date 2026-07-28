---
title: "000 — Documentation Publishing Pipeline"
category: "ops"
order: 0
tags: ["docs", "ci-cd", "github-pages", "docsify", "vitepress", "publishing"]
last_updated: "2026-07-27"
---

# 000 — Documentation Publishing Pipeline

## Strategy Overview

This document outlines the strategy for publishing the `docs/` directory as a browsable static documentation site.

> ✅ **Docsify `index.html` has been created** at `docs/index.html`. Deploy this alongside the existing Markdown files — no build step required. See [Usage](#usage) below.

## Option Comparison

### Option 1: GitHub Pages (same deployment)

The [existing GitHub Pages deployment](../developers/008-ci-cd.md) already copies `docs/` into the build artifact:

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
      repo: 'https://github.com/zsdotcom/zs-oks',
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
| `index.html` | ✅ Created — Docsify entry point (single HTML file) |
| `_sidebar.md` | ⬜ Not yet created — sidebar will fall back to `[**]()` links from headings |
| `_coverpage.md` | ⬜ Optional landing page cover |
| `_navbar.md` | ⬜ Optional top navigation bar |

### Usage

The `docs/index.html` is configured with:

- **Dark mode** by default (toggleable) via `docsify-dark-mode`
- **Full-text search** across all Markdown files
- **Image zoom** on click
- **Copy code** button on code blocks
- **GitHub corner** linking to the repo

To preview locally:
```bash
npx docsify serve docs/
# Opens at http://localhost:3000
```

### GitHub Actions Integration

A dedicated workflow ([`deploy-docs.yml`](https://github.com/zsdotcom/zs-oks/blob/main/.github/workflows/deploy-docs.yml)) publishes docs to GitHub Pages:

```yaml
name: Deploy Docs to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '.github/workflows/deploy-docs.yml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages-docs
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload documentation
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Implementation Status

The `deploy-docs.yml` workflow is active and configured. As soon as the repository is pushed and GitHub Pages is enabled in the repo settings, docs will automatically deploy on every push to `main` that includes doc changes. No additional Docsify, VitePress, or other static site generator is needed — GitHub Pages serves raw Markdown files directly.

## See Also

- [CI/CD Pipeline](../developers/008-ci-cd.md) — CI, app deploy, and docs deploy workflows
- [Deployment Guide](../developers/009-deployment.md) — Docker, Vercel, Netlify deployment options
- [Branch Protection](../../.github/branch-protection.md) — Branch rules and status checks
- [Infrastructure Config](../../.config.template.md) — Secret keys and external service setup (gitignored)
- [Documentation Style Guide](001-docs-style-guide.md) — Markdown and frontmatter conventions


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
