import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function SearchableDropdown({ label, options, value, onChange, placeholder, small }) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [rect, setRect] = useState(null);
  const inputRef = useRef(null);
  const py = small ? 'py-1.5' : 'py-2';
  const text = small ? 'text-[11px]' : 'text-xs';
  const labelSize = small ? 'text-[10px]' : 'text-xs';

  // When open, filter by search text. When closed, show value.
  const displayValue = open ? searchText : (value || '');
  const filtered = options.filter(s => s.toLowerCase().includes(searchText.toLowerCase()));

  useEffect(() => {
    if (open && inputRef.current) {
      setRect(inputRef.current.getBoundingClientRect());
    }
  }, [open, searchText]);

  const handleOpen = () => {
    setSearchText('');
    setOpen(true);
  };

  const handleSelect = (s) => {
    onChange(s);
    setSearchText('');
    setOpen(false);
  };

  const dropdown = open && rect ? createPortal(
    <>
      <div className="fixed inset-0 z-[105]" onClick={() => { setOpen(false); setSearchText(''); }} />
      <div
        className="fixed bg-white rounded-xl shadow-lg border border-border-light z-[106] max-h-[220px] overflow-y-auto"
        style={{ top: rect.bottom + 4, left: rect.left, width: rect.width }}
      >
        {filtered.length > 0 ? filtered.map(s => (
          <button
            key={s}
            onClick={() => handleSelect(s)}
            className={`w-full text-left px-3 ${py} ${text} hover:bg-primary-50 transition-colors cursor-pointer ${s === value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-text-secondary'}`}
          >
            {s}
          </button>
        )) : (
          <p className={`px-3 py-2 ${text} text-text-muted`}>No matches</p>
        )}
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div>
      {label && <label className={`${labelSize} font-medium text-text-secondary mb-1 block`}>{label}</label>}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={`input-field ${py} ${text} pr-8`}
          placeholder={open ? 'Type to search...' : (placeholder || 'Select...')}
          value={displayValue}
          onChange={e => { setSearchText(e.target.value); if (!open) setOpen(true); }}
          onFocus={handleOpen}
        />
        <ChevronDownIcon className={`absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {dropdown}
    </div>
  );
}
