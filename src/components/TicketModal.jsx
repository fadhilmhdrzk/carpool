import { X, UserCheck, Car, Star } from 'lucide-react';

export default function TripDetailModal({ trip, onClose }) {
  if (!trip) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Car size={22} style={{ color: '#60a5fa' }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Detail Perjalanan Dinas
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#94a3b8', border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="ticket-item">
              <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Penanggung Jawab / Peminjam
              </label>
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{trip.borrowerName}</p>
            </div>

            <div className="ticket-item">
              <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Unit / Departemen
              </label>
              <p style={{ margin: 0, fontWeight: 700, color: '#1e40af', fontSize: '0.95rem' }}>{trip.department}</p>
            </div>

            <div className="ticket-item">
              <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Mobil Dinas
              </label>
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{trip.vehicleName}</p>
            </div>

            <div className="ticket-item">
              <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Nomor Plat
              </label>
              <p style={{ margin: 0, fontFamily: 'monospace', fontWeight: 800, color: '#b45309', fontSize: '0.95rem' }}>{trip.plateNumber}</p>
            </div>

            <div className="ticket-item">
              <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Tanggal Perjalanan
              </label>
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{trip.date}</p>
            </div>

            <div className="ticket-item">
              <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Jam Pergi – Kembali
              </label>
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{trip.departureTime} – {trip.returnTime} WIB</p>
            </div>
          </div>

          {/* Companions */}
          <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px dashed #e2e8f0' }}>
            <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
              Rekan Pendamping Dinas ({trip.companions?.length || 0} Orang)
            </label>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>
              {trip.companions && trip.companions.length > 0
                ? trip.companions.join(', ')
                : 'Tanpa Rekan Pendamping'}
            </p>
          </div>

          {/* Destination */}
          <div style={{ marginTop: '0.85rem' }}>
            <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
              Keperluan / Tujuan Dinas
            </label>
            <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>{trip.destination}</p>
          </div>

          {/* Rating & Ulasan Perjalanan */}
          {trip.rating && (
            <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed #e2e8f0' }}>
              <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Rating & Catatan Perjalanan
              </label>
              <div
                style={{
                  background: trip.rating === 1 ? '#fef2f2' : trip.rating === 3 ? '#fffbeb' : '#ecfdf5',
                  border: `1px solid ${trip.rating === 1 ? '#fca5a5' : trip.rating === 3 ? '#fcd34d' : '#6ee7b7'}`,
                  borderRadius: '10px',
                  padding: '0.85rem 1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < trip.rating ? (
                          trip.rating === 1 ? '#ef4444' :
                          trip.rating === 3 ? '#f59e0b' : '#10b981'
                        ) : 'none'}
                        color={i < trip.rating ? (
                          trip.rating === 1 ? '#ef4444' :
                          trip.rating === 3 ? '#f59e0b' : '#10b981'
                        ) : '#cbd5e1'}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: trip.rating === 1 ? '#991b1b' : trip.rating === 3 ? '#92400e' : '#065f46',
                      background: '#ffffff',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}
                  >
                    {trip.rating === 1 ? '1 Bintang (Buruk)' : trip.rating === 3 ? '3 Bintang (Baik)' : '5 Bintang (Sangat Baik)'}
                  </span>
                </div>

                {trip.ratingDescription && (
                  <div
                    style={{
                      marginTop: '0.6rem',
                      paddingTop: '0.5rem',
                      borderTop: `1px solid ${trip.rating === 1 ? '#fee2e2' : trip.rating === 3 ? '#fef3c7' : '#d1fae5'}`
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.15rem' }}>
                      Deskripsi / Catatan:
                    </span>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b', fontStyle: 'italic', lineHeight: 1.45 }}>
                      "{trip.ratingDescription}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submitted By */}
          {trip.submittedBy && (
            <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed #f1f5f9' }}>
              <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Pengaju / Sumber Input
              </label>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.825rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <UserCheck size={14} /> {trip.submittedBy}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #1e40af, #1d4ed8)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)'
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
