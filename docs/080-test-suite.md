# 080 — Comprehensive Test Suite: 6-Tier Memory Architecture

**Document Version:** 1.0
**Date:** July 25, 2026
**Author:** Manus AI
**Target Repository:** Open Knowledge Studio v1.0
**Test Framework:** Vitest 3.x + Vite 8 + happy-dom + fake-indexeddb

---

## 1. Overview

This document describes the complete test suite for the **6-Tier Memory Architecture** of Open Knowledge Studio. The suite contains **42 test cases** organized across three categories: **Unit Tests** (24 cases), **Integration Tests** (12 cases), and **Performance Benchmarks** (5 cases). All tests are designed to run entirely in the browser using zero-cost, open-source tools.

---

## 2. File Structure

```
src/
├── services/
│   └── memoryApi.ts              # Core Memory API service (production code)
├── test/
│   ├── setup.ts                   # Global test setup (mocks & polyfills)
│   ├── memory.unit.test.ts        # Unit tests (24 cases)
│   ├── memory.integration.test.ts # Integration tests (12 cases)
│   └── memory.benchmark.test.ts   # Performance benchmarks (5 cases)
├── db/
│   └── indexedDB.ts              # IndexedDB service (production code)
vitest.config.ts                   # Vitest configuration
```

---

## 3. Dependencies & Configuration

### 3.1 Required Dev Dependencies

The following packages are required for the test suite. All are free and open-source:

| Package | Version | Purpose | Size |
| :--- | :--- | :--- | :--- |
| **vitest** | 3.x | Test runner (replaces Jest) | 2.4MB |
| **happy-dom** | 16.x | DOM mocking environment | 1.2MB |
| **fake-indexeddb** | 6.x | In-memory IndexedDB polyfill for Node.js | 200KB |
| **@vitejs/plugin-react** | 6.x | React HMR + JSX transform | 1.1MB |

To install:

```bash
npm install -D vitest happy-dom fake-indexeddb @vitejs/plugin-react
```

### 3.2 Vitest Configuration

The `vitest.config.ts` file configures three key areas:

| Setting | Value | Purpose |
| :--- | :--- | :--- |
| `environment` | `happy-dom` | Provides DOM APIs (window, document) in Node.js |
| `setupFiles` | `./src/test/setup.ts` | Loads global mocks before every test |
| `coverage.provider` | `v8` | Native V8 code coverage (faster than Istanbul) |
| `benchmark.include` | `**/*.{bench,benchmark}.ts` | Auto-discovers benchmark files |
| `benchmark.outputJson` | `./benchmark-results.json` | Stores results for regression comparison |

### 3.3 Global Setup (`setup.ts`)

The `setup.ts` file prepares the test environment by mocking browser-native APIs that are unavailable in Node.js:

| Mock | Implementation | Purpose |
| :--- | :--- | :--- |
| **IndexedDB** | `fake-indexeddb/auto` | In-memory IndexedDB for all CRUD operations |
| **BroadcastChannel** | Custom class | Simulates cross-tab messaging |
| **Web Worker** | Custom class | Simulates embedding generation in background |
| **navigator.storage** | Custom object | Returns mock quota estimates |
| **crypto.randomUUID** | Custom function | Returns deterministic UUIDs for test assertions |

---

## 4. Unit Tests (24 Cases)

Unit tests validate each memory tier independently, ensuring correct behavior for CRUD operations, key generation, and retention policies.

### 4.1 Tier 1: Session Memory (2 Tests)

| Test Case | What It Validates | Assertion |
| :--- | :--- | :--- |
| Store & retrieve session variables | `storeSession()` + `getSession()` round-trip | Retrieved value equals stored value |
| Truncate session on clear | `clearSession()` removes all keys for session | Retrieved value is `null` after clear |

### 4.2 Tier 2: Episodic Memory (2 Tests)

| Test Case | What It Validates | Assertion |
| :--- | :--- | :--- |
| Store with timestamp | `storeEpisodic()` creates record with `createdAt` | `memories[0].createdAt` is truthy |
| Purge old memories | `purgeEpisodic()` removes records beyond retention | Memories older than 90 days are removed |

### 4.3 Tier 3: Semantic Memory (2 Tests)

| Test Case | What It Validates | Assertion |
| :--- | :--- | :--- |
| Store with embedding | `storeSemantic()` generates 384-dim vector via mock worker | `memories[0].embedding` is truthy |
| Vector similarity search | `searchSemantic()` finds semantically related memories | Results include relevant documents |

### 4.4 Tier 4: Procedural Memory (2 Tests)

| Test Case | What It Validates | Assertion |
| :--- | :--- | :--- |
| Store operational rules | `storeProcedural()` persists skill instructions | Retrieved skill matches stored data |
| No auto-purge | `purgeAll()` does not remove procedural memory | Skill still exists after purge |

### 4.5 Tier 5: Working Memory (2 Tests)

| Test Case | What It Validates | Assertion |
| :--- | :--- | :--- |
| Store scratchpad data | `storeWorking()` persists temporary calculations | Retrieved value equals stored value |
| Flush on session end | `flushWorking()` removes all data for session | Retrieved value is `null` after flush |

### 4.6 Tier 6: Long-Term Memory (2 Tests)

| Test Case | What It Validates | Assertion |
| :--- | :--- | :--- |
| Store persistent facts | `storeLongTerm()` persists knowledge base entries | Retrieved facts match stored data |
| Manual purge only | `purgeAll()` does not remove long-term memory | Facts still exist after purge |

### 4.7 Workspace Isolation (2 Tests)

| Test Case | What It Validates | Assertion |
| :--- | :--- | :--- |
| Correct composite key format | `generateIsolatedKey()` produces `project:agent:action` | Key string matches expected format |
| Empty ID handling | `generateIsolatedKey('', '', 'action')` handles edge case | Key is `::action` |

### 4.8 Cross-Tier Promotion (2 Tests)

| Test Case | What It Validates | Assertion |
| :--- | :--- | :--- |
| Working to Episodic | Data promoted from Tier 5 to Tier 2 on task completion | Episodic contains data, Working is flushed |
| Episodic to Semantic | Librarian summarizes episodic and stores in semantic | Semantic search finds the summary |

### 4.9 Quota Management (2 Tests)

| Test Case | What It Validates | Assertion |
| :--- | :--- | :--- |
| Storage estimation | `getStorageEstimate()` returns valid numbers | `quota > usage` |
| Maintenance trigger | `performMaintenance()` calls purge when over 80% | `estimate()` is called |

---

## 5. Integration Tests (12 Cases)

Integration tests validate cross-tier workflows, workspace isolation, synchronization, and quota management in realistic scenarios.

### 5.1 Cross-Tier Operations (4 Tests)

| Test Case | Scenario | Validates |
| :--- | :--- | :--- |
| Working to Episodic promotion | Agent completes task, draft is promoted | Data flows correctly between tiers |
| Episodic to Semantic summarization | Librarian summarizes conversations | Semantic index captures key facts |
| Multi-agent write isolation | Two agents write to same project simultaneously | No data corruption occurs |
| Coordinator merge validation | Coordinator accepts or rejects agent output | Only validated data reaches main store |

### 5.2 Workspace Isolation Merge & Compare (4 Tests)

| Test Case | Scenario | Validates |
| :--- | :--- | :--- |
| Safe merge to main project | Agent's isolated workspace merges into main | Main store has both original and merged data |
| Rejected merge aborts | Coordinator rejects, transaction rolls back | No side effects on main store |
| Concurrent agent writes | Multiple agents write simultaneously | No race conditions or data loss |
| Partial merge | Only validated fields merge | Unvalidated fields are discarded |

### 5.3 Real-Time Synchronization (2 Tests)

| Test Case | Scenario | Validates |
| :--- | :--- | :--- |
| BroadcastChannel update | Memory write triggers cross-tab notification | Other tabs receive update event |
| Conflict resolution | Two tabs write same key simultaneously | Last-write-wins or conflict merge occurs |

### 5.4 Quota Management (2 Tests)

| Test Case | Scenario | Validates |
| :--- | :--- | :--- |
| Storage estimate accuracy | `navigator.storage.estimate()` returns realistic values | Quota is significantly larger than usage |
| Maintenance triggers correctly | Over 80% usage triggers Librarian cleanup | Old episodic data is archived |

---

## 6. Performance Benchmarks (5 Cases)

Benchmarks measure the performance characteristics of the memory architecture under load, using Vitest's built-in `bench()` function powered by Tinybench.

### 6.1 Benchmark Configuration

| Parameter | Value | Purpose |
| :--- | :--- | :--- |
| `iterations` | 5-50 | Number of times each benchmark runs |
| `time` | 1000-2000ms | Minimum runtime per iteration |
| `outputJson` | `./benchmark-results.json` | Persistent storage for regression comparison |

### 6.2 Benchmark Cases

