---
title: "000 — Enhancement Analysis 2026"
description: "Enhancement opportunity analysis and adaptation plan for Open Knowledge Studio (July 2026)"
category: "research"
order: 0
tags: ["research", "enhancement", "analysis"]
last_updated: "2026-07-28"
audience: "all"
---
# Open Knowledge Studio — Enhancement Analysis & Adaptation Plan (July 2026)

## 1. Executive Summary

This document analyzes the enhancement proposals in `enhancement-oppertunity_open-knowledge-studio.md`
against the **actual** Open Knowledge Studio codebase (a React SPA with zero backend), and presents a
feasible, browser-native adaptation plan.

**Core finding:** The original enhancement file describes a **different project** — a Python CLI tool
(`oks`) with filesystem-based cognitive buckets (profiles/, raw/, drafts/, wiki/). The actual project
is a browser-based React SPA with IndexedDB storage and 6-tier memory. All four proposed technologies
(LanceDB, LightRAG, Docling, FastMCP) are Python-native and cannot be directly integrated.

**Key insight:** The *conceptual architecture* (unified ranking, dual-level graph retrieval, multimodal
parsing, MCP interoperability) is sound. The adaptation replaces each Python dependency with a
browser-compatible JavaScript equivalent, many of which are already partially present.

---

## 2. Original Enhancement File — Formatting Corrections Applied

The following HTML span artifacts from copy-paste were fixed:

| Location | Before | After |
|----------|--------|-------|
| Line 258 (equation) | `\text{S[span_185]...[span_190]im}(q, e)` | `\text{Sim}(q, e)` |
| Line 293 (YAML) | `hardeni[span_46]...[span_46]ng_q1` | `hardening_q1` |
| Line 385 (workflow) | `ra[span_216]...[span_218]w/` | `raw/` |
| Line 398 (roadmap) | `dra[span_52]...[span_52]fts/` | `drafts/` |
| Line 404 (roadmap) | `oks h[span_208]...[span_213]ook install` | `oks hook install` |

---

## 3. Deep Research: Technology Feasibility Analysis

### 3.1 LanceDB — Embedded Columnar Vector Storage

| Aspect | Finding |
|--------|---------|
| **Runtime** | Python + Rust native. JS SDK (`@lancedb/lancedb`) requires Node.js native addons |
| **Browser** | `@lancedb/lancedb-web` exists for read-only WebAssembly search on published tables, but full read-write is not browser-compatible |
| **Size** | JS SDK ~1.3 MB install, 155 MB with native deps |
| **Feasibility** | **Not feasible** as direct replacement. The project's browser-only constraint prohibits native addons |

**Browser-native alternative already in use:** **Orama** (`@orama/orama`, 2 KB gzip) — pure TypeScript,
supports full-text, vector, and hybrid search. Already loaded via CDN in `oramaService.ts`.

### 3.2 LightRAG — Dual-Level Knowledge Graph Retrieval

| Aspect | Finding |
|--------|---------|
| **Runtime** | Python-only framework from HKU Data Science Lab (EMNLP 2025) |
| **Architecture** | Dual-level retrieval: low-level (entity-relationship triplets) + high-level (conceptual clusters) |
| **LLM dependency** | Uses LLM calls for entity extraction and graph construction |
| **Feasibility** | **Not feasible** as direct integration. Python runtime required |

**Browser-native alternative:** **Quadstore** (RDF graph database with LevelDB/IndexedDB backend)
or **Oxigraph** (WASM-compiled RDF store). Both support SPARQL queries in the browser.

