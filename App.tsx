import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import PlotBookingDetailsPage from './pages/PlotBookingDetailsPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManagePlotsPage from './pages/admin/ManagePlotsPage';
import ManageCommercialPage from './pages/admin/ManageCommercialPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import ManagePaymentsPage from './pages/admin/ManagePaymentsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageSitePage from './pages/admin/ManageSitePage';
import ManageMaterialsPage from './pages/admin/ManageMaterialsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* User Routes */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/book-my-sqft/:bookingId" element={<PlotBookingDetailsPage />} />
        <Route path="/profile" element={<div className="p-6 text-neutral-700">User Profile Page (Placeholder)</div>} />
        <Route path="/my-bookings" element={<div className="p-6 text-neutral-700">My Bookings Page (Placeholder)</div>} />
        <Route path="/refer-earn" element={<div className="p-6 text-neutral-700">Refer & Earn Page (Placeholder)</div>} />
        <Route path="/knowledge-base" element={<div className="p-6 text-neutral-700">Knowledge Base (Placeholder)</div>} />
        <Route path="/help-support" element={<div className="p-6 text-neutral-700">Help & Support Page (Placeholder)</div>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="plots" element={<ManagePlotsPage />} />
        <Route path="commercial" element={<ManageCommercialPage />} />
        <Route path="bookings" element={<ManageBookingsPage />} />
        <Route path="payments" element={<ManagePaymentsPage />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="site" element={<ManageSitePage />} />
        <Route path="materials" element={<ManageMaterialsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route index element={<AdminDashboardPage />} />
      </Route>
      
      {/* Fallback for any unmatched route */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
