---
title: API Key Management
order: 30
tags: [security, api-keys, env-vars, settings]
audience: "developers"
last_updated: "2026-07-30"
---

# API Key Management

## How API Keys Are Stored

API keys are stored in the IndexedDB `providers` object store. Each key is stored as a `providers` document:

```typescript
{
  id: string;    // Provider identifier (e.g., 'gemini', 'openai')
  config: string; // JSON-serialized ProviderConfig (contains apiKey)
}
```

Keys are not hashed or encrypted at the application level — they rely on the browser's IndexedDB sandbox for isolation. The `providers` store is **not included** in the export data (`exportAllData()` skips the memory tier stores but does export `providers` — see `indexedDB.ts:227`). The store is exportable for migration purposes.

## How API Keys Are Used

1. **At query time:** `geminiService.ts:62` reads `config.apiKey` from the `ProviderConfig` object passed to `queryLLM()`
2. **Fallback to env vars:** If no key is configured in IndexedDB, the service falls back to `import.meta.env.VITE_GEMINI_API_KEY` (and similar `VITE_*` variables):
   ```typescript
   const apiKey = config.apiKey || (typeof import.meta !== 'undefined'
     ? (import.meta as any).env?.VITE_GEMINI_API_KEY : '') || '';
   ```
3. **Keys are never logged** — no `console.log(apiKey)`, no error message includes the key
4. **Keys are sent only in HTTP headers** or query parameters over HTTPS

## Supported Environment Variables

Defined in `.env.example`:

| Variable | Provider | Required |
|----------|----------|----------|
| `VITE_GEMINI_API_KEY` | Gemini | No (can set in Settings) |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | Google OAuth | For Google Sign-In |
| Additional `VITE_*` vars for OpenAI, Anthropic, etc. | Various | No |

## Security Recommendations

### Never Commit `.env` Files

- `.env` is in `.gitignore` by default
- Use `.env.example` as a template with placeholder values
- Never commit actual API keys to the repository

### Use GitHub Secrets for CI

CI workflows (`.github/workflows/ci.yml`, `deploy.yml`) use GitHub Secrets:
- `VITE_GEMINI_API_KEY` stored as `${{ secrets.VITE_GEMINI_API_KEY }}`
- All secrets are masked in CI logs

### Rotate Keys Periodically

- Generate new API keys in the provider's console
- Update in Settings panel
- Revoke old keys in the provider's console

## Entering Keys via Settings Panel

1. Click **Settings** (gear icon in the sidebar)
2. Navigate to the **Provider** section
3. Select the provider (Gemini, OpenAI, etc.)
4. Paste the API key into the text field
5. Click **Save** — key is persisted to IndexedDB `providers` store
6. The key is used immediately for subsequent AI queries

## Key Validation

The app does **not** validate API keys on save. Keys are validated on first use — if an API call fails with a 401/403 status, an error message is returned to the user. Invalid keys can be corrected at any time.

## Key Deletion

1. Open **Settings**
2. Clear the API key field for the provider
3. Click **Save** — the key is removed from IndexedDB
4. The app will fall back to `VITE_*` environment variables (if set) or show an error on next API call

## See Also

- [Threat Model](./001-threat-model.md)
- [Data Privacy & Trust](./002-data-privacy.md)
- [Gemini/LLM Service API](../api/003-gemini-service.md)


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
