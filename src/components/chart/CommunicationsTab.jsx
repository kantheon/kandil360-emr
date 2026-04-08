import { useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PhoneArrowUpRightIcon,
  PhoneArrowDownLeftIcon,
  PlusIcon,
  XMarkIcon,
  EnvelopeIcon,
  PrinterIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const directionIcons = {
  'Outbound': PhoneArrowUpRightIcon,
  'Inbound': PhoneArrowDownLeftIcon,
};

const methodColors = {
  'Phone': 'badge-info',
  'Fax': 'badge-neutral',
  'Email': 'badge-active',
  'In-Person': 'badge-warning',
};

export default function CommunicationsTab({ patient }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Communication Log</h2>
          <p className="text-xs text-text-muted mt-0.5">{patient.communications.length} communications recorded</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Log Communication
        </button>
      </div>

      {/* New Communication Form */}
      {showForm && (
        <div className="card p-6 border-primary-200 bg-primary-50/30 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-text-primary">Log New Communication</h3>
            <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-surface-hover cursor-pointer">
              <XMarkIcon className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Direction</label>
              <select className="input-field">
                <option>Outbound</option>
                <option>Inbound</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Method</label>
              <select className="input-field">
                <option>Phone</option>
                <option>Fax</option>
                <option>Email</option>
                <option>In-Person</option>
                <option>Portal Message</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Contact Person</label>
              <input type="text" className="input-field" placeholder="Name" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Role</label>
              <select className="input-field">
                <option>Patient</option>
                <option>Family/Caregiver</option>
                <option>PCP</option>
                <option>Specialist</option>
                <option>Insurance</option>
                <option>Facility Staff</option>
                <option>Home Health</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Subject</label>
              <input type="text" className="input-field" placeholder="Brief subject of communication" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Summary</label>
              <textarea className="textarea-field" rows={3} placeholder="Summarize the communication..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block">Outcome</label>
                <input type="text" className="input-field" placeholder="Result of communication" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block">Follow-up Date (if needed)</label>
                <input type="date" className="input-field" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Communication</button>
          </div>
        </div>
      )}

      {/* Communications Timeline */}
      <div className="space-y-3">
        {patient.communications.map((comm) => {
          const DirIcon = directionIcons[comm.direction] || ChatBubbleLeftRightIcon;
          return (
            <div key={comm.id} className="card p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  comm.direction === 'Outbound' ? 'bg-primary-100' : 'bg-accent-100'
                }`}>
                  <DirIcon className={`w-5 h-5 ${
                    comm.direction === 'Outbound' ? 'text-primary-600' : 'text-accent-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-text-primary">{comm.subject}</h4>
                    <span className={`badge ${methodColors[comm.method] || 'badge-neutral'} text-[11px]`}>{comm.method}</span>
                    <span className={`badge text-[11px] ${comm.direction === 'Outbound' ? 'badge-info' : 'badge-active'}`}>
                      {comm.direction}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      {comm.contactPerson} ({comm.contactRole})
                    </span>
                    <span>{comm.date} at {comm.time}</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{comm.summary}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border-light">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-text-muted">Outcome:</span>
                      <span className="font-medium text-text-primary">{comm.outcome}</span>
                    </div>
                    {comm.followUpNeeded && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-text-muted">Follow-up:</span>
                        <span className="font-medium text-warn-500">{comm.followUpDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {patient.communications.length === 0 && (
        <div className="text-center py-12">
          <ChatBubbleLeftRightIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">No communications logged</p>
          <p className="text-xs text-text-muted mt-1">Click "Log Communication" to add an entry</p>
        </div>
      )}
    </div>
  );
}
