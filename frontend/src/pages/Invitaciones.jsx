import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavbarInventory from '../components/NavbarInventory';
import ProfileBubble from '../components/ProfileBubble';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants';
import { getInvitations, deleteInvitation } from '../api';
import { toast } from 'react-toastify';
import '../styles/Invitaciones.css';

const Invitaciones = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const username = token ? jwtDecode(token).username : '';
  const [invitaciones, setInvitaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitaciones();
  }, []);

  const fetchInvitaciones = async () => {
    try {
      const res = await getInvitations();
      setInvitaciones(res.data);
    } catch (error) {
      toast.error("Error al cargar las invitaciones");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault(); // Evita que se navegue a la invitación
    if (window.confirm("¿Seguro que deseas eliminar esta invitación?")) {
      try {
        await deleteInvitation(id);
        toast.success("Invitación eliminada correctamente");
        fetchInvitaciones();
      } catch (error) {
        toast.error("Error al eliminar la invitación");
        console.error(error);
      }
    }
  };

  return (
    <div className="invitaciones-wrapper">
      <NavbarInventory />
      <div className="invitaciones-max-width">
        <ProfileBubble username={username} />
        <div className="invitaciones-header-row">
          <div>
            <h1 className="invitaciones-title">Invitaciones de Eventos</h1>
            <p className="invitaciones-subtitle">
              Selecciona un evento para ver su invitación digital
            </p>
          </div>
          <Link
            to="/inventory/invitaciones/new"
            className="btn-crear-invitacion"
          >
            + Crear Nueva Invitación
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">Cargando...</div>
        ) : (
          <div className="invitaciones-grid">
            {invitaciones.map((invitacion) => (
              <Link
                key={invitacion.id}
                to={`/inventory/invitaciones/${invitacion.id}`}
                className="invitacion-card"
              >
                <h2 className="invitacion-card-title">{invitacion.titulo}</h2>
                <p className="invitacion-card-desc">{invitacion.descripcion}</p>
                <p className="invitacion-card-festejados">{invitacion.festejados}</p>

                <div className="invitacion-card-footer">
                  <span>Ver invitación</span>
                  <span className="icon-arrow">&rarr;</span>
                </div>

                <object className="action-buttons-wrapper" onClick={(e) => {
                  e.preventDefault();
                }}>
                  <Link to={`/inventory/invitaciones/edit/${invitacion.id}`} className="btn-edit-invitacion">
                    Editar
                  </Link>
                  <button onClick={(e) => handleDelete(invitacion.id, e)} className="btn-delete-invitacion">
                    Eliminar
                  </button>
                </object>
              </Link>
            ))}
          </div>
        )}

        {!loading && invitaciones.length === 0 && (
          <div className="empty-state">
            <p>No hay invitaciones disponibles. ¡Crea una nueva!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitaciones;