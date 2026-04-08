import { useState, useMemo } from 'react';
import {
  FlagIcon, CheckCircleIcon, ClockIcon,
  ArrowPathIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon,
  CalendarIcon, ExclamationCircleIcon, XCircleIcon,
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import { carePlanLibrary } from '../../data/carePlanLibrary';
import { useData } from '../../contexts/DataContext';
import { getPatientEntries } from '../../data/localStore';

/* ── Constants ──────────────────────────────────────────────────────── */

const GOAL_STATUSES = ['Not Started', 'Initiated', 'In Progress', 'On Track', 'Met', 'Not Met', 'Deferred'];
const IV_STATUSES = ['Not Started', 'In Progress', 'Completed', 'Discontinued'];

const GOAL_STATUS_STYLE = {
  'Met':         { bg: 'bg-accent-100', text: 'text-accent-700', border: 'border-accent-200', icon: CheckCircleIcon, iconClr: 'text-accent-500' },
  'On Track':    { bg: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-200', icon: ArrowPathIcon, iconClr: 'text-primary-500' },
  'In Progress': { bg: 'bg-warn-100', text: 'text-[#92400e]', border: 'border-warn-200', icon: ClockIcon, iconClr: 'text-warn-500' },
  'Initiated':   { bg: 'bg-warn-50', text: 'text-[#92400e]', border: 'border-warn-100', icon: ClockIcon, iconClr: 'text-warn-400' },
  'Not Met':     { bg: 'bg-danger-50', text: 'text-danger-600', border: 'border-danger-200', icon: XCircleIcon, iconClr: 'text-danger-500' },
  'Deferred':    { bg: 'bg-surface-alt', text: 'text-text-muted', border: 'border-border', icon: ClockIcon, iconClr: 'text-text-muted' },
  'Not Started': { bg: 'bg-surface-alt', text: 'text-text-secondary', border: 'border-border', icon: ClockIcon, iconClr: 'text-text-muted' },
};

const IV_STATUS_STYLE = {
  'Not Started':   { bg: 'bg-surface-alt', dot: 'bg-gray-300' },
  'In Progress':   { bg: 'bg-warn-50', dot: 'bg-warn-400' },
  'Completed':     { bg: 'bg-accent-50', dot: 'bg-accent-500' },
  'Discontinued':  { bg: 'bg-danger-50', dot: 'bg-danger-400' },
};

/* ── Helpers ─────────────────────────────────────────────────────────── */

function goalStyle(status) {
  return GOAL_STATUS_STYLE[status] || GOAL_STATUS_STYLE['Not Started'];
}

function ivStyle(status) {
  return IV_STATUS_STYLE[status] || IV_STATUS_STYLE['Not Started'];
}

/** Read saved intervention statuses for a goal from localStorage */
function readIvStatuses(patientId, goalId) {
  try {
    const raw = localStorage.getItem(`k360_iv_${patientId}_${goalId}`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

/** Write intervention statuses for a goal to localStorage */
function writeIvStatuses(patientId, goalId, statuses) {
  localStorage.setItem(`k360_iv_${patientId}_${goalId}`, JSON.stringify(statuses));
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
  const { addEntry, updateEntry, deleteEntry, isEditable } = useData();

  // Expand / collapse
  const [expandedGoals, setExpandedGoals] = useState(new Set());

  // Add Goal modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  const allGoals = patient.carePlan.goals;

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

  // Summary counts
  const met = allGoals.filter(g => g.status === 'Met').length;
  const active = allGoals.filter(g => ['In Progress', 'On Track', 'Initiated'].includes(g.status)).length;
  const notStarted = allGoals.filter(g => g.status === 'Not Started').length;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header ── */}
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

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-accent-50 rounded-2xl p-2.5 sm:p-3 text-center border border-accent-100">
          <p className="text-lg sm:text-xl font-bold text-accent-600">{met}</p>
          <p className="text-[10px] sm:text-[11px] font-medium text-accent-700">Met</p>
        </div>
        <div className="bg-primary-50 rounded-2xl p-2.5 sm:p-3 text-center border border-primary-100">
          <p className="text-lg sm:text-xl font-bold text-primary-600">{active}</p>
          <p className="text-[10px] sm:text-[11px] font-medium text-primary-700">Active</p>
        </div>
        <div className="bg-surface-alt rounded-2xl p-2.5 sm:p-3 text-center border border-border-light">
          <p className="text-lg sm:text-xl font-bold text-text-secondary">{notStarted}</p>
          <p className="text-[10px] sm:text-[11px] font-medium text-text-muted">Not Started</p>
        </div>
      </div>

      {/* ── Goals List ── */}
      <div className="space-y-2">
        {allGoals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            patient={patient}
            isOpen={expandedGoals.has(goal.id)}
            onToggle={() => toggleExpand(goal.id)}
            onDelete={() => setDeleteTarget(goal)}
            addEntry={addEntry}
            updateEntry={updateEntry}
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

      {/* ── Barriers Section ── */}
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

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this care plan goal? This action cannot be undone."
      />

      {/* ── Add Goal Modal ── */}
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
   GoalCard - The main inline editing experience.
   Everything happens here: status, interventions, save entry, history.
   ══════════════════════════════════════════════════════════════════════ */

function GoalCard({ goal, patient, isOpen, onToggle, onDelete, addEntry, updateEntry, isEditable }) {
  const style = goalStyle(goal.status);
  const StatusIcon = style.icon;
  const editable = isEditable(goal.id);
  const interventions = goal.interventions || [];

  // Draft state for this card (only active when expanded)
  const [draftGoalStatus, setDraftGoalStatus] = useState(goal.status || 'Not Started');
  const [draftIvStatuses, setDraftIvStatuses] = useState(() => readIvStatuses(patient.id, goal.id));
  const [newIvText, setNewIvText] = useState('');
  const [pendingNewIvs, setPendingNewIvs] = useState([]);
  const [progressNote, setProgressNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset drafts when card opens
  const handleToggle = () => {
    if (!isOpen) {
      // Opening - reset draft to current saved state
      setDraftGoalStatus(goal.status || 'Not Started');
      setDraftIvStatuses(readIvStatuses(patient.id, goal.id));
      setNewIvText('');
      setPendingNewIvs([]);
      setProgressNote('');
      setShowHistory(false);
      setSaving(false);
    }
    onToggle();
  };

  const updateIvStatus = (index, newStatus) => {
    setDraftIvStatuses(prev => ({ ...prev, [index]: newStatus }));
  };

  const addNewIntervention = () => {
    const text = newIvText.trim();
    if (!text) return;
    setPendingNewIvs(prev => [...prev, text]);
    setNewIvText('');
  };

  const removePendingIv = (index) => {
    setPendingNewIvs(prev => prev.filter((_, i) => i !== index));
  };

  // Detect if anything changed from the saved state
  const savedIvStatuses = readIvStatuses(patient.id, goal.id);
  const hasIvChanges = interventions.some((_, i) => {
    const saved = savedIvStatuses[i] || 'Not Started';
    const draft = draftIvStatuses[i] || 'Not Started';
    return saved !== draft;
  });
  const hasStatusChange = draftGoalStatus !== (goal.status || 'Not Started');
  const hasNewInterventions = pendingNewIvs.length > 0;
  const hasNote = progressNote.trim().length > 0;
  const hasDirtyState = hasIvChanges || hasStatusChange || hasNewInterventions || hasNote;

  // Save Entry = snapshot current state as a progress entry
  const handleSaveEntry = () => {
    setSaving(true);

    // 1. Build change log for interventions
    const changes = [];
    interventions.forEach((iv, i) => {
      const oldStatus = savedIvStatuses[i] || 'Not Started';
      const newStatus = draftIvStatuses[i] || 'Not Started';
      if (newStatus !== oldStatus) {
        changes.push({ index: i, intervention: iv, from: oldStatus, to: newStatus });
      }
    });

    // 2. Build note text
    const parts = [];
    if (hasStatusChange) parts.push(`Goal status: ${goal.status || 'Not Started'} \u2192 ${draftGoalStatus}`);
    if (changes.length > 0) {
      changes.forEach(c => parts.push(`${c.intervention}: ${c.from} \u2192 ${c.to}`));
    }
    if (hasNewInterventions) {
      parts.push(`Added ${pendingNewIvs.length} intervention${pendingNewIvs.length > 1 ? 's' : ''}: ${pendingNewIvs.join('; ')}`);
    }
    if (hasNote) parts.push(progressNote.trim());
    const fullNote = parts.join('\n') || 'Reviewed - no changes';

    // 3. Save intervention statuses to localStorage
    // Include statuses for new interventions too (they start at "Not Started")
    const mergedIvStatuses = { ...savedIvStatuses, ...draftIvStatuses };
    writeIvStatuses(patient.id, goal.id, mergedIvStatuses);

    // 4. Create progress entry
    const { date, time } = formatNow();
    addEntry(patient.id, 'carePlanProgress', {
      goalId: goal.id,
      goalDescription: goal.description,
      healthConcern: goal.healthConcern || '',
      status: draftGoalStatus,
      note: fullNote,
      interventionChanges: changes,
      allStatuses: mergedIvStatuses,
      date,
      time,
    });

    // 5. Update goal status if changed
    if (hasStatusChange) {
      if (editable) {
        updateEntry(patient.id, 'carePlanGoals', goal.id, { status: draftGoalStatus });
      } else {
        addEntry(patient.id, 'carePlanGoals', {
          healthConcern: goal.healthConcern || '',
          description: goal.description,
          status: draftGoalStatus,
          targetDate: goal.targetDate || '',
          interventions: [...interventions, ...pendingNewIvs],
          barriers: goal.barriers || '',
        });
      }
    }

    // 6. If new interventions were added, update the goal record
    if (hasNewInterventions && !hasStatusChange) {
      const updatedIvs = [...interventions, ...pendingNewIvs];
      if (editable) {
        updateEntry(patient.id, 'carePlanGoals', goal.id, { interventions: updatedIvs });
      } else {
        addEntry(patient.id, 'carePlanGoals', {
          healthConcern: goal.healthConcern || '',
          description: goal.description,
          status: draftGoalStatus,
          targetDate: goal.targetDate || '',
          interventions: updatedIvs,
          barriers: goal.barriers || '',
        });
      }
    }

    // 7. Reset drafts
    setDraftIvStatuses(mergedIvStatuses);
    setPendingNewIvs([]);
    setProgressNote('');
    setSaving(false);
  };

  // Progress history
  const progressEntries = useMemo(() => {
    const all = getPatientEntries(patient.id, 'carePlanProgress');
    return all.filter(e => e.goalId === goal.id).reverse();
  }, [patient.id, goal.id, saving]);

  return (
    <div className="card p-0 overflow-hidden">
      {/* ── Collapsed Header ── */}
      <button onClick={handleToggle} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-alt transition-colors cursor-pointer text-left">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${goal.status === 'Met' ? 'bg-accent-100' : 'bg-primary-50'}`}>
          <StatusIcon className={`w-4 h-4 ${style.iconClr}`} />
        </div>
        <div className="flex-1 min-w-0">
          {goal.healthConcern && (
            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{goal.healthConcern}</p>
          )}
          <p className={`text-sm font-medium leading-snug ${goal.status === 'Met' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
            {goal.description}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            Target: {goal.targetDate || 'Not set'}
            {interventions.length > 0 && ` \u00B7 ${interventions.length} intervention${interventions.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <span className={`badge border text-[10px] shrink-0 ${style.bg} ${style.text} ${style.border}`}>
          {goal.status || 'Not Started'}
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

      {/* ── Expanded Inline Panel ── */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-border-light pt-3 animate-fade-in space-y-4">

          {/* 1. Goal Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">Goal Status</label>
            <select
              className="input-field py-1.5 text-xs w-full sm:w-auto sm:min-w-[140px]"
              value={draftGoalStatus}
              onChange={e => setDraftGoalStatus(e.target.value)}
            >
              {GOAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* 2. Interventions */}
          <div>
            <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Interventions
            </p>

            {interventions.length > 0 ? (
              <div className="space-y-1.5">
                {interventions.map((iv, i) => {
                  const status = draftIvStatuses[i] || 'Not Started';
                  const st = ivStyle(status);
                  return (
                    <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg p-2 text-xs transition-all ${st.bg}`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${st.dot}`} />
                        <span className={`flex-1 ${
                          status === 'Completed' ? 'line-through text-text-muted'
                          : status === 'Discontinued' ? 'line-through text-danger-300'
                          : 'text-text-secondary'
                        }`}>
                          {iv}
                        </span>
                      </div>
                      <select
                        value={status}
                        onChange={e => updateIvStatus(i, e.target.value)}
                        className="input-field py-1 px-2 text-[10px] font-semibold w-full sm:w-auto sm:min-w-[110px] shrink-0"
                      >
                        {IV_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-text-muted mb-1">No interventions documented yet.</p>
            )}

            {/* Pending new interventions */}
            {pendingNewIvs.length > 0 && (
              <div className="space-y-1.5 mt-1.5">
                {pendingNewIvs.map((iv, i) => (
                  <div key={`new-${i}`} className="flex items-center gap-2 rounded-lg p-2 text-xs bg-primary-50 border border-primary-100">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-primary-400" />
                    <span className="flex-1 text-primary-800">{iv}</span>
                    <span className="text-[10px] font-medium text-primary-500">New</span>
                    <button
                      onClick={() => removePendingIv(i)}
                      className="p-0.5 text-text-muted hover:text-danger-500 cursor-pointer"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add intervention inline */}
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="text"
                className="input-field py-2 sm:py-1.5 text-xs flex-1"
                placeholder="Add new intervention..."
                value={newIvText}
                onChange={e => setNewIvText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNewIntervention(); } }}
              />
              <button
                onClick={addNewIntervention}
                disabled={!newIvText.trim()}
                className={`btn-secondary py-2 sm:py-1.5 px-3 text-xs flex items-center justify-center gap-1 w-full sm:w-auto ${!newIvText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <PlusIcon className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* 3. Progress Note (optional) */}
          <div>
            <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1 block">
              Note (optional)
            </label>
            <textarea
              className="textarea-field text-xs !min-h-[48px]"
              rows={2}
              placeholder="Any observations, follow-ups, or notes for this entry..."
              value={progressNote}
              onChange={e => setProgressNote(e.target.value)}
            />
          </div>

          {/* 4. Save Entry Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <button
              onClick={handleSaveEntry}
              disabled={!hasDirtyState}
              className={`btn-primary py-2.5 sm:py-2 px-5 text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto ${!hasDirtyState ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <CheckCircleIcon className="w-4 h-4" /> Save Entry
            </button>
            {!hasDirtyState && (
              <span className="text-[10px] text-text-muted">Change a status or add an intervention to save an entry</span>
            )}
            {hasDirtyState && (
              <span className="text-[10px] text-accent-600 font-medium">
                {[
                  hasStatusChange && 'status changed',
                  hasIvChanges && 'intervention updates',
                  hasNewInterventions && `${pendingNewIvs.length} new`,
                  hasNote && 'note',
                ].filter(Boolean).join(' \u00B7 ')}
              </span>
            )}
          </div>

          {/* 5. Progress History (collapsible) */}
          <div className="border-t border-border-light pt-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
            >
              {showHistory ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
              <CalendarIcon className="w-3.5 h-3.5" />
              Progress History
              {progressEntries.length > 0 && (
                <span className="badge badge-info text-[9px] ml-1">{progressEntries.length}</span>
              )}
            </button>

            {showHistory && (
              <div className="mt-2 space-y-2 animate-fade-in">
                {progressEntries.length === 0 ? (
                  <p className="text-xs text-text-muted py-2 text-center">No progress entries yet.</p>
                ) : (
                  progressEntries.map((entry, i) => {
                    const entryStyle = goalStyle(entry.status);
                    return (
                      <div key={entry.id || i} className="bg-surface-alt rounded-lg p-3 border border-border-light">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`badge border text-[9px] ${entryStyle.bg} ${entryStyle.text} ${entryStyle.border}`}>
                            {entry.status}
                          </span>
                          <span className="text-[10px] text-text-muted">{entry.date} {entry.time}</span>
                        </div>
                        {entry.note && (
                          <p className="text-xs text-text-secondary whitespace-pre-line">{entry.note}</p>
                        )}
                      </div>
                    );
                  })
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
   AddGoalModal - Single modal with the library dropdown flow.
   Health Concern -> Goal -> Select Interventions -> Save.
   ══════════════════════════════════════════════════════════════════════ */

function AddGoalModal({ open, onClose, patientId, addEntry }) {
  const [concern, setConcern] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [targetDate, setTargetDate] = useState('');
  const [checkedIvs, setCheckedIvs] = useState(new Set());
  const [customIvs, setCustomIvs] = useState(['']);
  const [barriers, setBarriers] = useState('');

  const selectedLib = carePlanLibrary.find(c => c.healthConcern === concern);
  const selectedGoalDef = selectedLib?.goals.find(g => g.description === goalDesc);

  const reset = () => {
    setConcern('');
    setGoalDesc('');
    setStatus('Not Started');
    setTargetDate('');
    setCheckedIvs(new Set());
    setCustomIvs(['']);
    setBarriers('');
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
    // Auto-set timeframe from library if available
    const lib = carePlanLibrary.find(c => c.healthConcern === concern);
    const goalDef = lib?.goals.find(g => g.description === val);
    if (goalDef?.timeframe && !targetDate) {
      // timeframe is a text string like "90 days" - don't auto-set date input
    }
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
    addEntry(patientId, 'carePlanGoals', {
      healthConcern: concern,
      description: goalDesc,
      status,
      targetDate,
      interventions: allIvs,
      barriers,
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
          <select
            className="input-field py-1.5 text-xs mb-1.5"
            value={selectedLib ? concern : ''}
            onChange={e => handleConcernChange(e.target.value)}
          >
            <option value="">Select from library...</option>
            {carePlanLibrary.map(c => (
              <option key={c.id} value={c.healthConcern}>{c.healthConcern}</option>
            ))}
          </select>
          <input
            type="text"
            className="input-field py-1.5 text-xs"
            placeholder="Or type a custom concern..."
            value={concern}
            onChange={e => handleConcernChange(e.target.value)}
          />
        </div>

        {/* Step 2: Goal */}
        <div className="bg-surface-alt rounded-xl p-3 border border-border-light">
          <label className="text-[10px] font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
            <span className="w-4 h-4 bg-primary-100 text-primary-700 rounded text-[9px] font-bold flex items-center justify-center">2</span>
            Goal Description
          </label>
          {selectedLib && (
            <select
              className="input-field py-1.5 text-xs mb-1.5"
              value={goalDesc}
              onChange={e => handleGoalChange(e.target.value)}
            >
              <option value="">Select a goal...</option>
              {selectedLib.goals.map(g => (
                <option key={g.id} value={g.description}>{g.description}</option>
              ))}
            </select>
          )}
          <textarea
            className="textarea-field text-xs !min-h-[40px]"
            rows={2}
            placeholder="Goal description..."
            value={goalDesc}
            onChange={e => setGoalDesc(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="text-[10px] text-text-muted mb-0.5 block">Initial Status</label>
              <select className="input-field py-1.5 text-xs" value={status} onChange={e => setStatus(e.target.value)}>
                {GOAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-text-muted mb-0.5 block">Target Date</label>
              <input
                type="date"
                className="input-field py-1.5 text-xs"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
              />
            </div>
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

        {/* Barriers (optional) */}
        <div>
          <label className="text-[10px] font-medium text-text-secondary mb-0.5 block">Barriers (optional)</label>
          <input
            type="text"
            className="input-field py-1.5 text-xs"
            placeholder="e.g. Transportation, health literacy"
            value={barriers}
            onChange={e => setBarriers(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
