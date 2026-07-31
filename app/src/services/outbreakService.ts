import type { EpiDataPoint } from '../components/EpiMap';

export interface OutbreakAlert {
  id: string;
  disease: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cases: number;
  baseline: number;
  anomalyScore: number;
  trend: 'rising' | 'falling' | 'stable';
  detectedAt: string;
  recommendation: string;
}

export interface OutbreakStats {
  totalAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  topDiseases: { disease: string; cases: number }[];
  trend: 'increasing' | 'decreasing' | 'stable';
}

function computeBaseline(disease: string, allData: EpiDataPoint[]): number {
  const sameDisease = allData.filter((p) => p.disease === disease);
  if (sameDisease.length === 0) return 0;
  const avg = sameDisease.reduce((s, p) => s + p.cases, 0) / sameDisease.length;
  return Math.max(avg, 1);
}

function detectTrend(recent: EpiDataPoint[], older: EpiDataPoint[]): 'rising' | 'falling' | 'stable' {
  const recentAvg = recent.length > 0 ? recent.reduce((s, p) => s + p.cases, 0) / recent.length : 0;
  const olderAvg = older.length > 0 ? older.reduce((s, p) => s + p.cases, 0) / older.length : 0;
  if (recentAvg > olderAvg * 1.3) return 'rising';
  if (recentAvg < olderAvg * 0.7) return 'falling';
  return 'stable';
}

export function detectOutbreaks(data: EpiDataPoint[]): OutbreakAlert[] {
  const alerts: OutbreakAlert[] = [];
  const now = Date.now();
  const recentThreshold = now - 7 * 86400000;

  const recent = data.filter((p) => new Date(p.date).getTime() > recentThreshold);
  const older = data.filter((p) => new Date(p.date).getTime() <= recentThreshold);

  const byLocation = new Map<string, EpiDataPoint[]>();
  for (const point of recent) {
    const key = `${point.disease}::${point.label}`;
    if (!byLocation.has(key)) byLocation.set(key, []);
    byLocation.get(key)!.push(point);
  }

  for (const [key, points] of byLocation) {
    const [disease, location] = key.split('::');
    const totalCases = points.reduce((s, p) => s + p.cases, 0);
    const baseline = computeBaseline(disease, older.length > 0 ? older : data);
    const anomalyScore = baseline > 0 ? totalCases / baseline : totalCases > 0 ? 1.5 : 0;

    if (anomalyScore < 1.2) continue;

    const trend = detectTrend(recent, older.length > 0 ? older : data);
    const severity: OutbreakAlert['severity'] =
      anomalyScore > 3 ? 'critical' :
      anomalyScore > 2 ? 'high' :
      anomalyScore > 1.5 ? 'medium' : 'low';

    const recommendations: Record<string, string> = {
      critical: 'Immediate investigation and public health response required. Notify health authorities.',
      high: 'Enhanced surveillance and targeted response recommended. Consider mass testing.',
      medium: 'Monitor closely. Increase reporting frequency. Prepare response resources.',
      low: 'Standard surveillance vigilance. Track for any escalation.',
    };

    alerts.push({
      id: `outbreak-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      disease,
      location,
      severity,
      cases: totalCases,
      baseline: Math.round(baseline),
      anomalyScore: Math.round(anomalyScore * 100) / 100,
      trend,
      detectedAt: new Date().toISOString(),
      recommendation: recommendations[severity],
    });
  }

  return alerts.sort((a, b) => b.anomalyScore - a.anomalyScore);
}

export function computeOutbreakStats(alerts: OutbreakAlert[]): OutbreakStats {
  const diseaseCases = new Map<string, number>();
  for (const a of alerts) {
    diseaseCases.set(a.disease, (diseaseCases.get(a.disease) || 0) + a.cases);
  }
  const topDiseases = Array.from(diseaseCases.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([disease, cases]) => ({ disease, cases }));

  const risingCount = alerts.filter((a) => a.trend === 'rising').length;
  const fallingCount = alerts.filter((a) => a.trend === 'falling').length;

  return {
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter((a) => a.severity === 'critical').length,
    highAlerts: alerts.filter((a) => a.severity === 'high').length,
    mediumAlerts: alerts.filter((a) => a.severity === 'medium').length,
    topDiseases,
    trend: risingCount > fallingCount ? 'increasing' : fallingCount > risingCount ? 'decreasing' : 'stable',
  };
}
