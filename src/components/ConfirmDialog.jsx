import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-danger-100 rounded-xl flex items-center justify-center shrink-0">
            <ExclamationTriangleIcon className="w-5 h-5 text-danger-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{title || 'Confirm Delete'}</h3>
            <p className="text-xs text-text-muted mt-0.5">{message || 'This action cannot be undone.'}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary py-2 text-xs">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 bg-danger-500 text-white rounded-xl text-xs font-semibold hover:bg-danger-600 transition-colors cursor-pointer">Delete</button>
        </div>
      </div>
    </div>
  );
}
