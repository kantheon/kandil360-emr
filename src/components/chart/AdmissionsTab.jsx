import { useState } from 'react';
import {
  BuildingOffice2Icon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import { addPatientEntry, getPatientEntries } from '../../data/localStore';

const facilityTypeColors = {
  'Acute Care': 'badge-critical',
  'Inpatient Rehab (IRF)': 'badge-warning',
  'Skilled Nursing Facility': 'badge-info',
};

export default function AdmissionsTab({ patient }) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [_saveCount, setSaveCount] = useState(0);
  const [facility, setFacility] = useState('');
  const [facilityType, setFacilityType] = useState('Acute Care');
  const [admitDate, setAdmitDate] = useState('');
  const [admitDiagnosis, setAdmitDiagnosis] = useState('');
  const [attendingPhysician, setAttendingPhysician] = useState('');
  const [levelOfCare, setLevelOfCare] = useState('Med-Surg');

  const localEntries = getPatientEntries(patient.id, 'admissions');
  const allAdmissions = [...localEntries.slice().reverse().map(e => ({ ...e, dischargeDate: e.dischargeDate || null })), ...patient.admissions];

  const [expandedAdms, setExpandedAdms] = useState(new Set(allAdmissions.map(a => a.id)));

  const toggleAdm = (id) => {
    setExpandedAdms(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const resetForm = () => {
    setFacility(''); setFacilityType('Acute Care'); setAdmitDate(''); setAdmitDiagnosis(''); setAttendingPhysician(''); setLevelOfCare('Med-Surg');
  };

  const handleSave = () => {
    const entry = {
      facility,
      facilityType,
      admitDate,
      admitDiagnosis,
      attendingPhysician,
      levelOfCare,
      dischargeDate: null,
    };
    addPatientEntry(patient.id, 'admissions', entry);
    setShowForm(false);
    resetForm();
    setSaveCount(c => c + 1);
  };

  const current = allAdmissions.filter(a => !a.dischargeDate);
  const past = allAdmissions.filter(a => a.dischargeDate);

  const filterAdm = (adm) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [adm.facility, adm.admitDiagnosis, adm.attendingPhysician, adm.facilityType, adm.admitDate, adm.dischargeDate].filter(Boolean).join(' ').toLowerCase().includes(q);
  };

  const filteredCurrent = current.filter(filterAdm);
  const filteredPast = past.filter(filterAdm);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Admissions</h2>
          <p className="text-xs text-text-muted mt-0.5">{current.length} current, {past.length} past</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search admissions..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-xs" />
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary py-2 flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" /><span className="hidden sm:inline">Add Admission</span>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Admission">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Facility</label>
            <input type="text" className="input-field py-2 text-xs" placeholder="Facility name" value={facility} onChange={e => setFacility(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Facility Type</label>
            <select value={facilityType} onChange={e => setFacilityType(e.target.value)} className="input-field py-2 text-xs">
              <option>Acute Care</option><option>SNF</option><option>Inpatient Rehab</option><option>LTACH</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Admit Date</label>
            <input type="date" className="input-field py-2 text-xs" value={admitDate} onChange={e => setAdmitDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Admit Diagnosis</label>
            <input type="text" className="input-field py-2 text-xs" placeholder="Primary diagnosis" value={admitDiagnosis} onChange={e => setAdmitDiagnosis(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Attending Physician</label>
            <input type="text" className="input-field py-2 text-xs" placeholder="Physician name" value={attendingPhysician} onChange={e => setAttendingPhysician(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Level of Care</label>
            <select value={levelOfCare} onChange={e => setLevelOfCare(e.target.value)} className="input-field py-2 text-xs">
              <option>ICU</option><option>Telemetry</option><option>Med-Surg</option><option>Observation</option><option>Surgical</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowForm(false)} className="btn-secondary py-2 text-xs">Cancel</button>
          <button onClick={handleSave} className="btn-primary py-2 text-xs">Save Admission</button>
        </div>
      </Modal>

      {/* Current */}
      {filteredCurrent.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-danger-500 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-danger-400 rounded-full animate-pulse" />
            Currently Admitted
          </h3>
          <div className="space-y-2">
            {filteredCurrent.map((adm) => {
              const isOpen = expandedAdms.has(adm.id);
              return (
                <div key={adm.id} className="card p-0 overflow-hidden border-danger-200">
                  <button onClick={() => toggleAdm(adm.id)} className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 bg-danger-50 hover:bg-danger-100/50 transition-colors cursor-pointer text-left">
                    <BuildingOffice2Icon className="w-5 h-5 text-danger-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-danger-700">{adm.facility}</span>
                      <div className="text-xs text-danger-500 mt-0.5">Admitted {adm.admitDate} &middot; {Math.ceil((new Date() - new Date(adm.admitDate)) / 86400000)} days</div>
                    </div>
                    <span className={`badge ${facilityTypeColors[adm.facilityType] || 'badge-neutral'} shrink-0`}>{adm.facilityType}</span>
                    {isOpen ? <ChevronUpIcon className="w-4 h-4 text-danger-400 shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-danger-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 lg:p-5 border-t border-danger-100 animate-fade-in">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[['Admit Diagnosis', adm.admitDiagnosis], ['Attending', adm.attendingPhysician], ['Level of Care', adm.levelOfCare]].map(([l, v]) => (
                          <div key={l} className="bg-surface-alt rounded-lg p-2.5">
                            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{l}</p>
                            <p className="text-xs font-semibold text-text-primary mt-0.5">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past */}
      {filteredPast.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Admission History</h3>
          <div className="space-y-2">
            {filteredPast.map((adm) => {
              const isOpen = expandedAdms.has(adm.id);
              return (
                <div key={adm.id} className="card p-0 overflow-hidden">
                  <button onClick={() => toggleAdm(adm.id)} className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 bg-surface-alt hover:bg-surface-hover transition-colors cursor-pointer text-left">
                    <BuildingOffice2Icon className="w-5 h-5 text-text-muted shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-text-primary">{adm.facility}</span>
                        {adm.readmissionFlag && <span className="badge badge-critical text-[10px]">Readmission</span>}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">{adm.admitDate} - {adm.dischargeDate} &middot; {adm.lengthOfStay}d &middot; {adm.admitDiagnosis}</div>
                    </div>
                    {isOpen ? <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 lg:p-5 border-t border-border-light animate-fade-in">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[['Admit Date', adm.admitDate], ['Discharge Date', adm.dischargeDate], ['LOS', `${adm.lengthOfStay} days`], ['Level of Care', adm.levelOfCare]].map(([l, v]) => (
                          <div key={l}>
                            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{l}</p>
                            <p className="text-xs font-semibold text-text-primary mt-0.5">{v}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-border-light">
                        <div>
                          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Admit Diagnosis</p>
                          <p className="text-xs text-text-primary mt-0.5">{adm.admitDiagnosis}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Attending</p>
                          <p className="text-xs text-text-primary mt-0.5">{adm.attendingPhysician}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border-light flex items-center gap-2">
                        <ArrowRightIcon className="w-3 h-3 text-text-muted" />
                        <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Disposition:</p>
                        <p className="text-xs font-medium text-text-primary">{adm.dischargeDisposition}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredCurrent.length === 0 && filteredPast.length === 0 && (
        <div className="text-center py-12">
          <BuildingOffice2Icon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">{search ? `No results for "${search}"` : 'No admission history'}</p>
        </div>
      )}
    </div>
  );
}
