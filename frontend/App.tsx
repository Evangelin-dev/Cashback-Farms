import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

import AuthModal from '@/components/auth/AuthForm';
import Cart from './components/detailpageandcart/cart';
import MyProfile from './components/myprofile/myprofile';
import MaterialCheckout from "./components/payment/materialcheckout";
import ReferAndEarn from './components/referandearn/referandearn';
import DefaultLanding from './DefaultLanding';
import B2BLayout from './layouts/B2BLayout';
import DefaultLayout from './layouts/DefaultLayout';
import RealLayout from './layouts/RealLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import ManageCommercialPage from './pages/admin/ManageCommercialPage';
import ManageMaterialsPage from './pages/admin/ManageMaterialsPage';
import ManagePaymentsPage from './pages/admin/ManagePaymentsPage';
import ManagePlotsPage from './pages/admin/ManagePlotsPage';
import ManageSitePage from './pages/admin/ManageSitePage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import B2BPanelRoutes from './pages/b2b';
import B2BProfile from './pages/b2b/components/b2bprofile';
import RealEstateRoutes from './pages/realestate';
import RealProfile from './pages/realestate/components/realprofile';
import ReferAndEarnReal from './pages/realestate/components/referandearnreal/referandearnreal';
import BookMySqftPage from './pages/user/BookMySqftPage';
import { MaterialDetailPage, PlotDetailPage, ProfessionalDetailPage } from './pages/user/DetailPagePlaceholders';
import MaterialsStorePage from './pages/user/MaterialsStorePage';
import MySqftListing from './pages/user/MySqftListing';
import NotFoundPage from './pages/user/NotFoundPage';
import PlotMarketplacePage from './pages/user/PlotMarketplacePage';
import ServicesHubPage from './pages/user/ServicesHubPage';


const AppRoutes: React.FC = () => {

  return (
    
    <Routes>
      
         {/* Redirect root path to home page */}
         <Route element={<DefaultLayout />}>
         
      <Route path="/" element={<DefaultLanding />} />
      <Route path="/D" element={<DefaultLanding />} />
      <Route path="/Dplots" element={<PlotMarketplacePage />} />
      <Route path="/Dbook-my-sqft/:bookingId" element={<PlotBookingDetailsPage />} />
      <Route path="/Dmaterials" element={<MaterialsStorePage />} />
      <Route path="/Dservices" element={<ServicesHubPage />} />
      <Route path="/Dbook-my-sqft" element={<BookMySqftPage />} />
      <Route path="/Dpaymentvai" element={<PaymentVai/>} />
    

     </Route>

      {/* User Routes */}
      <Route element={<UserLayout />}>
        <Route path="/Landing" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/book-my-sqft/:bookingId" element={<PlotBookingDetailsPage />} />
        {/* Change /profile to use MyProfile directly */}
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/my-bookings" element={<MyBooking/>} />
        <Route path="/refer-earn" element={<ReferAndEarn/>} />
        <Route path="/knowledge-base" element={<KnowledgeBase/>} />
        <Route path="/help-support" element={<HelpAndSupport/>} />
        <Route path="/plots" element={<PlotMarketplacePage />} />
        <Route path="/plots/:id" element={<PlotDetailPage />} />
        <Route path="/book-my-sqft" element={<BookMySqftPage />} />
        {/* Redirect /book-my-sqft to a default BMS plot if no ID specified */}
        <Route path="/Umaterials" element={<MaterialsStorePage />} />
        <Route path="/Umaterials/:id" element={<MaterialDetailPage />} />
        <Route path="/services" element={<ServicesHubPage />} />
        <Route path="/services/:id" element={<ProfessionalDetailPage />} />
        <Route path="/plans" element={<PlansPage />} /> 
        <Route path="/paymentvai" element={<PaymentVai />} /> {/* PaymentVai route */}
        <Route path="/mysqft-listing" element={<MySqftListing />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/cart" element={<Cart /> } />
        <Route path="/materialcheckout" element={<MaterialCheckout />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

<Route element={<B2BLayout />}>
      {/* B2B Vendor Panel Route */}
      <Route path="/b2b/b2bprofile" element={<B2BProfile />} />
      <Route path="/b2b/*" element={<B2BPanelRoutes />} />
      </Route>

 <Route element={<RealLayout />}>
      {/* RealEstate Agent Panel Route */}
      <Route path="/realestate/realprofile" element={<RealProfile />} />
      <Route path="/realestate/*" element={<RealEstateRoutes />} />
      <Route path="/referrealestate" element={<ReferAndEarnReal />} />
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
        <Route path="profile" element={<AdminProfilePage />} />
        <Route index element={<AdminDashboardPage />} />
      </Route>
      
      {/* Fallback for any unmatched route */}
      <Route path="*" element={<HomePage />} />
      
    </Routes>
    
  );
};

const App: React.FC = () => {
 
  return (
    <BrowserRouter>
      <AuthProvider>
        
        <AppRoutes />
        
       
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
