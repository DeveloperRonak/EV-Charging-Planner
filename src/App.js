import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Mappage from './pages/Mappage';
import TripPlannerPage from './pages/TripPlannerPage';
import AlertPage from './pages/AlertPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Use the actual auth service
import authService from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Main App Component
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route path="/home" element={
        <ProtectedRoute>
          <Homepage />
        </ProtectedRoute>
      } />
      <Route path="/map" element={
        <ProtectedRoute>
          <Mappage />
        </ProtectedRoute>
      } />
      <Route path="/planner" element={
        <ProtectedRoute>
          <TripPlannerPage />
        </ProtectedRoute>
      } />
      <Route path="/alerts" element={
        <ProtectedRoute>
          <AlertPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
