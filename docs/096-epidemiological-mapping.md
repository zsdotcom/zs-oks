# 096 — Epidemiological Mapping (Leaflet.js)

**Date:** July 26, 2026

---

## 1. Description

A map visualization component powered by Leaflet.js (loaded from CDN) and OpenStreetMap tiles, designed for epidemiological data display.

## 2. Component

**File:** `src/components/EpiMap.tsx`

### Props

```typescript
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
  height?: string;  // default "400px"
}
```

### Visual encoding

| Severity | Color | Radius |
| :--- | :--- | :--- |
| Low | Green | 8px |
| Medium | Yellow | 12px |
| High | Orange | 18px |
| Critical | Red | 30px |

Radius scales logarithmically with case count (min 8px, max 30px).

### Interaction
- Click a marker to see a popup with full details (location, disease, cases, severity, status, date)
- Map automatically fits bounds to all markers
- Cleanup on component unmount

## 3. CDN dependencies

- Leaflet CSS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- Leaflet JS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`
- Tiles: OpenStreetMap `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

## 4. Usage in App

The EpiMap panel is toggled from the header toolbar (MapPin icon) and renders as a slide-over panel on the right side with sample global epidemiology data points.
