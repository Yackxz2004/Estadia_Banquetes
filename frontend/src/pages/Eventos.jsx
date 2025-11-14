import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEventos, deleteEvento } from '../api/inventory';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiUser, FiType, FiInfo } from 'react-icons/fi';
import '../styles/Eventos.css';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      setIsLoading(true);
      const response = await getEventos();
      setEventos(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Error al cargar los eventos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await deleteEvento(id);
        toast.success('Evento eliminado correctamente');
        loadEventos();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Error al eliminar el evento');
      }
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'Por iniciar': 'status-por-iniciar',
      'En proceso': 'status-en-proceso',
      'Finalizado': 'status-finalizado',
      'Cancelado': 'status-cancelado'
    };
    return statusMap[status] || '';
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (isLoading) {
    return (
      <div className="eventos-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="eventos-container">
      <div className="eventos-header">
        <h1 className="eventos-title">Gestión de Eventos</h1>
        <Link to="/inventory/eventos/new" className="create-btn">
          <FiPlus size={18} />
          Nuevo Evento
        </Link>
      </div>

      <div className="table-responsive">
        <table className="eventos-table">
          <thead>
            <tr>
              <th>Nombre del Evento</th>
              <th><FiType className="icon" /> Tipo</th>
              <th><FiInfo className="icon" /> Estado</th>
              <th><FiCalendar className="icon" /> Fecha</th>
              <th><FiUser className="icon" /> Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.length > 0 ? (
              eventos.map((evento) => (
                <tr key={evento.id}>
                  <td className="event-name">
                    <strong>{evento.nombre}</strong>
                  </td>
                  <td>{evento.tipo_evento_nombre}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(evento.estado)}`}>
                      {evento.estado}
                    </span>
                  </td>
                  <td>{formatDate(evento.fecha_inicio)}</td>
                  <td>{evento.responsable}</td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/inventory/eventos/${evento.id}`} 
                        className="action-btn edit-btn"
                      >
                        <FiEdit2 size={16} />
                        <span>Editar</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(evento.id)}
                        className="action-btn delete-btn"
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
                <td colSpan="6" className="no-events">
                  No hay eventos programados. ¡Crea tu primer evento!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Eventos;
