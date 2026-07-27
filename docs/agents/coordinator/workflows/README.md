# Coordinator Workflow Patterns

The Coordinator agent manages two primary workflow types:

## Orchestrated Workflow (Parallel)

Multiple agents work simultaneously on different sub-tasks. The Coordinator decomposes the request, dispatches sub-tasks in parallel, then aggregates results.

## Sequential Workflow (Chain)

Agents work in sequence, where each agent's output feeds into the next. Used for dependent tasks that require step-by-step processing.

See [Multi-Agent Workflows](../../../guides/091-workflows.md) for detailed patterns.
