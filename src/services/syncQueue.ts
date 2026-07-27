import { dbPut, dbGetAll, dbDelete, dbGetKey, dbSetKey } from '../db/indexedDB';

export interface SyncQueueItem {
  id: string;
  operation: 'put' | 'delete' | 'setKey' | 'deleteKey';
  storeName?: string;
  key?: string;
  value?: any;
  createdAt: number;
  retries: number;
  maxRetries: number;
}

const QUEUE_KEY = 'oks-sync-queue';
const MAX_RETRIES = 5;

let isProcessing = false;
let onlineListener: (() => void) | null = null;

function generateId(): string {
  return `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function enqueue(item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'retries' | 'maxRetries'>): Promise<void> {
  const queue = await getQueue();
  queue.push({
    ...item,
    id: generateId(),
    createdAt: Date.now(),
    retries: 0,
    maxRetries: MAX_RETRIES,
  });
  await saveQueue(queue);
}

export async function getQueue(): Promise<SyncQueueItem[]> {
  try {
    const raw = await dbGetKey(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveQueue(queue: SyncQueueItem[]): Promise<void> {
  await dbSetKey(QUEUE_KEY, JSON.stringify(queue));
}

export async function removeFromQueue(id: string): Promise<void> {
  const queue = await getQueue();
  await saveQueue(queue.filter((q) => q.id !== id));
}

export async function processQueue(): Promise<{ processed: number; failed: number }> {
  if (isProcessing) return { processed: 0, failed: 0 };
  isProcessing = true;
  let processed = 0;
  let failed = 0;
  try {
    const queue = await getQueue();
    for (const item of queue) {
      try {
        switch (item.operation) {
          case 'put':
            if (item.storeName && item.value) await dbPut(item.storeName as any, item.value);
            break;
          case 'delete':
            if (item.storeName && item.key) await dbDelete(item.storeName as any, item.key);
            break;
          case 'setKey':
            if (item.key) await dbSetKey(item.key, item.value);
            break;
          case 'deleteKey':
            if (item.key) await dbSetKey(item.key, '');
            break;
        }
        await removeFromQueue(item.id);
        processed++;
      } catch {
        item.retries++;
        if (item.retries >= item.maxRetries) {
          await removeFromQueue(item.id);
          failed++;
        } else {
          await saveQueue(queue);
        }
      }
    }
  } finally {
    isProcessing = false;
  }
  return { processed, failed };
}

export function initSyncQueue(): void {
  if (onlineListener) return;
  onlineListener = () => {
    if (navigator.onLine) processQueue();
  };
  window.addEventListener('online', onlineListener);
  if (navigator.onLine) processQueue();
}

export function destroySyncQueue(): void {
  if (onlineListener) {
    window.removeEventListener('online', onlineListener);
    onlineListener = null;
  }
}

export async function getQueueStatus(): Promise<{ pending: number; totalRetries: number }> {
  const queue = await getQueue();
  return {
    pending: queue.length,
    totalRetries: queue.reduce((sum, q) => sum + q.retries, 0),
  };
}
