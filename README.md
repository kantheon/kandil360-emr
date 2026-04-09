<p align="center">
  <img src="src/assets/hero.png" alt="Kandil360 EMR" width="120" />
</p>

<h1 align="center">Kandil360 EMR</h1>

<p align="center">
  <strong>Modern Case Management EMR for Health Insurance Companies</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" alt="License" />
</p>

<p align="center">
  <img src="docs/screenshot-placeholder.png" alt="Kandil360 Dashboard" width="800" />
  <br />
  <em>Replace with actual screenshot</em>
</p>

---

## Overview

Kandil360 is a purpose-built Electronic Medical Records (EMR) system designed for **case managers at health insurance companies**. Unlike hospital-facing EMRs, Kandil360 focuses on the payer-side workflow: tracking member health outcomes, coordinating care across providers, managing utilization authorizations, and documenting every touchpoint in the care continuum.

The system supports the full case management lifecycle -- from initial enrollment and comprehensive assessments through ongoing care coordination, utilization management, and discharge planning.

---

## Features

### Core Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Dynamic stats (patients, high-risk count, pending tasks, active goals), upcoming follow-up tasks pulled from real patient data, live activity feed of recent documentation entries |
| **Patient Roster** | Searchable patient list with filtering by risk level (Critical, High, Medium, Low), patient cards with demographics, insurance, diagnoses, and case info at a glance |
| **Patient Chart** | Full clinical chart with sticky header showing patient demographics, risk badge, and allergies. 10 clinical tabs for comprehensive documentation |

### Patient Chart Tabs

| Tab | Capabilities |
|-----|-------------|
| **Overview** | Case information, insurance details, diagnoses, allergies, emergency contact, and care plan summary on a single screen |
| **Progress Notes** | SOAP and DAR note formats with contact method tracking (Phone, Video, In-Person). Full CRUD with edit history |
| **Communications** | Log inbound/outbound communications across Phone, Fax, Email, and In-Person. Track contact person, role, outcome, and follow-up dates |
| **Appointments** | View and schedule appointments. Integrated appointment scheduler with calendar view, provider availability, and time slot selection |
| **Admissions** | Track hospital admissions with facility, diagnosis, attending physician, discharge disposition, level of care, length of stay, and readmission flags |
| **Assessments** | 5 validated clinical assessment templates with automated scoring: Morse Fall Scale, PHQ-2 Depression Screening, Transitions of Care, Initial Comprehensive Assessment, Braden Scale for Pressure Injury |
| **Care Plan** | Goal-based care plans with status tracking (Not Started through Met/Not Met/Deferred). 15 evidence-based care plan templates from the health concern library with pre-built interventions |
| **Medications** | Active medication list with dose, frequency, prescriber. Add/edit/discontinue with status tracking |
| **Vitals** | Record BP, HR, Temperature, O2 Sat, Respiratory Rate, Weight. Auto-alert thresholds with color-coded Critical/Elevated/Normal indicators. Trend tracking with edit history |
| **Authorizations** | Prior authorization management with service types, clinical rationale, ICD-10 codes, regulatory deadline countdown, and full status lifecycle (Pending -> Approved/Denied/Pended -> Appeal) |

### Call Mode

Full-screen split-panel mode designed for live phone calls with members. Left panel shows the patient chart; right panel provides inline documentation tools:

- Create SOAP/DAR progress notes
- Log communications
- Complete assessments with template scoring
- Schedule appointments with calendar picker
- Add care plan goals from the 15-condition library
- Add medications, vitals, and authorizations
- Minimize to a floating phone bar to continue charting
- Previous notes and communications visible for reference during calls

### Appointment Scheduler

Interactive calendar-based scheduling component:

- Provider selection with specialty and location
- Calendar view with available dates highlighted
- Time slot picker based on provider schedule
- Duration selection (15-60 minutes)
- Reason and notes fields
- Integrates with both the Appointments tab and Call Mode

### Clinical Libraries

