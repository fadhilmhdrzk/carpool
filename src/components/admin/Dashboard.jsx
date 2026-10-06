import { useState } from 'react';
import { 
  Car, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  User, 
  Building2, 
  Users, 
  PlusCircle, 
  MapPin,
  Send,
  ArrowRight,
  Info
} from 'lucide-react';
import { BANK_DEPARTMENTS } from '../../data/mockData';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';

export default function AdminDashboardPage({ 
  vehicles, 
  trips, 
  onAddTrip, 
  onNavigateTo,
  showToast 
}) {
  // Admin Form State
  const [borrowerName, setBorrowerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('08:30');
  const [returnTime, setReturnTime] = useState('17:00');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedCompanions, setSelectedCompanions] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [destination, setDestination] = useState('');

  // Compute Real-time Statistics
  const totalVehicles = vehicles.length;
  const availableCount = vehicles.filter(v => {
    const activeTrip = trips.find(t => t.vehicleId === v.id && t.status === 'Aktif');
    const effStatus = activeTrip ? 'Terpakai' : v.status;
    return effStatus === 'Tersedia';
  }).length;
  const inUseCount = vehicles.filter(v => {
    const activeTrip = trips.find(t => t.vehicleId === v.id && t.status === 'Aktif');
    const effStatus = activeTrip ? 'Terpakai' : v.status;
    return effStatus === 'Terpakai';
  }).length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Perawatan').length;

  // Selected Department object
  const currentDepartment = BANK_DEPARTMENTS.find(d => d.id === selectedDeptId);

  // Toggle companion checkbox selection
  const handleCompanionToggle = (empName) => {
    setSelectedCompanions(prev => 
      prev.includes(empName) 
        ? prev.filter(name => name !== empName)
        : [...prev, empName]
    );
  };

  // When Department changes, reset checked companions
  const handleDepartmentChange = (e) => {
    setSelectedDeptId(e.target.value);
    setSelectedCompanions([]);
  };

  // Submit Admin Form
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!selectedVehicleId) {
      showToast('Pilih mobil dinas terlebih dahulu!', 'error');
      return;
    }

    const vehicleObj = vehicles.find(v => v.id === selectedVehicleId);
    if (!vehicleObj) return;

    if (vehicleObj.status === 'Perawatan') {
      showToast(`${vehicleObj.name} sedang dalam perbaikan/service!`, 'error');
      return;
    }

    const newTrip = {
      id: `trip-${Date.now()}`,
      borrowerName,
      department: currentDepartment ? currentDepartment.name : selectedDeptId,
      companions: selectedCompanions,
      vehicleId: vehicleObj.id,
      vehicleName: vehicleObj.name,
      driverName: vehicleObj.driverName || 'Driver Operasional',
      date,
      departureTime,
      returnTime,
      destination,
      status: 'Aktif',
      createdAt: new Date().toISOString(),
    };

    onAddTrip(newTrip);
    showToast(`Penugasan ${vehicleObj.name} berhasil dibuat!`, 'success');

    // Reset Form
    setBorrowerName('');
    setSelectedDeptId('');
    setSelectedCompanions([]);
    setSelectedVehicleId('');
    setDestination('');
    if (onNavigateTo) onNavigateTo('admin-history');
  };

  return (
    <div>
      {/* Metric Cards (Real-time Statistics) */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <p>TOTAL MOBIL</p>
            <div className="metric-value">{totalVehicles} Mobil</div>
          </div>
          <div className="metric-icon-box blue">
            <Car size={26} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <p>STATUS TERSEDIA</p>
            <div className="metric-value" style={{ color: '#10b981' }}>{availableCount} Unit</div>
          </div>
          <div className="metric-icon-box emerald">
            <CheckCircle2 size={26} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <p>SEDANG TERPAKAI / DINAS</p>
            <div className="metric-value" style={{ color: '#f59e0b' }}>{inUseCount} Unit</div>
          </div>
          <div className="metric-icon-box amber">
            <Clock size={26} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <p>DALAM PERAWATAN</p>
            <div className="metric-value" style={{ color: '#64748b' }}>{maintenanceCount} Unit</div>
          </div>
          <div className="metric-icon-box slate">
            <Wrench size={26} />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Quick Form + Status Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

        {/* Quick Status Mobil Overview Widget */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <Car size={18} className="text-blue-600" /> Ringkasan Status Mobil Real-Time
            </h3>
            <button 
              onClick={() => onNavigateTo('admin-vehicles')}
              style={{ fontSize: '0.8rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Ke Halaman Tabel Status Mobil <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {vehicles.slice(0, 5).map(v => {
              const activeTrip = trips.find(t => t.vehicleId === v.id && t.status === 'Aktif');
              const effectiveStatus = activeTrip ? 'Terpakai' : v.status;
              const effectiveBorrower = activeTrip ? activeTrip.borrowerName : v.currentBorrower;
              const effectiveDepartment = activeTrip ? activeTrip.department : v.currentDepartment;
              const effectiveReturnTime = activeTrip ? activeTrip.returnTime : v.currentReturnTime;

              return (
                <div 
                  key={v.id} 
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    background: effectiveStatus === 'Terpakai' ? '#fffbeb' : effectiveStatus === 'Tersedia' ? '#f0fdf4' : '#f8fafc',
                    border: `1px solid ${effectiveStatus === 'Terpakai' ? '#fde68a' : effectiveStatus === 'Tersedia' ? '#bbf7d0' : '#e2e8f0'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{v.name}</div>
                    {effectiveStatus === 'Terpakai' && effectiveBorrower && (
                      <div style={{ fontSize: '0.725rem', color: '#d97706', marginTop: '2px', fontWeight: 600 }}>
                        Dipakai: {effectiveBorrower} {effectiveDepartment ? `(${effectiveDepartment})` : ''} - Kembali: {effectiveReturnTime}
                      </div>
                    )}
                  </div>
                  <div>
                    {effectiveStatus === 'Tersedia' && (
                      <span className="status-badge ready" style={{ fontSize: '0.725rem' }}>
                        <CheckCircle2 size={11} /> Tersedia
                      </span>
                    )}
                    {effectiveStatus === 'Terpakai' && (
                      <span className="status-badge in-use" style={{ fontSize: '0.725rem' }}>
                        <Clock size={11} /> Terpakai
                      </span>
                    )}
                    {effectiveStatus === 'Perawatan' && (
                      <span className="status-badge maintenance" style={{ fontSize: '0.725rem' }}>
                        <Wrench size={11} /> Service
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.775rem', color: '#475569', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Info size={16} className="text-blue-500" style={{ flexShrink: 0 }} />
            <span>Buka <strong>Halaman Tabel Status Mobil</strong> untuk mengubah status mobil (Tersedia / Service).</span>
          </div>
        </div>
      </div>
    </div>
  );
}
