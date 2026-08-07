import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { parseCSV, getCSVSummary } from '../../app/src/services/csvService';
import { setLocale, getLocale, t, onLocaleChange, getSupportedLocales } from '../../app/src/services/i18nService';
import { enqueue, getQueue, removeFromQueue, getQueueStatus, destroySyncQueue } from '../../app/src/services/syncQueue';
import { renderChart, renderMermaidDiagram } from '../../app/src/services/chartService';
import { initCollaboration, destroyCollaboration, broadcastFileUpdate, updatePresence, getActivePeers, onCollabAction } from '../../app/src/services/collaborationService';
import { detectOutbreaks, computeOutbreakStats } from '../../app/src/services/outbreakService';
import { getReportTemplates, generateReport, renderReportToMarkdown } from '../../app/src/services/reportService';
import { getSurveillanceFeeds, computeSurveillanceSummary } from '../../app/src/services/surveillanceService';
import { buildActiveToolsContext, parseToolCall } from '../../app/src/services/mcpService';
import type { EpiDataPoint } from '../../app/src/components/EpiMap';

describe('csvService', () => {
  it('parseCSV parses basic CSV with headers', () => {
    const csv = 'name,age,city\nAlice,30,NYC\nBob,25,LA';
    const result = parseCSV(csv);
    expect(result.headers).toEqual(['name', 'age', 'city']);
    expect(result.rows).toHaveLength(2);
    expect(result.rowCount).toBe(2);
    expect(result.rows[0]).toEqual(['Alice', '30', 'NYC']);
    expect(result.rows[1]).toEqual(['Bob', '25', 'LA']);
  });

  it('parseCSV handles quoted fields with commas', () => {
    const csv = 'col1,col2\n"hello, world",test\n"a""b",c';
    const result = parseCSV(csv);
    expect(result.rows[0][0]).toBe('hello, world');
    expect(result.rows[1][0]).toBe('a"b');
  });

  it('parseCSV handles empty content', () => {
    const result = parseCSV('');
    expect(result.headers).toEqual([]);
    expect(result.rowCount).toBe(0);
  });

  it('parseCSV infers column types', () => {
    const csv = 'name,age,date\nAlice,30,2024-01-01\nBob,25,2024-02-01';
    const result = parseCSV(csv);
    expect(result.columnTypes[0]).toBe('text');
    expect(result.columnTypes[1]).toBe('number');
  });

  it('getCSVSummary returns preview limited to maxPreview', () => {
    const csv = 'h1,h2\n' + Array.from({ length: 20 }, (_, i) => `a${i},b${i}`).join('\n');
    const summary = getCSVSummary(csv, 3);
    expect(summary.rowCount).toBe(20);
    expect(summary.preview).toHaveLength(3);
    expect(summary.headers).toEqual(['h1', 'h2']);
  });
});

