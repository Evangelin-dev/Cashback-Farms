import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconBuildingOffice, IconCog, IconCollection, IconDashboard, IconInformationCircle, IconLogout, IconMapPin, IconUserCircle, IconUsers } from '../constants';
import { useAuth } from '../contexts/AuthContext';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, exact = false }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : (location.pathname === to || (to !== "/" && location.pathname.startsWith(to)));

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm transition-colors duration-150 rounded-md
                  ${isActive ? 'bg-primary text-white font-semibold shadow-md' : 'text-black hover:bg-primary hover:text-white'}`}
    >
      <span className="mr-3 w-5 h-5">{icon}</span>
      {label}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sidebar menu items
  const menuItems = [
    { to: "/", icon: <IconDashboard className="w-5 h-5" />, label: "Home", exact: true },
    { to: "/profile", icon: <IconUserCircle className="w-5 h-5" />, label: "My Profile" },
    { to: "/my-bookings", icon: <IconCollection className="w-5 h-5" />, label: "My Bookings / Properties" },
    { to: "/plots", icon: <IconMapPin className="w-5 h-5" />, label: "Plot Marketplace " },
    { to: "/mysqft-listing", icon: <IconBuildingOffice className="w-5 h-5" />, label: "Book My SqFt" },
    { to: "/materials", icon: <IconCollection className="w-5 h-5" />, label: "Materials Store" },
    { to: "/services", icon: <IconUsers className="w-5 h-5" />, label: "Professional Services" },
    { to: "/book-my-sqft/B001", icon: <IconMapPin className="w-5 h-5" />, label: "View Plot Details" },
    { to: "/refer-earn", icon: <IconBuildingOffice className="w-5 h-5" />, label: "Refer & Earn" },
    { to: "/knowledge-base", icon: <IconCog className="w-5 h-5" />, label: "Knowledge Base" },
    { to: "/help-support", icon: <IconInformationCircle className="w-5 h-5" />, label: "Help & Support" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded shadow-md"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Sidebar as drawer on mobile, static on desktop */}
      <div
        className={`
          fixed z-40 top-0 left-0 h-full w-64 bg-white text-black flex flex-col p-4 space-y-2 border-r border-neutral-700
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-64 md:flex
        `}
        style={{ minWidth: "16rem" }}
      >
        <div className="text-2xl font-bold text-primary-light py-4 px-2 mb-4 border-b border-neutral-700">
          Cashback<span className="text-black">Homes</span>
        </div>
        <nav className="flex-grow space-y-1">
          {menuItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              exact={item.exact}
              // Close sidebar on mobile after navigation
              {...(sidebarOpen ? { onClick: () => setSidebarOpen(false) } : {})}
            />
          ))}
          <div className="my-2 border-t border-neutral-700"></div>
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm text-black hover:bg-red-600 hover:text-white transition-colors duration-150 rounded-md"
          >
            <IconLogout className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
