import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/contexts/AuthContext';

// Optional: MUI ThemeProvider and CssBaseline
import { CssBaseline } from '@mui/material';
// your custom MUI theme (optional)

// Create a cache instance
const emotionCache = createCache({ key: 'mui', prepend: true });

// Layouts
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';

// Pages
// import HomePage from './pages/HomePage';
import PlotBookingDetailsPage from './pages/user/PlotBookingDetailsPage';

import DPlansPage from './components/defaultlandingpage/defaultlandingcomponents/assistedplans/plans';
import DPaymentVai from './components/defaultlandingpage/defaultlandingcomponents/payments/paymentVai';
import DMySqftListing from './components/defaultlandingpage/user/MySqftListing';
import BookConsultation from './components/detailpageandcart/bookconsultation';
import Cart from './components/detailpageandcart/cart';
import HelpAndSupport from './components/helpandsupport/helpandsupport';
import KnowledgeBase from './components/knowledgebase/knowledgebase';
import LandingPage from './components/landingpage/landingpage';
import PlansPage from './components/landingpage/landingpagecomponents/assistedplans/plans';
import PaymentVai from './components/landingpage/landingpagecomponents/payments/paymentVai';
import B2BLayout from './components/layouts/B2BLayout';
import DefaultLayout from './components/layouts/DefaultLayout';
import RealLayout from './components/layouts/RealLayout';
import MyBooking from './components/mybooking/mybooking';
import MyProfile from './components/myprofile/myprofile';
import MaterialCheckout from "./components/payment/materialcheckout";
import ReferAndEarn from './components/referandearn/referandearn';
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
import DefaultLanding from './pages/DefaultLanding';
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

import DCart from './components/detailpageandcart/cart';
import LogBookConsultation from './components/detailpageandcart/logbookconsultation';
import ManageMysqft from './pages/admin/ManageMysqft';
import RealMySqft from './pages/realestate/components/realMysqft';

import DBookMySqftPage from './components/defaultlandingpage/user/BookMySqftPage';
import DPlotMarketplacePage from './components/defaultlandingpage/user/PlotMarketplacePage';

import UserDashboard from './components/defaultlandingpage/user/UserDashboard';
import OTPPage from './components/registration/OTP';
import RegistrationPage from './components/registration/registration';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import PrivacyPolicy from './components/Terms/PrivacyPolicy';
import RefundPolicyPage from './components/Terms/RefundPolicy';
import TermsAndConditions from './components/Terms/TermsAndConditions';
import AdminLogin from './pages/admin/AdminLogin';
import ManageKYC from './pages/admin/ManageKYC';
import ManageVerifiedPlots from './pages/admin/ManageVerifiedPlots';
import PostPlots from './pages/realestate/components/PostPlots';
import Mydashboard from './pages/realestate/components/realestate-section/Mydashboard';
import BookMySqftPayment from './pages/user/BookMySqftPayment';
import BookPlotPayment from './pages/user/BookPlotPayment';
import PlotDetailsPage from './pages/user/DetailMySqftListing';
import SyndicatePlot from './pages/user/SyndicatePlot';

const AppRoutes: React.FC = () => {
  return (

    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<DefaultLanding />} />
        <Route path="/D" element={<DefaultLanding />} />
        <Route path="/Dplots" element={<DPlotMarketplacePage />} />
        <Route path="/Dbook-my-sqft/:plotId" element={<PlotBookingDetailsPage />} />
        <Route path="/Dmaterials" element={<MaterialsStorePage />} />
        <Route path="/Dservices" element={<ServicesHubPage />} />
        <Route path="/micro-plots/:id" element={<DBookMySqftPage />} />
        <Route path="/Dpaymentvai" element={<DPaymentVai />} />
        <Route path="/Dplans" element={<DPlansPage />} />
        <Route path="/Dservices/:id" element={<ProfessionalDetailPage />} />
        <Route path="bookconsultation" element={<BookConsultation />} />
        <Route path="/Dmaterials/:id" element={<MaterialDetailPage />} />
        <Route path="/Dcart" element={<DCart />} />
        <Route path="/Dmysqft-listing" element={<DMySqftListing />} />
        <Route path="/Terms_&_Conditions" element={<TermsAndConditions />} />
        <Route path="/Privacy_Policy" element={<PrivacyPolicy />} />
        <Route path="/cancellation-refunds" element={<RefundPolicyPage />} />
        

       
      </Route>


      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/Landing" element={<LandingPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/book-my-sqft/:id" element={<PlotBookingDetailsPage />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/my-bookings" element={<MyBooking />} />
          <Route path="/refer-earn" element={<ReferAndEarn />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/help-support" element={<HelpAndSupport />} />
          <Route path="/plots" element={<PlotMarketplacePage />} />
          <Route path="/plots/:id" element={<PlotDetailPage />} />
          <Route path="/book-my-sqft" element={<BookMySqftPage />} />


          <Route path="/materials" element={<MaterialsStorePage />} />
          <Route path="/materials/:id" element={<MaterialDetailPage />} />l
          <Route path="/services" element={<ServicesHubPage />} />
          <Route path="/services/:id" element={<ProfessionalDetailPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/paymentvai" element={<PaymentVai />} />
          <Route path="/mysqft-listing" element={<MySqftListing />} />
          <Route path="/mysqft-listing/:id" element={<PlotDetailsPage />} />
          <Route path="/user/syndicate-plot" element={<SyndicatePlot />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/materialcheckout" element={<MaterialCheckout />} />
          <Route path="logbookconsultation" element={<LogBookConsultation />} />
          <Route path="bookplotpayment" element={<BookPlotPayment />} />
          <Route path="/bookmicroplotpayment" element={<BookMySqftPayment />} />
        </Route>
      </Route>

     
        <Route element={<B2BLayout />}>
          <Route path="/b2b/b2bprofile" element={<B2BProfile />} />
          <Route path="/b2b/*" element={<B2BPanelRoutes />} />
        </Route>
      

      
        <Route element={<RealLayout />}>
          <Route path="/realestate/realprofile" element={<RealProfile />} />
          <Route path="/realestate/*" element={<RealEstateRoutes />} />
          <Route path="/realestate/post-plots" element={<PostPlots />} />
          <Route path="/realestate/post-micro-plots" element={<RealMySqft />} />
          <Route path="/realestate/dashboard" element={<Mydashboard />} />
          <Route path="/realestate/referrealestate" element={<ReferAndEarnReal />} />
          
        </Route>
      


<Route path="/admin/login" element={<AdminLogin />} />

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
        <Route path="microplot" element={< ManageMysqft />} />
        <Route path="verifiedplot" element={< ManageVerifiedPlots />} />
        <Route path="kyc" element={<ManageKYC />} />
        <Route index element={<AdminDashboardPage />} />
      </Route>



      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/OTP" element={<OTPPage />} />
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
