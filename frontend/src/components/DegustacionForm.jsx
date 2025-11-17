import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDegustacion, updateDegustacion, getDegustaciones, getAllMobiliario, getContentTypes } from '../api/inventory';
import { toast } from 'react-hot-toast';
import { FiSave, FiX, FiCalendar, FiClock, FiUser, FiUsers, FiPackage, FiPlus, FiTrash2, FiEdit2, FiInfo, FiTag } from 'react-icons/fi';
import '../styles/Degustaciones.css';

// El componente MobiliarioSelector se puede reutilizar tal cual o mover a su propio archivo si se prefiere.
const MobiliarioSelector = ({ allMobiliario, onAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const categories = [...new Set(allMobiliario.map(m => m.categoryName))];
  const itemsInCategory = allMobiliario.filter(m => m.categoryName === selectedCategory);

  const handleAdd = () => {
    if (!selectedCategory || !selectedItem || !quantity) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    const itemToAdd = itemsInCategory.find(m => m.id === parseInt(selectedItem));
    if (!itemToAdd) return;
    
    if (quantity < 1) {
      setError('La cantidad debe ser al menos 1');
      return;
    }
    
    if (quantity > itemToAdd.cantidad) {
      setError(`No hay suficiente stock. Disponible: ${itemToAdd.cantidad}`);
      return;
    }
    
    setError('');
    onAdd(itemToAdd, quantity);
    setSelectedItem('');
    setQuantity(1);
  };

  return (
    <div className="mobiliario-selector">
      <div className="form-grid">
        <div className="form-group">
          <label>Categoría</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedItem('');
              setError('');
            }}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => 
              <option key={cat} value={cat}>{cat}</option>
            )}
          </select>
        </div>
        
        <div className="form-group">
          <label>Producto</label>
          <select 
            value={selectedItem} 
            onChange={(e) => {
              setSelectedItem(e.target.value);
              setError('');
            }}
            disabled={!selectedCategory}
          >
            <option value="">Selecciona un producto</option>
            {itemsInCategory.map(it => (
              <option key={it.id} value={it.id}>
                {it.producto} (Disp: {it.cantidad})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Cantidad</label>
          <input 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={(e) => {
              setQuantity(parseInt(e.target.value) || '');
              setError('');
            }}
          />
        </div>
        
        <div className="form-group">
          <button 
            type="button" 
            onClick={handleAdd} 
            className="btn btn-primary"
            disabled={!selectedCategory || !selectedItem || !quantity}
          >
            <FiPlus /> Añadir
          </button>
        </div>
      </div>
      
      {error && (
        <div className="form-error">
          <FiInfo className="icon" /> {error}
        </div>
      )}
    </div>
  );
};

function DegustacionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [degustacion, setDegustacion] = useState({
    nombre: '',
    cantidad_personas: '',
    responsable: '',
    alimentos: '',
    estado: 'Por iniciar',
    fecha_degustacion: '',
    hora_degustacion: '',
    fecha_evento: '',
  });
  const [allMobiliario, setAllMobiliario] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [selectedMobiliario, setSelectedMobiliario] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [mobiliarioRes, contentTypesRes] = await Promise.all([
          getAllMobiliario(),
          getContentTypes(),
        ]);
        setAllMobiliario(mobiliarioRes);
        setContentTypes(contentTypesRes.data);

        if (id) {
          const { data: degustacionesData } = await getDegustaciones();
          const currentDegustacion = degustacionesData.find(d => d.id === parseInt(id));
          if (currentDegustacion) {
            console.log('Degustación cargada:', currentDegustacion);
            
            // Formatear fechas para los inputs
            const formatDate = (dateString) => {
              if (!dateString) return '';
              const date = new Date(dateString);
              return date.toISOString().split('T')[0];
            };

            setDegustacion({
              ...currentDegustacion,
              fecha_degustacion: formatDate(currentDegustacion.fecha_degustacion),
              fecha_evento: formatDate(currentDegustacion.fecha_evento),
              // Asegurarse de que los números sean números, no strings
              cantidad_personas: currentDegustacion.cantidad_personas?.toString() || '',
            });

            // Mapear el mobiliario existente
            if (currentDegustacion.mobiliario_asignado) {
              const mobiliarioExistente = currentDegustacion.mobiliario_asignado.map(item => {
                const originalItem = mobiliarioRes.find(m => 
                  m.id === item.object_id && 
                  m.modelName === item.content_type_name
                );
                
                if (!originalItem) {
                  console.warn('No se encontró el ítem original:', item);
                  return null;
                }
                
                return { 
                  ...originalItem, 
                  cantidad: item.cantidad,
                  // Asegurarse de que el content type esté disponible
                  contentTypeId: contentTypesRes.data.find(ct => ct.model === item.content_type_name)?.id
                };
              }).filter(Boolean); // Filtrar nulos
              
              console.log('Mobiliario existente mapeado:', mobiliarioExistente);
              setSelectedMobiliario(mobiliarioExistente);
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        toast.error('Error al cargar datos iniciales');
      }
    };
    loadInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDegustacion({ ...degustacion, [name]: value });
  };

  const handleAddMobiliario = (item, cantidad) => {
    cantidad = parseInt(cantidad, 10);
    const availableStock = item.cantidad;
    if (cantidad > availableStock) {
      toast.error(`Stock insuficiente para ${item.producto}. Disponible: ${availableStock}`);
      return;
    }
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
    setIsSubmitting(true);
    
    try {
      console.log('Iniciando envío de datos...');
      
      // Obtener los content types primero
      const contentTypesRes = await getContentTypes();
      console.log('Content Types recibidos:', contentTypesRes.data);
      
      const contentTypeMap = {};
      contentTypesRes.data.forEach(ct => {
        contentTypeMap[ct.model] = ct.id;
      });
      console.log('Content Type Map:', contentTypeMap);

      // Validar que todos los items tengan un content type válido
      const mobiliarioPayload = selectedMobiliario.map(item => {
        const contentTypeId = contentTypeMap[item.modelName];
        if (!contentTypeId) {
          const errorMsg = `No se encontró el content type para: ${item.modelName}`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        // Asegurarse de que los valores sean números
        const cantidad = parseInt(item.cantidad, 10);
        const objectId = parseInt(item.id, 10);
        
        if (isNaN(cantidad) || cantidad < 1) {
          throw new Error(`Cantidad inválida para ${item.producto}`);
        }
        
        if (isNaN(objectId)) {
          throw new Error(`ID inválido para ${item.producto}`);
        }
        
        return {
          content_type_id: contentTypeId,  // Changed from content_type to content_type_id
          object_id: objectId,
          cantidad: cantidad,
        };
      });

      console.log('Mobiliario Payload:', mobiliarioPayload);

      // Validar fechas
      const fechaDegustacion = degustacion.fecha_degustacion ? new Date(degustacion.fecha_degustacion) : null;
      const fechaEvento = degustacion.fecha_evento ? new Date(degustacion.fecha_evento) : null;
      
      if (!fechaDegustacion || isNaN(fechaDegustacion.getTime())) {
        throw new Error('La fecha de degustación no es válida');
      }
      
      if (!fechaEvento || isNaN(fechaEvento.getTime())) {
        throw new Error('La fecha del evento no es válida');
      }

      // Crear una copia de degustacion para no modificar el estado directamente
      const data = { 
        ...degustacion,
        mobiliario: mobiliarioPayload,
        // Formatear fechas a ISO string
        fecha_degustacion: fechaDegustacion.toISOString().split('T')[0],
        fecha_evento: fechaEvento.toISOString().split('T')[0],
        cantidad_personas: parseInt(degustacion.cantidad_personas, 10) || 1,
        // Asegurarse de que no se envíen campos innecesarios
        id: id ? parseInt(id, 10) : undefined,
      };

      console.log('Datos a enviar al servidor:', JSON.stringify(data, null, 2));

      if (id) {
        if (['Finalizado', 'Cancelado'].includes(degustacion.estado)) {
          if (!window.confirm(`¿Estás seguro de cambiar el estado a "${degustacion.estado}"? El inventario será devuelto.`)) {
            setIsSubmitting(false);
            return;
          }
        }
        
        console.log('Actualizando degustación con ID:', id);
        const response = await updateDegustacion(id, data);
        console.log('Respuesta del servidor:', response);
        toast.success('Degustación actualizada correctamente');
      } else {
        console.log('Creando nueva degustación');
        // Eliminar el ID si existe en el objeto data para la creación
        const { id: _, ...createData } = data;
        const response = await createDegustacion(createData);
        console.log('Respuesta del servidor:', response);
        toast.success('Degustación creada correctamente');
      }
      
      navigate('/inventory/degustaciones');
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      console.error('Error response:', error.response);
      
      let errorMsg = 'Error al guardar la degustación';
      
      if (error.response) {
        // El servidor respondió con un estado de error
        if (error.response.data) {
          errorMsg = error.response.data.error || 
                    error.response.data.detail || 
                    JSON.stringify(error.response.data);
        }
        errorMsg += ` (${error.response.status} ${error.response.statusText})`;
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMsg = 'No se recibió respuesta del servidor. Verifica tu conexión.';
      } else {
        // Algo pasó en la configuración de la solicitud
        errorMsg = error.message || 'Error al configurar la solicitud';
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para formatear la fecha al formato YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="degustacion-form">
      <form onSubmit={handleSubmit}>
        <h1>
          <FiPackage className="icon" /> {id ? 'Editar' : 'Crear'} Degustación
        </h1>
        
        {error && (
          <div className="form-error">
            <FiInfo className="icon" /> {error}
          </div>
        )}
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre">
              <FiTag className="icon" /> Nombre de la Degustación <span className="required">*</span>
            </label>
            <input 
              type="text" 
              id="nombre"
              name="nombre" 
              value={degustacion.nombre} 
              onChange={handleChange} 
              placeholder="Ej: Degustación Menú Primavera"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cantidad_personas">
              <FiUsers className="icon" /> Cantidad de Personas <span className="required">*</span>
            </label>
            <input 
              type="number" 
              id="cantidad_personas"
              name="cantidad_personas" 
              min="1"
              value={degustacion.cantidad_personas} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="responsable">
              <FiUser className="icon" /> Responsable <span className="required">*</span>
            </label>
            <input 
              type="text" 
              id="responsable"
              name="responsable" 
              value={degustacion.responsable} 
              onChange={handleChange} 
              placeholder="Nombre del responsable"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="estado">
              <FiInfo className="icon" /> Estado <span className="required">*</span>
            </label>
            <select 
              id="estado"
              name="estado" 
              value={degustacion.estado} 
              onChange={handleChange}
              required
            >
              <option value="Por iniciar">Por iniciar</option>
              <option value="En proceso">En proceso</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="fecha_degustacion">
              <FiCalendar className="icon" /> Fecha de Degustación <span className="required">*</span>
            </label>
            <input 
              type="date" 
              id="fecha_degustacion"
              name="fecha_degustacion" 
              value={formatDateForInput(degustacion.fecha_degustacion)} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hora_degustacion">
              <FiClock className="icon" /> Hora de Degustación <span className="required">*</span>
            </label>
            <input 
              type="time" 
              id="hora_degustacion"
              name="hora_degustacion" 
              value={degustacion.hora_degustacion || ''} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fecha_evento">
              <FiCalendar className="icon" /> Fecha del Evento <span className="required">*</span>
            </label>
            <input 
              type="date" 
              id="fecha_evento"
              name="fecha_evento" 
              value={formatDateForInput(degustacion.fecha_evento)} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="alimentos">
              <FiPackage className="icon" /> Alimentos y Bebidas <span className="required">*</span>
            </label>
            <textarea 
              id="alimentos"
              name="alimentos" 
              value={degustacion.alimentos} 
              onChange={handleChange} 
              placeholder="Describa los alimentos y bebidas que se servirán..."
              rows="4"
              required 
            />
            <p className="form-hint">Separe los elementos con comas</p>
          </div>
        </div>
        
        <div className="mobiliario-section">
          <h2>
            <FiPackage className="icon" /> Mobiliario Requerido
          </h2>
          
          <MobiliarioSelector allMobiliario={allMobiliario} onAdd={handleAddMobiliario} />
          
          {selectedMobiliario.length > 0 ? (
            <div className="mobiliario-grid">
              {selectedMobiliario.map((item, index) => (
                <div key={`${item.id}-${index}`} className="mobiliario-card">
                  <div className="mobiliario-info">
                    <h4>{item.producto}</h4>
                    <p>{item.categoryName} • Cantidad: {item.cantidad}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveMobiliario(item)} 
                    className="action-btn delete-btn"
                    title="Quitar"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-mobiliario">
              <FiInfo className="icon" />
              <p>No se ha seleccionado ningún mobiliario</p>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/inventory/degustaciones')} 
            className="btn btn-secondary"
          >
            <FiX /> Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Guardando...
              </>
            ) : (
              <>
                <FiSave />
                {id ? 'Actualizar' : 'Guardar'} Degustación
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DegustacionForm;
