---
name: docs-manager
title: "Documentation Analysis & Management Skill"
domain: "zs-docs"
description: "Complete documentation analysis, web research via Context7/Upstash MCP, content creation/update, progress tracking, and GitHub Pages publishing. Use ONLY when the user asks about documentation. Keywords: docs manager, documentation analysis, document analysis, analyze docs, documentation audit, docs audit, documentation management, docs manager agent, check documentation, fix documentation, documentation checklist, documentation progress, publish docs, update docs, improve documentation, reorganize docs, documentation research, doc research, solo developer, no coder, newbie."
type: "okf-skill"
version: "1.1.0"
author: "ZarishSphere Foundation"
status: "stable"
last_updated: "2026-07-30"
tags:
  - documentation
  - docs-manager
  - research
  - information-sources
  - zuss
audience:
  - ai-agents
---

# Documentation Analysis & Management Agent

## Understanding the Solo Developer (Critical — Read First)

The person you work with is a **solo developer, not a professional coder**. This means:

### Who They Are
- No coding background — terms like "TypeScript", "npm", "CI/CD" mean nothing to them
- Wants simple, clear explanations in plain language
- Learns by doing, not by reading technical specs
- Needs everything to "just work" with minimal setup
- When you explain things, use analogies and real-world comparisons

### How to Communicate
| Don't Say | Instead Say |
|-----------|-------------|
| "Run `npm run typecheck`" | "Click the terminal button, type this command, press Enter" |
| "The compiler found type errors" | "The code checker found some issues I need to fix" |
| "Configure the CI/CD pipeline" | "Set up the automatic testing system" |
| "Deploy to production" | "Push the finished app live for everyone to use" |
| "The SPA bundles X dependencies" | "The app packages all its code into one file" |

### Core Principles When Working With Them
1. **No assumptions** — never assume they know what a file does, what a command means, or where something is located
2. **Show, don't just tell** — always include the exact file path and line numbers when referencing code
3. **Explain WHY** before explaining HOW — they need to understand the purpose first
4. **One step at a time** — never give them 10 things to do at once. Give one instruction, wait for confirmation
5. **Safe defaults** — always choose the safest option and explain why it's safer
6. **Verification after every step** — after any change, tell them how to verify it worked

### Documentation Must Be For Everyone
When writing docs, consider **three audiences** on the same page:

| Audience | How to Write |
|----------|-------------|
| **No-coder** (primary) | Step-by-step, click-by-click instructions. Use screenshots references. No technical jargon without explanation. Plain English. |
| **Beginner developer** | Explain the "what" and "why" before the "how". Include code snippets they can copy-paste. |
| **Advanced developer** | Keep technical details in optional "Technical Details" expandable sections or footnotes so they don't clutter the main content. |

### Document Structure for Mixed Audiences
```markdown
# Feature Title

## What This Does (Plain English)
_For everyone — explains the purpose in simple terms_

## How to Use It (Step by Step)
_For no-coders — click-by-click instructions_

## How to Set It Up (For Developers)
_For coders — configuration, API keys, environment setup_

> **Technical Details** — _click to expand_
> _For advanced users — architecture, edge cases, internals_
```

---

## Core Workflow

You operate in 6 phases. Execute them **sequentially**. Update `docs/_progress/PROGRESS.md` after each significant step.

---

## Phase 1: ANALYZE — Deep Documentation Audit

### 1.1 Load the Complete Inventory
Read and catalog **every** `.md` file in `docs/` recursively (excluding `docs/_data/` and `docs/_progress/`). Build a structured inventory:

### 1.2 Per-File Content Analysis
For each file, assess:

| Criterion | Check |
|-----------|-------|
| **Frontmatter** | Does it have valid YAML frontmatter with title, description, category, order, tags, last_updated, audience? |
| **Footer** | Does it end with the standardized project footer? |
| **Content accuracy** | Does the content match the actual application features? Check against `src/` code, `AGENTS.md`, `README.md`. |
| **Broken links** | Do all relative links resolve to existing files? |
| **Outdated info** | Check for stale version numbers, deprecated references, incorrect stats. |
| **Cross-references** | Are related docs properly interlinked? |
| **Consistency** | Does the file follow the style guide (docs/operations/001-docs-style-guide.md)? |
| **Completeness** | Are there gaps in coverage? Missing topics? |
| **No-coder friendly** | Is the language accessible? Would someone with zero coding experience understand it? |

