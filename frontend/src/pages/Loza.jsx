import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { getBodegas, enviarAMantenimiento, reintegrarDeMantenimiento } from '../api/inventory';
import '../styles/CategoryPage.css';

const Loza = () => {
  const [items, setItems] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [formData, setFormData] = useState({ producto: '', descripcion: '', cantidad: '', bodega: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mantenimientoModal, setMantenimientoModal] = useState({ isOpen: false, item: null, cantidad: 0 });

  useEffect(() => {
    fetchItems();
    fetchBodegas();
  }, [searchTerm]);

  const fetchItems = async () => {
    try {
      const response = await api.get('/api/inventory/lozas/', { params: { search: searchTerm } });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching loza items:', error);
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
    if (isEditing) {
      try {
        await api.put(`/api/inventory/lozas/${currentItemId}/`, data);
        setIsEditing(false);
        setCurrentItemId(null);
      } catch (error) {
        console.error('Error updating item:', error);
      }
    } else {
      try {
        await api.post('/api/inventory/lozas/', data);
      } catch (error) {
        console.error('Error creating item:', error);
      }
    }
    setFormData({ producto: '', descripcion: '', cantidad: '', bodega: '' });
    fetchItems();
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItemId(item.id);
    setFormData({ producto: item.producto, descripcion: item.descripcion, cantidad: item.cantidad, bodega: item.bodega || '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      try {
        await api.delete(`/api/inventory/lozas/${id}/`);
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
    if (!cantidad || cantidad <= 0) {
      alert('Por favor, ingresa una cantidad válida.');
      return;
    }

    try {
      if (actionType === 'enviar') {
        await enviarAMantenimiento('lozas', item.id, parseInt(cantidad));
      } else if (actionType === 'reintegrar') {
        await reintegrarDeMantenimiento('lozas', item.id, parseInt(cantidad));
      }
      fetchItems();
      closeMantenimientoModal();
    } catch (error) {
      console.error(`Error en la operación de mantenimiento:`, error);
      alert(`Error: ${error.response?.data?.error || 'Ocurrió un error.'}`);
    }
  };

  return (
    <div className="category-container">
      <h1>Gestión de Loza</h1>
      <input type="text" className="search-bar" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      
      <form onSubmit={handleSubmit} className="category-form">
        <input type="text" name="producto" value={formData.producto} onChange={handleInputChange} placeholder="Producto" required />
        <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" />
        <input type="number" name="cantidad" value={formData.cantidad} onChange={handleInputChange} placeholder="Cantidad Disponible" required />
        <select name="bodega" value={formData.bodega} onChange={handleInputChange}>
          <option value="">Seleccionar Bodega</option>
          {bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
      </form>

      <table className="category-table">
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
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.producto}</td>
              <td>{item.descripcion}</td>
              <td>{item.bodega_nombre || 'N/A'}</td>
              <td>{item.cantidad}</td>
              <td>{item.cantidad_en_mantenimiento}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
                <button onClick={() => openMantenimientoModal(item)}>Mantenimiento</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mantenimientoModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Mantenimiento de: {mantenimientoModal.item.producto}</h2>
            <p>Disponibles: {mantenimientoModal.item.cantidad} | En Mantenimiento: {mantenimientoModal.item.cantidad_en_mantenimiento}</p>
            <input 
              type="number" 
              className="form-control mb-2" 
              placeholder="Cantidad"
              value={mantenimientoModal.cantidad} 
              onChange={(e) => setMantenimientoModal({...mantenimientoModal, cantidad: e.target.value})} 
            />
            <div className="d-flex justify-content-between">
              <button className="btn btn-warning" onClick={() => handleMantenimientoAction('enviar')}>Enviar a Mantenimiento</button>
              <button className="btn btn-success" onClick={() => handleMantenimientoAction('reintegrar')}>Reintegrar de Mantenimiento</button>
              <button className="btn btn-secondary" onClick={closeMantenimientoModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <Link to="/inventory/items" className="back-link">Volver a Inventario</Link>
    </div>
  );
};

export default Loza;

