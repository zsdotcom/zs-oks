# 010 — Project Blueprint

This document outlines the core features, target audience, and success metrics for **Open Knowledge Studio v1.0**.

## 1. Core Features

### 1.1 Multi-Agent Workflow (Harness Pattern)
The platform utilizes a **Harness Pattern** where a **Coordinator Agent** orchestrates a team of specialized agents (Researcher, Writer, Data Analyst, Reviewer, Librarian). These agents communicate via the **Agent-to-Agent (A2A) Protocol** and operate within isolated workspaces to prevent data corruption.

### 1.2 6-Tier Memory Architecture
A hierarchical memory system ensures efficient storage and retrieval:
1. **Session Memory:** Short-lived variables (truncated on refresh).
2. **Episodic Memory:** Conversation history and summaries (auto-purged after 90 days).
3. **Semantic Memory:** Vector embeddings for "search by meaning" (managed by Librarian).
4. **Procedural Memory:** Operational rules and skills (never auto-purged).
5. **Working Memory:** Temporary scratchpads for agent calculations (flushed on session end).
6. **Long-Term Memory:** Persistent knowledge base (manual purge only).

### 1.3 Zero-Dependency AI
The application runs entirely in the browser, leveraging:
- **IndexedDB** for persistent storage.
- **Transformers.js** (WebGPU/WebAssembly) for zero-cost vector embeddings.
- **Orama JS** for lightning-fast (5-10ms) client-side semantic search.

### 1.4 Color-Coded Real-Time Rendering
The UI features a dark/light theme toggle and integrates **Mermaid.js** for live, color-coded diagram rendering (flowcharts, sequence diagrams, Gantt charts, etc.) via a `BroadcastChannel`-based preview.

### 1.5 True Offline-First
A Service Worker (PWA) ensures the application works seamlessly without an internet connection, caching assets and API responses locally.

---

## 2. Target Audience

- **Researchers & Academics:** Synthesizing literature and generating structured summaries with citations.
- **Public Health Professionals:** Processing epidemiological data, generating epi curves, and writing reports.
- **Developers & Technical Writers:** Managing documentation and knowledge bases offline.
- **Privacy-Conscious Users:** Keeping sensitive data strictly on their local device.

---

## 3. Success Metrics

| Metric | Target | Measurement Method |
| :--- | :--- | :--- |
| **Search Latency** | <10ms | Performance benchmarks (Vitest) |
| **Storage Capacity** | GB-scale | IndexedDB quota monitoring |
| **Offline Capability** | 100% | PWA Service Worker coverage |
| **Build Size** | <100KB gzip | Vite production build analysis |
| **Test Coverage** | >80% | Vitest V8 coverage reports |
