import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDegustaciones, deleteDegustacion } from '../api/inventory';
import { toast } from 'react-hot-toast';

function Degustaciones() {
  const [degustaciones, setDegustaciones] = useState([]);

  useEffect(() => {
    loadDegustaciones();
  }, []);

  const loadDegustaciones = async () => {
    try {
      const response = await getDegustaciones();
      setDegustaciones(response.data);
    } catch (error) {
      toast.error('Error al cargar las degustaciones');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta degustación?')) {
      try {
        await deleteDegustacion(id);
        toast.success('Degustación eliminada correctamente');
        loadDegustaciones();
      } catch (error) {
        toast.error('Error al eliminar la degustación');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gestión de Degustaciones</h1>
      <Link to="/inventory/degustaciones/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Crear Nueva Degustación
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Estado</th>
              <th className="py-2 px-4 border-b">Fecha Degustación</th>
              <th className="py-2 px-4 border-b">Responsable</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {degustaciones.map((degustacion) => (
              <tr key={degustacion.id}>
                <td className="py-2 px-4 border-b">{degustacion.nombre}</td>
                <td className="py-2 px-4 border-b">{degustacion.estado}</td>
                <td className="py-2 px-4 border-b">{new Date(degustacion.fecha_degustacion).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{degustacion.responsable}</td>
                <td className="py-2 px-4 border-b">
                  <Link to={`/inventory/degustaciones/${degustacion.id}`} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(degustacion.id)}
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

export default Degustaciones;
