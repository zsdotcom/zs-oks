import { describe, it, expect } from 'vitest';
import {
  getAllDivisions, getDistrictsByDivision, getUpazilasByDistrict,
  getAllDistricts, searchGeography, getFullGeoPath,
} from '../services/bdGeographyService';

describe('bdGeographyService', () => {
  describe('getAllDivisions', () => {
    it('returns all 8 divisions', () => {
      const divisions = getAllDivisions();
      expect(divisions).toHaveLength(8);
      expect(divisions.map(d => d.name)).toContain('Dhaka');
      expect(divisions.map(d => d.name)).toContain('Chattogram');
    });

    it('each division has required fields', () => {
      const divisions = getAllDivisions();
      divisions.forEach(d => {
        expect(d.code).toBeTruthy();
        expect(d.name).toBeTruthy();
        expect(d.level).toBe('division');
      });
    });
  });

  describe('getDistrictsByDivision', () => {
    it('returns districts for Dhaka division', () => {
      const dhakaDiv = getAllDivisions().find(d => d.name === 'Dhaka');
      expect(dhakaDiv).toBeTruthy();
      const districts = getDistrictsByDivision(dhakaDiv!.code);
      expect(districts.length).toBeGreaterThan(0);
      expect(districts.map(d => d.name)).toContain('Faridpur');
    });

    it('returns empty array for invalid division code', () => {
      const districts = getDistrictsByDivision('999');
      expect(districts).toEqual([]);
    });

    it('each district belongs to its division', () => {
      const divisions = getAllDivisions();
      divisions.forEach(div => {
        const districts = getDistrictsByDivision(div.code);
        districts.forEach(d => {
          expect(d.divisionCode).toBe(div.code);
        });
      });
    });
  });

  describe('getUpazilasByDistrict', () => {
    it('returns upazilas for Dhaka district', () => {
      const upazilas = getUpazilasByDistrict('3026');
      expect(upazilas.length).toBeGreaterThan(0);
      expect(upazilas.map(u => u.name)).toContain('Savar');
    });

    it('returns empty array for invalid district code', () => {
      const upazilas = getUpazilasByDistrict('99999');
      expect(upazilas).toEqual([]);
    });
  });

  describe('getAllDistricts', () => {
    it('returns all 64 districts', () => {
      const districts = getAllDistricts();
      expect(districts).toHaveLength(64);
    });
  });

  describe('searchGeography', () => {
    it('finds divisions by name', () => {
      const results = searchGeography('Dhaka');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.level === 'division' && r.name === 'Dhaka')).toBe(true);
    });

    it('finds districts by name', () => {
      const results = searchGeography('Cox');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.level === 'district')).toBe(true);
    });

    it('returns empty for no match', () => {
      const results = searchGeography('XYZZZ');
      expect(results).toEqual([]);
    });

    it('is case-insensitive', () => {
      const lower = searchGeography('dhaka');
      const upper = searchGeography('DHAKA');
      expect(lower.length).toBeGreaterThan(0);
      expect(lower.length).toBe(upper.length);
    });
  });

  describe('getFullGeoPath', () => {
    it('returns path for a valid upazila code', () => {
      const path = getFullGeoPath('10040009');
      expect(path).toBeDefined();
      expect(path!.division.level).toBe('division');
      expect(path!.district.level).toBe('district');
      expect(path!.upazila.level).toBe('upazila');
    });

    it('returns undefined for an invalid code', () => {
      const path = getFullGeoPath('999');
      expect(path).toBeUndefined();
    });
  });
});
