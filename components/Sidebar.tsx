
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconDashboard, IconUserCircle, IconBuildingOffice, IconCollection, IconInformationCircle, IconLogout, IconMapPin, IconKey } from '../constants';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

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
      className={`flex items-center px-4 py-3 text-sm hover:bg-primary-dark hover:text-white transition-colors duration-150 rounded-md
                  ${isActive ? 'bg-primary text-white font-semibold shadow-md' : 'text-neutral-200 hover:bg-primary-dark'}`}
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
    <div className="w-64 bg-neutral-800 text-white flex flex-col p-4 space-y-2">
      <div className="text-2xl font-bold text-primary-light py-4 px-2 mb-4 border-b border-neutral-700">
        Cashback<span className="text-white">Homes</span>
      </div>
      <nav className="flex-grow space-y-1">
        <NavItem to="/" icon={<IconDashboard className="w-5 h-5" />} label="Home / Search" exact={true} />
        <NavItem to="/profile" icon={<IconUserCircle className="w-5 h-5" />} label="My Profile" />
        <NavItem to="/my-bookings" icon={<IconCollection className="w-5 h-5" />} label="My Bookings / Properties" />
        <NavItem to="/book-my-sqft/B001" icon={<IconMapPin className="w-5 h-5" />} label="View Plot Details" /> 
        <NavItem to="/refer-earn" icon={<IconBuildingOffice className="w-5 h-5" />} label="Refer & Earn" /> 
        <NavItem to="/knowledge-base" icon={<IconInformationCircle className="w-5 h-5" />} label="Knowledge Base" />
        <NavItem to="/help-support" icon={<IconInformationCircle className="w-5 h-5" />} label="Help & Support" />
        <div className="my-2 border-t border-neutral-700"></div>
        {/* Link to /admin; ProtectedRoute will manage access to login or dashboard */}
        <NavItem to="/admin" icon={<IconKey className="w-5 h-5" />} label="Admin Panel" />
      </nav>
      <div className="mt-auto">
         <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm text-neutral-200 hover:bg-red-700 hover:text-white transition-colors duration-150 rounded-md"
          >
            <span className="mr-3 w-5 h-5"><IconLogout className="w-5 h-5" /></span>
            Logout
          </button>
      </div>
    </div>
  );
};

export default Sidebar;
