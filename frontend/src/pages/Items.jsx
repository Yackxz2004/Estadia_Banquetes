import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Items.css';

const Items = () => {
  return (
    <div className="items-container">
      <Link to="/inventory" className="back-link-items">← Volver al Administrador</Link>
      <h1>Gestión de Inventario</h1>
      <div className="crud-links">
        <Link to="/inventory/manteleria" className="crud-link">Manteleria</Link>
        <Link to="/inventory/cubierto" className="crud-link">Cubierto</Link>
        <Link to="/inventory/loza" className="crud-link">Loza</Link>
        <Link to="/inventory/cristaleria" className="crud-link">Cristaleria</Link>
        <Link to="/inventory/sillas" className="crud-link">Sillas</Link>
        <Link to="/inventory/mesas" className="crud-link">Mesas</Link>
        <Link to="/inventory/salas-lounge" className="crud-link">Salas lounge</Link>
        <Link to="/inventory/periqueras" className="crud-link">Periqueras</Link>
        <Link to="/inventory/carpas" className="crud-link">Carpas</Link>
        <Link to="/inventory/pistas-tarimas" className="crud-link">Pistas y tarimas</Link>
        <Link to="/inventory/extras" className="crud-link">Extras</Link>
      </div>
    </div>
  );
};

export default Items;
