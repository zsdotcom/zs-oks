---
title: "011 — 011 Connectors"
description: "Connecting external services via GitHub, Slack, RSS, and email connectors"
category: "onboarding"
order: 11
tags: ["onboarding", "walkthrough"]
last_updated: "2026-07-28"
audience: "users"
---
# 011 — Connectors

Connectors integrate Open Knowledge Studio with external services. You can sync data from GitHub, send messages to Slack/Discord/Telegram, and more.

## Available Connector Types

| Type | Icon | Purpose |
|------|------|---------|
| **GitHub** | 🐙 | Sync issues, PRs, and repo data |
| **Slack** | 💬 | Send alerts and notifications |
| **RSS** | 📡 | Monitor news feeds and blogs |
| **Webhook** | 🔗 | Send data to any HTTP endpoint |
| **Email** | 📧 | Trigger email notifications |
| **Discord** | 🎮 | Post messages to Discord channels |
| **Telegram** | ✈️ | Send messages via Telegram bot |
| **Notion** | 📝 | Sync with Notion databases |
| **Linear** | 📋 | Track Linear issues |
| **Jira** | 🪲 | Integrate with Jira boards |

## Step-by-Step

- [ ] **1. Go to Tools → Connectors** — Click the **Tools** tab, then the **Connectors** sub-tab.

- [ ] **2. Add a connector** — Click **+ Add Connector** to open the form.

- [ ] **3. Configure GitHub (example)**:
  - Name: "My GitHub Repo"
  - Type: GitHub
  - Token: Your GitHub personal access token
  - Repository: `owner/repo-name`
  - Click **Save Connector**

- [ ] **4. Test the connection** — Click **Test** to verify the connector works.

- [ ] **5. Sync data** — Click **Sync** to fetch data from the external service. Synced data appears in the connector's data store.

- [ ] **6. Configure Discord (example)**:
  - Name: "Team Alerts"
  - Type: Discord
  - Webhook URL: Create a webhook in your Discord channel settings
  - Click **Save Connector** and **Test**

## Connector Status

- 🟢 **Connected** — The connector is working and data has been fetched
- 🔘 **Disconnected** — Not yet tested
- 🔴 **Error** — Connection failed, check your credentials

## Syncing

- Each connector stores fetched data in IndexedDB
- Use the **Sync** button to manually refresh data
- The app can poll connectors automatically (configured in Settings)
- RSS feeds update with new items from the feed URL

## Use Cases

| Connector | Example Use |
|-----------|-------------|
| GitHub | Monitor project issues and PRs from within the app |
| RSS | Track outbreak news from WHO/DON RSS feeds |
| Discord | Send agent debate results to your team channel |
| Slack | Alert when new surveillance data is available |
| Webhook | Trigger external automation pipelines |
| Email | Notify team members on project milestones |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "401 Unauthorized" | Check your token/key is valid and has correct permissions |
| "Connection failed" | Verify the URL/endpoint is accessible |
| No data after sync | Check that the connector type supports data fetching |
| RSS returns nothing | Verify the feed URL returns valid XML |

---

**Next step:** [012 — Kanban Boards](./012-kanban.md)

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
