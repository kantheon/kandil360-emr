import { useState, useMemo, useCallback } from 'react';
import {
  FlagIcon, CheckCircleIcon, ClockIcon, PlusIcon, TrashIcon,
  ChevronDownIcon, ChevronUpIcon, CalendarIcon, XCircleIcon,
  DocumentTextIcon, PencilSquareIcon, ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import SearchableDropdown from '../SearchableDropdown';
import { carePlanLibrary } from '../../data/carePlanLibrary';
import { useData } from '../../contexts/DataContext';
import { getPatientEntries } from '../../data/localStore';

/* ── Constants ──────────────────────────────────────────────────────── */

const INTERVENTION_STATUSES = [
  'Initiated', 'In Progress', 'Completed', 'Partially Met', 'Not Met', 'Deferred',
];

const GOAL_STATUSES = [
  'Initiated', 'In Progress', 'Completed', 'Partially Met', 'Not Met', 'Deferred',
];

const STATUS_STYLE = {
  'Initiated':    { bg: 'bg-slate-50',   text: 'text-slate-600',    border: 'border-slate-200',  icon: ClockIcon,       iconClr: 'text-slate-400', dot: 'bg-slate-400'  },
  'In Progress':  { bg: 'bg-warn-50',    text: 'text-[#92400e]',    border: 'border-warn-200',   icon: ClockIcon,       iconClr: 'text-warn-500',  dot: 'bg-warn-400'   },
  'Completed':    { bg: 'bg-accent-50',  text: 'text-accent-700',   border: 'border-accent-200', icon: CheckCircleIcon, iconClr: 'text-accent-500',dot: 'bg-accent-500' },
  'Partially Met':{ bg: 'bg-primary-50', text: 'text-primary-700',  border: 'border-primary-200',icon: ClockIcon,       iconClr: 'text-primary-500',dot:'bg-primary-400'},
  'Not Met':      { bg: 'bg-danger-50',  text: 'text-danger-600',   border: 'border-danger-200', icon: XCircleIcon,     iconClr: 'text-danger-500',dot: 'bg-danger-400' },
  'Deferred':     { bg: 'bg-surface-alt',text: 'text-text-muted',   border: 'border-border',     icon: ClockIcon,       iconClr: 'text-text-muted',dot: 'bg-gray-300'   },
};

function getStyle(status) {
  return STATUS_STYLE[status] || STATUS_STYLE['Initiated'];
}

function formatNow() {
  const now = new Date();
  return {
    date: now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

/* ── Main Component ──────────────────────────────────────────────────── */

export default function CarePlanTab({ patient }) {
  const { addEntry, updateEntry, deleteEntry, isEditable, version } = useData();

  const [expandedGoals, setExpandedGoals] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const allGoals = patient.carePlan.goals;

  // Fetch all progress entries once, grouped by goalId
  const progressByGoal = useMemo(() => {
    const all = getPatientEntries(patient.id, 'carePlanProgress');
    const map = {};
    all.forEach(e => {
      if (!map[e.goalId]) map[e.goalId] = [];
      map[e.goalId].push(e);
    });
    // Sort each group newest-first
    Object.values(map).forEach(arr => arr.sort((a, b) => {
      const da = a.createdAt || '';
      const db = b.createdAt || '';
      return db.localeCompare(da);
    }));
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.id, version]);

  const toggleExpand = (id) => setExpandedGoals(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const handleDelete = () => {
    if (deleteTarget) {
      deleteEntry(patient.id, 'carePlanGoals', deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // Summary counts based on latest documentation or goal default
  const getGoalCurrentStatus = (goal) => {
    const entries = progressByGoal[goal.id];
    if (entries && entries.length > 0) return entries[0].goalStatus || 'Initiated';
    return goal.status || 'Initiated';
  };

  const completed = allGoals.filter(g => getGoalCurrentStatus(g) === 'Completed').length;
  const active = allGoals.filter(g => ['In Progress', 'Partially Met'].includes(getGoalCurrentStatus(g))).length;
  const initiated = allGoals.filter(g => getGoalCurrentStatus(g) === 'Initiated').length;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Care Plan</h2>
          <p className="text-xs text-text-muted mt-0.5">
            {allGoals.length} goal{allGoals.length !== 1 && 's'}
            {patient.carePlan.barriers.length > 0 && ` \u00B7 ${patient.carePlan.barriers.length} barrier${patient.carePlan.barriers.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary py-2 flex items-center gap-1.5">
          <PlusIcon className="w-4 h-4" /><span className="hidden sm:inline">Add Goal</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-accent-50 rounded-2xl p-2.5 sm:p-3 text-center border border-accent-100">
          <p className="text-lg sm:text-xl font-bold text-accent-600">{completed}</p>
          <p className="text-[10px] sm:text-[11px] font-medium text-accent-700">Completed</p>
        </div>
        <div className="bg-primary-50 rounded-2xl p-2.5 sm:p-3 text-center border border-primary-100">
          <p className="text-lg sm:text-xl font-bold text-primary-600">{active}</p>
          <p className="text-[10px] sm:text-[11px] font-medium text-primary-700">Active</p>
        </div>
        <div className="bg-surface-alt rounded-2xl p-2.5 sm:p-3 text-center border border-border-light">
          <p className="text-lg sm:text-xl font-bold text-text-secondary">{initiated}</p>
          <p className="text-[10px] sm:text-[11px] font-medium text-text-muted">Initiated</p>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-2">
        {allGoals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            patient={patient}
            entries={progressByGoal[goal.id] || []}
            isOpen={expandedGoals.has(goal.id)}
            onToggle={() => toggleExpand(goal.id)}
            onDelete={() => setDeleteTarget(goal)}
            addEntry={addEntry}
            isEditable={isEditable}
          />
        ))}
        {allGoals.length === 0 && (
          <div className="card p-8 text-center">
            <FlagIcon className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-muted">No care plan goals yet.</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary py-2 mt-3 text-xs">
              <PlusIcon className="w-4 h-4 inline mr-1" />Add First Goal
            </button>
          </div>
        )}
      </div>

      {/* Barriers Section */}
      {patient.carePlan.barriers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <ExclamationCircleIcon className="w-4 h-4 text-warn-500" /> Barriers to Care
          </h3>
          <div className="card p-4 space-y-2">
            {patient.carePlan.barriers.map((barrier, i) => (
              <div key={i} className="flex items-start gap-2 bg-warn-50 rounded-lg p-2.5 border border-warn-100">
                <span className="w-5 h-5 bg-warn-100 rounded-md flex items-center justify-center text-[10px] font-bold text-[#92400e] shrink-0">{i + 1}</span>
                <p className="text-xs text-text-secondary">{barrier}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this care plan goal? This action cannot be undone."
      />

      {/* Add Goal Modal */}
      <AddGoalModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        patientId={patient.id}
        addEntry={addEntry}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   GoalCard
   Shows: header -> current intervention statuses -> new doc button -> history
   ══════════════════════════════════════════════════════════════════════ */

function GoalCard({ goal, patient, entries, isOpen, onToggle, onDelete, addEntry, isEditable }) {
  const interventions = goal.interventions || [];
  const editable = isEditable(goal.id);

  // Derive current statuses from the most recent documentation entry
  const latestEntry = entries.length > 0 ? entries[0] : null;
  const currentGoalStatus = latestEntry?.goalStatus || 'Initiated';
  const currentIvStatuses = useMemo(() => {
    if (!latestEntry?.interventionStatuses) {
      return interventions.map(iv => ({ intervention: iv, status: 'Initiated' }));
    }
    // Map interventions to their status from the latest entry; default to 'Initiated' if missing
    return interventions.map(iv => {
      const found = latestEntry.interventionStatuses.find(s => s.intervention === iv);
      return { intervention: iv, status: found?.status || 'Initiated' };
    });
  }, [latestEntry, interventions]);

  const style = getStyle(currentGoalStatus);
  const StatusIcon = style.icon;

  // Documentation form state
  const [showDocForm, setShowDocForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="card p-0 overflow-hidden">
      {/* Collapsed Header */}
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-alt transition-colors cursor-pointer text-left">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentGoalStatus === 'Completed' ? 'bg-accent-100' : 'bg-primary-50'}`}>
          <StatusIcon className={`w-4 h-4 ${style.iconClr}`} />
        </div>
        <div className="flex-1 min-w-0">
          {goal.healthConcern && (
            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{goal.healthConcern}</p>
          )}
          <p className={`text-sm font-medium leading-snug ${currentGoalStatus === 'Completed' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
            {goal.description}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            Target: {goal.targetDate || 'Not set'}
            {interventions.length > 0 && ` \u00B7 ${interventions.length} intervention${interventions.length !== 1 ? 's' : ''}`}
            {entries.length > 0 && ` \u00B7 ${entries.length} doc${entries.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <span className={`badge border text-[10px] shrink-0 ${style.bg} ${style.text} ${style.border}`}>
          {currentGoalStatus}
        </span>
        {editable && (
          <span
            onClick={e => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-500 cursor-pointer transition-colors shrink-0"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </span>
        )}
        {isOpen
          ? <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" />
          : <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />
        }
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-border-light pt-3 animate-fade-in space-y-4">

          {/* Goal Info Bar */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-text-muted">Health Concern:</span>
            <span className="font-medium text-text-primary">{goal.healthConcern || 'Not specified'}</span>
            <span className="text-text-muted ml-2">Status:</span>
            <span className={`badge border text-[10px] ${style.bg} ${style.text} ${style.border}`}>{currentGoalStatus}</span>
            {goal.targetDate && (
              <>
                <span className="text-text-muted ml-2">Target:</span>
                <span className="font-medium text-text-primary">{goal.targetDate}</span>
              </>
            )}
          </div>

          {/* Current Intervention Status Table */}
          <div>
            <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Current Intervention Status
            </p>
            {interventions.length > 0 ? (
              <div className="rounded-xl border border-border-light overflow-hidden">
                {currentIvStatuses.map((item, i) => {
                  const ivSt = getStyle(item.status);
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2.5 text-xs ${i > 0 ? 'border-t border-border-light' : ''}`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${ivSt.dot}`} />
                      <span className={`flex-1 min-w-0 ${item.status === 'Completed' ? 'line-through text-text-muted' : 'text-text-secondary'}`}>
                        {item.intervention}
                      </span>
                      <span className={`badge border text-[9px] shrink-0 ${ivSt.bg} ${ivSt.text} ${ivSt.border}`}>
                        {item.status}
                        {item.status === 'Completed' && ' \u2713'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-text-muted">No interventions documented yet.</p>
            )}
          </div>

          {/* New Documentation Button / Form */}
          {!showDocForm ? (
            <button
              onClick={() => setShowDocForm(true)}
              className="btn-primary py-2.5 sm:py-2 px-4 text-xs flex items-center gap-1.5 w-full sm:w-auto"
            >
              <PencilSquareIcon className="w-4 h-4" /> New Documentation
            </button>
          ) : (
            <DocumentationForm
              goal={goal}
              patient={patient}
              interventions={interventions}
              currentIvStatuses={currentIvStatuses}
              currentGoalStatus={currentGoalStatus}
              addEntry={addEntry}
              onClose={() => setShowDocForm(false)}
            />
          )}

          {/* Documentation History */}
          <div className="border-t border-border-light pt-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
            >
              {showHistory ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
              <CalendarIcon className="w-3.5 h-3.5" />
              Documentation History
              {entries.length > 0 && (
                <span className="badge badge-info text-[9px] ml-1">{entries.length}</span>
              )}
            </button>

            {showHistory && (
              <div className="mt-2 space-y-2 animate-fade-in">
                {entries.length === 0 ? (
                  <p className="text-xs text-text-muted py-2 text-center">No documentation entries yet.</p>
                ) : (
                  entries.map((entry, i) => (
                    <HistoryEntry key={entry.id || i} entry={entry} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   DocumentationForm
   Inline form: status per intervention + goal status + note
   ══════════════════════════════════════════════════════════════════════ */

function DocumentationForm({ goal, patient, interventions, currentIvStatuses, currentGoalStatus, addEntry, onClose }) {
  const [goalStatus, setGoalStatus] = useState(currentGoalStatus);
  const [ivStatuses, setIvStatuses] = useState(() =>
    currentIvStatuses.map(item => ({ intervention: item.intervention, status: item.status }))
  );
  const [note, setNote] = useState('');

  const updateIvStatus = useCallback((index, newStatus) => {
    setIvStatuses(prev => {
      const next = [...prev];
      next[index] = { ...next[index], status: newStatus };
      return next;
    });
  }, []);

  const handleSave = () => {
    const { date, time } = formatNow();
    addEntry(patient.id, 'carePlanProgress', {
      goalId: goal.id,
      goalDescription: goal.description,
      healthConcern: goal.healthConcern || '',
      goalStatus,
      interventionStatuses: ivStatuses,
      note: note.trim(),
      date,
      time,
      author: 'Current User',
    });
    onClose();
  };

  return (
    <div className="bg-primary-50/30 rounded-xl border border-primary-100 p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
          <PencilSquareIcon className="w-3.5 h-3.5 text-primary-500" />
          New Documentation Entry
        </h4>
        <button
          onClick={onClose}
          className="text-[10px] text-text-muted hover:text-text-primary cursor-pointer transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Overall Goal Status */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
        <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
          Goal Status
        </label>
        <select
          className="input-field py-1.5 text-xs w-full sm:w-auto sm:min-w-[160px]"
          value={goalStatus}
          onChange={e => setGoalStatus(e.target.value)}
        >
          {GOAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Intervention Statuses */}
      {interventions.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Intervention Statuses
          </p>
          <div className="space-y-1.5">
            {ivStatuses.map((item, i) => {
              const ivSt = getStyle(item.status);
              return (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg bg-white p-2.5 border border-border-light">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${ivSt.dot}`} />
                    <span className="text-xs text-text-secondary flex-1">{item.intervention}</span>
                  </div>
                  <select
                    value={item.status}
                    onChange={e => updateIvStatus(i, e.target.value)}
                    className="input-field py-1 px-2 text-[10px] font-semibold w-full sm:w-auto sm:min-w-[130px] shrink-0"
                  >
                    {INTERVENTION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1 block">
          Documentation Note
        </label>
        <textarea
          className="textarea-field text-xs !min-h-[64px]"
          rows={3}
          placeholder="Observations, patient response, follow-up actions..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      {/* Save / Cancel */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleSave}
          className="btn-primary py-2.5 sm:py-2 px-5 text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto"
        >
          <CheckCircleIcon className="w-4 h-4" /> Save Documentation
        </button>
        <button
          onClick={onClose}
          className="btn-secondary py-2.5 sm:py-2 px-4 text-xs w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HistoryEntry
   A single documentation entry in the history list, collapsible.
   ══════════════════════════════════════════════════════════════════════ */

function HistoryEntry({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const st = getStyle(entry.goalStatus || 'Initiated');
  const ivList = entry.interventionStatuses || [];

  return (
    <div className="bg-surface-alt rounded-xl border border-border-light overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer hover:bg-surface-hover transition-colors"
      >
        {expanded
          ? <ChevronUpIcon className="w-3 h-3 text-text-muted shrink-0" />
          : <ChevronDownIcon className="w-3 h-3 text-text-muted shrink-0" />
        }
        <span className="text-[11px] font-medium text-text-primary">{entry.date} {entry.time}</span>
        <span className={`badge border text-[9px] ${st.bg} ${st.text} ${st.border}`}>
          {entry.goalStatus || 'Initiated'}
        </span>
        {entry.note && (
          <span className="text-[10px] text-text-muted truncate flex-1 min-w-0">
            &mdash; {entry.note.length > 60 ? entry.note.slice(0, 60) + '...' : entry.note}
          </span>
        )}
        {entry.author && (
          <span className="text-[10px] text-text-muted shrink-0">{entry.author}</span>
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-border-light pt-2.5 animate-fade-in space-y-2.5">
          {/* Note */}
          {entry.note && (
            <div className="bg-white rounded-lg p-2.5 border border-border-light">
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Note</p>
              <p className="text-xs text-text-secondary whitespace-pre-line">{entry.note}</p>
            </div>
          )}

          {/* Intervention Statuses at this point */}
          {ivList.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Interventions</p>
              <div className="space-y-1">
                {ivList.map((item, i) => {
                  const ivSt = getStyle(item.status || 'Initiated');
                  return (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${ivSt.dot}`} />
                      <span className="flex-1 text-text-secondary min-w-0 truncate">{item.intervention}</span>
                      <span className={`text-[10px] font-medium ${ivSt.text}`}>{item.status || 'Initiated'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   AddGoalModal
   Health Concern -> Goal -> Select Interventions -> Save
   ══════════════════════════════════════════════════════════════════════ */

function AddGoalModal({ open, onClose, patientId, addEntry }) {
  const [concern, setConcern] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [checkedIvs, setCheckedIvs] = useState(new Set());
  const [customIvs, setCustomIvs] = useState(['']);

  const healthConcerns = useMemo(() => carePlanLibrary.map(c => c.healthConcern), []);
  const selectedLib = carePlanLibrary.find(c => c.healthConcern === concern);
  const goalOptions = useMemo(() => selectedLib?.goals.map(g => g.description) || [], [selectedLib]);
  const selectedGoalDef = selectedLib?.goals.find(g => g.description === goalDesc);

  const reset = () => {
    setConcern('');
    setGoalDesc('');
    setTargetDate('');
    setCheckedIvs(new Set());
    setCustomIvs(['']);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleConcernChange = (val) => {
    setConcern(val);
    setGoalDesc('');
    setCheckedIvs(new Set());
  };

  const handleGoalChange = (val) => {
    setGoalDesc(val);
    setCheckedIvs(new Set());
  };

  const toggleIv = (iv) => {
    setCheckedIvs(prev => {
      const next = new Set(prev);
      next.has(iv) ? next.delete(iv) : next.add(iv);
      return next;
    });
  };

  const canSave = goalDesc.trim().length > 0;

  const handleSave = () => {
    const allIvs = [
      ...Array.from(checkedIvs),
      ...customIvs.filter(iv => iv.trim()),
    ];

    // Create the goal
    const goalEntry = addEntry(patientId, 'carePlanGoals', {
      healthConcern: concern,
      description: goalDesc,
      status: 'Initiated',
      targetDate,
      interventions: allIvs,
    });

    // Create initial documentation entry so there is a baseline snapshot
    const { date, time } = formatNow();
    addEntry(patientId, 'carePlanProgress', {
      goalId: goalEntry.id,
      goalDescription: goalDesc,
      healthConcern: concern,
      goalStatus: 'Initiated',
      interventionStatuses: allIvs.map(iv => ({ intervention: iv, status: 'Initiated' })),
      note: 'Initial care plan created.',
      date,
      time,
      author: 'Current User',
    });

    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Care Plan Goal"
      wide
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={handleClose} className="btn-secondary py-2 text-xs">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`btn-primary py-2 text-xs ${!canSave ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Save Goal
          </button>
        </div>
      }
    >
      <div className="space-y-4">

        {/* Step 1: Health Concern */}
        <div className="bg-surface-alt rounded-xl p-3 border border-border-light">
          <label className="text-[10px] font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
            <span className="w-4 h-4 bg-danger-100 text-danger-600 rounded text-[9px] font-bold flex items-center justify-center">1</span>
            Health Concern
          </label>
          <SearchableDropdown
            options={healthConcerns}
            value={concern}
            onChange={handleConcernChange}
            placeholder="Search health concerns..."
            small
          />
          <input
            type="text"
            className="input-field py-1.5 text-xs mt-1.5"
            placeholder="Or type a custom concern..."
            value={selectedLib ? '' : concern}
            onChange={e => handleConcernChange(e.target.value)}
          />
        </div>

        {/* Step 2: Goal */}
        <div className="bg-surface-alt rounded-xl p-3 border border-border-light">
          <label className="text-[10px] font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
            <span className="w-4 h-4 bg-primary-100 text-primary-700 rounded text-[9px] font-bold flex items-center justify-center">2</span>
            Goal Description
          </label>
          {selectedLib && goalOptions.length > 0 && (
            <div className="mb-1.5">
              <SearchableDropdown
                options={goalOptions}
                value={goalDesc}
                onChange={handleGoalChange}
                placeholder="Search goals..."
                small
              />
            </div>
          )}
          <textarea
            className="textarea-field text-xs !min-h-[40px]"
            rows={2}
            placeholder="Goal description..."
            value={goalDesc}
            onChange={e => setGoalDesc(e.target.value)}
          />
          <div className="mt-2">
            <label className="text-[10px] text-text-muted mb-0.5 block">Target Date</label>
            <input
              type="date"
              className="input-field py-1.5 text-xs"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
            />
          </div>
        </div>

        {/* Step 3: Interventions */}
        <div className="bg-surface-alt rounded-xl p-3 border border-border-light">
          <label className="text-[10px] font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
            <span className="w-4 h-4 bg-accent-100 text-accent-700 rounded text-[9px] font-bold flex items-center justify-center">3</span>
            Interventions
          </label>

          {/* Library interventions (checkboxes) */}
          {selectedGoalDef && selectedGoalDef.interventions.length > 0 && (
            <div className="space-y-1.5 mb-3">
              <p className="text-[10px] text-text-muted font-medium">Select from library:</p>
              {selectedGoalDef.interventions.map((iv, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all text-xs ${
                    checkedIvs.has(iv) ? 'bg-accent-50 border border-accent-200' : 'bg-white border border-border-light hover:bg-surface-hover'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkedIvs.has(iv)}
                    onChange={() => toggleIv(iv)}
                    className="accent-accent-600 mt-0.5 shrink-0"
                  />
                  <span className="text-text-secondary">{iv}</span>
                </label>
              ))}
            </div>
          )}

          {/* Custom interventions */}
          <p className="text-[10px] text-text-muted font-medium mb-1.5">Add custom:</p>
          <div className="space-y-1.5">
            {customIvs.map((iv, idx) => (
              <div key={idx} className="flex gap-1.5">
                <input
                  type="text"
                  className="input-field py-1.5 text-xs flex-1"
                  placeholder="Custom intervention..."
                  value={iv}
                  onChange={e => {
                    const updated = [...customIvs];
                    updated[idx] = e.target.value;
                    setCustomIvs(updated);
                  }}
                />
                {customIvs.length > 1 && (
                  <button
                    onClick={() => setCustomIvs(customIvs.filter((_, i) => i !== idx))}
                    className="p-1 text-text-muted hover:text-danger-500 cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setCustomIvs([...customIvs, ''])}
              className="text-[10px] text-primary-600 font-medium flex items-center gap-1 cursor-pointer"
            >
              <PlusIcon className="w-3 h-3" /> Add custom intervention
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
