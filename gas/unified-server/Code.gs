/**
 * Unified MCP + A2A Server for Open Knowledge Studio
 * Single server handling both MCP and A2A protocols.
 */

function getRegisteringAgentCardURL() {
  return ScriptApp.getService().getUrl() + '?accessKey=' + getAccessKey();
}

function getAccessKey() {
  return PropertiesService.getScriptProperties().getProperty('ACCESS_KEY') || '';
}

function checkAccess(e) {
  const key = e.parameter.accessKey || e.parameter.access_key || '';
  const expected = getAccessKey();
  if (expected && key !== expected) throw new Error('Unauthorized');
}

function doGet(e) {
  try { checkAccess(e); } catch (err) { return errorResponse('Unauthorized'); }

  const path = e.parameter.path || '';

  // A2A agent card
  if (path === 'a2a' || e.parameter.a2a === 'true') {
    return ContentService.createTextOutput(JSON.stringify({
      name: 'Open Knowledge Studio Unified Server',
      description: 'MCP + A2A server with Google Workspace tools',
      url: ScriptApp.getService().getUrl(),
      capabilities: { tools: ['drive_list', 'drive_read', 'docs_create', 'sheets_create', 'gmail_send', 'tasks_list', 'tasks_create'] }
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // MCP tool listing
  return ContentService.createTextOutput(JSON.stringify({
    tools: [
      { name: 'drive_list', description: 'List Drive files', inputSchema: { type: 'object', properties: { query: { type: 'string' } } } },
      { name: 'drive_read', description: 'Read Drive file', inputSchema: { type: 'object', properties: { fileId: { type: 'string' } }, required: ['fileId'] } },
      { name: 'docs_create', description: 'Create Google Doc', inputSchema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' } }, required: ['title'] } },
      { name: 'sheets_create', description: 'Create Google Sheet', inputSchema: { type: 'object', properties: { title: { type: 'string' }, data: { type: 'array' } }, required: ['title'] } },
      { name: 'gmail_send', description: 'Send Gmail', inputSchema: { type: 'object', properties: { to: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' } }, required: ['to', 'subject'] } },
      { name: 'tasks_list', description: 'List Tasks', inputSchema: { type: 'object', properties: {} } },
      { name: 'tasks_create', description: 'Create Task', inputSchema: { type: 'object', properties: { title: { type: 'string' }, notes: { type: 'string' } }, required: ['title'] } },
    ]
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const key = params.accessKey || '';
    const expected = getAccessKey();
    if (expected && key !== expected) throw new Error('Unauthorized');

    const tool = params.tool || params.name || '';
    const args = params.args || params.arguments || {};
    let result;

    switch (tool) {
      case 'drive_list': result = execDriveList(args.query); break;
      case 'drive_read': result = execDriveRead(args.fileId); break;
      case 'docs_create': result = execDocsCreate(args.title, args.content); break;
      case 'sheets_create': result = execSheetsCreate(args.title, args.data); break;
      case 'gmail_send': result = execGmailSend(args.to, args.subject, args.body); break;
      case 'tasks_list': result = execTasksList(); break;
      case 'tasks_create': result = execTasksCreate(args.title, args.notes); break;
      default: throw new Error('Unknown tool: ' + tool);
    }

    return successResponse(result);
  } catch (err) {
    return errorResponse(err.message);
  }
}

function execDriveList(query) {
  const files = query ? DriveApp.searchFiles(query) : DriveApp.getRootFolder().getFiles();
  const result = [];
  while (files.hasNext()) { var f = files.next(); result.push({ id: f.getId(), name: f.getName(), type: f.getMimeType() }); }
  return result;
}
function execDriveRead(fileId) { var f = DriveApp.getFileById(fileId); return { name: f.getName(), content: f.getBlob().getDataAsString() }; }
function execDocsCreate(title, content) { var d = DocumentApp.create(title); d.getBody().setText(content || ''); return { id: d.getId(), url: d.getUrl() }; }
function execSheetsCreate(title, data) { var s = SpreadsheetApp.create(title); if (data && data.length) s.getActiveSheet().getRange(1, 1, data.length, data[0].length).setValues(data); return { id: s.getId(), url: s.getUrl() }; }
function execGmailSend(to, subject, body) { GmailApp.sendEmail(to, subject, body); return { status: 'sent' }; }
function execTasksList() { var l = Tasks.Tasklists.list(); if (!l.items || !l.items.length) return []; var t = Tasks.Tasks.list(l.items[0].id); return (t.items || []).map(function(i) { return { id: i.id, title: i.title, status: i.status }; }); }
function execTasksCreate(title, notes) { var l = Tasks.Tasklists.list(); if (!l.items || !l.items.length) throw new Error('No task list'); var t = Tasks.Tasks.insert({ title: title, notes: notes || '' }, l.items[0].id); return { id: t.id, title: t.title }; }

function successResponse(data) { return ContentService.createTextOutput(JSON.stringify({ result: data })).setMimeType(ContentService.MimeType.JSON); }
function errorResponse(msg) { return ContentService.createTextOutput(JSON.stringify({ error: msg })).setMimeType(ContentService.MimeType.JSON); }