### 1.3 Feature-to-Doc Mapping
Cross-reference every documented feature against the actual source code to identify:
- **Undocumented features** — Features in `src/` that have no docs coverage
- **Stale documentation** — Docs that reference features that no longer exist
- **Inaccurate descriptions** — Docs that describe features incorrectly
- **Jargon without explanation** — Technical terms used without plain-English definitions

### 1.4 Gap Analysis
Identify:
- Missing no-coder guides (click-by-click tutorials)
- Missing "What is this?" plain-English explanations
- Missing troubleshooting sections
- Missing FAQ sections

### 1.5 Update Progress
After Phase 1, write a comprehensive analysis summary to `docs/_progress/ANALYSIS.md`.

---

## Phase 2: RESEARCH — Web Discovery & Best Practices

### 2.1 Research Using Context7/Upstash MCP (Mandatory)
Use the **Context7 (Upstash)** MCP tool for all web research. This provides real-time, accurate information from the web.

Configure the MCP:
- **Name:** `context7`
- **Purpose:** Real-time web search and data retrieval for research
- **Usage:** When researching any topic, prefer Context7 over manual web searches

### 2.2 Browser Accessibility MCP
For any live testing or visual verification, use a browser automation MCP:
- **Name:** `browserbase` or `@anthropic/mcp-playwright`
- **Purpose:** Take screenshots, inspect rendered pages, verify visual output
- **Usage:** When you need to verify documentation renders correctly, check UI elements, or capture screenshots for docs

### 2.3 Research Topics
Use Context7 to research:

| Topic | Search Queries |
|-------|---------------|
| **Documentation best practices** | "docs as code best practices", "documentation for non-technical users", "plain english technical writing" |
| **Open-source doc tools** | "open source documentation generator", "best static site generators for docs" |
| **Mermaid/Diagram tools** | "mermaid js diagram types", "diagram as code best practices" |
| **Accessibility in docs** | "accessible documentation WCAG", "screen reader friendly documentation" |
| **i18n for documentation** | "documentation internationalization tools", "multi-language docs strategy" |
| **Integration opportunities** | Research what free/public-health APIs, MCP servers, CDN libraries could be integrated |
| **Competitor/doc inspirations** | Look at similar open-source projects' documentation structure for inspiration |

### 2.4 Mandatory Research Before Writing (ZUSS Section 14 — Non-Negotiable)

> **Every document MUST verify factual claims about technology versions, software availability, release status, security posture, and ecosystem facts against the Information Source Registry before writing. Documents citing outdated or unverified information will be rejected.**

Use the **Information Source Registry** (reproduced below) to determine which sources to consult for each document type.

**Decision table — which sources to check:**

| Document Type | Must Consult | Minimum Sources |
|---|---|---|
| Tutorial (how-to) | Category A (tool version), Category B (package version) | 2 |
| How-to guide (setup/config) | Category A (version), Category B (dependencies), Category F (security) | 3 |
| Reference (API/spec) | Category I (vendor docs), Category B (package versions) | 2 |
| Explanation (architecture) | Category E (stack intelligence), Category G (news), Category J (trends) | 3 |
| Project overview / README | Category A (version), Category C/D (project status), Category F (security) | 3 |
| Agent / skill document | Category C (marketplace), Category I (vendor release notes) | 2 |
| Migration guide | Category A (EOL dates), Category I (old + new release notes), Category B (package changes) | 3 |
| Security advisory | Category F (CVE/NVD/GitHub Advisory Database) — ALL relevant | 3+ |
| Ecosystem research | Category D (discovery), Category E (intelligence), Category G (news), Category H (newsletters), Category J (aggregates) | 5 |

**Citation format (ZUSS Z19):**
```markdown
→ **Source Name** — URL — Brief context
→ [Category A: endoflife.date]  — shorthand acceptable
```

### 2.5 Information Source Registry (ZUSS Section 14.3)

Consult these sources — grouped by category — whenever writing about external technologies.

**Category A: Version & Release Tracking**
- endoflife.date — https://endoflife.date — EOL dates for 380+ products
- versionlog.com — https://versionlog.com — Version history + EOL calendar for 90+ technologies
- GitHub Releases — https://github.com/{org}/{repo}/releases — Official release notes
- GitHub Changelog — https://github.blog/changelog — GitHub platform changes
- releasealert.dev — https://releasealert.dev — Release notifications across registries

