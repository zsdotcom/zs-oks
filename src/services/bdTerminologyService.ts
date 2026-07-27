const OCL_BASE = 'https://tr.ocl.dghs.gov.bd/api/fhir';
const ICD11_SYSTEM = 'http://id.who.int/icd/release/11/mms';

export interface OCLValidateCodeResult {
  valid: boolean;
  display?: string;
  message?: string;
}

export interface OCLLookupResult {
  found: boolean;
  display?: string;
  definition?: string;
  properties?: Record<string, string[]>;
}

export interface ClusterValidationResult {
  valid: boolean;
  stem: {
    code: string;
    display: string;
    ocl_validated: boolean;
  };
  satellites: {
    code: string;
    axis: string;
    valid: boolean;
  }[];
  errors: string[];
}

export async function oclValidateCode(code: string, system: string = ICD11_SYSTEM): Promise<OCLValidateCodeResult> {
  try {
    const url = `${OCL_BASE}/CodeSystem/$validate-code?system=${encodeURIComponent(system)}&code=${encodeURIComponent(code)}`;
    const res = await fetch(url);
    if (!res.ok) return { valid: false, message: `HTTP ${res.status}` };
    const data = await res.json();
    const param = data.parameter?.find((p: any) => p.name === 'result');
    const displayParam = data.parameter?.find((p: any) => p.name === 'display');
    const messageParam = data.parameter?.find((p: any) => p.name === 'message');
    return {
      valid: param?.valueBoolean ?? param?.valueCode === 'true',
      display: displayParam?.valueString,
      message: messageParam?.valueString,
    };
  } catch (err) {
    return { valid: false, message: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function oclLookup(code: string, system: string = ICD11_SYSTEM): Promise<OCLLookupResult> {
  try {
    const url = `${OCL_BASE}/CodeSystem/$lookup?system=${encodeURIComponent(system)}&code=${encodeURIComponent(code)}`;
    const res = await fetch(url);
    if (!res.ok) return { found: false };
    const data = await res.json();
    const found = data.parameter?.some((p: any) => p.name === 'found' && p.valueBoolean);
    const displayParam = data.parameter?.find((p: any) => p.name === 'display');
    const definitionParam = data.parameter?.find((p: any) => p.name === 'definition');
    const propertyParams = data.parameter?.filter((p: any) => p.name === 'property');
    const properties: Record<string, string[]> = {};
    propertyParams?.forEach((p: any) => {
      const code = p.valueCode;
      const value = p.valueString || p.valueCoding?.display || p.valueCode;
      if (!properties[code]) properties[code] = [];
      properties[code].push(value);
    });
    return {
      found: found ?? false,
      display: displayParam?.valueString,
      definition: definitionParam?.valueString,
      properties: Object.keys(properties).length > 0 ? properties : undefined,
    };
  } catch (err) {
    return { found: false };
  }
}

export async function oclValueSetValidateCode(code: string, valueSetUrl: string = 'https://fhir.dghs.gov.bd/core/ValueSet/bd-condition-icd11-diagnosis-valueset'): Promise<OCLValidateCodeResult> {
  try {
    const url = `${OCL_BASE}/ValueSet/$validate-code?url=${encodeURIComponent(valueSetUrl)}&system=${encodeURIComponent(ICD11_SYSTEM)}&code=${encodeURIComponent(code)}`;
    const res = await fetch(url);
    if (!res.ok) return { valid: false, message: `HTTP ${res.status}` };
    const data = await res.json();
    const param = data.parameter?.find((p: any) => p.name === 'result');
    const displayParam = data.parameter?.find((p: any) => p.name === 'display');
    const messageParam = data.parameter?.find((p: any) => p.name === 'message');
    return {
      valid: param?.valueBoolean ?? param?.valueCode === 'true',
      display: displayParam?.valueString,
      message: messageParam?.valueString,
    };
  } catch (err) {
    return { valid: false, message: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function validateICD11Cluster(expression: string): Promise<ClusterValidationResult> {
  try {
    const res = await fetch('https://icd11.dghs.gov.bd/cluster/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression }),
    });
    if (!res.ok) {
      return { valid: false, stem: { code: '', display: '', ocl_validated: false }, satellites: [], errors: [`HTTP ${res.status}`] };
    }
    return await res.json();
  } catch (err) {
    return { valid: false, stem: { code: '', display: '', ocl_validated: false }, satellites: [], errors: [err instanceof Error ? err.message : 'Unknown error'] };
  }
}

export const CONDITION_VALUESET_URL = 'https://fhir.dghs.gov.bd/core/ValueSet/bd-condition-icd11-diagnosis-valueset';
export const ICD11_SYSTEM_URI = ICD11_SYSTEM;
export const OCL_BASE_URL = OCL_BASE;
export const FHIR_SANDBOX_BASE = 'https://sandbox.fhir.dghs.gov.bd/fhir';
