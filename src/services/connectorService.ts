import { ConnectorConfig } from '../types';
import { dbPut, dbGetAll, dbDelete, dbGetKey, dbSetKey } from '../db/indexedDB';

let connectors: ConnectorConfig[] = [];

export async function loadConnectors(): Promise<void> {
  try {
    const stored = await dbGetAll<any>('connectors');
    connectors = stored.map((c: any) => ({ ...c, config: typeof c.config === 'string' ? JSON.parse(c.config) : c.config }));
  } catch {
    connectors = [];
  }
}

export function getConnectors(): ConnectorConfig[] {
  return connectors;
}

export async function addConnector(config: Omit<ConnectorConfig, 'status' | 'lastSync'>): Promise<ConnectorConfig> {
  const connector: ConnectorConfig = { ...config, status: 'disconnected', lastSync: undefined };
  await dbPut('connectors', { ...connector, config: JSON.stringify(connector.config) });
  connectors.push(connector);
  return connector;
}

export async function removeConnector(id: string): Promise<void> {
  await dbDelete('connectors', id);
  await dbSetKey(`connector-data-${id}`, '');
  connectors = connectors.filter((c) => c.id !== id);
}

export async function updateConnectorStatus(id: string, status: ConnectorConfig['status'], lastSync?: Date): Promise<void> {
  connectors = connectors.map((c) => c.id === id ? { ...c, status, lastSync: lastSync || c.lastSync } : c);
  const c = connectors.find((c) => c.id === id);
  if (c) await dbPut('connectors', { ...c, config: JSON.stringify(c.config), lastSync: lastSync?.toISOString() || c.lastSync });
}

export async function testGitHubConnection(token: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchGitHubIssues(repo: string, token: string): Promise<any[]> {
  const res = await fetch(`https://api.github.com/repos/${repo}/issues?state=open&per_page=10`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function fetchGitHubRepoInfo(repo: string, token: string): Promise<any> {
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function testSlackWebhook(webhookUrl: string): Promise<boolean> {
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Open Knowledge Studio connection test' }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendSlackMessage(webhookUrl: string, message: string): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });
  if (!res.ok) throw new Error(`Slack API error: ${res.status}`);
}

export async function fetchRSSFeed(url: string): Promise<any[]> {
  const res = await fetch(url);
  const text = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');
  const items = xml.querySelectorAll('item');
  return Array.from(items).slice(0, 10).map((item) => ({
    title: item.querySelector('title')?.textContent || '',
    description: item.querySelector('description')?.textContent?.slice(0, 300) || '',
    link: item.querySelector('link')?.textContent || '',
    pubDate: item.querySelector('pubDate')?.textContent || '',
    source: url,
  }));
}

/* ─── Sync Engine ─── */

async function getStoredData(connectorId: string): Promise<any[]> {
  try {
    const raw = await dbGetKey(`connector-data-${connectorId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function storeData(connectorId: string, data: any[]): Promise<void> {
  await dbSetKey(`connector-data-${connectorId}`, JSON.stringify(data));
}

export async function getConnectorData(connectorId: string): Promise<any[]> {
  return getStoredData(connectorId);
}

export async function syncConnector(connector: ConnectorConfig): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    let data: any[] = [];
    switch (connector.type) {
      case 'github': {
        const token = connector.config.token || '';
        const repo = connector.config.repo || '';
        if (!token) throw new Error('GitHub token required');
        if (repo) {
          const [issues, repoInfo] = await Promise.all([
            fetchGitHubIssues(repo, token).catch(() => []),
            fetchGitHubRepoInfo(repo, token).catch(() => null),
          ]);
          data = [...(repoInfo ? [{ type: 'repo_info', ...repoInfo }] : []), ...issues.map((i: any) => ({ type: 'issue', repo, ...i }))];
        }
        break;
      }
      case 'rss': {
        const feedUrl = connector.config.feedUrl || '';
        if (!feedUrl) throw new Error('RSS feed URL required');
        data = await fetchRSSFeed(feedUrl);
        break;
      }
      case 'slack':
      case 'email':
      case 'webhook':
        data = [];
        break;
    }
    await storeData(connector.id, data);
    await updateConnectorStatus(connector.id, data.length > 0 ? 'connected' : connector.status, new Date());
    return { success: true, count: data.length };
  } catch (err) {
    await updateConnectorStatus(connector.id, 'error');
    return { success: false, count: 0, error: (err as Error).message };
  }
}

export async function syncAllConnectors(): Promise<Record<string, { success: boolean; count: number; error?: string }>> {
  const results: Record<string, { success: boolean; count: number; error?: string }> = {};
  for (const c of connectors.filter((c) => c.enabled)) {
    results[c.id] = await syncConnector(c);
  }
  return results;
}

let pollTimer: ReturnType<typeof setInterval> | null = null;

export function startPolling(intervalMs = 300000): void {
  stopPolling();
  pollTimer = setInterval(() => {
    syncAllConnectors().catch(() => {});
  }, intervalMs);
}

export function stopPolling(): void {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
}

export function isPolling(): boolean {
  return pollTimer !== null;
}
