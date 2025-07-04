import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  generateUserCode,
  IconAlertCircle,
  IconCheck,
  IconCollection,
  IconEdit,
  IconLogout,
  IconMapPin,
  IconPlus,
  IconRupee,
  IconUsers,
} from "../../../constants.tsx";
import { useAuth } from "../../../contexts/AuthContext";
import "../AgentProfileSection.css";

// Menu items for real estate agent panel
const menuItems = [
  {
    key: "/realestate/post-plots",
    icon: <IconMapPin className="w-5 h-5" />,
    label: "Post Plots",
  },
   {
    key: "/realestate/post-micro-plots",
    icon: <IconMapPin className="w-5 h-5" />,
    label: "Post Micro Plots",
  },
  {
    key: "/realestate/leads",
    icon: <IconUsers className="w-5 h-5" />,
    label: "Plot Inquiries & Leads",
  },
  {
    key: "/realestate/commission",
    icon: <IconRupee className="w-5 h-5" />,
    label: "Commission Dashboard",
  },
  {
    key: "/realestate/lead-management",
    icon: <IconCollection className="w-5 h-5" />,
    label: "Lead Management",
  },
  {
    key: "/referrealestate",
    icon: <IconPlus className="w-5 h-5" />,
    label: "Refer and Earn",
  },
];

// --- ProfileSection copied from RealEstateAgentPanel ---
const ProfileSection: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91-9123456789",
    photo: "",
    kycStatus: "Not Verified",
  });
  const [otpSentTo, setOtpSentTo] = useState<"email" | "phone" | null>(null);
  const [otp, setOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState<{ email: boolean; phone: boolean }>({ email: false, phone: false });
  const [showKyc, setShowKyc] = useState(false);
  const [kycStatus, setKycStatus] = useState(profile.kycStatus);
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

  // OTP simulation
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  const sendOtp = (type: "email" | "phone") => {
    const newOtp = generateOTP();
    setOtp(newOtp);
    setOtpSentTo(type);
    setOtpInput("");
    setTimeout(() => {
      alert(`OTP for ${type}: ${newOtp}`);
    }, 300);
  };
  const verifyOtp = () => {
    if (otpInput === otp) {
      setOtpVerified((prev) => ({ ...prev, [otpSentTo!]: true }));
      setOtpSentTo(null);
      setOtp("");
      setOtpInput("");
    } else {
      alert("Invalid OTP");
    }
  };

  // Dropdown toggle
  const toggleDropdown = () => setDropdownOpen((open) => !open);

  // Generate User Code (using name and a static date for demo)
  const userCode = generateUserCode(
    profile.name,
    new Date("2024-01-01")
  );

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
            {/* Creative User Code display */}
            <div className="mt-2 text-sm text-gray-600 font-mono bg-gray-100 px-4 py-1 rounded shadow-sm">
              User Code: <span className="text-primary font-semibold">{userCode}</span>
            </div>
          </div>
          <div className="mt-1 text-lg font-semibold text-primary-light">{profile.name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <span>{profile.phone}</span>
            {otpVerified?.phone && (
              <span className="text-green-500 w-4 h-4" title="Verified">
                <IconCheck className="w-4 h-4" />
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <span>{profile.email}</span>
            {otpVerified?.email && (
              <span className="text-green-500 w-4 h-4" title="Verified">
                <IconCheck className="w-4 h-4" />
              </span>
            )}
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
          <button
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition font-semibold flex items-center gap-2"
            onClick={() => {
              setDropdownOpen(false);
              navigate("/realestate/realprofile");
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

const RealSideNav: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        {/* ProfileSection at the top */}
        <ProfileSection />
        <div className="text-2xl font-bold text-primary-light py-4 px-2 mb-4 border-b border-neutral-200">
          RealEstate<span className="text-black"> Agent</span>
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

export default RealSideNav;
