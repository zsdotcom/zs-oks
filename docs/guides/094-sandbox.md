---
title: "094 — Sandboxed Code Execution"
category: "guides"
order: 94
tags: ["sandbox", "security", "execution", "iframe"]
last_updated: "2026-07-26"
---

# 094 — Sandboxed Code Execution

---

## 1. Description

A lightweight JavaScript sandbox that executes user/agent code in a restricted iframe with no access to the parent page, DOM, cookies, localStorage, or network.

## 2. Implementation

**File:** `src/services/sandboxService.ts`

### Architecture

```
executeCode(code, timeout=5000)
       │
       ▼
getSandboxIframe() ──→ Hidden <iframe sandbox="allow-scripts">
       │
       ▼
postMessage({type:"sandbox:execute", code})
       │
       ▼
iframe eval() with restricted console
       │
       ▼
postMessage({type:"sandbox:result", success, output, error})
       │
       ▼
Promise<SandboxResult>
```

### Security
- `sandbox="allow-scripts"` — prevents same-origin access, form submission, popups, etc.
- No `allow-same-origin` — the iframe is fully isolated
- `eval()` is called inside the iframe's own scope, not the parent's
- A timeout (default 5s) prevents infinite loops
- Dead iframe is detected and reported

### API

```typescript
interface SandboxResult {
  success: boolean;
  output: string;
  error?: string;
  durationMs: number;
}

function executeCode(code: string, timeoutMs?: number): Promise<SandboxResult>
function cleanupSandbox(): void
```

### Available globals inside sandbox
`Math`, `JSON`, `Array`, `Object`, `String`, `Number`, `Boolean`, `Date`, `RegExp`, `Map`, `Set`, `Promise`, `Error`, `parseInt`, `parseFloat`, `isNaN`, `isFinite`, `encodeURI`, `console.log` (captured and returned in output).

### Not available
`document`, `window`, `fetch`, `XMLHttpRequest`, `localStorage`, `cookies`, `postMessage` (parent), `Worker`, `WebSocket`, `Audio`, `Video`, `Canvas`, `WebGL`.

## 3. Configuration

Sandbox settings are managed in `SettingsPanel.tsx` under the Sandbox section:

| Setting | Default | Description |
| :--- | :--- | :--- |
| Strict sandbox | `true` | Always use sandboxed iframe |
| Allowed outbound | `true` | Allow console output capture |
| Show audit ledger | `false` | Display execution history |

---

## See Also

- [User Guide: A2A Agents](060-agents.md) — Agents using sandbox execution
- [Developer Guide: Test Suite](../developers/080-test-suite.md) — Sandbox test coverage
- [Project Feature Status](../project/090-feature-status.md) — Implementation status

---

*Back to [Documentation Home](../index.md) | [Project Docs](../project/000-overview.md) | [Developer Docs](../developers/040-development.md)*
