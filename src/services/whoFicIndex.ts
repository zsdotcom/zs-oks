import {
  searchICD11 as _searchICD11,
  getICD11ByCode as _getICD11ByCode,
  getAllICD11Codes as _getAllICD11Codes,
  getICD11ByChapter as _getICD11ByChapter,
  icd11ToFHIR as _icd11ToFHIR,
  FHIRToICD11 as _FHIRToICD11,
  searchICD11ByFHIR as _searchICD11ByFHIR,
} from './icd11Service';
export type { ICD11Entry, FHIRCondition } from './icd11Service';

import {
  searchICF as _searchICF,
  getICFByCode as _getICFByCode,
  getAllICFCodes as _getAllICFCodes,
  getICFByComponent as _getICFByComponent,
} from './icfService';
export type { ICFEntry, ICFComponent } from './icfService';

import {
  searchICHI as _searchICHI,
  getICHIByCode as _getICHIByCode,
  getAllICHICodes as _getAllICHICodes,
  getICHIBySection as _getICHIBySection,
} from './ichiService';
export type { ICHIEntry, ICHISection } from './ichiService';

export const searchICD11 = _searchICD11;
export const getICD11ByCode = _getICD11ByCode;
export const getAllICD11Codes = _getAllICD11Codes;
export const getICD11ByChapter = _getICD11ByChapter;
export const icd11ToFHIR = _icd11ToFHIR;
export const FHIRToICD11 = _FHIRToICD11;
export const searchICD11ByFHIR = _searchICD11ByFHIR;

export const searchICF = _searchICF;
export const getICFByCode = _getICFByCode;
export const getAllICFCodes = _getAllICFCodes;
export const getICFByComponent = _getICFByComponent;

export const searchICHI = _searchICHI;
export const getICHIByCode = _getICHIByCode;
export const getAllICHICodes = _getAllICHICodes;
export const getICHIBySection = _getICHIBySection;

export type WhoFicType = 'icd11' | 'icf' | 'ichi';

export function searchWhoFic(query: string, type?: WhoFicType) {
  return {
    icd11: type === 'icf' || type === 'ichi' ? [] as import('./icd11Service').ICD11Entry[] : _searchICD11(query),
    icf: type === 'icd11' || type === 'ichi' ? [] as import('./icfService').ICFEntry[] : _searchICF(query),
    ichi: type === 'icd11' || type === 'icf' ? [] as import('./ichiService').ICHIEntry[] : _searchICHI(query),
  };
}
