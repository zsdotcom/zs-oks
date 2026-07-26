# 020 — System Architecture

**Open Knowledge Studio v1.0** is built on a **Harness Pattern** where specialized agents operate within isolated workspaces and communicate through the **Agent-to-Agent (A2A) Protocol**. This document details the system architecture, memory schema, and integration strategies.

---

## 1. The Harness Pattern

The application is structured as a "Harness" that wraps and orchestrates multiple autonomous AI agents. 

- **The Coordinator:** Acts as the central hub, receiving user input, decomposing complex tasks, and delegating them to specialized agents.
- **Isolation:** Each agent operates within its own isolated memory space (IndexedDB partition) to prevent data corruption and ensure secure execution.
- **Communication:** Agents communicate via a standardized `BroadcastChannel` API, allowing cross-tab and cross-agent real-time updates without a backend server.

---

## 2. 6-Tier Memory Architecture

The platform utilizes a hierarchical memory system stored entirely in **IndexedDB** and enhanced with **Transformers.js** for vector embeddings.

| Memory Tier | Purpose | Auto-Purge Logic |
| :--- | :--- | :--- |
| **1. Session** | Short-lived variables, active context | Truncated on page refresh |
| **2. Episodic** | Conversation history, summaries | Configurable retention (e.g., 90 days) |
| **3. Semantic** | Vector embeddings for "search by meaning" | Managed by Librarian agent |
| **4. Procedural** | Operational rules and skills | Never auto-purged |
| **5. Working** | Temporary scratchpads for calculations | Flushed on session end |
| **6. Long-Term** | Persistent knowledge base | Manual purge only |

### 2.1 Vector Search & Embeddings
- **Embedding Generation:** Uses the `all-MiniLM-L6-v2` model via **Transformers.js** (WebGPU/WebAssembly) to generate 384-dimensional vectors.
- **Search Engine:** Utilizes **Orama JS** for lightning-fast (5-10ms) client-side semantic search and hybrid queries (full-text + vector similarity).

---

## 3. Agent-to-Agent (A2A) Protocol

The A2A protocol defines how agents communicate and share data.

### 3.1 Message Format
```typescript
interface A2AMessage {
  from: string;      // Sender Agent ID
  to: string;        // Receiver Agent ID
  type: string;      // Message Type (e.g., 'task', 'result', 'error')
  payload: any;      // Task data or result
  timestamp: number; // Execution time
}
```

### 3.2 Telemetry & Metrics
The Coordinator tracks agent execution time, token usage, and error rates, visualizing this data in the `MetricsDashboard` component.

---

## 4. Provider & LLM Routing

The platform supports multiple LLM providers via a unified API interface.

- **Default Providers:** Google Gemini (2.5 Pro) for complex reasoning; Groq (Llama 3.3 70B) for fast, large-context tasks.
- **Smart Router:** Automatically selects the best provider based on query complexity, cost, and rate limits.
- **Fallback Chain:** If a primary provider fails, the system automatically falls back to the next available provider in the chain.

---

## 5. Workspace Isolation

To support multi-agent collaboration without data corruption, the architecture enforces strict **workspace isolation**.

- **Composite Key Strategy:** Instead of separate databases, we use composite primary keys: `{ projectId }:{ agentId }:{ recordId }`.
- **Merge & Compare:** When a sub-agent completes a task, the Coordinator initiates a `diff3` comparison between the sub-agent's snapshot and the main project's current state.
- **Merge/Discard:** Validated changes are written to the main project store; rejected changes are aborted without side effects.
