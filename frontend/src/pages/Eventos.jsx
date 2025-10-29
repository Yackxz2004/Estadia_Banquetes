import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEventos, deleteEvento } from '../api/inventory';
import { toast } from 'react-hot-toast';

function Eventos() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      const response = await getEventos();
      setEventos(response.data);
    } catch (error) {
      toast.error('Error al cargar los eventos');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await deleteEvento(id);
        toast.success('Evento eliminado correctamente');
        loadEventos();
      } catch (error) {
        toast.error('Error al eliminar el evento');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gestión de Eventos</h1>
      <Link to="/inventory/eventos/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Crear Nuevo Evento
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Tipo</th>
              <th className="py-2 px-4 border-b">Estado</th>
              <th className="py-2 px-4 border-b">Fecha</th>
              <th className="py-2 px-4 border-b">Responsable</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td className="py-2 px-4 border-b">{evento.nombre}</td>
                <td className="py-2 px-4 border-b">{evento.tipo_evento_nombre}</td>
                <td className="py-2 px-4 border-b">{evento.estado}</td>
                <td className="py-2 px-4 border-b">{new Date(evento.fecha_inicio).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{evento.responsable}</td>
                <td className="py-2 px-4 border-b">
                  <Link to={`/inventory/eventos/${evento.id}`} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(evento.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Eventos;