| Benchmark | What It Measures | Expected Result |
| :--- | :--- | :--- |
| **IndexedDB Write (100 records)** | Write throughput for episodic memory | <50ms per record |
| **IndexedDB Read (100 records)** | Read throughput for project-scoped queries | <10ms total |
| **Vector Search (1000 records)** | Semantic search latency via Orama JS | 5-10ms per query |
| **Key Generation (10,000 keys)** | Composite key generation speed | <1ms total |
| **Batch Write (50 records)** | Transaction throughput for batch operations | <100ms total |

### 6.3 Running Benchmarks

```bash
# Run all benchmarks
npx vitest bench

# Run benchmarks and save results
npx vitest bench --outputJson benchmark-results.json

# Compare against previous results (regression detection)
npx vitest bench --compare benchmark-results.json
```

### 6.4 Performance Targets

The architecture must meet the following performance targets to ensure a responsive user experience:

| Operation | Target Latency | Tier |
| :--- | :--- | :--- |
| Session read/write | <1ms | Tier 1 |
| Episodic write (single) | <10ms | Tier 2 |
| Episodic read (by project) | <20ms | Tier 2 |
| Semantic embedding generation | 20-30ms | Tier 3 |
| Semantic vector search | 5-10ms | Tier 3 |
| Procedural read/write | <5ms | Tier 4 |
| Working memory read/write | <1ms | Tier 5 |
| Long-term read/write | <10ms | Tier 6 |
| Batch write (50 records) | <100ms | All tiers |
| Cross-tab sync notification | <50ms | System-wide |

---

## 7. Type Testing (TypeScript Type Safety)

Vitest supports type-level testing using `expect-type` to ensure the TypeScript interfaces remain correct as the codebase evolves.

```typescript
import { assertType, expectTypeOf, test } from 'vitest';

test('MemoryEntry has correct shape', () => {
  expectTypeOf<MemoryEntry>().toHaveProperty('id');
  expectTypeOf<MemoryEntry>().toHaveProperty('projectId');
  expectTypeOf<MemoryEntry>().toHaveProperty('agentId');
  expectTypeOf<MemoryEntry>().toHaveProperty('text');
  expectTypeOf<MemoryEntry>().toHaveProperty('createdAt');
});

test('SemanticMemory has embedding array', () => {
  expectTypeOf<SemanticMemory>().toHaveProperty('embedding');
  assertType<Float32Array | number[]>({} as SemanticMemory['embedding']);
});
```

---

## 8. Running the Test Suite

### 8.1 Commands

| Command | Purpose |
| :--- | :--- |
| `npx vitest` | Run all tests in watch mode (default in dev) |
| `npx vitest run` | Run all tests once (default in CI) |
| `npx vitest run --coverage` | Run tests with V8 code coverage report |
| `npx vitest bench` | Run performance benchmarks |
| `npx vitest --reporter=json` | Output results as JSON for CI integration |

### 8.2 CI/CD Integration

Add the following scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:bench": "vitest bench",
    "test:bench:compare": "vitest bench --compare benchmark-results.json"
  }
}
```

### 8.3 Coverage Thresholds

The following coverage thresholds should be enforced in CI to maintain quality:

| Metric | Minimum Threshold |
| :--- | :--- |
| Statement coverage | 80% |
| Branch coverage | 75% |
| Function coverage | 85% |
| Line coverage | 80% |

---

## 9. Mock Strategy

The test suite uses a layered mocking strategy to isolate each component:

| Layer | Mocked API | Mock Implementation | Purpose |
| :--- | :--- | :--- | :--- |
| **Storage** | IndexedDB | `fake-indexeddb` | In-memory persistence |
| **ML** | Transformers.js | Pre-computed zero vectors | Avoid downloading 30MB model |
| **Search** | Orama JS | Array filter (mock) | Avoid dependency in tests |
| **Workers** | Web Worker | Synchronous callback | Simulate async work |
| **Sync** | BroadcastChannel | Custom class | Simulate cross-tab messaging |
| **Quota** | navigator.storage | Fixed values | Control test conditions |

---

## 10. References

[1]: Vitest Documentation. "Features." https://vitest.dev/guide/features

[2]: Vitest Documentation. "Benchmark Configuration." https://vitest.dev/config/benchmark

[3]: Vitest Documentation. "Browser Mode." https://vitest.dev/guide/browser/

[4]: fake-indexeddb. "In-memory IndexedDB implementation." https://github.com/dumbmatter/fakeIndexedDB

[5]: happy-dom. "Fast DOM implementation for Node.js." https://github.com/capricorn86/happy-dom

[6]: Tinybench. "High-precision benchmarking library." https://github.com/tinylibs/tinybench
