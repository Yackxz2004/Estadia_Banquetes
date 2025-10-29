import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavbarInventory.css';

const NavbarInventory = () => {
  return (
    <nav className="inventory-navbar">
      <ul className="inventory-navbar-links">
        <li><Link to="/inventory">Inicio</Link></li>
        <li><Link to="/inventory/messages">Mensajes</Link></li>
        <li><Link to="/inventory/calendar">Calendario</Link></li>
        <li><Link to="/inventory/reports">Reportes</Link></li>
      </ul>
    </nav>
  );
};

export default NavbarInventory;
