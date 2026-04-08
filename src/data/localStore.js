const STORE_KEY = 'kandil360_data';
const AUDIT_KEY = 'kandil360_audit';

function getStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
  catch { return {}; }
}

function setStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function getAuditStore() {
  try { return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]'); }
  catch { return []; }
}

function logAudit(entry) {
  const log = getAuditStore();
  log.unshift({ ...entry, timestamp: new Date().toISOString() });
  if (log.length > 500) log.length = 500;
  localStorage.setItem(AUDIT_KEY, JSON.stringify(log));
}

function generateId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// --- CRUD ---

function getPatientEntries(patientId, type) {
  const store = getStore();
  return store[patientId]?.[type] || [];
}

function addPatientEntry(patientId, type, entry, userName = 'Current User') {
  const store = getStore();
  if (!store[patientId]) store[patientId] = {};
  if (!store[patientId][type]) store[patientId][type] = [];
  const id = generateId();
  const newEntry = { ...entry, id, createdAt: new Date().toISOString(), createdBy: userName };
  store[patientId][type].push(newEntry);
  setStore(store);
  logAudit({ action: 'create', patientId, type, entryId: id, userName, newValues: entry });
  return newEntry;
}

function updatePatientEntry(patientId, type, entryId, updates, userName = 'Current User') {
  const store = getStore();
  const entries = store[patientId]?.[type];
  if (!entries) return null;
  const idx = entries.findIndex(e => e.id === entryId);
  if (idx === -1) return null;
  const previous = { ...entries[idx] };
  entries[idx] = { ...entries[idx], ...updates, updatedAt: new Date().toISOString(), updatedBy: userName };
  setStore(store);
  logAudit({ action: 'update', patientId, type, entryId, userName, previousValues: previous, newValues: updates });
  return entries[idx];
}

function deletePatientEntry(patientId, type, entryId, userName = 'Current User') {
  const store = getStore();
  const entries = store[patientId]?.[type];
  if (!entries) return false;
  const entry = entries.find(e => e.id === entryId);
  if (!entry) return false;
  store[patientId][type] = entries.filter(e => e.id !== entryId);
  setStore(store);
  logAudit({ action: 'delete', patientId, type, entryId, userName, previousValues: entry });
  return true;
}

function getAuditLog(patientId) {
  const log = getAuditStore();
  if (!patientId) return log;
  return log.filter(e => e.patientId === patientId);
}

function clearPatientData(patientId) {
  const store = getStore();
  delete store[patientId];
  setStore(store);
}

export {
  getPatientEntries,
  addPatientEntry,
  updatePatientEntry,
  deletePatientEntry,
  getAuditLog,
  clearPatientData,
  generateId
};
