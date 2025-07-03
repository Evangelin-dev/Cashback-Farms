import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  IconCog,
  IconCollection,
  IconInformationCircle,
  IconLogout,
  IconMapPin,
  IconTableCells,
  IconUsers,
  IconWallet,
  generateUserCode
} from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { Home ,LayoutDashboard } from "lucide-react";
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

const NavItem: React.FC<NavItemProps & { onClick?: () => void }> = ({ to, icon, label, exact = false, onClick }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : (location.pathname === to || (to !== "/" && location.pathname.startsWith(to)));

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm transition-colors duration-150 rounded-md
                  ${isActive ? 'bg-primary text-white font-semibold shadow-md' : 'text-black hover:bg-primary hover:text-white'}`}
      onClick={onClick}
    >
      <span className="mr-3 w-5 h-5">{icon}</span>
      {label}
    </Link>
  );
};

const ProfileSection: React.FC = () => {
  const { currentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Don't use useState for profile - derive it directly from currentUser
  const profile = {
    name: currentUser?.username || "User",
    email: currentUser?.email || "",
    phone: currentUser?.mobile_number || "",
    photo: currentUser?.photo || "", // Add this if you have photo in currentUser
    company: currentUser?.company || "",
    joiningDate: currentUser?.created_at ? new Date(currentUser.created_at) : new Date(),
  };

  // Generate User Code
  const userCode = generateUserCode(profile.name, profile.joiningDate);

  // Add loading state if needed
  if (!currentUser) {
    return (
      <div className="w-full mb-4 p-4 rounded-lg bg-gray-100 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

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
              profile.name[0]?.toUpperCase() || "U"
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
                profile.name[0]?.toUpperCase() || "U"
              )}
            </div>
          </div>
          <div className="mt-1 text-lg font-semibold text-primary-light">{profile.name}</div>
          {profile.phone && (
            <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.email && (
            <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
              <span>{profile.email}</span>
            </div>
          )}
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  // Sidebar menu items
  const menuItems = [
    { to: "/Landing", icon: <Home className="w-5 h-5" />, label: "Home", exact: true },
    { to: "/user-dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "My Dashboard", exact: true },
    { to: "/my-bookings", icon: <IconWallet className="w-5 h-5" />, label: "My Bookings / Properties" },
    { to: "/plots", icon: <IconMapPin className="w-5 h-5" />, label: "Plot Marketplace" },
    { to: "/mysqft-listing", icon: <IconTableCells className="w-5 h-5" />, label: "Micro Plots" },
    { to: "/materials", icon: <IconCollection className="w-5 h-5" />, label: "Materials Store" },
    { to: "/services", icon: <IconUsers className="w-5 h-5" />, label: "Professional Services" },
    // { to: "/book-my-sqft/B001", icon: <IconShieldCheck className="w-5 h-5" />, label: "View Plot Details" },
    // { to: "/refer-earn", icon: <IconPlus className="w-5 h-5" />, label: "Refer & Earn" },
    { to: "/knowledge-base", icon: <IconInformationCircle className="w-5 h-5" />, label: "Knowledge Base" },
    { to: "/help-support", icon: <IconCog className="w-5 h-5" />, label: "Help & Support" },
  ];

  return (
    <>
      {/* Mobile menu button */}
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
      {/* Sidebar as creative side drawer on mobile, static on desktop */}
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
          marginTop: sidebarOpen ? 60 : 0,
          overflowY: "auto", // Make sidebar scrollable
          maxHeight: "100vh"
        }}
      >
        {/* Profile section at the top */}
        <ProfileSection />
        <div className="text-xl font-bold text-green-700 py-4 px-2 mb-4 border-b border-green-200 flex items-center gap-2">
          <img src='/images/logobg.png' alt="CashbackHomes Logo" className="w-10 h-10" />
          Cashback<span className="text-black text-md">Homes</span>
        </div>
        <nav className="flex-grow space-y-1">
          {menuItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              exact={item.exact}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
          <div className="my-2 border-t border-green-200"></div>
        </nav>
        <div className="mt-auto">
          <hr className="my-2 border-t border-green-100" />
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
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-glass {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(16px);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
