import { useState } from 'react';
import { Star, X, Send, MessageSquare } from 'lucide-react';

export default function RatingModal({ isOpen, vehicle, onSubmitRating, onClose }) {
  const [selectedRating, setSelectedRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !vehicle) return null;

  const ratingOptions = [
    { value: 1, label: 'Buruk', color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fecaca', emoji: '😞' },
    { value: 3, label: 'Baik', color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#fde68a', emoji: '😊' },
    { value: 5, label: 'Sangat Baik', color: '#10b981', bgColor: '#ecfdf5', borderColor: '#a7f3d0', emoji: '🤩' },
  ];

  const activeRating = hoveredRating || selectedRating;

  const getActiveOption = () => ratingOptions.find(r => r.value === activeRating);

  const canSubmit = selectedRating && description.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitRating(selectedRating, description.trim());
      setSelectedRating(null);
      setHoveredRating(null);
      setDescription('');
      setIsSubmitting(false);
    }, 400);
  };

  const handleClose = () => {
    setSelectedRating(null);
    setHoveredRating(null);
    setDescription('');
    onClose();
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => {
      const isFilled = i < count;
      const option = ratingOptions.find(r => r.value === count);
      return (
        <Star
          key={i}
          size={20}
          fill={isFilled ? (option?.color || '#cbd5e1') : 'none'}
          color={isFilled ? (option?.color || '#cbd5e1') : '#cbd5e1'}
          style={{ transition: 'all 0.2s ease' }}
        />
      );
    });
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
          color: '#ffffff',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '-0.01em'
            }}>
              <Star size={20} fill="#fbbf24" color="#fbbf24" />
              Rating Layanan Dinas
            </div>
            <div style={{
              fontSize: '0.775rem',
              color: '#94a3b8',
              marginTop: '0.3rem',
              fontWeight: 500
            }}>
              Berikan penilaian untuk perjalanan dinas ini
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {/* Vehicle Info */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.9rem',
              flexShrink: 0
            }}>
              🚗
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                {vehicle.name}
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                background: '#0f172a',
                color: '#fbbf24',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                fontWeight: 700,
                display: 'inline-block',
                marginTop: '0.2rem'
              }}>
                {vehicle.plateNumber}
              </div>
            </div>
          </div>

          {/* Rating Options */}
          <div style={{
            fontSize: '0.825rem',
            fontWeight: 700,
            color: '#475569',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Pilih Rating Perjalanan:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {ratingOptions.map((option) => {
              const isSelected = selectedRating === option.value;
              const isHovered = hoveredRating === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedRating(option.value)}
                  onMouseEnter={() => setHoveredRating(option.value)}
                  onMouseLeave={() => setHoveredRating(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? option.color : isHovered ? option.borderColor : '#e2e8f0'}`,
                    background: isSelected ? option.bgColor : isHovered ? '#fafbfc' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: isSelected
                      ? `0 4px 14px ${option.color}25`
                      : '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{option.emoji}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        color: isSelected ? option.color : '#0f172a',
                        transition: 'color 0.2s ease'
                      }}>
                        {option.label}
                      </div>
                      <div style={{
                        fontSize: '0.725rem',
                        color: '#94a3b8',
                        fontWeight: 500
                      }}>
                        Rating {option.value} dari 5
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {renderStars(option.value)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Rating Indicator */}
            <div style={{
              marginTop: '1rem',
              textAlign: 'center',
              padding: '0.65rem',
              background: activeRating ? (getActiveOption()?.bgColor || '#f8fafc') : '#f8fafc',
              borderRadius: '8px',
              border: `1px solid ${activeRating ? (getActiveOption()?.borderColor || '#e2e8f0') : '#e2e8f0'}`,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: activeRating ? (getActiveOption()?.color || '#475569') : '#94a3b8',
              transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease, opacity 0.3s ease',
              opacity: activeRating ? 1 : 0,
              minHeight: '2.3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {activeRating
                ? (selectedRating
                    ? `Rating "${getActiveOption()?.label}" dipilih ⭐`
                    : `Preview: ${getActiveOption()?.label}`)
                : '\u00A0'
              }
            </div>

          {/* Deskripsi - Muncul setelah memilih rating */}
          {selectedRating && (
            <div style={{ marginTop: '1rem' }}>
              <label style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '0.5rem'
              }}>
                <MessageSquare size={14} />
                Deskripsi / Catatan
                <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>*wajib</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Tuliskan catatan untuk perjalanan dinas ini (contoh: kondisi kendaraan, ketepatan waktu, kenyamanan, dll.)...`}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${description.trim() ? '#93c5fd' : '#e2e8f0'}`,
                  background: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '80px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = description.trim() ? '#93c5fd' : '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {!description.trim() && (
                <div style={{
                  fontSize: '0.725rem',
                  color: '#ef4444',
                  marginTop: '0.35rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  Deskripsi wajib diisi sebelum mengirim rating
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            style={{
              padding: '0.7rem 2rem',
              borderRadius: '10px',
              border: 'none',
              background: canSubmit
                ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                : '#cbd5e1',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: canSubmit
                ? '0 4px 16px rgba(37, 99, 235, 0.35)'
                : 'none',
              transition: 'all 0.25s ease',
              opacity: isSubmitting ? 0.7 : 1,
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <Send size={16} />
            {isSubmitting ? 'Menyimpan...' : 'Selesaikan Dinas & Kirim Rating'}
          </button>
        </div>
      </div>
    </div>
  );
}
