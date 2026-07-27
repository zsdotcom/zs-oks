import type { DocumentTemplate } from '../types';

export const SEED_TEMPLATES: DocumentTemplate[] = [
  // ─── Research ───
  {
    id: 't-res-lit-review', name: 'Systematic Literature Review', description: 'PRISMA-compliant systematic literature review workflow', category: 'research',
    content: '# SYSTEMATIC LITERATURE REVIEW\n\n## Research Question\n\n## Search Strategy\n- Databases:\n- Search terms:\n- Date range:\n- Language:\n\n## PRISMA Flow Diagram\n\n```mermaid\nflowchart TD\n  A[Records identified] --> B[Duplicates removed]\n  B --> C[Records screened]\n  C --> D[Full-text assessed]\n  D --> E[Studies included]\n  C -.-> F[Excluded: title/abstract]\n  D -.-> G[Excluded: full-text]\n```\n\n## Inclusion Criteria\n1.\n2.\n3.\n\n## Exclusion Criteria\n1.\n2.\n3.\n\n## Quality Assessment\n| Study | Design | Quality Score | Risk of Bias |\n|---|---|---|---|\n| | | | |\n\n## Data Extraction\n| Study | Population | Intervention | Outcome | Findings |\n|---|---|---|---|---|\n| | | | | |\n\n## Synthesis\n\n## Conclusion\n\n## References\n',
    icon: 'BookOpen',
  },
  {
    id: 't-res-paper', name: 'Academic Paper (IMRaD)', description: 'Complete IMRaD academic paper structure', category: 'research',
    content: '# TITLE\n\n## Abstract\n- Background:\n- Methods:\n- Results:\n- Conclusions:\n- Keywords:\n\n## 1. Introduction\n\n## 2. Methods\n\n## 3. Results\n\n## 4. Discussion\n\n## 5. Conclusion\n\n## References\n',
    icon: 'FileEdit',
  },
  {
    id: 't-res-thesis', name: 'Thesis Outline', description: 'Comprehensive thesis/dissertation outline', category: 'research',
    content: '# THESIS OUTLINE\n\n**Working Title:**\n\n## Abstract\n\n## Chapter 1: Introduction\n- 1.1 Background\n- 1.2 Problem Statement\n- 1.3 Research Questions\n- 1.4 Objectives\n- 1.5 Significance\n- 1.6 Scope\n- 1.7 Thesis Structure\n\n## Chapter 2: Literature Review\n- 2.1 Theoretical Framework\n- 2.2 Review of Empirical Studies\n- 2.3 Research Gap\n- 2.4 Conceptual Framework\n\n## Chapter 3: Methodology\n- 3.1 Research Design\n- 3.2 Data Collection\n- 3.3 Data Analysis\n- 3.4 Ethical Considerations\n\n## Chapter 4: Results\n- 4.1 Descriptive Statistics\n- 4.2 Main Findings\n- 4.3 Secondary Findings\n\n## Chapter 5: Discussion\n- 5.1 Interpretation of Findings\n- 5.2 Comparison with Literature\n- 5.3 Implications\n- 5.4 Limitations\n\n## Chapter 6: Conclusion\n- 6.1 Summary\n- 6.2 Contributions\n- 6.3 Recommendations\n- 6.4 Future Research\n\n## References\n\n## Appendices\n',
    icon: 'Book',
  },
  {
    id: 't-res-lit-matrix', name: 'Literature Review Matrix', description: 'Synthesis matrix for organizing literature findings', category: 'research',
    content: '# LITERATURE REVIEW MATRIX\n\n**Research Question:**\n\n| Study | Year | Design | Sample | Key Findings | Strengths | Limitations | Relevance |\n|---|---|---|---|---|---|---|---|\n| | | | | | | | |\n| | | | | | | | |\n\n## Themes Identified\n1.\n2.\n3.\n\n## Gaps\n1.\n2.\n\n## Synthesis\n',
    icon: 'SearchCheck',
  },

  // ─── Clinical / Epidemiology ───
  {
    id: 't-clin-case-series', name: 'Case Series Report', description: 'Standard case series reporting template', category: 'clinical',
    content: '# CASE SERIES REPORT\n\n## Title\n\n## Introduction\n\n## Case Presentations\n### Case 1\n- Age/Sex:\n- Presentation:\n- Investigations:\n- Treatment:\n- Outcome:\n\n### Case 2\n\n### Case 3\n\n## Discussion\n\n## Conclusion\n\n## References\n',
    icon: 'Target',
  },
  {
    id: 't-clin-clinical-trial', name: 'Clinical Trial Protocol', description: 'Standard clinical trial protocol per SPIRIT guidelines', category: 'clinical',
    content: '# CLINICAL TRIAL PROTOCOL\n\n**Trial Title:**\n**Protocol ID:**\n**Version:**\n**Date:**\n\n## 1. Administrative Information\n- Sponsor:\n- Principal Investigator:\n- Coordinating Center:\n\n## 2. Background & Rationale\n\n## 3. Objectives\n- Primary:\n- Secondary:\n\n## 4. Trial Design\n- Type:\n- Randomization:\n- Blinding:\n- Allocation ratio:\n\n## 5. Participants\n- Inclusion criteria:\n- Exclusion criteria:\n- Setting:\n\n## 6. Interventions\n- Experimental:\n- Control:\n\n## 7. Outcomes\n- Primary endpoint:\n- Secondary endpoints:\n\n## 8. Sample Size\n\n## 9. Statistical Methods\n\n## 10. Data Management\n\n## 11. Ethical Considerations\n\n## 12. Dissemination\n\n## References\n',
    icon: 'Target',
  },

  // ─── Project / MCP ───
  {
    id: 't-proj-mcp-server', name: 'MCP Server Configuration', description: 'Model Context Protocol server setup guide', category: 'mcp',
    content: '# MCP SERVER CONFIGURATION\n\n## Server Details\n- Name:\n- Description:\n- Base URL:\n\n## Tools\n### Tool 1\n- Name:\n- Description:\n- Parameters:\n\n## Authentication\n- Type:\n- API Key:\n\n## Testing\n```bash\n# Test connection\ncurl -X POST $MCP_URL/tools\n```\n',
    icon: 'Wrench',
  },
  {
    id: 't-proj-custom-agent', name: 'Custom A2A Agent Scaffold', description: 'Blueprint for creating a new A2A agent', category: 'mcp',
    content: '# CUSTOM A2A AGENT\n\n## Agent Identity\n- Name:\n- Role:\n- Avatar:\n- Color:\n\n## System Prompt\n\n## Skills\n- skill-1:\n- skill-2:\n\n## Allowed Tools\n- tool-1\n- tool-2\n\n## Memory Settings\n- Type:\n- Max Turn Depth:\n\n## Provider\n- Provider:\n- Model:\n',
    icon: 'Brain',
  },
  {
    id: 't-proj-skill-def', name: 'Skill Definition Template', description: 'Template for creating a new skill in the registry', category: 'mcp',
    content: '# SKILL DEFINITION\n\n## Basic Info\n- Name:\n- Description:\n- Category:\n\n## Instructions\n1.\n2.\n3.\n\n## Allowed Tools\n-\n-\n\n## Triggers\n-, -, ,\n\n## Priority\n',
    icon: 'Zap',
  },
  {
    id: 't-proj-connector', name: 'Connector Configuration', description: 'Setup guide for GitHub, Slack, RSS, or webhook connectors', category: 'mcp',
    content: '# CONNECTOR CONFIGURATION\n\n## Type\n- GitHub / Slack / RSS / Webhook\n\n## Name\n\n## Configuration\n| Key | Value |\n|---|---|\n| | |\n\n## Testing\n\n## Troubleshooting\n',
    icon: 'Globe',
  },

  // ─── Mermaid Diagrams ───
  {
    id: 't-mermaid-flowchart', name: 'Flowchart (Mermaid)', description: 'Basic flowchart diagram template', category: 'mermaid',
    content: '```mermaid\nflowchart TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Process]\n  B -->|No| D[End]\n  C --> D\n```\n\n## Usage\n- `flowchart TD` - top-down\n- `flowchart LR` - left-right\n- `A[Rect]` - rectangle node\n- `A{Rhomb}` - diamond/decision\n- `-->|Label|` - labeled edge',
    icon: 'GitMerge',
  },
  {
    id: 't-mermaid-seq', name: 'Sequence Diagram (Mermaid)', description: 'API workflow sequence diagram', category: 'mermaid',
    content: '```mermaid\nsequenceDiagram\n  participant User\n  participant App\n  participant API\n  participant DB\n  \n  User->>App: Request\n  App->>API: Fetch data\n  API-->>App: Response\n  App->>DB: Cache\n  App-->>User: Result\n```\n\n## Usage\n- `participant Name` - define actor\n- `->>` - solid arrow (sync)\n- `-->>` - dashed arrow (async)\n- `Note over A,B:` - annotation',
    icon: 'Activity',
  },
  {
    id: 't-mermaid-gantt', name: 'Gantt Chart (Mermaid)', description: 'Project timeline Gantt chart', category: 'mermaid',
    content: '```mermaid\ngantt\n  title Project Timeline\n  dateFormat YYYY-MM-DD\n  \n  section Research\n  Literature Review     :a1, 2026-01-01, 30d\n  Data Collection        :a2, after a1, 20d\n  \n  section Analysis\n  Statistical Analysis   :a3, after a2, 14d\n  Write Results          :a4, after a3, 10d\n  \n  section Publication\n  Review Process         :a5, after a4, 7d\n  Final Submission       :milestone, after a5, 0d\n```',
    icon: 'BarChart',
  },
  {
    id: 't-mermaid-er', name: 'Entity Relationship (Mermaid)', description: 'Database schema ER diagram', category: 'mermaid',
    content: '```mermaid\n---\ntitle: Database Schema\n---\nerDiagram\n  USER ||--o{ DOCUMENT : owns\n  USER ||--o{ PROJECT : creates\n  DOCUMENT ||--o{ VERSION : has\n  PROJECT ||--o{ AGENT : contains\n  \n  USER {\n    string id PK\n    string email\n    string name\n  }\n  DOCUMENT {\n    string id PK\n    string title\n    string content\n    date created_at\n  }\n```',
    icon: 'Database',
  },

  // ─── Mathematics ───
  {
    id: 't-math-stats', name: 'Statistical Formulas', description: 'Common statistical formulas in KaTeX', category: 'math',
    content: '# Statistical Formulas\n\n## Mean\n$$\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}$$\n\n## Standard Deviation\n$$s = \\sqrt{\\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n-1}}$$\n\n## Standard Error\n$$SE = \\frac{s}{\\sqrt{n}}$$\n\n## Confidence Interval (mean)\n$$CI = \\bar{x} \\pm t_{\\alpha/2, n-1} \\times \\frac{s}{\\sqrt{n}}$$\n\n## Chi-Square\n$$\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}$$\n\n## t-Test (independent)\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}$$\n\n## Linear Regression\n$$y = \\beta_0 + \\beta_1 x + \\varepsilon$$\n\n## Pearson Correlation\n$$r = \\frac{\\sum(x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum(x_i - \\bar{x})^2 \\sum(y_i - \\bar{y})^2}}$$',
    icon: 'BarChart3',
  },
  {
    id: 't-math-epidemiology', name: 'Epidemiological Formulas', description: 'Key epidemiological and outbreak formulas', category: 'math',
    content: '# Epidemiological Formulas\n\n## Attack Rate\n$$Attack\\ Rate = \\frac{New\\ Cases}{Population\\ at\\ Risk} \\times 100\\%$$\n\n## Secondary Attack Rate\n$$SAR = \\frac{Secondary\\ Cases}{Total\\ Contacts} \\times 100\\%$$\n\n## Case Fatality Rate\n$$CFR = \\frac{Deaths}{Confirmed\\ Cases} \\times 100\\%$$\n\n## Mortality Rate\n$$Mortality\\ Rate = \\frac{Deaths}{Population} \\times 100,000$$\n\n## Basic Reproduction Number\n$$R_0 = \\frac{\\beta}{\\gamma}$$\n\n## Effective Reproduction Number\n$$R_t = R_0 \\times (1 - V_e \\times V_c)$$\n\n## Herd Immunity Threshold\n$$HIT = 1 - \\frac{1}{R_0}$$\n\n## Odds Ratio\n$$OR = \\frac{ad}{bc}$$\n\n## Relative Risk\n$$RR = \\frac{a/(a+b)}{c/(c+d)}$$\n\n## Sensitivity\n$$Sensitivity = \\frac{TP}{TP + FN}$$\n\n## Specificity\n$$Specificity = \\frac{TN}{TN + FP}$$\n\n## Positive Predictive Value\n$$PPV = \\frac{TP}{TP + FP}$$\n\n## Negative Predictive Value\n$$NPV = \\frac{TN}{TN + FN}$$',
    icon: 'BarChart3',
  },

  // ─── Custom / General ───
  {
    id: 't-custom-project-plan', name: 'Research Project Plan', description: 'Complete research project planning template', category: 'custom',
    content: '# RESEARCH PROJECT PLAN\n\n## Project Overview\n- Title:\n- Principal Investigator:\n- Institution:\n- Start Date:\n- End Date:\n\n## Research Questions\n1.\n2.\n3.\n\n## Objectives\n1.\n2.\n3.\n\n## Methodology\n- Design:\n- Population:\n- Sample Size:\n- Data Collection:\n- Analysis Plan:\n\n## Timeline\n\n```mermaid\ngantt\n  title Project Timeline\n  dateFormat YYYY-MM-DD\n  \n  section Preparation\n  Literature Review     :a1, 2026-01-01, 30d\n  Ethics Approval       :a2, after a1, 14d\n  \n  section Data\n  Collection            :a3, after a2, 60d\n  Analysis              :a4, after a3, 30d\n  \n  section Output\n  Writing               :a5, after a4, 45d\n  Submission            :milestone, after a5, 0d\n```\n\n## Budget\n| Category | Amount |\n|---|---|\n| Personnel | |\n| Equipment | |\n| Travel | |\n| Publication | |\n| **Total** | |\n\n## Dissemination Plan\n- Target journals:\n- Conferences:\n- Open access:\n\n## References\n',
    icon: 'Layout',
  },
];
