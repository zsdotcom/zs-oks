# Google Workspace A2A Agent Server (Google Apps Script)

Deploys an Agent-to-Agent (A2A) server with Google Workspace tools.

## Deployment

1. Go to [script.google.com](https://script.google.com) → New project.
2. Add the A2AApp library: `1OuHIiA5Ge0MG_SpKdv1JLz8ZS3ouqhvrF5J6gRRr6xFiFPHxkRsgjMI6`
3. Copy-paste `Code.gs` into the editor.
4. Enable services: Drive, Docs, Sheets, Gmail, Tasks API.
5. Deploy as **Web App** (Execute as: Me, Access: Anyone).
6. Run `getRegisteringAgentCardURL()` to get the A2A agent card URL.
7. Add the URL to Open Knowledge Studio → MCP panel.
