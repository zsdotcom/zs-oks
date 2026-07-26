# 6-Tier Memory Architecture Implementation Plan

**Document Version:** 1.0
**Date:** July 25, 2026
**Author:** Manus AI
**Target Repository:** Open Knowledge Studio v1.0

---

## 1. Executive Summary

This document provides a detailed, code-level implementation plan for the **6-Tier Memory Architecture** of Open Knowledge Studio v1.0. The architecture is designed to operate entirely in the browser, leveraging **IndexedDB** for persistent storage and **Transformers.js** for zero-cost vector embeddings [1] [2]. 

The system utilizes **Orama JS** [3] for lightning-fast (5-10ms) client-side semantic search and implements strict **workspace isolation** to ensure data integrity across multi-agent workflows. All implementations adhere to the constraint of using only browser-native technologies and zero-cost, open-source libraries.

---

## 2. Technology Stack & Dependencies

| Technology | Version | Purpose | Size/Cost |
| :--- | :--- | :--- | :--- |
| **IndexedDB** | Native | Core persistent storage for all 6 tiers | Zero cost, ~80% disk space per origin [4] |
| **Orama JS** | Latest | Full-text and vector search engine (HNSW) | 80KB minified, zero dependencies [3] |
| **Transformers.js** | v4.x | Browser-native ML for text embeddings | Runs via WebAssembly/WebGPU [2] |
| **Web Workers** | Native | Background processing for embeddings | Zero cost, parallel execution |
| **BroadcastChannel** | Native | Cross-tab real-time memory synchronization [5] | Zero cost, native API |

---

## 3. IndexedDB Schema Design

To optimize performance and avoid blocking the main thread, the memory architecture breaks down state into individual records rather than storing the entire state tree as a single object [6].

### 3.1 Database Name: `oks_memory_v1`

The database is structured into six primary object stores, one for each memory tier.

```typescript
// Schema Definition
const DB_NAME = 'oks_memory_v1';
const DB_VERSION = 1;

const STORES = {
  SESSION: 'sessions',       // Tier 1: Session Memory
  EPISODIC: 'episodic',      // Tier 2: Episodic Memory
  SEMANTIC: 'semantic',      // Tier 3: Semantic Memory (Vectors)
  PROCEDURAL: 'procedural',  // Tier 4: Procedural Memory
  WORKING: 'working',        // Tier 5: Working Memory
  LONG_TERM: 'long_term'     // Tier 6: Long-Term Memory
};

// Indexing Strategy for Performance [7]
const INDEXES = {
  sessions: ['projectId', 'createdAt'],
  episodic: ['projectId', 'createdAt', 'agentId'],
  semantic: ['projectId', 'agentId', 'topic'],
  procedural: ['projectId', 'skillId'],
  working: ['projectId', 'agentId', 'sessionId'],
  long_term: ['projectId', 'category']
};
```

### 3.2 Data Models per Tier

| Memory Tier | Key Path | Primary Indexes | Data Structure Highlights | Auto-Purge Logic |
| :--- | :--- | :--- | :--- | :--- |
| **Session** | `id` | `projectId`, `createdAt` | Short-lived variables, active context. Stored as simple key-value pairs. | Truncated on page refresh. |
| **Episodic** | `id` | `projectId`, `agentId` | Conversation history, summaries. Includes `summary` (string) and `full_text` (string). | Configurable retention (e.g., 90 days). |
| **Semantic** | `id` | `projectId`, `topic` | Vector embeddings. Includes `text` (original), `embedding` (Float32Array, 384-dim), and `metadata`. | Managed by Librarian agent. |
| **Procedural** | `id` | `projectId`, `skillId` | Operational rules and skills. Includes `instructions` and `trigger_conditions`. | Never auto-purged. |
| **Working** | `id` | `agentId`, `sessionId` | Temporary scratchpads. Includes `draft_data` and `intermediate_state`. | Flushed on session end. |
| **Long-Term** | `id` | `projectId`, `category` | Persistent knowledge base. Includes `facts`, `glossary_terms`, and `references`. | Manual purge only. |

---

## 4. Vector Search & Embedding Implementation

Semantic memory (Tier 3) relies on vector embeddings to enable "search by meaning" rather than exact keyword matching [8].

### 4.1 Embedding Generation with Transformers.js

