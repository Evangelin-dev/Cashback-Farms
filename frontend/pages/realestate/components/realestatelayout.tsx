import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import {
  IconAlertCircle,
  IconCheck,
  IconCollection,
  IconEdit,
  IconLogout,
  IconMapPin,
  IconRupee,
  IconUsers,
} from "../../../constants.tsx";
import { useAuth } from "../../../contexts/AuthContext";
import "../AgentProfileSection.css";

const menuItems = [
  {
    key: "/realestate/dashboard",
    icon: <IconMapPin className="w-5 h-5" />,
    label: "My Dashboard",
  },
  {
    key: "/realestate/post-plots",
    icon: <IconMapPin className="w-5 h-5" />,
    label: "Post Plots",
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
];

// --- ProfileSection copied from RealEstateAgentPanel ---
const ProfileSection: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
   const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
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

const RealEstateSideNav: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-neutral-200 flex flex-col p-4 space-y-2">
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
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm transition-colors duration-150 rounded-md
              ${isActive ? "bg-primary text-white font-semibold shadow-md" : "text-black hover:bg-primary hover:text-white"}`
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
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/");
          }}
          className="flex items-center w-full px-4 py-3 text-sm font-semibold text-black hover:bg-red-600 hover:text-white transition-colors duration-150 rounded-md"
        >
          <IconLogout className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

function getRealEstatePageTitle(pathname: string): string {
  if (pathname === "/realestate/post-plots") return "Post Your Plots";
  if (pathname === "/realestate/leads") return "Plot Inquiries & Leads";
  if (pathname === "/realestate/commission") return "Commission Dashboard";
  if (pathname === "/realestate/lead-management") return "Lead Management";
  if (pathname === "/realestate/realprofile") return "Agent Profile";
  if(pathname === "/realestate/dashboard") return "Dashboard";  
  if(pathname === "/realestate/post-micro-plots") return "Post GIOO Plots";  
  return "RealEstate Agent Panel";
}

const RealEstateLayout: React.FC = () => {
  const location = useLocation();
  const pageTitle = getRealEstatePageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-neutral-100 font-sans">
      {/* Side Navigation */}
      <RealEstateSideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RealEstateLayout;