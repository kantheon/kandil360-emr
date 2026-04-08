import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { patients } from '../data/seedData';
import {
  UsersIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  PhoneIcon,
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const totalPatients = patients.length;
  const highAcuity = patients.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical').length;
  const todayFollowUps = patients.filter(p => {
    const next = p.caseInfo.nextFollowUp;
    const today = new Date().toISOString().split('T')[0];
    return next <= today;
  }).length;
  const activeAdmissions = patients.filter(p => p.admissions.some(a => !a.dischargeDate)).length;

  const stats = [
    { label: 'Active Patients', value: totalPatients, icon: UsersIcon, color: 'bg-primary-50 text-primary-600', trend: '+2 this week' },
    { label: 'High Risk', value: highAcuity, icon: ExclamationTriangleIcon, color: 'bg-danger-50 text-danger-500', trend: 'Needs attention' },
    { label: 'Due Follow-ups', value: todayFollowUps, icon: PhoneIcon, color: 'bg-warn-50 text-warn-500', trend: 'Today' },
    { label: 'Current Admissions', value: activeAdmissions, icon: ClipboardDocumentCheckIcon, color: 'bg-accent-50 text-accent-600', trend: 'Inpatient' },
  ];

  const upcomingTasks = [
    { patient: 'Test Two', task: 'Weekly HF monitoring call', due: 'Today', priority: 'high' },
    { patient: 'Test Five', task: 'SNF visit - progress review', due: 'Today', priority: 'high' },
    { patient: 'Test Six', task: 'Rehab team conference', due: 'Tomorrow', priority: 'medium' },
    { patient: 'Test One', task: 'Post-discharge follow-up call', due: 'Apr 10', priority: 'medium' },
    { patient: 'Test Three', task: 'CM follow-up call', due: 'Apr 11', priority: 'low' },
    { patient: 'Test Four', task: 'Pre-surgical coordination', due: 'Apr 13', priority: 'low' },
  ];

  const recentActivity = [
    { text: 'Progress note added for Test Two', time: '2 hours ago', type: 'note' },
    { text: 'Test Five - SNF visit completed', time: '5 hours ago', type: 'visit' },
    { text: 'Test Six - FIM score updated to 89', time: 'Yesterday', type: 'assessment' },
    { text: 'Test One - Follow-up call completed', time: 'Apr 5', type: 'call' },
    { text: 'Test Three - Nutritional referral placed', time: 'Apr 4', type: 'referral' },
  ];

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
                  task.due === 'Today' ? 'bg-danger-50 text-danger-600' : task.due === 'Tomorrow' ? 'bg-warn-50 text-warn-500' : 'bg-surface-alt text-text-secondary'
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
            {recentActivity.map((item, i) => (
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
