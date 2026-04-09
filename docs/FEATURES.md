# Kandil360 EMR -- Feature Documentation

## Table of Contents

1. [Authentication](#1-authentication)
2. [Dashboard](#2-dashboard)
3. [Patient Roster](#3-patient-roster)
4. [Patient Chart](#4-patient-chart)
5. [Overview Tab](#5-overview-tab)
6. [Progress Notes Tab](#6-progress-notes-tab)
7. [Communications Tab](#7-communications-tab)
8. [Appointments Tab](#8-appointments-tab)
9. [Admissions Tab](#9-admissions-tab)
10. [Assessments Tab](#10-assessments-tab)
11. [Care Plan Tab](#11-care-plan-tab)
12. [Medications Tab](#12-medications-tab)
13. [Vitals Tab](#13-vitals-tab)
14. [Authorizations Tab](#14-authorizations-tab)
15. [Call Mode](#15-call-mode)
16. [Appointment Scheduler](#16-appointment-scheduler)
17. [Care Plan Library](#17-care-plan-library)
18. [Assessment Templates](#18-assessment-templates)
19. [Data Persistence](#19-data-persistence)
20. [Audit Trail](#20-audit-trail)
21. [Mobile Responsiveness](#21-mobile-responsiveness)

---

## 1. Authentication

**File**: `src/contexts/AuthContext.jsx`, `src/pages/Login.jsx`

- Google Sign-In via Firebase Authentication
- Session persistence handled by Firebase (survives page refresh)
- Protected route wrapper redirects unauthenticated users to `/login`
- User profile (name, email, photo) displayed in sidebar
- Sign-out with confirmation via user dropdown menu

---

## 2. Dashboard

**File**: `src/pages/Dashboard.jsx`

The landing page after login. Provides an at-a-glance operational summary.

### Dynamic Statistics Cards
- **Total Patients**: Count of all patients in the caseload
- **High/Critical Risk**: Count of patients at High or Critical risk level
- **Pending Follow-ups**: Count of patients with upcoming follow-up dates
- **Active Goals**: Count of active care plan goals across all patients

### Upcoming Tasks
- Pulled from real patient `nextFollowUp` dates
- Relative date labels: "Today", "Tomorrow", "Overdue", or formatted date
- Links directly to the patient chart
- Sorted by urgency (overdue first, then by date)

### Recent Activity Feed
- Aggregates recent entries created across all patients from localStorage
- Shows entry type (note, call, assessment, appointment, admission)
- Relative timestamps ("Just now", "5 min ago", "2 hours ago", "Yesterday")
- Links to the patient chart for each entry

---

## 3. Patient Roster

**File**: `src/pages/PatientList.jsx`

### Search
- Real-time text search across first name, last name, patient ID, and MRN
- Instant filtering as user types

### Risk Level Filter
- Filter by: All, Critical, High, Medium, Low
- Color-coded filter buttons matching risk level badges

### Patient Cards
Each card displays:
- Patient name, ID, and MRN
- Risk level badge (color-coded)
- Acuity indicator (colored dot)
- Case type and assigned case manager
- Primary diagnoses
- Phone number and next follow-up date
- Insurance plan
- Click-through to full patient chart

---

## 4. Patient Chart

**File**: `src/pages/PatientChart.jsx`

### Sticky Header
- Persists at the top of the viewport during scrolling
- Patient avatar (initials), full name, risk level badge
- Patient ID, MRN, DOB, age, and sex
- Quick info chips: PCP, Insurance, Program (visible on desktop)
- "Call Mode" launch button

### Allergy Alert Banner
- Displays below the header for patients with allergies
- Red background with exclamation icon
- Lists all allergens with reactions, separated by pipes

### Tab Bar
- 10 horizontally scrollable tabs with icons
- Active tab highlighted with white background and border
- Responsive: icons only on mobile, icons + labels on desktop
- Tabs: Overview, Notes, Comms, Appts, Admissions, Assessments, Care Plan, Meds, Vitals, Auths

---

## 5. Overview Tab

**File**: `src/components/chart/OverviewTab.jsx`

A single-screen snapshot of the patient. Three-column layout on desktop.

### Case Information Card
- Status, acuity, case type, program
- Enrollment date, last contact, next follow-up
- Color-coded acuity and status values

### Insurance Card
- Plan name, member ID, group number
- Insurance type, copay, status

### Diagnoses Card
- All active diagnoses with ICD-10 codes
- Onset dates

### Allergies Card
- Allergen, reaction, severity
- Color-coded severity badges

### Emergency Contact Card
- Name, relationship, phone number

### Care Plan Summary
- Active goals with status indicators
- Barriers to care

---

## 6. Progress Notes Tab

**File**: `src/components/chart/ProgressNotesTab.jsx`

### Note Formats
- **SOAP**: Subjective, Objective, Assessment, Plan
- **DAR**: Data, Action, Response

### Fields
- Date and time
- Author (auto-populated from logged-in user)
- Note type (SOAP or DAR)
- Contact method (Phone, Video, In-Person, Chart Review)
- Full text fields for each note section

### CRUD Operations
- **Create**: Modal form with all fields
- **Read**: Expandable/collapsible cards with content preview
- **Edit**: Pre-populated modal for localStorage entries (indicated by pencil icon)
- **Delete**: Confirmation dialog before removal

### Features
- Search across note content
- Sort by date (newest first)
- Edit history tracking with `wasEdited` flag
- Color-coded by note type

---

## 7. Communications Tab

**File**: `src/components/chart/CommunicationsTab.jsx`

### Fields
- Date and time
- Direction (Inbound / Outbound)
- Method (Phone, Fax, Email, In-Person)
- Contact person and their role (Patient, PCP, Specialist, Insurance, Family/Caregiver)
- Subject line
- Summary (free text)
- Outcome
- Follow-up needed flag with follow-up date

### CRUD Operations
- Full create, read, edit, delete with audit trail
- Expandable cards with summary preview

---

## 8. Appointments Tab

**File**: `src/components/chart/AppointmentsTab.jsx`

### Appointment Display
- Cards showing date, time, provider, type, location, status
- Sorted by date (upcoming first)
- Status badges: Scheduled, Completed, Cancelled, No-Show

### Add Appointment
- Integrated `AppointmentScheduler` component
- Provider selection, calendar, time slots, duration, reason

### CRUD Operations
- Edit appointment details and status
- Delete with confirmation
- Full audit trail

---

## 9. Admissions Tab

**File**: `src/components/chart/AdmissionsTab.jsx`

### Fields
- Facility name and facility type (Acute Care, SNF, Rehab, Psych, LTACH)
- Admit date and discharge date
- Admitting diagnosis
- Attending physician
- Discharge disposition (Home, Home with HH, SNF, Rehab, AMA, Expired)
- Level of care (Med-Surg, Telemetry, ICU/CCU, Step-Down, Observation)
- Length of stay (auto-calculated)
- Readmission flag (within 30 days)

### CRUD Operations
- Full create, read, edit, delete
- Expandable admission detail cards

---

## 10. Assessments Tab

**File**: `src/components/chart/AssessmentsTab.jsx`

### Template-Based Assessments
Five validated clinical instruments:

| Template | Category | Questions | Scoring |
|----------|----------|-----------|---------|
| Morse Fall Scale | Safety | 6 | Sum: Low (0-24), Moderate (25-50), High (51-125) |
| PHQ-2 Depression Screening | Behavioral Health | 2 | Sum: Negative (0-2), Positive (3-6) |
| Transitions of Care | Care Coordination | 7 | Sum: High Risk (0-6), Moderate (7-10), Low (11-14) |
| Initial Comprehensive Assessment | Clinical | 8 | Composite: Functional/Clinical + SDOH sections |
| Braden Scale for Pressure Injury | Safety | 6 | Sum: Very High (6-9) to No Risk (19-23) |

### Features
- Template selector with category grouping
- Question-by-question form with dropdown options
- Automated score calculation
- Risk level color coding (green/yellow/red)
- Completed assessment cards with scores displayed
- Full CRUD with edit and delete

---

## 11. Care Plan Tab

**File**: `src/components/chart/CarePlanTab.jsx`

### Goal Management
- Each goal has: description, health concern, status, target date, interventions, barriers
- Status tracking: Not Started, Initiated, In Progress, On Track, Met, Not Met, Deferred
- Color-coded status badges

### Care Plan Library Integration
- Select from 15 pre-built health concern templates
- Each template provides evidence-based goals with interventions
- Goals can be customized after selection

### Progress Entries
- Add progress updates to individual goals
- Track status changes over time

### CRUD Operations
- Add goals manually or from library
- Edit goal details and status
- Delete goals with confirmation

---

## 12. Medications Tab

**File**: `src/components/chart/MedicationsTab.jsx`

### Fields
- Medication name
- Dose
- Frequency (Daily, BID, TID, QID, QHS, PRN, Weekly, Monthly)
- Prescriber
- Status (Active, Discontinued, On Hold)

### CRUD Operations
- Add new medications
- Edit medication details
- Discontinue (changes status rather than deleting)
- Delete with confirmation
- Search and filter by status

---

## 13. Vitals Tab

**File**: `src/components/chart/VitalsTab.jsx`

### Vital Signs Recorded
- Blood Pressure (systolic / diastolic)
- Heart Rate (bpm)
- Temperature (F)
- Oxygen Saturation (%)
- Respiratory Rate (breaths/min)
- Weight (lbs)

### Auto-Alert Thresholds

| Vital | Normal | Elevated | Critical |
|-------|--------|----------|----------|
| BP | 100-140 / 70-90 | Outside normal | >180/>100 or <90/<60 |
| Heart Rate | 60-100 | 50-60 or 100-120 | <50 or >120 |
| Temperature | 97.0-99.5 F | 95-97 or 99.5-104 | <95 or >104 |
| O2 Sat | 95-100% | 90-95% | <90% |
| Resp Rate | 12-20 | 20-25 or 10-12 | <10 or >25 |

### Features
- Color-coded indicators (green/yellow/red) per vital sign
- Trend arrows showing direction vs. previous reading
- Edit history tracking with `wasEdited` badge
- Search and sort
- Full CRUD

---

## 14. Authorizations Tab

**File**: `src/components/chart/AuthorizationsTab.jsx`

### Fields
- Auto-generated authorization number
- Service type (Inpatient, Outpatient, Home Health, DME, SNF, Rehab, Behavioral Health, Pharmacy)
- Priority (Routine, Urgent, Expedited)
- Requesting provider
- Facility/vendor
- ICD-10 diagnosis codes
- Clinical rationale (free text)
- Requested service dates (start and end)
- Requested units
- Status (Pending Review, Approved, Denied, Pended, Appeal Submitted, Appeal Approved, Appeal Denied, Expired)
- Decision date, approved units, denial reason

### Regulatory Deadline Engine
- Automatic countdown based on priority level:
  - Routine: 14 calendar days (336 hours)
  - Urgent: 72 hours
  - Expedited: 24 hours
- Visual countdown timer on pending authorizations
- Color transitions as deadline approaches (green -> yellow -> red)

### Status Lifecycle
```
Pending Review --> Approved
               --> Denied --> Appeal Submitted --> Appeal Approved
                                               --> Appeal Denied
               --> Pended --> (re-review)
               --> Expired
```

### CRUD Operations
- Create new authorizations with all fields
- Edit status and decision details
- Delete with confirmation
- Full audit trail

---

## 15. Call Mode

**File**: `src/components/CallMode.jsx`

### Layout
- Full-screen overlay on top of the patient chart
- Split panel design: left side (patient chart reference), right side (documentation tools)
- Green "active call" phone bar at the top with call timer

### Documentation Tools (Right Panel)
Collapsible sections for creating:

1. **Progress Notes** -- SOAP and DAR formats
2. **Communications** -- Inbound/outbound with all fields
3. **Assessments** -- Template selector with scoring
4. **Appointments** -- Full appointment scheduler
5. **Care Plan Goals** -- Library integration + manual creation
6. **Medications** -- Add medications during call
7. **Vitals** -- Record vital signs during call
8. **Authorizations** -- Create auth requests during call

### Reference Panel (Left Side)
- Previous progress notes (collapsible with content preview)
- Previous communications (collapsible with content preview)
- Sorted by date, most recent first

### Minimize Feature
- Click minimize to collapse Call Mode to a floating phone bar
- Phone bar shows patient name and call duration
- Click to restore full Call Mode
- Allows charting in the normal chart view while call is active

### Entries Created in Call Mode
- Immediately saved to localStorage
- Appear in the corresponding chart tabs when Call Mode is closed
- Include audit trail entries

---

## 16. Appointment Scheduler

**File**: `src/components/AppointmentScheduler.jsx`

### Provider Selection
- 7 providers with specialties and locations:
  - Dr. Sarah Chen (PCP)
  - Dr. Robert Patel (Pulmonology)
  - Dr. James Kim (Cardiology)
  - Dr. Elena Rivera (Oncology)
  - Dr. Amy Wong (PCP)
  - Dr. Raj Singh (Orthopedics)
  - CM Phone Assessment (Telehealth)

### Calendar View
- Month navigation (previous/next)
- Available dates highlighted based on selected provider's schedule
- Today marker
- Past dates grayed out
- Day-of-week headers

### Time Slot Picker
- Shows available time slots for the selected date
- Based on provider's weekly schedule
- Selectable time chips

### Duration Options
- 15, 20, 30, 40, 45, or 60 minutes

### Appointment Details
- Reason for visit (free text)
- Notes (free text)

### Integration Points
- Used in the Appointments tab for standalone scheduling
- Embedded in Call Mode for scheduling during calls

---

## 17. Care Plan Library

**File**: `src/data/carePlanLibrary.js`

15 evidence-based care plan templates organized by clinical category:

| Health Concern | Category | Goals | ICD-10 Codes |
|---------------|----------|-------|-------------|
| Type 2 Diabetes Mellitus | Endocrine | 3 | E11.9, E11.65 |
| Heart Failure (CHF) | Cardiovascular | 3 | I50.9, I50.22, I50.32 |
| COPD | Respiratory | 3 | J44.0, J44.1, J44.9 |
| Essential Hypertension | Cardiovascular | 2 | I10 |
| Chronic Kidney Disease | Renal | 2 | N18.3, N18.4, N18.5 |
| Major Depressive Disorder | Behavioral Health | 3 | F32.0, F32.1, F32.2, F33.0 |
| Post-Surgical Recovery | Surgical | 2 | Z96.641, Z96.642, Z96.651 |
| Fall Risk / Fall Prevention | Safety | 2 | R29.6, W19, Z91.81 |
| Medication Non-Adherence | Care Coordination | 2 | Z91.11, Z91.19 |
| Transitions of Care / Readmission Prevention | Care Coordination | 3 | Z87.898 |
| Cancer / Oncology Management | Oncology | 3 | C50.9, C34.9, C18.9, C61 |
| Spinal Cord Injury / Rehabilitation | Rehabilitation | 3 | T91.3, G82.20, G82.50 |
| Dementia / Alzheimer's Disease | Neurology | 3 | G30.0, G30.1, F03.90 |
| Obesity / Weight Management | Endocrine | 2 | E66.01, E66.09, E66.9 |
| Chronic Pain Management | Pain Management | 2 | G89.29, G89.4, M54.5 |

Each goal includes:
- Description (measurable outcome)
- Timeframe (30 days to 12 months)
- 4-5 specific, actionable interventions

---

## 18. Assessment Templates

**File**: `src/data/assessmentTemplates.js`

### Morse Fall Scale (Safety)
- 6 questions assessing fall risk factors
- Scoring: Low Risk (0-24), Moderate Risk (25-50), High Risk (51-125)
- Evaluates: fall history, secondary diagnoses, ambulatory aids, IV/heparin lock, gait, mental status

### PHQ-2 Depression Screening (Behavioral Health)
- 2-question rapid depression screening
- Scoring: Negative Screen (0-2), Positive Screen (3-6) -- triggers PHQ-9
- Evaluates: anhedonia and depressed mood over past 2 weeks

### Transitions of Care Assessment (Care Coordination)
- 7 questions for post-discharge readmission risk
- Scoring: High Risk (0-6), Moderate Risk (7-10), Low Risk (11-14)
- Evaluates: discharge understanding, follow-up scheduling, medication reconciliation, home support, warning signs knowledge, home health/DME status, transportation

### Initial Comprehensive Assessment (Clinical)
- 8 questions in two composite sections
- Section 1: Functional/Clinical (ADLs, cognition, pain, medication management)
- Section 2: Social Determinants of Health (food security, housing, transportation, social support)
- Composite scoring with section-level analysis

### Braden Scale for Pressure Injury Risk (Safety)
- 6 subscales scored 1-4 (friction/shear scored 1-3)
- Scoring: Very High Risk (6-9), High Risk (10-12), Moderate (13-14), Mild (15-18), No Risk (19-23)
- Evaluates: sensory perception, moisture, activity, mobility, nutrition, friction and shear

---

## 19. Data Persistence

### Seed Data
- 6 fully populated demo patients in `seedData.js`
- Each patient includes: demographics, insurance, diagnoses, medications, allergies, admissions, appointments, progress notes, communications, assessments, care plan goals
- Seed data is read-only and always present

### localStorage
- User-created entries stored under `kandil360_data` key
- Organized as: `{ patientId: { type: [entries] } }`
- Merged with seed data at read time
- Entries identified by `local-` prefix in ID
- Only `local-` entries can be edited or deleted

### Data Merging
- `mergeEntries()` places local entries (reversed for newest-first) before seed entries
- Result: user additions appear at the top of every list
- Seed data remains intact and unmodifiable

---

## 20. Audit Trail

### Logged Events
- **Create**: Every new entry (notes, comms, assessments, appointments, admissions, medications, vitals, authorizations, care plan goals)
- **Update**: Every edit with both previous and new values captured
- **Delete**: Every deletion with the deleted record preserved

### Audit Entry Fields
- Action (create / update / delete)
- Patient ID
- Record type
- Entry ID
- User name
- Timestamp (ISO 8601)
- Previous values (for updates and deletes)
- New values (for creates and updates)

### Storage
- Stored under `kandil360_audit` key in localStorage
- Maximum 500 entries (oldest pruned)
- Filterable by patient ID

---

## 21. Mobile Responsiveness

### Sidebar
- Desktop: collapsible sidebar with expand/collapse toggle
- Mobile: hidden off-screen, slides in via hamburger menu
- Backdrop overlay when mobile menu is open

### Patient Chart Header
- Responsive text sizing
- MRN, DOB details hidden on small screens
- Quick info chips (PCP, Insurance, Program) hidden below XL breakpoint
- "Call Mode" button shows icon-only on mobile

### Tab Bar
- Horizontally scrollable on mobile
- Icon-only on small screens, icons + labels on desktop
- Touch-friendly with `-webkit-overflow-scrolling: touch`

### Content Layout
- Cards stack vertically on mobile, grid on desktop
- Padding scales between mobile and desktop breakpoints
- Modals take full width on mobile with appropriate padding

### Dashboard
- Stats cards: single column on mobile, grid on desktop
- Task list and activity feed stack vertically
