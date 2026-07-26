import { describe, it, expect, beforeEach } from 'vitest';
import {
  storeWorking, flushWorking, storeEpisodic, getEpisodic,
  storeSemantic, searchSemantic,
  promoteWorkingToEpisodic, summarizeEpisodicToSemantic,
  generateIsolatedKey, broadcastMemoryUpdate, subscribeMemoryUpdates,
  getStorageEstimate, performMaintenance,
} from '../services/memoryApi';

describe('Cross-Tier Operations', () => {
  it('promotes data from Working to Episodic on task completion', async () => {
    await storeWorking({
      id: 'cross-work-1', projectId: 'proj-cross', agentId: 'writer',
      sessionId: 'session-cross', key: 'draft', value: 'Final report draft',
      createdAt: new Date().toISOString(),
    });
    await promoteWorkingToEpisodic('session-cross', 'proj-cross');
    const working = await (await import('../services/memoryApi')).getWorking('session-cross');
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
});

describe('Workspace Isolation Merge & Compare', () => {
  it('generates isolated composite keys', () => {
    const key1 = generateIsolatedKey('proj-main', 'agent-data', 'calc-1');
    const key2 = generateIsolatedKey('proj-main', 'agent-research', 'calc-1');
    expect(key1).not.toBe(key2);
    expect(key1).toBe('proj-main:agent-data:calc-1');
    expect(key2).toBe('proj-main:agent-research:calc-1');
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
});
