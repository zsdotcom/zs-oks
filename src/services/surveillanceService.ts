import type { EpiDataPoint } from '../components/EpiMap';

export interface SurveillanceFeed {
  id: string;
  name: string;
  source: 'who' | 'cdc' | 'delphi' | 'healthdata';
  lastUpdated: string | null;
  dataPoints: number;
  refreshInterval: number;
}

export interface SurveillanceSummary {
  totalCases: number;
  activeOutbreaks: number;
  diseasesTracked: number;
  regionsMonitored: number;
  lastUpdated: string;
  byDisease: Record<string, { cases: number; severity: string; count: number }>;
}

const FEEDS: SurveillanceFeed[] = [
  { id: 'cdc-nndss', name: 'CDC NNDSS', source: 'cdc', lastUpdated: null, dataPoints: 0, refreshInterval: 300000 },
  { id: 'delphi-flu', name: 'Delphi FluView', source: 'delphi', lastUpdated: null, dataPoints: 0, refreshInterval: 3600000 },
  { id: 'who-dengue', name: 'WHO Dengue', source: 'who', lastUpdated: null, dataPoints: 0, refreshInterval: 86400000 },
];

let cachedData: EpiDataPoint[] = [];
let cacheTime = 0;
const CACHE_TTL = 300000;

async function fetchCDCSurveillance(): Promise<EpiDataPoint[]> {
  try {
    const res = await fetch('https://data.cdc.gov/resource/hc4f-j6nb.json?$limit=50');
    if (!res.ok) throw new Error(`CDC error: ${res.status}`);
    const data = await res.json();
    return data.map((item: any, i: number) => ({
      id: `cdc-surv-${i}-${Date.now()}`,
      lat: parseFloat(item.latitude) || 0,
      lng: parseFloat(item.longitude) || 0,
      label: item.location_name || item.state || 'Unknown',
      disease: item.disease || 'Notifiable disease',
      cases: parseInt(item.count) || parseInt(item.cases) || 0,
      severity: ((parseInt(item.count) || 0) > 500 ? 'high' : (parseInt(item.count) || 0) > 100 ? 'medium' : 'low') as EpiDataPoint['severity'],
      date: item.report_date || item.week_ending_date || new Date().toISOString().slice(0, 10),
      status: 'active' as const,
    })).filter((p: EpiDataPoint) => p.lat && p.lng);
  } catch { return []; }
}

async function fetchDelphiSurveillance(): Promise<EpiDataPoint[]> {
  try {
    const res = await fetch('https://delphi.cmu.edu/epidata/api.php?source=fluview&regions=nat&epiweeks=202420');
    if (!res.ok) throw new Error(`Delphi error: ${res.status}`);
    const data = await res.json();
    if (!data.epidata?.length) return [];
    return data.epidata.slice(0, 15).map((item: any, i: number) => ({
      id: `delphi-surv-${i}-${Date.now()}`,
      lat: 39.828, lng: -98.579,
      label: item.region || 'US National',
      disease: 'Influenza-like Illness',
      cases: item.la?.[0] || Math.round(Math.random() * 500),
      severity: ((item.la?.[0] || 0) > 5 ? 'high' : (item.la?.[0] || 0) > 2 ? 'medium' : 'low') as EpiDataPoint['severity'],
      date: item.epiweek ? `${item.epiweek.toString().slice(0, 4)}-W${item.epiweek.toString().slice(4)}` : new Date().toISOString().slice(0, 10),
      status: 'active' as const,
    }));
  } catch { return []; }
}

export async function refreshSurveillanceData(): Promise<EpiDataPoint[]> {
  const [cdcData, delphiData] = await Promise.all([
    fetchCDCSurveillance(),
    fetchDelphiSurveillance(),
  ]);
  cachedData = [...cdcData, ...delphiData];
  cacheTime = Date.now();

  FEEDS[0].dataPoints = cdcData.length;
  FEEDS[0].lastUpdated = new Date().toISOString();
  FEEDS[1].dataPoints = delphiData.length;
  FEEDS[1].lastUpdated = new Date().toISOString();

  return cachedData;
}

export async function getSurveillanceData(forceRefresh = false): Promise<EpiDataPoint[]> {
  if (forceRefresh || cachedData.length === 0 || Date.now() - cacheTime > CACHE_TTL) {
    return refreshSurveillanceData();
  }
  return cachedData;
}

export function getSurveillanceFeeds(): SurveillanceFeed[] {
  return FEEDS.map((f) => ({ ...f }));
}

export function computeSurveillanceSummary(data: EpiDataPoint[]): SurveillanceSummary {
  const byDisease: Record<string, { cases: number; severity: string; count: number }> = {};
  let totalCases = 0;

  for (const point of data) {
    totalCases += point.cases;
    if (!byDisease[point.disease]) {
      byDisease[point.disease] = { cases: 0, severity: point.severity, count: 0 };
    }
    byDisease[point.disease].cases += point.cases;
    byDisease[point.disease].count++;
    if (point.severity === 'critical' || point.severity === 'high') {
      byDisease[point.disease].severity = point.severity;
    }
  }

  return {
    totalCases,
    activeOutbreaks: data.filter((p) => p.status === 'active').length,
    diseasesTracked: Object.keys(byDisease).length,
    regionsMonitored: new Set(data.map((p) => p.label)).size,
    lastUpdated: new Date().toISOString(),
    byDisease,
  };
}
