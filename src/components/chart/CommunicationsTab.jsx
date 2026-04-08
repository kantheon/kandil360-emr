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
import { addPatientEntry, getPatientEntries } from '../../data/localStore';

const directionIcons = { 'Outbound': PhoneArrowUpRightIcon, 'Inbound': PhoneArrowDownLeftIcon };
const methodColors = { 'Phone': 'badge-info', 'Fax': 'badge-neutral', 'Email': 'badge-active', 'In-Person': 'badge-warning' };

export default function CommunicationsTab({ patient }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [_saveCount, setSaveCount] = useState(0);
  const [direction, setDirection] = useState('Outbound');
  const [method, setMethod] = useState('Phone');
  const [contactPerson, setContactPerson] = useState('');
  const [contactRole, setContactRole] = useState('Patient');
  const [subject, setSubject] = useState('');
  const [summary, setSummary] = useState('');
  const [outcome, setOutcome] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const localEntries = getPatientEntries(patient.id, 'communications');
  const allComms = [...localEntries.slice().reverse(), ...patient.communications];

  const [expandedComms, setExpandedComms] = useState(new Set(allComms.length > 0 ? [allComms[0].id] : []));

  const toggleComm = (id) => setExpandedComms(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const resetForm = () => {
    setDirection('Outbound'); setMethod('Phone'); setContactPerson(''); setContactRole('Patient');
    setSubject(''); setSummary(''); setOutcome(''); setFollowUpDate('');
  };

  const handleSave = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const entry = {
      date: today,
      direction,
      method,
      contactPerson,
      contactRole,
      subject,
      summary,
      outcome,
      followUpNeeded: !!followUpDate,
      followUpDate: followUpDate || null,
    };
    addPatientEntry(patient.id, 'communications', entry);
    setShowForm(false);
    resetForm();
    setSaveCount(c => c + 1);
  };

  const filtered = allComms.filter(comm => {
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
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Log Communication" wide footer={<div className="flex justify-end gap-2"><button onClick={() => setShowForm(false)} className="btn-secondary py-2 text-xs">Cancel</button><button onClick={handleSave} className="btn-primary py-2 text-xs">Save</button></div>}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Direction</label><select value={direction} onChange={e => setDirection(e.target.value)} className="input-field py-2 text-xs"><option>Outbound</option><option>Inbound</option></select></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Method</label><select value={method} onChange={e => setMethod(e.target.value)} className="input-field py-2 text-xs"><option>Phone</option><option>Fax</option><option>Email</option><option>In-Person</option></select></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Contact</label><input type="text" className="input-field py-2 text-xs" placeholder="Name" value={contactPerson} onChange={e => setContactPerson(e.target.value)} /></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Role</label><select value={contactRole} onChange={e => setContactRole(e.target.value)} className="input-field py-2 text-xs"><option>Patient</option><option>Family/Caregiver</option><option>PCP</option><option>Specialist</option><option>Insurance</option><option>Facility</option></select></div>
        </div>
        <div className="space-y-3 mb-4">
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Subject</label><input type="text" className="input-field py-2 text-xs" placeholder="Brief subject" value={subject} onChange={e => setSubject(e.target.value)} /></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Summary</label><textarea className="textarea-field text-xs" rows={3} placeholder="Summarize..." value={summary} onChange={e => setSummary(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-text-secondary mb-1 block">Outcome</label><input type="text" className="input-field py-2 text-xs" placeholder="Result" value={outcome} onChange={e => setOutcome(e.target.value)} /></div>
            <div><label className="text-xs font-medium text-text-secondary mb-1 block">Follow-up</label><input type="date" className="input-field py-2 text-xs" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} /></div>
          </div>
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
      {filtered.length === 0 && allComms.length > 0 && <div className="text-center py-8"><p className="text-sm text-text-muted">No results for "{search}"</p></div>}
      {allComms.length === 0 && <div className="text-center py-12"><ChatBubbleLeftRightIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" /><p className="text-sm text-text-muted">No communications logged</p></div>}
    </div>
  );
}
