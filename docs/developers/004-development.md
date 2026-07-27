---
title: "040 — Development Guidelines"
category: "developers"
order: 40
tags: ["development", "contribution", "standards", "testing", "git"]
last_updated: "2026-07-26"
---

# 040 — Development Guidelines

This document defines the coding standards, git workflow, and contribution guidelines for Open Knowledge Studio.

---

## 1. Coding Standards

### 1.1 TypeScript & Strict Typing

- **All source code** must be written in TypeScript (strict mode enabled in `tsconfig.app.json`)
- Avoid `any` types — use `unknown` with type guards for dynamic values
- Use the `@/` path alias (maps to `src/`) for all imports
- Project references: `tsconfig.json` references `tsconfig.app.json` (app code) and `tsconfig.node.json` (config files)

### 1.2 React Components

- **Functional components only** — no class components
- **React Hooks** for all stateful logic (`useState`, `useEffect`, `useCallback`, `useMemo`)
- Custom hooks for complex business logic (e.g., `useChat`, `useFiles`)
- Single responsibility per component — split large components into smaller ones
- Components go in `src/components/`

### 1.3 State Management Rules

| Allowed | Forbidden |
| :--- | :--- |
| `useState` | Redux, Redux Toolkit |
| `useReducer` | Zustand |
| `useContext` (for theme, auth, app-level state) | MobX, Jotai, Recoil |
| IndexedDB (via `db/indexedDB.ts`) | Any external state library |
| Memory API (via `services/memoryApi.ts`) | — |

**Persistent state** must go through IndexedDB. The 6-tier Memory API (`memoryApi.ts`) is the approved abstraction layer.

### 1.4 Zero Dependency Rule

- **Never introduce new runtime npm dependencies** without explicit approval
- Only `react` and `react-dom` are allowed as runtime npm dependencies
- Prefer native browser APIs over external libraries:

| Need | Native Alternative |
| :--- | :--- |
| Cross-tab sync | `BroadcastChannel` API |
| Background compute | `Web Workers` |
| Persistent storage | `IndexedDB` |
| Speech-to-text | `Web Speech API` |
| File access | `File System Access API` |

- Dynamic CDN imports are allowed for heavy libraries (Transformers.js, Orama JS)
- See [Zero-Dependency Architecture](100-dependency-removal.md) for full details

### 1.5 Code Style

- No semicolons in source files
- Single quotes for strings
- 2-space indentation
- `import type` for type-only imports
- Explicit `export` for all public functions/types
- Descriptive variable names — no single-letter names (except loop indices)

---

## 2. Git Workflow

### 2.1 Branch Naming

| Branch Pattern | Purpose |
| :--- | :--- |
| `main` | Stable, deployable branch |
| `feature/<name>` | New features (`feature/vector-search`) |
| `fix/<description>` | Bug fixes (`fix/indexeddb-quota`) |
| `docs/<description>` | Documentation updates (`docs/memory-architecture`) |
| `chore/<description>` | Maintenance tasks (`chore/update-deps`) |

### 2.2 Commit Messages

Use the **Conventional Commits** format:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

| Type | Usage |
| :--- | :--- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, missing semicolons) |
| `refactor` | Code refactoring (no feature change or bug fix) |
| `test` | Adding or updating tests |
| `chore` | Build process, tooling, dependencies |

**Examples:**

```text
feat(memory): add vector search fallback for offline mode

Implement keyword-based search when Orama CDN is unavailable.
Falls back to token matching with score-based ranking.

Closes #142
```

```text
fix(provider): handle missing API key gracefully

Show user-friendly error message instead of throwing unhandled exception.
```

```text
docs(ci): add local CI simulation commands
```

### 2.3 Pull Requests

1. All changes to `main` must go through a PR
2. PR title must follow Conventional Commits format
3. PR description must include:
   - What the change does
   - Why it's needed
   - How to test it
4. PR must pass CI checks:
   - `npm run typecheck` (0 errors)
   - `npm test` (all 74 tests passing)
   - `npm run build` (production build succeeds)
   - Coverage thresholds (statements 80%, branches 75%, functions 85%, lines 80%)
