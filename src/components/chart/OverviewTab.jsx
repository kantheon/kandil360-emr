import { useState } from 'react';
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
  ClockIcon,
  PencilSquareIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import { useData } from '../../contexts/DataContext';

export default function OverviewTab({ patient }) {
  const { addEntry } = useData();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
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

      {/* Patient Info */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-surface-alt border-b border-border-light">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-primary-500" />
            <h3 className="text-sm font-semibold text-text-primary">Patient Information</h3>
          </div>
          <button onClick={() => { setEditForm({ phone: patient.phone, email: patient.email || '', address: patient.address, language: patient.language, ecName: patient.emergencyContact.name, ecRelation: patient.emergencyContact.relation, ecPhone: patient.emergencyContact.phone }); setShowEditModal(true); }} className="text-xs text-primary-600 font-medium flex items-center gap-1 cursor-pointer hover:text-primary-700">
            <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><PhoneIcon className="w-4 h-4 text-primary-500" /></div>
            <div><p className="text-[10px] text-text-muted">Phone</p><p className="text-xs font-semibold text-text-primary">{patient.phone}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><EnvelopeIcon className="w-4 h-4 text-primary-500" /></div>
            <div><p className="text-[10px] text-text-muted">Email</p><p className="text-xs font-semibold text-text-primary">{patient.email || 'N/A'}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><MapPinIcon className="w-4 h-4 text-primary-500" /></div>
            <div><p className="text-[10px] text-text-muted">Address</p><p className="text-xs font-semibold text-text-primary">{patient.address}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-accent-600">Lx</span></div>
            <div><p className="text-[10px] text-text-muted">Language</p><p className="text-xs font-semibold text-text-primary">{patient.language}</p></div>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <div className="w-8 h-8 rounded-lg bg-warn-50 flex items-center justify-center shrink-0"><UserGroupIcon className="w-4 h-4 text-warn-500" /></div>
            <div><p className="text-[10px] text-text-muted">Emergency Contact</p><p className="text-xs font-semibold text-text-primary">{patient.emergencyContact.name} ({patient.emergencyContact.relation}) &middot; {patient.emergencyContact.phone}</p></div>
          </div>
        </div>
      </div>

      {/* Edit Patient Info Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Patient Information" footer={
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowEditModal(false)} className="btn-secondary py-2 text-xs">Cancel</button>
          <button onClick={() => {
            addEntry(patient.id, 'patientUpdates', { ...editForm, date: new Date().toISOString(), author: 'Current User' });
            setShowEditModal(false);
          }} className="btn-primary py-2 text-xs">Save Changes</button>
        </div>
      }>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-text-secondary mb-1 block">Phone</label><input type="tel" className="input-field py-2 text-xs" value={editForm.phone || ''} onChange={e => setEditForm(p => ({...p, phone: e.target.value}))} /></div>
            <div><label className="text-xs font-medium text-text-secondary mb-1 block">Email</label><input type="email" className="input-field py-2 text-xs" value={editForm.email || ''} onChange={e => setEditForm(p => ({...p, email: e.target.value}))} /></div>
          </div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Address</label><input type="text" className="input-field py-2 text-xs" value={editForm.address || ''} onChange={e => setEditForm(p => ({...p, address: e.target.value}))} /></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Language</label><input type="text" className="input-field py-2 text-xs" value={editForm.language || ''} onChange={e => setEditForm(p => ({...p, language: e.target.value}))} /></div>
          <div className="border-t border-border-light pt-3 mt-3">
            <p className="text-xs font-semibold text-text-primary mb-2">Emergency Contact</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-text-secondary mb-1 block">Name</label><input type="text" className="input-field py-2 text-xs" value={editForm.ecName || ''} onChange={e => setEditForm(p => ({...p, ecName: e.target.value}))} /></div>
              <div><label className="text-xs font-medium text-text-secondary mb-1 block">Relation</label><input type="text" className="input-field py-2 text-xs" value={editForm.ecRelation || ''} onChange={e => setEditForm(p => ({...p, ecRelation: e.target.value}))} /></div>
              <div><label className="text-xs font-medium text-text-secondary mb-1 block">Phone</label><input type="tel" className="input-field py-2 text-xs" value={editForm.ecPhone || ''} onChange={e => setEditForm(p => ({...p, ecPhone: e.target.value}))} /></div>
            </div>
          </div>
        </div>
      </Modal>

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
