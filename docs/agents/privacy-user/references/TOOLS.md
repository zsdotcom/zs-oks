---
agent_id: privacy-user
agent_name: Privacy-Conscious User
role: Local-first AI assistance with zero data leakage, offline operation, and data sovereignty
avatar: 🔒
color: '#6B7280'
status: active
order: 23
category: persona
tags:
  - privacy
  - offline
  - local-first
  - security
skill_count: 5
tool_count: 5
---

# Privacy-Conscious User — Tools

## Data Management Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| export-pdf | src/services/geminiService.ts | Export privacy audit reports and configuration documentation as PDF. | user |
| write-file | src/services/geminiService.ts | Save local-only configuration files, audit results, and data export instructions. | user |

## Memory Tools (All Local)

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| remember | src/services/memoryApi.ts | Store privacy configurations and preferences. All data stored locally in IndexedDB — never transmitted. | user |
| recall | src/services/memoryApi.ts | Search stored privacy configurations. Runs local semantic search — no external queries. | user |
| semantic-search | src/services/memoryApi.ts | Search privacy documentation and security guides. Hybrid vector/keyword search runs entirely in-browser. | user |

## Privacy Guarantees

| Feature | Data Handling | Network Required |
| :--- | :--- | :--- |
| IndexedDB Storage | All data stays in browser | No |
| Vector Embeddings | Transformers.js in Web Worker | No (CDN-loaded once) |
| Semantic Search | Orama in-memory index | No |
| Ollama LLM | Local network only (localhost:11434) | No (local network) |
| PWA Cache | Browser cache managed by SW | For initial install |
| PDF Export | Browser-native, no server | No |
| Templates | CDN-loaded, cached after first load | For first load only |

## Privacy-Critical Configurations

| Setting | Privacy-Enhancing Value | Default |
| :--- | :--- | :--- |
| Provider → Ollama | No data leaves local network | Gemini |
| Strict Sandbox | Blocks outbound connections | Off |
| Offline Mode | Disables all external fetches | Off |
| API Keys in IndexedDB | Stored locally, not in .env | Session only |
| Service Worker Cache | Enables full offline operation | Active |
| Disable CDN | Blocks jsdelivr/unpkg (breaks diagrams) | CDN enabled |

---

*Back to [Privacy User SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
