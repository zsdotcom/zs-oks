---
title: "006 — Epidemiological Map"
description: "Leaflet.js-powered epidemiological map with severity-coded markers, popup details, and auto-fit bounds"
category: "guides"
order: 6
tags: ["epidemiology", "map", "leaflet", "visualization"]
last_updated: "2026-07-28"
audience: "users"
---

# 060 — Epidemiological Map Guide

---

## 1. Overview

The EpiMap panel provides a geospatial visualization of epidemiological data using **Leaflet.js** (loaded from CDN) with **OpenStreetMap** tiles. It displays disease outbreak data points with severity-coded markers on an interactive map.

Implemented in `src/components/EpiMap.tsx`.

---

## 2. Opening the EpiMap

1. Click the **MapPin icon** in the header toolbar (looks like a map marker)
2. The EpiMap panel opens as a slide-over panel on the right side of the screen
3. The map displays sample global epidemiology data points by default

---

## 3. What the Map Shows

### Map Engine
- **Library**: Leaflet.js 1.9.4 (loaded from `https://unpkg.com/leaflet@1.9.4/`)
- **Tiles**: OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`)
- **Basemap**: Standard OSM street map with zoom controls

### Data Points

The built-in sample data covers 8 global locations:

| Location | Disease | Cases | Severity | Status |
|:---|:---|:---|:---|:---|
| Nairobi, Kenya | Malaria | 1,240 | High | Active |
| Lagos, Nigeria | Dengue fever | 890 | Medium | Active |
| Delhi, India | COVID-19 | 3,200 | Critical | Active |
| São Paulo, Brazil | Dengue fever | 2,100 | High | Active |
| New York, USA | Influenza | 560 | Low | Contained |
| Paris, France | Measles | 340 | Medium | Contained |
| Tokyo, Japan | COVID-19 | 780 | Medium | Active |
| Sydney, Australia | Influenza | 190 | Low | Resolved |

---

## 4. Severity Legend

Markers are color-coded by severity level:

| Severity | Color | Radius | Example |
|:---|:---|:---|:---|
| **Low** | Green | 8px | Seasonal influenza with few cases |
| **Medium** | Yellow | 12px | Localized outbreak, moderate case count |
| **High** | Orange | 18px | Widespread outbreak, significant cases |
| **Critical** | Red | 30px | Major epidemic, high case count |

Marker radius scales logarithmically with case count (minimum 8px, maximum 30px).

---

## 5. Marker Interaction

Click any marker on the map to see a **popup** with:

- **Location** name (city/label)
- **Disease** name
- **Cases** — Total confirmed case count
- **Severity** — Low / Medium / High / Critical
- **Status** — Active / Contained / Resolved
- **Date** — Last reported date

The map automatically fits its bounds to show all markers on load.

---

## 6. How Data Points Are Loaded

The EpiMap component receives data through the `dataPoints` prop:

```typescript
interface EpiDataPoint {
  id: string;           // Unique identifier
  lat: number;          // Latitude (decimal degrees)
  lng: number;          // Longitude (decimal degrees)
  label: string;        // Display name for the location
  disease: string;      // Disease name
  cases: number;        // Confirmed case count
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;         // ISO date string
  status: 'active' | 'contained' | 'resolved';
}
```

Sample data is defined in `src/App.tsx:175-184`. In the future, this data could come from:

- Manual entry by the user
- Data loaded from CSV datasets
- Public API queries (CDC, WHO) via the [Public Data APIs](100-public-data.md)
- Agent-generated analysis

---

## 7. Use Cases

- **Outbreak visualization** — Plot confirmed cases on a map to identify geographic clusters
- **Situation monitoring** — Track active vs. contained outbreaks across regions
- **Resource allocation** — Identify high-severity areas requiring intervention
- **Trend analysis** — Compare case counts across locations
- **Epidemiological research** — Visualize disease spread patterns

---

## 8. Component Details

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `dataPoints` | `EpiDataPoint[]` | Required | Array of data points to display |
| `onPointClick` | `(point) => void` | Optional | Callback when a marker is clicked |
| `height` | `string` | `"400px"` | Map container height |

The component cleans up (destroys the map instance) on unmount to prevent memory leaks.

---

## 9. Limitations

- Map tiles require internet access (OpenStreetMap tiles are fetched live)
- Currently uses static sample data — no live API integration for automatic updates
- Leaflet is loaded from CDN at runtime (not bundled)

---

## See Also

- [ICD-11 Lookup Guide](070-icd11.md) — Medical code browser for epidemiological data
- [Public Data APIs Guide](100-public-data.md) — Fetching real-world data
- [Diagram Generation](030-diagrams.md) — Creating charts and graphs
- [Developer Guide: Architecture](../developers/004-development.md) — Component architecture
- [Portal Overview](../index.md) — Full documentation index

---

*Back to [Documentation Home](../index.md)*

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._


