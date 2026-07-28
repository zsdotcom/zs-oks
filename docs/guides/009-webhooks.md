---
title: "009 — Webhook Event System"
description: "Webhook event system including creation flow, payload format, use cases, and integration patterns"
category: "guides"
order: 9
tags: ["webhooks", "events", "automation", "payloads"]
last_updated: "2026-07-28"
audience: "users"
---

# 009 — Webhooks Guide

---

## 1. What are Webhooks?

Webhooks are **HTTP callbacks** that fire when specific events occur in Open Knowledge Studio. They allow the app to send real-time notifications to external services (Discord, Slack, custom APIs, etc.) whenever a relevant action happens — without polling or manual checking.

Webhooks are managed through the **WebhookManager** component and stored in `localStorage`.

Implemented in `src/components/WebhookManager.tsx` and `src/services/webhookService.ts`.

---

## 2. How Webhooks Work

```
Event occurs ──→ fireWebhooks(event, payload)
                       │
                       ▼
          Find all active webhooks subscribed to this event
                       │
                       ▼
          Send HTTP request (POST/PUT/GET) to each webhook URL
                       │
                       ▼
          Payload includes: { event, payload, timestamp }
```

---

## 3. Creating a Webhook

### Step-by-Step

1. **Open the Webhook Manager**: Access it from the tools panel or settings area
2. **Click "Add Webhook"** to open the creation form
3. **Configure the webhook**:

| Field | Description | Example |
|:---|:---|:---|
| **Name** | A friendly label | "Discord Alert Channel" |
| **URL** | The endpoint to call | `https://discord.com/api/webhooks/...` |
| **Method** | HTTP method | `POST` (default) |
| **Headers** | Optional custom headers | `Authorization: Bearer token` |
| **Events** | Which events trigger this webhook | Select from the checklist |
| **Active** | Enable/disable | On |

4. **Click Save** — the webhook is stored and activated

### Adding Custom Headers

You can add custom HTTP headers by clicking **"Add Header"** and entering key-value pairs. Common headers include:

- `Authorization` for bearer token authentication
- `Content-Type` (defaults to `application/json`)
- Custom API keys required by your endpoint

---

## 4. Available Events

The following events can trigger webhooks:

| Event | Trigger | Payload Contains |
|:---|:---|:---|
| `chat:message` | A new chat message is sent | `{ sender, text, timestamp, sessionId }` |
| `file:created` | A new file/document is created | `{ fileId, fileName, type, timestamp }` |
| `memory:stored` | A memory entry is saved | `{ memoryType, key, summary, timestamp }` |
| `a2a:complete` | An A2A agent debate finishes | `{ prompt, agents, responseCount, durationMs, timestamp }` |

### Payload Format

All webhooks receive a JSON body with this structure:

```json
{
  "event": "chat:message",
  "payload": {
    "sender": "user",
    "text": "Hello, agents!",
    "sessionId": "session-123",
    "timestamp": "2026-07-27T12:00:00.000Z"
  },
  "timestamp": "2026-07-27T12:00:00.000Z"
}
```

For `GET` method webhooks, the payload is sent as query parameters instead.

---

## 5. Testing Webhooks

### Built-in Test

1. Create a webhook pointed to a test endpoint (e.g., `https://webhook.site/` for testing)
2. Trigger the associated event (e.g., send a chat message to fire `chat:message`)
3. Check the test endpoint to verify the payload was received

### Using webhook.site

1. Go to `https://webhook.site`
2. Copy the unique URL
3. Create a webhook in Open Knowledge Studio with that URL
4. Trigger an event
5. Refresh the webhook.site page to see the captured request

### Manual Test (WebhookManager)

The WebhookManager provides test feedback — after triggering, the `testResult` state shows either success or an error message.

---

## 6. Managing Webhooks

| Action | How |
|:---|:---|
| **Enable/Disable** | Toggle the Active switch |
| **Edit** | Click edit to change URL, method, headers, or events |
| **Remove** | Click the trash icon to permanently delete |
| **View all** | Listed in the WebhookManager with status indicators |

### Disabling vs. Removing

- **Disable**: Temporarily stops the webhook from firing without losing configuration
- **Remove**: Permanently deletes the webhook configuration

---

## 7. Use Cases

### Notifications
- Send a Discord message when an A2A debate completes: "Analysis complete for prompt: [prompt]"
- Get Slack notifications when new files are created in a project
- Email yourself when important memory entries are stored

### Integrations
- Trigger a CI/CD pipeline when a document is exported
- Log all chat activity to an external analytics service
- Sync file creation events with a project management tool

### Automation
- Forward `chat:message` events to a custom AI processing pipeline
- Archive `memory:stored` events to an external knowledge base
- Aggregate `a2a:complete` metrics to a monitoring dashboard

---

## 8. Technical Reference

```typescript
interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  events: string[];
  active: boolean;
  createdAt: string;
}

function addWebhook(config: Omit<WebhookConfig, 'id' | 'createdAt'>): WebhookConfig
function removeWebhook(id: string): void
function updateWebhook(id: string, updates: Partial<WebhookConfig>): WebhookConfig | null
function getAllWebhooks(): WebhookConfig[]
function getWebhooksByEvent(event: string): WebhookConfig[]
function fireWebhooks(event: string, payload: any): Promise<void>
```

Webhook data is stored in `localStorage` under the key `oks-webhooks`.

---

## 9. Troubleshooting

| Issue | Likely Cause | Fix |
|:---|:---|:---|
| Webhook not firing | Webhook is disabled or event not selected | Check Active toggle and event selection |
| HTTP error response | Invalid URL or endpoint rejected | Test URL with `curl` or `Postman` |
| No events listed | No webhooks configured | Add a webhook first |
| Webhook fires but no effect | Method mismatch (expects POST, got GET) | Verify the method matches the endpoint |

---

## See Also

- [Connectors Guide](008-connectors.md) — Connector configurations for external services
- [A2A Agents Guide](001-agents.md) — Agent events that trigger webhooks
- [Multi-Agent Workflows](002-workflows.md) — Workflow completion events
- [Getting Started](000-getting-started.md) — Basic setup and configuration
- [Portal Overview](../index.md) — Full documentation index

---

*Back to [Documentation Home](../index.md)*

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._


