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

function getWebhooks(): WebhookConfig[] {
  try {
    const raw = localStorage.getItem(WEBHOOKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveWebhooks(webhooks: WebhookConfig[]): void {
  localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(webhooks));
}

export function addWebhook(config: Omit<WebhookConfig, 'id' | 'createdAt'>): WebhookConfig {
  const webhooks = getWebhooks();
  const newHook: WebhookConfig = {
    ...config,
    id: `wh-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  webhooks.push(newHook);
  saveWebhooks(webhooks);
  return newHook;
}

export function removeWebhook(id: string): void {
  saveWebhooks(getWebhooks().filter((w) => w.id !== id));
}

export function updateWebhook(id: string, updates: Partial<WebhookConfig>): WebhookConfig | null {
  const webhooks = getWebhooks();
  const idx = webhooks.findIndex((w) => w.id === id);
  if (idx === -1) return null;
  webhooks[idx] = { ...webhooks[idx], ...updates };
  saveWebhooks(webhooks);
  return webhooks[idx];
}

export function getWebhooksByEvent(event: string): WebhookConfig[] {
  return getWebhooks().filter((w) => w.active && w.events.includes(event));
}

export async function fireWebhooks(event: string, payload: any): Promise<void> {
  const hooks = getWebhooksByEvent(event);
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

export function getAllWebhooks(): WebhookConfig[] {
  return getWebhooks();
}
