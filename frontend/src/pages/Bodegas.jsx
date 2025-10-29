import React, { useState, useEffect } from 'react';
import api from '../api';

const Bodegas = () => {
  const [bodegas, setBodegas] = useState([]);

  const [newBodega, setNewBodega] = useState({
    nombre: '',
    ubicacion: '',
    descripcion: '',
  });

  useEffect(() => {
    getBodegas();
  }, []);

  const getBodegas = () => {
    api
      .get('/api/inventory/bodegas/')
      .then((res) => res.data)
      .then((data) => {
        setBodegas(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBodega({ ...newBodega, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post('/api/inventory/bodegas/', newBodega)
      .then((res) => {
        if (res.status === 201) {
          alert('Bodega created!');
          getBodegas(); // Refresh the list
          setNewBodega({ nombre: '', ubicacion: '', descripcion: '' }); // Reset form
        } else {
          alert('Failed to create bodega.');
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <h1>Gestión de Bodegas</h1>

      <h2>Agregar Nueva Bodega</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={newBodega.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Ubicación:</label>
          <input
            type="text"
            name="ubicacion"
            value={newBodega.ubicacion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={newBodega.descripcion}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Agregar Bodega</button>
      </form>

      <h2>Listado de Bodegas</h2>
      <table border="1" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {bodegas.map((bodega) => (
            <tr key={bodega.id}>
              <td>{bodega.id}</td>
              <td>{bodega.nombre}</td>
              <td>{bodega.ubicacion}</td>
              <td>{bodega.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bodegas;