import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MOCK_BMS_PLOT_INFO } from './constants';
import { AuthProvider } from './contexts/AuthContext';
// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Pages
import HomePage from './pages/HomePage';
import PlotBookingDetailsPage from './pages/PlotBookingDetailsPage';

import HelpAndSupport from './components/helpandsupport/helpandsupport';
import KnowledgeBase from './components/knowledgebase/knowledgebase';
import LandingPage from './components/landingpage/landingpage';
import PlansPage from './components/landingpage/landingpagecomponents/assistedplans/plans';
import PaymentVai from './components/landingpage/landingpagecomponents/payments/paymentVai';
import MyBooking from './components/mybooking/mybooking';
import HomeProfile from './components/myprofile/homeprofile';
import ReferAndEarn from './components/referandearn/referandearn';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import ManageCommercialPage from './pages/admin/ManageCommercialPage';
import ManageMaterialsPage from './pages/admin/ManageMaterialsPage';
import ManagePaymentsPage from './pages/admin/ManagePaymentsPage';
import ManagePlotsPage from './pages/admin/ManagePlotsPage';
import ManageSitePage from './pages/admin/ManageSitePage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import B2BPanelRoutes from './pages/b2b';
import RealEstateRoutes from './pages/realestate';
import BookMySqftPage from './pages/user/BookMySqftPage';
import { MaterialDetailPage, PlotDetailPage, ProfessionalDetailPage } from './pages/user/DetailPagePlaceholders';
import MaterialsStorePage from './pages/user/MaterialsStorePage';
import NotFoundPage from './pages/user/NotFoundPage';
import PlotMarketplacePage from './pages/user/PlotMarketplacePage';
import ServicesHubPage from './pages/user/ServicesHubPage';
import MySqftListing from './pages/user/MySqftListing';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* User Routes */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/book-my-sqft/:bookingId" element={<PlotBookingDetailsPage />} />
        <Route path="/profile" element={<HomeProfile/>} />
        <Route path="/my-bookings" element={<MyBooking/>} />
        <Route path="/refer-earn" element={<ReferAndEarn/>} />
        <Route path="/knowledge-base" element={<KnowledgeBase/>} />
        <Route path="/help-support" element={<HelpAndSupport/>} />
         <Route path="/plots" element={<PlotMarketplacePage />} />
            <Route path="/plots/:id" element={<PlotDetailPage />} />
            <Route path="/book-my-sqft" element={<BookMySqftPage />} />
            {/* Redirect /book-my-sqft to a default BMS plot if no ID specified */}
          
            <Route path="/materials" element={<MaterialsStorePage />} />
            <Route path="/materials/:id" element={<MaterialDetailPage />} />
            <Route path="/services" element={<ServicesHubPage />} />
            <Route path="/services/:id" element={<ProfessionalDetailPage />} />
            <Route path="/plans" element={<PlansPage />} /> {/* Add this route */}
            <Route path="/paymentvai" element={<PaymentVai />} /> {/* PaymentVai route */}
            <Route path="/mysqft-listing" element={<MySqftListing />} />
            <Route path="*" element={<NotFoundPage />} />
        
      </Route>

      {/* B2B Vendor Panel Route */}
      <Route path="/b2b/*" element={<B2BPanelRoutes />} />

      {/* RealEstate Agent Panel Route */}
      <Route path="/realestate/*" element={<RealEstateRoutes />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="manage-plots" element={<ManagePlotsPage />} />
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
