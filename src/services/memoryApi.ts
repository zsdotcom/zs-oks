import { dbGet, dbPut, dbDelete, dbGetAll, dbClear, dbGetByIndex, dbSetKey, dbGetKey } from '../db/indexedDB';
import type { DBSchema } from '../db/indexedDB';

/* ─── Tier 1: Session Memory (in-memory, cleared on refresh) ─── */
const sessionStore = new Map<string, any>();

export function storeSession(key: string, value: any): void {
  sessionStore.set(key, value);
}

export function getSession<T>(key: string): T | undefined {
  return sessionStore.get(key);
}

export function clearSession(): void {
  sessionStore.clear();
}

/* ─── Tier 2: Episodic Memory ─── */
export async function storeEpisodic(entry: DBSchema['episodic']): Promise<void> {
  await dbPut('episodic', entry);
}

export async function getEpisodic(id: string): Promise<DBSchema['episodic'] | undefined> {
  return dbGet<DBSchema['episodic']>('episodic', id);
}

export async function getEpisodicByProject(projectId: string, agentId?: string): Promise<DBSchema['episodic'][]> {
  if (agentId) {
    return dbGetByIndex<DBSchema['episodic']>('episodic', 'projectId_agentId', [projectId, agentId]);
  }
  return dbGetByIndex<DBSchema['episodic']>('episodic', 'projectId_agentId', projectId);
}

export async function purgeEpisodic(beforeDate: string): Promise<void> {
  const all = await dbGetAll<DBSchema['episodic']>('episodic');
  for (const entry of all) {
    if (entry.createdAt < beforeDate) {
      await dbDelete('episodic', entry.id);
    }
  }
}

/* ─── Tier 3: Semantic Memory ─── */
export async function storeSemantic(entry: DBSchema['semantic']): Promise<void> {
  if (entry.embedding.length === 0) {
    entry.embedding = await computeEmbedding(entry.text);
  }
  await dbPut('semantic', entry);
  try {
    const { oramaInsertEntry } = await import('./oramaService');
    await oramaInsertEntry(entry as any);
  } catch {}
}

export async function searchSemantic(query: string, topK = 5): Promise<DBSchema['semantic'][]> {
  try {
    const { oramaSearchEntries } = await import('./oramaService');
    const results = await oramaSearchEntries(query, topK);
    if (results.length > 0) return results as DBSchema['semantic'][];
  } catch {}

  const all = await dbGetAll<DBSchema['semantic']>('semantic');
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/);
  return all
    .map((entry) => {
      const textLower = entry.text.toLowerCase();
      const matchCount = queryTerms.filter((t) => textLower.includes(t)).length;
      return { entry, score: matchCount };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => r.entry);
}

export async function deleteSemantic(id: string): Promise<void> {
  await dbDelete('semantic', id);
  try {
    const { oramaRemoveEntry } = await import('./oramaService');
    await oramaRemoveEntry(id);
  } catch {}
}

export async function rebuildSemanticIndex(): Promise<void> {
  const all = await dbGetAll<DBSchema['semantic']>('semantic');
  await dbClear('semantic');
  for (const entry of all) {
    await dbPut('semantic', entry);
  }
}

/* ─── Tier 4: Procedural Memory ─── */
export async function storeProcedural(entry: DBSchema['procedural']): Promise<void> {
  await dbPut('procedural', entry);
}

export async function getProceduralBySkill(skillId: string): Promise<DBSchema['procedural'] | undefined> {
  const all = await dbGetAll<DBSchema['procedural']>('procedural');
  return all.find((e) => e.skillId === skillId);
}

export async function purgeAllProcedural(): Promise<void> {
  // Procedural memory is never auto-purged — this is a no-op by design
}

/* ─── Tier 5: Working Memory ─── */
export async function storeWorking(entry: DBSchema['working']): Promise<void> {
  await dbPut('working', entry);
}

export async function getWorking(sessionId: string): Promise<DBSchema['working'][]> {
  const all = await dbGetAll<DBSchema['working']>('working');
  return all.filter((e) => e.sessionId === sessionId);
}

export async function flushWorking(sessionId: string): Promise<void> {
  const all = await dbGetAll<DBSchema['working']>('working');
  for (const entry of all) {
    if (entry.sessionId === sessionId) {
      await dbDelete('working', entry.id);
    }
  }
}

/* ─── Tier 6: Long-Term Memory ─── */
export async function storeLongTerm(entry: DBSchema['long_term']): Promise<void> {
  await dbPut('long_term', entry);
}

