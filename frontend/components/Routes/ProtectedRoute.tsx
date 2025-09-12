// src/components/auth/ProtectedRoute.tsx

import { useAuth } from '@/components/contexts/AuthContext';
import { SplinePointer } from 'lucide-react';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

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