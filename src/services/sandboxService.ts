export interface SandboxResult {
  success: boolean;
  output: string;
  error?: string;
  durationMs: number;
}

export interface SandboxExecution {
  id: string;
  code: string;
  result: SandboxResult;
  timestamp: string;
}

let sandboxIframe: HTMLIFrameElement | null = null;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

function getSandboxIframe(): HTMLIFrameElement {
  if (sandboxIframe) return sandboxIframe;
  sandboxIframe = document.createElement('iframe');
  sandboxIframe.style.display = 'none';
  sandboxIframe.setAttribute('sandbox', 'allow-scripts');
  sandboxIframe.src = 'about:blank';
  document.body.appendChild(sandboxIframe);

  const win = sandboxIframe.contentWindow;
  if (!win) throw new Error('Failed to create sandbox iframe');

  const executorCode = [
    'self.addEventListener("message", function(e) {',
    '  if (e.data && e.data.type === "sandbox:execute") {',
    '    var code = e.data.code;',
    '    var logs = [];',
    '    var mockConsole = { log: function() { logs.push(Array.from(arguments).map(String).join(" ")); } };',
    '    try {',
    '      var result = (function() {',
    '        var console = mockConsole;',
    '        return eval(code);',
    '      })();',
    '      var output = result !== undefined ? String(result) : "";',
    '      self.parent.postMessage({ type: "sandbox:result", success: true, output: output + (logs.length ? "\\n" + logs.join("\\n") : ""), logs: logs }, self.origin);',
    '    } catch (err) {',
    '      self.parent.postMessage({ type: "sandbox:result", success: false, output: "", error: err.message, logs: logs }, self.origin);',
    '    }',
    '  }',
    '});',
    'self.parent.postMessage({ type: "sandbox:ready" }, self.origin);',
  ].join('\n');

  win.document.open();
  win.document.write('<html><body><script>' + executorCode + '<\/script></body></html>');
  win.document.close();

  return sandboxIframe;
}

export function cleanupSandbox(): void {
  if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
  if (sandboxIframe) {
    document.body.removeChild(sandboxIframe);
    sandboxIframe = null;
  }
}

export function executeCode(code: string, timeoutMs: number = 5000): Promise<SandboxResult> {
  return new Promise((resolve) => {
    try {
      const iframe = getSandboxIframe();
      const win = iframe.contentWindow;
      if (!win) {
        resolve({ success: false, output: '', error: 'Sandbox iframe not available', durationMs: 0 });
        return;
      }

      const startTime = performance.now();

      const messageHandler = (e: MessageEvent) => {
        if (e.origin !== 'null' && e.origin !== window.origin) return;
        if (!e.data || e.data.type !== 'sandbox:result') return;
        window.removeEventListener('message', messageHandler);
        if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
        const durationMs = Math.round(performance.now() - startTime);
        resolve({
          success: e.data.success,
          output: e.data.success ? e.data.output : '',
          error: e.data.error,
          durationMs,
        });
      };

      window.addEventListener('message', messageHandler);

      timeoutId = setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        resolve({ success: false, output: '', error: 'Execution timed out after ' + timeoutMs + 'ms', durationMs: timeoutMs });
      }, timeoutMs);

      win.postMessage({ type: 'sandbox:execute', code }, 'about:blank');
    } catch (err) {
      resolve({ success: false, output: '', error: (err as Error).message, durationMs: 0 });
    }
  });
}

export function createSandboxData(execution: SandboxExecution): SandboxExecution {
  return execution;
}
