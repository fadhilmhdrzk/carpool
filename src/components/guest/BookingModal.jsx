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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('08:00');
  const [returnTime, setReturnTime] = useState('17:00');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedCompanions, setSelectedCompanions] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [destination, setDestination] = useState('');

  // Validation step state
  const [isConfirming, setIsConfirming] = useState(false);

  // Flatten all employees across departments for autocomplete search
  const allEmployees = BANK_DEPARTMENTS.flatMap(dept => 
    dept.employees.map(emp => ({
      ...emp,
      deptId: dept.id,
      deptName: dept.name,
      deptCode: dept.code
    }))
  );

  const matchingEmployees = borrowerName.trim().length > 0
    ? allEmployees.filter(emp => 
        emp.name.toLowerCase().includes(borrowerName.toLowerCase().trim()) ||
        emp.position.toLowerCase().includes(borrowerName.toLowerCase().trim())
      )
    : [];

  const handleSelectEmployee = (emp) => {
    setBorrowerName(emp.name);
    setSelectedDeptId(emp.deptId);
    setSelectedCompanions([]);
    setShowSuggestions(false);
  };

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

    const vehicleObj = vehicles.find(v => String(v.id) === String(selectedVehicleId)) || activeVehicle;
    if (!vehicleObj || vehicleObj.status === 'Perawatan') {
      if (showToast) showToast('Mobil yang dipilih sedang dalam perawatan!', 'error');
      return;
    }

    // Move to Validation Step
    setIsConfirming(true);
  };

  const handleFinalSubmit = () => {
    const vehicleObj = vehicles.find(v => String(v.id) === String(selectedVehicleId)) || activeVehicle;
    const ticketCode = `CP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTrip = {
      id: `trip-${Date.now()}`,
      borrowerName,
      department: currentDepartment ? currentDepartment.name : selectedDeptId,
      companions: selectedCompanions,
      vehicleId: vehicleObj.id,
      vehicleName: vehicleObj.name,
      plateNumber: vehicleObj.plateNumber || '',
      driverName: vehicleObj.driverName || 'Driver Operasional',
      date,
      departureTime,
      returnTime,
      destination,
      status: 'Aktif',
      createdAt: new Date().toISOString(),
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
                  Mobil Dinas
                </label>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e40af', marginTop: '2px' }}>
                  {activeVehicle?.name} 
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
              
              {/* Nama Pengisi / Pegawai (Dengan Autocomplete Rekomendasi Nama) */}
              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">
                  <User size={16} /> Nama User / Pegawai
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ketik nama pegawai (contoh: Aulia, Fahmi, Doni...)"
                    value={borrowerName}
                    onChange={(e) => {
                      setBorrowerName(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    required
                  />

                  {/* Dropdown Rekomendasi Nama Pegawai */}
                  {showSuggestions && matchingEmployees.length > 0 && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        border: '1.5px solid #2563eb',
                        boxShadow: '0 12px 28px -5px rgba(37, 99, 235, 0.25)',
                        zIndex: 100,
                        maxHeight: '230px',
                        overflowY: 'auto',
                        marginTop: '4px'
                      }}
                    >
                      <div style={{ padding: '6px 12px', fontSize: '0.7rem', color: '#1e40af', fontWeight: 800, backgroundColor: '#eff6ff', borderBottom: '1px solid #dbeafe', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        🔍 Rekomendasi Nama Pegawai Resmi ({matchingEmployees.length} Ditemukan)
                      </div>
                      {matchingEmployees.slice(0, 8).map((emp) => (
                        <div
                          key={emp.id}
                          onMouseDown={() => handleSelectEmployee(emp)}
                          style={{
                            padding: '0.65rem 0.95rem',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f1f5f9',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                              {emp.name}
                            </div>
                          </div>
                          <span 
                            style={{ 
                              fontSize: '0.7rem', 
                              backgroundColor: '#dbeafe', 
                              color: '#1e40af', 
                              padding: '2px 8px', 
                              borderRadius: '4px', 
                              fontWeight: 700,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {emp.deptCode}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.35rem', fontWeight: 500 }}>
                  💡 <em>Ketik nama pegawai Anda untuk menampilkan pilihan nama lengkap resmi secara otomatis.</em>
                </div>
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
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e40af' }}>
                      {activeVehicle?.name || 'Mobil Dinas'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tanggal & Jam Row */}
              <div className="form-datetime-grid">
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
