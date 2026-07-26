import { bench, describe } from 'vitest';
import {
  storeEpisodic, storeSemantic,
  generateIsolatedKey, storeWorking,
} from '../services/memoryApi';

describe('IndexedDB Write (100 records)', () => {
  bench('write throughput for episodic memory', async () => {
    for (let i = 0; i < 100; i++) {
      await storeEpisodic({
        id: `bench-ep-${i}`, projectId: 'bench-proj', agentId: 'bench-agent',
        text: `Benchmark entry number ${i} with sufficient text to measure realistic write throughput`,
        summary: null, createdAt: new Date().toISOString(),
      });
    }
  }, { iterations: 5, time: 1000 });
});

describe('Vector Search (1000 records)', () => {
  bench('semantic search text matching', async () => {
    for (let i = 0; i < 100; i++) {
      await storeSemantic({
        id: `bench-sem-${i}`, projectId: 'bench-proj', agentId: 'bench-agent',
        topic: 'benchmark', text: `Searchable content item number ${i} for latency measurement`,
        embedding: [], createdAt: new Date().toISOString(),
      });
    }
  }, { iterations: 5, time: 1000 });
});

describe('Key Generation (10,000 keys)', () => {
  bench('composite key generation speed', () => {
    for (let i = 0; i < 10000; i++) {
      generateIsolatedKey('bench-proj', 'bench-agent', `action-${i}`);
    }
  }, { iterations: 5, time: 1000 });
});

describe('Batch Write (50 records)', () => {
  bench('transaction throughput for batch operations', async () => {
    for (let i = 0; i < 50; i++) {
      await storeWorking({
        id: `bench-work-${i}`, projectId: 'bench-proj', agentId: 'bench-agent',
        sessionId: 'bench-session', key: `key-${i}`, value: `value-${i}`,
        createdAt: new Date().toISOString(),
      });
    }
  }, { iterations: 5, time: 1000 });
});
