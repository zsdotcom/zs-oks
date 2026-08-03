# 000-tool-registry.md
## Tool Registry
### Unified Registry of APIs and Services

**Document type:** Reference
**Date:** August 03, 2026
**Author:** Mohammad Ariful Islam / ZarishSphere Foundation
**License:** Apache 2.0 (code) · CC BY 4.0 (documentation)
**Status:** V1 — Active

## 1. AI Providers

| Provider | Service File | Capabilities |
| :--- | :--- | :--- |
| Google Gemini | `geminiService.ts` | Text, Vision, Multi-turn Chat |
| OpenAI | `geminiService.ts` | Text, Vision, Function Calling |
| Anthropic | `geminiService.ts` | Text, Vision, Reasoning |
| DeepSeek | `geminiService.ts` | Text, Coding |
| Groq | `geminiService.ts` | High-speed Inference |
| Ollama | `geminiService.ts` | Local LLM Support |
| OpenRouter | `geminiService.ts` | Multi-model Gateway |
| Cerebras | `geminiService.ts` | Extreme Speed Inference |
| GitHub Models | `geminiService.ts` | Development Models |
| Cloudflare AI | `geminiService.ts` | Edge AI Inference |

## 2. Core Services

| Service | File | Purpose |
| :--- | :--- | :--- |
| Memory API | `memoryApi.ts` | 6-tier memory management and vector search |
| ICD-11 | `icd11Service.ts` | Health classification lookups |
| BD Health | `bdGeographyService.ts` | Bangladesh health system geography and data |
| Search | `searchService.ts` | Multi-engine web search |
| PWA | `sw-register.ts` | Offline support and service worker |
| IndexedDB | `indexedDB.ts` | Local persistence for settings and memory |

## 3. Integration Protocols

### 3.1. Model Context Protocol (MCP)
Handled via `mcpService.ts`, allowing connection to external MCP servers for extended capabilities.

### 3.2. Webhooks
Handled via `webhookService.ts` for outbound notifications and data synchronization.

---
*ZarishSphere Foundation · V1 · August 03, 2026*
*License: Apache 2.0 (code) · CC BY 4.0 (documentation)*
*GitHub: https://github.com/zsdotcom/zs-oks*
