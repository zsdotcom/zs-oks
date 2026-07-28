import { SkillDefinition } from '../types';
import { dbGetAll, dbPut, dbDelete } from '../db/indexedDB';

let skillRegistry: SkillDefinition[] = [];

export async function loadSkillRegistry(): Promise<void> {
  try {
    const stored = await dbGetAll<any>('skills');
    skillRegistry = stored.map((s: any) => ({ ...s, createdAt: new Date(s.createdAt), updatedAt: new Date(s.updatedAt) }));
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
    id: 'literature-review', name: 'Literature Review', description: 'Search and synthesize academic literature with proper citations', category: 'research', instructions: '1. Search multiple sources (PubMed, arXiv, OpenAlex)\n2. Extract key findings and methods\n3. Generate structured summary with citations\n4. Tag findings with confidence levels', allowedTools: ['search-pubmed', 'search-arxiv', 'search-openalex', 'semantic-search'], priority: 'high', triggers: ['literature', 'paper', 'study', 'research', 'publication', 'citation', 'review'], createdAt: new Date(), updatedAt: new Date(),
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
  {
    id: 'attack-rate-calc', name: 'Attack Rate Calculator', description: 'Calculate epidemiological attack rates from case data', category: 'epidemiology', instructions: '1. Collect case count and population at risk\n2. Apply formula: (new cases / population) x 100\n3. Express as percentage with confidence interval', allowedTools: ['calculate'], priority: 'medium', triggers: ['attack rate', 'attack-rate', 'case count', 'population at risk', 'incidence rate'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'epi-curve', name: 'Epi Curve Generator', description: 'Generate epidemic curves from case onset dates', category: 'epidemiology', instructions: '1. Collect case data with onset dates\n2. Group cases by date interval (daily/weekly)\n3. Generate bar chart showing case count over time\n4. Highlight outbreak period thresholds', allowedTools: ['calculate', 'draw-chart'], priority: 'high', triggers: ['epi curve', 'epidemic curve', 'case onset', 'outbreak curve', 'temporal distribution'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'r0-estimator', name: 'R0 Estimator', description: 'Estimate basic reproduction number from epidemic data', category: 'epidemiology', instructions: '1. Collect case count data over time\n2. Estimate serial interval\n3. Apply R0 estimation formula\n4. Provide confidence interval for estimate', allowedTools: ['calculate', 'draw-chart'], priority: 'medium', triggers: ['r0', 'reproduction number', 'basic reproduction', 'r naught', 'transmissibility'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'chi-square-test', name: 'Chi-Square Test', description: 'Perform chi-square statistical test on categorical data', category: 'data', instructions: '1. Validate input is categorical data\n2. Build contingency table\n3. Calculate chi-square statistic and p-value\n4. Report significance at alpha=0.05', allowedTools: ['calculate'], priority: 'medium', triggers: ['chi-square', 'chi square', 'categorical', 'contingency table', 'goodness of fit'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'confidence-interval', name: 'Confidence Interval Calculator', description: 'Calculate confidence intervals for proportions and means', category: 'data', instructions: '1. Determine sample statistics (mean, proportion, SD)\n2. Select appropriate distribution (normal, t)\n3. Calculate interval at requested confidence level\n4. Report lower and upper bounds', allowedTools: ['calculate'], priority: 'medium', triggers: ['confidence interval', 'ci', 'margin of error', 'confidence level'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'data-clean', name: 'Data Cleaning', description: 'Clean and normalize datasets for analysis', category: 'data', instructions: '1. Detect and handle missing values\n2. Normalize date/number formats\n3. Detect and flag outliers\n4. Generate cleaning report', allowedTools: ['calculate', 'read-file', 'write-file'], priority: 'medium', triggers: ['clean data', 'data cleaning', 'normalize', 'missing values', 'outliers', 'data quality'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'outbreak-detection', name: 'Outbreak Detection', description: 'Detect anomalies in surveillance data streams', category: 'epidemiology', instructions: '1. Establish baseline incidence from historical data\n2. Apply detection algorithm (e.g., CUSUM, moving average)\n3. Flag values exceeding threshold\n4. Generate alert with case details', allowedTools: ['calculate', 'search-cdc', 'draw-chart'], priority: 'high', triggers: ['outbreak detection', 'anomaly', 'surveillance', 'alert', 'threshold exceedance', 'cluster detection'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'outbreak-research', name: 'Outbreak Research', description: 'Disease-specific outbreak data gathering from WHO and CDC', category: 'research', instructions: '1. Identify disease and geographical region\n2. Query WHO GHO and CDC WONDER databases\n3. Cross-reference with Wikipedia outbreak pages\n4. Compile outbreak timeline and key statistics', allowedTools: ['search-who', 'search-cdc', 'search-wikipedia'], priority: 'high', triggers: ['outbreak research', 'disease outbreak', 'epidemic research', 'pandemic data'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'guideline-research', name: 'Guideline Research', description: 'Retrieve clinical and public health guidelines', category: 'research', instructions: '1. Identify relevant health authority (WHO, CDC)\n2. Search for guideline documents\n3. Extract key recommendations\n4. Note publication date and version', allowedTools: ['search-who', 'search-wikipedia'], priority: 'medium', triggers: ['guideline', 'protocol', 'standard', 'recommendation', 'clinical guidance', 'best practice'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'source-evaluate', name: 'Source Evaluation', description: 'Evaluate source credibility using CRAAP test', category: 'research', instructions: '1. Check Currency: publication date and timeliness\n2. Check Relevance: does it address the research question?\n3. Check Authority: author credentials and publisher reputation\n4. Check Accuracy: is the information supported by evidence?\n5. Check Purpose: identify bias or agenda', allowedTools: ['read-file'], priority: 'medium', triggers: ['source evaluation', 'credibility', 'crap test', 'source quality', 'fact check'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'policy-brief', name: 'Policy Brief', description: 'Create policy briefs from research findings', category: 'writing', instructions: '1. Extract key findings and recommendations\n2. Structure: executive summary, background, findings, recommendations, references\n3. Keep concise (2-4 pages)\n4. Include actionable recommendations', allowedTools: ['write-file', 'export-pdf'], priority: 'medium', triggers: ['policy brief', 'policy paper', 'briefing', 'policy recommendation', 'executive brief'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'protocol-template', name: 'Protocol Template', description: 'Generate research protocol documents', category: 'writing', instructions: '1. Apply standard protocol structure\n2. Include: objectives, methodology, data collection, analysis plan, ethics\n3. Ensure all sections are complete\n4. Add timeline and milestones', allowedTools: ['write-file', 'read-file'], priority: 'medium', triggers: ['protocol', 'research protocol', 'study protocol', 'methodology plan', 'research plan'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'citation-format', name: 'Citation Formatter', description: 'Apply consistent citation styles (APA, Vancouver, MLA)', category: 'writing', instructions: '1. Identify citation style (APA default)\n2. Extract citation metadata (author, date, title, source, DOI)\n3. Format each citation according to style rules\n4. Order citations alphabetically or by appearance', allowedTools: ['read-file', 'write-file'], priority: 'low', triggers: ['citation', 'reference', 'bibliography', 'apa', 'vancouver', 'mla', 'cite'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'executive-summary', name: 'Executive Summary', description: 'Extract key findings into executive summary format', category: 'writing', instructions: '1. Read the full document\n2. Identify: problem statement, methods, key findings, conclusions, recommendations\n3. Write concise summary (10-15% of original length)\n4. Use bullet points for key metrics', allowedTools: ['read-file', 'write-file'], priority: 'low', triggers: ['executive summary', 'summary', 'abstract', 'key findings', 'brief'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'workflow-decompose', name: 'Workflow Decomposition', description: 'Break complex tasks into sub-tasks for delegation', category: 'integration', instructions: '1. Analyze the user request for complexity\n2. Identify component steps and dependencies\n3. Map each sub-task to appropriate agent type\n4. Generate ordered task list with rationale', allowedTools: ['send-message', 'list-agents'], priority: 'high', triggers: ['decompose', 'break down', 'sub-task', 'task list', 'workflow', 'plan'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'workflow-delegate', name: 'Workflow Delegation', description: 'Assign tasks to specialized agents via A2A protocol', category: 'integration', instructions: '1. Select appropriate agent based on task type\n2. Package task with clear instructions and context\n3. Send via A2A protocol\n4. Track delegation status', allowedTools: ['send-message', 'spawn-agent', 'status-track'], priority: 'high', triggers: ['delegate', 'assign', 'send to agent', 'dispatch'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'workflow-validate', name: 'Workflow Validation', description: 'Quality-check agent outputs before merging', category: 'integration', instructions: '1. Review agent output for completeness\n2. Verify against original task requirements\n3. Check for internal consistency\n4. Approve or request revision', allowedTools: ['read-file', 'send-message', 'semantic-search'], priority: 'high', triggers: ['validate', 'verify', 'quality check', 'approve', 'review output'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'workflow-merge', name: 'Workflow Merge', description: 'Combine multiple agent outputs into unified response', category: 'integration', instructions: '1. Collect all delegated agent outputs\n2. Identify overlapping or contradictory content\n3. Merge into cohesive final response\n4. Add synthesis commentary where valuable', allowedTools: ['read-file', 'write-file'], priority: 'high', triggers: ['merge', 'combine', 'synthesize', 'unify', 'consolidate'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'memory-maintenance', name: 'Memory Maintenance', description: 'Organize, compress, and archive memory entries', category: 'integration', instructions: '1. Check memory usage across all tiers\n2. Compress episodic memory by summarizing old sessions\n3. Archive expired working memory\n4. Generate memory usage report', allowedTools: ['remember', 'recall', 'forget', 'vectorize'], priority: 'medium', triggers: ['memory maintenance', 'compress', 'archive', 'cleanup memory', 'organize memory'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'knowledge-refresh', name: 'Knowledge Refresh', description: 'Update knowledge base from free external sources', category: 'integration', instructions: '1. Check last-refresh timestamps for each topic\n2. Identify topics not updated in >7 days\n3. Fetch new content from external APIs\n4. Generate vector embeddings for new content\n5. Update semantic search index', allowedTools: ['search-wikipedia', 'search-openalex', 'vectorize', 'semantic-search', 'remember'], priority: 'low', triggers: ['knowledge refresh', 'update knowledge', 'refresh sources', 'sync knowledge'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'index-rebuild', name: 'Index Rebuild', description: 'Rebuild semantic search index from stored memory', category: 'integration', instructions: '1. Clear existing Orama search index\n2. Read all semantic entries from IndexedDB\n3. Re-insert all entries into Orama\n4. Verify search returns expected results', allowedTools: ['semantic-search', 'vectorize'], priority: 'low', triggers: ['rebuild index', 'reindex', 'reset search', 'rebuild search'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'reference-manager', name: 'Reference Manager', description: 'Maintain bibliography and citation database', category: 'integration', instructions: '1. Collect all cited sources from project documents\n2. Deduplicate entries\n3. Format citations in consistent style\n4. Generate full bibliography', allowedTools: ['read-file', 'write-file', 'semantic-search'], priority: 'low', triggers: ['reference', 'bibliography', 'citation management', 'manage references'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'glossary-build', name: 'Glossary Builder', description: 'Build project-specific terminology glossary', category: 'integration', instructions: '1. Scan project documents for technical terms\n2. Define each term in context\n3. Cross-reference related terms\n4. Generate alphabetized glossary', allowedTools: ['read-file', 'write-file'], priority: 'low', triggers: ['glossary', 'terminology', 'define terms', 'vocabulary'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'quality-check', name: 'Quality Check', description: 'Validate output quality against project standards', category: 'integration', instructions: '1. Check document structure and completeness\n2. Verify all required sections are present\n3. Assess writing quality and clarity\n4. Rate overall quality on scale 1-5', allowedTools: ['read-file', 'write-file'], priority: 'high', triggers: ['quality check', 'quality review', 'quality assurance', 'validate quality'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'consistency-audit', name: 'Consistency Audit', description: 'Check for contradictions across multiple outputs', category: 'integration', instructions: '1. Cross-reference numbers and statistics across all outputs\n2. Identify conflicting statements or conclusions\n3. Flag unreconciled differences\n4. Recommend resolution', allowedTools: ['read-file', 'calculate', 'semantic-search'], priority: 'medium', triggers: ['consistency', 'contradiction', 'cross-reference', 'audit', 'verify consistency'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'citation-audit', name: 'Citation Audit', description: 'Verify all citations are valid and complete', category: 'integration', instructions: '1. Extract all citations from document\n2. Verify each citation has author, date, title, source\n3. Check URL validity where applicable\n4. Flag incomplete or suspicious citations', allowedTools: ['read-file', 'write-file'], priority: 'high', triggers: ['citation audit', 'verify citations', 'check references', 'citation validation'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'methodology-review', name: 'Methodology Review', description: 'Review analytical methodology for logical flaws', category: 'integration', instructions: '1. Examine the analytical approach used\n2. Check for appropriate statistical methods\n3. Identify potential biases or confounders\n4. Assess reproducibility of results', allowedTools: ['read-file', 'calculate'], priority: 'medium', triggers: ['methodology review', 'methods review', 'analytical review', 'statistical review'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'compliance-check', name: 'Compliance Check', description: 'Check outputs against WHO/CDC reporting standards', category: 'integration', instructions: '1. Identify applicable reporting standards\n2. Check document against standard checklist\n3. Flag missing required elements\n4. Recommend remediation', allowedTools: ['read-file', 'search-who', 'search-cdc'], priority: 'medium', triggers: ['compliance', 'who standards', 'cdc standards', 'regulatory', 'reporting standard'], createdAt: new Date(), updatedAt: new Date(),
  },
  /* ─── Code Skills ─── */
  {
    id: 'code-review-skill', name: 'Code Review', description: 'Review source code for bugs, style issues, and security vulnerabilities', category: 'code', instructions: '1. Parse the source code to identify the language\n2. Check for OWASP Top 10 vulnerabilities\n3. Review code style and formatting against standards\n4. Identify performance anti-patterns\n5. Check error handling completeness\n6. Generate structured findings with severity levels', allowedTools: ['code-review', 'dependency-analyze', 'code-format', 'read-file', 'write-file'], priority: 'high', triggers: ['code review', 'review code', 'audit code', 'check code', 'code quality', 'security audit'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'test-generation-skill', name: 'Test Generation', description: 'Generate unit and integration tests from source code', category: 'code', instructions: '1. Analyze source code to identify functions, classes, and modules\n2. Determine appropriate testing framework\n3. Identify edge cases and error conditions\n4. Generate test cases covering all paths\n5. Include assertions for expected outcomes\n6. Add test setup and teardown patterns', allowedTools: ['test-generate', 'read-file', 'write-file', 'calculate'], priority: 'high', triggers: ['test generation', 'generate tests', 'unit tests', 'integration tests', 'test cases', 'test coverage'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'dependency-analysis-skill', name: 'Dependency Analysis', description: 'Analyze code dependencies between files, modules, and packages', category: 'code', instructions: '1. Scan codebase for import/require statements\n2. Build dependency graph structure\n3. Identify circular dependencies\n4. Flag unused or orphaned modules\n5. Suggest dependency optimization', allowedTools: ['dependency-analyze', 'read-file', 'write-file'], priority: 'medium', triggers: ['dependency analysis', 'dependency graph', 'circular dependency', 'import analysis', 'module dependencies'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'code-documentation-skill', name: 'Code Documentation', description: 'Generate documentation comments and API docs from source code', category: 'code', instructions: '1. Parse source code structure (functions, classes, interfaces)\n2. Generate JSDoc/PyDoc/RST comments\n3. Document parameters, return types, and exceptions\n4. Add usage examples\n5. Generate API reference documentation', allowedTools: ['code-docgen', 'api-spec-gen', 'read-file', 'write-file'], priority: 'medium', triggers: ['code documentation', 'document code', 'jsdoc', 'api docs', 'generate docs', 'documentation generation'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'api-spec-gen-skill', name: 'API Spec Generation', description: 'Generate OpenAPI/Swagger specifications from API descriptions', category: 'code', instructions: '1. Analyze the API description or code\n2. Identify endpoints, methods, and parameters\n3. Define request/response schemas\n4. Add authentication requirements\n5. Generate OpenAPI 3.0 spec in YAML/JSON', allowedTools: ['api-spec-gen', 'read-file', 'write-file'], priority: 'medium', triggers: ['api spec', 'openapi', 'swagger', 'api specification', 'rest api docs'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'sql-query-skill', name: 'SQL Query Builder', description: 'Generate SQL queries from natural language descriptions', category: 'code', instructions: '1. Parse the query requirements from natural language\n2. Identify tables, columns, and relationships\n3. Generate SELECT/INSERT/UPDATE/DELETE statements\n4. Add proper WHERE clauses and JOINs\n5. Include error handling and parameterization', allowedTools: ['sql-query', 'read-file', 'write-file'], priority: 'medium', triggers: ['sql query', 'sql', 'database query', 'query builder', 'generate sql', 'write query'], createdAt: new Date(), updatedAt: new Date(),
  },
  /* ─── Media & Content Skills ─── */
  {
    id: 'entity-extraction-skill', name: 'Entity Extraction', description: 'Extract named entities from text including people, places, dates, and organizations', category: 'media', instructions: '1. Parse the input text\n2. Identify named entities using pattern matching\n3. Classify each entity by type (person, location, date, org, etc.)\n4. Deduplicate and normalize entities\n5. Return structured entity list with counts', allowedTools: ['entity-extract', 'text-summarize', 'read-file', 'write-file'], priority: 'medium', triggers: ['entity extraction', 'named entities', 'extract names', 'ner', 'extract information'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'text-summarization-skill', name: 'Text Summarization', description: 'Generate concise, extractive or abstractive summaries of long texts', category: 'media', instructions: '1. Read and analyze the full text\n2. Identify key themes and findings\n3. Generate a concise summary (10-15% of original length)\n4. Preserve critical data points and conclusions\n5. Use bullet points for key metrics', allowedTools: ['text-summarize', 'entity-extract', 'read-file', 'write-file'], priority: 'medium', triggers: ['summarize', 'summary', 'text summarization', 'condense', 'tl dr', 'brief'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'sentiment-analysis-skill', name: 'Sentiment Analysis', description: 'Analyze text sentiment and emotional tone', category: 'media', instructions: '1. Analyze the text for emotional valence\n2. Classify as positive, negative, or neutral\n3. Score sentiment intensity (0-100)\n4. Identify key sentiment-driving phrases\n5. Generate sentiment report with visualization data', allowedTools: ['sentiment-analyze', 'entity-extract', 'read-file', 'write-file'], priority: 'low', triggers: ['sentiment', 'sentiment analysis', 'tone analysis', 'emotional analysis', 'opinion mining'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'topic-modeling-skill', name: 'Topic Modeling', description: 'Identify and extract key topics and themes from text collections', category: 'media', instructions: '1. Analyze document collection for recurring themes\n2. Cluster related terms and concepts\n3. Assign topic labels to each cluster\n4. Score topic relevance\n5. Generate topic hierarchy and summary', allowedTools: ['topic-model', 'entity-extract', 'text-summarize', 'read-file', 'write-file'], priority: 'low', triggers: ['topic model', 'topic analysis', 'themes', 'topic clustering', 'content analysis'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'content-conversion-skill', name: 'Content Conversion', description: 'Convert content between formats (HTML/Markdown/JSON/CSV)', category: 'media', instructions: '1. Detect source format\n2. Determine target format\n3. Convert content preserving structure\n4. Validate converted output\n5. Report any data loss during conversion', allowedTools: ['html-to-markdown', 'json-schema-infer', 'markdown-toc', 'read-file', 'write-file'], priority: 'medium', triggers: ['convert', 'conversion', 'html to markdown', 'format conversion', 'transform'], createdAt: new Date(), updatedAt: new Date(),
  },
  /* ─── Knowledge Skills ─── */
  {
    id: 'knowledge-graph-build', name: 'Knowledge Graph Builder', description: 'Build concept maps and knowledge graphs from documents', category: 'knowledge', instructions: '1. Scan documents for key concepts and terms\n2. Identify relationships between concepts\n3. Build a graph structure with nodes and edges\n4. Assign relationship types (is-a, part-of, related-to)\n5. Generate Mermaid graph visualization', allowedTools: ['read-file', 'write-file', 'entity-extract', 'text-summarize', 'semantic-search', 'draw-diagram'], priority: 'high', triggers: ['knowledge graph', 'concept map', 'relationship map', 'knowledge map', 'concept mapping'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'content-summarize', name: 'Content Summarizer', description: 'Summarize multiple documents into structured briefings', category: 'knowledge', instructions: '1. Read all provided documents\n2. Extract key findings from each\n3. Identify common themes across documents\n4. Generate cross-document summary\n5. Note conflicting information\n6. Produce structured briefing with source attribution', allowedTools: ['read-file', 'write-file', 'text-summarize', 'entity-extract', 'topic-model', 'semantic-search'], priority: 'high', triggers: ['briefing', 'content summary', 'document summary', 'research brief', 'executive brief', 'cross-document'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'knowledge-audit', name: 'Knowledge Audit', description: 'Audit knowledge base for gaps, overlaps, and outdated content', category: 'knowledge', instructions: '1. Scan all documents in the knowledge base\n2. Check last-updated timestamps\n3. Identify overlapping or duplicated content\n4. Flag knowledge gaps (missing related topics)\n5. Suggest refresh priorities\n6. Generate audit report with actionable items', allowedTools: ['read-file', 'semantic-search', 'recall', 'text-summarize', 'write-file'], priority: 'medium', triggers: ['knowledge audit', 'audit knowledge', 'knowledge gap', 'content audit', 'knowledge health'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'research-synthesis', name: 'Research Synthesis', description: 'Synthesize findings from multiple research sources into unified analysis', category: 'knowledge', instructions: '1. Collect research from multiple sources\n2. Extract key findings per source\n3. Compare and contrast methodologies\n4. Identify consensus and disagreement\n5. Synthesize into unified analysis\n6. Rate overall confidence level', allowedTools: ['search-pubmed', 'search-arxiv', 'search-openalex', 'semantic-search', 'read-file', 'write-file', 'text-summarize'], priority: 'high', triggers: ['synthesize', 'research synthesis', 'unify findings', 'combine research', 'meta-analysis', 'comparative analysis'], createdAt: new Date(), updatedAt: new Date(),
  },
];
