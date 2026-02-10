<<<<<<< HEAD

E-commerce Fullstack Application
A modern, full-featured e-commerce web application built with Node.js, Express, MongoDB, and React.

🚀 Features
Backend Features
JWT Authentication - Secure user registration and login
Product Management - CRUD operations for products with advanced filtering
Shopping Cart - Persistent cart functionality that survives logout
RESTful API - Well-structured API endpoints
Data Validation - Comprehensive input validation and error handling
Database Integration - MongoDB with Mongoose ODM
Frontend Features
Modern React UI - Clean, responsive design
User Authentication - Login/signup with persistent sessions
Product Catalog - Browse products with search and filtering
Shopping Cart - Add/remove items with quantity management
Responsive Design - Works on desktop, tablet, and mobile
Professional Styling - Modern CSS with smooth animations
📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (version 14 or higher)
MongoDB (local installation or MongoDB Atlas)
Git (for cloning the repository)
🛠️ Installation & Setup
Step 1: Clone and Setup Project Structure
# Create main project directory
mkdir ecommerce-fullstack
cd ecommerce-fullstack

# Create the exact folder structure as specified
mkdir -p backend/config backend/controllers backend/middleware backend/models backend/routes backend/utils
mkdir -p frontend/public frontend/src/components/Auth frontend/src/components/Layout frontend/src/components/Products frontend/src/components/Cart frontend/src/components/Common frontend/src/context frontend/src/pages frontend/src/services frontend/src/styles
Step 2: Backend Setup
cd backend

# Initialize npm and install dependencies
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install -D nodemon

# Create all backend files using the provided code
# Copy each file from the artifacts into their respective locations
Create these backend files with the provided code:

package.json - Backend dependencies and scripts
.env - Environment variables
config/database.js - MongoDB connection
models/User.js - User schema
models/Item.js - Product schema
models/Cart.js - Cart schema
utils/generateToken.js - JWT token generation
middleware/authMiddleware.js - JWT verification
controllers/authController.js - Authentication logic
controllers/itemController.js - Product CRUD operations
controllers/cartController.js - Cart management
routes/auth.js - Authentication routes
routes/items.js - Product routes
routes/cart.js - Cart routes
server.js - Main server file
Step 3: Frontend Setup
cd ../frontend

# Initialize React app
npx create-react-app .
npm install axios react-router-dom

# Replace/create all frontend files with the provided code
Create these frontend files with the provided code:

package.json - Frontend dependencies
public/index.html - HTML template
src/services/api.js - API communication layer
src/context/AuthContext.js - Authentication state
src/context/CartContext.js - Cart state management
src/components/Auth/ProtectedRoute.js - Route protection
src/components/Auth/Login.js - Login form component
src/components/Auth/Signup.js - Signup form component
src/components/Layout/Header.js - Navigation header
src/components/Layout/Footer.js - Page footer
src/components/Products/FilterSidebar.js - Filtering options
src/components/Products/ProductCard.js - Individual product display
src/components/Products/ProductList.js - Products grid/list
src/components/Cart/CartItem.js - Individual cart item
src/components/Cart/Cart.js - Cart page component
src/components/Common/LoadingSpinner.js - Loading indicator
src/pages/HomePage.js - Main products page
src/pages/LoginPage.js - Login page
src/pages/SignupPage.js - Registration page
src/pages/CartPage.js - Shopping cart page
src/App.js - Main app component
src/index.js - React entry point
src/styles/index.css - Simple CSS styles
Step 4: Environment Configuration
Backend Environment (.env file):

PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d
NODE_ENV=development
Important: Change the JWT_SECRET to a long, random string for security.

Step 5: Database Setup
Option 1: Local MongoDB

# Install MongoDB locally and start the service
# MongoDB will create the database automatically when the app connects
Option 2: MongoDB Atlas (Cloud)

# Create a free MongoDB Atlas account
# Create a cluster and get your connection string
# Replace MONGODB_URI in .env with your Atlas connection string
Step 6: Running the Application
Terminal 1 - Start Backend:

cd backend
npm run dev
# Backend will run on http://localhost:5000
Terminal 2 - Start Frontend:

cd frontend  
npm start
# Frontend will run on http://localhost:3000
🎯 Usage Guide
1. User Registration & Login
Navigate to http://localhost:3000
Click "Sign Up" to create an account
Use "Login" to sign in to existing account
Authentication tokens persist in localStorage
2. Browsing Products
View all products on the home page
Use filters: categories, price range, search
Sort by price, name, rating, or date
3. Shopping Cart
Add products to cart (requires login)
Adjust quantities or remove items
Cart persists after logout
View total and proceed to checkout
4. Admin Functions
Products can be managed via API endpoints
Use tools like Postman to test admin routes
📡 API Endpoints
Authentication
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/me - Get user profile (protected)
Products
GET /api/items - Get all products (with filters)
GET /api/items/:id - Get single product
POST /api/items - Create product (admin only)
PUT /api/items/:id - Update product (admin only)
DELETE /api/items/:id - Delete product (admin only)
Cart
GET /api/cart - Get user cart (protected)
POST /api/cart/add - Add item to cart (protected)
PUT /api/cart/update - Update cart item (protected)
DELETE /api/cart/remove/:itemId - Remove item (protected)
DELETE /api/cart/clear - Clear cart (protected)
🗄️ Sample Data
To populate your database with sample products, you can use this sample data via API calls:

