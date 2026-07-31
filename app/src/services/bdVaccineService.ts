export type BDVaccineCode = 'BCG' | 'OPV' | 'IPV' | 'PENTA' | 'MR' | 'TT' | 'PCV10' | 'ROTA' | 'HPV' | 'COVID19';

export interface BDVaccineEntry {
  code: BDVaccineCode;
  name: string;
  description: string;
  schedule?: string;
  doses?: number;
}

export interface BDEpiScheduleEntry {
  age: string;
  vaccines: { code: BDVaccineCode; dose: string }[];
}

const vaccineDataset: BDVaccineEntry[] = [
  { code: 'BCG', name: 'BCG Vaccine', description: 'Bacillus Calmette-Guérin vaccine, used against tuberculosis.', schedule: 'At birth', doses: 1 },
  { code: 'OPV', name: 'Oral Polio Vaccine (OPV)', description: 'Live attenuated oral polio vaccine.', schedule: 'At birth, 6 weeks, 10 weeks, 14 weeks', doses: 4 },
  { code: 'IPV', name: 'Inactivated Polio Vaccine (IPV)', description: 'Inactivated polio vaccine.', schedule: '14 weeks', doses: 1 },
  { code: 'PENTA', name: 'Pentavalent Vaccine', description: 'DTP-HepB-Hib combined vaccine.', schedule: '6 weeks, 10 weeks, 14 weeks', doses: 3 },
  { code: 'MR', name: 'Measles-Rubella (MR) Vaccine', description: 'Combined measles and rubella vaccine.', schedule: '9 months, 15 months', doses: 2 },
  { code: 'TT', name: 'Tetanus Toxoid (TT) Vaccine', description: 'Vaccine used for tetanus prevention.', schedule: 'Pregnancy: 1st contact, 4 weeks later', doses: 2 },
  { code: 'PCV10', name: 'Pneumococcal Conjugate Vaccine', description: '10-valent pneumococcal conjugate vaccine.', schedule: '6 weeks, 10 weeks, 18 months', doses: 3 },
  { code: 'ROTA', name: 'Rotavirus Vaccine', description: 'Live attenuated rotavirus vaccine for diarrheal disease prevention.', schedule: '6 weeks, 10 weeks', doses: 2 },
  { code: 'HPV', name: 'Human Papillomavirus (HPV) Vaccine', description: 'Vaccine for prevention of cervical cancer and HPV-related diseases.', schedule: 'School-based campaign (age 10-14)', doses: 1 },
  { code: 'COVID19', name: 'COVID-19 Vaccine', description: 'Vaccines against SARS-CoV-2 (various manufacturers).', schedule: 'Per national campaign guidelines', doses: 2 },
];

const epiSchedule: BDEpiScheduleEntry[] = [
  {
    age: 'At birth',
    vaccines: [
      { code: 'BCG', dose: '1st' },
      { code: 'OPV', dose: '1st (OPV-0)' },
    ],
  },
  {
    age: '6 weeks',
    vaccines: [
      { code: 'OPV', dose: '2nd' },
      { code: 'PENTA', dose: '1st' },
      { code: 'PCV10', dose: '1st' },
      { code: 'ROTA', dose: '1st' },
    ],
  },
  {
    age: '10 weeks',
    vaccines: [
      { code: 'OPV', dose: '3rd' },
      { code: 'PENTA', dose: '2nd' },
      { code: 'PCV10', dose: '2nd' },
      { code: 'ROTA', dose: '2nd' },
    ],
  },
  {
    age: '14 weeks',
    vaccines: [
      { code: 'OPV', dose: '4th' },
      { code: 'PENTA', dose: '3rd' },
      { code: 'IPV', dose: '1st' },
    ],
  },
  {
    age: '9 months',
    vaccines: [
      { code: 'MR', dose: '1st' },
    ],
  },
  {
    age: '15 months',
    vaccines: [
      { code: 'MR', dose: '2nd' },
    ],
  },
  {
    age: '18 months',
    vaccines: [
      { code: 'PCV10', dose: 'Booster' },
    ],
  },
];

export function getAllVaccines(): BDVaccineEntry[] {
  return vaccineDataset;
}

export function searchVaccines(query: string): BDVaccineEntry[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return vaccineDataset.filter(
    v => v.code.toLowerCase().includes(lower) || v.name.toLowerCase().includes(lower) || v.description.toLowerCase().includes(lower)
  );
}

export function getEpiSchedule(): BDEpiScheduleEntry[] {
  return epiSchedule;
}
