import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { itemsAPI, handleApiError } from '../services/api';
import ProductCard from '../components/Products/ProductCard';
import { useCart } from '../context/CartContext';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await itemsAPI.getAll({ category: categoryName });
        setProducts(response.data.data.items);
      } catch (err) {
        setError(handleApiError(err));
      }
    };
    fetchProducts();
  }, [categoryName]);

  const handleAddToCart = (item) => {
    addToCart(item._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-8 text-gray-900 capitalize">{categoryName.replace(/-/g, ' ')}</h1>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
