---
agent_id: developer
agent_name: Developer
role: MCP server configuration, custom agent creation, API integration, and extensibility
avatar: 🛠️
color: '#3B82F6'
status: active
order: 20
category: persona
tags:
  - developer
  - mcp
  - api
  - integration
skill_count: 5
tool_count: 6
---

# Developer — Tools

## File Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| read-file | src/services/geminiService.ts | Read configuration files, source code, documentation, and logs for analysis and debugging. | elevated |
| write-file | src/services/geminiService.ts | Write MCP server configs, custom agent definitions, connector configs, webhook handlers, and documentation. | elevated |

## Knowledge Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| semantic-search | src/services/memoryApi.ts | Search the codebase and documentation for existing patterns, configurations, and solutions. | user |
| remember | src/services/memoryApi.ts | Store reusable configuration snippets, agent definitions, and integration patterns for future reference. | user |
| recall | src/services/memoryApi.ts | Retrieve stored configurations, past solutions, and documentation references. | user |
| export-pdf | src/services/geminiService.ts | Export integration guides, configuration documentation, and architecture diagrams as PDF. | user |

## Integration Points

| Feature | Configuration File | Key Store |
| :--- | :--- | :--- |
| MCP Servers | Runtime via MCP panel | IndexedDB `sandbox` store |
| Custom Agents | Runtime via Settings Panel | IndexedDB `a2aAgents` store |
| Connectors | Runtime via Connector panel | IndexedDB `connectors` store |
| Webhooks | Runtime via Webhook Manager | localStorage `webhooks` key |
| Skills | Runtime via Skill Builder | IndexedDB `skills` store |
| LLM Providers | Runtime via Settings Panel | IndexedDB `provider-config` key |

## Built-In MCP Servers

| Server | Type | Tools | Status |
| :--- | :--- | :--- | :--- |
| CDC Disease Surveillance | Remote | nndss_surveillance, places_data, search_dataset | Configurable |
| WHO Global Health Observatory | Remote | gho_indicator, search_indicators, dimension_values | Configurable |
| CMU Delphi Epidata | Remote | fluview, covidcast, dengue_nowcast | Configurable |
| InfectoNET Genomics | Remote | list_pathogens, get_pathogen_data, get_outbreak_alerts | Configurable |
| Brave Search | Remote | web_search, local_search | Requires API key |

---

*Back to [Developer SKILL](../SKILL.md) | [Agent System](../../SKILL.md) | [Documentation Home](../../../index.md)*
