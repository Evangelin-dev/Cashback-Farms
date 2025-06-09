import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    IconAlertCircle,
    IconCheck,
    IconEdit,
} from "../../../constants.tsx";
import "../../realestate/AgentProfileSection.css";

// Example mock for recent listings
const mockRecentListings = [
  { id: "p1", name: "UltraTech Cement PPC", date: "2024-06-01" },
  { id: "p2", name: "Red Clay Bricks", date: "2024-05-28" },
  { id: "p3", name: "River Sand (Fine Grade)", date: "2024-05-20" },
];

const countryCodes = [
  { code: "+91", label: "India", flag: "🇮🇳" },
  { code: "+1", label: "USA", flag: "🇺🇸" },
  { code: "+44", label: "UK", flag: "🇬🇧" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
  { code: "+971", label: "UAE", flag: "🇦🇪" },
  { code: "+81", label: "Japan", flag: "🇯🇵" },
  { code: "+49", label: "Germany", flag: "🇩🇪" },
  { code: "+33", label: "France", flag: "🇫🇷" },
  { code: "+86", label: "China", flag: "🇨🇳" },
  { code: "+7", label: "Russia", flag: "🇷🇺" },
  { code: "+39", label: "Italy", flag: "🇮🇹" },
  { code: "+34", label: "Spain", flag: "🇪🇸" },
  { code: "+55", label: "Brazil", flag: "🇧🇷" },
  { code: "+27", label: "South Africa", flag: "🇿🇦" },
  { code: "+82", label: "South Korea", flag: "🇰🇷" },
  { code: "+62", label: "Indonesia", flag: "🇮🇩" },
  { code: "+63", label: "Philippines", flag: "🇵🇭" },
  { code: "+234", label: "Nigeria", flag: "🇳🇬" },
  { code: "+92", label: "Pakistan", flag: "🇵🇰" },
  { code: "+880", label: "Bangladesh", flag: "🇧🇩" },
  { code: "+20", label: "Egypt", flag: "🇪🇬" },
  { code: "+966", label: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+90", label: "Turkey", flag: "🇹🇷" },
  { code: "+380", label: "Ukraine", flag: "🇺🇦" },
  { code: "+351", label: "Portugal", flag: "🇵🇹" },
  { code: "+48", label: "Poland", flag: "🇵🇱" },
  { code: "+420", label: "Czech Republic", flag: "🇨🇿" },
  { code: "+358", label: "Finland", flag: "🇫🇮" },
  { code: "+46", label: "Sweden", flag: "🇸🇪" },
  { code: "+47", label: "Norway", flag: "🇳🇴" },
  { code: "+31", label: "Netherlands", flag: "🇳🇱" },
  { code: "+41", label: "Switzerland", flag: "🇨🇭" },
  { code: "+65", label: "Singapore", flag: "🇸🇬" },
  { code: "+60", label: "Malaysia", flag: "🇲🇾" },
  { code: "+66", label: "Thailand", flag: "🇹🇭" },
  { code: "+64", label: "New Zealand", flag: "🇳🇿" },
  { code: "+52", label: "Mexico", flag: "🇲🇽" },
  { code: "+598", label: "Uruguay", flag: "🇺🇾" },
  { code: "+54", label: "Argentina", flag: "🇦🇷" },
  { code: "+56", label: "Chile", flag: "🇨🇱" },
  { code: "+212", label: "Morocco", flag: "🇲🇦" },
  // ...add more as needed
];

const initialProfile = {
  firstName: "John",
  lastName: "Doe",
  company: "Acme Supplies",
  email: "john.doe@email.com",
  phone: "9876543210",
  countryCode: "+91",
  photo: "",
  address: {
    town: "MG Road",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
  },
  kycStatus: "Not Verified",
};

const B2BProfile: React.FC = () => {
  const [editMode, setEditMode] = useState(true); // Always edit mode if navigated here
  const [profile, setProfile] = useState(initialProfile);
  const [editProfile, setEditProfile] = useState(initialProfile);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // OTP states
  const [otpSentTo, setOtpSentTo] = useState<"email" | "phone" | null>(null);
  const [otp, setOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState<{ email: boolean; phone: boolean }>({ email: false, phone: false });
  const [showKyc, setShowKyc] = useState(false);
  const [kycStatus, setKycStatus] = useState(profile.kycStatus);

  // GST file states
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [gstFileName, setGstFileName] = useState<string>("");
  const [gstStage, setGstStage] = useState<"none" | "submitted" | "verifying" | "verified">("none");

  // Animation state
  const [profileAnim, setProfileAnim] = useState(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  // Validation
  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!editProfile.firstName.trim()) errs.firstName = "First name is required";
    if (!editProfile.lastName.trim()) errs.lastName = "Last name is required";
    if (!editProfile.company.trim()) errs.company = "Company/Seller name is required";
    if (!editProfile.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editProfile.email)) errs.email = "Invalid email";
    if (!editProfile.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\d{7,15}$/.test(editProfile.phone)) errs.phone = "Invalid phone number";
    if (!editProfile.address.town.trim()) errs.town = "Town is required";
    if (!editProfile.address.city.trim()) errs.city = "City is required";
    if (!editProfile.address.state.trim()) errs.state = "State is required";
    if (!editProfile.address.country.trim()) errs.country = "Country is required";
    return errs;
  };

  const isEmailValid = !errors.email;
  const isPhoneValid = !errors.phone;

  // KYC simulation
  const handleKyc = () => {
    setShowKyc(true);
    setTimeout(() => {
      setKycStatus("Verified");
      setProfile((p) => ({ ...p, kycStatus: "Verified" }));
      setShowKyc(false);
    }, 2000);
  };

  // GST file upload and verification simulation
  const handleGstFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGstFile(file);
      setGstFileName(file.name);
      setGstStage("submitted");
      setTimeout(() => {
        setGstStage("verifying");
        setTimeout(() => {
          setGstStage("verified");
        }, 2000); // Simulate verification time
      }, 1000); // Simulate submission processing
    }
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

  const handleSave = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setProfile(editProfile);
    setEditMode(false);
    setProfileAnim(true);
    setShowPopup(true);
    setTimeout(() => {
      setProfileAnim(false);
      setShowPopup(false);
      navigate("/b2b/products"); // or "/b2b" if you have a dashboard/home
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-0 flex gap-8">
      {/* Left: Profile Form */}
      <div className={`flex-1 p-6 rounded-2xl shadow-xl bg-white b2b-profile-anim ${profileAnim ? "profile-anim-pop" : ""}`}>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-primary agent-photo profile-pulse">
              {profile.photo ? (
                <img src={profile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                (profile.firstName[0] || "U") + (profile.lastName[0] || "")
              )}
            </div>
            <label
              className="absolute bottom-0 right-0 bg-white border border-primary rounded-full p-2 cursor-pointer hover:bg-primary hover:text-white transition"
              title="Upload Photo"
              style={{ boxShadow: "0 2px 8px #22c55e33" }}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setEditProfile({ ...editProfile, photo: ev.target?.result as string });
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <IconEdit className="w-5 h-5" />
            </label>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-primary-light tracking-wide animate-fadein">Edit B2B Profile</h2>
        </div>
        <form className="space-y-5 animate-slidein" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">First Name</label>
              <input
                className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.firstName ? "border-red-400" : ""}`}
                value={editProfile.firstName}
                onChange={e => setEditProfile({ ...editProfile, firstName: e.target.value })}
                placeholder="First Name"
                required
              />
              {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Last Name</label>
              <input
                className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.lastName ? "border-red-400" : ""}`}
                value={editProfile.lastName}
                onChange={e => setEditProfile({ ...editProfile, lastName: e.target.value })}
                placeholder="Last Name"
                required
              />
              {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Company / Seller Name</label>
            <input
              className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.company ? "border-red-400" : ""}`}
              value={editProfile.company}
              onChange={e => setEditProfile({ ...editProfile, company: e.target.value })}
              placeholder="Company or Seller Name"
              required
            />
            {errors.company && <span className="text-xs text-red-500">{errors.company}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
              <div className="flex gap-2">
                <select
                  className="border rounded px-2 py-2 bg-white text-base focus:border-primary transition"
                  value={editProfile.countryCode}
                  onChange={e => setEditProfile({ ...editProfile, countryCode: e.target.value })}
                  required
                >
                  {countryCodes.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  className={`border rounded px-2 py-2 w-full text-base focus:border-primary transition ${errors.phone ? "border-red-400" : ""}`}
                  value={editProfile.phone}
                  onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })}
                  placeholder="Phone Number"
                  required
                  maxLength={15}
                  pattern="\d*"
                />
              </div>
              {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.email ? "border-red-400" : ""}`}
                value={editProfile.email}
                onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                placeholder="Email"
                required
                type="email"
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Address</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.town ? "border-red-400" : ""}`}
                  value={editProfile.address.town}
                  onChange={e => setEditProfile({ ...editProfile, address: { ...editProfile.address, town: e.target.value } })}
                  placeholder="Town"
                  required
                />
                {errors.town && <span className="text-xs text-red-500">{errors.town}</span>}
              </div>
              <div>
                <input
                  className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.city ? "border-red-400" : ""}`}
                  value={editProfile.address.city}
                  onChange={e => setEditProfile({ ...editProfile, address: { ...editProfile.address, city: e.target.value } })}
                  placeholder="City"
                  required
                />
                {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
              </div>
              <div>
                <input
                  className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.state ? "border-red-400" : ""}`}
                  value={editProfile.address.state}
                  onChange={e => setEditProfile({ ...editProfile, address: { ...editProfile.address, state: e.target.value } })}
                  placeholder="State"
                  required
                />
                {errors.state && <span className="text-xs text-red-500">{errors.state}</span>}
              </div>
              <div>
                <input
                  className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.country ? "border-red-400" : ""}`}
                  value={editProfile.address.country}
                  onChange={e => setEditProfile({ ...editProfile, address: { ...editProfile.address, country: e.target.value } })}
                  placeholder="Country"
                  required
                />
                {errors.country && <span className="text-xs text-red-500">{errors.country}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            {/* --- KYC Section --- */}
            <span className="text-xs text-gray-500">KYC Status:</span>
            {kycStatus === "Verified" ? (
              <span className="text-green-600 font-semibold flex items-center gap-1 animate-bounce" title="Verified">
                <IconCheck className="w-5 h-5" /> Verified
              </span>
            ) : (
              <span className="text-red-600 font-semibold flex items-center gap-1 animate-pulse" title="Not Verified">
                <IconAlertCircle className="w-5 h-5" /> Not Verified
              </span>
            )}
            {kycStatus !== "Verified" && (
              <button
                className="ml-2 px-4 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark transition animate-kyc-btn"
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
          {/* --- GST File Verification Section --- */}
          <div className="flex flex-col items-start mt-4">
            <label className="text-xs text-gray-500 mb-1">GST File Verification:</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="text-xs"
                onChange={handleGstFileChange}
                disabled={gstStage === "verifying" || gstStage === "verified"}
              />
              {gstFileName && (
                <span className="text-xs text-gray-700">{gstFileName}</span>
              )}
              {/* Stage 1: File Submitted */}
              {gstStage === "submitted" && (
                <span className="text-blue-500 flex items-center gap-1">
                  <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  File Submitted
                </span>
              )}
              {/* Stage 2: Verification Ongoing */}
              {gstStage === "verifying" && (
                <span className="text-blue-600 flex items-center gap-1">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Verification Ongoing...
                </span>
              )}
              {/* Stage 3: Verification Done */}
              {gstStage === "verified" && (
                <span className="text-green-600 flex items-center gap-1 font-semibold">
                  <IconCheck className="w-4 h-4" /> GST Verified
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded text-base font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
              disabled={!isEmailValid || !isPhoneValid || !editProfile.firstName || !editProfile.lastName || !editProfile.company}
            >
              Save Profile
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded text-base font-semibold shadow hover:scale-105 transition-transform duration-200"
              onClick={() => setEditProfile(profile)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {/* Right: Recent Product Listings */}
      <div className="w-[28rem] flex-shrink-0">{/* 28rem = 448px, 100px more than w-96 (384px) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-primary-light mb-3 animate-fadein">Recent Product Listings</h3>
          <ul className="space-y-2">
            {mockRecentListings.map(listing => (
              <li key={listing.id} className="flex items-center justify-between px-4 py-2 bg-neutral-50 rounded-lg shadow-sm hover:bg-primary/10 transition animate-listitem">
                <span className="font-medium text-gray-700">{listing.name}</span>
                <span className="text-xs text-gray-500">{listing.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default B2BProfile;
