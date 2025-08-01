// src/components/auth/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SplinePointer } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  if (isLoading) {
    return <SplinePointer />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;