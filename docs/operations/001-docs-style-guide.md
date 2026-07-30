---
title: "010 — Documentation Style Guide"
category: "ops"
order: 10
tags: ["docs", "style-guide", "markdown", "frontmatter", "conventions"]
audience: "developers"
last_updated: "2026-07-30"
---

# 010 — Documentation Style Guide

Standards for writing documentation in the **Open Knowledge Studio** project.

---

## 1. Markdown Syntax

Use **GitHub Flavored Markdown (GFM)** as the base syntax. This is rendered natively on GitHub and supported by Docsify, VitePress, and most Markdown renderers.

### 1.1 Heading Structure

| Level | Usage |
|-------|-------|
| `# Title` | Document title (must match frontmatter `title`) |
| `## Section` | Top-level sections |
| `### Subsection` | Nested subsections |
| `#### Sub-subsection` | Rare; prefer restructuring |

Do not skip heading levels (e.g., `#` → `###` without `##` in between).

### 1.2 Code Blocks

Always include a language tag after the opening fences:

````markdown
```typescript
const x = 42;
```

```bash
npm run test:bench
```

```json
{
  "name": "open-knowledge-studio"
}
```
````

Inline code uses single backticks: `` `storeEpisodic()` ``.

### 1.3 Table Formatting

Use alignment dashes for readability. Always include a blank line before and after tables.

```markdown
| Left-aligned | Center-aligned | Right-aligned |
| :----------- | :------------: | ------------: |
| Value        | Value          | Value         |
```

Column headers in title case. Use `—` for empty cells.

### 1.4 Lists

- Unordered lists use `-` (hyphen)
- Ordered lists use `1.` (number) — markdown renderers auto-increment
- Nest with 2-space indent
- Use blank lines between list items when items contain multiple paragraphs

### 1.5 Blockquotes

Use `>` for callouts, warnings, and notes:

```markdown
> **Note:** This feature is experimental.

> **Warning:** This operation cannot be undone.
```

### 1.6 Horizontal Rules

Use `---` with a blank line before and after:

```markdown
---
```

---

## 2. Frontmatter

Every documentation file **must** include YAML frontmatter at the very top:

```yaml
---
title: "010 — Documentation Style Guide"
category: "ops"
order: 10
tags: ["docs", "style-guide", "markdown"]
last_updated: "2026-07-27"
---
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Document title including serial prefix: `"010 — Title"` |
| `category` | Yes | Directory name: `agents`, `architecture`, `benchmarks`, `changelog`, `developers`, `guides`, `i18n`, `a11y`, `ops`, `project`, `security` |
| `order` | Yes | Sort order (integer, from 0); files display sorted by this value |
| `tags` | Yes | Array of relevant tags for search |
| `last_updated` | Yes | ISO date string: `"2026-07-27"` |

---

## 3. Cross-References

Use relative paths from the document's location:

```markdown
[Memory Architecture](../developers/005-memory-architecture.md)
[Benchmark Results](../benchmarks/001-results.md)
```

- Always use the `.md` extension (Docsify resolves it, GitHub renders it)
- Use `../` for parent directories
- Reference anchor IDs for specific sections: `[section](#section-name)`

---

## 4. File Naming Conventions

Format: **`{NNN}-{kebab-case-name}.md`**

| Component | Rules |
|-----------|-------|
| Prefix | 3-digit serial number: `000`, `010`, `020`, etc. (use 10-step gaps for insertions) |
| Separator | Hyphen (`-`) |
| Name | Kebab-case: `docs-ci-cd`, `style-guide`, `memory-architecture` |
| Extension | `.md` |

Examples: `000-changelog.md`, `010-results.md`, `008-ci-cd.md`.

---

## 5. Tone & Voice

| Guideline | Example |
|-----------|---------|
| **Technical but accessible** | Prefer "use `storeEpisodic()` to persist data" over "utilize the episodic storage mechanism" |
| **Concise but complete** | State what the feature does, why it exists, and how to use it — in that order |
| **Active voice** | "The agent writes to memory" not "Memory is written to by the agent" |
| **Second person for instructions** | "Run `npm install`" not "The user should run `npm install`" |
| **Avoid opinion** | Do not use "simply", "just", "obviously", "clearly" |

---

## 6. Formatting Conventions

| Element | Convention |
|---------|------------|
| **Bold** | UI labels, button names: **Save**, **Cancel** |
| `Code` | File paths, commands, function names, variable names |
| _Italic_ | Emphasis only; avoid for technical terms |
| Emoji | **Do not use** in documentation |
| Acronyms | Define on first use: "A2A (Agent-to-Agent)" |
| Version references | `v2.0.0` format |

---

## 7. Document Structure

Every document should follow this order:

1. **Frontmatter** (YAML)
2. **Title heading** (`#` level, matches frontmatter title)
3. **Lead paragraph** (1-3 sentences summarizing the document)
4. **Body sections** (`##` and `###` levels)
5. **See Also section** (at the end)

---

## 8. Content Standards

- **Accuracy:** All code examples must be verified against the source. See the note in `AGENTS.md`: "If docs conflict with source code, trust the source."
- **Completeness:** Every documented feature should include: purpose, API/usage, and example.
- **Freshness:** Update `last_updated` in frontmatter whenever content changes.

---

## See Also

- [Documentation Publishing Pipeline](000-docs-ci-cd.md) — How docs are served and deployed
- [Development Guide](../developers/004-development.md) — Coding standards and contribution guidelines
- [`docs/index.md`](../index.md) — Master documentation index


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
