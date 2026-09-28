import { useState, useEffect } from 'react';
import { 
  X, 
  Car, 
  User, 
  Building2, 
  Users, 
  MapPin, 
  Send, 
  UserCheck, 
  Calendar,
  Clock,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import { BANK_DEPARTMENTS } from '../../data/mockData';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';

export default function BookingFormModal({ 
  isOpen, 
  onClose, 
  vehicles = [], 
  initialVehicle = null, 
  onSubmit, 
  showToast 
}) {
  const [borrowerName, setBorrowerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('08:00');
  const [returnTime, setReturnTime] = useState('17:00');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedCompanions, setSelectedCompanions] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [destination, setDestination] = useState('');

  // Validation step state
  const [isConfirming, setIsConfirming] = useState(false);

  // Update selected vehicle when modal opens with initialVehicle
  useEffect(() => {
    if (initialVehicle) {
      setSelectedVehicleId(initialVehicle.id);
    } else if (vehicles.length > 0) {
      const available = vehicles.find(v => v.status === 'Tersedia');
      if (available) setSelectedVehicleId(available.id);
    }
    if (!isOpen) {
      setIsConfirming(false);
    }
  }, [initialVehicle, vehicles, isOpen]);

  if (!isOpen) return null;

  const currentDepartment = BANK_DEPARTMENTS.find(d => d.id === selectedDeptId);
  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId) || initialVehicle;

  const handleDepartmentChange = (e) => {
    setSelectedDeptId(e.target.value);
    setSelectedCompanions([]);
  };

  const handleCompanionToggle = (empName) => {
    setSelectedCompanions(prev => 
      prev.includes(empName) 
        ? prev.filter(name => name !== empName)
        : [...prev, empName]
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!selectedVehicleId) {
      if (showToast) showToast('Pilih mobil dinas yang tersedia terlebih dahulu!', 'error');
      return;
    }

    const vehicleObj = vehicles.find(v => v.id === selectedVehicleId) || activeVehicle;
    if (!vehicleObj || vehicleObj.status !== 'Tersedia') {
      if (showToast) showToast('Mobil yang dipilih tidak tersedia saat ini!', 'error');
      return;
    }

    // Move to Validation Step
    setIsConfirming(true);
  };

  const handleFinalSubmit = () => {
    const vehicleObj = vehicles.find(v => v.id === selectedVehicleId) || activeVehicle;
    const ticketCode = `CP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTrip = {
      id: `trip-${Date.now()}`,
      ticketCode,
      borrowerName,
      department: currentDepartment ? currentDepartment.name : selectedDeptId,
      companions: selectedCompanions,
      vehicleId: vehicleObj.id,
      vehicleName: vehicleObj.name,
      plateNumber: vehicleObj.plateNumber,
      date,
      departureTime,
      returnTime,
      destination,
      status: 'Aktif',
      createdAt: new Date().toISOString(),
      submittedBy: `${borrowerName} (Self-Service Karyawan)`,
    };

    onSubmit(newTrip);
    setIsConfirming(false);
    onClose();

    // Reset Form
    setBorrowerName('');
    setSelectedDeptId('');
    setSelectedCompanions([]);
    setDestination('');
  };

  const handleCloseModal = () => {
    setIsConfirming(false);
    onClose();
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleCloseModal}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
    >
      <div 
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: '1.25rem 1.5rem',
            background: isConfirming 
              ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
              : 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '10px', 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              {isConfirming ? <ShieldCheck size={22} color="#ffffff" /> : <Car size={22} color="#ffffff" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                {isConfirming ? 'Validasi Pengajuan Mobil Dinas' : 'Form Pengajuan Perjalanan Dinas'}
              </h3>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleCloseModal}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: STEP 2 (CONFIRMATION VALIDATION) or STEP 1 (FORM) */}
        {isConfirming ? (
          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
            <div 
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <ShieldCheck size={28} style={{ color: '#16a34a', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534' }}>
                  Konfirmasi & Validasi Pengajuan
                </div>
                <div style={{ fontSize: '0.775rem', color: '#15803d' }}>
                  Mohon periksa rincian data di bawah ini sebelum mengirimkan pengajuan dinas.
                </div>
              </div>
            </div>

            {/* Validation Details Card */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
                backgroundColor: '#f8fafc',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Penanggung Jawab
                </label>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {borrowerName}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Unit / Departemen
                </label>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {currentDepartment ? currentDepartment.name : selectedDeptId}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Mobil Dinas & Nomor Plat
                </label>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e40af', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {activeVehicle?.name} 
                  <span style={{ fontFamily: 'monospace', backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {activeVehicle?.plateNumber}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Driver Operasional
                </label>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {activeVehicle?.driverName || 'Driver Operasional'}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Tanggal Perjalanan
                </label>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                  {date}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Jam Pergi - Kembali
                </label>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                  {departureTime} - {returnTime} WIB
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #cbd5e1', paddingTop: '0.75rem' }}>
                <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Rekan Pendamping ({selectedCompanions.length} Orang)
                </label>
                <div style={{ fontSize: '0.875rem', color: '#334155', marginTop: '2px', fontWeight: 500 }}>
                  {selectedCompanions.length > 0 ? selectedCompanions.join(', ') : 'Tanpa Rekan Pendamping'}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #cbd5e1', paddingTop: '0.75rem' }}>
                <label style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Keperluan / Tujuan Dinas
                </label>
                <div style={{ fontSize: '0.875rem', color: '#334155', marginTop: '2px', fontWeight: 500 }}>
                  {destination}
                </div>
              </div>
            </div>

            {/* Action Buttons for Validation Step */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <Edit3 size={16} /> Edit Data
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                style={{
                  flex: 2,
                  padding: '0.75rem',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                }}
              >
                <CheckCircle2 size={18} /> Ya, Konfirmasi & Kirim
              </button>
            </div>
          </div>
        ) : (
          /* Modal Form Content */
          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Nama Pengisi */}
              <div className="form-group">
                <label className="form-label">
                  <User size={16} /> Nama Pengisi / Penanggung Jawab
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Masukkan nama lengkap Anda"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  required
                />
              </div>

              {/* Kendaraan Dinas Terpilih (LOCKED) */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    <Car size={16} /> Kendaraan Dinas Terpilih
                  </label>
                </div>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#1e293b'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span 
                      style={{ 
                        backgroundColor: '#1e40af', 
                        color: '#ffffff', 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '0.05em' 
                      }}
                    >
                      {activeVehicle?.plateNumber || 'Plat N/A'}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      {activeVehicle?.name || 'Mobil Dinas'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tanggal & Jam Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
                <DatePicker
                  value={date}
                  onChange={setDate}
                  label="Tanggal Dinas"
                  required
                />

                <TimePicker
                  value={departureTime}
                  onChange={setDepartureTime}
                  label="Jam Pergi"
                  required
                />

                <TimePicker
                  value={returnTime}
                  onChange={setReturnTime}
                  label="Est. Jam Kembali"
                  align="right"
                  minTime={departureTime}
                  required
                />
              </div>

              {/* Dropdown Unit / Departemen */}
              <div className="form-group">
                <label className="form-label">
                  <Building2 size={16} /> Unit / Departemen
                </label>
                <select
                  className="form-select"
                  value={selectedDeptId}
                  onChange={handleDepartmentChange}
                  style={{ color: selectedDeptId === "" ? "#6c757d" : "inherit" }}
                  required
                >
                  <option value="" disabled style={{ color: "#6c757d" }}>
                    -- Pilih Unit / Departemen Anda --
                  </option>
                  {BANK_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id} style={{ color: "#000" }}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fitur Dinamis Anggota Unit Checkbox */}
              {currentDepartment && (
                <div className="form-group full-width">
                  <label className="form-label">
                    <Users size={16} /> Checklist Rekan Pendamping Dinas ({currentDepartment.code})
                  </label>
                  <div className="dynamic-checkbox-container" style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div className="checkbox-hint" style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                      Centang rekan kerja unit <strong>{currentDepartment.name}</strong> yang mendampingi:
                    </div>
                    <div className="checkbox-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
                      {currentDepartment.employees.map(emp => {
                        const isChecked = selectedCompanions.includes(emp.name);
                        const isBorrower = borrowerName.toLowerCase().trim() === emp.name.toLowerCase().trim();
                        return (
                          <label 
                            key={emp.id} 
                            className={`checkbox-label ${isChecked ? 'checked' : ''}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '6px',
                              border: isChecked ? '1px solid #2563eb' : '1px solid #cbd5e1',
                              backgroundColor: isChecked ? '#eff6ff' : '#ffffff',
                              cursor: isBorrower ? 'not-allowed' : 'pointer',
                              opacity: isBorrower ? 0.6 : 1,
                              fontSize: '0.8rem'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isBorrower}
                              onChange={() => handleCompanionToggle(emp.name)}
                            />
                            <div>
                              <div style={{ fontWeight: 600 }}>{emp.name} {isBorrower && <span style={{ fontSize: '0.7rem', color: '#2563eb' }}>(Anda)</span>}</div>
                              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{emp.position}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Keterangan / Tujuan Dinas */}
              <div className="form-group full-width">
                <label className="form-label">
                  <MapPin size={16} /> Keterangan / Tujuan Dinas
                </label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Jelaskan keperluan dinas kantor (contoh: Rapat Kunjungan Nasabah Commercial Banking, Penanganan Core Banking)..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>

                <button 
                  type="submit" 
                  className="submit-btn" 
                  style={{ 
                    flex: 2, 
                    padding: '0.75rem',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Send size={18} /> Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