We utilize the `all-MiniLM-L6-v2` model via Transformers.js [2]. This model generates 384-dimensional vectors and is optimized for speed and size in browser environments.

```typescript
import { pipeline } from "@huggingface/transformers";

// Initialize the pipeline (lazy loading for performance)
let embedder: any = null;

async function initEmbedder() {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { device: "webgpu" } // Utilize WebGPU if available for 100x speedup [9]
    );
  }
  return embedder;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const extractor = await initEmbedder();
  const output = await extractor(text, { 
    pooling: "mean", 
    normalize: true 
  });
  return Array.from(output.data);
}
```

**Performance Optimization:**
To prevent main-thread blocking during bulk embedding generation, this function is executed within a **Web Worker**. The worker processes batches of 10-20 text chunks asynchronously, returning the vectors to the main thread for IndexedDB insertion [10].

### 4.2 Client-Side Vector Search with Orama JS

For querying the semantic index, we use **Orama JS** [3], which provides an in-memory, HNSW-based vector search engine. It requires zero backend infrastructure and delivers query times in the 5-10ms range.

```typescript
import { create, insert, search } from "@orama/orama";

// Initialize Orama Database
const semanticDB = await create({
  schema: {
    projectId: "string",
    agentId: "string",
    topic: "string",
    text: "string",
    // 384-dimensional vector field
    embedding: "vector[384]" 
  }
});

// Insert a new semantic memory
async function storeSemanticMemory(memoryEntry: MemoryEntry) {
  const embedding = await generateEmbedding(memoryEntry.text);
  
  await insert(semanticDB, {
    projectId: memoryEntry.projectId,
    agentId: memoryEntry.agentId,
    topic: memoryEntry.topic,
    text: memoryEntry.text,
    embedding: embedding
  });
}

// Perform semantic search (Hybrid query)
async function searchMemories(query: string, projectId: string, topK = 5) {
  const queryEmbedding = await generateEmbedding(query);
  
  const results = await search(semanticDB, {
    term: query, // Full-text match
    mode: "hybrid",
    vector: {
      value: queryEmbedding, // Vector similarity match
      property: "embedding"
    },
    where: {
      projectId: projectId // Filter by current workspace
    },
    limit: topK
  });
  
  return results.hits;
}
```

---

## 5. Workspace Isolation Strategy

To support multi-agent collaboration without data corruption, the architecture enforces strict **workspace isolation** [11].

### 5.1 Isolation via IndexedDB Indexing

Instead of creating separate IndexedDB databases for each agent, we use a composite primary key strategy: `{ projectId }:{ agentId }:{ recordId }`.

```typescript
// Key generation for workspace isolation
function generateIsolatedKey(projectId: string, agentId: string, actionId: string) {
  return `${projectId}:${agentId}:${actionId}`;
}

// Example usage when storing working memory
const workingStore = db.transaction('working', 'readwrite').objectStore('working');
const key = generateIsolatedKey("project-123", "agent-data", "calc-step-4");
workingStore.put({ key: key, data: intermediateResult });
```

### 5.2 The Merge & Compare Phase

When a sub-agent completes a task, its isolated data must be merged into the main project workspace.

1. **Clone:** The sub-agent's IndexedDB transaction creates a snapshot of its workspace.
2. **Compare:** The Coordinator agent initiates a `diff3` comparison between the sub-agent's snapshot and the main project's current state.
3. **Merge/Discard:** 
   - If the Coordinator validates the output, the changes are written to the main project store.
   - If rejected, the sub-agent's isolated transaction is aborted, and no side effects occur [11].

---

## 6. Real-Time Memory Operations Protocol

The memory system operates asynchronously to ensure the UI remains responsive.

### 6.1 Auto-Save Trigger (Episodic Memory)

Every agent response triggers an auto-save process. To optimize performance, this is debounced by 500ms.

```typescript
let saveTimeout: any;

async function triggerEpisodicSave(projectId: string, agentResponse: string) {
  clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(async () => {
    // 1. Store the raw conversation
    await db.transaction('episodic', 'readwrite')
      .objectStore('episodic')
      .add({
        id: crypto.randomUUID(),
        projectId: projectId,
        text: agentResponse,
        createdAt: new Date().toISOString(),
        // Summary generated later by Librarian agent
        summary: null 
      });
      
    // 2. Notify other tabs via BroadcastChannel
    broadcastMemoryUpdate(projectId, 'episodic');
  }, 500);
}
```

