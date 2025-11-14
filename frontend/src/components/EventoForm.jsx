import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvento, updateEvento, getEventos, getTiposEvento, getAllMobiliario, getContentTypes } from '../api/inventory';
import { toast } from 'react-hot-toast';
import '../styles/EventoForm.css';

// Componente para la selección de mobiliario
const MobiliarioSelector = ({ allMobiliario, onAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  // Obtener categorías únicas
  const categories = [...new Set(allMobiliario.map(m => m.categoryName))];
  // Filtrar ítems según la categoría seleccionada
  const itemsInCategory = allMobiliario.filter(m => m.categoryName === selectedCategory);

  const handleAdd = () => {
    setError('');
    
    if (!selectedCategory) {
      setError('Por favor selecciona una categoría');
      return;
    }
    
    if (!selectedItem) {
      setError('Por favor selecciona un producto');
      return;
    }
    
    const itemToAdd = itemsInCategory.find(m => m.id === parseInt(selectedItem));
    if (!itemToAdd) return;
    
    if (quantity < 1) {
      setError('La cantidad debe ser al menos 1');
      return;
    }
    
    if (quantity > itemToAdd.cantidad) {
      setError(`Cantidad no disponible. Máximo: ${itemToAdd.cantidad}`);
      return;
    }
    
    onAdd(itemToAdd, quantity);
    // Resetear el formulario después de agregar
    setSelectedItem('');
    setQuantity(1);
  };

  return (
    <div className="mobiliario-selector-form">
      <div className="form-group">
        <label htmlFor="categoria">Categoría</label>
        <select 
          id="categoria"
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedItem('');
          }} 
          value={selectedCategory} 
          className="form-control form-control-select"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="producto">Producto</label>
        <select 
          id="producto"
          onChange={(e) => setSelectedItem(e.target.value)} 
          value={selectedItem} 
          className="form-control form-control-select" 
          disabled={!selectedCategory}
        >
          <option value="">Selecciona un producto</option>
          {itemsInCategory.map(it => (
            <option key={it.id} value={it.id}>
              {it.producto} (Disponible: {it.cantidad})
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="cantidad">Cantidad</label>
        <input 
          type="number" 
          id="cantidad"
          value={quantity} 
          onChange={(e) => setQuantity(parseInt(e.target.value) || '')} 
          min="1" 
          className="form-control" 
          placeholder="Cantidad"
        />
      </div>
      
      <div className="form-group">
        <label>&nbsp;</label>
        <button 
          type="button" 
          onClick={handleAdd} 
          className="btn btn-add"
          disabled={!selectedCategory || !selectedItem || !quantity}
        >
          Añadir a la lista
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

function EventoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [evento, setEvento] = useState({
    nombre: '',
    tipo_evento: '',
    cantidad_personas: '',
    responsable: '',
    lugar: '',
    estado: 'Por iniciar',
    fecha_inicio: '',
    hora_inicio: '',
  });
  const [tiposEvento, setTiposEvento] = useState([]);
  const [allMobiliario, setAllMobiliario] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [selectedMobiliario, setSelectedMobiliario] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [tiposRes, mobiliarioRes, contentTypesRes] = await Promise.all([
          getTiposEvento(),
          getAllMobiliario(),
          getContentTypes(),
        ]);
        setTiposEvento(tiposRes.data);
        setAllMobiliario(mobiliarioRes);
        setContentTypes(contentTypesRes.data);

        if (id) {
          const { data: eventosData } = await getEventos();
          const currentEvento = eventosData.find(e => e.id === parseInt(id));
          if (currentEvento) {
            setEvento({
              ...currentEvento,
              tipo_evento: currentEvento.tipo_evento.toString(),
              fecha_inicio: currentEvento.fecha_inicio.split('T')[0],
            });
            const mobiliarioExistente = currentEvento.mobiliario_asignado.map(item => {
              const originalItem = mobiliarioRes.find(m => m.id === item.object_id && m.modelName === item.content_type_name);
              return { ...originalItem, cantidad: item.cantidad };
            });
            setSelectedMobiliario(mobiliarioExistente);
          }
        }
      } catch (error) {
        toast.error('Error al cargar datos iniciales');
      }
    };
    loadInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento({ ...evento, [name]: value });
  };

  const handleAddMobiliario = (item, cantidad) => {
    cantidad = parseInt(cantidad, 10);
    const availableStock = item.cantidad;
    if (cantidad > availableStock) {
      toast.error(`Stock insuficiente para ${item.producto}. Disponible: ${availableStock}`);
      return;
    }
    // Evitar duplicados, en su lugar, se podría actualizar la cantidad si ya existe
    if (selectedMobiliario.find(m => m.id === item.id && m.modelName === item.modelName)) {
      toast.error(`${item.producto} ya ha sido añadido.`);
      return;
    }
    setSelectedMobiliario([...selectedMobiliario, { ...item, cantidad }]);
  };

  const handleRemoveMobiliario = (itemToRemove) => {
    setSelectedMobiliario(selectedMobiliario.filter(item => !(item.id === itemToRemove.id && item.modelName === itemToRemove.modelName)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mobiliarioPayload = selectedMobiliario.map(item => {
      // FIX: Use the 'model' field for reliable matching
      const contentType = contentTypes.find(ct => ct.model === item.modelName);
      if (!contentType) {
        throw new Error(`Content type no encontrado para ${item.modelName}`);
      }
      return {
        content_type_id: contentType.id,
        object_id: item.id,
        cantidad: item.cantidad,
      };
    });

    const data = { ...evento, mobiliario: mobiliarioPayload };

    try {
      if (id) {
        if (['Finalizado', 'Cancelado'].includes(evento.estado)) {
          if (!window.confirm(`¿Estás seguro de cambiar el estado a "${evento.estado}"? El inventario será devuelto.`)) return;
        }
        await updateEvento(id, data);
        toast.success('Evento actualizado correctamente');
      } else {
        await createEvento(data);
        toast.success('Evento creado correctamente');
      }
      navigate('/inventory/eventos');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al guardar el evento';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="evento-form-container">
      <form onSubmit={handleSubmit} className="evento-form">
        <h1>{id ? 'Editar' : 'Crear Nuevo'} Evento</h1>
        
        <div className="form-section">
          <h2>Información del Evento</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Evento *</label>
              <input 
                type="text" 
                id="nombre"
                name="nombre" 
                value={evento.nombre} 
                onChange={handleChange} 
                className="form-control" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipo_evento">Tipo de Evento *</label>
              <select 
                id="tipo_evento"
                name="tipo_evento" 
                value={evento.tipo_evento} 
                onChange={handleChange} 
                className="form-control form-control-select" 
                required
              >
                <option value="">Selecciona un tipo de evento</option>
                {tiposEvento.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cantidad_personas">Cantidad de Personas *</label>
              <input 
                type="number" 
                id="cantidad_personas"
                name="cantidad_personas" 
                value={evento.cantidad_personas} 
                onChange={handleChange} 
                className="form-control" 
                min="1"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="responsable">Responsable *</label>
              <input 
                type="text" 
                id="responsable"
                name="responsable" 
                value={evento.responsable} 
                onChange={handleChange} 
                className="form-control" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="lugar">Lugar del Evento *</label>
              <input 
                type="text" 
                id="lugar"
                name="lugar" 
                value={evento.lugar} 
                onChange={handleChange} 
                className="form-control" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado del Evento</label>
              <select 
                id="estado"
                name="estado" 
                value={evento.estado} 
                onChange={handleChange} 
                className="form-control form-control-select"
              >
                <option value="Por iniciar">Por iniciar</option>
                <option value="En proceso">En proceso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fecha_inicio">Fecha del Evento *</label>
              <input 
                type="date" 
                id="fecha_inicio"
                name="fecha_inicio" 
                value={evento.fecha_inicio} 
                onChange={handleChange} 
                className="form-control" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="hora_inicio">Hora de Inicio *</label>
              <input 
                type="time" 
                id="hora_inicio"
                name="hora_inicio" 
                value={evento.hora_inicio} 
                onChange={handleChange} 
                className="form-control" 
                required 
              />
            </div>
          </div>
        </div>

        <div className="mobiliario-section">
          <h2>Mobiliario Requerido</h2>
          
          <div className="mobiliario-selector">
            <h3>Agregar Mobiliario</h3>
            <MobiliarioSelector allMobiliario={allMobiliario} onAdd={handleAddMobiliario} />
          </div>

          {selectedMobiliario.length > 0 ? (
            <div className="selected-mobiliario">
              <h3>Mobiliario Seleccionado</h3>
              <ul className="mobiliario-list">
                {selectedMobiliario.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="mobiliario-item">
                    <div className="mobiliario-info">
                      <div className="mobiliario-name">{item.producto}</div>
                      <div className="mobiliario-quantity">Cantidad: {item.cantidad}</div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveMobiliario(item)} 
                      className="remove-mobiliario"
                      title="Quitar"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="no-items-message">
              No se ha seleccionado ningún mueble o equipo para este evento.
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/inventory/eventos')} 
            className="btn btn-cancel"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-submit"
          >
            {id ? 'Actualizar Evento' : 'Crear Evento'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventoForm;
