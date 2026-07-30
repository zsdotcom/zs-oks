export interface DrugEntry {
  id: string;
  genericName: string;
  brandName: string;
  strength: string;
  dosageForm: string;
  manufacturer: string;
  therapeuticClass: string;
  atcCode?: string;
}

// Sample dataset based on BD National Drug Formulary / DGDA registered drugs
const DRUG_REGISTRY: DrugEntry[] = [
  { id: 'DGDA-0001', genericName: 'Paracetamol', brandName: 'Napa', strength: '500mg', dosageForm: 'Tablet', manufacturer: 'Beximco', therapeuticClass: 'Analgesic/Antipyretic', atcCode: 'N02BE01' },
  { id: 'DGDA-0002', genericName: 'Paracetamol', brandName: 'Paracin', strength: '500mg', dosageForm: 'Tablet', manufacturer: 'ACI', therapeuticClass: 'Analgesic/Antipyretic', atcCode: 'N02BE01' },
  { id: 'DGDA-0003', genericName: 'Paracetamol', brandName: 'Pacimol', strength: '250mg/5ml', dosageForm: 'Suspension', manufacturer: 'Incepta', therapeuticClass: 'Analgesic/Antipyretic', atcCode: 'N02BE01' },
  { id: 'DGDA-0004', genericName: 'Omeprazole', brandName: 'Maxpro', strength: '20mg', dosageForm: 'Capsule', manufacturer: 'Square', therapeuticClass: 'PPI', atcCode: 'A02BC01' },
  { id: 'DGDA-0005', genericName: 'Omeprazole', brandName: 'Omecept', strength: '20mg', dosageForm: 'Capsule', manufacturer: 'Incepta', therapeuticClass: 'PPI', atcCode: 'A02BC01' },
  { id: 'DGDA-0006', genericName: 'Omeprazole', brandName: 'Antra', strength: '40mg IV', dosageForm: 'Injection', manufacturer: 'ACI', therapeuticClass: 'PPI', atcCode: 'A02BC01' },
  { id: 'DGDA-0007', genericName: 'Amoxicillin', brandName: 'Amoxil', strength: '500mg', dosageForm: 'Capsule', manufacturer: 'GlaxoSmithKline', therapeuticClass: 'Antibiotic (Penicillin)', atcCode: 'J01CA04' },
  { id: 'DGDA-0008', genericName: 'Amoxicillin', brandName: 'Amoxicillin', strength: '250mg/5ml', dosageForm: 'Suspension', manufacturer: 'Square', therapeuticClass: 'Antibiotic (Penicillin)', atcCode: 'J01CA04' },
  { id: 'DGDA-0009', genericName: 'Ciprofloxacin', brandName: 'Ciprocin', strength: '500mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Antibiotic (Fluoroquinolone)', atcCode: 'J01MA02' },
  { id: 'DGDA-0010', genericName: 'Ciprofloxacin', brandName: 'Cipro', strength: '0.3%', dosageForm: 'Eye Drops', manufacturer: 'Beximco', therapeuticClass: 'Antibiotic (Fluoroquinolone)', atcCode: 'J01MA02' },
  { id: 'DGDA-0011', genericName: 'Metformin', brandName: 'Metform', strength: '500mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Antidiabetic', atcCode: 'A10BA02' },
  { id: 'DGDA-0012', genericName: 'Metformin', brandName: 'Odimet', strength: '850mg', dosageForm: 'Tablet', manufacturer: 'Beximco', therapeuticClass: 'Antidiabetic', atcCode: 'A10BA02' },
  { id: 'DGDA-0013', genericName: 'Metformin', brandName: 'Glucophage', strength: '500mg', dosageForm: 'Tablet', manufacturer: 'Incepta', therapeuticClass: 'Antidiabetic', atcCode: 'A10BA02' },
  { id: 'DGDA-0014', genericName: 'Losartan', brandName: 'Losaar', strength: '50mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'ARB', atcCode: 'C09CA01' },
  { id: 'DGDA-0015', genericName: 'Losartan', brandName: 'Losar', strength: '25mg', dosageForm: 'Tablet', manufacturer: 'Beximco', therapeuticClass: 'ARB', atcCode: 'C09CA01' },
  { id: 'DGDA-0016', genericName: 'Atorvastatin', brandName: 'Atorva', strength: '10mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Statin', atcCode: 'C10AA05' },
  { id: 'DGDA-0017', genericName: 'Atorvastatin', brandName: 'Liptor', strength: '20mg', dosageForm: 'Tablet', manufacturer: 'Incepta', therapeuticClass: 'Statin', atcCode: 'C10AA05' },
  { id: 'DGDA-0018', genericName: 'Salbutamol', brandName: 'Salbetol', strength: '2mg/5ml', dosageForm: 'Syrup', manufacturer: 'Square', therapeuticClass: 'Bronchodilator', atcCode: 'R03AC02' },
  { id: 'DGDA-0019', genericName: 'Salbutamol', brandName: 'Ventolin', strength: '100mcg/dose', dosageForm: 'Inhaler', manufacturer: 'GlaxoSmithKline', therapeuticClass: 'Bronchodilator', atcCode: 'R03AC02' },
  { id: 'DGDA-0020', genericName: 'Cetirizine', brandName: 'Cetrizin', strength: '10mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Antihistamine', atcCode: 'R06AE07' },
  { id: 'DGDA-0021', genericName: 'Cetirizine', brandName: 'Alerid', strength: '1mg/ml', dosageForm: 'Syrup', manufacturer: 'ACI', therapeuticClass: 'Antihistamine', atcCode: 'R06AE07' },
  { id: 'DGDA-0022', genericName: 'Azithromycin', brandName: 'Azicin', strength: '500mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Antibiotic (Macrolide)', atcCode: 'J01FA10' },
  { id: 'DGDA-0023', genericName: 'Azithromycin', brandName: 'Zithrin', strength: '200mg/5ml', dosageForm: 'Suspension', manufacturer: 'Beximco', therapeuticClass: 'Antibiotic (Macrolide)', atcCode: 'J01FA10' },
  { id: 'DGDA-0024', genericName: 'Pantoprazole', brandName: 'Pantex', strength: '40mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'PPI', atcCode: 'A02BC02' },
  { id: 'DGDA-0025', genericName: 'Pantoprazole', brandName: 'Pantocid', strength: '40mg IV', dosageForm: 'Injection', manufacturer: 'Incepta', therapeuticClass: 'PPI', atcCode: 'A02BC02' },
  { id: 'DGDA-0026', genericName: 'Ranitidine', brandName: 'Neotack', strength: '150mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'H2 Blocker', atcCode: 'A02BA02' },
  { id: 'DGDA-0027', genericName: 'Ranitidine', brandName: 'Histac', strength: '25mg/ml', dosageForm: 'Injection', manufacturer: 'Incepta', therapeuticClass: 'H2 Blocker', atcCode: 'A02BA02' },
  { id: 'DGDA-0028', genericName: 'Diclofenac Sodium', brandName: 'Diclofen', strength: '50mg', dosageForm: 'Tablet', manufacturer: 'Beximco', therapeuticClass: 'NSAID', atcCode: 'M01AB05' },
  { id: 'DGDA-0029', genericName: 'Diclofenac Sodium', brandName: 'Voltarol', strength: '75mg/3ml', dosageForm: 'Injection', manufacturer: 'Square', therapeuticClass: 'NSAID', atcCode: 'M01AB05' },
  { id: 'DGDA-0030', genericName: 'Enalapril', brandName: 'Enapril', strength: '5mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'ACE Inhibitor', atcCode: 'C09AA02' },
  { id: 'DGDA-0031', genericName: 'Enalapril', brandName: 'Renitec', strength: '10mg', dosageForm: 'Tablet', manufacturer: 'Beximco', therapeuticClass: 'ACE Inhibitor', atcCode: 'C09AA02' },
  { id: 'DGDA-0032', genericName: 'Amlodipine', brandName: 'Amlopin', strength: '5mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'CCB', atcCode: 'C08CA01' },
  { id: 'DGDA-0033', genericName: 'Amlodipine', brandName: 'Amodip', strength: '10mg', dosageForm: 'Tablet', manufacturer: 'Beximco', therapeuticClass: 'CCB', atcCode: 'C08CA01' },
  { id: 'DGDA-0034', genericName: 'Fluoxetine', brandName: 'Fluctin', strength: '20mg', dosageForm: 'Capsule', manufacturer: 'Square', therapeuticClass: 'SSRI', atcCode: 'N06AB03' },
  { id: 'DGDA-0035', genericName: 'Fluoxetine', brandName: 'Prodep', strength: '20mg', dosageForm: 'Capsule', manufacturer: 'Incepta', therapeuticClass: 'SSRI', atcCode: 'N06AB03' },
  { id: 'DGDA-0036', genericName: 'Omeprazole', brandName: 'Omepra', strength: '20mg', dosageForm: 'Capsule', manufacturer: 'Opsonin', therapeuticClass: 'PPI', atcCode: 'A02BC01' },
  { id: 'DGDA-0037', genericName: 'Ceftriaxone', brandName: 'Cefzon', strength: '1g', dosageForm: 'Injection', manufacturer: 'Beximco', therapeuticClass: 'Antibiotic (Cephalosporin)', atcCode: 'J01DD04' },
  { id: 'DGDA-0038', genericName: 'Ceftriaxone', brandName: 'Cephtrin', strength: '250mg', dosageForm: 'Injection', manufacturer: 'Square', therapeuticClass: 'Antibiotic (Cephalosporin)', atcCode: 'J01DD04' },
  { id: 'DGDA-0039', genericName: 'Doxycycline', brandName: 'Doxinat', strength: '100mg', dosageForm: 'Capsule', manufacturer: 'Square', therapeuticClass: 'Antibiotic (Tetracycline)', atcCode: 'J01AA02' },
  { id: 'DGDA-0040', genericName: 'Doxycycline', brandName: 'Doxylin', strength: '100mg', dosageForm: 'Capsule', manufacturer: 'Incepta', therapeuticClass: 'Antibiotic (Tetracycline)', atcCode: 'J01AA02' },
  { id: 'DGDA-0041', genericName: 'Prednisolone', brandName: 'Prednisol', strength: '5mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Corticosteroid', atcCode: 'H02AB06' },
  { id: 'DGDA-0042', genericName: 'Prednisolone', brandName: 'Prednil', strength: '10mg', dosageForm: 'Tablet', manufacturer: 'Beximco', therapeuticClass: 'Corticosteroid', atcCode: 'H02AB06' },
  { id: 'DGDA-0043', genericName: 'Furosemide', brandName: 'Furosem', strength: '40mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Diuretic', atcCode: 'C03CA01' },
  { id: 'DGDA-0044', genericName: 'Furosemide', brandName: 'Lasix', strength: '20mg/2ml', dosageForm: 'Injection', manufacturer: 'Beximco', therapeuticClass: 'Diuretic', atcCode: 'C03CA01' },
  { id: 'DGDA-0045', genericName: 'Warfarin', brandName: 'Warfarin', strength: '5mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Anticoagulant', atcCode: 'B01AA03' },
  { id: 'DGDA-0046', genericName: 'Insulin Human', brandName: 'Insulin H', strength: '100 IU/ml', dosageForm: 'Injection', manufacturer: 'Beximco', therapeuticClass: 'Antidiabetic', atcCode: 'A10AB01' },
  { id: 'DGDA-0047', genericName: 'ORS', brandName: 'Oral Saline', strength: '20.5g/l', dosageForm: 'Powder', manufacturer: 'ACI', therapeuticClass: 'Electrolyte', atcCode: 'A07CA' },
  { id: 'DGDA-0048', genericName: 'Zinc Sulfate', brandName: 'Zinc', strength: '20mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Mineral Supplement', atcCode: 'A12CB01' },
  { id: 'DGDA-0049', genericName: 'Vitamin A', brandName: 'Retinol', strength: '50000 IU', dosageForm: 'Capsule', manufacturer: 'ACI', therapeuticClass: 'Vitamin', atcCode: 'A11CA01' },
  { id: 'DGDA-0050', genericName: 'Albendazole', brandName: 'Alben', strength: '400mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Anthelmintic', atcCode: 'P02CA01' },
  { id: 'DGDA-0051', genericName: 'Iron Folic Acid', brandName: 'Fe-Fol', strength: '60mg+400mcg', dosageForm: 'Tablet', manufacturer: 'ACI', therapeuticClass: 'Hematinic', atcCode: 'B03AE01' },
  { id: 'DGDA-0052', genericName: 'Mebendazole', brandName: 'Mebex', strength: '100mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Anthelmintic', atcCode: 'P02CA01' },
  { id: 'DGDA-0053', genericName: 'Dexamethasone', brandName: 'Dexamed', strength: '0.5mg', dosageForm: 'Tablet', manufacturer: 'Beximco', therapeuticClass: 'Corticosteroid', atcCode: 'H02AB02' },
  { id: 'DGDA-0054', genericName: 'Ibuprofen', brandName: 'Ibugesic', strength: '400mg', dosageForm: 'Tablet', manufacturer: 'Incepta', therapeuticClass: 'NSAID', atcCode: 'M01AE01' },
  { id: 'DGDA-0055', genericName: 'Ibuprofen', brandName: 'Brufen', strength: '200mg/5ml', dosageForm: 'Suspension', manufacturer: 'Square', therapeuticClass: 'NSAID', atcCode: 'M01AE01' },
  { id: 'DGDA-0056', genericName: 'Atenolol', brandName: 'Atenol', strength: '50mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Beta Blocker', atcCode: 'C07AB03' },
  { id: 'DGDA-0057', genericName: 'Atenolol', brandName: 'Tenormin', strength: '100mg', dosageForm: 'Tablet', manufacturer: 'Beximco', therapeuticClass: 'Beta Blocker', atcCode: 'C07AB03' },
  { id: 'DGDA-0058', genericName: 'Simvastatin', brandName: 'Simvastin', strength: '20mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Statin', atcCode: 'C10AA01' },
  { id: 'DGDA-0059', genericName: 'Hydrochlorothiazide', brandName: 'HCTZ', strength: '25mg', dosageForm: 'Tablet', manufacturer: 'Beximco', therapeuticClass: 'Diuretic', atcCode: 'C03AA03' },
  { id: 'DGDA-0060', genericName: 'Montelukast', brandName: 'Montex', strength: '10mg', dosageForm: 'Tablet', manufacturer: 'Square', therapeuticClass: 'Leukotriene Antagonist', atcCode: 'R03DC03' },
];

export function searchDrugs(query: string): DrugEntry[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return DRUG_REGISTRY.filter((d) =>
    d.genericName.toLowerCase().includes(q) ||
    d.brandName.toLowerCase().includes(q) ||
    d.id.toLowerCase().includes(q) ||
    d.manufacturer.toLowerCase().includes(q) ||
    d.therapeuticClass.toLowerCase().includes(q),
  ).slice(0, 50);
}

export function getDrugsByClass(therapeuticClass: string): DrugEntry[] {
  return DRUG_REGISTRY.filter((d) => d.therapeuticClass.toLowerCase() === therapeuticClass.toLowerCase());
}

export function getDrugClasses(): string[] {
  return [...new Set(DRUG_REGISTRY.map((d) => d.therapeuticClass))].sort();
}
