import React, { useMemo } from 'react';
import { A2AMetric } from '../types';
import { BarChart, LineChart, StatCard } from './charts/SimpleCharts';
import { Activity, Zap, Clock, Trophy, TrendingUp, PieChart } from './icons/lucide-shim';

interface Props {
  metrics: A2AMetric[];
  agents: { id: string; name: string; color: string; avatar: string }[];
}

interface AgentStats {
  id: string;
  name: string;
  color: string;
  avatar: string;
  runs: number;
  avgLatencyMs: number;
  totalTokens: number;
  successRate: number;
  errorCount: number;
}

function computeAgentStats(metrics: A2AMetric[], agents: Props['agents']): AgentStats[] {
  return agents.map((agent) => {
    const agentMetrics = metrics.filter((m) => m.agentId === agent.id);
    const runs = agentMetrics.length;
    const successCount = agentMetrics.filter((m) => m.status === 'success').length;
    const errorCount = agentMetrics.filter((m) => m.status === 'error').length;
    const avgLatencyMs = runs > 0 ? Math.round(agentMetrics.reduce((s, m) => s + m.latencyMs, 0) / runs) : 0;
    const totalTokens = agentMetrics.reduce((s, m) => s + m.tokensEstimated, 0);
    const successRate = runs > 0 ? Math.round((successCount / runs) * 100) : 0;
    return { id: agent.id, name: agent.name, color: agent.color, avatar: agent.avatar, runs, avgLatencyMs, totalTokens, successRate, errorCount };
  });
}

export const A2AMetricsDashboard: React.FC<Props> = ({ metrics, agents }) => {
  const totalMetrics = metrics.length;
  const avgLatency = totalMetrics > 0 ? Math.round(metrics.reduce((s, m) => s + m.latencyMs, 0) / totalMetrics) : 0;
  const successRate = totalMetrics > 0 ? Math.round((metrics.filter((m) => m.status === 'success').length / totalMetrics) * 100) : 100;
  const totalTokens = metrics.reduce((s, m) => s + m.tokensEstimated, 0);
  const totalErrors = metrics.filter((m) => m.status === 'error').length;

  const agentStats = useMemo(() => computeAgentStats(metrics, agents), [metrics, agents]);

  const leaderboard = useMemo(() =>
    [...agentStats].sort((a, b) => b.successRate - a.successRate || b.runs - a.runs),
    [agentStats]
  );

  const agentTokenData = agentStats
    .filter((a) => a.totalTokens > 0)
    .map((a) => ({ label: a.name.split(' ')[0], value: a.totalTokens, color: a.color }));

  const agentLatencyData = agentStats
    .filter((a) => a.avgLatencyMs > 0)
    .map((a) => ({ label: a.name.split(' ')[0], value: a.avgLatencyMs, color: a.color }));

  const timeSeries = metrics.slice(-50).map((m, i) => ({
    x: `#${i + 1}`,
    y: m.latencyMs,
  }));

  const tokenTimeSeries = metrics.slice(-50).map((m, i) => ({
    x: `#${i + 1}`,
    y: m.tokensEstimated,
  }));

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" role="region" aria-label="Agent metrics dashboard">
      <div className="flex items-center gap-2 mb-2">
        <Activity size={18} className="text-[var(--accent)]" />
        <h2 className="text-sm font-semibold">A2A Observability Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <StatCard label="Total Runs" value={totalMetrics} icon={<Zap size={16} />} color="var(--accent)" />
        <StatCard label="Avg Latency" value={`${avgLatency}ms`} icon={<Clock size={16} />} color="#10b981" />
        <StatCard label="Success Rate" value={`${successRate}%`} icon={<Activity size={16} />} color="#f59e0b" />
        <StatCard label="Est. Tokens" value={totalTokens.toLocaleString()} icon={<TrendingUp size={16} />} color="#ef4444" />
      </div>

      {/* Agent Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4" role="region" aria-label="Agent leaderboard">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-yellow-400" />
            <h3 className="text-xs font-medium text-[var(--text-secondary)]">Agent Leaderboard</h3>
          </div>
          <div className="space-y-1.5">
            {leaderboard.map((a, i) => (
              <div key={a.id} className="flex items-center gap-2 text-xs">
                <span className={`w-5 text-center font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-[var(--text-muted)]'}`}>
                  {i + 1}
                </span>
                <span className="text-lg">{a.avatar}</span>
                <span className="flex-1 truncate">{a.name}</span>
                <span className="text-[var(--text-muted)] w-10 text-right">{a.runs} runs</span>
                <div className="w-16 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${a.successRate}%`, backgroundColor: a.successRate >= 80 ? '#10b981' : a.successRate >= 50 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <span className={`w-10 text-right font-medium ${a.successRate >= 80 ? 'text-green-400' : a.successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {a.successRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-agent latency bar chart */}
      {agentLatencyData.some((a) => a.value > 0) && (
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4" role="region" aria-label="Agent average latency bar chart">
          <h3 className="text-xs font-medium mb-2 text-[var(--text-secondary)]">Agent Average Latency (ms)</h3>
          <BarChart data={agentLatencyData} width={400} height={180} />
        </div>
      )}

      {/* Per-agent token usage bar chart */}
      {agentTokenData.some((a) => a.value > 0) && (
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4" role="region" aria-label="Agent token usage breakdown">
          <div className="flex items-center gap-2 mb-2">
            <PieChart size={14} className="text-[var(--text-secondary)]" />
            <h3 className="text-xs font-medium text-[var(--text-secondary)]">Total Token Usage by Agent</h3>
          </div>
          <BarChart data={agentTokenData} width={400} height={180} />
        </div>
      )}

      {/* Latency timeline */}
      {timeSeries.length > 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4" role="region" aria-label="Recent latency trend chart">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-[var(--text-secondary)]" />
            <h3 className="text-xs font-medium text-[var(--text-secondary)]">Latency Trend (last {timeSeries.length})</h3>
          </div>
          <LineChart
            data={[{ label: 'Latency', values: timeSeries, color: 'var(--accent)' }]}
            width={500}
            height={180}
          />
        </div>
      )}

      {/* Token usage trend */}
      {tokenTimeSeries.length > 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4" role="region" aria-label="Token usage trend chart">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-[var(--text-secondary)]" />
            <h3 className="text-xs font-medium text-[var(--text-secondary)]">Token Trend (last {tokenTimeSeries.length})</h3>
          </div>
          <LineChart
            data={[{ label: 'Tokens', values: tokenTimeSeries, color: '#f59e0b' }]}
            width={500}
            height={120}
          />
        </div>
      )}

      {/* Recent metrics table */}
      <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-4" role="region" aria-label="Recent runs table">
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
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${m.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {metrics.length === 0 && <p className="text-xs text-[var(--text-muted)] py-4 text-center">No metrics recorded yet. Run an A2A debate to populate.</p>}
      </div>
    </div>
  );
};
