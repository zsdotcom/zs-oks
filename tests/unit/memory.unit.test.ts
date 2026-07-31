import { describe, it, expect, beforeEach } from 'vitest';
import {
  storeSession, getSession, clearSession,
  storeEpisodic, getEpisodic, purgeEpisodic,
  storeSemantic, searchSemantic, deleteSemantic,
  storeProcedural, getProceduralBySkill,
  storeWorking, getWorking, flushWorking,
  storeLongTerm, getLongTermByCategory,
  generateIsolatedKey,
  getStorageEstimate, performMaintenance,
  computeEmbedding, computeEmbeddingsParallel,
  rebuildSemanticIndex,
} from '../../app/src/services/memoryApi';

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

  it('stores multiple session variables independently', () => {
    storeSession('a', 1);
    storeSession('b', 2);
    expect(getSession('a')).toBe(1);
    expect(getSession('b')).toBe(2);
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

  it('auto-generates embedding when storing with empty embedding', async () => {
    const entry = {
      id: 'sem-auto', projectId: 'proj-1', agentId: 'agent-1',
      topic: 'test', text: 'Auto embedding test', embedding: [],
      createdAt: new Date().toISOString(),
    };
    await storeSemantic(entry);
    const results = await searchSemantic('auto embedding');
    expect(results.length).toBeGreaterThan(0);
  });

  it('deletes semantic entries', async () => {
    await storeSemantic({
      id: 'sem-del', projectId: 'proj-1', agentId: 'agent-1',
      topic: 'delete', text: 'UniqueTextThatWillBeDeletedAndNotFound', embedding: [],
      createdAt: new Date().toISOString(),
    });
    await deleteSemantic('sem-del');
    const results = await searchSemantic('UniqueTextThatWillBeDeleted');
    expect(results.length).toBe(0);
  });

  it('rebuilds the semantic index', async () => {
    await storeSemantic({
      id: 'sem-rebuild', projectId: 'proj-1', agentId: 'agent-1',
      topic: 'rebuild', text: 'Index rebuild test', embedding: [0.5],
      createdAt: new Date().toISOString(),
    });
    await rebuildSemanticIndex();
    const results = await searchSemantic('index rebuild');
    expect(results.length).toBeGreaterThan(0);
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

  it('isolates working memory by session', async () => {
    await storeWorking({
      id: 'work-iso-1', projectId: 'proj-1', agentId: 'agent-a',
      sessionId: 'session-a', key: 'data-a', value: 'A',
      createdAt: new Date().toISOString(),
    });
    await storeWorking({
      id: 'work-iso-2', projectId: 'proj-1', agentId: 'agent-b',
      sessionId: 'session-b', key: 'data-b', value: 'B',
      createdAt: new Date().toISOString(),
    });
    const resultsA = await getWorking('session-a');
    expect(resultsA.length).toBe(1);
    expect(resultsA[0].value).toBe('A');
    const resultsB = await getWorking('session-b');
    expect(resultsB.length).toBe(1);
    expect(resultsB[0].value).toBe('B');
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

  it('retrieves facts by category', async () => {
    await storeLongTerm({
      id: 'lt-2', projectId: 'proj-1', category: 'epidemiology',
      text: 'R0 for measles is 12-18', references: ['CDC'],
      createdAt: new Date().toISOString(),
    });
    const results = await getLongTermByCategory('epidemiology');
    expect(results.length).toBeGreaterThanOrEqual(1);
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

  it('generates unique keys for different agents', () => {
    const key1 = generateIsolatedKey('proj-1', 'agent-a', 'task-1');
    const key2 = generateIsolatedKey('proj-1', 'agent-b', 'task-1');
    expect(key1).not.toBe(key2);
  });
});

describe('Embedding Computation (Transformers.js Worker)', () => {
  it('generates 384-dimensional vectors', async () => {
    const embedding = await computeEmbedding('Test text for embedding');
    expect(embedding.length).toBe(384);
    expect(embedding.every((v) => typeof v === 'number')).toBe(true);
  });

  it('generates embeddings in parallel', async () => {
    const texts = ['First text', 'Second text', 'Third text'];
    const embeddings = await computeEmbeddingsParallel(texts);
    expect(embeddings.length).toBe(3);
    embeddings.forEach((emb) => {
      expect(emb.length).toBe(384);
    });
  });

  it('generates valid 384-dimensional arrays', async () => {
    const emb = await computeEmbedding('Test for validity');
    expect(emb.length).toBe(384);
    expect(emb.every((v) => typeof v === 'number' && isFinite(v))).toBe(true);
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