- **Care Plan Library**: 15 health conditions with evidence-based goals and interventions covering Endocrine, Cardiovascular, Respiratory, Renal, Behavioral Health, Surgical, Safety, Care Coordination, Oncology, Rehabilitation, Neurology, and Pain Management
- **Assessment Templates**: 5 validated instruments (Morse Fall Scale, PHQ-2, Transitions of Care, Initial Comprehensive, Braden Scale) with automated scoring and risk categorization

### Data Layer

- **Provider-pattern architecture**: All data access through a single `DataProvider` context
- **CRUD on every record type** with automatic audit trail logging
- **Edit history tracking** with `wasEdited` flag and timestamps
- **localStorage persistence** with seamless seed data merging
- **Swappable backend**: Designed to swap from localStorage to Firestore (or any backend) with a single provider change

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project with Google Authentication enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/kandil360.git
cd kandil360

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** > **Sign-in method** > **Google**
3. Register a web app and copy the config values
4. Update `src/firebase.js` with your project credentials:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

5. (Optional) Enable **Cloud Firestore** for future backend migration

---

## Architecture Overview

```
src/
  App.jsx                    # Router + AuthProvider + DataProvider wrapper
  firebase.js                # Firebase initialization
  contexts/
    AuthContext.jsx           # Firebase Google Auth (login/logout/session)
    DataContext.jsx           # Unified data layer (useData hook)
  data/
    localStore.js             # localStorage CRUD + audit logging
    seedData.js               # 6 realistic demo patients with full histories
    carePlanLibrary.js        # 15 evidence-based care plan templates
    assessmentTemplates.js    # 5 validated clinical assessment instruments
  pages/
    Login.jsx                 # Google Sign-In
    Dashboard.jsx             # Dynamic stats + tasks + activity feed
    PatientList.jsx           # Searchable/filterable patient roster
    PatientChart.jsx          # 10-tab clinical chart with Call Mode
  components/
    AppLayout.jsx             # Collapsible sidebar + mobile responsive shell
    CallMode.jsx              # Full-screen split-panel call documentation
    AppointmentScheduler.jsx  # Calendar-based scheduling component
    Modal.jsx                 # Reusable modal component
    ConfirmDialog.jsx         # Delete confirmation dialog
    chart/
      OverviewTab.jsx         # Patient overview dashboard
      ProgressNotesTab.jsx    # SOAP/DAR progress notes
      CommunicationsTab.jsx   # Communication log
      AppointmentsTab.jsx     # Appointment management
      AdmissionsTab.jsx       # Hospital admissions
      AssessmentsTab.jsx      # Clinical assessments with scoring
      CarePlanTab.jsx         # Goal-based care plans
      MedicationsTab.jsx      # Medication management
      VitalsTab.jsx           # Vital signs with thresholds
      AuthorizationsTab.jsx   # Prior auth & utilization management
```

For complete architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Deployment

### Netlify (Recommended)

```bash
# Build for production
npm run build

# Deploy the dist/ folder to Netlify
# Or connect your GitHub repo for automatic deploys
```

Add a `_redirects` file in the `public/` directory for SPA routing:

```
/*    /index.html   200
```

### Environment Variables

Set these in your hosting provider's dashboard:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

For full deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, component hierarchy, data flow, design decisions |
| [FEATURES.md](docs/FEATURES.md) | Comprehensive feature documentation for every module and tab |
| [DATA_MODEL.md](docs/DATA_MODEL.md) | Complete data schemas for all entities |
| [API.md](docs/API.md) | DataProvider interface, localStore functions, backend swap guide |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Firebase setup, build commands, Netlify/Railway deployment |
| [ROADMAP.md](docs/ROADMAP.md) | Development phases, completed work, and planned features |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI framework |
| Tailwind CSS | 4.2 | Utility-first styling |
| Vite | 8.0 | Build tool and dev server |
| Firebase Auth | 12.11 | Google authentication |
| Firebase Firestore | 12.11 | Cloud database (planned) |
| React Router | 7.14 | Client-side routing |
| Heroicons | 2.2 | Icon library |
| date-fns | 4.1 | Date formatting |

---

## License

Proprietary. All rights reserved.

This software is confidential and proprietary to Kandil360. Unauthorized copying, distribution, or use of this software, via any medium, is strictly prohibited.
