import { useState } from 'react';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import {
  ClipboardDocumentCheckIcon,
  UserIcon,
  HeartIcon,
  HomeIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { assessmentTemplates } from '../../data/assessmentTemplates';
import { useData } from '../../contexts/DataContext';

const statusColors = {
  'Completed': 'badge-active',
  'In Progress': 'badge-warning',
  'Pending': 'badge-info',
};

const scoreColorMap = {
  green: 'bg-accent-100 text-accent-700 border-accent-200',
  yellow: 'bg-warn-100 text-[#92400e] border-warn-200',
  orange: 'bg-warn-100 text-[#92400e] border-warn-200',
  red: 'bg-danger-100 text-danger-600 border-danger-200',
  blue: 'bg-primary-100 text-primary-700 border-primary-200',
};

function getScoreResult(template, answers) {
  const total = template.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  if (template.scoring.method === 'sum') {
    const range = template.scoring.ranges.find(r => total >= r.min && total <= r.max);
    return { total, label: range?.label || 'N/A', color: range?.color || 'blue' };
  }
  return { total, label: 'See sections', color: 'blue' };
}

export default function AssessmentsTab({ patient }) {
  const { addEntry, deleteEntry, isEditable } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formAnswers, setFormAnswers] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const allAssessments = patient.assessments;

  const [expandedAssessments, setExpandedAssessments] = useState(new Set(allAssessments.length > 0 ? [allAssessments[0].id] : []));

  const toggleAssessment = (id) => {
    setExpandedAssessments(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSaveAssessment = () => {
    if (!selectedTemplate || !allAnswered) return;
    const result = getScoreResult(selectedTemplate, formAnswers);
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const entry = {
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      answers: formAnswers,
      score: result.total,
      result: result.label,
      type: selectedTemplate.name,
      date: today,
      author: 'Current User',
      status: 'Completed',
      summary: `${selectedTemplate.name}: Score ${result.total} - ${result.label}`,
      phq2Score: null,
      fallRisk: null,
      painLevel: null,
      cognitiveStatus: null,
      functionalStatus: null,
      sdoh: null,
    };
    addEntry(patient.id, 'assessments', entry);
    setShowForm(false);
    setSelectedTemplate(null);
    setFormAnswers({});
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteEntry(patient.id, 'assessments', deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const filtered = allAssessments.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [a.type, a.author, a.date, a.summary, a.functionalStatus, a.cognitiveStatus].filter(Boolean).join(' ').toLowerCase().includes(q);
  });

  const startAssessment = (template) => {
    setSelectedTemplate(template);
    setFormAnswers({});
  };

  const handleAnswer = (questionId, value) => {
    setFormAnswers(prev => ({ ...prev, [questionId]: Number(value) }));
  };

  const allAnswered = selectedTemplate?.questions.every(q => formAnswers[q.id] !== undefined);
  const currentResult = selectedTemplate ? getScoreResult(selectedTemplate, formAnswers) : null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">Assessments</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search assessments..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-xs" />
          </div>
          <button onClick={() => { setShowForm(true); setSelectedTemplate(null); }} className="btn-primary py-2 flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">New Assessment</span>
          </button>
        </div>
      </div>

      {/* Modal - Template Picker or Form */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setSelectedTemplate(null); }} title={selectedTemplate ? selectedTemplate.name : 'New Assessment'} wide
        footer={selectedTemplate ? <div className="flex justify-end gap-2"><button onClick={() => { setShowForm(false); setSelectedTemplate(null); }} className="btn-secondary py-2 text-xs">Cancel</button><button onClick={handleSaveAssessment} disabled={!allAnswered} className={`btn-primary py-2 text-xs ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}><CheckCircleIcon className="w-4 h-4 inline mr-1" />Save Assessment</button></div> : null}>
        {!selectedTemplate ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assessmentTemplates.map((template) => (
              <button key={template.id} onClick={() => startAssessment(template)} className="text-left card card-hover p-4 cursor-pointer border border-border-light">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center"><ClipboardDocumentCheckIcon className="w-4 h-4 text-primary-600" /></div>
                  <span className="badge badge-neutral text-[10px]">{template.category}</span>
                </div>
                <h4 className="text-sm font-semibold text-text-primary">{template.name}</h4>
                <p className="text-xs text-text-muted mt-1">{template.questions.length} questions</p>
              </button>
            ))}
          </div>
        ) : (
          <>
            <button onClick={() => setSelectedTemplate(null)} className="text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer mb-4">&larr; Change assessment type</button>
            <div className="space-y-4">
              {selectedTemplate.questions.map((q, idx) => (
                <div key={q.id} className="bg-surface-alt rounded-xl p-4 border border-border-light">
                  <label className="text-xs font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-md flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                    {q.text}
                  </label>
                  <div className="mt-2 space-y-1.5">
                    {q.options.map((opt) => (
                      <label key={opt.value} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs ${formAnswers[q.id] === opt.value ? 'bg-primary-50 border border-primary-300 text-primary-700 font-medium' : 'bg-white border border-transparent hover:bg-surface-hover text-text-secondary'}`}>
                        <input type="radio" name={q.id} value={opt.value} checked={formAnswers[q.id] === opt.value} onChange={() => handleAnswer(q.id, opt.value)} className="accent-primary-600" />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {currentResult && Object.keys(formAnswers).length > 0 && (
              <div className={`mt-5 p-4 rounded-xl border ${scoreColorMap[currentResult.color] || 'bg-surface-alt text-text-primary border-border'}`}>
                <div className="flex items-center justify-between">
                  <div><p className="text-xs font-medium opacity-75">Score</p><p className="text-lg font-bold">{currentResult.total}</p></div>
                  <div className="text-right"><p className="text-xs font-medium opacity-75">Result</p><p className="text-sm font-bold">{allAnswered ? currentResult.label : 'Complete all questions...'}</p></div>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Assessment"
        message="Are you sure you want to delete this assessment? This action cannot be undone."
      />

      {/* Existing Assessments - Collapsible */}
      <div className="space-y-2">
        {filtered.map((assessment) => {
          const isOpen = expandedAssessments.has(assessment.id);
          const editable = isEditable(assessment.id);
          return (
            <div key={assessment.id} className="card p-0 overflow-hidden">
              <button
                onClick={() => toggleAssessment(assessment.id)}
                className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 bg-surface-alt hover:bg-surface-hover transition-colors cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <ClipboardDocumentCheckIcon className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-text-primary">{assessment.type}</span>
                    <span className={`badge ${statusColors[assessment.status] || 'badge-neutral'} text-[10px]`}>{assessment.status}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{assessment.author} &middot; {assessment.date}</p>
                </div>
                {editable && (
                  <span onClick={e => { e.stopPropagation(); setDeleteTarget(assessment); }} className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-500 cursor-pointer transition-colors shrink-0">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </span>
                )}
                {isOpen ? <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />}
              </button>

              {isOpen && (
                <div className="p-4 lg:p-5 border-t border-border-light animate-fade-in">
                  {/* Scores Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {[
                      { label: 'PHQ-2', value: assessment.phq2Score !== null ? `${assessment.phq2Score}/6` : 'N/A', color: assessment.phq2Score >= 3 ? 'text-danger-500' : 'text-accent-600' },
                      { label: 'Fall Risk', value: assessment.fallRisk, color: assessment.fallRisk === 'High' ? 'text-danger-500' : assessment.fallRisk === 'Moderate' ? 'text-warn-500' : 'text-accent-600' },
                      { label: 'Pain', value: assessment.painLevel, color: 'text-text-primary' },
                      { label: 'Cognitive', value: assessment.cognitiveStatus?.split(',')[0] || 'N/A', color: 'text-text-primary' },
                    ].map((item) => (
                      <div key={item.label} className="bg-surface-alt rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{item.label}</p>
                        <p className={`text-xs font-bold mt-0.5 ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Detail sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="bg-surface-alt rounded-lg p-3 border border-border-light">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <HeartIcon className="w-3.5 h-3.5 text-danger-400" />
                        <h4 className="text-[11px] font-semibold text-text-primary">Functional Status</h4>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">{assessment.functionalStatus}</p>
                    </div>
                    <div className="bg-surface-alt rounded-lg p-3 border border-border-light">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-primary-500" />
                        <h4 className="text-[11px] font-semibold text-text-primary">Cognitive Status</h4>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">{assessment.cognitiveStatus}</p>
                    </div>
                    {assessment.sdoh && (
                      <div className="bg-surface-alt rounded-lg p-3 border border-border-light lg:col-span-2">
                        <div className="flex items-center gap-1.5 mb-2">
                          <HomeIcon className="w-3.5 h-3.5 text-accent-500" />
                          <h4 className="text-[11px] font-semibold text-text-primary">SDOH</h4>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Object.entries(assessment.sdoh).map(([key, value]) => (
                            <div key={key} className="bg-white rounded-md p-2 border border-border-light">
                              <p className="text-[10px] text-text-muted font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                              <p className="text-[11px] text-text-primary font-medium mt-0.5">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {assessment.summary && (
                    <div className="mt-3 pt-3 border-t border-border-light">
                      <h4 className="text-[11px] font-semibold text-text-primary mb-1">Summary</h4>
                      <p className="text-xs text-text-secondary leading-relaxed">{assessment.summary}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && allAssessments.length > 0 && (
        <div className="text-center py-8"><p className="text-sm text-text-muted">No results for "{search}"</p></div>
      )}
      {allAssessments.length === 0 && !showForm && (
        <div className="text-center py-12">
          <ClipboardDocumentCheckIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">No assessments on file</p>
        </div>
      )}
    </div>
  );
}
