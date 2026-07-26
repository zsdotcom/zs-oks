import { useEffect, useRef } from 'react';

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

interface EpiMapProps {
  dataPoints: EpiDataPoint[];
  onPointClick?: (point: EpiDataPoint) => void;
  height?: string;
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

function EpiMap({ dataPoints, onPointClick, height = '400px' }: EpiMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<typeof L.map> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView([20, 0], 2);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const markers: ReturnType<typeof L.circleMarker>[] = [];

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
    }

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [dataPoints, onPointClick]);

  return (
    <div
      ref={containerRef}
      className="epi-map-container"
      style={{ height, borderRadius: 8, border: '1px solid var(--border-color, #d1d5db)' }}
    />
  );
}

export type { EpiDataPoint };
export { EpiMap };
