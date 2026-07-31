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
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  public onerror: ((event: Event | string) => void) | null = null;

  postMessage(data: unknown): void {
    const msg = data as { type: string; texts: string[]; id: number };
    const embeddings = msg.texts.map(() =>
      Array.from({ length: 384 }, () => Math.random() * 2 - 1)
    );
    const response = new MessageEvent('message', {
      data: { id: msg.id, embeddings },
    });
    this.messageHandler?.(response);
  }

  addEventListener(type: string, handler: (event: MessageEvent) => void): void {
    if (type === 'message') this.messageHandler = handler;
  }

  removeEventListener(type: string, _handler: (event: MessageEvent) => void): void {
    if (type === 'message') this.messageHandler = null;
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
