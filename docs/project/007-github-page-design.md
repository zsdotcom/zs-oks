---
title: "007 — GitHub Pages Documentation Site Design"
description: "Complete visual design plan for the Docsify-powered GitHub Pages documentation site — dark/light themes, SVG branding, responsive layout, AI accessibility"
category: "project"
order: 7
tags: ["github-pages", "docsify", "design", "docs-site", "branding"]
last_updated: "2026-07-28"
audience: "all"
---

# GitHub Pages Documentation Site — Design Plan

> **What this page shows you:** The visual design, layout, and features of the documentation website that lives at `https://zsdotcom.github.io/zs-oks/`. This is NOT the app — this is the documentation-only site for reading about the app.

---

## Quick Visual Overview

```
┌──────────────────────────────────────────────────────────┐
│  ◈ Dark/Light Toggle                          ⭐ GitHub  │  ← Navbar
├──────────┬───────────────────────────────────────────────┤
│          │                                               │
│  🔍      │  # Page Title                                 │
│  Search  │                                               │
│          │  Purple heading, clean body text,             │
│  📖      │  brand-colored code blocks                   │
│  Project │                                               │
│  📖      │  ┌─────────────────────────────────────┐      │
│  Guides  │  │ Mermaid diagrams render inline       │      │
│  📖      │  │ with full interactivity (zoom/pan)   │      │
│  Agents  │  └─────────────────────────────────────┘      │
│  📖      │                                               │
│  API     │  ## Section headings in purple                │
│  📖      │                                               │
│  More... │  Tables with purple-tinted headers            │
│          │                                               │
│  ← Sidebar →         ← Main Content →                   │
├──────────┴───────────────────────────────────────────────┤
│  Open Knowledge Studio v2.0 — MIT License        🕶️     │  ← Footer
└──────────────────────────────────────────────────────────┘
```

---

## Design Philosophy

Based on research of top documentation sites (Stripe, Vercel, Mintlify, Tailwind CSS), the best doc sites share these qualities:

| Quality | What It Means | How We Achieve It |
|---------|---------------|-------------------|
| **Effortless navigation** | Users find what they need in seconds | Collapsible sidebar with logical section grouping, sticky navbar, full-text search |
| **Readable at any size** | Works on phone, tablet, desktop | Responsive CSS with `max-width: 1000px` content area, sidebar collapses on mobile |
| **Visual clarity** | Content is the hero | Purple brand accent for headings only, muted grays for body text, code blocks on dark surfaces |
| **Diagrams come alive** | Mermaid graphs are interactive | `executeScript: true` enables Mermaid rendering, zoom-image plugin for diagrams |
| **Works in light AND dark** | User chooses their comfort | Default dark mode with one-click toggle, all colors work in both themes |
| **AI-friendly** | LLMs can read every page | `llms.txt` at site root, semantic HTML structure, clean markdown |

---

## Color Palette

### Dark Theme (Default)

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Brand Primary** | Purple | `#8B5CF6` | H1 headings, sidebar active link, link borders |
| **Brand Light** | Light Purple | `#A78BFA` | H2 headings, inline links, table headers |
| **Accent** | Cyan | `#06B6D4` | H3 headings, secondary highlights |
| **Accent Green** | Emerald | `#10B981` | H4 headings, success/positive indicators |
| **Sidebar BG** | Deep Dark | `#0f1117` | Sidebar background |
| **Sidebar Text** | Muted Gray | `#94a3b8` | Sidebar navigation items |
| **Content BG** | Near Black | `#0a0a0f` | Main content area background |
| **Code BG** | Darkest | `#0a0a0f` | Code block backgrounds |

### Light Theme

When the user switches to light mode, Docsify's built-in light theme takes over, with custom overrides keeping the brand purple for headings and links. The sidebar shifts to a clean white with subtle gray dividers.

---

## Typography

The site uses the system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) — no custom fonts needed. This means:

- **Faster loading** — no font files to download from CDN
- **Native feel** — matches the user's operating system
- **Consistent across devices** — looks right everywhere

### Heading Hierarchy

```
H1: Purple, 2em        # Page Title
H2: Light Purple, 1.5em  ## Section
H3: Cyan, 1.25em         ### Sub-section
H4: Emerald, 1.1em       #### Detail
Body: White/Gray, 1em    Normal paragraph text
Code: Amber on dark bg   `inline code` or code blocks
```

---

## Layout Structure

### Desktop (1024px+)

```
┌─────────┬──────────────────────────────────────────┐
│         │  Navbar: Home · Guides · Agents · GitHub  │
│ Sidebar │──────────────────────────────────────────│
│ 300px   │  Main Content (max 1000px)                │
│         │  ┌─────────────────────────────────┐      │
│ 🔍Search │  │  Mermaid Diagrams render here   │      │
│ 📁Sections│  │  Tables with brand styling      │      │
│   ▶Project│  │  Code blocks on dark bg         │      │
│   ▶Guides │  └─────────────────────────────────┘      │
│   ▶Agents │                                           │
│   ▶API    │  ← scrolls independently →                │
│   ▶More…  │                                           │
└─────────┴──────────────────────────────────────────┘
```

### Tablet (768px - 1024px)

Sidebar collapses to overlay (toggled by hamburger menu). Content area uses full width with comfortable padding.

### Mobile (< 768px)

