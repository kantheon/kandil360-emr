import { useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PhoneArrowUpRightIcon,
  PhoneArrowDownLeftIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import { useData } from '../../contexts/DataContext';

const directionIcons = { 'Outbound': PhoneArrowUpRightIcon, 'Inbound': PhoneArrowDownLeftIcon };
const methodColors = { 'Phone': 'badge-info', 'Fax': 'badge-neutral', 'Email': 'badge-active', 'In-Person': 'badge-warning' };

export default function CommunicationsTab({ patient }) {
  const { addEntry, updateEntry, deleteEntry, isEditable } = useData();

  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [direction, setDirection] = useState('Outbound');
  const [method, setMethod] = useState('Phone');
  const [contactPerson, setContactPerson] = useState('');
  const [contactRole, setContactRole] = useState('Patient');
  const [subject, setSubject] = useState('');
  const [summary, setSummary] = useState('');
  const [outcome, setOutcome] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [hipaaVerified, setHipaaVerified] = useState(false);
  const [phoneConsent, setPhoneConsent] = useState(false);
  const [calledNumber, setCalledNumber] = useState('');

  const allComms = patient.communications || [];

  const [expandedComms, setExpandedComms] = useState(new Set(allComms.length > 0 ? [allComms[0].id] : []));

  const toggleComm = (id) => setExpandedComms(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const resetForm = () => {
    setDirection('Outbound'); setMethod('Phone'); setContactPerson(''); setContactRole('Patient');
    setSubject(''); setSummary(''); setOutcome(''); setFollowUpDate('');
    setHipaaVerified(false); setPhoneConsent(false); setCalledNumber('');
  };

  // Build phone number options from patient data
  const phoneOptions = [
    { label: `Patient: ${patient.phone}`, value: patient.phone, person: `${patient.firstName} ${patient.lastName}` },
    { label: `Emergency: ${patient.emergencyContact?.name} - ${patient.emergencyContact?.phone}`, value: patient.emergencyContact?.phone, person: patient.emergencyContact?.name },
  ];

  const openAddForm = () => {
    setEditingEntry(null);
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (comm) => {
    setEditingEntry(comm);
    setDirection(comm.direction || 'Outbound');
    setMethod(comm.method || 'Phone');
    setContactPerson(comm.contactPerson || '');
    setContactRole(comm.contactRole || 'Patient');
    setSubject(comm.subject || '');
    setSummary(comm.summary || '');
    setOutcome(comm.outcome || '');
    setFollowUpDate(comm.followUpDate || '');
    setHipaaVerified(comm.hipaaVerified || false);
    setPhoneConsent(comm.phoneConsent || false);
    setCalledNumber(comm.calledNumber || '');
    setShowForm(true);
  };

  const handleSave = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const entryData = {
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
      hipaaVerified,
      phoneConsent,
      calledNumber,
    };
    if (editingEntry) {
      updateEntry(patient.id, 'communications', editingEntry.id, entryData);
    } else {
      addEntry(patient.id, 'communications', entryData);
    }
    setShowForm(false);
    setEditingEntry(null);
    resetForm();
  };

  const handleDelete = (commId) => {
    deleteEntry(patient.id, 'communications', commId);
    setDeleteTarget(null);
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
          <button onClick={openAddForm} className="btn-primary py-2 flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" /><span className="hidden sm:inline">Log Comm</span>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editingEntry ? 'Edit Communication' : 'Log Communication'} wide footer={<div className="flex justify-end gap-2"><button onClick={() => setShowForm(false)} className="btn-secondary py-2 text-xs">Cancel</button><button onClick={handleSave} className="btn-primary py-2 text-xs">{editingEntry ? 'Update' : 'Save'}</button></div>}>
        {/* Phone number + compliance */}
        <div className="bg-surface-alt rounded-xl p-3 mb-4 border border-border-light">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Phone Number</label>
              <select value={calledNumber} onChange={e => {
                setCalledNumber(e.target.value);
                const opt = phoneOptions.find(o => o.value === e.target.value);
                if (opt) setContactPerson(opt.person);
              }} className="input-field py-2 text-xs">
                <option value="">Select number...</option>
                {phoneOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                <option value="other">Other number...</option>
              </select>
              {calledNumber === 'other' && (
                <input type="tel" className="input-field py-2 text-xs mt-1.5" placeholder="Enter phone number..." value="" onChange={e => setCalledNumber(e.target.value)} />
              )}
            </div>
            <div className="flex flex-col justify-end gap-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={hipaaVerified} onChange={e => setHipaaVerified(e.target.checked)} className="w-4 h-4 accent-primary-600 rounded" />
                <span className="text-xs font-medium text-text-primary">HIPAA Identity Verified</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={phoneConsent} onChange={e => setPhoneConsent(e.target.checked)} className="w-4 h-4 accent-primary-600 rounded" />
                <span className="text-xs font-medium text-text-primary">Verbal Phone Consent</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Direction</label><select value={direction} onChange={e => setDirection(e.target.value)} className="input-field py-2 text-xs"><option>Outbound</option><option>Inbound</option></select></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Method</label><select value={method} onChange={e => setMethod(e.target.value)} className="input-field py-2 text-xs"><option>Phone</option><option>Fax</option><option>Email</option><option>In-Person</option><option>Portal</option></select></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Contact</label><input type="text" className="input-field py-2 text-xs" placeholder="Name" value={contactPerson} onChange={e => setContactPerson(e.target.value)} /></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Role</label><select value={contactRole} onChange={e => setContactRole(e.target.value)} className="input-field py-2 text-xs"><option>Patient</option><option>Family/Caregiver</option><option>PCP</option><option>Specialist</option><option>Insurance</option><option>Facility</option><option>Home Health</option><option>Pharmacy</option></select></div>
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        title="Delete Communication"
        message="Are you sure you want to delete this communication log? This action cannot be undone."
      />

      {/* List */}
      <div className="space-y-2">
        {filtered.map((comm) => {
          const DirIcon = directionIcons[comm.direction] || ChatBubbleLeftRightIcon;
          const isOpen = expandedComms.has(comm.id);
          const canEdit = isEditable(comm.id);
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
                {canEdit && (
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); openEditForm(comm); }}
                      className="p-1.5 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
                      title="Edit communication"
                    >
                      <PencilSquareIcon className="w-3.5 h-3.5 text-primary-500" />
                    </span>
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(comm.id); }}
                      className="p-1.5 rounded-lg hover:bg-danger-100 transition-colors cursor-pointer"
                      title="Delete communication"
                    >
                      <TrashIcon className="w-3.5 h-3.5 text-danger-500" />
                    </span>
                  </div>
                )}
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
