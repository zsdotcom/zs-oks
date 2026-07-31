import { describe, it, expect } from 'vitest';
import {
  searchICHI,
  getICHIByCode,
  getAllICHICodes,
  getICHIBySection,
} from '../../app/src/services/ichiService';

describe('searchICHI', () => {
  it('searches by code', () => {
    const results = searchICHI('THR.ABA');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].code).toBe('THR.ABA');
  });

  it('searches by title', () => {
    const results = searchICHI('Immunization');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('Immunization');
  });

  it('searches by chapter', () => {
    const results = searchICHI('Preventive');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.chapter === 'Preventive Interventions')).toBe(true);
  });

  it('returns empty array for empty query', () => {
    expect(searchICHI('')).toEqual([]);
  });

  it('is case-insensitive', () => {
    const upper = searchICHI('thr.aba');
    const lower = searchICHI('THR.ABA');
    expect(upper).toEqual(lower);
  });

  it('returns multiple results for broad search', () => {
    const results = searchICHI('therapy');
    expect(results.length).toBeGreaterThan(2);
  });

  it('searches by description text', () => {
    const results = searchICHI('vaccine');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].code).toBe('PRE.AAA');
  });

  it('returns empty array for nonexistent code', () => {
    expect(searchICHI('ZZZ.XXX')).toEqual([]);
  });
});

describe('getICHIByCode', () => {
  it('returns entry for valid code', () => {
    const entry = getICHIByCode('DIA.AAA');
    expect(entry).toBeDefined();
    expect(entry!.title).toContain('interview');
  });

  it('returns undefined for invalid code', () => {
    expect(getICHIByCode('ZZZ.XXX')).toBeUndefined();
  });

  it('is case-insensitive', () => {
    const upper = getICHIByCode('dia.aaa');
    const lower = getICHIByCode('DIA.AAA');
    expect(upper).toEqual(lower);
  });

  it('returns entry with correct section', () => {
    const entry = getICHIByCode('PRE.AAA');
    expect(entry).toBeDefined();
    expect(entry!.section).toBe('preventive');
  });
});

describe('getAllICHICodes', () => {
  it('returns all entries', () => {
    const all = getAllICHICodes();
    expect(all.length).toBeGreaterThan(40);
  });

  it('every entry has required fields', () => {
    const all = getAllICHICodes();
    for (const entry of all) {
      expect(entry.code).toBeTruthy();
      expect(entry.title).toBeTruthy();
      expect(entry.chapter).toBeTruthy();
      expect(entry.section).toBeTruthy();
      expect(entry.description).toBeTruthy();
    }
  });

  it('contains entries from all six sections', () => {
    const all = getAllICHICodes();
    const sections = new Set(all.map((e) => e.section));
    expect(sections.has('diagnostic')).toBe(true);
    expect(sections.has('therapeutic')).toBe(true);
    expect(sections.has('preventive')).toBe(true);
    expect(sections.has('health-promotion')).toBe(true);
    expect(sections.has('administration')).toBe(true);
    expect(sections.has('assistive-technology')).toBe(true);
  });
});

describe('getICHIBySection', () => {
  it('returns entries for diagnostic section', () => {
    const results = getICHIBySection('diagnostic');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.section === 'diagnostic')).toBe(true);
  });

  it('returns entries for therapeutic section', () => {
    const results = getICHIBySection('therapeutic');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.section === 'therapeutic')).toBe(true);
  });

  it('returns entries for preventive section', () => {
    const results = getICHIBySection('preventive');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.section === 'preventive')).toBe(true);
  });

  it('returns entries for assistive-technology section', () => {
    const results = getICHIBySection('assistive-technology');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.section === 'assistive-technology')).toBe(true);
  });

  it('all diagnostic codes start with DIA', () => {
    const results = getICHIBySection('diagnostic');
    expect(results.every((r) => r.code.startsWith('DIA'))).toBe(true);
  });

  it('all therapeutic codes start with THR', () => {
    const results = getICHIBySection('therapeutic');
    expect(results.every((r) => r.code.startsWith('THR'))).toBe(true);
  });

  it('all preventive codes start with PRE', () => {
    const results = getICHIBySection('preventive');
    expect(results.every((r) => r.code.startsWith('PRE'))).toBe(true);
  });
});
