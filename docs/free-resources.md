---
title: "Free Resource Inventory"
category: "ops"
order: 002
tags: ["resources", "free-tier", "mcp", "cloudflare", "cdn", "api", "oss-benefits"]
last_updated: "2026-07-27"
---

# Free Resource Inventory

## 1. MCP Servers (Model Context Protocol)

The project stores MCP tool definitions but does not execute them. The servers below are free, minimal-effort connectors that close this gap in combination with a small execution surface (see §3 Cloudflare).

| MCP Server | Purpose | Free Tier | One-liner |
|---|---|---|---|
| **Filesystem** (`@modelcontextprotocol/server-filesystem`) | Read/write local files with path restrictions | Fully free, open source | `npx -y @modelcontextprotocol/server-filesystem /path/to/dir` |
| **GitHub** (official) | Create/read repos, issues, PRs, code search | Free with PAT | Add to MCP client config with a GitHub PAT |
| **Fetch** (official) | Read arbitrary web pages into context | Free | `npx -y @modelcontextprotocol/server-fetch` |
| **Slack** (official/community) | List channels, post messages, reply to threads | Free with Slack app token | Config-only, no code |
| **Google Drive** (community) | Search and read Drive files | Free with OAuth | Config-only |
| **Playwright** (official/Microsoft) | Headless browser control — navigate, click, screenshot | Free, open source | Useful for E2E smoke checks |
| **HDX (Humanitarian Data Exchange)** | 29–33 tools for refugee/IDP/returnee populations, food security, conflict | Free with `HDX_APP_IDENTIFIER` | `docker mcp add hdx` or npx |
| **Feedbagel RSS** | Follow RSS feeds and route entries to webhooks | Free tier with API key | `npx feedbagel-mcp` |
| **Context7** | Injects live, version-accurate library docs into context | Free tier | Already used in this workspace |

> **Limit to 5–6 servers at once** to keep tool-call latency and context usage manageable.

