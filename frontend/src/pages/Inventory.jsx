import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { ACCESS_TOKEN } from '../constants';
import ProfileBubble from '../components/ProfileBubble';
import NavbarInventory from '../components/NavbarInventory';
import '../styles/Inventory.css';

const Inventory = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username); 
    }
  }, []);

  return (
    <div className="inventory-page-container">
      <NavbarInventory />
      <div className="inventory-content">
        <ProfileBubble username={username} />
        <h1>Página de Control</h1>
        <p>Bienvenido al panel de control de Administrador, {username}.</p>
        <div className="inventory-actions">
          <Link to="/inventory/tipos-evento" className="action-button">Gestionar Tipos de Evento</Link>
          <Link to="/inventory/bodegas" className="action-button">Gestionar Bodegas</Link>
          <Link to="/inventory/clientes" className="action-button">Gestionar Clientes</Link>
          <Link to="/inventory/eventos" className="action-button">Gestionar Eventos</Link>
          <Link to="/inventory/degustaciones" className="action-button">Gestionar Degustaciones</Link>
          <Link to="/inventory/items" className="action-button">Inventario</Link>
          <Link to="/inventory/users" className="action-button">Gestionar Usuarios</Link>
          <Link to="/inventory/products" className="action-button">Gestionar Productos</Link>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
