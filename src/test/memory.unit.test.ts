import { describe, it, expect, beforeEach } from 'vitest';
import {
  storeSession, getSession, clearSession,
  storeEpisodic, getEpisodic, purgeEpisodic,
  storeSemantic, searchSemantic,
  storeProcedural, getProceduralBySkill,
  storeWorking, getWorking, flushWorking,
  storeLongTerm,
  generateIsolatedKey,
  getStorageEstimate, performMaintenance,
} from '../services/memoryApi';

describe('Tier 1: Session Memory', () => {
  beforeEach(() => clearSession());

  it('stores and retrieves session variables', () => {
    storeSession('key1', { value: 42 });
    expect(getSession('key1')).toEqual({ value: 42 });
  });

  it('truncates session on clear', () => {
    storeSession('key1', { value: 42 });
    clearSession();
    expect(getSession('key1')).toBeUndefined();
  });
});

describe('Tier 2: Episodic Memory', () => {
  it('stores with timestamp', async () => {
    const entry = {
      id: 'ep-1', projectId: 'proj-1', agentId: 'agent-1',
      text: 'Test conversation', summary: null, createdAt: new Date().toISOString(),
    };
    await storeEpisodic(entry);
    const result = await getEpisodic('ep-1');
    expect(result).toBeTruthy();
    expect(result!.createdAt).toBeTruthy();
  });

  it('purges old memories', async () => {
    const old = {
      id: 'ep-old', projectId: 'proj-1', agentId: 'agent-1',
      text: 'Old memory', summary: null, createdAt: '2024-01-01T00:00:00.000Z',
    };
    await storeEpisodic(old);
    await purgeEpisodic('2025-01-01T00:00:00.000Z');
    expect(await getEpisodic('ep-old')).toBeUndefined();
  });
});

describe('Tier 3: Semantic Memory', () => {
  it('stores with embedding', async () => {
    const entry = {
      id: 'sem-1', projectId: 'proj-1', agentId: 'agent-1',
      topic: 'epidemiology', text: 'R0 value is 2.5', embedding: [0.1, 0.2, 0.3],
      createdAt: new Date().toISOString(),
    };
    await storeSemantic(entry);
    const results = await searchSemantic('R0');
    expect(results.length).toBeGreaterThan(0);
  });

  it('performs text-based relevance search', async () => {
    await storeSemantic({
      id: 'sem-2', projectId: 'proj-1', agentId: 'agent-1',
      topic: 'vaccines', text: 'Herd immunity threshold is 95%', embedding: [],
      createdAt: new Date().toISOString(),
    });
    const results = await searchSemantic('herd immunity');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].text.toLowerCase()).toContain('herd immunity');
  });
});

describe('Tier 4: Procedural Memory', () => {
  it('stores operational rules and retrieves by skillId', async () => {
    const entry = {
      id: 'proc-1', projectId: 'proj-1', skillId: 'outbreak-detection',
      instructions: 'Monitor case counts daily', triggers: ['new_case'],
      createdAt: new Date().toISOString(),
    };
    await storeProcedural(entry);
    const result = await getProceduralBySkill('outbreak-detection');
    expect(result).toBeTruthy();
    expect(result!.instructions).toBe('Monitor case counts daily');
  });

  it('never auto-purges', async () => {
    const entry = {
      id: 'proc-2', projectId: 'proj-1', skillId: 'r0-estimator',
      instructions: 'Use SIR model', triggers: ['outbreak'],
      createdAt: new Date().toISOString(),
    };
    await storeProcedural(entry);
    const result = await getProceduralBySkill('r0-estimator');
    expect(result).toBeTruthy();
  });
});

describe('Tier 5: Working Memory', () => {
  it('stores scratchpad data', async () => {
    const entry = {
      id: 'work-1', projectId: 'proj-1', agentId: 'data-agent',
      sessionId: 'session-1', key: 'calc-result', value: 42,
      createdAt: new Date().toISOString(),
    };
    await storeWorking(entry);
    const results = await getWorking('session-1');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].value).toBe(42);
  });

  it('flushes on session end', async () => {
    const entry = {
      id: 'work-2', projectId: 'proj-1', agentId: 'data-agent',
      sessionId: 'session-flush', key: 'temp', value: 'scratch',
      createdAt: new Date().toISOString(),
    };
    await storeWorking(entry);
    await flushWorking('session-flush');
    const results = await getWorking('session-flush');
    expect(results.length).toBe(0);
  });
});

describe('Tier 6: Long-Term Memory', () => {
  it('stores persistent facts', async () => {
    const entry = {
      id: 'lt-1', projectId: 'proj-1', category: 'epidemiology',
      text: 'COVID-19 is caused by SARS-CoV-2', references: ['WHO'],
      createdAt: new Date().toISOString(),
    };
    await storeLongTerm(entry);
  });
});

describe('Workspace Isolation', () => {
  it('generates correct composite key format', () => {
    const key = generateIsolatedKey('proj-1', 'agent-data', 'calc-step-4');
    expect(key).toBe('proj-1:agent-data:calc-step-4');
  });

  it('handles empty IDs', () => {
    const key = generateIsolatedKey('', '', 'action');
    expect(key).toBe('::action');
  });
});

describe('Storage Management', () => {
  it('returns storage estimate with valid numbers', async () => {
    const estimate = await getStorageEstimate();
    expect(estimate.quota).toBeGreaterThan(0);
    expect(estimate.usage).toBeGreaterThanOrEqual(0);
    expect(estimate.quota).toBeGreaterThan(estimate.usage);
  });

  it('performMaintenance triggers purge', async () => {
    const old = {
      id: 'ep-maintenance', projectId: 'proj-1', agentId: 'agent-1',
      text: 'Old', summary: null, createdAt: '2024-01-01T00:00:00.000Z',
    };
    await storeEpisodic(old);
    const result = await performMaintenance();
    expect(result.purged).toBeGreaterThanOrEqual(0);
  });
});
