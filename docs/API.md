# Kandil360 EMR -- API Reference

## Table of Contents

1. [DataProvider Interface (useData hook)](#1-dataprovider-interface)
2. [localStore Functions](#2-localstore-functions)
3. [Auth Context (useAuth hook)](#3-auth-context)
4. [Swapping to Firestore](#4-swapping-to-firestore)
5. [Future REST API Endpoints](#5-future-rest-api-endpoints)

---

## 1. DataProvider Interface

**File**: `src/contexts/DataContext.jsx`

All components access data through the `useData()` hook. This provides a unified interface that abstracts the underlying storage mechanism.

### Setup

```jsx
import { useData } from '../contexts/DataContext';

function MyComponent() {
  const {
    getPatients,
    getPatient,
    addEntry,
    updateEntry,
    deleteEntry,
    isEditable,
    getAuditLog,
    version,
  } = useData();
}
```

### Methods

#### `getPatients()`

Returns the full list of patients (currently from seed data).

```js
const patients = getPatients();
// Returns: Patient[]
```

| Parameter | Type | Description |
|-----------|------|-------------|
| _(none)_ | | |
| **Returns** | `Patient[]` | Array of all patient objects |

---

#### `getPatient(patientId)`

Returns a single patient with all data merged from seed data and localStorage.

```js
const patient = getPatient('PT-10042');
// Returns: Patient | null
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `patientId` | `string` | Patient identifier (e.g., `"PT-10042"`) |
| **Returns** | `Patient \| null` | Full patient object with merged data, or null if not found |

The returned patient includes all record arrays merged from both sources:
- `progressNotes`, `communications`, `assessments`, `appointments`
- `admissions`, `medications`, `vitals`, `authorizations`
- `carePlan.goals`

---

#### `addEntry(patientId, type, data, userName)`

Creates a new entry in localStorage for the specified patient and record type.

```js
const newNote = addEntry('PT-10042', 'progressNotes', {
  date: '2026-04-08',
  time: '2:00 PM',
  author: 'Jennifer Walsh, RN',
  type: 'SOAP',
  contactMethod: 'Phone',
  subjective: 'Patient reports...',
  objective: 'Alert and oriented...',
  assessment: 'Stable condition...',
  plan: '1. Continue medications...',
}, 'Jennifer Walsh');
// Returns: { id: 'local-1712345678-a1b2', ...data, createdAt: '...', createdBy: '...' }
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `patientId` | `string` | Patient identifier |
| `type` | `string` | Record type (see valid types below) |
| `data` | `object` | Entry data (schema depends on type) |
| `userName` | `string` | Name of the user creating the entry |
| **Returns** | `object` | The created entry with auto-generated `id`, `createdAt`, `createdBy` |

**Valid types**: `progressNotes`, `communications`, `assessments`, `appointments`, `admissions`, `medications`, `vitals`, `authorizations`, `carePlanGoals`

**Side effects**:
- Writes to `kandil360_data` in localStorage
- Creates an audit log entry in `kandil360_audit`
- Bumps the version counter, triggering re-renders

---

#### `updateEntry(patientId, type, entryId, updates, userName)`

Updates an existing localStorage entry. Only works on entries with `local-` prefix IDs.

```js
const updated = updateEntry('PT-10042', 'medications', 'local-1712345678-a1b2', {
  status: 'Discontinued',
}, 'Jennifer Walsh');
// Returns: updated entry object, or null if not found
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `patientId` | `string` | Patient identifier |
| `type` | `string` | Record type |
| `entryId` | `string` | ID of the entry to update |
| `updates` | `object` | Fields to merge into the existing entry |
| `userName` | `string` | Name of the user making the update |
| **Returns** | `object \| null` | Updated entry, or null if not found |

**Side effects**:
- Updates the entry in `kandil360_data`
- Sets `updatedAt` and `updatedBy` on the entry
- Logs audit entry with both `previousValues` and `newValues`
- Bumps the version counter

---

#### `deleteEntry(patientId, type, entryId, userName)`

Deletes a localStorage entry. Only works on entries with `local-` prefix IDs.

```js
const success = deleteEntry('PT-10042', 'progressNotes', 'local-1712345678-a1b2', 'Jennifer Walsh');
// Returns: true or false
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `patientId` | `string` | Patient identifier |
| `type` | `string` | Record type |
| `entryId` | `string` | ID of the entry to delete |
| `userName` | `string` | Name of the user performing the deletion |
| **Returns** | `boolean` | `true` if deleted, `false` if not found |

**Side effects**:
- Removes the entry from `kandil360_data`
- Logs audit entry with `previousValues` (the deleted record)
- Bumps the version counter

---

#### `isEditable(entryId)`

Checks whether an entry can be edited or deleted. Only localStorage entries (prefixed with `local-`) are editable.

```js
isEditable('local-1712345678-a1b2');  // true
isEditable('PN-001');                  // false (seed data)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `entryId` | `string` | Entry identifier |
| **Returns** | `boolean` | `true` if the entry is editable |

---

#### `getAuditLog(patientId)`

Retrieves audit log entries, optionally filtered by patient.

```js
const allLogs = getAuditLog();            // All audit entries
const patientLogs = getAuditLog('PT-10042'); // Entries for one patient
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `patientId` | `string` (optional) | Filter by patient ID |
| **Returns** | `AuditEntry[]` | Array of audit log entries, newest first |

---

#### `version`

An integer counter that increments after every mutation. Components can depend on this value to re-render when data changes.

```js
const { version } = useData();
// Use in dependency arrays or as a key to force re-render
```

---

## 2. localStore Functions

**File**: `src/data/localStore.js`

Low-level localStorage operations. These are used internally by DataProvider but can also be imported directly.

### `getPatientEntries(patientId, type)`

Reads entries for a specific patient and record type from localStorage.

```js
import { getPatientEntries } from '../data/localStore';
const notes = getPatientEntries('PT-10042', 'progressNotes');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `patientId` | `string` | Patient identifier |
| `type` | `string` | Record type |
| **Returns** | `object[]` | Array of entries (empty array if none) |

---

### `addPatientEntry(patientId, type, entry, userName)`

Creates a new entry with auto-generated ID and timestamps.

```js
import { addPatientEntry } from '../data/localStore';
const newEntry = addPatientEntry('PT-10042', 'progressNotes', { ... }, 'Jennifer Walsh');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `patientId` | `string` | Patient identifier |
| `type` | `string` | Record type |
| `entry` | `object` | Entry data |
| `userName` | `string` | Creator name (default: `"Current User"`) |
| **Returns** | `object` | Created entry with `id`, `createdAt`, `createdBy` |

---

### `updatePatientEntry(patientId, type, entryId, updates, userName)`

Updates an existing entry by merging new fields.

```js
import { updatePatientEntry } from '../data/localStore';
const updated = updatePatientEntry('PT-10042', 'medications', 'local-...', { status: 'Discontinued' }, 'Jennifer Walsh');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `patientId` | `string` | Patient identifier |
| `type` | `string` | Record type |
| `entryId` | `string` | Entry to update |
| `updates` | `object` | Fields to merge |
| `userName` | `string` | Updater name |
| **Returns** | `object \| null` | Updated entry, or null if not found |

---

### `deletePatientEntry(patientId, type, entryId, userName)`

Removes an entry from localStorage.

```js
import { deletePatientEntry } from '../data/localStore';
const success = deletePatientEntry('PT-10042', 'progressNotes', 'local-...', 'Jennifer Walsh');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `patientId` | `string` | Patient identifier |
| `type` | `string` | Record type |
| `entryId` | `string` | Entry to delete |
| `userName` | `string` | Deleter name |
| **Returns** | `boolean` | `true` if deleted |

---

### `getAuditLog(patientId)`

Retrieves audit log entries from `kandil360_audit`.

```js
import { getAuditLog } from '../data/localStore';
const log = getAuditLog('PT-10042');
```

---

### `clearPatientData(patientId)`

Removes all localStorage data for a specific patient. Does not affect seed data.

```js
import { clearPatientData } from '../data/localStore';
clearPatientData('PT-10042');
```

---

### `generateId()`

Creates a unique ID with the `local-` prefix convention.

```js
import { generateId } from '../data/localStore';
const id = generateId(); // "local-1712345678-a1b2"
```

Format: `local-{Date.now()}-{4 random alphanumeric chars}`

---

## 3. Auth Context

**File**: `src/contexts/AuthContext.jsx`

### Setup

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, loginWithGoogle, logout } = useAuth();
}
```

### Properties and Methods

| Name | Type | Description |
|------|------|-------------|
| `user` | `firebase.User \| null` | Current authenticated user object, or null |
| `loading` | `boolean` | `true` while Firebase is checking auth state |
| `loginWithGoogle()` | `function` | Opens Google Sign-In popup. Returns a Promise |
| `logout()` | `function` | Signs out the current user. Returns a Promise |

### User Object Properties (from Firebase)

| Property | Type | Description |
|----------|------|-------------|
| `user.displayName` | `string` | User's display name |
| `user.email` | `string` | User's email address |
| `user.photoURL` | `string` | URL to user's profile photo |
| `user.uid` | `string` | Firebase unique user ID |

---

## 4. Swapping to Firestore

The DataProvider pattern makes backend swaps straightforward. Here is the planned approach:

### Step 1: Create Firestore Provider

Create `src/data/firestoreStore.js` implementing the same interface as `localStore.js`:

```js
// firestoreStore.js
import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';

export function getPatientEntries(patientId, type) {
  // Read from: patients/{patientId}/{type}
}

export function addPatientEntry(patientId, type, entry, userName) {
  // Write to: patients/{patientId}/{type}
  // Use serverTimestamp() for createdAt
}

export function updatePatientEntry(patientId, type, entryId, updates, userName) {
  // Update: patients/{patientId}/{type}/{entryId}
}

export function deletePatientEntry(patientId, type, entryId, userName) {
  // Delete: patients/{patientId}/{type}/{entryId}
}
```

### Step 2: Update DataContext Imports

In `DataContext.jsx`, swap the import:

```js
// Before:
import { getPatientEntries, addPatientEntry, ... } from '../data/localStore';

// After:
import { getPatientEntries, addPatientEntry, ... } from '../data/firestoreStore';
```

### Step 3: Firestore Collections

```
patients/{patientId}                           # Patient demographics
patients/{patientId}/progressNotes/{noteId}    # Progress notes
patients/{patientId}/communications/{commId}   # Communications
patients/{patientId}/assessments/{assessId}    # Assessments
patients/{patientId}/appointments/{apptId}     # Appointments
patients/{patientId}/admissions/{admId}        # Admissions
patients/{patientId}/medications/{medId}       # Medications
patients/{patientId}/vitals/{vitalId}          # Vital signs
patients/{patientId}/authorizations/{authId}   # Authorizations
patients/{patientId}/carePlanGoals/{goalId}    # Care plan goals
patients/{patientId}/auditLog/{logId}          # Audit trail
```

### Step 4: Seed Data Migration

Run a one-time script to migrate `seedData.js` into Firestore:

```js
// scripts/seedFirestore.js
import { patients } from '../data/seedData';
import { db } from '../firebase';
// Iterate and write each patient + subcollections to Firestore
```

No changes needed to any component -- only the data layer changes.

---

## 5. Future REST API Endpoints

When a backend server (Express/Node.js) is added, these endpoints will mirror the DataProvider interface:

### Patients

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patients` | List all patients |
| `GET` | `/api/patients/:id` | Get single patient with all data |
| `POST` | `/api/patients` | Create new patient |
| `PUT` | `/api/patients/:id` | Update patient demographics |
| `DELETE` | `/api/patients/:id` | Archive/delete patient |

### Patient Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patients/:id/:type` | List entries of a type |
| `POST` | `/api/patients/:id/:type` | Create new entry |
| `PUT` | `/api/patients/:id/:type/:entryId` | Update entry |
| `DELETE` | `/api/patients/:id/:type/:entryId` | Delete entry |

Where `:type` is one of: `progressNotes`, `communications`, `assessments`, `appointments`, `admissions`, `medications`, `vitals`, `authorizations`, `carePlanGoals`.

### Audit Log

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/audit` | All audit entries |
| `GET` | `/api/audit?patientId=:id` | Filtered by patient |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/verify` | Verify Firebase token |
| `GET` | `/api/auth/me` | Current user profile |
