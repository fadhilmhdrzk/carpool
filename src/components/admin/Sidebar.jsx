import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  LogOut,
  Building2
} from 'lucide-react';

export default function AdminSidebar({ 
  currentPage, 
  onNavigateTo, 
  onAdminLogout,
  vehicleCount = 12,
  tripCount = 0
}) {
  return (
    <aside className="admin-sidebar">
      {/* Sidebar Header Brand */}
      <div className="admin-sidebar-header">
        <h1 className="admin-brand-title">Admin Panel</h1>
        <div className="admin-brand-subtitle">CARPOOL ADMIN</div>
      </div>

      {/* Navigation Menu List */}
      <nav className="admin-sidebar-nav">
        {/* Menu Item 1: DASHBOARD */}
        <button
          className={`sidebar-nav-item ${currentPage === 'admin-dashboard' ? 'active' : ''}`}
          onClick={() => onNavigateTo('admin-dashboard')}
        >
          <div className="sidebar-nav-left">
            <LayoutDashboard size={20} />
            <span>DASHBOARD</span>
          </div>
        </button>

        {/* Menu Item 2: STATUS MOBIL */}
        <button
          className={`sidebar-nav-item ${currentPage === 'admin-vehicles' ? 'active' : ''}`}
          onClick={() => onNavigateTo('admin-vehicles')}
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
          onClick={() => onNavigateTo('admin-history')}
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
        <button className="sidebar-logout-btn" onClick={onAdminLogout}>
          <LogOut size={18} />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}
