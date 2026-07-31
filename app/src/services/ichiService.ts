import type { ICD11Entry } from './icd11Service';

export type ICHISection = 'diagnostic' | 'therapeutic' | 'preventive' | 'health-promotion' | 'administration' | 'assistive-technology';

export interface ICHIEntry extends ICD11Entry {
  section: ICHISection;
  target?: string;
  action?: string;
  means?: string;
}

const ichiDataset: ICHIEntry[] = [
  { code: 'DIA.AAA', title: 'Diagnostic interview', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Structured clinical interview to assess health status, symptoms and medical history' },
  { code: 'DIA.ABA', title: 'Physical examination', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Systematic physical assessment of body systems through inspection, palpation, percussion and auscultation' },
  { code: 'DIA.ACA', title: 'Vital signs measurement', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Measurement of temperature, pulse, respiration rate and blood pressure' },
  { code: 'DIA.ADA', title: 'Anthropometric measurement', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Measurement of height, weight, body mass index and other body measurements' },
  { code: 'DIA.AEA', title: 'Specimen collection', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Collection of blood, urine, stool, sputum or other specimens for laboratory analysis' },
  { code: 'DIA.AFA', title: 'Diagnostic imaging', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Radiological examination including X-ray, ultrasound, CT and MRI' },
  { code: 'DIA.AGA', title: 'Electrodiagnostic testing', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Electrophysiological testing including ECG, EEG, EMG and nerve conduction studies' },
  { code: 'DIA.AHA', title: 'Endoscopic examination', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Visual examination of internal structures using an endoscope' },
  { code: 'DIA.AIA', title: 'Functional assessment', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Standardized assessment of physical, cognitive and social functioning using validated instruments' },
  { code: 'DIA.AJA', title: 'Laboratory analysis', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Biochemical, haematological, microbiological and immunological analysis of specimens' },
  { code: 'DIA.AKA', title: 'Genetic testing', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Analysis of DNA, RNA or chromosomes to identify genetic variants associated with health conditions' },
  { code: 'DIA.ALA', title: 'Diagnostic interview for mental health', chapter: 'Diagnostic Interventions', section: 'diagnostic', description: 'Structured mental health assessment including mental status examination and diagnostic interview' },
  { code: 'THR.ABA', title: 'Pharmacotherapy', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Administration of medications for treatment or prevention of disease' },
  { code: 'THR.ACA', title: 'Surgical intervention', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Operative procedure involving incision, excision or reconstruction of body tissues' },
  { code: 'THR.ADA', title: 'Therapeutic counselling', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Structured psychological counselling including cognitive-behavioural therapy and supportive therapy' },
  { code: 'THR.AEA', title: 'Physical therapy', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Therapeutic exercises and manual techniques to restore movement and function' },
  { code: 'THR.AFA', title: 'Occupational therapy', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Activity-based therapeutic intervention to improve performance in daily living tasks' },
  { code: 'THR.AGA', title: 'Speech and language therapy', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Therapeutic intervention for communication and swallowing disorders' },
  { code: 'THR.AHA', title: 'Respiratory therapy', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Interventions to improve respiratory function including oxygen therapy and chest physiotherapy' },
  { code: 'THR.AIA', title: 'Nutritional therapy', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Therapeutic diet modification and nutritional supplementation for health conditions' },
  { code: 'THR.AJA', title: 'Wound care management', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Cleaning, debridement and dressing of wounds to promote healing and prevent infection' },
  { code: 'THR.AKA', title: 'Pain management', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Interventions to assess and manage acute and chronic pain using pharmacological and non-pharmacological methods' },
  { code: 'THR.ALA', title: 'Radiotherapy', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Therapeutic use of ionizing radiation for treatment of malignant and selected benign conditions' },
  { code: 'THR.AMA', title: 'Blood product transfusion', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Transfusion of whole blood, packed red cells, platelets, plasma or other blood components' },
  { code: 'THR.ANA', title: 'Rehabilitation therapy', chapter: 'Therapeutic Interventions', section: 'therapeutic', description: 'Comprehensive rehabilitation programme addressing multiple functional domains' },
  { code: 'PRE.AAA', title: 'Immunization', chapter: 'Preventive Interventions', section: 'preventive', description: 'Administration of vaccines for prevention of infectious diseases' },
  { code: 'PRE.ABA', title: 'Screening examination', chapter: 'Preventive Interventions', section: 'preventive', description: 'Systematic testing of asymptomatic individuals for early detection of disease' },
  { code: 'PRE.ACA', title: 'Health risk assessment', chapter: 'Preventive Interventions', section: 'preventive', description: 'Evaluation of individual risk factors for disease using structured assessment instruments' },
  { code: 'PRE.ADA', title: 'Chemoprophylaxis', chapter: 'Preventive Interventions', section: 'preventive', description: 'Administration of medications to prevent disease in at-risk individuals' },
  { code: 'PRE.AEA', title: 'Contact tracing', chapter: 'Preventive Interventions', section: 'preventive', description: 'Identification and follow-up of individuals who have been exposed to communicable diseases' },
  { code: 'PRE.AFA', title: 'Quarantine and isolation', chapter: 'Preventive Interventions', section: 'preventive', description: 'Separation of individuals exposed to or infected with communicable diseases to prevent transmission' },
  { code: 'PRE.AGA', title: 'Environmental disinfection', chapter: 'Preventive Interventions', section: 'preventive', description: 'Chemical or physical decontamination of environments to reduce pathogen transmission' },
  { code: 'PRE.AHA', title: 'Vector control', chapter: 'Preventive Interventions', section: 'preventive', description: 'Interventions to control disease vectors including insecticide spraying and bed net distribution' },
  { code: 'HPP.AAA', title: 'Health education', chapter: 'Health Promotion', section: 'health-promotion', description: 'Structured education to improve health literacy and promote healthy behaviours' },
  { code: 'HPP.ABA', title: 'Behaviour change counselling', chapter: 'Health Promotion', section: 'health-promotion', description: 'Counselling to support behaviour change for improved health outcomes using motivational interviewing' },
  { code: 'HPP.ACA', title: 'Community health outreach', chapter: 'Health Promotion', section: 'health-promotion', description: 'Mobile health services delivered in community settings to reach underserved populations' },
  { code: 'HPP.ADA', title: 'Peer education programme', chapter: 'Health Promotion', section: 'health-promotion', description: 'Trained peers delivering health education and support within their communities' },
  { code: 'HPP.AEA', title: 'Workplace health promotion', chapter: 'Health Promotion', section: 'health-promotion', description: 'Health promotion activities delivered in workplace settings including wellness programmes' },
  { code: 'ADM.AAA', title: 'Clinical documentation', chapter: 'Administrative Interventions', section: 'administration', description: 'Recording and maintaining clinical records including patient history, assessments and treatment plans' },
  { code: 'ADM.ABA', title: 'Care coordination', chapter: 'Administrative Interventions', section: 'administration', description: 'Organization and coordination of multidisciplinary care across providers and settings' },
  { code: 'ADM.ACA', title: 'Referral management', chapter: 'Administrative Interventions', section: 'administration', description: 'Process of referring patients between providers or levels of care with appropriate documentation' },
  { code: 'ADM.ADA', title: 'Discharge planning', chapter: 'Administrative Interventions', section: 'administration', description: 'Planning for transition of care from hospital to community setting including follow-up arrangements' },
  { code: 'ADM.AEA', title: 'Informed consent process', chapter: 'Administrative Interventions', section: 'administration', description: 'Process of obtaining voluntary informed consent for treatment including disclosure of risks and benefits' },
  { code: 'ADM.AFA', title: 'Quality improvement', chapter: 'Administrative Interventions', section: 'administration', description: 'Systematic activities to monitor, evaluate and improve quality of health services' },
  { code: 'AST.AAA', title: 'Assistive device provision', chapter: 'Assistive Technology', section: 'assistive-technology', description: 'Assessment, fitting and provision of assistive devices including mobility aids and hearing aids' },
  { code: 'AST.ABA', title: 'Home modification', chapter: 'Assistive Technology', section: 'assistive-technology', description: 'Structural modifications to the home environment to improve accessibility and safety' },
  { code: 'AST.ACA', title: 'Assistive communication technology', chapter: 'Assistive Technology', section: 'assistive-technology', description: 'Provision and training in use of augmentative and alternative communication devices' },
  { code: 'AST.ADA', title: 'Prosthetic and orthotic services', chapter: 'Assistive Technology', section: 'assistive-technology', description: 'Assessment, fitting and follow-up for prosthetic limbs and orthotic devices' },
  { code: 'AST.AEA', title: 'Digital health intervention', chapter: 'Assistive Technology', section: 'assistive-technology', description: 'Use of digital technologies including mobile apps and telemedicine for health management' },
];

export function getAllICHICodes(): ICHIEntry[] {
  return ichiDataset;
}

export function getICHIByCode(code: string): ICHIEntry | undefined {
  return ichiDataset.find((entry) => entry.code.toLowerCase() === code.toLowerCase());
}

export function searchICHI(query: string): ICHIEntry[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return ichiDataset.filter(
    (entry) =>
      entry.code.toLowerCase().includes(lower) ||
      entry.title.toLowerCase().includes(lower) ||
      entry.chapter.toLowerCase().includes(lower) ||
      entry.description.toLowerCase().includes(lower)
  );
}

export function getICHIBySection(section: ICHISection): ICHIEntry[] {
  return ichiDataset.filter((entry) => entry.section === section);
}
