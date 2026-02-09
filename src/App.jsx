import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Articulos from './pages/Articulos';
import Movimientos from './pages/Movimientos';

function AppContent() {
  const location = useLocation();
  
  // Páginas del admin que no deben mostrar Header y Footer
  const adminPages = ['/dashboard', '/articulos', '/movimientos', '/stock', '/reportes', '/usuarios', '/configuracion'];
  const isAdminPage = adminPages.some(page => location.pathname.startsWith(page));

  return (
    <div className="app">
      {!isAdminPage && <Header />}
      <main>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas del Admin (requieren autenticación) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/movimientos" element={<Movimientos />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;