import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI, handleApiError } from '../services/api';
import ProductCard from '../components/Products/ProductCard';
import { useCart } from '../context/CartContext';

const categories = [
  { name: "Women's Dress", icon: "👗", route: "/category/womens-dress" },
  { name: "Ethnic Dress", icon: "🪔", route: "/category/ethnic-dress" },
  { name: "Tops", icon: "👕", route: "/category/tops" },
  { name: "Shirts", icon: "👔", route: "/category/shirts" },
  { name: "Jeans", icon: "👖", route: "/category/jeans" },
  { name: "Shorts", icon: "🩳", route: "/category/shorts" },
  { name: "Skirts", icon: "👗", route: "/category/skirts" },
  { name: "Innerwear", icon: "🩲", route: "/category/innerwear" }
];

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [dresses, setDresses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDresses = async () => {
      try {
        const response = await itemsAPI.getAll({ category: "Women's Dress", limit: 10 });
        setDresses(response.data.data.items);
      } catch (err) {
        setError(handleApiError(err));
      }
    };
    fetchDresses();
  }, []);

  const handleCategoryClick = (route) => {
    navigate(route);
  };

  const handleAddToCart = (item) => {
    addToCart(item._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-12">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-extrabold mb-8 text-gray-900">Welcome to Women's Fashion World</h1>
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => handleCategoryClick(category.route)}
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-xl font-semibold text-gray-900 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
          >
            <span className="text-7xl mb-4">{category.icon}</span>
            {category.name}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Featured Women's Dresses</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dresses.map((dress) => (
            <ProductCard
              key={dress._id}
              product={dress}
              onAddToCart={() => handleAddToCart(dress)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
