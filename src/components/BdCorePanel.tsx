import React, { useState, useEffect, useRef } from 'react';
import { X, Search, MapPin, FlaskConical, ShieldCheck } from './icons/lucide-shim';
import { oclValidateCode, oclLookup, validateICD11Cluster, type OCLValidateCodeResult, type OCLLookupResult, type ClusterValidationResult } from '../services/bdTerminologyService';
import { getAllDivisions, getDistrictsByDivision, getUpazilasByDistrict, searchGeography, type BDDivision, type BDDistrict, type BDGeoEntry } from '../services/bdGeographyService';
import { getAllVaccines, getEpiSchedule, searchVaccines, type BDVaccineEntry as VaccineEntry } from '../services/bdVaccineService';
import { searchDrugs, getDrugClasses, getDrugsByClass, type DrugEntry } from '../services/bdDrugRegistryService';

type BdTab = 'terminology' | 'geography' | 'vaccines' | 'drugs';

const TAB_LABELS: Record<BdTab, string> = {
  terminology: 'OCL Terminology',
  geography: 'BD Geography',
  vaccines: 'BD Vaccines',
  drugs: 'DGDA Drugs',
};

interface BdCorePanelProps {
  onClose?: () => void;
}

export const BdCorePanel: React.FC<BdCorePanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<BdTab>('terminology');

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] shrink-0">
        <h2 className="text-xs font-semibold flex items-center gap-1.5">
          <FlaskConical size={12} className="text-[var(--accent)]" />
          BD Core FHIR IG
        </h2>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]">
            <X size={12} />
          </button>
        )}
      </div>

      <div className="flex border-b border-[var(--border)] shrink-0">
        {(Object.keys(TAB_LABELS) as BdTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-[10px] py-1.5 font-medium transition-colors ${
              activeTab === tab
                ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'terminology' && <OclTerminologyTab />}
        {activeTab === 'geography' && <GeographyTab />}
        {activeTab === 'vaccines' && <VaccinesTab />}
        {activeTab === 'drugs' && <DrugsTab />}
      </div>
    </div>
  );
};

