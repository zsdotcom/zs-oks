/**
 * Google Drive File Search for Open Knowledge Studio
 * Fast file search via Drive API, exposed as MCP tool.
 */

function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  var tool = params.tool || '';
  var args = params.args || {};
  var key = params.accessKey || '';
  var expectedKey = PropertiesService.getScriptProperties().getProperty('ACCESS_KEY');

  if (expectedKey && key !== expectedKey) {
    return jsonResponse({ error: 'Unauthorized' });
  }

  try {
    var result;
    switch (tool) {
      case 'search_files': result = searchFiles(args.query, args.limit); break;
      case 'search_by_type': result = searchByType(args.type, args.limit); break;
      case 'recent_files': result = recentFiles(args.limit); break;
      case 'file_info': result = fileInfo(args.fileId); break;
      default: throw new Error('Unknown tool: ' + tool);
    }
    return jsonResponse({ result: result });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function doGet(e) {
  return jsonResponse({
    tools: [
      { name: 'search_files', description: 'Search Drive files by name query', parameters: 'query: string, limit?: number' },
      { name: 'search_by_type', description: 'Search files by MIME type', parameters: 'type: string (pdf|doc|sheet|image|all), limit?: number' },
      { name: 'recent_files', description: 'List recently modified files', parameters: 'limit?: number' },
      { name: 'file_info', description: 'Get file metadata', parameters: 'fileId: string' },
    ]
  });
}

function searchFiles(query, limit) {
  limit = limit || 20;
  var files = DriveApp.searchFiles("title contains '" + query.replace(/'/g, "\\'") + "'");
  return collectFiles(files, limit);
}

function searchByType(type, limit) {
  limit = limit || 20;
  var mimeMap = { pdf: 'application/pdf', doc: 'application/vnd.google-apps.document', sheet: 'application/vnd.google-apps.spreadsheet', image: 'image/' };
  var mimeSearch = mimeMap[type];
  var files = mimeSearch ? DriveApp.searchFiles("mimeType='" + mimeSearch.replace(/'/g, "\\'") + "'") : DriveApp.getRootFolder().getFiles();
  return collectFiles(files, limit);
}

function recentFiles(limit) {
  limit = limit || 20;
  var files = DriveApp.getRootFolder().getFiles();
  var results = collectFiles(files, 100);
  results.sort(function(a, b) { return new Date(b.modifiedTime) - new Date(a.modifiedTime); });
  return results.slice(0, limit);
}

function fileInfo(fileId) {
  var file = DriveApp.getFileById(fileId);
  return {
    id: file.getId(), name: file.getName(), type: file.getMimeType(),
    size: file.getSize(), created: file.getDateCreated(), modified: file.getLastUpdated(),
    owner: file.getOwner().getEmail(), url: file.getUrl(),
    description: file.getDescription(),
  };
}

function collectFiles(iterator, limit) {
  var results = [];
  while (iterator.hasNext() && results.length < limit) {
    var f = iterator.next();
    results.push({
      id: f.getId(), name: f.getName(), type: f.getMimeType(),
      size: f.getSize(), modifiedTime: f.getLastUpdated().toISOString(),
    });
  }
  return results;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
