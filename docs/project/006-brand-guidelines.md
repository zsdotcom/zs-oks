---
title: "006 — Brand Guidelines"
category: "project"
order: 60
tags: ["brand", "visual-identity", "voice", "tone", "messaging"]
last_updated: "2026-07-27"
---

# 006 — Brand Guidelines

## 1. Brand Snapshot

| Field | Value |
|---|---|
| Product name | Open Knowledge Studio |
| Version | v2.0 |
| Tagline | Zero-dependency · Browser-native · 6-Agent A2A Platform |
| Elevator line | A private AI research laboratory in your browser — 6 specialized agents collaborate on your work, all data stays local, zero backend required. |
| License | MIT |
| Design metaphor | Cyber-minimalism — terminal austerity + high-end hardware sophistication |
| Primary audience | Field epidemiologists, public health analysts, researchers, NGO workers |

## 2. Brand Positioning & Narrative

### Mission

> "Open Knowledge Studio envisions a world where every researcher, writer, and analyst has access to a private AI-powered research laboratory that runs entirely in their browser — no cloud costs, no data leaks, no vendor lock-in."

### Three Claims That Define the Brand

| Claim | Why It Matters |
|---|---|
| **Zero backend / zero-dependency** | Only two runtime npm packages (`react`, `react-dom`). This is a constitutional rule (ADR-001), not a marketing flourish. |
| **Local-first / privacy-preserving** | All computation and storage happen in IndexedDB and a Web Worker. No telemetry, no analytics, no third-party data sharing outside the AI provider the user configures. |
| **Multi-agent, not single-chat** | Six named, color-coded agents debate/collaborate on a prompt in parallel — not a single-thread chat assistant. |

### Center of Gravity

The seeded templates (WHO SitReps, line listings, ICD-11 lookup, EPI schedules, Bangladesh Core FHIR) run deeper than the generic "research studio" framing suggests. The brand's actual center of gravity is **public-health / epidemiological tooling wrapped in a general-purpose research shell**.

## 3. Voice & Tone

### Voice Attributes

| Attribute | Evidence |
|---|---|
| **Precise / systems-literate** | ADRs follow strict Nygard format even for a solo project. Version numbers, byte counts, and test counts are stated exactly ("~90 KB gzip," "117 tests across 8 files") rather than rounded. |
| **Matter-of-fact about constraints** | Zero-dependency and zero-budget are stated as facts, never apologized for. |
| **Practitioner-grounded** | Field-report templates and SitReps read like they were written by someone who has used them under pressure. |
| **Transparent about gaps** | The project documents known limitations plainly ("no real MCP execution," "CSP blocks BD APIs — High severity"). |
| **Structured to the point of ritual** | Every doc has the same skeleton. Consistency reads as care, not bureaucracy. |

### Tone by Context

| Context | Formality | Energy | Technical Depth |
|---|---|---|---|
| README / marketing | Medium | High | Medium |
| ADRs / architecture | High | Low | High |
| Non-coder guide | Low–Medium | Medium (encouraging) | Low |
| Agent system prompts | High | Low | High |
| Security / privacy docs | High | Low | High |

### What the Voice Never Does

- Never uses hype adjectives ("revolutionary," "game-changing," "seamless").
- Never hides a limitation — security docs list *residual risk* after every mitigation.
- Never breaks the documentation skeleton for effect.

## 4. "We Are / We Are Not"

| We Are | We Are Not |
|---|---|
| Local-first and offline-capable | A hosted SaaS product |
| Zero-dependency by constitutional rule | A framework that "eventually" adds a backend |
| Multi-agent and role-specialized | A single-model chatbot with a new coat of paint |
| Precise about trade-offs | Marketing copy that hides limitations |
| Built for field practitioners | A generic "AI notes app" |
| Free and MIT-licensed | Freemium with an eventual upsell |

## 5. Visual Identity — Color System

See [005-design.md](005-design.md) §2 for the full color palette, agent color identity table, and semantic status colors.

### Key Color Rules

| Rule | Detail |
|---|---|
| **Primary brand color** | `#8B5CF6` (Electric Violet) — PWA `theme-color`, default `--accent`, Coordinator agent color, favicon target |
| **Agent colors are fixed** | Do not reuse `#8B5CF6`, `#06B6D4`, `#F59E0B`, `#10B981`, `#EF4444`, or `#A855F7` for new agents |
| **Dark is canonical** | Dark theme with violet accent is the default brand presentation for all external assets |
| **7 theme variants** | Dark (default), Light, Sepia, Forest, Ocean, Midnight, Solarized |

