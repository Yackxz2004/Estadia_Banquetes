import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NavbarInventory from '../components/NavbarInventory';

const InvitacionBoda = () => {
  const { id } = useParams();

  // Aquí puedes tener diferentes diseños según el ID
  const invitacionesData = {
    'boda-pocholos': {
      titulo: 'Boda de los Pocholos',
      novios: 'Juan Pocholos & María García',
      fecha: '15 de Diciembre, 2024',
      hora: '18:00 hrs',
      lugar: 'Salón de Eventos La Elegancia',
      direccion: 'Av. Principal #123, Ciudad',
      mensaje: '¡Nos casamos y queremos que seas parte de nuestro día especial!'
    }
  };

  const datos = invitacionesData[id] || invitacionesData['boda-pocholos'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <NavbarInventory />
      
      <div className="container mx-auto px-3 py-12">
        <Link 
          to="/inventory/invitaciones" 
          className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Invitaciones
        </Link>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header decorativo */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-white text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2">{datos.titulo}</h1>
            <div className="text-xl font-light">{datos.novios}</div>
          </div>

          {/* Contenido principal */}
          <div className="p-12">
            <div className="text-center mb-12">
              <p className="text-2xl text-gray-700 italic mb-8">
                {datos.mensaje}
              </p>
            </div>

            {/* Detalles del evento */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-pink-50 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-pink-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800">Fecha</h3>
                </div>
                <p className="text-gray-700 ml-9">{datos.fecha}</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="w-1 h-1 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800">Hora</h3>
                </div>
                <p className="text-gray-600 ml-9">{datos.hora}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg md:col-span-2">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800">Lugar</h3>
                </div>
                <p className="text-gray-700 ml-9 font-semibold">{datos.lugar}</p>
                <p className="text-gray-600 ml-9">{datos.direccion}</p>
              </div>
            </div>

            {/* Mensaje de confirmación */}
            <div className="text-center bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Esperamos contar con tu presencia en este día tan especial
              </p>
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300">
                Confirmar Asistencia
              </button>
            </div>
          </div>

          {/* Footer decorativo */}
          <div className="bg-gray-50 p-6 text-center text-gray-600">
            <p>¡Nos vemos pronto! 💕</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitacionBoda;