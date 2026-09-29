import { useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, Mail, LogIn, Car, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Login({ onLoginSuccess, onBackToGuest, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email dan Password wajib diisi!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Step 1: Login ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Tangani error autentikasi spesifik
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email atau Password salah! Silakan coba lagi.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Email belum dikonfirmasi. Silakan cek inbox email Anda.');
        } else {
          setError(`Gagal login: ${authError.message}`);
        }
        setIsLoading(false);
        return;
      }

      // Step 2: Cek apakah user terdaftar di tabel 'users' database
      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('email', authData.user.email)
        .single();

      if (dbError || !userData) {
        // User berhasil login Auth tapi TIDAK ada di tabel users → akses ditolak
        await supabase.auth.signOut();
        setError('Akses ditolak. Akun Anda tidak terdaftar sebagai Admin.');
        setIsLoading(false);
        return;
      }

      // Step 3: Login berhasil & user terdaftar di database
      showToast(`Login berhasil! Selamat datang, ${userData.email}`, 'success');
      onLoginSuccess();

    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
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
                  placeholder="bjbcarpool@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  autoFocus
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Memproses Login...
                </>
              ) : (
                <>
                  <LogIn size={18} /> Login Ke Dashboard Admin
                </>
              )}
            </button>
          </form>

          <button
            onClick={onBackToGuest}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.65rem',
              background: 'transparent',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#475569',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            <ArrowLeft size={16} /> Kembali ke Beranda Guest
          </button>
        </div>
      </div>
    </div>
  );
}
