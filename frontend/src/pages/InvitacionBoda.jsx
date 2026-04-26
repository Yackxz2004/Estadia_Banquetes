import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavbarInventory from '../components/NavbarInventory';
import '../styles/InvitacionBoda.css';
import { getInvitation } from '../api';

const InvitacionBoda = () => {
  const { id } = useParams();
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await getInvitation(id);
        setDatos(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar la invitación");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [id]);

  if (loading) return <div className="text-center py-20">Cargando invitación...</div>;
  if (error || !datos) return <div className="text-center py-20 text-red-500">{error || "Invitación no encontrada"}</div>;

  return (
    <div className="invitation-page">
      <NavbarInventory />

      <div className="invitation-container">
        <Link
          to="/inventory/invitaciones"
          className="invitation-back-link"
        >
          <svg className="invitation-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Invitaciones
        </Link>

        <div className="invitation-card">
          {/* Header decorativo */}
          <div className="invitation-header">
            <div className="invitation-header-icon-container">
              <svg className="invitation-header-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="invitation-title">{datos.titulo}</h1>
            <div className="invitation-subtitle">{datos.festejados}</div>
          </div>

          {/* Contenido principal */}
          <div className="invitation-content">
            <div className="invitation-message">
              <p>
                {datos.mensaje}
              </p>
            </div>

            {/* Detalles del evento */}
            <div className="invitation-details-grid">
              <div className="detail-card bg-pink-soft">
                <div className="detail-header">
                  <svg className="detail-icon text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="detail-title">Fecha</h3>
                </div>
                <p className="detail-text">{datos.fecha}</p>
              </div>

              <div className="detail-card bg-purple-soft">
                <div className="detail-header">
                  <svg className="detail-icon text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="detail-title">Hora</h3>
                </div>
                <p className="detail-text">{datos.hora}</p>
              </div>

              <div className="detail-card bg-blue-soft invitation-details-full-width">
                <div className="detail-header">
                  <svg className="detail-icon text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="detail-title">Lugar</h3>
                </div>
                <p className="detail-text" style={{ fontWeight: 600 }}>{datos.lugar}</p>
                <p className="detail-text">{datos.direccion}</p>
              </div>
            </div>

            {/* Mensaje de confirmación */}
            <div className="invitation-cta">
              <p className="cta-text">
                Esperamos contar con tu presencia en este día tan especial
              </p>
              <button className="cta-button">
                Confirmar Asistencia
              </button>
            </div>
          </div>

          {/* Footer decorativo */}
          <div className="invitation-footer">
            <p>¡Nos vemos pronto! 💕</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitacionBoda;