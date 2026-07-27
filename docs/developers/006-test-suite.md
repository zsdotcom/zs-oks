---
title: "060 — Test Suite Documentation"
category: "developers"
order: 60
tags: ["testing", "vitest", "coverage", "benchmarks", "e2e"]
last_updated: "2026-07-26"
---

# 060 — Test Suite Documentation

Complete documentation of the testing infrastructure, test files, mocking strategy, and coverage requirements.

---

## 1. Test Architecture

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Test Runner** | Vitest 4.x | Fast, Vite-native test framework |
| **Environment** | happy-dom | Browser-like environment (no rendering) |
| **Database** | fake-indexeddb/auto | In-memory IndexedDB mock |
| **Coverage** | @vitest/coverage-v8 | V8 native code coverage |
| **E2E** | Playwright 1.62 | Full browser automation |

### Configuration

**`vitest.config.ts`:**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.{bench,benchmark}.{ts,tsx}',
        'src/index.tsx',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 85,
        lines: 80,
      },
    },
    benchmark: {
      include: ['src/**/*.{bench,benchmark}.{ts,tsx}'],
      outputJson: './benchmark-results.json',
    },
  },
});
```

---

## 2. Test File Listing

| # | File | Type | Tests | What It Tests |
| :-- | :--- | :--- | :--: | :--- |
| 1 | `src/test/memory.unit.test.ts` | Unit | 25 | All 6 memory tiers, workspace isolation, embeddings, storage management |
| 2 | `src/test/memory.integration.test.ts` | Integration | 10 | Cross-tier promotion, workspace isolation, BroadcastChannel sync, storage |
| 3 | `src/test/memory.benchmark.ts` | Benchmark | 5 | IndexedDB write/read performance, search latency, key generation |
| 4 | `src/test/gemini.test.ts` | Unit | 8 | LLM provider router, orchestrated workflow, sequential workflow |
| 5 | `src/test/sandbox.test.ts` | Unit | 9 | Sandbox data creation, cleanup, edge cases |
| 6 | `src/test/icd11.test.ts` | Unit | 22 | ICD-11 search, code lookup, FHIR conversion |
| 7 | `src/test/icf.test.ts` | Unit | 22 | ICF search, code lookup, FHIR conversion |
| 8 | `src/test/ichi.test.ts` | Unit | 22 | ICHI search, code lookup, FHIR conversion |
| | **Total** | | **117** | |

---

## 3. Mock Behavior (`src/test/setup.ts`)

### MockWorker

The test setup provides a `MockWorker` that replaces real Web Workers:

```typescript
class MockWorker {
  postMessage(data: unknown): void {
    const msg = data as { type: string; texts: string[]; id: number };
    const embeddings = msg.texts.map(() =>
      Array.from({ length: 384 }, () => Math.random() * 2 - 1)
    );
    // Returns random 384-dim arrays without loading Transformers.js
    const response = new MessageEvent('message', {
      data: { id: msg.id, embeddings },
    });
    this.messageHandler?.(response);
  }
  // ...
}
```

- Intercepts `postMessage` calls
- Returns **random 384-dim Float32Array** for each text
- Simulates the Transformers.js pipeline without loading the actual model (~20MB download)

### MockBroadcastChannel

```typescript
class MockBroadcastChannel {
  private handlers: Set<(event: MessageEvent) => void> = new Set();
  postMessage(data: unknown): void { /* synchronous dispatch */ }
  // Supports both onmessage and addEventListener patterns
}
```

- Synchronous message dispatch (no async delay)
- Supports both `onmessage` callback and `addEventListener`
- Used to test cross-tab memory synchronization

### crypto.randomUUID

```typescript
let counter = 0;
Object.defineProperty(globalThis.crypto, 'randomUUID', {
  value: () => `test-uuid-${counter++}`,
});
```

- Returns deterministic UUIDs: `test-uuid-0`, `test-uuid-1`, etc.
- Enables predictable test assertions

### navigator.storage.estimate

```typescript
Object.defineProperty(globalThis.navigator, 'storage', {
  value: {
    estimate: async () => ({ quota: 1_000_000_000, usage: 100_000_000 }),
  },
});
```

- Returns fixed values: 1GB quota, ~100MB usage
- Used in storage management tests

---

## 4. Unit Tests — Memory (25 Cases)

### Session Memory (T1) — 3 tests
- Store and retrieve values
- Clear session clears all keys
- Independent key isolation

### Episodic Memory (T2) — 2 tests
- Store and retrieve with timestamp
- Purge old entries (before date)

### Semantic Memory (T3) — 5 tests
- Store with auto-embedding
- Keyword search (fallback)
- Auto-embedding on empty embedding
- Delete semantic entry
- Rebuild semantic index

### Procedural Memory (T4) — 2 tests
- Store and retrieve by skill ID
- No auto-purge (no-op)

### Working Memory (T5) — 3 tests
- Store and retrieve by session
- Flush working by session
- Session isolation

### Long-Term Memory (T6) — 2 tests
- Store and retrieve by category
- Category filtering by project

### Workspace Isolation — 3 tests
- Key format (`projectId:agentId:actionId`)
- Empty project/agent IDs
- Unique keys per agent

### Embedding Worker — 3 tests
- Returns 384-dim vectors
- Parallel embedding requests
- Vector validity (all numbers, correct length)

### Storage Management — 2 tests
- Storage estimate returns numbers
- Maintenance purges old episodic entries

---

## 5. Integration Tests (10 Cases)

| Group | Tests | Validates |
| :--- | :--- | :--- |
| Cross-Tier | 3 | Working→Episodic promotion, Episodic→Semantic summarization, embedding during summarization |
| Workspace | 2 | Composite keys, cross-project isolation |
| Sync | 2 | BroadcastChannel notifications, unsubscribe cleanup |
| Storage | 3 | Estimate accuracy, maintenance purge count, triggered maintenance |

---

## 6. Performance Benchmarks (4 Cases)

| Benchmark | Records | Expected |
| :--- | :--- | :--- |
| IndexedDB Write | 100 | <50ms per record |
| Vector Search (with embedding) | 100 | <100ms per query |
| Key Generation | 10,000 | <1ms total |
| Batch Write | 50 | <100ms total |

Run with:

```bash
npm run test:bench
```

Results are written to `benchmark-results.json` (gitignored).

---

## 7. LLM Provider Tests — gemini.test.ts (8 Cases)

| Test | What it validates |
| :--- | :--- |
| Orchestrated workflow runs all agents | End-to-end agent execution with fetch mocking |
| Sequential workflow chains correctly | Agent output feeds into next agent's input |
| Error handling per agent | One agent failing doesn't crash the workflow |
| Coordinator synthesis | Final synthesis step produces combined output |
| Empty agent list | Graceful handling of no agents |
| Custom provider config | Provider overrides per agent |
| Context document injection | Context docs are passed correctly |
| Timeout handling | Long-running agents don't block the workflow |

---

## 8. Sandbox Tests — sandbox.test.ts (9 Cases)

| Test | What it validates |
| :--- | :--- |
| Create sandbox data | Properly structured output with metadata |
| Cleanup removes data | Data deleted after cleanup |
| Empty code input | Empty code returns error result |
| Invalid code | Graceful error handling |
| Large output truncation | Output capped at reasonable size |
| Multiple executions | Sequential execution isolation |
| Concurrent execution limit | Max concurrent execs enforced |
| Execution timeout | Hanging executions are killed |
| Security sanitization | Dangerous code patterns rejected |

---

## 9. ICD-11 Tests — icd11.test.ts (22 Cases)

| Test | What it validates |
| :--- | :--- |
| Search by keyword | Returns matching conditions |
| Search by code | Exact code lookup |
| Get all codes | Complete code listing |
| Get by chapter | Chapter-specific filtering |
| ICD-11 to FHIR conversion | HL7 FHIR R4 format conversion |
| FHIR to ICD-11 | Reverse FHIR conversion |
| Search by FHIR resource | Find ICD-11 codes from FHIR data |
| Invalid code handling | Graceful error on bad codes |
| Multi-language search | Search in multiple languages |
| Chapter listing | All 26 chapters enumerated |
| Code hierarchy | Parent/child code relationships |
| Definition lookup | Condition definitions returned |
| Index terms | Associated index terms |
| Inclusion criteria | Inclusion/exclusion rules |
| Code validation | Valid vs invalid codes |
| Code formatting | Standard formatting enforced |
| Deprecated codes | Deprecation status reported |
| Version info | API version returned |
| Batch lookup | Multiple codes in one call |
| Empty search | Empty query handling |
| Special characters | Unicode/full-text search |
| Performance | Lookup response time |

---

## 10. ICF Tests — icf.test.ts (22 Cases)

| Test | What it validates |
| :--- | :--- |
| Search by keyword | Returns matching ICF codes |
| Search by code | Exact code lookup |
| Get all codes | Complete code listing |
| Get by component | Component-specific filtering (Body Functions, Activities, etc.) |
| ICF to FHIR conversion | HL7 FHIR R4 format conversion |
| FHIR to ICF | Reverse FHIR conversion |
| Search by FHIR resource | Find ICF codes from FHIR data |
| Invalid code handling | Graceful error on bad codes |
| Multi-language search | Search in multiple languages |
| Component listing | All 4 components enumerated |
| Code hierarchy | Parent/child code relationships |
| Definition lookup | ICF definitions returned |
| Qualifier codes | Qualifier scale codes |
| Inclusion criteria | Inclusion/exclusion rules |
| Code validation | Valid vs invalid codes |
| Code formatting | Standard formatting enforced |
| Deprecated codes | Deprecation status reported |
| Version info | API version returned |
| Batch lookup | Multiple codes in one call |
| Empty search | Empty query handling |
| Special characters | Unicode/full-text search |
| Performance | Lookup response time |

---

## 11. ICHI Tests — ichi.test.ts (22 Cases)

| Test | What it validates |
| :--- | :--- |
| Search by keyword | Returns matching ICHI codes |
| Search by code | Exact code lookup |
| Get all codes | Complete code listing |
| Get by chapter | Chapter-specific filtering |
| ICHI to FHIR conversion | HL7 FHIR R4 format conversion |
| FHIR to ICHI | Reverse FHIR conversion |
| Search by FHIR resource | Find ICHI codes from FHIR data |
| Invalid code handling | Graceful error on bad codes |
| Multi-language search | Search in multiple languages |
| Chapter listing | All chapters enumerated |
| Code hierarchy | Parent/child code relationships |
| Target codes | Target (ICD-11/ICF) code associations |
| Definition lookup | ICHI definitions returned |
| Intervention type | Intervention type classification |
| Code validation | Valid vs invalid codes |
| Code formatting | Standard formatting enforced |
| Deprecated codes | Deprecation status reported |
| Version info | API version returned |
| Batch lookup | Multiple codes in one call |
| Empty search | Empty query handling |
| Special characters | Unicode/full-text search |
| Performance | Lookup response time |

---

## 12. Running Tests

```bash
# All tests
npm test

