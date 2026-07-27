---
title: Security Documentation — Index
order: 0
tags: [security, index, trust-model]
---

# Security Documentation

## Philosophy

Open Knowledge Studio operates on a **zero-trust, client-only** security model:

- **No backend server** — all data stays in the browser's IndexedDB
- **No telemetry** — no analytics, no crash reporting, no usage tracking
- **No third-party data sharing** — API calls are made only to configured AI providers
- **All secrets client-side** — API keys are stored in IndexedDB and never logged

The application is designed for sensitive use cases (field epidemiology, outbreak investigation) where data privacy and offline capability are paramount.

## Documentation

| # | Document | Description |
|---|----------|-------------|
| 010 | [Threat Model](./010-threat-model.md) | Assets, threats, mitigations, and trust boundaries |
| 020 | [Data Privacy & Trust](./020-data-privacy.md) | Data residency, isolation, user controls, offline mode |
| 030 | [API Key Management](./030-api-key-management.md) | Storage, usage, rotation, and CI/CD best practices |

## Trust Model Summary

| Boundary | Trust Level | Rationale |
|----------|-------------|-----------|
| User's browser (main thread) | **Trusted** | All application code runs here |
| IndexedDB | **Trusted** | Browser sandbox isolates from other origins |
| Web Worker (embedding) | **Trusted** | Same-origin worker, no external access |
| Sandbox iframe | **Untrusted** | Separate origin, `allow-scripts` only |
| AI Provider APIs | **Semi-trusted** | HTTPS in transit, data at their discretion |
| CDN resources | **Untrusted** | Verified via version pinning (SRI consideration) |
| Third-party OAuth (Google) | **Semi-trusted** | Standard OAuth 2.0 flow |

## See Also

- [Architecture Decision Records](../architecture/000-index.md)
- [API Documentation](../api/000-index.md)
