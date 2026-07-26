import { describe, it, expect, vi } from 'vitest';
import { createSandboxData } from '../services/sandboxService';

describe('Sandbox Service', () => {
  it('should create sandbox data correctly', () => {
    const execution = createSandboxData({
      id: 'test-1',
      code: '1 + 1',
      result: { success: true, output: '2', durationMs: 10 },
      timestamp: new Date().toISOString(),
    });
    expect(execution.id).toBe('test-1');
    expect(execution.result.output).toBe('2');
  });

  it('should create sandbox data with error result', () => {
    const execution = createSandboxData({
      id: 'test-2',
      code: 'bad code',
      result: { success: false, output: '', error: 'SyntaxError', durationMs: 5 },
      timestamp: new Date().toISOString(),
    });
    expect(execution.result.success).toBe(false);
    expect(execution.result.error).toBe('SyntaxError');
  });

  it('should handle empty output', () => {
    const execution = createSandboxData({
      id: 'test-3',
      code: 'let x = 1',
      result: { success: true, output: '', durationMs: 3 },
      timestamp: new Date().toISOString(),
    });
    expect(execution.result.output).toBe('');
  });
});
