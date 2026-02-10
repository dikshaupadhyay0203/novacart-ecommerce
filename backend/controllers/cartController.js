// backend/controllers/cartController.js
const Cart = require('../models/Cart');
const Item = require('../models/Item');

// Get user's cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.item',
        select: 'name price image category inStock quantity discount'
      });

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = new Cart({ user: req.user._id });
      await cart.save();
    }

    // Filter out items that no longer exist
    const validItems = cart.items.filter(item => item.item !== null);
    
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json({
      success: true,
      data: {
        cart: {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          lastUpdated: cart.lastUpdated
        }
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cart'
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    // Check if item exists and is in stock
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (!item.inStock || item.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Item is out of stock or insufficient quantity available'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id });
    }

    // Use discounted price if available
    const price = item.discount > 0 ? item.discountedPrice : item.price;

    // Add item to cart
    cart.addItem(itemId, price, Number(quantity));
    await cart.save();

    // Populate the cart items for response
    await cart.populate({
      path: 'items.item',
      select: 'name price image category inStock quantity discount'
    });

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart: {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice
        }
      }
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error adding item to cart'
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    if (!itemId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and quantity are required'
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if item exists in inventory and has sufficient stock
    if (quantity > 0) {
      const item = await Item.findById(itemId);
      if (!item || !item.inStock || item.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Item is out of stock or insufficient quantity available'
        });
      }
    }

    // Update item quantity (or remove if quantity is 0)
    cart.updateItemQuantity(itemId, Number(quantity));
    await cart.save();

    // Populate the cart items for response
    await cart.populate({
      path: 'items.item',
      select: 'name price image category inStock quantity discount'
    });

    res.json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully',
      data: {
        cart: {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice
        }
      }
    });

  } catch (error) {
    console.error('Update cart error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating cart'
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item from cart
    cart.removeItem(itemId);
    await cart.save();

    // Populate the cart items for response
    await cart.populate({
      path: 'items.item',
      select: 'name price image category inStock quantity discount'
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        cart: {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice
        }
      }
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error removing item from cart'
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Clear cart
    cart.clearCart();
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      }
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing cart'
    });
  }
};

// Get cart summary
const getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart || cart.items.length === 0) {
      return res.json({
        success: true,
        data: {
          summary: {
            totalItems: 0,
            totalPrice: 0,
            itemCount: 0
          }
        }
      });
    }

    res.json({
      success: true,
      data: {
        summary: {
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          itemCount: cart.items.length
        }
      }
    });

  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cart summary'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
};