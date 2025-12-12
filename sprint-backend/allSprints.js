// 🍽️ ZOMATO CLONE – REAL ORGANIZATION LEVEL SPRINT PLAN

// (Frontend = Next.js, Backend = Node.js + Express, DB = MongoDB)

// 🟦 SPRINT 1 — Project Foundations (Frontend + Backend Setup)
// 🔹 Task 1 – Create Frontend (Next.js)

// npx create-next-app

// Tailwind setup

// Folder cleaning

// Basic pages ready

// 🔹 Task 2 – Create Backend Folder (Node.js + Express)

// Backend folder structure

// Express server

// Nodemon

// CORS enabled

// Environment setup

// 🔹 Task 3 – Git Setup + Branching Strategy

// main → production

// develop → active development

// qa → QA env

// uat → UAT env

// Both frontend and backend repos separate or mono-repo (your choice)

// 🔹 Task 4 – Database Setup

// Create MongoDB Atlas cluster

// User + IP whitelist

// MONGO_URI configured

// 🔹 Task 5 – API Folder Structure

// Backend:

// /controllers
// /routes
// /models
// /middlewares
// /utils
// /config/db.js
// server.js

// 🔹 Task 6 – Environment Files

// Frontend:

// .env.local
// Backend:

// .env

// Variables:

// ACCESS_TOKEN_SECRET=
// REFRESH_TOKEN_SECRET=
// MONGO_URI=
// PORT=5000

// 🟦 SPRINT 2 — User Authentication (Backend + Frontend Integration)
// 🔹 Task 1 – User Model

// Fields:

// name

// email

// password (hashed)

// address

// phone

// createdAt

// 🔹 Task 2 – Register API

// POST /auth/register

// 🔹 Task 3 – Login API

// POST /auth/login

// Verify user

// Create access token

// Create refresh token (httpOnly cookie)

// 🔹 Task 4 – Refresh Token API

// POST /auth/refresh

// Validate refresh token

// Return new access token

// 🔹 Task 5 – /auth/me API (Get Logged-in User)

// Protected route

// 🔹 Task 6 – Logout API

// Clear refresh token cookie

// 🔹 Task 7 – Frontend Auth Setup

// Login page UI

// Register page UI

// API calls

// Access token store in localStorage

// Refresh token auto-run logic

// 🔹 Task 8 – Auto Login on App Open

// Frontend automatically calls:

// /auth/refresh

// /auth/me

// 🟦 SPRINT 3 — Restaurant Module

// Backend:

// Restaurant model

// Create restaurant (admin)

// Get restaurants

// Get restaurant by ID

// Search, sort, filter

// Pagination

// Ratings avg

// Frontend:

// Restaurant cards

// Restaurant details page

// Search bar

// Filters (cuisine, ratings, delivery time)

// 🟦 SPRINT 4 — Menu + Food Items Module

// Backend:

// Menu model

// Add menu items

// Fetch menu items

// Category-based filtering

// Frontend:

// Restaurant menu UI

// Add item to cart button

// Toggle veg/non-veg

// 🟦 SPRINT 5 — Cart Module

// Backend:

// Add to cart

// Remove from cart

// Update quantity

// Get user cart

// Frontend:

// Cart page

// Update quantity

// Total price calculation

// 🟦 SPRINT 6 — Order Module

// Backend:

// Create order

// Order status updates

// Order history

// Frontend:

// Checkout page

// Order summary

// Order confirmation

// My orders page

// 🟦 SPRINT 7 — Payment Integration

// Razorpay/Stripe

// Create payment order

// Verify signature

// Payment status update

// Frontend:

// Payment popup

// Handle success & failure

// 🟦 SPRINT 8 — Admin Panel

// Admin features:

// Add restaurants

// Add menu items

// Update menu

// Orders dashboard

// 🟦 SPRINT 9 — Deployment (Real Company Style)

// Frontend:

// Vercel, QA/UAT/Production environments

// Backend:

// Render/Railway/EC2

// Separate deployments

// ENV-based URL switching

// Database:

// Separate DBs:

// dev

// qa

// uat

// prod

// CI/CD:

// GitHub Actions

// Auto deploy on branch push