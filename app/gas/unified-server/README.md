# Unified MCP + A2A Server (Google Apps Script)

Single Google Apps Script deployment that serves both MCP and A2A protocols.

## Deployment

1. Go to [script.google.com](https://script.google.com) → New project.
2. Copy-paste `Code.gs` into the editor.
3. Enable services: Drive, Docs, Sheets, Gmail, Tasks API.
4. Deploy as **Web App** (Execute as: Me, Access: Anyone).
5. Use the Web App URL as both:
   - MCP Server URL (in Open Knowledge Studio MCP panel)
   - A2A Agent Card URL (run `getRegisteringAgentCardURL()`)
