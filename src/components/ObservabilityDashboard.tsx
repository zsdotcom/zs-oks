import React from 'react';
import { A2AMetric, KBFile, KBFolder, ChatMessage, WorkspaceProject } from '../types';
import { BarChart, LineChart, PieChart, StatCard, Heatmap, StatusBadge } from './charts/SimpleCharts';
import { Activity, Zap, Clock, AlertTriangle, FileText, MessageSquare, Folder, Users } from './icons/lucide-shim';

interface Props {
  metrics: A2AMetric[];
  agents: { id: string; name: string; color: string }[];
  files: KBFile[];
  folders: KBFolder[];
  messages: ChatMessage[];
  workspaceProjects: WorkspaceProject[];
}

export const ObservabilityDashboard: React.FC<Props> = ({ metrics, agents, files, folders, messages, workspaceProjects }) => {
  const totalMetrics = metrics.length;
  const avgLatency = totalMetrics > 0 ? Math.round(metrics.reduce((s, m) => s + m.latencyMs, 0) / totalMetrics) : 0;
  const successRate = totalMetrics > 0 ? Math.round((metrics.filter((m) => m.status === 'success').length / totalMetrics) * 100) : 100;
  const totalTokens = metrics.reduce((s, m) => s + m.tokensEstimated, 0);

  const fileTypeCounts = (['markdown', 'text', 'json', 'csv', 'pdf', 'image'] as const).map((t) => ({
    label: t, value: files.filter((f) => f.type === t).length, color: t === 'markdown' ? '#3b82f6' : t === 'csv' ? '#22c55e' : t === 'json' ? '#f59e0b' : t === 'pdf' ? '#ef4444' : t === 'image' ? '#a855f7' : '#6b7280',
  })).filter((c) => c.value > 0);

  const fileActiveRatio = files.length > 0 ? [{ label: 'Active', value: files.filter((f) => f.isActive).length, color: '#22c55e' }, { label: 'Inactive', value: files.filter((f) => !f.isActive).length, color: '#6b7280' }] : [];

  const projectFileCounts = workspaceProjects.map((p) => ({ label: p.name.slice(0, 12), value: p.fileCount || 0, color: '#3b82f6' })).filter((p) => p.value > 0);

  const agentLatencies = agents.map((agent) => {
    const agentMetrics = metrics.filter((m) => m.agentId === agent.id);
    const avg = agentMetrics.length > 0 ? Math.round(agentMetrics.reduce((s, m) => s + m.latencyMs, 0) / agentMetrics.length) : 0;
    return { label: agent.name.split(' ')[0], value: avg, color: agent.color };
  }).filter((a) => a.value > 0);

  const timeSeries = metrics.slice(-20).map((m, i) => ({ x: `#${i + 1}`, y: m.latencyMs }));

  const totalFileSize = files.reduce((s, f) => {
    const num = parseFloat(f.size);
    return s + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" role="region" aria-label="Observability dashboard">
      <div className="flex items-center gap-2 mb-2">
        <Activity size={18} className="text-[var(--accent)]" />
        <h2 className="text-sm font-semibold">Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <StatCard label="Total Runs" value={totalMetrics} icon={<Zap size={16} />} color="var(--accent)" />
        <StatCard label="Avg Latency" value={`${avgLatency}ms`} icon={<Clock size={16} />} color="#10b981" />
        <StatCard label="Success Rate" value={`${successRate}%`} icon={<Activity size={16} />} color="#f59e0b" />
        <StatCard label="Est. Tokens" value={totalTokens.toLocaleString()} icon={<AlertTriangle size={16} />} color="#ef4444" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <StatCard label="Files" value={files.length} icon={<FileText size={16} />} color="#3b82f6" />
        <StatCard label="Folders" value={folders.length} icon={<Folder size={16} />} color="#8b5cf6" />
        <StatCard label="Messages" value={messages.length} icon={<MessageSquare size={16} />} color="#06b6d4" />
        <StatCard label="Projects" value={workspaceProjects.length} icon={<Users size={16} />} color="#f97316" />
      </div>

      {fileTypeCounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4">
            <h3 className="text-xs font-medium mb-2 text-[var(--text-secondary)]">Files by Type</h3>
            <BarChart data={fileTypeCounts} width={350} height={180} />
          </div>
          {fileActiveRatio.length > 0 && (
            <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4">
              <h3 className="text-xs font-medium mb-2 text-[var(--text-secondary)]">Active vs Inactive</h3>
              <PieChart data={fileActiveRatio} width={200} height={180} />
            </div>
          )}
        </div>
      )}

      {agentLatencies.length > 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4">
          <h3 className="text-xs font-medium mb-2 text-[var(--text-secondary)]">Agent Average Latency (ms)</h3>
          <BarChart data={agentLatencies} width={500} height={200} />
        </div>
      )}

      {timeSeries.length > 1 && (
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4">
          <h3 className="text-xs font-medium mb-2 text-[var(--text-secondary)]">Recent Latency Timeline</h3>
          <LineChart data={[{ label: 'Latency', values: timeSeries, color: 'var(--accent)' }]} width={600} height={200} />
        </div>
      )}

      {projectFileCounts.length > 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4">
          <h3 className="text-xs font-medium mb-2 text-[var(--text-secondary)]">Files per Project</h3>
          <BarChart data={projectFileCounts} width={400} height={150} />
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4">
          <h3 className="text-xs font-medium mb-2 text-[var(--text-secondary)]">Knowledge Base Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div><span className="text-[var(--text-muted)]">Total size:</span> <span className="font-medium">{totalFileSize.toFixed(1)} KB</span></div>
            <div><span className="text-[var(--text-muted)]">Active context:</span> <span className="font-medium text-green-400">{files.filter((f) => f.isActive).length}</span></div>
            <div><span className="text-[var(--text-muted)]">Versions:</span> <span className="font-medium">{(window as any).oksVersionsCount || 0}</span></div>
            <div><span className="text-[var(--text-muted)]">Chat sessions:</span> <span className="font-medium">{Math.max(1, Math.round(messages.length / 5))}</span></div>
          </div>
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4">
        <h3 className="text-xs font-medium mb-2 text-[var(--text-secondary)]">Recent Runs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-1 px-2 text-[var(--text-muted)]">Agent</th>
                <th className="text-left py-1 px-2 text-[var(--text-muted)]">Topic</th>
                <th className="text-right py-1 px-2 text-[var(--text-muted)]">Latency</th>
                <th className="text-right py-1 px-2 text-[var(--text-muted)]">Tokens</th>
                <th className="text-center py-1 px-2 text-[var(--text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.slice(-10).reverse().map((m) => (
                <tr key={m.id} className="border-b border-[var(--border)]/50">
                  <td className="py-1 px-2">{m.agentName}</td>
                  <td className="py-1 px-2 truncate max-w-[150px]">{m.topic}</td>
                  <td className="py-1 px-2 text-right">{m.latencyMs}ms</td>
                  <td className="py-1 px-2 text-right">{m.tokensEstimated}</td>
                  <td className="py-1 px-2 text-center">
                    <StatusBadge status={m.status === 'success' ? 'success' : 'error'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {metrics.length === 0 && <p className="text-xs text-[var(--text-muted)] py-4 text-center">No metrics recorded yet.</p>}
        </div>
      </div>
    </div>
  );
};
