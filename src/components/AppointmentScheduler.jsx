import { useState, useMemo } from 'react';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';

/* ── Provider schedules: day-of-week → available times ── */
const providerSchedules = [
  { provider: 'Dr. Sarah Chen', specialty: 'PCP', location: 'Chen Medical Group', days: { 1: ['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM'], 3: ['9:00 AM','10:00 AM','11:00 AM'], 4: ['10:00 AM','11:00 AM','2:00 PM'], 5: ['9:00 AM','10:00 AM'] } },
  { provider: 'Dr. Robert Patel', specialty: 'Pulmonology', location: 'Miami Lung Center', days: { 2: ['1:00 PM','2:00 PM','3:00 PM'], 4: ['1:00 PM','2:30 PM'], 5: ['10:00 AM','11:00 AM'] } },
  { provider: 'Dr. James Kim', specialty: 'Cardiology', location: 'Emory Heart & Vascular Center', days: { 1: ['10:00 AM','11:00 AM'], 3: ['2:00 PM','3:00 PM','4:00 PM'], 4: ['9:00 AM','10:00 AM'] } },
  { provider: 'Dr. Elena Rivera', specialty: 'Oncology', location: 'Northwestern Cancer Center', days: { 2: ['9:00 AM','10:00 AM','11:00 AM'], 3: ['1:00 PM','2:00 PM'], 5: ['1:00 PM','2:00 PM','3:00 PM'] } },
  { provider: 'Dr. Amy Wong', specialty: 'PCP', location: 'Wong Medical Associates', days: { 1: ['9:00 AM','10:00 AM','2:00 PM'], 2: ['2:00 PM','3:00 PM','4:00 PM'], 4: ['9:00 AM','10:00 AM','11:00 AM'], 5: ['1:00 PM','2:00 PM'] } },
  { provider: 'Dr. Raj Singh', specialty: 'Orthopedics', location: 'Mass General Ortho', days: { 1: ['8:00 AM','9:00 AM','10:00 AM'], 3: ['9:00 AM','10:00 AM','11:00 AM'], 5: ['10:00 AM','11:00 AM'] } },
  { provider: 'CM Phone Assessment', specialty: 'Telehealth', location: 'Telehealth', days: { 1: ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM'], 2: ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM'], 3: ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM'], 4: ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM'], 5: ['9:00 AM','10:00 AM','11:00 AM','1:00 PM'] } },
];

const durations = ['15 min', '20 min', '30 min', '40 min', '45 min', '60 min'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getProviderDatesForMonth(schedule, year, month) {
  const available = new Set();
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    const dow = date.getDay();
    if (schedule.days[dow]) {
      available.add(date.toISOString().split('T')[0]);
    }
    date.setDate(date.getDate() + 1);
  }
  return available;
}

function getSlotsForDate(schedule, dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const dow = d.getDay();
  return schedule.days[dow] || [];
}

/* ── Mini Calendar ── */
function MiniCalendar({ year, month, onMonthChange, selectedDate, onSelectDate, availableDates }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];
  const monthLabel = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => onMonthChange(-1)} className="p-1 rounded-lg hover:bg-surface-hover text-text-muted cursor-pointer text-sm">&larr;</button>
        <p className="text-xs font-semibold text-text-primary">{monthLabel}</p>
        <button onClick={() => onMonthChange(1)} className="p-1 rounded-lg hover:bg-surface-hover text-text-muted cursor-pointer text-sm">&rarr;</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {dayNames.map(d => <div key={d} className="text-[9px] font-semibold text-text-muted py-1">{d}</div>)}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isAvailable = availableDates.has(dateStr);
          const isPast = dateStr < today;
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;
          return (
            <button
              key={dateStr}
              disabled={isPast || !isAvailable}
              onClick={() => onSelectDate(dateStr)}
              className={`py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer disabled:cursor-default ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-sm'
                  : isPast
                    ? 'text-text-muted/30'
                    : isAvailable
                      ? 'bg-accent-50 text-accent-700 hover:bg-accent-100 border border-accent-200'
                      : 'text-text-muted/40'
              } ${isToday && !isSelected ? 'ring-1 ring-primary-300' : ''}`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-accent-50 border border-accent-200" /> Available</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-surface-alt" /> Unavailable</span>
      </div>
    </div>
  );
}

