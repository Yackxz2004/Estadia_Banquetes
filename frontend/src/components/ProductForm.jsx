import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createProduct, getProducts, updateProduct } from '../api/inventory';

function ProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await getProducts(); // Assuming getProducts can fetch a single product by filtering or a dedicated function
          const product = response.data.find(p => p.id === parseInt(id));
          if (product) {
            setName(product.name);
            setDescription(product.description);
            setColors(product.colors);
            if (product.image) {
              setImagePreview(product.image);
            }
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('colors', colors);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (id) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate('/inventory/products');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>{id ? 'Editar Producto' : 'Añadir Producto'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre del Producto</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="colors" className="form-label">Colores (separados por comas)</label>
          <input
            type="text"
            className="form-control"
            id="colors"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Imagen del Producto</label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        {imagePreview && (
          <div className="mb-3">
            <p>Imagen actual:</p>
            <img src={imagePreview} alt="Vista previa" style={{ width: '200px', height: 'auto' }} />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Guardar Producto</button>
      </form>
    </div>
  );
}

export default ProductForm;

