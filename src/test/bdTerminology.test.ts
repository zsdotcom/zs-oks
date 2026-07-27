import { describe, it, expect, vi, beforeEach } from 'vitest';
import { oclValidateCode, oclLookup, oclValueSetValidateCode, validateICD11Cluster } from '../services/bdTerminologyService';

function mockFetchResponse(data: any, status = 200) {
  return vi.mocked(fetch).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as Response);
}

describe('bdTerminologyService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({})))
    );
  });

  describe('oclValidateCode', () => {
    it('returns valid=true for a known ICD-11 code', async () => {
      mockFetchResponse({
        resourceType: 'Parameters',
        parameter: [{ name: 'result', valueBoolean: true }, { name: 'display', valueString: 'Cholera' }],
      });
      const result = await oclValidateCode('1A00');
      expect(result.valid).toBe(true);
      expect(result.display).toBe('Cholera');
    });

    it('returns valid=false for an unknown code', async () => {
      mockFetchResponse({
        resourceType: 'OperationOutcome',
        issue: [{ severity: 'error', code: 'not-found' }],
      }, 400);
      const result = await oclValidateCode('XXXXX');
      expect(result.valid).toBe(false);
    });

    it('returns display when available', async () => {
      mockFetchResponse({
        parameter: [{ name: 'result', valueBoolean: true }, { name: 'display', valueString: 'Typhoid fever' }],
      });
      const result = await oclValidateCode('1A10');
      expect(result.display).toBe('Typhoid fever');
    });

    it('adds system query parameter for ICD-11 codes', async () => {
      mockFetchResponse({ parameter: [{ name: 'result', valueBoolean: true }] });
      await oclValidateCode('1A00');
      const callUrl = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(decodeURIComponent(callUrl)).toContain('system=http://id.who.int/icd/release/11/mms');
    });
  });

  describe('oclLookup', () => {
    it('returns found=true with properties for a valid code', async () => {
      mockFetchResponse({
        parameter: [
          { name: 'found', valueBoolean: true },
          { name: 'display', valueString: 'Cholera' },
          { name: 'property', part: [{ name: 'code', valueCode: 'severity' }, { name: 'value', valueString: 'Acute' }] },
        ],
      });
      const result = await oclLookup('1A00');
      expect(result.found).toBe(true);
      expect(result.display).toBe('Cholera');
    });

    it('returns found=false for lookup failure', async () => {
      mockFetchResponse({ resourceType: 'OperationOutcome' }, 404);
      const result = await oclLookup('INVALID');
      expect(result.found).toBe(false);
    });
  });

  describe('oclValueSetValidateCode', () => {
    it('validates a code against a value set', async () => {
      mockFetchResponse({ parameter: [{ name: 'result', valueBoolean: true }] });
      const result = await oclValueSetValidateCode('1A00');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateICD11Cluster', () => {
    it('validates a simple ICD-11 cluster', async () => {
      mockFetchResponse({
        valid: true, stem: { code: 'NC72.Z', display: 'Essential hypertension', ocl_validated: true },
        satellites: [], errors: [],
      });
      const result = await validateICD11Cluster('NC72.Z');
      expect(result.valid).toBe(true);
    });
  });
});
