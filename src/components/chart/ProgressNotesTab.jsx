import { useState } from 'react';
import {
  PencilSquareIcon, TrashIcon, DocumentTextIcon, PhoneIcon,
  VideoCameraIcon, UserIcon, MagnifyingGlassIcon,
  ChevronDownIcon, ChevronUpIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import SearchableDropdown from '../SearchableDropdown';
import { useData } from '../../contexts/DataContext';
import { noteTypes } from '../../data/noteTypes';

const methodIcons = { 'Phone': PhoneIcon, 'Video': VideoCameraIcon, 'In-Person': UserIcon };
const colorClasses = {
  primary: { bg: 'bg-primary-50/50', border: 'border-primary-100/50', badge: 'bg-primary-100 text-primary-700' },
  accent: { bg: 'bg-accent-50/50', border: 'border-accent-100/50', badge: 'bg-accent-100 text-accent-700' },
  warn: { bg: 'bg-warn-50/50', border: 'border-warn-100/50', badge: 'bg-warn-100 text-[#92400e]' },
  danger: { bg: 'bg-danger-50/50', border: 'border-danger-100/50', badge: 'bg-danger-100 text-danger-700' },
};

export default function ProgressNotesTab({ patient }) {
  const { addEntry, updateEntry, deleteEntry, isEditable } = useData();

  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState('soap');
  const [search, setSearch] = useState('');
  const [contactMethod, setContactMethod] = useState('Phone');
  const [datetime, setDatetime] = useState('');
  const [fieldValues, setFieldValues] = useState({});

  const allNotes = patient.progressNotes || [];
  const [expandedNotes, setExpandedNotes] = useState(new Set(allNotes.length > 0 ? [allNotes[0].id] : []));

  const toggleNote = (id) => setExpandedNotes(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const expandAll = () => setExpandedNotes(new Set(filtered.map(n => n.id)));
  const collapseAll = () => setExpandedNotes(new Set());

  const selectedType = noteTypes.find(t => t.id === selectedTypeId) || noteTypes[0];

  const resetForm = () => {
    setSelectedTypeId('soap');
    setContactMethod('Phone');
    setDatetime('');
    setFieldValues({});
  };

  const openAddForm = () => { setEditingEntry(null); resetForm(); setShowForm(true); };

  const openEditForm = (note) => {
    setEditingEntry(note);
    // Find matching note type
    const match = noteTypes.find(t => t.name === note.type || t.format === note.type || t.id === note.typeId);
    setSelectedTypeId(match?.id || 'soap');
    setContactMethod(note.contactMethod || 'Phone');
    setDatetime('');
    // Load all field values from the note
    const vals = {};
    noteTypes.forEach(t => t.fields.forEach(f => { if (note[f]) vals[f] = note[f]; }));
    // Legacy SOAP/DAR fields
    if (note.subjective) vals.subjective = note.subjective;
    if (note.objective) vals.objective = note.objective;
    if (note.assessment) vals.assessment = note.assessment;
    if (note.plan) vals.plan = note.plan;
    if (note.data) vals.data = note.data;
    if (note.action) vals.action = note.action;
    if (note.response) vals.response = note.response;
    setFieldValues(vals);
    setShowForm(true);
  };

  const handleSave = () => {
    const dt = datetime || new Date().toISOString().slice(0, 16);
    const dateStr = new Date(dt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeStr = new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const entryData = {
      date: dateStr, time: timeStr, author: 'Current User',
      type: selectedType.name, typeId: selectedType.id, format: selectedType.format,
      contactMethod,
      ...fieldValues,
    };
    if (editingEntry) {
      updateEntry(patient.id, 'progressNotes', editingEntry.id, entryData);
    } else {
      addEntry(patient.id, 'progressNotes', entryData);
    }
    setShowForm(false);
    setEditingEntry(null);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) { deleteEntry(patient.id, 'progressNotes', deleteTarget.id); setDeleteTarget(null); }
  };

  const filtered = allNotes.filter(note => {
    if (!search) return true;
    const q = search.toLowerCase();
    return Object.values(note).filter(v => typeof v === 'string').join(' ').toLowerCase().includes(q);
  });

  // Get display fields for a note (find its type definition or fall back to known fields)
  const getNoteDisplayFields = (note) => {
    const match = noteTypes.find(t => t.name === note.type || t.format === note.type || t.id === note.typeId);
    if (match) {
      return match.fields.filter(f => note[f]).map(f => ({
        key: f[0].toUpperCase(), label: match.labels[f], value: note[f], color: match.colors[f] || 'primary'
      }));
    }
    // Legacy fallback for SOAP/DAR
    if (note.type === 'SOAP' || note.subjective) {
      return [
        note.subjective && { key: 'S', label: 'Subjective', value: note.subjective, color: 'primary' },
        note.objective && { key: 'O', label: 'Objective', value: note.objective, color: 'accent' },
        note.assessment && { key: 'A', label: 'Assessment', value: note.assessment, color: 'warn' },
        note.plan && { key: 'P', label: 'Plan', value: note.plan, color: 'danger' },
      ].filter(Boolean);
    }
    if (note.type === 'DAR' || note.data) {
      return [
        note.data && { key: 'D', label: 'Data', value: note.data, color: 'primary' },
        note.action && { key: 'A', label: 'Action', value: note.action, color: 'accent' },
        note.response && { key: 'R', label: 'Response', value: note.response, color: 'warn' },
      ].filter(Boolean);
    }
    return [];
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">Progress Notes</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-xs" />
          </div>
          <button onClick={expandAll} className="btn-secondary py-2 px-3 text-xs hidden sm:block">Expand</button>
          <button onClick={collapseAll} className="btn-secondary py-2 px-3 text-xs hidden sm:block">Collapse</button>
          <button onClick={openAddForm} className="btn-primary py-2 flex items-center gap-1.5">
            <PencilSquareIcon className="w-4 h-4" /><span className="hidden sm:inline">New Note</span>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editingEntry ? 'Edit Note' : 'New Note'} wide footer={
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowForm(false)} className="btn-secondary py-2 text-xs">Cancel</button>
          <button onClick={handleSave} className="btn-primary py-2 text-xs">{editingEntry ? 'Update' : 'Save Note'}</button>
        </div>
      }>
        {/* Note type searchable + contact method + datetime */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <SearchableDropdown
            label="Note Type"
            options={noteTypes.map(t => t.name)}
            value={selectedType.name}
            onChange={v => { const t = noteTypes.find(n => n.name === v); if (t) setSelectedTypeId(t.id); }}
            placeholder="Search note type..."
          />
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Contact Method</label>
            <select value={contactMethod} onChange={e => setContactMethod(e.target.value)} className="input-field py-[9px] text-xs">
              <option>Phone</option><option>Video</option><option>In-Person</option><option>Email</option><option>Fax</option><option>Portal</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Date & Time</label>
            <input type="datetime-local" className="input-field py-[9px] text-xs" value={datetime || new Date().toISOString().slice(0, 16)} onChange={e => setDatetime(e.target.value)} />
          </div>
        </div>

        {/* Dynamic fields based on note type */}
        <div className="space-y-3">
          {selectedType.fields.map(field => {
            const label = selectedType.labels[field];
            const color = selectedType.colors[field] || 'primary';
            const cc = colorClasses[color] || colorClasses.primary;
            return (
              <div key={field}>
                <label className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
                  <span className={`w-5 h-5 ${cc.badge} rounded-md flex items-center justify-center text-[10px] font-bold`}>{label[0]}</span>
                  {label}
                </label>
                <textarea
                  className="textarea-field text-xs"
                  rows={3}
                  placeholder={`Enter ${label.toLowerCase()}...`}
                  value={fieldValues[field] || ''}
                  onChange={e => setFieldValues(prev => ({ ...prev, [field]: e.target.value }))}
                />
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Note" message="Are you sure you want to delete this progress note?" />

      {/* Notes List */}
      <div className="space-y-2">
        {filtered.map((note) => {
          const MethodIcon = methodIcons[note.contactMethod] || DocumentTextIcon;
          const isOpen = expandedNotes.has(note.id);
          const editable = isEditable(note.id);
          const displayFields = getNoteDisplayFields(note);
          const preview = displayFields[0]?.value?.slice(0, 80) || '';

          return (
            <div key={note.id} className="card p-0 overflow-hidden">
              <button onClick={() => toggleNote(note.id)} className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 bg-surface-alt hover:bg-surface-hover transition-colors cursor-pointer text-left">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0"><MethodIcon className="w-4 h-4 text-primary-600" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-info text-[10px]">{note.type || note.format || 'Note'}</span>
                    <span className="text-xs text-text-muted">{note.date} {note.time}</span>
                    {note.contactMethod && <span className="text-[10px] text-text-muted">via {note.contactMethod}</span>}
                  </div>
                  {!isOpen && preview && <p className="text-[11px] text-text-muted truncate mt-0.5">{preview}...</p>}
                </div>
                {editable && (
                  <span onClick={e => { e.stopPropagation(); openEditForm(note); }} className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-600 cursor-pointer shrink-0"><PencilSquareIcon className="w-3.5 h-3.5" /></span>
                )}
                {editable && (
                  <span onClick={e => { e.stopPropagation(); setDeleteTarget(note); }} className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-500 cursor-pointer shrink-0"><TrashIcon className="w-3.5 h-3.5" /></span>
                )}
                {isOpen ? <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />}
              </button>
              {isOpen && (
                <div className="p-4 lg:p-5 border-t border-border-light animate-fade-in">
                  <div className={displayFields.length <= 2 ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-3'}>
                    {displayFields.map(({ key, label, value, color }) => {
                      const cc = colorClasses[color] || colorClasses.primary;
                      return (
                        <div key={label} className={`${cc.bg} rounded-xl p-3 border ${cc.border}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-5 h-5 ${cc.badge} rounded-md flex items-center justify-center text-[10px] font-bold`}>{key}</span>
                            <h4 className="text-xs font-semibold text-text-primary">{label}</h4>
                          </div>
                          <p className="text-xs text-text-secondary leading-relaxed">{value}</p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-text-muted mt-3">{note.author} &middot; {note.date} {note.time}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && allNotes.length > 0 && <div className="text-center py-8"><p className="text-sm text-text-muted">No notes match "{search}"</p></div>}
      {allNotes.length === 0 && <div className="text-center py-12"><DocumentTextIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" /><p className="text-sm text-text-muted">No progress notes yet</p></div>}
    </div>
  );
}
