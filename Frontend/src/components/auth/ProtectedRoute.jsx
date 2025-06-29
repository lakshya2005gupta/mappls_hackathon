import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin access and user is not an admin, redirect to home
  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated (and has admin access if required), render the children
  return children;
};

export default ProtectedRoute; 