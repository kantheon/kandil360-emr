import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  XMarkIcon, MinusIcon, PhoneIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon,
  DocumentTextIcon, ChatBubbleLeftRightIcon, ClipboardDocumentCheckIcon,
  CheckCircleIcon, TrashIcon, HeartIcon, BeakerIcon, CalendarDaysIcon,
  BuildingOffice2Icon, FlagIcon, ShieldCheckIcon, ExclamationCircleIcon,
  UserGroupIcon, ShieldExclamationIcon, LockClosedIcon
} from '@heroicons/react/24/outline';
import { assessmentTemplates } from '../data/assessmentTemplates';
import AppointmentScheduler from './AppointmentScheduler';
import { carePlanLibrary } from '../data/carePlanLibrary';
import { addPatientEntry, getPatientEntries } from '../data/localStore';
import { getPatientContacts } from '../data/contactHelpers';
import { callSubjects } from '../data/callSubjects';
import { noteTypes } from '../data/noteTypes';
import { callOutcomes } from '../data/callOutcomes';
import SearchableDropdown from './SearchableDropdown';

/* ── Provider availability ── */
// Generate real date slots for next 2 weeks per provider
function generateSlots(dayTimes) {
  const slots = [];
  const today = new Date();
  for (let d = 1; d <= 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dow = date.getDay();
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    for (const [dayNum, time] of dayTimes) {
      if (dow === dayNum) {
        const dateStr = date.toISOString().split('T')[0];
        slots.push({ date: dateStr, time, label: `${dayNames[dow]} ${date.getMonth()+1}/${date.getDate()} @ ${time}` });
      }
    }
  }
  return slots;
}

const providerAvailability = [
  { provider: 'Dr. Sarah Chen', specialty: 'PCP', slots: generateSlots([[1,'9:00 AM'],[1,'2:00 PM'],[3,'10:00 AM'],[4,'11:00 AM'],[5,'9:00 AM']]) },
  { provider: 'Dr. Robert Patel', specialty: 'Pulmonology', slots: generateSlots([[2,'1:00 PM'],[4,'2:30 PM'],[5,'10:00 AM']]) },
  { provider: 'Dr. James Kim', specialty: 'Cardiology', slots: generateSlots([[1,'11:00 AM'],[3,'3:00 PM'],[4,'9:00 AM']]) },
  { provider: 'Dr. Elena Rivera', specialty: 'Oncology', slots: generateSlots([[2,'9:00 AM'],[3,'1:00 PM'],[5,'2:00 PM']]) },
  { provider: 'Dr. Amy Wong', specialty: 'PCP', slots: generateSlots([[1,'10:00 AM'],[2,'3:00 PM'],[4,'10:00 AM'],[5,'1:00 PM']]) },
  { provider: 'Dr. Raj Singh', specialty: 'Orthopedics', slots: generateSlots([[1,'8:00 AM'],[3,'9:00 AM'],[5,'11:00 AM']]) },
  { provider: 'CM Phone Assessment', specialty: 'Telehealth', slots: generateSlots([[1,'9:00 AM'],[2,'10:00 AM'],[3,'9:00 AM'],[4,'10:00 AM'],[5,'9:00 AM']]) },
];
const goalStatuses = ['Not Started','Initiated','In Progress','On Track','Met','Not Met','Deferred'];

/* ── Entry name helper ── */
function getEntryTitle(entry) {
  if (entry.type === 'note') return entry.data.noteTypeName || (entry.data.noteType || 'SOAP') + ' Note';
  if (entry.type === 'comm') return entry.data.subject || `${entry.data.direction || 'Outbound'} ${entry.data.method || 'Phone'} Call`;
  if (entry.type === 'assessment') {
    const t = assessmentTemplates.find(x => x.id === entry.data.templateId);
    return t ? t.name : 'Assessment';
  }
  if (entry.type === 'appointment') return entry.data.type || 'New Appointment';
  if (entry.type === 'goal') {
    const hc = entry.data.healthConcern;
    const desc = entry.data.description;
    if (hc && desc) return `${hc.slice(0,25)}${hc.length>25?'...':''} → ${desc.slice(0,25)}${desc.length>25?'...':''}`;
    if (hc) return hc.slice(0,50) + (hc.length>50?'...':'');
    if (desc) return desc.slice(0,50) + (desc.length>50?'...':'');
    return 'New Care Plan Entry';
  }
  return 'Entry';
}

/* ── Forms ── */
function NoteForm({ entry, onChange, disabled }) {
  const selectedType = noteTypes.find(t => t.id === entry.noteTypeId) || noteTypes[0];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {disabled ? (
          <div className="text-xs"><span className="text-text-muted">Type:</span> <span className="font-medium">{entry.noteTypeName || selectedType.name}</span></div>
        ) : (
          <SearchableDropdown label="Note Type" options={noteTypes.map(t=>t.name)} value={selectedType.name} onChange={v=>{const t=noteTypes.find(n=>n.name===v);if(t)onChange({...entry,noteTypeId:t.id,noteTypeName:t.name});}} placeholder="Search type..." small />
        )}
        <div>
          <label className="text-[10px] font-medium text-text-secondary mb-0.5 block">Method</label>
          <select disabled={disabled} value={entry.contactMethod||'Phone'} onChange={e=>onChange({...entry,contactMethod:e.target.value})} className="input-field py-1.5 text-xs disabled:opacity-60">
            <option>Phone</option><option>Video</option><option>In-Person</option><option>Email</option><option>Fax</option><option>Portal</option>
          </select>
        </div>
      </div>
      {selectedType.fields.map(f=>(
        <div key={f}>
          <label className="text-[11px] font-semibold text-text-secondary flex items-center gap-1 mb-0.5">
            <span className="w-4 h-4 bg-primary-100 text-primary-700 rounded text-[9px] font-bold flex items-center justify-center">{selectedType.labels[f][0]}</span>
            {selectedType.labels[f]}
          </label>
          <textarea disabled={disabled} className="textarea-field text-xs !min-h-[48px] disabled:opacity-60" rows={2} placeholder={selectedType.labels[f]+'...'} value={entry[f]||''} onChange={e=>onChange({...entry,[f]:e.target.value})} />
        </div>
      ))}
    </div>
  );
}

