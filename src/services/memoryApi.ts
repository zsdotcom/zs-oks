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
  await dbPut('semantic', entry);
}

export async function searchSemantic(query: string, topK = 5): Promise<DBSchema['semantic'][]> {
  const all = await dbGetAll<DBSchema['semantic']>('semantic');
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/);
  return all
    .map((entry) => {
      const textLower = entry.text.toLowerCase();
      const matchCount = queryTerms.filter((t) => textLower.includes(t)).length;
      return { entry, score: matchCount > 0 ? matchCount * 10 + entry.text.length : 0 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => r.entry);
}

export async function deleteSemantic(id: string): Promise<void> {
  await dbDelete('semantic', id);
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

export async function getLongTermByCategory(category: string): Promise<DBSchema['long_term'][]> {
  return dbGetByIndex<DBSchema['long_term']>('long_term', 'projectId_category', category);
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
