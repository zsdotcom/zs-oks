# 010 — Project Blueprint

This document outlines the core features and success metrics for **Open Knowledge Studio v2.0**.

## 1. Core Features

### 1.1 6-Agent A2A Workflow
| Agent | Role | Avatar | Color |
| :--- | :--- | :--- | :--- |
| **Coordinator** | Orchestrates, delegates, validates | 🎯 | `#8B5CF6` |
| **Researcher** | Searches, synthesizes, cites | 🔬 | `#06B6D4` |
| **Data Analyst** | Processes data, statistics, charts | 📊 | `#F59E0B` |
| **Writer** | Drafts, templates, formats | ✍️ | `#10B981` |
| **Reviewer** | QA, citations, compliance | 🔍 | `#EF4444` |
| **Librarian** | Memory, knowledge, references | 📚 | `#8B5CF6` |

Agents respond independently to user prompts in the A2A debate panel. Custom agents can be created via Settings.

### 1.2 Vector Embeddings + Semantic Search
- **Transformers.js** (`all-MiniLM-L6-v2`) in a Web Worker generates 384-dim vectors.
- **Orama JS** (CDN-loaded) indexes vectors for hybrid keyword + vector search.
- Fallback to pure keyword matching if CDN is unavailable.

### 1.3 6-Tier Memory Architecture
1. **Session:** In-memory Map (cleared on refresh).
2. **Episodic:** Conversation history in IndexedDB (auto-purge at 90 days).
3. **Semantic:** Text + 384-dim vector in IndexedDB + Orama.
4. **Procedural:** Operational rules (never auto-purged).
5. **Working:** Temporary scratchpads (flushed on session end).
6. **Long-Term:** Persistent knowledge base (manual purge only).

### 1.4 Multi-Provider AI
Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama via a unified `geminiService.ts`.

### 1.5 Google Workspace Integration
OAuth-based Drive, Docs, Sheets, and Gmail integration.

### 1.6 PWA Offline-First
Service Worker (`public/sw.js`) caches all assets for offline use.

---

## 2. Success Metrics

| Metric | Target | Measurement |
| :--- | :--- | :--- |
| Vector Embedding Gen | <100ms per text | Vitest benchmark |
| Semantic Search | <50ms hybrid query | Vitest benchmark |
| Test Coverage | >80% | Vitest V8 report |
| Build Size | <200KB gzip | Vite build analysis |
