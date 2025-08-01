import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// You can create a more sophisticated loading component if you like
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

const RealEstateRoute: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  // 1. While the user's status is loading, show a spinner to prevent flicker
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 2. If loading is done and there's no user, redirect to the home page
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.user_type !== 'real_estate_agent') {
    console.warn("Access Denied: User is not a real estate agent. Redirecting to user dashboard.");
    return <Navigate to="/user-dashboard" replace />;
  }

  // 4. If all checks pass (loading is done, user exists, and is a real estate agent),
  //    render the child routes.
  return <Outlet />;
};

export default RealEstateRoute;