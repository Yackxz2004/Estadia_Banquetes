import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiTool, FiX } from 'react-icons/fi';
import { getBodegas, enviarAMantenimiento, reintegrarDeMantenimiento } from '../api/inventory';
import '../styles/Sillas.css';
import api from '../api';

const Sillas = () => {
  const [items, setItems] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [formData, setFormData] = useState({ producto: '', descripcion: '', cantidad: '', bodega: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mantenimientoModal, setMantenimientoModal] = useState({ isOpen: false, item: null, cantidad: 0 });
  const [formModal, setFormModal] = useState({ isOpen: false, title: '' });

  useEffect(() => {
    fetchItems();
    fetchBodegas();
  }, [searchTerm]);

  const fetchItems = async () => {
    try {
      const response = await api.get('/api/inventory/sillas/', { params: { search: searchTerm } });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching sillas items:', error);
    }
  };

  const fetchBodegas = async () => {
    try {
      const response = await getBodegas();
      setBodegas(response.data);
    } catch (error) {
      console.error('Error fetching bodegas:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, bodega: formData.bodega || null };
    try {
      if (isEditing) {
        await api.put(`/api/inventory/sillas/${currentItemId}/`, data);
      } else {
        await api.post('/api/inventory/sillas/', data);
      }
      setFormModal({ isOpen: false, title: '' });
      setFormData({ producto: '', descripcion: '', cantidad: '', bodega: '' });
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Ocurrió un error al guardar. Por favor, inténtalo de nuevo.');
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItemId(item.id);
    setFormData({ producto: item.producto, descripcion: item.descripcion, cantidad: item.cantidad, bodega: item.bodega || '' });
    setFormModal({ isOpen: true, title: 'Editar Silla' });
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentItemId(null);
    setFormData({ producto: '', descripcion: '', cantidad: '', bodega: '' });
    setFormModal({ isOpen: true, title: 'Nuevo Elemento de Silla' });
  };

  const closeFormModal = () => {
    setFormModal({ isOpen: false, title: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      try {
        await api.delete(`/api/inventory/sillas/${id}/`);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const openMantenimientoModal = (item) => {
    setMantenimientoModal({ isOpen: true, item: item, cantidad: 0 });
  };

  const closeMantenimientoModal = () => {
    setMantenimientoModal({ isOpen: false, item: null, cantidad: 0 });
  };

  const handleMantenimientoAction = async (actionType) => {
    const { item, cantidad } = mantenimientoModal;
    const cantidadNum = Number(cantidad);
    if (!cantidad || isNaN(cantidadNum) || cantidadNum <= 0) {
      alert('Por favor, ingresa una cantidad válida.');
      return;
    }

    try {
      if (actionType === 'enviar') {
        await enviarAMantenimiento('sillas', item.id, cantidadNum);
      } else if (actionType === 'reintegrar') {
        await reintegrarDeMantenimiento('sillas', item.id, cantidadNum);
      }
      fetchItems();
      closeMantenimientoModal();
    } catch (error) {
      console.error(`Error en la operación de mantenimiento:`, error);
      alert(`Error: ${error.response?.data?.error || 'Ocurrió un error.'}`);
    }
  };

  return (
    <div className="sillas-container">
      <div className="sillas-header">
        <h1 className="sillas-title">Gestión de Sillas</h1>
      </div>

      <div className="search-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Buscar sillas..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button onClick={openCreateModal} className="create-btn">
          <FiPlus /> Nuevo Elemento
        </button>
      </div>

      <div className="table-responsive">
        <table className="sillas-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Descripción</th>
              <th>Bodega</th>
              <th>Disponibles</th>
              <th>En Mantenimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map(item => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.producto}</strong>
                  </td>
                  <td>{item.descripcion || 'N/A'}</td>
                  <td>{item.bodega_nombre || 'N/A'}</td>
                  <td>{item.cantidad}</td>
                  <td>
                    <span className={`status-badge ${item.cantidad_en_mantenimiento > 0 ? 'status-mantenimiento' : 'status-disponible'}`}>
                      {item.cantidad_en_mantenimiento}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(item)} className="action-btn edit-btn" title="Editar">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="action-btn delete-btn" title="Eliminar">
                        <FiTrash2 />
                      </button>
                      <button 
                        onClick={() => openMantenimientoModal(item)}
                        className="action-btn mantenimiento-btn"
                        title="Mantenimiento"
                      >
                        <FiTool />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-items">
                  No se encontraron elementos de sillas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Formulario */}
      {formModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{formModal.title}</h2>
              <button onClick={closeFormModal} className="modal-close">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="sillas-form-modal">
              <div className="form-group">
                <label htmlFor="producto">Producto</label>
                <input 
                  type="text" 
                  id="producto"
                  name="producto" 
                  value={formData.producto} 
                  onChange={handleInputChange} 
                  placeholder="Nombre del producto" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <input 
                  type="text" 
                  id="descripcion"
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleInputChange} 
                  placeholder="Descripción detallada" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="cantidad">Cantidad Disponible</label>
                <input 
                  type="number" 
                  id="cantidad"
                  name="cantidad" 
                  value={formData.cantidad} 
                  onChange={handleInputChange} 
                  placeholder="0" 
                  min="0"
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="bodega">Bodega</label>
                <select 
                  id="bodega"
                  name="bodega" 
                  value={formData.bodega} 
                  onChange={handleInputChange}
                  className="bodega-selector"
                >
                  <option value="">Seleccionar Bodega</option>
                  {bodegas.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="btn-group">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={closeFormModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {isEditing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Mantenimiento */}
      {mantenimientoModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                Gestionar Mantenimiento: {mantenimientoModal.item?.producto}
              </h2>
              <button onClick={closeMantenimientoModal} className="modal-close">
                <FiX />
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="cantidad">Cantidad:</label>
              <input
                type="number"
                id="cantidad"
                min="1"
                value={mantenimientoModal.cantidad}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || Number(value) > 0) {
                    setMantenimientoModal({
                      ...mantenimientoModal,
                      cantidad: value === '' ? '' : Number(value)
                    });
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }}
                className="form-control"
                required
              />
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeMantenimientoModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => handleMantenimientoAction('enviar')}
              >
                Enviar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleMantenimientoAction('reintegrar')}
              >
                Reintegrar
              </button>
            </div>
          </div>
        </div>
      )}

      <Link to="/inventory/items" className="back-link">Volver a Inventario</Link>
    </div>
  );
};

export default Sillas;

