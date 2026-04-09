import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function SearchableDropdown({ label, options, value, onChange, placeholder, small }) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const inputRef = useRef(null);
  const filtered = options.filter(s => s.toLowerCase().includes((value || '').toLowerCase()));
  const py = small ? 'py-1.5' : 'py-2';
  const text = small ? 'text-[11px]' : 'text-xs';
  const labelSize = small ? 'text-[10px]' : 'text-xs';

  useEffect(() => {
    if (open && inputRef.current) {
      const r = inputRef.current.getBoundingClientRect();
      setRect(r);
    }
  }, [open, value]);

  const dropdown = open && rect ? createPortal(
    <>
      <div className="fixed inset-0 z-[105]" onClick={() => setOpen(false)} />
      <div
        className="fixed bg-white rounded-xl shadow-lg border border-border-light z-[106] max-h-[220px] overflow-y-auto"
        style={{ top: rect.bottom + 4, left: rect.left, width: rect.width }}
      >
        {filtered.length > 0 ? filtered.map(s => (
          <button
            key={s}
            onClick={() => { onChange(s); setOpen(false); }}
            className={`w-full text-left px-3 ${py} ${text} hover:bg-primary-50 transition-colors cursor-pointer ${s === value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-text-secondary'}`}
          >
            {s}
          </button>
        )) : (
          <p className={`px-3 py-2 ${text} text-text-muted`}>No matches - using custom value</p>
        )}
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div>
      {label && <label className={`${labelSize} font-medium text-text-secondary mb-1 block`}>{label}</label>}
      <input
        ref={inputRef}
        type="text"
        className={`input-field ${py} ${text}`}
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {dropdown}
    </div>
  );
}
