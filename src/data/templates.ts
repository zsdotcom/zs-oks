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
  // ─── Code & Software Templates ───
  {
    id: 't-code-review', name: 'Code Review Checklist', description: 'Systematic code review checklist with OWASP and best practices', category: 'custom',
    content: '# CODE REVIEW CHECKLIST\n\n## Project:\n## Reviewer:\n## Date:\n\n## Functional Correctness\n- [ ] Logic matches requirements\n- [ ] Edge cases handled\n- [ ] Error handling complete\n- [ ] Input validation present\n\n## Security (OWASP Top 10)\n- [ ] No injection vulnerabilities\n- [ ] Authentication/authorization proper\n- [ ] Sensitive data not exposed\n- [ ] No broken access control\n- [ ] No security misconfiguration\n\n## Performance\n- [ ] No N+1 queries\n- [ ] Memory usage reasonable\n- [ ] No unnecessary computations\n- [ ] Lazy loading where appropriate\n\n## Code Quality\n- [ ] Follows project style guide\n- [ ] Proper naming conventions\n- [ ] Comments are meaningful\n- [ ] No dead code\n- [ ] Tests cover critical paths\n\n## Overall Assessment\n- Quality score (1-5):\n- Critical issues:\n- Major issues:\n- Minor issues:\n- Suggestions:',
    icon: 'SearchCheck',
  },
  {
    id: 't-code-design-doc', name: 'Technical Design Document', description: 'Software design document with architecture decisions', category: 'custom',
    content: '# TECHNICAL DESIGN DOCUMENT\n\n**Project:**\n**Author:**\n**Date:**\n**Status:** Draft / Review / Approved\n\n## 1. Overview\n- Problem statement:\n- Goals:\n- Non-goals:\n\n## 2. Architecture\n\n```mermaid\nflowchart TD\n  A[Client] --> B[API Gateway]\n  B --> C[Service]\n  C --> D[(Database)]\n  C --> E[Cache]\n```\n\n## 3. Data Model\n\n### Entities\n| Entity | Fields | Description |\n|---|---|---|\n| | | |\n\n### Relationships\n\n## 4. API Design\n| Method | Endpoint | Description |\n|---|---|---|\n| GET | /api/ | |\n| POST | /api/ | |\n\n## 5. Technology Stack\n- Language/Framework:\n- Database:\n- Cache:\n- Queue:\n- Deployment:\n\n## 6. Security Considerations\n\n## 7. Testing Strategy\n- Unit tests:\n- Integration tests:\n- E2E tests:\n\n## 8. Deployment Plan\n\n## 9. Monitoring & Observability\n\n## 10. Appendix\n- ADRs:\n- References:',
    icon: 'Wrench',
  },
  {
    id: 't-code-adr', name: 'Architecture Decision Record', description: 'Lightweight ADR template for tracking architecture decisions', category: 'custom',
    content: '# ARCHITECTURE DECISION RECORD (ADR)\n\n**ADR-NNN:**\n**Title:**\n**Status:** Proposed / Accepted / Deprecated / Superseded\n**Date:**\n**Author:**\n\n## Context\nWhat is the issue motivating this decision?\n\n## Decision\nWhat is the change being proposed?\n\n## Consequences\nWhat trade-offs and implications does this decision have?\n\n### Positive\n- \n- \n\n### Negative\n- \n- \n\n## Alternatives Considered\n| Alternative | Pros | Cons |\n|---|---|---|\n| | | |\n\n## References\n- \n- ',
    icon: 'Library',
  },
  {
    id: 't-code-test-plan', name: 'Test Plan Template', description: 'Comprehensive test planning document', category: 'custom',
    content: '# TEST PLAN\n\n**Project:**\n**Version:**\n**Author:**\n**Date:**\n\n## 1. Scope\n- In scope:\n- Out of scope:\n\n## 2. Test Strategy\n- Unit testing approach:\n- Integration testing approach:\n- E2E testing approach:\n- Performance testing:\n\n## 3. Test Environment\n- OS/Platform:\n- Browser:\n- Mobile:\n- Dependencies:\n\n## 4. Test Cases\n\n### Functional Tests\n| ID | Description | Steps | Expected Result | Priority |\n|---|---|---|---|---|\n| TC-001 | | | | |\n\n### Edge Cases\n| ID | Description | Steps | Expected Result |\n|---|---|---|---|\n| EC-001 | | | |\n\n### Security Tests\n| ID | Description | Steps | Expected Result |\n|---|---|---|---|\n| ST-001 | | | |\n\n## 5. Automation\n- Framework:\n- CI/CD integration:\n- Coverage targets:\n\n## 6. Schedule\n- Test execution:\n- Bug fixing:\n- Regression:\n\n## 7. Acceptance Criteria\n- [ ] All critical tests pass\n- [ ] Coverage >= 80%\n- [ ] No critical or major bugs\n\n## 8. Sign-off\n- **QA Lead:**\n- **Product Owner:**',
    icon: 'Target',
  },
  {
    id: 't-code-api-ref', name: 'API Reference Documentation', description: 'Generate comprehensive API reference docs', category: 'custom',
    content: '# API REFERENCE\n\n## Base URL\n`https://api.example.com/v1`\n\n## Authentication\n`Authorization: Bearer <token>`\n\n## Endpoints\n\n### GET /resource\n**Description:**\n**Headers:**\n| Name | Type | Required | Description |\n|---|---|---|---|\n| Authorization | string | Yes | Bearer token |\n\n**Query Parameters:**\n| Parameter | Type | Required | Default | Description |\n|---|---|---|---|---|\n| page | number | No | 1 | Page number |\n\n**Response 200:**\n```json\n{\n  "data": [],\n  "pagination": {}\n}\n```\n\n**Response 401:**\n```json\n{ "error": "Unauthorized" }\n```\n\n### POST /resource\n**Description:**\n**Request Body:**\n```json\n{\n  "title": "string",\n  "content": "string"\n}\n\n```\n\n**Response 201:**\n```json\n{ "id": "string", "createdAt": "date" }\n```\n\n## Rate Limiting\n- 100 requests/minute\n- Header: `X-RateLimit-Remaining`\n\n## Errors\n| Code | Description |\n|---|---|\n| 400 | Bad Request |\n| 401 | Unauthorized |\n| 404 | Not Found |\n| 429 | Rate Limit Exceeded |\n| 500 | Internal Server Error |',
    icon: 'Wrench',
  },
  {
    id: 't-code-changelog', name: 'Changelog Template', description: 'Keep a changelog following Keep a Changelog convention', category: 'custom',
    content: '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/),\nand this project adheres to [Semantic Versioning](https://semver.org/).\n\n## [Unreleased]\n\n### Added\n- \n\n### Changed\n- \n\n### Deprecated\n- \n\n### Removed\n- \n\n### Fixed\n- \n\n### Security\n- \n\n## [1.0.0] - YYYY-MM-DD\n\n### Added\n- Initial release',
    icon: 'Activity',
  },
  {
    id: 't-code-readme', name: 'Project README', description: 'Standard GitHub README template for open source projects', category: 'custom',
    content: '# Project Name\n\n> Short description of the project.\n\n## Features\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Installation\n\n```bash\nnpm install project-name\n```\n\n## Usage\n\n```javascript\nimport { something } from \'project-name\';\n\nsomething();\n```\n\n## API\n\n### `functionName(param1, param2)`\nDescription of the function.\n\n## Configuration\n| Option | Type | Default | Description |\n|---|---|---|---|\n| option1 | string | \'default\' | Description |\n\n## Contributing\n1. Fork the repository\n2. Create a feature branch\n3. Submit a pull request\n\n## License\nMIT\n\n## Contributors\n- ',
    icon: 'BookOpen',
  },
];
