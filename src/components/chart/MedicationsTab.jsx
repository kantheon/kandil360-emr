import { useState } from 'react';
import {
  BeakerIcon,
  ShieldExclamationIcon,
  CheckBadgeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import { addPatientEntry, getPatientEntries } from '../../data/localStore';

export default function MedicationsTab({ patient }) {
  const [showForm, setShowForm] = useState(false);
  const [_saveCount, setSaveCount] = useState(0);
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medFrequency, setMedFrequency] = useState('Daily');
  const [medPrescriber, setMedPrescriber] = useState('');
  const [medStatus, setMedStatus] = useState('Active');

  const localEntries = getPatientEntries(patient.id, 'medications');
  const allMedications = [...localEntries.slice().reverse().map(e => ({ ...e, status: e.status || 'Active' })), ...patient.medications];

  const resetForm = () => {
    setMedName(''); setMedDose(''); setMedFrequency('Daily'); setMedPrescriber(''); setMedStatus('Active');
  };

  const handleSave = () => {
    const entry = {
      name: medName,
      dose: medDose,
      frequency: medFrequency,
      prescriber: medPrescriber,
      status: medStatus,
    };
    addPatientEntry(patient.id, 'medications', entry);
    setShowForm(false);
    resetForm();
    setSaveCount(c => c + 1);
  };

  const activeMeds = allMedications.filter(m => m.status === 'Active');
  const inactiveMeds = allMedications.filter(m => m.status !== 'Active');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Medications</h2>
          <p className="text-xs text-text-muted mt-0.5">{activeMeds.length} active medications</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary py-2 flex items-center gap-1.5">
          <PlusIcon className="w-4 h-4" /><span className="hidden sm:inline">Add Medication</span>
        </button>
      </div>

      {/* Modal Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Medication">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Medication Name</label>
            <input type="text" className="input-field py-2 text-xs" placeholder="e.g. Lisinopril" value={medName} onChange={e => setMedName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Dose</label>
            <input type="text" className="input-field py-2 text-xs" placeholder="e.g. 10mg" value={medDose} onChange={e => setMedDose(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Frequency</label>
            <select value={medFrequency} onChange={e => setMedFrequency(e.target.value)} className="input-field py-2 text-xs">
              <option>Daily</option><option>BID</option><option>TID</option><option>QID</option><option>QHS</option><option>PRN</option><option>Weekly</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Prescriber</label>
            <input type="text" className="input-field py-2 text-xs" placeholder="Prescriber name" value={medPrescriber} onChange={e => setMedPrescriber(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowForm(false)} className="btn-secondary py-2 text-xs">Cancel</button>
          <button onClick={handleSave} className="btn-primary py-2 text-xs">Save Medication</button>
        </div>
      </Modal>

      {/* Allergies Alert */}
      {patient.allergies.length > 0 && (
        <div className="bg-danger-50 rounded-2xl p-5 border border-danger-200">
          <div className="flex items-center gap-2 mb-3">
            <ShieldExclamationIcon className="w-5 h-5 text-danger-500" />
            <h3 className="text-sm font-semibold text-danger-700">Drug Allergies</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {patient.allergies.map((allergy, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-danger-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-danger-600">!</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-danger-700">{allergy.allergen}</p>
                  <p className="text-xs text-danger-500">{allergy.reaction} &middot; {allergy.severity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {patient.allergies.length === 0 && (
        <div className="bg-accent-50 rounded-2xl p-4 border border-accent-200 flex items-center gap-3">
          <CheckBadgeIcon className="w-5 h-5 text-accent-600" />
          <span className="text-sm font-medium text-accent-700">No Known Drug Allergies (NKDA)</span>
        </div>
      )}

      {/* Active Medications */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <BeakerIcon className="w-4 h-4 text-primary-500" />
          Active Medications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeMeds.map((med, i) => (
            <div key={i} className="card p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary-600">Rx</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-text-primary">{med.name}</h4>
                  <span className="badge badge-active text-[11px]">{med.status}</span>
                </div>
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span><span className="text-text-muted">Dose:</span> {med.dose}</span>
                    <span><span className="text-text-muted">Freq:</span> {med.frequency}</span>
                  </div>
                  <p className="text-xs text-text-muted">Prescribed by {med.prescriber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inactive */}
      {inactiveMeds.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Inactive / Discontinued</h3>
          <div className="space-y-2">
            {inactiveMeds.map((med, i) => (
              <div key={i} className="card p-4 opacity-50 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center">
                  <span className="text-[11px] font-bold text-text-muted">Rx</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{med.name} {med.dose} {med.frequency}</p>
                  <p className="text-xs text-text-muted">{med.prescriber}</p>
                </div>
                <span className="badge badge-neutral text-[11px] ml-auto">{med.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
