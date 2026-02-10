// backend/controllers/itemController.js
const Item = require('../models/Item');

// Get all items with filters and pagination
const getAllItems = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12,
      featured,
      inStock
    } = req.query;

    // Build filter object
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (inStock === 'true') {
      filter.inStock = true;
      filter.quantity = { $gt: 0 };
    }

    // Build sort object
    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption.price = 1;
        break;
      case 'price-high':
        sortOption.price = -1;
        break;
      case 'name':
        sortOption.name = 1;
        break;
      case 'newest':
        sortOption.createdAt = -1;
        break;
      case 'rating':
        sortOption['rating.average'] = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const items = await Item.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const totalItems = await Item.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / Number(limit));

    // Get categories for filter options
    const categories = await Item.distinct('category');

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        },
        filters: {
          categories: categories.sort()
        }
      }
    });

  } catch (error) {
    console.error('Get all items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching items'
    });
  }
};

// Get single item by ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: { item }
    });

  } catch (error) {
    console.error('Get item by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error fetching item'
    });
  }
};

// Create new item (admin only)
const createItem = async (req, res) => {
  try {
    const itemData = req.body;

    // Create new item
    const item = new Item(itemData);
    await item.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item }
    });

  } catch (error) {
    console.error('Create item error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating item'
    });
  }
};

// Update item (admin only)
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await Item.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: { item }
    });

  } catch (error) {
    console.error('Update item error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating item'
    });
  }
};

// Delete item (admin only)
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    console.error('Delete item error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error deleting item'
    });
  }
};

// Get featured items
const getFeaturedItems = async (req, res) => {
  try {
    const items = await Item.find({ featured: true, inStock: true })
      .limit(8)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { items }
    });

  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured items'
    });
  }
};

// Search items
const searchItems = async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let filter = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    };

    if (category && category !== 'all') {
      filter.category = category;
    }

    const items = await Item.find(filter)
      .limit(Number(limit))
      .sort({ 'rating.average': -1, createdAt: -1 });

    res.json({
      success: true,
      data: {
        items,
        count: items.length,
        query: q
      }
    });

  } catch (error) {
    console.error('Search items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching items'
    });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getFeaturedItems,
  searchItems
};