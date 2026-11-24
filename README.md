# 🍔 Black Cafe — Multi-Branch Restaurant Management System

A premium, full-stack MERN application designed for fast-food restaurant management, online ordering, and real-time operations. Built with a focus on seamless customer experience, robust admin controls, and intelligent AI assistance.

## ✨ Features

### Customer Frontend (Next.js)
- **Smart Geolocation:** Automatically detects the user's location and assigns the nearest active branch.
- **Dynamic Menu:** Categorized products with pizza sizes, addons, and special instructions.
- **Guest Checkout & Auth:** Order without an account or register for order history.
- **5-Minute Cancellation:** Server-enforced free cancellation window.
- **Live Order Tracking:** Real-time visual timeline (Placed → Preparing → Delivered).
- **AI Chatbot:** Powered by Google Gemini, answering questions using live database data.
- **Social Gallery:** Beautiful Bento-box grid showcasing cafe images and videos.
- **Premium UI:** Dark/Red theme with Tailwind CSS, fully responsive.

### Admin & Kitchen Dashboard (React + Vite)
- **Role-Based Access Control (RBAC):** Super Admin, Branch Manager, Kitchen Staff, etc.
- **Live Orders Board:** Manage and update order statuses (Pending → Accepted → Preparing → Ready).
- **Kitchen Display System (KDS):** Kanban-style board for the kitchen staff.
- **Inventory Management:** Branch-specific stock tracking with auto-reservation on checkout.
- **Financial Reports:** Interactive Recharts showing revenue and order breakdowns.
- **Receipt Generation:** Print or download PDF receipts for any order.

### Backend (Node.js + Express + MongoDB)
- **Secure Auth:** JWT with HTTP-only cookies.
- **Payment Gateways:** Integrated mock flow for Easypaisa, JazzCash, Card, and COD.
- **Atomic Inventory:** Prevents overselling by reserving stock during checkout.
- **Idempotent Webhooks:** Prevents duplicate payment processing.
- **Zod Validation:** Bulletproof API request validation.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, React, Tailwind CSS, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **AI:** Google Gemini API (`@google/genai`)
- **Real-time:** Socket.IO (ready for live tracking)

🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

MongoDB (Local or MongoDB Atlas)

Google Gemini API Key (Get it from Google AI Studio)

1. Backend Setup
bash
cd backend
npm install
Create a .env file in the backend folder:

env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/blackcafe  # Or your Atlas URI
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_super_refresh_secret
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
ADMIN_SETUP_KEY=admin_secret_key
GEMINI_API_KEY=AQ.your_gemini_api_key_here
Seed the database with 100+ real products, categories, and admin user:

bash
npm run seed
Start the backend:

bash
npm run dev
2. Customer Frontend Setup
bash
cd frontend/customer
npm install
npm run dev
Access at: http://localhost:3000

3. Admin Dashboard Setup
bash
cd frontend/admin
npm install
npm run dev
Access at: http://localhost:5173

🔐 Admin Credentials
Email: admin@blackcafe.com

Password: Admin@12345