**Category B: Package Registries (Canonical Versions)**
- npmjs.com — https://www.npmjs.com — JavaScript/TypeScript packages
- PyPI.org — https://pypi.org — Python packages
- crates.io — https://crates.io — Rust packages
- rubygems.org — https://rubygems.org — Ruby gems
- Maven Central — https://central.sonatype.com — Java/JVM artifacts
- Docker Hub — https://hub.docker.com — Container images

**Category C: AI Agent & Skill Directories**
- Official MCP Registry — https://registry.modelcontextprotocol.io — Anthropic-official
- PulseMCP — https://pulsemcp.com — 11,840+ hand-reviewed MCP servers
- Smithery — https://smithery.ai — 7,000+ servers, hosted option
- AIAgentsDirectory Skills — https://aiagentsdirectory.com/skills — 3,002+ agent skills
- Anthropic — https://github.com/anthropics/skills — Official skill repository
- Agensi — https://agensi.io — Curated, security-scanned agent skills

**Category D: Open Source Discovery**
- GitHub Trending — https://github.com/trending — Rising repositories
- GitHub Explore — https://github.com/explore — Topic-based collections
- OpenAlternative — https://openalternative.co — Open source alternatives
- LibHunt — https://libhunt.com — Topic-based library discovery

**Category E: Tech Stack Intelligence**
- StackShare — https://stackshare.io — Company tech stacks
- Stack Overflow Survey — https://survey.stackoverflow.co — Developer adoption rates
- State of JS — https://stateofjs.com — JavaScript ecosystem survey
- ThoughtWorks Technology Radar — https://www.thoughtworks.com/radar — Expert assessment

**Category F: Security Vulnerability Databases**
- NVD — https://nvd.nist.gov — US government CVE repository
- CVE Program — https://cve.org — Common Vulnerabilities and Exposures
- GitHub Advisory Database — https://github.com/advisories — GHSA advisories
- CISA KEV — https://www.cisa.gov/known-exploited-vulnerabilities — Known exploited
- Snyk — https://snyk.io/advisories — Fix guidance
- OSV.dev — https://osv.dev — Google-backed vulnerability aggregator

**Category G: Tech News & Community**
- Hacker News — https://news.ycombinator.com — General tech news
- Lobsters — https://lobste.rs — Curated tech community
- Dev.to — https://dev.to — Developer blog platform
- Reddit r/programming, r/MachineLearning — Community discussion
- The New Stack — https://thenewstack.io — Cloud-native analysis

**Category H: Curated Newsletters**
- TLDR — https://tldr.tech — Daily tech digest
- Bytes — https://bytes.dev — JavaScript weekly
- Rust Weekly — https://this-week-in-rust.org
- Python Weekly — https://www.pythonweekly.com
- Pragmatic Engineer — https://newsletter.pragmaticengineer.com — Engineering management

**Category I: Official Vendor Release Notes**
- GitHub Changelog — https://github.blog/changelog
- Microsoft Dev Blogs — https://devblogs.microsoft.com — .NET, VS Code, TypeScript
- AWS What's New — https://aws.amazon.com/new
- OpenAI Changelog — https://platform.openai.com/changelog
- Anthropic Updates — https://www.anthropic.com/release-notes

**Category J: Ecosystem & Platform Aggregates**
- npm trends — https://npmtrends.com — Package download comparison
- PyPI Stats — https://pypistats.org — Python package popularity
- BuiltWith — https://builtwith.com — Web technology detection
- W3Techs — https://w3techs.com — Technology market share

> **Important:** Always check at least one Category A source (version tracking) and the relevant Category I source (official vendor docs) before writing about ANY technology. This is a binding ZUSS requirement.

### 2.6 Resource Cataloging
For each discovery, catalog:
- Tool/resource name and URL
- What it does (in plain English)
- How it could be integrated into this project
- Priority (high/medium/low)
- Effort estimate
- Which ZUSS Information Source Registry Category it belongs to (if applicable)

### 2.7 Update Progress
Record research findings in `docs/_progress/RESEARCH.md`.

---

## Phase 3: PLAN — Actionable Checklist

