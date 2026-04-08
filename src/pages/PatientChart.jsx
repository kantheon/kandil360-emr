import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patients } from '../data/seedData';
import {
  ArrowLeftIcon,
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
  { id: 'notes', label: 'Notes' },
  { id: 'communications', label: 'Comms' },
  { id: 'appointments', label: 'Appts' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'assessments', label: 'Assessments' },
  { id: 'careplan', label: 'Care Plan' },
  { id: 'medications', label: 'Meds' },
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
    <div className="max-w-7xl mx-auto animate-fade-in -mt-4 lg:-mt-6 -mx-4 lg:-mx-6">
      {/* STICKY PATIENT HEADER - never scrolls away */}
      <div className="sticky top-14 z-20 bg-white border-b border-border-light shadow-sm">
        {/* Allergy strip */}
        {patient.allergies.length > 0 && (
          <div className="bg-danger-50 border-b border-danger-100 px-4 lg:px-6 py-1.5 flex items-center gap-2 overflow-x-auto">
            <ShieldExclamationIcon className="w-3.5 h-3.5 text-danger-500 shrink-0" />
            <span className="text-[11px] font-bold text-danger-600 shrink-0">ALLERGIES:</span>
            <span className="text-[11px] text-danger-600 whitespace-nowrap">
              {patient.allergies.map(a => `${a.allergen} (${a.reaction})`).join(' | ')}
            </span>
          </div>
        )}

        {/* Patient banner */}
        <div className="px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Back */}
            <Link to="/patients" className="p-1.5 -ml-1.5 rounded-lg text-text-muted hover:text-primary-600 hover:bg-primary-50 transition-colors shrink-0">
              <ArrowLeftIcon className="w-4 h-4" />
            </Link>

            {/* Avatar */}
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm lg:text-base shadow-md shadow-primary-500/20 shrink-0">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>

            {/* Name + key info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base lg:text-lg font-bold text-text-primary whitespace-nowrap">
                  {patient.lastName}, {patient.firstName}
                </h1>
                <span className={`badge border text-[11px] ${riskColors[patient.riskLevel]}`}>
                  {patient.riskLevel}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5 overflow-x-auto">
                <span className="font-medium text-text-secondary">{patient.id}</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">{patient.mrn}</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">DOB: {new Date(patient.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({patient.age}y {patient.sex[0]})</span>
                <span className="hidden md:inline">|</span>
                <span className="hidden md:inline">{patient.language}</span>
              </div>
            </div>

            {/* Quick info pills - desktop only */}
            <div className="hidden xl:flex items-center gap-3">
              <div className="bg-surface-alt rounded-lg px-3 py-1.5 text-center">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider leading-none">PCP</p>
                <p className="text-xs font-semibold text-text-primary mt-0.5 whitespace-nowrap">{patient.pcp}</p>
              </div>
              <div className="bg-surface-alt rounded-lg px-3 py-1.5 text-center">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider leading-none">Insurance</p>
                <p className="text-xs font-semibold text-text-primary mt-0.5 whitespace-nowrap">{patient.insurance.plan.split(' - ')[0]}</p>
              </div>
              <div className="bg-surface-alt rounded-lg px-3 py-1.5 text-center">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider leading-none">Program</p>
                <p className="text-xs font-semibold text-text-primary mt-0.5 whitespace-nowrap">{patient.caseInfo.program}</p>
              </div>
            </div>

            {/* Phone quick action */}
            <a href={`tel:${patient.phone}`} className="hidden sm:flex items-center gap-1.5 bg-accent-50 text-accent-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent-100 transition-colors shrink-0">
              <PhoneIcon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{patient.phone}</span>
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-2 lg:px-4 overflow-x-auto -mb-px">
          <div className="flex gap-0 min-w-max">
            {tabs.map((tab) => {
              const count = tab.id === 'notes' ? patient.progressNotes.length :
                tab.id === 'communications' ? patient.communications.length :
                tab.id === 'admissions' ? patient.admissions.length :
                tab.id === 'assessments' ? patient.assessments.length :
                tab.id === 'appointments' ? patient.appointments.length : 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 lg:px-5 py-3 text-xs lg:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-surface-alt text-text-muted'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-4 lg:p-6 min-h-[60vh]">
        {renderTab()}
      </div>
    </div>
  );
}
