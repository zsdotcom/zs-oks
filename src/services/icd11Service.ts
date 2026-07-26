export interface ICD11Entry {
  code: string;
  title: string;
  chapter: string;
  description: string;
}

const icd11Dataset: ICD11Entry[] = [
  { code: '1A00', title: 'Cholera', chapter: 'Certain infectious or parasitic diseases', description: 'Acute diarrheal infection caused by ingestion of food or water contaminated with the bacterium Vibrio cholerae' },
  { code: '1B20', title: 'Tuberculosis', chapter: 'Certain infectious or parasitic diseases', description: 'Infectious disease caused by Mycobacterium tuberculosis, primarily affecting the lungs' },
  { code: '1C10', title: 'Malaria', chapter: 'Certain infectious or parasitic diseases', description: 'Mosquito-borne parasitic disease caused by Plasmodium species' },
  { code: '1D00', title: 'HIV/AIDS', chapter: 'Certain infectious or parasitic diseases', description: 'Human immunodeficiency virus infection leading to acquired immunodeficiency syndrome' },
  { code: '1E10', title: 'Influenza', chapter: 'Certain infectious or parasitic diseases', description: 'Viral respiratory infection caused by influenza viruses' },
  { code: '1F00', title: 'Dengue fever', chapter: 'Certain infectious or parasitic diseases', description: 'Mosquito-borne viral disease causing flu-like symptoms and potentially severe complications' },
  { code: '2A00', title: 'Malignant neoplasms of breast', chapter: 'Neoplasms', description: 'Cancer originating in the breast tissue, commonly presenting as a lump or mass' },
  { code: '2B10', title: 'Malignant neoplasms of lung', chapter: 'Neoplasms', description: 'Cancer originating in the lung tissue, strongly associated with tobacco smoking' },
  { code: '2C20', title: 'Malignant neoplasms of colon', chapter: 'Neoplasms', description: 'Cancer of the large intestine, often developing from adenomatous polyps' },
  { code: '2D30', title: 'Leukaemia', chapter: 'Neoplasms', description: 'Cancer of the blood-forming tissues, characterized by abnormal white blood cell production' },
  { code: '2E40', title: 'Malignant neoplasms of prostate', chapter: 'Neoplasms', description: 'Cancer of the prostate gland, one of the most common cancers in men' },
  { code: '2F50', title: 'Malignant neoplasms of skin', chapter: 'Neoplasms', description: 'Skin cancer including melanoma and non-melanoma types caused by UV radiation exposure' },
  { code: '3A00', title: 'Anaemia', chapter: 'Diseases of the blood or blood-forming organs', description: 'Condition characterised by a decrease in the number of red blood cells or haemoglobin' },
  { code: '3B10', title: 'Haemophilia', chapter: 'Diseases of the blood or blood-forming organs', description: 'Genetic bleeding disorder caused by deficiency of clotting factors' },
  { code: '3C20', title: 'Sickle cell disorder', chapter: 'Diseases of the blood or blood-forming organs', description: 'Inherited blood disorder characterised by abnormal haemoglobin and sickle-shaped red cells' },
  { code: '4A00', title: 'Type 1 diabetes mellitus', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Autoimmune condition where the pancreas produces little or no insulin' },
  { code: '4B10', title: 'Type 2 diabetes mellitus', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Metabolic disorder characterised by insulin resistance and relative insulin deficiency' },
  { code: '4C20', title: 'Obesity', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Abnormal or excessive fat accumulation that presents a health risk' },
  { code: '4D30', title: 'Vitamin A deficiency', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Lack of vitamin A leading to visual impairment and increased infection risk' },
  { code: '5A00', title: 'Iodine deficiency disorders', chapter: 'Endocrine, nutritional or metabolic diseases', description: 'Consequences of insufficient iodine intake, including goitre and cretinism' },
  { code: '6A00', title: 'Depressive disorders', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Mood disorders characterised by persistent sadness, loss of interest and impaired function' },
  { code: '6B10', title: 'Anxiety disorders', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Disorders featuring excessive fear, worry and related behavioural disturbances' },
  { code: '6C20', title: 'Schizophrenia', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Severe mental disorder characterised by distortions in thinking, perception and emotions' },
  { code: '6D30', title: 'Bipolar disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Mood disorder with alternating episodes of mania and depression' },
  { code: '6E40', title: 'Autism spectrum disorder', chapter: 'Mental, behavioural or neurodevelopmental disorders', description: 'Neurodevelopmental condition affecting social communication and behaviour' },
  { code: '7A00', title: 'Insomnia disorders', chapter: 'Sleep-wake disorders', description: 'Persistent difficulty initiating or maintaining sleep despite adequate opportunity' },
  { code: '7B10', title: 'Obstructive sleep apnoea', chapter: 'Sleep-wake disorders', description: 'Sleep-related breathing disorder caused by repetitive upper airway collapse' },
  { code: '7C20', title: 'Narcolepsy', chapter: 'Sleep-wake disorders', description: 'Neurological disorder affecting sleep-wake regulation with excessive daytime sleepiness' },
  { code: '8A00', title: 'Alzheimer disease', chapter: 'Diseases of the nervous system', description: 'Progressive neurodegenerative disorder and the most common cause of dementia' },
  { code: '8B10', title: 'Parkinson disease', chapter: 'Diseases of the nervous system', description: 'Progressive neurodegenerative disorder affecting motor function and causing tremors' },
  { code: '8C20', title: 'Epilepsy', chapter: 'Diseases of the nervous system', description: 'Brain disorder characterised by recurrent unprovoked seizures' },
  { code: '8D30', title: 'Multiple sclerosis', chapter: 'Diseases of the nervous system', description: 'Autoimmune demyelinating disease of the central nervous system' },
  { code: '8E40', title: 'Migraine', chapter: 'Diseases of the nervous system', description: 'Recurrent primary headache disorder with moderate to severe throbbing pain' },
  { code: '9A00', title: 'Cataract', chapter: 'Diseases of the visual system', description: 'Opacification of the crystalline lens leading to progressive vision loss' },
  { code: '9B10', title: 'Glaucoma', chapter: 'Diseases of the visual system', description: 'Optic neuropathy often associated with elevated intraocular pressure' },
  { code: '9C20', title: 'Age-related macular degeneration', chapter: 'Diseases of the visual system', description: 'Degenerative condition affecting the macula and central vision in older adults' },
  { code: '9D30', title: 'Diabetic retinopathy', chapter: 'Diseases of the visual system', description: 'Retinal complication of diabetes mellitus causing vision loss' },
  { code: 'AA00', title: 'Otitis media', chapter: 'Diseases of the ear or mastoid process', description: 'Inflammation of the middle ear, commonly occurring in children' },
  { code: 'AB10', title: 'Hearing loss', chapter: 'Diseases of the ear or mastoid process', description: 'Partial or total inability to hear sound in one or both ears' },
  { code: 'BA00', title: 'Hypertensive heart disease', chapter: 'Diseases of the circulatory system', description: 'Heart disease caused by chronic high blood pressure' },
  { code: 'BB10', title: 'Ischaemic heart disease', chapter: 'Diseases of the circulatory system', description: 'Reduced blood supply to heart muscle due to coronary artery narrowing' },
  { code: 'BC20', title: 'Cerebrovascular disease', chapter: 'Diseases of the circulatory system', description: 'Disorders affecting blood vessels supplying the brain, including stroke' },
  { code: 'BD30', title: 'Heart failure', chapter: 'Diseases of the circulatory system', description: 'Inability of the heart to pump sufficient blood to meet the body\'s needs' },
  { code: 'CA00', title: 'Asthma', chapter: 'Diseases of the respiratory system', description: 'Chronic inflammatory airway disease with variable airflow obstruction and bronchial hyperresponsiveness' },
  { code: 'CB10', title: 'Chronic obstructive pulmonary disease', chapter: 'Diseases of the respiratory system', description: 'Preventable lung disease characterised by persistent airflow limitation' },
  { code: 'CC20', title: 'Pneumonia', chapter: 'Diseases of the respiratory system', description: 'Infection of the lung parenchyma causing inflammation and fluid accumulation' },
  { code: 'DA00', title: 'Cirrhosis of the liver', chapter: 'Diseases of the digestive system', description: 'Advanced liver fibrosis with architectural distortion and nodule formation' },
  { code: 'DB10', title: 'Peptic ulcer disease', chapter: 'Diseases of the digestive system', description: 'Ulceration of the stomach or duodenal lining caused by acid and H. pylori infection' },
  { code: 'DC20', title: 'Inflammatory bowel disease', chapter: 'Diseases of the digestive system', description: 'Chronic inflammation of the digestive tract including Crohn disease and ulcerative colitis' },
  { code: 'EA00', title: 'Rheumatoid arthritis', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Chronic autoimmune inflammatory disease primarily affecting synovial joints' },
  { code: 'EB10', title: 'Osteoarthritis', chapter: 'Diseases of the musculoskeletal system or connective tissue', description: 'Degenerative joint disease characterised by cartilage loss and bony changes' },
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
