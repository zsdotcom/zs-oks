import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  ChatMessage, MessageSender, KBFile, KBFolder, URLGroup,
  ProviderConfig, SavedPrompt, A2AAgent, A2AMetric, SandboxSettings,
  DocumentVersion, KanbanBoard, DocumentTemplate, DocumentTag,
  AppView, AppUser, TaskColumn, TaskCard, MCPServer, MCPTool,
  SkillDefinition, ConnectorConfig, WorkspaceProject, LLMProvider,
  PROVIDER_OPTIONS, BUILT_IN_TOOLS,
} from './types';
import { queryLLM, getInitialSuggestions, runA2ADebate, runOrchestratedWorkflow, runSequentialWorkflow } from './services/geminiService';
import { signInWithGoogle, logoutUser, subscribeAuth, updateUserDoc } from './services/googleAuthService';
import { dbGetAll, dbPut, dbDelete, dbGetKey, dbSetKey, migrateLocalStorage, exportAllData, importAllData } from './db/indexedDB';
import { useFiles } from './hooks/useFiles';
import { useChat } from './hooks/useChat';
import { usePWAInstall } from './hooks/usePWAInstall';
import { fireWebhooks, getAllWebhooks, addWebhook, removeWebhook as removeWebhookSvc, updateWebhook as updateWebhookSvc } from './services/webhookService';
import type { WebhookConfig } from './services/webhookService';
import { loadSkillRegistry, getSkillRegistry, addSkill, removeSkill, findRelevantSkills, PRESET_SKILLS } from './services/skillService';
import { loadConnectors, getConnectors, addConnector, removeConnector } from './services/connectorService';
import KnowledgeBaseManager from './components/KnowledgeBaseManager';
import ChatInterface from './components/ChatInterface';
import ThemeSwitcher from './components/ThemeSwitcher';
import { AgentBuilder } from './components/AgentBuilder';
import SearchPanel from './components/SearchPanel';
import WorkspaceManager from './components/WorkspaceManager';
import { KanbanBoardView } from './components/KanbanBoardView';
import { ChatSessionSidebar } from './components/ChatSessionSidebar';
import { GmailCompose } from './components/GmailCompose';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StatusBadge } from './components/charts/SimpleCharts';

const WorkspaceDocumentEditor = React.lazy(() => import('./components/WorkspaceDocumentEditor').then(m => ({ default: m.WorkspaceDocumentEditor })));
const A2AMetricsDashboard = React.lazy(() => import('./components/A2AMetricsDashboard').then(m => ({ default: m.A2AMetricsDashboard })));
const GoogleWorkspacePanel = React.lazy(() => import('./components/GoogleWorkspacePanel').then(m => ({ default: m.GoogleWorkspacePanel })));
const SettingsPanel = React.lazy(() => import('./components/SettingsPanel'));
const MCPServerPanel = React.lazy(() => import('./components/MCPServerPanel').then(m => ({ default: m.MCPServerPanel })));
import { ICD11Lookup } from './components/ICD11Lookup';
import { EpiMap } from './components/EpiMap';
import type { EpiDataPoint } from './components/EpiMap';
import { DocumentationViewer } from './components/DocumentationViewer';
import { ConnectorPanel } from './components/ConnectorPanel';
import { PublicDataPanel } from './components/PublicDataPanel';
import {
  Sparkles, Brain, Code, ShieldCheck, Database, GitMerge, Activity, BarChart,
  Edit, BookOpen, X, Search, MessageSquare, Settings, Folder, FileText,
  Moon, Sun, Cloud, Wifi, WifiOff, Layout, Menu, Clock, Users, Zap,
  Globe, Layers, Template, Kanban, Plus, Trash, Mail, Wrench,
  Target, Book, BarChart3, FileEdit, SearchCheck, Library, MapPin,
  Download,
} from './components/icons/lucide-shim';

const INITIAL_FOLDERS: KBFolder[] = [
  { id: 'dev-guidelines', name: 'Development Guidelines' },
  { id: 'market-research', name: 'Market Intelligence' },
  { id: 'health-reports', name: 'Health & Epidemiology' },
  { id: 'templates', name: 'Templates' },
];

const INITIAL_FILES: KBFile[] = [
  {
    id: 'coding-standards', name: 'Coding Standards.md', type: 'markdown',
    content: `# Coding Standards & Guidelines\n\n1. **TypeScript First**: All components and helpers must be typed strictly.\n2. **React Hooks**: Prefer hooks and state separation.\n3. **Tailwind Styling**: Stick to clean, modular utilities and responsive borders.\n4. **Zero Dependencies**: No npm packages beyond react + react-dom.`,
    size: '0.8 KB', parentFolderId: 'dev-guidelines', isActive: true, createdAt: new Date(),
  },
  {
    id: 'architecture-map', name: 'Architecture Map.json', type: 'json',
    content: JSON.stringify({ appName: 'Open Knowledge Studio', aiEngine: 'Gemini 3.5 Flash', infrastructure: 'IndexedDB + Google Drive', security: 'Google Sign-In Auth' }, null, 2),
    size: '0.4 KB', parentFolderId: 'dev-guidelines', isActive: true, createdAt: new Date(),
  },
  {
    id: 'epi-report-template', name: 'WHO Field Report.md', type: 'markdown',
    content: `# WHO FIELD EPIDEMIOLOGY REPORT\n\n## 1. Demographic Overview\n- **Officer**: Field Unit\n- **Location**: District\n- **Date**: ${new Date().toISOString().split('T')[0]}\n\n## 2. Incident Summary\n| Metric | Value |\n|---|---|\n| Total Cases | 0 |\n| Active Cases | 0 |\n| Recovered | 0 |\n| Fatalities | 0 |\n\n## 3. SIR Model Parameters\n$$R_0 = \\frac{\\beta}{\\gamma}$$\n\n## 4. Action Items\n- [ ] Establish surveillance zone\n- [ ] Deploy rapid response team\n- [ ] Verify supply chain integrity`,
    size: '1.2 KB', parentFolderId: 'health-reports', isActive: true, createdAt: new Date(),
  },
  {
    id: 'revenue-data', name: 'Quarterly Projections.csv', type: 'csv',
    content: `Quarter,Revenue,GrowthRate,DirectCosts\nQ1-2026,245000,12%,82000\nQ2-2026,290000,18%,95000\nQ3-2026,345000,19%,112000\nQ4-2026,420000,22%,135000`,
    size: '0.5 KB', parentFolderId: 'market-research', isActive: false, createdAt: new Date(),
  },
];

const INITIAL_PROVIDER_CONFIG: ProviderConfig = {
  provider: 'gemini', apiKey: '', selectedModel: 'gemini-3.5-flash',
  temperature: 0.7, enableThinking: false, thinkingLevel: 'low',
  enableSearchGrounding: false, enableMapsGrounding: false,
};

