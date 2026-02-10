const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['dresses', 'tops', 'jeans', 'lowers', 'innerwear', 'ethnic', 'sexy']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  images: [{
    type: String // Additional product images
  }],
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40'],
    default: ['S', 'M', 'L', 'XL']
  }],
  colors: [{
    type: String,
    default: ['Black', 'White', 'Blue', 'Red', 'Pink']
  }],
  material: {
    type: String,
    enum: ['Cotton', 'Polyester', 'Silk', 'Chiffon', 'Denim', 'Linen', 'Wool', 'Blend'],
    default: 'Cotton'
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative']
  },
  tags: [{
    type: String // For better search functionality
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for search functionality
itemSchema.index({ name: 'text', description: 'text', tags: 'text' });
itemSchema.index({ category: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ rating: -1 });
itemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Item', itemSchema);