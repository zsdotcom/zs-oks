import type { EpiDataPoint } from '../components/EpiMap';

const SEED_DATA: EpiDataPoint[] = [
  { id: 'epi-1', lat: -1.286, lng: 36.817, label: 'Nairobi', disease: 'Malaria', cases: 1240, severity: 'high', date: '2026-06-15', status: 'active' },
  { id: 'epi-2', lat: 6.524, lng: 3.379, label: 'Lagos', disease: 'Dengue fever', cases: 890, severity: 'medium', date: '2026-06-14', status: 'active' },
  { id: 'epi-3', lat: 28.613, lng: 77.209, label: 'Delhi', disease: 'COVID-19', cases: 3200, severity: 'critical', date: '2026-06-15', status: 'active' },
  { id: 'epi-4', lat: -23.550, lng: -46.633, label: 'São Paulo', disease: 'Dengue fever', cases: 2100, severity: 'high', date: '2026-06-14', status: 'active' },
  { id: 'epi-5', lat: 40.712, lng: -74.006, label: 'New York', disease: 'Influenza', cases: 560, severity: 'low', date: '2026-06-10', status: 'contained' },
  { id: 'epi-6', lat: 48.856, lng: 2.352, label: 'Paris', disease: 'Measles', cases: 340, severity: 'medium', date: '2026-06-08', status: 'contained' },
  { id: 'epi-7', lat: 35.676, lng: 139.650, label: 'Tokyo', disease: 'COVID-19', cases: 780, severity: 'medium', date: '2026-06-07', status: 'active' },
  { id: 'epi-8', lat: -33.868, lng: 151.209, label: 'Sydney', disease: 'Influenza', cases: 190, severity: 'low', date: '2026-06-05', status: 'resolved' },
];

async function fetchCDCData(): Promise<EpiDataPoint[]> {
  try {
    const res = await fetch('https://data.cdc.gov/resource/hc4f-j6nb.json?$limit=20');
    if (!res.ok) throw new Error(`CDC API error: ${res.status}`);
    const data = await res.json();
    return data.map((item: any, i: number) => ({
      id: `cdc-${i}`,
      lat: parseFloat(item.latitude) || 0,
      lng: parseFloat(item.longitude) || 0,
      label: item.location_name || item.state || 'Unknown',
      disease: item.disease || 'Notifiable disease',
      cases: parseInt(item.count) || parseInt(item.cases) || Math.round(Math.random() * 500),
      severity: (item.severity as EpiDataPoint['severity']) || 'medium',
      date: item.report_date || item.week_ending_date || new Date().toISOString().slice(0, 10),
      status: 'active' as const,
    })).filter((p: EpiDataPoint) => p.lat && p.lng);
  } catch { return []; }
}

async function fetchDelphiData(): Promise<EpiDataPoint[]> {
  try {
    const res = await fetch('https://delphi.cmu.edu/epidata/api.php?source=fluview&regions=nat&epiweeks=202410');
    if (!res.ok) throw new Error(`Delphi API error: ${res.status}`);
    const data = await res.json();
    if (data.epidata?.length > 0) {
      return data.epidata.slice(0, 10).map((item: any, i: number) => ({
        id: `delphi-${i}`,
        lat: 39.828, lng: -98.579,
        label: item.region || 'US National',
        disease: 'Influenza-like Illness',
        cases: item.la?.[0] || Math.round(Math.random() * 500),
        severity: (item.la?.[0] || 0) > 5 ? 'high' : (item.la?.[0] || 0) > 2 ? 'medium' : 'low',
        date: item.epiweek ? `${item.epiweek.toString().slice(0, 4)}-W${item.epiweek.toString().slice(4)}` : new Date().toISOString().slice(0, 10),
        status: 'active' as const,
      }));
    }
  } catch { /* fall through */ }
  return [];
}

export async function fetchEpiData(): Promise<EpiDataPoint[]> {
  const [cdcData, delphiData] = await Promise.all([
    fetchCDCData(),
    fetchDelphiData(),
  ]);
  const apiData = [...cdcData, ...delphiData];
  if (apiData.length > 0) return apiData;
  return SEED_DATA;
}
