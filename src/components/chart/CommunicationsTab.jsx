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
import { getPatientContacts, addCustomContact } from '../../data/contactHelpers';

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

  const [showNewContact, setShowNewContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRole, setNewContactRole] = useState('Other');
  const [contactsVersion, setContactsVersion] = useState(0);

  const contacts = getPatientContacts(patient);
  void contactsVersion; // trigger re-render when contacts change

  const resetForm = () => {
    setDirection('Outbound'); setMethod('Phone'); setContactPerson(''); setContactRole('Patient');
    setSubject(''); setSummary(''); setOutcome(''); setFollowUpDate('');
    setHipaaVerified(false); setPhoneConsent(false); setCalledNumber('');
    setShowNewContact(false);
  };

  const handleSelectContact = (idx) => {
    if (idx === '__new__') {
      setShowNewContact(true);
      setContactPerson('');
      setCalledNumber('');
      setContactRole('Other');
      return;
    }
    setShowNewContact(false);
    const c = contacts[idx];
    if (c) {
      setContactPerson(c.name);
      setCalledNumber(c.phone || '');
      setContactRole(c.role || 'Other');
    }
  };

  const handleSaveNewContact = () => {
    if (!newContactName.trim()) return;
    const contact = { name: newContactName.trim(), phone: newContactPhone.trim(), role: newContactRole };
    addCustomContact(patient.id, contact);
    setContactPerson(contact.name);
    setCalledNumber(contact.phone);
    setContactRole(contact.role);
    setShowNewContact(false);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRole('Other');
    setContactsVersion(v => v + 1);
  };

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
        {/* Contact selection */}
        <div className="bg-surface-alt rounded-xl p-3 mb-4 border border-border-light space-y-3">
          <div>
            <label className="text-xs font-semibold text-text-primary mb-1.5 block">Contact</label>
            <select className="input-field py-2 text-xs" onChange={e => handleSelectContact(e.target.value)} value={showNewContact ? '__new__' : contacts.findIndex(c => c.name === contactPerson)}>
              <option value="">Select contact...</option>
              {contacts.map((c, i) => (
                <option key={i} value={i}>{c.name} ({c.role}){c.phone ? ` - ${c.phone}` : ''}</option>
              ))}
              <option value="__new__">+ Add New Contact</option>
            </select>
          </div>

          {showNewContact && (
            <div className="bg-white rounded-lg p-3 border border-primary-200 space-y-2">
              <p className="text-[11px] font-semibold text-primary-700">New Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input type="text" className="input-field py-2 text-xs" placeholder="Name" value={newContactName} onChange={e => setNewContactName(e.target.value)} />
                <input type="tel" className="input-field py-2 text-xs" placeholder="Phone number" value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} />
                <select className="input-field py-2 text-xs" value={newContactRole} onChange={e => setNewContactRole(e.target.value)}>
                  <option>Patient</option><option>Family/Caregiver</option><option>PCP</option><option>Specialist</option><option>Insurance</option><option>Facility</option><option>Home Health</option><option>Pharmacy</option><option>Case Manager</option><option>Other</option>
                </select>
              </div>
              <button onClick={handleSaveNewContact} disabled={!newContactName.trim()} className={`btn-primary py-1.5 text-xs ${!newContactName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>Save Contact</button>
            </div>
          )}

          {!showNewContact && contactPerson && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-text-muted mb-0.5 block">Name</label>
                <p className="text-xs font-medium text-text-primary">{contactPerson}</p>
              </div>
              <div>
                <label className="text-[10px] text-text-muted mb-0.5 block">Phone</label>
                <p className="text-xs font-medium text-text-primary">{calledNumber || 'N/A'}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hipaaVerified} onChange={e => setHipaaVerified(e.target.checked)} className="w-4 h-4 accent-primary-600 rounded" />
              <span className="text-xs font-medium text-text-primary">HIPAA Verified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={phoneConsent} onChange={e => setPhoneConsent(e.target.checked)} className="w-4 h-4 accent-primary-600 rounded" />
              <span className="text-xs font-medium text-text-primary">Phone Consent</span>
            </label>
          </div>
        </div>

        {/* Direction, Method, Role */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Direction</label><select value={direction} onChange={e => setDirection(e.target.value)} className="input-field py-2 text-xs"><option>Outbound</option><option>Inbound</option></select></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Method</label><select value={method} onChange={e => setMethod(e.target.value)} className="input-field py-2 text-xs"><option>Phone</option><option>Fax</option><option>Email</option><option>In-Person</option><option>Portal</option></select></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Role</label><select value={contactRole} onChange={e => setContactRole(e.target.value)} className="input-field py-2 text-xs"><option>Patient</option><option>Family/Caregiver</option><option>PCP</option><option>Specialist</option><option>Insurance</option><option>Facility</option><option>Home Health</option><option>Pharmacy</option><option>Case Manager</option><option>Other</option></select></div>
        </div>
        <div className="space-y-3 mb-4">
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Subject</label><input type="text" className="input-field py-2 text-xs" placeholder="Brief subject" value={subject} onChange={e => setSubject(e.target.value)} /></div>
          <div><label className="text-xs font-medium text-text-secondary mb-1 block">Summary</label><textarea className="textarea-field text-xs" rows={3} placeholder="Summarize..." value={summary} onChange={e => setSummary(e.target.value)} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
