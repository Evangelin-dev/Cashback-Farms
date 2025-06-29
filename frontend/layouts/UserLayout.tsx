import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { getExtendedBookingDetailsById } from '../constants'; // For dynamic titles
import Footer from '@/components/defaultlandingpage/defaultlandingcomponents/layout/Footer';

const UserLayout: React.FC = () => {
  const location = useLocation();
  let pageTitle = "Find Your Property"; // Default title for new HomePage

  if (location.pathname.startsWith('/book-my-sqft/')) {
    const bookingId = location.pathname.split('/').pop();
    if (bookingId) {
      const details = getExtendedBookingDetailsById(bookingId);
      if (details && details.plotInfo) {
        pageTitle = `Plot: ${details.plotInfo.title} - ${details.plotInfo.id}`;
      } else {
        pageTitle = "Plot Booking Details";
      }
    }
  } else if (location.pathname === '/') {
      pageTitle = "Property Search"; // Title for the new HomePage
  } else if (location.pathname === '/profile') {
      pageTitle = "My Profile";
  } else if (location.pathname === '/my-bookings') {
      pageTitle = "My Bookings & Properties";
  } else if (location.pathname === '/plots') {
      pageTitle = "Plot Marketplace";
  } else if (location.pathname === '/materials') {
      pageTitle = "Materials Store";
  } else if (location.pathname === '/services') {
      pageTitle = "Professional Services";
  } else if (location.pathname === '/refer-earn') {
      pageTitle = "Refer & Earn";
  } else if (location.pathname === '/knowledge-base') {
      pageTitle = "Knowledge Base";
  } else if (location.pathname === '/help-support') {
      pageTitle = "Help & Support";
  }
  // Could add more dynamic titles for other user pages if needed

  return (
    <div className="flex h-screen bg-neutral-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Instead of passing className, wrap Header in a div with responsive padding */}
        <div className="pl-5 md:pl-0">
          <Header pageTitle={pageTitle} />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 md:p-6 lg:p-8">
          <Outlet />
          <Footer/>
        </main>
      </div>
      {/* Remove style block for .page-title-mobile-pad */}
    </div>
  );
};

export default UserLayout;