export async function getLongTermByCategory(category: string, projectId?: string): Promise<DBSchema['long_term'][]> {
  const all = await dbGetAll<DBSchema['long_term']>('long_term');
  return all.filter((e) => e.category === category && (!projectId || e.projectId === projectId));
}

export async function purgeAllLongTerm(): Promise<void> {
  // Long-term memory is never auto-purged — this is a no-op by design
}

/* ─── Cross-Tier Operations ─── */
export async function promoteWorkingToEpisodic(sessionId: string, projectId: string): Promise<void> {
  const workingData = await getWorking(sessionId);
  for (const item of workingData) {
    await storeEpisodic({
      id: `ep-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId,
      agentId: item.agentId,
      text: typeof item.value === 'string' ? item.value : JSON.stringify(item.value),
      summary: null,
      createdAt: new Date().toISOString(),
    });
  }
  await flushWorking(sessionId);
}

export async function summarizeEpisodicToSemantic(projectId: string): Promise<void> {
  const all = await dbGetAll<DBSchema['episodic']>('episodic');
  const projectEntries = all.filter((e) => e.projectId === projectId && !e.summary);
  for (const entry of projectEntries) {
    await storeSemantic({
      id: `sem-${entry.id}`,
      projectId,
      agentId: entry.agentId || 'librarian',
      topic: 'auto-summary',
      text: entry.text.slice(0, 500),
      embedding: [],
      createdAt: new Date().toISOString(),
    });
  }
}

/* ─── Embedding Computation (Transformers.js Web Worker) ─── */
let embeddingWorkerInstance: Worker | null = null;
let workerId = 0;
const pendingEmbeddings = new Map<number, { resolve: (v: number[][]) => void; reject: (e: any) => void }>();

async function getEmbeddingWorker(): Promise<Worker> {
  if (embeddingWorkerInstance) return embeddingWorkerInstance;
  embeddingWorkerInstance = new Worker(new URL('./embeddingWorker.ts', import.meta.url), { type: 'module' });
  embeddingWorkerInstance.addEventListener('message', (e) => {
    const { id, embeddings } = e.data;
    const pending = pendingEmbeddings.get(id);
    if (pending) {
      pending.resolve(embeddings);
      pendingEmbeddings.delete(id);
    }
  });
  embeddingWorkerInstance.onerror = (e) => {
    pendingEmbeddings.forEach((pending, id) => {
      pending.reject(e);
      pendingEmbeddings.delete(id);
    });
  };
  return embeddingWorkerInstance;
}

export async function computeEmbedding(text: string): Promise<number[]> {
  const results = await computeEmbeddingsParallel([text]);
  return results[0];
}

export async function computeEmbeddingsParallel(texts: string[]): Promise<number[][]> {
  const id = ++workerId;
  return new Promise(async (resolve) => {
    try {
      const worker = await getEmbeddingWorker();
      pendingEmbeddings.set(id, { resolve, reject: () => resolve(texts.map(() => [])) });
      worker.postMessage({ type: 'embed', texts, id });
      setTimeout(() => {
        if (pendingEmbeddings.has(id)) {
          pendingEmbeddings.delete(id);
          resolve(texts.map(() => []));
        }
      }, 30000);
    } catch {
      resolve(texts.map(() => []));
    }
  });
}

/* ─── Workspace Isolation ─── */
export function generateIsolatedKey(projectId: string, agentId: string, actionId: string): string {
  return `${projectId}:${agentId}:${actionId}`;
}

/* ─── Storage Management ─── */
export async function getStorageEstimate(): Promise<{ quota: number; usage: number }> {
  if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
    const est = await navigator.storage.estimate();
    return { quota: est.quota || 0, usage: est.usage || 0 };
  }
  return { quota: 0, usage: 0 };
}

export async function performMaintenance(): Promise<{ purged: number }> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const before = await dbGetAll<DBSchema['episodic']>('episodic');
  await purgeEpisodic(ninetyDaysAgo);
  const after = await dbGetAll<DBSchema['episodic']>('episodic');
  return { purged: before.length - after.length };
}

/* ─── Cross-Tab Sync ─── */
const memoryChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('oks_memory_sync') : null;

export function broadcastMemoryUpdate(projectId: string, storeName: string): void {
  memoryChannel?.postMessage({ projectId, storeName, action: 'update' });
}

export function subscribeMemoryUpdates(callback: (data: { projectId: string; storeName: string; action: string }) => void): () => void {
  if (!memoryChannel) return () => {};
  const handler = (event: MessageEvent) => callback(event.data);
  memoryChannel.addEventListener('message', handler);
  return () => memoryChannel.removeEventListener('message', handler);
}