const INITIAL_TEMPLATES: DocumentTemplate[] = [
  { id: 't1', name: 'WHO Field Epidemiology Report', description: 'Complete field outbreak investigation report with SIR modeling per WHO standards', category: 'epidemiology', content: '# WHO FIELD EPIDEMIOLOGY REPORT\n\n## 1. Demographic Overview\n- **Investigation Team**: \n- **Location/Region**: \n- **Report Date**: \n- **Investigation Period**: \n\n## 2. Incident Summary\n| Metric | Value |\n|---|---|\n| Total Cases | |\n| Confirmed Cases | |\n| Probable Cases | |\n| Suspect Cases | |\n| Hospitalized | |\n| Deaths | |\n| CFR (%) | |\n| Attack Rate (%) | |\n\n## 3. Descriptive Epidemiology\n### Person\n- Age distribution: \n- Sex ratio: \n- Occupation: \n\n### Place\n- Geographic distribution: \n- Cluster locations: \n\n### Time\n- Epidemic curve (attach): \n- Onset date range: \n- Incubation period estimate: \n\n## 4. Analytical Epidemiology\n### Risk Factor Analysis\n| Exposure | Cases | Controls | OR (95% CI) |\n|---|---|---|---|\n| | | | |\n\n### SIR Model Parameters\n$$R_0 = \\frac{\\beta}{\\gamma}$$\n- Transmission rate (β): \n- Recovery rate (γ): \n- Basic reproduction number (R₀): \n\n## 5. Laboratory Findings\n- Specimen types collected: \n- Testing method: \n- Positivity rate: \n- Genotyping results: \n\n## 6. Control Measures\n- [ ] Isolation/quarantine\n- [ ] Contact tracing\n- [ ] Vaccination campaign\n- [ ] Health education\n- [ ] Environmental sanitation\n- [ ] Travel restrictions\n\n## 7. Recommendations\n1. \n2. \n3. \n\n## 8. References\n- WHO guidelines: \n- CDC recommendations: \n- Local protocols: \n\n---\n*Report generated by Open Knowledge Studio*' },
  { id: 't2', name: 'Outbreak Situation Report (SitRep)', description: 'Standard situation report template for active outbreak monitoring', category: 'epidemiology', content: '# OUTBREAK SITUATION REPORT\n\n**Report #**: \n**Date**: \n**Time**: \n**Prepared by**: \n\n## HIGHLIGHTS\n- New cases this period: \n- Cumulative cases: \n- New deaths: \n- Cumulative deaths: \n- CFR: \n- Affected areas: \n\n## EPIDEMIOLOGICAL SITUATION\n\n### Case Definition\n- Suspect: \n- Probable: \n- Confirmed: \n\n### Summary Table\n| Region | New Cases | Cumulative | New Deaths | Cumulative | Recovered | Active |\n|---|---|---|---|---|---|---|\n| | | | | | | |\n\n### Epidemic Curve\n\n```mermaid\nxychart-beta\n  title \"Cases by Date\"\n  x-axis \"Date\" [\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\", \"Sun\"]\n  y-axis \"Cases\" 0 --> 100\n  bar [10, 15, 25, 40, 55, 70, 85]\n```\n\n## RESPONSE ACTIVITIES\n\n### Coordination\n- Incident management team: \n- Partner coordination: \n\n### Surveillance\n- Active case finding: \n- Contact tracing status: \n- Laboratory confirmation: \n\n### Case Management\n- Isolation facilities: \n- Treatment protocols: \n- Bed occupancy: \n\n### Logistics\n- PPE stock: \n- Vaccines/drugs: \n- Laboratory supplies: \n\n## GAPS & CHALLENGES\n1. \n2. \n3. \n\n## ACTIONS REQUESTED\n- [ ] Additional staff\n- [ ] Supplies\n- [ ] Funding\n- [ ] Technical support\n\n---\n*Next report due: *' },
  { id: 't3', name: 'Line Listing Template', description: 'Standard case-based line listing for outbreak investigations', category: 'epidemiology', content: '# CASE LINE LISTING\n\n**Outbreak**: \n**Location**: \n**Period**: \n\n## Case Definitions\n- **Suspect**: \n- **Probable**: \n- **Confirmed**: \n\n## Line List\n| ID | Name | Age | Sex | Address | Occupation | Onset Date | Date Seen | Symptoms | Lab Result | Outcome | Vaccination | Exposure |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n| | | | | | | | | | | | | |\n\n## Summary Statistics\n- Total cases: \n- Male/Female ratio: \n- Median age (range): \n- Most common symptom: \n- Hospitalization rate: \n- CFR: \n\n$$Attack\\ Rate = \\frac{Number\\ of\\ Cases}{Population\\ at\\ Risk} \\times 100$$\n\n$$CFR = \\frac{Number\\ of\\ Deaths}{Number\\ of\\ Confirmed\\ Cases} \\times 100$$' },
  { id: 't4', name: 'Rapid Risk Assessment', description: 'WHO-style rapid risk assessment for emerging infectious disease events', category: 'epidemiology', content: '# RAPID RISK ASSESSMENT\n\n**Event**: \n**Date of Assessment**: \n**Assessed by**: \n\n## 1. EVENT DESCRIPTION\n- Pathogen: \n- First detected: \n- Location: \n- Source of outbreak: \n- Current status: \n\n## 2. RISK QUESTION\nWhat is the risk of [event] for [population]?\n\n## 3. INFORMATION GATHERING & SOURCES\n| Source | Information | Date |\n|---|---|---|\n| WHO DON | | |\n| CDC HAN | | |\n| Ministry of Health | | |\n| Academic literature | | |\n\n## 4. RISK ASSESSMENT\n\n### Transmission\n- **Route**: \n- **R₀ estimate**: \n- **Serial interval**: \n- **Incubation period**: \n\n### Population susceptibility\n- Pre-existing immunity: \n- Risk groups: \n\n### Healthcare capacity\n- Bed capacity: \n- ICU capacity: \n- Laboratory capacity: \n\n## 5. RISK LEVEL\n| Population | Risk Level | Rationale |\n|---|---|---|\n| General population | Low / Moderate / High / Very High | |\n| Healthcare workers | Low / Moderate / High / Very High | |\n| Vulnerable groups | Low / Moderate / High / Very High | |\n\n## 6. RECOMMENDATIONS\n| Priority | Action | Responsible | Timeline |\n|---|---|---|---|\n| Immediate | | | |\n| Short-term | | | |\n| Long-term | | | |\n\n## 7. UNCERTAINTIES\n- \n- \n\n---\n*Assessment valid for: 7 days*' },
  { id: 't5', name: 'Contact Tracing Form', description: 'Standardized contact tracing data collection form', category: 'epidemiology', content: '# CONTACT TRACING FORM\n\n**Outbreak ID**: \n**Contact Tracer**: \n**Date**: \n\n## INDEX CASE INFORMATION\n- Index case ID: \n- Name: \n- Age: \n- Sex: \n- Address: \n- Phone: \n\n## CONTACT INFORMATION\n| # | Name | Age | Sex | Address | Phone | Relationship | Last Exposure | Exposure Type | Symptoms |\n|---|---|---|---|---|---|---|---|---|---|\n| | | | | | | | | | |\n\n**Exposure Type**: Household / Workplace / Social / Healthcare / Transportation / Other\n\n## FOLLOW-UP SCHEDULE\n| Contact ID | Day 1 | Day 2 | Day 3 | Day 4 | Day 5 | Day 6 | Day 7 | Day 8 | Day 9 | Day 10 | Day 11 | Day 12 | Day 13 | Day 14 |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n| | OK/Sx | OK/Sx | OK/Sx | OK/Sx | OK/Sx | OK/Sx | OK/Sx | OK/Sx | OK/Sx | OK/Sx | OK/Sx | OK/Sx | OK/Sx | OK/Sx |\n\n*OK=No symptoms, Sx=Symptoms developed*\n\n## OUTCOME\n- Total contacts traced: \n- Contacts completed monitoring: \n- Contacts lost to follow-up: \n- Contacts developed symptoms: \n- Contacts confirmed positive: \n- Secondary attack rate: \n\n$$Secondary\\ Attack\\ Rate = \\frac{Confirmed\\ Secondary\\ Cases}{Total\\ Contacts} \\times 100$$' },
  { id: 't6', name: 'System Architecture Diagram', description: 'Mermaid sequence diagram for system design and API workflows', category: 'mermaid', content: '```mermaid\nsequenceDiagram\n  participant User\n  participant UI as React App\n  participant DB as IndexedDB\n  participant API as Public API\n  participant AI as Gemini API\n  \n  User->>UI: Query disease data\n  UI->>API: Fetch from CDC/WHO\n  API-->>UI: JSON response\n  UI->>DB: Cache result\n  UI->>AI: Analyze data\n  AI-->>UI: Structured analysis\n  UI-->>User: Dashboard\n  \n  Note over UI,DB: All data cached locally\n  Note over API: No auth required\n```\n\n## Component Diagram\n\n```mermaid\nflowchart TD\n  A[User Interface] --> B[Chat Interface]\n  A --> C[Knowledge Base]\n  A --> D[Analytics Dashboard]\n  B --> E[AI Engine]\n  C --> F[IndexedDB]\n  D --> G[Chart Engine]\n  E --> H[Memory API]\n  F --> H\n  G --> F\n  \n  style A fill:var(--accent-subtle),stroke:var(--accent)\n  style E fill:var(--accent-subtle),stroke:var(--accent)\n  style F fill:var(--accent-subtle),stroke:var(--accent)\n```' },
  { id: 't7', name: 'Mathematical Reference (Epidemiology)', description: 'Common epidemiological and biostatistical formulas with KaTeX', category: 'math', content: '# Epidemiological Formulas\n\n## Incidence\n$$Incidence = \\frac{New\\ Cases}{Population\\ at\\ Risk} \\times 10^n$$\n\n## Attack Rate\n$$Attack\\ Rate = \\frac{Number\\ of\\ Cases}{Population\\ at\\ Risk} \\times 100\\%$$\n\n## Primary Attack Rate\n$$Primary\\ Attack\\ Rate = \\frac{Primary\\ Cases}{Total\\ Exposed} \\times 100\\%$$\n\n## Secondary Attack Rate\n$$Secondary\\ Attack\\ Rate = \\frac{Secondary\\ Cases}{Total\\ Contacts} \\times 100\\%$$\n\n## Case Fatality Rate\n$$CFR = \\frac{Deaths}{Confirmed\\ Cases} \\times 100\\%$$\n\n## Mortality Rate\n$$Mortality\\ Rate = \\frac{Total\\ Deaths}{Total\\ Population} \\times 100,000$$\n\n## Basic Reproduction Number\n$$R_0 = \\frac{\\beta}{\\gamma}$$\n\nWhere:\n- β = transmission rate\n- γ = recovery rate\n\n## Effective Reproduction Number\n$$R_t = R_0 \\times (1 - V_e \\times V_c)$$\n\nWhere:\n- V_e = vaccine effectiveness\n- V_c = vaccine coverage\n\n## Herd Immunity Threshold\n$$HIT = 1 - \\frac{1}{R_0}$$\n\n## Odds Ratio\n$$OR = \\frac{a/c}{b/d} = \\frac{ad}{bc}$$\n\nWhere:\n- a = exposed cases\n- b = exposed controls\n- c = unexposed cases\n- d = unexposed controls\n\n## Relative Risk\n$$RR = \\frac{a/(a+b)}{c/(c+d)}$$\n\n## Confidence Interval for Proportion\n$$CI = \\hat{p} \\pm Z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}$$\n\n## Standard Deviation\n$$\\sigma = \\sqrt{\\frac{\\sum(x_i - \\bar{x})^2}{n-1}}$$\n\n## Chi-Square Test\n$$\\chi^2 = \\sum\\frac{(O_i - E_i)^2}{E_i}$$' },
  { id: 't8', name: 'Research Paper (IMRaD)', description: 'Standard IMRaD academic paper structure for outbreak research', category: 'research', content: '# RESEARCH PAPER\n\n## Title\n\n## Abstract\n**Background**: \n**Methods**: \n**Results**: \n**Conclusion**: \n**Keywords**: \n\n## 1. Introduction\n- Disease background\n- Outbreak setting\n- Rationale for investigation\n- Objectives\n\n## 2. Methods\n### Study Design\n- Investigation type: \n- Study period: \n\n### Case Definition\n- Suspect: \n- Probable: \n- Confirmed: \n\n### Data Collection\n- Sources: \n- Variables: \n\n### Laboratory Methods\n- Specimen type: \n- Testing: \n\n### Statistical Analysis\n- Sample size: \n- Statistical tests: \n- Software used: \n\n### Ethical Considerations\n- Approval: \n- Consent: \n\n## 3. Results\n### Descriptive Epidemiology\n$$\\\\text{Insert descriptive statistics here}$$\n\n### Analytical Results\n| Variable | OR (95% CI) | p-value |\n|---|---|---|\n| | | |\n\n### Key Findings\n- \n- \n\n## 4. Discussion\n- Principal findings\n- Comparison with literature\n- Limitations\n- Generalizability\n\n## 5. Conclusion\n- Key takeaway\n- Public health implications\n- Recommendations\n\n## References\n1. \n2. \n3. \n\n## Supplementary Materials\n- Line listing\n- Questionnaire\n- Data dictionary\n\n---\n*Word count: *' },
  { id: 't9', name: 'WHO Guidelines Summary', description: 'Template for summarizing WHO disease prevention and control guidelines', category: 'epidemiology', content: '# WHO GUIDELINES SUMMARY\n\n**Disease/condition**: \n**Guideline title**: \n**Publication date**: \n**WHO reference #**: \n\n## KEY RECOMMENDATIONS\n\n| # | Recommendation | Strength | Evidence |\n|---|---|---|---|\n| 1 | | Strong/Conditional | High/Mod/Low |\n| 2 | | Strong/Conditional | High/Mod/Low |\n| 3 | | Strong/Conditional | High/Mod/Low |\n\n## CASE MANAGEMENT\n### Diagnosis\n- Clinical criteria: \n- Laboratory confirmation: \n- Differential diagnosis: \n\n### Treatment\n- First-line: \n- Second-line: \n- Duration: \n\n### Prevention\n- Vaccination: \n- Chemoprophylaxis: \n- Non-pharmaceutical interventions: \n\n## SURVEILLANCE\n- Case definition: \n- Reporting requirements: \n- Data elements: \n\n## REFERENCES\n- Full guideline URL: \n- Supporting evidence: \n\n---\n*Summarized by Open Knowledge Studio*' },
  { id: 't10', name: 'Epidemiological Data Dictionary', description: 'Standardized data dictionary for epidemiological variables and datasets', category: 'research', content: '# DATA DICTIONARY\n\n**Dataset**: \n**Project**: \n**Version**: \n**Date**: \n\n## Variable Definitions\n\n| # | Variable Name | Description | Type | Values/Units | Missing | Notes |\n|---|---|---|---|---|---|---|\n| 1 | case_id | Unique case identifier | string | UUID v4 | N/A | Primary key |\n| 2 | age_years | Age in years | integer | 0-120 | -99 | At time of onset |\n| 3 | sex | Biological sex | categorical | male/female/unknown | unknown | |\n| 4 | onset_date | Date of symptom onset | date | YYYY-MM-DD | N/A | |\n| 5 | diagnosis_date | Date of diagnosis | date | YYYY-MM-DD | N/A | |\n| 6 | outcome | Patient outcome | categorical | recovered/died/unknown | unknown | At time of report |\n| 7 | hospitalized | Hospitalization status | boolean | true/false | false | |\n| 8 | exposed | Known exposure | boolean | true/false | false | |\n| 9 | vaccination_status | Vaccination history | categorical | full/partial/none/unknown | unknown | |\n| 10 | pathogen | Confirmed pathogen | string | | | Lab-confirmed |\n\n## Code Lists\n\n### Outcome\n| Code | Label |\n|---|---|\n| recovered | Recovered/Discharged |\n| died | Died |\n| unknown | Unknown/Lost to follow-up |\n\n### Sex\n| Code | Label |\n|---|---|\n| male | Male |\n| female | Female |\n| unknown | Unknown/Not specified |\n\n### Vaccination Status\n| Code | Label |\n|---|---|\n| full | Fully vaccinated |\n| partial | Partially vaccinated |\n| none | Not vaccinated |\n| unknown | Unknown |\n\n---\n*Standardized per WHO guidelines*' },
  { id: 't11', name: 'Community Health Assessment', description: 'Rapid community health assessment template for field epidemiology', category: 'epidemiology', content: '# RAPID COMMUNITY HEALTH ASSESSMENT\n\n**Location**: \n**Date**: \n**Assessment Team**: \n\n## COMMUNITY PROFILE\n- Estimated population: \n- Number of households: \n- Main water source: \n- Sanitation facilities: \n- Healthcare access: \n\n## HEALTH INDICATORS\n\n### Child Health (Under 5)\n| Indicator | Value | Source |\n|---|---|---|\n| MUAC screening coverage | | |\n| SAM cases | | |\n| MAM cases | | |\n| Vaccination coverage (MCV1) | | |\n\n### Maternal Health\n| Indicator | Value | Source |\n|---|---|---|\n| Antenatal care coverage | | |\n| Skilled birth attendance | | |\n| Pregnant women reached | | |\n\n### Communicable Diseases\n| Disease | Suspected Cases | Confirmed | Deaths |\n|---|---|---|---|\n| Malaria | | | |\n| Cholera | | | |\n| Measles | | | |\n| Respiratory infections | | | |\n\n### WASH Assessment\n| Indicator | Finding |\n|---|---|\n| Water quality | |\n| Latrine coverage | |\n| Handwashing stations | |\n\n## KEY FINDINGS\n1. \n2. \n3. \n\n## PRIORITY ACTIONS\n| Priority | Action | Responsible | Timeline |\n|---|---|---|---|\n| 1 | | | |\n| 2 | | | |\n| 3 | | | |\n\n---\n*Assessment completed by: *' },
  { id: 't12', name: 'Vaccination Campaign Plan', description: 'Standard outbreak response vaccination campaign planning template', category: 'epidemiology', content: '# VACCINATION CAMPAIGN PLAN\n\n**Campaign name**: \n**Target disease**: \n**Location**: \n**Campaign dates**: \n\n## EPIDEMIOLOGICAL RATIONALE\n- Current outbreak status: \n- Target population: \n- Vaccine efficacy: \n- R₀ estimate: \n- Herd immunity threshold: \n\n## TARGET POPULATION\n| Age Group | Population | Target Coverage | Doses Needed |\n|---|---|---|---|\n| 6-11 months | | 95% | |\n| 12-59 months | | 95% | |\n| 5-14 years | | 90% | |\n| 15+ years | | 80% | |\n| **Total** | | | |\n\n## VACCINE REQUIREMENTS\n- Vaccine type: \n- Doses per vial: \n- Cold chain requirements: \n- Total doses needed: \n- Wastage factor (15%): \n- Total vials: \n\n## OPERATIONAL PLAN\n### Teams\n| Team Type | Number | Members per Team |\n|---|---|---|\n| Fixed post | | |\n| Mobile team | | |\n| Outreach | | |\n\n### Logistics\n- Vaccine transport: \n- Cold chain equipment: \n- Safety boxes: \n- Diluents: \n\n## AEFI MONITORING\n- Reporting system: \n- Treatment protocols: \n\n## BUDGET\n| Item | Cost |\n|---|---|\n| Vaccines | |\n| Logistics | |\n| Personnel | |\n| IEC materials | |\n| **Total** | |\n\n---\n*Plan prepared by: *' },
];

