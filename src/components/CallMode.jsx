import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  MinusIcon,
  PhoneIcon,
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  TrashIcon,
  HeartIcon,
  BeakerIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  FlagIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { assessmentTemplates } from '../data/assessmentTemplates';

/* ── Compact forms ── */
function NoteForm({ entry, onChange }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <select value={entry.noteType || 'SOAP'} onChange={e => onChange({ ...entry, noteType: e.target.value })} className="input-field py-1.5 text-xs">
          <option value="SOAP">SOAP</option><option value="DAR">DAR</option>
        </select>
        <select value={entry.contactMethod || 'Phone'} onChange={e => onChange({ ...entry, contactMethod: e.target.value })} className="input-field py-1.5 text-xs">
          <option>Phone</option><option>Video</option><option>In-Person</option>
        </select>
      </div>
      {((entry.noteType || 'SOAP') === 'SOAP' ? ['Subjective','Objective','Assessment','Plan'] : ['Data','Action','Response']).map(f => (
        <div key={f}>
          <label className="text-[11px] font-semibold text-text-secondary flex items-center gap-1 mb-0.5">
            <span className={`w-4 h-4 ${(entry.noteType||'SOAP')==='SOAP'?'bg-primary-100 text-primary-700':'bg-accent-100 text-accent-700'} rounded text-[9px] font-bold flex items-center justify-center`}>{f[0]}</span>{f}
          </label>
          <textarea className="textarea-field text-xs !min-h-[48px]" rows={2} placeholder={f+'...'} value={entry[f.toLowerCase()]||''} onChange={e => onChange({...entry,[f.toLowerCase()]:e.target.value})} />
        </div>
      ))}
    </div>
  );
}

function CommForm({ entry, onChange }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <select value={entry.direction||'Outbound'} onChange={e=>onChange({...entry,direction:e.target.value})} className="input-field py-1.5 text-xs"><option>Outbound</option><option>Inbound</option></select>
        <select value={entry.method||'Phone'} onChange={e=>onChange({...entry,method:e.target.value})} className="input-field py-1.5 text-xs"><option>Phone</option><option>Fax</option><option>Email</option><option>In-Person</option></select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="text" className="input-field py-1.5 text-xs" placeholder="Contact person" value={entry.contactPerson||''} onChange={e=>onChange({...entry,contactPerson:e.target.value})} />
        <select value={entry.contactRole||'Patient'} onChange={e=>onChange({...entry,contactRole:e.target.value})} className="input-field py-1.5 text-xs"><option>Patient</option><option>Family/Caregiver</option><option>PCP</option><option>Specialist</option><option>Insurance</option><option>Facility</option></select>
      </div>
      <input type="text" className="input-field py-1.5 text-xs" placeholder="Subject" value={entry.subject||''} onChange={e=>onChange({...entry,subject:e.target.value})} />
      <textarea className="textarea-field text-xs !min-h-[48px]" rows={2} placeholder="Summary..." value={entry.summary||''} onChange={e=>onChange({...entry,summary:e.target.value})} />
      <div className="grid grid-cols-2 gap-2">
        <input type="text" className="input-field py-1.5 text-xs" placeholder="Outcome" value={entry.outcome||''} onChange={e=>onChange({...entry,outcome:e.target.value})} />
        <input type="date" className="input-field py-1.5 text-xs" value={entry.followUpDate||''} onChange={e=>onChange({...entry,followUpDate:e.target.value})} />
      </div>
    </div>
  );
}

