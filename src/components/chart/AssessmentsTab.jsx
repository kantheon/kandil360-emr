import {
  ClipboardDocumentCheckIcon,
  UserIcon,
  HeartIcon,
  ShieldCheckIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const statusColors = {
  'Completed': 'badge-active',
  'In Progress': 'badge-warning',
  'Pending': 'badge-info',
};

export default function AssessmentsTab({ patient }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Assessments</h2>
        <p className="text-xs text-text-muted mt-0.5">{patient.assessments.length} assessments on file</p>
      </div>

      <div className="space-y-5">
        {patient.assessments.map((assessment) => (
          <div key={assessment.id} className="card p-0 overflow-hidden">
            {/* Header */}
            <div className="bg-surface-alt px-6 py-4 border-b border-border-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <ClipboardDocumentCheckIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{assessment.type}</h3>
                    <p className="text-xs text-text-muted">{assessment.author} &middot; {assessment.date}</p>
                  </div>
                </div>
                <span className={`badge ${statusColors[assessment.status] || 'badge-neutral'}`}>
                  {assessment.status}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Clinical Scores Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  {
                    label: 'PHQ-2 Score',
                    value: assessment.phq2Score !== null ? `${assessment.phq2Score}/6` : 'N/A',
                    color: assessment.phq2Score >= 3 ? 'text-danger-500' : assessment.phq2Score !== null ? 'text-accent-600' : 'text-text-muted'
                  },
                  {
                    label: 'Fall Risk',
                    value: assessment.fallRisk,
                    color: assessment.fallRisk === 'High' ? 'text-danger-500' : assessment.fallRisk === 'Moderate' ? 'text-warn-500' : 'text-accent-600'
                  },
                  {
                    label: 'Pain Level',
                    value: assessment.painLevel,
                    color: 'text-text-primary'
                  },
                  {
                    label: 'Cognitive Status',
                    value: assessment.cognitiveStatus?.split(',')[0] || 'N/A',
                    color: 'text-text-primary'
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-surface-alt rounded-xl p-3 text-center">
                    <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">{item.label}</p>
                    <p className={`text-sm font-bold mt-1 ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Detailed Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Functional Status */}
                <div className="bg-surface-alt rounded-xl p-4 border border-border-light">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartIcon className="w-4 h-4 text-danger-400" />
                    <h4 className="text-xs font-semibold text-text-primary">Functional Status</h4>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{assessment.functionalStatus}</p>
                </div>

                {/* Cognitive */}
                <div className="bg-surface-alt rounded-xl p-4 border border-border-light">
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="w-4 h-4 text-primary-500" />
                    <h4 className="text-xs font-semibold text-text-primary">Cognitive Status</h4>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{assessment.cognitiveStatus}</p>
                </div>

                {/* SDOH */}
                {assessment.sdoh && (
                  <div className="bg-surface-alt rounded-xl p-4 border border-border-light lg:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <HomeIcon className="w-4 h-4 text-accent-500" />
                      <h4 className="text-xs font-semibold text-text-primary">Social Determinants of Health</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(assessment.sdoh).map(([key, value]) => (
                        <div key={key} className="bg-white rounded-lg p-3 border border-border-light">
                          <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-xs text-text-primary font-medium mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              {assessment.summary && (
                <div className="mt-4 pt-4 border-t border-border-light">
                  <h4 className="text-xs font-semibold text-text-primary mb-2">Assessment Summary</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{assessment.summary}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {patient.assessments.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentCheckIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">No assessments on file</p>
        </div>
      )}
    </div>
  );
}
