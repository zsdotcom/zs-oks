// src/services/publicApiService.ts

const API_TIMEOUT = 15000;

interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached: boolean;
}

interface CDCDatasetResult {
  [key: string]: any;
}

interface GHOIndicator {
  IndicatorCode: string;
  IndicatorName: string;
  [key: string]: any;
}

interface FluViewResult {
  epiweek: string;
  region: string;
  wili: number;
  ili: number;
  num_patients: number;
  num_providers: number;
  [key: string]: any;
}

interface COVIDCastResult {
  time_value: number;
  geo_value: string;
  signal: string;
  value: number;
  stderr: number;
  sample_size: number;
  [key: string]: any;
}

interface InfectoNETPathogen {
  pathogen: string;
  count: number;
  updated: string;
}

interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithTimeout(url: string, options?: RequestInit, timeout = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response;
  } finally {
    clearTimeout(id);
  }
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data as T;
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── CDC Socrata API ───

export async function fetchCDCDataset(datasetId: string, options?: { limit?: number; offset?: number; where?: string }): Promise<ApiResult<CDCDatasetResult[]>> {
  const cacheKey = `cdc-${datasetId}-${JSON.stringify(options)}`;
  const cached = getCached<CDCDatasetResult[]>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    let url = `https://data.cdc.gov/resource/${datasetId}.json?$limit=${options?.limit || 100}&$offset=${options?.offset || 0}`;
    if (options?.where) url += `&$where=${encodeURIComponent(options.where)}`;
    const res = await fetchWithTimeout(url);
    const data = await res.json();
    setCache(cacheKey, data);
    return { success: true, data, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export const CDC_DATASETS = [
  { id: 'e8aa-8m3u', name: 'PLACES: County Health Measures', description: '40+ health measures at county, place, tract, and ZCTA levels' },
  { id: 'h9xu-2fn5', name: 'BRFSS: Behavioral Risk Factors', description: 'Comprehensive behavioral risk factor surveillance data' },
  { id: 'kfhf-n94m', name: 'NNDSS: Notifiable Diseases', description: 'National Notifiable Diseases Surveillance System' },
  { id: 'mnkj-7f6m', name: 'COVID-19 Vaccinations: County', description: 'County-level COVID-19 vaccination trends with equity metrics' },
  { id: '6q59-gfjs', name: 'Drug Overdose Mortality', description: 'Provisional drug overdose death counts by drug type' },
  { id: 'v6un-6e6k', name: 'Flu Vaccination Coverage', description: 'Seasonal influenza vaccination coverage by demographic' },
  { id: 's4dd-h7uq', name: 'Respiratory Virus Surveillance', description: 'Combined RSV, COVID-19, and influenza surveillance' },
  { id: '6s9e-uwgr', name: 'Tobacco Use Trends', description: 'Tobacco use behavior and policy impact data' },
  { id: 'k9nb-wcbf', name: 'Injury Mortality', description: 'Traumatic brain injury and alcohol-impaired driving' },
  { id: 'eh59-8hm2', name: 'Diabetes Surveillance', description: 'County-level diagnosed diabetes prevalence and incidence' },
];

// ─── WHO GHO API ───

export async function fetchGHOIndicators(search?: string): Promise<ApiResult<GHOIndicator[]>> {
  const cacheKey = `who-indicators-${search || 'all'}`;
  const cached = getCached<GHOIndicator[]>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    const res = await fetchWithTimeout('https://ghoapi.azureedge.net/api/Indicator');
    const json = await res.json();
    const indicators = json.value as GHOIndicator[];
    const filtered = search
      ? indicators.filter((i: GHOIndicator) => i.IndicatorName?.toLowerCase().includes(search.toLowerCase()))
      : indicators;
    setCache(cacheKey, filtered);
    return { success: true, data: filtered, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export async function fetchGHOData(indicatorCode: string, filter?: { country?: string; year?: string }): Promise<ApiResult<any[]>> {
  const cacheKey = `who-data-${indicatorCode}-${JSON.stringify(filter)}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    let url = `https://ghoapi.azureedge.net/api/${indicatorCode}`;
    const params: string[] = [];
    if (filter?.country) params.push(`$filter=SpatialDim eq '${filter.country}'`);
    if (filter?.year) params.push(`$filter=TimeDim eq ${filter.year}`);
    if (params.length > 0) url += `?${params.join(' and ')}`;
    const res = await fetchWithTimeout(url);
    const json = await res.json();
    const data = json.value || [];
    setCache(cacheKey, data);
    return { success: true, data, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export async function fetchGHODimensions(dimension: string): Promise<ApiResult<any[]>> {
  const cacheKey = `who-dim-${dimension}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    const res = await fetchWithTimeout(`https://ghoapi.azureedge.net/api/${dimension}`);
    const json = await res.json();
    setCache(cacheKey, json.value);
    return { success: true, data: json.value, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export const WHO_INDICATORS = [
  { code: 'WHOSIS_000001', name: 'Life expectancy at birth (years)' },
  { code: 'WHOSIS_000003', name: 'Mortality rate for 5-14 year olds' },
  { code: 'WHOSIS_000015', name: 'Infant mortality rate' },
  { code: 'WHOSIS_000026', name: 'Maternal mortality ratio' },
  { code: 'WHOSIS_000027', name: 'Neonatal mortality rate' },
  { code: 'WHOSIS_000032', name: 'Under-five mortality rate' },
  { code: 'WHS2_100', name: 'HIV incidence per 1000' },
  { code: 'WHS3_100', name: 'Tuberculosis incidence per 100,000' },
  { code: 'WHS4_100', name: 'Malaria incidence per 1000' },
  { code: 'WHS6_100', name: 'Hepatitis B prevalence' },
  { code: 'WHS7_100', name: 'Diabetes prevalence' },
  { code: 'WHS8_100', name: 'Hypertension prevalence' },
  { code: 'WHS9_100', name: 'Obesity prevalence' },
  { code: 'MH_1', name: 'Mental health workforce' },
  { code: 'HWF_1', name: 'Physician density per 10,000' },
  { code: 'HWF_2', name: 'Nursing/midwifery density per 10,000' },
  { code: 'NCD_BMI_2', name: 'Mean BMI (kg/m²)' },
  { code: 'AIR_1', name: 'Ambient air pollution attributable deaths' },
  { code: 'SDG_SDG3_1', name: 'Maternal mortality ratio (SDG 3.1)' },
  { code: 'SDG_SDG3_2', name: 'Under-5 mortality (SDG 3.2)' },
];

// ─── Delphi Epidata API ───

export async function fetchFluView(regions?: string, epiweeks?: string): Promise<ApiResult<FluViewResult[]>> {
  const cacheKey = `delphi-flu-${regions || 'all'}-${epiweeks || 'latest'}`;
  const cached = getCached<FluViewResult[]>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    const url = `https://api.delphi.cmu.edu/epidata/fluview?epiweeks=${epiweeks || 'latest'}&regions=${regions || 'nat'}`;
    const res = await fetchWithTimeout(url);
    const json = await res.json();
    const data = json.epidata || [];
    setCache(cacheKey, data);
    return { success: true, data, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export async function fetchCOVIDCast(signal: string, geoType: string = 'county', geoValues: string = '42003'): Promise<ApiResult<COVIDCastResult[]>> {
  const cacheKey = `delphi-covid-${signal}-${geoType}-${geoValues}`;
  const cached = getCached<COVIDCastResult[]>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    const url = `https://api.delphi.cmu.edu/epidata/covidcast?data_source=covidcast&signal=${signal}&time_type=day&geo_type=${geoType}&geo_values=${geoValues}&time_values=20250101-20260401`;
    const res = await fetchWithTimeout(url);
    const json = await res.json();
    const data = json.epidata || [];
    setCache(cacheKey, data);
    return { success: true, data, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export const COVIDCAST_SIGNALS = [
  { id: 'confirmed_7dav_incidence_num', name: 'Confirmed cases (7-day avg)', description: '7-day average of confirmed COVID-19 incidence' },
  { id: 'deaths_7dav_incidence_num', name: 'Deaths (7-day avg)', description: '7-day average of confirmed COVID-19 deaths' },
  { id: 'confirmed_admissions_covid_1d', name: 'Hospital admissions', description: 'Daily confirmed COVID-19 hospital admissions' },
  { id: 'confirmed_incedence_prop', name: 'Incidence proportion', description: 'Proportion of population with confirmed COVID-19' },
  { id: 'fb_survey_cli', name: 'COVID-like illness (FB survey)', description: 'Facebook survey CLI indicator' },
  { id: 'fb_survey_hh_cmnty_cli', name: 'Community CLI (FB survey)', description: 'Facebook survey community CLI indicator' },
];

// ─── InfectoNET API ───

export async function listPathogens(): Promise<ApiResult<InfectoNETPathogen[]>> {
  const cacheKey = 'infectonet-pathogens';
  const cached = getCached<InfectoNETPathogen[]>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    const res = await fetchWithTimeout('https://infectonet.org/api/viruses');
    const data = await res.json();
    setCache(cacheKey, data);
    return { success: true, data, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export async function fetchPathogenData(pathogen: string, limit: number = 50): Promise<ApiResult<any[]>> {
  const cacheKey = `infectonet-${pathogen}-${limit}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    const res = await fetchWithTimeout(`https://infectonet.org/api/viruses/${encodeURIComponent(pathogen)}?limit=${limit}`);
    const data = await res.json();
    setCache(cacheKey, data);
    return { success: true, data, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export async function fetchOutbreakAlerts(pathogen?: string): Promise<ApiResult<any[]>> {
  const cacheKey = `infectonet-alerts-${pathogen || 'all'}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    const url = pathogen
      ? `https://infectonet.org/api/outbreak/${encodeURIComponent(pathogen)}`
      : 'https://infectonet.org/api/outbreak';
    const res = await fetchWithTimeout(url);
    const data = await res.json();
    setCache(cacheKey, data);
    return { success: true, data, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export const INFECTONET_PATHOGENS = [
  'SARS-CoV-2', 'influenza', 'ebola', 'dengue', 'mpox', 'zika',
  'chikungunya', 'hantavirus', 'marburg', 'lassa', 'nipah',
  'measles', 'rubella', 'yellow-fever', 'west-nile', 'rsv',
  'avian-influenza', 'mERS', 'sARS', 'norovirus', 'rotavirus',
];

// ─── Open-Meteo API ───

export async function fetchWeatherData(lat: number, lon: number): Promise<ApiResult<WeatherData>> {
  const cacheKey = `weather-${lat}-${lon}`;
  const cached = getCached<WeatherData>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m`;
    const res = await fetchWithTimeout(url);
    const json = await res.json();
    const data: WeatherData = {
      temperature: json.current?.temperature_2m ?? 0,
      precipitation: json.current?.precipitation ?? 0,
      humidity: json.current?.relative_humidity_2m ?? 0,
      windSpeed: json.current?.wind_speed_10m ?? 0,
    };
    setCache(cacheKey, data);
    return { success: true, data, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export async function fetchAirQuality(lat: number, lon: number): Promise<ApiResult<any>> {
  const cacheKey = `aq-${lat}-${lon}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone`;
    const res = await fetchWithTimeout(url);
    const data = await res.json();
    setCache(cacheKey, data);
    return { success: true, data, cached: false };
  } catch (e: any) {
    return { success: false, error: e.message, cached: false };
  }
}

export function clearApiCache(): void {
  cache.clear();
}
