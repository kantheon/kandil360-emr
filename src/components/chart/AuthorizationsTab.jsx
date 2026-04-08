import { useState, useMemo } from 'react';
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import { useData } from '../../contexts/DataContext';

/* ─── Constants ─── */
const SERVICE_TYPES = [
  'Inpatient', 'Outpatient', 'Home Health', 'DME',
  'Skilled Nursing', 'Rehab', 'Behavioral Health', 'Pharmacy',
];

const PRIORITIES = ['Routine', 'Urgent', 'Expedited'];

const STATUSES = [
  'Pending Review', 'Approved', 'Denied', 'Pended',
  'Appeal Submitted', 'Appeal Approved', 'Appeal Denied', 'Expired',
];

const STATUS_CONFIG = {
  'Pending Review':   { badge: 'bg-warn-100 text-[#92400e] border-warn-200',       dot: 'bg-warn-400',     icon: ClockIcon },
  'Approved':         { badge: 'bg-accent-100 text-accent-700 border-accent-200',   dot: 'bg-accent-500',   icon: CheckCircleIcon },
  'Denied':           { badge: 'bg-danger-100 text-danger-600 border-danger-200',   dot: 'bg-danger-500',   icon: XCircleIcon },
  'Pended':           { badge: 'bg-primary-100 text-primary-700 border-primary-200', dot: 'bg-primary-500', icon: ArrowPathIcon },
  'Appeal Submitted': { badge: 'bg-purple-100 text-purple-700 border-purple-200',   dot: 'bg-purple-500',   icon: DocumentDuplicateIcon },
  'Appeal Approved':  { badge: 'bg-accent-100 text-accent-700 border-accent-200',   dot: 'bg-accent-500',   icon: CheckCircleIcon },
  'Appeal Denied':    { badge: 'bg-danger-100 text-danger-600 border-danger-200',   dot: 'bg-danger-500',   icon: XCircleIcon },
  'Expired':          { badge: 'bg-gray-100 text-gray-500 border-gray-200',         dot: 'bg-gray-400',     icon: ClockIcon },
};

/* Regulatory deadlines in hours by priority */
const REGULATORY_HOURS = { Routine: 14 * 24, Urgent: 72, Expedited: 24 };

