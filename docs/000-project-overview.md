# 000 — Project Overview

**Open Knowledge Studio v2.0** is a zero-dependency, browser-native, 6-agent AI platform for offline-first research, writing, and data analysis. It operates entirely within your browser using IndexedDB for persistent memory, Transformers.js for vector embeddings, and Orama JS for semantic search — all loaded dynamically from CDN with no npm runtime dependencies.

## 1. Vision & Mission

Democratize access to powerful AI tooling for research and knowledge management without requiring users to rely on expensive cloud services.

**Open Knowledge Studio** achieves this by:
- Running entirely in the browser (zero backend costs).
- Leveraging free LLM APIs (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama).
- 6-agent A2A workflow system (Coordinator, Researcher, Data Analyst, Writer, Reviewer, Librarian).
- 384-dim vector embeddings via Transformers.js (all-MiniLM-L6-v2) in a Web Worker.
- Hybrid vector + keyword semantic search via Orama JS (CDN-loaded).
- Robust 6-tier memory architecture using IndexedDB.

## 2. Core Features

- **6-Agent A2A Workflow:** Coordinator orchestrates Researcher, Data Analyst, Writer, Reviewer, and Librarian agents in a real-time debate panel.
- **Vector Embeddings:** Transformers.js running in a Web Worker generates 384-dimensional embeddings for all semantic memory entries.
- **Vector Search:** Orama JS provides hybrid (vector + keyword) search across the semantic memory store, with fallback to keyword matching.
- **6-Tier Memory:** Session (in-memory), Episodic, Semantic (vector-indexed), Procedural, Working, Long-Term.
- **Multi-Provider LLM Router:** Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama via a unified API.
- **Chat, Editor, Kanban, Search, Google Workspace, MCP Server** — all in a single-page app.

## 3. Agent Color-Coding

| Agent | Color | Avatar |
| :--- | :--- | :--- |
| Coordinator | `#8B5CF6` (Purple) | 🎯 |
| Researcher | `#06B6D4` (Cyan) | 🔬 |
| Data Analyst | `#F59E0B` (Amber) | 📊 |
| Writer | `#10B981` (Emerald) | ✍️ |
| Reviewer | `#EF4444` (Red) | 🔍 |
| Librarian | `#8B5CF6` (Purple) | 📚 |

## 4. Zero Dependency Architecture

Runtime npm deps: **only `react` + `react-dom`**. All heavy lifting:
- **Transformers.js** loaded dynamically from CDN (`cdn.jsdelivr.net/npm/@huggingface/transformers`)
- **Orama JS** loaded dynamically from CDN (`cdn.jsdelivr.net/npm/@orama/orama`)
- Vector computation runs in a **Web Worker** (background thread)
- All icons, charts, markdown parsing, and highlighting are custom inline implementations
