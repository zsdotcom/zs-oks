# Google Workspace MCP Server (Google Apps Script)

Exposes Google Drive, Docs, Sheets, Gmail, and Tasks as MCP tools using Google Apps Script.

## Deployment

1. Go to [script.google.com](https://script.google.com) and create a new project.
2. Copy-paste `Code.gs` contents into the editor.
3. Set your Gemini API key in the script properties.
4. Deploy as **Web App**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL.
6. In Open Knowledge Studio → MCP panel → Add Server → Paste URL.

## Tools Exposed

| Tool | Description |
|------|-------------|
| `drive_list` | List files in Drive |
| `drive_read` | Read file content |
| `docs_create` | Create a new Google Doc |
| `sheets_create` | Create a new Google Sheet with data |
| `gmail_send` | Send email via Gmail |
| `tasks_list` | List Tasks from default list |
| `tasks_create` | Create a new Task |