/* ─── Helpers ─── */
function generateAuthNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AUTH-${ts}-${rand}`;
}

function getRegulatoryTimer(auth) {
  if (!['Pending Review', 'Pended'].includes(auth.status)) return null;
  const deadlineHours = REGULATORY_HOURS[auth.priority] || REGULATORY_HOURS.Routine;
  const requestDate = new Date(auth.requestDate);
  if (isNaN(requestDate.getTime())) return null;
  const deadlineDate = new Date(requestDate.getTime() + deadlineHours * 3600000);
  const now = new Date();
  const totalMs = deadlineHours * 3600000;
  const remainingMs = deadlineDate.getTime() - now.getTime();
  const pct = Math.max(0, Math.min(1, remainingMs / totalMs));

  let display;
  if (remainingMs <= 0) {
    display = 'OVERDUE';
  } else if (deadlineHours <= 72) {
    const hrs = Math.floor(remainingMs / 3600000);
    const mins = Math.floor((remainingMs % 3600000) / 60000);
    display = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  } else {
    const days = Math.ceil(remainingMs / 86400000);
    display = `${days}d`;
  }

  let color;
  if (remainingMs <= 0) color = 'bg-danger-100 text-danger-600 border-danger-200';
  else if (pct < 0.25) color = 'bg-danger-100 text-danger-600 border-danger-200';
  else if (pct < 0.50) color = 'bg-warn-100 text-[#92400e] border-warn-200';
  else color = 'bg-accent-100 text-accent-700 border-accent-200';

  return { display, color, pct, overdue: remainingMs <= 0 };
}

function getUtilizationPct(used, approved) {
  if (!approved || approved <= 0) return 0;
  return Math.min(100, Math.round((used / approved) * 100));
}

function getUtilizationColor(pct) {
  if (pct >= 90) return 'bg-danger-500';
  if (pct >= 75) return 'bg-warn-400';
  return 'bg-accent-500';
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/* ─── Component ─── */
export default function AuthorizationsTab({ patient }) {
  const { addEntry, updateEntry, deleteEntry, isEditable } = useData();

  /* UI state */
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedAuths, setExpandedAuths] = useState(new Set());

  /* Form state */
  const [authNumber, setAuthNumber] = useState('');
  const [insurancePlan, setInsurancePlan] = useState('');
  const [serviceType, setServiceType] = useState('Outpatient');
  const [serviceRequested, setServiceRequested] = useState('');
  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [clinicalRationale, setClinicalRationale] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [decisionDate, setDecisionDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [approvedUnits, setApprovedUnits] = useState('');
  const [usedUnits, setUsedUnits] = useState('');
  const [status, setStatus] = useState('Pending Review');
  const [reviewerName, setReviewerName] = useState('');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [priority, setPriority] = useState('Routine');
  const [linkedAdmissionId, setLinkedAdmissionId] = useState('');

  const allAuths = patient.authorizations || [];

  const toggleAuth = (id) => {
    setExpandedAuths(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ─── Stats ─── */
  const stats = useMemo(() => {
    const pending = allAuths.filter(a => ['Pending Review', 'Pended'].includes(a.status)).length;
    const approved = allAuths.filter(a => ['Approved', 'Appeal Approved'].includes(a.status)).length;
    const denied = allAuths.filter(a => ['Denied', 'Appeal Denied'].includes(a.status)).length;
    const now = new Date();
    const expiringSoon = allAuths.filter(a => {
      if (!['Approved', 'Appeal Approved'].includes(a.status) || !a.expirationDate) return false;
      const exp = new Date(a.expirationDate);
      const daysLeft = (exp - now) / 86400000;
      return daysLeft >= 0 && daysLeft <= 30;
    }).length;
    return { pending, approved, denied, expiringSoon };
  }, [allAuths]);

  /* ─── Form Helpers ─── */
  const resetForm = () => {
    setAuthNumber(''); setInsurancePlan(''); setServiceType('Outpatient');
    setServiceRequested(''); setDiagnosisCode(''); setClinicalRationale('');
    setRequestDate(''); setDecisionDate(''); setExpirationDate('');
    setApprovedUnits(''); setUsedUnits(''); setStatus('Pending Review');
    setReviewerName(''); setDecisionNotes(''); setPriority('Routine');
    setLinkedAdmissionId(''); setEditingEntry(null);
  };

  const openAddModal = () => {
    resetForm();
    setAuthNumber(generateAuthNumber());
    setInsurancePlan(patient.insurance?.plan || '');
    setRequestDate(todayStr());
    setShowForm(true);
  };

  const openEditModal = (auth) => {
    setEditingEntry(auth);
    setAuthNumber(auth.authNumber || '');
    setInsurancePlan(auth.insurancePlan || '');
    setServiceType(auth.serviceType || 'Outpatient');
    setServiceRequested(auth.serviceRequested || '');
    setDiagnosisCode(auth.diagnosisCode || '');
    setClinicalRationale(auth.clinicalRationale || '');
    setRequestDate(auth.requestDate || '');
    setDecisionDate(auth.decisionDate || '');
    setExpirationDate(auth.expirationDate || '');
    setApprovedUnits(auth.approvedUnits ?? '');
    setUsedUnits(auth.usedUnits ?? '');
    setStatus(auth.status || 'Pending Review');
    setReviewerName(auth.reviewerName || '');
    setDecisionNotes(auth.decisionNotes || '');
    setPriority(auth.priority || 'Routine');
    setLinkedAdmissionId(auth.linkedAdmissionId || '');
    setShowForm(true);
  };

  const handleSave = () => {
    const entry = {
      authNumber: authNumber || generateAuthNumber(),
      insurancePlan,
      serviceType,
      serviceRequested,
      diagnosisCode,
      clinicalRationale,
      requestDate,
      decisionDate: decisionDate || null,
      expirationDate: expirationDate || null,
      approvedUnits: approvedUnits !== '' ? Number(approvedUnits) : null,
      usedUnits: usedUnits !== '' ? Number(usedUnits) : 0,
      status,
      reviewerName,
      decisionNotes,
      priority,
      linkedAdmissionId: linkedAdmissionId || null,
    };
    if (editingEntry) {
      updateEntry(patient.id, 'authorizations', editingEntry.id, entry);
    } else {
      addEntry(patient.id, 'authorizations', entry);
    }
    setShowForm(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteEntry(patient.id, 'authorizations', deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  /* ─── Allowed status transitions ─── */
  const getAllowedStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending Review': return ['Pending Review', 'Approved', 'Denied', 'Pended'];
      case 'Pended': return ['Pended', 'Approved', 'Denied', 'Pending Review'];
      case 'Denied': return ['Denied', 'Appeal Submitted'];
      case 'Appeal Submitted': return ['Appeal Submitted', 'Appeal Approved', 'Appeal Denied'];
      default: return STATUSES;
    }
  };

  /* ─── Search / filter ─── */
  const filtered = allAuths.filter(auth => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [
      auth.authNumber, auth.serviceType, auth.serviceRequested,
      auth.diagnosisCode, auth.status, auth.reviewerName, auth.insurancePlan,
      auth.priority,
    ].filter(Boolean).join(' ').toLowerCase().includes(q);
  });

  /* ─── Available admissions for linking ─── */
  const admissions = patient.admissions || [];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
            <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Authorizations</h2>
            <p className="text-xs text-text-muted mt-0.5">{allAuths.length} authorization{allAuths.length !== 1 ? 's' : ''} on file</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search authorizations..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-xs" />
          </div>
          <button onClick={openAddModal} className="btn-primary py-2 flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" /><span className="hidden sm:inline">New Auth Request</span>
          </button>
        </div>
      </div>

      {/* ─── Summary Stats ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-warn-50 rounded-2xl p-3 text-center border border-warn-100">
          <p className="text-xl font-bold text-[#92400e]">{stats.pending}</p>
          <p className="text-[11px] font-medium text-[#92400e]">Pending</p>
        </div>
        <div className="bg-accent-50 rounded-2xl p-3 text-center border border-accent-100">
          <p className="text-xl font-bold text-accent-600">{stats.approved}</p>
          <p className="text-[11px] font-medium text-accent-700">Approved</p>
        </div>
        <div className="bg-danger-50 rounded-2xl p-3 text-center border border-danger-100">
          <p className="text-xl font-bold text-danger-500">{stats.denied}</p>
          <p className="text-[11px] font-medium text-danger-600">Denied</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-3 text-center border border-purple-100">
          <p className="text-xl font-bold text-purple-600">{stats.expiringSoon}</p>
          <p className="text-[11px] font-medium text-purple-700">Expiring Soon</p>
        </div>
      </div>

      {/* ─── Add/Edit Modal ─── */}
      <Modal open={showForm} onClose={() => { setShowForm(false); resetForm(); }} title={editingEntry ? 'Edit Authorization' : 'New Auth Request'} wide footer={
        <div className="flex justify-end gap-2">
          <button onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary py-2 text-xs">Cancel</button>
          <button onClick={handleSave} disabled={!serviceRequested || !requestDate} className={`btn-primary py-2 text-xs ${(!serviceRequested || !requestDate) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {editingEntry ? 'Update Authorization' : 'Submit Auth Request'}
          </button>
        </div>
      }>
        <div className="space-y-4">
          {/* Section: Request Info */}
          <div className="bg-surface-alt rounded-xl p-4 border border-border-light space-y-3">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 bg-purple-100 text-purple-700 rounded text-[9px] font-bold flex items-center justify-center">R</span>
              Request Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Auth Number</label>
                <input type="text" className="input-field py-2 text-xs bg-surface-alt" value={authNumber} onChange={e => setAuthNumber(e.target.value)} placeholder="Auto-generated" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Insurance Plan</label>
                <input type="text" className="input-field py-2 text-xs" value={insurancePlan} onChange={e => setInsurancePlan(e.target.value)} placeholder="Insurance plan" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Service Type</label>
                <select value={serviceType} onChange={e => setServiceType(e.target.value)} className="input-field py-2 text-xs">
                  {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className="input-field py-2 text-xs">
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Service Requested</label>
              <input type="text" className="input-field py-2 text-xs" value={serviceRequested} onChange={e => setServiceRequested(e.target.value)} placeholder="e.g. Physical therapy 3x/week" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Diagnosis Code (ICD-10)</label>
                <input type="text" className="input-field py-2 text-xs" value={diagnosisCode} onChange={e => setDiagnosisCode(e.target.value)} placeholder="e.g. M54.5" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Request Date</label>
                <input type="date" className="input-field py-2 text-xs" value={requestDate} onChange={e => setRequestDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Clinical Rationale</label>
              <textarea className="textarea-field text-xs !min-h-[60px]" rows={3} value={clinicalRationale} onChange={e => setClinicalRationale(e.target.value)} placeholder="Provide clinical justification for the requested service..." />
            </div>
          </div>

          {/* Section: Decision */}
          <div className="bg-surface-alt rounded-xl p-4 border border-border-light space-y-3">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 bg-primary-100 text-primary-700 rounded text-[9px] font-bold flex items-center justify-center">D</span>
              Decision
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="input-field py-2 text-xs">
                  {(editingEntry ? getAllowedStatuses(editingEntry.status) : STATUSES).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Decision Date</label>
                <input type="date" className="input-field py-2 text-xs" value={decisionDate} onChange={e => setDecisionDate(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Expiration Date</label>
                <input type="date" className="input-field py-2 text-xs" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Approved Units/Days</label>
                <input type="number" min="0" className="input-field py-2 text-xs" value={approvedUnits} onChange={e => setApprovedUnits(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Used Units/Days</label>
                <input type="number" min="0" className="input-field py-2 text-xs" value={usedUnits} onChange={e => setUsedUnits(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Reviewer Name</label>
                <input type="text" className="input-field py-2 text-xs" value={reviewerName} onChange={e => setReviewerName(e.target.value)} placeholder="Reviewer" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Decision Notes</label>
              <textarea className="textarea-field text-xs !min-h-[60px]" rows={3} value={decisionNotes} onChange={e => setDecisionNotes(e.target.value)} placeholder="Notes regarding the authorization decision..." />
            </div>
          </div>

          {/* Section: Linked Admission */}
          {admissions.length > 0 && (
            <div className="bg-surface-alt rounded-xl p-4 border border-border-light">
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-4 h-4 bg-accent-100 text-accent-700 rounded text-[9px] font-bold flex items-center justify-center">L</span>
                Link to Admission (optional)
              </p>
              <select value={linkedAdmissionId} onChange={e => setLinkedAdmissionId(e.target.value)} className="input-field py-2 text-xs">
                <option value="">None</option>
                {admissions.map(adm => (
                  <option key={adm.id} value={adm.id}>
                    {adm.facility} - {adm.admitDate} ({adm.admitDiagnosis})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Modal>

      {/* ─── Confirm Delete ─── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Authorization"
        message="Are you sure you want to delete this authorization record? This action cannot be undone."
      />

      {/* ─── Auth Cards ─── */}
      <div className="space-y-2">
        {filtered.map((auth) => {
          const isOpen = expandedAuths.has(auth.id);
          const editable = isEditable(auth.id);
          const cfg = STATUS_CONFIG[auth.status] || STATUS_CONFIG['Pending Review'];
          const StatusIcon = cfg.icon;
          const timer = getRegulatoryTimer(auth);
          const utilPct = getUtilizationPct(auth.usedUnits || 0, auth.approvedUnits);
          const isApproved = ['Approved', 'Appeal Approved'].includes(auth.status);

          return (
            <div key={auth.id} className="card p-0 overflow-hidden">
              {/* Collapsed header */}
              <button onClick={() => toggleAuth(auth.id)} className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 bg-surface-alt hover:bg-surface-hover transition-colors cursor-pointer text-left">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isApproved ? 'bg-accent-100' :
                  auth.status === 'Denied' || auth.status === 'Appeal Denied' ? 'bg-danger-100' :
                  auth.status === 'Appeal Submitted' ? 'bg-purple-100' :
                  auth.status === 'Pended' ? 'bg-primary-100' :
                  auth.status === 'Expired' ? 'bg-gray-100' :
                  'bg-warn-100'
                }`}>
                  <StatusIcon className={`w-4.5 h-4.5 ${
                    isApproved ? 'text-accent-600' :
                    auth.status === 'Denied' || auth.status === 'Appeal Denied' ? 'text-danger-500' :
                    auth.status === 'Appeal Submitted' ? 'text-purple-600' :
                    auth.status === 'Pended' ? 'text-primary-600' :
                    auth.status === 'Expired' ? 'text-gray-500' :
                    'text-warn-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-text-primary">{auth.authNumber}</span>
                    <span className={`badge border text-[10px] ${cfg.badge}`}>{auth.status}</span>
                    {auth.priority !== 'Routine' && (
                      <span className={`badge border text-[10px] ${auth.priority === 'Urgent' ? 'bg-danger-100 text-danger-600 border-danger-200' : 'bg-warn-100 text-[#92400e] border-warn-200'}`}>
                        {auth.priority}
                      </span>
                    )}
                    {timer && (
                      <span className={`badge border text-[10px] font-mono ${timer.color}`}>
                        {timer.overdue && <ExclamationTriangleIcon className="w-3 h-3 mr-0.5 inline" />}
                        {timer.display}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5 truncate">
                    {auth.serviceType} &middot; {auth.serviceRequested}
                    {auth.requestDate && <> &middot; Requested {auth.requestDate}</>}
                  </div>
                </div>
                {editable && (
                  <div className="flex items-center gap-1 shrink-0">
                    <span role="button" onClick={e => { e.stopPropagation(); openEditModal(auth); }} className="p-1.5 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer" title="Edit authorization">
                      <PencilSquareIcon className="w-3.5 h-3.5 text-primary-500" />
                    </span>
                    <span role="button" onClick={e => { e.stopPropagation(); setDeleteTarget(auth); }} className="p-1.5 rounded-lg hover:bg-danger-100 transition-colors cursor-pointer" title="Delete authorization">
                      <TrashIcon className="w-3.5 h-3.5 text-danger-500" />
                    </span>
                  </div>
                )}
                {isOpen ? <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />}
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="p-4 lg:p-5 border-t border-border-light animate-fade-in space-y-4">
                  {/* Utilization bar for approved auths */}
                  {isApproved && auth.approvedUnits > 0 && (
                    <div className="bg-surface-alt rounded-xl p-3 border border-border-light">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Utilization</p>
                        <p className="text-xs font-semibold text-text-primary">{auth.usedUnits || 0} / {auth.approvedUnits} units</p>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getUtilizationColor(utilPct)}`}
                          style={{ width: `${utilPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-text-muted">{utilPct}% utilized</p>
                        {auth.expirationDate && (
                          <p className="text-[10px] text-text-muted">Expires {auth.expirationDate}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Regulatory timer detail for pending auths */}
                  {timer && (
                    <div className={`rounded-xl p-3 border flex items-center gap-3 ${timer.overdue ? 'bg-danger-50 border-danger-200' : 'bg-surface-alt border-border-light'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${timer.overdue ? 'bg-danger-100' : 'bg-warn-100'}`}>
                        <ClockIcon className={`w-4 h-4 ${timer.overdue ? 'text-danger-500' : 'text-warn-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${timer.overdue ? 'text-danger-600' : 'text-text-primary'}`}>
                          {timer.overdue ? 'Regulatory Deadline Exceeded' : 'Regulatory Deadline'}
                        </p>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {auth.priority === 'Routine' && 'CMS requirement: 14 calendar days for standard review'}
                          {auth.priority === 'Urgent' && 'CMS requirement: 72 hours for urgent review'}
                          {auth.priority === 'Expedited' && 'CMS requirement: 24 hours for expedited review'}
                        </p>
                      </div>
                      <span className={`badge border text-xs font-mono font-bold ${timer.color}`}>{timer.display}</span>
                    </div>
                  )}

                  {/* Detail grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      ['Insurance Plan', auth.insurancePlan],
                      ['Service Type', auth.serviceType],
                      ['Diagnosis Code', auth.diagnosisCode || 'N/A'],
                      ['Priority', auth.priority],
                      ['Request Date', auth.requestDate || 'N/A'],
                      ['Decision Date', auth.decisionDate || 'Pending'],
                      ['Expiration Date', auth.expirationDate || 'N/A'],
                      ['Reviewer', auth.reviewerName || 'Unassigned'],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-surface-alt rounded-lg p-2.5">
                        <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{label}</p>
                        <p className="text-xs font-semibold text-text-primary mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Service & rationale */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-surface-alt rounded-lg p-2.5">
                      <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Service Requested</p>
                      <p className="text-xs text-text-primary mt-0.5">{auth.serviceRequested}</p>
                    </div>
                    {auth.clinicalRationale && (
                      <div className="bg-surface-alt rounded-lg p-2.5">
                        <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Clinical Rationale</p>
                        <p className="text-xs text-text-primary mt-0.5">{auth.clinicalRationale}</p>
                      </div>
                    )}
                  </div>

                  {/* Decision notes */}
                  {auth.decisionNotes && (
                    <div className="bg-surface-alt rounded-lg p-2.5">
                      <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Decision Notes</p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{auth.decisionNotes}</p>
                    </div>
                  )}

                  {/* Linked admission */}
                  {auth.linkedAdmissionId && (() => {
                    const linked = admissions.find(a => a.id === auth.linkedAdmissionId);
                    if (!linked) return null;
                    return (
                      <div className="bg-primary-50/50 rounded-lg p-2.5 border border-primary-100/50">
                        <p className="text-[10px] text-primary-600 font-medium uppercase tracking-wider">Linked Admission</p>
                        <p className="text-xs font-semibold text-primary-800 mt-0.5">{linked.facility}</p>
                        <p className="text-[10px] text-primary-500 mt-0.5">Admitted {linked.admitDate} &middot; {linked.admitDiagnosis}</p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Empty state ─── */}
      {filtered.length === 0 && allAuths.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-text-muted">No authorizations match &ldquo;{search}&rdquo;</p>
        </div>
      )}
      {allAuths.length === 0 && (
        <div className="text-center py-12">
          <ShieldCheckIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">No authorizations on file</p>
          <p className="text-xs text-text-muted mt-1">Click &ldquo;New Auth Request&rdquo; to submit the first authorization</p>
        </div>
      )}
    </div>
  );
}
