import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({ open, onClose, title, children, wide, footer }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center sm:justify-center sm:p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white w-full flex flex-col animate-fade-in
        rounded-t-2xl max-h-[92vh]
        sm:rounded-2xl sm:shadow-2xl sm:max-h-[85vh] ${wide ? 'sm:max-w-3xl' : 'sm:max-w-xl'}`}>
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border-light shrink-0">
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-1 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary cursor-pointer transition-colors">
            <XMarkIcon className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 overscroll-contain">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 px-4 sm:px-5 py-3 border-t border-border-light bg-white rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
