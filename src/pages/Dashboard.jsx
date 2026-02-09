import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../../server/config/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    // Verificar si hay usuario autenticado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    // Cerrar dropdown al hacer click fuera
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

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
            <span className="material-icons">{sidebarCollapsed ? 'menu' : 'close'}</span>
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
                <span className="material-icons icon">warehouse</span>
                {!sidebarCollapsed && <span>Stock</span>}
              </Link>
            </li>
            <li className={isActive('/movimientos') ? 'active' : ''}>
              <Link to="/movimientos">
                <span className="material-icons icon">swap_horiz</span>
                {!sidebarCollapsed && <span>Movimientos</span>}
              </Link>
            </li>
            <li className={isActive('/reportes') ? 'active' : ''}>
              <Link to="/reportes">
                <span className="material-icons icon">bar_chart</span>
                {!sidebarCollapsed && <span>Reportes</span>}
              </Link>
            </li>
            <li className={isActive('/usuarios') ? 'active' : ''}>
              <Link to="/usuarios">
                <span className="material-icons icon">people</span>
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
            <h1 className="page-title">Dashboard Overview</h1>
          </div>
          <div className="navbar-right">
            <div className="search-box">
              <input type="text" placeholder="Buscar..." />
              <span className="material-icons search-icon">search</span>
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
                    <a href="#" onClick={() => setDropdownOpen(false)}>
                      <span className="material-icons">account_circle</span>
                      Mi Perfil
                    </a>
                    <a href="#" onClick={() => setDropdownOpen(false)}>
                      <span className="material-icons">settings</span>
                      Configuración
                    </a>
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

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-row">
            <div className="stat-card blue">
              <div className="stat-header">
                <h3>Total Artículos</h3>
                <span className="material-icons stat-icon">inventory</span>
              </div>
              <div className="stat-body">
                <h2 className="stat-number">2,390</h2>
                <div className="stat-footer">
                  <span className="stat-change positive">
                    <span className="material-icons">trending_up</span>
                    12.5%
                  </span>
                  <span className="stat-period">vs último mes</span>
                </div>
              </div>
              <div className="stat-chart">
                <svg viewBox="0 0 100 30" className="mini-chart">
                  <polyline points="0,25 20,20 40,22 60,15 80,18 100,10" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-header">
                <h3>Stock Total</h3>
                <span className="material-icons stat-icon">warehouse</span>
              </div>
              <div className="stat-body">
                <h2 className="stat-number">8,147</h2>
                <div className="stat-footer">
                  <span className="stat-change positive">
                    <span className="material-icons">trending_up</span>
                    8.3%
                  </span>
                  <span className="stat-period">vs último mes</span>
                </div>
              </div>
              <div className="stat-chart">
                <svg viewBox="0 0 100 30" className="mini-chart">
                  <polyline points="0,20 20,18 40,22 60,19 80,15 100,12" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-header">
                <h3>Movimientos Hoy</h3>
                <span className="material-icons stat-icon">swap_horiz</span>
              </div>
              <div className="stat-body">
                <h2 className="stat-number">182</h2>
                <div className="stat-footer">
                  <span className="stat-change negative">
                    <span className="material-icons">trending_down</span>
                    4.2%
                  </span>
                  <span className="stat-period">vs ayer</span>
                </div>
              </div>
              <div className="stat-chart">
                <svg viewBox="0 0 100 30" className="mini-chart">
                  <polyline points="0,15 20,18 40,16 60,20 80,17 100,22" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <div className="stat-card red">
              <div className="stat-header">
                <h3>Stock Bajo</h3>
                <span className="material-icons stat-icon">warning</span>
              </div>
              <div className="stat-body">
                <h2 className="stat-number">29</h2>
                <div className="stat-footer">
                  <span className="stat-change positive">
                    <span className="material-icons">trending_down</span>
                    2.1%
                  </span>
                  <span className="stat-period">vs semana pasada</span>
                </div>
              </div>
              <div className="stat-chart">
                <svg viewBox="0 0 100 30" className="mini-chart">
                  <polyline points="0,18 20,20 40,17 60,19 80,16 100,15" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            <div className="chart-card large">
              <div className="card-header">
                <h3>Movimientos del Mes</h3>
                <div className="card-actions">
                  <button className="btn-filter active">Mes Actual</button>
                  <button className="btn-filter">Mes Anterior</button>
                </div>
              </div>
              <div className="card-body">
                <div className="chart-placeholder">
                  <svg viewBox="0 0 600 300" className="line-chart">
                    {/* Grid lines */}
                    <line x1="50" y1="50" x2="550" y2="50" stroke="#e0e0e0" strokeWidth="1"/>
                    <line x1="50" y1="100" x2="550" y2="100" stroke="#e0e0e0" strokeWidth="1"/>
                    <line x1="50" y1="150" x2="550" y2="150" stroke="#e0e0e0" strokeWidth="1"/>
                    <line x1="50" y1="200" x2="550" y2="200" stroke="#e0e0e0" strokeWidth="1"/>
                    <line x1="50" y1="250" x2="550" y2="250" stroke="#e0e0e0" strokeWidth="1"/>
                    
                    {/* Chart line */}
                    <polyline 
                      points="50,200 100,180 150,190 200,150 250,170 300,140 350,160 400,130 450,150 500,120 550,140" 
                      fill="none" 
                      stroke="#468189" 
                      strokeWidth="3"
                    />
                    
                    {/* Area fill */}
                    <polygon 
                      points="50,200 100,180 150,190 200,150 250,170 300,140 350,160 400,130 450,150 500,120 550,140 550,250 50,250" 
                      fill="url(#gradient)"
                      opacity="0.3"
                    />
                    
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#468189" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#468189" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: '#468189'}}></span>
                    <span>Entradas</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: '#77ACA2'}}></span>
                    <span>Salidas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card small">
              <div className="card-header">
                <h3>Artículos por Categoría</h3>
              </div>
              <div className="card-body">
                <div className="pie-chart-placeholder">
                  <svg viewBox="0 0 200 200" className="pie-chart">
                    <circle cx="100" cy="100" r="80" fill="#468189" />
                    <circle cx="100" cy="100" r="80" fill="#77ACA2" 
                      strokeDasharray="251 251" 
                      strokeDashoffset="125" 
                      transform="rotate(-90 100 100)"
                      style={{stroke: '#77ACA2', strokeWidth: 80, fill: 'none'}}
                    />
                    <circle cx="100" cy="100" r="80" fill="#9DBEBB" 
                      strokeDasharray="251 251" 
                      strokeDashoffset="188" 
                      transform="rotate(-90 100 100)"
                      style={{stroke: '#9DBEBB', strokeWidth: 80, fill: 'none'}}
                    />
                  </svg>
                </div>
                <div className="pie-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: '#468189'}}></span>
                    <span>Tecnología (45%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: '#77ACA2'}}></span>
                    <span>Oficina (30%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: '#9DBEBB'}}></span>
                    <span>Otros (25%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="tables-row">
            <div className="table-card">
              <div className="card-header">
                <h3>Artículos Recientes</h3>
                <a href="#" className="view-all">
                  Ver todos
                  <span className="material-icons">arrow_forward</span>
                </a>
              </div>
              <div className="card-body">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Stock</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#ART001</td>
                      <td>Laptop Dell XPS 15</td>
                      <td>Tecnología</td>
                      <td>10</td>
                      <td><span className="badge success">Disponible</span></td>
                    </tr>
                    <tr>
                      <td>#ART002</td>
                      <td>Mouse Logitech MX</td>
                      <td>Tecnología</td>
                      <td>25</td>
                      <td><span className="badge success">Disponible</span></td>
                    </tr>
                    <tr>
                      <td>#ART003</td>
                      <td>Teclado Mecánico RGB</td>
                      <td>Tecnología</td>
                      <td>5</td>
                      <td><span className="badge warning">Stock Bajo</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="table-card">
              <div className="card-header">
                <h3>Actividad Reciente</h3>
                <a href="#" className="view-all">
                  Ver todos
                  <span className="material-icons">arrow_forward</span>
                </a>
              </div>
              <div className="card-body">
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon green">
                      <span className="material-icons">add</span>
                    </div>
                    <div className="activity-content">
                      <p><strong>Entrada de stock</strong></p>
                      <span>20 unidades de Laptop Dell XPS 15</span>
                      <span className="time">Hace 2 horas</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon red">
                      <span className="material-icons">remove</span>
                    </div>
                    <div className="activity-content">
                      <p><strong>Salida de stock</strong></p>
                      <span>5 unidades de Mouse Logitech</span>
                      <span className="time">Hace 4 horas</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon blue">
                      <span className="material-icons">edit</span>
                    </div>
                    <div className="activity-content">
                      <p><strong>Nuevo artículo</strong></p>
                      <span>Teclado Mecánico RGB agregado</span>
                      <span className="time">Hace 6 horas</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon orange">
                      <span className="material-icons">warning</span>
                    </div>
                    <div className="activity-content">
                      <p><strong>Alerta de stock</strong></p>
                      <span>Teclado Mecánico RGB bajo mínimo</span>
                      <span className="time">Hace 8 horas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;