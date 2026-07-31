# PLAN: Reorganization and Agentic Infrastructure Enhancement for zs-oks

This plan outlines the structural reorganization and functional enhancement of the `zs-oks` repository to transform it into a world-class, agent-native infrastructure. The goal is to ensure a clean hierarchy, modularity, and "no-coder friendly" maintainability while strengthening its agentic capabilities.

---

## 1. Vision and Objectives

*   **Hierarchical Organization:** Clearly separate application code, documentation, and infrastructure.
*   **Interconnected Configuration:** Centralize configurations to avoid "scattered" settings, making them easier to manage for non-coders.
*   **Agent-Native Infrastructure:** Incorporate modern agentic design patterns (e.g., `AGENTS.md`, standardized tool schemas, and knowledge base integration).
*   **Developer & Maintainer Friendly:** Ensure the structure is intuitive for both "vibe-coders" (no-coders) and professional developers.

---

## 2. Proposed Repository Structure (Target)

The repository will be reorganized into a multi-tier hierarchy:

```text
zs-oks/
├── .config/                  # Centralized Configuration (Hidden/Internal)
│   ├── env/                  # Environment-specific variables
│   ├── vercel.json           # Deployment config
│   ├── netlify.toml          # Deployment config
│   └── ...                   # Other tool-specific configs (ESLint, TS, etc.)
├── app/                      # Primary Application Location
│   ├── src/                  # React/TypeScript source code
│   ├── public/               # Static assets
│   ├── gas/                  # Google Apps Script (Backend)
│   └── index.html            # Entry point
├── docs/                     # Comprehensive Documentation (Separate & Organized)
│   ├── architecture/         # System design and blueprints
│   ├── developers/           # Guides for contributors
│   ├── guides/               # User-facing tutorials
│   ├── project/              # Concept and specifications
│   └── research/             # Analysis and reports
├── infrastructure/           # Agentic Infrastructure Components
│   ├── agents/               # Standardized Agent Definitions (AGENTS.md)
│   ├── tools/                # Reusable tool schemas (MCP, APIs)
│   ├── workflows/            # Defined agentic workflows
│   └── knowledge/            # Centralized knowledge base templates
├── scripts/                  # Automation and Setup Scripts
│   ├── setup.sh              # Unified bootstrap script
│   └── ...                   # Maintenance utilities
├── tests/                    # Consolidated Test Suite
│   ├── e2e/                  # Playwright end-to-end tests
│   └── unit/                 # Vitest unit tests
├── AGENTS.md                 # Project-level agent instructions (New Standard)
├── PLAN.md                   # This reorganization plan
└── README.md                 # Project overview and entry point
```

---

## 3. Key Enhancements for Agentic Infrastructure

To make this a complete agentic infrastructure, we will include:

### A. Agent Standardization (`infrastructure/agents/`)
*   **`AGENTS.md`**: A root-level file following the emerging standard for project-specific agent instructions. It helps AI agents (like Manus, Copilot, or Cursor) understand the codebase's "personality" and rules.
*   **Role Definitions**: Standardized JSON/Markdown files defining different agent roles (e.g., Researcher, Coder, Analyst).

### B. Tooling and Connectivity (`infrastructure/tools/`)
*   **MCP Schemas**: Centralized Model Context Protocol (MCP) server definitions.
*   **Unified API Registry**: A single location to manage and document all connected APIs (Gemini, OpenAI, Anthropic, etc.).

### C. Knowledge Base Integration (`infrastructure/knowledge/`)
*   **Centralized Context**: Templates for building project-specific knowledge bases that agents can consume.
*   **Standardized Document Formats**: Ensuring all documents in `docs/` follow a structure that is easily parsed by LLMs.

---

## 4. Reorganization Steps

### Phase 1: Preparation
1.  **Backup**: Ensure the current state is pushed to a backup branch.
2.  **Config Centralization**: Create the `.config/` directory and move `vercel.json`, `netlify.toml`, `nginx.conf`, and `eslint.config.js` into it (updating references accordingly).

### Phase 2: Structural Migration
1.  **App Isolation**: Move `src/`, `public/`, `gas/`, and `index.html` into a new `app/` directory.
2.  **Test Consolidation**: Move `e2e/` and `src/test/` into a root-level `tests/` directory.
3.  **Documentation Cleanup**: Ensure all files in `docs/` are correctly categorized and linked.

### Phase 3: Agentic Infrastructure Setup
1.  **Create `infrastructure/`**: Initialize the subdirectories for agents, tools, and workflows.
2.  **Draft `AGENTS.md`**: Create the project-level agent instructions.
3.  **Tool Registry**: Migrate existing service definitions from `src/services/` into documented schemas in `infrastructure/tools/`.

### Phase 4: Configuration Re-linking
1.  **Update `package.json`**: Update script paths (e.g., `"dev": "vite app/"`, `"test": "vitest tests/unit"`).
2.  **Update `tsconfig.json`**: Adjust `include` and `exclude` paths to reflect the new structure.
3.  **Update `vite.config.ts`**: Update root and alias paths.

---

## 5. Maintenance for No-Coders

*   **Unified Setup**: The `scripts/setup.sh` will handle all environment configurations, making it a "one-click" experience.
*   **Centralized `.env` Management**: A clear template for environment variables that maps to the centralized configuration.
*   **Visual Documentation**: Using diagrams in `docs/architecture/` to show how the "interconnected" configs flow.

---

## 6. Success Metrics

*   [ ] Repository structure matches the target hierarchy.
*   [ ] `npm run dev` and `npm run build` work without path errors.
*   [ ] `AGENTS.md` is present and correctly describes the project.
*   [ ] All configurations are centralized in `.config/` or the root as appropriate.
*   [ ] Documentation is fully accessible and logically organized.
