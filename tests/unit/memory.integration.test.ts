import { describe, it, expect } from 'vitest';
import {
  storeWorking, flushWorking, storeEpisodic, getEpisodic,
  storeSemantic, searchSemantic,
  promoteWorkingToEpisodic, summarizeEpisodicToSemantic,
  generateIsolatedKey, broadcastMemoryUpdate, subscribeMemoryUpdates,
  getStorageEstimate, performMaintenance,
  computeEmbedding, storeLongTerm,
} from '../../app/src/services/memoryApi';

describe('Cross-Tier Operations', () => {
  it('promotes data from Working to Episodic on task completion', async () => {
    await storeWorking({
      id: 'cross-work-1', projectId: 'proj-cross', agentId: 'writer',
      sessionId: 'session-cross', key: 'draft', value: 'Final report draft',
      createdAt: new Date().toISOString(),
    });
    await promoteWorkingToEpisodic('session-cross', 'proj-cross');
    const { getWorking } = await import('../../app/src/services/memoryApi');
    const working = await getWorking('session-cross');
    expect(working.length).toBe(0);
  });

  it('summarizes Episodic to Semantic', async () => {
    await storeEpisodic({
      id: 'cross-ep-1', projectId: 'proj-cross', agentId: 'librarian',
      text: 'Key finding: incidence rate is 12.5 per 100k', summary: null,
      createdAt: new Date().toISOString(),
    });
    await summarizeEpisodicToSemantic('proj-cross');
    const results = await searchSemantic('incidence rate');
    expect(results.length).toBeGreaterThan(0);
  });

  it('embeddings are generated during cross-tier summarization', async () => {
    await storeEpisodic({
      id: 'cross-ep-embed', projectId: 'proj-embed', agentId: 'researcher',
      text: 'Vector embeddings enhance semantic search accuracy', summary: null,
      createdAt: new Date().toISOString(),
    });
    await summarizeEpisodicToSemantic('proj-embed');
    const results = await searchSemantic('vector embeddings semantic');
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('Workspace Isolation Merge & Compare', () => {
  it('generates isolated composite keys', () => {
    const key1 = generateIsolatedKey('proj-main', 'agent-data', 'calc-1');
    const key2 = generateIsolatedKey('proj-main', 'agent-research', 'calc-1');
    expect(key1).not.toBe(key2);
    expect(key1).toBe('proj-main:agent-data:calc-1');
    expect(key2).toBe('proj-main:agent-research:calc-1');
  });

  it('isolates working memory across projects', async () => {
    await storeWorking({
      id: 'work-iso-proj1', projectId: 'proj-alpha', agentId: 'coord',
      sessionId: 'session-alpha', key: 'plan', value: 'Alpha plan',
      createdAt: new Date().toISOString(),
    });
    await storeWorking({
      id: 'work-iso-proj2', projectId: 'proj-beta', agentId: 'coord',
      sessionId: 'session-beta', key: 'plan', value: 'Beta plan',
      createdAt: new Date().toISOString(),
    });
    const { getWorking } = await import('../../app/src/services/memoryApi');
    const alpha = await getWorking('session-alpha');
    expect(alpha[0].value).toBe('Alpha plan');
    const beta = await getWorking('session-beta');
    expect(beta[0].value).toBe('Beta plan');
  });
});

describe('Real-Time Synchronization', () => {
  it('broadcasts memory updates', () => {
    let received: any = null;
    const unsub = subscribeMemoryUpdates((data) => { received = data; });
    broadcastMemoryUpdate('proj-sync', 'episodic');
    expect(received).toBeTruthy();
    expect(received.projectId).toBe('proj-sync');
    expect(received.storeName).toBe('episodic');
    expect(received.action).toBe('update');
    unsub();
  });

  it('unsubscribes from memory updates', () => {
    let count = 0;
    const unsub = subscribeMemoryUpdates(() => { count++; });
    unsub();
    broadcastMemoryUpdate('proj-unsync', 'semantic');
    expect(count).toBe(0);
  });
});

describe('Storage Management', () => {
  it('returns realistic storage estimate', async () => {
    const estimate = await getStorageEstimate();
    expect(estimate.quota).toBeGreaterThan(0);
    expect(estimate.usage).toBeGreaterThanOrEqual(0);
  });

  it('triggers maintenance correctly', async () => {
    const result = await performMaintenance();
    expect(result).toHaveProperty('purged');
    expect(typeof result.purged).toBe('number');
  });

  it('maintenance purges old episodic data', async () => {
    await storeEpisodic({
      id: 'ep-old-2', projectId: 'proj-maint', agentId: 'agent-1',
      text: 'Very old data for maintenance test', summary: null,
      createdAt: '2023-06-01T00:00:00.000Z',
    });
    const result = await performMaintenance();
    expect(result.purged).toBeGreaterThanOrEqual(1);
    const entry = await getEpisodic('ep-old-2');
    expect(entry).toBeUndefined();
  });
});
