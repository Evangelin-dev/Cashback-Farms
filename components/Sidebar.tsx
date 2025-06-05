import React from 'react';
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
  const { logout } = useAuth(); // Get logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
    // Navigation to login will be handled by ProtectedRoute
  };

  return (
    <div className="w-64 bg-white text-black flex flex-col p-4 space-y-2">
      <div className="text-2xl font-bold text-primary-light py-4 px-2 mb-4 border-b border-neutral-700">
        Cashback<span className="text-black">Homes</span>
      </div>
      <nav className="flex-grow space-y-1">
        <NavItem to="/" icon={<IconDashboard className="w-5 h-5" />} label="Home" exact={true} />
        <NavItem to="/profile" icon={<IconUserCircle className="w-5 h-5" />} label="My Profile" />
        <NavItem to="/my-bookings" icon={<IconCollection className="w-5 h-5" />} label="My Bookings / Properties" />
        <NavItem to="/plots" icon={<IconMapPin className="w-5 h-5" />} label="Plot Marketplace " />
        {/* Book My SqFt */}
        <NavItem to="/book-my-sqft/bms-plot-alpha" icon={<IconBuildingOffice className="w-5 h-5" />} label="Book My SqFt" />
        <NavItem to="/materials" icon={<IconCollection className="w-5 h-5" />} label="Materials Store" />
        <NavItem to="/services" icon={<IconUsers className="w-5 h-5" />} label="Professional Services" />
        <NavItem to="/book-my-sqft/B001" icon={<IconMapPin className="w-5 h-5" />} label="View Plot Details" /> 
        <NavItem to="/refer-earn" icon={<IconBuildingOffice className="w-5 h-5" />} label="Refer & Earn" /> 
        <NavItem to="/knowledge-base" icon={<IconCog className="w-5 h-5" />} label="Knowledge Base" />
        <NavItem to="/help-support" icon={<IconInformationCircle className="w-5 h-5" />} label="Help & Support" />
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
  );
};

export default Sidebar;
