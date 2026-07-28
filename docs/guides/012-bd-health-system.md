---
title: "012 — Bangladesh Health Ecosystem"
description: "Bangladesh health ecosystem covering SHR, Health ID, DHIS2, OpenMRS, VaxEPI, CRVS, telemedicine, and ICD-11 transition"
category: "guides"
order: 12
tags: ["bangladesh", "health", "fhir", "shrhs", "icd11"]
last_updated: "2026-07-28"
audience: "users"
---

# Bangladesh Digital Health Ecosystem

Reference guide for the Bangladesh health information system landscape — systems, standards, and integration points.

---

## National Systems

### Shareable Health Record (SHR)
Central HIE platform built on OpenHIE framework. Creates a Personal Health Profile (PHP) for every citizen.

| Component | Description |
|-----------|-------------|
| Health ID | Unique 9-digit identifier linked to NID or BRN |
| Master Client Index | Links Health IDs with demographics |
| Terminology Registry | Standardized coding (ICD-11, LOINC, SNOMED-CT) |
| Facility Registry | All healthcare institutions |
| Provider Registry | All healthcare professionals |
| Geolocation Registry | Geographic data linkage |

- Portal: `https://eappointment.dghs.gov.bd`
- Dashboard: `http://shrdashboard.dghs.gov.bd:5985/`

### Health ID
Introduced 2023, begins with digit **9**. Obtained via:
- **Point of Care**: Hospital registration desks (OpenMRS+ sites)
- **Community**: OpenSRP community health workers
- **Online**: `https://eappointment.dghs.gov.bd`

Real-time distribution dashboard: `https://pdb.shrlive.dghs.gov.bd`

---

## Health Information Systems

### DHIS2
Largest DHIS2 implementation globally. Used since 2009 for routine HMIS.

| Server | Purpose |
|--------|---------|
| Central DHIS2 | Aggregate + individual data (sub-district+) |
| Community Clinic | Data below sub-district level |
| COVID-19 Surveillance | Test results |
| FDMN Server | Rohingya community HMIS |

Key features: Birth/death notification to Registrar General, WHO-compliant MCCOD, OpenID auth, containerized deployment (2024).

### OpenMRS+
Customized EMR (OpenMRS + OpenELIS + Inventory). Operational in **100+ public hospitals**.

**Deployment**: 97 on-premise servers, 3 online centralized.

**Modules**: Inpatient, Outpatient, Emergency, Ticket Counter, Billing, Pharmacy, Lab (OpenELIS), Inventory.

### OpenSRP
Community-based platform for maternal and child health. Used by community health workers for domiciliary visits, EPI campaigns, and Health ID registration.

---

## Civil Registration & Vital Statistics (CRVS)

- **BDRIS**: Legal authority for birth/death certificates
- **DHIS2 → BDRIS Interoperability**: Electronic notifications and confirmation loop
- **MCCoD**: Physician-certified cause of death (ICD-10, piloting ICD-11 in 6 hospitals)
- **Verbal Autopsy**: Sample-based (69 upazilas, ~5,000 deaths/month) using ODK + SmartVA, transitioning to WHO VA instrument

---

## Immunization

### VaxEPI
Integrated vaccine registration portal launched 2024.

- Single-time registration via BRN
- Links to SHR Unique Health ID
- QR-coded vaccine card
- Supports routine EPI + campaigns (HPV, TCV, Hajj meningitis)
- Digital certificate available at `https://vaxepi.gov.bd`

### EPI Schedule
| Age | Vaccines |
|-----|----------|
| Birth | BCG, OPV-0 |
| 6 weeks | OPV-1, Penta-1, PCV-1, Rota-1 |
| 10 weeks | OPV-2, Penta-2, PCV-2, Rota-2 |
| 14 weeks | OPV-3, Penta-3, IPV |
| 9 months | MR-1 |
| 15 months | MR-2 |
| 18 months | PCV Booster |

---

## Telemedicine

- **Launched**: 2010
- **Facilities**: 232 centers (22 provider+receiver, 194 receiver-only, 40 provider-only)
- **Equipment**: Telestethoscopes, teleECG, telemicroscopes, etc.
- **Cost**: Free consultations at upazila level
- **Common conditions**: Scabies, tinea, eczema, acne, conjunctivitis, low back pain

---

## ICD-11 Transition

- Piloted in 6 hospitals (3 OpenMRS, 3 DHIS2)
- Local Docker deployment at `https://icd11.dghs.gov.bd`
- OCL terminology server: `https://tr.ocl.dghs.gov.bd`
- Cluster validator: `https://icd11.dghs.gov.bd/cluster/validate`
- Scaling to 150 hospitals

---

## Health Financing (2020)

| Metric | Value |
|--------|-------|
| Total Health Expenditure | BDT 777B (2.8% GDP) |
| Out-of-Pocket | 68.5% of THE |
| Per-capita THE | $54 |
| Pharma Expenditure | 50% of THE |
| Health Budget (FY24) | BDT 38,052 crore (5% national budget) |

---

## Biometric Attendance

- Phase 1: Fingerprint (2012–2023, 600+ devices, 92% attendance)
- Phase 2: Face recognition (from Sep 2023, online direct to central MIS server)
- Coverage: 625+ institutions across all districts

---

## Key API Endpoints

| Endpoint | URL |
|----------|-----|
| FHIR Sandbox | `https://sandbox.fhir.dghs.gov.bd/fhir` |
| OCL Terminology | `https://tr.ocl.dghs.gov.bd` |
| ICD-11 Cluster Validator | `https://icd11.dghs.gov.bd/cluster/validate` |
| E-Appointment | `https://eappointment.dghs.gov.bd` |
| VaxEPI | `https://vaxepi.gov.bd` |
| SHR Dashboard | `http://shrdashboard.dghs.gov.bd:5985/` |
| Health ID Dashboard | `https://pdb.shrlive.dghs.gov.bd` |

---

## Systems Quick Reference

| System | Type | Scale |
|--------|------|-------|
| SHR | HIE | National |
| DHIS2 | HMIS | National (largest globally) |
| OpenMRS+ | EMR | 100+ hospitals |
| OpenSRP | Community MCH | National |
| VaxEPI | Immunization | National |
| BDRIS | CRVS | National |
| Biometric HRM | HR | 625+ institutions |

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._


