import { useState, useEffect } from 'react';
import Navbar from './components/guest/Navbar';
import Sidebar from './components/admin/Sidebar';
import Home from './components/guest/Home';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import Status from './components/admin/Status';
import History from './components/admin/History';
import Toast from './components/Toast';
import Loading from './components/Loading';

import { 
  getStoredVehicles, 
  saveStoredVehicles, 
  getStoredTrips, 
  saveStoredTrips, 
  getAdminAuthSession, 
  setAdminAuthSession,
  resetAllDataToDefault 
} from './utils/storage';

import './App.css';

// Helper URL Path Mappers
const pathToPage = (path) => {
  const cleanPath = (path || '/').toLowerCase().replace(/\/$/, '') || '/';
  if (cleanPath === '/login') return 'login';
  if (cleanPath === '/admin/dashboard') return 'admin-dashboard';
  if (cleanPath === '/admin/status-mobil' || cleanPath === '/admin/vehicles') return 'admin-vehicles';
  if (cleanPath === '/admin/riwayat' || cleanPath === '/admin/history') return 'admin-history';
  return 'guest';
};

const pageToPath = (page) => {
  switch (page) {
    case 'login': return '/login';
    case 'admin-dashboard': return '/admin/dashboard';
    case 'admin-vehicles': return '/admin/status-mobil';
    case 'admin-history': return '/admin/riwayat';
    default: return '/';
  }
};

