# Kandil360 EMR -- Architecture

## System Architecture

```
+--------------------------------------------------+
|                    Browser                        |
|                                                   |
|  +--------------------------------------------+  |
|  |              React Application              |  |
|  |                                             |  |
|  |  +---------------------------------------+  |  |
|  |  |          App.jsx (Root)                |  |  |
|  |  |  BrowserRouter                         |  |  |
|  |  |    AuthProvider                        |  |  |
|  |  |      DataProvider                      |  |  |
|  |  |        AppRoutes                       |  |  |
|  |  +---------------------------------------+  |  |
|  |                                             |  |
|  |  +------------------+  +-----------------+  |  |
|  |  |   Auth Context   |  |  Data Context   |  |  |
|  |  |  Firebase Auth   |  |   useData()     |  |  |
|  |  |  Google Sign-In  |  |   CRUD ops      |  |  |
|  |  +------------------+  +-----------------+  |  |
|  |                             |                |  |
|  |                    +--------+--------+       |  |
|  |                    |                 |       |  |
|  |              +-----------+   +-----------+   |  |
|  |              | localStore|   | seedData  |   |  |
|  |              | (CRUD +   |   | (6 demo   |   |  |
|  |              |  audit)   |   |  patients)|   |  |
|  |              +-----------+   +-----------+   |  |
|  |                    |                         |  |
|  +--------------------------------------------+  |
|                       |                           |
+-----------------------|---------------------------+
                        |
          +-------------+-------------+
          |                           |
  +-------+-------+          +-------+-------+
  |  localStorage  |          |   Firebase    |
  |  kandil360_    |          |   Auth only   |
  |  data / audit  |          |  (Google SSO) |
  +----------------+          +---------------+
```

## Component Hierarchy

```
App
  BrowserRouter
    AuthProvider
      DataProvider
        AppRoutes
          /login .............. Login (Google Sign-In page)
          / ................... ProtectedRoute
            AppLayout (sidebar + shell)
              / ............... Dashboard (stats, tasks, activity)
              /patients ....... PatientList (search, filter, cards)
              /patients/:id ... PatientChart
                                  Sticky Header (demographics, risk, allergies)
                                  Tab Bar (10 tabs)
                                  Tab Content:
                                    OverviewTab
                                    ProgressNotesTab
                                    CommunicationsTab
                                    AppointmentsTab
                                      AppointmentScheduler
                                    AdmissionsTab
                                    AssessmentsTab
                                    CarePlanTab
                                    MedicationsTab
                                    VitalsTab
                                    AuthorizationsTab
                                  CallMode (full-screen overlay)
                                    Inline note/comm/assessment/appt/carePlan forms
                                    AppointmentScheduler (embedded)
```

## Data Flow

### Read Path

```
Component renders
    |
    v
useData() hook --> DataProvider
    |
    +---> getPatients()  --> returns seedData patients array
    |
    +---> getPatient(id) --> merges seed data + localStorage
              |
              +-- seed patient base object
              +-- mergeEntries(seed.progressNotes, localStore progressNotes)
              +-- mergeEntries(seed.communications, localStore communications)
              +-- mergeEntries(seed.assessments, localStore assessments)
              +-- mergeEntries(seed.appointments, localStore appointments)
              +-- mergeEntries(seed.admissions, localStore admissions)
              +-- mergeEntries(seed.medications, localStore medications)
              +-- mergeEntries(seed.authorizations, localStore authorizations)
              +-- mergeEntries(seed.vitals, localStore vitals)
              +-- mergeEntries(seed.carePlan.goals, localStore carePlanGoals)
```

The `mergeEntries()` function places local (user-created) entries before seed data entries, giving the appearance that newer entries are at the top.

### Write Path

```
User clicks "Save" in any form
    |
    v
Tab component calls addEntry / updateEntry / deleteEntry
    |
    v
DataProvider delegates to localStore.js
    |
    +---> Generates unique ID (local-{timestamp}-{random})
    +---> Writes to localStorage under kandil360_data
    +---> Logs audit entry to kandil360_audit
    +---> Returns new/updated entry
    |
    v
DataProvider bumps version counter
    |
    v
All components re-read via getPatient() --> merged data includes new entry
```

### Auth Flow

```
User visits any route
    |
    v
AuthProvider checks Firebase onAuthStateChanged
    |
    +-- No user --> ProtectedRoute redirects to /login
    |                   |
    |                   v
    |              Login page --> signInWithPopup(GoogleAuthProvider)
    |                   |
    |                   v
    |              Firebase returns user --> AuthProvider sets state
    |                   |
    |                   v
    |              Redirect to / (Dashboard)
    |
    +-- User exists --> ProtectedRoute renders children
    |
    +-- Logout --> signOut(auth) --> user = null --> redirect to /login
```

## File Structure

