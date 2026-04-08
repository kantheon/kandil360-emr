import { useState } from 'react';
import {
  FlagIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon,
  ArrowPathIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import { carePlanLibrary } from '../../data/carePlanLibrary';
import { useData } from '../../contexts/DataContext';

const goalStatuses = ['Not Started','Initiated','In Progress','On Track','Met','Not Met','Deferred'];
const goalStatusConfig = {
  'Met': { color: 'bg-accent-100 text-accent-700 border-accent-200', icon: CheckCircleIcon, iconColor: 'text-accent-500' },
  'On Track': { color: 'bg-primary-100 text-primary-700 border-primary-200', icon: ArrowPathIcon, iconColor: 'text-primary-500' },
  'In Progress': { color: 'bg-warn-100 text-[#92400e] border-warn-200', icon: ClockIcon, iconColor: 'text-warn-500' },
  'Not Started': { color: 'bg-surface-alt text-text-secondary border-border', icon: ClockIcon, iconColor: 'text-text-muted' },
};

export default function CarePlanTab({ patient }) {
  const { addEntry, updateEntry, deleteEntry, isEditable } = useData();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [expandedGoals, setExpandedGoals] = useState(new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Detail modal state
  const [detailStatus, setDetailStatus] = useState('');
  const [detailCheckedInterventions, setDetailCheckedInterventions] = useState(new Set());
  const [detailCustomInterventions, setDetailCustomInterventions] = useState(['']);

  // Form state
  const [formConcern, setFormConcern] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState('Not Started');
  const [formTarget, setFormTarget] = useState('');
  const [formCheckedInterventions, setFormCheckedInterventions] = useState(new Set());
  const [formCustomInterventions, setFormCustomInterventions] = useState(['']);
  const [formBarriers, setFormBarriers] = useState('');

  const allGoals = patient.carePlan.goals;

  const toggleGoal = (id) => setExpandedGoals(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const openAddModal = () => {
    setSelectedGoal(null);
    setFormConcern('');
    setFormDesc('');
    setFormStatus('Not Started');
    setFormTarget('');
    setFormCheckedInterventions(new Set());
    setFormCustomInterventions(['']);
    setFormBarriers('');
    setShowGoalModal(true);
  };

  const openGoalDetail = (goal) => {
    setSelectedGoal(goal);
    setDetailStatus(goal.status || 'Not Started');
    setDetailCheckedInterventions(new Set());
    setDetailCustomInterventions(['']);
    setShowGoalModal(true);
  };

  const toggleDetailIntervention = (iv) => {
    setDetailCheckedInterventions(prev => {
      const n = new Set(prev); n.has(iv) ? n.delete(iv) : n.add(iv); return n;
    });
  };

  // Find library interventions for the selected goal's health concern
  const getLibraryInterventionsForGoal = (goal) => {
    if (!goal) return [];
    const lib = carePlanLibrary.find(c => c.healthConcern === goal.healthConcern);
    if (!lib) return [];
    // Get all interventions from all goals under this concern, deduplicated
    const all = lib.goals.flatMap(g => g.interventions);
    const existing = new Set(goal.interventions || []);
    return [...new Set(all)].filter(iv => !existing.has(iv));
  };

  const handleConcernSelect = (concern) => {
    setFormConcern(concern);
    setFormDesc('');
    setFormCheckedInterventions(new Set());
    setFormCustomInterventions(['']);
  };

  const handleGoalSelect = (desc) => {
    setFormDesc(desc);
    setFormCheckedInterventions(new Set());
  };

  const toggleIntervention = (iv) => {
    setFormCheckedInterventions(prev => {
      const next = new Set(prev);
      next.has(iv) ? next.delete(iv) : next.add(iv);
      return next;
    });
  };

  const saveGoal = () => {
    const allInterventions = [
      ...Array.from(formCheckedInterventions),
      ...formCustomInterventions.filter(i => i.trim()),
    ];
    addEntry(patient.id, 'carePlanGoals', {
      healthConcern: formConcern,
      description: formDesc,
      status: formStatus,
      targetDate: formTarget,
      interventions: allInterventions,
      barriers: formBarriers,
    });
    setShowGoalModal(false);
  };

  const handleSaveGoalDetail = () => {
    if (!selectedGoal) return;
    const updatedInterventions = [
      ...(selectedGoal.interventions || []),
      ...Array.from(detailCheckedInterventions),
      ...detailCustomInterventions.filter(i => i.trim()),
    ];
    if (isEditable(selectedGoal.id)) {
      // Update existing local entry
      updateEntry(patient.id, 'carePlanGoals', selectedGoal.id, {
        status: detailStatus,
        interventions: updatedInterventions,
      });
    } else {
      // For seed entries, add a new local entry with updated data
      addEntry(patient.id, 'carePlanGoals', {
        healthConcern: selectedGoal.healthConcern || '',
        description: selectedGoal.description,
        status: detailStatus,
        targetDate: selectedGoal.targetDate || '',
        interventions: updatedInterventions,
        note: 'Updated via goal detail',
      });
    }
    setShowGoalModal(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteEntry(patient.id, 'carePlanGoals', deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const met = allGoals.filter(g => g.status === 'Met').length;
  const inProgress = allGoals.filter(g => ['In Progress', 'On Track', 'Initiated'].includes(g.status)).length;
  const notStarted = allGoals.filter(g => g.status === 'Not Started').length;
  const selectedLib = carePlanLibrary.find(c => c.healthConcern === formConcern);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Care Plan</h2>
          <p className="text-xs text-text-muted mt-0.5">{allGoals.length} goals, {patient.carePlan.barriers.length} barriers</p>
        </div>
        <button onClick={openAddModal} className="btn-primary py-2 flex items-center gap-1.5">
          <PlusIcon className="w-4 h-4" /><span className="hidden sm:inline">Add Goal</span>
        </button>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-accent-50 rounded-2xl p-3 text-center border border-accent-100">
          <p className="text-xl font-bold text-accent-600">{met}</p>
          <p className="text-[11px] font-medium text-accent-700">Met</p>
        </div>
        <div className="bg-primary-50 rounded-2xl p-3 text-center border border-primary-100">
          <p className="text-xl font-bold text-primary-600">{inProgress}</p>
          <p className="text-[11px] font-medium text-primary-700">In Progress</p>
        </div>
        <div className="bg-surface-alt rounded-2xl p-3 text-center border border-border-light">
          <p className="text-xl font-bold text-text-secondary">{notStarted}</p>
          <p className="text-[11px] font-medium text-text-muted">Not Started</p>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this care plan goal? This action cannot be undone."
      />

      {/* Goals list - clickable & expandable */}
      <div className="space-y-2">
        {allGoals.map((goal) => {
          const config = goalStatusConfig[goal.status] || goalStatusConfig['Not Started'];
          const StatusIcon = config.icon;
          const isOpen = expandedGoals.has(goal.id);
          const interventions = goal.interventions || [];
          const editable = isEditable(goal.id);

          return (
            <div key={goal.id} className="card p-0 overflow-hidden">
              <button onClick={() => toggleGoal(goal.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-alt transition-colors cursor-pointer text-left">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${goal.status === 'Met' ? 'bg-accent-100' : 'bg-primary-50'}`}>
                  <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  {goal.healthConcern && <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{goal.healthConcern}</p>}
                  <p className={`text-sm font-medium leading-snug ${goal.status === 'Met' ? 'text-text-muted line-through' : 'text-text-primary'}`}>{goal.description}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">Target: {goal.targetDate || 'Not set'}</p>
                </div>
                <span className={`badge border text-[10px] shrink-0 ${config.color}`}>{goal.status}</span>
                {editable && (
                  <span onClick={e => { e.stopPropagation(); setDeleteTarget(goal); }} className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-500 cursor-pointer transition-colors shrink-0">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </span>
                )}
                {isOpen ? <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-border-light pt-3 animate-fade-in">
                  {interventions.length > 0 ? (
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Interventions</p>
                      <div className="space-y-1.5">
                        {interventions.map((iv, i) => (
                          <div key={i} className="flex items-start gap-2 bg-surface-alt rounded-lg p-2 text-xs text-text-secondary">
                            <span className="w-4 h-4 bg-accent-100 text-accent-700 rounded text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            {iv}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted mb-3">No interventions documented</p>
                  )}
                  {goal.barriers && (
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Barriers</p>
                      <p className="text-xs text-text-secondary">{goal.barriers}</p>
                    </div>
                  )}
                  <button onClick={() => openGoalDetail(goal)} className="text-xs text-primary-600 font-medium flex items-center gap-1 cursor-pointer hover:text-primary-700">
                    <PencilSquareIcon className="w-3.5 h-3.5" /> View / Add Entry
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Barriers */}
      {patient.carePlan.barriers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <ExclamationCircleIcon className="w-4 h-4 text-warn-500" /> Barriers to Care
          </h3>
          <div className="card p-4 space-y-2">
            {patient.carePlan.barriers.map((barrier, i) => (
              <div key={i} className="flex items-start gap-2 bg-warn-50/50 rounded-lg p-2.5 border border-warn-100/50">
                <span className="w-5 h-5 bg-warn-100 rounded-md flex items-center justify-center text-[10px] font-bold text-[#92400e] shrink-0">{i + 1}</span>
                <p className="text-xs text-text-secondary">{barrier}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/View Goal Modal */}
      <Modal open={showGoalModal} onClose={() => setShowGoalModal(false)} title={selectedGoal ? 'Goal Details' : 'Add Care Plan Goal'} wide
        footer={selectedGoal ? (
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowGoalModal(false)} className="btn-secondary py-2 text-xs">Close</button>
            <button onClick={handleSaveGoalDetail} className="btn-primary py-2 text-xs">Save Changes</button>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowGoalModal(false)} className="btn-secondary py-2 text-xs">Cancel</button>
            <button onClick={saveGoal} disabled={!formDesc} className={`btn-primary py-2 text-xs ${!formDesc ? 'opacity-50 cursor-not-allowed' : ''}`}>Save Goal</button>
          </div>
        )}>
        {selectedGoal ? (
          /* View & edit existing goal */
          <div className="space-y-4">
            {selectedGoal.healthConcern && (
              <div className="bg-danger-50 rounded-lg p-3 border border-danger-100">
                <p className="text-[10px] font-semibold text-danger-600 uppercase tracking-wider">Health Concern</p>
                <p className="text-sm font-medium text-danger-700 mt-0.5">{selectedGoal.healthConcern}</p>
              </div>
            )}
            <div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
              <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider mb-1">Goal</p>
              <p className="text-sm text-primary-800">{selectedGoal.description}</p>
              <p className="text-[11px] text-primary-500 mt-1">Target: {selectedGoal.targetDate || 'Not set'}</p>
              <div className="mt-2">
                <label className="text-[10px] font-medium text-primary-600 mb-0.5 block">Update Status</label>
                <select className="input-field py-1.5 text-xs" value={detailStatus} onChange={e => setDetailStatus(e.target.value)}>
                  {goalStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {/* Existing interventions */}
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2">Current Interventions</p>
              {(selectedGoal.interventions || []).length > 0 ? (
                <div className="space-y-1.5">
                  {selectedGoal.interventions.map((iv, i) => (
                    <div key={i} className="flex items-start gap-2 bg-accent-50 rounded-lg p-2.5 border border-accent-100 text-xs text-text-secondary">
                      <span className="w-5 h-5 bg-accent-100 text-accent-700 rounded text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      {iv}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted">No interventions documented</p>
              )}
            </div>
            {/* Add new interventions - checkboxes from library + custom */}
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2">Add New Interventions</p>
              {(() => {
                const available = getLibraryInterventionsForGoal(selectedGoal);
                return available.length > 0 ? (
                  <div className="space-y-1.5 mb-3">
                    <p className="text-[10px] text-text-muted font-medium">Select from library:</p>
                    {available.map((iv, i) => (
                      <label key={i} className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all text-xs ${detailCheckedInterventions.has(iv) ? 'bg-accent-50 border border-accent-200' : 'bg-white border border-border-light hover:bg-surface-hover'}`}>
                        <input type="checkbox" checked={detailCheckedInterventions.has(iv)} onChange={() => toggleDetailIntervention(iv)} className="accent-accent-600 mt-0.5 shrink-0" />
                        <span className="text-text-secondary">{iv}</span>
                      </label>
                    ))}
                  </div>
                ) : null;
              })()}
              <p className="text-[10px] text-text-muted font-medium mb-1.5">Add custom:</p>
              <div className="space-y-1.5">
                {detailCustomInterventions.map((iv, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <input type="text" className="input-field py-1.5 text-xs flex-1" placeholder="Custom intervention..." value={iv} onChange={e => { const u = [...detailCustomInterventions]; u[idx] = e.target.value; setDetailCustomInterventions(u); }} />
                    {detailCustomInterventions.length > 1 && (
                      <button onClick={() => { const u = [...detailCustomInterventions]; u.splice(idx, 1); setDetailCustomInterventions(u); }} className="p-1 text-text-muted hover:text-danger-500 cursor-pointer"><TrashIcon className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                ))}
                <button onClick={() => setDetailCustomInterventions([...detailCustomInterventions, ''])} className="text-[10px] text-primary-600 font-medium flex items-center gap-1 cursor-pointer"><PlusIcon className="w-3 h-3" /> Add custom intervention</button>
              </div>
            </div>
          </div>
        ) : (
          /* Add new goal form */
          <div className="space-y-3">
            <div className="bg-surface-alt rounded-lg p-3 border border-border-light">
              <label className="text-[10px] font-semibold text-text-secondary mb-1 block flex items-center gap-1">
                <span className="w-4 h-4 bg-danger-100 text-danger-600 rounded text-[9px] font-bold flex items-center justify-center">H</span>
                Health Concern
              </label>
              <select className="input-field py-1.5 text-xs mb-1.5" value={formConcern} onChange={e => handleConcernSelect(e.target.value)}>
                <option value="">Select from library...</option>
                {carePlanLibrary.map(c => <option key={c.id} value={c.healthConcern}>{c.healthConcern}</option>)}
              </select>
              <input type="text" className="input-field py-1.5 text-xs" placeholder="Or type custom..." value={formConcern} onChange={e => setFormConcern(e.target.value)} />
            </div>

            <div className="bg-surface-alt rounded-lg p-3 border border-border-light">
              <label className="text-[10px] font-semibold text-text-secondary mb-1 block flex items-center gap-1">
                <span className="w-4 h-4 bg-primary-100 text-primary-700 rounded text-[9px] font-bold flex items-center justify-center">G</span>
                Goal
              </label>
              {selectedLib ? (
                <select className="input-field py-1.5 text-xs mb-1.5" value={formDesc} onChange={e => handleGoalSelect(e.target.value)}>
                  <option value="">Select goal...</option>
                  {selectedLib.goals.map(g => <option key={g.id} value={g.description}>{g.description}</option>)}
                </select>
              ) : null}
              <textarea className="textarea-field text-xs !min-h-[40px]" rows={2} placeholder="Goal description..." value={formDesc} onChange={e => setFormDesc(e.target.value)} />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <select className="input-field py-1.5 text-xs" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                  {goalStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="date" className="input-field py-1.5 text-xs" value={formTarget} onChange={e => setFormTarget(e.target.value)} />
              </div>
            </div>

            <div className="bg-surface-alt rounded-lg p-3 border border-border-light">
              <label className="text-[10px] font-semibold text-text-secondary mb-2 block flex items-center gap-1">
                <span className="w-4 h-4 bg-accent-100 text-accent-700 rounded text-[9px] font-bold flex items-center justify-center">I</span>
                Interventions
              </label>

              {/* Library interventions as checkboxes */}
              {selectedLib && formDesc && (() => {
                const goal = selectedLib.goals.find(g => g.description === formDesc);
                if (!goal) return null;
                return (
                  <div className="space-y-1.5 mb-3">
                    <p className="text-[10px] text-text-muted font-medium">Select from library:</p>
                    {goal.interventions.map((iv, i) => (
                      <label key={i} className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all text-xs ${formCheckedInterventions.has(iv) ? 'bg-accent-50 border border-accent-200' : 'bg-white border border-border-light hover:bg-surface-hover'}`}>
                        <input type="checkbox" checked={formCheckedInterventions.has(iv)} onChange={() => toggleIntervention(iv)} className="accent-accent-600 mt-0.5 shrink-0" />
                        <span className="text-text-secondary">{iv}</span>
                      </label>
                    ))}
                  </div>
                );
              })()}

              {/* Custom interventions */}
              <p className="text-[10px] text-text-muted font-medium mb-1.5">Add custom:</p>
              <div className="space-y-1.5">
                {formCustomInterventions.map((iv, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <input type="text" className="input-field py-1.5 text-xs flex-1" placeholder={`Custom intervention...`} value={iv} onChange={e => { const u = [...formCustomInterventions]; u[idx] = e.target.value; setFormCustomInterventions(u); }} />
                    {formCustomInterventions.length > 1 && (
                      <button onClick={() => { const u = [...formCustomInterventions]; u.splice(idx, 1); setFormCustomInterventions(u); }} className="p-1 text-text-muted hover:text-danger-500 cursor-pointer"><TrashIcon className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                ))}
                <button onClick={() => setFormCustomInterventions([...formCustomInterventions, ''])} className="text-[10px] text-primary-600 font-medium flex items-center gap-1 cursor-pointer"><PlusIcon className="w-3 h-3" /> Add custom intervention</button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-text-secondary mb-0.5 block">Barriers (optional)</label>
              <input type="text" className="input-field py-1.5 text-xs" placeholder="e.g. Transportation, health literacy" value={formBarriers} onChange={e => setFormBarriers(e.target.value)} />
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}