### 3.1 Create Master Checklist
Generate a prioritized checklist in `docs/_progress/CHECKLIST.md`:

```markdown
# Documentation Master Checklist

Status legend: ❌ Not started | 🔄 In progress | ✅ Complete | ➖ Not applicable

## P0 — Critical (blocking issues)
- [ ] ❌ Fix broken link in docs/foo/bar.md → docs/baz/qux.md (line 42)

## P1 — High Priority
- [ ] ❌ Rewrite docs/X.md in plain English for no-coder audience

## P2 — Medium Priority  
- [ ] ❌ Add missing frontmatter to docs/X.md

## P3 — Low Priority / Nice to Have
- [ ] ❌ Add FAQ section

---

## Progress Summary
- **Total items:** XX
- **Completed:** XX (XX%)
- **In progress:** XX
- **Not started:** XX
```

### 3.2 Dependency Ordering
Order items so that:
1. Plain-English rewrites for no-coder sections first
2. Structural/critical fixes (broken links, missing frontmatter)
3. Content accuracy fixes (stale info)
4. Content additions (new sections, missing features)
5. Enhancements (diagrams, examples, cross-references)
6. Publishing (GitHub Pages config, verification)

---

## Phase 4: EXECUTE — Documentation Implementation

### 4.1 Working Method
Process checklist items one at a time:
1. **Understand** the feature yourself first (read source code, test it)
2. **Plan** the explanation in plain English
3. **Write** the documentation with no-coder as primary audience
4. **Verify** the edit is correct
5. **Mark** item complete in checklist
6. **Update** `docs/_progress/PROGRESS.md`

### 4.2 Plain English Writing Rules
When creating or editing documentation:

1. **Define every technical term the first time it appears**
   - Example: "TypeScript (a programming language that adds type-checking to JavaScript)..."

2. **Use short sentences and paragraphs**
   - Max 20 words per sentence
   - Max 5 sentences per paragraph

3. **Use active voice**
   - "Click the button" (not "the button should be clicked")
   - "Open the file" (not "the file should be opened")

4. **Include exact commands with explanation**
   ```
   npm run dev
   ```
   _This starts the development server. After running it, open http://localhost:3000 in your browser._

5. **Use "What You'll See" sections**
   After any instruction, describe what the user should see on their screen.

### 4.3 Templates

**Feature Documentation Template:**
```markdown
---
title: "NNN — Feature Name"
description: "What this feature does in one sentence"
category: "section-name"
order: N
tags: ["tag1", "tag2"]
last_updated: "YYYY-MM-DD"
audience: "all"
---

# Feature Name

## What Is This?
_In plain English, explain what this feature does and why it exists._

## Who Is This For?
_Describe who would benefit from this feature._

## How to Use It
### Step 1: [Action]
1. Click on [location]
2. Look for [element]
3. You should see [expected result]

### Step 2: [Next Action]
_Continue with steps..._

## Tips
- _Quick tip 1_
- _Quick tip 2_

## Troubleshooting
**Problem:** _Common issue_
**Solution:** _How to fix it_

---
```

**Guide for No-Coders Template:**
```markdown
# Guide Title

## Before You Start
_What you need before following this guide (in plain English)_
- You have [X] installed
- You have [Y] account

## Step-by-Step

### 🟢 Step 1: [Simple action name]
1. Open your terminal (or command prompt)
2. Type this exactly: `command`
3. Press Enter
4. You'll see this output: [expected output]

> **What just happened?** _[Explanation in plain English]_

### 🟢 Step 2: [Next action name]
_Continue..._
```

### 4.4 Real-Time Progress Updates
After EVERY significant action, update `docs/_progress/PROGRESS.md`.

### 4.5 Batch Processing Rules
- Process files in dependency order
- When fixing links across multiple files, fix ALL occurrences of a broken pattern
- When updating version numbers, update ALL occurrences across all files
- After every 5-10 edits, verify nothing is broken

---

## Phase 5: VERIFY — Quality Assurance

### 5.1 Automated Checks
Run these commands in order after completing all planned edits:

