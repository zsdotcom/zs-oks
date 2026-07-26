# Repository Tree Design

## ROOT LEVEL (only essential project config + README + AGENTS)
- README.md
- AGENTS.md
- LICENSE.md
- .gitignore
- .env.example
- package.json
- tsconfig.json
- vite.config.ts
- vitest.config.ts
- index.html

## /docs/ (serialized documentation, numbered)
- 000-project-overview.md
- 010-blueprint.md
- 020-architecture.md
- 030-design.md
- 040-development.md
- 050-setup.md
- 060-agents-configuration.md
- 070-memory-architecture.md
- 080-test-suite.md
- 090-gap-analysis.md
- 100-dependency-removal-notes.md
- 110-repository-architecture-tree.md

## /src/
### /src/components/
- App.tsx
- /components/ChatInterface.tsx
- /components/DocumentEditor.tsx
- /components/GoogleWorkspacePanel.tsx
- /components/KnowledgeBaseManager.tsx
- /components/MetricsDashboard.tsx
- /components/SearchPanel.tsx
- /components/SettingsPanel.tsx
- /components/ThemeSwitcher.tsx
- /components/WorkspaceManager.tsx
- /components/icons/lucide-shim.tsx
- /components/charts/SimpleCharts.tsx

### /src/services/
- /services/geminiService.ts
- /services/googleAuthService.ts
- /services/memoryApi.ts
- /services/searchService.ts

### /src/db/
- /db/indexedDB.ts

### /src/utils/
- /utils/highlight.ts
- /utils/markdown.ts

### /src/types.ts
### /src/index.tsx
### /src/index.css

## /public/
- /public/manifest.json
- /public/favicon.svg
- /public/sw.js

## /src/test/
- /test/setup.ts
- /test/memory.unit.test.ts
- /test/memory.integration.test.ts
- /test/memory.benchmark.test.ts

## /docs/agents/ (agent-specific docs)
- /agents/coordinator.md
- /agents/researcher.md
- /agents/writer.md
- /agents/data-analyst.md
- /agents/reviewer.md
- /agents/librarian.md