5. At least one reviewer must approve
6. Squash-merge preferred for clean history

---

## 3. Testing Strategy

### 3.1 Test Architecture

- **Framework:** Vitest 4.x
- **Environment:** happy-dom (browser-like without rendering)
- **Database:** fake-indexeddb/auto (IndexedDB mock)
- **Setup:** `src/test/setup.ts` mocks `BroadcastChannel`, `Worker`, `crypto.randomUUID`

### 3.2 Running Tests

```bash
npm test                    # All 74 tests across 6 files
npm run test:watch          # Watch mode (auto-rerun on changes)
npm run test:coverage       # V8 coverage report
npm run test:bench          # Performance benchmarks
npm run test:e2e            # Playwright E2E (7 spec files)
```

### 3.3 Coverage Thresholds

Configured in `vitest.config.ts`:

| Metric | Minimum |
| :--- | :--- |
| Statements | 80% |
| Branches | 75% |
| Functions | 85% |
| Lines | 80% |

### 3.4 Test Files

| File | Type | Tests |
| :--- | :--- | :--- |
| `src/test/memory.unit.test.ts` | Memory unit tests | 25 |
| `src/test/memory.integration.test.ts` | Memory integration tests | 10 |
| `src/test/memory.benchmark.ts` | Performance benchmarks | 4 |
| `src/test/gemini.test.ts` | LLM provider router tests | 8 |
| `src/test/sandbox.test.ts` | Sandbox execution tests | 9 |
| `src/test/icd11.test.ts` | ICD-11 lookup tests | 22 |
| **Total** | | **78** |

---

## 4. How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch:** `git checkout -b feature/your-feature`
3. **Make changes** following coding standards
4. **Run tests:** `npm test && npm run typecheck`
5. **Commit** using Conventional Commits (`git commit -m "feat(scope): description"`)
6. **Push:** `git push origin feature/your-feature`
7. **Open a Pull Request** against `main`
8. **Address feedback** from reviewers
9. **Merge** once approved and CI passes

---

## 5. Project Structure Overview

```
src/
├── App.tsx                  # Root component with view routing
├── index.tsx                # Entry point (ReactDOM.createRoot)
├── types.ts                 # All TypeScript interfaces/types
├── components/              # React components (lazy + direct imports)
│   ├── icons/               # Inline SVG icons (lucide-shim.tsx)
│   ├── MCPServerPanel.tsx   # MCP configuration UI
│   ├── ChatInterface.tsx    # Main chat component
│   └── ...                  # ~40 component files
├── db/
│   └── indexedDB.ts         # IndexedDB CRUD (22 stores, v2 schema)
├── services/
│   ├── memoryApi.ts         # 6-tier memory API
│   ├── geminiService.ts     # Multi-provider LLM router (12 providers)
│   ├── embeddingWorker.ts   # Transformers.js Web Worker
│   ├── oramaService.ts      # Orama hybrid vector search
│   ├── sandboxService.ts    # Code sandbox execution
│   ├── icd11Service.ts      # ICD-11 medical code lookup
│   └── ...                  # Additional services
└── test/                    # Test files
    ├── setup.ts             # Test mocks
    ├── memory.unit.test.ts  # 25 unit tests
    ├── gemini.test.ts       # 8 provider router tests
    └── ...                  # 4 additional test files
```

---

## See Also

- [5-Minute Quick Start](000-quickstart.md) — Quick setup for contributors
- [Memory Architecture Deep Dive](050-memory-architecture.md) — 6-tier memory design
- [Test Suite Documentation](060-test-suite.md) — Full test architecture
- [Code Splitting](070-code-splitting.md) — Performance optimization
- [Zero-Dependency Architecture](100-dependency-removal.md) — Dependency rules
- [CI/CD Pipeline](080-ci-cd.md) — GitHub Actions workflows

---

*Back to [Documentation Home](../index.md)*
