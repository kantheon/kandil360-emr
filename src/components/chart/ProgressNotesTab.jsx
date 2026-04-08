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

const methodIcons = { 'Phone': PhoneIcon, 'Video': VideoCameraIcon, 'In-Person': UserIcon };

export default function ProgressNotesTab({ patient }) {
  const [showForm, setShowForm] = useState(false);
  const [noteType, setNoteType] = useState('SOAP');
  const [search, setSearch] = useState('');
  const [expandedNotes, setExpandedNotes] = useState(new Set(patient.progressNotes.length > 0 ? [patient.progressNotes[0].id] : []));

  const toggleNote = (id) => setExpandedNotes(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const expandAll = () => setExpandedNotes(new Set(filtered.map(n => n.id)));
  const collapseAll = () => setExpandedNotes(new Set());

  const filtered = patient.progressNotes.filter(note => {
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
            <select className="input-field py-2 text-xs"><option>Phone</option><option>Video</option><option>In-Person</option><option>Email</option></select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Date & Time</label>
            <input type="datetime-local" className="input-field py-2 text-xs" defaultValue={new Date().toISOString().slice(0, 16)} />
          </div>
        </div>
        {noteType === 'SOAP' ? (
          <div className="space-y-3">
            {['Subjective', 'Objective', 'Assessment', 'Plan'].map(f => (
              <div key={f}>
                <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                  <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-md flex items-center justify-center text-[10px] font-bold">{f[0]}</span>{f}
                </label>
                <textarea className="textarea-field text-xs" rows={3} placeholder={`Enter ${f.toLowerCase()}...`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {['Data', 'Action', 'Response'].map(f => (
              <div key={f}>
                <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                  <span className="w-5 h-5 bg-accent-100 text-accent-700 rounded-md flex items-center justify-center text-[10px] font-bold">{f[0]}</span>{f}
                </label>
                <textarea className="textarea-field text-xs" rows={3} placeholder={`Enter ${f.toLowerCase()}...`} />
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowForm(false)} className="btn-secondary py-2 text-xs">Cancel</button>
          <button className="btn-primary py-2 text-xs">Save Note</button>
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
      {filtered.length === 0 && patient.progressNotes.length > 0 && <div className="text-center py-8"><p className="text-sm text-text-muted">No notes match "{search}"</p></div>}
      {patient.progressNotes.length === 0 && <div className="text-center py-12"><DocumentTextIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" /><p className="text-sm text-text-muted">No progress notes yet</p></div>}
    </div>
  );
}
