import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiList, FiTag } from 'react-icons/fi';
import api from '../api';
import '../styles/Eventos.css';
import '../styles/TipoEventoCRUD.css'; // Estilos específicos para TipoEventoCRUD

const TipoEventoCRUD = () => {
    const [tiposEvento, setTiposEvento] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [editingId, setEditingId] = useState(null); // Estado para el ID en edición
    const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario

    useEffect(() => {
        getTiposEvento();
    }, []);

    const getTiposEvento = () => {
        api.get('/api/inventory/tipos-evento/')
            .then(res => setTiposEvento(res.data))
            .catch(err => console.error(err));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateTipoEvento();
            } else {
                await createTipoEvento();
            }
        } catch (error) {
            console.error('Error en el formulario:', error);
            toast.error(error.message || 'Ocurrió un error al procesar la solicitud');
        }
    };

    const createTipoEvento = async () => {
        const response = await api.post('/api/inventory/tipos-evento/', { 
            nombre, 
            descripcion: descripcion || null 
        });
        
        if (response.status === 201) {
            toast.success('Tipo de evento creado correctamente');
            resetForm();
            getTiposEvento();
            setShowForm(false); // Ocultar el formulario después de crear
        } else {
            throw new Error('Error al crear el tipo de evento');
        }
    };

    const updateTipoEvento = async () => {
        const response = await api.put(`/api/inventory/tipos-evento/${editingId}/`, { 
            nombre, 
            descripcion: descripcion || null 
        });
        
        if (response.status === 200) {
            toast.success('Tipo de evento actualizado correctamente');
            resetForm();
            getTiposEvento();
            setShowForm(false); // Ocultar el formulario después de actualizar
        } else {
            throw new Error('Error al actualizar el tipo de evento');
        }
    };

    const deleteTipoEvento = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de evento? Esta acción no se puede deshacer.')) {
            api.delete(`/api/inventory/tipos-evento/${id}/`)
                .then(res => {
                    if (res.status === 204) {
                        toast.success('Tipo de evento eliminado correctamente');
                        getTiposEvento();
                    } else {
                        throw new Error('Error al eliminar el tipo de evento');
                    }
                })
                .catch(error => {
                    console.error('Error al eliminar tipo de evento:', error);
                    toast.error(error.message || 'Error al eliminar el tipo de evento');
                });
        }
    };

    const startEditing = (tipo) => {
        setEditingId(tipo.id);
        setNombre(tipo.nombre);
        setDescripcion(tipo.descripcion);
        setShowForm(true);
        // Desplazarse suavemente al formulario
        setTimeout(() => {
            document.getElementById('tipo-evento-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const resetForm = () => {
        setEditingId(null);
        setNombre('');
        setDescripcion('');
        setShowForm(false);
    };
    
    const handleNewButtonClick = () => {
        resetForm();
        setShowForm(true);
    };

    return (
        <div className="eventos-container">
            <div className="eventos-header">
                <h1 className="eventos-title">
                    <FiTag className="header-icon" />
                    Gestión de Tipos de Evento
                </h1>
                <button 
                    className="create-btn"
                    onClick={showForm ? resetForm : handleNewButtonClick}
                >
                    <FiPlus size={18} />
                    {showForm ? 'Cancelar' : 'Nuevo Tipo de Evento'}
                </button>
            </div>

            {showForm && (
                <form id="tipo-evento-form" onSubmit={handleFormSubmit} className="tipo-evento-form">
                <h3 className="form-title">
                    <FiList size={20} />
                    {editingId ? 'Editar Tipo de Evento' : 'Crear Nuevo Tipo de Evento'}
                </h3>
                
                <div className="form-group">
                    <label htmlFor="nombre">Nombre del Tipo de Evento</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        placeholder="Ej: Boda, Cumpleaños, Conferencia..."
                        className="form-input"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                        placeholder="Describe las características de este tipo de evento"
                        className="form-textarea"
                        rows="3"
                    />
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        <FiSave size={16} />
                        {editingId ? 'Guardar Cambios' : 'Crear Tipo de Evento'}
                    </button>
                    {editingId && (
                        <button 
                            type="button" 
                            onClick={resetForm}
                            className="btn btn-secondary"
                        >
                            <FiX size={16} />
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
            )}

            <div className="table-responsive">
                <h3 className="section-title">
                    <FiList size={20} />
                    Lista de Tipos de Evento
                </h3>
                
                {tiposEvento.length > 0 ? (
                    <table className="eventos-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tiposEvento.map(tipo => (
                                <tr key={tipo.id}>
                                    <td className="id-cell">{tipo.id}</td>
                                    <td className="name-cell">{tipo.nombre}</td>
                                    <td className="desc-cell">{tipo.descripcion || 'Sin descripción'}</td>
                                    <td className="actions-cell">
                                        <div className="action-buttons">
                                            <button 
                                                onClick={() => {
                                                    startEditing(tipo);
                                                    document.getElementById('tipo-evento-form').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="action-btn edit-btn"
                                            >
                                                <FiEdit2 size={16} />
                                                <span>Editar</span>
                                            </button>
                                            <button 
                                                onClick={() => deleteTipoEvento(tipo.id)}
                                                className="action-btn delete-btn"
                                            >
                                                <FiTrash2 size={16} />
                                                <span>Eliminar</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-data">
                        <p>No hay tipos de evento registrados. ¡Crea el primero!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TipoEventoCRUD;