**Concept to adapt:** The dual-level retrieval pattern (entity-level + conceptual-level) can be
implemented by combining the project's existing memory tiers with entity extraction via LLM calls
(already available through `geminiService.ts`'s 10 providers).

### 3.3 Docling — Multimodal Document Parsing

| Aspect | Finding |
|--------|---------|
| **Runtime** | Python. IBM's open-source library (63K GitHub stars, 2.112.0 latest) |
| **Capabilities** | PDF, DOCX, images, video, audio, EPUB, XBRL, ODF, charts |
| **Models** | Requires GraniteDocling VLM, Layout/TableFormer models (PyTorch) |
| **Feasibility** | **Not feasible** as direct integration |

**Browser-native alternatives already in use:**
- PDF.js (4.9.28) — PDF rendering and text extraction
- Tesseract.js (5.1.1) — OCR for images
- SheetJS/xlsx (0.20.3) — Excel/CSV parsing
- PapaParse (5.6.0) — CSV parsing with streaming

**Gap:** No browser-native library matches Docling's layout-aware table extraction and reading-order
preservation. A future enhancement could use **marker.js** or **Mistral OCR API** via the LLM provider
layer.

### 3.4 FastMCP — Model Context Protocol Server

| Aspect | Finding |
|--------|---------|
| **Runtime** | Python (v3.4.2, now part of official `mcp` SDK). Also has TypeScript SDK |
| **Ecosystem** | 2000+ community servers, supported by Claude, ChatGPT, Gemini, Cursor |
| **Browser** | TypeScript SDK available. Stdio transport requires Node.js; Streamable HTTP works cross-platform |
| **Feasibility** | **Partially feasible**. The TypeScript SDK could serve as reference, but the project is a browser app with no persistent server process |

**What already exists:**
- `mcpService.ts` (391 lines) — 40+ API endpoint mappings (CDC, WHO, Delphi, GitHub, World Bank, etc.)
- `MCPServerPanel.tsx` — UI for managing MCP servers
- `mcpServers.ts` — 14 default server definitions
- `src/data/mcpServers.ts` — Tool definitions with parameters

**Enhancement opportunity:** The project already has a working MCP *client* layer. What's missing is:
1. Dynamic discovery via MCP protocol negotiation (currently hardcoded endpoints)
2. OAuth 2.1 authentication for remote MCP servers
3. MCP resource/prompt exposure (currently tools-only)

---

## 4. Current Project Analysis vs. Enhancement Proposals

### 4.1 What Already Exists (that the enhancement file missed)

| Enhancement File Claim | Actual Project |
|-----------------------|----------------|
| "Filesystem cognitive buckets" | IndexedDB with 22 object stores + 6-tier memory architecture |
| "oks CLI tool" | React SPA with full UI (Chat, Editor, Knowledge Base, Kanban, etc.) |
| "oks-connector" | `connectorService.ts` + CDN-loaded PDF.js/Tesseract.js/SheetJS/PapaParse |
| "oks recall engine" | `memoryApi.ts` with 6-tier memory (Session, Episodic, Semantic, Procedural, Working, Long-Term) |
| "oks search" | `oramaService.ts` (hybrid search) + `searchService.ts` (cross-source) |
| "Claude Code agent skills" | A2A multi-agent debate system with 12 agents (Coordinator, Researcher, etc.) |
| "oks-connector Python package" | Browser-based import/export via IndexedDB |

### 4.2 What the Project Has That Goes Beyond the Enhancement File

- **10 LLM providers** (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama, OpenRouter, Cerebras, GitHub, Cloudflare)
- **Multi-agent orchestration** (parallel debate, sequential, orchestrated workflows)
- **Vector embeddings** via Transformers.js in Web Worker (`embeddingWorker.ts`)
- **34 UI components** including epidemiology maps (Leaflet), ICD-11 browser, BD FHIR integration
- **PWA support** with offline-first architecture
- **Cross-tab sync** via BroadcastChannel
- **Full-text + vector + hybrid search** via Orama (2 KB, pure JS)
- **Sandboxed code execution** via `sandboxService.ts`
- **Real-time collaboration** via BroadcastChannel
- **Internationalization** (English + Bengali)

### 4.3 Key Gaps (Where the Enhancement File Identifies Valid Needs)

| Gap | Validity | Current State | Path Forward |
|-----|----------|---------------|--------------|
| **Semantic blindness** | Valid | Orama hybrid search mitigates this, but no unified ranking combining lexical + vector + graph scores | See §5.1 |
| **No knowledge graph** | Valid | No entity-relationship tracking or graph traversal | See §5.2 |
| **Limited document parsing** | Partially valid | PDF.js + Tesseract.js + SheetJS cover common cases; no layout-aware parsing | See §5.3 |
| **MCP interoperability** | Already addressed | MCP client exists with 40+ endpoints; missing server-side expose | See §5.4 |
| **Memory decay** | Not needed | IndexedDB persistence + 90-day episodic purge serve the SPA use case | Not implementing |
| **Git tracking** | Not needed | Browser SPA has no filesystem access; version history in IndexedDB | Not implementing |

---

## 5. Adapted Enhancement Plan for the React SPA

### 5.1 Unified Hybrid Ranking Engine

**Concept from original:** Combine lexical + vector + graph scores into S_unified formula.

**Adaptation:**

Add a `UnifiedRanker` module that composites scores from existing subsystems:

```typescript
// Proposed: src/services/unifiedRanker.ts
interface RankResult {
  document: any;
  lexicalScore: number;   // BM25 from Orama
  vectorScore: number;    // Cosine similarity from Orama hybrid
  graphScore: number;     // Entity-relationship proximity (future)
  recencyScore: number;   // Temporal decay factor
  totalScore: number;     // Weighted composite
}
```

**Implementation steps:**
1. Extract the BM25 score from Orama results (currently using `term` mode, can add `hybrid` mode)
2. Add temporal recency as a scoring factor (Ebbinghaus-style decay per the original formula)
3. Add configurable weights per memory tier
4. Expose via `searchService.ts` as a unified search endpoint

**Effort:** Low (2-3 files, ~150 lines). Leverages existing Orama hybrid search.

### 5.2 Browser-Native Knowledge Graph Layer

**Concept from original:** LightRAG's dual-level entity-relationship + conceptual cluster retrieval.

**Adaptation:**

Implement a lightweight in-memory RDF/entity graph using **Quadstore** (LevelDB-backed RDF store
with IndexedDB persistence) or a simpler custom entity-relationship store:

```typescript
// Proposed: src/services/knowledgeGraph.ts
interface EntityNode {
  id: string;
  name: string;
  type: 'concept' | 'person' | 'place' | 'organization' | 'protocol' | 'component';
  aliases: string[];
  embedding: number[];
}

interface RelationEdge {
  source: string;       // entity id
  target: string;       // entity id
  relationship: string; // e.g., "enforces_consistency_on", "depends_on"
  weight: number;
}

interface GraphQuery {
  entities: string[];
  depth: number;
  mode: 'low' | 'high' | 'dual';
}
```

**LLM-based entity extraction:** Reuse `geminiService.ts` to extract entities and relationships
from documents (using LightRAG's prompt pattern). Store entity embeddings in Orama for vector
lookup, and edges in Quadstore for SPARQL traversal.

**Dual-level retrieval:**
- **Low-level:** Direct entity match + relationship traversal (SPARQL `SELECT`)
- **High-level:** Vector similarity on entity embeddings aggregated by conceptual cluster

**Implementation steps:**
1. Add Quadstore as a CDN dependency (or use a simple in-memory adjacency list)
2. Create `knowledgeGraph.ts` service with entity CRUD + relation CRUD
3. Add LLM-based entity extraction to the document save pipeline
4. Implement dual-level query routing
5. Integrate graph score into the UnifiedRanker

**Effort:** Medium (3-4 files, ~400 lines). Quadstore has zero deps and runs in IndexedDB.

### 5.3 Enhanced Document Ingestion Pipeline

**Concept from original:** Docling's layout-aware parsing with table/column structure preservation.

**Adaptation:**

The project already has PDF.js, Tesseract.js, and SheetJS loaded via CDN. The gap is automated
pipeline orchestration. Create a unified ingestion pipeline:

```typescript
// Proposed: src/services/ingestionPipeline.ts
interface IngestionResult {
  markdown: string;
  metadata: Record<string, any>;
  tables: { caption: string; headers: string[]; rows: string[][] }[];
  images: { alt: string; base64: string }[];
  entities: { name: string; type: string; mentions: number }[];
}

// Route to correct parser based on MIME type
async function ingestDocument(file: File): Promise<IngestionResult>;
```

**Enhancements to existing CDN usage:**
1. Orchestrate PDF.js + Tesseract.js for scanned PDF OCR (already possible but not wired)
2. Use SheetJS row output for CSV/XLSX → structured table extraction
3. Add automated chunking along semantic boundaries (headings, not token counts)
4. Store parsed entities into the new knowledge graph layer (§5.2)

**Implementation steps:**
1. Create `ingestionPipeline.ts` orchestrating existing parsers
2. Add semantic chunking utility (`src/utils/chunking.ts`)
3. Add table extraction from SheetJS output
4. Wire the pipeline into the Knowledge Base file upload flow

**Effort:** Low (2-3 files, ~250 lines). Reuses existing CDN libraries.

### 5.4 Extended MCP Integration

**Concept from original:** FastMCP for protocol standardization.

**Adaptation:**

The project already has a robust MCP client (`mcpService.ts`). Three concrete enhancements:

1. **MCP server discovery protocol** — Instead of hardcoded endpoint URLs, implement the MCP
   `initialize` handshake to discover tools/resources dynamically from any MCP server URL.

2. **OAuth 2.1 for remote MCP servers** — Add device-flow OAuth for servers requiring
   authentication (following FastMCP's auth patterns).

3. **Expose app capabilities as MCP resources** — Make the app's IndexedDB stores and agent
   configurations available as MCP resources for external MCP clients.

```typescript
// Proposed: src/services/mcpClient.ts (upgrade from mcpService.ts)
interface MCPSession {
  serverUrl: string;
  capabilities: { tools: boolean; resources: boolean; prompts: boolean };
  tools: MCPTool[];
  resources: MCPResource[];
}

async function connectMCPServer(serverUrl: string): Promise<MCPSession>;
async function negotiateCapabilities(serverUrl: string): Promise<MCPCapabilities>;
```

**Implementation steps:**
1. Upgrade `mcpService.ts` to support dynamic MCP announce protocol
2. Add OAuth device-flow helper for protected servers
3. Create MCP resource views over IndexedDB stores
4. Add MCP resource browser UI to `MCPServerPanel.tsx`

**Effort:** Medium (2 files, ~300 lines). Most infrastructure exists.

### 5.5 Cross-Cutting: Unified Search Service

Combine all retrieval subsystems into a single `UnifiedSearch` service:

```typescript
// Proposed: src/services/unifiedSearch.ts
interface UnifiedSearchParams {
  query: string;
  tiers?: ('session' | 'episodic' | 'semantic' | 'procedural' | 'working' | 'long_term')[];
  filters?: { projectId?: string; agentId?: string; dateRange?: [string, string] };
  weights?: { lexical: number; vector: number; graph: number; recency: number };
  topK?: number;
}

async function unifiedSearch(params: UnifiedSearchParams): Promise<RankResult[]>;
```

This replaces the current fragmented search across `memoryApi.ts`, `oramaService.ts`,
and `searchService.ts`.

---

## 6. Implementation Priority Matrix

| Enhancement | Effort | Impact | Dependencies | Priority |
|------------|--------|--------|-------------|----------|
| Unified Ranking Engine (§5.1) | Low | High | None | **P0** |
| Knowledge Graph Layer (§5.2) | Medium | High | Orama + LLM providers | **P1** |
| Document Ingestion Pipeline (§5.3) | Low | Medium | Existing CDN libs | **P1** |
| Extended MCP Integration (§5.4) | Medium | Medium | None | **P2** |
| Unified Search Service (§5.5) | Medium | High | All of the above | **P2** |

---

## 7. Conclusion

The original enhancement file correctly identifies the need for semantic retrieval, knowledge graphs,
and protocol interoperability, but assumes a Python CLI runtime that does not match the actual project.

The adapted plan replaces each Python dependency with a browser-native JavaScript equivalent:

| Original Proposal | Browser-Native Adaptation | Status |
|------------------|--------------------------|--------|
| LanceDB (Python+Rust) | Orama (pure TypeScript) | Already using |
| LightRAG (Python) | Quadstore RDF + LLM entity extraction | New |
| Docling (Python) | PDF.js + Tesseract.js + SheetJS orchestration | Partial |
| FastMCP (Python) | MCP protocol upgrade on existing client | Enhancement |

The project is in a strong position: vector embeddings, hybrid search, multi-agent orchestration,
and MCP client support are already implemented. The highest-value additions are a unified ranking
engine (P0) and a browser-native knowledge graph layer (P1), which together address the core
limitations identified in the original analysis.

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