/* ── Main Scheduler Component ── */
export default function AppointmentScheduler({ value, onChange, disabled }) {
  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());

  const selectedSchedule = providerSchedules.find(p => p.provider === value.provider);

  const availableDates = useMemo(() => {
    if (!selectedSchedule) return new Set();
    return getProviderDatesForMonth(selectedSchedule, calYear, calMonth);
  }, [selectedSchedule, calYear, calMonth]);

  const slotsForDate = useMemo(() => {
    if (!selectedSchedule || !value.date) return [];
    return getSlotsForDate(selectedSchedule, value.date);
  }, [selectedSchedule, value.date]);

  const handleMonthChange = (dir) => {
    let m = calMonth + dir;
    let y = calYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalMonth(m);
    setCalYear(y);
  };

  return (
    <div className="space-y-3">
      {/* Appointment Type */}
      <div>
        <label className="text-xs font-medium text-text-secondary mb-1 block">Appointment Type</label>
        <input disabled={disabled} type="text" className="input-field py-2 text-xs disabled:opacity-60" placeholder="e.g. PCP Follow-up, Cardiology Consult" value={value.type || ''} onChange={e => onChange({ ...value, type: e.target.value })} />
      </div>

      {/* Provider */}
      <div>
        <label className="text-xs font-medium text-text-secondary mb-1 block">Provider</label>
        <select disabled={disabled} className="input-field py-2 text-xs disabled:opacity-60" value={value.provider || ''} onChange={e => {
          const sched = providerSchedules.find(p => p.provider === e.target.value);
          onChange({ ...value, provider: e.target.value, date: '', time: '', location: sched?.location || '' });
        }}>
          <option value="">Select provider...</option>
          {providerSchedules.map(p => <option key={p.provider} value={p.provider}>{p.provider} ({p.specialty})</option>)}
        </select>
      </div>

      {/* Calendar + Time Slots side by side */}
      {selectedSchedule && !disabled && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Calendar */}
          <div className="bg-surface-alt rounded-xl p-3 border border-border-light">
            <label className="text-xs font-medium text-text-secondary mb-2 block flex items-center gap-1">
              <CalendarDaysIcon className="w-3.5 h-3.5" /> Select Date
            </label>
            <MiniCalendar
              year={calYear}
              month={calMonth}
              onMonthChange={handleMonthChange}
              selectedDate={value.date}
              onSelectDate={(d) => onChange({ ...value, date: d, time: '' })}
              availableDates={availableDates}
            />
          </div>

          {/* Time Slots */}
          <div className="bg-surface-alt rounded-xl p-3 border border-border-light">
            <label className="text-xs font-medium text-text-secondary mb-2 block flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" /> {value.date ? `Slots for ${new Date(value.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}` : 'Select a date first'}
            </label>
            {value.date ? (
              slotsForDate.length > 0 ? (
                <div className="grid grid-cols-2 gap-1.5">
                  {slotsForDate.map(slot => (
                    <button
                      key={slot}
                      onClick={() => onChange({ ...value, time: slot })}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        value.time === slot
                          ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                          : 'bg-white border-border-light text-text-secondary hover:bg-primary-50 hover:border-primary-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted py-4 text-center">No slots available for this date</p>
              )
            ) : (
              <p className="text-xs text-text-muted py-4 text-center">Pick a green date on the calendar</p>
            )}
          </div>
        </div>
      )}

      {/* Duration + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1 block">Duration</label>
          <select disabled={disabled} className="input-field py-2 text-xs disabled:opacity-60" value={value.duration || '30 min'} onChange={e => onChange({ ...value, duration: e.target.value })}>
            {durations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1 block">Location</label>
          <input disabled={disabled} type="text" className="input-field py-2 text-xs disabled:opacity-60" placeholder="Clinic or Telehealth" value={value.location || ''} onChange={e => onChange({ ...value, location: e.target.value })} />
        </div>
      </div>

      {/* Summary */}
      {value.provider && value.date && value.time && (
        <div className="bg-primary-50 rounded-xl p-3 border border-primary-100 flex items-center gap-3">
          <div className="bg-primary-100 rounded-lg p-2 text-center min-w-[44px]">
            <p className="text-[9px] text-primary-500 font-medium">{new Date(value.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</p>
            <p className="text-lg font-bold text-primary-700 leading-tight">{new Date(value.date + 'T00:00:00').getDate()}</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary-800">{value.type || 'Appointment'}</p>
            <p className="text-[11px] text-primary-600">{value.provider} &middot; {value.time} &middot; {value.duration || '30 min'}</p>
            <p className="text-[11px] text-primary-500">{value.location}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export { providerSchedules };
