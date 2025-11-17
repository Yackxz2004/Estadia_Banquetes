import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/CategoryPage.css';
import '../styles/UserCRUD.css';
import CreateUserForm from '../components/CreateUserForm';

const UserCRUD = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true);
        api.get('/api/users/')
            .then((res) => res.data)
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Hubo un error al cargar los usuarios. Asegúrate de que el endpoint en la API existe y de tener los permisos necesarios.');
                setLoading(false);
                console.error(err);
            });
    };

    const handleCreationSuccess = () => {
        setIsCreating(false);
        getUsers();
    };

    const handleEditSuccess = () => {
        setEditingUser(null);
        getUsers();
    };

    const scrollToForm = () => {
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleCreateClick = () => {
        setIsCreating(true);
        setEditingUser(null);
        // No hacemos scroll al crear un nuevo usuario
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        // Solo hacemos scroll cuando se edita un usuario
        setTimeout(() => {
            scrollToForm();
        }, 0);
    };

    const deleteUser = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            api.delete(`/api/users/delete/${id}/`)
                .then((res) => {
                    if (res.status === 204) {
                        alert('Usuario eliminado con éxito.');
                        getUsers(); // Recargar la lista de usuarios
                    } else {
                        alert('Hubo un error al eliminar el usuario.');
                    }
                })
                .catch((err) => {
                    alert('Hubo un error al eliminar el usuario.');
                    console.error(err);
                });
        }
    };

    if (loading) {
        return <div className="category-container"><p>Cargando usuarios...</p></div>;
    }

    if (error) {
        return <div className="category-container"><p style={{ color: 'red' }}>{error}</p></div>;
    }

    return (
        <div className="category-container">
            <div className="header-actions">
                <h1>Gestión de Usuarios</h1>
                <button 
                    className="create-btn" 
                    onClick={handleCreateClick}
                >
                    + Crear Nuevo Usuario
                </button>
            </div>

            {(isCreating || editingUser) && (
                <div ref={formRef}>
                    <CreateUserForm 
                        user={editingUser}
                        onSuccess={isCreating ? handleCreationSuccess : handleEditSuccess}
                        onCancel={() => {
                            setIsCreating(false);
                            setEditingUser(null);
                        }}
                    />
                </div>
            )}

            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre de Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email || 'No especificado'}</td>
                            <td>{user.rol || 'No asignado'}</td>
                            <td>
                                <button className="action-btn edit-btn" onClick={() => handleEdit(user)}>Editar</button>
                                <button className="action-btn delete-btn" onClick={() => deleteUser(user.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/inventory" className="back-link">Volver al Panel</Link>
        </div>
    );
};

export default UserCRUD;
