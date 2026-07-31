import type { DBSchema } from '../db/indexedDB';
import { dbGetAll } from '../db/indexedDB';

let db: any = null;
let oramaInsert: any = null;
let oramaSearch: any = null;
let oramaRemove: any = null;
let initPromise: Promise<any> | null = null;
let fallbackMode = false;

export type OramaEntry = {
  id: string;
  projectId: string;
  agentId: string;
  topic: string;
  text: string;
  embedding: number[];
  createdAt: string;
};

const FALLBACK_ENTRIES: OramaEntry[] = [];

async function loadOramaFromCDN(): Promise<{ create: Function; insert: Function; search: Function; remove: Function }> {
  // @ts-expect-error — CDN dynamic import, not an npm package
  const mod = await import('https://cdn.jsdelivr.net/npm/@orama/orama@3.0.0/dist/index.js');
  return mod;
}

function checkFallbackSearch(query: string, topK = 5): OramaEntry[] {
  const lower = query.toLowerCase();
  const results = FALLBACK_ENTRIES.filter((e) =>
    e.text.toLowerCase().includes(lower) || e.topic.toLowerCase().includes(lower)
  );
  return results.slice(0, topK);
}

async function initOrama() {
  if (db) return db;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const mod = await loadOramaFromCDN();
      db = await mod.create({
        schema: {
          id: 'string',
          projectId: 'string',
          agentId: 'string',
          topic: 'string',
          text: 'string',
          embedding: 'vector[384]',
          createdAt: 'string',
        },
      });
      oramaInsert = mod.insert;
      oramaSearch = mod.search;
      oramaRemove = mod.remove;
      fallbackMode = false;
      return db;
    } catch (err) {
      console.warn('Orama CDN load failed, using fallback search:', err);
      fallbackMode = true;
      initPromise = null;
      return null;
    }
  })();
  return initPromise;
}

export async function oramaRebuildFromDB(): Promise<void> {
  await oramaClear();
  const entries = await dbGetAll<any>('semantic');
  for (const entry of entries) {
    await oramaInsertEntry({
      id: entry.id,
      projectId: entry.projectId,
      agentId: entry.agentId,
      topic: entry.topic,
      text: entry.text,
      embedding: entry.embedding || [],
      createdAt: entry.createdAt,
    });
  }
}

export async function oramaInsertEntry(entry: OramaEntry): Promise<void> {
  if (fallbackMode) { FALLBACK_ENTRIES.push(entry); return; }
  const instance = await initOrama();
  if (!instance) { FALLBACK_ENTRIES.push(entry); return; }
  await oramaInsert(instance, entry);
}

export async function oramaSearchEntries(query: string, topK = 5): Promise<OramaEntry[]> {
  if (fallbackMode) return checkFallbackSearch(query, topK);
  const instance = await initOrama();
  if (!instance) return checkFallbackSearch(query, topK);
  try {
    const results = await oramaSearch(instance, {
      term: query,
      mode: 'hybrid',
      limit: topK,
    });
    return results.hits.map((h: any) => h.document);
  } catch {
    return checkFallbackSearch(query, topK);
  }
}

export async function oramaRemoveEntry(id: string): Promise<void> {
  if (fallbackMode) {
    const idx = FALLBACK_ENTRIES.findIndex((e) => e.id === id);
    if (idx >= 0) FALLBACK_ENTRIES.splice(idx, 1);
    return;
  }
  const instance = await initOrama();
  if (!instance) return;
  await oramaRemove(instance, id);
}

export async function oramaClear(): Promise<void> {
  db = null;
  initPromise = null;
  oramaInsert = null;
  oramaSearch = null;
  oramaRemove = null;
  fallbackMode = false;
  FALLBACK_ENTRIES.length = 0;
}
