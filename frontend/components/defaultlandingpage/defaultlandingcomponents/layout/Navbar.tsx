import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { DNAV_LINKS } from '../../../../constants';
import AuthForm from '../../../auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <span className="inline-block w-9 h-9 rounded-full bg-gradient-to-br from-green-400 via-green-200 to-green-600 shadow-lg flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4"
                    />
                  </svg>
                </span>
                <span className="text-2xl font-extrabold text-green-700 tracking-tight drop-shadow">
                  Cashback Farms
                </span>
              </Link>
            </div>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-2">
              {DNAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-base font-semibold transition-all duration-150 ${isActive
                      ? 'bg-gradient-to-r from-green-500 to-green-700 text-white shadow'
                      : 'text-green-700 hover:bg-green-100 hover:text-green-900'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {currentUser ? (
                <button
                  className="w-full mt-2 px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-700 shadow hover:from-green-600 hover:to-green-800 transition"
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('currentUser')
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              ) : (
                <div className='flex flex-col md:flex-row md:items-center gap-2'>
                  <button
                    className="w-full md:w-auto mt-2 px-4 text-sm py-2 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-700 shadow hover:from-green-600 hover:to-green-800 transition whitespace-nowrap"
                    onClick={() => {
                      setIsOpen(false);
                      setShowAuth(true);
                    }}
                  >
                    Login / Sign Up
                  </button>
                  <button
                    className="w-full md:w-auto mt-2 px-4 text-sm py-2 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-700 shadow hover:from-green-600 hover:to-green-800 transition"
                    onClick={() => {
                      navigate('/registration');
                    }}
                  >
                    Registration
                  </button>
                </div>
              )}
            </div>
            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7h16M4 12h16M4 17h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex"
            onClick={() => setIsOpen(false)}
          >
            {/* Side Drawer */}
            <div
              className="ml-auto w-4/5 max-w-xs h-full bg-white shadow-2xl rounded-l-3xl p-6 flex flex-col gap-4 animate-slide-in"
              onClick={e => e.stopPropagation()}
              style={{
                minWidth: 260,
                minHeight: '100vh',
                backgroundColor: "#fff", // force solid white
                boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15), 0 1.5px 6px 0 rgba(0,0,0,0.04)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-green-700">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {DNAV_LINKS.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-base font-semibold ${isActive
                        ? 'bg-gradient-to-r from-green-500 to-green-700 text-white shadow'
                        : 'text-green-700 hover:bg-green-100 hover:text-green-900'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                {currentUser ? (
                  <button
                    className="w-full mt-2 px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-700 shadow hover:from-green-600 hover:to-green-800 transition"
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('refresh_token');
                      localStorage.removeItem('currentUser')
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <div className='flex'>
                    <button
                      className="w-full mt-2 px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-700 shadow hover:from-green-600 hover:to-green-800 transition"
                      onClick={() => {
                        setIsOpen(false);
                        setShowAuth(true);
                      }}
                    >
                      Login / Sign Up
                    </button>
                    <button
                      className="w-full mt-2 px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-700 shadow hover:from-green-600 hover:to-green-800 transition"
                      onClick={() => {
                        navigate('/registration');
                      }}
                    >
                      Registration
                    </button>
                  </div>
                )}
              </div>
            </div>
            <style>{`
              .animate-slide-in {
                animation: slideInRight 0.35s cubic-bezier(.4,0,.2,1);
              }
              @keyframes slideInRight {
                0% { transform: translateX(100%); opacity: 0.5; }
                100% { transform: translateX(0); opacity: 1; }
              }
            `}</style>
          </div>
        )}
      </nav>
      <AuthForm isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Navbar;