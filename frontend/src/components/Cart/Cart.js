// frontend/src/components/Cart/Cart.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import LoadingSpinner from '../Common/LoadingSpinner';
import { formatPrice } from '../../services/api';

const Cart = () => {
  const [isClearing, setIsClearing] = useState(false);
  const { cart, loading, clearCart, getCartTotal, getCartItemsCount } = useCart();

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      setIsClearing(true);
      await clearCart();
      setIsClearing(false);
    }
  };

  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.item.discount > 0 ? item.item.discountedPrice : item.item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateSavings = () => {
    return cart.items.reduce((total, item) => {
      if (item.item.discount > 0) {
        const savings = (item.item.price - item.item.discountedPrice) * item.quantity;
        return total + savings;
      }
      return total;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const savings = calculateSavings();
  const deliveryFee = subtotal > 500 ? 0 : 50; // Free delivery above ₹500
  const total = subtotal + deliveryFee;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="large" message="Loading your cart..." />
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              🛍️ Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            🛒 Shopping Cart
            <span className="ml-3 text-lg font-normal text-gray-600">
              ({getCartItemsCount()} items)
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Actions Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart
                </span>
              </div>
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isClearing ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItem key={item.item._id} item={item} />
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Link
                to="/"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                📋 Order Summary
              </h3>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {/* Savings */}
                {savings > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>You're saving</span>
                    <span className="font-semibold">-{formatPrice(savings)}</span>
                  </div>
                )}

                {/* Delivery */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>

                {/* Free Delivery Message */}
                {deliveryFee > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      💡 Add {formatPrice(500 - subtotal)} more to get FREE delivery!
                    </p>
                  </div>
                )}

                <hr className="my-4" />

                {/* Total */}
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-purple-600">{formatPrice(total)}</span>
                </div>

                {/* Checkout Button */}
                <button className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                  🚀 Proceed to Checkout
                </button>

                {/* Payment Methods */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">We Accept</p>
                  <div className="flex justify-center space-x-2">
                    <div className="bg-gray-100 rounded px-2 py-1">
                      <span className="text-xs font-semibold text-blue-600">VISA</span>
                    </div>
                    <div className="bg-gray-100 rounded px-2 py-1">
                      <span className="text-xs font-semibold text-red-600">MC</span>
                    </div>
                    <div className="bg-gray-100 rounded px-2 py-1">
                      <span className="text-xs font-semibold text-orange-600">UPI</span>
                    </div>
                    <div className="bg-gray-100 rounded px-2 py-1">
                      <span className="text-xs font-semibold text-green-600">GPay</span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-sm text-green-700">
                    <span className="mr-2">🔒</span>
                    Secure checkout with 256-bit SSL encryption
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                👀 You might also like
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <img
                    src="https://via.placeholder.com/50x50?text=📱"
                    alt="Product"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">iPhone 15 Pro</p>
                    <p className="text-sm text-purple-600 font-semibold">₹1,29,999</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <img
                    src="https://via.placeholder.com/50x50?text=👕"
                    alt="Product"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cotton T-Shirt</p>
                    <p className="text-sm text-purple-600 font-semibold">₹899</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;