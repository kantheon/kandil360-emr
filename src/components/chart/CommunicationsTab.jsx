import { useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PhoneArrowUpRightIcon,
  PhoneArrowDownLeftIcon,
  PlusIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';

const directionIcons = { 'Outbound': PhoneArrowUpRightIcon, 'Inbound': PhoneArrowDownLeftIcon };
const methodColors = { 'Phone': 'badge-info', 'Fax': 'badge-neutral', 'Email': 'badge-active', 'In-Person': 'badge-warning' };

export default function CommunicationsTab({ patient }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedComms, setExpandedComms] = useState(new Set(patient.communications.length > 0 ? [patient.communications[0].id] : []));

  const toggleComm = (id) => setExpandedComms(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = patient.communications.filter(comm => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [comm.subject, comm.summary, comm.contactPerson, comm.contactRole, comm.method, comm.date, comm.outcome].join(' ').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">Communication Log</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search comms..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-xs" />
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary py-2 flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" /><span className="hidden sm:inline">Log Comm</span>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Log Communication" wide>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Direction</label><select className="input-field py-2 text-xs"><option>Outbound</option><option>Inbound</option></select></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Method</label><select className="input-field py-2 text-xs"><option>Phone</option><option>Fax</option><option>Email</option><option>In-Person</option></select></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Contact</label><input type="text" className="input-field py-2 text-xs" placeholder="Name" /></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Role</label><select className="input-field py-2 text-xs"><option>Patient</option><option>Family/Caregiver</option><option>PCP</option><option>Specialist</option><option>Insurance</option><option>Facility</option></select></div>
        </div>
        <div className="space-y-3 mb-4">
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Subject</label><input type="text" className="input-field py-2 text-xs" placeholder="Brief subject" /></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Summary</label><textarea className="textarea-field text-xs" rows={3} placeholder="Summarize..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-text-secondary mb-1 block">Outcome</label><input type="text" className="input-field py-2 text-xs" placeholder="Result" /></div>
            <div><label className="text-xs font-medium text-text-secondary mb-1 block">Follow-up</label><input type="date" className="input-field py-2 text-xs" /></div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowForm(false)} className="btn-secondary py-2 text-xs">Cancel</button>
          <button className="btn-primary py-2 text-xs">Save</button>
        </div>
      </Modal>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((comm) => {
          const DirIcon = directionIcons[comm.direction] || ChatBubbleLeftRightIcon;
          const isOpen = expandedComms.has(comm.id);
          return (
            <div key={comm.id} className="card p-0 overflow-hidden">
              <button onClick={() => toggleComm(comm.id)} className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 hover:bg-surface-alt transition-colors cursor-pointer text-left">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${comm.direction === 'Outbound' ? 'bg-primary-100' : 'bg-accent-100'}`}>
                  <DirIcon className={`w-4 h-4 ${comm.direction === 'Outbound' ? 'text-primary-600' : 'text-accent-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-text-primary truncate">{comm.subject}</span>
                    <span className={`badge ${methodColors[comm.method] || 'badge-neutral'} text-[10px]`}>{comm.method}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                    <span>{comm.contactPerson} ({comm.contactRole})</span><span>&middot;</span><span>{comm.date}</span>
                  </div>
                </div>
                {comm.followUpNeeded && <span className="badge badge-warning text-[10px] shrink-0 hidden sm:inline-flex">F/U {comm.followUpDate}</span>}
                {isOpen ? <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 lg:px-5 pb-4 border-t border-border-light pt-3 animate-fade-in">
                  <p className="text-xs text-text-secondary leading-relaxed">{comm.summary}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border-light">
                    <div className="flex items-center gap-1.5 text-xs"><span className="text-text-muted">Outcome:</span><span className="font-medium text-text-primary">{comm.outcome}</span></div>
                    {comm.followUpNeeded && <div className="flex items-center gap-1.5 text-xs"><span className="text-text-muted">Follow-up:</span><span className="font-medium text-warn-500">{comm.followUpDate}</span></div>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && patient.communications.length > 0 && <div className="text-center py-8"><p className="text-sm text-text-muted">No results for "{search}"</p></div>}
      {patient.communications.length === 0 && <div className="text-center py-12"><ChatBubbleLeftRightIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" /><p className="text-sm text-text-muted">No communications logged</p></div>}
    </div>
  );
}
