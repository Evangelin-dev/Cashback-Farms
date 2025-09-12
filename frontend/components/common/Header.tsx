import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  pageTitle?: string;
}

// Inline SVG icon components
const IconChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const IconLogout = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
  </svg>
);
const IconUserCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2" />
  </svg>
);


const Header: React.FC<HeaderProps> = ({ pageTitle = "Dashboard" }) => {
  // const [userMenuOpen, setUserMenuOpen] = useState(false); // Not used
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  // Fetch current location for agent and b2b_vendor only (no b2b_agent in system)
  useEffect(() => {
    // Show location for agent (real_estate_agent) and b2b_vendor
    const isAgent = currentUser?.role === UserRole.ADMIN && (
      currentUser?.user_type === 'real_estate_agent' ||
      currentUser?.user_type === 'b2b_vendor'
    );
    if (isAgent) {
      setCurrentLocation('Detecting...');
    const fetchCurrentLocation = () => {
      if (!navigator.geolocation) {
        setCurrentLocation('Geolocation is not supported.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                referrerPolicy: 'no-referrer', 
                headers: { 'User-Agent': 'GreenheapWebApp/1.0' },
              }
            );
            if (!response.ok) throw new Error('Failed to reverse geocode');
            const data = await response.json();
            const locationName = data.address?.city || data.address?.state_district || data.address?.county || 'Location Found';
            setCurrentLocation(locationName);
          } catch (error) {
            setCurrentLocation('Could not determine location.');
          }
        },
        () => { setCurrentLocation('Location access denied.'); }
      );
    };
    fetchCurrentLocation();
    } else {
      setCurrentLocation(null);
    }
  }, [currentUser?.role, currentUser?.user_type]);

  // const handleLogout = () => {
  //   logout();
  //   navigate('/');
  // };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl md:text-2xl font-semibold text-neutral-800">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        {/* Show current location for agent (real_estate_agent) and b2b_vendor only (no b2b_agent in system) */}
        {currentUser?.role === UserRole.ADMIN && (
          currentUser?.user_type === 'real_estate_agent' ||
          currentUser?.user_type === 'b2b_vendor'
        ) && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-1">📍</span>
            <span>Current Location: <span className="font-semibold text-green-700">{currentLocation}</span></span>
          </div>
        )}
        <button
          className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary-dark transition font-semibold"
          onClick={() => navigate('/')}
        >
          Home
        </button>
      </div>
    </header>
  );
};

export default Header;

  // {currentUser && (
  //       <div className="relative">
  //         <button 
  //           onClick={() => setUserMenuOpen(!userMenuOpen)}
  //           className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-100 transition-colors"
  //           aria-expanded={userMenuOpen}
  //           aria-haspopup="true"
  //           aria-controls="user-menu"
  //         >
  //           <IconUserCircle className="w-8 h-8 text-neutral-500" />
  //           <span className="hidden md:inline text-sm text-neutral-700 font-medium">
  //             {currentUser.name || currentUser.mobile}
  //           </span>
  //           <IconChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
  //         </button>
  //         {userMenuOpen && (
  //           <div 
  //             id="user-menu"
  //             className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-neutral-200 animate-fadeIn"
  //             role="menu"
  //             onMouseLeave={() => setUserMenuOpen(false)}
  //           >
  //             {/* Creative Profile Card */}
  //             <div className="px-4 pt-4 pb-2 border-b border-neutral-100 mb-1">
  //               <MyProfile
  //                 name={currentUser.name || 'No Name'}
  //                 mobile={currentUser.mobile}
  //                 role={currentUser.role}
  //               />
  //             </div>
  //             {/* Profile/Settings Link */}
  //             <Link 
  //               to={currentUser.role === 'Admin' ? "/admin/settings" : "/profile"} 
  //               role="menuitem" 
  //               className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
  //               onClick={() => setUserMenuOpen(false)}
  //             >
  //               {currentUser.role === 'Admin' ? 'Settings' : 'Profile'}
  //             </Link>
  //             {/* Logout Button */}
  //             <button 
  //               onClick={() => { handleLogout(); setUserMenuOpen(false); }} 
  //               role="menuitem" 
  //               className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
  //             >
  //               <IconLogout className="w-4 h-4 mr-2" />
  //               Logout
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     )}