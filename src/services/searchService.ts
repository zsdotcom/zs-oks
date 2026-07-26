import { dbGetAll } from '../db/indexedDB';

export interface SearchResult {
  id: string;
  source: 'file' | 'memory' | 'chat' | 'code';
  title: string;
  snippet: string;
  path: string;
  relevance: number;
  date: string;
}

interface SearchableItem {
  id: string;
  title: string;
  content: string;
  source: SearchResult['source'];
  date: string;
  metadata?: Record<string, any>;
}

let searchIndex: SearchableItem[] = [];
let indexBuilt = false;

export async function buildSearchIndex(): Promise<void> {
  const items: SearchableItem[] = [];

  const files = await dbGetAll<any>('files');
  files.forEach((f) => {
    items.push({
      id: f.id,
      title: f.name,
      content: f.content || '',
      source: 'file',
      date: f.createdAt,
      metadata: { type: f.type, size: f.size },
    });
  });

  const episodic = await dbGetAll<any>('episodic');
  episodic.forEach((e) => {
    items.push({
      id: e.id,
      title: `Memory: ${e.agentId || 'unknown'}`,
      content: e.text || '',
      source: 'memory',
      date: e.createdAt,
    });
  });

  const semantic = await dbGetAll<any>('semantic');
  semantic.forEach((s) => {
    items.push({
      id: s.id,
      title: s.topic || 'Semantic memory',
      content: s.text || '',
      source: 'memory',
      date: s.createdAt,
    });
  });

  const procedural = await dbGetAll<any>('procedural');
  procedural.forEach((p) => {
    items.push({
      id: p.id,
      title: `Skill: ${p.skillId || 'unknown'}`,
      content: p.instructions || '',
      source: 'code',
      date: p.createdAt,
    });
  });

  const sessions = await dbGetAll<any>('sessions');
  sessions.forEach((s) => {
    const msgs = typeof s.messages === 'string' ? JSON.parse(s.messages) : (s.messages || []);
    const text = Array.isArray(msgs) ? msgs.map((m: any) => m.text || '').join(' ') : '';
    items.push({
      id: s.id,
      title: `Chat: ${s.title || 'untitled'}`,
      content: text,
      source: 'chat',
      date: s.createdAt,
    });
  });

  searchIndex = items;
  indexBuilt = true;
}

export function searchAll(query: string, maxResults: number = 20): SearchResult[] {
  if (!query.trim()) return [];
  if (!indexBuilt) { buildSearchIndex().catch(() => {}); return []; }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored = searchIndex.map((item) => {
    const content = (item.title + ' ' + item.content).toLowerCase();
    let score = 0;

    for (const term of terms) {
      if (content.includes(term)) {
        score += 1;
        if (item.title.toLowerCase().includes(term)) score += 2;
        if (content.includes(query.toLowerCase())) score += 3;
      }
    }

    const age = Date.now() - new Date(item.date).getTime();
    const daysOld = age / (1000 * 60 * 60 * 24);
    if (daysOld < 7) score += 1;
    else if (daysOld < 30) score += 0.5;

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => ({
      id: s.item.id,
      source: s.item.source,
      title: s.item.title,
      snippet: truncateAroundMatch(s.item.content, query, 120),
      path: s.item.metadata?.type ? `file/${s.item.title}` : `memory/${s.item.id}`,
      relevance: Math.round((s.score / terms.length) * 100),
      date: s.item.date,
    }));
}

function truncateAroundMatch(text: string, query: string, contextLen: number): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, contextLen) + (text.length > contextLen ? '...' : '');
  const start = Math.max(0, idx - Math.floor(contextLen / 2));
  const end = Math.min(text.length, idx + query.length + Math.floor(contextLen / 2));
  return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
}

export function clearSearchIndex(): void {
  searchIndex = [];
  indexBuilt = false;
}
