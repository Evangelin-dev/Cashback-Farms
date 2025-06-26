import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Optional: MUI ThemeProvider and CssBaseline
import { ThemeProvider, CssBaseline } from '@mui/material';
// your custom MUI theme (optional)

// Create a cache instance
const emotionCache = createCache({ key: 'mui', prepend: true });

// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Pages
// import HomePage from './pages/HomePage';
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
import DPaymentVai from './components/defaultlandingpage/defaultlandingcomponents/payments/paymentVai';
import DPlansPage from './components/defaultlandingpage/defaultlandingcomponents/assistedplans/plans';
import DServicesHubPage from './components/defaultlandingpage/user/ServicesHubPage';
import DPlotBookingDetailsPage from './components/defaultlandingpage/user/PlotBookingDetailsPage';
import BookConsultation from './components/detailpageandcart/bookconsultation';
// import { DMaterialDetailPage,DProfessionalDetailPage } from './components/defaultlandingpage/user/DetailPagePlaceholders';
import DMySqftListing from './components/defaultlandingpage/user/MySqftListing';

import RealMySqft from './pages/realestate/components/realMysqft';
import ManageMysqft from './pages/admin/ManageMysqft';
import LogBookConsultation from './components/detailpageandcart/logbookconsultation';
import DCart from './components/detailpageandcart/cart';

import DBookMySqftPage from './components/defaultlandingpage/user/BookMySqftPage';
import DMaterialsStorePage from './components/defaultlandingpage/user/MaterialsStorePage';
import DPlotMarketplacePage from './components/defaultlandingpage/user/PlotMarketplacePage';

import PostPlots from './pages/realestate/components/PostPlots';
import BookPlotPayment from './pages/user/BookPlotPayment';
import TermsAndConditions from './pages/TermsAndConditions';
import BookMySqftPayment from './pages/user/BookMySqftPayment';
import RegistrationPage from './pages/registration/registration';
// import OTPPage from './pages/regurestion/OTP';
// import PrivacyPolicy from './pages/PrivacyPolicy';

const AppRoutes: React.FC = () => {

  return (
    
    <Routes>
      
         {/* Redirect root path to home page */}
         <Route element={<DefaultLayout />}>
         
      <Route path="/" element={<DefaultLanding />} />
      <Route path="/D" element={<DefaultLanding />} />
      <Route path="/Dplots" element={<DPlotMarketplacePage />} />
      <Route path="/Dbook-my-sqft/:bookingId" element={<DPlotBookingDetailsPage />} />
      <Route path="/Dmaterials" element={<DMaterialsStorePage />} />
      <Route path="/Dservices" element={<DServicesHubPage />} />
      <Route path="/Dbook-my-sqft" element={<DBookMySqftPage />} />
      <Route path="/Dpaymentvai" element={<DPaymentVai/>} />
      <Route path="/Dplans" element={<DPlansPage />} /> 
      {/* <Route path="/Dservices/:id" element={<DProfessionalDetailPage />} /> */}
      <Route path="bookconsultation" element={<BookConsultation />} />
      {/* <Route path="/Dmaterials/:id" element={<DMaterialDetailPage />} /> */}
      <Route path="/Dcart" element={<DCart /> } />
      <Route path="/Dplans" element={<DPlansPage />} /> 
      <Route path="/Dmysqft-listing" element={<DMySqftListing />} />
      <Route path="/Dterms" element={<TermsAndConditions />} />
        {/* <Route path="/Dprivacy" element={<PrivacyPolicy />} /> */}
      
    

     </Route>

      {/* User Routes */}
      <Route element={<UserLayout />}>
        <Route path="/Landing" element={<LandingPage />} />
        {/* <Route path="/home" element={<HomePage />} /> */}
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
        <Route path="/materials" element={<MaterialsStorePage />} />
        <Route path="/materials/:id" element={<MaterialDetailPage />} />
        <Route path="/services" element={<ServicesHubPage />} />
        <Route path="/services/:id" element={<ProfessionalDetailPage />} />
        <Route path="/plans" element={<PlansPage />} /> 
        <Route path="/paymentvai" element={<PaymentVai />} /> {/* PaymentVai route */}
        <Route path="/mysqft-listing" element={<MySqftListing />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/cart" element={<Cart /> } />
        <Route path="/materialcheckout" element={<MaterialCheckout />} />
        <Route path="logbookconsultation" element={<LogBookConsultation />} />
        <Route path="bookplotpayment" element={<BookPlotPayment />} />
        <Route path="/bookmicroplotpayment" element={<BookMySqftPayment />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        {/* <Route path="/privacy" element={<PrivacyPolicy />} /> */}
        
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
      <Route path="post-plots" element={<PostPlots />} />
      <Route path="/realestate/post-micro-plots" element={<RealMySqft />} />
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
        <Route path="microplot" element={< ManageMysqft/>} />
        <Route index element={<AdminDashboardPage />} />
      </Route>
      
      {/* Fallback for any unmatched route */}
      {/* <Route path="*" element={<DefaultLanding/>} /> */}
      <Route path="/registration" element={<RegistrationPage />} /> 
      {/* <Route path="/OTP" element={<OTPPage />} />  */}
      <Route path="*" element={<NotFoundPage />} />


    </Routes>
    
  );
};

const App: React.FC = () => {
 
  return (
       <CacheProvider value={emotionCache}>
      
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      
    </CacheProvider>
  );
};

export default App;