```
kandil360/
  package.json                  # Dependencies and scripts
  vite.config.js                # Vite configuration with React + Tailwind plugins
  index.html                    # Entry HTML
  public/                       # Static assets
  docs/                         # Project documentation
    ARCHITECTURE.md             # This file
    FEATURES.md                 # Feature documentation
    DATA_MODEL.md               # Data schemas
    API.md                      # DataProvider interface
    DEPLOYMENT.md               # Deployment guide
    ROADMAP.md                  # Development roadmap
  src/
    main.jsx                    # React DOM entry point
    App.jsx                     # Root component: Router + Providers
    App.css                     # Global styles (minimal)
    index.css                   # Tailwind base + custom theme tokens
    firebase.js                 # Firebase app initialization
    assets/
      hero.png                  # App logo
      react.svg                 # React logo
      vite.svg                  # Vite logo
    contexts/
      AuthContext.jsx            # Firebase Google auth (useAuth hook)
      DataContext.jsx            # Data abstraction layer (useData hook)
    data/
      seedData.js                # 6 demo patients with full clinical data
      localStore.js              # localStorage CRUD + audit trail
      carePlanLibrary.js         # 15 evidence-based care plan templates
      assessmentTemplates.js     # 5 validated assessment instruments
    pages/
      Login.jsx                  # Google Sign-In page
      Dashboard.jsx              # Dashboard with stats, tasks, activity
      PatientList.jsx            # Searchable patient roster
      PatientChart.jsx           # Tabbed patient chart + Call Mode
    components/
      AppLayout.jsx              # App shell: collapsible sidebar + main area
      CallMode.jsx               # Full-screen call documentation overlay
      AppointmentScheduler.jsx   # Calendar-based appointment scheduler
      Modal.jsx                  # Reusable modal wrapper
      ConfirmDialog.jsx          # Confirmation dialog for deletions
      chart/
        OverviewTab.jsx          # Patient overview
        ProgressNotesTab.jsx     # SOAP / DAR notes
        CommunicationsTab.jsx    # Communication log
        AppointmentsTab.jsx      # Appointments + scheduler
        AdmissionsTab.jsx        # Hospital admissions
        AssessmentsTab.jsx       # Assessments with scoring
        CarePlanTab.jsx          # Care plans with goals
        MedicationsTab.jsx       # Medication management
        VitalsTab.jsx            # Vital signs with thresholds
        AuthorizationsTab.jsx    # Prior authorizations
```

## Key Design Decisions

### 1. DataProvider Abstraction Pattern

**Decision**: All data access goes through a single `DataProvider` context exposed via the `useData()` hook.

**Why**: This creates a clean separation between the UI layer and the data layer. The current implementation uses localStorage with seed data merging, but the interface is designed so that swapping to Firestore, a REST API, or any other backend requires changing only the provider implementation -- not a single line of code in any component.

**Interface**:
```js
const { getPatients, getPatient, addEntry, updateEntry, deleteEntry, isEditable, getAuditLog } = useData();
```

### 2. localStorage-First Development

**Decision**: Build the full application with localStorage persistence before adding Firestore.

**Why**:
- Zero infrastructure cost during development and demos
- Instant startup -- no backend provisioning needed
- Works offline and on any machine
- Proves the UI and data model before committing to a schema
- Seed data provides rich demo content immediately

### 3. Seed Data Merging

**Decision**: Maintain static seed data in `seedData.js` and merge user-created entries from localStorage at read time.

**Why**:
- Demo patients always have realistic clinical histories
- User additions appear seamlessly alongside seed data
- Resetting to demo state is as simple as clearing localStorage
- No risk of corrupting demo data during development

### 4. Version Counter for Reactivity

**Decision**: Use an integer `version` counter in DataProvider to trigger re-renders after mutations.

**Why**: Since localStorage mutations happen outside React's state system, components would not know to re-render. The version counter creates a dependency that forces `getPatient()` to re-evaluate after any `addEntry`, `updateEntry`, or `deleteEntry` call.

### 5. Local ID Prefix Convention

**Decision**: All user-created entries get IDs prefixed with `local-` (e.g., `local-1712345678-a1b2`).

**Why**: This allows the `isEditable()` function to instantly determine whether an entry can be edited or deleted. Seed data entries have static IDs (e.g., `PN-001`) and are read-only, while localStorage entries are fully mutable.

### 6. Call Mode as Overlay

**Decision**: Call Mode is a full-screen overlay component rendered inside PatientChart, not a separate route.

**Why**:
- Shares the same patient context as the chart
- Can access all the same data without re-fetching
- Minimizes to a floating phone bar without losing state
- All documentation created in Call Mode immediately appears in the chart tabs

### 7. Tab Components as Standalone Units

**Decision**: Each chart tab is a self-contained component with its own add/edit/delete modals.

**Why**:
- Reduces coupling between tabs
- Each tab can be developed and tested independently
- Modal state stays local to the tab that owns it
- Easy to add new tabs without touching existing code
