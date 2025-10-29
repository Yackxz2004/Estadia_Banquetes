import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/InventoryItems.css';

const InventoryItems = () => {
  return (
    <div className="inventory-items-container">
      <h1>Gestión de Inventario</h1>
      <div className="crud-links">
        <Link to="/inventory/manteleria" className="crud-link">Manteleria</Link>
        <Link to="/inventory/cubierto" className="crud-link">Cubierto</Link>
        <Link to="/inventory/loza" className="crud-link">Loza</Link>
      </div>
    </div>
  );
};

export default InventoryItems;
