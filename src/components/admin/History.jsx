import { useState } from 'react';
import { 
  Search, 
  Check,
  Info,
  Star,
  FileSpreadsheet,
  Calendar,
  UserCheck,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import TripDetailModal from '../TicketModal';
import DatePicker from '../DatePicker';

export default function TripHistoryPage({ 
  trips = [],
  showToast
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Filtered Trips: Show ONLY completed trips (status === 'Selesai') matching search & selectedDate
  const filteredTrips = trips.filter(trip => {
    const isCompleted = trip.status === 'Selesai';
    const matchesSearch = 
      trip.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.driverName && trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDate = !selectedDate || trip.date === selectedDate;
    
    return isCompleted && matchesSearch && matchesDate;
  });

  // Group trips by Date (YYYY-MM-DD)
  const groupedTripsByDate = filteredTrips.reduce((acc, trip) => {
    const dateKey = trip.date || 'Tanggal Lainnya';
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(trip);
    return acc;
  }, {});

  // Sort dates descending (newest date first)
  const sortedDates = Object.keys(groupedTripsByDate).sort((a, b) => new Date(b) - new Date(a));

  // Format YYYY-MM-DD into Indonesian date representation (e.g., Selasa, 6 Oktober 2026)
  const formatDateIndonesian = (dateStr) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const [year, month, day] = parts;
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Export Data to Excel (.xlsx) helper
  const exportTripsToExcel = (tripsToExport, filenameSuffix = '') => {
    try {
      const exportData = tripsToExport.map((t, index) => ({
        'No': index + 1,
        'Tanggal Perjalanan': t.date,
        'Nama Pemohon': t.borrowerName,
        'Unit / Departemen': t.department,
        'Rekan Pendamping': Array.isArray(t.companions) && t.companions.length > 0 ? t.companions.join(', ') : 'Tanpa Pendamping',
        'Armada Mobil': t.vehicleName,
        'Driver Operasional': t.driverName || 'Driver Operasional',
        'Jam Keberangkatan': t.departureTime,
        'Est. Jam Kembali': t.returnTime,
        'Jam Realisasi Kembali': t.actualReturnTime || '-',
        'Tujuan / Keperluan': t.destination,
        'Status Perjalanan': t.status,
        'Rating Layanan': t.rating ? `${t.rating} Bintang (${t.rating === 1 ? 'Buruk' : t.rating === 3 ? 'Baik' : 'Sangat Baik'})` : '-',
        'Catatan Rating': t.ratingDescription || '-'
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      worksheet['!cols'] = [
        { wch: 5 },  // No
        { wch: 15 }, // Kode Tiket
        { wch: 15 }, // Tanggal
        { wch: 25 }, // Nama Pemohon
        { wch: 25 }, // Unit
        { wch: 30 }, // Rekan Pendamping
        { wch: 18 }, // Armada Mobil
        { wch: 14 }, // Plat
        { wch: 20 }, // Driver
        { wch: 15 }, // Jam Pergi
        { wch: 15 }, // Est Jam Kembali
        { wch: 20 }, // Jam Realisasi
        { wch: 35 }, // Tujuan
        { wch: 15 }, // Status
        { wch: 22 }, // Rating
        { wch: 30 }, // Catatan
        { wch: 25 }  // Pengaju
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Carpool BJB');

      const today = new Date().toISOString().split('T')[0];
      const filename = filenameSuffix 
        ? `Laporan_Carpool_${filenameSuffix}.xlsx`
        : `Laporan_Riwayat_Carpool_BJB_${today}.xlsx`;

      XLSX.writeFile(workbook, filename);

      if (showToast) {
        showToast('Laporan Excel berhasil di-download!', 'success');
      }
    } catch (err) {
      console.error('Export Excel error:', err);
      if (showToast) {
        showToast('Gagal mengunduh laporan Excel.', 'error');
      }
    }
  };

  const handleExportExcel = () => {
    const exportSource = filteredTrips.length > 0 ? filteredTrips : trips;
    exportTripsToExcel(exportSource);
  };

  return (
    <div>
      {/* Table Container */}
      <div className="table-container">
        {/* Table Controls / Filters & Export Button */}
        <div className="table-controls" style={{ flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div className="search-box" style={{ flex: 1, minWidth: '260px' }}>
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Cari pemohon, mobil, driver, unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Group: Filter Tanggal & Export Excel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Custom DatePicker Popover Filter */}
            <DatePicker
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              placeholder="Filter Tanggal"
              clearable={true}
              align="left"
            />

            {/* Tombol Export Excel Seluruh Data */}
            <button
              onClick={handleExportExcel}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <FileSpreadsheet size={18} /> Tarik Laporan Excel Semua (.xlsx)
            </button>
          </div>
        </div>

        {/* SECTION PER TANGGAL PERJALANAN */}
        {sortedDates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            Belum ada data riwayat perjalanan dinas yang cocok dengan pencarian atau filter tanggal.
          </div>
        ) : (
          sortedDates.map((dateKey) => {
            const dateTrips = groupedTripsByDate[dateKey];
            const formattedDate = formatDateIndonesian(dateKey);

            return (
              <div key={dateKey} style={{ marginBottom: '2rem' }}>
                {/* Date Header Section Banner */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderLeft: '4px solid #2563eb',
                    borderRadius: '10px 10px 0 0',
                    padding: '0.75rem 1.25rem',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Calendar size={18} style={{ color: '#2563eb' }} />
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      {formattedDate}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {/* Tombol Export Excel Khusus Tanggal Ini */}
                    <button
                      onClick={() => exportTripsToExcel(dateTrips, dateKey)}
                      title={`Tarik data Excel khusus tanggal ${formattedDate}`}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #16a34a',
                        backgroundColor: '#f0fdf4',
                        color: '#15803d',
                        fontWeight: 700,
                        fontSize: '0.775rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <FileSpreadsheet size={14} /> Tarik Excel 
                    </button>

                    <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '20px' }}>
                      {dateTrips.length} Perjalanan
                    </span>
                  </div>
                </div>

                {/* Table Data For This Date */}
                <div className="table-scroll-wrapper" style={{ borderRadius: '0 0 10px 10px', borderTop: 'none' }}>
                  <table className="custom-table" style={{ marginTop: 0 }}>
                  <thead>
                    <tr>
                      <th>Pemohon Dinas</th>
                      <th>Unit / Departemen</th>
                      <th>Mobil Dinas & Plat</th>
                      <th>Driver</th>
                      <th>Rekan Pendamping</th>
                      <th>Jam Pergi - Kembali</th>
                      <th>Status</th>
                      <th>Rating</th>
                      <th>Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateTrips.map(trip => (
                      <tr key={trip.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{trip.borrowerName}</div>
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
                          <div style={{ fontWeight: 600, fontSize: '0.825rem', color: trip.driverName ? '#0f172a' : '#94a3b8' }}>
                            {trip.driverName || '-'}
                          </div>
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
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            );
          })
        )}
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
