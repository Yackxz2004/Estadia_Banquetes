import api from '../api';

// --- Eventos --- //
export const getEventos = () => api.get('/api/inventory/eventos/');
export const createEvento = (evento) => api.post('/api/inventory/eventos/', evento);
export const updateEvento = (id, evento) => api.put(`/api/inventory/eventos/${id}/`, evento);
export const deleteEvento = (id) => api.delete(`/api/inventory/eventos/${id}/`);

// --- Degustaciones --- //
export const getDegustaciones = () => api.get('/api/inventory/degustaciones/');
export const createDegustacion = (degustacion) => api.post('/api/inventory/degustaciones/', degustacion);
export const updateDegustacion = (id, degustacion) => api.put(`/api/inventory/degustaciones/${id}/`, degustacion);
export const deleteDegustacion = (id) => api.delete(`/api/inventory/degustaciones/${id}/`);

// --- Tipos de Evento --- //
export const getTiposEvento = () => api.get('/api/inventory/tipos-evento/');

// --- Bodegas --- //
export const getBodegas = () => api.get('/api/inventory/bodegas/');

// --- Mobiliario (Items) --- //
// FIX: Use a 'model' property for logic and keep original keys for display/URLs
const mobiliarioEndpoints = {
  'Mantelería': { url: '/api/inventory/mantelerias/', model: 'manteleria' },
  'Cubiertos': { url: '/api/inventory/cubiertos/', model: 'cubierto' },
  'Lozas': { url: '/api/inventory/lozas/', model: 'loza' },
  'Cristalería': { url: '/api/inventory/cristalerias/', model: 'cristaleria' },
  'Sillas': { url: '/api/inventory/sillas/', model: 'silla' },
  'Mesas': { url: '/api/inventory/mesas/', model: 'mesa' },
  'Salas-Lounge': { url: '/api/inventory/salas-lounge/', model: 'salalounge' },
  'Periqueras': { url: '/api/inventory/periqueras/', model: 'periquera' },
  'Carpas': { url: '/api/inventory/carpas/', model: 'carpa' },
  'Pistas y Tarimas': { url: '/api/inventory/pistas-tarimas/', model: 'pistatarima' },
  'Extras': { url: '/api/inventory/extras/', model: 'extra' },
};

export const getAllMobiliario = async () => {
  const categories = Object.keys(mobiliarioEndpoints);
  const requests = categories.map(cat => api.get(mobiliarioEndpoints[cat].url));
  const responses = await Promise.all(requests);

  const allMobiliario = responses.flatMap((response, index) => {
    const categoryName = categories[index];
    const modelName = mobiliarioEndpoints[categoryName].model;
    return response.data.map(item => ({ 
      ...item, 
      categoryName, // For display in the UI
      modelName     // For logic (matching with content type)
    }));
  });

  return allMobiliario;
};

// --- Content Types --- //
export const getContentTypes = () => api.get('/api/inventory/content-types/');

// --- Products --- //
export const getProducts = (search = '') => api.get(`/api/inventory/products/?search=${search}`);

export const createProduct = (productData) => {
  return api.post('/api/inventory/products/', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = (id, productData) => {
  return api.put(`/api/inventory/products/${id}/`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = (id) => api.delete(`/api/inventory/products/${id}/`);

// --- Mantenimiento --- //
export const enviarAMantenimiento = (itemType, itemId, cantidad) => {
  const url = `/api/inventory/${itemType}/${itemId}/mantenimiento/`;
  return api.post(url, { cantidad });
};

export const reintegrarDeMantenimiento = (itemType, itemId, cantidad) => {
  const url = `/api/inventory/${itemType}/${itemId}/reintegrar/`;
  return api.post(url, { cantidad });
};
