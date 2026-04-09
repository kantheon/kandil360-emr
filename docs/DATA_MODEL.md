# Kandil360 EMR -- Data Model

## Table of Contents

1. [Patient](#1-patient)
2. [Insurance](#2-insurance)
3. [Emergency Contact](#3-emergency-contact)
4. [Diagnosis](#4-diagnosis)
5. [Case Information](#5-case-information)
6. [Progress Note](#6-progress-note)
7. [Communication](#7-communication)
8. [Appointment](#8-appointment)
9. [Admission](#9-admission)
10. [Assessment](#10-assessment)
11. [Care Plan Goal](#11-care-plan-goal)
12. [Care Plan Progress Entry](#12-care-plan-progress-entry)
13. [Medication](#13-medication)
14. [Vital Signs](#14-vital-signs)
15. [Authorization](#15-authorization)
16. [Allergy](#16-allergy)
17. [Audit Log Entry](#17-audit-log-entry)
18. [localStorage Structure](#18-localstorage-structure)
19. [Seed Data Merging](#19-seed-data-merging)

---

## 1. Patient

The root entity. Each patient contains nested arrays of all clinical data.

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `id` | string | `"PT-10042"` | Unique patient identifier |
| `firstName` | string | `"Maria"` | |
| `lastName` | string | `"Gonzalez"` | |
| `dob` | string (date) | `"1958-03-14"` | ISO date format |
| `age` | number | `68` | |
| `sex` | string | `"Female"` | `"Male"` or `"Female"` |
| `mrn` | string | `"MRN-884201"` | Medical Record Number |
| `phone` | string | `"(305) 555-0142"` | |
| `email` | string | `"maria.g@email.com"` | |
| `address` | string | `"1247 Palm Ave, Miami, FL 33101"` | |
| `language` | string | `"Spanish"` | Preferred language |
| `pcp` | string | `"Dr. Sarah Chen"` | Primary Care Provider |
| `riskLevel` | string | `"High"` | `"Critical"`, `"High"`, `"Medium"`, `"Low"` |
| `insurance` | Insurance | _(see below)_ | Insurance object |
| `emergencyContact` | EmergencyContact | _(see below)_ | Emergency contact object |
| `diagnoses` | Diagnosis[] | _(see below)_ | Array of diagnoses |
| `caseInfo` | CaseInfo | _(see below)_ | Case management info |
| `allergies` | Allergy[] | _(see below)_ | Array of allergies |
| `progressNotes` | ProgressNote[] | _(see below)_ | Array of progress notes |
| `communications` | Communication[] | _(see below)_ | Array of communications |
| `appointments` | Appointment[] | _(see below)_ | Array of appointments |
| `admissions` | Admission[] | _(see below)_ | Array of admissions |
| `assessments` | Assessment[] | _(see below)_ | Array of assessments |
| `medications` | Medication[] | _(see below)_ | Array of medications |
| `vitals` | Vital[] | _(see below)_ | Array of vital sign records |
| `authorizations` | Authorization[] | _(see below)_ | Array of authorizations |
| `carePlan` | CarePlan | _(see below)_ | Care plan object with goals |

---

## 2. Insurance

Nested object within Patient.

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `plan` | string | `"Medicare Advantage - Humana Gold Plus"` | |
| `memberId` | string | `"HUM-882991042"` | |
| `groupNumber` | string | `"GRP-MA-FL"` | |
| `type` | string | `"Primary"` | `"Primary"` or `"Secondary"` |
| `copay` | string | `"$20"` | |
| `status` | string | `"Active"` | `"Active"` or `"Inactive"` |

---

## 3. Emergency Contact

Nested object within Patient.

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `name` | string | `"Carlos Gonzalez"` | |
| `relation` | string | `"Son"` | |
| `phone` | string | `"(305) 555-0198"` | |

---

## 4. Diagnosis

Array of objects within Patient.

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `code` | string | `"E11.9"` | ICD-10 code |
| `description` | string | `"Type 2 Diabetes Mellitus"` | |
| `status` | string | `"Active"` | `"Active"` or `"Resolved"` |
| `onsetDate` | string (date) | `"2015-06-01"` | |

---

## 5. Case Information

Nested object within Patient.

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `status` | string | `"Active"` | Case status |
| `acuity` | string | `"High"` | `"High"`, `"Medium"`, `"Low"` |
| `caseType` | string | `"Complex Care Management"` | |
| `assignedCM` | string | `"Jennifer Walsh, RN"` | Assigned case manager |
| `enrollmentDate` | string (date) | `"2026-01-15"` | |
| `program` | string | `"Chronic Disease Management"` | |
| `lastContact` | string (date) | `"2026-04-05"` | |
| `nextFollowUp` | string (date) | `"2026-04-10"` | |

---

## 6. Progress Note

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Yes | `"PN-001"` (seed) or `"local-..."` (user-created) |
| `date` | string (date) | Yes | ISO date |
| `time` | string | Yes | e.g., `"10:30 AM"` |
| `author` | string | Yes | Note author name |
| `type` | string | Yes | `"SOAP"` or `"DAR"` |
| `contactMethod` | string | Yes | `"Phone"`, `"Video"`, `"In-Person"`, `"Chart Review"` |
| **SOAP fields** | | | _(when type = "SOAP")_ |
| `subjective` | string | Conditional | Patient's reported symptoms/concerns |
| `objective` | string | Conditional | Measurable/observable findings |
| `assessment` | string | Conditional | Clinical assessment |
| `plan` | string | Conditional | Treatment plan |
| **DAR fields** | | | _(when type = "DAR")_ |
| `data` | string | Conditional | Data/observations |
| `action` | string | Conditional | Actions taken |
| `response` | string | Conditional | Patient response |
| **Metadata** | | | |
| `createdAt` | string (ISO) | Auto | Set on creation (localStorage entries) |
| `createdBy` | string | Auto | User who created |
| `updatedAt` | string (ISO) | Auto | Set on edit |
| `updatedBy` | string | Auto | User who last edited |
| `wasEdited` | boolean | Auto | `true` if entry has been modified |

---

## 7. Communication

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Yes | `"COM-001"` or `"local-..."` |
| `date` | string (date) | Yes | |
| `time` | string | Yes | |
| `direction` | string | Yes | `"Inbound"` or `"Outbound"` |
| `method` | string | Yes | `"Phone"`, `"Fax"`, `"Email"`, `"In-Person"` |
| `contactPerson` | string | Yes | Name of person contacted |
| `contactRole` | string | Yes | `"Patient"`, `"PCP"`, `"Specialist"`, `"Insurance"`, `"Family/Caregiver"`, `"Pharmacy"`, `"Home Health"` |
| `subject` | string | Yes | Brief subject line |
| `summary` | string | Yes | Detailed summary |
| `outcome` | string | No | Result of communication |
| `followUpNeeded` | boolean | No | Whether follow-up is required |
| `followUpDate` | string (date) | No | When follow-up should occur |
| `createdAt` | string (ISO) | Auto | |
| `createdBy` | string | Auto | |
| `updatedAt` | string (ISO) | Auto | |
| `updatedBy` | string | Auto | |

---

## 8. Appointment

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Yes | `"local-..."` for user-created |
| `date` | string (date) | Yes | |
| `time` | string | Yes | e.g., `"10:00 AM"` |
| `provider` | string | Yes | Provider name |
| `type` | string | Yes | Appointment type / reason |
| `location` | string | Yes | Facility or `"Telehealth"` |
| `status` | string | Yes | `"Scheduled"`, `"Completed"`, `"Cancelled"`, `"No-Show"` |
| `duration` | string | No | e.g., `"30 min"` |
| `reason` | string | No | Reason for visit |
| `notes` | string | No | Additional notes |
| `createdAt` | string (ISO) | Auto | |
| `createdBy` | string | Auto | |

---

## 9. Admission

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Yes | `"ADM-001"` or `"local-..."` |
| `facility` | string | Yes | Facility name |
| `facilityType` | string | Yes | `"Acute Care"`, `"SNF"`, `"Rehab"`, `"Psych"`, `"LTACH"` |
| `admitDate` | string (date) | Yes | |
| `dischargeDate` | string (date) | No | Null if still admitted |
| `admitDiagnosis` | string | Yes | Primary reason for admission |
| `attendingPhysician` | string | Yes | |
| `dischargeDisposition` | string | No | `"Home"`, `"Home with Home Health"`, `"SNF"`, `"Rehab"`, `"AMA"`, `"Expired"` |
| `levelOfCare` | string | Yes | `"Med-Surg"`, `"Telemetry"`, `"ICU/CCU"`, `"Step-Down"`, `"Observation"` |
| `readmissionFlag` | boolean | No | `true` if within 30 days of prior admission |
| `lengthOfStay` | number | Auto | Days between admit and discharge |
| `createdAt` | string (ISO) | Auto | |
| `createdBy` | string | Auto | |

---

## 10. Assessment

Assessments have two schemas: seed data assessments (narrative format) and template-based assessments (structured with scores).

### Seed Data Assessment (Legacy/Narrative)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | `"ASM-001"` |
| `type` | string | `"Comprehensive Assessment"`, `"Reassessment"` |
| `date` | string (date) | |
| `author` | string | |
| `status` | string | `"Completed"` |
| `functionalStatus` | string | Free text |
| `cognitiveStatus` | string | Free text |
| `phq2Score` | number | |
| `fallRisk` | string | `"Low"`, `"Moderate"`, `"High"` |
| `painLevel` | string | e.g., `"3/10"` |
| `sdoh` | object | `{ housing, foodSecurity, transportation, socialSupport }` |
| `summary` | string | |

### Template-Based Assessment (User-Created)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | `"local-..."` |
| `templateId` | string | References template ID (e.g., `"fall-risk"`) |
| `templateName` | string | Template display name |
| `date` | string (date) | |
| `answers` | object | `{ questionId: selectedValue, ... }` |
| `score` | number | Calculated total score |
| `riskLevel` | string | Derived from scoring ranges |
| `notes` | string | Optional notes |
| `createdAt` | string (ISO) | |
| `createdBy` | string | |

---

## 11. Care Plan Goal

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Yes | `"G1"` (seed) or `"local-..."` |
| `description` | string | Yes | Goal statement |
| `healthConcern` | string | No | From care plan library |
| `status` | string | Yes | `"Not Started"`, `"Initiated"`, `"In Progress"`, `"On Track"`, `"Met"`, `"Not Met"`, `"Deferred"` |
| `targetDate` | string (date) | Yes | |
| `interventions` | string[] | No | List of intervention descriptions |
| `barriers` | string | No | Barriers to goal achievement |
| `source` | string | Auto | `"local"` for localStorage entries |
| `createdAt` | string (ISO) | Auto | |
| `createdBy` | string | Auto | |

---

## 12. Care Plan Progress Entry

Progress entries are tracked within Call Mode and the Care Plan tab.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | `"local-..."` |
| `goalId` | string | References the parent goal |
| `date` | string (date) | |
| `status` | string | Updated status value |
| `note` | string | Progress note text |
| `author` | string | |

---

## 13. Medication

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Auto | `"local-..."` for user-created |
| `name` | string | Yes | Medication name |
| `dose` | string | Yes | e.g., `"1000mg"` |
| `frequency` | string | Yes | `"Daily"`, `"BID"`, `"TID"`, `"QID"`, `"QHS"`, `"PRN"`, `"Weekly"`, `"Monthly"` |
| `prescriber` | string | Yes | Prescribing provider |
| `status` | string | Yes | `"Active"`, `"Discontinued"`, `"On Hold"` |
| `createdAt` | string (ISO) | Auto | |
| `createdBy` | string | Auto | |
| `updatedAt` | string (ISO) | Auto | |
| `updatedBy` | string | Auto | |

---

## 14. Vital Signs

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Auto | `"local-..."` |
| `date` | string (date) | Yes | |
| `time` | string | Yes | |
| `systolic` | number | No | Systolic BP (mmHg) |
| `diastolic` | number | No | Diastolic BP (mmHg) |
| `heartRate` | number | No | Heart rate (bpm) |
| `temperature` | number | No | Temperature (Fahrenheit) |
| `o2Sat` | number | No | Oxygen saturation (%) |
| `respRate` | number | No | Respiratory rate (breaths/min) |
| `weight` | number | No | Weight (lbs) |
| `source` | string | No | Where vitals were obtained |
| `notes` | string | No | |
| `wasEdited` | boolean | Auto | Flags if entry was modified after creation |
| `createdAt` | string (ISO) | Auto | |
| `createdBy` | string | Auto | |
| `updatedAt` | string (ISO) | Auto | |
| `updatedBy` | string | Auto | |

---

## 15. Authorization

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Auto | `"local-..."` |
| `authNumber` | string | Auto | Auto-generated (e.g., `"AUTH-1A2B3C"`) |
| `serviceType` | string | Yes | `"Inpatient"`, `"Outpatient"`, `"Home Health"`, `"DME"`, `"Skilled Nursing"`, `"Rehab"`, `"Behavioral Health"`, `"Pharmacy"` |
| `priority` | string | Yes | `"Routine"`, `"Urgent"`, `"Expedited"` |
| `status` | string | Yes | See status lifecycle below |
| `requestingProvider` | string | Yes | |
| `facility` | string | No | Facility or vendor name |
| `diagnosisCodes` | string | Yes | ICD-10 codes |
| `clinicalRationale` | string | Yes | Clinical justification |
| `requestedStartDate` | string (date) | Yes | |
| `requestedEndDate` | string (date) | Yes | |
| `requestedUnits` | number | No | |
| `approvedUnits` | number | No | Set upon approval |
| `decisionDate` | string (date) | No | Date of determination |
| `denialReason` | string | No | Required if status is Denied |
| `submittedDate` | string (date) | Auto | Date auth was created |
| `regulatoryDeadline` | string (ISO) | Auto | Calculated from priority |
| `createdAt` | string (ISO) | Auto | |
| `createdBy` | string | Auto | |
| `updatedAt` | string (ISO) | Auto | |
| `updatedBy` | string | Auto | |

### Status Values
`"Pending Review"` | `"Approved"` | `"Denied"` | `"Pended"` | `"Appeal Submitted"` | `"Appeal Approved"` | `"Appeal Denied"` | `"Expired"`

---

## 16. Allergy

| Field | Type | Notes |
|-------|------|-------|
| `allergen` | string | e.g., `"Penicillin"` |
| `reaction` | string | e.g., `"Anaphylaxis"` |
| `severity` | string | `"Mild"`, `"Moderate"`, `"Severe"` |

---

## 17. Audit Log Entry

| Field | Type | Notes |
|-------|------|-------|
| `action` | string | `"create"`, `"update"`, `"delete"` |
| `patientId` | string | Patient the change was made to |
| `type` | string | Entry type (e.g., `"progressNotes"`, `"medications"`) |
| `entryId` | string | ID of the affected entry |
| `userName` | string | User who performed the action |
| `timestamp` | string (ISO) | When the action occurred |
| `previousValues` | object | Previous state (for updates and deletes) |
| `newValues` | object | New state (for creates and updates) |

---

## 18. localStorage Structure

### Data Store (`kandil360_data`)

```json
{
  "PT-10042": {
    "progressNotes": [
      {
        "id": "local-1712345678-a1b2",
        "date": "2026-04-08",
        "time": "2:00 PM",
        "author": "Jennifer Walsh, RN",
        "type": "SOAP",
        "contactMethod": "Phone",
        "subjective": "...",
        "objective": "...",
        "assessment": "...",
        "plan": "...",
        "createdAt": "2026-04-08T18:00:00.000Z",
        "createdBy": "Jennifer Walsh"
      }
    ],
    "communications": [...],
    "assessments": [...],
    "appointments": [...],
    "admissions": [...],
    "medications": [...],
    "vitals": [...],
    "authorizations": [...],
    "carePlanGoals": [...]
  },
  "PT-10043": { ... },
  ...
}
```

### Audit Store (`kandil360_audit`)

```json
[
  {
    "action": "create",
    "patientId": "PT-10042",
    "type": "progressNotes",
    "entryId": "local-1712345678-a1b2",
    "userName": "Jennifer Walsh",
    "timestamp": "2026-04-08T18:00:00.000Z",
    "newValues": { "type": "SOAP", "contactMethod": "Phone", ... }
  },
  {
    "action": "update",
    "patientId": "PT-10042",
    "type": "medications",
    "entryId": "local-1712345600-c3d4",
    "userName": "Jennifer Walsh",
    "timestamp": "2026-04-08T17:30:00.000Z",
    "previousValues": { "status": "Active" },
    "newValues": { "status": "Discontinued" }
  }
]
```

Maximum 500 audit entries are retained. Oldest entries are pruned when the limit is exceeded.

---

## 19. Seed Data Merging

When `getPatient(patientId)` is called, the DataProvider merges data from two sources:

### Source 1: Seed Data (`seedData.js`)
- 6 demo patients with full clinical histories
- Static data that is always present
- IDs use the format `PN-001`, `COM-001`, `ADM-001`, etc.
- **Read-only** -- cannot be edited or deleted through the UI

### Source 2: localStorage (`localStore.js`)
- User-created entries
- IDs use the format `local-{timestamp}-{random}`
- **Fully mutable** -- can be edited and deleted

### Merge Strategy

```js
function mergeEntries(seedArray, localArray) {
  return [...localArray.slice().reverse(), ...seedArray];
}
```

1. Local entries are reversed (so the most recent appears first)
2. Local entries are placed before seed entries
3. The result is a single array that appears to be sorted by recency
4. The `isEditable(entryId)` function checks for the `local-` prefix to determine editability

### Merged Patient Object

```js
{
  ...seedPatient,                          // Base demographics from seed
  progressNotes: mergeEntries(seed.progressNotes, localStore.progressNotes),
  communications: mergeEntries(seed.communications, localStore.communications),
  assessments: mergeEntries(seed.assessments, localStore.assessments),
  appointments: mergeEntries(seed.appointments, localStore.appointments),
  admissions: mergeEntries(seed.admissions, localStore.admissions),
  medications: mergeEntries(seed.medications, localStore.medications),
  authorizations: mergeEntries(seed.authorizations, localStore.authorizations),
  vitals: mergeEntries(seed.vitals, localStore.vitals),
  carePlan: {
    ...seed.carePlan,
    goals: mergeEntries(seed.carePlan.goals, localStore.carePlanGoals)
  }
}
```
