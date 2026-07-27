# 007 — Using Tools & MCP Servers

Tools extend what the AI can do — search the web, run calculations, analyze code, and more. MCP servers connect to external APIs for real-time data.

## Built-in Tools (47 available)

### Search Tools
| Tool | Description |
|------|-------------|
| Web Search | Search the web via Brave Search API |
| Wikipedia Search | Search and fetch Wikipedia articles |
| arXiv Search | Search academic papers on arXiv |
| OpenAlex Search | Search scholarly works |
| PubMed Search | Search biomedical literature |
| GitHub Search | Search GitHub repos, code, or issues |
| World Bank Data | Query World Bank indicators |
| Open Library Search | Search books and works |
| News Headlines | Fetch top headlines by category |
| Google Books | Search publications and reviews |
| Europe PMC Search | Search life science literature |
| CrossRef Search | Search scholarly works and DOIs |

### AI & Analysis Tools
| Tool | Description |
|------|-------------|
| Code Review | Analyze code for bugs and security issues |
| Generate Tests | Generate unit/integration test cases |
| Code Documentation | Generate documentation from code |
| API Spec Generator | Generate OpenAPI specs |
| Sentiment Analysis | Analyze text sentiment |
| Entity Extraction | Extract named entities from text |
| Text Summarization | Generate concise summaries |
| Topic Modeling | Identify key topics in content |
| SQL Query Builder | Build SQL queries from descriptions |

### Content & Media Tools
| Tool | Description |
|------|-------------|
| Web Scrape | Extract content from web pages |
| HTML to Markdown | Convert HTML to Markdown |
| Infer JSON Schema | Infer schema from sample data |
| Markdown TOC | Generate table of contents |
| Code Formatter | Format code with style rules |
| Data Validation | Validate data against schemas |

### Integration Tools
| Tool | Description |
|------|-------------|
| Discord Webhook | Send messages via Discord |
| Telegram Bot | Send messages via Telegram |
| Batch Process | Run pipeline on multiple items |
| Spawn Agent | Create sub-agents with isolated workspaces |

## MCP Servers (11 available)

| Server | Description |
|--------|-------------|
| CDC Disease Surveillance | NNDSS, PLACES, and CDC datasets |
| WHO Global Health Observatory | Global health indicators, SDG data |
| CMU Delphi Epidata | Flu, COVID-19, dengue surveillance |
| InfectoNET Genomic Surveillance | Pathogen genomic data, outbreak alerts |
| Brave Search | Web and local search |
| GitHub API | Repos, code search, issues, PRs |
| World Bank Data | Development indicators |
| Open Library | Books, works, subjects |
| News Headlines | Top headlines and article search |
| Google Books | Publication search |

## Step-by-Step

- [ ] **1. Go to Tools** — Click the **Tools** tab in the header.

- [ ] **2. Browse tools** — See all 47 built-in tools grouped by category. Each card shows the name, permission level, and description.

- [ ] **3. Understand permissions**:
  - 🟢 **Safe** — No risk, no confirmation needed
  - 🔵 **Standard** — General purpose, always allowed
  - 🟡 **Elevated** — Requires user confirmation
  - 🔴 **Admin** — Sensitive operations

- [ ] **4. Go to MCP Servers** — Click the **MCP** tab in the header.

- [ ] **5. Explore servers** — See all 11 pre-configured MCP servers. Click a server to expand and see its tools.

- [ ] **6. Toggle tools on/off** — Use the checkbox next to each tool to activate/deactivate it.

- [ ] **7. Add a custom server** — Click **+** to add your own MCP server with custom tools.

## Using Tools in Chat

When you ask the AI to perform a task, it automatically uses available tools. You can also trigger tools directly using:

```
!tool <toolName> param1=value param2=value
```

For example: `!tool web_search query=latest outbreak news count=5`

---

**Next step:** [008 — Creating Documents](./008-documents.md)
