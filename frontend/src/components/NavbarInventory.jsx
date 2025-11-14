import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProfileBubble from './ProfileBubble';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants';
import '../styles/NavbarInventory.css';

const NavbarInventory = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.username);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        const fetchUnreadCount = async () => {
            try {
                const response = await api.get('/api/inventory/notifications/?is_read=false');
                setUnreadCount(response.data.length);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000); // Poll every 60 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="inventory-navbar">
            <div className="navbar-brand">
                <Link to="/inventory">Boyas</Link>
            </div>
            <div className="navbar-links">
                <ul>
                    <li><Link to="/inventory">Inicio</Link></li>
                    <li>
                        <Link to="/inventory/notifications" className="notification-link">
                            Mensajes
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        </Link>
                    </li>
                    <li><Link to="/inventory/invitaciones">Invitaciones</Link></li>
                    <li><Link to="/inventory/calendar">Calendario</Link></li>
                    <li><Link to="/inventory/reports">Reportes</Link></li>
                    <li><Link to="/inventory/backup">Respaldo</Link></li>
                </ul>
            </div>
            <div className="navbar-profile">
                <ProfileBubble username={username} />
            </div>
        </nav>
    );
};

export default NavbarInventory;
