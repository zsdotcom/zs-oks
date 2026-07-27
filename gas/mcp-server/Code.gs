/**
 * Google Workspace MCP Server for Open Knowledge Studio
 * Exposes Drive, Docs, Sheets, Gmail, Tasks as MCP tools.
 */

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const tool = params.tool || '';
  const args = params.args || {};
  const accessKey = params.accessKey || '';

  const expectedKey = PropertiesService.getScriptProperties().getProperty('ACCESS_KEY');
  if (expectedKey && accessKey !== expectedKey) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    let result;
    switch (tool) {
      case 'drive_list': result = driveListFiles(args.query); break;
      case 'drive_read': result = driveReadFile(args.fileId); break;
      case 'docs_create': result = docsCreate(args.title, args.content); break;
      case 'sheets_create': result = sheetsCreate(args.title, args.data); break;
      case 'gmail_send': result = gmailSend(args.to, args.subject, args.body); break;
      case 'tasks_list': result = tasksList(); break;
      case 'tasks_create': result = tasksCreate(args.title, args.notes); break;
      default: throw new Error('Unknown tool: ' + tool);
    }
    return ContentService.createTextOutput(JSON.stringify({ result })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const tool = e.parameter.tool || '';
  if (tool === 'tools') {
    return ContentService.createTextOutput(JSON.stringify({
      tools: [
        { name: 'drive_list', description: 'List files in Google Drive', parameters: 'query: string (optional)' },
        { name: 'drive_read', description: 'Read file content from Drive', parameters: 'fileId: string' },
        { name: 'docs_create', description: 'Create a Google Doc', parameters: 'title: string, content: string' },
        { name: 'sheets_create', description: 'Create a Google Sheet with data', parameters: 'title: string, data: string[][]' },
        { name: 'gmail_send', description: 'Send email via Gmail', parameters: 'to: string, subject: string, body: string' },
        { name: 'tasks_list', description: 'List Google Tasks', parameters: '' },
        { name: 'tasks_create', description: 'Create a Google Task', parameters: 'title: string, notes?: string' },
      ]
    })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ error: 'Use POST' })).setMimeType(ContentService.MimeType.JSON);
}

function driveListFiles(query) {
  const files = query
    ? DriveApp.searchFiles(query)
    : DriveApp.getRootFolder().getFiles();
  const result = [];
  while (files.hasNext()) {
    const f = files.next();
    result.push({ id: f.getId(), name: f.getName(), mimeType: f.getMimeType(), size: f.getSize() });
  }
  return result;
}

function driveReadFile(fileId) {
  const file = DriveApp.getFileById(fileId);
  const blob = file.getBlob();
  return { name: file.getName(), content: blob.getDataAsString(), mimeType: blob.getContentType() };
}

function docsCreate(title, content) {
  const doc = DocumentApp.create(title);
  const body = doc.getBody();
  body.setText(content || '');
  return { id: doc.getId(), url: doc.getUrl() };
}

function sheetsCreate(title, data) {
  const sheet = SpreadsheetApp.create(title);
  if (data && data.length > 0) {
    sheet.getActiveSheet().getRange(1, 1, data.length, data[0].length).setValues(data);
  }
  return { id: sheet.getId(), url: sheet.getUrl() };
}

function gmailSend(to, subject, body) {
  GmailApp.sendEmail(to, subject, body);
  return { status: 'sent', to, subject };
}

function tasksList() {
  const taskLists = Tasks.Tasklists.list();
  if (!taskLists.items || taskLists.items.length === 0) return [];
  const tasks = Tasks.Tasks.list(taskLists.items[0].id);
  return (tasks.items || []).map(function(t) {
    return { id: t.id, title: t.title, notes: t.notes, due: t.due, status: t.status };
  });
}

function tasksCreate(title, notes) {
  const taskLists = Tasks.Tasklists.list();
  if (!taskLists.items || taskLists.items.length === 0) throw new Error('No task list found');
  const task = Tasks.Tasks.insert({ title: title, notes: notes || '' }, taskLists.items[0].id);
  return { id: task.id, title: task.title };
}
