import { useState } from 'react';
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

export default function AppointmentsTab({ patient }) {
  const [search, setSearch] = useState('');
  const [expandedAppts, setExpandedAppts] = useState(new Set(patient.appointments.map((_, i) => i)));

  const toggleAppt = (i) => {
    setExpandedAppts(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const filtered = patient.appointments.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [a.type, a.provider, a.location, a.date, a.status].join(' ').toLowerCase().includes(q);
  });

  const upcoming = filtered.filter(a => a.status === 'Scheduled');
  const past = filtered.filter(a => a.status !== 'Scheduled');

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">Appointments</h2>
        <div className="relative sm:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-xs" />
        </div>
      </div>

      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Upcoming</h3>
          <div className="space-y-2">
            {upcoming.map((appt, idx) => {
              const i = patient.appointments.indexOf(appt);
              const isOpen = expandedAppts.has(i);
              return (
                <div key={idx} className="card p-0 overflow-hidden">
                  <button onClick={() => toggleAppt(i)} className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 hover:bg-surface-alt transition-colors cursor-pointer text-left">
                    <div className="bg-gradient-to-b from-primary-500 to-primary-700 text-white rounded-lg p-2 text-center min-w-[48px] shrink-0">
                      <p className="text-[10px] font-medium opacity-80 leading-none">{new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</p>
                      <p className="text-lg font-bold leading-tight">{new Date(appt.date + 'T00:00:00').getDate()}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{appt.type}</p>
                      <p className="text-xs text-text-muted mt-0.5">{appt.provider} &middot; {appt.time}</p>
                    </div>
                    <span className="badge badge-active text-[10px] shrink-0">{appt.status}</span>
                    {isOpen ? <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 lg:px-5 pb-4 border-t border-border-light pt-3 animate-fade-in">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <UserIcon className="w-3.5 h-3.5 text-text-muted" />{appt.provider}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <ClockIcon className="w-3.5 h-3.5 text-text-muted" />{appt.time}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <MapPinIcon className="w-3.5 h-3.5 text-text-muted" />{appt.location}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Past</h3>
          <div className="space-y-2">
            {past.map((appt, i) => (
              <div key={i} className="card p-3 flex items-center gap-3 opacity-60">
                <CheckCircleIcon className="w-5 h-5 text-accent-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{appt.type}</p>
                  <p className="text-xs text-text-muted">{appt.provider} &middot; {appt.date}</p>
                </div>
                <span className="badge badge-neutral text-[10px]">Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">{search ? `No results for "${search}"` : 'No appointments'}</p>
        </div>
      )}
    </div>
  );
}