### 6.2 Cross-Tab Synchronization

To maintain consistency when a user has the platform open in multiple tabs, the **BroadcastChannel API** [5] is utilized.

```typescript
const memoryChannel = new BroadcastChannel('oks_memory_sync');

memoryChannel.onmessage = (event) => {
  const { projectId, storeName, action } = event.data;
  
  if (action === 'update' || action === 'delete') {
    // Refresh the local state for the specific store
    refreshLocalState(projectId, storeName);
  }
};

function broadcastMemoryUpdate(projectId: string, storeName: string) {
  memoryChannel.postMessage({
    projectId,
    storeName,
    action: 'update'
  });
}
```

---

## 7. Integration Strategy for Agents

The 6-tier memory architecture is exposed to the agents via a unified API interface.

### 7.1 The `MemoryAPI` Wrapper

Agents interact with the memory system through a standardized set of tools:

| Tool ID | Underlying Mechanism | Target Tier |
| :--- | :--- | :--- |
| `remember` | IndexedDB `put` + Orama `insert` | Episodic, Semantic, Long-Term |
| `recall` | Orama `search` (Hybrid) | Semantic, Episodic |
| `forget` | IndexedDB `delete` + Orama `remove` | Any (requires permission) |
| `summarize` | LLM Inference + IndexedDB `put` | Episodic |
| `vectorize` | Web Worker + Transformers.js | Semantic |

### 7.2 Agent-Specific Memory Scopes

Based on the AGENTS.md configuration:

- **Coordinator:** Has `Full` scope. Can read/write across all 6 tiers. Used for workflow orchestration.
- **Librarian:** Has `Full` scope. Primary owner of Semantic indexing and Episodic summarization.
- **Researcher:** Has `Persistent` scope. Focuses heavily on Semantic memory to store findings from external APIs.
- **Writer/Data Analyst:** Have `Session + Working` scope. Use IndexedDB working stores for drafts and calculations, flushing to Episodic upon completion.
- **Reviewer:** Has `Session` scope. Reads from Episodic/Semantic to perform audits but does not write to persistent memory.

---

## 8. Performance & Optimization Guidelines

1. **Structured Clone Overhead:** IndexedDB performs a structured clone on write. To avoid blocking the UI, never store massive, nested objects in a single record. Break data into smaller chunks [6].
2. **Vector Quantization:** For large-scale semantic memory (10k+ records), implement scalar quantization to reduce embedding size by up to 75% with negligible (<0.08%) precision loss [3].
3. **Storage Quotas:** Implement `navigator.storage.estimate()` monitoring. If usage approaches the browser's limit (typically 80% of free disk space [4]), trigger the Librarian agent to execute memory maintenance (archiving old episodic data).
4. **WebGPU Acceleration:** Default to `device: "webgpu"` in Transformers.js for embedding generation, falling back to WASM only if WebGPU is unsupported by the browser [9].

---

## 9. References

[1]: Hugging Face. "Transformers.js." https://huggingface.co/docs/transformers.js/en/index

[2]: Nearform. "Browser-based vector search: fast, private, and no backend required." https://nearform.com/digital-community/browser-based-vector-search-fast-private-and-no-backend-required/

[3]: Orama JS Documentation. "Introduction." https://docs.orama.com/docs/orama-js

[4]: RxDB. "IndexedDB Max Storage Size Limit." https://rxdb.info/articles/indexeddb-max-storage-limit.html

[5]: MDN Web Docs. "BroadcastChannel API." https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel

[6]: Google Developers. "Best Practices for Persisting Application State with IndexedDB." https://web.dev/articles/indexeddb-best-practices-app-state

[7]: Nolan Lawson. "Speeding up IndexedDB reads and writes." https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/

[8]: RxDB. "Local JavaScript Vector Database that works offline." https://rxdb.info/articles/javascript-vector-database.html

[9]: Hugging Face. "Transformers.js v3: WebGPU Support, New Models & Tasks." https://huggingface.co/blog/transformersjs-v3

[10]: Mozilla Developer Network. "Using Web Workers." https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

[11]: AI21 Labs. "What is Workspace Isolation?" https://www.ai21.com/glossary/ai-agent/what-is-workspace-isolation/
