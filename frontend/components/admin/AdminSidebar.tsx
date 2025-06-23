import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  IconAlertCircle,
  IconBuildingOffice,
  IconCheck,
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
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

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
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Simulate admin profile data (replace with real data if available)
  const adminProfile = {
    name: "Admin User",
    email: "admin@cashbackfarm.com",
    phone: "+91-9000000000",
    photo: "",
    kycStatus: "Not Verified",
  };

  // Dropdown state and logic
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [otpSentTo, setOtpSentTo] = React.useState<"email" | "phone" | null>(null);
  const [otp, setOtp] = React.useState("");
  const [otpInput, setOtpInput] = React.useState("");
  const [otpVerified, setOtpVerified] = React.useState<{ email: boolean; phone: boolean }>({ email: false, phone: false });
  const [showKyc, setShowKyc] = React.useState(false);
  const [kycStatus, setKycStatus] = React.useState(adminProfile.kycStatus);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminProfile.email);
  const isPhoneValid = /^\+91\d{10}$/.test(adminProfile.phone);

  // KYC simulation
  const handleKyc = () => {
    setShowKyc(true);
    setTimeout(() => {
      setKycStatus("Verified");
      setDropdownOpen(false);
      setShowKyc(false);
    }, 2000);
  };

  // OTP simulation
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
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
        {/* Admin profile dropdown styled like user profile dropdown */}
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
                  {adminProfile.photo ? (
                    <img src={adminProfile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    adminProfile.name[0]
                  )}
                </div>
              </div>
              <div className="mt-1 text-lg font-semibold text-primary-light">{adminProfile.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                <span>{adminProfile.phone}</span>
                {otpVerified?.phone && (
                  <span className="text-green-500 w-4 h-4" title="Verified">
                    <IconCheck className="w-4 h-4" />
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                <span>{adminProfile.email}</span>
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
                  navigate("/admin/profile");
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
        <div className="text-2xl font-bold text-black py-4 px-2 mb-4 border-b border-neutral-200">
          Admin<span className="text-primary-light">Panel</span>
        </div>
        <nav className="flex-grow space-y-1">
          <AdminNavItem to="/admin/dashboard" icon={<IconDashboard className="w-5 h-5" />} label="Dashboard" />
          <div className="pt-2 pb-1 px-2 text-xs text-neutral-800 uppercase tracking-wider">Manage Content</div>
          <AdminNavItem to="/admin/plots" icon={<IconTableCells className="w-5 h-5" />} label="Plots (Residential)" onClick={handleNavClick} />
          <AdminNavItem to="/admin/microplot" icon={<IconMapPin className="w-5 h-5" />} label="Micro Plots" onClick={handleNavClick} />
          <AdminNavItem to="/admin/commercial" icon={<IconBuildingOffice className="w-5 h-5" />} label="Commercial Properties" onClick={handleNavClick} />
          <AdminNavItem to="/admin/bookings" icon={<IconCollection className="w-5 h-5" />} label="Bookings" onClick={handleNavClick} />
          <AdminNavItem to="/admin/payments" icon={<IconCreditCard className="w-5 h-5" />} label="Payments" onClick={handleNavClick} />
          
          <div className="pt-4 pb-1 px-2 text-xs text-neutral-800 uppercase tracking-wider">Manage Site</div>
          <AdminNavItem to="/admin/users" icon={<IconUsers className="w-5 h-5" />} label="Users" onClick={handleNavClick} />
          <AdminNavItem to="/admin/site" icon={<IconBuildingOffice className="w-5 h-5" />} label="Project Site Details" onClick={handleNavClick} />
          <AdminNavItem to="/admin/materials" icon={<IconCubeTransparent className="w-5 h-5" />} label="Construction Materials" onClick={handleNavClick} />
          
          <div className="pt-4 pb-1 px-2 text-xs text-neutral-800 uppercase tracking-wider">System</div>
          <AdminNavItem to="/admin/settings" icon={<IconCog className="w-5 h-5" />} label="Settings" onClick={handleNavClick} />
        </nav>
        <div className="mt-auto">
          <button
            onClick={() => {
              logout();
              setSidebarOpen(false);
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-black hover:bg-red-700 hover:text-white transition-colors duration-150 rounded-md"
          >
            <span className="mr-3 w-5 h-5"><IconLogout className="w-5 h-5" /></span>
            Exit Admin
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

export default AdminSidebar;
