import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Table2, Utensils, GlassWater, Armchair, Table, Sofa, 
  Warehouse, Music, Tent, Package, Settings 
} from 'lucide-react';
import '../styles/Items.css';

// Estructura de datos para los ítems de inventario
const inventoryItems = [
  { to: "/inventory/manteleria", icon: Table2, label: "Mantelería" },  // Cambiado de TableCloth a Table2
  { to: "/inventory/cubierto", icon: Utensils, label: "Cubiertos" },
  { to: "/inventory/loza", icon: GlassWater, label: "Loza" },
  { to: "/inventory/cristaleria", icon: GlassWater, label: "Cristalería" },
  { to: "/inventory/sillas", icon: Armchair, label: "Sillas" },
  { to: "/inventory/mesas", icon: Table, label: "Mesas" },
  { to: "/inventory/salas-lounge", icon: Sofa, label: "Salas Lounge" },
  { to: "/inventory/periqueras", icon: Warehouse, label: "Periqueras" },
  { to: "/inventory/carpas", icon: Tent, label: "Carpas" },
  { to: "/inventory/pistas-tarimas", icon: Music, label: "Pistas y Tarimas" },
  { to: "/inventory/extras", icon: Package, label: "Extras" },
  { to: "/inventory/ajustes", icon: Settings, label: "Ajustes" }
];



const Items = () => {
  return (
    <div className="items-container">
      <Link to="/inventory" className="back-link-items">
        ← Volver al Panel de Control
      </Link>
      
      <header className="items-header">
        <h1>Gestión de Inventario</h1>
        <p>Selecciona una categoría para gestionar los ítems del inventario</p>
      </header>
      
      <div className="items-grid">
        {inventoryItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link to={item.to} key={index} className="item-card">
              <div className="item-card-content">
                <Icon className="item-card-icon" size={32} strokeWidth={1.5} />
                <span className="item-card-label">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Items;