export default function App() {
  // Initialize page state from current window location URL pathname
  const [currentPage, setCurrentPage] = useState(() => pathToPage(window.location.pathname));
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);

  const [toasts, setToasts] = useState([]);

  // Sync state with URL pathname & browser history on mount and popstate (Back/Forward)
  useEffect(() => {
    setIsPageLoading(true);
    setVehicles(getStoredVehicles());
    setTrips(getStoredTrips());
    const isAuth = getAdminAuthSession();
    setIsAdminAuthenticated(isAuth);

    const initialPage = pathToPage(window.location.pathname);
    if (initialPage.startsWith('admin') && !isAuth) {
      setCurrentPage('login');
      window.history.replaceState({}, '', '/login');
    } else {
      setCurrentPage(initialPage);
    }

    const initTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);

    const handlePopState = () => {
      setIsPageLoading(true);
      const page = pathToPage(window.location.pathname);
      const authenticated = getAdminAuthSession();
      setTimeout(() => {
        if (page.startsWith('admin') && !authenticated) {
          setCurrentPage('login');
          window.history.replaceState({}, '', '/login');
        } else {
          setCurrentPage(page);
        }
        setIsPageLoading(false);
      }, 250);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Centralized Navigation Handler that updates state & URL with loading transition
  const handleNavigateTo = (targetPage) => {
    if (targetPage === currentPage) return;
    setIsPageLoading(true);
    setTimeout(() => {
      if (targetPage.startsWith('admin') && !isAdminAuthenticated) {
        setCurrentPage('login');
        window.history.pushState({}, '', '/login');
      } else {
        setCurrentPage(targetPage);
        const newPath = pageToPath(targetPage);
        if (window.location.pathname !== newPath) {
          window.history.pushState({}, '', newPath);
        }
      }
      setIsPageLoading(false);
    }, 300);
  };

  // Show toast feedback message
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Admin Login Success Handler
  const handleAdminLoginSuccess = () => {
    setIsPageLoading(true);
    setTimeout(() => {
      setIsAdminAuthenticated(true);
      setAdminAuthSession(true);
      setCurrentPage('admin-dashboard');
      window.history.pushState({}, '', '/admin/dashboard');
      showToast('Login Admin berhasil! Selamat datang di Dashboard.', 'success');
      setIsPageLoading(false);
    }, 300);
  };

  // Admin Logout Handler
  const handleAdminLogout = () => {
    setIsPageLoading(true);
    setTimeout(() => {
      setIsAdminAuthenticated(false);
      setAdminAuthSession(false);
      setCurrentPage('guest');
      window.history.pushState({}, '', '/');
      showToast('Sesi Admin berakhir. Kembali ke Mode Karyawan.', 'info');
      setIsPageLoading(false);
    }, 300);
  };

  // Reset Data to Default
  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh data armada & riwayat perjalanan ke kondisi awal?')) {
      const reset = resetAllDataToDefault();
      setVehicles(reset.vehicles);
      setTrips(reset.trips);
      showToast('Seluruh data berhasil direset ke default!', 'success');
    }
  };

  // Create new Trip / Booking (Used by both Admin & Guest)
  const handleAddTrip = (newTrip) => {
    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    saveStoredTrips(updatedTrips);

    const updatedVehicles = vehicles.map(v => {
      if (v.id === newTrip.vehicleId) {
        return {
          ...v,
          status: 'Terpakai',
          currentBorrower: newTrip.borrowerName,
          currentDepartment: newTrip.department,
          currentReturnTime: newTrip.returnTime,
        };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    saveStoredVehicles(updatedVehicles);
    showToast(`Pengajuan ${newTrip.vehicleName} atas nama ${newTrip.borrowerName} berhasil dikirim!`, 'success');
  };

  // Admin: Update vehicle status manually
  const handleUpdateVehicleStatus = (vehicleId, newStatus) => {
    const updatedVehicles = vehicles.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          status: newStatus,
          currentBorrower: newStatus === 'Tersedia' ? null : v.currentBorrower,
          currentDepartment: newStatus === 'Tersedia' ? null : v.currentDepartment,
          currentReturnTime: newStatus === 'Tersedia' ? null : v.currentReturnTime,
        };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    saveStoredVehicles(updatedVehicles);
  };

  // Admin: Finish active trip for vehicle
  const handleFinishTrip = (tripId, vehicleId) => {
    const updatedTrips = trips.map(t => {
      if ((tripId && t.id === tripId) || (vehicleId && t.vehicleId === vehicleId && t.status === 'Aktif')) {
        return { ...t, status: 'Selesai' };
      }
      return t;
    });
    setTrips(updatedTrips);
    saveStoredTrips(updatedTrips);

    const updatedVehicles = vehicles.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          status: 'Tersedia',
          currentBorrower: null,
          currentDepartment: null,
          currentReturnTime: null,
        };
      }
      return v;
    });
    setVehicles(updatedVehicles);
    saveStoredVehicles(updatedVehicles);
  };

  const isAdminView = currentPage.startsWith('admin') && isAdminAuthenticated;

  return (
    <div className="app-root">
      {isAdminView ? (
        /* ADMIN MODE LAYOUT (WITH SIDEBAR) */
        <div className="admin-layout-wrapper">
          {/* Left Vertical Sidebar */}
          <Sidebar
            currentPage={currentPage}
            onNavigateTo={handleNavigateTo}
            onAdminLogout={handleAdminLogout}
            vehicleCount={vehicles.length}
            tripCount={trips.filter(t => t.status === 'Selesai').length}
          />

          {/* Right Main Content Area */}
          <div className="admin-main-content">
            {/* Top Admin Header Bar */}
            <header className="admin-top-header">
              <div className="admin-header-title">
                {currentPage === 'admin-dashboard' && 'DASHBOARD'}
                {currentPage === 'admin-vehicles' && 'TABEL STATUS MOBIL'}
                {currentPage === 'admin-history' && 'RIWAYAT PERJALANAN'}
              </div>
            </header>

            {/* Admin Active Page Body */}
            <main className="admin-body-container">
              {currentPage === 'admin-dashboard' && (
                <Dashboard
                  vehicles={vehicles}
                  trips={trips}
                  onAddTrip={handleAddTrip}
                  onNavigateTo={handleNavigateTo}
                  showToast={showToast}
                />
              )}
              {currentPage === 'admin-vehicles' && (
                <Status
                  vehicles={vehicles}
                  trips={trips}
                  onUpdateVehicleStatus={handleUpdateVehicleStatus}
                  onFinishTrip={handleFinishTrip}
                  showToast={showToast}
                />
              )}
              {currentPage === 'admin-history' && (
                <History
                  trips={trips}
                  showToast={showToast}
                />
              )}
            </main>
          </div>
        </div>
      ) : (
        /* GUEST / LOGIN MODE LAYOUT */
        <div className="app-container">
          <Navbar
            currentPage={currentPage}
            onNavigateTo={handleNavigateTo}
          />

          <main className="content-wrapper">
            {currentPage === 'login' ? (
              <Login
                onLoginSuccess={handleAdminLoginSuccess}
                onBackToGuest={() => handleNavigateTo('guest')}
                showToast={showToast}
              />
            ) : (
              <Home
                vehicles={vehicles}
                onSubmitRequest={handleAddTrip}
                showToast={showToast}
              />
            )}
          </main>

          {/* Footer Korporat */}
          <footer style={{
            background: '#0f172a',
            color: '#64748b',
            padding: '1.25rem 2rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            © 2026 Bank Central Operations • Sistem Management Carpool Armada Mobil Dinas. All rights reserved.
          </footer>
        </div>
      )}

      {/* Toast & Loading Screen */}
      <Toast toasts={toasts} />
      <Loading isLoading={isPageLoading} />
    </div>
  );
}
