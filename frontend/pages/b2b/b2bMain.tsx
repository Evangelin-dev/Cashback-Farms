import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  generateB2BCode,
  IconAlertCircle,
  IconCheck,
  IconCollection,
  IconEdit,
  IconLogout,
  IconMapPin,
  IconRupee,
  IconUsers,
  IconWallet,
} from "../../constants.tsx";
import { useAuth } from "../../contexts/AuthContext";
import "../realestate/AgentProfileSection.css"; // Reuse the same CSS for styling


const pageTitles: Record<string, string> = {
  "/b2b/products": "Manage Products",
  "/b2b/orders": "Product Orders",
  "/b2b/pricing": "Pricing & Offers",
  "/b2b/customers": "Customers",
  "/b2b/wallet": "Wallet / Settlement",
  "/b2b/services": "Service Management",
};

// --- B2B Profile Section (Dropdown, attractive, fits in aside) ---
const ProfileSection: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91-9876543210",
    photo: "",
    kycStatus: "Not Verified",
    company: "Acme Supplies",
    joiningDate: new Date(),
  });
  const [showKyc, setShowKyc] = useState(false);
  const [kycStatus, setKycStatus] = useState(profile.kycStatus);

  // Animation state
  const [profileAnim, setProfileAnim] = useState(false);

  // Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email);
  const isPhoneValid = /^\+91\d{10}$/.test(profile.phone);

  // KYC simulation
  const handleKyc = () => {
    setShowKyc(true);
    setTimeout(() => {
      setKycStatus("Verified");
      setProfile((p) => ({ ...p, kycStatus: "Verified" }));
      setShowKyc(false);
    }, 2000);
  };

  const navigate = useNavigate();

  // Dropdown toggle
  const toggleDropdown = () => setDropdownOpen((open) => !open);

  // Generate B2B Code for display
  const b2bCode = generateB2BCode(profile.company || "Acme Supplies", profile.joiningDate || new Date());

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
          <div className="w-full flex flex-col items-center mt-4 mb-2">
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
          </div>
          {/* Show B2B User Code */}
          <div className="mt-2 text-xs text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded shadow-sm">
            B2B User Code: <span className="text-primary font-semibold">{b2bCode}</span>
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

const B2BMain: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Find the current page title based on the path
  const currentTitle =
    pageTitles[
      Object.keys(pageTitles).find((key) =>
        location.pathname.startsWith(key)
      ) || ""
    ] || "B2B Vendor Panel";

  return (
    <div className="flex min-h-screen bg-neutral-100">
     
      <main className="flex-1 p-2 sm:p-4 md:p-8 bg-neutral-100 min-w-0">
        {/* Responsive header with page title */}
        <header
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 px-2 md:px-0 gap-2"
          style={{ paddingLeft: "100px" }}
        >
          {/* <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-light tracking-wide">
            {currentTitle}
          </h1> */}
        </header>
        <div className="w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default B2BMain;
