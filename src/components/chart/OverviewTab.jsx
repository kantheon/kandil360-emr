import {
  HeartIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CalendarIcon,
  FlagIcon,
  BellAlertIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function OverviewTab({ patient }) {
  // Collect all due follow-ups
  const followUps = [];
  const today = new Date().toISOString().split('T')[0];

  // From case info
  if (patient.caseInfo?.nextFollowUp) {
    followUps.push({ source: 'Case Management', date: patient.caseInfo.nextFollowUp, detail: `Next CM follow-up with ${patient.caseInfo.assignedCM || 'CM'}` });
  }

  // From communications with follow-up dates
  (patient.communications || []).forEach(c => {
    if (c.followUpDate && c.followUpDate >= today) {
      followUps.push({ source: 'Communication', date: c.followUpDate, detail: `F/U: ${c.subject || 'Communication'} - ${c.contactPerson || ''}` });
    }
  });

  // From appointments
  (patient.appointments || []).forEach(a => {
    if (a.date && a.date >= today && a.status === 'Scheduled') {
      followUps.push({ source: 'Appointment', date: a.date, detail: `${a.type} with ${a.provider}` });
    }
  });

  followUps.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const overdueFollowUps = followUps.filter(f => f.date < today);
  const upcomingFollowUps = followUps.filter(f => f.date >= today).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Due Follow-ups Alert */}
      {(overdueFollowUps.length > 0 || upcomingFollowUps.length > 0) && (
        <div className={`rounded-2xl p-4 border ${overdueFollowUps.length > 0 ? 'bg-danger-50 border-danger-200' : 'bg-primary-50 border-primary-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            {overdueFollowUps.length > 0 ? <BellAlertIcon className="w-5 h-5 text-danger-500" /> : <ClockIcon className="w-5 h-5 text-primary-500" />}
            <h3 className="text-sm font-semibold text-text-primary">Follow-ups Due</h3>
            {overdueFollowUps.length > 0 && <span className="badge badge-critical text-[10px]">{overdueFollowUps.length} overdue</span>}
          </div>
          <div className="space-y-2">
            {overdueFollowUps.map((f, i) => (
              <div key={`o-${i}`} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-danger-100">
                <span className="text-[10px] font-bold text-danger-600 bg-danger-100 px-2 py-0.5 rounded-md">{f.date}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-danger-700">{f.detail}</p>
                  <p className="text-[10px] text-danger-500">{f.source} - OVERDUE</p>
                </div>
              </div>
            ))}
            {upcomingFollowUps.map((f, i) => (
              <div key={`u-${i}`} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-border-light">
                <span className="text-[10px] font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-md">{f.date}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary">{f.detail}</p>
                  <p className="text-[10px] text-text-muted">{f.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
