import React, { useState, useEffect } from 'react';
import api from '../api';

const TipoEventoCRUD = () => {
    const [tiposEvento, setTiposEvento] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [editingId, setEditingId] = useState(null); // Estado para el ID en edición

    useEffect(() => {
        getTiposEvento();
    }, []);

    const getTiposEvento = () => {
        api.get('/api/inventory/tipos-evento/')
            .then(res => setTiposEvento(res.data))
            .catch(err => console.error(err));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateTipoEvento();
        } else {
            createTipoEvento();
        }
    };

    const createTipoEvento = () => {
        api.post('/api/inventory/tipos-evento/', { nombre, descripcion })
            .then(res => {
                if (res.status === 201) {
                    alert('Tipo de Evento creado!');
                    resetForm();
                    getTiposEvento();
                } else {
                    alert('Error al crear el tipo de evento.');
                }
            })
            .catch(err => alert(err));
    };

    const updateTipoEvento = () => {
        api.put(`/api/inventory/tipos-evento/${editingId}/`, { nombre, descripcion })
            .then(res => {
                if (res.status === 200) {
                    alert('Tipo de Evento actualizado!');
                    resetForm();
                    getTiposEvento();
                } else {
                    alert('Error al actualizar el tipo de evento.');
                }
            })
            .catch(err => alert(err));
    };

    const deleteTipoEvento = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de evento?')) {
            api.delete(`/api/inventory/tipos-evento/${id}/`)
                .then(res => {
                    if (res.status === 204) {
                        alert('Tipo de Evento eliminado!');
                        getTiposEvento();
                    } else {
                        alert('Error al eliminar el tipo de evento.');
                    }
                })
                .catch(err => alert(err));
        }
    };

    const startEditing = (tipo) => {
        setEditingId(tipo.id);
        setNombre(tipo.nombre);
        setDescripcion(tipo.descripcion);
    };

    const resetForm = () => {
        setEditingId(null);
        setNombre('');
        setDescripcion('');
    };

    return (
        <div>
            <h2>Gestionar Tipos de Evento</h2>

            <form onSubmit={handleFormSubmit}>
                <h3>{editingId ? 'Editar' : 'Crear Nuevo'} Tipo de Evento</h3>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                />
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                />
                <button type="submit">{editingId ? 'Guardar Cambios' : 'Crear'}</button>
                {editingId && <button type="button" onClick={resetForm}>Cancelar</button>}
            </form>

            <h3>Lista de Tipos de Evento</h3>
            <table>
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
                            <td>{tipo.id}</td>
                            <td>{tipo.nombre}</td>
                            <td>{tipo.descripcion}</td>
                            <td>
                                <button onClick={() => startEditing(tipo)}>Editar</button>
                                <button onClick={() => deleteTipoEvento(tipo.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TipoEventoCRUD;
