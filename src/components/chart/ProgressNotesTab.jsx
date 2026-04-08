import { useState } from 'react';
import {
  PencilSquareIcon,
  DocumentTextIcon,
  PhoneIcon,
  VideoCameraIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import { addPatientEntry, getPatientEntries } from '../../data/localStore';

const methodIcons = { 'Phone': PhoneIcon, 'Video': VideoCameraIcon, 'In-Person': UserIcon };

export default function ProgressNotesTab({ patient }) {
  const [showForm, setShowForm] = useState(false);
  const [noteType, setNoteType] = useState('SOAP');
  const [search, setSearch] = useState('');
  const [_saveCount, setSaveCount] = useState(0);
  const [contactMethod, setContactMethod] = useState('Phone');
  const [datetime, setDatetime] = useState('');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [data, setData] = useState('');
  const [action, setAction] = useState('');
  const [response, setResponse] = useState('');

  const localEntries = getPatientEntries(patient.id, 'progressNotes');
  const allNotes = [...localEntries.slice().reverse(), ...patient.progressNotes];

  const [expandedNotes, setExpandedNotes] = useState(new Set(allNotes.length > 0 ? [allNotes[0].id] : []));

  const toggleNote = (id) => setExpandedNotes(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const expandAll = () => setExpandedNotes(new Set(filtered.map(n => n.id)));
  const collapseAll = () => setExpandedNotes(new Set());

  const resetForm = () => {
    setNoteType('SOAP');
    setContactMethod('Phone');
    setDatetime('');
    setSubjective(''); setObjective(''); setAssessment(''); setPlan('');
    setData(''); setAction(''); setResponse('');
  };

  const handleSave = () => {
    const dt = datetime || new Date().toISOString().slice(0, 16);
    const dateStr = new Date(dt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeStr = new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const entry = {
      date: dateStr,
      time: timeStr,
      author: 'Current User',
      type: noteType,
      contactMethod,
      ...(noteType === 'SOAP'
        ? { subjective, objective, assessment, plan }
        : { data, action, response }),
    };
    addPatientEntry(patient.id, 'progressNotes', entry);
    setShowForm(false);
    resetForm();
    setSaveCount(c => c + 1);
  };

  const filtered = allNotes.filter(note => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [note.subjective, note.objective, note.assessment, note.plan, note.data, note.action, note.response, note.author, note.date, note.type, note.contactMethod].filter(Boolean).join(' ').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">Progress Notes</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-xs" />
          </div>
          <button onClick={expandAll} className="btn-secondary py-2 px-3 text-xs hidden sm:block">Expand</button>
          <button onClick={collapseAll} className="btn-secondary py-2 px-3 text-xs hidden sm:block">Collapse</button>
          <button onClick={() => setShowForm(true)} className="btn-primary py-2 flex items-center gap-1.5">
            <PencilSquareIcon className="w-4 h-4" /><span className="hidden sm:inline">New Note</span>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Progress Note" wide>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Note Type</label>
            <select value={noteType} onChange={e => setNoteType(e.target.value)} className="input-field py-2 text-xs"><option value="SOAP">SOAP Note</option><option value="DAR">DAR Note</option></select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Contact Method</label>
            <select value={contactMethod} onChange={e => setContactMethod(e.target.value)} className="input-field py-2 text-xs"><option>Phone</option><option>Video</option><option>In-Person</option><option>Email</option></select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Date & Time</label>
            <input type="datetime-local" className="input-field py-2 text-xs" value={datetime || new Date().toISOString().slice(0, 16)} onChange={e => setDatetime(e.target.value)} />
          </div>
        </div>
        {noteType === 'SOAP' ? (
          <div className="space-y-3">
            {[['Subjective', subjective, setSubjective], ['Objective', objective, setObjective], ['Assessment', assessment, setAssessment], ['Plan', plan, setPlan]].map(([f, val, setter]) => (
              <div key={f}>
                <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                  <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-md flex items-center justify-center text-[10px] font-bold">{f[0]}</span>{f}
                </label>
                <textarea className="textarea-field text-xs" rows={3} placeholder={`Enter ${f.toLowerCase()}...`} value={val} onChange={e => setter(e.target.value)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[['Data', data, setData], ['Action', action, setAction], ['Response', response, setResponse]].map(([f, val, setter]) => (
              <div key={f}>
                <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                  <span className="w-5 h-5 bg-accent-100 text-accent-700 rounded-md flex items-center justify-center text-[10px] font-bold">{f[0]}</span>{f}
                </label>
                <textarea className="textarea-field text-xs" rows={3} placeholder={`Enter ${f.toLowerCase()}...`} value={val} onChange={e => setter(e.target.value)} />
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowForm(false)} className="btn-secondary py-2 text-xs">Cancel</button>
          <button onClick={handleSave} className="btn-primary py-2 text-xs">Save Note</button>
        </div>
      </Modal>

      {/* Notes List */}
      <div className="space-y-2">
        {filtered.map((note) => {
          const MethodIcon = methodIcons[note.contactMethod] || DocumentTextIcon;
          const isOpen = expandedNotes.has(note.id);
          return (
            <div key={note.id} className="card p-0 overflow-hidden">
              <button onClick={() => toggleNote(note.id)} className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 bg-surface-alt hover:bg-surface-hover transition-colors cursor-pointer text-left">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0"><MethodIcon className="w-4 h-4 text-primary-600" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-info text-[10px]">{note.type}</span>
                    <span className="badge badge-neutral text-[10px]">{note.contactMethod}</span>
                    <span className="text-xs text-text-muted">{note.date} at {note.time}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5 truncate">{note.author}</p>
                </div>
                {isOpen ? <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />}
              </button>
              {isOpen && (
                <div className="p-4 lg:p-5 border-t border-border-light animate-fade-in">
                  {note.type === 'SOAP' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[['S','Subjective','subjective','primary'],['O','Objective','objective','accent'],['A','Assessment','assessment','warn'],['P','Plan','plan','danger']].map(([k,l,f,c]) => (
                        <div key={k} className={`bg-${c}-50/50 rounded-xl p-3 border border-${c}-100/50`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-5 h-5 bg-${c}-100 text-${c}-700 rounded-md flex items-center justify-center text-[10px] font-bold`}>{k}</span>
                            <h4 className="text-xs font-semibold text-text-primary">{l}</h4>
                          </div>
                          <p className="text-xs text-text-secondary leading-relaxed">{note[f]}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {[['D','Data','data','primary'],['A','Action','action','accent'],['R','Response','response','warn']].map(([k,l,f,c]) => (
                        <div key={k} className={`bg-${c}-50/50 rounded-xl p-3 border border-${c}-100/50`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-5 h-5 bg-${c}-100 text-${c}-700 rounded-md flex items-center justify-center text-[10px] font-bold`}>{k}</span>
                            <h4 className="text-xs font-semibold text-text-primary">{l}</h4>
                          </div>
                          <p className="text-xs text-text-secondary leading-relaxed">{note[f]}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && allNotes.length > 0 && <div className="text-center py-8"><p className="text-sm text-text-muted">No notes match "{search}"</p></div>}
      {allNotes.length === 0 && <div className="text-center py-12"><DocumentTextIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" /><p className="text-sm text-text-muted">No progress notes yet</p></div>}
    </div>
  );
}