// Sample products to add via POST /api/items
const sampleProducts = [
  {
    name: "iPhone 14 Pro",
    description: "Latest iPhone with advanced camera system",
    price: 999.99,
    category: "electronics",
    brand: "Apple",
    image: "https://via.placeholder.com/300x300?text=iPhone+14+Pro",
    stock: 50,
    rating: 4.8,
    numReviews: 120
  },
  {
    name: "Nike Air Max",
    description: "Comfortable running shoes for daily wear",
    price: 129.99,
    category: "clothing", 
    brand: "Nike",
    image: "https://via.placeholder.com/300x300?text=Nike+Air+Max",
    stock: 75,
    rating: 4.5,
    numReviews: 89
  }
  // Add more products as needed
];
🔧 Development
Project Structure
ecommerce-fullstack/
├── backend/                     # Node.js Express API
│   ├── config/database.js       # MongoDB connection
│   ├── controllers/            # Business logic
│   ├── middleware/             # Custom middleware
│   ├── models/                 # Database schemas
│   ├── routes/                 # API routes
│   ├── utils/                  # Utility functions
│   └── server.js               # Entry point
├── frontend/                   # React application
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── context/            # State management
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── styles/             # CSS styles
│   └── package.json
└── README.md
Key Features
Responsive Design - Mobile-first approach
State Management - React Context for auth and cart
Error Handling - Comprehensive error handling
Security - JWT authentication, input validation
Performance - Optimized database queries
🚀 Deployment
Backend Deployment (Heroku/Railway/Render)
Set environment variables on hosting platform
Update MONGODB_URI to production database
Set NODE_ENV=production
Deploy backend code
Frontend Deployment (Netlify/Vercel)
Update API_URL in src/services/api.js to production backend URL
Build the project: npm run build
Deploy the build folder
📝 Notes
Cart items persist in database, not localStorage
Authentication tokens stored in localStorage
All API responses follow consistent format
Error handling implemented throughout
Responsive design works on all screen sizes
Professional CSS styling with smooth animations
🤝 Contributing
Fork the repository
Create feature branch: git checkout -b feature-name
Commit changes: git commit -m 'Add feature'
Push to branch: git push origin feature-name
Submit pull request
📄 License
This project is licensed under the MIT License.

🆘 Troubleshooting
Common Issues:

Database Connection Error

Ensure MongoDB is running
Check connection string in .env
CORS Errors

Backend and frontend must run on different ports
Check proxy setting in frontend package.json
Authentication Issues

Clear localStorage: localStorage.clear()
Check JWT_SECRET is set correctly
Cart Not Loading

Ensure user is authenticated
Check network requests in browser dev tools
📞 Support
For issues and questions, please create an issue in the repository or contact the development team.

Happy Coding! 🎉
🛒 E-Commerce Web Application

A full-stack E-Commerce web application with user authentication, product management, and cart system. The app allows users to sign up, log in, browse products with images and prices (₹), and manage their cart. Cart items persist even after logout, making the shopping experience seamless.

🚀 Features 🔐 Authentication

User Signup and Login using JWT authentication.

Passwords securely hashed with bcrypt.

📦 Product Management

CRUD APIs for products (Create, Read, Update, Delete).

Product listing with images, categories, and price in ₹ (Indian Rupees).

Filters by category, price range, and search.

🛍️ Cart System

Add to cart, update quantity, remove from cart.

Cart items persist after logout (stored in DB per user).

Guest users can add items to cart (local storage).

🎨 Frontend (React.js + Tailwind + Framer Motion)

Attractive, animated Login & Signup pages.

Responsive product listing with smooth animations.

Cart page with add/remove functionality.

Modern UI with Tailwind CSS.

🛠️ Tech Stack

Backend:

Node.js, Express.js

MongoDB, Mongoose

JWT Authentication

Frontend:

React.js

Tailwind CSS

Framer Motion (animations)

Axios (API requests)

React Router

⚙️ Installation & Setup 1️⃣ Clone Repository git clone https://github.com/your-username/your-repo-name.git cd your-repo-name

2️⃣ Backend Setup cd backend npm install

Create a .env file in backend:

MONGO_URI=mongodb://localhost:27017/ecommerce JWT_SECRET=your_secret_key PORT=5000

Run backend:

npm run dev

3️⃣ Frontend Setup cd frontend npm install npm start

📸 Screenshots (Optional)

Animated Login Page

Signup Page

Product Listing with ₹ Prices

Cart Page

🌟 Future Enhancements

Admin panel for managing products.

Order history & checkout flow.

Payment gateway integration (Razorpay/Stripe).

Wishlist feature.

👩‍💻 Author

Developed by diksha Kumari ✨
