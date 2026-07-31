import { describe, it, expect, vi } from 'vitest';
import { createSandboxData, cleanupSandbox } from '../../app/src/services/sandboxService';
import { SandboxResult } from '../../app/src/services/sandboxService';

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

  it('cleanupSandbox should not throw when called', () => {
    expect(() => cleanupSandbox()).not.toThrow();
  });

  it('cleanupSandbox can be called multiple times without error', () => {
    cleanupSandbox();
    cleanupSandbox();
    expect(() => cleanupSandbox()).not.toThrow();
  });
});

describe('SandboxResult interface structure', () => {
  it('should allow a success result with output and durationMs', () => {
    const result: SandboxResult = { success: true, output: '42', durationMs: 100 };
    expect(result.success).toBe(true);
    expect(result.output).toBe('42');
    expect(result.durationMs).toBe(100);
  });

  it('should allow a failure result with error and durationMs', () => {
    const result: SandboxResult = { success: false, output: '', error: 'Error message', durationMs: 50 };
    expect(result.success).toBe(false);
    expect(result.error).toBe('Error message');
    expect(result.durationMs).toBe(50);
  });

  it('should have optional error field', () => {
    const success: SandboxResult = { success: true, output: 'ok', durationMs: 0 };
    const failure: SandboxResult = { success: false, output: '', error: 'fail', durationMs: 0 };
    expect(success.error).toBeUndefined();
    expect(failure.error).toBeDefined();
  });

  it('should allow zero durationMs', () => {
    const result: SandboxResult = { success: true, output: 'instant', durationMs: 0 };
    expect(result.durationMs).toBe(0);
  });
});
