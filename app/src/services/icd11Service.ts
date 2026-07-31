export interface ICD11Entry {
  code: string;
  title: string;
  chapter: string;
  description: string;
}

export interface FHIRCondition {
  resourceType: 'Condition';
  id: string;
  code: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
  clinicalStatus: string;
  verificationStatus: string;
  subject: { reference: string };
  recordedDate: string;
  notes?: string;
}

const icd11Dataset: ICD11Entry[] = [
  { code: '1A00', title: 'Cholera', chapter: 'Certain infectious or parasitic diseases', description: 'Acute diarrheal infection caused by ingestion of food or water contaminated with the bacterium Vibrio cholerae' },
  { code: '1A10', title: 'Typhoid fever', chapter: 'Certain infectious or parasitic diseases', description: 'Systemic bacterial infection caused by Salmonella typhi, transmitted through contaminated food or water' },
  { code: '1A20', title: 'Shigellosis', chapter: 'Certain infectious or parasitic diseases', description: 'Bacterial dysentery caused by Shigella species, characterized by bloody diarrhoea' },
  { code: '1B20', title: 'Tuberculosis', chapter: 'Certain infectious or parasitic diseases', description: 'Infectious disease caused by Mycobacterium tuberculosis, primarily affecting the lungs' },
  { code: '1B30', title: 'Leprosy', chapter: 'Certain infectious or parasitic diseases', description: 'Chronic infectious disease caused by Mycobacterium leprae affecting skin and peripheral nerves' },
  { code: '1C10', title: 'Malaria', chapter: 'Certain infectious or parasitic diseases', description: 'Mosquito-borne parasitic disease caused by Plasmodium species' },
  { code: '1C20', title: 'Leishmaniasis', chapter: 'Certain infectious or parasitic diseases', description: 'Parasitic disease transmitted by sandfly bites, causing cutaneous or visceral manifestations' },
  { code: '1C30', title: 'Chagas disease', chapter: 'Certain infectious or parasitic diseases', description: 'Parasitic infection caused by Trypanosoma cruzi, transmitted by triatomine bugs' },
  { code: '1D00', title: 'HIV/AIDS', chapter: 'Certain infectious or parasitic diseases', description: 'Human immunodeficiency virus infection leading to acquired immunodeficiency syndrome' },
  { code: '1D10', title: 'Hepatitis B', chapter: 'Certain infectious or parasitic diseases', description: 'Viral hepatitis caused by hepatitis B virus, transmitted through blood and bodily fluids' },
  { code: '1D20', title: 'Hepatitis C', chapter: 'Certain infectious or parasitic diseases', description: 'Viral hepatitis caused by hepatitis C virus, often leading to chronic liver disease' },
  { code: '1E10', title: 'Influenza', chapter: 'Certain infectious or parasitic diseases', description: 'Viral respiratory infection caused by influenza viruses' },
  { code: '1E20', title: 'Measles', chapter: 'Certain infectious or parasitic diseases', description: 'Highly contagious viral infection characterized by fever and maculopapular rash' },
  { code: '1E30', title: 'Mumps', chapter: 'Certain infectious or parasitic diseases', description: 'Viral infection causing swelling of the parotid glands and fever' },
  { code: '1E40', title: 'Rubella', chapter: 'Certain infectious or parasitic diseases', description: 'Viral infection with mild symptoms but serious congenital effects if contracted during pregnancy' },
  { code: '1F00', title: 'Dengue fever', chapter: 'Certain infectious or parasitic diseases', description: 'Mosquito-borne viral disease causing flu-like symptoms and potentially severe complications' },
  { code: '1F10', title: 'Zika virus disease', chapter: 'Certain infectious or parasitic diseases', description: 'Mosquito-borne flavivirus infection associated with congenital abnormalities' },
  { code: '1F20', title: 'Chikungunya', chapter: 'Certain infectious or parasitic diseases', description: 'Mosquito-borne viral disease characterized by fever and severe joint pain' },
  { code: '1F30', title: 'Yellow fever', chapter: 'Certain infectious or parasitic diseases', description: 'Acute viral haemorrhagic disease transmitted by infected mosquitoes' },
  { code: '1F40', title: 'Ebola virus disease', chapter: 'Certain infectious or parasitic diseases', description: 'Severe viral haemorrhagic fever with high case fatality rate' },
  { code: '1G00', title: 'Rabies', chapter: 'Certain infectious or parasitic diseases', description: 'Viral zoonotic disease causing progressive inflammation of the brain, almost always fatal' },
  { code: '1G10', title: 'Tetanus', chapter: 'Certain infectious or parasitic diseases', description: 'Bacterial infection causing painful muscle spasms, caused by Clostridium tetani' },
  { code: '1G20', title: 'Pertussis', chapter: 'Certain infectious or parasitic diseases', description: 'Highly contagious respiratory infection caused by Bordetella pertussis, known as whooping cough' },
  { code: '1G30', title: 'Diphtheria', chapter: 'Certain infectious or parasitic diseases', description: 'Bacterial infection affecting the respiratory tract caused by Corynebacterium diphtheriae' },
  { code: '1G40', title: 'Poliomyelitis', chapter: 'Certain infectious or parasitic diseases', description: 'Viral infection that can cause irreversible paralysis, targeted for global eradication' },
  { code: '2A00', title: 'Malignant neoplasms of breast', chapter: 'Neoplasms', description: 'Cancer originating in the breast tissue, commonly presenting as a lump or mass' },
  { code: '2A10', title: 'Malignant neoplasms of stomach', chapter: 'Neoplasms', description: 'Cancer of the stomach lining, often associated with H. pylori infection' },
  { code: '2A20', title: 'Malignant neoplasms of liver', chapter: 'Neoplasms', description: 'Primary liver cancer, often developing in the setting of cirrhosis' },
  { code: '2B10', title: 'Malignant neoplasms of lung', chapter: 'Neoplasms', description: 'Cancer originating in the lung tissue, strongly associated with tobacco smoking' },
  { code: '2B20', title: 'Malignant neoplasms of pancreas', chapter: 'Neoplasms', description: 'Cancer of the pancreas, often diagnosed at an advanced stage with poor prognosis' },
  { code: '2B30', title: 'Malignant neoplasms of ovary', chapter: 'Neoplasms', description: 'Cancer originating in the ovarian tissue, often detected at late stages' },
  { code: '2C20', title: 'Malignant neoplasms of colon', chapter: 'Neoplasms', description: 'Cancer of the large intestine, often developing from adenomatous polyps' },
  { code: '2C30', title: 'Malignant neoplasms of rectum', chapter: 'Neoplasms', description: 'Cancer of the rectum, often grouped with colon cancer as colorectal cancer' },
  { code: '2C40', title: 'Malignant neoplasms of oesophagus', chapter: 'Neoplasms', description: 'Cancer of the oesophagus, associated with smoking, alcohol, and reflux disease' },
  { code: '2D30', title: 'Leukaemia', chapter: 'Neoplasms', description: 'Cancer of the blood-forming tissues, characterized by abnormal white blood cell production' },
  { code: '2D40', title: 'Malignant neoplasms of bladder', chapter: 'Neoplasms', description: 'Cancer of the urinary bladder, strongly associated with tobacco smoking' },
  { code: '2D50', title: 'Malignant neoplasms of kidney', chapter: 'Neoplasms', description: 'Renal cell carcinoma originating in the lining of the proximal convoluted tubule' },
  { code: '2E40', title: 'Malignant neoplasms of prostate', chapter: 'Neoplasms', description: 'Cancer of the prostate gland, one of the most common cancers in men' },
  { code: '2E50', title: 'Malignant neoplasms of thyroid', chapter: 'Neoplasms', description: 'Cancer of the thyroid gland, including papillary, follicular, and medullary types' },
  { code: '2E60', title: 'Malignant neoplasms of brain', chapter: 'Neoplasms', description: 'Primary brain tumours including gliomas and meningiomas' },
  { code: '2F50', title: 'Malignant neoplasms of skin', chapter: 'Neoplasms', description: 'Skin cancer including melanoma and non-melanoma types caused by UV radiation exposure' },
  { code: '2F60', title: 'Non-Hodgkin lymphoma', chapter: 'Neoplasms', description: 'Diverse group of blood cancers affecting lymphatic tissue' },
  { code: '2F70', title: 'Multiple myeloma', chapter: 'Neoplasms', description: 'Cancer of plasma cells accumulating in the bone marrow' },
  { code: '2F80', title: 'Malignant neoplasms of cervix uteri', chapter: 'Neoplasms', description: 'Cervical cancer caused by persistent HPV infection, preventable by vaccination' },
  { code: '3A00', title: 'Anaemia', chapter: 'Diseases of the blood or blood-forming organs', description: 'Condition characterised by a decrease in the number of red blood cells or haemoglobin' },
  { code: '3A10', title: 'Iron deficiency anaemia', chapter: 'Diseases of the blood or blood-forming organs', description: 'Anaemia caused by insufficient iron stores, the most common nutritional deficiency worldwide' },
  { code: '3A20', title: 'Vitamin B12 deficiency anaemia', chapter: 'Diseases of the blood or blood-forming organs', description: 'Anaemia resulting from vitamin B12 deficiency, often due to pernicious anaemia' },
  { code: '3B10', title: 'Haemophilia', chapter: 'Diseases of the blood or blood-forming organs', description: 'Genetic bleeding disorder caused by deficiency of clotting factors' },
  { code: '3B20', title: 'Thrombocytopenia', chapter: 'Diseases of the blood or blood-forming organs', description: 'Condition of abnormally low platelet count leading to increased bleeding risk' },
  { code: '3C20', title: 'Sickle cell disorder', chapter: 'Diseases of the blood or blood-forming organs', description: 'Inherited blood disorder characterised by abnormal haemoglobin and sickle-shaped red cells' },
  { code: '3C30', title: 'Thalassaemia', chapter: 'Diseases of the blood or blood-forming organs', description: 'Inherited blood disorder with reduced haemoglobin production, common in Mediterranean regions' },
  { code: '4A00', title: 'Type 1 diabetes mellitus', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Autoimmune condition where the pancreas produces little or no insulin' },
  { code: '4A10', title: 'Thyrotoxicosis', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Excessive thyroid hormone production causing hypermetabolic state' },
  { code: '4A20', title: 'Hypothyroidism', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Deficient thyroid hormone production causing slowing of metabolic processes' },
  { code: '4B10', title: 'Type 2 diabetes mellitus', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Metabolic disorder characterised by insulin resistance and relative insulin deficiency' },
  { code: '4B20', title: 'Cushing syndrome', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Condition caused by prolonged exposure to high levels of cortisol' },
  { code: '4B30', title: 'Addison disease', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Primary adrenal insufficiency caused by destruction of the adrenal cortex' },
  { code: '4C20', title: 'Obesity', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Abnormal or excessive fat accumulation that presents a health risk' },
  { code: '4C30', title: 'Hyperlipidaemia', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Elevated levels of lipids in the blood, a major risk factor for cardiovascular disease' },
  { code: '4D30', title: 'Vitamin A deficiency', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Lack of vitamin A leading to visual impairment and increased infection risk' },
  { code: '4D40', title: 'Vitamin D deficiency', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Insufficient vitamin D levels causing bone demineralisation and rickets in children' },
  { code: '5A00', title: 'Iodine deficiency disorders', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Consequences of insufficient iodine intake, including goitre and cretinism' },
  { code: '5A10', title: 'Protein-energy malnutrition', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Deficiency of protein and energy intake including marasmus and kwashiorkor' },
  { code: '5A20', title: 'Osteoporosis', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Systemic skeletal disease characterised by low bone mass and microarchitectural deterioration' },
  { code: '5A30', title: 'Gout', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Inflammatory arthritis caused by deposition of urate crystals in joints' },
  { code: '5A40', title: 'Porphyria', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Group of disorders caused by deficiencies in haem biosynthesis enzymes' },
  { code: '6A00', title: 'Depressive disorders', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Mood disorders characterised by persistent sadness, loss of interest and impaired function' },
  { code: '6A10', title: 'Bipolar type I disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Mood disorder with manic episodes often alternating with depressive episodes' },
  { code: '6A20', title: 'Bipolar type II disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Mood disorder with hypomanic and depressive episodes without full mania' },
  { code: '6B10', title: 'Anxiety disorders', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Disorders featuring excessive fear, worry and related behavioural disturbances' },
  { code: '6B20', title: 'Panic disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Recurrent unexpected panic attacks with persistent concern about future attacks' },
  { code: '6B30', title: 'Agoraphobia', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Anxiety about being in situations where escape might be difficult or help unavailable' },
  { code: '6B40', title: 'Social anxiety disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Intense fear of social situations involving potential scrutiny by others' },
  { code: '6B50', title: 'Post-traumatic stress disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Disorder following exposure to traumatic events with re-experiencing and avoidance' },
  { code: '6C20', title: 'Schizophrenia', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Severe mental disorder characterised by distortions in thinking, perception and emotions' },
  { code: '6C30', title: 'Schizoaffective disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Disorder with combined features of schizophrenia and mood disorders' },
  { code: '6C40', title: 'Delusional disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Presence of one or more delusions persisting for at least one month' },
  { code: '6D10', title: 'Obsessive-compulsive disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Disorder with recurrent obsessions and compulsions causing significant distress' },
  { code: '6D20', title: 'Body dysmorphic disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Preoccupation with perceived defects in physical appearance' },
  { code: '6D30', title: 'Bipolar disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Mood disorder with alternating episodes of mania and depression' },
  { code: '6D40', title: 'Attention deficit hyperactivity disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Neurodevelopmental disorder with inattention, hyperactivity and impulsivity' },
  { code: '6D50', title: 'Conduct disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Repetitive pattern of behaviour violating the rights of others or age-appropriate norms' },
  { code: '6E20', title: 'Anorexia nervosa', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Eating disorder with restricted energy intake and intense fear of weight gain' },
  { code: '6E30', title: 'Bulimia nervosa', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Eating disorder with binge eating followed by compensatory purging behaviours' },
  { code: '6E40', title: 'Autism spectrum disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Neurodevelopmental condition affecting social communication and behaviour' },
  { code: '6E50', title: 'Alcohol use disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Pattern of alcohol consumption causing clinically significant impairment' },
  { code: '6E60', title: 'Opioid use disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Pattern of opioid use leading to clinically significant impairment or distress' },
  { code: '7A00', title: 'Insomnia disorders', chapter: 'Sleep-wake disorders', description: 'Persistent difficulty initiating or maintaining sleep despite adequate opportunity' },
  { code: '7A10', title: 'Hypersomnia disorders', chapter: 'Sleep-wake disorders', description: 'Excessive daytime sleepiness despite adequate nocturnal sleep' },
  { code: '7A20', title: 'Circadian rhythm sleep-wake disorder', chapter: 'Sleep-wake disorders', description: 'Misalignment between the endogenous circadian rhythm and the external sleep-wake schedule' },
  { code: '7B10', title: 'Obstructive sleep apnoea', chapter: 'Sleep-wake disorders', description: 'Sleep-related breathing disorder caused by repetitive upper airway collapse' },
  { code: '7B20', title: 'Central sleep apnoea', chapter: 'Sleep-wake disorders', description: 'Sleep-related breathing disorder with reduced ventilatory drive without airway obstruction' },
  { code: '7C20', title: 'Narcolepsy', chapter: 'Sleep-wake disorders', description: 'Neurological disorder affecting sleep-wake regulation with excessive daytime sleepiness' },
  { code: '7C30', title: 'Restless legs syndrome', chapter: 'Sleep-wake disorders', description: 'Sensorimotor disorder with urge to move legs during rest, worsening in evening' },
  { code: '8A00', title: 'Alzheimer disease', chapter: 'Diseases of the nervous system', description: 'Progressive neurodegenerative disorder and the most common cause of dementia' },
  { code: '8A10', title: 'Vascular dementia', chapter: 'Diseases of the nervous system', description: 'Dementia caused by reduced blood flow to the brain due to cerebrovascular disease' },
  { code: '8A20', title: 'Frontotemporal dementia', chapter: 'Diseases of the nervous system', description: 'Neurodegenerative disorder affecting the frontal and temporal lobes of the brain' },
  { code: '8B10', title: 'Parkinson disease', chapter: 'Diseases of the nervous system', description: 'Progressive neurodegenerative disorder affecting motor function and causing tremors' },
  { code: '8B20', title: 'Huntington disease', chapter: 'Diseases of the nervous system', description: 'Autosomal dominant neurodegenerative disorder with chorea and cognitive decline' },
  { code: '8B30', title: 'Amyotrophic lateral sclerosis', chapter: 'Diseases of the nervous system', description: 'Progressive neurodegenerative disease affecting motor neurons in brain and spinal cord' },
  { code: '8C20', title: 'Epilepsy', chapter: 'Diseases of the nervous system', description: 'Brain disorder characterised by recurrent unprovoked seizures' },
  { code: '8C30', title: 'Status epilepticus', chapter: 'Diseases of the nervous system', description: 'Prolonged seizure lasting more than five minutes requiring emergency treatment' },
  { code: '8C40', title: 'Cerebral palsy', chapter: 'Diseases of the nervous system', description: 'Group of permanent movement disorders appearing in early childhood due to brain damage' },
  { code: '8D30', title: 'Multiple sclerosis', chapter: 'Diseases of the nervous system', description: 'Autoimmune demyelinating disease of the central nervous system' },
  { code: '8D40', title: 'Acute transverse myelitis', chapter: 'Diseases of the nervous system', description: 'Inflammatory disorder of the spinal cord causing motor and sensory deficits' },
  { code: '8D50', title: 'Myasthenia gravis', chapter: 'Diseases of the nervous system', description: 'Autoimmune neuromuscular disorder causing fluctuating muscle weakness' },
  { code: '8E40', title: 'Migraine', chapter: 'Diseases of the nervous system', description: 'Recurrent primary headache disorder with moderate to severe throbbing pain' },
  { code: '8E50', title: 'Cluster headache', chapter: 'Diseases of the nervous system', description: 'Severe unilateral headache occurring in clusters with autonomic features' },
  { code: '8E60', title: 'Trigeminal neuralgia', chapter: 'Diseases of the nervous system', description: 'Neuropathic pain condition with severe electric-shock-like facial pain' },
  { code: '9A00', title: 'Cataract', chapter: 'Diseases of the visual system', description: 'Opacification of the crystalline lens leading to progressive vision loss' },
  { code: '9A10', title: 'Conjunctivitis', chapter: 'Diseases of the visual system', description: 'Inflammation of the conjunctiva caused by infection, allergy or irritants' },
  { code: '9B10', title: 'Glaucoma', chapter: 'Diseases of the visual system', description: 'Optic neuropathy often associated with elevated intraocular pressure' },
  { code: '9B20', title: 'Retinal detachment', chapter: 'Diseases of the visual system', description: 'Separation of the neurosensory retina from the retinal pigment epithelium' },
  { code: '9C20', title: 'Age-related macular degeneration', chapter: 'Diseases of the visual system', description: 'Degenerative condition affecting the macula and central vision in older adults' },
  { code: '9C30', title: 'Retinopathy of prematurity', chapter: 'Diseases of the visual system', description: 'Retinal vascular disorder affecting premature infants causing potential blindness' },
  { code: '9D30', title: 'Diabetic retinopathy', chapter: 'Diseases of the visual system', description: 'Retinal complication of diabetes mellitus causing vision loss' },
  { code: '9D40', title: 'Keratitis', chapter: 'Diseases of the visual system', description: 'Inflammation of the cornea, often caused by infection or injury' },
  { code: 'AA00', title: 'Otitis media', chapter: 'Diseases of the ear or mastoid process', description: 'Inflammation of the middle ear, commonly occurring in children' },
  { code: 'AA10', title: 'Otitis externa', chapter: 'Diseases of the ear or mastoid process', description: 'Inflammation of the external ear canal, often called swimmer\'s ear' },
  { code: 'AA20', title: 'Meniere disease', chapter: 'Diseases of the ear or mastoid process', description: 'Inner ear disorder causing vertigo, tinnitus and hearing loss' },
  { code: 'AB10', title: 'Hearing loss', chapter: 'Diseases of the ear or mastoid process', description: 'Partial or total inability to hear sound in one or both ears' },
  { code: 'AB20', title: 'Tinnitus', chapter: 'Diseases of the ear or mastoid process', description: 'Perception of sound in the absence of external acoustic stimulation' },
  { code: 'BA00', title: 'Hypertensive heart disease', chapter: 'Diseases of the circulatory system', description: 'Heart disease caused by chronic high blood pressure' },
  { code: 'BA10', title: 'Essential hypertension', chapter: 'Diseases of the circulatory system', description: 'Primary high blood pressure with no identifiable secondary cause' },
  { code: 'BA20', title: 'Pulmonary hypertension', chapter: 'Diseases of the circulatory system', description: 'High blood pressure in the pulmonary arteries causing right heart strain' },
  { code: 'BB10', title: 'Ischaemic heart disease', chapter: 'Diseases of the circulatory system', description: 'Reduced blood supply to heart muscle due to coronary artery narrowing' },
  { code: 'BB20', title: 'Acute myocardial infarction', chapter: 'Diseases of the circulatory system', description: 'Heart attack caused by acute occlusion of a coronary artery' },
  { code: 'BB30', title: 'Atrial fibrillation', chapter: 'Diseases of the circulatory system', description: 'Common cardiac arrhythmia with irregular and rapid atrial contractions' },
  { code: 'BC20', title: 'Cerebrovascular disease', chapter: 'Diseases of the circulatory system', description: 'Disorders affecting blood vessels supplying the brain, including stroke' },
  { code: 'BC30', title: 'Ischaemic stroke', chapter: 'Diseases of the circulatory system', description: 'Brain infarction caused by thrombotic or embolic occlusion of cerebral artery' },
  { code: 'BC40', title: 'Intracerebral haemorrhage', chapter: 'Diseases of the circulatory system', description: 'Bleeding within the brain tissue due to ruptured blood vessel' },
  { code: 'BD30', title: 'Heart failure', chapter: 'Diseases of the circulatory system', description: 'Inability of the heart to pump sufficient blood to meet the body\'s needs' },
  { code: 'BD40', title: 'Cardiomyopathy', chapter: 'Diseases of the circulatory system', description: 'Disease of the heart muscle causing impaired cardiac function' },
  { code: 'BD50', title: 'Peripheral arterial disease', chapter: 'Diseases of the circulatory system', description: 'Atherosclerotic narrowing of peripheral arteries causing limb ischaemia' },
  { code: 'BE10', title: 'Deep vein thrombosis', chapter: 'Diseases of the circulatory system', description: 'Blood clot formation in a deep vein, typically in the lower extremities' },
  { code: 'BE20', title: 'Pulmonary embolism', chapter: 'Diseases of the circulatory system', description: 'Blockage of pulmonary artery by thrombus originating from venous system' },
  { code: 'CA00', title: 'Asthma', chapter: 'Diseases of the respiratory system', description: 'Chronic inflammatory airway disease with variable airflow obstruction and bronchial hyperresponsiveness' },
  { code: 'CA10', title: 'Allergic rhinitis', chapter: 'Diseases of the respiratory system', description: 'Inflammation of nasal mucosa triggered by allergen exposure causing sneezing and congestion' },
  { code: 'CA20', title: 'Sinusitis', chapter: 'Diseases of the respiratory system', description: 'Inflammation of the paranasal sinuses caused by infection or allergy' },
  { code: 'CB10', title: 'Chronic obstructive pulmonary disease', chapter: 'Diseases of the respiratory system', description: 'Preventable lung disease characterised by persistent airflow limitation' },
  { code: 'CB20', title: 'Emphysema', chapter: 'Diseases of the respiratory system', description: 'Destruction of alveolar walls causing permanent enlargement of air spaces' },
  { code: 'CB30', title: 'Bronchiectasis', chapter: 'Diseases of the respiratory system', description: 'Abnormal and permanent dilation of bronchi with chronic cough and sputum production' },
  { code: 'CC20', title: 'Pneumonia', chapter: 'Diseases of the respiratory system', description: 'Infection of the lung parenchyma causing inflammation and fluid accumulation' },
  { code: 'CC30', title: 'Pulmonary fibrosis', chapter: 'Diseases of the respiratory system', description: 'Progressive scarring of lung tissue causing reduced oxygen exchange' },
  { code: 'CC40', title: 'Pleurisy', chapter: 'Diseases of the respiratory system', description: 'Inflammation of the pleural membranes causing sharp chest pain with breathing' },
  { code: 'CD10', title: 'Acute bronchitis', chapter: 'Diseases of the respiratory system', description: 'Acute inflammation of the bronchial airways, often viral in origin' },
  { code: 'DA00', title: 'Cirrhosis of the liver', chapter: 'Diseases of the digestive system', description: 'Advanced liver fibrosis with architectural distortion and nodule formation' },
  { code: 'DA10', title: 'Alcoholic liver disease', chapter: 'Diseases of the digestive system', description: 'Liver damage caused by chronic alcohol consumption including steatosis and hepatitis' },
  { code: 'DA20', title: 'Non-alcoholic fatty liver disease', chapter: 'Diseases of the digestive system', description: 'Fat accumulation in liver not caused by alcohol, associated with metabolic syndrome' },
  { code: 'DB10', title: 'Peptic ulcer disease', chapter: 'Diseases of the digestive system', description: 'Ulceration of the stomach or duodenal lining caused by acid and H. pylori infection' },
  { code: 'DB20', title: 'Gastro-oesophageal reflux disease', chapter: 'Diseases of the digestive system', description: 'Chronic reflux of stomach contents into the oesophagus causing heartburn' },
  { code: 'DB30', title: 'Gastritis', chapter: 'Diseases of the digestive system', description: 'Inflammation of the gastric mucosa, often due to H. pylori or NSAID use' },
  { code: 'DB40', title: 'Coeliac disease', chapter: 'Diseases of the digestive system', description: 'Autoimmune enteropathy triggered by gluten ingestion in genetically susceptible individuals' },
  { code: 'DC20', title: 'Inflammatory bowel disease', chapter: 'Diseases of the digestive system', description: 'Chronic inflammation of the digestive tract including Crohn disease and ulcerative colitis' },
  { code: 'DC30', title: 'Irritable bowel syndrome', chapter: 'Diseases of the digestive system', description: 'Functional bowel disorder with abdominal pain and altered bowel habits' },
  { code: 'DC40', title: 'Diverticular disease', chapter: 'Diseases of the digestive system', description: 'Presence of diverticula in the colon that may become inflamed or symptomatic' },
  { code: 'DD10', title: 'Acute pancreatitis', chapter: 'Diseases of the digestive system', description: 'Sudden inflammation of the pancreas, often caused by gallstones or alcohol' },
  { code: 'DD20', title: 'Chronic pancreatitis', chapter: 'Diseases of the digestive system', description: 'Progressive inflammatory disease of the pancreas with irreversible damage' },
  { code: 'DD30', title: 'Cholelithiasis', chapter: 'Diseases of the digestive system', description: 'Formation of gallstones in the gallbladder causing biliary colic' },
  { code: 'DD40', title: 'Appendicitis', chapter: 'Diseases of the digestive system', description: 'Acute inflammation of the vermiform appendix requiring surgical removal' },
  { code: 'EA00', title: 'Rheumatoid arthritis', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Chronic autoimmune inflammatory disease primarily affecting synovial joints' },
  { code: 'EA10', title: 'Systemic lupus erythematosus', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Autoimmune disease affecting multiple organ systems with characteristic butterfly rash' },
  { code: 'EA20', title: 'Systemic sclerosis', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Autoimmune connective tissue disease with fibrosis of skin and internal organs' },
  { code: 'EA30', title: 'Sjogren syndrome', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Autoimmune disorder causing dryness of eyes and mouth due to lymphocytic infiltration' },
  { code: 'EB10', title: 'Osteoarthritis', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Degenerative joint disease characterised by cartilage loss and bony changes' },
  { code: 'EB20', title: 'Ankylosing spondylitis', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Chronic inflammatory arthritis primarily affecting the spine and sacroiliac joints' },
  { code: 'EB30', title: 'Psoriatic arthritis', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Inflammatory arthritis associated with psoriasis' },
  { code: 'EB40', title: 'Giant cell arteritis', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Vasculitis of large and medium arteries, often involving the temporal artery' },
  { code: 'EC10', title: 'Osteomyelitis', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Bone infection caused by bacteria, typically Staphylococcus aureus' },
  { code: 'EC20', title: 'Low back pain', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Pain in the lumbar spine region, the leading cause of disability worldwide' },
  { code: 'FA00', title: 'Glomerular diseases', chapter: 'Diseases of the genitourinary system', description: 'Kidney diseases affecting the glomeruli, including nephrotic and nephritic syndromes' },
  { code: 'FA10', title: 'Chronic kidney disease', chapter: 'Diseases of the genitourinary system', description: 'Progressive loss of kidney function over months or years' },
  { code: 'FA20', title: 'Acute kidney injury', chapter: 'Diseases of the genitourinary system', description: 'Sudden decline in kidney function causing accumulation of waste products' },
  { code: 'FA30', title: 'Nephrolithiasis', chapter: 'Diseases of the genitourinary system', description: 'Formation of kidney stones causing severe colicky pain' },
  { code: 'FA40', title: 'Urinary tract infection', chapter: 'Diseases of the genitourinary system', description: 'Bacterial infection of the urinary tract, more common in women' },
  { code: 'FB10', title: 'Benign prostatic hyperplasia', chapter: 'Diseases of the genitourinary system', description: 'Non-malignant enlargement of the prostate gland causing urinary obstruction' },
  { code: 'FB20', title: 'Prostatitis', chapter: 'Diseases of the genitourinary system', description: 'Inflammation of the prostate gland, which may be acute or chronic' },
  { code: 'GA00', title: 'Erectile dysfunction', chapter: 'Conditions related to sexual health', description: 'Persistent difficulty achieving or maintaining penile erection sufficient for intercourse' },
  { code: 'GA10', title: 'Premature ejaculation', chapter: 'Conditions related to sexual health', description: 'Ejaculation that occurs with minimal stimulation before or shortly after penetration' },
  { code: 'GA20', title: 'Female sexual arousal disorder', chapter: 'Conditions related to sexual health', description: 'Persistent lack of sexual arousal or inability to maintain arousal' },
  { code: 'HA00', title: 'Spontaneous abortion', chapter: 'Pregnancy, childbirth or the puerperium', description: 'Loss of pregnancy before the fetus is viable, occurring before 20 weeks gestation' },
  { code: 'HA10', title: 'Pre-eclampsia', chapter: 'Pregnancy, childbirth or the puerperium', description: 'Hypertensive disorder of pregnancy with proteinuria after 20 weeks' },
  { code: 'HA20', title: 'Gestational diabetes mellitus', chapter: 'Pregnancy, childbirth or the puerperium', description: 'Glucose intolerance first recognised during pregnancy' },
  { code: 'HA30', title: 'Postpartum haemorrhage', chapter: 'Pregnancy, childbirth or the puerperium', description: 'Excessive bleeding after childbirth, a leading cause of maternal mortality' },
  { code: 'HA40', title: 'Preterm labour', chapter: 'Pregnancy, childbirth or the puerperium', description: 'Labour occurring before 37 completed weeks of gestation' },
  { code: 'JA00', title: 'Preterm newborn', chapter: 'Certain conditions originating in the perinatal period', description: 'Newborn delivered before 37 completed weeks of gestation requiring specialised care' },
  { code: 'JA10', title: 'Low birth weight', chapter: 'Certain conditions originating in the perinatal period', description: 'Birth weight less than 2500 grams, associated with increased neonatal morbidity' },
  { code: 'JA20', title: 'Birth asphyxia', chapter: 'Certain conditions originating in the perinatal period', description: 'Impairment of gas exchange during delivery leading to neonatal encephalopathy' },
  { code: 'JA30', title: 'Neonatal jaundice', chapter: 'Certain conditions originating in the perinatal period', description: 'Yellow discoloration of skin and eyes in newborn due to elevated bilirubin' },
  { code: 'KA00', title: 'Congenital heart anomaly', chapter: 'Developmental anomalies', description: 'Structural heart defect present at birth, including septal defects and valve abnormalities' },
  { code: 'KA10', title: 'Neural tube defect', chapter: 'Developmental anomalies', description: 'Congenital anomaly of the central nervous system including spina bifida and anencephaly' },
  { code: 'KA20', title: 'Cleft lip and palate', chapter: 'Developmental anomalies', description: 'Congenital facial cleft caused by incomplete fusion of facial processes during development' },
  { code: 'KA30', title: 'Down syndrome', chapter: 'Developmental anomalies', description: 'Genetic disorder caused by trisomy 21 with characteristic facial features and intellectual disability' },
  { code: 'LA00', title: 'Fever of unknown origin', chapter: 'Symptoms, signs or clinical findings, not elsewhere classified', description: 'Elevated body temperature without identifiable cause after initial investigation' },
  { code: 'LA10', title: 'Chronic fatigue', chapter: 'Symptoms, signs or clinical findings, not elsewhere classified', description: 'Persistent fatigue lasting more than six months affecting daily functioning' },
  { code: 'LA20', title: 'Unexplained weight loss', chapter: 'Symptoms, signs or clinical findings, not elsewhere classified', description: 'Significant decrease in body weight without intentional dietary changes' },
  { code: 'LA30', title: 'Cough', chapter: 'Symptoms, signs or clinical findings, not elsewhere classified', description: 'Common respiratory symptom that may be acute or chronic in duration' },
  { code: 'MA00', title: 'Fracture of femur', chapter: 'Injury, poisoning or certain other consequences of external causes', description: 'Break in the continuity of the femur bone, often due to trauma or osteoporosis' },
  { code: 'MA10', title: 'Fracture of radius or ulna', chapter: 'Injury, poisoning or certain other consequences of external causes', description: 'Break in the forearm bones, a common injury from falls on outstretched hand' },
  { code: 'MA20', title: 'Traumatic brain injury', chapter: 'Injury, poisoning or certain other consequences of external causes', description: 'Brain damage caused by external mechanical force leading to temporary or permanent impairment' },
  { code: 'MA30', title: 'Spinal cord injury', chapter: 'Injury, poisoning or certain other consequences of external causes', description: 'Damage to the spinal cord causing loss of motor and sensory function below injury level' },
  { code: 'MA40', title: 'Burns', chapter: 'Injury, poisoning or certain other consequences of external causes', description: 'Tissue damage caused by heat, chemicals, electricity or radiation' },
  { code: 'MA50', title: 'Poisoning by drugs or medicaments', chapter: 'Injury, poisoning or certain other consequences of external causes', description: 'Accidental or intentional exposure to pharmacological substances causing toxicity' },
  { code: 'NA00', title: 'Road traffic accident', chapter: 'External causes of morbidity or mortality', description: 'Injury caused by collision involving any vehicle on a public road' },
  { code: 'NA10', title: 'Fall', chapter: 'External causes of morbidity or mortality', description: 'Unintentional descent to a lower level causing injury, common in elderly' },
  { code: 'NA20', title: 'Drowning', chapter: 'External causes of morbidity or mortality', description: 'Respiratory impairment from submersion in liquid, potentially fatal' },
  { code: 'OA00', title: 'Encounter for immunization', chapter: 'Factors influencing health status or contact with health services', description: 'Healthcare visit for administration of vaccines for disease prevention' },
  { code: 'OA10', title: 'Screening for malignant neoplasm', chapter: 'Factors influencing health status or contact with health services', description: 'Asymptomatic testing for early detection of cancer in at-risk populations' },
  { code: 'OA20', title: 'Medical check-up', chapter: 'Factors influencing health status or contact with health services', description: 'Routine health examination in the absence of specific complaints' },
  { code: 'PA00', title: 'SARS-CoV-2 acute respiratory disease', chapter: 'Codes for special purposes', description: 'Acute respiratory illness caused by SARS-CoV-2 virus, the cause of COVID-19 pandemic' },
  { code: 'PA10', title: 'Long COVID', chapter: 'Codes for special purposes', description: 'Post-COVID condition with persistent symptoms lasting weeks or months after initial infection' },
  { code: 'QA00', title: 'Traditional medicine disorder pattern', chapter: 'Supplementary Chapter Traditional Medicine Conditions', description: 'Pattern of disharmony in traditional medicine systems for diagnostic and treatment purposes' },
];

export function getAllICD11Codes(): ICD11Entry[] {
  return icd11Dataset;
}

export function getICD11ByCode(code: string): ICD11Entry | undefined {
  return icd11Dataset.find((entry) => entry.code === code);
}

export function searchICD11(query: string): ICD11Entry[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return icd11Dataset.filter(
    (entry) =>
      entry.code.toLowerCase().includes(lower) ||
      entry.title.toLowerCase().includes(lower) ||
      entry.chapter.toLowerCase().includes(lower) ||
      entry.description.toLowerCase().includes(lower)
  );
}

export function getICD11ByChapter(chapter: string): ICD11Entry[] {
  return icd11Dataset.filter((entry) =>
    entry.chapter.toLowerCase() === chapter.toLowerCase()
  );
}

export function icd11ToFHIR(entry: ICD11Entry, patientId?: string): FHIRCondition {
  return {
    resourceType: 'Condition',
    id: `cond-${entry.code}-${Date.now()}`,
    code: {
      coding: [{
        system: 'http://id.who.int/icd/release/11/mms',
        code: entry.code,
        display: entry.title,
      }],
    },
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    subject: { reference: `Patient/${patientId || 'unknown'}` },
    recordedDate: new Date().toISOString().split('T')[0],
  };
}

const ICD11_CANONICAL = 'http://id.who.int/icd/release/11/mms';
const ICD11_LEGACY = 'http://id.who.int/icd11/mms';

export function FHIRToICD11(condition: FHIRCondition): ICD11Entry | undefined {
  const ICD11_SYSTEMS = [ICD11_CANONICAL, ICD11_LEGACY];
  const coding = condition.code.coding.find(c => ICD11_SYSTEMS.some(s => c.system === s));
  if (!coding) return undefined;
  return getICD11ByCode(coding.code);
}

/* ─── WHO API Live Search with fallback ─── */

let whoToken: string | null = null;
let tokenExpiry = 0;

async function getWHOToken(): Promise<string> {
  if (whoToken && Date.now() < tokenExpiry) return whoToken;
  try {
    const res = await fetch('https://icdaccessmanagement.who.int/connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'client_id=icdapi&grant_type=ICDClientCredentials&scope=icdapi_access',
    });
    if (!res.ok) throw new Error(`Token error: ${res.status}`);
    const data = await res.json();
    whoToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000 - 60000;
    return whoToken!;
  } catch {
    throw new Error('WHO API token acquisition failed');
  }
}

export async function searchICD11Live(query: string): Promise<ICD11Entry[]> {
  if (!query.trim()) return [];
  try {
    const token = await getWHOToken();
    const res = await fetch(`https://id.who.int/icd/release/11/mms/search?q=${encodeURIComponent(query)}&useHighlighting=false&flatResults=true`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'API-Version': 'v2',
      },
    });
    if (!res.ok) throw new Error(`WHO API error: ${res.status}`);
    const data = await res.json();
    const entries: ICD11Entry[] = (data.destinationEntities || []).map((item: any) => {
      const code = item.theCode || item.code || '';
      const title = item.title?.value || '';
      const chapter = item.parentTitle?.value || '';
      const def = item.definition?.value || item.longDefinition?.value || '';
      return { code, title, chapter, description: def };
    });
    if (entries.length > 0) return entries.slice(0, 25);
    throw new Error('No results from WHO API');
  } catch {
    return searchICD11(query);
  }
}

export async function searchICD11WithFallback(query: string): Promise<ICD11Entry[]> {
  try {
    const results = await searchICD11Live(query);
    if (results.length > 0) return results;
  } catch {}
  return searchICD11(query);
}

export function searchICD11ByFHIR(fhirResource: any): ICD11Entry[] {
  const searchTerms: string[] = [];
  if (fhirResource.code?.coding) {
    fhirResource.code.coding.forEach((c: any) => {
      if (c.display) searchTerms.push(c.display);
      if (c.code) searchTerms.push(c.code);
    });
  }
  if (fhirResource.bodySite?.coding) {
    fhirResource.bodySite.coding.forEach((c: any) => {
      if (c.display) searchTerms.push(c.display);
    });
  }
  return searchTerms.flatMap(t => searchICD11(t));
}
