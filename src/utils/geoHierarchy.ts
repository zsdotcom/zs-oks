export enum GeoLevel {
  GLOBAL = 'L0',
  REGIONAL = 'L1',
  COUNTRY = 'L2',
  STATE_PROVINCE = 'L3',
  DISTRICT = 'L4',
  SUB_DISTRICT = 'L5',
  UNION_BLOCK = 'L6',
  COMMUNITY = 'L7',
  SERVICE_POINT = 'L8',
}

export const GEO_LEVEL_LABELS: Record<GeoLevel, string> = {
  [GeoLevel.GLOBAL]: 'Global',
  [GeoLevel.REGIONAL]: 'Regional',
  [GeoLevel.COUNTRY]: 'Country',
  [GeoLevel.STATE_PROVINCE]: 'State/Province',
  [GeoLevel.DISTRICT]: 'District',
  [GeoLevel.SUB_DISTRICT]: 'Sub-District',
  [GeoLevel.UNION_BLOCK]: 'Union/Block',
  [GeoLevel.COMMUNITY]: 'Community',
  [GeoLevel.SERVICE_POINT]: 'Service Point',
};

export interface GeoHierarchyNode {
  level: GeoLevel;
  code: string;
  name: string;
  parentCode?: string;
  iso3166Alpha2?: string;
  iso3166Alpha3?: string;
  pCode?: string;
  plusCode?: string;
  what3words?: string;
  latitude?: number;
  longitude?: number;
}

export interface GeocodedPoint {
  lat: number;
  lng: number;
  hierarchy: GeoHierarchyNode[];
  accuracy?: 'exact' | 'approximate' | 'estimated';
}

export function buildHierarchyPath(nodes: GeoHierarchyNode[]): string {
  return nodes
    .sort((a, b) => parseInt(a.level.slice(1)) - parseInt(b.level.slice(1)))
    .map((n) => n.name)
    .join(' › ');
}

export function getHierarchyLevelName(level: GeoLevel): string {
  return GEO_LEVEL_LABELS[level];
}

export function suggestPlusCode(lat: number, lng: number): string {
  const latDeg = Math.abs(lat);
  const lngDeg = Math.abs(lng);
  const latCode = String.fromCharCode(65 + Math.floor(latDeg / 20) % 20);
  const lngCode = String.fromCharCode(65 + 2 * Math.floor(lngDeg / 20) % 20);
  const latRemainder = Math.floor((latDeg % 20) / 1);
  const lngRemainder = Math.floor((lngDeg % 20) / 1);
  const code = `${latCode}${lngCode}${latRemainder}${lngRemainder}`;
  return code.length === 4 ? `${code}00+` : `${code}+`;
}
