import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/inventory';

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
        fetchProducts(); // Recargar la lista de productos
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Catálogo de Productos</h1>
        <Link to="/inventory/products/new" className="btn btn-primary">Añadir Producto</Link>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, descripción o color..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card">
              {product.image && <img src={product.image} className="card-img-top" alt={product.name} />}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text"><small className="text-muted">Colores: {product.colors}</small></p>
                <Link to={`/inventory/products/${product.id}`} className="btn btn-secondary btn-sm me-2">Editar</Link>
                <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;