function OclTerminologyTab() {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'validate' | 'lookup' | 'cluster'>('validate');
  const [result, setResult] = useState<OCLValidateCodeResult | OCLLookupResult | ClusterValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      if (mode === 'validate') {
        const r = await oclValidateCode(code.trim());
        setResult(r);
      } else if (mode === 'lookup') {
        const r = await oclLookup(code.trim());
        setResult(r);
      } else {
        const r = await validateICD11Cluster(code.trim());
        setResult(r);
      }
    } catch {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 space-y-2">
      <div className="flex gap-1">
        {(['validate', 'lookup', 'cluster'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); }}
            className={`text-[10px] px-2 py-1 rounded font-medium transition-colors ${
              mode === m ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {m === 'validate' ? '$validate-code' : m === 'lookup' ? '$lookup' : 'Cluster'}
          </button>
        ))}
      </div>

      <div className="flex gap-1">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={mode === 'cluster' ? 'e.g. NC72.Z&XK8G&XJ7ZH' : 'e.g. 1A00'}
          className="flex-1 px-2 py-1.5 text-xs bg-[var(--bg-primary)] border border-[var(--border)] rounded text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/50"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-2 py-1.5 text-xs bg-[var(--accent)] text-white rounded hover:opacity-80 disabled:opacity-50"
        >
          {loading ? '...' : <Search size={12} />}
        </button>
      </div>

      {mode !== 'cluster' && (
        <p className="text-[10px] text-[var(--text-muted)]">System: <code className="text-[var(--accent)]">http://id.who.int/icd/release/11/mms</code></p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {result && mode !== 'cluster' && (
        <div className="bg-[var(--bg-primary)] rounded border border-[var(--border)] p-2 space-y-1">
          {'valid' in result ? (
            <>
              <div className={`text-[10px] font-medium ${result.valid ? 'text-green-500' : 'text-red-500'}`}>
                {result.valid ? 'Valid' : 'Invalid'}
              </div>
              {(result as OCLValidateCodeResult).display && (
                <p className="text-xs text-[var(--text-primary)]">{(result as OCLValidateCodeResult).display}</p>
              )}
              {(result as OCLValidateCodeResult).message && (
                <p className="text-[10px] text-[var(--text-muted)]">{(result as OCLValidateCodeResult).message}</p>
              )}
            </>
          ) : (
            <>
              <div className={`text-[10px] font-medium ${(result as OCLLookupResult).found ? 'text-green-500' : 'text-red-500'}`}>
                {(result as OCLLookupResult).found ? 'Found' : 'Not found'}
              </div>
              {(result as OCLLookupResult).display && (
                <p className="text-xs text-[var(--text-primary)]">{(result as OCLLookupResult).display}</p>
              )}
              {(result as OCLLookupResult).properties && Object.entries((result as OCLLookupResult).properties!).map(([k, v]) => (
                <div key={k} className="text-[10px] text-[var(--text-muted)]">
                  <span className="font-medium">{k}:</span> {v.join(', ')}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {result && mode === 'cluster' && (
        <div className="bg-[var(--bg-primary)] rounded border border-[var(--border)] p-2 space-y-1">
          <div className={`text-[10px] font-medium ${(result as ClusterValidationResult).valid ? 'text-green-500' : 'text-red-500'}`}>
            {(result as ClusterValidationResult).valid ? 'Valid cluster' : 'Invalid cluster'}
          </div>
          {(result as ClusterValidationResult).stem.code && (
            <p className="text-xs text-[var(--text-primary)]">
              Stem: <span className="font-mono">{(result as ClusterValidationResult).stem.code}</span>
              {(result as ClusterValidationResult).stem.display && ` — ${(result as ClusterValidationResult).stem.display}`}
            </p>
          )}
          {(result as ClusterValidationResult).satellites.length > 0 && (
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-[var(--text-muted)]">Satellites:</p>
              {(result as ClusterValidationResult).satellites.map((s, i) => (
                <div key={i} className="text-[10px] flex items-center gap-1">
                  <span className={`${s.valid ? 'text-green-500' : 'text-red-500'}`}>{s.valid ? 'OK' : 'XX'}</span>
                  <span className="font-mono text-[var(--accent)]">{s.code}</span>
                  <span className="text-[var(--text-muted)]">({s.axis})</span>
                </div>
              ))}
            </div>
          )}
          {(result as ClusterValidationResult).errors.length > 0 && (
            <div className="text-[10px] text-red-500">
              {(result as ClusterValidationResult).errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GeographyTab() {
  const [selectedDivision, setSelectedDivision] = useState<BDDivision | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<BDDistrict | null>(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BDGeoEntry[]>([]);
  const [showMap, setShowMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const divisions = getAllDivisions();
  const districts = selectedDivision ? getDistrictsByDivision(selectedDivision.code) : [];
  const upazilas = selectedDistrict ? getUpazilasByDistrict(selectedDistrict.code) : [];

  const clearMarkers = () => {
    markersRef.current.forEach((m: any) => mapInstanceRef.current?.removeLayer(m));
    markersRef.current = [];
  };

  const flyToCoord = (lat: number, lng: number, zoom: number) => {
    if (mapInstanceRef.current) mapInstanceRef.current.flyTo([lat, lng], zoom);
  };

  const addDivisionMarkers = () => {
    clearMarkers();
    import('../services/bdGeoMapData').then(({ getDivisionCoord }) => {
      divisions.forEach((div) => {
        const coord = getDivisionCoord(div.code);
        const marker = L.circleMarker([coord.lat, coord.lng], {
          radius: 14, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.3, weight: 2,
        }).addTo(mapInstanceRef.current!);
        marker.bindPopup(`<b>${div.name}</b><br/>${getDistrictsByDivision(div.code).length} districts`);
        marker.on('click', () => handleSelectDivision(div));
        markersRef.current.push(marker);
      });
    });
  };

  const addDistrictMarkers = (div: BDDivision) => {
    clearMarkers();
    import('../services/bdGeoMapData').then(({ getDistrictCoord }) => {
      districts.forEach((dist) => {
        const coord = getDistrictCoord(dist.code);
        const marker = L.circleMarker([coord.lat, coord.lng], {
          radius: 10, color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.3, weight: 1.5,
        }).addTo(mapInstanceRef.current!);
        marker.bindPopup(`<b>${dist.name}</b><br/>${getUpazilasByDistrict(dist.code).length} upazilas`);
        marker.on('click', () => { setSelectedDistrict(dist); flyToCoord(coord.lat, coord.lng, 10); });
        markersRef.current.push(marker);
      });
    });
  };

  useEffect(() => {
    if (!showMap || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;
    mapInstanceRef.current = L.map(mapContainerRef.current, {
      center: [23.6850, 90.3563], zoom: 7, zoomControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap', maxZoom: 18,
    }).addTo(mapInstanceRef.current);
    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
  }, [showMap]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (!selectedDivision && !selectedDistrict) {
      mapInstanceRef.current.setView([23.6850, 90.3563], 7);
      addDivisionMarkers();
    } else if (selectedDivision && !selectedDistrict) {
      import('../services/bdGeoMapData').then(({ getDivisionCoord }) => {
        const coord = getDivisionCoord(selectedDivision.code);
        flyToCoord(coord.lat, coord.lng, 8);
        addDistrictMarkers(selectedDivision);
      });
    }
  }, [selectedDivision, selectedDistrict]);

  useEffect(() => {
    if (selectedDistrict && mapInstanceRef.current) {
      import('../services/bdGeoMapData').then(({ getDistrictCoord }) => {
        const coord = getDistrictCoord(selectedDistrict.code);
        flyToCoord(coord.lat, coord.lng, 10);
        clearMarkers();
        const marker = L.circleMarker([coord.lat, coord.lng], {
          radius: 12, color: '#f97316', fillColor: '#f97316', fillOpacity: 0.4, weight: 2,
        }).addTo(mapInstanceRef.current!);
        marker.bindPopup(`<b>${selectedDistrict.name}</b>`).openPopup();
        markersRef.current.push(marker);
      });
    }
  }, [selectedDistrict]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) { setSearchResults([]); return; }
    setSearchResults(searchGeography(value));
  };

  const handleSelectDivision = (div: BDDivision) => {
    setSelectedDivision(div);
    setSelectedDistrict(null);
    setQuery('');
    setSearchResults([]);
  };

  const handleSelectDistrict = (dist: BDDistrict) => {
    setSelectedDistrict(dist);
    setQuery('');
    setSearchResults([]);
  };

  const clear = () => {
    setSelectedDivision(null);
    setSelectedDistrict(null);
    setQuery('');
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-2 py-1 border-b border-[var(--border)]">
        <button
          onClick={() => setShowMap(!showMap)}
          className={`text-[10px] px-2 py-1 rounded font-medium ${showMap ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`${showMap ? 'w-1/2' : 'w-full'} overflow-y-auto p-2 space-y-2`}>
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search divisions, districts..."
              className="w-full pl-7 pr-7 py-1.5 text-xs bg-[var(--bg-primary)] border border-[var(--border)] rounded text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/50"
            />
            {query && (
              <button onClick={clear} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X size={12} />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="divide-y divide-[var(--border)]/50">
              {searchResults.map((entry) => (
                <button
                  key={entry.code}
                  onClick={() => {
                    if (entry.level === 'division') {
                      handleSelectDivision(entry as BDDivision);
                    } else if (entry.level === 'district') {
                      const dist = entry as BDDistrict;
                      const div = divisions.find(d => d.code === dist.divisionCode);
                      if (div) setSelectedDivision(div);
                      setSelectedDistrict(dist);
                    }
                    setQuery('');
                    setSearchResults([]);
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs hover:bg-[var(--bg-hover)] transition-colors border-b border-[var(--border)]/50 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[var(--accent)] text-[10px]">{entry.code}</span>
                    <span className="text-[var(--text-primary)]">{entry.name}</span>
                    <span className="ml-auto text-[10px] text-[var(--text-muted)]">{entry.level}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!query && searchResults.length === 0 && (
            <>
              {selectedDistrict && (
                <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                  <button onClick={() => { setSelectedDistrict(null); }} className="text-[var(--accent)] hover:underline">{selectedDivision?.name}</button>
                  <span>/</span>
                  <span className="text-[var(--text-primary)] font-medium">{selectedDistrict.name}</span>
                  {upazilas.length > 0 && <span className="ml-auto">{upazilas.length} upazilas</span>}
                </div>
              )}

              {selectedDivision && !selectedDistrict && (
                <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                  <button onClick={() => setSelectedDivision(null)} className="text-[var(--accent)] hover:underline">All divisions</button>
                  <span>/</span>
                  <span className="text-[var(--text-primary)] font-medium">{selectedDivision.name}</span>
                  <span className="ml-auto">{districts.length} districts</span>
                </div>
              )}

              {!selectedDivision && (
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-[var(--text-muted)]">Divisions</p>
                  {divisions.map(div => (
                    <button
                      key={div.code}
                      onClick={() => handleSelectDivision(div)}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-[var(--bg-hover)] transition-colors rounded"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-[var(--accent)]" />
                        <span className="text-[var(--text-primary)]">{div.name}</span>
                        <span className="ml-auto text-[10px] text-[var(--text-muted)]">{getDistrictsByDivision(div.code).length} districts</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedDivision && !selectedDistrict && (
                <div className="space-y-1">
                  {districts.map(dist => (
                    <button
                      key={dist.code}
                      onClick={() => handleSelectDistrict(dist)}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-[var(--bg-hover)] transition-colors rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[var(--accent)] text-[10px]">{dist.code}</span>
                        <span className="text-[var(--text-primary)]">{dist.name}</span>
                        <span className="ml-auto text-[10px] text-[var(--text-muted)]">{getUpazilasByDistrict(dist.code).length} upazilas</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedDistrict && (
                <div className="space-y-1">
                  {upazilas.map(uz => (
                    <div key={uz.code} className="px-2 py-1 text-xs text-[var(--text-primary)] border-b border-[var(--border)]/50 last:border-b-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[var(--accent)] text-[10px]">{uz.code}</span>
                        <span>{uz.name}</span>
                      </div>
                    </div>
                  ))}
                  {upazilas.length === 0 && (
                    <p className="text-[10px] text-[var(--text-muted)] text-center py-4">No upazilas found</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {showMap && (
          <div className="w-1/2 border-l border-[var(--border)]" ref={mapContainerRef} style={{ minHeight: 300 }} />
        )}
      </div>
    </div>
  );
}

function DrugsTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DrugEntry[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showByClass, setShowByClass] = useState(false);

  const drugClasses = getDrugClasses();

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) { setResults([]); return; }
    setResults(searchDrugs(value));
  };

  return (
    <div className="p-2 space-y-2">
      <div className="relative">
        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search drug (name, brand, class)..."
          className="w-full pl-7 pr-7 py-1.5 text-xs bg-[var(--bg-primary)] border border-[var(--border)] rounded text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/50"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X size={12} />
          </button>
        )}
      </div>

      <button
        onClick={() => setShowByClass(!showByClass)}
        className={`w-full text-[10px] px-2 py-1.5 rounded font-medium transition-colors ${showByClass ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
      >
        {showByClass ? 'Hide' : 'Browse by'} Therapeutic Class
      </button>

      {showByClass && !selectedClass && (
        <div className="space-y-1">
          {drugClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className="w-full text-left px-2 py-1.5 text-xs hover:bg-[var(--bg-hover)] transition-colors rounded flex items-center gap-2"
            >
              <span className="text-[var(--text-primary)]">{cls}</span>
              <span className="ml-auto text-[10px] text-[var(--text-muted)]">{getDrugsByClass(cls).length}</span>
            </button>
          ))}
        </div>
      )}

      {showByClass && selectedClass && (
        <div>
          <button onClick={() => setSelectedClass(null)} className="text-[10px] text-[var(--accent)] hover:underline mb-2 block">&larr; All classes</button>
          <p className="text-[10px] font-medium text-[var(--text-muted)] mb-1">{selectedClass}</p>
          {getDrugsByClass(selectedClass).map((d) => (
            <DrugRow key={d.id} drug={d} />
          ))}
        </div>
      )}

      {query && results.length > 0 && (
        <div className="divide-y divide-[var(--border)]/50">
          {results.map((d) => (
            <DrugRow key={d.id} drug={d} />
          ))}
        </div>
      )}

      {!query && !showByClass && (
        <p className="text-[10px] text-[var(--text-muted)] text-center py-4">
          Search by generic name, brand name, or therapeutic class
        </p>
      )}
    </div>
  );
}

function DrugRow({ drug }: { drug: DrugEntry }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="px-2 py-1.5 text-xs border-b border-[var(--border)]/50 last:border-b-0">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono text-[var(--accent)] font-medium text-[10px]">{drug.id}</span>
          <span className="text-[var(--text-primary)] font-medium">{drug.genericName}</span>
          <span className="text-[var(--text-muted)]">({drug.brandName})</span>
          <span className="ml-auto text-[10px] text-[var(--text-muted)]">{expanded ? '▲' : '▼'}</span>
        </div>
        <div className="text-[10px] text-[var(--text-muted)]">
          {drug.strength} | {drug.dosageForm} | {drug.manufacturer}
        </div>
      </button>
      {expanded && (
        <div className="mt-1 ml-2 space-y-0.5 bg-[var(--bg-primary)] rounded p-2 border border-[var(--border)]">
          <p className="text-[10px]"><span className="font-medium text-[var(--text-muted)]">Generic:</span> {drug.genericName}</p>
          <p className="text-[10px]"><span className="font-medium text-[var(--text-muted)]">Brand:</span> {drug.brandName}</p>
          <p className="text-[10px]"><span className="font-medium text-[var(--text-muted)]">Strength:</span> {drug.strength}</p>
          <p className="text-[10px]"><span className="font-medium text-[var(--text-muted)]">Form:</span> {drug.dosageForm}</p>
          <p className="text-[10px]"><span className="font-medium text-[var(--text-muted)]">Manufacturer:</span> {drug.manufacturer}</p>
          <p className="text-[10px]"><span className="font-medium text-[var(--text-muted)]">Class:</span> {drug.therapeuticClass}</p>
          {drug.atcCode && <p className="text-[10px]"><span className="font-medium text-[var(--text-muted)]">ATC:</span> {drug.atcCode}</p>}
        </div>
      )}
    </div>
  );
}

function VaccinesTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VaccineEntry[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) { setResults([]); return; }
    setResults(searchVaccines(value));
  };

  const schedule = getEpiSchedule();

  return (
    <div className="p-2 space-y-2">
      <div className="relative">
        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search vaccines..."
          className="w-full pl-7 pr-7 py-1.5 text-xs bg-[var(--bg-primary)] border border-[var(--border)] rounded text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/50"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X size={12} />
          </button>
        )}
      </div>

      <button
        onClick={() => setShowSchedule(!showSchedule)}
        className={`w-full text-[10px] px-2 py-1.5 rounded font-medium transition-colors ${showSchedule ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
      >
        {showSchedule ? 'Hide' : 'Show'} EPI Schedule
      </button>

      {showSchedule && (
        <div className="space-y-1">
          {schedule.map((s, i) => (
            <div key={i} className="bg-[var(--bg-primary)] rounded border border-[var(--border)] p-2">
              <p className="text-[10px] font-medium text-[var(--accent)] mb-1">{s.age}</p>
              <div className="space-y-0.5">
                {s.vaccines.map((v, j) => (
                  <div key={j} className="text-[10px] flex items-center gap-1">
                    <ShieldCheck size={10} className="text-green-500" />
                    <span className="font-mono">{v.code}</span>
                    <span className="text-[var(--text-muted)]">({v.dose})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && !showSchedule && (
        <div className="divide-y divide-[var(--border)]/50">
          {results.map(v => (
            <div key={v.code} className="px-2 py-1.5 text-xs">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[var(--accent)] font-medium text-[10px]">{v.code}</span>
                <span className="text-[var(--text-primary)] font-medium">{v.name}</span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] truncate">{v.description}</p>
              <p className="text-[10px] text-[var(--text-muted)]">Schedule: {v.schedule}</p>
            </div>
          ))}
        </div>
      )}

      {!query && !showSchedule && (
        <div className="space-y-1">
          {getAllVaccines().map(v => (
            <div key={v.code} className="px-2 py-1.5 text-xs border-b border-[var(--border)]/50 last:border-b-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[var(--accent)] font-medium text-[10px]">{v.code}</span>
                <span className="text-[var(--text-primary)] font-medium">{v.name}</span>
                <span className="ml-auto text-[10px] text-[var(--text-muted)]">{v.doses} dose{v.doses !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">{v.description}</p>
              <p className="text-[10px] text-[var(--text-muted)]">Schedule: {v.schedule}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
