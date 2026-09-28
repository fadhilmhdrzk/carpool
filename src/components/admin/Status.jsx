import { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Search, 
  Filter
} from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function VehicleStatusPage({ 
  vehicles, 
  trips = [],
  onUpdateVehicleStatus,
  onFinishTrip, 
  showToast 
}) {
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('Semua');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    vehicle: null,
    actionType: '' // 'finishDinas' | 'setService' | 'finishService'
  });

  // Filtered Vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
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
      const activeTrip = trips.find(t => t.vehicleId === vehicle.id && t.status === 'Aktif');
      onFinishTrip(activeTrip ? activeTrip.id : null, vehicle.id);
      showToast(`Tugas dinas ${vehicle.name} (${vehicle.plateNumber}) telah diselesaikan! Mobil kembali TERSEDIA.`, 'success');
    } else if (actionType === 'setService') {
      onUpdateVehicleStatus(vehicle.id, 'Perawatan');
      showToast(`Status ${vehicle.name} (${vehicle.plateNumber}) diubah menjadi PERAWATAN (SERVICE)`, 'warning');
    } else if (actionType === 'finishService') {
      onUpdateVehicleStatus(vehicle.id, 'Tersedia');
      showToast(`Perawatan ${vehicle.name} (${vehicle.plateNumber}) telah selesai! Mobil kembali TERSEDIA.`, 'success');
    }

    setConfirmModal({ isOpen: false, vehicle: null, actionType: '' });
  };

  return (
    <div>
      {/* Table Container */}
      <div className="table-container">
        {/* Header Bar & Search Controls */}
        <div className="table-controls" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search Input */}
          <div className="search-box" style={{ flex: 1, minWidth: '260px' }}>
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama mobil, nomor plat, nama driver, peminjam, unit..."
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
        <table className="custom-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Armada Mobil Dinas</th>
              <th>Nomor Plat</th>
              <th>Status Mobil</th>
              <th>Peminjam / Unit Saat Ini</th>
              <th>Est. Jam Kembali</th>
              <th>Aksi Ubah Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Tidak ada data mobil yang cocok dengan pencarian / filter.
                </td>
              </tr>
            ) : (
              filteredVehicles.map((v, index) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600, color: '#64748b' }}>{index + 1}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>Driver: {v.driverName || 'Driver Operasional'}</div>
                  </td>
                  <td>
                    <span className="vehicle-plate" style={{ fontSize: '0.8rem' }}>{v.plateNumber}</span>
                  </td>
                  <td>
                    {v.status === 'Tersedia' && (
                      <span className="status-badge ready">
                        <CheckCircle2 size={12} /> Tersedia
                      </span>
                    )}
                    {v.status === 'Terpakai' && (
                      <span className="status-badge in-use">
                        <Clock size={12} /> Terpakai
                      </span>
                    )}
                    {v.status === 'Perawatan' && (
                      <span className="status-badge maintenance">
                        <Wrench size={12} /> Perawatan
                      </span>
                    )}
                  </td>
                  <td>
                    {v.status === 'Terpakai' && v.currentBorrower ? (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{v.currentBorrower}</div>
                        <span style={{ 
                          fontSize: '0.725rem', 
                          background: '#eff6ff', 
                          color: '#1e40af', 
                          padding: '0.1rem 0.4rem', 
                          borderRadius: '4px',
                          fontWeight: 600 
                        }}>
                          {v.currentDepartment}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>-</span>
                    )}
                  </td>
                  <td>
                    {v.status === 'Terpakai' && v.currentReturnTime ? (
                      <div style={{ fontWeight: 700, color: '#d97706', fontSize: '0.85rem' }}>
                        Pkl {v.currentReturnTime} WIB
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>-</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {/* Tombol Selesaikan Dinas (Hanya jika status TERPAKAI) */}
                      {v.status === 'Terpakai' && (
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
                            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                          }}
                        >
                          <CheckCircle2 size={13} /> Selesaikan Dinas
                        </button>
                      )}

                      {/* Tombol Set Service (Hanya jika status TERSEDIA atau TERPAKAI) */}
                      {v.status !== 'Perawatan' && (
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
                            gap: '0.3rem'
                          }}
                        >
                          <Wrench size={13} /> Set Service
                        </button>
                      )}

                      {/* Tombol Selesai Service (Hanya jika status PERAWATAN) */}
                      {v.status === 'Perawatan' && (
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
              ))
            )}
          </tbody>
        </table>
      </div>

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
                  <strong style={{ color: '#0f172a' }}>{confirmModal.vehicle.name} ({confirmModal.vehicle.plateNumber})</strong>? Mobil akan kembali dalam status <strong style={{ color: '#047857' }}>TERSEDIA</strong> dan tercatat di <strong>Riwayat Perjalanan</strong>.
                </>
              )}
              {confirmModal.actionType === 'setService' && (
                <>
                  Apakah Anda yakin ingin mengubah status mobil{' '}
                  <strong style={{ color: '#0f172a' }}>{confirmModal.vehicle.name} ({confirmModal.vehicle.plateNumber})</strong> menjadi{' '}
                  <strong style={{ color: '#b45309' }}>PERAWATAN (SERVICE)</strong>?
                </>
              )}
              {confirmModal.actionType === 'finishService' && (
                <>
                  Apakah Anda yakin perawatan/service untuk mobil{' '}
                  <strong style={{ color: '#0f172a' }}>{confirmModal.vehicle.name} ({confirmModal.vehicle.plateNumber})</strong> telah selesai? Status mobil akan kembali menjadi <strong style={{ color: '#047857' }}>TERSEDIA</strong>.
                </>
              )}
            </div>
          )
        }
        onConfirm={handleExecuteAction}
        onClose={() => setConfirmModal({ isOpen: false, vehicle: null, actionType: '' })}
      />
    </div>
  );
}
