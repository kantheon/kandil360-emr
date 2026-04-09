// Build known contacts list from patient data
export function getPatientContacts(patient) {
  const contacts = [
    { name: `${patient.firstName} ${patient.lastName}`, phone: patient.phone, role: 'Patient' },
  ];
  if (patient.emergencyContact?.name) {
    contacts.push({ name: patient.emergencyContact.name, phone: patient.emergencyContact.phone, role: 'Family/Caregiver', relation: patient.emergencyContact.relation });
  }
  if (patient.pcp) {
    contacts.push({ name: patient.pcp, phone: '', role: 'PCP' });
  }
  if (patient.caseInfo?.assignedCM) {
    contacts.push({ name: patient.caseInfo.assignedCM, phone: '', role: 'Case Manager' });
  }
  // Add any custom contacts from localStorage
  try {
    const custom = JSON.parse(localStorage.getItem(`k360_contacts_${patient.id}`) || '[]');
    contacts.push(...custom);
  } catch {}
  return contacts;
}

export function addCustomContact(patientId, contact) {
  try {
    const custom = JSON.parse(localStorage.getItem(`k360_contacts_${patientId}`) || '[]');
    custom.push(contact);
    localStorage.setItem(`k360_contacts_${patientId}`, JSON.stringify(custom));
  } catch {}
}
