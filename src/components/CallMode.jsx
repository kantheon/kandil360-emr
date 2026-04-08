import { useState, useEffect } from 'react';
import {
  XMarkIcon, MinusIcon, PhoneIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon,
  DocumentTextIcon, ChatBubbleLeftRightIcon, ClipboardDocumentCheckIcon,
  CheckCircleIcon, TrashIcon, HeartIcon, BeakerIcon, CalendarDaysIcon,
  BuildingOffice2Icon, FlagIcon, ShieldCheckIcon, ExclamationCircleIcon,
  UserGroupIcon, ShieldExclamationIcon, LockClosedIcon
} from '@heroicons/react/24/outline';
import { assessmentTemplates } from '../data/assessmentTemplates';
import { carePlanLibrary } from '../data/carePlanLibrary';
import { addPatientEntry, getPatientEntries } from '../data/localStore';

/* ── Provider availability ── */
const providerAvailability = [
  { provider: 'Dr. Sarah Chen', specialty: 'PCP', slots: ['Mon 9:00 AM','Mon 2:00 PM','Wed 10:00 AM','Thu 11:00 AM','Fri 9:00 AM'] },
  { provider: 'Dr. Robert Patel', specialty: 'Pulmonology', slots: ['Tue 1:00 PM','Thu 2:30 PM','Fri 10:00 AM'] },
  { provider: 'Dr. James Kim', specialty: 'Cardiology', slots: ['Mon 11:00 AM','Wed 3:00 PM','Thu 9:00 AM'] },
  { provider: 'Dr. Elena Rivera', specialty: 'Oncology', slots: ['Tue 9:00 AM','Wed 1:00 PM','Fri 2:00 PM'] },
  { provider: 'Dr. Amy Wong', specialty: 'PCP', slots: ['Mon 10:00 AM','Tue 3:00 PM','Thu 10:00 AM','Fri 1:00 PM'] },
  { provider: 'Dr. Raj Singh', specialty: 'Orthopedics', slots: ['Mon 8:00 AM','Wed 9:00 AM','Fri 11:00 AM'] },
  { provider: 'CM Phone Assessment', specialty: 'Telehealth', slots: ['Mon-Fri flexible'] },
];
const goalStatuses = ['Not Started','Initiated','In Progress','On Track','Met','Not Met','Deferred'];

/* ── Entry name helper ── */
function getEntryTitle(entry) {
  if (entry.type === 'note') return (entry.data.noteType || 'SOAP') + ' Note' + (entry.data.contactMethod ? ` (${entry.data.contactMethod})` : '');
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
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <select disabled={disabled} value={entry.noteType||'SOAP'} onChange={e=>onChange({...entry,noteType:e.target.value})} className="input-field py-1.5 text-xs disabled:opacity-60"><option value="SOAP">SOAP</option><option value="DAR">DAR</option></select>
        <select disabled={disabled} value={entry.contactMethod||'Phone'} onChange={e=>onChange({...entry,contactMethod:e.target.value})} className="input-field py-1.5 text-xs disabled:opacity-60"><option>Phone</option><option>Video</option><option>In-Person</option></select>
      </div>
      {((entry.noteType||'SOAP')==='SOAP'?['Subjective','Objective','Assessment','Plan']:['Data','Action','Response']).map(f=>(
        <div key={f}>
          <label className="text-[11px] font-semibold text-text-secondary flex items-center gap-1 mb-0.5">
            <span className={`w-4 h-4 ${(entry.noteType||'SOAP')==='SOAP'?'bg-primary-100 text-primary-700':'bg-accent-100 text-accent-700'} rounded text-[9px] font-bold flex items-center justify-center`}>{f[0]}</span>{f}
          </label>
          <textarea disabled={disabled} className="textarea-field text-xs !min-h-[48px] disabled:opacity-60" rows={2} placeholder={f+'...'} value={entry[f.toLowerCase()]||''} onChange={e=>onChange({...entry,[f.toLowerCase()]:e.target.value})} />
        </div>
      ))}
    </div>
  );
}

function CommForm({ entry, onChange, disabled }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <select disabled={disabled} value={entry.direction||'Outbound'} onChange={e=>onChange({...entry,direction:e.target.value})} className="input-field py-1.5 text-xs disabled:opacity-60"><option>Outbound</option><option>Inbound</option></select>
        <select disabled={disabled} value={entry.method||'Phone'} onChange={e=>onChange({...entry,method:e.target.value})} className="input-field py-1.5 text-xs disabled:opacity-60"><option>Phone</option><option>Fax</option><option>Email</option><option>In-Person</option></select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input disabled={disabled} type="text" className="input-field py-1.5 text-xs disabled:opacity-60" placeholder="Contact person" value={entry.contactPerson||''} onChange={e=>onChange({...entry,contactPerson:e.target.value})} />
        <select disabled={disabled} value={entry.contactRole||'Patient'} onChange={e=>onChange({...entry,contactRole:e.target.value})} className="input-field py-1.5 text-xs disabled:opacity-60"><option>Patient</option><option>Family/Caregiver</option><option>PCP</option><option>Specialist</option><option>Insurance</option><option>Facility</option></select>
      </div>
      <input disabled={disabled} type="text" className="input-field py-1.5 text-xs disabled:opacity-60" placeholder="Subject" value={entry.subject||''} onChange={e=>onChange({...entry,subject:e.target.value})} />
      <textarea disabled={disabled} className="textarea-field text-xs !min-h-[48px] disabled:opacity-60" rows={2} placeholder="Summary..." value={entry.summary||''} onChange={e=>onChange({...entry,summary:e.target.value})} />
      <div className="grid grid-cols-2 gap-2">
        <input disabled={disabled} type="text" className="input-field py-1.5 text-xs disabled:opacity-60" placeholder="Outcome" value={entry.outcome||''} onChange={e=>onChange({...entry,outcome:e.target.value})} />
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
  const selected = providerAvailability.find(p=>p.provider===entry.provider);
  return (
    <div className="space-y-2">
      <div>
        <label className="text-[10px] font-medium text-text-secondary mb-0.5 block">Appointment Type</label>
        <input disabled={disabled} type="text" className="input-field py-1.5 text-xs disabled:opacity-60" placeholder="e.g. PCP Follow-up, Cardiology" value={entry.type||''} onChange={e=>onChange({...entry,type:e.target.value})} />
      </div>
      <div>
        <label className="text-[10px] font-medium text-text-secondary mb-0.5 block">Provider</label>
        <select disabled={disabled} className="input-field py-1.5 text-xs disabled:opacity-60" value={entry.provider||''} onChange={e=>onChange({...entry,provider:e.target.value,slot:''})}>
          <option value="">Select provider...</option>
          {providerAvailability.map(p=><option key={p.provider} value={p.provider}>{p.provider} ({p.specialty})</option>)}
        </select>
      </div>
      {selected && (
        <div>
          <label className="text-[10px] font-medium text-text-secondary mb-1 block">Available Slots</label>
          <div className="flex flex-wrap gap-1.5">
            {selected.slots.map(s=>(
              <button key={s} disabled={disabled} onClick={()=>onChange({...entry,slot:s})}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer disabled:opacity-60 ${entry.slot===s?'bg-primary-50 border-primary-300 text-primary-700':'border-border-light text-text-secondary hover:bg-surface-alt'}`}>{s}</button>
            ))}
          </div>
        </div>
      )}
      <div>
        <label className="text-[10px] font-medium text-text-secondary mb-0.5 block">Location</label>
        <input disabled={disabled} type="text" className="input-field py-1.5 text-xs disabled:opacity-60" placeholder="Clinic / Telehealth" value={entry.location||''} onChange={e=>onChange({...entry,location:e.target.value})} />
      </div>
    </div>
  );
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
function InfoCard({ title, icon: Icon, children, count, defaultOpen=false, action }) {
  const [open,setOpen] = useState(defaultOpen);
  return (
    <div className="card p-0 overflow-hidden">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-surface-alt transition-colors cursor-pointer text-left">
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-primary-500" /></div>
        <span className="text-sm font-semibold text-text-primary flex-1">{title}</span>
        {count!==undefined&&<span className="text-[10px] font-bold text-text-muted bg-surface-alt px-2 py-0.5 rounded-md">{count}</span>}
        {open?<ChevronUpIcon className="w-4 h-4 text-text-muted" />:<ChevronDownIcon className="w-4 h-4 text-text-muted" />}
      </button>
      {open&&<div className="px-4 pb-3 border-t border-border-light pt-3">{children}{action&&<div className="mt-2 pt-2 border-t border-border-light">{action}</div>}</div>}
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
    ...localAppts.map(a => ({ date: a.slot?.split(' ')[0] || 'TBD', time: a.slot?.split(' ').slice(1).join(' ') || 'TBD', provider: a.provider || '', type: a.type || 'Appointment', location: a.location || '', status: 'Scheduled' }))
  ];
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
      addPatientEntry(patient.id, typeMap[entry.type] || entry.type, entry.data);
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
      <div className="flex items-center gap-3 px-4 lg:px-6 py-2.5 bg-gradient-to-r from-accent-600 to-accent-700 text-white shrink-0">
        <PhoneIcon className="w-5 h-5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight">Call Mode &mdash; {patient.lastName}, {patient.firstName}</p>
          <p className="text-[11px] opacity-80">{patient.id} &middot; {patient.mrn} &middot; {patient.age}y {patient.sex[0]}</p>
        </div>
        <button onClick={onToggleMinimize} className="p-1.5 rounded-lg hover:bg-white/20 cursor-pointer" title="Minimize"><MinusIcon className="w-4 h-4" /></button>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 cursor-pointer" title="End"><XMarkIcon className="w-4 h-4" /></button>
      </div>

      {/* Phone bar */}
      <div className="flex items-center gap-2 px-4 lg:px-6 py-1.5 bg-white border-b border-border-light shrink-0 overflow-x-auto">
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
        {/* LEFT */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-3 lg:border-r border-border-light">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[['PCP',patient.pcp],['Insurance',patient.insurance.plan.split(' - ')[0]],['Program',patient.caseInfo.program],['Acuity',patient.caseInfo.acuity]].map(([l,v])=>(
              <div key={l} className="card px-4 py-3">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{l}</p>
                <p className={`text-xs font-semibold mt-0.5 ${l==='Acuity'&&v==='High'?'text-danger-500':'text-text-primary'}`}>{v}</p>
              </div>
            ))}
          </div>

          <InfoCard title="Diagnoses" icon={HeartIcon} count={patient.diagnoses.length} defaultOpen>
            <div className="space-y-1.5">{patient.diagnoses.map((dx,i)=>(
              <div key={i} className="flex items-start gap-2">
                <span className="badge badge-info text-[9px] shrink-0 mt-0.5">{dx.code}</span>
                <div><p className="text-xs font-medium text-text-primary">{dx.description}</p><p className="text-[10px] text-text-muted">Since {dx.onsetDate}</p></div>
              </div>
            ))}</div>
          </InfoCard>

          <InfoCard title="Medications" icon={BeakerIcon} count={patient.medications.length}>
            <div className="space-y-1.5">{patient.medications.map((m,i)=>(
              <div key={i} className="flex items-center justify-between text-xs">
                <div><span className="font-medium text-text-primary">{m.name}</span> <span className="text-text-muted">{m.dose} {m.frequency}</span></div>
                <span className="text-[10px] text-text-muted">{m.prescriber}</span>
              </div>
            ))}</div>
          </InfoCard>

          <InfoCard title="Appointments" icon={CalendarDaysIcon} count={mergedAppointments.length} defaultOpen
            action={<button onClick={()=>addEntry('appointment')} className="text-xs text-primary-600 font-medium flex items-center gap-1 cursor-pointer hover:text-primary-700"><PlusIcon className="w-3.5 h-3.5" />Schedule Appointment</button>}>
            <div className="space-y-2">{mergedAppointments.map((a,i)=>(
              <div key={i} className="flex items-center gap-3 bg-surface-alt rounded-lg p-2.5">
                <div className="bg-primary-50 rounded-md p-1.5 text-center min-w-[40px]">
                  <p className="text-[9px] text-primary-500 font-medium">{new Date(a.date+'T00:00:00').toLocaleDateString('en-US',{month:'short'})}</p>
                  <p className="text-base font-bold text-primary-700 leading-tight">{new Date(a.date+'T00:00:00').getDate()}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary">{a.type}</p>
                  <p className="text-[11px] text-text-muted">{a.provider} &middot; {a.time} &middot; {a.location}</p>
                </div>
                <span className="badge badge-active text-[9px]">{a.status}</span>
              </div>
            ))}{mergedAppointments.length===0&&<p className="text-xs text-text-muted">None</p>}</div>
          </InfoCard>

          <InfoCard title="Admissions" icon={BuildingOffice2Icon} count={patient.admissions.length}>
            <div className="space-y-2">{patient.admissions.map((a,i)=>(
              <div key={i} className="bg-surface-alt rounded-lg p-2.5">
                <div className="flex items-center justify-between mb-1"><p className="text-xs font-semibold text-text-primary">{a.facility}</p>{!a.dischargeDate&&<span className="badge badge-critical text-[9px]">Current</span>}</div>
                <p className="text-[11px] text-text-muted">{a.admitDiagnosis} &middot; {a.admitDate}{a.dischargeDate?` → ${a.dischargeDate}`:' → Present'}</p>
              </div>
            ))}{patient.admissions.length===0&&<p className="text-xs text-text-muted">No admissions</p>}</div>
          </InfoCard>

          <InfoCard title="Care Plan" icon={FlagIcon} count={mergedGoals.length}
            action={<button onClick={()=>addEntry('goal')} className="text-xs text-primary-600 font-medium flex items-center gap-1 cursor-pointer hover:text-primary-700"><PlusIcon className="w-3.5 h-3.5" />Add Goal</button>}>
            <div className="space-y-2">
              {mergedGoals.map(g=>(<div key={g.id} className="flex items-start justify-between gap-2"><p className="text-xs text-text-secondary">{g.description}</p><span className={`badge text-[9px] shrink-0 ${g.status==='Met'?'badge-active':g.status==='On Track'?'badge-info':'badge-warning'}`}>{g.status}</span></div>))}
              {patient.carePlan.barriers.length>0&&(<div className="pt-2 mt-2 border-t border-border-light"><p className="text-[10px] font-semibold text-text-secondary mb-1">Barriers</p>{patient.carePlan.barriers.map((b,i)=>(<div key={i} className="flex items-start gap-1.5 text-[11px] text-text-muted"><ExclamationCircleIcon className="w-3 h-3 text-warn-500 shrink-0 mt-0.5" />{b}</div>))}</div>)}
            </div>
          </InfoCard>

          <InfoCard title="Insurance / Auth" icon={ShieldCheckIcon}>
            <div className="space-y-1 text-xs">
              {[['Plan',patient.insurance.plan],['Member ID',patient.insurance.memberId],['Group',patient.insurance.groupNumber],['Copay',patient.insurance.copay],['Status',patient.insurance.status]].map(([l,v])=>(
                <div key={l} className="flex justify-between"><span className="text-text-muted">{l}</span><span className={`font-medium ${l==='Status'?'text-accent-600':'text-text-primary'}`}>{v}</span></div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Emergency Contact" icon={UserGroupIcon}>
            <div className="text-xs"><p className="font-semibold text-text-primary">{patient.emergencyContact.name}</p><p className="text-text-muted">{patient.emergencyContact.relation} &middot; {patient.emergencyContact.phone}</p></div>
          </InfoCard>
        </div>

        {/* RIGHT - Documentation */}
        <div className="w-full lg:w-[440px] flex flex-col bg-white shrink-0">
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
                              {entry.type==='comm'&&<CommForm entry={entry.data} onChange={d=>updateEntry(entry.id,d)} disabled={entry.saved} />}
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
