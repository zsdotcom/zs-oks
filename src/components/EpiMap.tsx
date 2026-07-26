import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

interface EpiDataPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  disease: string;
  cases: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  status: 'active' | 'contained' | 'resolved';
}

interface TimelineFrame {
  date: string;
  activePoints: string[];
}

interface EpiMapProps {
  dataPoints: EpiDataPoint[];
  onPointClick?: (point: EpiDataPoint) => void;
  height?: string;
  timelineData?: TimelineFrame[];
  onTimeChange?: (date: string) => void;
  playSpeed?: number;
}

const SEVERITY_COLORS: Record<EpiDataPoint['severity'], string> = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};

function severityRadius(cases: number): number {
  const min = 8;
  const max = 30;
  const log = Math.log10(cases + 1);
  const normalized = Math.min(log / 5, 1);
  return min + normalized * (max - min);
}

function EpiMap({ dataPoints, onPointClick, height = '400px', timelineData, onTimeChange, playSpeed = 1000 }: EpiMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<typeof L.map> | null>(null);
  const markersRef = useRef<Map<string, ReturnType<typeof L.circleMarker>>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const hasTimeline = !!(timelineData && timelineData.length > 0);

  const currentDate = useMemo(() => {
    if (hasTimeline && timelineData![currentIndex]) {
      return timelineData![currentIndex].date;
    }
    return '';
  }, [hasTimeline, timelineData, currentIndex]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView([20, 0], 2);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const markers: ReturnType<typeof L.circleMarker>[] = [];
    markersRef.current.clear();

    for (const point of dataPoints) {
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: severityRadius(point.cases),
        fillColor: SEVERITY_COLORS[point.severity],
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7,
      });

      const popupContent = `
        <strong>${point.label}</strong><br/>
        <b>Disease:</b> ${point.disease}<br/>
        <b>Cases:</b> ${point.cases.toLocaleString()}<br/>
        <b>Severity:</b> ${point.severity}<br/>
        <b>Status:</b> ${point.status}<br/>
        <b>Date:</b> ${point.date}
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onPointClick?.(point);
      });

      marker.addTo(map);
      markers.push(marker);
      markersRef.current.set(point.id, marker);
    }

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [dataPoints, onPointClick]);

  useEffect(() => {
    if (!mapRef.current) return;
    const activeIds = new Set(hasTimeline ? timelineData![currentIndex]?.activePoints || [] : dataPoints.map(p => p.id));
    markersRef.current.forEach((marker, id) => {
      if (activeIds.has(id)) {
        if (!mapRef.current!.hasLayer(marker)) marker.addTo(mapRef.current!);
      } else {
        if (mapRef.current!.hasLayer(marker)) marker.removeFrom(mapRef.current!);
      }
    });
  }, [currentIndex, timelineData, dataPoints, hasTimeline]);

  useEffect(() => {
    if (hasTimeline && currentDate) {
      onTimeChange?.(currentDate);
    }
  }, [currentDate, hasTimeline, onTimeChange]);

  useEffect(() => {
    if (!isPlaying || !hasTimeline) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (timelineData?.length || 1));
    }, playSpeed / speedMultiplier);
    return () => clearInterval(interval);
  }, [isPlaying, hasTimeline, timelineData, playSpeed, speedMultiplier]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    setCurrentIndex(idx);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  if (!hasTimeline) {
    return (
    <div
      ref={containerRef}
      className="epi-map-container"
      style={{ height, borderRadius: 8, border: '1px solid var(--border-color, #d1d5db)' }}
      role="application"
      aria-label="Epidemiological map"
    />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={containerRef}
        className="epi-map-container"
        style={{ flex: 1, borderRadius: 8, border: '1px solid var(--border-color, #d1d5db)' }}
      />
      <div className="p-2 border-t border-[var(--border)] space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            )}
          </button>
          {currentDate && (
            <span className="text-[10px] text-[var(--accent)] font-mono">{currentDate}</span>
          )}
          <div className="flex items-center gap-1 ml-auto">
            {[0.5, 1, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setSpeedMultiplier(speed)}
                className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                  speedMultiplier === speed
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(0, (timelineData?.length || 1) - 1)}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-full h-1 appearance-none bg-[var(--bg-hover)] rounded cursor-pointer"
          style={{ accentColor: 'var(--accent)' }}
        />
      </div>
    </div>
  );
}

export type { EpiDataPoint, EpiMapProps, TimelineFrame };
export { EpiMap };
