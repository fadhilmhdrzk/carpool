import { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function AdminSidebar({ 
  currentPage, 
  onNavigateTo, 
  onAdminLogout,
  vehicleCount = 12,
  tripCount = 0
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigateTo(page);
    setIsMobileOpen(false);
  };

  const handleLogoutClick = () => {
    setIsMobileOpen(false);
    onAdminLogout();
  };

  return (
    <>
      {/* Mobile Top Header Bar with Hamburger Toggle (Only visible on mobile) */}
      <div className="mobile-admin-header">
        <div className="mobile-admin-brand">
          <h1 className="admin-brand-title">Admin Panel</h1>
          <div className="admin-brand-subtitle">CARPOOL ADMIN</div>
        </div>
        <button 
          className="mobile-hamburger-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Overlay Backdrop when mobile drawer is open */}
      {isMobileOpen && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Component (Fixed on desktop, Slide-out drawer on mobile) */}
      <aside className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header Brand */}
        <div className="admin-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 className="admin-brand-title">Admin Panel</h1>
              <div className="admin-brand-subtitle">CARPOOL ADMIN</div>
            </div>
            {/* Close button inside sidebar drawer for mobile */}
            <button 
              className="mobile-drawer-close-btn"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Menu List */}
        <nav className="admin-sidebar-nav">
          {/* Menu Item 1: DASHBOARD */}
          <button
            className={`sidebar-nav-item ${currentPage === 'admin-dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin-dashboard')}
          >
            <div className="sidebar-nav-left">
              <LayoutDashboard size={20} />
              <span>DASHBOARD</span>
            </div>
          </button>

          {/* Menu Item 2: STATUS MOBIL */}
          <button
            className={`sidebar-nav-item ${currentPage === 'admin-vehicles' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin-vehicles')}
          >
            <div className="sidebar-nav-left">
              <Car size={20} />
              <span>STATUS MOBIL</span>
            </div>
            {vehicleCount > 0 && (
              <span className="sidebar-badge">{vehicleCount}</span>
            )}
          </button>

          {/* Menu Item 3: RIWAYAT PERJALANAN */}
          <button
            className={`sidebar-nav-item ${currentPage === 'admin-history' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin-history')}
          >
            <div className="sidebar-nav-left">
              <FileText size={20} />
              <span>RIWAYAT PERJALANAN</span>
            </div>
            {tripCount > 0 && (
              <span className="sidebar-badge alt">{tripCount}</span>
            )}
          </button>
        </nav>

        {/* Footer / Logout Button */}
        <div className="admin-sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogoutClick}>
            <LogOut size={18} />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>
    </>
  );
}
