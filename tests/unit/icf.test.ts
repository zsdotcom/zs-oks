import { describe, it, expect } from 'vitest';
import {
  searchICF,
  getICFByCode,
  getAllICFCodes,
  getICFByComponent,
} from '../../app/src/services/icfService';

describe('searchICF', () => {
  it('searches by code', () => {
    const results = searchICF('b110');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].code).toBe('b110');
  });

  it('searches by title', () => {
    const results = searchICF('Consciousness');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].code).toBe('b110');
  });

  it('searches by chapter', () => {
    const results = searchICF('Environmental');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.chapter === 'Environmental Factors')).toBe(true);
  });

  it('returns empty array for empty query', () => {
    expect(searchICF('')).toEqual([]);
  });

  it('is case-insensitive', () => {
    const upper = searchICF('B110');
    const lower = searchICF('b110');
    expect(upper).toEqual(lower);
  });

  it('returns multiple results for broad search', () => {
    const results = searchICF('function');
    expect(results.length).toBeGreaterThan(5);
  });

  it('searches by description text', () => {
    const results = searchICF('gait pattern');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].code).toBe('b770');
  });

  it('returns empty array for nonexistent code', () => {
    expect(searchICF('zz999')).toEqual([]);
  });
});

describe('getICFByCode', () => {
  it('returns entry for valid code', () => {
    const entry = getICFByCode('b280');
    expect(entry).toBeDefined();
    expect(entry!.title).toContain('pain');
  });

  it('returns undefined for invalid code', () => {
    expect(getICFByCode('zz999')).toBeUndefined();
  });

  it('is case-insensitive', () => {
    const upper = getICFByCode('B280');
    const lower = getICFByCode('b280');
    expect(upper).toEqual(lower);
  });

  it('returns entry with correct component', () => {
    const entry = getICFByCode('e580');
    expect(entry).toBeDefined();
    expect(entry!.component).toBe('environmental-factors');
  });
});

describe('getAllICFCodes', () => {
  it('returns all entries', () => {
    const all = getAllICFCodes();
    expect(all.length).toBeGreaterThan(150);
  });

  it('every entry has required fields', () => {
    const all = getAllICFCodes();
    for (const entry of all) {
      expect(entry.code).toBeTruthy();
      expect(entry.title).toBeTruthy();
      expect(entry.chapter).toBeTruthy();
      expect(entry.component).toBeTruthy();
      expect(entry.description).toBeTruthy();
    }
  });

  it('contains entries from all four components', () => {
    const all = getAllICFCodes();
    const components = new Set(all.map((e) => e.component));
    expect(components.has('body-functions')).toBe(true);
    expect(components.has('body-structures')).toBe(true);
    expect(components.has('activities-participation')).toBe(true);
    expect(components.has('environmental-factors')).toBe(true);
  });
});

describe('getICFByComponent', () => {
  it('returns entries for body-functions', () => {
    const results = getICFByComponent('body-functions');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.component === 'body-functions')).toBe(true);
  });

  it('returns entries for environmental-factors', () => {
    const results = getICFByComponent('environmental-factors');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.component === 'environmental-factors')).toBe(true);
  });

  it('all body function codes start with b', () => {
    const results = getICFByComponent('body-functions');
    expect(results.every((r) => r.code.startsWith('b'))).toBe(true);
  });

  it('all body structure codes start with s', () => {
    const results = getICFByComponent('body-structures');
    expect(results.every((r) => r.code.startsWith('s'))).toBe(true);
  });

  it('all activity codes start with d', () => {
    const results = getICFByComponent('activities-participation');
    expect(results.every((r) => r.code.startsWith('d'))).toBe(true);
  });

  it('all environmental codes start with e', () => {
    const results = getICFByComponent('environmental-factors');
    expect(results.every((r) => r.code.startsWith('e'))).toBe(true);
  });
});
