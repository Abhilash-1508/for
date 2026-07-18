import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-forest">
        <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Ensure user is logged in and has required profile attributes
  if (!user || !user.name || !user.mobile) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
