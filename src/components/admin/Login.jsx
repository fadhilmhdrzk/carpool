import { useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, Mail, LogIn, Car } from 'lucide-react';

export default function Login({ onLoginSuccess, onBackToGuest, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email dan Password wajib diisi!');
      return;
    }

    // Login validation (accepts admin@bank.co.id or any valid input)
    setError('');
    onLoginSuccess();
  };

  return (
    <div className="login-page-container">
      <div className="login-card shadow-2xl">
        {/* Header Logo & Title */}
        <div className="login-card-header">
          <div className="login-logo-box">
            <Car size={32} />
          </div>
          <div>
            <div className="login-brand-title">BANK POOLMANAGER</div>
            <div className="login-brand-subtitle">Portal Login Admin Armada</div>
          </div>
        </div>

        {/* Card Body */}
        <div className="login-card-body">
          <div className="login-badge">
            <ShieldCheck size={16} /> AUTENTIKASI ADMIN
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            Masuk ke Akun Admin
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Masukkan Email dan Password Anda untuk mengakses halaman pengelolaan armada mobil dinas.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Field Email */}
            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>
                Email Admin
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ 
                    paddingLeft: '2.5rem', 
                    fontSize: '0.95rem',
                    borderColor: error ? '#f87171' : '#cbd5e1' 
                  }}
                  placeholder="admin@bank.co.id"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  autoFocus
                  required
                />
                <Mail size={18} className="text-slate-400" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Field Password */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ 
                    paddingLeft: '2.5rem', 
                    fontSize: '0.95rem',
                    borderColor: error ? '#f87171' : '#cbd5e1' 
                  }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                />
                <Lock size={18} className="text-slate-400" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {error && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '1rem' }}
            >
              <LogIn size={18} /> Login Ke Dashboard Admin
            </button>
          </form>

          <button
            onClick={onBackToGuest}
            style={{
              width: '100%',
              padding: '0.65rem',
              background: 'transparent',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} /> Kembali ke Beranda Guest
          </button>
        </div>
      </div>
    </div>
  );
}
