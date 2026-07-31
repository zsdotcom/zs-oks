import { highlight, getLanguage } from './highlight';
import { sanitizeURL } from './sanitize';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeHtmlAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function renderInline(text: string): string {
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
    const safe = sanitizeURL(url);
    return safe
      ? `<img src="${safe}" alt="${escapeHtmlAttr(alt)}" style="max-width:100%;border-radius:6px;margin:0.4em 0;">`
      : escapeHtmlAttr(alt);
  });
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    const safe = sanitizeURL(url);
    return safe
      ? `<a href="${safe}" target="_blank" rel="noopener">${escapeHtmlAttr(text)}</a>`
      : escapeHtmlAttr(text);
  });
  text = text.replace(/`([^`]+)`/g, (_, c) => '<code>' + escapeHtml(c) + '</code>');
  text = text.replace(/\*\*(.+?)\*\*/g, (_, t) => '<strong>' + escapeHtml(t) + '</strong>');
  text = text.replace(/__(.+?)__/g, (_, t) => '<strong>' + escapeHtml(t) + '</strong>');
  text = text.replace(/\*(.+?)\*/g, (_, t) => '<em>' + escapeHtml(t) + '</em>');
  text = text.replace(/_(.+?)_/g, (_, t) => '<em>' + escapeHtml(t) + '</em>');
  text = text.replace(/~~(.+?)~~/g, (_, t) => '<del>' + escapeHtml(t) + '</del>');
  return text;
}

export function sanitizeOutput(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script\b[^>]*>)<[^<]*)*<\/script\b[^>]*>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe\b[^>]*>)<[^<]*)*<\/iframe\b[^>]*>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object\b[^>]*>)<[^<]*)*<\/object\b[^>]*>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed\b[^>]*>)<[^<]*)*<\/embed\b[^>]*>/gi, '')
    .replace(/\bon\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\bon\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript\s*:/gi, '');
}

export function parse(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    const codeFence = line.match(/^```(\w*)$/);
    if (codeFence) {
      const lang = codeFence[1] || '';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].match(/^```\s*$/)) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      const rawCode = codeLines.join('\n');
      const langClass = lang ? getLanguage(lang) : '';
      const highlighted = lang ? highlight(rawCode, lang) : escapeHtml(rawCode);
      html.push(`<pre><code class="hljs${langClass ? ' language-' + langClass : ''}">${highlighted}</code></pre>`);
      continue;
    }

    if (line.trim().startsWith('$$')) {
      const mathLines: string[] = [line.trim().replace(/^\$\$/, '')];
      i++;
      while (i < lines.length && !lines[i].trim().endsWith('$$')) {
        mathLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        mathLines.push(lines[i].trim().replace(/\$\$$/, ''));
        i++;
      }
      const mathExpr = mathLines.join(' ').trim();
      html.push(`<div class="katex-display"><span class="katex-math" data-math="${escapeHtml(mathExpr)}">${escapeHtml(mathExpr)}</span></div>`);
      continue;
    }

    const inlineMath = line.match(/\$([^\$\n]+)\$/g);
    let processedLine = line;
    if (inlineMath) {
      for (const match of inlineMath) {
        const expr = match.slice(1, -1);
        processedLine = processedLine.replace(match, `<span class="katex-inline" data-math="${escapeHtml(expr)}">${escapeHtml(expr)}</span>`);
      }
    }

    const headingMatch = processedLine.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const id = headingMatch[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      html.push(`<h${level} id="${id}">${renderInline(headingMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    if (line.match(/^(-{3,}|\*{3,}|_{3,})\s*$/)) {
      html.push('<hr>');
      i++;
      continue;
    }

    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      html.push(`<blockquote>${quoteLines.map((l) => `<p>${renderInline(l)}</p>`).join('')}</blockquote>`);
      continue;
    }

    if (line.match(/^\s*[-*+]\s+/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*+]\s+/)) {
        listItems.push(`<li>${renderInline(lines[i].replace(/^\s*[-*+]\s+/, ''))}</li>`);
        i++;
      }
      html.push(`<ul>${listItems.join('')}</ul>`);
      continue;
    }

    if (line.match(/^\s*\d+\.\s+/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s+/)) {
        listItems.push(`<li>${renderInline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`);
        i++;
      }
      html.push(`<ol>${listItems.join('')}</ol>`);
      continue;
    }

    if (line.match(/^\s*[-*+]\s+\[[ x]\]\s+/)) {
      const taskItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*+]\s+\[[ x]\]\s+/)) {
        const checked = lines[i].includes('[x]');
        const text = lines[i].replace(/^\s*[-*+]\s+\[[ x]\]\s+/, '');
        taskItems.push(`<li><input type="checkbox" ${checked ? 'checked' : ''} disabled> ${renderInline(text)}</li>`);
        i++;
      }
      html.push(`<ul style="list-style:none;padding-left:0.5em;">${taskItems.join('')}</ul>`);
      continue;
    }

    if (line.includes('|') && lines[i + 1]?.match(/^\|?\s*[-:]+[-| :\s]*$/)) {
      const headerCells = line.split('|').map((c) => c.trim()).filter(Boolean);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|')) {
        const cells = lines[i].split('|').map((c) => c.trim()).filter(Boolean);
        rows.push(cells);
        i++;
      }
      html.push('<div style="overflow-x:auto;"><table><thead><tr>');
      headerCells.forEach((cell) => { html.push(`<th>${renderInline(cell)}</th>`); });
      html.push('</tr></thead><tbody>');
      rows.forEach((row) => {
        html.push('<tr>');
        row.forEach((cell) => { html.push(`<td>${renderInline(cell)}</td>`); });
        html.push('</tr>');
      });
      html.push('</tbody></table></div>');
      continue;
    }

    html.push(`<p>${renderInline(processedLine)}</p>`);
    i++;
  }

  return sanitizeOutput(html.join('\n'));
}

export function generateTOC(markdown: string): { id: string; text: string; level: number }[] {
  const lines = markdown.split('\n');
  const toc: { id: string; text: string; level: number }[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc.push({ id, text, level });
    }
  }
  return toc;
}