function AssessmentForm({ entry, onChange }) {
  const template = assessmentTemplates.find(t => t.id === entry.templateId);
  if (!template) return (
    <div className="space-y-1.5">
      {assessmentTemplates.map(t => (
        <button key={t.id} onClick={() => onChange({...entry,templateId:t.id,answers:{}})} className="w-full text-left p-2 rounded-lg border border-border-light hover:bg-primary-50 hover:border-primary-200 transition-all cursor-pointer">
          <p className="text-xs font-semibold text-text-primary">{t.name}</p>
          <p className="text-[10px] text-text-muted">{t.category} &middot; {t.questions.length}q</p>
        </button>
      ))}
    </div>
  );
  const answers = entry.answers||{};
  const total = template.questions.reduce((s,q) => s+(answers[q.id]??0),0);
  const allDone = template.questions.every(q => answers[q.id]!==undefined);
  const range = template.scoring.method==='sum' ? template.scoring.ranges.find(r => total>=r.min&&total<=r.max) : null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold">{template.name}</p>
        <button onClick={()=>onChange({...entry,templateId:null,answers:{}})} className="text-[10px] text-primary-600 cursor-pointer">&larr; Change</button>
      </div>
      {template.questions.map((q,i) => (
        <div key={q.id}>
          <label className="text-[10px] font-medium text-text-secondary">{i+1}. {q.text}</label>
          <select className="input-field py-1 text-xs mt-0.5" value={answers[q.id]??''} onChange={e=>onChange({...entry,answers:{...answers,[q.id]:Number(e.target.value)}})}>
            <option value="" disabled>Select...</option>
            {q.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      {allDone && range && (
        <div className={`p-2 rounded-lg text-xs font-bold text-center ${range.color==='green'?'bg-accent-100 text-accent-700':range.color==='red'?'bg-danger-100 text-danger-600':'bg-warn-100 text-[#92400e]'}`}>
          Score: {total} &mdash; {range.label}
        </div>
      )}
    </div>
  );
}

/* ── Left panel card ── */
function InfoCard({ title, icon: Icon, children, count, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card p-0 overflow-hidden">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-surface-alt transition-colors cursor-pointer text-left">
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-primary-500" /></div>
        <span className="text-sm font-semibold text-text-primary flex-1">{title}</span>
        {count !== undefined && <span className="text-[10px] font-bold text-text-muted bg-surface-alt px-2 py-0.5 rounded-md">{count}</span>}
        {open ? <ChevronUpIcon className="w-4 h-4 text-text-muted" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted" />}
      </button>
      {open && <div className="px-4 pb-3 border-t border-border-light pt-3">{children}</div>}
    </div>
  );
}

/* ── Main component ── */
export default function CallMode({ patient, onClose, minimized, onToggleMinimize }) {
  const [entries, setEntries] = useState([]);
  const [expandedEntries, setExpandedEntries] = useState(new Set());
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [savedEntries, setSavedEntries] = useState([]);

  // Lock body scroll when open
  useEffect(() => {
    if (!minimized) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [minimized]);

  const addEntry = (type) => { const id = Date.now(); setEntries(p => [...p,{id,type,data:{}}]); setExpandedEntries(p => new Set([...p,id])); setShowAddMenu(false); };
  const updateEntry = (id,data) => setEntries(p => p.map(e => e.id===id?{...e,data}:e));
  const removeEntry = (id) => { setEntries(p => p.filter(e => e.id!==id)); setExpandedEntries(p => {const n=new Set(p);n.delete(id);return n;}); };
  const saveEntry = (id) => { const e=entries.find(x=>x.id===id); if(e){setSavedEntries(p=>[...p,{...e,savedAt:new Date().toLocaleTimeString()}]);removeEntry(id);} };
  const toggleEntry = (id) => setExpandedEntries(p => {const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});

  const groups = { note: { label:'Progress Notes', icon:DocumentTextIcon, color:'bg-primary-100' }, comm: { label:'Communications', icon:ChatBubbleLeftRightIcon, color:'bg-accent-100' }, assessment: { label:'Assessments', icon:ClipboardDocumentCheckIcon, color:'bg-warn-100' } };

  // Group entries + saved
  const allEntries = [...entries, ...savedEntries.map(e => ({...e,saved:true}))];
  const grouped = {};
  for (const e of allEntries) { if(!grouped[e.type]) grouped[e.type]=[]; grouped[e.type].push(e); }

  // Minimized FAB
  if (minimized) {
    return (
      <button onClick={onToggleMinimize} className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-700 rounded-full shadow-lg shadow-accent-500/30 flex items-center justify-center text-white hover:shadow-xl hover:scale-105 transition-all cursor-pointer animate-fade-in" title="Resume Call Mode">
        <PhoneIcon className="w-6 h-6" />
        {entries.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{entries.length}</span>}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] bg-[#f0f4f8] flex flex-col animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 lg:px-6 py-2.5 bg-gradient-to-r from-accent-600 to-accent-700 text-white shrink-0">
        <PhoneIcon className="w-5 h-5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight">Call Mode &mdash; {patient.lastName}, {patient.firstName}</p>
          <p className="text-[11px] opacity-80">{patient.id} &middot; {patient.mrn} &middot; {patient.age}y {patient.sex[0]} &middot; DOB: {patient.dob}</p>
        </div>
        <button onClick={onToggleMinimize} className="p-1.5 rounded-lg hover:bg-white/20 cursor-pointer" title="Minimize"><MinusIcon className="w-4 h-4" /></button>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 cursor-pointer" title="End Call Mode"><XMarkIcon className="w-4 h-4" /></button>
      </div>

      {/* Allergy bar */}
      {patient.allergies.length > 0 && (
        <div className="bg-danger-50 border-b border-danger-100 px-4 lg:px-6 py-1 flex items-center gap-2 shrink-0">
          <ShieldExclamationIcon className="w-3.5 h-3.5 text-danger-500 shrink-0" />
          <span className="text-[11px] font-bold text-danger-600">ALLERGIES:</span>
          <span className="text-[11px] text-danger-600">{patient.allergies.map(a=>`${a.allergen} (${a.reaction} - ${a.severity})`).join(' | ')}</span>
        </div>
      )}

      {/* Split panels */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT - Patient reference cards */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-3 lg:border-r border-border-light">
          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ['PCP', patient.pcp],
              ['Insurance', patient.insurance.plan.split(' - ')[0]],
              ['Program', patient.caseInfo.program],
              ['Acuity', patient.caseInfo.acuity],
            ].map(([l,v]) => (
              <div key={l} className="card px-4 py-3">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{l}</p>
                <p className={`text-xs font-semibold mt-0.5 ${l==='Acuity'&&v==='High'?'text-danger-500':'text-text-primary'}`}>{v}</p>
              </div>
            ))}
          </div>

          <InfoCard title="Diagnoses" icon={HeartIcon} count={patient.diagnoses.length} defaultOpen>
            <div className="space-y-1.5">
              {patient.diagnoses.map((dx,i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="badge badge-info text-[9px] shrink-0 mt-0.5">{dx.code}</span>
                  <div>
                    <p className="text-xs font-medium text-text-primary">{dx.description}</p>
                    <p className="text-[10px] text-text-muted">Since {dx.onsetDate} &middot; {dx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Medications" icon={BeakerIcon} count={patient.medications.length}>
            <div className="space-y-1.5">
              {patient.medications.map((m,i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div><span className="font-medium text-text-primary">{m.name}</span> <span className="text-text-muted">{m.dose} {m.frequency}</span></div>
                  <span className="text-[10px] text-text-muted">{m.prescriber}</span>
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Upcoming Appointments" icon={CalendarDaysIcon} count={patient.appointments.length} defaultOpen>
            <div className="space-y-2">
              {patient.appointments.map((a,i) => (
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
              ))}
              {patient.appointments.length === 0 && <p className="text-xs text-text-muted">None scheduled</p>}
            </div>
          </InfoCard>

          <InfoCard title="Admissions" icon={BuildingOffice2Icon} count={patient.admissions.length}>
            <div className="space-y-2">
              {patient.admissions.map((a,i) => (
                <div key={i} className="bg-surface-alt rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-text-primary">{a.facility}</p>
                    {!a.dischargeDate && <span className="badge badge-critical text-[9px]">Current</span>}
                  </div>
                  <p className="text-[11px] text-text-muted">{a.admitDiagnosis}</p>
                  <p className="text-[11px] text-text-muted">{a.admitDate}{a.dischargeDate?` → ${a.dischargeDate} (${a.lengthOfStay}d)`:` → Present (${Math.ceil((new Date()-new Date(a.admitDate))/86400000)}d)`}</p>
                  {a.dischargeDisposition && <p className="text-[11px] text-text-muted">D/C: {a.dischargeDisposition}</p>}
                </div>
              ))}
              {patient.admissions.length === 0 && <p className="text-xs text-text-muted">No admissions</p>}
            </div>
          </InfoCard>

          <InfoCard title="Care Plan" icon={FlagIcon} count={patient.carePlan.goals.length}>
            <div className="space-y-2">
              {patient.carePlan.goals.map(g => (
                <div key={g.id} className="flex items-start justify-between gap-2">
                  <p className="text-xs text-text-secondary">{g.description}</p>
                  <span className={`badge text-[9px] shrink-0 ${g.status==='Met'?'badge-active':g.status==='On Track'?'badge-info':'badge-warning'}`}>{g.status}</span>
                </div>
              ))}
              {patient.carePlan.barriers.length > 0 && (
                <div className="pt-2 mt-2 border-t border-border-light">
                  <p className="text-[10px] font-semibold text-text-secondary mb-1">Barriers</p>
                  {patient.carePlan.barriers.map((b,i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-text-muted"><ExclamationCircleIcon className="w-3 h-3 text-warn-500 shrink-0 mt-0.5" />{b}</div>
                  ))}
                </div>
              )}
            </div>
          </InfoCard>

          <InfoCard title="Insurance / Authorizations" icon={ShieldCheckIcon}>
            <div className="space-y-1 text-xs">
              {[['Plan',patient.insurance.plan],['Member ID',patient.insurance.memberId],['Group',patient.insurance.groupNumber],['Type',patient.insurance.type],['Copay',patient.insurance.copay],['Status',patient.insurance.status]].map(([l,v])=>(
                <div key={l} className="flex justify-between"><span className="text-text-muted">{l}</span><span className={`font-medium ${l==='Status'?'text-accent-600':'text-text-primary'}`}>{v}</span></div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Emergency Contact" icon={UserGroupIcon}>
            <div className="text-xs">
              <p className="font-semibold text-text-primary">{patient.emergencyContact.name}</p>
              <p className="text-text-muted">{patient.emergencyContact.relation} &middot; {patient.emergencyContact.phone}</p>
            </div>
          </InfoCard>
        </div>

        {/* RIGHT - Documentation */}
        <div className="w-full lg:w-[420px] flex flex-col bg-white shrink-0">
          <div className="px-4 py-2.5 bg-surface-alt border-b border-border-light shrink-0">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Documentation</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Grouped entries */}
            {Object.entries(groups).map(([type, cfg]) => {
              const items = grouped[type];
              if (!items || items.length === 0) return null;
              const Icon = cfg.icon;
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${cfg.color}`}><Icon className="w-3 h-3 text-text-secondary" /></div>
                    <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">{cfg.label}</p>
                    <span className="text-[10px] font-bold text-text-muted bg-surface-alt px-1.5 py-0.5 rounded">{items.length}</span>
                  </div>
                  <div className="space-y-2 ml-7">
                    {items.map(entry => {
                      if (entry.saved) return (
                        <div key={entry.id} className="bg-accent-50 rounded-lg px-3 py-2 border border-accent-200 flex items-center gap-2">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-accent-600 shrink-0" />
                          <span className="text-[11px] font-medium text-accent-700 flex-1">Saved</span>
                          <span className="text-[10px] text-accent-500">{entry.savedAt}</span>
                        </div>
                      );
                      const isOpen = expandedEntries.has(entry.id);
                      return (
                        <div key={entry.id} className="border border-border-light rounded-lg overflow-hidden">
                          <button onClick={()=>toggleEntry(entry.id)} className="w-full flex items-center gap-2 px-3 py-2 bg-surface-alt hover:bg-surface-hover transition-colors cursor-pointer text-left">
                            <span className="text-[11px] font-medium text-text-primary flex-1">Entry #{entries.indexOf(entry)+1}</span>
                            <button onClick={e=>{e.stopPropagation();removeEntry(entry.id);}} className="p-0.5 rounded hover:bg-danger-50 text-text-muted hover:text-danger-500 cursor-pointer"><TrashIcon className="w-3 h-3" /></button>
                            {isOpen?<ChevronUpIcon className="w-3 h-3 text-text-muted" />:<ChevronDownIcon className="w-3 h-3 text-text-muted" />}
                          </button>
                          {isOpen && (
                            <div className="px-3 pb-3 pt-2 border-t border-border-light bg-white">
                              {entry.type==='note' && <NoteForm entry={entry.data} onChange={d=>updateEntry(entry.id,d)} />}
                              {entry.type==='comm' && <CommForm entry={entry.data} onChange={d=>updateEntry(entry.id,d)} />}
                              {entry.type==='assessment' && <AssessmentForm entry={entry.data} onChange={d=>updateEntry(entry.id,d)} />}
                              <button onClick={()=>saveEntry(entry.id)} className="btn-primary w-full py-1.5 text-xs mt-2 flex items-center justify-center gap-1"><CheckCircleIcon className="w-3.5 h-3.5" />Save</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {allEntries.length === 0 && (
              <div className="text-center py-10">
                <DocumentTextIcon className="w-10 h-10 text-text-muted/20 mx-auto mb-2" />
                <p className="text-xs text-text-muted">No entries yet</p>
                <p className="text-[11px] text-text-muted mt-0.5">Add documentation using the button below</p>
              </div>
            )}
          </div>

          {/* Fixed add button */}
          <div className="shrink-0 p-3 border-t border-border-light">
            {showAddMenu ? (
              <div className="space-y-1 animate-fade-in">
                {[{id:'note',label:'Progress Note',icon:DocumentTextIcon},{id:'comm',label:'Communication',icon:ChatBubbleLeftRightIcon},{id:'assessment',label:'Assessment',icon:ClipboardDocumentCheckIcon}].map(t => (
                  <button key={t.id} onClick={()=>addEntry(t.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light hover:bg-primary-50 hover:border-primary-200 transition-all cursor-pointer text-left">
                    <t.icon className="w-4 h-4 text-text-muted" /><span className="text-xs font-medium text-text-primary">{t.label}</span>
                  </button>
                ))}
                <button onClick={()=>setShowAddMenu(false)} className="w-full text-[11px] text-text-muted py-1 cursor-pointer">Cancel</button>
              </div>
            ) : (
              <button onClick={()=>setShowAddMenu(true)} className="btn-primary w-full py-2 flex items-center justify-center gap-2">
                <PlusIcon className="w-4 h-4" /> Add Entry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
