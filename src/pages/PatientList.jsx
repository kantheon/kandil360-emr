import { useState } from 'react';
import { Link } from 'react-router-dom';
import { patients } from '../data/seedData';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const riskColors = {
  Critical: 'badge-critical',
  High: 'badge-warning',
  Medium: 'badge-info',
  Low: 'badge-active',
};

const acuityColors = {
  High: 'bg-danger-400',
  Medium: 'bg-warn-400',
  Low: 'bg-accent-400',
};

export default function PatientList() {
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');

  const filtered = patients.filter(p => {
    const matchesSearch =
      `${p.firstName} ${p.lastName} ${p.id} ${p.mrn}`.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = filterRisk === 'All' || p.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Patient Roster</h1>
          <p className="text-text-secondary text-sm mt-1">{patients.length} active patients in your caseload</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, ID, or MRN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-text-muted" />
          {['All', 'Critical', 'High', 'Medium', 'Low'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterRisk(level)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterRisk === level
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-text-secondary border border-border hover:bg-surface-hover'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((patient, index) => (
          <Link
            key={patient.id}
            to={`/patients/${patient.id}`}
            className="card card-hover p-0 block overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Card Header */}
            <div className="p-5 pb-4">
              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold text-base shrink-0">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${acuityColors[patient.caseInfo.acuity]}`} />
                </div>
                {/* Name & ID */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[15px] font-semibold text-text-primary truncate">
                      {patient.lastName}, {patient.firstName}
                    </h3>
                    <span className={`badge ${riskColors[patient.riskLevel]} shrink-0`}>
                      {patient.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-text-muted font-medium">{patient.id}</span>
                    <span className="text-text-muted">·</span>
                    <span className="text-xs text-text-muted">{patient.mrn}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="px-5 pb-4 space-y-2.5">
              {/* Demographics */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
                <span className="font-medium">{patient.age}y {patient.sex}</span>
                <span>DOB: {new Date(patient.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>{patient.language}</span>
              </div>

              {/* Diagnoses Preview */}
              <div className="flex flex-wrap gap-1.5">
                {patient.diagnoses.slice(0, 3).map((dx, i) => (
                  <span key={i} className="badge badge-neutral text-[11px]">
                    {dx.code}
                  </span>
                ))}
                {patient.diagnoses.length > 3 && (
                  <span className="badge badge-neutral text-[11px]">+{patient.diagnoses.length - 3}</span>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <PhoneIcon className="w-3.5 h-3.5" />
                  {patient.phone}
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 bg-surface-alt border-t border-border-light">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-text-muted">Program: </span>
                  <span className="text-text-secondary font-medium">{patient.caseInfo.program}</span>
                </div>
                <div className="flex items-center gap-1 text-text-muted">
                  <CalendarDaysIcon className="w-3.5 h-3.5" />
                  <span>Follow-up: {patient.caseInfo.nextFollowUp}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted text-sm">No patients match your search criteria</p>
        </div>
      )}
    </div>
  );
}
