import { useState } from 'react';
import {
  PencilSquareIcon,
  DocumentTextIcon,
  PhoneIcon,
  VideoCameraIcon,
  UserIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const methodIcons = {
  'Phone': PhoneIcon,
  'Video': VideoCameraIcon,
  'In-Person': UserIcon,
};

export default function ProgressNotesTab({ patient }) {
  const [showForm, setShowForm] = useState(false);
  const [noteType, setNoteType] = useState('SOAP');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Progress Notes</h2>
          <p className="text-xs text-text-muted mt-0.5">{patient.progressNotes.length} notes documented</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <PencilSquareIcon className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* New Note Form */}
      {showForm && (
        <div className="card p-6 border-primary-200 bg-primary-50/30 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-text-primary">New Progress Note</h3>
            <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-surface-hover cursor-pointer">
              <XMarkIcon className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Note Type</label>
              <select
                value={noteType}
                onChange={e => setNoteType(e.target.value)}
                className="input-field"
              >
                <option value="SOAP">SOAP Note</option>
                <option value="DAR">DAR Note</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Contact Method</label>
              <select className="input-field">
                <option>Phone</option>
                <option>Video</option>
                <option>In-Person</option>
                <option>Email</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Date & Time</label>
              <input type="datetime-local" className="input-field" defaultValue={new Date().toISOString().slice(0, 16)} />
            </div>
          </div>

          {noteType === 'SOAP' ? (
            <div className="space-y-4">
              {['Subjective', 'Objective', 'Assessment', 'Plan'].map((field) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-text-secondary mb-1.5 block flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-[11px] font-bold">
                      {field[0]}
                    </span>
                    {field}
                  </label>
                  <textarea className="textarea-field" rows={3} placeholder={`Enter ${field.toLowerCase()}...`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {['Data', 'Action', 'Response'].map((field) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-text-secondary mb-1.5 block flex items-center gap-2">
                    <span className="w-6 h-6 bg-accent-100 text-accent-700 rounded-lg flex items-center justify-center text-[11px] font-bold">
                      {field[0]}
                    </span>
                    {field}
                  </label>
                  <textarea className="textarea-field" rows={3} placeholder={`Enter ${field.toLowerCase()}...`} />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-5">
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Note</button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {patient.progressNotes.map((note) => {
          const MethodIcon = methodIcons[note.contactMethod] || DocumentTextIcon;
          return (
            <div key={note.id} className="card p-0 overflow-hidden">
              {/* Note Header */}
              <div className="flex items-center gap-3 px-6 py-4 bg-surface-alt border-b border-border-light">
                <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
                  <MethodIcon className="w-4.5 h-4.5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-info text-[11px]">{note.type}</span>
                    <span className="badge badge-neutral text-[11px]">{note.contactMethod}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                    <span>{note.author}</span>
                    <span>&middot;</span>
                    <span>{note.date} at {note.time}</span>
                  </div>
                </div>
              </div>

              {/* Note Body */}
              <div className="p-6">
                {note.type === 'SOAP' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-primary-50/50 rounded-xl p-4 border border-primary-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-[11px] font-bold">S</span>
                        <h4 className="text-xs font-semibold text-text-primary">Subjective</h4>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{note.subjective}</p>
                    </div>
                    <div className="bg-accent-50/50 rounded-xl p-4 border border-accent-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-accent-100 text-accent-700 rounded-lg flex items-center justify-center text-[11px] font-bold">O</span>
                        <h4 className="text-xs font-semibold text-text-primary">Objective</h4>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{note.objective}</p>
                    </div>
                    <div className="bg-warn-50/50 rounded-xl p-4 border border-warn-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-warn-100 text-[#92400e] rounded-lg flex items-center justify-center text-[11px] font-bold">A</span>
                        <h4 className="text-xs font-semibold text-text-primary">Assessment</h4>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{note.assessment}</p>
                    </div>
                    <div className="bg-danger-50/50 rounded-xl p-4 border border-danger-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-danger-100 text-danger-700 rounded-lg flex items-center justify-center text-[11px] font-bold">P</span>
                        <h4 className="text-xs font-semibold text-text-primary">Plan</h4>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{note.plan}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-primary-50/50 rounded-xl p-4 border border-primary-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-[11px] font-bold">D</span>
                        <h4 className="text-xs font-semibold text-text-primary">Data</h4>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{note.data}</p>
                    </div>
                    <div className="bg-accent-50/50 rounded-xl p-4 border border-accent-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-accent-100 text-accent-700 rounded-lg flex items-center justify-center text-[11px] font-bold">A</span>
                        <h4 className="text-xs font-semibold text-text-primary">Action</h4>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{note.action}</p>
                    </div>
                    <div className="bg-warn-50/50 rounded-xl p-4 border border-warn-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-warn-100 text-[#92400e] rounded-lg flex items-center justify-center text-[11px] font-bold">R</span>
                        <h4 className="text-xs font-semibold text-text-primary">Response</h4>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{note.response}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {patient.progressNotes.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">No progress notes yet</p>
          <p className="text-xs text-text-muted mt-1">Click "New Note" to add the first progress note</p>
        </div>
      )}
    </div>
  );
}
