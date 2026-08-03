# 001-data-catalog-standard.md
## Data Catalog Standard
### Guidelines for Documenting Datasets and Metrics

**Document type:** Specification
**Date:** August 03, 2026
**Author:** Mohammad Ariful Islam / ZarishSphere Foundation
**License:** Apache 2.0 (code) · CC BY 4.0 (documentation)
**Status:** V1 — Active

## 1. Purpose
This document establishes the standard for cataloging datasets, tables, and metrics within the ZarishSphere ecosystem, ensuring consistent metadata and documentation across all modules.

## 2. Catalog Structure
A standard data catalog should be organized into the following hierarchy:

| Directory | Purpose |
| :--- | :--- |
| `datasets/` | High-level descriptions of data sources and collections |
| `tables/` | Detailed schemas and descriptions of individual data tables |
| `references/` | Definitions for metrics, dimensions, and join logic |

## 3. Documentation Requirements

### 3.1. Dataset Documentation
Each dataset must include a description of its source, update frequency, and primary keys.

### 3.2. Metric Definitions
Metrics must be documented with their calculation logic and business context.

| Metric | Calculation | Description |
| :--- | :--- | :--- |
| `user_count` | `COUNT(DISTINCT user_id)` | Total number of unique users in the period |

---
*ZarishSphere Foundation · V1 · August 03, 2026*
*License: Apache 2.0 (code) · CC BY 4.0 (documentation)*
*GitHub: https://github.com/zsdotcom/zs-oks*
