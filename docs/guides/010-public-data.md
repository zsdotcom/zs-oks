---
title: "010 — Public Data APIs"
description: "Public data API browser for CDC, WHO, FluView, COVIDcast, Pathogen, Weather, and Air Quality data"
category: "guides"
order: 10
tags: ["public-data", "cdc", "who", "weather", "apis"]
last_updated: "2026-07-28"
audience: "users"
---

# 010 — Public Data APIs Guide

---

## 1. Overview

The **PublicDataPanel** provides access to multiple free public data APIs directly from Open Knowledge Studio. You can query health, epidemiological, weather, and air quality data without API keys — these are all free, publicly accessible endpoints.

Implemented in `src/components/PublicDataPanel.tsx` and `src/services/publicApiService.ts`.

---

## 2. Opening the Public Data Panel

The Public Data Panel is accessible from the tools area. It offers 5 tabs:

| Tab | Data Source | API Endpoint |
|:---|:---|:---|
| **CDC Data** | US Centers for Disease Control | Socrata Open Data API |
| **WHO GHO** | World Health Organization Global Health Observatory | OData API |
| **Delphi Epi** | Carnegie Mellon Delphi Group | Epidata API |
| **Pathogens** | InfectoNET | REST API |
| **Weather** | Open-Meteo | REST API |

---

## 3. CDC Data

### Available Datasets

| ID | Name | Description |
|:---|:---|:---|
| `e8aa-8m3u` | PLACES: County Health Measures | 40+ health measures at county, place, tract, and ZCTA levels |
| `h9xu-2fn5` | BRFSS: Behavioral Risk Factors | Comprehensive behavioral risk factor surveillance data |
| `kfhf-n94m` | NNDSS: Notifiable Diseases | National Notifiable Diseases Surveillance System |
| `mnkj-7f6m` | COVID-19 Vaccinations: County | County-level COVID-19 vaccination trends with equity metrics |
| `6q59-gfjs` | Drug Overdose Mortality | Provisional drug overdose death counts by drug type |
| `v6un-6e6k` | Flu Vaccination Coverage | Seasonal influenza vaccination coverage by demographic |
| `s4dd-h7uq` | Respiratory Virus Surveillance | Combined RSV, COVID-19, and influenza surveillance |
| `6s9e-uwgr` | Tobacco Use Trends | Tobacco use behavior and policy impact data |
| `k9nb-wcbf` | Injury Mortality | Traumatic brain injury and alcohol-impaired driving |
| `eh59-8hm2` | Diabetes Surveillance | County-level diagnosed diabetes prevalence |

### Query Parameters

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `limit` | number | 100 | Maximum rows to return |
| `offset` | number | 0 | Pagination offset |
| `where` | string | — | SoQL WHERE clause for filtering |

### Example Queries

- Fetch COVID-19 vaccination data: Select "COVID-19 Vaccinations: County"
- Filter by state: `state = 'CA'`
- Get diabetes data with high prevalence: `prevalence > 15`

Results are displayed in a sortable table (up to 100 rows). All data is cached in memory for 5 minutes.

---

## 4. WHO Global Health Observatory

The WHO GHO API provides global health statistics across hundreds of indicators.

### Available Indicators (Sample)

| Code | Name |
|:---|:---|
| `WHOSIS_000001` | Life expectancy at birth (years) |
| `WHOSIS_000015` | Infant mortality rate |
| `WHOSIS_000026` | Maternal mortality ratio |
| `WHS2_100` | HIV incidence per 1000 |
| `WHS3_100` | Tuberculosis incidence per 100,000 |
| `WHS4_100` | Malaria incidence per 1000 |
| `WHS7_100` | Diabetes prevalence |
| `WHS8_100` | Hypertension prevalence |
| `WHS9_100` | Obesity prevalence |
| `MH_1` | Mental health workforce |
| `HWF_1` | Physician density per 10,000 |
| `SDG_SDG3_1` | Maternal mortality ratio (SDG 3.1) |

### Filtering

| Parameter | Example | Description |
|:---|:---|:---|
| Country | `KEN` | Filter by ISO 3-letter country code |
| Year | `2022` | Filter by time dimension |

### Example Queries

- "Show me malaria incidence data for Nigeria" → Select `WHS4_100`, filter country `NGA`
- "What is the diabetes prevalence in the United States?" → Select `WHS7_100`, filter country `USA`
- "Life expectancy trends by year" → Select `WHOSIS_000001` with no filter

---

## 5. Delphi Epidata (FluView & COVIDcast)

The Carnegie Mellon Delphi Group provides real-time epidemiological surveillance data.

### FluView

Tracks influenza-like illness (ILI) activity.

| Field | Description |
|:---|:---|
| `epiweek` | Epidemiological week (YYYYWW) |
| `region` | Region code (`nat`, `hhs1`–`hhs10`, state codes) |
| `wili` | Weighted ILI percentage |
| `ili` | Unweighted ILI percentage |
| `num_patients` | Number of patient visits |
| `num_providers` | Number of reporting providers |

