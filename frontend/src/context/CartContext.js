// frontend/src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI, handleApiError } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load cart when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data.data.cart);
      setError(null);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error('Error loading cart:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    if (!isAuthenticated) {
      setError('Please log in to add items to cart');
      return { success: false, message: 'Please log in to add items to cart' };
    }

    try {
      setLoading(true);
      const response = await cartAPI.add({ itemId, quantity });
      setCart(response.data.data.cart);
      setError(null);
      return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) {
      setError('Please log in to update cart');
      return { success: false };
    }

    try {
      setLoading(true);
      const response = await cartAPI.update({ itemId, quantity });
      setCart(response.data.data.cart);
      setError(null);
      return { success: true };
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) {
      setError('Please log in to remove items from cart');
      return { success: false };
    }

    try {
      setLoading(true);
      const response = await cartAPI.remove(itemId);
      setCart(response.data.data.cart);
      setError(null);
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setError('Please log in to clear cart');
      return { success: false };
    }

    try {
      setLoading(true);
      await cartAPI.clear();
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      setError(null);
      return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getItemQuantityInCart = (itemId) => {
    const cartItem = cart.items.find(item => item.item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const isItemInCart = (itemId) => {
    return cart.items.some(item => item.item._id === itemId);
  };

  const getCartTotal = () => {
    return cart.totalPrice || 0;
  };

  const getCartItemsCount = () => {
    return cart.totalItems || 0;
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getItemQuantityInCart,
    isItemInCart,
    getCartTotal,
    getCartItemsCount,
    clearError,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};