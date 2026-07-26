import { describe, it, expect } from 'vitest';
import {
  searchICD11,
  getICD11ByCode,
  getAllICD11Codes,
  getICD11ByChapter,
} from '../services/icd11Service';

describe('searchICD11', () => {
  it('searches by code', () => {
    const results = searchICD11('1A00');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].code).toBe('1A00');
  });

  it('searches by title', () => {
    const results = searchICD11('Cholera');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('Cholera');
  });

  it('searches by chapter', () => {
    const results = searchICD11('Neoplasms');
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => {
      expect(r.chapter).toBe('Neoplasms');
    });
  });

  it('searches by description', () => {
    const results = searchICD11('Vibrio cholerae');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].code).toBe('1A00');
  });

  it('is case insensitive', () => {
    const lower = searchICD11('tuberculosis');
    const upper = searchICD11('TUBERCULOSIS');
    const mixed = searchICD11('TuberCulosis');
    expect(lower.length).toBeGreaterThan(0);
    expect(lower.length).toBe(upper.length);
    expect(lower.length).toBe(mixed.length);
  });

  it('returns empty array for empty query', () => {
    expect(searchICD11('')).toEqual([]);
    expect(searchICD11('   ')).toEqual([]);
  });

  it('returns empty array for non-matching query', () => {
    expect(searchICD11('ZZZZNONEXISTENT')).toEqual([]);
  });
});

describe('getICD11ByCode', () => {
  it('finds exact code match', () => {
    const result = getICD11ByCode('6A00');
    expect(result).toBeDefined();
    expect(result!.title).toBe('Depressive disorders');
  });

  it('returns undefined for non-existent code', () => {
    expect(getICD11ByCode('ZZZZ')).toBeUndefined();
  });

  it('is case sensitive (codes must match exactly)', () => {
    expect(getICD11ByCode('6a00')).toBeUndefined();
    expect(getICD11ByCode('6A00')).toBeDefined();
  });
});

describe('getAllICD11Codes', () => {
  it('returns all 51 entries', () => {
    const all = getAllICD11Codes();
    expect(all.length).toBe(51);
  });

  it('each entry has required fields', () => {
    const all = getAllICD11Codes();
    all.forEach((entry) => {
      expect(entry).toHaveProperty('code');
      expect(entry).toHaveProperty('title');
      expect(entry).toHaveProperty('chapter');
      expect(entry).toHaveProperty('description');
      expect(typeof entry.code).toBe('string');
      expect(typeof entry.title).toBe('string');
      expect(typeof entry.chapter).toBe('string');
      expect(typeof entry.description).toBe('string');
    });
  });

  it('all codes are unique', () => {
    const all = getAllICD11Codes();
    const codes = all.map((e) => e.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe('getICD11ByChapter', () => {
  it('filters by chapter name (exact match)', () => {
    const results = getICD11ByChapter('Neoplasms');
    expect(results.length).toBe(6);
    results.forEach((r) => {
      expect(r.chapter).toBe('Neoplasms');
    });
  });

  it('filters by chapter name (case insensitive)', () => {
    const lower = getICD11ByChapter('neoplasms');
    const upper = getICD11ByChapter('NEOPLASMS');
    expect(lower.length).toBe(upper.length);
    expect(lower.length).toBe(6);
  });

  it('returns empty array for non-existent chapter', () => {
    const results = getICD11ByChapter('NonExistentChapterName');
    expect(results).toEqual([]);
  });

  it('returns entries from the diseases of the circulatory system chapter', () => {
    const results = getICD11ByChapter('Diseases of the circulatory system');
    expect(results.length).toBe(4);
    const titles = results.map((r) => r.title);
    expect(titles).toContain('Hypertensive heart disease');
    expect(titles).toContain('Ischaemic heart disease');
    expect(titles).toContain('Cerebrovascular disease');
    expect(titles).toContain('Heart failure');
  });
});
