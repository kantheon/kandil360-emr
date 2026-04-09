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

/* ── Main Component ─────────────────────────────────────────────────── */

export default function CarePlanTab({ patient }) {
  const { addEntry, deleteEntry, isEditable, version } = useData();

  const [showDocModal, setShowDocModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const allGoals = patient.carePlan.goals;

  // Fetch all documentation sessions (comprehensive snapshots)
  const docSessions = useMemo(() => {
    const all = getPatientEntries(patient.id, 'carePlanDocumentation');
    return [...all].sort((a, b) => {
      const da = a.createdAt || '';
      const db = b.createdAt || '';
      return db.localeCompare(da);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.id, version]);

  const latestDoc = docSessions.length > 0 ? docSessions[0] : null;

  // Derive current statuses for each goal from the latest documentation snapshot
  const goalStatuses = useMemo(() => {
    const map = {};
    if (latestDoc?.goals) {
      latestDoc.goals.forEach(g => {
        map[g.goalId] = {
          goalStatus: g.goalStatus || 'Initiated',
          interventions: g.interventions || [],
        };
      });
    }
    return map;
  }, [latestDoc]);

  const getGoalStatus = (goal) => {
    return goalStatuses[goal.id]?.goalStatus || goal.status || 'Initiated';
  };

  const getInterventionStatuses = (goal) => {
    const docEntry = goalStatuses[goal.id];
    const interventions = goal.interventions || [];
    if (docEntry?.interventions?.length > 0) {
      // Map each intervention to its documented status; fall back to Initiated
      return interventions.map(iv => {
        const found = docEntry.interventions.find(d => d.text === iv);
        return { text: iv, status: found?.status || 'Initiated' };
      });
    }
    return interventions.map(iv => ({ text: iv, status: 'Initiated' }));
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteEntry(patient.id, 'carePlanGoals', deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // Summary counts
  const completed = allGoals.filter(g => getGoalStatus(g) === 'Completed').length;
  const active = allGoals.filter(g => ['In Progress', 'Partially Met'].includes(getGoalStatus(g))).length;
  const initiated = allGoals.filter(g => !['Completed', 'In Progress', 'Partially Met'].includes(getGoalStatus(g))).length;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Care Plan</h2>
          <p className="text-xs text-text-muted mt-0.5">
            {allGoals.length} goal{allGoals.length !== 1 && 's'}
            {docSessions.length > 0 && ` \u00B7 ${docSessions.length} documentation session${docSessions.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddGoalModal(true)} className="btn-secondary py-2 flex items-center gap-1.5 text-xs">
            <PlusIcon className="w-4 h-4" /><span className="hidden sm:inline">Add Goal</span>
          </button>
          {docSessions.length > 0 && (
            <button onClick={() => setShowHistoryModal(true)} className="btn-secondary py-2 flex items-center gap-1.5 text-xs">
              <DocumentTextIcon className="w-4 h-4" /><span className="hidden sm:inline">History</span>
              <span className="badge badge-info text-[9px]">{docSessions.length}</span>
            </button>
          )}
          <button onClick={() => setShowDocModal(true)} className="btn-primary py-2 flex items-center gap-1.5 text-xs">
            <PencilSquareIcon className="w-4 h-4" /><span className="hidden sm:inline">New Documentation</span>
          </button>
        </div>
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

      {/* Goals List (read-only cards) */}
      <div className="space-y-3">
        {allGoals.map(goal => {
          const status = getGoalStatus(goal);
          const ivStatuses = getInterventionStatuses(goal);
          const style = getStyle(status);
          const StatusIcon = style.icon;
          const editable = isEditable(goal.id);
          const lastDocDate = latestDoc ? `${latestDoc.date} ${latestDoc.time}` : null;

          return (
            <div key={goal.id} className="card p-0 overflow-hidden">
              {/* Health concern ribbon */}
              {goal.healthConcern && (
                <div className="px-4 pt-3 pb-0">
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <ExclamationCircleIcon className="w-3.5 h-3.5 text-warn-500" />
                    Health Concern: {goal.healthConcern}
                  </p>
                </div>
              )}

              {/* Goal info */}
              <div className="px-4 pt-2.5 pb-3">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${status === 'Completed' ? 'bg-accent-100' : 'bg-primary-50'}`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${style.iconClr}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium leading-snug ${status === 'Completed' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                        {goal.description}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Target: {goal.targetDate || 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`badge border text-[10px] ${style.bg} ${style.text} ${style.border}`}>
                      {status}
                    </span>
                    {editable && (
                      <button
                        onClick={() => setDeleteTarget(goal)}
                        className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-500 cursor-pointer transition-colors"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Interventions list */}
                {(goal.interventions?.length > 0) && (
                  <div className="mt-3 ml-9">
                    <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Interventions
                    </p>
                    <div className="space-y-1">
                      {ivStatuses.map((item, i) => {
                        const ivSt = getStyle(item.status);
                        return (
                          <div key={i} className="flex items-center gap-2.5 text-xs">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${ivSt.dot}`} />
                            <span className={`flex-1 min-w-0 ${item.status === 'Completed' ? 'line-through text-text-muted' : 'text-text-secondary'}`}>
                              {item.text}
                            </span>
                            <span className={`text-[10px] font-medium shrink-0 ${ivSt.text}`}>
                              {item.status}{item.status === 'Completed' && ' \u2713'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Last documented */}
                {lastDocDate && (
                  <p className="text-[10px] text-text-muted mt-3 ml-9 flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    Last documented: {lastDocDate}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {allGoals.length === 0 && (
          <div className="card p-8 text-center">
            <FlagIcon className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-muted">No care plan goals yet.</p>
            <button onClick={() => setShowAddGoalModal(true)} className="btn-primary py-2 mt-3 text-xs">
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

      {/* Documentation History Modal */}
      <Modal open={showHistoryModal} onClose={() => setShowHistoryModal(false)} title={`Documentation History (${docSessions.length})`} wide>
        {docSessions.length === 0 ? (
          <p className="text-xs text-text-muted py-8 text-center">No documentation sessions yet.</p>
        ) : (
          <div className="space-y-3">
            {docSessions.map((session, i) => (
              <HistorySession key={session.id || i} session={session} />
            ))}
          </div>
        )}
      </Modal>

      {/* Modals */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this care plan goal? This action cannot be undone."
      />

      <DocumentationModal
        open={showDocModal}
        onClose={() => setShowDocModal(false)}
        patient={patient}
        allGoals={allGoals}
        goalStatuses={goalStatuses}
        addEntry={addEntry}
      />

      <AddGoalModal
        open={showAddGoalModal}
        onClose={() => setShowAddGoalModal(false)}
        patientId={patient.id}
        addEntry={addEntry}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   DocumentationModal
   Full comprehensive review of ALL goals and interventions at once.
   ══════════════════════════════════════════════════════════════════════ */

function DocumentationModal({ open, onClose, patient, allGoals, goalStatuses, addEntry }) {
  // Build initial form state from current goals + last documented statuses
  const initialGoalForms = useCallback(() => {
    return allGoals.map(goal => {
      const doc = goalStatuses[goal.id];
      const interventions = (goal.interventions || []).map(iv => {
        const found = doc?.interventions?.find(d => d.text === iv);
        return { text: iv, status: found?.status || 'Initiated' };
      });
      return {
        goalId: goal.id,
        goalDescription: goal.description,
        healthConcern: goal.healthConcern || '',
        goalStatus: doc?.goalStatus || goal.status || 'Initiated',
        targetDate: goal.targetDate || '',
        interventions,
        newInterventions: [],
      };
    });
  }, [allGoals, goalStatuses]);

  const [goalForms, setGoalForms] = useState(initialGoalForms);
  const [newGoals, setNewGoals] = useState([]);
  const [note, setNote] = useState('');
  // Reset on open: when modal opens and we have goals but no form state yet
  if (open && goalForms.length === 0 && allGoals.length > 0) {
    setGoalForms(initialGoalForms());
  }

  const updateGoalStatus = (idx, status) => {
    setGoalForms(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], goalStatus: status };
      return next;
    });
  };

  const updateIvStatus = (goalIdx, ivIdx, status) => {
    setGoalForms(prev => {
      const next = [...prev];
      const ivs = [...next[goalIdx].interventions];
      ivs[ivIdx] = { ...ivs[ivIdx], status };
      next[goalIdx] = { ...next[goalIdx], interventions: ivs };
      return next;
    });
  };

  const addNewIvToGoal = (goalIdx) => {
    setGoalForms(prev => {
      const next = [...prev];
      next[goalIdx] = {
        ...next[goalIdx],
        newInterventions: [...next[goalIdx].newInterventions, { text: '', status: 'Initiated' }],
      };
      return next;
    });
  };

  const updateNewIvText = (goalIdx, ivIdx, text) => {
    setGoalForms(prev => {
      const next = [...prev];
      const newIvs = [...next[goalIdx].newInterventions];
      newIvs[ivIdx] = { ...newIvs[ivIdx], text };
      next[goalIdx] = { ...next[goalIdx], newInterventions: newIvs };
      return next;
    });
  };

  const updateNewIvStatus = (goalIdx, ivIdx, status) => {
    setGoalForms(prev => {
      const next = [...prev];
      const newIvs = [...next[goalIdx].newInterventions];
      newIvs[ivIdx] = { ...newIvs[ivIdx], status };
      next[goalIdx] = { ...next[goalIdx], newInterventions: newIvs };
      return next;
    });
  };

  const removeNewIv = (goalIdx, ivIdx) => {
    setGoalForms(prev => {
      const next = [...prev];
      next[goalIdx] = {
        ...next[goalIdx],
        newInterventions: next[goalIdx].newInterventions.filter((_, i) => i !== ivIdx),
      };
      return next;
    });
  };

  // Inline new goal state
  const addNewGoal = () => {
    setNewGoals(prev => [...prev, {
      healthConcern: '',
      goalDescription: '',
      targetDate: '',
      interventions: [],
      customInterventions: [''],
    }]);
  };

  const updateNewGoal = (idx, updates) => {
    setNewGoals(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...updates };
      return next;
    });
  };

  const removeNewGoal = (idx) => {
    setNewGoals(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const { date, time } = formatNow();

    // Build the complete snapshot for ALL existing goals
    const goalsSnapshot = goalForms.map(gf => ({
      goalId: gf.goalId,
      goalDescription: gf.goalDescription,
      healthConcern: gf.healthConcern,
      goalStatus: gf.goalStatus,
      interventions: [
        ...gf.interventions,
        ...gf.newInterventions.filter(iv => iv.text.trim()),
      ],
    }));

    // Process new goals: add them as carePlanGoals entries first
    const createdNewGoals = newGoals.filter(ng => ng.goalDescription.trim()).map(ng => {
      const allIvs = [
        ...ng.interventions,
        ...ng.customInterventions.filter(iv => iv.trim()),
      ];
      const goalEntry = addEntry(patient.id, 'carePlanGoals', {
        healthConcern: ng.healthConcern,
        description: ng.goalDescription,
        status: 'Initiated',
        targetDate: ng.targetDate,
        interventions: allIvs,
      });
      return {
        goalId: goalEntry.id,
        goalDescription: ng.goalDescription,
        healthConcern: ng.healthConcern,
        goalStatus: 'Initiated',
        interventions: allIvs.map(iv => ({ text: iv, status: 'Initiated' })),
      };
    });

    // Build new-intervention map for existing goals (to update their stored interventions)
    const newInterventionMap = {};
    goalForms.forEach(gf => {
      const newIvTexts = gf.newInterventions
        .filter(iv => iv.text.trim())
        .map(iv => iv.text.trim());
      if (newIvTexts.length > 0) {
        newInterventionMap[gf.goalId] = newIvTexts;
      }
    });

    // Save the comprehensive documentation entry
    addEntry(patient.id, 'carePlanDocumentation', {
      goals: [...goalsSnapshot, ...createdNewGoals],
      newGoals: createdNewGoals,
      newInterventions: newInterventionMap,
      note: note.trim(),
      date,
      time,
      author: 'Current User',
    });

    // Update existing goals that got new interventions added
    // (We need to add interventions to the actual goal records so they persist)
    // This is done by re-saving the goal with the updated interventions list
    // For seed data goals we cannot update them in localStorage, so the documentation
    // snapshot itself serves as the source of truth for intervention statuses.

    handleClose();
  };

  const handleClose = () => {
    setGoalForms([]);
    setNewGoals([]);
    setNote('');
    setShowAddInline(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Care Plan Documentation"
      wide
      footer={
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button onClick={handleClose} className="btn-secondary py-2.5 sm:py-2 text-xs w-full sm:w-auto">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary py-2.5 sm:py-2 px-5 text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <CheckCircleIcon className="w-4 h-4" /> Save Documentation
          </button>
        </div>
      }
    >
      <div className="space-y-4">

        {/* Existing goals */}
        {goalForms.map((gf, goalIdx) => {
          const style = getStyle(gf.goalStatus);
          return (
            <div key={gf.goalId} className="rounded-xl border border-border-light overflow-hidden">
              {/* Goal header */}
              <div className={`px-4 py-3 ${style.bg} border-b ${style.border}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {gf.healthConcern && (
                      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
                        {gf.healthConcern}
                      </p>
                    )}
                    <p className="text-sm font-medium text-text-primary leading-snug">{gf.goalDescription}</p>
                    {gf.targetDate && (
                      <p className="text-[10px] text-text-muted mt-0.5">Target: {gf.targetDate}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                    Goal Status
                  </label>
                  <select
                    className="input-field py-1 px-2 text-xs font-medium w-full sm:w-auto sm:min-w-[150px]"
                    value={gf.goalStatus}
                    onChange={e => updateGoalStatus(goalIdx, e.target.value)}
                  >
                    {GOAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Interventions */}
              <div className="px-4 py-3 space-y-1.5">
                {gf.interventions.map((iv, ivIdx) => {
                  const ivSt = getStyle(iv.status);
                  return (
                    <div key={ivIdx} className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg bg-surface-alt p-2.5 border border-border-light">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${ivSt.dot}`} />
                        <span className="text-xs text-text-secondary flex-1">{iv.text}</span>
                      </div>
                      <select
                        value={iv.status}
                        onChange={e => updateIvStatus(goalIdx, ivIdx, e.target.value)}
                        className="input-field py-1 px-2 text-[10px] font-semibold w-full sm:w-auto sm:min-w-[130px] shrink-0"
                      >
                        {INTERVENTION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  );
                })}

                {/* Newly added interventions for this goal */}
                {gf.newInterventions.map((iv, ivIdx) => (
                  <div key={`new-${ivIdx}`} className="flex flex-col sm:flex-row sm:items-start gap-2 rounded-lg bg-accent-50/50 p-2.5 border border-accent-100">
                    <div className="flex-1 min-w-0">
                      <SearchableDropdown
                        options={(() => {
                          const lib = carePlanLibrary.find(c => c.healthConcern === gf.healthConcern);
                          if (!lib) return [];
                          return lib.goals.flatMap(g => g.interventions);
                        })()}
                        value={iv.text}
                        onChange={v => updateNewIvText(goalIdx, ivIdx, v)}
                        placeholder="Search or type intervention..."
                        small
                      />
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <select
                        value={iv.status}
                        onChange={e => updateNewIvStatus(goalIdx, ivIdx, e.target.value)}
                        className="input-field py-1.5 px-2 text-[10px] font-semibold min-w-[120px]"
                      >
                        {INTERVENTION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button
                        onClick={() => removeNewIv(goalIdx, ivIdx)}
                        className="p-1 rounded hover:bg-danger-50 text-text-muted hover:text-danger-500 cursor-pointer transition-colors"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addNewIvToGoal(goalIdx)}
                  className="text-[11px] text-primary-600 font-medium flex items-center gap-1 cursor-pointer hover:text-primary-700 transition-colors mt-1"
                >
                  <PlusIcon className="w-3 h-3" /> Add Intervention
                </button>
              </div>
            </div>
          );
        })}

        {/* New goals added during this documentation session */}
        {newGoals.map((ng, idx) => (
          <NewGoalInlineForm
            key={`new-goal-${idx}`}
            goal={ng}
            index={idx}
            onChange={(updates) => updateNewGoal(idx, updates)}
            onRemove={() => removeNewGoal(idx)}
          />
        ))}

        {/* Add New Goal Button */}
        <button
          onClick={addNewGoal}
          className="w-full py-3 rounded-xl border-2 border-dashed border-border-light hover:border-primary-300 hover:bg-primary-50/30 text-xs font-medium text-text-muted hover:text-primary-600 cursor-pointer transition-all flex items-center justify-center gap-1.5"
        >
          <PlusIcon className="w-4 h-4" /> Add New Goal
        </button>

        {/* Documentation Note */}
        <div>
          <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
            Documentation Note
          </label>
          <textarea
            className="textarea-field text-xs !min-h-[80px]"
            rows={4}
            placeholder="Observations, patient response, follow-up actions, overall care plan review notes..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   NewGoalInlineForm
   An inline form inside the documentation modal for adding a new goal
   ══════════════════════════════════════════════════════════════════════ */

function NewGoalInlineForm({ goal, index, onChange, onRemove }) {
  const healthConcerns = useMemo(() => carePlanLibrary.map(c => c.healthConcern), []);
  const selectedLib = carePlanLibrary.find(c => c.healthConcern === goal.healthConcern);
  const goalOptions = useMemo(() => selectedLib?.goals.map(g => g.description) || [], [selectedLib]);
  const selectedGoalDef = selectedLib?.goals.find(g => g.description === goal.goalDescription);

  const handleConcernChange = (concern) => {
    onChange({ healthConcern: concern, goalDescription: '', interventions: [], customInterventions: [''] });
  };

  const handleGoalSelect = (desc) => {
    const gDef = selectedLib?.goals.find(g => g.description === desc);
    onChange({
      goalDescription: desc,
      interventions: gDef ? [...gDef.interventions] : [],
      customInterventions: [''],
    });
  };

  const toggleLibIntervention = (iv) => {
    const current = goal.interventions || [];
    if (current.includes(iv)) {
      onChange({ interventions: current.filter(i => i !== iv) });
    } else {
      onChange({ interventions: [...current, iv] });
    }
  };

  const updateCustomIv = (ivIdx, text) => {
    const updated = [...goal.customInterventions];
    updated[ivIdx] = text;
    onChange({ customInterventions: updated });
  };

  const addCustomIv = () => {
    onChange({ customInterventions: [...goal.customInterventions, ''] });
  };

  const removeCustomIv = (ivIdx) => {
    onChange({ customInterventions: goal.customInterventions.filter((_, i) => i !== ivIdx) });
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-accent-200 bg-accent-50/20 overflow-hidden">
      <div className="px-4 py-3 bg-accent-50 border-b border-accent-100 flex items-center justify-between">
        <p className="text-xs font-semibold text-accent-700 flex items-center gap-1.5">
          <PlusIcon className="w-3.5 h-3.5" /> New Goal {index + 1}
        </p>
        <button
          onClick={onRemove}
          className="text-[10px] text-text-muted hover:text-danger-500 cursor-pointer transition-colors flex items-center gap-1"
        >
          <TrashIcon className="w-3 h-3" /> Remove
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Health concern */}
        <div>
          <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1 block">
            Health Concern
          </label>
          <SearchableDropdown
            options={healthConcerns}
            value={goal.healthConcern}
            onChange={handleConcernChange}
            placeholder="Search health concerns..."
            small
          />
          <input
            type="text"
            className="input-field py-1.5 text-xs mt-1.5"
            placeholder="Or type a custom concern..."
            value={selectedLib ? '' : goal.healthConcern}
            onChange={e => handleConcernChange(e.target.value)}
          />
        </div>

        {/* Goal description */}
        <div>
          <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1 block">
            Goal Description
          </label>
          {selectedLib && goalOptions.length > 0 && (
            <div className="mb-1.5">
              <SearchableDropdown
                options={goalOptions}
                value={goal.goalDescription}
                onChange={handleGoalSelect}
                placeholder="Search goals..."
                small
              />
            </div>
          )}
          <textarea
            className="textarea-field text-xs !min-h-[40px]"
            rows={2}
            placeholder="Goal description..."
            value={goal.goalDescription}
            onChange={e => onChange({ goalDescription: e.target.value })}
          />
        </div>

        {/* Target date */}
        <div>
          <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1 block">
            Target Date
          </label>
          <input
            type="date"
            className="input-field py-1.5 text-xs"
            value={goal.targetDate}
            onChange={e => onChange({ targetDate: e.target.value })}
          />
        </div>

        {/* Interventions */}
        <div>
          <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
            Interventions
          </label>
          {selectedGoalDef && selectedGoalDef.interventions.length > 0 && (
            <div className="space-y-1.5 mb-3">
              <p className="text-[10px] text-text-muted font-medium">Select from library:</p>
              {selectedGoalDef.interventions.map((iv, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all text-xs ${
                    goal.interventions.includes(iv) ? 'bg-accent-50 border border-accent-200' : 'bg-white border border-border-light hover:bg-surface-hover'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={goal.interventions.includes(iv)}
                    onChange={() => toggleLibIntervention(iv)}
                    className="accent-accent-600 mt-0.5 shrink-0"
                  />
                  <span className="text-text-secondary">{iv}</span>
                </label>
              ))}
            </div>
          )}

          <p className="text-[10px] text-text-muted font-medium mb-1.5">Add custom:</p>
          <div className="space-y-1.5">
            {goal.customInterventions.map((iv, idx) => (
              <div key={idx} className="flex gap-1.5">
                <input
                  type="text"
                  className="input-field py-1.5 text-xs flex-1"
                  placeholder="Custom intervention..."
                  value={iv}
                  onChange={e => updateCustomIv(idx, e.target.value)}
                />
                {goal.customInterventions.length > 1 && (
                  <button
                    onClick={() => removeCustomIv(idx)}
                    className="p-1 text-text-muted hover:text-danger-500 cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addCustomIv}
              className="text-[10px] text-primary-600 font-medium flex items-center gap-1 cursor-pointer"
            >
              <PlusIcon className="w-3 h-3" /> Add custom intervention
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HistorySession
   A single documentation session in the history list, collapsible.
   Shows the complete snapshot of all goals/interventions at that point.
   ══════════════════════════════════════════════════════════════════════ */

function HistorySession({ session }) {
  const [expanded, setExpanded] = useState(false);
  const goals = session.goals || [];

  return (
    <div className="card p-0 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left cursor-pointer hover:bg-surface-alt transition-colors"
      >
        {expanded
          ? <ChevronUpIcon className="w-3.5 h-3.5 text-text-muted shrink-0" />
          : <ChevronDownIcon className="w-3.5 h-3.5 text-text-muted shrink-0" />
        }
        <CalendarIcon className="w-3.5 h-3.5 text-primary-400 shrink-0" />
        <span className="text-xs font-medium text-text-primary">{session.date} {session.time}</span>
        <span className="badge badge-info text-[9px]">{goals.length} goal{goals.length !== 1 && 's'}</span>
        {session.note && (
          <span className="text-[10px] text-text-muted truncate flex-1 min-w-0">
            &mdash; {session.note.length > 60 ? session.note.slice(0, 60) + '...' : session.note}
          </span>
        )}
        {session.author && (
          <span className="text-[10px] text-text-muted shrink-0">{session.author}</span>
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border-light pt-3 animate-fade-in space-y-3">

          {/* Note */}
          {session.note && (
            <div className="bg-primary-50/30 rounded-lg p-3 border border-primary-100">
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Note</p>
              <p className="text-xs text-text-secondary whitespace-pre-line">{session.note}</p>
            </div>
          )}

          {/* Each goal snapshot */}
          {goals.map((goal, gIdx) => {
            const gStyle = getStyle(goal.goalStatus || 'Initiated');
            return (
              <div key={goal.goalId || gIdx} className="rounded-lg border border-border-light overflow-hidden">
                <div className={`px-3 py-2 ${gStyle.bg} border-b ${gStyle.border} flex items-center justify-between gap-2`}>
                  <div className="min-w-0 flex-1">
                    {goal.healthConcern && (
                      <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">{goal.healthConcern}</p>
                    )}
                    <p className="text-[11px] font-medium text-text-primary">{goal.goalDescription}</p>
                  </div>
                  <span className={`badge border text-[9px] shrink-0 ${gStyle.bg} ${gStyle.text} ${gStyle.border}`}>
                    {goal.goalStatus || 'Initiated'}
                  </span>
                </div>
                {goal.interventions?.length > 0 && (
                  <div className="px-3 py-2 space-y-1">
                    {goal.interventions.map((iv, ivIdx) => {
                      const ivSt = getStyle(iv.status || 'Initiated');
                      return (
                        <div key={ivIdx} className="flex items-center gap-2 text-[11px]">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${ivSt.dot}`} />
                          <span className="flex-1 text-text-secondary min-w-0 truncate">{iv.text}</span>
                          <span className={`text-[10px] font-medium ${ivSt.text}`}>
                            {iv.status || 'Initiated'}{iv.status === 'Completed' && ' \u2713'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* New goals added in this session */}
          {session.newGoals?.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-accent-700 font-medium">
              <PlusIcon className="w-3 h-3" />
              {session.newGoals.length} new goal{session.newGoals.length !== 1 && 's'} added in this session
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
   Standalone modal for adding a new goal outside of documentation.
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

    addEntry(patientId, 'carePlanGoals', {
      healthConcern: concern,
      description: goalDesc,
      status: 'Initiated',
      targetDate,
      interventions: allIvs,
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