function CommForm({ entry, onChange, disabled, patient }) {
  const contacts = patient ? getPatientContacts(patient) : [];
  return (
    <div className="space-y-2">
      {/* Contact dropdown */}
      {!disabled ? (
        <div>
          <label className="text-[10px] font-medium text-text-secondary mb-0.5 block">Contact</label>
          <select className="input-field py-1.5 text-xs" onChange={e => {
            const c = contacts[e.target.value];
            if (c) onChange({...entry, contactPerson: c.name, calledNumber: c.phone || '', contactRole: c.role || 'Patient'});
          }}>
            <option value="">Select contact...</option>
            {contacts.map((c, i) => (
              <option key={i} value={i}>{c.name} ({c.role}){c.phone ? ` - ${c.phone}` : ''}</option>
            ))}
          </select>
          {entry.contactPerson && (
            <div className="flex gap-2 mt-1 text-[11px]">
              <span className="text-text-primary font-medium">{entry.contactPerson}</span>
              {entry.calledNumber && <span className="text-text-muted">{entry.calledNumber}</span>}
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs"><span className="text-text-muted">Contact:</span> <span className="font-medium">{entry.contactPerson} {entry.calledNumber && `(${entry.calledNumber})`}</span></div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <select disabled={disabled} value={entry.direction||'Outbound'} onChange={e=>onChange({...entry,direction:e.target.value})} className="input-field py-1.5 text-xs disabled:opacity-60"><option>Outbound</option><option>Inbound</option></select>
        <select disabled={disabled} value={entry.method||'Phone'} onChange={e=>onChange({...entry,method:e.target.value})} className="input-field py-1.5 text-xs disabled:opacity-60"><option>Phone</option><option>Fax</option><option>Email</option><option>In-Person</option></select>
      </div>
      <select disabled={disabled} value={entry.contactRole||'Patient'} onChange={e=>onChange({...entry,contactRole:e.target.value})} className="input-field py-1.5 text-xs disabled:opacity-60"><option>Patient</option><option>Family/Caregiver</option><option>PCP</option><option>Specialist</option><option>Insurance</option><option>Facility</option><option>Home Health</option><option>Pharmacy</option><option>Case Manager</option><option>Other</option></select>
      {disabled ? (
        <div className="text-xs"><span className="text-text-muted">Subject:</span> <span className="font-medium">{entry.subject || '-'}</span></div>
      ) : (
        <SearchableDropdown label="Call Type" options={callSubjects} value={entry.subject||''} onChange={v=>onChange({...entry,subject:v})} placeholder="Search call type..." small />
      )}
      <textarea disabled={disabled} className="textarea-field text-xs !min-h-[48px] disabled:opacity-60" rows={2} placeholder="Summary..." value={entry.summary||''} onChange={e=>onChange({...entry,summary:e.target.value})} />
      <div className="grid grid-cols-2 gap-2">
        {disabled ? (
          <div className="text-xs"><span className="text-text-muted">Outcome:</span> <span className="font-medium">{entry.outcome || '-'}</span></div>
        ) : (
          <SearchableDropdown label="Outcome" options={callOutcomes} value={entry.outcome||''} onChange={v=>onChange({...entry,outcome:v})} placeholder="Search outcome..." small />
        )}
        <input disabled={disabled} type="date" className="input-field py-1.5 text-xs disabled:opacity-60" value={entry.followUpDate||''} onChange={e=>onChange({...entry,followUpDate:e.target.value})} />
      </div>
    </div>
  );
}

function AssessmentForm({ entry, onChange, disabled }) {
  const template = assessmentTemplates.find(t=>t.id===entry.templateId);
  if(!template) return (
    <div className="space-y-1.5">{assessmentTemplates.map(t=>(
      <button key={t.id} onClick={()=>onChange({...entry,templateId:t.id,answers:{}})} disabled={disabled} className="w-full text-left p-2 rounded-lg border border-border-light hover:bg-primary-50 hover:border-primary-200 transition-all cursor-pointer disabled:opacity-60">
        <p className="text-xs font-semibold text-text-primary">{t.name}</p>
        <p className="text-[10px] text-text-muted">{t.category} &middot; {t.questions.length}q</p>
      </button>
    ))}</div>
  );
  const answers=entry.answers||{};
  const total=template.questions.reduce((s,q)=>s+(answers[q.id]??0),0);
  const allDone=template.questions.every(q=>answers[q.id]!==undefined);
  const range=template.scoring.method==='sum'?template.scoring.ranges.find(r=>total>=r.min&&total<=r.max):null;
  return (
    <div className="space-y-2">
      {!disabled && <button onClick={()=>onChange({...entry,templateId:null,answers:{}})} className="text-[10px] text-primary-600 cursor-pointer">&larr; Change type</button>}
      {template.questions.map((q,i)=>(
        <div key={q.id}>
          <label className="text-[10px] font-medium text-text-secondary">{i+1}. {q.text}</label>
          <select disabled={disabled} className="input-field py-1 text-xs mt-0.5 disabled:opacity-60" value={answers[q.id]??''} onChange={e=>onChange({...entry,answers:{...answers,[q.id]:Number(e.target.value)}})}>
            <option value="" disabled>Select...</option>
            {q.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      {allDone&&range&&(
        <div className={`p-2 rounded-lg text-xs font-bold text-center ${range.color==='green'?'bg-accent-100 text-accent-700':range.color==='red'?'bg-danger-100 text-danger-600':'bg-warn-100 text-[#92400e]'}`}>Score: {total} &mdash; {range.label}</div>
      )}
    </div>
  );
}

function AppointmentForm({ entry, onChange, disabled }) {
  if (disabled) {
    return (
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-text-muted">Type</span><span className="font-medium">{entry.type || '-'}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Provider</span><span className="font-medium">{entry.provider || '-'}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Date</span><span className="font-medium">{entry.date || '-'}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Time</span><span className="font-medium">{entry.time || '-'}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Duration</span><span className="font-medium">{entry.duration || '30 min'}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Location</span><span className="font-medium">{entry.location || '-'}</span></div>
      </div>
    );
  }
  return <AppointmentScheduler value={entry} onChange={onChange} disabled={disabled} />;
}

function GoalForm({ entry, onChange, disabled, patient }) {
  const existingGoals = patient?.carePlan?.goals || [];
  const selectedLib = carePlanLibrary.find(c => c.healthConcern === entry.healthConcern);
  const selectedGoal = selectedLib?.goals.find(g => g.description === entry.description);

  const handleConcernChange = (concern) => {
    const lib = carePlanLibrary.find(c => c.healthConcern === concern);
    onChange({ ...entry, healthConcern: concern, description: '', interventions: [''], status: 'Not Started', targetDate: '' });
  };

  const handleGoalSelect = (goalDesc) => {
    const lib = carePlanLibrary.find(c => c.healthConcern === entry.healthConcern);
    const goal = lib?.goals.find(g => g.description === goalDesc);
    onChange({ ...entry, description: goalDesc, interventions: goal ? [...goal.interventions] : [''], status: 'Not Started' });
  };

  return (
    <div className="space-y-3">
      {/* Existing goal toggle */}
      {!disabled && existingGoals.length > 0 && (
        <div className="flex gap-1.5">
          <button onClick={() => onChange({ ...entry, linkToExisting: false, existingGoalId: '' })}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${!entry.linkToExisting ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-border-light text-text-secondary hover:bg-surface-alt'}`}>
            New Entry
          </button>
          <button onClick={() => onChange({ ...entry, linkToExisting: true })}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${entry.linkToExisting ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-border-light text-text-secondary hover:bg-surface-alt'}`}>
            Add to Existing
          </button>
        </div>
      )}

      {/* Existing goal selector */}
      {entry.linkToExisting && !disabled && (
        <div>
          <label className="text-[10px] font-medium text-text-secondary mb-1 block">Select Existing Goal</label>
          <select className="input-field py-1.5 text-xs" value={entry.existingGoalId || ''} onChange={e => {
            const g = existingGoals.find(x => x.id === e.target.value);
            onChange({ ...entry, existingGoalId: e.target.value, healthConcern: g?.description || '' });
          }}>
            <option value="">Choose...</option>
            {existingGoals.map(g => <option key={g.id} value={g.id}>{g.description} ({g.status})</option>)}
          </select>
        </div>
      )}

      {/* Health Concern dropdown */}
      <div className="bg-surface-alt rounded-lg p-3 border border-border-light">
        <label className="text-[10px] font-semibold text-text-secondary mb-1 block flex items-center gap-1">
          <span className="w-4 h-4 bg-danger-100 text-danger-600 rounded text-[9px] font-bold flex items-center justify-center">H</span>
          Health Concern
        </label>
        {!disabled && !entry.linkToExisting ? (
          <>
            <select className="input-field py-1.5 text-xs mb-1.5" value={entry.healthConcern || ''} onChange={e => handleConcernChange(e.target.value)}>
              <option value="">Select health concern...</option>
              {carePlanLibrary.map(c => <option key={c.id} value={c.healthConcern}>{c.healthConcern}</option>)}
            </select>
            <input type="text" className="input-field py-1.5 text-xs" placeholder="Or type custom concern..." value={entry.healthConcern || ''} onChange={e => onChange({ ...entry, healthConcern: e.target.value })} />
          </>
        ) : (
          <input disabled={disabled} type="text" className="input-field py-1.5 text-xs disabled:opacity-60" value={entry.healthConcern || ''} onChange={e => onChange({ ...entry, healthConcern: e.target.value })} />
        )}
      </div>

      {/* Goal dropdown */}
      <div className="bg-surface-alt rounded-lg p-3 border border-border-light">
        <label className="text-[10px] font-semibold text-text-secondary mb-1 block flex items-center gap-1">
          <span className="w-4 h-4 bg-primary-100 text-primary-700 rounded text-[9px] font-bold flex items-center justify-center">G</span>
          Goal
        </label>
        {!disabled && selectedLib ? (
          <>
            <select className="input-field py-1.5 text-xs mb-1.5" value={entry.description || ''} onChange={e => handleGoalSelect(e.target.value)}>
              <option value="">Select goal...</option>
              {selectedLib.goals.map(g => <option key={g.id} value={g.description}>{g.description}</option>)}
            </select>
            <textarea className="textarea-field text-xs !min-h-[40px]" rows={2} placeholder="Or edit goal text..." value={entry.description || ''} onChange={e => onChange({ ...entry, description: e.target.value })} />
          </>
        ) : (
          <textarea disabled={disabled} className="textarea-field text-xs !min-h-[40px] disabled:opacity-60" rows={2} placeholder="Describe goal..." value={entry.description || ''} onChange={e => onChange({ ...entry, description: e.target.value })} />
        )}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <select disabled={disabled} className="input-field py-1.5 text-xs disabled:opacity-60" value={entry.status || 'Not Started'} onChange={e => onChange({ ...entry, status: e.target.value })}>
            {goalStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input disabled={disabled} type="date" className="input-field py-1.5 text-xs disabled:opacity-60" value={entry.targetDate || ''} onChange={e => onChange({ ...entry, targetDate: e.target.value })} />
        </div>
      </div>

      {/* Interventions */}
      <div className="bg-surface-alt rounded-lg p-3 border border-border-light">
        <label className="text-[10px] font-semibold text-text-secondary mb-1 block flex items-center gap-1">
          <span className="w-4 h-4 bg-accent-100 text-accent-700 rounded text-[9px] font-bold flex items-center justify-center">I</span>
          Interventions
        </label>
        <div className="space-y-2">
          {(entry.interventions || ['']).map((iv, idx) => (
            <div key={idx} className="flex gap-1.5">
              <input disabled={disabled} type="text" className="input-field py-1.5 text-xs disabled:opacity-60 flex-1" placeholder={`Intervention ${idx + 1}...`} value={iv} onChange={e => {
                const u = [...(entry.interventions || [''])]; u[idx] = e.target.value; onChange({ ...entry, interventions: u });
              }} />
              {!disabled && (entry.interventions || ['']).length > 1 && (
                <button onClick={() => { const u = [...(entry.interventions || [''])]; u.splice(idx, 1); onChange({ ...entry, interventions: u }); }} className="p-1 text-text-muted hover:text-danger-500 cursor-pointer"><TrashIcon className="w-3.5 h-3.5" /></button>
              )}
            </div>
          ))}
          {!disabled && (
            <button onClick={() => onChange({ ...entry, interventions: [...(entry.interventions || ['']), ''] })} className="text-[10px] text-primary-600 font-medium flex items-center gap-1 cursor-pointer hover:text-primary-700">
              <PlusIcon className="w-3 h-3" /> Add intervention
            </button>
          )}
        </div>
      </div>

      {/* Barriers */}
      <div>
        <label className="text-[10px] font-medium text-text-secondary mb-0.5 block">Barriers (optional)</label>
        <input disabled={disabled} type="text" className="input-field py-1.5 text-xs disabled:opacity-60" placeholder="e.g. Transportation, health literacy" value={entry.barriers || ''} onChange={e => onChange({ ...entry, barriers: e.target.value })} />
      </div>
    </div>
  );
}

/* ── Left panel card ── */
function InfoCard({ title, icon: Icon, children, count, action }) {
  return (
    <div className="card p-0 overflow-hidden flex flex-col" style={{ maxHeight: '320px' }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border-light shrink-0 bg-surface-alt">
        <div className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center shrink-0"><Icon className="w-3.5 h-3.5 text-primary-500" /></div>
        <span className="text-xs font-semibold text-text-primary flex-1">{title}</span>
        {count!==undefined&&<span className="text-[9px] font-bold text-text-muted bg-white px-1.5 py-0.5 rounded">{count}</span>}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">{children}</div>
      {action&&<div className="shrink-0 px-3 py-2 border-t border-border-light">{action}</div>}
    </div>
  );
}

/* ── Left Panel with tabs ── */
function CallModeLeftPanel({ patient, mergedAppointments, mergedGoals, addEntry }) {
  const [tab, setTab] = useState('overview');
  const [detailItem, setDetailItem] = useState(null);

  const leftTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'notes', label: 'Notes' },
    { id: 'comms', label: 'Comms' },
    { id: 'appts', label: 'Appts' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'careplan', label: 'Care Plan' },
    { id: 'auths', label: 'Auths' },
    { id: 'meds', label: 'Meds' },
  ];

  const getNoteFields = (note) => {
    const nt = noteTypes.find(t => t.name === note.type || t.id === note.typeId);
    if (nt) return nt.fields.filter(f => note[f]).map(f => ({ label: nt.labels[f], value: note[f] }));
    if (note.subjective) return [{ label: 'Subjective', value: note.subjective }, { label: 'Objective', value: note.objective }, { label: 'Assessment', value: note.assessment }, { label: 'Plan', value: note.plan }].filter(f => f.value);
    if (note.data) return [{ label: 'Data', value: note.data }, { label: 'Action', value: note.action }, { label: 'Response', value: note.response }].filter(f => f.value);
    return [];
  };

  return (
    <div className="flex-1 flex flex-col lg:border-r border-border-light overflow-hidden">
      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-1.5 px-3 pt-3 pb-2 shrink-0">
        {[['PCP', patient.pcp], ['Insurance', patient.insurance.plan.split(' - ')[0]], ['Program', patient.caseInfo.program], ['Acuity', patient.caseInfo.acuity]].map(([l, v]) => (
          <div key={l} className="bg-surface-alt rounded-lg px-2 py-1.5 text-center">
            <p className="text-[9px] text-text-muted font-medium uppercase">{l}</p>
            <p className={`text-[11px] font-semibold ${l === 'Acuity' && v === 'High' ? 'text-danger-500' : 'text-text-primary'} truncate`}>{v}</p>
          </div>
        ))}
      </div>

      {/* Tab bar - matching main chart style */}
      <div className="px-1.5 overflow-x-auto bg-surface-alt border-b border-border-light shrink-0" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-0.5 py-1">
          {leftTabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer transition-all ${tab === t.id ? 'bg-white text-primary-700 shadow-sm border border-border-light' : 'text-text-muted hover:bg-white/60 hover:text-text-primary border border-transparent'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="card p-3">
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Diagnoses</p>
              <div className="space-y-1.5">{patient.diagnoses.map((dx, i) => (
                <div key={i} className="flex items-start gap-2"><span className="badge badge-info text-[9px] shrink-0 mt-0.5">{dx.code}</span><div><p className="text-xs font-medium text-text-primary">{dx.description}</p><p className="text-[10px] text-text-muted">Since {dx.onsetDate}</p></div></div>
              ))}</div>
            </div>
            <div className="card p-3">
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Medications</p>
              <div className="space-y-1.5">{patient.medications.map((m, i) => (
                <div key={i} className="flex justify-between text-xs"><div><span className="font-medium text-text-primary">{m.name}</span> <span className="text-text-muted">{m.dose} {m.frequency}</span></div><span className="text-[10px] text-text-muted">{m.prescriber}</span></div>
              ))}</div>
            </div>
            <div className="card p-3">
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Insurance</p>
              <div className="space-y-1 text-xs">
                {[['Plan', patient.insurance.plan], ['Member ID', patient.insurance.memberId], ['Group', patient.insurance.groupNumber], ['Copay', patient.insurance.copay], ['Status', patient.insurance.status]].map(([l, v]) => (
                  <div key={l} className="flex justify-between"><span className="text-text-muted">{l}</span><span className={`font-medium ${l === 'Status' ? 'text-accent-600' : 'text-text-primary'}`}>{v}</span></div>
                ))}
              </div>
            </div>
            <div className="card p-3">
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Emergency Contact</p>
              <p className="text-xs font-semibold text-text-primary">{patient.emergencyContact.name}</p>
              <p className="text-xs text-text-muted">{patient.emergencyContact.relation} &middot; {patient.emergencyContact.phone}</p>
            </div>
          </div>
        )}

        {/* NOTES */}
        {tab === 'notes' && (
          <div className="space-y-2">
            {(patient.progressNotes || []).length === 0 && <p className="text-xs text-text-muted text-center py-4">No notes</p>}
            {(patient.progressNotes || []).map((note, i) => (
              <button key={note.id || i} onClick={() => setDetailItem({ type: 'note', data: note })} className="w-full text-left card p-3 hover:bg-surface-alt transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-info text-[9px]">{note.type || 'Note'}</span>
                  <span className="text-[10px] text-text-muted">{note.date} {note.time}</span>
                </div>
                <p className="text-xs text-text-secondary truncate">{note.subjective || note.data || note.narrative || note.callPurpose || Object.values(note).find(v => typeof v === 'string' && v.length > 20) || ''}</p>
              </button>
            ))}
          </div>
        )}

        {/* COMMS */}
        {tab === 'comms' && (
          <div className="space-y-2">
            {(patient.communications || []).length === 0 && <p className="text-xs text-text-muted text-center py-4">No communications</p>}
            {(patient.communications || []).map((comm, i) => (
              <button key={comm.id || i} onClick={() => setDetailItem({ type: 'comm', data: comm })} className="w-full text-left card p-3 hover:bg-surface-alt transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge text-[9px] ${comm.direction === 'Outbound' ? 'badge-info' : 'badge-active'}`}>{comm.direction}</span>
                  <span className="text-xs font-medium text-text-primary truncate flex-1">{comm.subject}</span>
                  <span className="text-[10px] text-text-muted">{comm.date}</span>
                </div>
                <p className="text-xs text-text-secondary truncate">{comm.summary}</p>
              </button>
            ))}
          </div>
        )}

        {/* APPOINTMENTS */}
        {tab === 'appts' && (
          <div className="space-y-2">
            <button onClick={() => addEntry('appointment')} className="text-xs text-primary-600 font-medium flex items-center gap-1 cursor-pointer hover:text-primary-700 mb-2"><PlusIcon className="w-3.5 h-3.5" />Schedule Appointment</button>
            {mergedAppointments.map((a, i) => {
              const d = a.date ? new Date(a.date + 'T00:00:00') : null;
              const valid = d && !isNaN(d.getTime());
              return (
                <div key={i} className="card p-3 flex items-center gap-3">
                  <div className="bg-primary-50 rounded-md p-1.5 text-center min-w-[40px]">
                    {valid ? (<><p className="text-[9px] text-primary-500 font-medium">{d.toLocaleDateString('en-US', { month: 'short' })}</p><p className="text-base font-bold text-primary-700 leading-tight">{d.getDate()}</p></>) : <p className="text-[10px] font-bold text-primary-700">TBD</p>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary">{a.type}</p>
                    <p className="text-[11px] text-text-muted">{a.provider}{a.time ? ` · ${a.time}` : ''}</p>
                  </div>
                  <span className="badge badge-active text-[9px]">{a.status}</span>
                </div>
              );
            })}
            {mergedAppointments.length === 0 && <p className="text-xs text-text-muted text-center py-4">No appointments</p>}
          </div>
        )}

        {/* ADMISSIONS */}
        {tab === 'admissions' && (
          <div className="space-y-2">
            {patient.admissions.map((a, i) => (
              <button key={i} onClick={() => setDetailItem({ type: 'admission', data: a })} className="w-full text-left card p-3 hover:bg-surface-alt transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-text-primary">{a.facility}</p>
                  {!a.dischargeDate && <span className="badge badge-critical text-[9px]">Current</span>}
                </div>
                <p className="text-[11px] text-text-muted">{a.admitDiagnosis}</p>
                <p className="text-[11px] text-text-muted">{a.admitDate}{a.dischargeDate ? ` → ${a.dischargeDate}` : ' → Present'}</p>
              </button>
            ))}
            {patient.admissions.length === 0 && <p className="text-xs text-text-muted text-center py-4">No admissions</p>}
          </div>
        )}

        {/* CARE PLAN */}
        {tab === 'careplan' && (
          <div className="space-y-2">
            <button onClick={() => addEntry('goal')} className="text-xs text-primary-600 font-medium flex items-center gap-1 cursor-pointer hover:text-primary-700 mb-2"><PlusIcon className="w-3.5 h-3.5" />Add Goal</button>
            {mergedGoals.map(g => (
              <button key={g.id} onClick={() => setDetailItem({ type: 'goal', data: g })} className="w-full text-left card p-3 hover:bg-surface-alt transition-colors cursor-pointer">
                {g.healthConcern && <p className="text-[10px] text-text-muted font-medium uppercase">{g.healthConcern}</p>}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-text-primary">{g.description}</p>
                  <span className={`badge text-[9px] shrink-0 ${g.status === 'Met' ? 'badge-active' : g.status === 'On Track' ? 'badge-info' : 'badge-warning'}`}>{g.status}</span>
                </div>
              </button>
            ))}
            {patient.carePlan.barriers.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border-light">
                <p className="text-[10px] font-semibold text-text-secondary mb-1">Barriers</p>
                {patient.carePlan.barriers.map((b, i) => <p key={i} className="text-[11px] text-text-muted flex items-start gap-1"><ExclamationCircleIcon className="w-3 h-3 text-warn-500 shrink-0 mt-0.5" />{b}</p>)}
              </div>
            )}
          </div>
        )}

        {/* AUTHS */}
        {tab === 'auths' && (
          <div className="space-y-2">
            {(patient.authorizations || []).map((auth, i) => (
              <button key={auth.id || i} onClick={() => setDetailItem({ type: 'auth', data: auth })} className="w-full text-left card p-3 hover:bg-surface-alt transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-text-primary">{auth.serviceType}</p>
                  <span className={`badge text-[9px] ${auth.status === 'Approved' ? 'badge-active' : auth.status === 'Denied' ? 'badge-critical' : 'badge-warning'}`}>{auth.status}</span>
                </div>
                <p className="text-[11px] text-text-muted">{auth.serviceRequested}</p>
                <p className="text-[11px] text-text-muted">Auth#: {auth.authNumber}</p>
              </button>
            ))}
            {(patient.authorizations || []).length === 0 && <p className="text-xs text-text-muted text-center py-4">No authorizations</p>}
          </div>
        )}

        {/* MEDS */}
        {tab === 'meds' && (
          <div className="space-y-2">
            {patient.medications.map((m, i) => (
              <div key={i} className="card p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-primary-600">Rx</span></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary">{m.name}</p>
                  <p className="text-[11px] text-text-muted">{m.dose} {m.frequency} · {m.prescriber}</p>
                </div>
                <span className="badge badge-active text-[9px]">{m.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailItem && createPortal(
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setDetailItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-light shrink-0">
              <h2 className="text-sm font-semibold text-text-primary">
                {detailItem.type === 'note' ? (detailItem.data.type || 'Note') :
                 detailItem.type === 'comm' ? 'Communication' :
                 detailItem.type === 'admission' ? 'Admission' :
                 detailItem.type === 'goal' ? 'Care Plan Goal' :
                 detailItem.type === 'auth' ? 'Authorization' : 'Details'}
              </h2>
              <button onClick={() => setDetailItem(null)} className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted cursor-pointer"><XMarkIcon className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {/* Note detail */}
              {detailItem.type === 'note' && (() => {
                const note = detailItem.data;
                const fields = getNoteFields(note);
                return (<>
                  <div className="flex items-center gap-2 text-xs text-text-muted"><span className="badge badge-info text-[9px]">{note.type}</span>{note.date} {note.time} · {note.author}</div>
                  {fields.map(f => (
                    <div key={f.label} className="bg-surface-alt rounded-lg p-3 border border-border-light">
                      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">{f.label}</p>
                      <p className="text-xs text-text-primary leading-relaxed">{f.value}</p>
                    </div>
                  ))}
                </>);
              })()}
              {/* Comm detail */}
              {detailItem.type === 'comm' && (() => {
                const c = detailItem.data;
                return (<>
                  <div className="flex items-center gap-2 text-xs"><span className={`badge text-[9px] ${c.direction === 'Outbound' ? 'badge-info' : 'badge-active'}`}>{c.direction}</span><span className="text-text-muted">{c.date} {c.time}</span></div>
                  <div className="bg-surface-alt rounded-lg p-3"><p className="text-[10px] text-text-muted uppercase font-semibold mb-1">Subject</p><p className="text-xs font-medium text-text-primary">{c.subject}</p></div>
                  <div className="bg-surface-alt rounded-lg p-3"><p className="text-[10px] text-text-muted uppercase font-semibold mb-1">Contact</p><p className="text-xs text-text-primary">{c.contactPerson} ({c.contactRole})</p></div>
                  <div className="bg-surface-alt rounded-lg p-3"><p className="text-[10px] text-text-muted uppercase font-semibold mb-1">Summary</p><p className="text-xs text-text-primary leading-relaxed">{c.summary}</p></div>
                  <div className="flex gap-3 text-xs"><span className="text-text-muted">Outcome:</span><span className="font-medium">{c.outcome}</span></div>
                  {c.followUpDate && <div className="flex gap-3 text-xs"><span className="text-text-muted">Follow-up:</span><span className="font-medium text-warn-500">{c.followUpDate}</span></div>}
                </>);
              })()}
              {/* Admission detail */}
              {detailItem.type === 'admission' && (() => {
                const a = detailItem.data;
                return (<>
                  <p className="text-sm font-semibold text-text-primary">{a.facility}</p>
                  {[['Type', a.facilityType], ['Admit Date', a.admitDate], ['Discharge', a.dischargeDate || 'Current'], ['Diagnosis', a.admitDiagnosis], ['Attending', a.attendingPhysician], ['Level of Care', a.levelOfCare], ['LOS', a.lengthOfStay ? `${a.lengthOfStay} days` : 'Ongoing'], ['Disposition', a.dischargeDisposition]].filter(([, v]) => v).map(([l, v]) => (
                    <div key={l} className="flex justify-between text-xs"><span className="text-text-muted">{l}</span><span className="font-medium text-text-primary">{v}</span></div>
                  ))}
                </>);
              })()}
              {/* Goal detail */}
              {detailItem.type === 'goal' && (() => {
                const g = detailItem.data;
                return (<>
                  {g.healthConcern && <div className="bg-danger-50 rounded-lg p-3 border border-danger-100"><p className="text-[10px] font-semibold text-danger-600 uppercase">Health Concern</p><p className="text-xs text-danger-700">{g.healthConcern}</p></div>}
                  <div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
                    <p className="text-[10px] font-semibold text-primary-600 uppercase">Goal</p>
                    <p className="text-xs text-primary-800">{g.description}</p>
                    <div className="flex gap-2 mt-1"><span className={`badge text-[9px] ${g.status === 'Met' ? 'badge-active' : 'badge-warning'}`}>{g.status}</span><span className="text-[10px] text-text-muted">Target: {g.targetDate || 'Not set'}</span></div>
                  </div>
                  {(g.interventions || []).length > 0 && (<div><p className="text-[10px] font-semibold text-text-secondary uppercase mb-1">Interventions</p>{g.interventions.map((iv, i) => <div key={i} className="flex items-start gap-2 bg-accent-50 rounded-lg p-2 mb-1 text-xs border border-accent-100"><span className="w-4 h-4 bg-accent-100 text-accent-700 rounded text-[9px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>{iv}</div>)}</div>)}
                </>);
              })()}
              {/* Auth detail */}
              {detailItem.type === 'auth' && (() => {
                const a = detailItem.data;
                return (<>
                  <div className="flex items-center justify-between"><p className="text-sm font-semibold text-text-primary">{a.serviceType}</p><span className={`badge ${a.status === 'Approved' ? 'badge-active' : a.status === 'Denied' ? 'badge-critical' : 'badge-warning'}`}>{a.status}</span></div>
                  {[['Auth #', a.authNumber], ['Service', a.serviceRequested], ['Diagnosis', a.diagnosisCode], ['Request Date', a.requestDate], ['Decision Date', a.decisionDate], ['Expiration', a.expirationDate], ['Priority', a.priority], ['Reviewer', a.reviewerName]].filter(([, v]) => v).map(([l, v]) => (
                    <div key={l} className="flex justify-between text-xs"><span className="text-text-muted">{l}</span><span className="font-medium text-text-primary">{v}</span></div>
                  ))}
                  {a.approvedUnits && <div className="flex justify-between text-xs"><span className="text-text-muted">Units</span><span className="font-medium">{a.usedUnits || 0} / {a.approvedUnits} used</span></div>}
                  {a.clinicalRationale && <div className="bg-surface-alt rounded-lg p-3"><p className="text-[10px] font-semibold text-text-secondary uppercase mb-1">Clinical Rationale</p><p className="text-xs text-text-primary">{a.clinicalRationale}</p></div>}
                </>);
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ── Previous entries card with proper collapsible items ── */
function PreviousEntriesCard({ title, icon: Icon, entries, renderHeader, renderPreview, renderBody }) {
  const [open, setOpen] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(null);
  return (
    <div className="card p-0 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-surface-alt transition-colors cursor-pointer text-left">
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-primary-500" /></div>
        <span className="text-sm font-semibold text-text-primary flex-1">{title}</span>
        {entries.length > 0 && <span className="text-[10px] font-bold text-text-muted bg-surface-alt px-2 py-0.5 rounded-md">{entries.length}</span>}
        {open ? <ChevronUpIcon className="w-4 h-4 text-text-muted" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted" />}
      </button>
      {open && (
        <div className="border-t border-border-light">
          {entries.length === 0 ? (
            <p className="text-xs text-text-muted px-4 py-3">None recorded</p>
          ) : (
            <div className="divide-y divide-border-light max-h-[350px] overflow-y-auto">
              {entries.map((entry, i) => {
                const isExpanded = expandedIdx === i;
                const preview = renderPreview(entry);
                return (
                  <div key={entry.id || i}>
                    <button onClick={() => setExpandedIdx(isExpanded ? null : i)} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-surface-alt transition-colors cursor-pointer text-left text-xs">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {renderHeader(entry)}
                      </div>
                      {isExpanded ? <ChevronUpIcon className="w-3.5 h-3.5 text-text-muted shrink-0" /> : <ChevronDownIcon className="w-3.5 h-3.5 text-text-muted shrink-0" />}
                    </button>
                    {!isExpanded && preview && (
                      <div className="px-4 pb-2 -mt-1">
                        <p className="text-[11px] text-text-muted truncate">{preview}...</p>
                      </div>
                    )}
                    {isExpanded && (
                      <div className="px-4 pb-3 animate-fade-in">
                        {renderBody(entry)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Entry type config ── */
const typeConfig = {
  note:{label:'Progress Notes',icon:DocumentTextIcon,color:'bg-primary-100',iconColor:'text-primary-600'},
  comm:{label:'Communications',icon:ChatBubbleLeftRightIcon,color:'bg-accent-100',iconColor:'text-accent-600'},
  assessment:{label:'Assessments',icon:ClipboardDocumentCheckIcon,color:'bg-warn-100',iconColor:'text-warn-600'},
  appointment:{label:'Appointments',icon:CalendarDaysIcon,color:'bg-primary-100',iconColor:'text-primary-600'},
  goal:{label:'Care Plan Goals',icon:FlagIcon,color:'bg-accent-100',iconColor:'text-accent-600'},
};

/* ── Main ── */
export default function CallMode({ patient, onClose, minimized, onToggleMinimize }) {
  const [entries,setEntries] = useState([]);
  const [expandedEntries,setExpandedEntries] = useState(new Set());
  const [showAddMenu,setShowAddMenu] = useState(false);
  const [saveCount,setSaveCount] = useState(0);

  useEffect(()=>{
    if(!minimized){document.body.style.overflow='hidden';}else{document.body.style.overflow='';}
    return ()=>{document.body.style.overflow='';};
  },[minimized]);

  // Merge seed data with localStorage so left panel updates on save
  const localAppts = getPatientEntries(patient.id, 'appointments');
  const localGoals = getPatientEntries(patient.id, 'carePlanGoals');
  const mergedAppointments = [
    ...patient.appointments,
    ...localAppts.map(a => ({ date: a.date || null, time: a.time || '', provider: a.provider || '', type: a.type || 'Appointment', location: a.location || '', status: 'Scheduled' }))
  ].sort((a, b) => {
    const da = a.date || '9999'; const db = b.date || '9999';
    if (da !== db) return da.localeCompare(db);
    return (a.time || '').localeCompare(b.time || '');
  });
  const mergedGoals = [
    ...patient.carePlan.goals,
    ...localGoals.map((g,i) => ({ id: `local-g-${i}`, description: g.description || g.healthConcern || 'New Goal', status: g.status || 'Not Started', targetDate: g.targetDate || '' }))
  ];
  // Force re-read on save by depending on saveCount
  void saveCount;

  const addEntry=(type)=>{const id=Date.now();setEntries(p=>[...p,{id,type,data:{},saved:false}]);setExpandedEntries(p=>new Set([...p,id]));setShowAddMenu(false);};
  const updateEntry=(id,data)=>setEntries(p=>p.map(e=>e.id===id?{...e,data}:e));
  const removeEntry=(id)=>{setEntries(p=>p.filter(e=>e.id!==id));};
  const saveEntry=(id)=>{
    const entry = entries.find(e=>e.id===id);
    if(entry) {
      const typeMap = { note:'progressNotes', comm:'communications', assessment:'assessments', appointment:'appointments', goal:'carePlanGoals' };
      let dataToSave = { ...entry.data };
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Enrich note data with type/date/author
      if (entry.type === 'note') {
        const nt = noteTypes.find(t => t.id === dataToSave.noteTypeId);
        dataToSave.type = dataToSave.noteTypeName || nt?.name || 'Progress Note';
        dataToSave.typeId = dataToSave.noteTypeId || 'soap';
        dataToSave.format = nt?.format || 'SOAP';
        dataToSave.date = today;
        dataToSave.time = timeNow;
        dataToSave.author = 'Current User';
      }

      // Enrich comm data
      if (entry.type === 'comm') {
        dataToSave.date = today;
        dataToSave.time = timeNow;
        dataToSave.followUpNeeded = !!dataToSave.followUpDate;
      }

      // Enrich assessment data so it is compatible with AssessmentsTab edit flow
      if (entry.type === 'assessment' && dataToSave.templateId) {
        const tpl = assessmentTemplates.find(t => t.id === dataToSave.templateId);
        if (tpl) {
          const answers = dataToSave.answers || {};
          const total = tpl.questions.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
          const allDone = tpl.questions.every(q => answers[q.id] !== undefined);
          const range = tpl.scoring.method === 'sum' ? tpl.scoring.ranges.find(r => total >= r.min && total <= r.max) : null;
          dataToSave = {
            ...dataToSave,
            templateName: tpl.name,
            score: total,
            result: range ? range.label : (allDone ? 'See sections' : 'Incomplete'),
            type: tpl.name,
            date: today,
            author: 'Current User',
            status: allDone ? 'Completed' : 'In Progress',
            summary: `${tpl.name}: Score ${total}${range ? ' - ' + range.label : ''}`,
            phq2Score: null, fallRisk: null, painLevel: null,
            cognitiveStatus: null, functionalStatus: null, sdoh: null,
          };
        }
      }
      addPatientEntry(patient.id, typeMap[entry.type] || entry.type, dataToSave);
    }
    setEntries(p=>p.map(e=>e.id===id?{...e,saved:true,savedAt:new Date().toLocaleTimeString()}:e));
    setExpandedEntries(p=>{const n=new Set(p);n.delete(id);return n;});
    setSaveCount(c=>c+1);
  };
  const toggleEntry=(id)=>setExpandedEntries(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});

  // Group all entries (active + saved) by type
  const grouped={};
  for(const e of entries){if(!grouped[e.type])grouped[e.type]=[];grouped[e.type].push(e);}

  if(minimized){
    return(
      <button onClick={onToggleMinimize} className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-700 rounded-full shadow-lg shadow-accent-500/30 flex items-center justify-center text-white hover:shadow-xl hover:scale-105 transition-all cursor-pointer animate-fade-in" title="Resume Call Mode">
        <PhoneIcon className="w-6 h-6" />
        {entries.filter(e=>!e.saved).length>0&&<span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{entries.filter(e=>!e.saved).length}</span>}
      </button>
    );
  }

  return(
    <div className="fixed inset-0 z-[90] bg-[#f0f4f8] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-2.5 bg-gradient-to-r from-accent-600 to-accent-700 text-white shrink-0">
        <PhoneIcon className="w-5 h-5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold leading-tight truncate">Call Mode &mdash; {patient.lastName}, {patient.firstName}</p>
          <p className="text-[10px] sm:text-[11px] opacity-80 truncate">{patient.id} &middot; {patient.mrn} &middot; {patient.age}y {patient.sex[0]}</p>
        </div>
        <button onClick={onToggleMinimize} className="p-1.5 rounded-lg hover:bg-white/20 cursor-pointer" title="Minimize"><MinusIcon className="w-4 h-4" /></button>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 cursor-pointer" title="End"><XMarkIcon className="w-4 h-4" /></button>
      </div>

      {/* Phone bar */}
      <div className="flex items-center gap-2 px-3 sm:px-4 lg:px-6 py-1.5 bg-white border-b border-border-light shrink-0 overflow-x-auto flex-wrap sm:flex-nowrap" style={{ WebkitOverflowScrolling: 'touch' }}>
        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider shrink-0">Dial:</span>
        <a href={`tel:${patient.phone}`} className="flex items-center gap-1.5 bg-accent-50 text-accent-700 px-2.5 py-1 rounded-lg text-[11px] font-medium hover:bg-accent-100 transition-colors shrink-0">
          <PhoneIcon className="w-3 h-3" />Patient {patient.phone}
        </a>
        <a href={`tel:${patient.emergencyContact.phone}`} className="flex items-center gap-1.5 bg-warn-50 text-[#92400e] px-2.5 py-1 rounded-lg text-[11px] font-medium hover:bg-warn-100 transition-colors shrink-0">
          <PhoneIcon className="w-3 h-3" />{patient.emergencyContact.name} {patient.emergencyContact.phone}
        </a>
        <div className="flex items-center gap-1.5 bg-primary-50 text-primary-700 px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0">
          <PhoneIcon className="w-3 h-3" />PCP: {patient.pcp}
        </div>
      </div>

      {/* Allergy bar */}
      {patient.allergies.length>0&&(
        <div className="bg-danger-50 border-b border-danger-100 px-4 lg:px-6 py-1 flex items-center gap-2 shrink-0">
          <ShieldExclamationIcon className="w-3.5 h-3.5 text-danger-500 shrink-0" />
          <span className="text-[11px] font-bold text-danger-600">ALLERGIES:</span>
          <span className="text-[11px] text-danger-600">{patient.allergies.map(a=>`${a.allergen} (${a.reaction})`).join(' | ')}</span>
        </div>
      )}

      {/* Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT - Tabbed patient view */}
        <CallModeLeftPanel patient={patient} mergedAppointments={mergedAppointments} mergedGoals={mergedGoals} addEntry={addEntry} />

        {/* RIGHT - Documentation */}
        <div className="w-full lg:w-[440px] flex flex-col bg-white shrink-0 min-h-[40vh] lg:min-h-0 border-t lg:border-t-0">
          {/* Header with + button */}
          <div className="px-4 py-2.5 bg-surface-alt border-b border-border-light shrink-0 flex items-center justify-between">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Documentation</p>
            <div className="relative">
              <button onClick={()=>setShowAddMenu(!showAddMenu)} className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer shadow-sm">
                <PlusIcon className="w-4 h-4" />
              </button>
              {showAddMenu&&(
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-border-light p-1.5 z-10 animate-fade-in">
                  {[{id:'note',label:'Progress Note',icon:DocumentTextIcon},{id:'comm',label:'Communication',icon:ChatBubbleLeftRightIcon},{id:'assessment',label:'Assessment',icon:ClipboardDocumentCheckIcon},{id:'appointment',label:'Appointment',icon:CalendarDaysIcon},{id:'goal',label:'Care Plan Goal',icon:FlagIcon}].map(t=>(
                    <button key={t.id} onClick={()=>addEntry(t.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors cursor-pointer text-left">
                      <t.icon className="w-4 h-4 text-text-muted" /><span className="text-xs font-medium text-text-primary">{t.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Entries */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {Object.entries(typeConfig).map(([type,cfg])=>{
              const items=grouped[type];
              if(!items||items.length===0) return null;
              const Icon=cfg.icon;
              return(
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${cfg.color}`}><Icon className={`w-3 h-3 ${cfg.iconColor}`} /></div>
                    <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">{cfg.label}</p>
                    <span className="text-[10px] font-bold text-text-muted bg-surface-alt px-1.5 py-0.5 rounded">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(entry=>{
                      const isOpen=expandedEntries.has(entry.id);
                      const title=getEntryTitle(entry);
                      return(
                        <div key={entry.id} className={`border rounded-lg overflow-hidden ${entry.saved?'border-accent-200 bg-accent-50/30':'border-border-light'}`}>
                          <button onClick={()=>toggleEntry(entry.id)} className={`w-full flex items-center gap-2 px-3 py-2 transition-colors cursor-pointer text-left ${entry.saved?'bg-accent-50 hover:bg-accent-100/50':'bg-surface-alt hover:bg-surface-hover'}`}>
                            {entry.saved&&<LockClosedIcon className="w-3 h-3 text-accent-600 shrink-0" />}
                            <span className={`text-[11px] font-medium flex-1 ${entry.saved?'text-accent-700':'text-text-primary'}`}>
                              {title}
                              {entry.saved&&<span className="text-[10px] text-accent-500 ml-2">saved {entry.savedAt}</span>}
                            </span>
                            {!entry.saved&&<button onClick={e=>{e.stopPropagation();removeEntry(entry.id);}} className="p-0.5 rounded hover:bg-danger-50 text-text-muted hover:text-danger-500 cursor-pointer"><TrashIcon className="w-3 h-3" /></button>}
                            {isOpen?<ChevronUpIcon className="w-3 h-3 text-text-muted" />:<ChevronDownIcon className="w-3 h-3 text-text-muted" />}
                          </button>
                          {isOpen&&(
                            <div className="px-3 pb-3 pt-2 border-t border-border-light bg-white">
                              {entry.type==='note'&&<NoteForm entry={entry.data} onChange={d=>updateEntry(entry.id,d)} disabled={entry.saved} />}
                              {entry.type==='comm'&&<CommForm entry={entry.data} onChange={d=>updateEntry(entry.id,d)} disabled={entry.saved} patient={patient} />}
                              {entry.type==='assessment'&&<AssessmentForm entry={entry.data} onChange={d=>updateEntry(entry.id,d)} disabled={entry.saved} />}
                              {entry.type==='appointment'&&<AppointmentForm entry={entry.data} onChange={d=>updateEntry(entry.id,d)} disabled={entry.saved} />}
                              {entry.type==='goal'&&<GoalForm entry={entry.data} onChange={d=>updateEntry(entry.id,d)} disabled={entry.saved} patient={patient} />}
                              {!entry.saved&&<button onClick={()=>saveEntry(entry.id)} className="btn-primary w-full py-1.5 text-xs mt-2 flex items-center justify-center gap-1"><CheckCircleIcon className="w-3.5 h-3.5" />Save</button>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {entries.length===0&&(
              <div className="text-center py-10">
                <DocumentTextIcon className="w-10 h-10 text-text-muted/20 mx-auto mb-2" />
                <p className="text-xs text-text-muted">Click + to add documentation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
