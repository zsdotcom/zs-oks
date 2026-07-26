# 040 — Development & Contribution Guidelines

This document outlines the coding standards, git workflow, and contribution guidelines for **Open Knowledge Studio v1.0**.

---

## 1. Coding Standards

### 1.1 TypeScript & Strict Typing
- All source code must be written in **TypeScript** (strict mode enabled).
- Avoid `any` types. Use `unknown` with type guards for dynamic values.

### 1.2 React Components
- Functional components with React Hooks only.
- Keep components focused on a single responsibility.
- Custom hooks for complex logic (`useChat`, `useFiles`, `usePersistence`).

### 1.3 State Management
- No external state management libraries (Redux, Zustand, etc.).
- Use `useState`, `useReducer`, and `useContext`.
- For persistent state, interact directly with IndexedDB via `db/indexedDB.ts` or `services/memoryApi.ts`.

### 1.4 Zero Dependency Rule
- **Never introduce new runtime dependencies** without evaluation against `docs/100-dependency-removal-notes.md` criteria.
- Prefer native browser APIs (`BroadcastChannel`, `Web Workers`, `Web Speech API`, `File System Access API`).

---

## 2. Git Workflow

### 2.1 Branch Naming
- `main`: Stable branch.
- `feature/<feature-name>`: New features.
- `fix/<issue-description>`: Bug fixes.
- `docs/<update-description>`: Documentation updates.

### 2.2 Commit Messages
Conventional Commits specification:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

### 2.3 Pull Requests
- All changes to `main` must go through a PR.
- PRs must pass CI checks (typecheck, build, tests, coverage >80%).

---

## 3. Testing Strategy

### 3.1 Vitest Configuration
- Environment: `happy-dom`
- Setup file: `src/test/setup.ts` (mocks `fake-indexeddb`, `BroadcastChannel`, `Worker`, `crypto.randomUUID`)

### 3.2 Running Tests
```bash
npm test                    # All tests
npm run test:watch          # Watch mode
npm run test:coverage       # With V8 coverage
npm run test:bench          # Benchmarks
```

### 3.3 Coverage Thresholds
- Statement coverage: >80%
- Branch coverage: >75%
- Function coverage: >85%
- Line coverage: >80%

### 3.4 Test Files
| File | Type | Count |
| :--- | :--- | :--- |
| `memory.unit.test.ts` | Unit tests | 15 cases |
| `memory.integration.test.ts` | Integration tests | 6 cases |
| `memory.benchmark.ts` | Benchmarks | 4 cases |

---

## 4. How to Contribute

1. **Fork the repository.**
2. **Create a feature branch** (`git checkout -b feature/your-feature`).
3. **Make changes** and pass all tests.
4. **Commit** using Conventional Commits.
5. **Push** (`git push origin feature/your-feature`).
6. **Open a Pull Request** against `main`.
7. **Address feedback** and await merge.
