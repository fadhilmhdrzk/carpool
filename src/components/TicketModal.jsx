import { CheckCircle, X, Printer, ShieldCheck, QrCode } from 'lucide-react';

export default function BookingTicketModal({ trip, onClose }) {
  if (!trip) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Ticket Header */}
        <div className="ticket-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck className="text-emerald-400" size={20} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#60a5fa' }}>
                BANK OFFICIAL E-TICKET
              </span>
            </div>
            <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>Surat Tugas Carpool Dinas</h3>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Ticket Body */}
        <div className="ticket-body">
          <div className="ticket-code-box">
            <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
              Kode Tiket Perjalanan Dinas
            </span>
            <div className="ticket-code">{trip.ticketCode}</div>
          </div>

          <div className="ticket-details-grid">
            <div className="ticket-item">
              <label>Penanggung Jawab</label>
              <p>{trip.borrowerName}</p>
            </div>

            <div className="ticket-item">
              <label>Unit / Departemen</label>
              <p>{trip.department}</p>
            </div>

            <div className="ticket-item">
              <label>Mobil Dinas</label>
              <p>{trip.vehicleName}</p>
            </div>

            <div className="ticket-item">
              <label>Nomor Plat</label>
              <p style={{ fontFamily: 'monospace', color: '#b45309' }}>{trip.plateNumber}</p>
            </div>

            <div className="ticket-item">
              <label>Tanggal Perjalanan</label>
              <p>{trip.date}</p>
            </div>

            <div className="ticket-item">
              <label>Jam Pergi - Kembali</label>
              <p>{trip.departureTime} - {trip.returnTime} WIB</p>
            </div>
          </div>

          {/* Companions */}
          <div className="ticket-item" style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0' }}>
            <label>Rekan Pendamping Dinas ({trip.companions?.length || 0} Orang)</label>
            <p style={{ fontWeight: 500, fontSize: '0.85rem' }}>
              {trip.companions && trip.companions.length > 0 
                ? trip.companions.join(', ') 
                : 'Tanpa Rekan Pendamping'}
            </p>
          </div>

          {/* Destination */}
          <div className="ticket-item" style={{ marginTop: '0.75rem' }}>
            <label>Keperluan / Tujuan Dinas</label>
            <p style={{ fontWeight: 500, fontSize: '0.85rem', color: '#334155' }}>{trip.destination}</p>
          </div>

          {/* QR Code Graphic Placeholder */}
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.4rem', background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <QrCode size={38} className="text-slate-800" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>TIKET RESMI VALID</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Tunjukkan tiket ini kepada Petugas Satpam Pool Mobil</div>
              </div>
            </div>
            <span className="status-badge ready">
              <CheckCircle size={12} /> Aktif
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              onClick={handlePrint}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <Printer size={16} /> Cetak Tiket
            </button>

            <button
              onClick={onClose}
              className="submit-btn"
              style={{ flex: 1, padding: '0.75rem', fontSize: '0.875rem' }}
            >
              Tutup & Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
