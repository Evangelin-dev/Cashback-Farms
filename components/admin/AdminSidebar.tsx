
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  IconDashboard, 
  IconTableCells, 
  IconCollection, 
  IconUsers, 
  IconBuildingOffice, 
  IconCubeTransparent, 
  IconCreditCard,
  IconCog,
  IconLogout
} from '../../constants';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

interface AdminNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (location.pathname.startsWith(to) && to !== "/admin" && to !== "/");

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

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth(); // Get logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Navigation will be handled by ProtectedRoute to /admin/login or /login
  };

  return (
    <div className="w-72 bg-neutral-900 text-white flex flex-col p-4 space-y-2">
      <div className="text-2xl font-bold text-primary-light py-4 px-2 mb-4 border-b border-neutral-700">
        Admin<span className="text-white">Panel</span>
      </div>
      <nav className="flex-grow space-y-1">
        <AdminNavItem to="/admin/dashboard" icon={<IconDashboard className="w-5 h-5" />} label="Dashboard" />
        <div className="pt-2 pb-1 px-2 text-xs text-neutral-400 uppercase tracking-wider">Manage Content</div>
        <AdminNavItem to="/admin/plots" icon={<IconTableCells className="w-5 h-5" />} label="Plots (Residential)" />
        <AdminNavItem to="/admin/commercial" icon={<IconBuildingOffice className="w-5 h-5" />} label="Commercial Properties" />
        <AdminNavItem to="/admin/bookings" icon={<IconCollection className="w-5 h-5" />} label="Bookings" />
        <AdminNavItem to="/admin/payments" icon={<IconCreditCard className="w-5 h-5" />} label="Payments" />
        
        <div className="pt-4 pb-1 px-2 text-xs text-neutral-400 uppercase tracking-wider">Manage Site</div>
        <AdminNavItem to="/admin/users" icon={<IconUsers className="w-5 h-5" />} label="Users" />
        <AdminNavItem to="/admin/site" icon={<IconBuildingOffice className="w-5 h-5" />} label="Project Site Details" />
        <AdminNavItem to="/admin/materials" icon={<IconCubeTransparent className="w-5 h-5" />} label="Construction Materials" />
        
        <div className="pt-4 pb-1 px-2 text-xs text-neutral-400 uppercase tracking-wider">System</div>
        <AdminNavItem to="/admin/settings" icon={<IconCog className="w-5 h-5" />} label="Settings" />
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm text-neutral-200 hover:bg-red-700 hover:text-white transition-colors duration-150 rounded-md"
        >
          <span className="mr-3 w-5 h-5"><IconLogout className="w-5 h-5" /></span>
          Exit Admin
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
