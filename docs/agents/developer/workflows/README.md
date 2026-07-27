# Developer — Workflow Patterns

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

*Back to [Developer SKILL](../SKILL.md) | [Agent System](../../SKILL.md)*
