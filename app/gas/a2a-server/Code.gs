/**
 * A2A Agent Server for Open Knowledge Studio
 * Google Workspace agent with Drive, Docs, Sheets, Gmail, Tasks tools.
 * Uses A2AApp library.
 */

const A2A_APP_LIB = '1OuHIiA5Ge0MG_SpKdv1JLz8ZS3ouqhvrF5J6gRRr6xFiFPHxkRsgjMI6';

function getRegisteringAgentCardURL() {
  const url = ScriptApp.getService().getUrl();
  return url + '?accessKey=' + PropertiesService.getScriptProperties().getProperty('ACCESS_KEY');
}

function doGet(e) {
  const accessKey = e.parameter.accessKey || '';
  const expectedKey = PropertiesService.getScriptProperties().getProperty('ACCESS_KEY');
  if (expectedKey && accessKey !== expectedKey) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({
    name: 'Google Workspace Agent',
    description: 'A2A agent with access to Drive, Docs, Sheets, Gmail, and Tasks',
    url: ScriptApp.getService().getUrl(),
    capabilities: {
      tools: ['drive_list', 'drive_read', 'docs_create', 'sheets_create', 'gmail_send', 'tasks_list', 'tasks_create']
    }
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const accessKey = params.accessKey || '';
  const expectedKey = PropertiesService.getScriptProperties().getProperty('ACCESS_KEY');
  if (expectedKey && accessKey !== expectedKey) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const tool = params.tool || '';
    const args = params.args || {};
    let result;

    switch (tool) {
      case 'drive_list':
        result = listFiles(args.query);
        break;
      case 'drive_read':
        result = readFile(args.fileId);
        break;
      case 'docs_create':
        result = createDoc(args.title, args.content);
        break;
      case 'sheets_create':
        result = createSheet(args.title, args.data);
        break;
      case 'gmail_send':
        result = sendEmail(args.to, args.subject, args.body);
        break;
      case 'tasks_list':
        result = listTasks();
        break;
      case 'tasks_create':
        result = createTask(args.title, args.notes);
        break;
      default:
        throw new Error('Unknown tool: ' + tool);
    }

    return ContentService.createTextOutput(JSON.stringify({ result })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function listFiles(query) {
  const files = query ? DriveApp.searchFiles(query) : DriveApp.getRootFolder().getFiles();
  const result = [];
  while (files.hasNext()) {
    const f = files.next();
    result.push({ id: f.getId(), name: f.getName(), type: f.getMimeType() });
  }
  return result;
}

function readFile(fileId) {
  const file = DriveApp.getFileById(fileId);
  return { name: file.getName(), content: file.getBlob().getDataAsString() };
}

function createDoc(title, content) {
  const doc = DocumentApp.create(title);
  doc.getBody().setText(content || '');
  return { id: doc.getId(), url: doc.getUrl() };
}

function createSheet(title, data) {
  const ss = SpreadsheetApp.create(title);
  if (data && data.length) {
    ss.getActiveSheet().getRange(1, 1, data.length, data[0].length).setValues(data);
  }
  return { id: ss.getId(), url: ss.getUrl() };
}

function sendEmail(to, subject, body) {
  GmailApp.sendEmail(to, subject, body);
  return { status: 'sent' };
}

function listTasks() {
  const lists = Tasks.Tasklists.list();
  if (!lists.items || !lists.items.length) return [];
  const tasks = Tasks.Tasks.list(lists.items[0].id);
  return (tasks.items || []).map(function(t) { return { id: t.id, title: t.title, status: t.status }; });
}

function createTask(title, notes) {
  const lists = Tasks.Tasklists.list();
  if (!lists.items || !lists.items.length) throw new Error('No task list found');
  const task = Tasks.Tasks.insert({ title: title, notes: notes || '' }, lists.items[0].id);
  return { id: task.id, title: task.title };
}
