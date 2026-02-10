// backend/routes/items.js
const express = require('express');
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getFeaturedItems,
  searchItems
} = require('../controllers/itemController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllItems);
router.get('/featured', getFeaturedItems);
router.get('/search', searchItems);
router.get('/:id', getItemById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createItem);
router.put('/:id', authMiddleware, adminMiddleware, updateItem);
router.delete('/:id', authMiddleware, adminMiddleware, deleteItem);

module.exports = router;