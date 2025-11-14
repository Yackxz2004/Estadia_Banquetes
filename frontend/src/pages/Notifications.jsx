import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get('/api/inventory/notifications/');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('No se pudieron cargar las notificaciones. Por favor, intenta de nuevo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.post('/api/inventory/notifications/mark_all_as_read/');
            // Actualizar el estado local para marcar todas como leídas
            setNotifications(prevNotifications => 
                prevNotifications.map(notification => ({
                    ...notification,
                    is_read: true
                }))
            );
        } catch (error) {
            console.error('Error marking notifications as read:', error);
            setError('No se pudieron marcar las notificaciones como leídas. Intenta de nuevo.');
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar todas las notificaciones?')) {
            try {
                await api.post('/api/inventory/notifications/delete_all/');
                setNotifications([]);
            } catch (error) {
                console.error('Error deleting notifications:', error);
                setError('No se pudieron eliminar las notificaciones. Intenta de nuevo.');
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (isLoading) {
        return (
            <div className="notifications-container">
                <h1>Mensajes</h1>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando notificaciones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="notifications-container">
                <h1>Mensajes</h1>
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchNotifications} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-container">
            <h1>Mensajes</h1>
            
            {(notifications.length > 0) && (
                <div className="notifications-actions">
                    <button onClick={handleMarkAllAsRead}>
                        Marcar todos como leídos
                    </button>
                    <button onClick={handleDeleteAll} className="delete-button">
                        Eliminar todos
                    </button>
                </div>
            )}
            
            <div className="notifications-list">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                        >
                            <div className="notification-content">
                                <p>{notification.message}</p>
                                <span className="notification-date">
                                    {formatDate(notification.created_at)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No hay mensajes nuevos.</p>
                        <button onClick={fetchNotifications} className="refresh-button">
                            Actualizar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;