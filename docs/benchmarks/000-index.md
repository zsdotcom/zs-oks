---
title: "000 — Performance Benchmarks Overview"
category: "benchmarks"
order: 0
tags: ["benchmarks", "performance", "indexeddb", "embeddings", "vector-search"]
last_updated: "2026-07-27"
---

# 000 — Performance Benchmarks Overview

## Why Benchmarks Matter

Performance benchmarks ensure that **Open Knowledge Studio** remains fast and responsive as features are added. The application runs entirely in the browser, relying on IndexedDB for persistence and Transformers.js in a Web Worker for embedding generation. Monitoring these operations prevents regressions that could degrade the user experience.

## Running Benchmarks

Benchmarks are defined using Vitest's `bench` function and executed with:

```bash
npm run test:bench
```

To compare results against a previous run:

```bash
npm run test:bench:compare
```

Results are written to `benchmark-results.json` (gitignored).

## Benchmark Environment

| Context | Detail |
|---------|--------|
| **Runtime** | Vitest with `happy-dom` + `fake-indexeddb/auto` |
| **Worker mock** | Returns random 384-dim vectors (defined in `src/test/setup.ts`) |
| **CI execution** | Ubuntu latest, Node.js 26, `npm ci` |
| **Iterations** | 5 per benchmark |
| **Timeout** | 1000ms per iteration |

## Current Results Overview

| Benchmark | Target | Iterations | Status |
|-----------|--------|------------|--------|
| [IndexedDB Write Throughput](010-results.md#1-indexeddb-write-throughput) | <50ms/record | 5 | Meets target |
| [Vector Search Performance](010-results.md#2-vector-search-performance) | <100ms/query | 5 | Meets target |
| [Key Generation Speed](010-results.md#3-key-generation-speed) | <1ms total | 5 | Meets target |
| [Batch Write Performance](010-results.md#4-batch-write-performance) | <100ms total | 5 | Meets target |
| [Embedding Generation](010-results.md#5-embedding-generation) | <100ms/text | 5 | Meets target |

## See Also

- [Detailed Results](010-results.md) — Full metrics for each benchmark
- [Test Suite](../developers/080-test-suite.md) — Overview of all tests and coverage
- [Memory Architecture](../developers/005-memory-architecture.md) — The 6-tier memory system under test


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
