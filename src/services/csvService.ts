export interface CSVParseResult {
  headers: string[];
  rows: string[][];
  columnTypes: string[];
  rowCount: number;
}

export function parseCSV(text: string): CSVParseResult {
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === '\n' && !inQuotes) {
      lines.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) lines.push(current);

  const parsedRows: string[][] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const fields: string[] = [];
    let field = '';
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (q && line[i + 1] === '"') { field += '"'; i++; }
        else q = !q;
      } else if (ch === ',' && !q) {
        fields.push(field.trim());
        field = '';
      } else {
        field += ch;
      }
    }
    fields.push(field.trim());
    parsedRows.push(fields);
  }

  if (parsedRows.length === 0) return { headers: [], rows: [], columnTypes: [], rowCount: 0 };

  const headers = parsedRows[0];
  const rows = parsedRows.slice(1);

  const columnTypes = headers.map((_, colIdx) => {
    const sampleValues = rows.slice(0, 20).map((r) => r[colIdx]).filter(Boolean);
    if (sampleValues.length === 0) return 'text';
    const numbers = sampleValues.filter((v) => /^-?\d+(\.\d+)?$/.test(v.replace(/,/g, '')));
    if (numbers.length > sampleValues.length * 0.7) return 'number';
    const dates = sampleValues.filter((v) => !isNaN(Date.parse(v)));
    if (dates.length > sampleValues.length * 0.7) return 'date';
    return 'text';
  });

  return { headers, rows, columnTypes, rowCount: rows.length };
}

export interface CSVSummary {
  headers: string[];
  columnTypes: string[];
  rowCount: number;
  preview: string[][];
}

export function getCSVSummary(content: string, maxPreview = 10): CSVSummary {
  const parsed = parseCSV(content);
  return {
    headers: parsed.headers,
    columnTypes: parsed.columnTypes,
    rowCount: parsed.rowCount,
    preview: parsed.rows.slice(0, maxPreview),
  };
}
