import 'fake-indexeddb/auto';

class MockBroadcastChannel {
  private handlers: Set<(event: MessageEvent) => void> = new Set();
  onmessage: ((event: MessageEvent) => void) | null = null;

  postMessage(data: unknown): void {
    const event = new MessageEvent('message', { data });
    this.handlers.forEach((h) => h(event));
    this.onmessage?.(event);
  }

  addEventListener(_type: string, handler: (event: MessageEvent) => void): void {
    this.handlers.add(handler);
  }

  removeEventListener(_type: string, handler: (event: MessageEvent) => void): void {
    this.handlers.delete(handler);
  }

  close(): void {
    this.handlers.clear();
  }
}

class MockWorker {
  private handler: ((event: MessageEvent) => void) | null = null;

  postMessage(_data: unknown): void {
    this.handler?.(new MessageEvent('message', { data: { embedding: new Float32Array(384) } }));
  }

  addEventListener(_type: string, handler: (event: MessageEvent) => void): void {
    this.handler = handler;
  }

  removeEventListener(_type: string, _handler: (event: MessageEvent) => void): void {
    this.handler = null;
  }

  terminate(): void {}
}

(globalThis as any).BroadcastChannel = MockBroadcastChannel;
(globalThis as any).Worker = MockWorker;

Object.defineProperty(globalThis.navigator, 'storage', {
  value: {
    estimate: async () => ({ quota: 1_000_000_000, usage: 100_000_000 }),
  },
  writable: true,
});

let counter = 0;
Object.defineProperty(globalThis.crypto, 'randomUUID', {
  value: () => `test-uuid-${counter++}`,
  writable: true,
});
