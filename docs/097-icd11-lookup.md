# 097 — ICD-11 Code Lookup

**Date:** July 26, 2026

---

## 1. Description

An offline ICD-11 medical code lookup service and UI component with 50 curated codes covering all major disease categories.

## 2. Service

**File:** `src/services/icd11Service.ts`

### Data

50 curated ICD-11 entries covering chapters 1–23, including:
- Infectious diseases (Cholera, TB, Measles, Dengue, Malaria, HIV, COVID-19)
- Neoplasms (digestive, respiratory, skin, breast)
- Endocrine (diabetes types 1 & 2, obesity)
- Circulatory (hypertension, IHD, heart failure, stroke)
- Neurological (Alzheimer's, Parkinson's, epilepsy, migraine)
- Mental health (depression, anxiety, bipolar, schizophrenia)
- Respiratory (asthma, COPD)
- Musculoskeletal (RA, osteoarthritis)
- Injury (fracture, TBI, burns, sepsis)

### API

```typescript
interface ICD11Entry {
  code: string;
  title: string;
  chapter: string;
  description: string;
}

function searchICD11(query: string): ICD11Entry[]
function getICD11ByCode(code: string): ICD11Entry | undefined
function getAllICD11Codes(): ICD11Entry[]
function getICD11ByChapter(chapter: string): ICD11Entry[]
```

Search matches against code, title, chapter, and description (case-insensitive).

## 3. UI Component

**File:** `src/components/ICD11Lookup.tsx`

Features:
- Debounced search input (300ms)
- Results list showing code badge + title + chapter + description
- Click to select (fires `onSelect`)
- Clear search button
- "Show all codes" toggle with collapsible chapter-grouped view

## 4. Usage in App

Toggled from the header toolbar (Book icon), renders as a slide-over panel on the right side.
