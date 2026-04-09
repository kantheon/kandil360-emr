# Kandil360 EMR -- Development Roadmap

## Status Overview

| Phase | Name | Status |
|-------|------|--------|
| Phase 1 | Foundation (Bugs + Data Layer) | Completed |
| Phase 2 | Full CRUD + Edit/Delete Everywhere | Completed |
| Phase 3 | Firestore Backend | Planned |
| Phase 4a | Vitals Tab | Completed |
| Phase 4b | Expanded Assessment Library | Planned |
| Phase 4c | Utilization Management (Authorizations) | Completed |
| Phase 4d | Discharge Planning | Planned |
| Phase 5a | Role-Based Access Control | Planned |
| Phase 5b | Reporting & Analytics | Planned |
| Phase 5c | Patient Management (Add/Edit Patients) | Planned |
| Phase 5d | Dynamic Dashboard | Completed |
| Phase 5e | Configurable Field Mapping | Planned |

---

## Completed Work

### Phase 1: Foundation

**Objective**: Fix broken UI patterns and create a swappable data layer.

| Deliverable | Details |
|-------------|---------|
| Fix Tailwind Dynamic Classes | Replaced broken `bg-${color}-50/50` patterns with static class mappings using `colorMap` objects |
| DataProvider Context | Created `src/contexts/DataContext.jsx` with `useData()` hook that wraps all data access behind a single interface |
| localStore CRUD Layer | Built `src/data/localStore.js` with `addPatientEntry`, `updatePatientEntry`, `deletePatientEntry`, `getAuditLog` |
| Audit Trail Logging | Every mutation logs: action, type, entryId, userName, timestamp, previousValues, newValues |
| Seed Data Merging | `mergeEntries()` function combines seed data with localStorage entries seamlessly |

### Phase 2: Full CRUD + Edit/Delete Everywhere

**Objective**: Every record type supports create, read, edit, and delete operations.

| Tab | Create | Edit | Delete | Audit |
|-----|--------|------|--------|-------|
| Progress Notes | Yes | Yes | Yes | Yes |
| Communications | Yes | Yes | Yes | Yes |
| Appointments | Yes | Yes | Yes | Yes |
| Admissions | Yes | Yes | Yes | Yes |
| Assessments | Yes | Yes | Yes | Yes |
| Care Plan Goals | Yes | Yes | Yes | Yes |
| Medications | Yes | Yes | Yes | Yes |
| Vitals | Yes | Yes | Yes | Yes |
| Authorizations | Yes | Yes | Yes | Yes |

Additional deliverables:
- `ConfirmDialog.jsx` component for all delete confirmations
- `Modal.jsx` reusable modal wrapper
- Edit history tracking with `wasEdited` flag and `updatedAt`/`updatedBy` metadata
- `isEditable()` function distinguishing seed data (read-only) from user data (mutable)

### Phase 4a: Vitals Tab

**Objective**: Full vital signs recording with clinical thresholds.

| Deliverable | Details |
|-------------|---------|
| VitalsTab Component | Records BP, HR, Temperature, O2 Sat, Respiratory Rate, Weight |
| Auto-Alert Thresholds | Color-coded Critical/Elevated/Normal indicators per vital sign |
| Threshold Functions | `getBpStatus()`, `getHrStatus()`, `getTempStatus()`, `getO2Status()`, `getRespStatus()` |
| Trend Tracking | Arrows showing direction vs. previous reading |
| Edit History | `wasEdited` badge on modified entries |
| Full CRUD | Create, edit, delete with audit trail |

### Phase 4c: Utilization Management (Authorizations)

**Objective**: Prior authorization management for insurance workflows.

| Deliverable | Details |
|-------------|---------|
| AuthorizationsTab Component | Full authorization lifecycle management |
| Service Types | Inpatient, Outpatient, Home Health, DME, SNF, Rehab, Behavioral Health, Pharmacy |
| Priority Levels | Routine (14 days), Urgent (72 hours), Expedited (24 hours) |
| Regulatory Deadline Engine | Countdown timer based on priority with color transitions |
| Status Lifecycle | Pending Review -> Approved/Denied/Pended -> Appeal Submitted -> Appeal Approved/Denied -> Expired |
| Auto-Generated Auth Numbers | `AUTH-{timestamp-base36}` format |
| Full CRUD | Create, edit status/decision, delete with audit |

### Phase 5d: Dynamic Dashboard

**Objective**: Replace hardcoded dashboard data with real patient information.

| Deliverable | Details |
|-------------|---------|
| Dynamic Stats | Patient count, high-risk count, pending tasks, active goals -- all computed from real data |
| Task List | Pulled from patient `nextFollowUp` dates with relative labels (Today, Tomorrow, Overdue) |
| Activity Feed | Aggregates recent entries from localStorage across all patients |
| Relative Timestamps | "Just now", "5 min ago", "2 hours ago", "Yesterday" |
| Direct Links | Tasks and activity items link to patient charts |

---

## Planned Work

### Phase 3: Firestore Backend

**Objective**: Real database, real-time updates, multi-user support.

**Priority**: High

| Deliverable | Details |
|-------------|---------|
| Firestore Provider | `src/data/firestoreStore.js` implementing same interface as localStore |
| Collection Structure | `patients/{patientId}/{type}/{entryId}` subcollection pattern |
| Real-Time Subscriptions | `onSnapshot()` for live data updates across browser tabs and users |
| Server Timestamps | `serverTimestamp()` on all creates and updates |
| Seed Data Migration Script | One-time `seedFirestore.js` script to populate Firestore with demo data |
| Security Rules | Authenticated-only read/write, future field-level rules |
| Provider Swap | Change one import in DataContext.jsx to switch from localStorage to Firestore |

