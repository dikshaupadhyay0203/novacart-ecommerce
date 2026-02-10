// frontend/src/pages/CartPage.js
import React from 'react';
import Cart from '../components/Cart/Cart';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

const CartPage = () => {
  return (
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  );
};

export default CartPage;