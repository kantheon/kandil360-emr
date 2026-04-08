import { useState } from 'react';
import {
  PencilSquareIcon,
  DocumentTextIcon,
  PhoneIcon,
  VideoCameraIcon,
  UserIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const methodIcons = {
  'Phone': PhoneIcon,
  'Video': VideoCameraIcon,
  'In-Person': UserIcon,
};

export default function ProgressNotesTab({ patient }) {
  const [showForm, setShowForm] = useState(false);
  const [noteType, setNoteType] = useState('SOAP');
  const [search, setSearch] = useState('');
  const [expandedNotes, setExpandedNotes] = useState(new Set(patient.progressNotes.length > 0 ? [patient.progressNotes[0].id] : []));

  const toggleNote = (id) => {
    setExpandedNotes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedNotes(new Set(filtered.map(n => n.id)));
  const collapseAll = () => setExpandedNotes(new Set());

  const filtered = patient.progressNotes.filter(note => {
    if (!search) return true;
    const q = search.toLowerCase();
    const text = [note.subjective, note.objective, note.assessment, note.plan, note.data, note.action, note.response, note.author, note.date, note.type, note.contactMethod].filter(Boolean).join(' ').toLowerCase();
    return text.includes(q);
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">Progress Notes</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-xs"
            />
          </div>
          <button onClick={expandAll} className="btn-secondary py-2 px-3 text-xs hidden sm:block">Expand All</button>
          <button onClick={collapseAll} className="btn-secondary py-2 px-3 text-xs hidden sm:block">Collapse</button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 flex items-center gap-1.5">
            <PencilSquareIcon className="w-4 h-4" />
            <span className="hidden sm:inline">New Note</span>
          </button>
        </div>
      </div>

      {/* New Note Form */}
      {showForm && (
        <div className="card p-5 border-primary-200 bg-primary-50/30 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">New Progress Note</h3>
            <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-surface-hover cursor-pointer">
              <XMarkIcon className="w-4 h-4 text-text-muted" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Note Type</label>
              <select value={noteType} onChange={e => setNoteType(e.target.value)} className="input-field py-2 text-xs">
                <option value="SOAP">SOAP Note</option>
                <option value="DAR">DAR Note</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Contact Method</label>
              <select className="input-field py-2 text-xs">
                <option>Phone</option>
                <option>Video</option>
                <option>In-Person</option>
                <option>Email</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Date & Time</label>
              <input type="datetime-local" className="input-field py-2 text-xs" defaultValue={new Date().toISOString().slice(0, 16)} />
            </div>
          </div>
          {noteType === 'SOAP' ? (
            <div className="space-y-3">
              {['Subjective', 'Objective', 'Assessment', 'Plan'].map((field) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-md flex items-center justify-center text-[10px] font-bold">{field[0]}</span>
                    {field}
                  </label>
                  <textarea className="textarea-field text-xs" rows={2} placeholder={`Enter ${field.toLowerCase()}...`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {['Data', 'Action', 'Response'].map((field) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 bg-accent-100 text-accent-700 rounded-md flex items-center justify-center text-[10px] font-bold">{field[0]}</span>
                    {field}
                  </label>
                  <textarea className="textarea-field text-xs" rows={2} placeholder={`Enter ${field.toLowerCase()}...`} />
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowForm(false)} className="btn-secondary py-2 text-xs">Cancel</button>
            <button className="btn-primary py-2 text-xs">Save Note</button>
          </div>
        </div>
      )}

      {/* Notes List - Collapsible */}
      <div className="space-y-2">
        {filtered.map((note) => {
          const MethodIcon = methodIcons[note.contactMethod] || DocumentTextIcon;
          const isOpen = expandedNotes.has(note.id);
          return (
            <div key={note.id} className="card p-0 overflow-hidden">
              {/* Clickable Header */}
              <button
                onClick={() => toggleNote(note.id)}
                className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 bg-surface-alt hover:bg-surface-hover transition-colors cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <MethodIcon className="w-4 h-4 text-primary-600" />
                </div>
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

              {/* Collapsible Body */}
              {isOpen && (
                <div className="p-4 lg:p-5 border-t border-border-light animate-fade-in">
                  {note.type === 'SOAP' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-primary-50/50 rounded-xl p-3 border border-primary-100/50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-md flex items-center justify-center text-[10px] font-bold">S</span>
                          <h4 className="text-xs font-semibold text-text-primary">Subjective</h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{note.subjective}</p>
                      </div>
                      <div className="bg-accent-50/50 rounded-xl p-3 border border-accent-100/50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-5 h-5 bg-accent-100 text-accent-700 rounded-md flex items-center justify-center text-[10px] font-bold">O</span>
                          <h4 className="text-xs font-semibold text-text-primary">Objective</h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{note.objective}</p>
                      </div>
                      <div className="bg-warn-50/50 rounded-xl p-3 border border-warn-100/50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-5 h-5 bg-warn-100 text-[#92400e] rounded-md flex items-center justify-center text-[10px] font-bold">A</span>
                          <h4 className="text-xs font-semibold text-text-primary">Assessment</h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{note.assessment}</p>
                      </div>
                      <div className="bg-danger-50/50 rounded-xl p-3 border border-danger-100/50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-5 h-5 bg-danger-100 text-danger-700 rounded-md flex items-center justify-center text-[10px] font-bold">P</span>
                          <h4 className="text-xs font-semibold text-text-primary">Plan</h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{note.plan}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-primary-50/50 rounded-xl p-3 border border-primary-100/50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-md flex items-center justify-center text-[10px] font-bold">D</span>
                          <h4 className="text-xs font-semibold text-text-primary">Data</h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{note.data}</p>
                      </div>
                      <div className="bg-accent-50/50 rounded-xl p-3 border border-accent-100/50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-5 h-5 bg-accent-100 text-accent-700 rounded-md flex items-center justify-center text-[10px] font-bold">A</span>
                          <h4 className="text-xs font-semibold text-text-primary">Action</h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{note.action}</p>
                      </div>
                      <div className="bg-warn-50/50 rounded-xl p-3 border border-warn-100/50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-5 h-5 bg-warn-100 text-[#92400e] rounded-md flex items-center justify-center text-[10px] font-bold">R</span>
                          <h4 className="text-xs font-semibold text-text-primary">Response</h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{note.response}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && patient.progressNotes.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-text-muted">No notes match "{search}"</p>
        </div>
      )}
      {patient.progressNotes.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">No progress notes yet</p>
        </div>
      )}
    </div>
  );
}