**References:** [modelcontextprotocol.io](https://modelcontextprotocol.io/) · `punkpeye/awesome-mcp-servers` (community list) · MCP is now Linux Foundation governed (Agentic AI Foundation).

---

## 2. Cloudflare — Free Execution Surface

Every relevant Cloudflare product has a free tier. These can power real MCP execution, connector sync, scheduled polling, and notifications — all without violating the project's zero-backend, zero-cost constraint.

| Service | Free Limit | Role |
|---|---|---|
| **Workers** | 100k req/day, 10ms CPU/invocation | CORS-safe proxy that actually executes MCP tool calls |
| **Pages** | Unlimited static hosting, 500 builds/month | Alternative deploy target (complements GH Pages) |
| **KV** | 1 GB, 100k reads/day, 1k writes/day | Lightweight cache for connector poll state |
| **D1** | 5 GB, 5M rows read/day, 100k rows written/day | Server-side mirror for webhook history |
| **Queues** | 10k operations/day | Scheduled connector polling (GitHub issues, RSS) |
| **R2** | 10 GB-month, 1M+10M ops/month, **zero egress fees** | Storage for exported chat history or uploaded files |
| **Vectorize** | 30M queried / 5M stored vector dimensions/month | Free fallback for Orama JS semantic search |
| **Workers AI** | Free inferences/day on select models | 11th LLM provider option + server-side embedding fallback |
| **Agent Skills** (`agents/skills`, `@cloudflare/think`) | Free, part of Workers runtime | Edge-executable `SKILL.md` convention |

**Minimal GUI path:** Cloudflare Dashboard → Workers & Pages → Create → connect the GitHub repo → set `BASE_PATH` build variable → done. CLI only needed later for `wrangler tail` debugging.

**References:** [developers.cloudflare.com/agents/runtime/execution/agent-skills](https://developers.cloudflare.com/agents/runtime/execution/agent-skills/) · [workers/platform/pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [workers-ai](https://developers.cloudflare.com/workers-ai/)

---

## 3. Client-Side / CDN Libraries (Zero NPM Install)

The project's CDN-only pattern (Transformers.js, Orama, KaTeX, Mermaid, Leaflet from jsDelivr/unpkg) is directly extensible without adding npm runtime deps:

| Library (CDN) | Closes Gap | Effort |
|---|---|---|
| **Tesseract.js** | No file upload / OCR for scanned PDFs or images | One `<script>` tag from jsDelivr; runs in Web Worker |
| **pdf.js** (Mozilla) | PDF text/preview extraction | CDN script tag |
| **PapaParse** | CSV import/export | CDN script tag |
| **SheetJS (xlsx)** | Excel import/export | CDN script tag |
| **LibreTranslate** | Multi-language i18n stretch goal | Public free instance with rate limits; self-hostable OSS |

---

## 4. Public-Health & Humanitarian APIs (Free, No-Cost)

These expand the 18 knowledge sources already wired into `publicApiService.ts`:

| Source | Provides | Cost |
|---|---|---|
| **ReliefWeb API** | OCHA humanitarian reports, situation reports, crisis figures | Free, no key for read |
| **HDX REST API** | 18k+ datasets across 250+ locations | Free; API key for higher-volume endpoints |
| **WHO data.who.int** | Global health indicators via OData API | Free, no key (current interface; legacy GHO API deprecating) |
| **CDC Socrata** | US public-health surveillance datasets | Free, no key required for basic access |
| **Delphi Epidata** (CMU) | Real-time epidemiological signals | Free, no key for most endpoints |
| **Open-Meteo** | Weather/climate data | Free, unlimited non-commercial |
| **OCL / BD FHIR** (`tr.ocl.dghs.gov.bd`, `icd11.dghs.gov.bd`, `fhir.dghs.gov.bd`) | Bangladesh terminology, ICD-11, national FHIR | Free (government-hosted) — currently blocked by CSP |

> **Single CSP edit that unblocks all blocked APIs:**
> ```ts
> // vite.config.ts — server.headers / build CSP connect-src
> "connect-src 'self' https://tr.ocl.dghs.gov.bd https://icd11.dghs.gov.bd https://fhir.dghs.gov.bd https://sandbox.fhir.dghs.gov.bd https://api.github.com https://ghoapi.azureedge.net https://data.who.int https://data.cdc.gov https://delphi.cmu.edu https://api.open-meteo.com https://data.humdata.org"
> ```

---

## 5. GitHub Free / Nonprofit Upgrades

| Benefit | Detail (2026) |
|---|---|
| **Actions minutes** | Unlimited for public repos; 2k min/month free for private |
| **Copilot Pro (free)** | Free for OSS maintainers of qualifying projects; free for verified students/educators |
| **GitHub for Nonprofits** | 501(c)(3)-equivalent orgs get free **Team** plan or 25% off Enterprise Cloud |
| **Packages** | 500 MB free (public repos) |
| **Dependabot** | Free security/version-update PRs on all plans |

**References:** [github.com/solutions/industry/nonprofits](https://github.com/solutions/industry/nonprofits) · [github.com/pricing](https://github.com/pricing)

---

## 6. Summary — Effort vs. Impact

| Resource | Effort | Impact | Cost |
|---|---|---|---|
| `vite.config.ts` CSP fix | One code edit | Unblocks 3 blocked API groups | Free |
| GitHub for Nonprofits | One web form | Free Team plan for org | Free |
| Cloudflare Pages + `wrangler-action` | Dashboard connect + one YAML block | Second deploy target, zero egress | Free |
| Cloudflare Workers as MCP proxy | One Worker + bindings | Closes MCP execution gap | Free |
| HDX / ReliefWeb API calls | Free API key signup | Extends public data sources | Free |
| Tesseract.js / pdf.js / PapaParse via CDN | `<script>` tag each | File upload / CSV import | Free |

---

**References:** [github.com/github/awesome-copilot](https://github.com/github/awesome-copilot) · [awesome-copilot.github.com](https://awesome-copilot.github.com/) · [developers.cloudflare.com/docs-for-agents](https://developers.cloudflare.com/docs-for-agents/) · [reliefweb.int/labs](https://reliefweb.int/labs) · [data.humdata.org](https://data.humdata.org/)

*Last updated: July 27, 2026*
