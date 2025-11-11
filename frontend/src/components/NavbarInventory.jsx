import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/NavbarInventory.css';

const NavbarInventory = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = () => {
            api.get('/api/inventory/notifications/?is_read=false')
                .then(response => {
                    setUnreadCount(response.data.length);
                })
                .catch(error => {
                    console.error('Error fetching unread notifications count:', error);
                });
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000); // Poll every 60 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="inventory-navbar">
            <ul className="inventory-navbar-links">
                <li><Link to="/inventory">Inicio</Link></li>
                <li>
                    <Link to="/inventory/notifications"> {/* Corrected path */}
                        Mensajes
                        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                    </Link>
                </li>
                <li><Link to="/inventory/invitaciones">Invitaciones</Link></li>
                <li><Link to="/inventory/calendar">Calendario</Link></li>
                <li><Link to="/inventory/reports">Reportes</Link></li>
                <li><Link to="/inventory/backup">Respaldo</Link></li>
            </ul>
        </nav>
    );
};

export default NavbarInventory;
