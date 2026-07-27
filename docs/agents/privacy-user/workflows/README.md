# Privacy-Conscious User — Workflow Patterns

## Full Privacy Audit

```
User Request: "Audit what data this app sends externally"

Workflow:
1. Check all configured LLM providers
2. Review Content Security Policy in vite.config.ts
3. List all CDN scripts loaded in index.html
4. Check Google OAuth and GitHub OAuth configurations
5. Verify service worker caching boundaries
6. Check IndexedDB for stored API keys
7. Generate privacy audit report with findings
8. Recommend configuration changes
```

## Going Fully Offline

```
User Request: "Set up the app to work completely offline"

Workflow:
1. Install PWA from browser prompt
2. Configure Ollama as local LLM provider
3. Pull recommended models (llama3, mistral)
4. Enable strict sandbox mode
5. Test: send a chat message without internet
6. Cache all templates for offline access
7. Export data backup
8. Verify end-to-end offline workflow
```

## Data Backup and Migration

```
User Request: "Back up all my data and prepare to move to a new computer"

Workflow:
1. Export all IndexedDB stores to JSON
2. Walk through each store: memory tiers, agents, skills, templates, connectors, settings
3. Verify exported file opens correctly
4. Generate import instructions for new device
5. Save backup file with timestamp
6. Recommend secure transfer method
```

## Provider Privacy Comparison

```
User Request: "Compare LLM providers by privacy"

Workflow:
1. List all configured providers
2. For each: check data retention policy, API key handling, training data opt-out
3. Rate: Fully Local / Zero Retention / Limited Retention / Unknown
4. Recommend best provider for privacy-sensitive work
5. Generate summary table for decision-making
```

---

*Back to [Privacy User SKILL](../SKILL.md) | [Agent System](../../SKILL.md)*
