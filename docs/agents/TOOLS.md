# A2A Agent Tools

The 6 A2A debate agents use the Chat Interface as their primary tool. Each agent receives the user's prompt and its system prompt, then generates a response via the configured LLM provider.

## Current Capabilities

- Each agent responds independently to the same user prompt
- Agents are color-coded and identified by avatar in the debate panel
- Responses are recorded in chat history and tracked in A2AMetricsDashboard
- Agents can be toggled on/off individually

## Infrastructure Tools (available but not agent-integrated)

| Tool | Service | Purpose |
| :--- | :--- | :--- |
| `computeEmbedding` | `memoryApi.ts` | Generate 384-dim vectors via Transformers.js Web Worker |
| `searchSemantic` | `memoryApi.ts` | Hybrid vector+keyword search (Orama + IndexedDB fallback) |
| `storeSemantic` | `memoryApi.ts` | Store with auto-embedding generation |
| `queryLLM` | `geminiService.ts` | Multi-provider LLM query |
| `search` | `searchService.ts` | Token-based fuzzy file search |
| BroadcastChannel | Memory API | Cross-tab memory synchronization |

## Future Agent Tools

The `memoryApi.ts` module provides the infrastructure for agents to directly access memory tiers, but this is not yet wired to the in-app A2A agents. Potential future tools:
- `readMemory` — Query episodic/semantic memory for context
- `writeMemory` — Store findings to working/long-term memory
- `searchKnowledgeBase` — Full-text search across uploaded files
