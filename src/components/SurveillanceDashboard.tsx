import React, { useState, useEffect, useCallback } from 'react';
import type { EpiDataPoint } from './EpiMap';
import type { SurveillanceFeed, SurveillanceSummary } from '../services/surveillanceService';
import type { OutbreakAlert, OutbreakStats } from '../services/outbreakService';
import { computeSurveillanceSummary } from '../services/surveillanceService';
import { detectOutbreaks, computeOutbreakStats } from '../services/outbreakService';
import { Activity, AlertTriangle, Zap, Globe, RefreshCw, Loader2, BarChart, MapPin } from './icons/lucide-shim';

interface Props {
  dataPoints: EpiDataPoint[];
  onDataRefresh?: (data: EpiDataPoint[]) => void;
}

export const SurveillanceDashboard: React.FC<Props> = ({ dataPoints, onDataRefresh }) => {
  const [summary, setSummary] = useState<SurveillanceSummary | null>(null);
  const [feeds, setFeeds] = useState<SurveillanceFeed[]>([]);
  const [alerts, setAlerts] = useState<OutbreakAlert[]>([]);
  const [stats, setStats] = useState<OutbreakStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const { getSurveillanceData, getSurveillanceFeeds, computeSurveillanceSummary } = await import('../services/surveillanceService');
      const { detectOutbreaks, computeOutbreakStats } = await import('../services/outbreakService');

      const freshData = await getSurveillanceData(true);
      onDataRefresh?.(freshData);

      const freshSummary = computeSurveillanceSummary(freshData);
      setSummary(freshSummary);

      const freshFeeds = getSurveillanceFeeds();
      setFeeds(freshFeeds);

      const freshAlerts = detectOutbreaks(freshData);
      setAlerts(freshAlerts);
      setStats(computeOutbreakStats(freshAlerts));
    } catch { /* silently fail */ }
    setRefreshing(false);
  }, [onDataRefresh]);

  useEffect(() => {
    if (dataPoints.length > 0) {
      setSummary(computeSurveillanceSummary(dataPoints));
      const freshAlerts = detectOutbreaks(dataPoints);
      setAlerts(freshAlerts);
      setStats(computeOutbreakStats(freshAlerts));
    }
  }, [dataPoints]);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(refresh, 300000);
    return () => clearInterval(timer);
  }, [autoRefresh, refresh]);

  return (
    <div className="p-3 space-y-4" role="region" aria-label="Surveillance Dashboard">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[var(--accent)]" />
          <h2 className="text-xs font-semibold">Surveillance Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] cursor-pointer">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="w-3 h-3" />
            Auto-refresh
          </label>
          <button onClick={refresh} disabled={refreshing} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]" title="Refresh now">
            {refreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-[var(--bg-primary)] rounded border border-[var(--border)] p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mb-1"><BarChart size={12} />Total Cases</div>
          <span className="text-lg font-semibold">{summary?.totalCases.toLocaleString() || '—'}</span>
        </div>
        <div className="bg-[var(--bg-primary)] rounded border border-[var(--border)] p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mb-1"><AlertTriangle size={12} />Active Outbreaks</div>
          <span className="text-lg font-semibold text-yellow-400">{stats?.totalAlerts ?? '—'}</span>
        </div>
        <div className="bg-[var(--bg-primary)] rounded border border-[var(--border)] p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mb-1"><Globe size={12} />Diseases</div>
          <span className="text-lg font-semibold">{summary?.diseasesTracked || '—'}</span>
        </div>
        <div className="bg-[var(--bg-primary)] rounded border border-[var(--border)] p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mb-1"><MapPin size={12} />Regions</div>
          <span className="text-lg font-semibold">{summary?.regionsMonitored || '—'}</span>
        </div>
      </div>

      {/* Critical alerts */}
      {stats && stats.criticalAlerts > 0 && (
        <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium mb-1">
            <AlertTriangle size={12} />
            {stats.criticalAlerts} Critical Alert{stats.criticalAlerts > 1 ? 's' : ''} — Immediate Attention Required
          </div>
          <div className="text-[10px] text-red-300/70">Trend: {stats.trend} · {stats.highAlerts} high alerts</div>
        </div>
      )}

      {/* Outbreak alerts list */}
      {alerts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} className="text-[var(--text-muted)]" />
            <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Detected Signals</span>
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {alerts.slice(0, 10).map((alert) => (
              <div key={alert.id} className="flex items-start gap-2 p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                  alert.severity === 'critical' ? 'bg-red-500' :
                  alert.severity === 'high' ? 'bg-orange-400' :
                  alert.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{alert.disease}</span>
                    <span className="text-[var(--text-muted)]">at {alert.location}</span>
                    <span className={`text-[9px] px-1 py-0.5 rounded ${
                      alert.trend === 'rising' ? 'bg-red-500/20 text-red-400' :
                      alert.trend === 'falling' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {alert.trend}
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {alert.cases} cases · baseline {alert.baseline} · anomaly {alert.anomalyScore}x
                  </div>
                  <div className="text-[9px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">{alert.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top diseases */}
      {stats && stats.topDiseases.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart size={12} className="text-[var(--text-muted)]" />
            <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Top Diseases by Case Count</span>
          </div>
          <div className="space-y-1">
            {stats.topDiseases.map((d) => (
              <div key={d.disease} className="flex items-center gap-2 px-2 py-1 text-xs">
                <span className="flex-1 truncate">{d.disease}</span>
                <span className="font-medium">{d.cases.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feeds status */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw size={12} className="text-[var(--text-muted)]" />
          <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Data Feeds</span>
        </div>
        <div className="space-y-1">
          {feeds.map((feed) => (
            <div key={feed.id} className="flex items-center gap-2 px-2 py-1 text-[10px]">
              <div className={`w-1.5 h-1.5 rounded-full ${feed.lastUpdated ? 'bg-green-400' : 'bg-gray-500'}`} />
              <span className="flex-1">{feed.name}</span>
              <span className="text-[var(--text-muted)]">{feed.dataPoints} points</span>
              <span className="text-[var(--text-muted)]">{feed.lastUpdated ? new Date(feed.lastUpdated).toLocaleTimeString() : 'never'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
