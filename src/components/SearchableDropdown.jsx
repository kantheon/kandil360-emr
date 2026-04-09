import { useState } from 'react';

export default function SearchableDropdown({ label, options, value, onChange, placeholder, small }) {
  const [open, setOpen] = useState(false);
  const filtered = options.filter(s => s.toLowerCase().includes((value || '').toLowerCase()));
  const py = small ? 'py-1.5' : 'py-2';
  const text = small ? 'text-[11px]' : 'text-xs';
  const labelSize = small ? 'text-[10px]' : 'text-xs';

  return (
    <div className="relative">
      {label && <label className={`${labelSize} font-medium text-text-secondary mb-${small ? '0.5' : '1'} block`}>{label}</label>}
      <input
        type="text"
        className={`input-field ${py} ${text}`}
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className={`absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-border-light z-20 max-h-[220px] overflow-y-auto`}>
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
        </>
      )}
    </div>
  );
}
