import { describe, it, expect } from 'vitest';
import { getAllVaccines, getEpiSchedule, searchVaccines } from '../services/bdVaccineService';

describe('bdVaccineService', () => {
  describe('getAllVaccines', () => {
    it('returns all vaccines', () => {
      const vaccines = getAllVaccines();
      expect(vaccines.length).toBeGreaterThan(0);
      expect(vaccines.map(v => v.name)).toContain('BCG Vaccine');
      expect(vaccines.map(v => v.name)).toContain('Oral Polio Vaccine (OPV)');
    });

    it('each vaccine has required fields', () => {
      const vaccines = getAllVaccines();
      vaccines.forEach(v => {
        expect(v.code).toBeTruthy();
        expect(v.name).toBeTruthy();
        expect(typeof v.doses).toBe('number');
      });
    });
  });

  describe('getEpiSchedule', () => {
    it('returns EPI schedule entries', () => {
      const schedule = getEpiSchedule();
      expect(schedule.length).toBeGreaterThan(0);
    });

    it('each schedule entry has age and vaccines', () => {
      const schedule = getEpiSchedule();
      schedule.forEach(entry => {
        expect(entry.age).toBeTruthy();
        expect(Array.isArray(entry.vaccines)).toBe(true);
        entry.vaccines.forEach(v => {
          expect(v.code).toBeTruthy();
          expect(v.dose).toBeTruthy();
        });
      });
    });

    it('includes birth doses', () => {
      const schedule = getEpiSchedule();
      const birth = schedule.find(s => s.age.toLowerCase().includes('birth'));
      expect(birth).toBeTruthy();
      expect(birth!.vaccines.length).toBeGreaterThan(0);
    });
  });

  describe('searchVaccines', () => {
    it('finds vaccines by name', () => {
      const results = searchVaccines('BCG');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe('BCG Vaccine');
    });

    it('finds vaccines by code', () => {
      const results = searchVaccines('MR');
      expect(results.length).toBeGreaterThan(0);
    });

    it('returns empty for no match', () => {
      const results = searchVaccines('ZZZZZZ');
      expect(results).toEqual([]);
    });

    it('is case-insensitive', () => {
      const lower = searchVaccines('polio');
      const upper = searchVaccines('POLIO');
      expect(lower.length).toBe(upper.length);
    });
  });
});
