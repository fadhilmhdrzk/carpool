import { useState } from 'react';
import { 
  Search, 
  Check,
  Info,
  Star
} from 'lucide-react';
import TripDetailModal from '../TicketModal';

export default function TripHistoryPage({ 
  trips = [] 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Filtered Trips: Only show trips that are finished (status === 'Selesai')
  const completedTrips = trips.filter(trip => {
    if (trip.status !== 'Selesai') return false;

    const matchesSearch = 
      trip.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div>
      {/* Table Container */}
      <div className="table-container">
        {/* Table Controls / Filters */}
        <div className="table-controls">
          <div className="search-box" style={{ flex: 1, minWidth: '260px' }}>
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama pemohon, nomor plat, unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Data */}
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tanggal Perjalanan</th>
              <th>Pemohon Dinas</th>
              <th>Unit / Departemen</th>
              <th>Mobil Dinas & Plat</th>
              <th>Rekan Pendamping</th>
              <th>Jam Pergi - Kembali</th>
              <th>Status Perjalanan</th>
              <th>Rating</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {completedTrips.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Belum ada riwayat perjalanan dinas yang telah selesai.
                </td>
              </tr>
            ) : (
              completedTrips.map(trip => (
                <tr key={trip.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      {trip.date}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{trip.borrowerName}</div>
                    <div style={{ fontSize: '0.725rem', color: '#64748b' }}>{trip.submittedBy}</div>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '0.775rem', 
                      background: '#eff6ff', 
                      color: '#1e40af', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      fontWeight: 600 
                    }}>
                      {trip.department}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{trip.vehicleName}</div>
                    <span className="vehicle-plate" style={{ fontSize: '0.75rem' }}>{trip.plateNumber}</span>
                  </td>
                  <td>
                    {trip.companions && trip.companions.length > 0 ? (
                      <div style={{ fontSize: '0.8rem' }}>
                        {trip.companions.map((comp, idx) => (
                          <span key={idx} style={{ 
                            display: 'inline-block', 
                            background: '#f1f5f9', 
                            padding: '0.15rem 0.4rem', 
                            borderRadius: '4px', 
                            marginRight: '0.25rem',
                            marginBottom: '0.25rem' 
                          }}>
                            {comp}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.775rem', fontStyle: 'italic' }}>- Tanpa Pendamping -</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>
                      {trip.departureTime} - {trip.returnTime} WIB
                    </div>
                  </td>
                  <td>
                    <span className="status-badge ready">
                      <Check size={12} /> Selesai
                    </span>
                  </td>
                  <td>
                    {trip.rating ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <div style={{ display: 'flex', gap: '1px' }}>
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                size={13}
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
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: trip.rating === 1 ? '#ef4444' :
                                   trip.rating === 3 ? '#f59e0b' : '#10b981',
                            background: trip.rating === 1 ? '#fef2f2' :
                                       trip.rating === 3 ? '#fffbeb' : '#ecfdf5',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px'
                          }}>
                            {trip.rating === 1 ? 'Buruk' : trip.rating === 3 ? 'Baik' : 'Sangat Baik'}
                          </span>
                        </div>
                        {trip.ratingDescription && (
                          <div
                            style={{
                              fontSize: '0.725rem',
                              color: '#64748b',
                              fontStyle: 'italic',
                              maxWidth: '180px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={trip.ratingDescription}
                          >
                            "{trip.ratingDescription}"
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.775rem', fontStyle: 'italic' }}>-</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedTrip(trip)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontWeight: 700,
                        border: '1px solid #93c5fd',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        boxShadow: '0 1px 3px rgba(37, 99, 235, 0.12)'
                      }}
                      title="Lihat Detail Rincian Perjalanan"
                    >
                      <Info size={13} /> Info
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Perjalanan Modal Pop-up */}
      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </div>
  );
}
