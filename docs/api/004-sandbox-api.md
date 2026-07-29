---
title: Sandbox API Reference
order: 40
tags: [api, sandbox, code-execution, security]
---

# Sandbox API Reference

Source: `src/services/sandboxService.ts` (107 lines)

The Sandbox API provides secure, isolated code execution for user-written JavaScript within the application. It uses an iframe with restricted permissions to sandbox execution, preventing access to the main application context.

---

## Types

### `SandboxResult`

```typescript
interface SandboxResult {
  success: boolean;    // Whether execution completed without error
  output: string;      // Captured output (return value + console.log)
  error?: string;      // Error message if success is false
  durationMs: number;  // Wall-clock execution time in milliseconds
}
```

### `SandboxExecution`

```typescript
interface SandboxExecution {
  id: string;
  code: string;
  result: SandboxResult;
  timestamp: string;
}
```

---

## Functions

### `executeCode(code, timeoutMs?)`

```typescript
function executeCode(code: string, timeoutMs?: number): Promise<SandboxResult>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `code` | `string` | — | JavaScript source code to execute |
| `timeoutMs` | `number` | `5000` | Maximum execution time in milliseconds |

**Execution flow:**

1. Lazily creates a hidden iframe with `sandbox="allow-scripts"` attribute
2. Injects an executor script into the iframe that:
   - Listens for `sandbox:execute` messages via `postMessage`
   - Creates a mock `console` object that captures logs
   - Calls `eval(code)` inside an IIFE with the mock console
   - Posts `sandbox:result` message back to the parent window
3. Sets a timeout (default 5s) — if no result received, resolves with timeout error
4. Cleans up the message event listener after result or timeout

**Return value:**

```typescript
// Success
{ success: true, output: "42\n[log line 1]", durationMs: 12 }

// Syntax error
{ success: false, output: "", error: "Unexpected token '}'", durationMs: 3 }

// Timeout
{ success: false, output: "", error: "Execution timed out after 5000ms", durationMs: 5000 }

// Runtime error
{ success: false, output: "", error: "x is not defined", durationMs: 45 }
```

**Example:**

```typescript
import { executeCode } from '@/services/sandboxService';

const result = await executeCode(`
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  console.log('Fib(10):', fibonacci(10));
  fibonacci(10);
`, 3000);

console.log(result.output); // "Fib(10): 55\n55"
```

### `cleanupSandbox()`

```typescript
function cleanupSandbox(): void
```

Removes the sandbox iframe from the DOM and clears any pending timeout. Call when the sandbox is no longer needed to free resources.

### `createSandboxData(execution)`

```typescript
function createSandboxData(execution: SandboxExecution): SandboxExecution
```

Identity function that returns the execution object (useful for consistent data shaping).

---

## Available Globals Inside Sandbox

The sandbox provides a mock `console` object:

```typescript
const mockConsole = {
  log: function() {
    logs.push(Array.from(arguments).map(String).join(" "));
  }
};
```

All standard JavaScript built-ins are available: `Array`, `Object`, `String`, `Number`, `Math`, `Date`, `JSON`, `RegExp`, `Map`, `Set`, `Promise`, `setTimeout`, `clearTimeout`, `fetch`, `atob`, `btoa`, etc.

## Restricted Globals

The sandbox iframe has `sandbox="allow-scripts"` **without**:
- `allow-same-origin` — no access to the main page's DOM, cookies, or IndexedDB
- `allow-forms` — no form submission
- `allow-popups` — no window.open
- `allow-modals` — no alert/confirm/prompt

Additionally, there is no access to:
- `window.parent` (same-origin restriction)
- `localStorage`, `sessionStorage`, `IndexedDB` (different origin)
- The main thread's React state or application context

---

## Security Model

| Threat | Mitigation |
|--------|-----------|
| DOM access to main app | `sandbox="allow-scripts"` without `allow-same-origin` creates a separate origin |
| Infinite loops | 5-second default timeout (configurable via `timeoutMs`) |
| Network requests | `fetch()` is available in the sandbox but same-origin policy blocks the app's origin |
| Access to IndexedDB | Separate origin in iframe prevents database access |
| Console spam | Mock `console` captures logs to string, no side effects |

## Error Types

| Error Type | `success` | `error` field |
|------------|-----------|---------------|
| Syntax error | `false` | Standard JS `SyntaxError.message` |
| Runtime error | `false` | Standard JS `Error.message` |
| Timeout | `false` | `"Execution timed out after Nms"` |
| Iframe creation failure | `false` | `"Sandbox iframe not available"` |
| Other exception | `false` | `(err as Error).message` |

## See Also

- [Threat Model](../security/001-threat-model.md)
- [Gemini/LLM Service API](./003-gemini-service.md)
- [Memory API Reference](./001-memory-api.md)


---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