- Sidebar hidden behind hamburger menu button
- Search moves to a modal overlay
- Tables scroll horizontally
- Cover page shrinks font sizes proportionally
- Navbar links collapse into a dropdown

---

## Component Details

### Sidebar

- Fixed left panel (300px wide on desktop)
- Search bar at top with purple-tinted focus ring
- Section headers in uppercase, muted gray
- Active page highlighted with purple left border
- Nested items indented with subtle purple divider line
- Collapsible sections (click to expand/collapse)

### Navbar

- Thin strip at very top of screen
- Links: Home, Project Overview, User Guides, Agents, API Reference, GitHub
- GitHub star icon links to repository
- On mobile, navbar links are hidden behind a menu button

### Content Area

- `max-width: 1000px` — comfortable reading width
- Left-aligned (not centered) for scannability
- Purple H1 with bottom border gradient
- Code blocks on dark `#0a0a0f` background with amber syntax
- Tables with purple-tinted alternating rows

### Cover Page (Landing)

- Centered layout with SVG logo at top (80x80px)
- Project name in purple
- Tagline in muted gray
- Three buttons: Get Started, GitHub, Project Overview
- Dark gradient background (`#0a0a0f` → `#1a1035` → `#0a0a0f`)
- Bottom color strip matching brand purple

---

## Interactive Elements

| Element | Behavior |
|---------|----------|
| **Mermaid Diagrams** | Render inline as SVG. Users can zoom in (click to zoom, scroll to pan). All `flowchart`, `sequenceDiagram`, `gantt`, `classDiagram` types supported. |
| **Search** | Full-text search over ALL markdown files. Results show page title + snippet with matched terms highlighted. Works offline after first load (cached in browser). |
| **Dark/Light Toggle** | Fixed button in bottom-right corner. Click to switch. Choice is remembered in browser localStorage. |
| **Code Copy** | Every code block has a "Copy" button in top-right corner. Click copies to clipboard with visual feedback. |
| **Image Zoom** | Click any image or diagram to view full-size in a lightbox overlay. Click outside or press Escape to close. |
| **Sidebar Collapse** | Section headers in sidebar are clickable to expand/collapse sub-items. |
| **Mobile Menu** | Hamburger icon opens/closes sidebar overlay on small screens. |

---

## File Architecture

```
docs/
├── index.html          ← Docsify entry point (THIS IS THE PAGE)
├── _sidebar.md         ← Sidebar navigation structure
├── _navbar.md          ← Top navigation bar
├── _coverpage.md       ← Landing page content
├── .nojekyll           ← Prevents GitHub Pages from running Jekyll
├── llms.txt            ← AI/LLM documentation index
├── 404.md              ← Custom 404 error page
├── index.md            ← Main table of contents (for raw markdown readers)
└── project/
    ├── 000-overview.md
    ├── ...
    └── 007-github-page-design.md  ← THIS FILE
```

---

## AI Accessibility Features

The documentation site is designed to be AI-friendly out of the box:

| Feature | File | What It Does |
|---------|------|-------------|
| **LLM Index** | `docs/llms.txt` | Lists every documentation section with links — AI agents read this to navigate the docs |
| **Clean Markdown** | All `.md` files | Pure markdown with no HTML wrappers — LLMs parse them directly |
| **Sitemap** | (future) | XML sitemap via `sitemap.xml` for search engines |
| **Semantic HTML** | `index.html` | Proper `meta`, `link`, and structured tags for crawlers |
| **No JavaScript required** | Static files | Pages render as plain text without JS — AI crawlers see full content |

---

## How to Preview the Site Locally

**Step 1:** Open your terminal (command prompt)

**Step 2:** Type this command and press Enter:
```bash
npx docsify serve docs/
```

**Step 3:** Open your browser to `http://localhost:3000`

You'll see the documentation site running locally with all the designs described above.

> **Tip:** The `npx` command downloads and runs Docsify temporarily. It does NOT install anything permanently — no npm dependencies added to the project.

---

## How to Publish to GitHub Pages

The publishing happens automatically through a GitHub Actions workflow. Here's what you need to do:

### One-Time Setup (in GitHub.com)

1. Go to your repository on GitHub: `https://github.com/zsdotcom/zs-oks`
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. That's it — the `deploy-docs.yml` workflow handles the rest

### What Happens Automatically

Every time you push changes to the `docs/` folder:
1. GitHub Actions runs the workflow (see `.github/workflows/deploy-docs.yml`)
2. It validates: checks frontmatter, broken links, required files
3. It uploads the `docs/` folder to GitHub Pages
4. Your site goes live at: `https://zsdotcom.github.io/zs-oks/`

### Manual Trigger

You can also publish on demand:
1. Go to your repo on GitHub
2. Click **Actions** → **Deploy Docs to GitHub Pages**
3. Click **Run workflow** → **Run workflow**

---

## Design Evolution

This design will evolve based on:

- User feedback from the solo developer
- New Docsify plugin capabilities
- Changes to the project brand guidelines
- Performance metrics from real usage

The key principle: **content first, decoration second**. Every visual choice should make the documentation easier to read and navigate.

---

## See Also

- [Project Overview](000-overview.md) — High-level project introduction
- [Brand Guidelines](006-brand-guidelines.md) — Official brand colors, voice, and tone
- [Docs Publishing Pipeline](../operations/000-docs-ci-cd.md) — Technical deployment details
- [Documentation Style Guide](../operations/001-docs-style-guide.md) — Markdown conventions and frontmatter rules

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
