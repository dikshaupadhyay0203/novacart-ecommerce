// frontend/src/components/Cart/CartItem.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../services/api';

const CartItem = ({ item }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity === quantity) return;

    setIsUpdating(true);
    const result = await updateCartItem(item.item._id, newQuantity);
    
    if (result.success) {
      setQuantity(newQuantity);
    } else {
      // Reset quantity on error
      setQuantity(item.quantity);
    }
    
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      setIsUpdating(true);
      await removeFromCart(item.item._id);
      setIsUpdating(false);
    }
  };

  const incrementQuantity = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    handleQuantityChange(newQty);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      handleQuantityChange(newQty);
    }
  };

  const itemTotal = item.price * quantity;
  const discountedPrice = item.item.discount > 0 ? item.item.discountedPrice : item.item.price;
  const savings = item.item.discount > 0 ? (item.item.price - discountedPrice) * quantity : 0;

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link to={`/product/${item.item._id}`}>
            <img
              src={item.item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
              alt={item.item.name}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-grow min-w-0">
          <Link to={`/product/${item.item._id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors duration-200 line-clamp-1">
              {item.item.name}
            </h3>
          </Link>
          
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
              {item.item.category}
            </span>
            {!item.item.inStock && (
              <span className="text-sm text-red-600 font-medium bg-red-100 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Price Information */}
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>
            {item.item.discount > 0 && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(item.item.price)}
                </span>
                <span className="text-sm text-green-600 font-semibold">
                  {item.item.discount}% off
                </span>
              </>
            )}
          </div>

          {/* Mobile: Quantity and Actions */}
          <div className="md:hidden mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1 || isUpdating}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  −
                </button>
                <span className="px-4 py-1 border-l border-r border-gray-300 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={isUpdating}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleRemove}
              disabled={isUpdating}
              className="text-red-600 hover:text-red-800 p-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove item"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Desktop: Quantity Controls */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Qty:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1 || isUpdating}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                −
              </button>
              <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                disabled={isUpdating}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col items-end space-y-2 min-w-[120px]">
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(itemTotal)}
            </div>
            {savings > 0 && (
              <div className="text-sm text-green-600 font-medium">
                You save {formatPrice(savings)}
              </div>
            )}
          </div>

          {/* Desktop Remove Button */}
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="hidden md:flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-1">🗑️</span>
            Remove
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
            <span className="text-sm text-gray-600">Updating...</span>
          </div>
        </div>
      )}

      {/* Stock Warning */}
      {!item.item.inStock && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <p className="text-sm text-red-700">
              This item is currently out of stock. You may want to remove it or save it for later.
            </p>
          </div>
        </div>
      )}

      {/* Quantity Warning */}
      {item.item.quantity && quantity > item.item.quantity && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <p className="text-sm text-yellow-700">
              Only {item.item.quantity} items left in stock. Consider reducing quantity.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;