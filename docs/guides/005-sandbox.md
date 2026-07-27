---
title: "050 — Sandboxed Code Execution"
category: "guides"
order: 50
tags: ["sandbox", "security", "execution", "iframe", "code"]
last_updated: "2026-07-27"
---

# 050 — Sandboxed Code Execution

---

## 1. Overview

The sandbox is a **lightweight JavaScript execution environment** that runs user or agent code in a restricted iframe with no access to the parent page, DOM, cookies, localStorage, or network. It enables safe computation without compromising security.

Implemented in `src/services/sandboxService.ts`.

---

## 2. Why a Sandbox?

- Agents (especially the Data Analyst) may need to run calculations or data transformations
- User-provided or agent-generated code could be malicious or buggy
- The sandbox ensures code execution is isolated from the main application

---

## 3. Security Model

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

### Key Security Properties

| Property | Implementation |
|:---|:---|
| **No DOM access** | `sandbox="allow-scripts"` only — no `allow-same-origin` |
| **No network** | `fetch`, `XMLHttpRequest`, `WebSocket` are not available |
| **No storage** | `localStorage`, `cookies`, `IndexedDB` are blocked |
| **No parent access** | `window.parent`, `postMessage` to parent are restricted |
| **Timeout protection** | Default 5-second timeout prevents infinite loops |
| **Error isolation** | Errors are caught and returned, not propagated to the parent |

### Available Globals

| Category | Available APIs |
|:---|:---|
| **Primitives** | `Math`, `JSON`, `Array`, `Object`, `String`, `Number`, `Boolean` |
| **Date/Time** | `Date`, `RegExp` |
| **Collections** | `Map`, `Set` |
| **Control** | `Promise`, `Error`, `parseInt`, `parseFloat`, `isNaN`, `isFinite` |
| **Encoding** | `encodeURI` |
| **Console** | `console.log` (captured and returned in output) |

### Restricted APIs

| Category | What is Blocked |
|:---|:---|
| **DOM** | `document`, `window`, `navigator` (partially) |
| **Network** | `fetch`, `XMLHttpRequest`, `WebSocket` |
| **Storage** | `localStorage`, `sessionStorage`, `cookies`, `IndexedDB` |
| **Parallelism** | `Worker`, `SharedWorker` |
| **Media** | `Audio`, `Video`, `Canvas`, `WebGL` |
| **Messaging** | `postMessage` (to parent) |

---

## 4. API

```typescript
interface SandboxResult {
  success: boolean;    // Whether execution completed without error
  output: string;      // Console output captured during execution
  error?: string;      // Error message if execution failed
  durationMs: number;  // Execution time in milliseconds
}

function executeCode(code: string, timeoutMs?: number): Promise<SandboxResult>
function cleanupSandbox(): void
```

### Example

```typescript
const result = await executeCode(`
  const data = [12, 15, 18, 22, 25];
  const mean = data.reduce((a, b) => a + b) / data.length;
  console.log("Mean:", mean);
  console.log("Count:", data.length);
`);
// result.success === true
// result.output === "Mean: 18.4\nCount: 5\n"
```

---

## 5. Using the Sandbox from Chat

### Direct User Request

You can ask the Data Analyst agent to run calculations:

> "Calculate the mean and standard deviation of these case counts: 45, 52, 38, 61, 49, 55."

The agent will generate code, execute it in the sandbox, and return the results.

### Agent Usage

Agents use the sandbox through the `calculate` tool when they need to:

- Compute statistical metrics (mean, median, standard deviation)
- Run epidemiological calculations (attack rate, R₀, confidence intervals)
- Transform or clean dataset values
- Validate numerical results

---

## 6. Configuration

Sandbox settings are managed in `SettingsPanel.tsx` under the **Sandbox** section:

| Setting | Default | Description |
| :--- | :--- | :--- |
| Strict sandbox | `true` | Always use sandboxed iframe for code execution |
| Allowed outbound | `true` | Allow console output capture from sandbox |
| Show audit ledger | `false` | Display execution history in the UI |

### Recommended Settings

- **Default**: Strict sandbox enabled, audit ledger hidden — best for most users
- **Development**: Disable audit ledger if sandbox output is too verbose
- **Security-sensitive**: Keep strict sandbox enabled at all times

---

## 7. Troubleshooting

| Issue | Likely Cause | Solution |
|:---|:---|:---|
| Code returns empty output | No `console.log` calls | Add `console.log()` to output values |
| Timeout exceeded | Infinite loop or long computation | Increase timeout in Settings or optimize code |
| `ReferenceError: X is not defined` | Using restricted API | Check the available globals table above |
| Dead iframe detected | Browser blocked iframe creation | Check browser security settings |

---

## See Also

- [A2A Agents Guide](010-agents.md) — Data Analyst agent using the sandbox
- [Public Data APIs Guide](100-public-data.md) — Fetching data for sandbox analysis
- [Multi-Agent Workflows](020-workflows.md) — Sandbox usage in complex workflows
- [Developer Guide: Test Suite](../developers/080-test-suite.md) — Sandbox test coverage
- [Portal Overview](../index.md) — Full documentation index

---

*Back to [Documentation Home](../index.md)*
