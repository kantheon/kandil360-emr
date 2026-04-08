import {
  CalendarDaysIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function AppointmentsTab({ patient }) {
  const upcoming = patient.appointments.filter(a => a.status === 'Scheduled');
  const past = patient.appointments.filter(a => a.status !== 'Scheduled');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Appointments</h2>
        <p className="text-xs text-text-muted mt-0.5">{upcoming.length} upcoming, {past.length} past</p>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Upcoming</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((appt, i) => (
              <div key={i} className="card p-0 overflow-hidden">
                <div className="flex">
                  {/* Date Block */}
                  <div className="bg-gradient-to-b from-primary-500 to-primary-700 text-white p-4 flex flex-col items-center justify-center min-w-[80px]">
                    <span className="text-xs font-medium opacity-80">
                      {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-bold leading-tight">
                      {new Date(appt.date + 'T00:00:00').getDate()}
                    </span>
                    <span className="text-xs font-medium opacity-80">
                      {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-text-primary">{appt.type}</h4>
                      <span className="badge badge-active text-[11px]">{appt.status}</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <UserIcon className="w-3.5 h-3.5 text-text-muted" />
                        {appt.provider}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <ClockIcon className="w-3.5 h-3.5 text-text-muted" />
                        {appt.time}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <MapPinIcon className="w-3.5 h-3.5 text-text-muted" />
                        {appt.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Past Appointments</h3>
          <div className="space-y-2">
            {past.map((appt, i) => (
              <div key={i} className="card p-4 flex items-center gap-4 opacity-60">
                <CheckCircleIcon className="w-5 h-5 text-accent-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{appt.type}</p>
                  <p className="text-xs text-text-muted">{appt.provider} &middot; {appt.date}</p>
                </div>
                <span className="badge badge-neutral text-[11px]">Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {patient.appointments.length === 0 && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">No appointments scheduled</p>
        </div>
      )}
    </div>
  );
}
