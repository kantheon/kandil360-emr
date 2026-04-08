const STORE_KEY = 'careflow_data';

function getStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch { return {}; }
}

function setStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function getPatientEntries(patientId, type) {
  const store = getStore();
  return store[patientId]?.[type] || [];
}

function addPatientEntry(patientId, type, entry) {
  const store = getStore();
  if (!store[patientId]) store[patientId] = {};
  if (!store[patientId][type]) store[patientId][type] = [];
  store[patientId][type].push({ ...entry, id: `local-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, createdAt: new Date().toISOString() });
  setStore(store);
}

export { getPatientEntries, addPatientEntry };
