import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Gestiona tu Inventario con Eficiencia</h1>
            <p className="hero-subtitle">
              Sistema completo para el control de stock, artículos y movimientos de tu negocio
            </p>
            <div className="hero-buttons">
              <a href="/register" className="btn btn-primary">
                <span className="material-icons">person_add</span>
                Comenzar Ahora
              </a>
              <a href="/login" className="btn btn-secondary">
                <span className="material-icons">login</span>
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Características Principales</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span className="material-icons">inventory</span>
              </div>
              <h3>Gestión de Artículos</h3>
              <p>Administra todos tus productos de manera organizada y eficiente.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span className="material-icons">warehouse</span>
              </div>
              <h3>Control de Stock</h3>
              <p>Monitorea en tiempo real las existencias de tu inventario.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span className="material-icons">sync_alt</span>
              </div>
              <h3>Registro de Movimientos</h3>
              <p>Lleva un control detallado de entradas y salidas de productos.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span className="material-icons">group</span>
              </div>
              <h3>Gestión de Usuarios</h3>
              <p>Control de acceso y permisos para tu equipo de trabajo.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span className="material-icons">analytics</span>
              </div>
              <h3>Reportes Detallados</h3>
              <p>Genera informes y estadísticas de tu inventario.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span className="material-icons">security</span>
              </div>
              <h3>Seguro y Confiable</h3>
              <p>Tus datos protegidos con la mejor seguridad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="material-icons">check_circle</span>
              <div>
                <h4>Fácil de usar</h4>
                <p>Interfaz intuitiva y amigable para todos</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <span className="material-icons">speed</span>
              <div>
                <h4>Rápido y eficiente</h4>
                <p>Optimiza tus procesos de inventario</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <span className="material-icons">support_agent</span>
              <div>
                <h4>Soporte 24/7</h4>
                <p>Estamos aquí para ayudarte siempre</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <span className="material-icons">cloud_done</span>
              <div>
                <h4>En la nube</h4>
                <p>Accede desde cualquier lugar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para optimizar tu inventario?</h2>
            <p>Únete a cientos de negocios que ya confían en nosotros</p>
            <a href="/register" className="btn btn-primary btn-large">
              <span className="material-icons">rocket_launch</span>
              Crear Cuenta Gratis
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;