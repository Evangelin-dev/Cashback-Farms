import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { DNAV_LINKS } from '../../../../constants';
import AuthForm from '../../../auth/AuthForm';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  // Effect to handle closing the profile dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Centralized logout function for reusability
  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      // Fallback if context function isn't available
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('currentUser');
    }
    setIsProfileOpen(false); // Close desktop dropdown
    setIsOpen(false);      // Close mobile menu
    navigate('/');         // Navigate to home
    window.location.reload(); // Force a refresh to clear all application state
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* --- Group 1: Logo --- */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <img src="/images/logobg.png" className='w-20 h-20' alt="cashbackfarms-logo" />
              </Link>
            </div>

            {/* --- Group 2: Desktop Navigation Links --- */}
            <div className="hidden md:flex items-center space-x-2">
              {DNAV_LINKS.map((link) => (
                <NavLink key={link.name} to={link.path} className={({ isActive }) => `px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 whitespace-nowrap ${isActive ? 'bg-green-600 text-white shadow' : 'text-green-800 hover:bg-green-100'}`}>
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* --- Group 3: Desktop Authentication Section --- */}
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <>
                  {/* Show buttons based on user type */}
                  {(currentUser.user_type === 'admin'  ) && (
                    <button
                      className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-green-800 bg-green-100 border border-green-300 shadow hover:bg-green-200 transition whitespace-nowrap"
                      style={{ marginRight: 8 }}
                      onClick={() => navigate('/admin/plots')}
                    >
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Upload plot
                    </button>
                  )}
                  {currentUser.user_type === 'admin' && (
                    <button
                      className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-green-800 bg-green-100 border border-green-300 shadow hover:bg-green-200 transition whitespace-nowrap"
                      style={{ marginRight: 8 }}
                      onClick={() => navigate('/admin/verifiedplot')}
                    >
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Verified Plot
                    </button>
                  )}           
                  {(currentUser.user_type === 'real_estate_agent' ) && (
                    <button
                      className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-green-800 bg-green-100 border border-green-300 shadow hover:bg-green-200 transition whitespace-nowrap"
                      style={{ marginRight: 8 }}
                      onClick={() => navigate('/realestate/post-plots')}
                    >
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Upload plot
                    </button>
                  )}
                  {/* Profile dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full text-white font-bold text-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </button>
                    {isProfileOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b">
                            <p className="text-sm text-gray-700">Signed in as</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p>
                          </div>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              if (currentUser && (currentUser.user_type === 'admin' || currentUser.usertype === 'admin')) {
                                navigate('/admin/dashboard');
                              } else if (currentUser && (currentUser.user_type === 'b2b_vendor' || currentUser.usertype === 'b2b_vendor')) {
                                navigate('/b2b/products');
                              } else if (currentUser && (currentUser.user_type === 'real_estate_agent' || currentUser.usertype === 'real_estate_agent')) {
                                navigate('/realestate/dashboard');
                              }
                              else {
                                navigate('/user-dashboard');
                              }
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            User Dashboard
                          </button>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50">
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // If LOGGED OUT, show the login/register buttons
                <div className='flex items-center gap-2'>
                  <button onClick={() => setShowAuth(true)} className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-green-600 shadow hover:bg-green-700 transition whitespace-nowrap">
                    Login / Sign Up
                  </button>
                  <button onClick={() => navigate('/registration')} className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-green-600 shadow hover:bg-green-700 transition">
                    Registration
                  </button>
                </div>
              )}
            </div>

            {/* --- Mobile Hamburger Button --- */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-full text-white bg-green-500 shadow-lg focus:outline-none">
                {!isOpen ? (
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                ) : (
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* --- FULL MOBILE MENU (SLIDE-OUT PANEL) --- */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu">
            {/* Click-away overlay */}
            <div className="fixed  bg-white z-40 bg-black/40" onClick={() => setIsOpen(false)}></div>
            {/* Menu Panel */}
            <div className="fixed bg-white inset-y-0 right-0 z-50 w-4/5 max-w-xs h-full bg-white shadow-2xl rounded-l-3xl p-6 flex flex-col gap-4 animate-slide-in" onClick={e => e.stopPropagation()}>
              <div className="flex bg-white items-center justify-between mb-4">
                <span className="text-xl font-bold text-green-700">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700">
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex bg-white p-4 flex-col gap-2 flex-grow">
                {/* Standard navigation links */}
                {DNAV_LINKS.map((link) => (
                  <NavLink key={link.name} to={link.path} onClick={() => setIsOpen(false)} className={({ isActive }) => `px-4 py-3 rounded-xl text-base font-semibold ${isActive ? 'bg-green-600 text-white shadow' : 'text-green-700 hover:bg-green-100'}`}>
                    {link.name}
                  </NavLink>
                ))}

                <hr className="my-4 border-gray-200" />

                {/* Mobile Auth Section */}
                {currentUser ? (
                  // Mobile view when LOGGED IN
                  <>
                    <div className="px-4 py-2">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{currentUser.email}</p>
                    </div>
                    <NavLink to="/user-dashboard" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-green-700 hover:bg-green-100">
                      User Dashboard
                    </NavLink>
                    <div className="mt-auto">
                      <button onClick={handleLogout} className="w-full mt-2 px-4 py-3 rounded-xl font-bold text-white bg-red-600 shadow hover:bg-red-700 transition">
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  // Mobile view when LOGGED OUT
                  <div className="flex flex-col gap-2 mt-auto">
                    <button onClick={() => { setIsOpen(false); setShowAuth(true); }} className="w-full px-4 py-3 rounded-xl font-bold text-white bg-green-600 shadow hover:bg-green-700 transition">
                      Login / Sign Up
                    </button>
                    <button onClick={() => { setIsOpen(false); navigate('/registration'); }} className="w-full px-4 py-3 rounded-xl font-bold text-white bg-green-600 shadow hover:bg-green-700 transition">
                      Registration
                    </button>
                  </div>
                )}
              </div>
            </div>
            <style>{`.animate-slide-in { animation: slideInRight 0.3s ease-out; } @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
          </div>
        )}
      </nav>
      {/* The AuthForm modal, which is controlled by the buttons */}
      <AuthForm isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Navbar;