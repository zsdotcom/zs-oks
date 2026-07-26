# 091 — Multi-Agent Orchestration & Sequential Workflows

**Date:** July 26, 2026

---

## 1. Overview

Two workflow modes extend the basic parallel A2A debate:

| Mode | Function | Description |
| :--- | :--- | :--- |
| **Orchestrated** | `runOrchestratedWorkflow()` | Coordinator decomposes the task, assigns sub-tasks to specialists, collects results, synthesizes final answer |
| **Sequential** | `runSequentialWorkflow()` | Agents execute in a chain (e.g. Researcher→Writer→Reviewer→Coordinator), each receiving prior context |

## 2. Orchestrated Workflow

**File:** `src/services/geminiService.ts`

### Flow
1. **Decompose** — Coordinator analyzes the user request and produces a JSON array of `{agentId, subTask, rationale}`
2. **Execute** — Each sub-task is sent to the appropriate agent in sequence (results are independent)
3. **Synthesize** — Coordinator receives all agent outputs and produces a cohesive final response

### Error handling
- If JSON parsing of the decomposition fails, a fallback assigns the task to the first 3 non-Coordinator agents
- If an agent errors, its output is captured as `[Error: message]` and synthesis continues
- If no Coordinator agent exists, raw agent results are returned

## 3. Sequential Workflow

### Flow
1. The topic is sent to the first agent in the chain
2. Each subsequent agent receives the original topic + all prior agent outputs as context
3. The final result contains every step's output

### Usage
```typescript
const chain = [
  a2aAgents.find(a => a.id === 'research')!,
  a2aAgents.find(a => a.id === 'writer')!,
  a2aAgents.find(a => a.id === 'review')!,
  a2aAgents.find(a => a.id === 'coord')!,
];
const response = await runSequentialWorkflow(topic, chain, config, contextDocs);
```

## 4. Metrics

Both workflow modes report per-agent latency and token estimates via an optional `onAgentResponse` callback, which pushes `A2AMetric` entries into the metrics dashboard.
