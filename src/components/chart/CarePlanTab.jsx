import { useState } from 'react';
import {
  FlagIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon,
  ArrowPathIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import { carePlanLibrary } from '../../data/carePlanLibrary';
import { addPatientEntry, getPatientEntries } from '../../data/localStore';

const goalStatuses = ['Not Started','Initiated','In Progress','On Track','Met','Not Met','Deferred'];
const goalStatusConfig = {
  'Met': { color: 'bg-accent-100 text-accent-700 border-accent-200', icon: CheckCircleIcon, iconColor: 'text-accent-500' },
  'On Track': { color: 'bg-primary-100 text-primary-700 border-primary-200', icon: ArrowPathIcon, iconColor: 'text-primary-500' },
  'In Progress': { color: 'bg-warn-100 text-[#92400e] border-warn-200', icon: ClockIcon, iconColor: 'text-warn-500' },
  'Not Started': { color: 'bg-surface-alt text-text-secondary border-border', icon: ClockIcon, iconColor: 'text-text-muted' },
};

export default function CarePlanTab({ patient }) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [expandedGoals, setExpandedGoals] = useState(new Set());
  const [saveCount, setSaveCount] = useState(0);

  // Form state
  const [formConcern, setFormConcern] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState('Not Started');
  const [formTarget, setFormTarget] = useState('');
  const [formInterventions, setFormInterventions] = useState(['']);
  const [formBarriers, setFormBarriers] = useState('');

  const localGoals = getPatientEntries(patient.id, 'carePlanGoals');
  void saveCount;

  const allGoals = [
    ...patient.carePlan.goals.map(g => ({ ...g, source: 'seed' })),
    ...localGoals.map((g, i) => ({
      id: g.id || `local-g-${i}`,
      description: g.description || '',
      status: g.status || 'Not Started',
      targetDate: g.targetDate || '',
      healthConcern: g.healthConcern || '',
      interventions: g.interventions || [],
      barriers: g.barriers || '',
      source: 'local'
    }))
  ];

  const toggleGoal = (id) => setExpandedGoals(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const openAddModal = () => {
    setSelectedGoal(null);
    setFormConcern('');
    setFormDesc('');
    setFormStatus('Not Started');
    setFormTarget('');
    setFormInterventions(['']);
    setFormBarriers('');
    setShowGoalModal(true);
  };

  const openGoalDetail = (goal) => {
    setSelectedGoal(goal);
    setShowGoalModal(true);
  };

  const handleConcernSelect = (concern) => {
    setFormConcern(concern);
    setFormDesc('');
    setFormInterventions(['']);
  };

  const handleGoalSelect = (desc) => {
    const lib = carePlanLibrary.find(c => c.healthConcern === formConcern);
    const goal = lib?.goals.find(g => g.description === desc);
    setFormDesc(desc);
    if (goal) setFormInterventions([...goal.interventions]);
  };

  const saveGoal = () => {
    addPatientEntry(patient.id, 'carePlanGoals', {
      healthConcern: formConcern,
      description: formDesc,
      status: formStatus,
      targetDate: formTarget,
      interventions: formInterventions.filter(i => i.trim()),
      barriers: formBarriers,
    });
    setSaveCount(c => c + 1);
    setShowGoalModal(false);
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

      {/* Goals list - clickable & expandable */}
      <div className="space-y-2">
        {allGoals.map((goal) => {
          const config = goalStatusConfig[goal.status] || goalStatusConfig['Not Started'];
          const StatusIcon = config.icon;
          const isOpen = expandedGoals.has(goal.id);
          const interventions = goal.interventions || [];

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
      <Modal open={showGoalModal} onClose={() => setShowGoalModal(false)} title={selectedGoal ? 'Goal Details' : 'Add Care Plan Goal'} wide>
        {selectedGoal ? (
          /* View existing goal */
          <div className="space-y-4">
            {selectedGoal.healthConcern && (
              <div className="bg-danger-50 rounded-lg p-3 border border-danger-100">
                <p className="text-[10px] font-semibold text-danger-600 uppercase tracking-wider">Health Concern</p>
                <p className="text-sm font-medium text-danger-700 mt-0.5">{selectedGoal.healthConcern}</p>
              </div>
            )}
            <div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider">Goal</p>
                <span className={`badge border text-[10px] ${(goalStatusConfig[selectedGoal.status] || goalStatusConfig['Not Started']).color}`}>{selectedGoal.status}</span>
              </div>
              <p className="text-sm text-primary-800">{selectedGoal.description}</p>
              <p className="text-[11px] text-primary-500 mt-1">Target: {selectedGoal.targetDate || 'Not set'}</p>
            </div>
            {(selectedGoal.interventions || []).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-text-secondary mb-2">Interventions</p>
                <div className="space-y-1.5">
                  {selectedGoal.interventions.map((iv, i) => (
                    <div key={i} className="flex items-start gap-2 bg-accent-50 rounded-lg p-2.5 border border-accent-100 text-xs text-text-secondary">
                      <span className="w-5 h-5 bg-accent-100 text-accent-700 rounded text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      {iv}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <label className="text-[10px] font-semibold text-text-secondary mb-1 block flex items-center gap-1">
                <span className="w-4 h-4 bg-accent-100 text-accent-700 rounded text-[9px] font-bold flex items-center justify-center">I</span>
                Interventions
              </label>
              <div className="space-y-1.5">
                {formInterventions.map((iv, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <input type="text" className="input-field py-1.5 text-xs flex-1" placeholder={`Intervention ${idx + 1}...`} value={iv} onChange={e => { const u = [...formInterventions]; u[idx] = e.target.value; setFormInterventions(u); }} />
                    {formInterventions.length > 1 && (
                      <button onClick={() => { const u = [...formInterventions]; u.splice(idx, 1); setFormInterventions(u); }} className="p-1 text-text-muted hover:text-danger-500 cursor-pointer"><TrashIcon className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                ))}
                <button onClick={() => setFormInterventions([...formInterventions, ''])} className="text-[10px] text-primary-600 font-medium flex items-center gap-1 cursor-pointer"><PlusIcon className="w-3 h-3" /> Add intervention</button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-text-secondary mb-0.5 block">Barriers (optional)</label>
              <input type="text" className="input-field py-1.5 text-xs" placeholder="e.g. Transportation, health literacy" value={formBarriers} onChange={e => setFormBarriers(e.target.value)} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowGoalModal(false)} className="btn-secondary py-2 text-xs">Cancel</button>
              <button onClick={saveGoal} disabled={!formDesc} className={`btn-primary py-2 text-xs ${!formDesc ? 'opacity-50 cursor-not-allowed' : ''}`}>Save Goal</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
