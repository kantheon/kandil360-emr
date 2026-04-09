import { useState } from 'react';
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import AppointmentScheduler from '../AppointmentScheduler';
import { useData } from '../../contexts/DataContext';

export default function AppointmentsTab({ patient }) {
  const { addEntry, updateEntry, deleteEntry, isEditable } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ type: '', provider: '', date: '', time: '', location: '', duration: '30 min' });

  const allAppointments = [...(patient.appointments || [])].sort((a, b) => {
    const da = a.date || '9999'; const db = b.date || '9999';
    if (da !== db) return da.localeCompare(db);
    return (a.time || '').localeCompare(b.time || '');
  });
  const [expandedAppts, setExpandedAppts] = useState(new Set(allAppointments.map((_, i) => i)));

  const toggleAppt = (i) => {
    setExpandedAppts(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };

  const resetForm = () => {
    setFormData({ type: '', provider: '', date: '', time: '', location: '', duration: '30 min' });
    setEditingEntry(null);
  };

  const openAddModal = () => { resetForm(); setShowForm(true); };

  const openEditModal = (appt) => {
    setEditingEntry(appt);
    setFormData({ type: appt.type || '', provider: appt.provider || '', date: appt.date || '', time: appt.time || '', location: appt.location || '', duration: appt.duration || '30 min' });
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    const currentEditing = editingEntry;
    setEditingEntry(null);
    const entry = { ...formData, status: 'Scheduled' };
    if (currentEditing) {
      updateEntry(patient.id, 'appointments', currentEditing.id, entry);
    } else {
      addEntry(patient.id, 'appointments', entry);
    }
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteEntry(patient.id, 'appointments', deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const filtered = allAppointments.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [a.type, a.provider, a.location, a.date, a.status].join(' ').toLowerCase().includes(q);
  });

  const upcoming = filtered.filter(a => a.status === 'Scheduled');
  const past = filtered.filter(a => a.status !== 'Scheduled');

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">Appointments</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-xs" />
          </div>
          <button onClick={openAddModal} className="btn-primary py-2 flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" /><span className="hidden sm:inline">Add Appointment</span>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <Modal open={showForm} onClose={() => { setShowForm(false); resetForm(); }} title={editingEntry ? 'Edit Appointment' : 'Schedule Appointment'} wide footer={<div className="flex justify-end gap-2"><button onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary py-2 text-xs">Cancel</button><button onClick={handleSave} disabled={!formData.date || !formData.time || !formData.provider} className={`btn-primary py-2 text-xs ${!formData.date || !formData.time || !formData.provider ? 'opacity-50 cursor-not-allowed' : ''}`}>{editingEntry ? 'Update' : 'Schedule'}</button></div>}>
        <AppointmentScheduler value={formData} onChange={setFormData} disabled={false} />
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
      />

      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Upcoming</h3>
          <div className="space-y-2">
            {upcoming.map((appt, idx) => {
              const i = allAppointments.indexOf(appt);
              const isOpen = expandedAppts.has(i);
              const editable = isEditable(appt.id);
              return (
                <div key={appt.id || idx} className="card p-0 overflow-hidden">
                  <button onClick={() => toggleAppt(i)} className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 hover:bg-surface-alt transition-colors cursor-pointer text-left">
                    <div className="bg-gradient-to-b from-primary-500 to-primary-700 text-white rounded-lg p-2 text-center min-w-[48px] shrink-0">
                      <p className="text-[10px] font-medium opacity-80 leading-none">{new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</p>
                      <p className="text-lg font-bold leading-tight">{new Date(appt.date + 'T00:00:00').getDate()}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{appt.type}</p>
                      <p className="text-xs text-text-muted mt-0.5">{appt.provider} &middot; {appt.time}</p>
                    </div>
                    <span className="badge badge-active text-[10px] shrink-0">{appt.status}</span>
                    {editable && (
                      <div className="flex items-center gap-1 shrink-0">
                        <span onClick={e => { e.stopPropagation(); openEditModal(appt); }} className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-600 cursor-pointer transition-colors">
                          <PencilSquareIcon className="w-3.5 h-3.5" />
                        </span>
                        <span onClick={e => { e.stopPropagation(); setDeleteTarget(appt); }} className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-500 cursor-pointer transition-colors">
                          <TrashIcon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                    {isOpen ? <ChevronUpIcon className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 lg:px-5 pb-4 border-t border-border-light pt-3 animate-fade-in">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <UserIcon className="w-3.5 h-3.5 text-text-muted" />{appt.provider}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <ClockIcon className="w-3.5 h-3.5 text-text-muted" />{appt.time}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <MapPinIcon className="w-3.5 h-3.5 text-text-muted" />{appt.location}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Past</h3>
          <div className="space-y-2">
            {past.map((appt, i) => {
              const editable = isEditable(appt.id);
              return (
                <div key={appt.id || i} className="card p-3 flex items-center gap-3 opacity-60">
                  <CheckCircleIcon className="w-5 h-5 text-accent-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{appt.type}</p>
                    <p className="text-xs text-text-muted">{appt.provider} &middot; {appt.date}</p>
                  </div>
                  {editable && (
                    <div className="flex items-center gap-1 shrink-0">
                      <span onClick={() => openEditModal(appt)} className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-600 cursor-pointer transition-colors">
                        <PencilSquareIcon className="w-3.5 h-3.5" />
                      </span>
                      <span onClick={() => setDeleteTarget(appt)} className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-500 cursor-pointer transition-colors">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                  <span className="badge badge-neutral text-[10px]">Completed</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">{search ? `No results for "${search}"` : 'No appointments'}</p>
        </div>
      )}
    </div>
  );
}
