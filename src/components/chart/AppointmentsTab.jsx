import { useState } from 'react';
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import { addPatientEntry, getPatientEntries } from '../../data/localStore';

const providerList = [
  'Dr. Sarah Chen (PCP)',
  'Dr. Robert Patel (Pulmonology)',
  'Dr. James Kim (Cardiology)',
  'Dr. Elena Rivera (Oncology)',
  'Dr. Amy Wong (PCP)',
  'Dr. Raj Singh (Orthopedics)',
];

export default function AppointmentsTab({ patient }) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [_saveCount, setSaveCount] = useState(0);
  const [apptType, setApptType] = useState('');
  const [apptProvider, setApptProvider] = useState(providerList[0]);
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptLocation, setApptLocation] = useState('');

  const localEntries = getPatientEntries(patient.id, 'appointments');
  const allAppointments = [...localEntries.slice().reverse().map(e => ({ ...e, status: e.status || 'Scheduled' })), ...patient.appointments];

  const [expandedAppts, setExpandedAppts] = useState(new Set(allAppointments.map((_, i) => i)));

  const toggleAppt = (i) => {
    setExpandedAppts(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const resetForm = () => {
    setApptType(''); setApptProvider(providerList[0]); setApptDate(''); setApptTime(''); setApptLocation('');
  };

  const handleSave = () => {
    const entry = {
      date: apptDate,
      time: apptTime,
      provider: apptProvider,
      type: apptType,
      location: apptLocation,
      status: 'Scheduled',
    };
    addPatientEntry(patient.id, 'appointments', entry);
    setShowForm(false);
    resetForm();
    setSaveCount(c => c + 1);
  };

  const filtered = allAppointments.filter(a => {
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
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-xs" />
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary py-2 flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" /><span className="hidden sm:inline">Add Appointment</span>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Appointment" footer={<div className="flex justify-end gap-2"><button onClick={() => setShowForm(false)} className="btn-secondary py-2 text-xs">Cancel</button><button onClick={handleSave} className="btn-primary py-2 text-xs">Save Appointment</button></div>}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Appointment Type</label>
            <input type="text" className="input-field py-2 text-xs" placeholder="e.g. Follow-up, Annual Physical..." value={apptType} onChange={e => setApptType(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Provider</label>
            <select value={apptProvider} onChange={e => setApptProvider(e.target.value)} className="input-field py-2 text-xs">
              {providerList.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Date</label>
              <input type="date" className="input-field py-2 text-xs" value={apptDate} onChange={e => setApptDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Time</label>
              <select value={apptTime} onChange={e => setApptTime(e.target.value)} className="input-field py-2 text-xs">
                <option value="">Select time...</option>
                {['7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Location</label>
            <input type="text" className="input-field py-2 text-xs" placeholder="Clinic or address" value={apptLocation} onChange={e => setApptLocation(e.target.value)} />
          </div>
        </div>
      </Modal>

      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Upcoming</h3>
          <div className="space-y-2">
            {upcoming.map((appt, idx) => {
              const i = allAppointments.indexOf(appt);
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
