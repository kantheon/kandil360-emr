import {
  HeartIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CalendarIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

export default function OverviewTab({ patient }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Row - Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Case Info */}
        <div className="bg-surface-alt rounded-2xl p-5 border border-border-light">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardDocumentListIcon className="w-5 h-5 text-primary-500" />
            <h3 className="text-sm font-semibold text-text-primary">Case Information</h3>
          </div>
          <div className="space-y-3">
            {[
              ['Status', patient.caseInfo.status],
              ['Acuity', patient.caseInfo.acuity],
              ['Type', patient.caseInfo.caseType],
              ['Program', patient.caseInfo.program],
              ['Enrolled', patient.caseInfo.enrollmentDate],
              ['Last Contact', patient.caseInfo.lastContact],
              ['Next Follow-up', patient.caseInfo.nextFollowUp],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-text-muted">{label}</span>
                <span className={`text-xs font-semibold ${
                  label === 'Acuity' && value === 'High' ? 'text-danger-500' :
                  label === 'Status' && value === 'Active' ? 'text-accent-600' :
                  'text-text-primary'
                }`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnoses */}
        <div className="bg-surface-alt rounded-2xl p-5 border border-border-light">
          <div className="flex items-center gap-2 mb-4">
            <HeartIcon className="w-5 h-5 text-danger-400" />
            <h3 className="text-sm font-semibold text-text-primary">Active Diagnoses</h3>
            <span className="ml-auto badge badge-neutral text-[11px]">{patient.diagnoses.length}</span>
          </div>
          <div className="space-y-2.5">
            {patient.diagnoses.map((dx, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="badge badge-info text-[11px] shrink-0 mt-0.5">{dx.code}</span>
                <div>
                  <p className="text-xs font-medium text-text-primary leading-snug">{dx.description}</p>
                  <p className="text-[11px] text-text-muted">Since {dx.onsetDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance & Contacts */}
        <div className="bg-surface-alt rounded-2xl p-5 border border-border-light">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon className="w-5 h-5 text-accent-500" />
            <h3 className="text-sm font-semibold text-text-primary">Insurance</h3>
          </div>
          <div className="space-y-3">
            {[
              ['Plan', patient.insurance.plan],
              ['Member ID', patient.insurance.memberId],
              ['Group', patient.insurance.groupNumber],
              ['Type', patient.insurance.type],
              ['Copay', patient.insurance.copay],
              ['Status', patient.insurance.status],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-2">
                <span className="text-xs text-text-muted shrink-0">{label}</span>
                <span className={`text-xs font-semibold text-right ${
                  label === 'Status' && value === 'Active' ? 'text-accent-600' : 'text-text-primary'
                }`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Care Plan Goals */}
        <div className="bg-surface-alt rounded-2xl p-5 border border-border-light">
          <div className="flex items-center gap-2 mb-4">
            <FlagIcon className="w-5 h-5 text-primary-500" />
            <h3 className="text-sm font-semibold text-text-primary">Care Plan Goals</h3>
          </div>
          <div className="space-y-3">
            {patient.carePlan.goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl p-3.5 border border-border-light">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-text-primary leading-snug flex-1">{goal.description}</p>
                  <span className={`badge text-[11px] shrink-0 ${
                    goal.status === 'Met' ? 'badge-active' :
                    goal.status === 'On Track' ? 'badge-info' :
                    goal.status === 'In Progress' ? 'badge-warning' :
                    'badge-neutral'
                  }`}>
                    {goal.status}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted mt-1.5">Target: {goal.targetDate}</p>
              </div>
            ))}
          </div>
          {patient.carePlan.barriers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border-light">
              <p className="text-xs font-semibold text-text-secondary mb-2">Barriers to Care</p>
              <div className="space-y-1.5">
                {patient.carePlan.barriers.map((barrier, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ExclamationCircleIcon className="w-3.5 h-3.5 text-warn-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary">{barrier}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Appointments & Recent Activity */}
        <div className="space-y-4">
          {/* Appointments */}
          <div className="bg-surface-alt rounded-2xl p-5 border border-border-light">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-primary-500" />
              <h3 className="text-sm font-semibold text-text-primary">Upcoming Appointments</h3>
            </div>
            {patient.appointments.length > 0 ? (
              <div className="space-y-2.5">
                {patient.appointments.map((appt, i) => (
                  <div key={i} className="bg-white rounded-xl p-3.5 border border-border-light flex items-center gap-3">
                    <div className="bg-primary-50 rounded-lg p-2 text-center min-w-[48px]">
                      <p className="text-[11px] text-primary-500 font-medium leading-none">
                        {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                      <p className="text-lg font-bold text-primary-700 leading-tight">
                        {new Date(appt.date + 'T00:00:00').getDate()}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary">{appt.type}</p>
                      <p className="text-[11px] text-text-secondary">{appt.provider}</p>
                      <p className="text-[11px] text-text-muted">{appt.time} &middot; {appt.location}</p>
                    </div>
                    <span className="badge badge-active text-[11px]">{appt.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted text-center py-4">No upcoming appointments</p>
            )}
          </div>

          {/* Allergies & Emergency */}
          <div className="bg-surface-alt rounded-2xl p-5 border border-border-light">
            <div className="flex items-center gap-2 mb-4">
              <UserGroupIcon className="w-5 h-5 text-accent-500" />
              <h3 className="text-sm font-semibold text-text-primary">Emergency Contact</h3>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-border-light">
              <p className="text-sm font-semibold text-text-primary">{patient.emergencyContact.name}</p>
              <p className="text-xs text-text-secondary">{patient.emergencyContact.relation}</p>
              <p className="text-xs text-text-muted mt-1">{patient.emergencyContact.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
