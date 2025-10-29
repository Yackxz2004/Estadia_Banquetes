import React, { useState, useEffect } from 'react';
import api from '../api';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [tiposEvento, setTiposEvento] = useState([]);
  const [newCliente, setNewCliente] = useState({
    nombre: '',
    apellido: '',
    tipo_evento: '',
    cantidad_aprox: '',
    numero: '',
    comentarios: '',
  });

  useEffect(() => {
    getClientes();
    getTiposEvento();
  }, []);

  const getClientes = () => {
    api
      .get('/api/inventory/clientes/')
      .then((res) => res.data)
      .then((data) => setClientes(data))
      .catch((err) => alert(err));
  };

  const getTiposEvento = () => {
    api
      .get('/api/inventory/tipos-evento/')
      .then((res) => res.data)
      .then((data) => setTiposEvento(data))
      .catch((err) => alert(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCliente({ ...newCliente, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post('/api/inventory/clientes/', newCliente)
      .then((res) => {
        if (res.status === 201) {
          alert('Cliente created!');
          getClientes(); // Refresh the list
          setNewCliente({
            nombre: '',
            apellido: '',
            tipo_evento: '',
            cantidad_aprox: '',
            numero: '',
            comentarios: '',
          }); // Reset form
        } else {
          alert('Failed to create cliente.');
        }
      })
      .catch((err) => alert(err));
  };

  // Helper to get event name from ID
  const getEventName = (id) => {
    const evento = tiposEvento.find((e) => e.id === id);
    return evento ? evento.nombre : 'N/A';
  };

  return (
    <div>
      <h1>Gestión de Clientes</h1>

      <h2>Agregar Nuevo Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={newCliente.nombre} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Apellido:</label>
          <input type="text" name="apellido" value={newCliente.apellido} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Tipo de Evento:</label>
          <select name="tipo_evento" value={newCliente.tipo_evento} onChange={handleInputChange}>
            <option value="">Seleccione un tipo de evento</option>
            {tiposEvento.map((evento) => (
              <option key={evento.id} value={evento.id}>
                {evento.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Cantidad Aprox:</label>
          <input type="number" name="cantidad_aprox" value={newCliente.cantidad_aprox} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Número:</label>
          <input type="text" name="numero" value={newCliente.numero} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Comentarios:</label>
          <textarea name="comentarios" value={newCliente.comentarios} onChange={handleInputChange} />
        </div>
        <button type="submit">Agregar Cliente</button>
      </form>

      <h2>Listado de Clientes</h2>
      <table border="1" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Tipo de Evento</th>
            <th>Cantidad Aprox.</th>
            <th>Número</th>
            <th>Comentarios</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.apellido}</td>
              <td>{getEventName(cliente.tipo_evento)}</td>
              <td>{cliente.cantidad_aprox}</td>
              <td>{cliente.numero}</td>
              <td>{cliente.comentarios}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clientes;
