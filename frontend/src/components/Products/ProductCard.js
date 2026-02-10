import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    const result = await addToCart(product._id, 1);
    
    if (result.success) {
      // Show success feedback
      setTimeout(() => setIsAdding(false), 1000);
    } else {
      setIsAdding(false);
      alert(result.message || 'Failed to add item to cart');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    
    return stars.join('');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      dresses: '👗',
      tops: '👚',
      jeans: '👖',
      lowers: '🩱',
      innerwear: '🩲',
      ethnic: '🥻',
      sexy: '💃'
    };
    return icons[category] || '👗';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      dresses: 'Dresses',
      tops: 'Tops',
      jeans: 'Jeans',
      lowers: 'Lowers',
      innerwear: 'Innerwear',
      ethnic: 'Ethnic Wear',
      sexy: 'Party Wear'
    };
    return labels[category] || category;
  };

  return (
    <div className="product-card">
      {/* Product Badges */}
      <div className="product-badges">
        {product.isFeatured && <span className="badge featured">⭐ Featured</span>}
        {product.isOnSale && <span className="badge sale">🔥 Sale</span>}
        {product.stock < 5 && product.stock > 0 && (
          <span className="badge limited">⚡ Only {product.stock} left</span>
        )}
      </div>

      <div className="product-image">
        <img 
          src={product.image} 
          alt={product.name}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/300x300/FFB6C1/FFFFFF?text=${encodeURIComponent(product.name)}`;
          }}
        />
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">
            Out of Stock
          </div>
        )}
        
        {/* Quick View on Hover */}
        <div className="product-overlay">
          <button className="quick-view-btn">👁️ Quick View</button>
        </div>
      </div>

      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-category-badge">
            <span className="category-icon">{getCategoryIcon(product.category)}</span>
            <span className="category-text">{getCategoryLabel(product.category)}</span>
          </div>
        </div>
        
        <p className="product-description">
          {product.description.length > 80 
            ? `${product.description.substring(0, 80)}...` 
            : product.description
          }
        </p>

        <div className="product-details">
          <div className="brand-material">
            <span className="product-brand">👜 {product.brand}</span>
            <span className="product-material">🧵 {product.material}</span>
          </div>
          
          {/* Sizes Available */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="sizes-available">
              <span className="sizes-label">📏 Sizes:</span>
              <div className="sizes-list">
                {product.sizes.slice(0, 4).map((size, index) => (
                  <span key={index} className="size-tag">{size}</span>
                ))}
                {product.sizes.length > 4 && <span className="size-more">+{product.sizes.length - 4}</span>}
              </div>
            </div>
          )}

          {/* Colors Available */}
          {product.colors && product.colors.length > 0 && (
            <div className="colors-available">
              <span className="colors-label">🎨 Colors:</span>
              <div className="colors-list">
                {product.colors.slice(0, 3).map((color, index) => (
                  <span 
                    key={index} 
                    className="color-dot"
                    style={{backgroundColor: color.toLowerCase()}}
                    title={color}
                  ></span>
                ))}
                {product.colors.length > 3 && (
                  <span className="color-more">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="product-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-text">
            {product.rating} ({product.numReviews} reviews)
          </span>
        </div>

        <div className="product-footer">
          <div className="price-section">
            <div className="price-container">
              {product.salePrice ? (
                <>
                  <span className="sale-price">{formatPrice(product.salePrice)}</span>
                  <span className="original-price">{formatPrice(product.price)}</span>
                  <span className="discount-percent">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="price">{formatPrice(product.price)}</span>
              )}
            </div>
            <span className="stock-info">
              {product.stock > 10 
                ? '📦 In Stock' 
                : product.stock > 0 
                ? `⚡ Only ${product.stock} left` 
                : '❌ Out of Stock'
              }
            </span>
          </div>

          <div className="product-actions">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding || loading}
              className={`add-to-cart-btn ${isAdding ? 'adding' : ''} ${product.stock === 0 ? 'out-of-stock' : ''}`}
            >
              {isAdding ? (
                <>
                  <span className="loading-spinner"></span>
                  Adding...
                </>
              ) : product.stock === 0 ? (
                '❌ Out of Stock'
              ) : (
                '🛒 Add to Cart'
              )}
            </button>
            
            <button className="wishlist-btn" title="Add to Wishlist">
              ❤️
            </button>
          </div>
        </div>

        {/* Product Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="product-tags">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="product-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

