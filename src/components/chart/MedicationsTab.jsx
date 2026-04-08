import {
  BeakerIcon,
  ShieldExclamationIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

export default function MedicationsTab({ patient }) {
  const activeMeds = patient.medications.filter(m => m.status === 'Active');
  const inactiveMeds = patient.medications.filter(m => m.status !== 'Active');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Medications</h2>
        <p className="text-xs text-text-muted mt-0.5">{activeMeds.length} active medications</p>
      </div>

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
