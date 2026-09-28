import { useState } from 'react';
import { 
  Search, 
  Check
} from 'lucide-react';

export default function TripHistoryPage({ 
  trips = [] 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered Trips: Only show trips that are finished (status === 'Selesai')
  const completedTrips = trips.filter(trip => {
    if (trip.status !== 'Selesai') return false;

    const matchesSearch = 
      trip.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              placeholder="Cari nama pemohon, nomor plat, tiket, unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Data */}
        <table className="custom-table">
          <thead>
            <tr>
              <th>Kode Tiket / Tanggal</th>
              <th>Pemohon Dinas</th>
              <th>Unit / Departemen</th>
              <th>Mobil Dinas & Plat</th>
              <th>Rekan Pendamping</th>
              <th>Jam Pergi - Kembali</th>
              <th>Status Perjalanan</th>
            </tr>
          </thead>
          <tbody>
            {completedTrips.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Belum ada riwayat perjalanan dinas yang telah selesai.
                </td>
              </tr>
            ) : (
              completedTrips.map(trip => (
                <tr key={trip.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#1e40af', fontFamily: 'monospace' }}>
                      {trip.ticketCode}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
