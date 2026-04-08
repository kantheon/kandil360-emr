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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} max-h-[85vh] flex flex-col animate-fade-in`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-light shrink-0">
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary cursor-pointer transition-colors">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 px-5 py-3 border-t border-border-light bg-white rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
