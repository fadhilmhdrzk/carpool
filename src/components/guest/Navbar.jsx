import { useState, useEffect } from 'react';
import { 
  Car, 
  Clock, 
  Building2, 
  Lock, 
  UserCheck 
} from 'lucide-react';

export default function Navbar({ currentPage, onNavigateTo }) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Brand & Logo */}
      <div 
        className="brand-section" 
        style={{ cursor: 'pointer' }} 
        onClick={() => onNavigateTo('guest')}
      >
        <div className="brand-logo-wrapper">
          <Car size={24} />
        </div>
        <div>
          <div className="brand-title">BANK POOLMANAGER</div>
          <div className="brand-subtitle">Sistem Carpool Mobil Dinas Bank</div>
        </div>
      </div>

      {/* Real-time Clock Header */}
      <div className="navbar-center-info">
        <div className="nav-time-item">
          <Building2 size={16} className="text-blue-400" />
          <span>Kantor Bank BJB Sukajadi</span>
        </div>
        <div style={{ opacity: 0.3 }}>|</div>
        <div className="nav-time-item">
          <Clock size={16} className="text-emerald-400" />
          <span>{dateStr} • <strong>{timeStr} WIB</strong></span>
        </div>
      </div>

      {/* Right Action Section */}
      <div className="role-switcher-container">
        {currentPage === 'login' ? (
          <button
            onClick={() => onNavigateTo('guest')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              cursor: 'pointer'
            }}
          >
            <UserCheck size={15} />
            <span>Kembali ke Mode Guest</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigateTo('login')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.825rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Lock size={14} />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
