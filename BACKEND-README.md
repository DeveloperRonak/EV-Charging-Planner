# EV Charging Planner - Complete Backend Setup

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Step 1: Install Backend Dependencies
```bash
# Install additional backend dependencies
npm install express mongoose cors bcrypt jsonwebtoken
npm install -D nodemon
```

### Step 2: Setup MongoDB
1. **Local MongoDB**: Install MongoDB Community Edition
2. **MongoDB Atlas**: Create free cluster at https://cloud.mongodb.com

### Step 3: Initialize Database
```bash
# Run once to create sample data
node setup.js
```

### Step 4: Start the Application
```bash
# Option 1: Start backend only
node server.js

# Option 2: Start both frontend and backend (after installing concurrently)
npm install concurrently
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Charging Stations
- `GET /api/stations` - Get all charging stations

### Trip Management
- `GET /api/trips` - Get user trips (auth required)
- `POST /api/trips` - Create new trip (auth required)

## 👤 Sample Users
After running `node setup.js`:
- **Admin**: admin@ev.com / admin123

## 📍 Sample Charging Stations
4 pre-loaded stations in NYC:
- Tesla Supercharger NYC
- ChargePoint Station  
- EVgo Fast Charger
- Electrify America

## 🔧 Development Commands
```bash
npm run server    # Start backend only
npm start         # Start frontend only
npm run dev       # Start both (after installing concurrently)
```

## 🌐 Frontend Integration
- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000
- CORS enabled for cross-origin requests

## 📝 Project Structure
```
ev-charging-planner-client/
├── server.js          # Backend server
├── setup.js          # Database initialization
├── src/
│   ├── services/
│   │   ├── authService.js    # Authentication service
│   │   └── stationService.js  # Stations & trips service
│   └── ... (existing React components)
```

## ✅ Your project is now complete with backend!
