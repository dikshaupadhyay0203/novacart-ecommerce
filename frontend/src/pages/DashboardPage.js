import React from 'react';
import { useAuth } from '../context/AuthContext';

const categories = [
  "Women's Dress",
  "Ethnic Dress",
  "Tops",
  "Shirts",
  "Jeans",
  "Shorts",
  "Skirts",
  "Innerwear"
];

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to Women's Fashion World</h1>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
        {categories.map((category) => (
          <div key={category} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center text-lg font-semibold text-gray-800 hover:shadow-xl cursor-pointer transition-shadow duration-300">
            {category}
          </div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome back, {user?.name || 'User'}!</h2>
        <p className="mb-8">Manage your account and explore our products</p>
        <button onClick={handleLogout} className="px-6 py-3 bg-yellow-400 text-purple-900 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-200 transform hover:scale-105">
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
