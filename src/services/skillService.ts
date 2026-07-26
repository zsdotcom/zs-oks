import { SkillDefinition, SkillCategory } from '../types';
import { dbGetAll, dbPut, dbDelete } from '../db/indexedDB';

let skillRegistry: SkillDefinition[] = [];

export async function loadSkillRegistry(): Promise<void> {
  try {
    const stored = await dbGetAll<SkillDefinition>('skills');
    skillRegistry = stored;
  } catch {
    skillRegistry = [];
  }
}

export function getSkillRegistry(): SkillDefinition[] {
  return skillRegistry;
}

export function findRelevantSkills(query: string): SkillDefinition[] {
  const queryLower = query.toLowerCase();
  return skillRegistry
    .map((skill) => {
      const triggerMatch = skill.triggers.filter((t) => queryLower.includes(t.toLowerCase())).length;
      const descMatch = skill.description.toLowerCase().includes(queryLower) ? 1 : 0;
      const score = triggerMatch + descMatch;
      return { skill, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.skill);
}

export async function addSkill(skill: SkillDefinition): Promise<void> {
  await dbPut('skills', {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    instructions: skill.instructions,
    allowedTools: skill.allowedTools,
    priority: skill.priority,
    triggers: skill.triggers,
    createdAt: skill.createdAt.toISOString(),
    updatedAt: skill.updatedAt.toISOString(),
  });
  skillRegistry.push(skill);
}

export async function removeSkill(id: string): Promise<void> {
  await dbDelete('skills', id);
  skillRegistry = skillRegistry.filter((s) => s.id !== id);
}

export const PRESET_SKILLS: SkillDefinition[] = [
  {
    id: 'outbreak-analysis', name: 'Outbreak Analysis', description: 'Analyze epidemiological outbreak data including attack rates, incubation periods, and epi curves', category: 'epidemiology', instructions: '1. Calculate attack rate using (new cases / population at risk) x 100\n2. Determine incubation period from case onset dates\n3. Generate epi curve visualization\n4. Cross-reference with WHO disease thresholds', allowedTools: ['calculate', 'draw-chart', 'search-who'], priority: 'high', triggers: ['outbreak', 'attack rate', 'incubation', 'epi curve', 'case count', 'surveillance'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'literature-review', name: 'Literature Review', description: 'Search and synthesize academic literature with proper citations', category: 'research', instructions: '1. Search multiple sources (PubMed, arXiv, OpenAlex)\n2. Extract key findings and methods\n3. Generate structured summary with citations\n4. Tag findings with confidence levels', allowedTools: ['search-pubmed', 'search-arxiv', 'search-openalex', 'search-semantic'], priority: 'high', triggers: ['literature', 'paper', 'study', 'research', 'publication', 'citation', 'review'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'report-writing', name: 'Report Writing', description: 'Draft structured reports and documents using templates', category: 'writing', instructions: '1. Apply selected template structure\n2. Format with proper headings and sections\n3. Include data visualizations where relevant\n4. Ensure all claims have citations', allowedTools: ['write-file', 'export-pdf', 'draw-chart', 'draw-diagram'], priority: 'medium', triggers: ['report', 'document', 'write', 'draft', 'template', 'format'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'statistical-analysis', name: 'Statistical Analysis', description: 'Perform statistical analysis on datasets', category: 'data', instructions: '1. Sanitize and validate input data\n2. Compute descriptive statistics\n3. Run appropriate tests (chi-square, t-test, regression)\n4. Generate visualizations with confidence intervals', allowedTools: ['calculate', 'draw-chart', 'semantic-search'], priority: 'medium', triggers: ['statistics', 'analysis', 'p-value', 'confidence', 'regression', 'chi-square', 't-test', 'dataset'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'data-fetching', name: 'Data Fetching', description: 'Fetch data from external knowledge sources', category: 'integration', instructions: '1. Select appropriate source API\n2. Format query parameters\n3. Parse and structure results\n4. Cache results to avoid redundant calls', allowedTools: ['search-wikipedia', 'search-who', 'search-cdc', 'rss-fetch'], priority: 'medium', triggers: ['fetch', 'data', 'api', 'source', 'external', 'lookup', 'get data'], createdAt: new Date(), updatedAt: new Date(),
  },
];
