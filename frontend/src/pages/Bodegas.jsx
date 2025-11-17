import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiPackage, FiMapPin, FiInfo, FiX, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import '../styles/Bodegas.css';

// Componente para el formulario de Bodega
const BodegaForm = ({ bodega, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    descripcion: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!bodega;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        nombre: bodega.nombre || '',
        ubicacion: bodega.ubicacion || '',
        descripcion: bodega.descripcion || '',
      });
    } else {
      // Resetear el formulario cuando no hay bodega
      setFormData({
        nombre: '',
        ubicacion: '',
        descripcion: '',
      });
    }
    setError('');
  }, [bodega, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar el error cuando el usuario comienza a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validación de campos requeridos
    if (!formData.nombre.trim()) {
      setError('El nombre de la bodega es obligatorio');
      setIsSubmitting(false);
      return;
    }

    if (!formData.ubicacion.trim()) {
      setError('La ubicación de la bodega es obligatoria');
      setIsSubmitting(false);
      return;
    }

    try {
      let response;
      
      if (isEditing) {
        response = await api.put(`/api/inventory/bodegas/${bodega.id}/`, formData);
      } else {
        response = await api.post('/api/inventory/bodegas/', formData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`Bodega ${isEditing ? 'actualizada' : 'creada'} exitosamente`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onSuccess();
      } else {
        throw new Error('Error al procesar la solicitud');
      }
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.detail || 'Error al procesar la solicitud';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="create-bodega-form">
        <h2>
          <FiPackage className="me-2" />
          {isEditing ? 'Editar Bodega' : 'Nueva Bodega'}
        </h2>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            <FiInfo className="me-2" />
            {error}
          </div>
        )}
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Bodega Principal"
              autoFocus
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ubicacion">
              Ubicación <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              className="form-control"
              value={formData.ubicacion}
              onChange={handleInputChange}
              placeholder="Ej: Planta Baja, Nivel 2"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="form-control"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Información adicional sobre la bodega"
              rows="3"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <FiX className="me-1" /> Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isEditing ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              <>
                <FiSave className="me-1" />
                {isEditing ? 'Actualizar Bodega' : 'Crear Bodega'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const Bodegas = () => {
  const [bodegas, setBodegas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBodega, setEditingBodega] = useState(null);

  useEffect(() => {
    getBodegas();
  }, []);

  const getBodegas = () => {
    setLoading(true);
    api
      .get('/api/inventory/bodegas/')
      .then((res) => res.data)
      .then((data) => {
        setBodegas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar bodegas:', err);
        toast.error('Error al cargar las bodegas');
        setLoading(false);
      });
  };

  const handleCreateSuccess = () => {
    setIsCreating(false);
    getBodegas();
  };

  const handleEditSuccess = () => {
    setEditingBodega(null);
    getBodegas();
  };

  const handleDeleteBodega = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta bodega?')) {
      api
        .delete(`/api/inventory/bodegas/${id}/`)
        .then(() => {
          toast.success('Bodega eliminada correctamente');
          getBodegas();
        })
        .catch((err) => {
          console.error('Error al eliminar bodega:', err);
          const errorMessage = err.response?.data?.detail || 'Error al eliminar la bodega';
          toast.error(errorMessage);
        });
    }
  };

  const handleEdit = (bodega) => {
    setEditingBodega(bodega);
  };

  return (
    <div className="bodegas-container">
      <div className="header-actions">
        <h1><FiPackage className="icon" /> Gestión de Bodegas</h1>
        <button 
          className="create-btn"
          onClick={() => {
            setEditingBodega(null);
            setIsCreating(true);
          }}
        >
          <FiPlus /> Nueva Bodega
        </button>
      </div>

      {(isCreating || editingBodega) && (
        <BodegaForm 
          bodega={editingBodega}
          onSuccess={isCreating ? handleCreateSuccess : handleEditSuccess}
          onCancel={() => {
            setIsCreating(false);
            setEditingBodega(null);
          }}
        />
      )}

      {loading ? (
        <div className="loading">Cargando bodegas...</div>
      ) : bodegas.length === 0 ? (
        <div className="empty-state">
          <FiPackage size={48} />
          <p>No hay bodegas registradas</p>
        </div>
      ) : (
        <table className="bodegas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bodegas.map((bodega) => (
              <tr key={bodega.id}>
                <td>#{bodega.id}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <FiPackage className="icon" />
                    {bodega.nombre}
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <FiMapPin className="icon" />
                    {bodega.ubicacion}
                  </div>
                </td>
                <td>
                  {bodega.descripcion ? (
                    <span title={bodega.descripcion}>
                      {bodega.descripcion.length > 30 
                        ? `${bodega.descripcion.substring(0, 30)}...` 
                        : bodega.descripcion}
                    </span>
                  ) : (
                    <span className="text-muted">Sin descripción</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(bodega)}
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteBodega(bodega.id)}
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bodegas;