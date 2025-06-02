
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getExtendedBookingDetailsById } from '../constants'; // For dynamic titles

const UserLayout: React.FC = () => {
  const location = useLocation();
  let pageTitle = "Find Your Property"; // Default title for new HomePage

  if (location.pathname.startsWith('/book-my-sqft/')) {
    const bookingId = location.pathname.split('/').pop();
    if (bookingId) {
      const details = getExtendedBookingDetailsById(bookingId);
      if (details && details.plotInfo) {
        pageTitle = `Plot: ${details.plotInfo.projectName} - ${details.plotInfo.plotNo}`;
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
  }
  // Could add more dynamic titles for other user pages if needed

  return (
    <div className="flex h-screen bg-neutral-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
