import { useState, useRef, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';

// Hour range restricted to business hours (08:00 - 18:00)
const HOURS = Array.from({ length: 11 }, (_, i) => String(i + 8).padStart(2, '0'));
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export default function TimePicker({ value = '08:00', onChange, label, required, align = 'left', minTime = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value "HH:mm"
  const [hoursStr, minutesStr] = (value || '08:00').split(':');
  const selectedHour = hoursStr ? hoursStr.padStart(2, '0') : '08';
  const selectedMinute = minutesStr ? minutesStr.padStart(2, '0') : '00';

  // Compute available hours based on minTime prop
  const minHourNum = minTime ? parseInt(minTime.split(':')[0], 10) : 8;
  const availableHours = HOURS.filter(h => parseInt(h, 10) >= minHourNum);

  // Auto adjust if current value is less than minTime
  useEffect(() => {
    if (minTime) {
      const minH = parseInt(minTime.split(':')[0], 10);
      const curH = parseInt(selectedHour, 10);
      if (curH < minH) {
        const newH = String(minH).padStart(2, '0');
        if (onChange) onChange(`${newH}:${selectedMinute}`);
      }
    }
  }, [minTime, selectedHour, selectedMinute, onChange]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTime = (h, m) => {
    const newTime = `${h}:${m}`;
    if (onChange) {
      onChange(newTime);
    }
  };

  return (
    <div className="custom-datepicker-container" ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label className="form-label">
          <Clock size={16} /> {label}
        </label>
      )}

      {/* Input Trigger Box */}
      <div
        className={`datepicker-trigger-box ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Clock size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
        <span className="datepicker-display-value">
          {selectedHour}:{selectedMinute} WIB
        </span>
      </div>

      {/* Time Picker Popover */}
      {isOpen && (
        <div
          className="time-picker-popover"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: align === 'right' ? 'auto' : 0,
            right: align === 'right' ? 0 : 'auto',
            zIndex: 999,
            width: '265px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            padding: '0.85rem',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {/* Header Display */}
          <div
            style={{
              textAlign: 'center',
              padding: '0.6rem 0.5rem',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              color: '#1e40af',
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Clock size={18} />
            {selectedHour} : {selectedMinute} <span style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.8 }}>WIB </span>
          </div>



          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {/* Hours Column */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem', textAlign: 'center' }}>
                Jam
              </div>
              <div
                style={{
                  maxHeight: '130px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '0.25rem'
                }}
              >
                {availableHours.map((h) => {
                  const isSelected = h === selectedHour;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleSelectTime(h, selectedMinute)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.3rem',
                        fontSize: '0.85rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: isSelected ? '#2563eb' : 'transparent',
                        color: isSelected ? '#ffffff' : '#1e293b',
                        fontWeight: isSelected ? 700 : 400,
                        cursor: 'pointer',
                        textAlign: 'center',
                        marginBottom: '2px',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {h} : 00
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem', textAlign: 'center' }}>
                Menit
              </div>
              <div
                style={{
                  maxHeight: '130px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '0.25rem'
                }}
              >
                {MINUTES.map((m) => {
                  const isSelected = m === selectedMinute;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSelectTime(selectedHour, m)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.3rem',
                        fontSize: '0.85rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: isSelected ? '#2563eb' : 'transparent',
                        color: isSelected ? '#ffffff' : '#1e293b',
                        fontWeight: isSelected ? 700 : 400,
                        cursor: 'pointer',
                        textAlign: 'center',
                        marginBottom: '2px',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      :{m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Check size={16} /> Pilih Jam
          </button>
        </div>
      )}
    </div>
  );
}
