---
title: "013 — BD Core FHIR Implementation Guide"
description: "BD Core FHIR Implementation Guide covering OCL terminology, geographic hierarchy, vaccine codes, and FHIR sandbox"
category: "guides"
order: 13
tags: ["bangladesh", "fhir", "terminology", "sandbox"]
last_updated: "2026-07-28"
audience: "users"
---

# 013 — BD Core FHIR IG Integration

Guide to the Bangladesh Core FHIR Implementation Guide features integrated into Open Knowledge Studio.

---

## Overview

The [Bangladesh Core FHIR Implementation Guide](https://fhir.dghs.gov.bd/core) defines national FHIR R4 profiles, value sets, code systems, and extensions for health data exchange in Bangladesh. OKS integrates three key service areas from this IG.

Access via the **flask icon** in the toolbar.

---

## OCL Terminology Service

Wraps the national OpenConceptLab (OCL) terminology server at `https://tr.ocl.dghs.gov.bd`.

### Operations

**CodeSystem $validate-code**
```
GET https://tr.ocl.dghs.gov.bd/api/fhir/CodeSystem/$validate-code
    ?system=http://id.who.int/icd/release/11/mms&code={code}
```

**CodeSystem $lookup**
```
GET https://tr.ocl.dghs.gov.bd/api/fhir/CodeSystem/$lookup
    ?system=http://id.who.int/icd/release/11/mms&code={code}
```

**ValueSet $validate-code (class-restricted)**
```
GET https://tr.ocl.dghs.gov.bd/api/fhir/ValueSet/$validate-code
    ?url=https://fhir.dghs.gov.bd/core/ValueSet/bd-condition-icd11-diagnosis-valueset
    &system=http://id.who.int/icd/release/11/mms&code={code}
```

**ICD-11 Cluster Validator**
```
POST https://icd11.dghs.gov.bd/cluster/validate
Content-Type: application/json
{"expression": "NC72.Z&XK8G&XJ7ZH&XJ7YM"}
```

### Key Points
- `$expand` is **not supported** by the national OCL instance
- Cluster expressions use `&` (combination) and `/` (specificity) operators
- Only Diagnosis and Finding class concepts are valid as stem codes in `Condition.code`

---

## BD Geographic Hierarchy

Full administrative geography of Bangladesh from the BDGeoCodes code system:

| Level | Count | Code Pattern |
|-------|-------|-------------|
| Divisions | 8 | 2 digits (e.g. `30` = Dhaka) |
| Districts | 64 | 4 digits (e.g. `3026` = Dhaka) |
| City Corps/Thanas | ~100 | 6 digits |
| Upazilas | 495+ | 8 digits |
| Municipalities | ~300 | 10 digits |
| Unions | ~4,500 | 12 digits |

### Divisions
Barishal, Chattogram, Dhaka, Khulna, Mymensingh, Rajshahi, Rangpur, Sylhet

---

## BD Vaccine Codes

EPI vaccine codes from the BDVaccineCS code system:

| Code | Vaccine | Doses |
|------|---------|-------|
| BCG | BCG Vaccine | 1 |
| OPV | Oral Polio Vaccine | 4 |
| IPV | Inactivated Polio Vaccine | 1 |
| PENTA | Pentavalent (DTP-HepB-Hib) | 3 |
| MR | Measles-Rubella | 2 |
| TT | Tetanus Toxoid | 2 |
| PCV10 | Pneumococcal Conjugate (10-valent) | 3 |
| ROTA | Rotavirus Vaccine | 2 |
| HPV | Human Papillomavirus Vaccine | 1 |
| COVID19 | COVID-19 Vaccine | 2 |

The panel includes the full Bangladesh EPI schedule by age.

---

## FHIR Sandbox

A live sandbox for testing BD-Core FHIR profiles is available:
```
Base URL: https://sandbox.fhir.dghs.gov.bd/fhir
Capability Statement: https://sandbox.fhir.dghs.gov.bd/fhir/metadata
FHIR Tester UI: https://sandbox.fhir.dghs.gov.bd
```

---

## Troubleshooting & FAQ

**Q: The FHIR server isn't responding.**
> The BD Core FHIR server might be temporarily unavailable. Wait a few minutes and try again. If the problem persists, check the service status page for BD Core.

**Q: Patient search returns no results.**
> Make sure you're using the correct Patient ID format. BD Core FHIR uses a specific identifier format. Try searching by NID (National ID) or date of birth if available.

**Q: Resource validation fails.**
> Check that your FHIR resource follows the BD Core profile. Some fields that are optional in standard FHIR are required in BD Core. The validation error message should indicate which field is missing.

**Q: Can I use BD Core FHIR offline?**
> No. The FHIR server requires an active internet connection. For offline work, export patient records beforehand.

---

## Source Files

```
src/services/bdTerminologyService.ts    — OCL terminology client
src/services/bdGeographyService.ts      — Geographic hierarchy
src/services/bdVaccineService.ts        — Vaccine codes + EPI schedule
src/components/BdCorePanel.tsx          — UI panel with 3 tabs

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._


```
