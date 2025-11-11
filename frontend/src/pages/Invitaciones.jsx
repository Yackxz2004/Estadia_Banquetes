import React from 'react';
import { Link } from 'react-router-dom';
import NavbarInventory from '../components/NavbarInventory';
import ProfileBubble from '../components/ProfileBubble';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants';

const Invitaciones = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const username = token ? jwtDecode(token).username : '';

  const invitaciones = [
    {
      id: 'boda-pocholos',
      nombre: 'Boda Pocholos',
      descripcion: 'Invitación para la boda de los Pocholos',
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    // Puedes agregar más invitaciones aquí
  ];

  return (
    <div className="inventory-page-container">
      <NavbarInventory />
      <div className="min-h-screen bg-gray-100 p-8">
        <ProfileBubble username={username} />
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Invitaciones de Eventos</h1>
          <p className="text-gray-600 mb-8">
            Selecciona un evento para ver su invitación digital
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitaciones.map((invitacion) => (
              <Link
                key={invitacion.id}
                to={`/inventory/invitaciones/${invitacion.id}`}
                className={`${invitacion.color} text-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <h2 className="text-2xl font-bold mb-3">{invitacion.nombre}</h2>
                <p className="text-white text-opacity-90">{invitacion.descripcion}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm">Ver invitación</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {invitaciones.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No hay invitaciones disponibles en este momento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invitaciones;