describe('i18nService', () => {
  beforeEach(() => { setLocale('en'); });

  it('setLocale and getLocale work', () => {
    expect(getLocale()).toBe('en');
    setLocale('bn');
    expect(getLocale()).toBe('bn');
    setLocale('en');
  });

  it('t returns English by default', () => {
    expect(t('app.name')).toBe('Open Knowledge Studio');
    expect(t('nav.home')).toBe('Home');
  });

  it('t returns Bengali after locale switch', () => {
    setLocale('bn');
    expect(t('app.name')).toBe('ওপেন নলেজ স্টুডিও');
    setLocale('en');
  });

  it('t returns fallback for missing keys', () => {
    expect(t('nonexistent.key', 'Fallback')).toBe('Fallback');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('onLocaleChange fires listeners', () => {
    const fn = vi.fn();
    const unsub = onLocaleChange(fn);
    setLocale('bn');
    expect(fn).toHaveBeenCalledTimes(1);
    unsub();
    setLocale('en');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('getSupportedLocales returns en and bn', () => {
    const locales = getSupportedLocales();
    expect(locales).toHaveLength(2);
    expect(locales[0].code).toBe('en');
    expect(locales[1].code).toBe('bn');
  });
});

describe('chartService', () => {
  it('renderChart renders bar chart SVG', () => {
    const svg = renderChart({ type: 'bar', labels: ['A', 'B'], datasets: [{ label: 'S1', values: [10, 20] }] });
    expect(svg).toContain('<svg');
    expect(svg).toContain('rect');
  });

  it('renderChart renders line chart SVG', () => {
    const svg = renderChart({ type: 'line', labels: ['A', 'B', 'C'], datasets: [{ label: 'S1', values: [10, 15, 7] }] });
    expect(svg).toContain('<svg');
    expect(svg).toContain('path');
    expect(svg).toContain('circle');
  });

  it('renderChart renders pie chart HTML+SVG', () => {
    const html = renderChart({ type: 'pie', labels: ['A', 'B'], datasets: [{ label: 'S1', values: [30, 70] }] });
    expect(html).toContain('<svg');
    expect(html).toContain('path');
    expect(html).toContain('30%');
    expect(html).toContain('70%');
  });

  it('renderChart renders scatter as line chart', () => {
    const svg = renderChart({ type: 'scatter', labels: ['X', 'Y'], datasets: [{ label: 'S1', values: [5, 10] }] });
    expect(svg).toContain('<svg');
  });

  it('renderMermaidDiagram wraps code in mermaid div', () => {
    const code = 'graph TD; A-->B;';
    const html = renderMermaidDiagram(code);
    expect(html).toContain('class="mermaid"');
    expect(html).toContain('graph TD');
  });
});

describe('outbreakService', () => {
  const today = new Date();
  const daysAgo = (d: number) => new Date(today.getTime() - d * 86400000).toISOString().split('T')[0];
  const sampleData: EpiDataPoint[] = [
    { id: '1', lat: 0, lng: 0, label: 'CityA', disease: 'Malaria', cases: 100, severity: 'medium', date: daysAgo(2), status: 'active' },
    { id: '2', lat: 0, lng: 0, label: 'CityA', disease: 'Malaria', cases: 500, severity: 'high', date: daysAgo(1), status: 'active' },
    { id: '3', lat: 0, lng: 0, label: 'CityB', disease: 'Dengue', cases: 10, severity: 'low', date: daysAgo(2), status: 'active' },
  ];

  it('detectOutbreaks returns alerts for elevated case counts', () => {
    const alerts = detectOutbreaks(sampleData);
    expect(alerts.length).toBeGreaterThanOrEqual(1);
    const malaria = alerts.find((a) => a.disease === 'Malaria');
    expect(malaria).toBeDefined();
    expect(malaria!.anomalyScore).toBeGreaterThan(1);
    expect(malaria!.recommendation).toBeTruthy();
  });

  it('detectOutbreaks assigns severity based on anomaly score', () => {
    const now = new Date();
    const recentDate = new Date(now.getTime() - 2 * 86400000).toISOString().split('T')[0];
    const olderDate1 = new Date(now.getTime() - 10 * 86400000).toISOString().split('T')[0];
    const olderDate2 = new Date(now.getTime() - 11 * 86400000).toISOString().split('T')[0];
    const olderDate3 = new Date(now.getTime() - 12 * 86400000).toISOString().split('T')[0];

    const criticalData: EpiDataPoint[] = [
      { id: '1', lat: 0, lng: 0, label: 'CityX', disease: 'Ebola', cases: 1, severity: 'critical', date: olderDate1, status: 'active' },
      { id: '2', lat: 0, lng: 0, label: 'CityX', disease: 'Ebola', cases: 1, severity: 'critical', date: olderDate2, status: 'active' },
      { id: '3', lat: 0, lng: 0, label: 'CityX', disease: 'Ebola', cases: 1, severity: 'critical', date: olderDate3, status: 'active' },
      { id: '4', lat: 0, lng: 0, label: 'CityX', disease: 'Ebola', cases: 500, severity: 'critical', date: recentDate, status: 'active' },
    ];
    const alerts = detectOutbreaks(criticalData);
    expect(alerts.some((a) => a.severity === 'critical')).toBe(true);
  });

  it('computeOutbreakStats counts alerts correctly', () => {
    const alerts = detectOutbreaks(sampleData);
    const stats = computeOutbreakStats(alerts);
    expect(stats.totalAlerts).toBe(alerts.length);
    expect(stats.topDiseases.length).toBeGreaterThanOrEqual(0);
    expect(typeof stats.trend).toBe('string');
  });
});

describe('reportService', () => {
  it('getReportTemplates returns all templates', () => {
    const templates = getReportTemplates();
    expect(templates).toHaveLength(3);
    expect(templates[0].id).toBe('outbreak-summary');
    expect(templates[1].id).toBe('surveillance-snapshot');
    expect(templates[2].id).toBe('clinical-codes');
  });

  it('generateReport outbreak-summary returns sections', () => {
    const alerts = [{ disease: 'Malaria', location: 'CityA', cases: 50, severity: 'high' as const, anomalyScore: 2.5, trend: 'rising' as const, recommendation: 'Investigate', id: 'a1', baseline: 10, detectedAt: new Date().toISOString() }];
    const stats = { totalAlerts: 1, criticalAlerts: 0, highAlerts: 1, mediumAlerts: 0, topDiseases: [{ disease: 'Malaria', cases: 50 }], trend: 'increasing' as const };
    const report = generateReport('outbreak-summary', undefined, undefined, alerts, stats);
    expect(report.title).toBe('Outbreak Summary Report');
    expect(report.sections.length).toBeGreaterThan(0);
    expect(report.sections[0].title).toBe('Overview');
    expect(report.generatedAt).toBeTruthy();
  });

  it('generateReport throws for unknown template', () => {
    expect(() => generateReport('nonexistent')).toThrow('Template not found');
  });

  it('renderReportToMarkdown formats report', () => {
    const report = { title: 'Test', generatedAt: new Date().toISOString(), sections: [{ title: 'Section1', content: 'Hello', type: 'text' as const }] };
    const md = renderReportToMarkdown(report);
    expect(md).toContain('# Test');
    expect(md).toContain('## Section1');
    expect(md).toContain('Hello');
  });
});

describe('surveillanceService', () => {
  it('getSurveillanceFeeds returns 3 feeds', () => {
    const feeds = getSurveillanceFeeds();
    expect(feeds).toHaveLength(3);
    expect(feeds[0].source).toBe('cdc');
    expect(feeds[1].source).toBe('delphi');
    expect(feeds[2].source).toBe('who');
  });

  it('computeSurveillanceSummary aggregates data correctly', () => {
    const data: EpiDataPoint[] = [
      { id: '1', lat: 0, lng: 0, label: 'CityA', disease: 'Malaria', cases: 100, severity: 'high', date: '2026-06-01', status: 'active' },
      { id: '2', lat: 0, lng: 0, label: 'CityB', disease: 'Malaria', cases: 50, severity: 'medium', date: '2026-06-01', status: 'contained' },
      { id: '3', lat: 0, lng: 0, label: 'CityA', disease: 'Dengue', cases: 200, severity: 'critical', date: '2026-06-01', status: 'active' },
    ];
    const summary = computeSurveillanceSummary(data);
    expect(summary.totalCases).toBe(350);
    expect(summary.diseasesTracked).toBe(2);
    expect(summary.regionsMonitored).toBe(2);
    expect(summary.byDisease.Malaria.cases).toBe(150);
    expect(summary.byDisease.Dengue.cases).toBe(200);
  });
});

describe('mcpService', () => {
  it('buildActiveToolsContext returns formatted tools', () => {
    const servers = [{ id: 's1', name: 'Server1', description: '', status: 'connected' as const, tools: [{ name: 'tool1', description: 'Tool 1 desc', parameters: 'param1,param2', isActive: true }] }];
    const ctx = buildActiveToolsContext(servers);
    expect(ctx).toContain('Server1');
    expect(ctx).toContain('tool1');
    expect(ctx).toContain('!tool');
  });

  it('buildActiveToolsContext returns empty for no active tools', () => {
    const ctx = buildActiveToolsContext([]);
    expect(ctx).toBe('');
  });

  it('buildActiveToolsContext skips inactive tools', () => {
    const servers = [{ id: 's1', name: 'S1', description: '', status: 'connected' as const, tools: [{ name: 't1', description: 'd1', parameters: '', isActive: false }] }];
    const ctx = buildActiveToolsContext(servers);
    expect(ctx).toBe('');
  });

  it('parseToolCall parses !tool command correctly', () => {
    const result = parseToolCall('!tool get_fluview regions=nat epiweeks=202401');
    expect(result).not.toBeNull();
    expect(result!.toolName).toBe('get_fluview');
    expect(result!.params.regions).toBe('nat');
    expect(result!.params.epiweeks).toBe('202401');
  });

  it('parseToolCall handles quoted parameter values', () => {
    const result = parseToolCall('!tool search_dataset query="test query" limit=10');
    expect(result).not.toBeNull();
    expect(result!.params.query).toBe('test query');
    expect(result!.params.limit).toBe('10');
  });

  it('parseToolCall returns null for non-tool text', () => {
    expect(parseToolCall('hello world')).toBeNull();
    expect(parseToolCall('')).toBeNull();
  });

  it('parseToolCall is case insensitive for !tool prefix', () => {
    const result = parseToolCall('!TOOL test_tool key=value');
    expect(result).not.toBeNull();
    expect(result!.toolName).toBe('test_tool');
  });
});

describe('collaborationService', () => {
  afterEach(() => { destroyCollaboration(); });

  it('initCollaboration creates broadcast channel', () => {
    initCollaboration('TestUser');
    expect(() => initCollaboration()).not.toThrow();
  });

  it('destroyCollaboration cleans up', () => {
    initCollaboration();
    expect(() => destroyCollaboration()).not.toThrow();
  });

  it('getActivePeers returns only recent presences', () => {
    const recent = Date.now();
    const old = recent - 20000;
    const actions = [
      { type: 'presence' as const, tabId: 'tab1', payload: { userName: 'Alice', activeFileId: 'f1', lastSeen: recent } },
      { type: 'presence' as const, tabId: 'tab2', payload: { userName: 'Bob', activeFileId: null, lastSeen: old } },
    ];
    const peers = getActivePeers(actions);
    expect(peers).toHaveLength(1);
    expect(peers[0].userName).toBe('Alice');
  });

  it('broadcastFileUpdate and updatePresence do not throw', () => {
    initCollaboration();
    expect(() => broadcastFileUpdate('f1', 'content', 'file.md')).not.toThrow();
    expect(() => updatePresence('f1')).not.toThrow();
  });

  it('onCollabAction returns unsubscribe function', () => {
    initCollaboration();
    const fn = vi.fn();
    const unsub = onCollabAction(fn);
    expect(typeof unsub).toBe('function');
    unsub();
  });
});

describe('syncQueue', () => {
  beforeEach(async () => {
    destroySyncQueue();
    const q = await getQueue();
    for (const item of q) {
      const { removeFromQueue } = await import('../../app/src/services/syncQueue');
      await removeFromQueue(item.id);
    }
  });

  it('getQueue returns empty array initially', async () => {
    const q = await getQueue();
    expect(q).toEqual([]);
  });

  it('enqueue adds item to queue', async () => {
    await enqueue({ operation: 'put', storeName: 'files', key: 'f1', value: { id: 'f1' } });
    const q = await getQueue();
    expect(q).toHaveLength(1);
    expect(q[0].operation).toBe('put');
    expect(q[0].retries).toBe(0);
    expect(q[0].maxRetries).toBe(5);
    expect(q[0].id).toBeTruthy();
    expect(q[0].createdAt).toBeTruthy();
  });

  it('removeFromQueue removes item by id', async () => {
    await enqueue({ operation: 'setKey', key: 'k1', value: 'v1' });
    const q1 = await getQueue();
    await removeFromQueue(q1[0].id);
    const q2 = await getQueue();
    expect(q2).toHaveLength(0);
  });

  it('getQueueStatus returns pending count and retries', async () => {
    await enqueue({ operation: 'setKey', key: 'k1', value: 'v1' });
    await enqueue({ operation: 'setKey', key: 'k2', value: 'v2' });
    const status = await getQueueStatus();
    expect(status.pending).toBe(2);
    expect(status.totalRetries).toBe(0);
  });
});
