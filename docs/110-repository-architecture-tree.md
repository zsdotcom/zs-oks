# 110 — Repository Architecture Tree

**Document Version:** 1.0
**Date:** July 25, 2026
**Author:** Manus AI
**Target Repository:** Open Knowledge Studio v1.0

---

## 1. Overview

This document provides a detailed breakdown of the `/src` directory structure, explaining the purpose of each file and folder within the **Open Knowledge Studio v1.0** codebase. The architecture is designed to be modular, highly cohesive, and strictly adheres to the zero-dependency philosophy.

---

## 2. Root Configuration Files

These files reside at the root of the repository and manage the project's build process, type checking, and environment configuration.

| File/Folder | Purpose |
| :--- | :--- |
| `README.md` | Project overview, quick start guide, and repository tree. |
| `AGENTS.md` | Comprehensive agent definitions, tasks, skills, and memory permissions. |
| `LICENSE.md` | MIT License documentation. |
| `.env.example` | Template for environment variables (API keys, client IDs). |
| `.gitignore` | Rules for ignoring files in version control (e.g., `node_modules`, `.env`). |
| `index.html` | Application entry point (Vite handles the build). |
| `package.json` | Project metadata, scripts, and dependency management. |
| `tsconfig.json` | TypeScript configuration (strict mode enabled). |
| `vite.config.ts` | Vite build configuration (optimized for Vite 8 / Rolldown). |
| `vitest.config.ts` | Vitest testing configuration (happy-dom, coverage). |

---

## 3. `/docs` Folder (Serialized Documentation)

All project documentation is stored here, numbered sequentially for easy navigation by both humans and AI agents.

| File | Purpose |
| :--- | :--- |
| `000-project-overview.md` | High-level project vision and goals. |
| `010-blueprint.md` | Core features, target audience, and success metrics. |
| `020-architecture.md` | System architecture, harness pattern, and A2A protocol. |
| `030-design.md` | UI/UX specifications, color-coding, and theming. |
| `040-development.md` | Contribution guidelines, coding standards, and git workflow. |
| `050-setup.md` | Step-by-step environment setup and build instructions. |
| `060-agents-configuration.md` | Detailed agent roles, system prompts, and permissions. |
| `070-memory-architecture.md` | 6-tier memory system, IndexedDB schema, and vector search. |
| `080-test-suite.md` | Comprehensive testing strategy, benchmarks, and CI/CD. |
| `090-gap-analysis.md` | Technical debt, missing features, and enhancement roadmap. |
| `100-dependency-removal-notes.md` | Strategy for removing third-party dependencies. |

---

## 4. `/src` Folder (Source Code)

The core application logic resides in the `/src` directory. It is organized by functional domain (components, services, database, utilities, tests).

### 4.1 `/src/components`

This folder contains all React components, organized by their primary function.

| File | Purpose |
| :--- | :--- |
| `App.tsx` | Main application shell, routing, and global state provider. |
| `ChatInterface.tsx` | UI for interacting with the Coordinator agent (includes voice input). |
| `DocumentEditor.tsx` | Split-pane editor for the Writer agent with Markdown preview and version history. |
| `GoogleWorkspacePanel.tsx` | Integration panel for Google Drive, Docs, and Sheets. |
| `KnowledgeBaseManager.tsx` | Drag-and-drop interface for managing files and folders. |
| `MetricsDashboard.tsx` | Real-time visualization of A2A protocol telemetry and agent status. |
| `SearchPanel.tsx` | Full-text and semantic search interface powered by Orama JS. |
| `SettingsPanel.tsx` | GUI for configuring API keys, providers, and workspace paths. |
| `ThemeSwitcher.tsx` | Component for toggling between Dark and Light themes. |
| `WorkspaceManager.tsx` | UI for managing project isolation and multi-agent workspaces. |
| `charts/SimpleCharts.tsx` | Zero-dependency SVG charting components. |
| `icons/lucide-shim.tsx` | Custom SVG icon components (replaces FontAwesome/Lucide). |

### 4.2 `/src/services`

This folder contains the core business logic and external API integrations.

| File | Purpose |
| :--- | :--- |
| `geminiService.ts` | Handles API calls to Google Gemini and Groq, including the Smart Router. |
| `googleAuthService.ts` | Zero-dependency Google OAuth and Drive synchronization logic. |
| `memoryApi.ts` | Unified API wrapper for interacting with the 6-tier memory system. |
| `searchService.ts` | Client-side search engine service utilizing Orama JS. |

### 4.3 `/src/db`

This folder manages the browser's native storage.

| File | Purpose |
| :--- | :--- |
| `indexedDB.ts` | IndexedDB schema definition, initialization, and core CRUD operations for all 6 memory tiers. |

### 4.4 `/src/utils`

This folder contains pure utility functions that do not rely on external state or components.

| File | Purpose |
| :--- | :--- |
| `highlight.ts` | Zero-dependency syntax highlighting utility (replaces highlight.js). |
| `markdown.ts` | Lightweight Markdown parser utility (replaces marked). |

### 4.5 `/src/test`

This folder contains the comprehensive test suite for the memory architecture.

| File | Purpose |
| :--- | :--- |
| `setup.ts` | Global test setup (mocks for IndexedDB, BroadcastChannel, Web Workers). |
| `memory.unit.test.ts` | Unit tests for each of the 6 memory tiers. |
| `memory.integration.test.ts` | Integration tests for cross-tier operations and workspace isolation. |
| `memory.benchmark.test.ts` | Performance benchmarks (write/read throughput, vector search latency). |

---

## 5. `/public` Folder (Static Assets)

This folder contains static files that are copied directly to the build output (`dist/`).

| File | Purpose |
| :--- | :--- |
| `favicon.svg` | Application icon. |
| `manifest.json` | Web App Manifest for PWA support. |
| `sw.js` | Service Worker script for offline caching and background sync. |