const INITIAL_URL_GROUPS: URLGroup[] = [
  { id: 'gemini-overview', name: 'Gemini Docs Overview', urls: ['https://ai.google.dev/gemini-api/docs', 'https://ai.google.dev/gemini-api/docs/models', 'https://ai.google.dev/gemini-api/docs/api-key'] },
  { id: 'model-capabilities', name: 'Model Capabilities', urls: ['https://ai.google.dev/gemini-api/docs/text-generation', 'https://ai.google.dev/gemini-api/docs/structured-output', 'https://ai.google.dev/gemini-api/docs/thinking'] },
];

const DEFAULT_A2A_AGENTS: A2AAgent[] = [
  {
    id: 'coord', name: 'Coordinator', role: 'Orchestrates workflows and delegates tasks', avatar: '🎯', color: '#8B5CF6', isActive: true,
    memoryType: 'full', maxTurnDepth: 50, provider: 'gemini', modelName: 'gemini-2.5-pro',
    skills: ['workflow-decompose', 'workflow-delegate', 'workflow-validate', 'workflow-merge'],
    tools: ['spawn-agent', 'status-track', 'send-message', 'read-file', 'write-file', 'list-agents', 'remember', 'recall'],
    systemPrompt: `You are the Coordinator Agent of Open Knowledge Studio. Your role is to receive user requests and analyze their complexity. If the task is simple, handle it directly. If the task is complex, decompose it into sub-tasks and delegate to the appropriate specialized agents. Monitor the progress of delegated agents using the A2A protocol. Validate each agent's output before merging it into the final response. Save all key decisions and outcomes to episodic memory. Use color-coded status updates: 🟢 Complete, 🟡 In Progress, 🔴 Error.`,
  },
  {
    id: 'research', name: 'Researcher', role: 'Searches and synthesizes information', avatar: '🔬', color: '#06B6D4', isActive: true,
    memoryType: 'persistent', maxTurnDepth: 30, provider: 'groq', modelName: 'llama-3.3-70b-versatile',
    skills: ['literature-review', 'outbreak-research', 'guideline-research', 'source-evaluate'],
    tools: ['search-wikipedia', 'search-arxiv', 'search-openalex', 'search-pubmed', 'search-who', 'search-cdc', 'search-web', 'rss-fetch', 'read-file', 'write-file', 'vectorize', 'semantic-search', 'remember', 'recall'],
    systemPrompt: `You are the Research Agent of Open Knowledge Studio. Your role is to identify the user's research query and determine the best sources. Query relevant free APIs (Wikipedia, arXiv, OpenAlex, PubMed, WHO, CDC). Synthesize findings into a structured summary with inline citations. Evaluate source credibility. Tag all findings with confidence levels (High/Medium/Low). Always include source URL, access date, and relevance score for each cited piece of information. Cache API results in IndexedDB to avoid redundant calls.`,
  },
  {
    id: 'data', name: 'Data Analyst', role: 'Processes data and generates statistics', avatar: '📊', color: '#F59E0B', isActive: true,
    memoryType: 'session', maxTurnDepth: 25, provider: 'groq', modelName: 'llama-3.3-70b-versatile',
    skills: ['attack-rate-calc', 'epi-curve', 'r0-estimator', 'chi-square-test', 'confidence-interval', 'data-clean', 'outbreak-detection'],
    tools: ['calculate', 'draw-chart', 'draw-diagram', 'render-latex', 'read-file', 'write-file', 'vectorize', 'remember', 'recall'],
    systemPrompt: `You are the Data Analyst Agent of Open Knowledge Studio. Your role is to read and parse datasets uploaded by the user (CSV, JSON). Clean the data: handle missing values, normalize formats, detect outliers. Perform statistical analysis using the calculate tool. Generate visualizations: charts, epi curves, and Mermaid diagrams. Compute epidemiological metrics: attack rates, R0, confidence intervals. Always include confidence intervals with all statistical estimates. Use color-coded charts: red for critical values, green for normal range. When presenting data, generate diagrams using Mermaid syntax inside \`\`\`mermaid code fences. Use KaTeX $$inline math$$ for statistical formulas.`,
  },
  {
    id: 'writer', name: 'Writer', role: 'Drafts documents and formats outputs', avatar: '✍️', color: '#10B981', isActive: true,
    memoryType: 'session', maxTurnDepth: 20, provider: 'gemini', modelName: 'gemini-2.5-flash',
    skills: ['report-writer', 'policy-brief', 'protocol-template', 'citation-format', 'executive-summary'],
    tools: ['read-file', 'write-file', 'export-pdf', 'render-latex', 'speak', 'remember', 'recall'],
    systemPrompt: `You are the Writer Agent of Open Knowledge Studio. Your role is to draft documents from research notes and data. Apply the appropriate template. Use consistent citation formatting (APA by default). Generate executive summaries for complex documents. Never invent facts. Only use information from provided research notes. Always cite sources using the project's configured citation style. Include a methodology section for all analytical documents.`,
  },
  {
    id: 'review', name: 'Reviewer', role: 'Quality checks and peer review', avatar: '🔍', color: '#EF4444', isActive: true,
    memoryType: 'session', maxTurnDepth: 15, provider: 'gemini', modelName: 'gemini-2.5-flash',
    skills: ['quality-check', 'consistency-audit', 'citation-audit', 'methodology-review', 'compliance-check'],
    tools: ['read-file', 'write-file', 'send-message', 'calculate', 'semantic-search', 'recall'],
    systemPrompt: `You are the Reviewer Agent of Open Knowledge Studio. Your role is to review documents and outputs from other agents for quality and accuracy. Check for internal consistency: do numbers match across sections? Audit citations: are they complete, valid, and properly formatted? Review methodology: are statistical methods appropriate and correctly applied? Check compliance with WHO/CDC reporting standards where applicable. Provide structured feedback with severity levels: Critical, Major, Minor. Rate overall quality on a scale of 1-5 with justification.`,
  },
  {
    id: 'librarian', name: 'Librarian', role: 'Maintains memory and manages knowledge', avatar: '📚', color: '#A855F7', isActive: true,
    memoryType: 'full', maxTurnDepth: 30, provider: 'gemini', modelName: 'gemini-2.5-flash',
    skills: ['memory-maintenance', 'knowledge-refresh', 'index-rebuild', 'reference-manager', 'glossary-build'],
    tools: ['remember', 'recall', 'forget', 'vectorize', 'semantic-search', 'search-wikipedia', 'search-openalex', 'read-file', 'write-file'],
    systemPrompt: `You are the Librarian Agent of Open Knowledge Studio. Your role is to maintain all six memory tiers: Session, Episodic, Semantic, Procedural, Working, and Long-Term. Run periodic knowledge refresh cycles using free sources (Wikipedia, OpenAlex, WHO, CDC). Rebuild the semantic search index when new documents are added. Manage references and build project-specific glossaries. Compress episodic memory by summarizing old sessions. Never delete memories without user confirmation. Always cite the source when refreshing knowledge.`,
  },
];

