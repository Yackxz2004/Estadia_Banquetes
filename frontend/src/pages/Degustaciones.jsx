import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDegustaciones, deleteDegustacion } from '../api/inventory';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiClock, FiUser, FiTag, FiInfo } from 'react-icons/fi';
import '../styles/Degustaciones.css';

function Degustaciones() {
  const [degustaciones, setDegustaciones] = useState([]);

  useEffect(() => {
    loadDegustaciones();
  }, []);

  const loadDegustaciones = async () => {
    try {
      const response = await getDegustaciones();
      setDegustaciones(response.data);
    } catch (error) {
      toast.error('Error al cargar las degustaciones');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta degustación?')) {
      try {
        await deleteDegustacion(id);
        toast.success('Degustación eliminada correctamente');
        loadDegustaciones();
      } catch (error) {
        toast.error('Error al eliminar la degustación');
      }
    }
  };

  // Función para obtener la clase CSS según el estado
  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'Por iniciar':
        return 'estado-por-iniciar';
      case 'En proceso':
        return 'estado-en-proceso';
      case 'Finalizado':
        return 'estado-finalizado';
      case 'Cancelado':
        return 'estado-cancelado';
      default:
        return '';
    }
  };

  // Función para formatear la fecha
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

  return (
    <div className="degustaciones-container">
      <div className="degustaciones-header">
        <h1 className="degustaciones-title">
          <FiTag className="icon" /> Gestión de Degustaciones
        </h1>
        <Link to="/inventory/degustaciones/new" className="create-btn">
          <FiPlus /> Nueva Degustación
        </Link>
      </div>

      <div className="table-responsive">
        <table className="degustaciones-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th><FiInfo className="icon" /> Estado</th>
              <th><FiCalendar className="icon" /> Fecha</th>
              <th><FiUser className="icon" /> Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {degustaciones.length > 0 ? (
              degustaciones.map((degustacion) => (
                <tr key={degustacion.id}>
                  <td className="font-medium">{degustacion.nombre}</td>
                  <td>
                    <span className={`estado-badge ${getEstadoClass(degustacion.estado)}`}>
                      {degustacion.estado}
                    </span>
                  </td>
                  <td>{formatDate(degustacion.fecha_degustacion)}</td>
                  <td>{degustacion.responsable}</td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/inventory/degustaciones/${degustacion.id}`} 
                        className="action-btn edit-btn"
                        title="Editar degustación"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => handleDelete(degustacion.id)}
                        className="action-btn delete-btn"
                        title="Eliminar degustación"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  No hay degustaciones registradas. Crea tu primera degustación.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Degustaciones;
