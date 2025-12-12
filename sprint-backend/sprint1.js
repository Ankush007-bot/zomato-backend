// Zomato Clone – Separate Backend Setup (ABCD Task Summary)

// Backend using Node.js + Express + MongoDB (with require syntax)

// 🅐 Task A – Backend Folder Setup

// Create folder → zomato-backend

// Run:

// npm init -y


// Install packages:

// npm install express mongoose dotenv cors jsonwebtoken bcryptjs cookie-parser
// nodemon --save-dev


// Create folder structure:

// /zomato-backend
//    /config
//    /controllers
//    /models
//    /routes
//    /middlewares
//    server.js


// Add scripts in package.json:

// "scripts": {
//   "dev": "nodemon server.js"
// }

// 🅑 Task B – Database Setup

// Go to MongoDB Atlas

// Create Cluster

// Create Database User

// Add IP → 0.0.0.0/0

// Copy connection string

// Create .env:

// PORT=5000
// MONGO_URI=your-atlas-uri
// JWT_SECRET=your-random-secret


// Create /config/db.js to connect DB:

// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.log("DB Error:", err);
//   }
// };

// module.exports = connectDB;


// Call connectDB in server.js

// 🅒 Task C – Auth API Setup
// Models

// User.js

// name

// email

// password (hashed)

// address

// phone

// Controllers

// authController.js

// register user

// login user

// get logged in user

// Routes

// authRoutes.js

// POST /api/auth/register
// POST /api/auth/login
// GET /api/auth/me

// Middleware

// authMiddleware.js
// token verify using JWT

// attach decoded user to req.user

// Password Hash

// bcryptjs

// Token

// JWT sign with JWT_SECRET

// 🅓 Task D – Login UI Connection (Frontend + Backend Integration)

// Frontend .env.local:

// NEXT_PUBLIC_API_URL=http://localhost:5000


// Login form → call:

// POST /api/auth/login


// On success:

// Save JWT in httpOnly cookie (recommended)

// OR localStorage (not secure, for demo only)

// Redirect to homepage

// Show logged-in user's name from /api/auth/me

// 🔥 BONUS – Final Flow

// User fills form → frontend sends email/password

// Backend verifies → token create → cookie set

// Frontend feels user is authenticated

// All protected APIs use token middleware

// Real-world separate backend structure achieved ✔