import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children, title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="material-icons logo-icon">inventory_2</span>
            {!sidebarCollapsed && <span className="logo-text">Inventario</span>}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <span className="material-icons">
              {sidebarCollapsed ? 'menu' : 'close'}
            </span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={isActive('/dashboard') ? 'active' : ''}>
              <Link to="/dashboard">
                <span className="material-icons icon">dashboard</span>
                {!sidebarCollapsed && <span>Dashboard</span>}
              </Link>
            </li>
            <li className={isActive('/articulos') ? 'active' : ''}>
              <Link to="/articulos">
                <span className="material-icons icon">inventory</span>
                {!sidebarCollapsed && <span>Artículos</span>}
              </Link>
            </li>
            <li className={isActive('/stock') ? 'active' : ''}>
              <Link to="/stock">
                <span className="material-icons icon">assessment</span>
                {!sidebarCollapsed && <span>Stock</span>}
              </Link>
            </li>
            <li className={isActive('/movimientos') ? 'active' : ''}>
              <Link to="/movimientos">
                <span className="material-icons icon">sync_alt</span>
                {!sidebarCollapsed && <span>Movimientos</span>}
              </Link>
            </li>
            <li className={isActive('/reportes') ? 'active' : ''}>
              <Link to="/reportes">
                <span className="material-icons icon">analytics</span>
                {!sidebarCollapsed && <span>Reportes</span>}
              </Link>
            </li>
            <li className={isActive('/usuarios') ? 'active' : ''}>
              <Link to="/usuarios">
                <span className="material-icons icon">group</span>
                {!sidebarCollapsed && <span>Usuarios</span>}
              </Link>
            </li>
          </ul>

          <div className="sidebar-footer">
            <ul>
              <li className={isActive('/configuracion') ? 'active' : ''}>
                <Link to="/configuracion">
                  <span className="material-icons icon">settings</span>
                  {!sidebarCollapsed && <span>Configuración</span>}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="navbar-left">
            <h1 className="page-title">{title}</h1>
          </div>
          <div className="navbar-right">
            <div className="search-box">
              <span className="material-icons search-icon">search</span>
              <input type="text" placeholder="Buscar..." />
            </div>
            <button className="notification-btn">
              <span className="material-icons">notifications</span>
              <span className="badge">3</span>
            </button>
            <div className="user-menu">
              <div className="user-avatar">
                <span>{user?.nombre?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="user-info">
                <span className="user-name">{user?.nombre}</span>
                <span className="user-role">{user?.rol === 'admin' ? 'Administrador' : 'Usuario'}</span>
              </div>
              <div className="dropdown">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                  <span className="material-icons">
                    {dropdownOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/perfil" onClick={() => setDropdownOpen(false)}>
                      <span className="material-icons">person</span>
                      Mi Perfil
                    </Link>
                    <Link to="/configuracion" onClick={() => setDropdownOpen(false)}>
                      <span className="material-icons">settings</span>
                      Configuración
                    </Link>
                    <a href="#" onClick={handleLogout}>
                      <span className="material-icons">logout</span>
                      Cerrar Sesión
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;