const INITIAL_SAVED_PROMPTS: SavedPrompt[] = [
  { id: 'p1', title: 'Coordinator Agent', description: 'Orchestrates workflows and delegates tasks', content: 'You are the Coordinator Agent of Open Knowledge Studio. Your role is to receive user requests and analyze their complexity. If the task is simple, handle it directly. If the task is complex, decompose it into sub-tasks and delegate to the appropriate specialized agents. Monitor progress and validate outputs before presenting to the user.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
  { id: 'p2', title: 'Researcher Agent', description: 'Searches and synthesizes information', content: 'You are the Research Agent of Open Knowledge Studio. Your role is to identify research queries, synthesize findings from available information, and generate structured summaries with proper citations. Tag all findings with confidence levels.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
  { id: 'p3', title: 'Data Analyst Agent', description: 'Processes data and generates statistics', content: 'You are the Data Analyst Agent of Open Knowledge Studio. Your role is to process datasets, perform statistical analysis, generate visualizations, and compute metrics. Always sanitize inputs, handle missing data gracefully, and provide confidence intervals. When presenting data, generate diagrams using Mermaid syntax (flowcharts, bar charts, pie charts, xy charts) inside ```mermaid code fences. Use KaTeX $$inline math$$ for statistical formulas.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
  { id: 'p4', title: 'Writer Agent', description: 'Drafts documents and formats outputs', content: 'You are the Writer Agent of Open Knowledge Studio. Your role is to draft documents from structured data, apply templates, format outputs, and maintain consistent formatting. Ensure all claims are backed by evidence.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
  { id: 'p5', title: 'Reviewer Agent', description: 'Quality checks and peer review', content: 'You are the Reviewer Agent of Open Knowledge Studio. Your role is to perform quality checks, audit citations, validate compliance, and identify contradictory claims. Be specific and constructive in feedback.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
  { id: 'p6', title: 'Librarian Agent', description: 'Maintains memory and manages knowledge', content: 'You are the Librarian Agent of Open Knowledge Studio. Your role is to maintain memory, organize knowledge, manage references, and ensure information is properly indexed and retrievable.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('dark');
  const [accentColor, setAccentColor] = useState<string>('#8B5CF6');
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showChatSessions, setShowChatSessions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGooglePanel, setShowGooglePanel] = useState(false);
  const [showGmailCompose, setShowGmailCompose] = useState(false);
  const [showICD11, setShowICD11] = useState(false);
  const [toolsTab, setToolsTab] = useState<'tools' | 'connectors'>('tools');
  const [showEpiMap, setShowEpiMap] = useState(false);
  const [epiDataPoints] = useState<EpiDataPoint[]>([
    { id: 'epi-1', lat: -1.286, lng: 36.817, label: 'Nairobi', disease: 'Malaria', cases: 1240, severity: 'high', date: '2026-06-15', status: 'active' },
    { id: 'epi-2', lat: 6.524, lng: 3.379, label: 'Lagos', disease: 'Dengue fever', cases: 890, severity: 'medium', date: '2026-06-14', status: 'active' },
    { id: 'epi-3', lat: 28.613, lng: 77.209, label: 'Delhi', disease: 'COVID-19', cases: 3200, severity: 'critical', date: '2026-06-15', status: 'active' },
    { id: 'epi-4', lat: -23.550, lng: -46.633, label: 'São Paulo', disease: 'Dengue fever', cases: 2100, severity: 'high', date: '2026-06-14', status: 'active' },
    { id: 'epi-5', lat: 40.712, lng: -74.006, label: 'New York', disease: 'Influenza', cases: 560, severity: 'low', date: '2026-06-10', status: 'contained' },
    { id: 'epi-6', lat: 48.856, lng: 2.352, label: 'Paris', disease: 'Measles', cases: 340, severity: 'medium', date: '2026-06-08', status: 'contained' },
    { id: 'epi-7', lat: 35.676, lng: 139.650, label: 'Tokyo', disease: 'COVID-19', cases: 780, severity: 'medium', date: '2026-06-07', status: 'active' },
    { id: 'epi-8', lat: -33.868, lng: 151.209, label: 'Sydney', disease: 'Influenza', cases: 190, severity: 'low', date: '2026-06-05', status: 'resolved' },
  ]);

  const epiTimelineData = useMemo(() => {
    const dates = [...new Set(epiDataPoints.map(p => p.date))].sort();
    return dates.map(date => ({
      date,
      activePoints: epiDataPoints.filter(p => p.date === date).map(p => p.id),
    }));
  }, [epiDataPoints]);

  const handleEpiTimeChange = useCallback((date: string) => {
    console.log('EpiMap timeline date:', date);
  }, []);

  const {
    files, setFiles, folders, setFolders,
    activeFile, setActiveFile,
    documentVersions, setDocumentVersions,
    handleFileSelect, handleSaveFile,
  } = useFiles();

  const [providerConfig, setProviderConfig] = useState<ProviderConfig>(INITIAL_PROVIDER_CONFIG);
  const {
    sessions, activeSessionId, messages,
    isLoading, setIsLoading,
    isFetchingSuggestions, setIsFetchingSuggestions,
    initialSuggestions, setInitialSuggestions,
    switchSession, createSession, deleteSession,
    setMessages,
  } = useChat(providerConfig);

  const [a2aAgents, setA2aAgents] = useState<A2AAgent[]>(DEFAULT_A2A_AGENTS);
  const [a2aMetrics, setA2aMetrics] = useState<A2AMetric[]>([]);
  const [isA2ALoading, setIsA2ALoading] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('chat');
  const [templates] = useState<DocumentTemplate[]>(INITIAL_TEMPLATES);
  const [tags] = useState<DocumentTag[]>([
    { id: 'tag-1', name: 'epidemiology', color: '#ef4444' },
    { id: 'tag-2', name: 'architecture', color: '#3b82f6' },
    { id: 'tag-3', name: 'research', color: '#10b981' },
  ]);
  const [urlGroups] = useState<URLGroup[]>(INITIAL_URL_GROUPS);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(INITIAL_SAVED_PROMPTS);
  const [sandboxSettings, setSandboxSettings] = useState<SandboxSettings>({ strictSandbox: true, allowedOutbound: true, showAuditLedger: false });
  const [activeProjectId, setActiveProjectId] = useState<string>('default');
  const [showComposeEmail, setShowComposeEmail] = useState(false);

  // Kanban state
  const [kanbanBoards, setKanbanBoards] = useState<KanbanBoard[]>([
    { id: 'board-1', title: 'Project Tasks', columns: [
      { id: 'col-todo', title: 'To Do', color: '#3B82F6', order: 0 },
      { id: 'col-progress', title: 'In Progress', color: '#F59E0B', order: 1 },
      { id: 'col-done', title: 'Done', color: '#10B981', order: 2 },
    ], cards: [] },
  ]);
  const [activeBoardId, setActiveBoardId] = useState('board-1');
  const { isInstallable, promptInstall } = usePWAInstall();

  // MCP state
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([
    {
      id: 'mcp-cdc', name: 'CDC Disease Surveillance', description: 'Real-time CDC notifiable disease surveillance, vaccination rates, and health statistics via Socrata Open Data API', status: 'disconnected',
      tools: [
        { name: 'get_nndss_surveillance', description: 'Query NNDSS notifiable disease data by disease type and year', parameters: 'disease: string, year?: number, state?: string', isActive: true },
        { name: 'get_places_data', description: 'Get PLACES county-level health measures', parameters: 'measure: string, year: number, state?: string', isActive: true },
        { name: 'search_dataset', description: 'Search across 73 CDC public health datasets', parameters: 'query: string, dataset?: string, limit?: number', isActive: true },
      ],
    },
    {
      id: 'mcp-who', name: 'WHO Global Health Observatory', description: 'WHO GHO OData API for global health indicators, mortality, disease burden, and SDG tracker data', status: 'disconnected',
      tools: [
        { name: 'get_gho_indicator', description: 'Fetch WHO health indicator data by code', parameters: 'indicator: string, country?: string, year?: number', isActive: true },
        { name: 'search_indicators', description: 'Search available WHO health indicators', parameters: 'query: string', isActive: true },
        { name: 'get_dimension_values', description: 'Get WHO dimension values (countries, regions)', parameters: 'dimension: string', isActive: true },
      ],
    },
    {
      id: 'mcp-delphi', name: 'CMU Delphi Epidata', description: 'Carnegie Mellon Delphi Group epidemiological surveillance data including COVID-19, influenza, and dengue', status: 'disconnected',
      tools: [
        { name: 'get_fluview', description: 'Get influenza-like illness surveillance data', parameters: 'regions: string, epiweeks: string', isActive: true },
        { name: 'get_covidcast', description: 'Get COVID-19 surveillance signals', parameters: 'signal: string, geo_type: string, geo_values: string', isActive: true },
        { name: 'get_dengue_nowcast', description: 'Get dengue nowcast estimates', parameters: 'epiweeks?: string', isActive: true },
      ],
    },
    {
      id: 'mcp-infectonet', description: 'InfectoNET global viral genomic surveillance for 50+ pathogens with outbreak alerts', status: 'disconnected', name: 'InfectoNET Genomic Surveillance',
      tools: [
        { name: 'list_pathogens', description: 'List all tracked viral pathogens with sequence counts', parameters: '', isActive: true },
        { name: 'get_pathogen_data', description: 'Get genomic sequence records for a specific pathogen', parameters: 'pathogen: string, limit?: number', isActive: true },
        { name: 'get_outbreak_alerts', description: 'Get live outbreak alerts from WHO/PAHO/ReliefWeb', parameters: 'pathogen?: string', isActive: true },
      ],
    },
    {
      id: 'mcp-brave', name: 'Brave Search', description: 'Web and local search using Brave Search API (requires API key)', status: 'disconnected',
      tools: [
        { name: 'web_search', description: 'Search the web', parameters: 'query: string, count?: number', isActive: true },
        { name: 'local_search', description: 'Search for local businesses and places', parameters: 'query: string, country?: string', isActive: true },
      ],
    },
  ]);

  // Agent builder & webhook state
  const [showAgentBuilder, setShowAgentBuilder] = useState(false);
  const [editingAgent, setEditingAgent] = useState<A2AAgent | undefined>();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);

  // Skills state
  const [skills, setSkills] = useState<SkillDefinition[]>(PRESET_SKILLS.map((s) => ({ ...s })));
  const [showSkillBuilder, setShowSkillBuilder] = useState(false);

  // Connectors state
  const [connectors, setConnectors] = useState<ConnectorConfig[]>([]);

  // Workspace projects state
  const [workspaceProjects, setWorkspaceProjects] = useState<WorkspaceProject[]>([]);

  useEffect(() => {
    migrateLocalStorage();
    dbGetAll<A2AAgent>('a2aAgents').then((loaded) => {
      if (loaded.length > 0) setA2aAgents(loaded);
    }).catch(() => {});
    dbGetAll<any>('kanban').then((loaded) => {
      if (loaded.length > 0) {
        const parsed = loaded.map((item: any) => {
          if (item && item.boards) {
            try { return JSON.parse(item.boards) as KanbanBoard; } catch { return item; }
          }
          return item as KanbanBoard;
        }).filter((b: any) => b && b.id);
        setKanbanBoards(parsed);
        if (parsed.length > 0) setActiveBoardId(parsed[0].id);
      }
    }).catch(() => {});
    dbGetAll<MCPServer>('sandbox').then((loaded) => {
      if (loaded.length > 0) setMcpServers(loaded);
    }).catch(() => {});
    dbGetKey('ui-theme').then((v) => { if (v) { setSelectedTheme(v); try { localStorage.setItem('oks_ui-theme', v); } catch {} } else { try { const l = localStorage.getItem('oks_ui-theme'); if (l) setSelectedTheme(l); } catch {} } }).catch(() => {});
    dbGetKey('ui-accent').then((v) => { if (v) { setAccentColor(v); try { localStorage.setItem('oks_ui-accent', v); } catch {} } else { try { const l = localStorage.getItem('oks_ui-accent'); if (l) setAccentColor(l); } catch {} } }).catch(() => {});
    setWebhooks(getAllWebhooks());
    loadSkillRegistry().then(() => {
      const reg = getSkillRegistry();
      if (reg.length > 0) setSkills(reg);
    });
    loadConnectors().then(() => setConnectors(getConnectors()));
    dbGetAll<any>('workspaceProjects').then((loaded: any[]) => {
      if (loaded.length > 0) setWorkspaceProjects(loaded.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { a2aAgents.forEach((a) => dbPut('a2aAgents', a).catch(() => {})); }, 100);
    return () => clearTimeout(t);
  }, [a2aAgents]);

  useEffect(() => {
    const t = setTimeout(() => { kanbanBoards.forEach((b) => dbPut('kanban', { id: `kb-${b.id}`, boards: JSON.stringify(b) }).catch(() => {})); }, 100);
    return () => clearTimeout(t);
  }, [kanbanBoards]);

  useEffect(() => {
    const unsub = subscribeAuth((u) => setCurrentUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      updateUserDoc({
        files: JSON.parse(JSON.stringify(files)),
        folders: JSON.parse(JSON.stringify(folders)),
        providerConfig,
        savedPrompts,
        lastSync: new Date().toISOString(),
      }).catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser, files, folders, providerConfig, savedPrompts]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-sepia', 'theme-forest', 'theme-ocean', 'theme-midnight', 'theme-solarized');
    if (selectedTheme !== 'dark') {
      root.classList.add(`theme-${selectedTheme}`);
    }
    root.style.setProperty('--accent', accentColor);
    root.style.setProperty('--accent-light', adjustColor(accentColor, 40));
    root.style.setProperty('--accent-dark', adjustColor(accentColor, -40));
    root.style.setProperty('--accent-subtle', `${accentColor}1a`);
    root.style.setProperty('--accent-subtler', `${accentColor}0a`);
    dbSetKey('ui-theme', selectedTheme).catch(() => {});
    dbSetKey('ui-accent', accentColor).catch(() => {});
    try { localStorage.setItem('oks_ui-theme', selectedTheme); } catch {}
    try { localStorage.setItem('oks_ui-accent', accentColor); } catch {}
  }, [selectedTheme, accentColor]);

  function adjustColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xFF) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xFF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  const handleSaveFileWrapper = useCallback((updatedFile: KBFile) => {
    handleSaveFile(updatedFile);
    fireWebhooks('file:created', { fileName: updatedFile.name, fileId: updatedFile.id });
  }, [handleSaveFile]);

  const handleSaveVersion = useCallback((docId: string, content: string, label?: string) => {
    const version: DocumentVersion = {
      id: `v-${Date.now()}`,
      documentId: docId,
      content,
      createdAt: new Date(),
      size: `${(content.length / 1024).toFixed(1)} KB`,
      label,
    };
    setDocumentVersions((prev) => [...prev, version]);
    dbPut('versions', version).catch(() => {});
  }, []);

  const handleA2ADebate = async (topic: string) => {
    setIsA2ALoading(true);
    const contextDocs = files.filter((f) => f.isActive).map((f) => `### ${f.name}\n${f.content}`).join('\n\n') || undefined;
    const responses = await runA2ADebate(topic, a2aAgents, providerConfig, contextDocs, (agentName, response, latency) => {
      const metric: A2AMetric = {
        id: `m-${Date.now()}-${agentName}`,
        timestamp: new Date().toISOString(),
        topic,
        agentId: a2aAgents.find((a) => a.name === agentName)?.id || '',
        agentName,
        latencyMs: latency,
        tokensEstimated: Math.round(response.length / 4),
        status: 'success',
      };
      setA2aMetrics((prev) => [...prev, metric]);
    });
    setIsA2ALoading(false);
    fireWebhooks('a2a:complete', { topic, agentCount: a2aAgents.length });
    const summaryMsg: ChatMessage = {
      id: `debate-${Date.now()}`,
      text: `## A2A Debate Results\n\n${a2aAgents.map((a, i) => `### ${a.name}\n${responses[i]}`).join('\n\n')}\n\n### Consensus\n${responses[responses.length - 1]}`,
      sender: MessageSender.MODEL,
      timestamp: new Date(),
    };
    setMessages([...messages, summaryMsg]);
  };

  const handleOrchestratedDebate = async () => {
    const topic = `Design a comprehensive knowledge management strategy for field researchers`;
    setIsA2ALoading(true);
    const contextDocs = files.filter((f) => f.isActive).map((f) => `### ${f.name}\n${f.content}`).join('\n\n') || undefined;
    const response = await runOrchestratedWorkflow(topic, a2aAgents, providerConfig, contextDocs, (agentName, response, latency) => {
      const metric: A2AMetric = {
        id: `m-${Date.now()}-${agentName}`,
        timestamp: new Date().toISOString(), topic,
        agentId: a2aAgents.find((a) => a.name === agentName)?.id || '',
        agentName, latencyMs: latency,
        tokensEstimated: Math.round(response.length / 4),
        status: 'success',
      };
      setA2aMetrics((prev) => [...prev, metric]);
    });
    setIsA2ALoading(false);
    const summaryMsg: ChatMessage = {
      id: `orch-${Date.now()}`, text: response,
      sender: MessageSender.MODEL, timestamp: new Date(),
    };
    setMessages([...messages, summaryMsg]);
  };

  const handleSequentialDebate = async () => {
    const topic = `Draft a research report on epidemiological trends in emerging infectious diseases`;
    setIsA2ALoading(true);
    const contextDocs = files.filter((f) => f.isActive).map((f) => `### ${f.name}\n${f.content}`).join('\n\n') || undefined;
    const rawChain = [
      a2aAgents.find((a) => a.id === 'research')!,
      a2aAgents.find((a) => a.id === 'writer')!,
      a2aAgents.find((a) => a.id === 'review')!,
      a2aAgents.find((a) => a.id === 'coord')!,
    ].filter(Boolean);
    const workflowChain = rawChain.map((a) => ({ agentId: a.id, name: a.name, systemPrompt: a.systemPrompt }));
    if (workflowChain.length < 2) { setIsA2ALoading(false); return; }
    const response = await runSequentialWorkflow(topic, workflowChain, providerConfig, contextDocs, (agentName, response, latency) => {
      const metric: A2AMetric = {
        id: `m-seq-${Date.now()}-${agentName}`,
        timestamp: new Date().toISOString(), topic,
        agentId: a2aAgents.find((a) => a.name === agentName)?.id || '',
        agentName, latencyMs: latency,
        tokensEstimated: Math.round(response.length / 4),
        status: 'success',
      };
      setA2aMetrics((prev) => [...prev, metric]);
    });
    setIsA2ALoading(false);
    const summaryMsg: ChatMessage = {
      id: `seq-${Date.now()}`, text: response,
      sender: MessageSender.MODEL, timestamp: new Date(),
    };
    setMessages([...messages, summaryMsg]);
  };

  const handleSaveAgent = (agent: A2AAgent) => {
    setA2aAgents((prev) => {
      const exists = prev.some((a) => a.id === agent.id);
      return exists ? prev.map((a) => a.id === agent.id ? agent : a) : [...prev, agent];
    });
    setShowAgentBuilder(false);
    setEditingAgent(undefined);
  };

  const handleDeleteAgent = (id: string) => {
    setA2aAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddWebhook = (config: Omit<WebhookConfig, 'id' | 'createdAt'>) => {
    const hook = addWebhook(config);
    setWebhooks(getAllWebhooks());
    return hook;
  };

  const handleRemoveWebhook = (id: string) => {
    removeWebhookSvc(id);
    setWebhooks(getAllWebhooks());
  };

  const handleUpdateWebhook = (id: string, updates: Partial<WebhookConfig>) => {
    updateWebhookSvc(id, updates);
    setWebhooks(getAllWebhooks());
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (parsed.files) setFiles(parsed.files);
      if (parsed.folders) setFolders(parsed.folders);
      if (parsed.providerConfig) setProviderConfig(parsed.providerConfig);
      if (parsed.savedPrompts) setSavedPrompts(parsed.savedPrompts);
      if (parsed.a2aAgents) setA2aAgents(parsed.a2aAgents);
      if (parsed.kanban) setKanbanBoards(parsed.kanban.map((b: any) => JSON.parse(b.boards)));
      if (parsed.mcpServers) setMcpServers(parsed.mcpServers);
      await importAllData(text);
    } catch {}
    e.target.value = '';
  };

  const handleExportAll = async () => {
    const data = await exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oks-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeBoard = kanbanBoards.find((b) => b.id === activeBoardId) || null;

  const handleUpdateBoard = useCallback((board: KanbanBoard) => {
    setKanbanBoards((prev) => prev.map((b) => b.id === board.id ? board : b));
  }, []);

  const handleCreateBoard = useCallback((title: string) => {
    const board: KanbanBoard = {
      id: `board-${Date.now()}`,
      title,
      columns: [
        { id: 'col-todo', title: 'To Do', color: '#3B82F6', order: 0 },
        { id: 'col-progress', title: 'In Progress', color: '#F59E0B', order: 1 },
        { id: 'col-done', title: 'Done', color: '#10B981', order: 2 },
      ],
      cards: [],
    };
    setKanbanBoards((prev) => [...prev, board]);
    setActiveBoardId(board.id);
  }, []);

  const handleDeleteBoard = useCallback((id: string) => {
    setKanbanBoards((prev) => prev.filter((b) => b.id !== id));
    if (activeBoardId === id) {
      setKanbanBoards((prev) => {
        if (prev.length > 0) setActiveBoardId(prev[0].id);
        return prev;
      });
    }
  }, [activeBoardId]);

  const handleMCPAddServer = useCallback((server: MCPServer) => {
    setMcpServers((prev) => {
      const updated = prev.some((s) => s.id === server.id)
        ? prev.map((s) => s.id === server.id ? server : s)
        : [...prev, server];
      dbPut('sandbox', { id: 'mcp-servers', settings: JSON.stringify(updated) }).catch(() => {});
      return updated;
    });
  }, []);

  const handleMCPRemoveServer = useCallback((id: string) => {
    setMcpServers((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      dbPut('sandbox', { id: 'mcp-servers', settings: JSON.stringify(updated) }).catch(() => {});
      return updated;
    });
  }, []);

  // Skill handlers
  const handleCreateSkill = useCallback(() => {
    const newSkill: SkillDefinition = {
      id: `skill-${Date.now()}`,
      name: 'new-skill',
      description: 'Custom skill definition',
      category: 'research',
      instructions: 'Define skill instructions here.',
      allowedTools: [],
      priority: 'medium',
      triggers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSkills((prev) => [...prev, newSkill]);
    addSkill(newSkill).catch(() => {});
  }, []);

  const handleDeleteSkill = useCallback((id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    removeSkill(id).catch(() => {});
  }, []);

  // Provider test handler
  const handleTestProvider = useCallback(async (provider: LLMProvider, apiKey: string): Promise<boolean> => {
    if (!apiKey) return false;
    try {
      const testConfig: ProviderConfig = { ...providerConfig, provider, apiKey };
      await queryLLM(
        [{ id: 'test', text: 'Reply with "ok" if you can read this.', sender: MessageSender.USER, timestamp: new Date() }],
        testConfig,
        undefined,
        'Reply with exactly one word: ok'
      );
      return true;
    } catch {
      return false;
    }
  }, [providerConfig]);

  const handleMCPToggleTool = useCallback((serverId: string, toolName: string) => {
    setMcpServers((prev) => prev.map((s) => s.id === serverId ? {
      ...s, tools: s.tools.map((t) => t.name === toolName ? { ...t, isActive: !t.isActive } : t),
    } : s));
  }, []);

  const navItems: { view: AppView; icon: React.ReactNode; label: string }[] = [
    { view: 'chat', icon: <MessageSquare size={14} />, label: 'Chat' },
    { view: 'editor', icon: <Edit size={14} />, label: 'Editor' },
    { view: 'search', icon: <Search size={14} />, label: 'Search' },
    { view: 'observability', icon: <Activity size={14} />, label: 'Dashboard' },
    { view: 'kanban', icon: <Kanban size={14} />, label: 'Kanban' },
    { view: 'templates', icon: <Template size={14} />, label: 'Templates' },
    { view: 'mcp', icon: <Database size={14} />, label: 'MCP' },
    { view: 'skills', icon: <BookOpen size={14} />, label: 'Skills' },
    { view: 'tools', icon: <Wrench size={14} />, label: 'Tools' },
    { view: 'data', icon: <Database size={14} />, label: 'Data' },
    { view: 'knowledge', icon: <Globe size={14} />, label: 'Knowledge' },
    { view: 'docs', icon: <BookOpen size={14} />, label: 'Docs' },
  ];

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-(--bg-primary) text-(--text-primary) overflow-hidden">
        <header className="h-11 flex items-center justify-between px-3 bg-(--bg-secondary) border-b border-(--border) shrink-0 no-print">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded hover:bg-(--bg-hover)" aria-label="Toggle sidebar">
              <Menu size={16} className="text-(--text-secondary)" />
            </button>
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-(--accent)" />
              <span className="text-sm font-semibold hidden sm:inline">Open Knowledge Studio</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-(--accent-subtle) text-(--accent)">v2.0</span>
            </div>
            <nav className="flex items-center gap-0.5 ml-4 overflow-x-auto" aria-label="Main navigation">
              {navItems.map(({ view, icon, label }) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${activeView === view ? 'bg-(--accent-subtle) text-(--accent)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
                  aria-label={`Switch to ${label} view`}
                  aria-current={activeView === view ? 'page' : undefined}
                >
                  {icon}
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-[10px]">
              {isOnline ? <Wifi size={12} className="text-green-400" /> : <WifiOff size={12} className="text-red-400" />}
              <span className={`hidden sm:inline ${isOnline ? 'text-green-400' : 'text-red-400'}`}>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            {currentUser && <Cloud size={14} className="text-(--accent)" />}
            {isInstallable && (
              <button onClick={promptInstall} className="p-1.5 rounded hover:bg-(--bg-hover)" title="Install App">
                <Download size={14} className="text-(--text-secondary)" />
              </button>
            )}
            <button onClick={() => { setShowGooglePanel(!showGooglePanel); setShowGmailCompose(false); }} className="p-1.5 rounded hover:bg-(--bg-hover)" title="Google Workspace" aria-label="Toggle Google Workspace panel">
              <Globe size={14} className="text-(--text-secondary)" />
            </button>
            <button onClick={() => { setShowGmailCompose(!showGmailCompose); setShowGooglePanel(false); }} className="p-1.5 rounded hover:bg-(--bg-hover)" title="Compose Email" disabled={!currentUser} aria-label="Compose email">
              <Mail size={14} className="text-(--text-secondary)" />
            </button>
            <button onClick={() => { setShowICD11(!showICD11); setShowEpiMap(false); }} className={`p-1.5 rounded hover:bg-(--bg-hover) ${showICD11 ? 'bg-(--accent-subtle)' : ''}`} title="ICD-11 Code Lookup" aria-label="Toggle ICD-11 code lookup">
              <Book size={14} className="text-(--text-secondary)" />
            </button>
            <button onClick={() => { setShowEpiMap(!showEpiMap); setShowICD11(false); }} className={`p-1.5 rounded hover:bg-(--bg-hover) ${showEpiMap ? 'bg-(--accent-subtle)' : ''}`} title="Epidemiology Map" aria-label="Toggle epidemiology map">
              <MapPin size={14} className="text-(--text-secondary)" />
            </button>
            <ThemeSwitcher theme={selectedTheme} onThemeChange={setSelectedTheme} accentColor={accentColor} onAccentColorChange={setAccentColor} />
            <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 rounded hover:bg-(--bg-hover)" aria-label="Open settings">
              <Settings size={14} className="text-(--text-secondary)" />
            </button>
            {currentUser ? (
              <button onClick={logoutUser} className="flex items-center gap-1 text-xs text-(--text-secondary) hover:text-red-400" title={currentUser.email || ''}>
                {currentUser.photoURL && <img src={currentUser.photoURL} alt="" className="w-5 h-5 rounded-full" />}
              </button>
            ) : (
              <button onClick={signInWithGoogle} className="text-xs bg-(--accent) text-white px-2 py-1 rounded hover:bg-(--accent-dark)" aria-label="Sign in with Google">Sign in</button>
            )}
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {isSidebarOpen && (
            <aside className="w-72 border-r border-(--border) bg-(--bg-secondary)/50 hidden md:flex flex-col shrink-0 overflow-hidden" aria-label="Workspace sidebar">
              <div className="flex-1 overflow-y-auto">
                <WorkspaceManager
                  files={files}
                  folders={folders}
                  agents={a2aAgents}
                  tags={tags}
                  activeProjectId={activeProjectId}
                  onSwitchProject={setActiveProjectId}
                  onCreateProject={(name) => {
                    const id = `proj-${Date.now()}`;
                    const proj: WorkspaceProject = { id, name, description: '', createdAt: new Date(), updatedAt: new Date(), fileCount: 0, agentCount: 0, tags: [], agentIds: [] };
                    setWorkspaceProjects((prev) => [...prev, proj]);
                    setFolders((prev) => [...prev, { id, name }]);
                    setActiveProjectId(id);
                  }}
                  onDeleteProject={(id) => {
                    setFolders((prev) => prev.filter((f) => f.id !== id));
                    setFiles((prev) => prev.filter((f) => f.parentFolderId !== id));
                    setWorkspaceProjects((prev) => prev.filter((p) => p.id !== id));
                    if (activeProjectId === id) setActiveProjectId('default');
                  }}
                  onAddAgent={() => {}}
                  onRemoveAgent={() => {}}
                  projects={workspaceProjects}
                />
                <div className="border-t border-(--border) my-2" />
                <KnowledgeBaseManager
                  files={files}
                  folders={folders}
                  setFiles={setFiles}
                  setFolders={setFolders}
                  onFileSelect={(file) => { handleFileSelect(file); setActiveView('editor'); }}
                  activeFileId={activeFile?.id || null}
                />
              </div>
            </aside>
          )}

          <main className="flex-1 flex min-w-0 overflow-hidden" aria-label="Main content">
            {activeView === 'chat' && (
              <div className="flex flex-1">
                {showChatSessions && (
                  <ChatSessionSidebar
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSwitch={switchSession}
                    onCreate={createSession}
                    onDelete={deleteSession}
                    onClose={() => setShowChatSessions(false)}
                  />
                )}
                <div className="flex-1 flex flex-col min-w-0" aria-live="polite">
                  <div className="flex items-center gap-2 px-3 py-1 border-b border-(--border) shrink-0">
                    <button onClick={() => setShowChatSessions(!showChatSessions)} className="p-1 rounded hover:bg-(--bg-hover) text-(--text-secondary)" title="Chat sessions" aria-label="Toggle chat sessions">
                      <MessageSquare size={12} />
                    </button>
                    <span className="text-[10px] text-(--text-muted)">{sessions.length} sessions</span>
                    <button onClick={createSession} className="ml-auto p-1 rounded hover:bg-(--bg-hover) text-(--text-secondary)" title="New chat" aria-label="New chat"><Plus size={12} /></button>
                  </div>
                  <ChatInterface
                    messages={messages}
                    setMessages={setMessages}
                    providerConfig={providerConfig}
                    files={files}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    initialSuggestions={initialSuggestions}
                    isFetchingSuggestions={isFetchingSuggestions}
                    setIsFetchingSuggestions={setIsFetchingSuggestions}
                    setInitialSuggestions={setInitialSuggestions}
                    onMessageSent={(text) => fireWebhooks('chat:message', { text, sender: 'user' })}
                  />
                </div>
              </div>
            )}

            {activeView === 'editor' && (
              <React.Suspense fallback={<div className="flex items-center justify-center h-full min-h-50 text-(--text-muted) text-xs">Loading...</div>}>
                <WorkspaceDocumentEditor
                  file={activeFile}
                  onSave={handleSaveFileWrapper}
                  versions={documentVersions}
                  onSaveVersion={handleSaveVersion}
                  templates={templates.map((t) => ({ id: t.id, name: t.name, content: t.content, category: t.category }))}
                />
              </React.Suspense>
            )}

            {activeView === 'search' && (
              <SearchPanel files={files} tags={tags} onFileSelect={(file) => { handleFileSelect(file); setActiveView('editor'); }} />
            )}

            {activeView === 'observability' && (
              <React.Suspense fallback={<div className="flex items-center justify-center h-full min-h-50 text-(--text-muted) text-xs">Loading...</div>}>
                <A2AMetricsDashboard metrics={a2aMetrics} agents={a2aAgents.map((a) => ({ id: a.id, name: a.name, color: a.color, avatar: a.avatar }))} />
              </React.Suspense>
            )}

            {activeView === 'kanban' && (
              <KanbanBoardView
                board={activeBoard}
                boards={kanbanBoards}
                onUpdateBoard={handleUpdateBoard}
                onCreateBoard={handleCreateBoard}
                onDeleteBoard={handleDeleteBoard}
                onSwitchBoard={(id) => setActiveBoardId(id)}
              />
            )}

            {activeView === 'mcp' && (
              <React.Suspense fallback={<div className="flex items-center justify-center h-full min-h-50 text-(--text-muted) text-xs">Loading...</div>}>
                <MCPServerPanel
                  servers={mcpServers}
                  onAddServer={handleMCPAddServer}
                  onRemoveServer={handleMCPRemoveServer}
                  onToggleTool={handleMCPToggleTool}
                />
              </React.Suspense>
            )}

            {activeView === 'skills' && (
              <div className="p-4 overflow-y-auto">
                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><BookOpen size={16} className="text-(--accent)" /> Skills Registry</h2>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="p-3 rounded-lg bg-(--bg-secondary) border border-(--border)">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{skill.name.replace(/-/g, ' ')}</span>
                          <StatusBadge status={skill.priority === 'high' ? 'error' : skill.priority === 'medium' ? 'warning' : 'info'} label={skill.priority} />
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-(--accent-subtler) text-(--accent)">{skill.category}</span>
                        </div>
                        <button onClick={() => handleDeleteSkill(skill.id)} className="p-1 rounded hover:bg-red-500/20 text-red-400"><Trash size={12} /></button>
                      </div>
                      <p className="text-[10px] text-(--text-muted) mb-2">{skill.description}</p>
                      <details className="text-[10px] text-(--text-secondary)">
                        <summary className="cursor-pointer hover:text-(--text-primary)">Instructions</summary>
                        <pre className="mt-1 p-2 rounded bg-(--bg-primary) text-[9px] whitespace-pre-wrap">{skill.instructions}</pre>
                      </details>
                      {skill.triggers.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-2">
                          {skill.triggers.map((t) => <span key={t} className="text-[8px] px-1 py-0.5 rounded bg-(--bg-hover) text-(--text-secondary)">{t}</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                  {skills.length === 0 && <p className="text-xs text-(--text-muted) text-center py-8">No skills defined.</p>}
                </div>
              </div>
            )}

            {activeView === 'data' && (
              <PublicDataPanel />
            )}

            {activeView === 'tools' && (
              <div className="flex flex-col h-full">
                <div className="flex gap-2 px-4 pt-4 border-b border-(--border)">
                  <button onClick={() => setToolsTab('tools')} className={`text-[10px] px-2 py-1 rounded-t transition-colors ${toolsTab === 'tools' ? 'bg-(--bg-secondary) text-(--accent) border border-b-0 border-(--border)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}>Tools</button>
                  <button onClick={() => setToolsTab('connectors')} className={`text-[10px] px-2 py-1 rounded-t transition-colors ${toolsTab === 'connectors' ? 'bg-(--bg-secondary) text-(--accent) border border-b-0 border-(--border)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}>Connectors</button>
                </div>
                {toolsTab === 'tools' ? (
                  <div className="flex-1 p-4 overflow-y-auto">
                    <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Wrench size={16} className="text-(--accent)" /> Built-in Tools ({BUILT_IN_TOOLS.length})</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {BUILT_IN_TOOLS.map((tool) => (
                        <div key={tool.id} className="p-3 rounded-lg bg-(--bg-secondary) border border-(--border)">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{tool.name}</span>
                            <div className="flex gap-1">
                              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                                tool.permission === 'safe' ? 'bg-green-500/10 text-green-400' :
                                tool.permission === 'standard' ? 'bg-blue-500/10 text-blue-400' :
                                tool.permission === 'elevated' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                              }`}>{tool.permission}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-(--text-muted)">{tool.description}</p>
                          <div className="flex gap-1 mt-1">
                            <span className="text-[8px] px-1 py-0.5 rounded bg-gray-500/10 text-(--text-secondary)">{tool.category}</span>
                            {tool.requiresConfirmation && <span className="text-[8px] px-1 py-0.5 rounded bg-orange-500/10 text-orange-400">Requires confirm</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ConnectorPanel />
                )}
              </div>
            )}

            {activeView === 'knowledge' && (
              <div className="p-4 overflow-y-auto">
                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Globe size={16} className="text-(--accent)" /> Knowledge Sources</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Wikipedia', desc: 'Encyclopedic articles', rate: 'Unlimited', icon: '📚' },
                    { name: 'arXiv', desc: 'Academic preprints', rate: 'Unlimited', icon: '📄' },
                    { name: 'OpenAlex', desc: 'Scholarly works & citations', rate: '100K/day', icon: '🎓' },
                    { name: 'PubMed', desc: 'Biomedical literature', rate: '10/sec', icon: '🔬' },
                    { name: 'Semantic Scholar', desc: 'Paper summaries & TLDRs', rate: '100/sec', icon: '🤖' },
                    { name: 'WHO GHO', desc: 'Global health indicators', rate: 'Unlimited', icon: '🌍' },
                    { name: 'GDELT', desc: 'Global news monitoring', rate: '20/min', icon: '📰' },
                    { name: 'CrossRef', desc: 'DOI lookup & metadata', rate: '50/sec', icon: '🔗' },
                  ].map((src) => (
                    <div key={src.name} className="p-3 rounded-lg bg-(--bg-secondary) border border-(--border)">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{src.icon}</span>
                        <span className="text-xs font-medium">{src.name}</span>
                      </div>
                      <p className="text-[10px] text-(--text-muted) mb-1">{src.desc}</p>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">{src.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'docs' && <DocumentationViewer />}

            {activeView === 'templates' && (
              <div className="p-4 overflow-y-auto">
                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Template size={16} className="text-(--accent)" /> Document Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.map((t) => (
                    <div key={t.id} className="p-4 rounded-lg bg-(--bg-secondary) border border-(--border) hover:border-(--accent)/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-medium">{t.name}</h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-(--accent-subtler) text-(--accent)">{t.category}</span>
                      </div>
                      <p className="text-[10px] text-(--text-muted) mb-3">{t.description}</p>
                      <button
                        onClick={() => {
                          const newFile: KBFile = {
                            id: `template-${Date.now()}`,
                            name: `${t.name}.md`,
                            type: 'markdown',
                            content: t.content,
                            size: `${(t.content.length / 1024).toFixed(1)} KB`,
                            parentFolderId: null,
                            isActive: false,
                            createdAt: new Date(),
                          };
                          setFiles((prev) => [newFile, ...prev]);
                          setActiveFile(newFile);
                          setActiveView('editor');
                        }}
                        className="text-[10px] bg-(--accent) text-white px-3 py-1 rounded hover:bg-(--accent-dark)"
                        aria-label={`Use template: ${t.name}`}
                      >
                        Use Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {showGooglePanel && (
            <aside className="w-80 border-l border-(--border) bg-(--bg-secondary)/50 shrink-0 hidden md:block">
              <React.Suspense fallback={<div className="flex items-center justify-center h-full min-h-50 text-(--text-muted) text-xs">Loading...</div>}>
                <GoogleWorkspacePanel currentFile={activeFile || undefined} />
              </React.Suspense>
            </aside>
          )}

          {showGmailCompose && (
            <aside className="w-80 border-l border-(--border) bg-(--bg-secondary)/50 shrink-0 hidden md:block">
              <GmailCompose
                currentFile={activeFile || undefined}
                userEmail={currentUser?.email}
                onClose={() => setShowGmailCompose(false)}
              />
            </aside>
          )}

          {showICD11 && (
            <aside className="w-80 border-l border-(--border) shrink-0 hidden md:block">
              <ICD11Lookup
                onSelect={(entry) => console.log('ICD-11 Selected:', entry)}
                onClose={() => setShowICD11(false)}
              />
            </aside>
          )}

          {showEpiMap && (
            <aside className="w-80 border-l border-(--border) bg-(--bg-secondary)/50 shrink-0 hidden md:block">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-3 py-2 border-b border-(--border) shrink-0">
                  <h2 className="text-xs font-semibold flex items-center gap-1.5">
                    <MapPin size={12} className="text-(--accent)" />
                    Epidemiology Map
                  </h2>
              <button onClick={() => setShowEpiMap(false)} className="p-1 rounded hover:bg-(--bg-hover) text-(--text-secondary)" aria-label="Close epidemiology map">
                <X size={12} />
              </button>
                </div>
                <div className="flex-1 overflow-hidden p-2">
                  <EpiMap dataPoints={epiDataPoints} height="100%" timelineData={epiTimelineData} onTimeChange={handleEpiTimeChange} />
                </div>
              </div>
            </aside>
          )}
        </div>

        {showAgentBuilder && (
          <AgentBuilder
            onSave={handleSaveAgent}
            onClose={() => { setShowAgentBuilder(false); setEditingAgent(undefined); }}
            editAgent={editingAgent}
            allSkills={skills.map((s) => s.id)}
          />
        )}

        <React.Suspense fallback={<div className="flex items-center justify-center h-full min-h-50 text-(--text-muted) text-xs">Loading...</div>}>
          <SettingsPanel
            show={showSettings}
            onClose={() => setShowSettings(false)}
            providerConfig={providerConfig}
            onProviderConfigChange={setProviderConfig}
            a2aAgents={a2aAgents}
            isA2ALoading={isA2ALoading}
            onRunDebate={() => handleA2ADebate('Discuss the best approach to build a resilient knowledge base for field researchers')}
            onExportAll={handleExportAll}
            onImport={handleImport}
            sandboxSettings={sandboxSettings}
            onSandboxChange={setSandboxSettings}
            onEditAgent={(agent) => { setEditingAgent(agent); setShowAgentBuilder(true); }}
            onCreateAgent={() => { setEditingAgent(undefined); setShowAgentBuilder(true); }}
            onDeleteAgent={handleDeleteAgent}
            webhooks={webhooks}
            onAddWebhook={handleAddWebhook}
            onRemoveWebhook={handleRemoveWebhook}
            onUpdateWebhook={handleUpdateWebhook}
            skills={skills}
            onCreateSkill={handleCreateSkill}
            onDeleteSkill={handleDeleteSkill}
            onTestProvider={handleTestProvider}
          />
        </React.Suspense>

        <footer className="h-6 flex items-center justify-between px-3 bg-(--bg-secondary) border-t border-(--border) text-[10px] text-(--text-muted) shrink-0 no-print">
          <div className="flex items-center gap-3">
            <span>{files.length} files</span>
            <span>{folders.length} folders</span>
            <span>{documentVersions.length} versions</span>
          </div>
          <div className="flex items-center gap-3">
            <span>IndexedDB</span>
            <span>{providerConfig.selectedModel}</span>
            {currentUser && <span className="hidden sm:inline">{currentUser.email}</span>}
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
