import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
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

const menuItems = [
  {
    key: "/b2b/products",
    icon: <IconCollection className="w-5 h-5" />,
    label: "Manage Products",
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

const pageTitles: Record<string, string> = {
  "/b2b/products": "Manage Products",
  "/b2b/orders": "Product Orders",
  "/b2b/pricing": "Pricing & Offers",
  "/b2b/customers": "Customers",
  "/b2b/wallet": "Wallet / Settlement",
};

// --- B2B Profile Section (Dropdown, attractive, fits in aside) ---
const ProfileSection: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91-9876543210",
    photo: "",
    kycStatus: "Not Verified",
  });
  const [editProfile, setEditProfile] = useState(profile);

  // OTP states
  const [otpSentTo, setOtpSentTo] = useState<"email" | "phone" | null>(null);
  const [otp, setOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState<{ email: boolean; phone: boolean }>({ email: false, phone: false });
  const [showKyc, setShowKyc] = useState(false);
  const [kycStatus, setKycStatus] = useState(profile.kycStatus);

  // Animation state
  const [profileAnim, setProfileAnim] = useState(false);

  // Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editProfile.email);
  const isPhoneValid = /^\+91\d{10}$/.test(editProfile.phone);

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
  const sendOtp = (type: "email" | "phone") => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
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

  const handleEdit = () => {
    setEditProfile(profile);
    setEditMode(true);
    setProfileAnim(true);
    setTimeout(() => setProfileAnim(false), 500);
  };

  const handleSave = () => {
    if (!isEmailValid || !isPhoneValid) return;
    setProfile(editProfile);
    setEditMode(false);
    setProfileAnim(true);
    setTimeout(() => setProfileAnim(false), 500);
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
            <button
              className="absolute bottom-0 right-0 bg-white border border-primary rounded-full p-1 hover:bg-primary hover:text-white transition"
              onClick={() => { setEditProfile(profile); setEditMode(true); setDropdownOpen(true); }}
              title="Edit Profile"
              tabIndex={-1}
            >
              <IconEdit className="w-4 h-4" />
            </button>
          </div>
          {!editMode ? (
            <>
              <div className="mt-1 text-lg font-semibold text-primary-light">{profile.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                <span>{profile.phone}</span>
                {otpVerified.phone && (
                  <span className="text-green-500 w-4 h-4" title="Verified">
                    <IconCheck className="w-4 h-4" />
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                <span>{profile.email}</span>
                {otpVerified.email && (
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
            </>
          ) : (
            <form className="w-full mt-2 flex flex-col gap-3" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <input
                className={`border rounded px-2 py-1 text-sm ${!editProfile.name ? "border-red-400" : ""}`}
                value={editProfile.name}
                onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                placeholder="Name"
                required
              />
              <div className="flex flex-col gap-1 w-full">
                <div className="flex gap-2 items-center">
                  <input
                    className={`border rounded px-2 py-1 text-sm flex-1 ${!isPhoneValid ? "border-red-400" : ""}`}
                    value={editProfile.phone}
                    onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })}
                    placeholder="+91XXXXXXXXXX"
                    required
                  />
                  {otpVerified.phone && (
                    <span className="text-green-500 w-4 h-4" title="Verified">
                      <IconCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>
                {!otpVerified.phone && (
                  <div className="flex gap-2 mt-1">
                    {otpSentTo === "phone" ? (
                      <>
                        <input
                          className="border rounded px-1 py-1 text-xs w-20"
                          value={otpInput}
                          onChange={e => setOtpInput(e.target.value)}
                          placeholder="OTP"
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-success animate-otp-btn"
                          onClick={verifyOtp}
                        >
                          <IconCheck className="w-4 h-4 mr-1" />
                          Verify
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary animate-otp-btn"
                        onClick={() => sendOtp("phone")}
                      >
                        <IconAlertCircle className="w-4 h-4 mr-1" />
                        Send OTP
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="flex gap-2 items-center">
                  <input
                    className={`border rounded px-2 py-1 text-sm flex-1 ${!isEmailValid ? "border-red-400" : ""}`}
                    value={editProfile.email}
                    onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                    placeholder="Email"
                    required
                  />
                  {otpVerified.email && (
                    <span className="text-green-500 w-4 h-4" title="Verified">
                      <IconCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>
                {!otpVerified.email && (
                  <div className="flex gap-2 mt-1">
                    {otpSentTo === "email" ? (
                      <>
                        <input
                          className="border rounded px-1 py-1 text-xs w-20"
                          value={otpInput}
                          onChange={e => setOtpInput(e.target.value)}
                          placeholder="OTP"
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-success animate-otp-btn"
                          onClick={verifyOtp}
                        >
                          <IconCheck className="w-4 h-4 mr-1" />
                          Verify
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary animate-otp-btn"
                        onClick={() => sendOtp("email")}
                      >
                        <IconAlertCircle className="w-4 h-4 mr-1" />
                        Send OTP
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  className="border rounded px-2 py-1 text-sm flex-1"
                  value={editProfile.photo}
                  onChange={e => setEditProfile({ ...editProfile, photo: e.target.value })}
                  placeholder="Photo URL"
                />
                {editProfile.photo && (
                  <img src={editProfile.photo} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="bg-primary text-white px-3 py-1 rounded text-xs" disabled={!isEmailValid || !isPhoneValid || !editProfile.name}>
                  Save
                </button>
                <button type="button" className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
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
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full w-64 bg-white text-black flex flex-col p-4 space-y-2 border-r border-neutral-200
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-64 md:flex
        `}
        style={{ minWidth: "16rem" }}
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
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm transition-colors duration-150 rounded-md
                ${isActive ? "bg-primary text-white font-semibold shadow-md" : "text-black hover:bg-primary hover:text-white"}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3 w-5 h-5">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
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
      </aside>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="flex-1 p-2 sm:p-4 md:p-8 bg-neutral-100 min-w-0">
        {/* Responsive header with page title */}
        <header
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 px-2 md:px-0 gap-2"
          style={{ paddingLeft: "100px" }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-light tracking-wide">
            {currentTitle}
          </h1>
        </header>
        <div className="w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default B2BMain;
