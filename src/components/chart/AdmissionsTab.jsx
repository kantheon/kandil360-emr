import {
  BuildingOffice2Icon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const facilityTypeColors = {
  'Acute Care': 'badge-critical',
  'Inpatient Rehab (IRF)': 'badge-warning',
  'Skilled Nursing Facility': 'badge-info',
};

export default function AdmissionsTab({ patient }) {
  const current = patient.admissions.filter(a => !a.dischargeDate);
  const past = patient.admissions.filter(a => a.dischargeDate);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Admissions</h2>
        <p className="text-xs text-text-muted mt-0.5">
          {current.length} current admission{current.length !== 1 ? 's' : ''}, {past.length} past
        </p>
      </div>

      {/* Current Admissions */}
      {current.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-danger-500 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-danger-400 rounded-full animate-pulse" />
            Currently Admitted
          </h3>
          {current.map((adm) => (
            <div key={adm.id} className="card p-0 overflow-hidden border-danger-200">
              <div className="bg-danger-50 px-6 py-3 border-b border-danger-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BuildingOffice2Icon className="w-5 h-5 text-danger-500" />
                  <span className="text-sm font-semibold text-danger-700">{adm.facility}</span>
                </div>
                <span className={`badge ${facilityTypeColors[adm.facilityType] || 'badge-neutral'}`}>
                  {adm.facilityType}
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    ['Admit Date', adm.admitDate],
                    ['Admit Diagnosis', adm.admitDiagnosis],
                    ['Attending Physician', adm.attendingPhysician],
                    ['Level of Care', adm.levelOfCare],
                    ['Days Admitted', `${Math.ceil((new Date() - new Date(adm.admitDate)) / (1000 * 60 * 60 * 24))} days`],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-surface-alt rounded-xl p-3">
                      <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-semibold text-text-primary mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past Admissions */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Admission History</h3>
          <div className="space-y-4">
            {past.map((adm) => (
              <div key={adm.id} className="card p-0 overflow-hidden">
                <div className="bg-surface-alt px-6 py-3 border-b border-border-light flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BuildingOffice2Icon className="w-5 h-5 text-text-muted" />
                    <div>
                      <span className="text-sm font-semibold text-text-primary">{adm.facility}</span>
                      <span className="text-xs text-text-muted ml-2">({adm.facilityType})</span>
                    </div>
                  </div>
                  {adm.readmissionFlag && (
                    <span className="badge badge-critical flex items-center gap-1">
                      <ExclamationTriangleIcon className="w-3 h-3" />
                      Readmission
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Admit Date</p>
                      <p className="text-sm font-semibold text-text-primary mt-0.5">{adm.admitDate}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Discharge Date</p>
                      <p className="text-sm font-semibold text-text-primary mt-0.5">{adm.dischargeDate}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">LOS</p>
                      <p className="text-sm font-semibold text-text-primary mt-0.5">{adm.lengthOfStay} days</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Level of Care</p>
                      <p className="text-sm font-semibold text-text-primary mt-0.5">{adm.levelOfCare}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border-light grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Admit Diagnosis</p>
                      <p className="text-sm text-text-primary mt-0.5">{adm.admitDiagnosis}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Attending Physician</p>
                      <p className="text-sm text-text-primary mt-0.5">{adm.attendingPhysician}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border-light">
                    <div className="flex items-center gap-2">
                      <ArrowRightIcon className="w-3.5 h-3.5 text-text-muted" />
                      <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Discharge Disposition</p>
                    </div>
                    <p className="text-sm font-medium text-text-primary mt-0.5 ml-5.5">{adm.dischargeDisposition}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {patient.admissions.length === 0 && (
        <div className="text-center py-12">
          <BuildingOffice2Icon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">No admission history</p>
        </div>
      )}
    </div>
  );
}
