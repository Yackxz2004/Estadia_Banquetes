import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiPhone, FiUsers, FiMessageSquare, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../api';
import '../styles/Clientes.css';

const Clientes = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [tiposEvento, setTiposEvento] = useState([]);
  const [newCliente, setNewCliente] = useState({
    nombre: '',
    apellido: '',
    tipo_evento: '',
    cantidad_aprox: '',
    numero: '',
    comentarios: '',
  });

  useEffect(() => {
    getClientes();
    getTiposEvento();
  }, []);

  const getClientes = () => {
    api
      .get('/api/inventory/clientes/')
      .then((res) => res.data)
      .then((data) => setClientes(data))
      .catch((err) => alert(err));
  };

  const getTiposEvento = () => {
    api
      .get('/api/inventory/tipos-evento/')
      .then((res) => res.data)
      .then((data) => setTiposEvento(data))
      .catch((err) => alert(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCliente({ ...newCliente, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post('/api/inventory/clientes/', newCliente)
      .then((res) => {
        if (res.status === 201) {
          toast.success('¡Cliente creado exitosamente!');
          getClientes();
          setNewCliente({
            nombre: '',
            apellido: '',
            tipo_evento: '',
            cantidad_aprox: '',
            numero: '',
            comentarios: '',
          });
          setIsFormOpen(false);
        }
      })
      .catch((err) => {
        console.error('Error creating client:', err);
        toast.error('Error al crear el cliente');
      });
  };

  // Helper to get event name from ID
  const getEventName = (id) => {
    const evento = tiposEvento.find((e) => e.id === id);
    return evento ? evento.nombre : 'N/A';
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      api
        .delete(`/api/inventory/clientes/${id}/`)
        .then(() => {
          toast.success('Cliente eliminado correctamente');
          getClientes();
        })
        .catch((err) => {
          console.error('Error deleting client:', err);
          toast.error('Error al eliminar el cliente');
        });
    }
  };

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h1 className="clientes-title">Gestión de Clientes</h1>
        <button className="create-btn" onClick={toggleForm}>
          <FiPlus size={18} style={{ marginRight: '8px' }} />
          {isFormOpen ? 'Ocultar formulario' : 'Nuevo Cliente'}
        </button>
      </div>

      {isFormOpen && (
        <div className="clientes-form">
          <h2 style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
            <FiUser style={{ marginRight: '10px' }} />
            Agregar Nuevo Cliente
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="nombre" 
                  value={newCliente.nombre} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="apellido" 
                  value={newCliente.apellido} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Tipo de Evento</label>
                <select 
                  className="form-control"
                  name="tipo_evento" 
                  value={newCliente.tipo_evento} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione un tipo de evento</option>
                  {tiposEvento.map((evento) => (
                    <option key={evento.id} value={evento.id}>
                      {evento.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Cantidad Aprox.</label>
                <input 
                  type="number" 
                  className="form-control"
                  name="cantidad_aprox" 
                  value={newCliente.cantidad_aprox} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Número de Teléfono</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FiPhone style={{ marginRight: '10px', color: 'var(--accent-color)' }} />
                  <input 
                    type="text" 
                    className="form-control"
                    name="numero" 
                    value={newCliente.numero} 
                    onChange={handleInputChange} 
                    required 
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Comentarios</label>
                <textarea 
                  className="form-control"
                  name="comentarios" 
                  value={newCliente.comentarios} 
                  onChange={handleInputChange} 
                  rows="3"
                />
              </div>
            </div>
            <button type="submit" className="submit-btn">
              <FiPlus size={16} style={{ marginRight: '8px' }} />
              Agregar Cliente
            </button>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="clientes-table">
          <thead>
            <tr>
              <th><FiUser className="icon" /> Nombre</th>
              <th>Apellido</th>
              <th><FiCalendar className="icon" /> Evento</th>
              <th><FiUsers className="icon" /> Personas</th>
              <th><FiPhone className="icon" /> Teléfono</th>
              <th><FiMessageSquare className="icon" /> Comentarios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="event-name">
                    <strong>{cliente.nombre}</strong>
                  </td>
                  <td>{cliente.apellido}</td>
                  <td>{getEventName(cliente.tipo_evento)}</td>
                  <td>{cliente.cantidad_aprox}</td>
                  <td>{cliente.numero}</td>
                  <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} 
                      title={cliente.comentarios}>
                    {cliente.comentarios || '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => {
                          // Implementar edición aquí
                          toast.success('Función de edición en desarrollo');
                        }}
                      >
                        <FiEdit2 size={16} />
                        <span>Editar</span>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(cliente.id)}
                      >
                        <FiTrash2 size={16} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-events" style={{ textAlign: 'center', padding: '2rem' }}>
                  No hay clientes registrados. ¡Agrega tu primer cliente!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;
