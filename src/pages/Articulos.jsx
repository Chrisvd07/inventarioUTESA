import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../../server/config/api';
import './Articulos.css';
import '../pages/Dashboard.css';

const Articulos = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArticulo, setEditingArticulo] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio_compra: '',
    precio_venta: '',
    stock_inicial: '',
    stock_minimo: '',
    stock_maximo: '',
    ubicacion: ''
  });

  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
    try {
      const response = await api.get('/api/articulos');
      setArticulos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      fetchArticulos();
      return;
    }

    try {
      const response = await api.get(`/api/articulos/search?q=${value}`);
      setArticulos(response.data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingArticulo) {
        // Actualizar
        await api.put(`/api/articulos/${editingArticulo.id}`, formData);
      } else {
        // Crear nuevo
        await api.post('/api/articulos', formData);
      }

      setShowModal(false);
      resetForm();
      fetchArticulos();
    } catch (error) {
      console.error('Error al guardar artículo:', error);
      alert(error.response?.data?.message || 'Error al guardar artículo');
    }
  };

  const handleEdit = (articulo) => {
    setEditingArticulo(articulo);
    setFormData({
      codigo: articulo.codigo,
      nombre: articulo.nombre,
      descripcion: articulo.descripcion || '',
      categoria: articulo.categoria,
      precio_compra: articulo.precio_compra,
      precio_venta: articulo.precio_venta,
      stock_minimo: articulo.stock_minimo || '',
      stock_maximo: articulo.stock_maximo || '',
      ubicacion: articulo.ubicacion || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este artículo?')) {
      return;
    }

    try {
      await api.delete(`/api/articulos/${id}`);
      fetchArticulos();
    } catch (error) {
      console.error('Error al eliminar artículo:', error);
      alert('Error al eliminar artículo');
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      precio_compra: '',
      precio_venta: '',
      stock_inicial: '',
      stock_minimo: '',
      stock_maximo: '',
      ubicacion: ''
    });
    setEditingArticulo(null);
  };

  const getStockStatus = (stock, minimo) => {
    if (stock <= 0) return { class: 'sin-stock', text: 'Sin Stock' };
    if (stock <= minimo) return { class: 'stock-bajo', text: 'Stock Bajo' };
    return { class: 'disponible', text: 'Disponible' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando artículos...</p>
      </div>
    );
  }

  return (
    <AdminLayout title="Gestión de Artículos">
      <div className="articulos-page">
        <div className="page-header">
          <div>
            <p style={{fontSize: '16px', color: '#6c757d', margin: 0}}>
              Administra el catálogo de productos del inventario
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <span className="material-icons">add</span>
            Nuevo Artículo
          </button>
        </div>

      <div className="filters-section">
        <div className="search-box-large">
          <span className="material-icons">search</span>
          <input
            type="text"
            placeholder="Buscar por código, nombre o categoría..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="articulos-table-container">
        <table className="articulos-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulos.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  <div className="empty-state">
                    <span className="material-icons">inventory_2</span>
                    <p>No hay artículos registrados</p>
                  </div>
                </td>
              </tr>
            ) : (
              articulos.map((articulo) => {
                const status = getStockStatus(articulo.stock_actual, articulo.stock_minimo);
                return (
                  <tr key={articulo.id}>
                    <td><strong>{articulo.codigo}</strong></td>
                    <td>{articulo.nombre}</td>
                    <td>{articulo.categoria}</td>
                    <td>
                      <span className="stock-badge">{articulo.stock_actual || 0}</span>
                    </td>
                    <td>${parseFloat(articulo.precio_compra || 0).toFixed(2)}</td>
                    <td>${parseFloat(articulo.precio_venta || 0).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${status.class}`}>{status.text}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon" 
                          onClick={() => handleEdit(articulo)}
                          title="Editar"
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button 
                          className="btn-icon btn-danger" 
                          onClick={() => handleDelete(articulo.id)}
                          title="Eliminar"
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false);
          resetForm();
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingArticulo ? 'Editar Artículo' : 'Nuevo Artículo'}</h2>
              <button className="close-btn" onClick={() => {
                setShowModal(false);
                resetForm();
              }}>
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit} id="articuloForm">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Código *</label>
                    <input
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleInputChange}
                      required
                      disabled={editingArticulo}
                    />
                  </div>

                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Categoría *</label>
                    <input
                      type="text"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Ubicación</label>
                    <input
                      type="text"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Precio Compra</label>
                    <input
                      type="number"
                      step="0.01"
                      name="precio_compra"
                      value={formData.precio_compra}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Precio Venta</label>
                    <input
                      type="number"
                      step="0.01"
                      name="precio_venta"
                      value={formData.precio_venta}
                      onChange={handleInputChange}
                    />
                  </div>

                  {!editingArticulo && (
                    <div className="form-group">
                      <label>Stock Inicial</label>
                      <input
                        type="number"
                        name="stock_inicial"
                        value={formData.stock_inicial}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Stock Mínimo</label>
                    <input
                      type="number"
                      name="stock_minimo"
                      value={formData.stock_minimo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Máximo</label>
                    <input
                      type="number"
                      name="stock_maximo"
                      value={formData.stock_maximo}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancelar
              </button>
              <button type="submit" form="articuloForm" className="btn btn-primary">
                {editingArticulo ? 'Actualizar' : 'Crear'} Artículo
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default Articulos;