---
title: "000 — Getting Started"
description: "First-time user walkthrough covering interface tour, first chat, and first document creation"
category: "guides"
order: 0
tags: ["getting-started", "walkthrough", "first-time"]
last_updated: "2026-07-28"
audience: "users"
---

# 000 — Getting Started Guide

---

## 1. What is Open Knowledge Studio?

Open Knowledge Studio is a **zero-dependency, browser-native, offline-first** research platform powered by 12 A2A debate agents. It combines AI chat, document editing, knowledge management, data analysis, and epidemiological tools in a single application — with no backend server and no data leaving your browser.

All data is stored locally in IndexedDB. AI providers (Gemini, Groq, etc.) are called directly from the browser using API keys you configure.

---

## 2. Opening the App

If you're running the development version:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. You should see the main interface with a dark theme, a sidebar on the left, and a chat panel ready for input.

---

## 3. Interface Tour

```
┌─────────────────────────────────────────────────────┐
│ Header: Logo · View toggles · Panel icons · Theme   │
├────────┬────────────────────────────────────────────┤
│        │                                            │
│Sidebar │         Main Panel Area                    │
│Files   │   (Chat / Documents / Tools)              │
│Folders │                                            │
│Search  │                                            │
│        │                                            │
├────────┴────────────────────────────────────────────┤
│ Status Bar: Online · Provider · Memory              │
└─────────────────────────────────────────────────────┘
```

### Header
- **Logo** — Click to return to the home view
- **View toggles** — Switch between Chat, Documents, and Tools
- **Panel icons** — Open side panels: EpiMap (MapPin), ICD-11 (Book), Settings (Gear)
- **Theme toggle** — Switch between dark and light mode
- **Connection status** — Online/offline indicator

### Sidebar
- **File browser** — Browse and manage documents organized in folders
- **Search** — Full-text search across documents and knowledge base
- **Templates** — Pre-built document templates (WHO field reports, line listings, etc.)

### Main Panel
- **Chat Interface** — Talk to A2A agents, run workflows, generate content
- **Document Editor** — Create and edit markdown documents with live preview
- **Workspace Manager** — Organize projects and files

### Status Bar
- Online/offline indicator
- Active AI provider and model
- Memory usage estimate

---

## 4. Starting a Chat

1. The chat input is at the bottom of the main panel
2. Type a message (e.g., "What can you help me with?")
3. Press Enter or click the send button
4. The active A2A agents will respond based on their roles

You can mention specific agents by name (e.g., "@Researcher find recent papers on mRNA vaccines") or just ask a general question for the agents to debate.

---

## 5. Creating a Document

1. Click the **FileText** icon or navigate to Documents view
2. Click the **+** button in the sidebar
3. Choose a template or start with a blank document
4. Write your content in markdown
5. Click the **Export PDF** or **Print to PDF** buttons in the toolbar

---

## 6. Using A2A Agents

The 12 built-in agents work in parallel to analyze your prompts from different perspectives:

| Agent | What It Does |
|:---|:---|
| Coordinator | Breaks down complex tasks, delegates, and synthesizes results |
| Researcher | Searches free APIs (Wikipedia, PubMed, WHO, CDC) for information |
| Data Analyst | Processes data, runs statistics, generates charts and diagrams |
| Writer | Drafts documents, applies templates, formats citations |
| Reviewer | Audits quality, checks citations, validates methodology |
| Librarian | Manages memory, organizes knowledge, builds glossaries |

Toggle agents on/off in the chat interface — click the agent indicator to see which are active.

For a full guide, see [A2A Agents Guide](001-agents.md).

---

## 7. Changing Settings

1. Click the **Settings** (Gear) icon in the header
2. Configure:

| Setting | What to Enter |
|:---|:---|
| AI Provider | Gemini, Groq, OpenAI, Anthropic, etc. |
| API Key | Your API key for the chosen provider |
| Model | Select the model version |
| Theme | Dark or Light mode |

API keys are stored locally in your browser and never sent anywhere except to the AI provider's API.

---

## 8. Dark Mode

Click the **Moon/Sun** icon in the header to toggle between dark and light themes. The interface remembers your preference within the current session.

---

## 9. Five-Minute Walkthrough

1. **Open** the app at `http://localhost:3000`
2. **Configure** your API key in Settings (Gear icon)
3. **Chat** — Type "Create a brief research note about malaria epidemiology in sub-Saharan Africa"
4. **Watch** — The agents respond: Researcher finds data, Data Analyst presents stats, Writer formats the note, Reviewer checks quality
5. **Save** — Click the document icon to save the response as a document
6. **Export** — Open the document and click **Export PDF** to download

---

## 10. Next Steps

- Learn about the [A2A Agents](001-agents.md) in detail
- Explore [Multi-Agent Workflows](002-workflows.md) for complex tasks
- Generate [Diagrams](003-diagrams.md) and math with KaTeX
- Configure [Connectors](008-connectors.md) to external services

---

## See Also

- [A2A Agents Guide](001-agents.md) — Full agent roster and configuration
- [Multi-Agent Workflows](002-workflows.md) — Orchestrated and sequential modes
- [Diagram Generation](003-diagrams.md) — Mermaid and KaTeX in chat
- [PDF Export Guide](004-pdf-export.md) — Exporting documents
- [Portal Overview](../index.md) — Full documentation index

---

*Back to [Documentation Home](../index.md)*

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._


