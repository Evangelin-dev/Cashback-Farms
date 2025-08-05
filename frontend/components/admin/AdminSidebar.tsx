import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  IconBuildingOffice,
  IconCog,
  IconCollection,
  IconCreditCard,
  IconCubeTransparent,
  IconDashboard,
  IconEdit,
  IconLogout,
  IconMapPin,
  IconTableCells,
  IconUsers
} from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { Home } from 'lucide-react';

interface AdminNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (location.pathname.startsWith(to) && to !== "/admin" && to !== "/");

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm hover:bg-primary-dark hover:text-white transition-colors duration-150 rounded-md
                  ${isActive ? 'bg-primary text-white font-semibold shadow-md' : 'text-black hover:bg-primary-dark'}`}
      onClick={onClick}
    >
      <span className="mr-3 w-5 h-5">{icon}</span>
      {label}
    </Link>
  );
};

const AdminSidebar: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const adminProfile = {
    name: currentUser?.username || "Admin",
    email: currentUser?.email || "",
    photo: "",
  };
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((open) => !open);
  const handleNavClick = () => {
    setSidebarOpen(false);
  };
  const handleConfirmLogout = () => {
    logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
    setIsLogoutModalOpen(false);
    setSidebarOpen(false);
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gradient-to-br from-green-500 to-green-700 text-white p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Open sidebar"
        style={{ boxShadow: '0 4px 24px 0 rgba(34,197,94,0.15)' }}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={`
          fixed z-40 top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col p-4 space-y-2 border-r border-green-200
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-64 md:flex
        `}
        style={{
          minWidth: "17rem",
          borderTopRightRadius: 32,
          borderBottomRightRadius: 32,
          boxShadow: sidebarOpen ? "0 8px 32px 0 rgba(34,197,94,0.15)" : undefined,
          background: "linear-gradient(135deg, #f0fdf4 60%, #e0f2f1 100%)",
          marginTop: sidebarOpen ? 50 : 0,
          overflowY: "auto",
          maxHeight: "100vh"
        }}
      >
        <div className="relative w-full">
          <div
            className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-primary/10 transition"
            onClick={toggleDropdown}
            style={{ minHeight: 56 }}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-2 border-primary agent-photo">
                {adminProfile.photo ? (
                  <img src={adminProfile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  adminProfile.name[0]
                )}
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-primary-light truncate">{adminProfile.name}</span>
              <span className="text-xs text-gray-500 truncate">{adminProfile.email}</span>
            </div>
            <span className="ml-auto">
              <svg className={`w-5 h-5 text-primary transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
          <div
            className={`absolute left-0 right-0 z-30 bg-white rounded-lg shadow-lg border border-neutral-200 mt-2 transition-all duration-200 origin-top ${dropdownOpen ? "scale-y-100 opacity-100 pointer-events-auto" : "scale-y-95 opacity-0 pointer-events-none"
              }`}
            style={{ minWidth: "220px", maxWidth: "100%", width: "100%" }}
          >
            <div className="p-4 flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden agent-photo border-4 border-primary">
                  {adminProfile.photo ? (<img src={adminProfile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" />) : (adminProfile.name[0])}
                </div>
              </div>
              <div className="mt-1 text-lg font-semibold text-primary-light">{adminProfile.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                <span>{adminProfile.email}</span>
              </div>
              <button className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition font-semibold flex items-center gap-2" onClick={() => { setDropdownOpen(false); navigate("/admin/profile"); }}>
                <IconEdit className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
          {dropdownOpen && (
            <div className="fixed inset-0 z-10" style={{ background: "transparent" }} onClick={() => setDropdownOpen(false)} />
          )}
        </div>

        <div className="text-2xl font-bold text-black py-4 px-2 mb-4 border-b border-neutral-200">
          Admin<span className="text-primary-light">Panel</span>
        </div>
        <nav className="flex-grow space-y-1">
          <AdminNavItem to="/admin/dashboard" icon={<IconDashboard className="w-5 h-5" />} label="Dashboard" />
          <div className="pt-2 pb-1 px-2 text-xs text-neutral-800 uppercase tracking-wider">Manage Content</div>
          <AdminNavItem to="/admin/plots" icon={<IconTableCells className="w-5 h-5" />} label="Post Your Plots" onClick={handleNavClick} />
          <AdminNavItem to="/admin/verifiedplot" icon={<IconTableCells className="w-5 h-5" />} label="Greenheap Verified Plots" onClick={handleNavClick} />
          <AdminNavItem to="/admin/microplot" icon={<IconMapPin className="w-5 h-5" />} label="Post GIOO Plots" onClick={handleNavClick} />
          <AdminNavItem to="/admin/commercial" icon={<IconBuildingOffice className="w-5 h-5" />} label="Commercial Properties" onClick={handleNavClick} />
          <AdminNavItem to="/admin/kyc" icon={<IconCreditCard className="w-5 h-5" />} label="KYC Management" onClick={handleNavClick} />
          <AdminNavItem to="/admin/bookings" icon={<IconCollection className="w-5 h-5" />} label="Bookings" onClick={handleNavClick} />
          <AdminNavItem to="/admin/payments" icon={<IconCreditCard className="w-5 h--5" />} label="Payments" onClick={handleNavClick} />

          <div className="pt-4 pb-1 px-2 text-xs text-neutral-800 uppercase tracking-wider">Manage Site</div>
          <AdminNavItem to="/admin/users" icon={<IconUsers className="w-5 h-5" />} label="Users" onClick={handleNavClick} />
          <AdminNavItem to="/admin/materials" icon={<IconCubeTransparent className="w-5 h-5" />} label="Construction Materials" onClick={handleNavClick} />

          {/* --- NEW: Link to the homepage --- */}
          <AdminNavItem to="/" icon={<Home className="w-5 h-5" />} label="Go to Homepage" onClick={handleNavClick} />
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center w-full px-4 py-3 text-sm text-black hover:bg-red-700 hover:text-white transition-colors duration-150 rounded-md"
          >
            <span className="mr-3 w-5 h-5"><IconLogout className="w-5 h-5" /></span>
            Exit Admin
          </button>
        </div>
      </div>

      {sidebarOpen && (<div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />)}

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to exit the admin panel?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold transition-colors">Cancel</button>
              <button onClick={handleConfirmLogout} className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 font-semibold transition-colors">Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;