import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function DatePicker({ 
  value, 
  onChange, 
  label, 
  required,
  placeholder = 'Pilih Tanggal',
  clearable = true,
  align = 'left'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse date value (YYYY-MM-DD) or null if empty
  const selectedDate = value ? new Date(value + 'T00:00:00') : null;
  const today = new Date();
  
  // Month & year being navigated in calendar view
  const [viewYear, setViewYear] = useState((selectedDate || today).getFullYear());
  const [viewMonth, setViewMonth] = useState((selectedDate || today).getMonth());

  // Close calendar popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update view when value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Calendar Days calculation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = (e) => {
    e.preventDefault();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day) => {
    const monthStr = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${viewYear}-${monthStr}-${dayStr}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleQuickSelectToday = (e) => {
    e.preventDefault();
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    onChange(dateStr);
    setViewYear(y);
    setViewMonth(t.getMonth());
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  // Format display text (e.g. "Kamis, 24 Sep 2026")
  const formatFormattedDisplay = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return placeholder;
    const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dateObj.getDay()];
    const dayNum = dateObj.getDate();
    const monthName = MONTH_NAMES[dateObj.getMonth()].substring(0, 3);
    const year = dateObj.getFullYear();
    return `${dayName}, ${dayNum} ${monthName} ${year}`;
  };

  // Check if a day cell is selected
  const isSelected = (day) => {
    if (!value) return false;
    const d = new Date(value + 'T00:00:00');
    return (
      d.getDate() === day &&
      d.getMonth() === viewMonth &&
      d.getFullYear() === viewYear
    );
  };

  // Check if a day cell is today
  const isToday = (day) => {
    const t = new Date();
    return (
      t.getDate() === day &&
      t.getMonth() === viewMonth &&
      t.getFullYear() === viewYear
    );
  };

  return (
    <div className="custom-datepicker-container" ref={containerRef} style={{ width: 'auto' }}>
      {label && (
        <label className="form-label">
          <CalendarIcon size={16} /> {label}
        </label>
      )}

      {/* Input Trigger Box */}
      <div 
        className={`datepicker-trigger-box ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.55rem 0.85rem',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          background: '#ffffff',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <CalendarIcon size={18} style={{ color: '#2563eb' }} />
        <span className="datepicker-display-value" style={{ fontSize: '0.85rem', fontWeight: 600, color: value ? '#0f172a' : '#64748b' }}>
          {formatFormattedDisplay(selectedDate)}
        </span>
        {clearable && value && (
          <div
            onClick={handleClear}
            title="Bersihkan Tanggal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#f1f5f9',
              color: '#64748b',
              cursor: 'pointer',
              marginLeft: '0.2rem'
            }}
          >
            <X size={12} />
          </div>
        )}
      </div>

      {/* Popover Calendar */}
      {isOpen && (
        <div 
          className="datepicker-popover shadow-xl"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: align === 'right' ? 'auto' : 0,
            right: align === 'right' ? 0 : 'auto',
            zIndex: 500
          }}
        >
          {/* Calendar Header */}
          <div className="datepicker-header">
            <button className="datepicker-nav-btn" onClick={handlePrevMonth}>
              <ChevronLeft size={18} />
            </button>
            <div className="datepicker-month-title">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <button className="datepicker-nav-btn" onClick={handleNextMonth}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day Names Row */}
          <div className="datepicker-day-names">
            {DAY_NAMES.map((day, idx) => (
              <div key={idx} className="datepicker-day-name">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="datepicker-days-grid">
            {/* Prev month fill days */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`prev-${idx}`} className="datepicker-day-cell outside">
                {daysInPrevMonth - firstDayOfMonth + idx + 1}
              </div>
            ))}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const selected = isSelected(day);
              const todayCell = isToday(day);

              return (
                <button
                  key={`day-${day}`}
                  className={`datepicker-day-cell ${selected ? 'selected' : ''} ${todayCell ? 'today' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectDay(day);
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Select Buttons Footer */}
          <div className="datepicker-footer">
            <button className="quick-select-btn" onClick={handleQuickSelectToday}>
              Hari Ini
            </button>
            {value && (
              <button 
                className="quick-select-btn" 
                style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
                onClick={(e) => {
                  e.preventDefault();
                  onChange('');
                  setIsOpen(false);
                }}
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
