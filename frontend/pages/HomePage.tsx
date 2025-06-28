import React from 'react';

import PropertyListingCard from '../components/PropertyListingCard';


// Import or define purchased arrays (replace with real data source as needed)
const purchasedPlots: any[] = (window as any).MOCK_PURCHASED_PLOTS || [];
const purchasedMaterials: any[] = (window as any).MOCK_PURCHASED_MATERIALS || [];
const purchasedServices: any[] = (window as any).MOCK_PURCHASED_SERVICES || [];

const HomePage: React.FC = () => {
  
  

  // If all arrays are empty, render a fallback message so the page is not blank
  const nothingToShow =
    purchasedPlots.length === 0 &&
    purchasedMaterials.length === 0 &&
    purchasedServices.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Purchased Plots Section --- */}
      {purchasedPlots.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Your Purchased Plots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedPlots.map((plot: any, idx: number) => (
              <PropertyListingCard key={plot.id || idx} listing={plot} />
            ))}
          </div>
        </section>
      )}

      {/* --- Purchased Materials Section --- */}
      {purchasedMaterials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Your Purchased Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedMaterials.map((item: any, idx: number) => (
              <div key={item.id || idx} className="bg-white rounded-lg shadow border border-green-100 p-4 flex flex-col">
                <div className="font-semibold text-green-700">{item.name}</div>
                <div className="text-sm text-gray-600 mb-2">{item.category}</div>
                <div className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</div>
                <div className="text-xs text-gray-500 mb-1">Order ID: {item.orderId}</div>
                <div className="text-xs text-gray-500">Status: <span className="font-semibold">{item.status}</span></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Purchased Services Section --- */}
      {purchasedServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Your Booked Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedServices.map((svc: any, idx: number) => (
              <div key={svc.id || idx} className="bg-white rounded-lg shadow border border-green-100 p-4 flex flex-col">
                <div className="font-semibold text-green-700">{svc.serviceName || svc.name}</div>
                <div className="text-sm text-gray-600 mb-2">{svc.provider || svc.vendor || svc.company || ''}</div>
                <div className="text-xs text-gray-500 mb-1">Date: {svc.date || svc.bookedDate || ''}</div>
                <div className="text-xs text-gray-500 mb-1">Order ID: {svc.orderId || svc.bookingId || ''}</div>
                <div className="text-xs text-gray-500">Status: <span className="font-semibold">{svc.status}</span></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Fallback if nothing to show */}
      {nothingToShow && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
          <svg className="w-16 h-16 mb-4 text-green-200" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2" fill="none"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No Purchases or Bookings Found</h2>
          <p className="text-gray-400">You have not purchased any plots, materials, or services yet.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;