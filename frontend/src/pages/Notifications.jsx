import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        api.get('/api/inventory/notifications/')
            .then(response => {
                setNotifications(response.data);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    };

    const handleMarkAllAsRead = () => {
        api.post('/api/inventory/notifications/mark_all_as_read/')
            .then(() => {
                fetchNotifications(); // Refresh the list
            })
            .catch(error => {
                console.error('Error marking notifications as read:', error);
            });
    };

    const handleDeleteAll = () => {
        api.post('/api/inventory/notifications/delete_all/')
            .then(() => {
                setNotifications([]); // Clear the list locally
            })
            .catch(error => {
                console.error('Error deleting notifications:', error);
            });
    };

    return (
        <div className="notifications-container">
            <h1>Mensajes</h1>
            <div className="notifications-actions">
                <button onClick={handleMarkAllAsRead}>Marcar todos como leídos</button>
                <button onClick={handleDeleteAll} className="delete-button">Eliminar todos</button>
            </div>
            <div className="notifications-list">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div key={notification.id} className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}>
                            <p>{notification.message}</p>
                            <span className="notification-date">
                                {new Date(notification.created_at).toLocaleString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>No hay mensajes nuevos.</p>
                )}
            </div>
        </div>
    );
};

export default Notifications;