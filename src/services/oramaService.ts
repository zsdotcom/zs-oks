import type { DBSchema } from '../db/indexedDB';

let db: any = null;
let oramaInsert: any = null;
let oramaSearch: any = null;
let oramaRemove: any = null;
let initPromise: Promise<any> | null = null;

export type OramaEntry = {
  id: string;
  projectId: string;
  agentId: string;
  topic: string;
  text: string;
  embedding: number[];
  createdAt: string;
};

async function initOrama() {
  if (db) return db;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    // @ts-expect-error - CDN dynamic import, not an npm package
    const mod = await import('https://cdn.jsdelivr.net/npm/@orama/orama@3.0.0/dist/index.js');
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
    return db;
  })();
  return initPromise;
}

export async function oramaInsertEntry(entry: OramaEntry): Promise<void> {
  const instance = await initOrama();
  await oramaInsert(instance, entry);
}

export async function oramaSearchEntries(query: string, topK = 5): Promise<OramaEntry[]> {
  const instance = await initOrama();
  const results = await oramaSearch(instance, {
    term: query,
    mode: 'hybrid',
    limit: topK,
  });
  return results.hits.map((h: any) => h.document);
}

export async function oramaRemoveEntry(id: string): Promise<void> {
  const instance = await initOrama();
  await oramaRemove(instance, id);
}

export async function oramaClear(): Promise<void> {
  db = null;
  initPromise = null;
  oramaInsert = null;
  oramaSearch = null;
  oramaRemove = null;
}
