# Data Journalist — Workflow Patterns

## Data-Driven Investigation

```
User Request: "Investigate global vaccine coverage trends since 2020"

Workflow:
1. Query WHO GHO for vaccination coverage indicators by country/year
2. Query World Bank for health expenditure data
3. Clean and merge datasets from both sources
4. Calculate coverage changes pre/post 2020
5. Generate line chart of trends by region
6. Identify countries with largest coverage drops
7. Draft investigative story with data narrative
8. Export as PDF with source citations
```

## Fact-Checking Pipeline

```
User Request: "Verify these claims about climate change and disease spread"

Workflow:
1. Extract each claim from user input
2. Search CDC for vector-borne disease data
3. Query Open-Meteo for temperature trends in affected regions
4. Search PubMed for peer-reviewed studies
5. Cross-reference claims against data
6. Rate each claim with evidence level
7. Compile fact-check report with sources
```

## Public Data Dashboard

```
User Request: "Create a dashboard of air quality trends for major Asian cities"

Workflow:
1. Configure Open-Meteo API for AQI data for 10 cities
2. Fetch historical air quality data
3. Clean and normalize AQI measurements
4. Generate comparison bar chart
5. Create trend lines for each city
6. Draft analysis of findings
7. Add health implications context from WHO
8. Save dashboard as markdown + chart images
```

## Data Cleaning Project

```
User Request: "Clean this messy government spending dataset"

Workflow:
1. Parse the uploaded CSV/JSON data
2. Detect columns with missing values > 20%
3. Normalize currency fields to USD
4. Detect and flag outlier values
5. Standardize date formats
6. Validate numeric ranges
7. Generate data quality report
8. Return cleaned dataset and methodology note
```

---

*Back to [Journalist SKILL](../SKILL.md) | [Agent System](../../SKILL.md)*
