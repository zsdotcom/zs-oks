---
title: Agent System Reference
description: Comprehensive reference for the A2A debate agent system
section: agents
order: 1
type: reference
---

# Agent System Reference

This reference covers the architecture, configuration, and integration points for the Open Knowledge Studio A2A debate agent system.

## Agent Architecture

The A2A (Agent-to-Agent) debate system is a frontend-only multi-agent framework where each agent operates with:

- A **system prompt** defining its role and expertise
- A set of **skills** defining core competencies
- A set of **tools** for service integration
- A **color-coded identity** for UI differentiation

## Agent Lifecycle

1. **Registration** — Agents are registered in `src/App.tsx` with their identity configuration
2. **Activation** — Users toggle agents on/off via the Settings Panel or A2A panel
3. **Invocation** — When a user submits a prompt, active agents generate responses in parallel
4. **Memory** — Each agent can use session, persistent, or full memory tiers

## Key Integration Points

| Integration | Location | Description |
| :--- | :--- | :--- |
| Agent Definitions | `src/App.tsx:97-104` | 6 built-in agent configurations |
| Gemini Service | `src/services/geminiService.ts` | LLM routing for `queryLLM`, workflows |
| Memory API | `src/services/memoryApi.ts` | 6-tier memory with vector embeddings |
| Orama Search | `src/services/oramaService.ts` | Hybrid vector+keyword semantic search |
| Sandbox Service | `src/services/sandboxService.ts` | Secure JS code execution |
| ICD-11 Service | `src/services/icd11Service.ts` | WHO ICD-11 API integration |
| A2A Metrics | `src/components/A2AMetricsDashboard.tsx` | Performance tracking |

## Related Guides

- [A2A Agents Guide](../../guides/060-agents.md) — Configuration and management
- [Multi-Agent Workflows](../../guides/091-workflows.md) — Orchestrated and sequential workflows
- [Memory Architecture](../../developers/070-memory-architecture.md) — 6-tier memory with vector embeddings
- [Custom Agent Creation](../../guides/060-agents.md#5-custom-agent-creation)

---

*Back to [Agent System](../SKILL.md) | [Documentation Home](../../index.md)*
