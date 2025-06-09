import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  IconCog,
  IconCollection,
  IconDashboard,
  IconInformationCircle,
  IconLogout,
  IconMapPin,
  IconPlus,
  IconShieldCheck,
  IconTableCells,
  IconUsers,
  IconWallet,
  generateUserCode
} from '../constants';
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

const ProfileSection: React.FC = () => {
  // Example user profile state (replace with real user data as needed)
  const [profile] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91 9876543210",
    photo: "",
    company: "Cashback Homes",
    joiningDate: new Date(),
  });

  // Generate User Code
  const userCode = generateUserCode(profile.name, profile.joiningDate);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative w-full mb-4">
      <div
        className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 cursor-pointer"
        onClick={() => setDropdownOpen((open) => !open)}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-2 border-primary agent-photo">
            {profile.photo ? (
              <img src={profile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              profile.name[0]
            )}
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-primary-light truncate">{profile.name}</span>
          <span className="text-xs text-gray-500 truncate">{profile.email}</span>
        </div>
        <span className="ml-auto">
          <svg className={`w-5 h-5 text-primary transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {/* Dropdown */}
      <div
        className={`absolute left-0 right-0 z-30 bg-white rounded-lg shadow-lg border border-neutral-200 mt-2 transition-all duration-200 origin-top ${
          dropdownOpen ? "scale-y-100 opacity-100 pointer-events-auto" : "scale-y-95 opacity-0 pointer-events-none"
        }`}
        style={{ minWidth: "220px", maxWidth: "100%", width: "100%" }}
      >
        <div className="p-4 flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden agent-photo border-4 border-primary">
              {profile.photo ? (
                <img src={profile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.name[0]
              )}
            </div>
          </div>
          <div className="mt-1 text-lg font-semibold text-primary-light">{profile.name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <span>{profile.phone}</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <span>{profile.email}</span>
          </div>
          <div className="mt-2 text-xs text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded shadow-sm">
            User Code: <span className="text-primary font-semibold">{userCode}</span>
          </div>
          <button
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition font-semibold flex items-center gap-2"
            onClick={() => {
              setDropdownOpen(false);
              // Go to user profile page (myprofile)
              navigate("/myprofile");
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L7.5 20.5H3v-4.5L16.732 3.732z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>
      {/* Overlay for dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          style={{ background: "transparent" }}
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
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
    { to: "/my-bookings", icon: <IconWallet className="w-5 h-5" />, label: "My Bookings / Properties" },
    { to: "/plots", icon: <IconMapPin className="w-5 h-5" />, label: "Plot Marketplace" },
    { to: "/mysqft-listing", icon: <IconTableCells className="w-5 h-5" />, label: "Book My SqFt" },
    { to: "/materials", icon: <IconCollection className="w-5 h-5" />, label: "Materials Store" },
    { to: "/services", icon: <IconUsers className="w-5 h-5" />, label: "Professional Services" },
    { to: "/book-my-sqft/B001", icon: <IconShieldCheck className="w-5 h-5" />, label: "View Plot Details" },
    { to: "/refer-earn", icon: <IconPlus className="w-5 h-5" />, label: "Refer & Earn" },
    { to: "/knowledge-base", icon: <IconInformationCircle className="w-5 h-5" />, label: "Knowledge Base" },
    { to: "/help-support", icon: <IconCog className="w-5 h-5" />, label: "Help & Support" },
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
        {/* Profile section at the top */}
        <ProfileSection />
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
              {...(sidebarOpen ? { onClick: () => setSidebarOpen(false) } : {})}
            />
          ))}
          <div className="my-2 border-t border-neutral-700"></div>
        </nav>
        <div className="mt-auto">
          <hr className="my-2 border-t border-neutral-300" />
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-semibold text-black hover:bg-red-600 hover:text-white transition-colors duration-150 rounded-md"
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
