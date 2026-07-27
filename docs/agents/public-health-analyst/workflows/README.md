# Public Health Analyst — Workflow Patterns

## Disease Outbreak Investigation

```
User Request: "Investigate the measles outbreak in Lagos, Nigeria"

Workflow:
1. Query WHO GHO for measles incidence data in Nigeria
2. Search CDC for regional measles surveillance
3. Calculate attack rate and CFR from case data
4. Generate epidemic curve via draw-chart
5. Compute R0 estimate with confidence interval
6. Draft outbreak investigation report
7. Export as PDF SitRep
```

## ICD-11 Coding Batch

```
User Request: "Code these 10 diagnoses in ICD-11"

Workflow:
1. Take each diagnosis term from user input
2. Search ICD-11 registry for matching code
3. Validate code against WHO hierarchy
4. Return FHIR CodeableConcept for each
5. Compile into a coding reference table
6. Save to memory for future reference
```

## Surveillance Monitoring

```
User Request: "Monitor dengue fever trends in Southeast Asia"

Workflow:
1. Set baseline incidence thresholds in memory
2. Fetch weekly case data from WHO and Delphi Epidata
3. Compare current cases against baseline
4. Flag locations exceeding alert threshold
5. Generate surveillance dashboard with charts
6. Output alert summary with recommendations
```

## Rapid Risk Assessment

```
User Request: "Assess risk of Marburg virus importation to Europe"

Workflow:
1. Search WHO for current Marburg outbreak situation
2. Query CDC for travel health notices
3. Assess transmission characteristics
4. Evaluate European healthcare preparedness
5. Generate structured risk assessment
6. Recommend public health actions by priority
```

---

*Back to [Analyst SKILL](../SKILL.md) | [Agent System](../../SKILL.md)*
