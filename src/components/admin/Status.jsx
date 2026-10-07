import { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Search, 
  Filter,
  Info,
  Star,
  Edit3,
  Save,
  X,
  Car,
  UserCheck,
  History,
  Users,
  MessageSquare
} from 'lucide-react';
import ConfirmModal from '../ConfirmModal';
import TicketModal from '../TicketModal';
import RatingModal from '../RatingModal';
import { AVAILABLE_DRIVERS, getPlateNumber } from '../../data/mockData';

export default function VehicleStatusPage({ 
  vehicles, 
  trips = [],
  onUpdateVehicleStatus,
  onEditVehicleDetails,
  onFinishTrip, 
  showToast 
}) {
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('Semua');
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Edit Vehicle Details Modal State (Plat & Driver)
  const [editModal, setEditModal] = useState({
    isOpen: false,
    vehicle: null,
    plateNumber: '',
    driverName: ''
  });

  // Rating Modal State
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    vehicle: null,
    tripId: null
  });

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    vehicle: null,
    actionType: '' // 'finishDinas' | 'setService' | 'finishService'
  });

  // Driver History Modal State
  const [driverHistoryModal, setDriverHistoryModal] = useState(null);

  // Filtered Vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      (v.plateNumber && v.plateNumber.toLowerCase().includes(vehicleSearch.toLowerCase())) ||
      (v.currentBorrower && v.currentBorrower.toLowerCase().includes(vehicleSearch.toLowerCase())) ||
      (v.currentDepartment && v.currentDepartment.toLowerCase().includes(vehicleSearch.toLowerCase())) ||
      (v.driverName && v.driverName.toLowerCase().includes(vehicleSearch.toLowerCase()));

    const matchesStatus = vehicleStatusFilter === 'Semua' || v.status === vehicleStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenConfirmModal = (vehicle, actionType) => {
    setConfirmModal({
      isOpen: true,
      vehicle,
      actionType
    });
  };

  const handleExecuteAction = () => {
    if (!confirmModal.vehicle || !confirmModal.actionType) return;
    const { vehicle, actionType } = confirmModal;

    if (actionType === 'finishDinas') {
      // Buka rating modal terlebih dahulu sebelum menyelesaikan dinas
      const activeTrip = trips.find(t => String(t.vehicleId) === String(vehicle.id) && t.status === 'Aktif');
      setRatingModal({
        isOpen: true,
        vehicle: vehicle,
        tripId: activeTrip ? activeTrip.id : null
      });
    } else if (actionType === 'setService') {
      onUpdateVehicleStatus(vehicle.id, 'Perawatan');
      showToast(`Status ${vehicle.name} diubah menjadi PERAWATAN (SERVICE)`, 'warning');
    } else if (actionType === 'finishService') {
      onUpdateVehicleStatus(vehicle.id, 'Tersedia');
      showToast(`Perawatan ${vehicle.name} telah selesai! Mobil kembali TERSEDIA.`, 'success');
    }

    setConfirmModal({ isOpen: false, vehicle: null, actionType: '' });
  };

  // Handle rating, driver & plate submission setelah selesaikan dinas
  const handleSubmitRating = (rating, description, driverName, plateNumber) => {
    const { vehicle, tripId } = ratingModal;
    if (!vehicle) return;

    // Finish trip with rating, description, driverName, and plateNumber
    onFinishTrip(tripId, vehicle.id, rating, description, driverName, plateNumber);

    const ratingLabel = rating === 1 ? 'Buruk' : rating === 3 ? 'Baik' : 'Sangat Baik';
    showToast(
      `Tugas dinas ${vehicle.name} diselesaikan! Driver: ${driverName}, Plat: ${plateNumber}, Rating: ${ratingLabel} (${rating}⭐)`,
      'success'
    );

    setRatingModal({ isOpen: false, vehicle: null, tripId: null });
  };

  // Handle tutup modal rating (tanpa menyelesaikan dinas)
  const handleCloseRatingModal = () => {
    setRatingModal({ isOpen: false, vehicle: null, tripId: null });
  };

  // Buka Modal Edit Detail Armada (Plat & Driver)
  const handleOpenEditModal = (vehicle) => {
    setEditModal({
      isOpen: true,
      vehicle,
      plateNumber: vehicle.plateNumber || '',
      driverName: vehicle.driverName || ''
    });
  };

  // Simpan Perubahan Edit Armada (Plat Mobil)
  const handleSaveEditVehicle = (e) => {
    e.preventDefault();
    const { vehicle, plateNumber } = editModal;
    if (!vehicle) return;

    if (!plateNumber.trim()) {
      showToast('Nomor Plat wajib diisi!', 'warning');
      return;
    }

    if (onEditVehicleDetails) {
      onEditVehicleDetails(vehicle.id, {
        plateNumber: plateNumber.trim()
      });
    }

    showToast(`Detail ${vehicle.name} berhasil diperbarui! (Plat: ${plateNumber.trim().toUpperCase()})`, 'success');
    setEditModal({ isOpen: false, vehicle: null, plateNumber: '', driverName: '' });
  };

  return (
    <div>
      {/* Table Container - Status Mobil */}
      <div className="table-container">
        {/* Header Bar & Search Controls */}
        <div className="table-controls" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search Input */}
          <div className="search-box" style={{ flex: 1, minWidth: '260px' }}>
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama mobil, peminjam, unit..."
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
            />
          </div>

          {/* Filter Status Mobil */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} className="text-slate-500" />
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#475569' }}>Filter Status:</span>
            <select
              className="form-select"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem', width: 'auto' }}
              value={vehicleStatusFilter}
              onChange={(e) => setVehicleStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status Armada</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Terpakai">Terpakai</option>
              <option value="Perawatan">Perawatan</option>
            </select>
          </div>
        </div>

        {/* TABEL STATUS MOBIL */}
        <div className="table-scroll-wrapper">
          <table className="custom-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Armada Mobil Dinas</th>
              <th>Status Mobil</th>
              <th>Peminjam / Unit Saat Ini</th>
              <th>Est. Jam Kembali</th>
              <th>Aksi Ubah Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Tidak ada data mobil yang cocok dengan pencarian / filter.
                </td>
              </tr>
            ) : (
              filteredVehicles.map((v, index) => {
                const activeTrip = trips.find(t => String(t.vehicleId) === String(v.id) && t.status === 'Aktif');
                const effectiveStatus = v.status === 'Perawatan' ? 'Perawatan' : (activeTrip || (v.status === 'Terpakai' && v.currentBorrower) ? 'Terpakai' : 'Tersedia');
                const effectiveBorrower = activeTrip ? activeTrip.borrowerName : (effectiveStatus === 'Terpakai' ? v.currentBorrower : null);
                const effectiveDepartment = activeTrip ? activeTrip.department : (effectiveStatus === 'Terpakai' ? v.currentDepartment : null);
                const effectiveReturnTime = activeTrip ? activeTrip.returnTime : (effectiveStatus === 'Terpakai' ? v.currentReturnTime : null);

                return (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>{index + 1}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                    </td>
                    <td>
                      {effectiveStatus === 'Tersedia' && (
                        <span className="status-badge ready">
                          <CheckCircle2 size={12} /> Tersedia
                        </span>
                      )}
                      {effectiveStatus === 'Terpakai' && (
                        <span className="status-badge in-use">
                          <Clock size={12} /> Terpakai
                        </span>
                      )}
                      {effectiveStatus === 'Perawatan' && (
                        <span className="status-badge maintenance">
                          <Wrench size={12} /> Perawatan
                        </span>
                      )}
                    </td>
                    <td>
                      {effectiveStatus === 'Terpakai' && effectiveBorrower ? (
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{effectiveBorrower}</div>
                          {effectiveDepartment && (
                            <span style={{ 
                              fontSize: '0.725rem', 
                              background: '#eff6ff', 
                              color: '#1e40af', 
                              padding: '0.1rem 0.4rem', 
                              borderRadius: '4px',
                              fontWeight: 600 
                            }}>
                              {effectiveDepartment}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>-</span>
                      )}
                    </td>
                    <td>
                      {effectiveStatus === 'Terpakai' && effectiveReturnTime ? (
                        <div style={{ fontWeight: 700, color: '#d97706', fontSize: '0.85rem' }}>
                          Pkl {effectiveReturnTime} WIB
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>-</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        {/* 1. Tombol Selesaikan Dinas (Hanya jika status TERPAKAI) */}
                        {effectiveStatus === 'Terpakai' && (
                          <button
                            onClick={() => handleOpenConfirmModal(v, 'finishDinas')}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              borderRadius: '6px',
                              background: '#16a34a',
                              color: '#ffffff',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                            }}
                          >
                            <CheckCircle2 size={13} /> Selesaikan Dinas
                          </button>
                        )}

                        {/* 2. Tombol Set Service (Hanya jika status TERSEDIA) */}
                        {effectiveStatus !== 'Perawatan' && effectiveStatus !== 'Terpakai' && (
                          <button
                            onClick={() => handleOpenConfirmModal(v, 'setService')}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              borderRadius: '6px',
                              background: '#ffffff',
                              color: '#b45309',
                              fontWeight: 600,
                              border: '1px solid #f59e0b',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Wrench size={13} /> Set Service
                          </button>
                        )}

                        {/* 4. Tombol Info (MUNCUL APABILA MOBIL TERPAKAI) */}
                        {effectiveStatus === 'Terpakai' && (
                          <button
                            onClick={() => {
                              const tripToShow = activeTrip || {
                                id: `trip-info-${v.id}`,
                                ticketCode: `CP-${new Date().getFullYear()}-00${v.id.replace('v-', '')}`,
                                borrowerName: v.currentBorrower || 'Karyawan Dinas',
                                department: v.currentDepartment || 'Operasional',
                                vehicleName: v.name,
                                plateNumber: v.plateNumber || 'D 1185 ALT',
                                date: new Date().toISOString().split('T')[0],
                                departureTime: '08:30',
                                returnTime: v.currentReturnTime || '17:00',
                                destination: 'Kunjungan / Perjalanan Dinas Operasional Bank',
                                status: 'Aktif',
                                submittedBy: `${v.currentBorrower || 'Karyawan'} (Self-Service)`
                              };
                              setSelectedTrip(tripToShow);
                            }}
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
                            title="Lihat Detail Data Perjalanan (Input Guest)"
                          >
                            <Info size={13} /> Info
                          </button>
                        )}

                        {/* 5. Tombol Selesai Service (Hanya jika status PERAWATAN) */}
                        {effectiveStatus === 'Perawatan' && (
                          <button
                            onClick={() => handleOpenConfirmModal(v, 'finishService')}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              borderRadius: '6px',
                              background: '#16a34a',
                              color: '#ffffff',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <CheckCircle2 size={13} /> Selesai Service
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* TABEL PERFORMA & RATING DRIVER OPERASIONAL */}
      <div className="table-container" style={{ marginTop: '2rem' }}>
        <div style={{ padding: '1.15rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <UserCheck size={20} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              TABEL RATING & PERFORMA DRIVER OPERASIONAL
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#1e40af', backgroundColor: '#dbeafe', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>
            {AVAILABLE_DRIVERS.length} Driver Aktif
          </span>
        </div>

        <div className="table-scroll-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Driver Operasional</th>
                <th>Total Perjalanan Selesai</th>
                <th>Rata-Rata Rating Driver</th>
                <th>Kategori Layanan</th>
                <th>Riwayat Perjalanan</th>
              </tr>
            </thead>
            <tbody>
              {AVAILABLE_DRIVERS.map((driverName, idx) => {
                const driverTrips = trips.filter(t => t.status === 'Selesai' && t.driverName === driverName);
                const ratedTrips = driverTrips.filter(t => t.rating);
                const avgRating = ratedTrips.length > 0
                  ? ratedTrips.reduce((sum, t) => sum + t.rating, 0) / ratedTrips.length
                  : 0;

                return (
                  <tr key={driverName}>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                        {driverName}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px'
                      }}>
                        {driverTrips.length} Perjalanan
                      </span>
                    </td>
                    <td>
                      {ratedTrips.length > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                fill={star <= Math.round(avgRating) ? '#f59e0b' : 'none'}
                                color={star <= Math.round(avgRating) ? '#f59e0b' : '#cbd5e1'}
                              />
                            ))}
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a' }}>
                            {avgRating % 1 === 0 ? avgRating : avgRating.toFixed(1)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            ({ratedTrips.length})
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
                          Belum ada rating
                        </span>
                      )}
                    </td>
                    <td>
                      {ratedTrips.length > 0 ? (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: avgRating <= 2 ? '#ef4444' : avgRating <= 3.9 ? '#d97706' : '#10b981',
                          backgroundColor: avgRating <= 2 ? '#fef2f2' : avgRating <= 3.9 ? '#fffbeb' : '#ecfdf5',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          border: `1px solid ${avgRating <= 2 ? '#fecaca' : avgRating <= 3.9 ? '#fde68a' : '#a7f3d0'}`
                        }}>
                          {avgRating <= 2 ? 'Buruk' : avgRating <= 3.9 ? 'Baik' : 'Sangat Baik'}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>-</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setDriverHistoryModal({ driverName, trips: driverTrips })}
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
                      >
                        <History size={13} /> Riwayat
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Ticket Modal Pop-up (Data Perjalanan Input Guest) */}
      {selectedTrip && (
        <TicketModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}

      {/* Rating Modal Pop-up (Hanya Admin - Setelah Selesaikan Dinas) */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        vehicle={ratingModal.vehicle}
        onSubmitRating={handleSubmitRating}
        onClose={handleCloseRatingModal}
      />

      {/* Confirmation Modal Pop-up */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.actionType === 'finishDinas' ? 'Konfirmasi Penyelesaian Dinas' :
          confirmModal.actionType === 'finishService' ? 'Konfirmasi Selesai Service' : 'Konfirmasi Set Service'
        }
        confirmText={
          confirmModal.actionType === 'finishDinas' ? 'Ya, Selesaikan Dinas' :
          confirmModal.actionType === 'finishService' ? 'Ya, Selesai Service' : 'Ya, Set Service'
        }
        confirmVariant={confirmModal.actionType === 'setService' ? 'warning' : 'emerald'}
        message={
          confirmModal.vehicle && (
            <div>
              {confirmModal.actionType === 'finishDinas' && (
                <>
                  Apakah Anda yakin ingin menyelesaikan tugas dinas untuk{' '}
                  <strong style={{ color: '#0f172a' }}>{confirmModal.vehicle.name}</strong>? Mobil akan kembali dalam status <strong style={{ color: '#047857' }}>TERSEDIA</strong> dan tercatat di <strong>Riwayat Perjalanan</strong>.
                </>
              )}
              {confirmModal.actionType === 'setService' && (
                <>
                  Apakah Anda yakin ingin mengubah status mobil{' '}
                  <strong style={{ color: '#0f172a' }}>{confirmModal.vehicle.name}</strong> menjadi{' '}
                  <strong style={{ color: '#b45309' }}>PERAWATAN (SERVICE)</strong>?
                </>
              )}
              {confirmModal.actionType === 'finishService' && (
                <>
                  Apakah Anda yakin perawatan/service untuk mobil{' '}
                  <strong style={{ color: '#0f172a' }}>{confirmModal.vehicle.name}</strong> telah selesai? Status mobil akan kembali menjadi <strong style={{ color: '#047857' }}>TERSEDIA</strong>.
                </>
              )}
            </div>
          )
        }
        onConfirm={handleExecuteAction}
        onClose={() => setConfirmModal({ isOpen: false, vehicle: null, actionType: '' })}
      />

      {/* Edit Vehicle Details Modal Pop-up */}
      {editModal.isOpen && editModal.vehicle && (
        <div 
          className="modal-overlay"
          onClick={() => setEditModal({ isOpen: false, vehicle: null, plateNumber: '', driverName: '' })}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px' }}
          >
            {/* Header Modal Pop-up */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
              color: '#ffffff',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    Edit Detail Armada
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    {editModal.vehicle.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModal({ isOpen: false, vehicle: null, plateNumber: '', driverName: '' })}
                style={{
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
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

            {/* Form Body */}
            <form onSubmit={handleSaveEditVehicle} style={{ padding: '1.5rem' }}>
              {/* Field Nomor Plat */}
              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Nomor Plat Mobil
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}
                    placeholder="Contoh: D 1185 ALT"
                    value={editModal.plateNumber}
                    onChange={(e) => setEditModal(prev => ({ ...prev, plateNumber: e.target.value }))}
                    autoFocus
                    required
                  />
                  <Car size={18} className="text-slate-400" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, vehicle: null, plateNumber: '', driverName: '' })}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Save size={16} /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver History Modal Pop-up */}
      {driverHistoryModal && (
        <div 
          className="modal-overlay"
          onClick={() => setDriverHistoryModal(null)}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', width: '90%' }}
          >
            {/* Header Modal Pop-up */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
              color: '#ffffff',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '12px 12px 0 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <History size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    Riwayat Perjalanan Driver
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    Driver: {driverHistoryModal.driverName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDriverHistoryModal(null)}
                style={{
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem', maxHeight: '70vh', overflowY: 'auto' }}>
              {driverHistoryModal.trips.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                  Belum ada riwayat perjalanan yang diselesaikan oleh driver ini.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {driverHistoryModal.trips.map((trip, idx) => {
                    const ratingVal = trip.rating || 0;
                    const ratingLabel = ratingVal === 1 ? 'Buruk' : ratingVal === 3 ? 'Baik' : ratingVal === 5 ? 'Sangat Baik' : '-';
                    const ratingColor = ratingVal === 1 ? '#ef4444' : ratingVal === 3 ? '#d97706' : ratingVal === 5 ? '#10b981' : '#64748b';
                    const ratingBg = ratingVal === 1 ? '#fef2f2' : ratingVal === 3 ? '#fffbeb' : ratingVal === 5 ? '#ecfdf5' : '#f1f5f9';

                    return (
                      <div 
                        key={trip.id || idx}
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '1rem',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                        }}
                      >
                        {/* 1. Penumpang / Peminjam */}
                        <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                          <Users size={16} style={{ color: '#2563eb', marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              1. Penumpang / Peminjam
                            </span>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginTop: '1px' }}>
                              {trip.borrowerName}
                            </div>
                            {trip.companions && trip.companions.length > 0 && (
                              <div style={{ fontSize: '0.775rem', color: '#475569', marginTop: '2px' }}>
                                Pendamping: {trip.companions.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 2. Nomor Plat Mobil */}
                        <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                          <Car size={16} style={{ color: '#0284c7', marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              2. Nomor Plat Mobil
                            </span>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginTop: '1px' }}>
                              {trip.plateNumber || getPlateNumber(trip.vehicleId, trip.vehicleName)}
                            </div>
                          </div>
                        </div>

                        {/* 3. Rating Layanan */}
                        <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                          <Star size={16} style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              3. Rating Layanan
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                              {ratingVal > 0 ? (
                                <>
                                  <div style={{ display: 'flex', gap: '2px' }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        size={14}
                                        fill={s <= ratingVal ? '#f59e0b' : 'none'}
                                        color={s <= ratingVal ? '#f59e0b' : '#cbd5e1'}
                                      />
                                    ))}
                                  </div>
                                  <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: ratingColor,
                                    backgroundColor: ratingBg,
                                    padding: '0.15rem 0.45rem',
                                    borderRadius: '4px'
                                  }}>
                                    {ratingVal} Bintang ({ratingLabel})
                                  </span>
                                </>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                  Belum ada rating
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 4. Deskripsi / Catatan Perjalanan */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                          <MessageSquare size={16} style={{ color: '#64748b', marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              4. Deskripsi / Catatan Perjalanan
                            </span>
                            <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '2px', fontStyle: trip.ratingDescription || trip.description ? 'normal' : 'italic' }}>
                              {trip.ratingDescription || trip.description || 'Tidak ada deskripsi/catatan.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
