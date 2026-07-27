/**
 * Gemini + Google Drive File Processor for Open Knowledge Studio
 * Analyze and process Drive files using the Gemini API.
 */

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const action = params.action || '';
  const key = params.accessKey || '';
  const expectedKey = PropertiesService.getScriptProperties().getProperty('ACCESS_KEY');
  if (expectedKey && key !== expectedKey) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' })).setMimeType(ContentService.MimeType.JSON);
  }
  try {
    var result;
    switch (action) {
      case 'summarize': result = summarizeFile(params.fileId); break;
      case 'analyze': result = analyzeContent(params.content); break;
      case 'list_pdfs': result = listPDFs(params.query); break;
      case 'extract_text': result = extractText(params.fileId); break;
      default: throw new Error('Unknown action: ' + action);
    }
    return ContentService.createTextOutput(JSON.stringify({ result: result })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    actions: [
      { name: 'summarize', params: 'fileId: string' },
      { name: 'analyze', params: 'content: string' },
      { name: 'list_pdfs', params: 'query: string (optional)' },
      { name: 'extract_text', params: 'fileId: string' },
    ]
  })).setMimeType(ContentService.MimeType.JSON);
}

function summarizeFile(fileId) {
  var file = DriveApp.getFileById(fileId);
  var text = file.getBlob().getDataAsString();
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('Gemini API key not configured');

  var payload = {
    contents: [{ parts: [{ text: 'Summarize the following document in 3-5 bullet points:\n\n' + text.slice(0, 30000) }] }]
  };

  var response = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' + apiKey, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  var data = JSON.parse(response.getContentText());
  var summary = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
    ? data.candidates[0].content.parts.map(function(p) { return p.text; }).join('\n')
    : 'Summary generation failed';

  return { fileId: fileId, fileName: file.getName(), summary: summary };
}

function analyzeContent(content) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('Gemini API key not configured');

  var payload = {
    contents: [{ parts: [{ text: 'Analyze the following content. Extract: key topics, main arguments, data points, and conclusions:\n\n' + content.slice(0, 30000) }] }]
  };

  var response = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' + apiKey, {
    method: 'POST', contentType: 'application/json', payload: JSON.stringify(payload), muteHttpExceptions: true,
  });
  var data = JSON.parse(response.getContentText());
  return data.candidates && data.candidates[0] && data.candidates[0].content
    ? data.candidates[0].content.parts.map(function(p) { return p.text; }).join('\n')
    : 'Analysis failed';
}

function listPDFs(query) {
  var searchQuery = "mimeType='application/pdf'";
  if (query) searchQuery += " and title contains '" + query.replace(/'/g, "\\'") + "'";
  var files = DriveApp.searchFiles(searchQuery);
  var results = [];
  while (files.hasNext()) {
    var f = files.next();
    results.push({ id: f.getId(), name: f.getName(), size: f.getSize(), date: f.getLastUpdated() });
  }
  return results;
}

function extractText(fileId) {
  var file = DriveApp.getFileById(fileId);
  return { name: file.getName(), content: file.getBlob().getDataAsString(), type: file.getMimeType() };
}
