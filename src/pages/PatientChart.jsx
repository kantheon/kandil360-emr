import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
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
  BeakerIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import OverviewTab from '../components/chart/OverviewTab';
import ProgressNotesTab from '../components/chart/ProgressNotesTab';
import CommunicationsTab from '../components/chart/CommunicationsTab';
import AppointmentsTab from '../components/chart/AppointmentsTab';
import AdmissionsTab from '../components/chart/AdmissionsTab';
import AssessmentsTab from '../components/chart/AssessmentsTab';
import CarePlanTab from '../components/chart/CarePlanTab';
import MedicationsTab from '../components/chart/MedicationsTab';
import VitalsTab from '../components/chart/VitalsTab';
import AuthorizationsTab from '../components/chart/AuthorizationsTab';
import CallMode from '../components/CallMode';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Squares2X2Icon },
  { id: 'notes', label: 'Notes', icon: DocumentTextIcon },
  { id: 'communications', label: 'Comms', icon: ChatBubbleLeftRightIcon },
  { id: 'appointments', label: 'Appts', icon: CalendarDaysIcon },
  { id: 'admissions', label: 'Admissions', icon: BuildingOffice2Icon },
  { id: 'assessments', label: 'Assessments', icon: ClipboardDocumentCheckIcon },
  { id: 'careplan', label: 'Care Plan', icon: FlagIcon },
  { id: 'medications', label: 'Meds', icon: BeakerIcon },
  { id: 'vitals', label: 'Vitals', icon: HeartIcon },
  { id: 'authorizations', label: 'Auths', icon: ShieldCheckIcon },
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
  const [callModeOpen, setCallModeOpen] = useState(false);
  const [callModeMinimized, setCallModeMinimized] = useState(false);
  const { getPatient } = useData();

  const patient = getPatient(patientId);

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
      case 'vitals': return <VitalsTab patient={patient} />;
      case 'authorizations': return <AuthorizationsTab patient={patient} />;
      default: return <OverviewTab patient={patient} />;
    }
  };

  return (
    <div className="bg-white min-h-screen -mt-[1px] lg:mt-0">
      {/* STICKY HEADER - no gap, flush to top */}
      <div className="sticky top-[43px] lg:top-0 z-20 bg-white shadow-sm">
        {/* Patient banner */}
        <div className="px-3 sm:px-4 lg:px-6 py-2 border-b border-border-light">
          <div className="flex items-center gap-2 sm:gap-3 max-w-7xl mx-auto">
            <Link to="/patients" className="p-1.5 -ml-1.5 rounded-lg text-text-muted hover:text-primary-600 hover:bg-primary-50 transition-colors shrink-0">
              <ArrowLeftIcon className="w-4 h-4" />
            </Link>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md shadow-primary-500/20 shrink-0">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base lg:text-lg font-bold text-text-primary whitespace-nowrap">
                  {patient.lastName}, {patient.firstName}
                </h1>
                <span className={`badge border text-[11px] ${riskColors[patient.riskLevel]}`}>{patient.riskLevel}</span>
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

            {/* Call mode button */}
            <button
              onClick={() => { setCallModeOpen(true); setCallModeMinimized(false); }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-md hover:shadow-accent-500/25 transition-all cursor-pointer shrink-0"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call Mode</span>
            </button>
          </div>
        </div>

        {/* Mobile: dropdown tab selector */}
        <div className="sm:hidden px-3 py-1.5 bg-surface-alt border-b border-border-light">
          <select value={activeTab} onChange={e => setActiveTab(e.target.value)} className="input-field py-2 text-xs font-semibold w-full">
            {tabs.map(tab => <option key={tab.id} value={tab.id}>{tab.label}</option>)}
          </select>
        </div>
        {/* Desktop: button tab bar */}
        <div className="hidden sm:block px-2 lg:px-4 bg-surface-alt border-b border-border-light">
          <div className="flex gap-0.5 max-w-7xl mx-auto py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive ? 'bg-white text-primary-700 shadow-sm border border-border-light' : 'text-text-secondary hover:bg-white/60 hover:text-text-primary border border-transparent'
                  }`}>
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary-500' : 'text-text-muted'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Allergy alert - scrolls with content */}
      {patient.allergies.length > 0 && (
        <div className="bg-danger-50 border-b border-danger-100 px-3 sm:px-4 lg:px-6 py-1.5 flex items-start sm:items-center gap-2">
          <ShieldExclamationIcon className="w-3.5 h-3.5 text-danger-500 shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-[11px] font-bold text-danger-600 shrink-0">ALLERGIES:</span>
          <span className="text-[11px] text-danger-600 break-words min-w-0">
            {patient.allergies.map(a => `${a.allergen} (${a.reaction})`).join(' | ')}
          </span>
        </div>
      )}

      {/* Tab Content */}
      <div className="p-3 pt-5 sm:p-4 sm:pt-5 lg:p-6 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {renderTab()}
        </div>
      </div>

      {/* Call Mode */}
      {callModeOpen && (
        <CallMode
          patient={patient}
          minimized={callModeMinimized}
          onToggleMinimize={() => setCallModeMinimized(!callModeMinimized)}
          onClose={() => { setCallModeOpen(false); setCallModeMinimized(false); }}
        />
      )}
    </div>
  );
}