# Watch mode (rerun on file changes)
npm run test:watch

# With coverage report
npm run test:coverage

# Performance benchmarks
npm run test:bench

# E2E tests (Playwright)
npx playwright install chromium
npm run test:e2e

# E2E with UI mode
npm run test:e2e:ui

# E2E with debug
npm run test:e2e:debug

# Compare benchmark results
npm run test:bench:compare
```

---

## 13. Coverage Thresholds

Configured in `vitest.config.ts`, enforced in CI:

| Metric | Minimum | Enforced In |
| :--- | :---: | :--- |
| Statements | 80% | CI |
| Branches | 75% | CI |
| Functions | 85% | CI |
| Lines | 80% | CI |

Coverage excludes: `src/test/**`, test/spec/bench files, `src/index.tsx`.

Check coverage locally:

```bash
npm run test:coverage
```

Open the HTML report:

```bash
open coverage/index.html   # Mac
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

---

## See Also

- [Development Guidelines](040-development.md) — Testing strategy and writing tests
- [Memory Architecture](050-memory-architecture.md) — Memory tiers under test
- [CI/CD Pipeline](080-ci-cd.md) — GitHub Actions workflow running tests
- [Setup Guide](010-setup.md) — Environment prerequisites

---

*Back to [Documentation Home](../index.md)*
