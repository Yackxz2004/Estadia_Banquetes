import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/CreateUserForm.css';

const CreateUserForm = ({ onSuccess, onCancel, user }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('Encargado'); // Valor por defecto
    const [error, setError] = useState('');

    const isEditing = !!user;

    useEffect(() => {
        if (isEditing) {
            setUsername(user.username);
            setEmail(user.email || '');
            setRol(user.rol || 'Encargado');
            // La contraseña no se precarga por seguridad
        }
    }, [user, isEditing]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!username) {
            setError('El nombre de usuario es obligatorio.');
            return;
        }
        if (!isEditing && !password) {
            setError('La contraseña es obligatoria para crear un usuario.');
            return;
        }

        const userData = { username, email, rol };
        if (password) {
            userData.password = password;
        }

        // Renombramos 'rol' a 'rol_write' para que coincida con el serializador del backend
        if (userData.rol) {
            userData.rol_write = userData.rol;
            delete userData.rol;
        }

        const request = isEditing
            ? api.put(`/api/users/update/${user.id}/`, userData)
            : api.post('/api/users/create/', userData);

        request
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    alert(`Usuario ${isEditing ? 'actualizado' : 'creado'} exitosamente`);
                    onSuccess();
                } else {
                    setError(`Hubo un error al ${isEditing ? 'actualizar' : 'crear'} el usuario.`);
                }
            })
            .catch((err) => {
                const errorData = err.response?.data;
                if (errorData) {
                    const errorMessages = Object.values(errorData).flat().join(' ');
                    setError(errorMessages);
                } else {
                    setError('No se pudo conectar con el servidor.');
                }
                console.error(err);
            });
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="create-user-form">
                <h2>{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isEditing ? 'Dejar en blanco para no cambiar' : ''}
                        required={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="rol">Rol</label>
                    <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="Encargado">Encargado</option>
                        <option value="Proveedor">Proveedor</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-submit">{isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
                    <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CreateUserForm;
