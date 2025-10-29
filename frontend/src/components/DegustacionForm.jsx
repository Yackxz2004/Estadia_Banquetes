import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDegustacion, updateDegustacion, getDegustaciones, getAllMobiliario, getContentTypes } from '../api/inventory';
import { toast } from 'react-hot-toast';

// El componente MobiliarioSelector se puede reutilizar tal cual o mover a su propio archivo si se prefiere.
const MobiliarioSelector = ({ allMobiliario, onAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);

  const categories = [...new Set(allMobiliario.map(m => m.categoryName))];
  const itemsInCategory = allMobiliario.filter(m => m.categoryName === selectedCategory);

  const handleAdd = () => {
    const itemToAdd = itemsInCategory.find(m => m.id === parseInt(selectedItem));
    if (!itemToAdd || !quantity) return;
    onAdd(itemToAdd, quantity);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border rounded mb-4">
      <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} className="p-2 border rounded">
        <option value="">Selecciona Categoría</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <select onChange={(e) => setSelectedItem(e.target.value)} value={selectedItem} className="p-2 border rounded" disabled={!selectedCategory}>
        <option value="">Selecciona Producto</option>
        {itemsInCategory.map(it => <option key={it.id} value={it.id}>{it.producto} (Disp: {it.cantidad})</option>)}
      </select>
      <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" className="p-2 border rounded" />
      <button type="button" onClick={handleAdd} className="bg-blue-500 text-white p-2 rounded">Añadir</button>
    </div>
  );
};

function DegustacionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
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
            setDegustacion({
              ...currentDegustacion,
              fecha_degustacion: currentDegustacion.fecha_degustacion.split('T')[0],
              fecha_evento: currentDegustacion.fecha_evento.split('T')[0],
            });
            const mobiliarioExistente = currentDegustacion.mobiliario_asignado.map(item => {
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
    const mobiliarioPayload = selectedMobiliario.map(item => {
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

    const data = { ...degustacion, mobiliario: mobiliarioPayload };

    try {
      if (id) {
        if (['Finalizado', 'Cancelado'].includes(degustacion.estado)) {
          if (!window.confirm(`¿Estás seguro de cambiar el estado a "${degustacion.estado}"? El inventario será devuelto.`)) return;
        }
        await updateDegustacion(id, data);
        toast.success('Degustación actualizada correctamente');
      } else {
        await createDegustacion(data);
        toast.success('Degustación creada correctamente');
      }
      navigate('/inventory/degustaciones');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al guardar la degustación';
      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">{id ? 'Editar' : 'Crear'} Degustación</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="nombre" value={degustacion.nombre} onChange={handleChange} placeholder="Nombre de la Degustación" className="p-2 border rounded" required />
        <input type="number" name="cantidad_personas" value={degustacion.cantidad_personas} onChange={handleChange} placeholder="Cantidad de Personas" className="p-2 border rounded" required />
        <input name="responsable" value={degustacion.responsable} onChange={handleChange} placeholder="Responsable" className="p-2 border rounded" required />
        <textarea name="alimentos" value={degustacion.alimentos} onChange={handleChange} placeholder="Alimentos" className="p-2 border rounded md:col-span-2" required />
        <select name="estado" value={degustacion.estado} onChange={handleChange} className="p-2 border rounded">
          <option value="Por iniciar">Por iniciar</option>
          <option value="En proceso">En proceso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Degustación</label>
          <input type="date" name="fecha_degustacion" value={degustacion.fecha_degustacion} onChange={handleChange} className="p-2 border rounded w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hora Degustación</label>
          <input type="time" name="hora_degustacion" value={degustacion.hora_degustacion} onChange={handleChange} className="p-2 border rounded w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha del Evento</label>
          <input type="date" name="fecha_evento" value={degustacion.fecha_evento} onChange={handleChange} className="p-2 border rounded w-full" required />
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Añadir Mobiliario</h2>
        <MobiliarioSelector allMobiliario={allMobiliario} onAdd={handleAddMobiliario} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Mobiliario Seleccionado</h2>
        <ul className="space-y-2">
          {selectedMobiliario.map((item, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{item.producto} - <b>Cantidad: {item.cantidad}</b></span>
              <button type="button" onClick={() => handleRemoveMobiliario(item)} className="text-red-500">Quitar</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end mt-8">
        <button type="button" onClick={() => navigate('/inventory/degustaciones')} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancelar</button>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Guardar Degustación</button>
      </div>
    </form>
  );
}

export default DegustacionForm;
