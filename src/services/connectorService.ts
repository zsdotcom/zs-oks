import { ConnectorConfig } from '../types';
import { dbPut, dbGetAll, dbDelete } from '../db/indexedDB';

let connectors: ConnectorConfig[] = [];

export async function loadConnectors(): Promise<void> {
  try {
    connectors = await dbGetAll<ConnectorConfig>('connectors');
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
  connectors = connectors.filter((c) => c.id !== id);
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
