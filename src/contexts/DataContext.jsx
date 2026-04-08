import { createContext, useContext, useState, useCallback } from 'react';
import { patients as seedPatients } from '../data/seedData';
import {
  getPatientEntries,
  addPatientEntry,
  updatePatientEntry,
  deletePatientEntry,
  getAuditLog as getAuditLogFromStore
} from '../data/localStore';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

// Merge seed data arrays with localStorage additions (local entries first = newest)
function mergeEntries(seedArray, localArray) {
  return [...localArray.slice().reverse(), ...seedArray];
}

export function DataProvider({ children }) {
  // Increment to force re-renders when data changes
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion(v => v + 1), []);

  // Get all patients (seed data only for now - Firestore will replace this)
  const getPatients = useCallback(() => seedPatients, []);

  // Get single patient with ALL data merged from seed + localStorage
  const getPatient = useCallback((patientId) => {
    const seed = seedPatients.find(p => p.id === patientId);
    if (!seed) return null;
    // Force dependency on version so this re-evaluates after mutations
    void version;
    return {
      ...seed,
      progressNotes: mergeEntries(seed.progressNotes, getPatientEntries(patientId, 'progressNotes')),
      communications: mergeEntries(seed.communications, getPatientEntries(patientId, 'communications')),
      assessments: mergeEntries(seed.assessments, getPatientEntries(patientId, 'assessments')),
      appointments: mergeEntries(seed.appointments, getPatientEntries(patientId, 'appointments')),
      admissions: mergeEntries(seed.admissions, getPatientEntries(patientId, 'admissions')),
      medications: mergeEntries(seed.medications, getPatientEntries(patientId, 'medications').map(m => ({ ...m, status: m.status || 'Active' }))),
      authorizations: mergeEntries(seed.authorizations || [], getPatientEntries(patientId, 'authorizations')),
      vitals: mergeEntries(seed.vitals || [], getPatientEntries(patientId, 'vitals')),
      carePlan: {
        ...seed.carePlan,
        goals: mergeEntries(
          seed.carePlan.goals,
          getPatientEntries(patientId, 'carePlanGoals').map((g, i) => ({
            id: g.id || `local-g-${i}`,
            description: g.description || '',
            status: g.status || 'Not Started',
            targetDate: g.targetDate || '',
            healthConcern: g.healthConcern || '',
            interventions: g.interventions || [],
            barriers: g.barriers || '',
            source: 'local'
          }))
        )
      }
    };
  }, [version]);

  // Add entry to any collection type
  const addEntry = useCallback((patientId, type, data, userName) => {
    const result = addPatientEntry(patientId, type, data, userName);
    bump();
    return result;
  }, [bump]);

  // Update an entry (only works on localStorage entries, not seed data)
  const updateEntry = useCallback((patientId, type, entryId, updates, userName) => {
    const result = updatePatientEntry(patientId, type, entryId, updates, userName);
    bump();
    return result;
  }, [bump]);

  // Delete an entry (only works on localStorage entries, not seed data)
  const deleteEntry = useCallback((patientId, type, entryId, userName) => {
    const result = deletePatientEntry(patientId, type, entryId, userName);
    bump();
    return result;
  }, [bump]);

  // Check if an entry is editable (only local entries can be edited)
  const isEditable = useCallback((entryId) => {
    return typeof entryId === 'string' && entryId.startsWith('local-');
  }, []);

  // Get audit log
  const getAuditLog = useCallback((patientId) => {
    return getAuditLogFromStore(patientId);
  }, [version]);

  const value = {
    getPatients,
    getPatient,
    addEntry,
    updateEntry,
    deleteEntry,
    isEditable,
    getAuditLog,
    version, // expose for components that need to re-render on changes
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
