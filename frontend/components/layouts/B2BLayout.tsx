import "@/pages/realestate/AgentProfileSection.css";
import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  IconCollection,
  IconEdit,
  IconLogout,
  IconMapPin,
  IconRupee,
  IconUsers,
  IconWallet
} from "../../constants.tsx";
import Header from "../common/Header.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";

// --- B2B Profile Section (copied from b2bMain) ---
const ProfileSection: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { currentUser } = useAuth();
  const [profile, setProfile] = React.useState({
    email: currentUser?.email || "B2B User",
    phone: currentUser?.mobile_number || "",
    photo: "",
  });
  const [showKyc, setShowKyc] = React.useState(false);
  const [kycStatus, setKycStatus] = React.useState('');
  const navigate = useNavigate();

  // KYC simulation
  const handleKyc = () => {
    setShowKyc(true);
    setTimeout(() => {
      setKycStatus("Verified");
      setProfile((p) => ({ ...p, kycStatus: "Verified" }));
      setShowKyc(false);
    }, 2000);
  };

  // Dropdown toggle
  const toggleDropdown = () => setDropdownOpen((open) => !open);

  // Generate B2B Code for display

  return (
    <div className="relative w-full">
      <div
        className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-primary/10 transition"
        onClick={toggleDropdown}
        style={{ minHeight: 56 }}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-2 border-primary agent-photo">
            {profile.photo ? (
              <img src={profile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              profile.email[0]
            )}
          </div>
        </div>
        <div className="flex flex-col min-w-0">
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
                profile.email[0]
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <span>{profile.phone}</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <span>{profile.email}</span>
          </div>
          {/* <div className="w-full flex flex-col items-center mt-4 mb-2">
            <div className="flex flex-col items-center w-full px-2 py-2 bg-neutral-100 rounded-lg border border-neutral-200">
              <span className="text-xs text-gray-500 mb-1 tracking-wide">KYC Status</span>
              {kycStatus === "Verified" ? (
                <span className="text-green-600 font-semibold flex items-center gap-2 text-sm mb-1" title="Verified">
                  <IconCheck className="w-5 h-5 animate-bounce" />
                  Verified
                </span>
              ) : (
                <span className="text-red-600 font-semibold flex items-center gap-2 text-sm mb-1" title="Not Verified">
                  <IconAlertCircle className="w-5 h-5 animate-pulse" />
                  Not Verified
                </span>
              )}
              {kycStatus !== "Verified" && (
                <button
                  className="mt-2 px-4 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark transition animate-kyc-btn"
                  onClick={handleKyc}
                  disabled={showKyc}
                >
                  {showKyc ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Verify KYC"
                  )}
                </button>
              )}
            </div>
          </div> */}
          {/* Show B2B User Code */}
          <div className="mt-2 text-xs text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded shadow-sm">
          </div>
          <button
                      className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition font-semibold flex items-center gap-2"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/b2b/b2bprofile");
                      }}
                    >
                      <IconEdit className="w-4 h-4" />
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

// --- B2B SideNav using menuItems from b2bMain ---
const menuItems = [
  {
    key: "/b2b/products",
    icon: <IconCollection className="w-5 h-5" />,
    label: "Manage Products",
  },
  {
    key: "/b2b/services",
    icon: <IconUsers className="w-5 h-5" />,
    label: "Manage Services",
  },
  {
    key: "/b2b/orders",
    icon: <IconMapPin className="w-5 h-5" />,
    label: "Product Orders",
  },
  {
    key: "/b2b/pricing",
    icon: <IconRupee className="w-5 h-5" />,
    label: "Pricing & Offers",
  },
  {
    key: "/b2b/customers",
    icon: <IconUsers className="w-5 h-5" />,
    label: "Customers",
  },
  {
    key: "/b2b/wallet",
    icon: <IconWallet className="w-5 h-5" />,
    label: "Wallet / Settlement",
  },
];

const B2BSideNav: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Helper for mobile: close sidebar after navigation
  const handleNavClick = () => {
    setSidebarOpen(false);
  };

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
          marginTop: sidebarOpen ? 50 : 0,
          overflowY: "auto", // Make sidebar scrollable
          maxHeight: "100vh"
        }}
      >
        <ProfileSection />
        <div className="text-2xl font-bold text-primary-light py-4 px-2 mb-4 border-b border-neutral-200">
          B2B<span className="text-black"> Vendor</span>
        </div>
        <nav className="flex-grow space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.key}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm transition-colors duration-150 rounded-md
                ${isActive || location.pathname === item.key ? "bg-primary text-white font-semibold shadow-md" : "text-black hover:bg-primary hover:text-white"}`
              }
            >
              <span className="mr-3 w-5 h-5">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <hr className="my-2 border-t border-neutral-300" />
          <button
            onClick={() => {
              logout();
              navigate("/");
              setSidebarOpen(false);
            }}
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
    </>
  );
};

function getB2BPageTitle(pathname: string): string {
  if (pathname === "/b2b/products") return "Manage Products";
  if (pathname === "/b2b/orders") return "Product Orders";
  if (pathname === "/b2b/pricing") return "Pricing & Offers";
  if (pathname === "/b2b/customers") return "Customers";
  if (pathname === "/b2b/wallet") return "Wallet / Settlement";
  if (pathname === "/b2b/profile") return "Vendor Profile";
  return "B2B Vendor Panel";
}

const B2BLayout: React.FC = () => {
  const location = useLocation();
  const pageTitle = getB2BPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-neutral-100 font-sans">
      <B2BSideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default B2BLayout;
