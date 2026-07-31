import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testGitHubConnection, fetchGitHubIssues, fetchGitHubRepoInfo, testSlackWebhook, sendSlackMessage, fetchRSSFeed, addConnector, removeConnector, getConnectors, syncConnector, getConnectorData } from '../../app/src/services/connectorService';
import type { ConnectorConfig } from '../../app/src/types';

function ensureMock() {
  if (!vi.isMockFunction(fetch)) {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({})))
    );
  }
}

function mockFetchResponse(data: any, status = 200) {
  ensureMock();
  return vi.mocked(fetch).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data)),
  } as Response);
}

function mockFetchTextResponse(text: string, status = 200) {
  ensureMock();
  return vi.mocked(fetch).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(text),
    json: () => Promise.resolve({}),
  } as Response);
}

describe('connectorService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({})))
    );
  });

  describe('testGitHubConnection', () => {
    it('returns true for valid token', async () => {
      mockFetchResponse({ login: 'testuser' });
      const result = await testGitHubConnection('valid-token');
      expect(result).toBe(true);
    });

    it('returns false for invalid token', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('401 Unauthorized'));
      const result = await testGitHubConnection('bad-token');
      expect(result).toBe(false);
    });

    it('sends authorization header', async () => {
      mockFetchResponse({ login: 'testuser' });
      await testGitHubConnection('test-token');
      const headers = (vi.mocked(fetch).mock.calls[0][1] as any).headers;
      expect(headers.Authorization).toBe('Bearer test-token');
    });
  });

  describe('fetchGitHubIssues', () => {
    it('fetches open issues from repo', async () => {
      const issues = [{ number: 1, title: 'Bug', state: 'open' }];
      mockFetchResponse(issues);
      const result = await fetchGitHubIssues('owner/repo', 'token');
      expect(result).toEqual(issues);
      const url = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(url).toContain('api.github.com/repos/owner/repo/issues');
    });

    it('throws on API error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false, status: 404,
        json: () => Promise.resolve({ message: 'Not Found' }),
      } as Response);
      await expect(fetchGitHubIssues('bad/repo', 'token')).rejects.toThrow('GitHub API error: 404');
    });
  });

  describe('fetchGitHubRepoInfo', () => {
    it('fetches repo information', async () => {
      const info = { full_name: 'owner/repo', stargazers_count: 42 };
      mockFetchResponse(info);
      const result = await fetchGitHubRepoInfo('owner/repo', 'token');
      expect(result.stargazers_count).toBe(42);
    });
  });

  describe('testSlackWebhook', () => {
    it('returns true for valid webhook', async () => {
      mockFetchResponse('ok');
      const result = await testSlackWebhook('https://hooks.slack.com/services/TEST');
      expect(result).toBe(true);
    });

    it('returns false for invalid webhook', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
      const result = await testSlackWebhook('https://invalid.url');
      expect(result).toBe(false);
    });
  });

  describe('sendSlackMessage', () => {
    it('sends message to Slack webhook', async () => {
      mockFetchResponse('ok');
      await sendSlackMessage('https://hooks.slack.com/TEST', 'Hello');
      const body = JSON.parse((vi.mocked(fetch).mock.calls[0][1] as any).body as string);
      expect(body.text).toBe('Hello');
    });
  });

  describe('fetchRSSFeed', () => {
    it('parses RSS XML feed', async () => {
      const xml = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Test Article</title>
      <description>A description</description>
      <link>https://example.com/article</link>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
      mockFetchTextResponse(xml);
      const result = await fetchRSSFeed('https://example.com/feed.xml');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Article');
      expect(result[0].link).toBe('https://example.com/article');
    });

    it('handles empty feed', async () => {
      const xml = '<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>';
      mockFetchTextResponse(xml);
      const result = await fetchRSSFeed('https://example.com/empty.xml');
      expect(result).toEqual([]);
    });
  });

  describe('connector CRUD', () => {
    it('adds a connector', async () => {
      const config = { name: 'Test GitHub', type: 'github' as const, id: 'gh-1', enabled: true, config: { token: 'test', repo: 'owner/repo' } };
      const result = await addConnector(config);
      expect(result.status).toBe('disconnected');
      const connectors = getConnectors();
      expect(connectors.length).toBeGreaterThan(0);
    });

    it('removes a connector', async () => {
      const config = { name: 'To Remove', type: 'github' as const, id: 'gh-remove', enabled: true, config: { token: 'test', repo: 'owner/repo' } };
      await addConnector(config);
      await removeConnector('gh-remove');
      const connectors = getConnectors();
      expect(connectors.find(c => c.id === 'gh-remove')).toBeUndefined();
    });
  });

  describe('syncConnector', () => {
    it('syncs a GitHub connector', async () => {
      const connector: ConnectorConfig = {
        id: 'sync-gh', name: 'Sync GH', type: 'github', enabled: true,
        config: { token: 'test-token', repo: 'owner/repo' },
        status: 'disconnected',
      };
      const repoInfo = { full_name: 'owner/repo', stargazers_count: 42 };
      const issues = [{ number: 1, title: 'Issue 1' }];
      vi.mocked(fetch).mockImplementation((input: any) => {
        const url = typeof input === 'string' ? input : input?.url || '';
        if (url.includes('api.github.com/repos')) {
          if (url.includes('/issues')) {
            return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(issues), text: () => Promise.resolve('') } as Response);
          }
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(repoInfo), text: () => Promise.resolve('') } as Response);
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}), text: () => Promise.resolve('') } as Response);
      });

      const result = await syncConnector(connector);
      expect(result.success).toBe(true);
      expect(result.count).toBeGreaterThan(0);
    });

    it('syncs an RSS connector', async () => {
      const connector: ConnectorConfig = {
        id: 'sync-rss', name: 'Sync RSS', type: 'rss', enabled: true,
        config: { feedUrl: 'https://example.com/feed.xml' },
        status: 'disconnected',
      };
      const xml = '<?xml version="1.0"?><rss version="2.0"><channel><item><title>RSS Item</title></item></channel></rss>';
      mockFetchTextResponse(xml);

      const result = await syncConnector(connector);
      expect(result.success).toBe(true);
    });
  });

  describe('getConnectorData', () => {
    it('returns stored data', async () => {
      const data = await getConnectorData('nonexistent');
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