**Example**: `fetchFluView('nat', '202640')` gets national ILI data for week 40 of 2026.

### COVIDcast

Tracks COVID-19 indicators.

| Signal | Description |
|:---|:---|
| `confirmed_7dav_incidence_num` | 7-day average confirmed cases |
| `deaths_7dav_incidence_num` | 7-day average confirmed deaths |
| `confirmed_admissions_covid_1d` | Daily hospital admissions |
| `confirmed_incidence_prop` | Incidence proportion |
| `fb_survey_cli` | COVID-like illness (Facebook survey) |
| `fb_survey_hh_cmnty_cli` | Community CLI (Facebook survey) |

**Parameters**: `geoType` (`county`, `state`, `nation`), `geoValues` (FIPS codes for counties, state abbreviations).

### Example Queries

- "What's the current flu activity nationwide?" → Fetch FluView with default parameters
- "Show COVID-19 hospital admissions in Pennsylvania" → Fetch COVIDcast with geoValues `'42'`

---

## 6. Pathogen Data (InfectoNET)

The InfectoNET API provides pathogen and outbreak data.

### Available Pathogens

SARS-CoV-2, influenza, ebola, dengue, mpox, zika, chikungunya, hantavirus, marburg, lassa, nipah, measles, rubella, yellow-fever, west-nile, RSV, avian-influenza, MERS, SARS, norovirus, rotavirus.

### Queries

| Function | Description |
|:---|:---|
| `listPathogens()` | Lists all available pathogens with metadata |
| `fetchPathogenData(pathogen, limit)` | Fetch data for a specific pathogen |
| `fetchOutbreakAlerts(pathogen?)` | Fetch outbreak alerts, optionally filtered by pathogen |

### Example Queries

- "Show me all available pathogens" → List pathogens
- "Get the latest data on dengue" → Fetch pathogen data for "dengue"
- "Any recent outbreak alerts for Ebola?" → Fetch outbreak alerts for "ebola"

---

## 7. Weather & Air Quality (Open-Meteo)

Free weather and air quality data from Open-Meteo (no API key required).

### Weather Data

| Field | Unit |
|:---|:---|
| `temperature` | °C |
| `precipitation` | mm |
| `humidity` | % |
| `windSpeed` | km/h |

**Query**: `fetchWeatherData(lat, lon)` — takes latitude and longitude coordinates.

### Air Quality Data

| Field | Description |
|:---|:---|
| `european_aqi` | European Air Quality Index |
| `us_aqi` | US Air Quality Index |
| `pm2_5` | Fine particulate matter (µg/m³) |
| `pm10` | Coarse particulate matter (µg/m³) |
| `nitrogen_dioxide` | NO₂ concentration |
| `ozone` | O₃ concentration |

**Query**: `fetchAirQuality(lat, lon)` — takes latitude and longitude coordinates.

### Example Queries

- "What is the current weather in Nairobi?" → `fetchWeatherData(-1.286, 36.817)`
- "Check air quality in Delhi" → `fetchAirQuality(28.613, 77.209)`

---

## 8. How Results Are Displayed

Query results are shown in a **scrollable table** within the panel:

- Up to 100 rows displayed
- Up to 12 columns per table
- Cells truncated at 50 characters for long values
- Shows count if results exceed 100 rows
- Loading spinner during API calls
- Error messages displayed inline with an alert icon

Data is **cached in memory** for 5 minutes (`CACHE_TTL`) to avoid redundant API calls. You can clear the cache at any time.

---

## 9. Use Cases for Research

- **Epidemiological studies**: Fetch notifiable disease data from CDC, then plot on the [EpiMap](006-epi-map.md)
- **Global health comparisons**: Compare WHO health indicators across countries
- **Disease tracking**: Use FluView and COVIDcast for real-time surveillance
- **Environmental health**: Combine weather and air quality data with disease data
- **Outbreak monitoring**: Use InfectoNET alerts for emerging pathogen threats
- **Cross-reference**: Look up [ICD-11 codes](007-icd11.md) and query related health data

---

## 10. Technical Notes

- All APIs are called from the browser (no proxy server required)
- All endpoints are free public APIs with rate limits
- Default timeout per request: 15 seconds
- Cache duration: 5 minutes (configurable in code via `CACHE_TTL`)
- Results are not stored permanently — export what you need
- Some APIs may have downtime or rate limits; errors are handled gracefully

---

## See Also

- [ICD-11 Lookup Guide](007-icd11.md) — Medical codes for research queries
- [Epidemiological Map Guide](006-epi-map.md) — Visualizing fetched data on a map
- [Sandboxed Code Execution](005-sandbox.md) — Analyzing data with the sandbox
- [Connectors Guide](008-connectors.md) — External service integrations
- [A2A Agents Guide](001-agents.md) — Researching with public data
- [Portal Overview](../index.md) — Full documentation index

---

*Back to [Documentation Home](../index.md)*

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._


