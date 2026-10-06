import { useState } from 'react';
import { 
  Car, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  User,
  Users, 
  MapPin, 
  UserCheck,
  Info,
  PlusCircle
} from 'lucide-react';
import BookingModal from './BookingModal';

export default function Home({ 
  vehicles = [], 
  trips = [],
  onSubmitRequest, 
  showToast 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState(null);

  const handleSelectVehicle = (vehicle) => {
    const activeTrip = trips.find(t => String(t.vehicleId) === String(vehicle.id) && t.status === 'Aktif');
    const effectiveStatus = vehicle.status === 'Perawatan' ? 'Perawatan' : (activeTrip ? 'Terpakai' : 'Tersedia');
    if (effectiveStatus === 'Tersedia') {
      setSelectedVehicleForModal(vehicle);
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="page-banner">
        <div className="banner-badge">
          <UserCheck size={14} /> MODE SELF-SERVICE KARYAWAN
        </div>
        <h1 className="banner-title">Pengajuan Mobil Dinas & Real-Time Pool Status</h1>
        <p className="banner-desc">
          Selamat datang di Layanan Carpool Mandiri Karyawan Bank. Pilih armada kendaraan dinas yang berstatus <strong>Tersedia</strong> di bawah ini untuk memunculkan formulir pengajuan dinas.
        </p>
      </div>

      {/* Real-time Vehicle Availability Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-header">
          <h2 className="section-title">
            <Car className="text-blue-600" /> Status Ketersediaan Mobil
          </h2>
        </div>

        <div className="vehicles-grid">
          {vehicles.map(vehicle => {
            const activeTrip = trips.find(t => String(t.vehicleId) === String(vehicle.id) && t.status === 'Aktif');
            const effectiveStatus = vehicle.status === 'Perawatan' ? 'Perawatan' : (activeTrip ? 'Terpakai' : 'Tersedia');
            const effectiveBorrower = activeTrip ? activeTrip.borrowerName : vehicle.currentBorrower;
            const effectiveReturnTime = activeTrip ? activeTrip.returnTime : vehicle.currentReturnTime;
            const isAvailable = effectiveStatus === 'Tersedia';

            return (
              <div 
                key={vehicle.id} 
                className="vehicle-card"
                onClick={() => handleSelectVehicle(vehicle)}
                style={{
                  cursor: isAvailable ? 'pointer' : 'default'
                }}
              >
                <div className="vehicle-card-top">
                  <div>
                    <div className="vehicle-name">{vehicle.name}</div>
                  </div>
                  <div>
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
                  </div>
                </div>

                {effectiveStatus === 'Terpakai' && (
                  <div className="in-use-info">
                    <p><strong>Penanggung Jawab:</strong> {effectiveBorrower || 'Dinas Aktif'}</p>
                    {effectiveReturnTime && (
                      <p><strong>Perkiraan Jam Kembali:</strong> Pkl {effectiveReturnTime} WIB</p>
                    )}
                  </div>
                )}

                {isAvailable && (
                  <div style={{ marginTop: '0.85rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectVehicle(vehicle);
                      }}
                      style={{
                        padding: '0.45rem 0.95rem',
                        fontSize: '0.825rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <PlusCircle size={15} /> Pilih Mobil Ini
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup Form Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicles={vehicles}
        initialVehicle={selectedVehicleForModal}
        onSubmit={onSubmitRequest}
        showToast={showToast}
      />
    </div>
  );
}
