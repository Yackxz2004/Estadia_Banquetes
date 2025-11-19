import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { getProducts, deleteProduct } from '../api/inventory';
import '../styles/Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts(searchTerm);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-title">Catálogo de Productos</h1>
      </div>

      <div className="search-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre, descripción o color..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/inventory/products/new" className="create-btn">
          <FiPlus /> Nuevo Producto
        </Link>
      </div>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                {product.image ? (
                  <img src={product.image} className="product-image" alt={product.name} />
                ) : (
                  <div className="product-image-placeholder">
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="product-body">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description || 'Sin descripción'}</p>
                <p className="product-colors">
                  <strong>Colores:</strong> {product.colors || 'N/A'}
                </p>
                <div className="product-actions">
                  <Link 
                    to={`/inventory/products/${product.id}`} 
                    className="action-btn edit-btn" 
                    title="Editar"
                  >
                    <FiEdit2 />
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.id)} 
                    className="action-btn delete-btn"
                    title="Eliminar"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No se encontraron productos.</p>
          </div>
        )}
      </div>

      <Link to="/inventory/items" className="back-link">Volver a Inventario</Link>
    </div>
  );
}

export default Products;

