import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

const B2bProtectedRoute: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.user_type !== 'b2b_vendor') {
    console.warn("Access Denied: User is not a B2B user. Redirecting to user dashboard.");
    return <Navigate to="/user-dashboard" replace />;
  }

  return <Outlet />;
};

export default B2bProtectedRoute;