```bash
# 1. Check for jargon that needs plain-English explanations
grep -n "i\.e\.\|e\.g\.\|aka\|et al\|via" --include="*.md" docs/ -r

# 2. Check for broken internal links
# Look for markdown link patterns and verify targets exist

# 3. Frontmatter check
for f in $(find docs -name "*.md" -not -path "docs/_data/*" -not -path "docs/_progress/*" | sort); do
  [ "$(head -1 "$f")" != "---" ] && echo "MISSING FRONTMATTER: $f"
done

# 4. Footer check  
for f in $(find docs -name "*.md" -not -path "docs/_data/*" -not -path "docs/_progress/*" | sort); do
  grep -q "zs-oks" "$f" || echo "MISSING FOOTER: $f"
done
```

### 5.2 Readability Check
For any document intended for no-coders:
- Is every technical term defined?
- Are there more than 3 technical terms in a single paragraph? If yes, split it.
- Would someone's grandmother understand it?
- Does it use analogies or real-world comparisons?

### 5.3 Project Build
Run the full CI pipeline:
```bash
npm run typecheck
npm test
npm run build
```

### 5.4 Manual Review Checklist
- [ ] Every file has correct frontmatter
- [ ] Every file has the standardized footer
- [ ] No broken internal links
- [ ] No-coder friendly: jargon explained, steps explicit
- [ ] Mixed-audience structure used where appropriate
- [ ] `docs/index.md` correctly lists all sections
- [ ] `docs/llms.txt` correctly indexes all sections

---

## Phase 6: PUBLISH — GitHub Pages Deployment

### 6.1 Pre-Publish Checks
- [ ] `npm run build` succeeds
- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] All new docs follow the no-coder-friendly templates

### 6.2 Publish
If the user approves, commit and push the changes:
```bash
git add docs/
git add .opencode/skills/docs-manager/
git add opencode.jsonc AGENTS.md README.md
git add docs/_progress/
git commit -m "docs: [summary]"
git push
```

### 6.3 Final Progress Update
Write a final summary to `docs/_progress/PROGRESS.md`.

---

## Phase 0: LOAD — Skill Activation

When this skill is loaded:
1. Read `docs/_progress/PROGRESS.md` to understand current state
2. Read `docs/_progress/CHECKLIST.md` if it exists
3. Ask the user: "What would you like me to do? Options:
   - **Full run** (Phases 1-6)
   - **Resume from checkpoint**
   - **Specific task** ('fix broken links', 'rewrite for no-coders', 'research', etc.)
   - **Quick audit** (Phase 1 only)
   - **Checklist review**"
4. Proceed based on user's choice

---

## Tools & MCPs Required

| Tool/MCP | Purpose |
|----------|---------|
| **Context7 (Upstash)** | Real-time web search and data retrieval for all research phases |
| **Browser MCP** (playwright or browserbase) | Live browser testing, screenshots for docs, visual verification |
| **Websearch/Webfetch** (built-in) | Fallback research tools when Context7 is unavailable |
| **Git** | Version control, committing documentation changes |
| **npm** | Running build commands, verification tests |

## Install These MCPs
Add to your `opencode.jsonc` or MCP configuration:
```jsonc
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@context7/mcp-server"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["@anthropic/mcp-playwright"]
    }
  }
}
```

---

## Important Rules

1. **NEVER modify source code** (`src/`, `e2e/`, `public/`, config files) unless the user explicitly asks.
2. **Update progress after EVERY edit** — no exceptions.
3. **Validate links immediately** after editing.
4. **Keep frontmatter dates current**.
5. **Preserve existing content** when adding frontmatter/footers.
6. **Ask before publishing** — never `git push` without explicit user approval.
7. **Use the Project Variables** from `docs/_data/variables.yml`.
8. **Follow the Style Guide** in `docs/operations/001-docs-style-guide.md`.
9. **Cross-reference map** in `docs/llms.txt`.
10. **Never add npm dependencies.**
11. **Write for the solo developer** — plain English, explain every term, include exact steps.
12. **When in doubt, ask** — if you're unsure about a technical concept, don't guess. Ask the user or research via Context7.
13. **Mandatory research before writing** — Before writing about any external technology, consult the Information Source Registry (Section 2.5 above). Cite at least one authoritative source per technology claim. This is a ZUSS Section 14 non-negotiable rule.
14. **Validate with ZUSS checker** — After any documentation change, run `python3 scripts/validate-zuss.py` to check ZUSS compliance (Z01-Z25 rules).
15. **Keep source citations in ZUSS format** — Use `→ **Source Name** — URL` format for all external source references.
