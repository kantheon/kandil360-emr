import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { getPatientEntries } from '../data/localStore';
import {
  UsersIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  PhoneIcon,
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Format a date string as a relative label (Today, Tomorrow, or Mon-style short date)
function formatDueLabel(dateStr) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (dateStr === todayStr) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';
  if (dateStr < todayStr) return 'Overdue';
  // Format as "Apr 10" style
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format a timestamp as relative time (just now, X min ago, X hours ago, yesterday, or date)
function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Map entry type to display type
function entryTypeLabel(type) {
  const map = {
    progressNotes: 'note',
    communications: 'call',
    assessments: 'assessment',
    appointments: 'appointment',
    admissions: 'admission',
  };
  return map[type] || type;
}

// Map entry type to display text prefix
function entryTypeText(type, entry) {
  switch (type) {
    case 'progressNotes': return 'Progress note added';
    case 'communications': return entry.subject ? `Communication: ${entry.subject}` : 'Communication logged';
    case 'assessments': return entry.type ? `${entry.type} completed` : 'Assessment completed';
    case 'appointments': return entry.type ? `${entry.type} scheduled` : 'Appointment scheduled';
    case 'admissions': return entry.admitDiagnosis ? `Admission: ${entry.admitDiagnosis}` : 'Admission recorded';
    default: return 'Entry added';
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const { getPatients, version } = useData();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const patients = useMemo(() => getPatients(), [getPatients, version]);

  // --- Stats (fully dynamic) ---
  const totalPatients = patients.length;
  const highAcuity = patients.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical').length;
  const today = new Date().toISOString().split('T')[0];
  const todayFollowUps = patients.filter(p => p.caseInfo.nextFollowUp <= today).length;
  const activeAdmissions = patients.filter(p => p.admissions?.some(a => !a.dischargeDate)).length;

  const stats = [
    { label: 'Active Patients', value: totalPatients, icon: UsersIcon, color: 'bg-primary-50 text-primary-600', trend: `${totalPatients} total` },
    { label: 'High Risk', value: highAcuity, icon: ExclamationTriangleIcon, color: 'bg-danger-50 text-danger-500', trend: 'Needs attention' },
    { label: 'Due Follow-ups', value: todayFollowUps, icon: PhoneIcon, color: 'bg-warn-50 text-warn-500', trend: 'Today' },
    { label: 'Current Admissions', value: activeAdmissions, icon: ClipboardDocumentCheckIcon, color: 'bg-accent-50 text-accent-600', trend: 'Inpatient' },
  ];

  // --- Upcoming Tasks (dynamic from patient data) ---
  const upcomingTasks = useMemo(() => {
    const tasks = [];
    const sevenDaysOut = new Date();
    sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);
    const sevenDaysStr = sevenDaysOut.toISOString().split('T')[0];

    patients.forEach(p => {
      const patientName = `${p.lastName}, ${p.firstName}`;
      const nextFU = p.caseInfo?.nextFollowUp;

      // Follow-up tasks
      if (nextFU && nextFU <= sevenDaysStr) {
        const isOverdue = nextFU < today;
        const isDueToday = nextFU === today;
        tasks.push({
          patient: patientName,
          task: `${p.caseInfo.program || 'CM'} follow-up`,
          due: formatDueLabel(nextFU),
          dueRaw: nextFU,
          priority: isOverdue || isDueToday ? 'high' : nextFU <= new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0] ? 'medium' : 'low',
        });
      }

      // Upcoming appointments in next 7 days
      (p.appointments || []).forEach(appt => {
        if (appt.date >= today && appt.date <= sevenDaysStr && appt.status === 'Scheduled') {
          tasks.push({
            patient: patientName,
            task: `${appt.type}${appt.provider ? ' - ' + appt.provider : ''}`,
            due: formatDueLabel(appt.date),
            dueRaw: appt.date,
            priority: appt.date === today ? 'high' : appt.date <= new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0] ? 'medium' : 'low',
          });
        }
      });
    });

    // Sort by due date, overdue first
    tasks.sort((a, b) => a.dueRaw.localeCompare(b.dueRaw));
    return tasks;
  }, [patients, today]);

  // --- Recent Activity (dynamic from localStorage entries) ---
  const recentActivity = useMemo(() => {
    const entryTypes = ['progressNotes', 'communications', 'assessments', 'appointments', 'admissions'];
    const allEntries = [];

    patients.forEach(p => {
      const patientLabel = `${p.lastName}, ${p.firstName}`;
      entryTypes.forEach(type => {
        const localEntries = getPatientEntries(p.id, type);
        localEntries.forEach(entry => {
          if (entry.createdAt) {
            allEntries.push({
              text: `${entryTypeText(type, entry)} for ${patientLabel}`,
              time: formatRelativeTime(entry.createdAt),
              timeRaw: entry.createdAt,
              type: entryTypeLabel(type),
            });
          }
        });
      });
    });

    // Sort newest first, take top 8
    allEntries.sort((a, b) => b.timeRaw.localeCompare(a.timeRaw));
    return allEntries.slice(0, 8);
  }, [patients, version]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in p-4 lg:p-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Good morning, {firstName}</h1>
        <p className="text-text-secondary text-sm mt-1">Here's your caseload overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color} shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary leading-none">{stat.value}</p>
              <p className="text-sm text-text-secondary font-medium mt-1">{stat.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-3 card p-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-text-muted" />
              <h2 className="text-base font-semibold text-text-primary">Upcoming Tasks</h2>
            </div>
            <span className="badge badge-warning">{upcomingTasks.length} pending</span>
          </div>
          <div className="divide-y divide-border-light">
            {upcomingTasks.map((task, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-alt transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  task.priority === 'high' ? 'bg-danger-400' : task.priority === 'medium' ? 'bg-warn-400' : 'bg-accent-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{task.task}</p>
                  <p className="text-xs text-text-muted">{task.patient}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                  task.due === 'Overdue' ? 'bg-danger-100 text-danger-700' : task.due === 'Today' ? 'bg-danger-50 text-danger-600' : task.due === 'Tomorrow' ? 'bg-warn-50 text-warn-500' : 'bg-surface-alt text-text-secondary'
                }`}>
                  {task.due}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 card p-0">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border-light">
            <ArrowTrendingUpIcon className="w-5 h-5 text-text-muted" />
            <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border-light">
            {recentActivity.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-text-muted">No recent activity yet</p>
                <p className="text-xs text-text-muted mt-1">Activity will appear here as you add notes, communications, and assessments</p>
              </div>
            ) : recentActivity.map((item, i) => (
              <div key={i} className="px-6 py-3.5">
                <p className="text-sm text-text-primary leading-snug">{item.text}</p>
                <p className="text-xs text-text-muted mt-1">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Patients Quick View */}
      <div className="card p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-danger-400" />
            <h2 className="text-base font-semibold text-text-primary">High Priority Patients</h2>
          </div>
          <Link to="/patients" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
          {patients.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical').map((patient) => (
            <Link
              key={patient.id}
              to={`/patients/${patient.id}`}
              className="card card-hover p-5 block"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold text-sm">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{patient.lastName}, {patient.firstName}</p>
                    <p className="text-xs text-text-muted">{patient.id} &middot; {patient.age}y {patient.sex[0]}</p>
                  </div>
                </div>
                <span className={`badge ${patient.riskLevel === 'Critical' ? 'badge-critical' : 'badge-warning'}`}>
                  {patient.riskLevel}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Program</span>
                  <span className="text-text-secondary font-medium">{patient.caseInfo.program}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Next Follow-up</span>
                  <span className="text-text-secondary font-medium">{patient.caseInfo.nextFollowUp}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Last Contact</span>
                  <span className="text-text-secondary font-medium">{patient.caseInfo.lastContact}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
