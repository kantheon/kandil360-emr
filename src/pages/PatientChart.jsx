import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patients } from '../data/seedData';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import OverviewTab from '../components/chart/OverviewTab';
import ProgressNotesTab from '../components/chart/ProgressNotesTab';
import CommunicationsTab from '../components/chart/CommunicationsTab';
import AppointmentsTab from '../components/chart/AppointmentsTab';
import AdmissionsTab from '../components/chart/AdmissionsTab';
import AssessmentsTab from '../components/chart/AssessmentsTab';
import CarePlanTab from '../components/chart/CarePlanTab';
import MedicationsTab from '../components/chart/MedicationsTab';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'notes', label: 'Progress Notes' },
  { id: 'communications', label: 'Communications' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'assessments', label: 'Assessments' },
  { id: 'careplan', label: 'Care Plan' },
  { id: 'medications', label: 'Medications' },
];

const riskColors = {
  Critical: 'bg-danger-100 text-danger-600 border-danger-200',
  High: 'bg-warn-100 text-[#92400e] border-warn-200',
  Medium: 'bg-primary-100 text-primary-700 border-primary-200',
  Low: 'bg-accent-100 text-accent-700 border-accent-200',
};

export default function PatientChart() {
  const { patientId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const patient = patients.find(p => p.id === patientId);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-muted text-lg">Patient not found</p>
        <Link to="/patients" className="text-primary-600 text-sm mt-2 hover:underline">Back to Patient List</Link>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab patient={patient} />;
      case 'notes': return <ProgressNotesTab patient={patient} />;
      case 'communications': return <CommunicationsTab patient={patient} />;
      case 'appointments': return <AppointmentsTab patient={patient} />;
      case 'admissions': return <AdmissionsTab patient={patient} />;
      case 'assessments': return <AssessmentsTab patient={patient} />;
      case 'careplan': return <CarePlanTab patient={patient} />;
      case 'medications': return <MedicationsTab patient={patient} />;
      default: return <OverviewTab patient={patient} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-0 animate-fade-in">
      {/* Back button */}
      <Link to="/patients" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary-600 font-medium mb-4 transition-colors">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Patients
      </Link>

      {/* Patient Banner - Always Visible */}
      <div className="card p-0 overflow-hidden mb-6">
        {/* Allergy alert strip */}
        {patient.allergies.length > 0 && (
          <div className="bg-danger-50 border-b border-danger-100 px-6 py-2 flex items-center gap-2">
            <ShieldExclamationIcon className="w-4 h-4 text-danger-500 shrink-0" />
            <span className="text-xs font-semibold text-danger-600">ALLERGIES:</span>
            <span className="text-xs text-danger-600">
              {patient.allergies.map(a => `${a.allergen} (${a.reaction} - ${a.severity})`).join(' | ')}
            </span>
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-text-primary">
                    {patient.lastName}, {patient.firstName}
                  </h1>
                  <span className={`badge border ${riskColors[patient.riskLevel]}`}>
                    {patient.riskLevel} Risk
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-text-secondary">
                  <span className="font-medium">{patient.id}</span>
                  <span className="text-text-muted">|</span>
                  <span>MRN: {patient.mrn}</span>
                  <span className="text-text-muted">|</span>
                  <span>DOB: {new Date(patient.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({patient.age}y)</span>
                  <span className="text-text-muted">|</span>
                  <span>{patient.sex}</span>
                  <span className="text-text-muted">|</span>
                  <span>{patient.language}</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="lg:ml-auto flex flex-wrap gap-4">
              <div className="bg-surface-alt rounded-xl px-4 py-2.5 min-w-[140px]">
                <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Insurance</p>
                <p className="text-xs font-semibold text-text-primary mt-0.5 leading-snug">{patient.insurance.plan.split(' - ')[0]}</p>
                <p className="text-[11px] text-text-muted">{patient.insurance.memberId}</p>
              </div>
              <div className="bg-surface-alt rounded-xl px-4 py-2.5 min-w-[140px]">
                <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">PCP</p>
                <p className="text-xs font-semibold text-text-primary mt-0.5">{patient.pcp}</p>
              </div>
              <div className="bg-surface-alt rounded-xl px-4 py-2.5 min-w-[140px]">
                <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Case Manager</p>
                <p className="text-xs font-semibold text-text-primary mt-0.5">{patient.caseInfo.assignedCM}</p>
                <p className="text-[11px] text-text-muted">{patient.caseInfo.program}</p>
              </div>
            </div>
          </div>

          {/* Contact strip */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border-light text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <PhoneIcon className="w-3.5 h-3.5 text-text-muted" />
              {patient.phone}
            </span>
            {patient.email && (
              <span className="text-text-muted">{patient.email}</span>
            )}
            <span className="text-text-muted">{patient.address}</span>
            <span className="ml-auto text-text-muted">
              Emergency: {patient.emergencyContact.name} ({patient.emergencyContact.relation}) - {patient.emergencyContact.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-white rounded-t-2xl px-2 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'tab-active'
                  : 'tab-inactive'
              }`}
            >
              {tab.label}
              {tab.id === 'notes' && patient.progressNotes.length > 0 && (
                <span className="ml-1.5 bg-primary-100 text-primary-700 text-[11px] font-bold px-1.5 py-0.5 rounded-md">
                  {patient.progressNotes.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-border-light p-6">
        {renderTab()}
      </div>
    </div>
  );
}
