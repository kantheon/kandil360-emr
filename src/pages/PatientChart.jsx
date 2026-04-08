import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patients } from '../data/seedData';
import {
  ArrowLeftIcon,
  ShieldExclamationIcon,
  PhoneIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
  FlagIcon,
  BeakerIcon
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
  { id: 'overview', label: 'Overview', icon: Squares2X2Icon },
  { id: 'notes', label: 'Notes', icon: DocumentTextIcon },
  { id: 'communications', label: 'Comms', icon: ChatBubbleLeftRightIcon },
  { id: 'appointments', label: 'Appts', icon: CalendarDaysIcon },
  { id: 'admissions', label: 'Admissions', icon: BuildingOffice2Icon },
  { id: 'assessments', label: 'Assessments', icon: ClipboardDocumentCheckIcon },
  { id: 'careplan', label: 'Care Plan', icon: FlagIcon },
  { id: 'medications', label: 'Meds', icon: BeakerIcon },
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
      <div className="flex flex-col items-center justify-center py-20 px-6">
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
    <div className="animate-fade-in">
      {/* ===== STICKY HEADER - pinned to top of content area ===== */}
      <div className="sticky top-12 lg:top-0 z-20 bg-white shadow-sm">
        {/* Allergy strip */}
        {patient.allergies.length > 0 && (
          <div className="bg-danger-50 border-b border-danger-100 px-4 lg:px-6 py-1 flex items-center gap-2 overflow-x-auto">
            <ShieldExclamationIcon className="w-3.5 h-3.5 text-danger-500 shrink-0" />
            <span className="text-[11px] font-bold text-danger-600 shrink-0">ALLERGIES:</span>
            <span className="text-[11px] text-danger-600 whitespace-nowrap">
              {patient.allergies.map(a => `${a.allergen} (${a.reaction})`).join(' | ')}
            </span>
          </div>
        )}

        {/* Patient banner */}
        <div className="px-4 lg:px-6 py-2.5 border-b border-border-light">
          <div className="flex items-center gap-3 max-w-7xl mx-auto">
            {/* Back */}
            <Link to="/patients" className="p-1.5 -ml-1.5 rounded-lg text-text-muted hover:text-primary-600 hover:bg-primary-50 transition-colors shrink-0">
              <ArrowLeftIcon className="w-4 h-4" />
            </Link>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-500/20 shrink-0">
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
              <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                <span className="font-medium text-text-secondary">{patient.id}</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">{patient.mrn}</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">DOB: {new Date(patient.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({patient.age}y {patient.sex[0]})</span>
              </div>
            </div>

            {/* Quick info - desktop */}
            <div className="hidden xl:flex items-center gap-2">
              <div className="bg-surface-alt rounded-lg px-3 py-1.5">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider leading-none">PCP</p>
                <p className="text-xs font-semibold text-text-primary mt-0.5 whitespace-nowrap">{patient.pcp}</p>
              </div>
              <div className="bg-surface-alt rounded-lg px-3 py-1.5">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider leading-none">Insurance</p>
                <p className="text-xs font-semibold text-text-primary mt-0.5 whitespace-nowrap">{patient.insurance.plan.split(' - ')[0]}</p>
              </div>
              <div className="bg-surface-alt rounded-lg px-3 py-1.5">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider leading-none">Program</p>
                <p className="text-xs font-semibold text-text-primary mt-0.5 whitespace-nowrap">{patient.caseInfo.program}</p>
              </div>
            </div>

            {/* Phone */}
            <a href={`tel:${patient.phone}`} className="hidden sm:flex items-center gap-1.5 bg-accent-50 text-accent-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent-100 transition-colors shrink-0">
              <PhoneIcon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{patient.phone}</span>
            </a>
          </div>
        </div>

        {/* Tab bar with icons */}
        <div className="px-2 lg:px-4 overflow-x-auto bg-surface-alt border-b border-border-light">
          <div className="flex gap-1 min-w-max max-w-7xl mx-auto py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = tab.id === 'notes' ? patient.progressNotes.length :
                tab.id === 'communications' ? patient.communications.length :
                tab.id === 'admissions' ? patient.admissions.length :
                tab.id === 'assessments' ? patient.assessments.length :
                tab.id === 'appointments' ? patient.appointments.length : 0;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-primary-700 shadow-sm border border-border-light'
                      : 'text-text-secondary hover:bg-white/60 hover:text-text-primary border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary-500' : 'text-text-muted'}`} />
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                      isActive ? 'bg-primary-100 text-primary-700' : 'bg-border-light text-text-muted'
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
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
