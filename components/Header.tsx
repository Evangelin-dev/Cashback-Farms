import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconChevronDown, IconLogout, IconUserCircle } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import MyProfile from './myprofile/myprofile';

interface HeaderProps {
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle = "Dashboard" }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl md:text-2xl font-semibold text-neutral-800">{pageTitle}</h1>
      {currentUser && (
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-100 transition-colors"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            aria-controls="user-menu"
          >
            <IconUserCircle className="w-8 h-8 text-neutral-500" />
            <span className="hidden md:inline text-sm text-neutral-700 font-medium">
              {currentUser.name || currentUser.mobile}
            </span>
            <IconChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {userMenuOpen && (
            <div 
              id="user-menu"
              className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-neutral-200 animate-fadeIn"
              role="menu"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              {/* Creative Profile Card */}
              <div className="px-4 pt-4 pb-2 border-b border-neutral-100 mb-1">
                <MyProfile
                  name={currentUser.name || 'No Name'}
                  mobile={currentUser.mobile}
                  role={currentUser.role}
                />
              </div>
              {/* Profile/Settings Link */}
              <Link 
                to={currentUser.role === 'Admin' ? "/admin/settings" : "/profile"} 
                role="menuitem" 
                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                onClick={() => setUserMenuOpen(false)}
              >
                {currentUser.role === 'Admin' ? 'Settings' : 'Profile'}
              </Link>
              {/* Logout Button */}
              <button 
                onClick={() => { handleLogout(); setUserMenuOpen(false); }} 
                role="menuitem" 
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <IconLogout className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
