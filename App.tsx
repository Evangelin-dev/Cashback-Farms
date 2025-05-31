import React, { useState } from 'react';

import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import PlansPage from './components/assistedplans/plans'; // Import the PlansPage component
import AuthModal from './components/auth/authmodel';
import Dashboard from './components/dashboard/dashboard';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import PaymentVai from './components/payments/paymentVai';
import { MOCK_BMS_PLOT_INFO } from './constants';
import BookMySqftPage from './pages/BookMySqftPage';
import { MaterialDetailPage, PlotDetailPage, ProfessionalDetailPage } from './pages/DetailPagePlaceholders';
import HomePage from './pages/HomePage';
import MaterialsStorePage from './pages/MaterialsStorePage';
import NotFoundPage from './pages/NotFoundPage';
import PlotMarketplacePage from './pages/PlotMarketplacePage';
import ServicesHubPage from './pages/ServicesHubPage';

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false); // ← Modal state

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <Navbar onAuthClick={() => setShowModal(true)} /> {/* Pass down trigger */}
        <main className="flex-grow">
          <Routes>
              <Route path="/" element={<HomePage />} />
            <Route path="/plots" element={<PlotMarketplacePage />} />
            <Route path="/plots/:id" element={<PlotDetailPage />} />
            <Route path="/book-my-sqft/:plotId" element={<BookMySqftPage />} />
            {/* Redirect /book-my-sqft to a default BMS plot if no ID specified */}
           <Route path="/book-my-sqft" element={<Navigate to={`/book-my-sqft/${MOCK_BMS_PLOT_INFO.id}`} replace />} />
            <Route path="/materials" element={<MaterialsStorePage />} />
            <Route path="/materials/:id" element={<MaterialDetailPage />} />
            <Route path="/services" element={<ServicesHubPage />} />
            <Route path="/services/:id" element={<ProfessionalDetailPage />} />
            <Route path="/plans" element={<PlansPage />} /> {/* Add this route */}
            <Route path="/paymentvai" element={<PaymentVai />} /> {/* PaymentVai route */}
            <Route path="*" element={<NotFoundPage />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} /> {/* Modal */}
      </div>
    </HashRouter>
  );
};

export default App;