### Phase 4b: Expanded Assessment Library

**Objective**: Add more validated clinical instruments.

**Priority**: Medium

| Assessment | Category | Questions |
|------------|----------|-----------|
| PHQ-9 (Full Depression Screening) | Behavioral Health | 9 |
| GAD-7 (Anxiety) | Behavioral Health | 7 |
| Barthel ADL Index | Functional Status | 10 |
| MMSE (Cognitive) | Cognitive | 11 |
| Pain Assessment | Pain Management | 6 |
| Nutrition Screening | Nutrition | 6 |
| Home Safety Assessment | Safety | 10 |

Additional features:
- Previous assessment comparison (show last answers next to current questions)
- Assessment history timeline
- Score trend tracking over time

### Phase 4d: Discharge Planning

**Objective**: Structured discharge planning module.

**Priority**: Medium

| Deliverable | Details |
|-------------|---------|
| Discharge Planning Tab | New tab or section within Admissions |
| Discharge Checklist | Meds reconciled, follow-up scheduled, DME arranged, education completed |
| Discharge Summary Generation | Auto-populated summary from patient data |
| Post-Discharge Follow-up | 48-hour call scheduling, 7-day PCP follow-up tracking |
| Readmission Risk Scoring | Algorithmic risk score based on patient factors |

### Phase 5a: Role-Based Access Control (RBAC)

**Objective**: Granular permissions by user role.

**Priority**: High (required for enterprise sales)

| Role | View | Create | Edit | Delete | Admin |
|------|------|--------|------|--------|-------|
| Admin | All | All | All | All | Yes |
| Supervisor | All | All | All | Own | No |
| Case Manager | Assigned | All | Own | Own | No |
| Nurse | Assigned | Limited | Own | No | No |
| Read-Only | All | No | No | No | No |

Deliverables:
- `src/contexts/RoleContext.jsx` with permission matrix
- Admin panel for user management
- Role assignment per user
- UI elements hidden based on permissions

### Phase 5b: Reporting & Analytics

**Objective**: Operational and clinical reporting.

**Priority**: Medium

| Report | Description |
|--------|-------------|
| Caseload Summary | Patients per case manager, acuity distribution |
| Follow-up Compliance | Percentage on-time vs. overdue |
| Authorization Turnaround | Average time from submission to decision |
| Readmission Rates | 30-day readmission rate by diagnosis |
| Assessment Completion | Percentage of patients with completed assessments |
| Goal Achievement | Care plan goal status distribution |

Features:
- Date range filtering
- Export to CSV and PDF
- Visual charts and graphs

### Phase 5c: Patient Management

**Objective**: Full patient lifecycle management.

**Priority**: Medium

| Deliverable | Details |
|-------------|---------|
| Add Patient Form | Create new patients from the Patient List page |
| Edit Demographics | Update patient name, DOB, address, phone, insurance |
| Patient Status Changes | Active -> Discharged -> Closed |
| Global Search | Search across all patient data (notes, comms, etc.) |

### Phase 5e: Configurable Field Mapping

**Objective**: Support multi-tenant customization.

**Priority**: Low (Phase 6+)

| Deliverable | Details |
|-------------|---------|
| Field Mapping Config | `src/config/fieldMapping.js` |
| External System Mapping | Map Kandil360 fields to any external system's field names |
| Import/Export Config | JSON-based configuration for customer onboarding |
| Custom Fields | Per-tenant custom field definitions |

---

## Future Vision

### AI-Powered Documentation

- Auto-generated SOAP notes from call transcripts
- Smart suggestions for care plan goals based on diagnoses
- Natural language search across patient charts
- Predictive analytics for readmission risk

### FHIR API Integration

- HL7 FHIR R4 compliant API endpoints
- Integration with hospital EHR systems (Epic, Cerner)
- Automated ADT (Admit-Discharge-Transfer) feeds
- CCD/C-CDA document exchange

### Multi-Tenant Architecture

- Isolated data per health insurance company
- Tenant-specific branding and configuration
- Shared infrastructure with per-tenant billing
- White-label deployment option

### Mobile Application

- React Native companion app for case managers in the field
- Offline-first with sync when connected
- Push notifications for overdue tasks and urgent alerts
- Camera integration for wound/document photos

### Compliance and Certifications

- HIPAA compliance documentation and BAA support
- SOC 2 Type II audit readiness
- HITRUST CSF certification path
- State-specific regulatory compliance (e.g., NCQA standards)

---

## Priority Order

The following prioritization is designed to maximize enterprise sales readiness:

1. **Phase 3: Firestore** -- Real persistence is mandatory for production use
2. **Phase 5a: RBAC** -- Enterprise customers require role-based access
3. **Phase 5b: Reporting** -- Decision-makers need analytics
4. **Phase 4b: More Assessments** -- Clinical completeness
5. **Phase 4d: Discharge Planning** -- High-value payer workflow
6. **Phase 5c: Patient Management** -- Basic CRUD for patient records
7. **Phase 5e: Field Mapping** -- Multi-tenant customization
8. **Future: FHIR, AI, Mobile** -- Long-term differentiation
