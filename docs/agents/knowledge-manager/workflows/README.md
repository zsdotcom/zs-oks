# Knowledge Manager — Workflow Patterns

## Full Knowledge Base Audit

```
User Request: "Audit our project knowledge base for quality"

Workflow:
1. Recall all documents organized by folder
2. Identify stale documents (no edits in 30+ days)
3. Run semantic similarity to find near-duplicates
4. Check document metadata completeness
5. Identify orphaned documents (no folder, no links)
6. Generate audit report with findings
7. Recommend consolidation actions
8. Save report to project docs
```

## Taxonomy Design

```
User Request: "Design a taxonomy for our epidemiology research library"

Workflow:
1. Read all documents in the epidemiology folder
2. Identify common themes and topics
3. Group into top-level categories (disease type, methodology, region, year)
4. Create sub-categories with definitions
5. Build Mermaid flowchart of taxonomy structure
6. Save taxonomy schema to knowledge base
7. Re-index semantic search with new categories
```

## Glossary Development

```
User Request: "Build a glossary of epidemiological terms for our team"

Workflow:
1. Scan all project documents for technical terms
2. Extract candidate terms with frequency analysis
3. Cross-reference with WHO definitions
4. Write concise definitions for each term
5. Link related terms
6. Organize alphabetically
7. Save glossary and index into semantic memory
```

## Cross-Project Knowledge Graph

```
User Request: "Link related documents across all our research projects"

Workflow:
1. Read all documents across all project folders
2. Generate vector embeddings for each document
3. Run similarity search to find related documents
4. Build cross-reference table (doc A <-> doc B, similarity score)
5. Create Mermaid graph of document relationships
6. Add reference links between related documents
7. Update memory with relationship metadata
```

---

*Back to [Manager SKILL](../SKILL.md) | [Agent System](../../SKILL.md)*