## 6. Visual Identity — Typography

See [005-design.md](005-design.md) §3 for full type scale. Key conventions:

| Font | Role |
|---|---|
| **Inter** | Sans-serif — prose, headings, UI |
| **JetBrains Mono** | Monospace — code, labels, metadata |

**Signature detail:** Labels are always JetBrains Mono, frequently uppercase with 0.05em tracking.

## 7. Iconography

All UI icons are hand-authored inline SVGs in `src/components/icons/lucide-shim.tsx` — a zero-dependency Lucide icon shim (36+ icons, 2px stroke, rounded caps/joins, 24x24 viewBox).

**Rule for new icons:** `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `fill="none"`, `stroke="currentColor"`.

## 8. Layout, Elevation & Motion

See [005-design.md](005-design.md) §4–6, §9 for full grid, elevation, shape, and animation specs.

| Principle | Detail |
|---|---|
| **Elevation** | Luminance/blur-based, not box-shadow-based |
| **Shape** | Soft-cornered rectangles (4px) are the default. Avoid pill-shaped buttons. |
| **Motion** | `prefers-reduced-motion` disables all animations (hard rule, not nice-to-have) |

## 9. Agent System as a Brand Device

The 6-agent roster is the primary storytelling device. Each agent has a four-part identity contract:

1. A single emoji avatar (never combined, never photographic).
2. A fixed hex color (never reused).
3. A one-line role description used consistently everywhere.
4. A verbatim system prompt beginning "You are the [Name] Agent of Open Knowledge Studio."

**New agents** (custom or persona-based) must follow this exact contract.

## 10. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Product name | "Open Knowledge Studio" full on first reference; "OKS" only after first full use |
| Version | "v2.0" in headers, badges | "Open Knowledge Studio v2.0" |
| ADRs | `ADR-NNN-title-kebab-case`, Nygard format |
| Doc files | `NNN-kebab-case-name.md`, gaps of 10 | `010-agents.md` |
| Agent IDs | lowercase, short, no spaces | `coord`, `research`, `data`, `writer`, `review`, `librarian` |
| CSS variables | `--color-[agent-id]` for agents | `--color-research` |

## 11. Messaging Library (Pre-Approved Copy)

**Tagline (short):**
> Zero-dependency · Browser-native · 6-Agent A2A Platform

**Elevator pitch (one sentence):**
> A private AI research laboratory in your browser — 6 specialized agents collaborate on your work, all data stays local, zero backend required.

**Mission (long-form):**
> A world where every researcher, writer, and analyst has access to a private AI-powered research laboratory that runs entirely in their browser — no cloud costs, no data leaks, no vendor lock-in.

**Feature soundbites (do not alter wording):**
> 🤖 6-Agent A2A Debate — Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian — each with unique color, avatar, and system prompt.
> 🧠 Vector Embeddings — Transformers.js (all-MiniLM-L6-v2) in a Web Worker generates 384-dim vectors for all semantic memory entries. Zero-cost, privacy-preserving.
> 📦 Zero NPM Deps — Only react + react-dom. Transformers.js, Orama, KaTeX, Mermaid, Leaflet all loaded dynamically from CDN.

**Stat line:**
> 2 runtime deps · 117 tests · ~90 KB gzip · 22 IndexedDB stores · 6 built-in agents · 10 AI providers

## 12. Do's and Don'ts

### Do
- Lead with "runs entirely in your browser" / "zero backend" before any other feature claim.
- State exact numbers (test counts, KB sizes, dependency counts).
- Use the agent color system when referencing a specific agent, in any medium.
- Keep Dark theme + violet accent as default for all external-facing assets.
- Acknowledge known limitations plainly.

### Don't
- Don't call it a "chatbot" or "AI assistant" without the multi-agent qualifier.
- Don't imply hosted/cloud infrastructure exists ("our servers," "sign up for an account").
- Don't invent a new accent color; `#8B5CF6` is the brand color everywhere.
- Don't use pill-shaped buttons or heavy drop shadows.
- Don't reuse an existing agent color for a new agent, tool, or category badge.

---

## See Also

- [005 — UI/UX Design System](005-design.md) — Full color/typography/layout specs
- [000 — Project Overview](000-overview.md) — Mission, philosophy, capabilities
- [001 — Concept & Vision](001-concept.md) — Personas, differentiators, glossary
- [Architecture Index](../architecture/000-index.md) — ADR-001 (zero-dependency rule)
- [Agent System Guide](../guides/001-agents.md) — Agent identity and usage

---

*Last updated: July 27, 2026*
