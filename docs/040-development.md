# 040 — Development & Contribution Guidelines

This document outlines the coding standards, git workflow, and contribution guidelines for **Open Knowledge Studio v1.0**.

---

## 1. Coding Standards

### 1.1 TypeScript & Strict Typing
- All source code must be written in **TypeScript**.
- Strict mode is enabled in `tsconfig.json`.
- Avoid using `any` types. If a type is truly dynamic, use `unknown` and perform type guards before accessing properties.

### 1.2 React Components
- Use functional components with React Hooks.
- Avoid class components.
- Keep components small and focused on a single responsibility.
- Use custom hooks for complex logic (e.g., `useMemory`, `useLLM`).

### 1.3 State Management
- Do not use external state management libraries (Redux, Zustand, etc.).
- Rely on React's built-in `useState`, `useReducer`, and `useContext`.
- For persistent state, interact directly with the `MemoryAPI` (IndexedDB).

### 1.4 Zero Dependency Rule
- **Never introduce new runtime dependencies** without explicit approval from the Coordinator Agent or project maintainer.
- If a new dependency is proposed, it must be evaluated against the `docs/100-dependency-removal-notes.md` criteria (size, cost, maintenance).
- Prefer native browser APIs (e.g., `BroadcastChannel`, `Web Workers`, `File System Access API`) over third-party libraries.

---

## 2. Git Workflow

We use a streamlined Git workflow to maintain a clean history.

### 2.1 Branch Naming
- `main`: The primary, stable branch.
- `feature/<feature-name>`: For new features (e.g., `feature/vector-search`).
- `fix/<issue-description>`: For bug fixes (e.g., `fix/merge-conflict`).
- `docs/<update-description>`: For documentation updates.

### 2.2 Commit Messages
Follow the **Conventional Commits** specification:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring (no functional change)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```text
feat(memory): implement 6-tier IndexedDB schema

- Added semantic memory store for vector embeddings
- Integrated Orama JS for client-side search
- Added auto-purge logic for episodic memory
```

### 2.3 Pull Requests (PRs)
- All changes to `main` must go through a Pull Request.
- PRs must include a description of the changes and link to any relevant issues.
- PRs must pass all CI/CD checks (linting, unit tests, integration tests, coverage >80%).
- At least one approval is required from a project maintainer.

---

## 3. Testing Strategy

### 3.1 Vitest Configuration
- Tests are run using **Vitest**.
- The environment is set to `happy-dom` for DOM mocking.
- Setup files (`src/test/setup.ts`) mock browser-native APIs like `fake-indexeddb`.

### 3.2 Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 3.3 Coverage Thresholds
- Statement coverage: >80%
- Branch coverage: >75%
- Function coverage: >85%
- Line coverage: >80%

---

## 4. How to Contribute

1. **Fork the repository.**
2. **Create a feature branch** (`git checkout -b feature/your-feature`).
3. **Make your changes** and ensure they pass all tests.
4. **Commit your changes** using Conventional Commits.
5. **Push to your fork** (`git push origin feature/your-feature`).
6. **Open a Pull Request** against the `main` branch of the original repository.
7. **Wait for review** and address any feedback.
