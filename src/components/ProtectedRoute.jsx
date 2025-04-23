import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if not authenticated
    alert('please login or sigup ')
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 