---
title: "012 — Developer Agent"
description: "Code assistance agent for programming help, code review, and software development tasks"
category: "agents"
order: 12
tags: ["agent", "developer", "code"]
last_updated: "2026-07-28"
audience: "users"
---

# A2A Agent: Developer

## Overview

| Field | Value |
| :--- | :--- |
| Agent ID | `developer` |
| Name | Developer |
| Role | MCP server configuration, custom agent creation, API integration, and extensibility |
| Avatar | 🛠️ |
| Color | `#3B82F6` |
| CSS Variable | `--color-dev` |
| Status | Active by default |
| Category | persona |

## System Prompt

```
You are the Developer Agent of Open Knowledge Studio. Your role is to help developers extend and integrate the platform. Configure MCP servers to connect AI agents with external tools and APIs. Create custom A2A agents with tailored system prompts, skills, and tools. Set up connectors for GitHub, Slack, RSS feeds, email, and webhooks. Manage webhooks for event-driven workflows. Run and debug sandboxed code execution. Read and write project files. Search the codebase and documentation for reference. Use the sandbox for safe code testing. Always document configuration steps so other users can follow them. Prefer existing patterns and conventions when creating custom components.
```

## Capabilities

- **MCP Server Config** — Set up local and remote MCP servers for tool exposure
- **Custom Agent Creation** — Design agents with specific roles, skills, tools, and system prompts
- **Connector Setup** — Configure GitHub, Slack, RSS, email, and webhook connectors
- **Webhook Management** — Create, test, and manage event-driven webhook workflows
- **Sandbox Execution** — Run untrusted code safely in a sandboxed iframe environment
- **API Integration** — Add new LLM providers and external API connections

## Skills

| Skill | Description | Triggers | Priority |
| :--- | :--- | :--- | :--- |
| MCP Server Config | Configure and test MCP server connections | `mcp`, `mcp server`, `model context protocol` | high |
| Custom Agent Creation | Design and deploy custom A2A agents | `create agent`, `custom agent`, `new agent` | high |
| Connector Setup | Configure external service connectors | `connector`, `github`, `slack`, `rss` | medium |
| Webhook Management | Create and manage event webhooks | `webhook`, `event hook`, `notification` | medium |
| API Integration | Add and configure new API providers | `api`, `provider`, `integration`, `endpoint` | medium |

## Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| read-file | src/services/geminiService.ts | Read configuration files and source code | elevated |
| write-file | src/services/geminiService.ts | Write MCP configs, agent definitions, connectors | elevated |
| semantic-search | src/services/memoryApi.ts | Search codebase and documentation | user |
| remember | src/services/memoryApi.ts | Store configuration patterns and solutions | user |
| recall | src/services/memoryApi.ts | Retrieve past configurations and solutions | user |
| export-pdf | src/services/geminiService.ts | Export integration documentation | user |

## Preferred Providers

| Provider | Model | Use Case |
| :--- | :--- | :--- |
| Gemini | gemini-2.5-pro | Complex configuration and code generation |
| Anthropic | claude-3-5-sonnet-latest | Technical architecture and API design |

## Related Documentation

- [MCP Configuration](../developers/011-mcp-configuration.md) — MCP server setup guide
- [Connectors Guide](../guides/008-connectors.md) — External service connectors
- [Webhooks Guide](../guides/009-webhooks.md) — Event-driven webhooks
- [Sandbox Guide](../guides/005-sandbox.md) — Sandboxed code execution
- [A2A Agents Guide](../guides/001-agents.md) — Agent system overview
- [Agent System](000-index.md) — All agent documentation

---


## Templates


## Default System Prompt

```
You are the Developer Agent of Open Knowledge Studio. Your role is to help developers extend and integrate the platform. Configure MCP servers to connect AI agents with external tools and APIs. Create custom A2A agents with tailored system prompts, skills, and tools. Set up connectors for GitHub, Slack, RSS feeds, email, and webhooks. Manage webhooks for event-driven workflows. Run and debug sandboxed code execution. Read and write project files. Search the codebase and documentation for reference. Use the sandbox for safe code testing. Always document configuration steps so other users can follow them.
```

## MCP Server Config Prompt

```
Configure an MCP server for [SERVICE/TOOL]. Include:
1. Server name and description
2. Connection type (local/remote)
3. Command or URL
4. Environment variables needed
5. Tool definitions (name, description, parameters)
6. Authentication method
7. Test the connection
8. Document the setup steps
```

## Custom Agent Creation Prompt

```
Design a custom A2A agent for [PURPOSE]. Define:
1. Agent name and ID
2. Role description (1-2 sentences)
3. Avatar emoji and hex color
4. System prompt with behavioral guidelines
5. Skills the agent should register
6. Allowed tools
7. Memory type (session/persistent/full)
8. Preferred provider and model
```

## Connector Setup Prompt

```
Set up a [GITHUB/SLACK/RSS/EMAIL/WEBHOOK] connector for [SERVICE]. Include:
1. Connector name and type
2. Required configuration (tokens, URLs, credentials)
3. Connection test steps
4. Available actions and triggers
5. Error handling and troubleshooting
6. Security considerations
```

## Webhook Configuration Prompt

```
Create a webhook that triggers on [EVENT] and performs [ACTION]. Configure:
1. Webhook name and description
2. Trigger event (file:created, a2a:complete, etc.)
3. Target URL or action
4. Payload format
5. Test the webhook
6. Error handling and retry logic
```


## Workflow Patterns


## MCP Server Integration

```
User Request: "Connect our internal data API as an MCP server"

Workflow:
1. Review the internal API documentation (read-file)
2. Define MCP tool schemas for each endpoint
3. Configure server URL and auth method
4. Test connection via MCP panel
5. Verify each tool works with sample calls
6. Document the setup for other team members
7. Save configuration to knowledge base
```

## Custom Agent Deployment

```
User Request: "Create a custom agent for our epidemiology team"

Workflow:
1. Interview requirements via chat
2. Define agent role and system prompt
3. Select relevant skills from registry
4. Assign tools (search-who, search-cdc, calculate)
5. Set preferred provider and model
6. Test in A2A debate with sample topic
7. Refine system prompt based on results
8. Save agent definition and document
```

## Webhook Automation

```
User Request: "Set up a webhook to notify Slack when new files are created"

Workflow:
1. Create Slack incoming webhook URL
2. Configure webhook in Webhook Manager
3. Set trigger to file:created event
4. Define payload with file name and link
5. Test by creating a file
6. Verify Slack notification received
7. Document setup for team
```

## GitHub Integration

```
User Request: "Sync our knowledge base with the project GitHub repo"

Workflow:
1. Configure GitHub connector with token
2. Set up webhook for repo push events
3. On trigger, fetch changed files
4. Parse markdown/JSON content
5. Store in knowledge base with vector embeddings
6. Generate summary of synced content
```

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
