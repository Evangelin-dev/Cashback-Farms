
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PlotMarketplacePage from './pages/PlotMarketplacePage';
import BookMySqftPage from './pages/BookMySqftPage';
import MaterialsStorePage from './pages/MaterialsStorePage';
import ServicesHubPage from './pages/ServicesHubPage';
import { PlotDetailPage, MaterialDetailPage, ProfessionalDetailPage } from './pages/DetailPagePlaceholders';
import NotFoundPage from './pages/NotFoundPage';
import { MOCK_BMS_PLOT_INFO } from './constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <Navbar />
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
    