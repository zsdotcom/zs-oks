import React, { useState, useCallback } from 'react';
import {
  fetchCDCDataset, CDC_DATASETS,
  fetchGHOIndicators, fetchGHOData, WHO_INDICATORS,
  fetchFluView, fetchCOVIDCast, COVIDCAST_SIGNALS,
  listPathogens, fetchPathogenData, fetchOutbreakAlerts,
  fetchWeatherData, fetchAirQuality,
} from '../services/publicApiService';
import { Search, Database, Globe, MapPin, Activity, BarChart, Cloud, Loader2, AlertTriangle, Target } from './icons/lucide-shim';

type ApiTab = 'cdc' | 'who' | 'delphi' | 'infectonet' | 'weather';

const TABS: { id: ApiTab; label: string; icon: React.ReactNode }[] = [
  { id: 'cdc', label: 'CDC Data', icon: <Database size={14} /> },
  { id: 'who', label: 'WHO GHO', icon: <Globe size={14} /> },
  { id: 'delphi', label: 'Delphi Epi', icon: <Activity size={14} /> },
  { id: 'infectonet', label: 'Pathogens', icon: <Target size={14} /> },
  { id: 'weather', label: 'Weather', icon: <Cloud size={14} /> },
];

function Loader() {
  return <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-[var(--accent)]" /></div>;
}

function ErrorMsg({ msg }: { msg: string }) {
  return <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 rounded p-3"><AlertTriangle size={14} /> {msg}</div>;
}

function JsonTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="text-xs text-[var(--text-muted)] py-4 text-center">No data returned</div>;
  const keys = Object.keys(data[0]).slice(0, 12);
  return (
    <div className="overflow-x-auto max-h-96 overflow-y-auto mt-2 border border-[var(--border)] rounded-lg">
      <table className="w-full text-[10px]">
        <thead className="sticky top-0 bg-[var(--bg-secondary)]">
          <tr>{keys.map((k) => <th key={k} className="text-left px-2 py-1.5 font-medium text-[var(--text-muted)] whitespace-nowrap border-b border-[var(--border)]">{k}</th>)}</tr>
        </thead>
        <tbody>
          {data.slice(0, 100).map((row, i) => (
            <tr key={i} className="hover:bg-[var(--bg-hover)]">
              {keys.map((k) => (
                <td key={k} className="px-2 py-1 border-b border-[var(--border)] text-[var(--text-primary)] max-w-[200px] truncate">
                  {typeof row[k] === 'object' ? JSON.stringify(row[k]).slice(0, 50) : String(row[k] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 100 && <div className="text-[9px] text-[var(--text-muted)] p-2 text-center border-t border-[var(--border)]">Showing 100 of {data.length} rows</div>}
    </div>
  );
}

export const PublicDataPanel: React.FC = () => {
  const [tab, setTab] = useState<ApiTab>('cdc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  // CDC
  const [cdcDataset, setCdcDataset] = useState(CDC_DATASETS[0].id);

  // WHO
  const [whoSearch, setWhoSearch] = useState('');
  const [whoIndicators, setWhoIndicators] = useState<any[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState('');

  // Delphi
  const [delphiSignal, setDelphiSignal] = useState(COVIDCAST_SIGNALS[0].id);
  const [delphiRegion, setDelphiRegion] = useState('nat');
  const [delphiMode, setDelphiMode] = useState<'flu' | 'covid'>('covid');

  // InfectoNET
  const [pathogen, setPathogen] = useState('dengue');
  const [pathogenData, setPathogenData] = useState<any[]>([]);
  const [pathogenView, setPathogenView] = useState<'list' | 'alerts'>('list');

  // Weather
  const [lat, setLat] = useState('40.7128');
  const [lon, setLon] = useState('-74.006');
  const [weather, setWeather] = useState<any>(null);
  const [aq, setAq] = useState<any>(null);

  const withLoading = useCallback(async (fn: () => Promise<void>) => {
    setLoading(true); setError(''); setResult(null);
    try { await fn(); } catch (e: any) { setError(e.message || 'Request failed'); }
    finally { setLoading(false); }
  }, []);

  const handleCDC = () => withLoading(async () => {
    const res = await fetchCDCDataset(cdcDataset, { limit: 50 });
    if (!res.success) { setError(res.error || 'CDC fetch failed'); return; }
    setResult(res.data);
  });

  const handleWHOSearch = () => withLoading(async () => {
    const res = await fetchGHOIndicators(whoSearch || undefined);
    if (!res.success) { setError(res.error || 'WHO search failed'); return; }
    setWhoIndicators(res.data || []);
  });

  const handleWHOData = (code: string) => withLoading(async () => {
    setSelectedIndicator(code);
    const res = await fetchGHOData(code);
    if (!res.success) { setError(res.error || 'WHO data fetch failed'); return; }
    setResult(res.data);
  });

  const handleDelphi = () => withLoading(async () => {
    if (delphiMode === 'flu') {
      const res = await fetchFluView(delphiRegion);
      if (!res.success) { setError(res.error || 'FluView fetch failed'); return; }
      setResult(res.data);
    } else {
      const res = await fetchCOVIDCast(delphiSignal);
      if (!res.success) { setError(res.error || 'COVIDCast fetch failed'); return; }
      setResult(res.data);
    }
  });

  const handlePathogenList = () => withLoading(async () => {
    setPathogenView('list');
    const res = await fetchPathogenData(pathogen);
    if (!res.success) { setError(res.error || 'Pathogen data fetch failed'); return; }
    setPathogenData(res.data || []);
  });

  const handleOutbreakAlerts = () => withLoading(async () => {
    setPathogenView('alerts');
    const res = await fetchOutbreakAlerts();
    if (!res.success) { setError(res.error || 'Outbreak alerts fetch failed'); return; }
    setResult(res.data);
  });

  const handleWeather = () => withLoading(async () => {
    const [wRes, aqRes] = await Promise.all([
      fetchWeatherData(parseFloat(lat), parseFloat(lon)),
      fetchAirQuality(parseFloat(lat), parseFloat(lon)),
    ]);
    if (!wRes.success) { setError(wRes.error || 'Weather fetch failed'); return; }
    setWeather(wRes.data);
    if (aqRes.success) setAq(aqRes.data);
  });

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-1 px-4 py-2 border-b shrink-0" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
        <Database size={16} style={{ color: 'var(--accent)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Public Data Explorer</span>
      </div>

      <div className="flex gap-0.5 px-3 pt-2 pb-1 shrink-0 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setError(''); setResult(null); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-t text-xs transition-colors border-b-2"
            style={{
              borderBottomColor: tab === t.id ? 'var(--accent)' : 'transparent',
              color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)',
              backgroundColor: tab === t.id ? 'var(--bg-primary)' : 'transparent',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {error && <ErrorMsg msg={error} />}

        {/* CDC Tab */}
        {tab === 'cdc' && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <select value={cdcDataset} onChange={(e) => setCdcDataset(e.target.value)} className="flex-1 rounded px-2 py-1.5 text-xs border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                {CDC_DATASETS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <button onClick={handleCDC} disabled={loading} className="px-3 py-1.5 rounded text-xs text-white disabled:opacity-50" style={{ backgroundColor: 'var(--accent)' }}>
                {loading ? <Loader2 size={12} className="animate-spin" /> : 'Fetch'}
              </button>
            </div>
            {CDC_DATASETS.find((d) => d.id === cdcDataset) && (
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{CDC_DATASETS.find((d) => d.id === cdcDataset)?.description}</p>
            )}
            {loading && <Loader />}
            {result && <JsonTable data={result} />}
          </div>
        )}

        {/* WHO Tab */}
        {tab === 'who' && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <input value={whoSearch} onChange={(e) => setWhoSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleWHOSearch()} placeholder="Search indicators..." className="flex-1 rounded px-2 py-1.5 text-xs border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              <button onClick={handleWHOSearch} disabled={loading} className="px-3 py-1.5 rounded text-xs text-white disabled:opacity-50 flex items-center gap-1" style={{ backgroundColor: 'var(--accent)' }}>
                <Search size={12} /> {loading ? '...' : 'Search'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto border rounded-lg p-1" style={{ borderColor: 'var(--border)' }}>
              {(whoIndicators.length > 0 ? whoIndicators : WHO_INDICATORS).slice(0, 50).map((ind: any) => (
                <button
                  key={ind.code || ind.IndicatorCode}
                  onClick={() => handleWHOData(ind.code || ind.IndicatorCode)}
                  className="text-left px-2 py-1 rounded text-[10px] hover:bg-[var(--bg-hover)] transition-colors"
                  style={{ color: selectedIndicator === (ind.code || ind.IndicatorCode) ? 'var(--accent)' : 'var(--text-primary)' }}
                >
                  <span className="font-mono opacity-70 mr-2">{ind.code || ind.IndicatorCode}</span>
                  {ind.name || ind.IndicatorName}
                </button>
              ))}
              {whoIndicators.length === 0 && <p className="text-[10px] p-2" style={{ color: 'var(--text-muted)' }}>Search above or click an indicator below to fetch data</p>}
            </div>

            {loading && <Loader />}
            {result && <JsonTable data={result} />}
          </div>
        )}

        {/* Delphi Tab */}
        {tab === 'delphi' && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <select value={delphiMode} onChange={(e) => setDelphiMode(e.target.value as any)} className="rounded px-2 py-1.5 text-xs border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <option value="covid">COVID-19</option>
                <option value="flu">FluView (ILI)</option>
              </select>
              {delphiMode === 'covid' ? (
                <select value={delphiSignal} onChange={(e) => setDelphiSignal(e.target.value)} className="flex-1 rounded px-2 py-1.5 text-xs border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  {COVIDCAST_SIGNALS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              ) : (
                <input value={delphiRegion} onChange={(e) => setDelphiRegion(e.target.value)} placeholder="Region (nat,hhs1-10,etc)" className="flex-1 rounded px-2 py-1.5 text-xs border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              )}
              <button onClick={handleDelphi} disabled={loading} className="px-3 py-1.5 rounded text-xs text-white disabled:opacity-50" style={{ backgroundColor: 'var(--accent)' }}>
                {loading ? <Loader2 size={12} className="animate-spin" /> : 'Fetch'}
              </button>
            </div>
            {delphiMode === 'covid' && <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{COVIDCAST_SIGNALS.find((s) => s.id === delphiSignal)?.description}</p>}
            {loading && <Loader />}
            {result && <JsonTable data={result} />}
          </div>
        )}

        {/* InfectoNET Tab */}
        {tab === 'infectonet' && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <select value={pathogen} onChange={(e) => setPathogen(e.target.value)} className="flex-1 rounded px-2 py-1.5 text-xs border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                {['dengue', 'ebola', 'SARS-CoV-2', 'influenza', 'mpox', 'zika', 'chikungunya', 'hantavirus', 'marburg', 'lassa', 'nipah', 'measles', 'west-nile', 'avian-influenza', 'norovirus'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <button onClick={handlePathogenList} disabled={loading} className="px-3 py-1.5 rounded text-xs text-white disabled:opacity-50 flex items-center gap-1" style={{ backgroundColor: 'var(--accent)' }}>
                <BarChart size={12} /> Sequences
              </button>
              <button onClick={handleOutbreakAlerts} disabled={loading} className="px-3 py-1.5 rounded text-xs text-white disabled:opacity-50 flex items-center gap-1" style={{ backgroundColor: 'var(--accent-dark)' }}>
                <AlertTriangle size={12} /> Alerts
              </button>
            </div>

            {loading && <Loader />}

            {pathogenView === 'list' && pathogenData.length > 0 && (
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {pathogenData.slice(0, 50).map((item: any, i: number) => (
                  <div key={i} className="rounded-lg p-2 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{item.strain || item.name || `Sample ${i + 1}`}</div>
                    <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      {item.country && <span className="mr-2">📍 {item.country}</span>}
                      {item.date && <span>📅 {item.date}</span>}
                      {item.genotype && <span className="ml-2">🧬 {item.genotype}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pathogenView === 'alerts' && result && <JsonTable data={result} />}
            {pathogenView === 'list' && pathogenData.length === 0 && !loading && (
              <div className="text-xs py-4 text-center" style={{ color: 'var(--text-muted)' }}>Click "Sequences" to fetch pathogen data</div>
            )}
          </div>
        )}

        {/* Weather Tab */}
        {tab === 'weather' && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1">
                <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" className="w-20 rounded px-2 py-1.5 text-xs border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <input value={lon} onChange={(e) => setLon(e.target.value)} placeholder="Longitude" className="w-20 rounded px-2 py-1.5 text-xs border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              <button onClick={handleWeather} disabled={loading} className="px-3 py-1.5 rounded text-xs text-white disabled:opacity-50 flex items-center gap-1" style={{ backgroundColor: 'var(--accent)' }}>
                <Cloud size={12} /> Fetch
              </button>
            </div>

            {loading && <Loader />}

            {weather && (
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg p-3 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Weather</div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{weather.temperature}°C</div>
                  <div className="mt-2 space-y-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex justify-between"><span>Precipitation</span><span>{weather.precipitation} mm</span></div>
                    <div className="flex justify-between"><span>Humidity</span><span>{weather.humidity}%</span></div>
                    <div className="flex justify-between"><span>Wind</span><span>{weather.windSpeed} km/h</span></div>
                  </div>
                </div>
                {aq && (
                  <div className="rounded-lg p-3 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Air Quality</div>
                    <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>AQI: {aq.current?.us_aqi || aq.current?.european_aqi || 'N/A'}</div>
                    <div className="mt-2 space-y-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex justify-between"><span>PM2.5</span><span>{aq.current?.pm2_5 ?? 'N/A'} µg/m³</span></div>
                      <div className="flex justify-between"><span>PM10</span><span>{aq.current?.pm10 ?? 'N/A'} µg/m³</span></div>
                      <div className="flex justify-between"><span>NO₂</span><span>{aq.current?.nitrogen_dioxide ?? 'N/A'} µg/m³</span></div>
                      <div className="flex justify-between"><span>O₃</span><span>{aq.current?.ozone ?? 'N/A'} µg/m³</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!weather && !loading && (
              <div className="text-xs py-4 text-center" style={{ color: 'var(--text-muted)' }}>Enter coordinates and click Fetch</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
