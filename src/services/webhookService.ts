import { dbGetKey, dbSetKey } from '../db/indexedDB';

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  events: string[];
  active: boolean;
  createdAt: string;
}

const WEBHOOKS_KEY = 'oks-webhooks';

async function getWebhooks(): Promise<WebhookConfig[]> {
  try {
    const raw = await dbGetKey(WEBHOOKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveWebhooks(webhooks: WebhookConfig[]): Promise<void> {
  await dbSetKey(WEBHOOKS_KEY, JSON.stringify(webhooks));
}

export async function addWebhook(config: Omit<WebhookConfig, 'id' | 'createdAt'>): Promise<WebhookConfig> {
  const webhooks = await getWebhooks();
  const newHook: WebhookConfig = {
    ...config,
    id: `wh-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  webhooks.push(newHook);
  await saveWebhooks(webhooks);
  return newHook;
}

export async function removeWebhook(id: string): Promise<void> {
  const webhooks = await getWebhooks();
  await saveWebhooks(webhooks.filter((w) => w.id !== id));
}

export async function updateWebhook(id: string, updates: Partial<WebhookConfig>): Promise<WebhookConfig | null> {
  const webhooks = await getWebhooks();
  const idx = webhooks.findIndex((w) => w.id === id);
  if (idx === -1) return null;
  webhooks[idx] = { ...webhooks[idx], ...updates };
  await saveWebhooks(webhooks);
  return webhooks[idx];
}

export async function getWebhooksByEvent(event: string): Promise<WebhookConfig[]> {
  const webhooks = await getWebhooks();
  return webhooks.filter((w) => w.active && w.events.includes(event));
}

export async function fireWebhooks(event: string, payload: any): Promise<void> {
  const hooks = await getWebhooksByEvent(event);
  await Promise.allSettled(
    hooks.map(async (hook) => {
      try {
        await fetch(hook.url, {
          method: hook.method,
          headers: { 'Content-Type': 'application/json', ...hook.headers },
          body: hook.method !== 'GET' ? JSON.stringify({ event, payload, timestamp: new Date().toISOString() }) : undefined,
        });
      } catch (err) {
        console.error(`Webhook ${hook.name} failed:`, err);
      }
    })
  );
}

export async function getAllWebhooks(): Promise<WebhookConfig[]> {
  return getWebhooks();
}
