import {
  FlagIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const goalStatusConfig = {
  'Met': { color: 'bg-accent-100 text-accent-700 border-accent-200', icon: CheckCircleIcon, iconColor: 'text-accent-500' },
  'On Track': { color: 'bg-primary-100 text-primary-700 border-primary-200', icon: ArrowPathIcon, iconColor: 'text-primary-500' },
  'In Progress': { color: 'bg-warn-100 text-[#92400e] border-warn-200', icon: ClockIcon, iconColor: 'text-warn-500' },
  'Not Started': { color: 'bg-surface-alt text-text-secondary border-border', icon: ClockIcon, iconColor: 'text-text-muted' },
};

export default function CarePlanTab({ patient }) {
  const { goals, barriers } = patient.carePlan;

  const met = goals.filter(g => g.status === 'Met').length;
  const inProgress = goals.filter(g => g.status === 'In Progress' || g.status === 'On Track').length;
  const notStarted = goals.filter(g => g.status === 'Not Started').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Care Plan</h2>
          <p className="text-xs text-text-muted mt-0.5">{goals.length} goals, {barriers.length} identified barriers</p>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-accent-50 rounded-2xl p-4 text-center border border-accent-100">
          <p className="text-2xl font-bold text-accent-600">{met}</p>
          <p className="text-xs font-medium text-accent-700 mt-1">Goals Met</p>
        </div>
        <div className="bg-primary-50 rounded-2xl p-4 text-center border border-primary-100">
          <p className="text-2xl font-bold text-primary-600">{inProgress}</p>
          <p className="text-xs font-medium text-primary-700 mt-1">In Progress</p>
        </div>
        <div className="bg-surface-alt rounded-2xl p-4 text-center border border-border-light">
          <p className="text-2xl font-bold text-text-secondary">{notStarted}</p>
          <p className="text-xs font-medium text-text-muted mt-1">Not Started</p>
        </div>
      </div>

      {/* Goals */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <FlagIcon className="w-4 h-4 text-primary-500" />
          Goals
        </h3>
        <div className="space-y-3">
          {goals.map((goal) => {
            const config = goalStatusConfig[goal.status] || goalStatusConfig['Not Started'];
            const StatusIcon = config.icon;
            return (
              <div key={goal.id} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    goal.status === 'Met' ? 'bg-accent-100' : 'bg-primary-50'
                  }`}>
                    <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className={`text-sm font-medium leading-snug ${
                        goal.status === 'Met' ? 'text-text-muted line-through' : 'text-text-primary'
                      }`}>
                        {goal.description}
                      </p>
                      <span className={`badge border text-[11px] shrink-0 ${config.color}`}>
                        {goal.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1.5">Target date: {goal.targetDate}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barriers */}
      {barriers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <ExclamationCircleIcon className="w-4 h-4 text-warn-500" />
            Barriers to Care
          </h3>
          <div className="card p-5">
            <div className="space-y-3">
              {barriers.map((barrier, i) => (
                <div key={i} className="flex items-start gap-3 bg-warn-50/50 rounded-xl p-3.5 border border-warn-100/50">
                  <div className="w-6 h-6 bg-warn-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-[#92400e]">{i + 1}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{barrier}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
