import { useState, useMemo } from 'react';
import {
  HeartIcon,
  FireIcon,
  CloudIcon,
  ScaleIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import { useData } from '../../contexts/DataContext';

/* ------------------------------------------------------------------ */
/*  Threshold helpers                                                  */
/* ------------------------------------------------------------------ */

function getBpStatus(sys, dia) {
  if (!sys && !dia) return { level: 'none', label: '--', color: 'neutral' };
  if (sys > 180 || dia > 100 || sys < 90 || dia < 60)
    return { level: 'critical', label: 'Critical', color: 'red' };
  if (sys > 140 || dia > 90 || sys < 100 || dia < 70)
    return { level: 'elevated', label: 'Elevated', color: 'yellow' };
  return { level: 'normal', label: 'Normal', color: 'green' };
}

function getHrStatus(hr) {
  if (hr == null || hr === '') return { level: 'none', label: '--', color: 'neutral' };
  if (hr > 120 || hr < 50) return { level: 'critical', label: 'Critical', color: 'red' };
  if (hr > 100 || hr < 60) return { level: 'elevated', label: 'Elevated', color: 'yellow' };
  return { level: 'normal', label: 'Normal', color: 'green' };
}

function getTempStatus(temp) {
  if (temp == null || temp === '') return { level: 'none', label: '--', color: 'neutral' };
  if (temp > 104 || temp < 95) return { level: 'critical', label: 'Critical', color: 'red' };
  if (temp > 99.5 || temp < 97) return { level: 'elevated', label: 'Elevated', color: 'yellow' };
  return { level: 'normal', label: 'Normal', color: 'green' };
}

function getO2Status(o2) {
  if (o2 == null || o2 === '') return { level: 'none', label: '--', color: 'neutral' };
  if (o2 < 90) return { level: 'critical', label: 'Critical', color: 'red' };
  if (o2 < 95) return { level: 'low', label: 'Low', color: 'yellow' };
  return { level: 'normal', label: 'Normal', color: 'green' };
}

function getRespStatus(rr) {
  if (rr == null || rr === '') return { level: 'none', label: '--', color: 'neutral' };
  if (rr > 24 || rr < 10) return { level: 'critical', label: 'Critical', color: 'red' };
  if (rr > 20 || rr < 12) return { level: 'elevated', label: 'Elevated', color: 'yellow' };
  return { level: 'normal', label: 'Normal', color: 'green' };
}

function getPainStatus(pain) {
  if (pain == null || pain === '') return { level: 'none', label: '--', color: 'neutral' };
  if (pain >= 7) return { level: 'severe', label: 'Severe', color: 'red' };
  if (pain >= 4) return { level: 'moderate', label: 'Moderate', color: 'yellow' };
  if (pain >= 1) return { level: 'mild', label: 'Mild', color: 'green' };
  return { level: 'none', label: 'None', color: 'green' };
}

/* Map color string to design-system classes */
const dotColor = {
  red: 'bg-danger-500',
  yellow: 'bg-warn-400',
  green: 'bg-accent-500',
  neutral: 'bg-text-muted',
};

const ringColor = {
  red: 'ring-danger-200',
  yellow: 'ring-warn-200',
  green: 'ring-accent-200',
  neutral: 'ring-border-light',
};

const bgTint = {
  red: 'bg-danger-50 border-danger-100',
  yellow: 'bg-warn-50 border-warn-100',
  green: 'bg-accent-50 border-accent-100',
  neutral: 'bg-surface-alt border-border-light',
};

const badgeMap = {
  red: 'badge-critical',
  yellow: 'badge-warning',
  green: 'badge-active',
  neutral: 'badge-neutral',
};

/* ------------------------------------------------------------------ */
/*  Trend arrow                                                        */
/* ------------------------------------------------------------------ */

function TrendArrow({ current, previous }) {
  if (current == null || previous == null) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.01)
    return <MinusIcon className="w-3 h-3 text-text-muted" title="Stable" />;
  if (diff > 0)
    return <ArrowTrendingUpIcon className="w-3 h-3 text-danger-400" title={`Up from ${previous}`} />;
  return <ArrowTrendingDownIcon className="w-3 h-3 text-primary-500" title={`Down from ${previous}`} />;
}

/* ------------------------------------------------------------------ */
/*  Format helpers                                                     */
/* ------------------------------------------------------------------ */

function fmtDateTime(dateStr, timeStr) {
  if (!dateStr) return '';
  return `${dateStr}${timeStr ? ' at ' + timeStr : ''}`;
}

function timeAgo(dateStr, timeStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('/');
    const iso = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    const d = timeStr
      ? new Date(`${iso}T${convertTo24(timeStr)}`)
      : new Date(`${iso}T00:00:00`);
    const diff = Date.now() - d.getTime();
    if (diff < 0) return 'just now';
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch {
    return dateStr;
  }
}

function convertTo24(t) {
  if (!t) return '00:00';
  const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return '00:00';
  let [, h, m, period] = match;
  h = parseInt(h, 10);
  if (period) {
    if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (period.toUpperCase() === 'AM' && h === 12) h = 0;
  }
  return `${String(h).padStart(2, '0')}:${m}`;
}

/* ------------------------------------------------------------------ */
/*  Vital card config                                                  */
/* ------------------------------------------------------------------ */

const vitalCardDefs = [
  {
    key: 'bp',
    label: 'Blood Pressure',
    icon: HeartIcon,
    unit: 'mmHg',
    getValue: (v) => (v.systolic || v.diastolic) ? `${v.systolic || '--'}/${v.diastolic || '--'}` : null,
    getStatus: (v) => getBpStatus(v.systolic, v.diastolic),
    getTrendVal: (v) => v.systolic,
  },
  {
    key: 'hr',
    label: 'Heart Rate',
    icon: HeartIcon,
    unit: 'bpm',
    getValue: (v) => v.heartRate ?? null,
    getStatus: (v) => getHrStatus(v.heartRate),
    getTrendVal: (v) => v.heartRate,
  },
  {
    key: 'temp',
    label: 'Temperature',
    icon: FireIcon,
    unit: '\u00B0F',
    getValue: (v) => v.temperature ?? null,
    getStatus: (v) => getTempStatus(v.temperature),
    getTrendVal: (v) => v.temperature,
  },
  {
    key: 'o2',
    label: 'O\u2082 Saturation',
    icon: CloudIcon,
    unit: '%',
    getValue: (v) => v.oxygenSaturation ?? null,
    getStatus: (v) => getO2Status(v.oxygenSaturation),
    getTrendVal: (v) => v.oxygenSaturation,
  },
  {
    key: 'rr',
    label: 'Resp. Rate',
    icon: CloudIcon,
    unit: 'br/min',
    getValue: (v) => v.respiratoryRate ?? null,
    getStatus: (v) => getRespStatus(v.respiratoryRate),
    getTrendVal: (v) => v.respiratoryRate,
  },
  {
    key: 'pain',
    label: 'Pain Level',
    icon: ExclamationTriangleIcon,
    unit: '/10',
    getValue: (v) => v.painLevel ?? null,
    getStatus: (v) => getPainStatus(v.painLevel),
    getTrendVal: (v) => v.painLevel,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function VitalsTab({ patient }) {
  const { addEntry, updateEntry, deleteEntry, isEditable } = useData();

  /* --- state --- */
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [historyOpen, setHistoryOpen] = useState(true);

  /* form fields */
  const [fSystolic, setFSystolic] = useState('');
  const [fDiastolic, setFDiastolic] = useState('');
  const [fHeartRate, setFHeartRate] = useState('');
  const [fTemperature, setFTemperature] = useState('');
  const [fO2, setFO2] = useState('');
  const [fRespRate, setFRespRate] = useState('');
  const [fWeight, setFWeight] = useState('');
  const [fPain, setFPain] = useState('');
  const [fNotes, setFNotes] = useState('');
  const [fDatetime, setFDatetime] = useState('');

  const allVitals = patient.vitals || [];

  /* derived data */
  const latest = allVitals[0] || null;
  const previous = allVitals[1] || null;

  /* search filter for history */
  const filtered = useMemo(() => {
    if (!search) return allVitals;
    const q = search.toLowerCase();
    return allVitals.filter((v) =>
      [v.date, v.time, v.notes, v.author,
        v.systolic != null ? `${v.systolic}/${v.diastolic}` : '',
        v.heartRate, v.temperature, v.oxygenSaturation, v.respiratoryRate,
        v.weight, v.painLevel,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [allVitals, search]);

  /* expanded history entries */
  const [expandedEntries, setExpandedEntries] = useState(
    new Set(allVitals.length > 0 ? [allVitals[0].id] : []),
  );
  const toggleEntry = (id) =>
    setExpandedEntries((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  /* --- form helpers --- */
  const resetForm = () => {
    setFSystolic('');
    setFDiastolic('');
    setFHeartRate('');
    setFTemperature('');
    setFO2('');
    setFRespRate('');
    setFWeight('');
    setFPain('');
    setFNotes('');
    setFDatetime('');
  };

  const openAddForm = () => {
    setEditingEntry(null);
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (entry) => {
    setEditingEntry(entry);
    setFSystolic(entry.systolic ?? '');
    setFDiastolic(entry.diastolic ?? '');
    setFHeartRate(entry.heartRate ?? '');
    setFTemperature(entry.temperature ?? '');
    setFO2(entry.oxygenSaturation ?? '');
    setFRespRate(entry.respiratoryRate ?? '');
    setFWeight(entry.weight ?? '');
    setFPain(entry.painLevel ?? '');
    setFNotes(entry.notes ?? '');
    setFDatetime('');
    setShowForm(true);
  };

  const handleSave = () => {
    const dt = fDatetime || new Date().toISOString().slice(0, 16);
    const dateStr = new Date(dt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const timeStr = new Date(dt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const toNum = (v) => (v === '' || v == null ? null : Number(v));

    const entryData = {
      systolic: toNum(fSystolic),
      diastolic: toNum(fDiastolic),
      heartRate: toNum(fHeartRate),
      temperature: toNum(fTemperature),
      oxygenSaturation: toNum(fO2),
      respiratoryRate: toNum(fRespRate),
      weight: toNum(fWeight),
      painLevel: toNum(fPain),
      notes: fNotes,
      date: dateStr,
      time: timeStr,
      author: 'Current User',
    };

    if (editingEntry) {
      updateEntry(patient.id, 'vitals', editingEntry.id, entryData);
    } else {
      addEntry(patient.id, 'vitals', entryData);
    }
    setShowForm(false);
    setEditingEntry(null);
    resetForm();
  };

  const handleDelete = (id) => {
    deleteEntry(patient.id, 'vitals', id);
    setDeleteTarget(null);
  };

  /* quick check if there are any critical readings in the latest */
  const hasCritical = latest
    ? vitalCardDefs.some((d) => d.getStatus(latest).color === 'red')
    : false;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Vitals</h2>
          <p className="text-xs text-text-muted mt-0.5">
            {allVitals.length} recording{allVitals.length !== 1 ? 's' : ''} on file
          </p>
        </div>
        <button onClick={openAddForm} className="btn-primary py-2 flex items-center gap-1.5">
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Record Vitals</span>
        </button>
      </div>

      {/* ---- Critical alert banner ---- */}
      {hasCritical && (
        <div className="bg-danger-50 rounded-2xl p-4 border border-danger-200 flex items-start gap-3 animate-fade-in">
          <div className="w-9 h-9 bg-danger-100 rounded-xl flex items-center justify-center shrink-0">
            <ExclamationTriangleIcon className="w-5 h-5 text-danger-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-danger-700">Critical Values Detected</h3>
            <p className="text-xs text-danger-600 mt-0.5">
              One or more vitals are outside safe ranges. Review and take appropriate action.
            </p>
          </div>
        </div>
      )}

      {/* ---- Current Vitals Grid ---- */}
      {latest ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {vitalCardDefs.map((def) => {
            const Icon = def.icon;
            const val = def.getValue(latest);
            const status = def.getStatus(latest);
            const prevVal = previous ? def.getTrendVal(previous) : null;
            const curVal = def.getTrendVal(latest);

            return (
              <div
                key={def.key}
                className={`rounded-2xl p-4 border transition-all ${bgTint[status.color]}`}
              >
                {/* top row: icon + status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                      <Icon className="w-4 h-4 text-text-secondary" />
                    </div>
                    <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">
                      {def.label}
                    </span>
                  </div>
                  {/* status dot */}
                  <span
                    className={`w-2.5 h-2.5 rounded-full ring-2 ${dotColor[status.color]} ${ringColor[status.color]}`}
                    title={status.label}
                  />
                </div>

                {/* value row */}
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xl font-bold text-text-primary leading-none">
                      {val != null ? val : '--'}
                    </span>
                    <span className="text-[11px] text-text-muted ml-1">{def.unit}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendArrow current={curVal} previous={prevVal} />
                    <span className={`badge text-[10px] ${badgeMap[status.color]}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* time */}
                <div className="flex items-center gap-1 mt-2.5">
                  <ClockIcon className="w-3 h-3 text-text-muted" />
                  <span className="text-[10px] text-text-muted">
                    {timeAgo(latest.date, latest.time)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Weight card (not threshold-based, standalone) */}
          <div className="rounded-2xl p-4 border bg-surface-alt border-border-light transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                  <ScaleIcon className="w-4 h-4 text-text-secondary" />
                </div>
                <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">
                  Weight
                </span>
              </div>
              <span
                className="w-2.5 h-2.5 rounded-full ring-2 bg-primary-400 ring-primary-200"
                title="Tracked"
              />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xl font-bold text-text-primary leading-none">
                  {latest.weight != null ? latest.weight : '--'}
                </span>
                <span className="text-[11px] text-text-muted ml-1">lbs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendArrow
                  current={latest.weight}
                  previous={previous ? previous.weight : null}
                />
                <span className="badge badge-info text-[10px]">Tracked</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2.5">
              <ClockIcon className="w-3 h-3 text-text-muted" />
              <span className="text-[10px] text-text-muted">
                {timeAgo(latest.date, latest.time)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* empty state for current vitals */
        <div className="text-center py-12 bg-surface-alt rounded-2xl border border-border-light">
          <HeartIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-text-muted">No vitals recorded yet</p>
          <p className="text-xs text-text-muted mt-1">
            Click <span className="font-semibold">Record Vitals</span> to add the first reading.
          </p>
        </div>
      )}

      {/* ---- Record Vitals Modal ---- */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingEntry ? 'Edit Vital Signs' : 'Record Vital Signs'}
        wide
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="btn-secondary py-2 text-xs"
            >
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary py-2 text-xs">
              {editingEntry ? 'Update Vitals' : 'Save Vitals'}
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Date/time */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              className="input-field py-2 text-xs"
              value={fDatetime || new Date().toISOString().slice(0, 16)}
              onChange={(e) => setFDatetime(e.target.value)}
            />
          </div>

          {/* Blood Pressure row */}
          <div>
            <label className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-2">
              <span className="w-5 h-5 bg-danger-100 text-danger-600 rounded-md flex items-center justify-center text-[10px] font-bold">
                <HeartIcon className="w-3 h-3" />
              </span>
              Blood Pressure
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-text-muted mb-0.5 block">Systolic</label>
                <input
                  type="number"
                  className="input-field py-2 text-xs"
                  placeholder="e.g. 120"
                  value={fSystolic}
                  onChange={(e) => setFSystolic(e.target.value)}
                  min="0"
                  max="300"
                />
              </div>
              <div>
                <label className="text-[11px] text-text-muted mb-0.5 block">Diastolic</label>
                <input
                  type="number"
                  className="input-field py-2 text-xs"
                  placeholder="e.g. 80"
                  value={fDiastolic}
                  onChange={(e) => setFDiastolic(e.target.value)}
                  min="0"
                  max="200"
                />
              </div>
            </div>
            {/* live threshold feedback */}
            {(fSystolic || fDiastolic) && (
              <LiveAlert status={getBpStatus(Number(fSystolic), Number(fDiastolic))} />
            )}
          </div>

          {/* 2-column vital fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Heart Rate */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center text-[10px] font-bold">
                  <HeartIcon className="w-3 h-3" />
                </span>
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                className="input-field py-2 text-xs"
                placeholder="e.g. 72"
                value={fHeartRate}
                onChange={(e) => setFHeartRate(e.target.value)}
                min="0"
                max="300"
              />
              {fHeartRate && <LiveAlert status={getHrStatus(Number(fHeartRate))} />}
            </div>

            {/* Temperature */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-warn-100 text-[#92400e] rounded-md flex items-center justify-center text-[10px] font-bold">
                  <FireIcon className="w-3 h-3" />
                </span>
                Temperature ({'\u00B0'}F)
              </label>
              <input
                type="number"
                step="0.1"
                className="input-field py-2 text-xs"
                placeholder="e.g. 98.6"
                value={fTemperature}
                onChange={(e) => setFTemperature(e.target.value)}
                min="80"
                max="115"
              />
              {fTemperature && <LiveAlert status={getTempStatus(Number(fTemperature))} />}
            </div>

            {/* O2 Saturation */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center text-[10px] font-bold">
                  <CloudIcon className="w-3 h-3" />
                </span>
                O{'\u2082'} Saturation (%)
              </label>
              <input
                type="number"
                className="input-field py-2 text-xs"
                placeholder="e.g. 98"
                value={fO2}
                onChange={(e) => setFO2(e.target.value)}
                min="0"
                max="100"
              />
              {fO2 && <LiveAlert status={getO2Status(Number(fO2))} />}
            </div>

            {/* Respiratory Rate */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-accent-100 text-accent-700 rounded-md flex items-center justify-center text-[10px] font-bold">
                  <CloudIcon className="w-3 h-3" />
                </span>
                Respiratory Rate (br/min)
              </label>
              <input
                type="number"
                className="input-field py-2 text-xs"
                placeholder="e.g. 16"
                value={fRespRate}
                onChange={(e) => setFRespRate(e.target.value)}
                min="0"
                max="60"
              />
              {fRespRate && <LiveAlert status={getRespStatus(Number(fRespRate))} />}
            </div>

            {/* Weight */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center text-[10px] font-bold">
                  <ScaleIcon className="w-3 h-3" />
                </span>
                Weight (lbs)
              </label>
              <input
                type="number"
                step="0.1"
                className="input-field py-2 text-xs"
                placeholder="e.g. 165"
                value={fWeight}
                onChange={(e) => setFWeight(e.target.value)}
                min="0"
                max="1000"
              />
            </div>

            {/* Pain Level */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-danger-100 text-danger-600 rounded-md flex items-center justify-center text-[10px] font-bold">
                  <ExclamationTriangleIcon className="w-3 h-3" />
                </span>
                Pain Level (0-10)
              </label>
              <input
                type="number"
                className="input-field py-2 text-xs"
                placeholder="0"
                value={fPain}
                onChange={(e) => setFPain(e.target.value)}
                min="0"
                max="10"
              />
              {fPain !== '' && <LiveAlert status={getPainStatus(Number(fPain))} />}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
              <span className="w-5 h-5 bg-surface-alt text-text-muted rounded-md flex items-center justify-center text-[10px] font-bold">
                <DocumentTextIcon className="w-3 h-3" />
              </span>
              Notes
            </label>
            <textarea
              className="textarea-field text-xs"
              rows={3}
              placeholder="Additional observations, context, or follow-up actions..."
              value={fNotes}
              onChange={(e) => setFNotes(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* ---- Delete Confirmation ---- */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        title="Delete Vitals Entry"
        message="Are you sure you want to delete this vitals recording? This action cannot be undone."
      />

      {/* ---- History Section ---- */}
      <div>
        <button
          onClick={() => setHistoryOpen(!historyOpen)}
          className="w-full flex items-center justify-between gap-2 mb-3 cursor-pointer group"
        >
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-primary-500" />
            Vitals History
            <span className="badge badge-neutral text-[10px]">{allVitals.length}</span>
          </h3>
          {historyOpen ? (
            <ChevronUpIcon className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
          )}
        </button>

        {historyOpen && (
          <div className="space-y-2 animate-fade-in">
            {/* search */}
            {allVitals.length > 2 && (
              <div className="relative mb-3">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search vitals history..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9 py-2 text-xs"
                />
              </div>
            )}

            {filtered.map((entry) => {
              const isOpen = expandedEntries.has(entry.id);
              const canEdit = isEditable(entry.id);
              const bpStatus = getBpStatus(entry.systolic, entry.diastolic);
              const hrStatus = getHrStatus(entry.heartRate);
              const tempStatus = getTempStatus(entry.temperature);

              /* pick the worst status for the row indicator */
              const allStatuses = vitalCardDefs.map((d) => d.getStatus(entry));
              const worstColor = allStatuses.some((s) => s.color === 'red')
                ? 'red'
                : allStatuses.some((s) => s.color === 'yellow')
                  ? 'yellow'
                  : 'green';

              return (
                <div key={entry.id} className="card p-0 overflow-hidden">
                  {/* collapsed header */}
                  <button
                    onClick={() => toggleEntry(entry.id)}
                    className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 bg-surface-alt hover:bg-surface-hover transition-colors cursor-pointer text-left"
                  >
                    {/* color indicator bar */}
                    <div
                      className={`w-1 self-stretch rounded-full shrink-0 ${
                        worstColor === 'red'
                          ? 'bg-danger-400'
                          : worstColor === 'yellow'
                            ? 'bg-warn-400'
                            : 'bg-accent-400'
                      }`}
                    />
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                      <HeartIcon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Key vitals inline */}
                        {entry.systolic != null && (
                          <span className="text-xs font-semibold text-text-primary">
                            BP {entry.systolic}/{entry.diastolic}
                          </span>
                        )}
                        {entry.heartRate != null && (
                          <span className="text-xs text-text-secondary">
                            HR {entry.heartRate}
                          </span>
                        )}
                        {entry.temperature != null && (
                          <span className="text-xs text-text-secondary">
                            T {entry.temperature}{'\u00B0'}
                          </span>
                        )}
                        {entry.oxygenSaturation != null && (
                          <span className="text-xs text-text-secondary">
                            O{'\u2082'} {entry.oxygenSaturation}%
                          </span>
                        )}
                        <span
                          className={`badge text-[10px] ${badgeMap[worstColor]}`}
                        >
                          {worstColor === 'red'
                            ? 'Critical'
                            : worstColor === 'yellow'
                              ? 'Attention'
                              : 'Normal'}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {entry.author && `${entry.author} \u00B7 `}
                        {fmtDateTime(entry.date, entry.time)}
                      </p>
                    </div>

                    {canEdit && (
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(entry);
                          }}
                          className="p-1.5 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
                          title="Edit vitals"
                        >
                          <PencilSquareIcon className="w-3.5 h-3.5 text-primary-500" />
                        </span>
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(entry.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-danger-100 transition-colors cursor-pointer"
                          title="Delete vitals"
                        >
                          <TrashIcon className="w-3.5 h-3.5 text-danger-500" />
                        </span>
                      </div>
                    )}
                    {isOpen ? (
                      <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />
                    )}
                  </button>

                  {/* expanded detail */}
                  {isOpen && (
                    <div className="p-4 lg:p-5 border-t border-border-light animate-fade-in">
                      {/* Vitals detail grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
                        <VitalPill
                          label="BP"
                          value={
                            entry.systolic != null
                              ? `${entry.systolic}/${entry.diastolic}`
                              : '--'
                          }
                          unit="mmHg"
                          status={bpStatus}
                        />
                        <VitalPill
                          label="HR"
                          value={entry.heartRate ?? '--'}
                          unit="bpm"
                          status={hrStatus}
                        />
                        <VitalPill
                          label="Temp"
                          value={entry.temperature ?? '--'}
                          unit={'\u00B0F'}
                          status={tempStatus}
                        />
                        <VitalPill
                          label="O\u2082"
                          value={entry.oxygenSaturation ?? '--'}
                          unit="%"
                          status={getO2Status(entry.oxygenSaturation)}
                        />
                        <VitalPill
                          label="Resp"
                          value={entry.respiratoryRate ?? '--'}
                          unit="br/min"
                          status={getRespStatus(entry.respiratoryRate)}
                        />
                        <VitalPill
                          label="Weight"
                          value={entry.weight ?? '--'}
                          unit="lbs"
                          status={{ label: 'Tracked', color: 'neutral' }}
                        />
                        <VitalPill
                          label="Pain"
                          value={entry.painLevel ?? '--'}
                          unit="/10"
                          status={getPainStatus(entry.painLevel)}
                        />
                      </div>

                      {/* Notes */}
                      {entry.notes && (
                        <div className="mt-3 pt-3 border-t border-border-light">
                          <h4 className="text-[11px] font-semibold text-text-primary mb-1">
                            Notes
                          </h4>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {entry.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && allVitals.length > 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-text-muted">
                  No vitals match &quot;{search}&quot;
                </p>
              </div>
            )}
            {allVitals.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xs text-text-muted">
                  No history to display. Record the first vitals to get started.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Small pill used inside expanded history rows */
function VitalPill({ label, value, unit, status }) {
  const colorClass =
    status.color === 'red'
      ? 'bg-danger-50 border-danger-100'
      : status.color === 'yellow'
        ? 'bg-warn-50 border-warn-100'
        : status.color === 'green'
          ? 'bg-accent-50 border-accent-100'
          : 'bg-surface-alt border-border-light';

  return (
    <div className={`rounded-xl p-2.5 text-center border ${colorClass}`}>
      <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xs font-bold text-text-primary mt-0.5">
        {value}
        <span className="text-[10px] font-normal text-text-muted ml-0.5">{unit}</span>
      </p>
      <p
        className={`text-[10px] font-semibold mt-0.5 ${
          status.color === 'red'
            ? 'text-danger-500'
            : status.color === 'yellow'
              ? 'text-warn-500'
              : status.color === 'green'
                ? 'text-accent-600'
                : 'text-text-muted'
        }`}
      >
        {status.label}
      </p>
    </div>
  );
}

/** Real-time threshold indicator shown below form inputs */
function LiveAlert({ status }) {
  if (!status || status.color === 'neutral') return null;
  if (status.color === 'green') {
    return (
      <p className="text-[10px] text-accent-600 font-medium mt-1 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-500 inline-block" />
        {status.label}
      </p>
    );
  }
  if (status.color === 'yellow') {
    return (
      <p className="text-[10px] text-warn-500 font-medium mt-1 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-warn-400 inline-block" />
        {status.label}
      </p>
    );
  }
  return (
    <p className="text-[10px] text-danger-500 font-semibold mt-1 flex items-center gap-1 animate-fade-in">
      <span className="w-1.5 h-1.5 rounded-full bg-danger-500 inline-block" />
      {status.label} &mdash; outside safe range
    </p>
  );
}
