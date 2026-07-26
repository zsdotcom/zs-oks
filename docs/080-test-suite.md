# 080 — Test Suite: 6-Tier Memory Architecture

**Document Version:** 2.0
**Date:** July 26, 2026
**Test Framework:** Vitest 4.x + happy-dom + fake-indexeddb

---

## 1. Overview

The test suite validates the 6-tier memory architecture, vector embedding pipeline, and semantic search with **35 test cases** across three categories: **Unit Tests** (25 cases), **Integration Tests** (9 cases), and **Performance Benchmarks** (5 cases).

---

## 2. File Structure

```
src/
├── services/
│   ├── memoryApi.ts              # Core memory API under test
│   ├── embeddingWorker.ts        # Transformers.js Web Worker
│   └── oramaService.ts           # Orama JS vector search
├── test/
│   ├── setup.ts                  # Mocks: indexeddb, BroadcastChannel, Worker, crypto
│   ├── memory.unit.test.ts       # 25 unit tests
│   ├── memory.integration.test.ts # 9 integration tests
│   └── memory.benchmark.ts       # 5 performance benchmarks
├── db/
│   └── indexedDB.ts
vitest.config.ts
```

---

## 3. Unit Tests (25 Cases)

| Tier | Tests | Key Validations |
| :--- | :--- | :--- |
| Session (T1) | 3 | Store/retrieve, clear, independent keys |
| Episodic (T2) | 2 | Timestamp, purge old |
| Semantic (T3) | 5 | Embedding, keyword search, auto-embedding, delete, rebuild |
| Procedural (T4) | 2 | Skill lookup, no auto-purge |
| Working (T5) | 3 | Store/retrieve, flush, session isolation |
| Long-Term (T6) | 2 | Store, category retrieval |
| Workspace (Isolation) | 3 | Key format, empty IDs, unique per agent |
| Embeddings (Worker) | 3 | 384-dim vectors, parallel, validity |
| Storage (Mgmt) | 2 | Estimate, maintenance purge |

### Mock Worker Behavior
The test `setup.ts` provides a `MockWorker` that intercepts `postMessage` calls and returns random 384-dim arrays, simulating the Transformers.js pipeline without loading the actual model.

---

## 4. Integration Tests (9 Cases)

| Group | Tests | Validates |
| :--- | :--- | :--- |
| Cross-Tier | 3 | Working→Episodic promotion, Episodic→Semantic summarization, embedding during summarization |
| Workspace | 2 | Composite keys, cross-project isolation |
| Sync | 2 | BroadcastChannel notifications, unsubscribe |
| Storage | 2 | Estimate accuracy, maintenance purge |

---

## 5. Performance Benchmarks (5 Cases)

| Benchmark | Records | Expected |
| :--- | :--- | :--- |
| IndexedDB Write | 100 | <50ms per record |
| Vector Search (with embedding) | 100 | <100ms per query |
| Key Generation | 10,000 | <1ms total |
| Batch Write | 50 | <100ms total |
| Embedding Generation | 1 | <100ms per text |

---

## 6. Running Tests

```bash
npm test               # 35 tests, 2 files
npm run test:watch     # Watch mode
npm run test:coverage  # V8 coverage
npm run test:bench     # Benchmarks
```

### Coverage Thresholds

| Metric | Minimum |
| :--- | :--- |
| Statement coverage | 80% |
| Branch coverage | 75% |
| Function coverage | 85% |
| Line coverage | 80% |
