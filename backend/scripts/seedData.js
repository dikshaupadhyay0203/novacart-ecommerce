// backend/scripts/seedData.js
// Run this script to populate your database with sample products
// Usage: node scripts/seedData.js

require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: "Elegant Floral Dress",
    description: "A beautiful floral dress perfect for spring and summer occasions.",
    price: 4999,
    originalPrice: 6999,
    category: "Women's Dress",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop",
    brand: "Fashionista",
    inStock: true,
    quantity: 50,
    featured: true,
    discount: 28,
    tags: ["dress", "floral", "spring", "summer"],
    rating: { average: 4.5, count: 120 }
  },
  {
    name: "Classic Black Dress",
    description: "Timeless black dress suitable for formal events and parties.",
    price: 5999,
    originalPrice: 7999,
    category: "Women's Dress",
    image: "https://images.unsplash.com/photo-1520975698511-1a1a1a1a1a1a?w=500&h=500&fit=crop",
    brand: "Elegance",
    inStock: true,
    quantity: 40,
    featured: true,
    discount: 25,
    tags: ["dress", "black", "classic", "formal"],
    rating: { average: 4.7, count: 98 }
  },
  {
    name: "Summer Maxi Dress",
    description: "Lightweight maxi dress perfect for beach and casual outings.",
    price: 4599,
    originalPrice: 6599,
    category: "Women's Dress",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a9a?w=500&h=500&fit=crop",
    brand: "Sunshine",
    inStock: true,
    quantity: 60,
    featured: false,
    discount: 30,
    tags: ["dress", "maxi", "summer", "beach"],
    rating: { average: 4.3, count: 110 }
  },
  {
    name: "Red Evening Gown",
    description: "Elegant red gown perfect for evening events and galas.",
    price: 8999,
    originalPrice: 11999,
    category: "Women's Dress",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&h=500&fit=crop",
    brand: "Glamour",
    inStock: true,
    quantity: 30,
    featured: true,
    discount: 25,
    tags: ["dress", "red", "evening", "gown"],
    rating: { average: 4.8, count: 75 }
  },
  {
    name: "Casual Shirt Dress",
    description: "Comfortable shirt dress suitable for casual and office wear.",
    price: 3999,
    originalPrice: 5499,
    category: "Women's Dress",
    image: "https://images.unsplash.com/photo-1520975698511-1a1a1a1a1a1a?w=500&h=500&fit=crop",
    brand: "ComfortWear",
    inStock: true,
    quantity: 70,
    featured: false,
    discount: 27,
    tags: ["dress", "shirt", "casual", "office"],
    rating: { average: 4.2, count: 90 }
  },
  {
    name: "Bohemian Style Dress",
    description: "Flowy bohemian dress with vibrant patterns and colors.",
    price: 5299,
    originalPrice: 7299,
    category: "Women's Dress",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop",
    brand: "BohoChic",
    inStock: true,
    quantity: 45,
    featured: true,
    discount: 27,
    tags: ["dress", "bohemian", "flowy", "vibrant"],
    rating: { average: 4.6, count: 85 }
  },
  {
    name: "Sleeveless Summer Dress",
    description: "Light and breezy sleeveless dress perfect for hot weather.",
    price: 4299,
    originalPrice: 5999,
    category: "Women's Dress",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a9a?w=500&h=500&fit=crop",
    brand: "CoolWear",
    inStock: true,
    quantity: 55,
    featured: false,
    discount: 28,
    tags: ["dress", "sleeveless", "summer", "breezy"],
    rating: { average: 4.4, count: 95 }
  },
  {
    name: "Lace Cocktail Dress",
    description: "Elegant lace dress perfect for cocktail parties and special occasions.",
    price: 6999,
    originalPrice: 8999,
    category: "Women's Dress",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&h=500&fit=crop",
    brand: "Elegance",
    inStock: true,
    quantity: 35,
    featured: true,
    discount: 22,
    tags: ["dress", "lace", "cocktail", "elegant"],
    rating: { average: 4.7, count: 80 }
  },
  {
    name: "Pleated Midi Dress",
    description: "Chic pleated midi dress suitable for both casual and formal wear.",
    price: 5599,
    originalPrice: 7599,
    category: "Women's Dress",
    image: "https://images.unsplash.com/photo-1520975698511-1a1a1a1a1a1a?w=500&h=500&fit=crop",
    brand: "Fashionista",
    inStock: true,
    quantity: 40,
    featured: false,
    discount: 26,
    tags: ["dress", "pleated", "midi", "chic"],
    rating: { average: 4.5, count: 70 }
  },
  {
    name: "Vintage Floral Dress",
    description: "Classic vintage floral dress with a modern twist.",
    price: 4799,
    originalPrice: 6799,
    category: "Women's Dress",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop",
    brand: "Vintage",
    inStock: true,
    quantity: 50,
    featured: true,
    discount: 29,
    tags: ["dress", "vintage", "floral", "classic"],
    rating: { average: 4.6, count: 75 }
  }
];

const seedProducts = async () => {
  try {
    // Clear existing products
    await Item.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Item.insertMany(sampleProducts);
    console.log(`✅ Successfully inserted ${products.length} products`);
    
    // Display product summary
    console.log('\n📦 Products by category:');
    const categories = {};
    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@shopease.com' });
    
    if (existingAdmin) {
      console.log('👤 Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@shopease.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
      phone: '9999999999',
      address: {
        street: '123 Admin Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      }
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔐 Password: ${process.env.ADMIN_PASSWORD || 'admin123456'}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const createDemoUser = async () => {
  try {
    // Check if demo user already exists
    const existingDemo = await User.findOne({ email: 'demo@shopease.com' });
    
    if (existingDemo) {
      console.log('👤 Demo user already exists');
      return;
    }

    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@shopease.com',
      password: 'demo123456',
      role: 'user',
      phone: '8888888888',
      address: {
        street: '456 Demo Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    });

    await demoUser.save();
    console.log('✅ Demo user created successfully');
    console.log('📧 Email: demo@shopease.com');
    console.log('🔐 Password: demo123456');

  } catch (error) {
    console.error('Error creating demo user:', error);
  }
};

const runSeeder = async () => {
  await connectDB();
  
  console.log('🌱 Starting database seeding...\n');
  
  await seedProducts();
  await createAdminUser();
  await createDemoUser();
  
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📝 Demo Credentials:');
  console.log('   User: demo@shopease.com / demo123456');
  console.log('   Admin: admin@shopease.com / admin123456');
  
  mongoose.connection.close();
  process.exit(0);
};

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Run the seeder
runSeeder().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
