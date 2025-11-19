import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { createProduct, getProducts, updateProduct } from '../api/inventory';
import '../styles/ProductForm.css';

function ProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await getProducts();
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
          setError('Error al cargar el producto');
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!name.trim()) {
      setError('El nombre del producto es requerido');
      setIsLoading(false);
      return;
    }

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
      setError('Error al guardar el producto. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setImagePreview('');
  };

  return (
    <div className="productform-container">
      <div className="productform-header">
        <Link to="/inventory/products" className="back-btn">
          <FiArrowLeft /> Volver
        </Link>
        <h1 className="productform-title">
          {id ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      <div className="productform-wrapper">
        <form onSubmit={handleSubmit} className="productform">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-section">
            <h2 className="section-title">Información del Producto</h2>

            <div className="form-group">
              <label htmlFor="name">Nombre del Producto *</label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Mantel Premium"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                className="form-textarea"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el producto en detalle..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="colors">Colores (separados por comas)</label>
              <input
                type="text"
                id="colors"
                className="form-input"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="Ej: Blanco, Negro, Rojo"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Imagen del Producto</h2>

            <div className="form-group">
              <label htmlFor="image">Seleccionar Imagen</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="image"
                  className="file-input"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <span className="file-input-label">
                  {image ? image.name : 'Selecciona una imagen...'}
                </span>
              </div>
            </div>

            {imagePreview && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img src={imagePreview} alt="Vista previa del producto" />
                </div>
                <button
                  type="button"
                  className="clear-image-btn"
                  onClick={handleClearImage}
                  title="Eliminar imagen"
                >
                  <FiX /> Eliminar imagen
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <Link to="/inventory/products" className="btn btn-secondary">
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              <FiSave /> {isLoading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;

