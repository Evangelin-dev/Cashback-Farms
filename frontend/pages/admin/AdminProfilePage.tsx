import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconAlertCircle, IconCheck, IconEdit } from "../../constants";
import "../realestate/AgentProfileSection.css";

const countryCodes = [
  { code: "+91", label: "India", flag: "🇮🇳" },
  { code: "+1", label: "USA", flag: "🇺🇸" },
  { code: "+44", label: "UK", flag: "🇬🇧" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
  { code: "+971", label: "UAE", flag: "🇦🇪" },
];

const initialProfile = {
  firstName: "Admin",
  lastName: "User",
  gender: "Other",
  dob: "1985-01-01",
  email: "admin@cashbackfarm.com",
  phone: "9000000000",
  countryCode: "+91",
  photo: "",
  address: {
    town: "Headquarters",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
  },
  kycStatus: "Not Verified",
};



const AdminProfilePage: React.FC = () => {
  const [editMode, setEditMode] = useState(true);
  const [profile, setProfile] = useState(initialProfile);
  const [editProfile, setEditProfile] = useState(profile);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showKyc, setShowKyc] = useState(false);
  const [kycStatus, setKycStatus] = useState(profile.kycStatus);
  const [profileAnim, setProfileAnim] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [gstFileName, setGstFileName] = useState<string>("");
  const [gstStage, setGstStage] = useState<"none" | "submitted" | "verifying" | "verified">("none");
  const navigate = useNavigate();

  // Validation
  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!editProfile.firstName.trim()) errs.firstName = "First name is required";
    if (!editProfile.lastName.trim()) errs.lastName = "Last name is required";
    if (!editProfile.gender.trim()) errs.gender = "Gender is required";
    if (!editProfile.dob.trim()) errs.dob = "Date of Birth is required";
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
      // Keep popup for a moment before navigating
      setTimeout(() => {
        setShowPopup(false);
        navigate("/admin/dashboard");
      }, 1200);
    }, 1200);
  };

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
        }, 2000);
      }, 1000);
    }
  };

  return (
    <div>
     
      <div className="max-w-3xl mx-auto mt-8 p-0 flex gap-8">
        <div className={`flex-1 p-6 rounded-2xl shadow-xl bg-white real-profile-anim ${profileAnim ? "profile-anim-pop" : ""}`}>
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-primary agent-photo profile-pulse">
                {profile.photo ? (
                  <img src={profile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (profile.firstName[0] || "A") + (profile.lastName[0] || "")
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
            <h2 className="mt-4 text-2xl font-bold text-primary-light tracking-wide animate-fadein">Edit Admin Profile</h2>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Gender</label>
                <select
                  className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.gender ? "border-red-400" : ""}`}
                  value={editProfile.gender}
                  onChange={e => setEditProfile({ ...editProfile, gender: e.target.value })}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date of Birth</label>
                <input
                  type="date"
                  className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.dob ? "border-red-400" : ""}`}
                  value={editProfile.dob}
                  onChange={e => setEditProfile({ ...editProfile, dob: e.target.value })}
                  required
                />
                {errors.dob && <span className="text-xs text-red-500">{errors.dob}</span>}
              </div>
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
                <label
                  className={`inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg shadow cursor-pointer hover:bg-primary-dark transition font-semibold text-sm ${
                    gstStage === "verifying" || gstStage === "verified" ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  style={{ minWidth: 120 }}
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleGstFileChange}
                    disabled={gstStage === "verifying" || gstStage === "verified"}
                  />
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  {gstFileName ? "Change File" : "Choose File"}
                </label>
                {gstFileName && (
                  <span className="text-xs text-gray-700 font-medium bg-gray-100 px-2 py-1 rounded">{gstFileName}</span>
                )}
                {gstStage === "submitted" && (
                  <span className="text-blue-500 flex items-center gap-1">
                    <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    File Submitted
                  </span>
                )}
                {gstStage === "verifying" && (
                  <span className="text-blue-600 flex items-center gap-1">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Verification Ongoing...
                  </span>
                )}
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
                disabled={Object.keys(errors).length > 0}
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
          {/* Creative confirmation popup */}
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="relative bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center animate-adminpop">
                <div className="absolute top-2 right-2">
                  <button
                    className="text-gray-400 hover:text-red-500 text-2xl font-bold"
                    onClick={() => {
                      setShowPopup(false);
                      navigate("/admin/dashboard");
                    }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-primary mb-2 text-center">Profile Saved!</div>
                <div className="text-base text-gray-700 mb-4 text-center">
                  Your admin profile changes have been saved.<br />
                  Redirecting to dashboard...
                </div>
                <button
                  className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary-dark transition"
                  onClick={() => {
                    setShowPopup(false);
                    navigate("/admin/dashboard");
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
              <style>{`
                @keyframes adminpop {
                  0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
                  60% { transform: scale(1.05) rotate(2deg); opacity: 1; }
                  100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                .animate-adminpop { animation: adminpop 0.6s cubic-bezier(.68,-0.55,.27,1.55); }
                @keyframes bounce-slow {
                  0%, 100% { transform: translateY(0);}
                  50% { transform: translateY(-10px);}
                }
                .animate-bounce-slow { animation: bounce-slow 1.5s infinite; }
              `}</style>
            </div>
          )}
        </div>
        {/* Right: Admin Summary */}
        <div className="w-[22rem] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-primary-light mb-3 animate-fadein">Admin Summary</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between px-4 py-2 bg-neutral-50 rounded-lg shadow-sm">
                <span className="font-medium text-gray-700">Total Users Managed</span>
                <span className="text-xs text-gray-500">128</span>
              </li>
              <li className="flex items-center justify-between px-4 py-2 bg-neutral-50 rounded-lg shadow-sm">
                <span className="font-medium text-gray-700">Total Plots</span>
                <span className="text-xs text-gray-500">56</span>
              </li>
              <li className="flex items-center justify-between px-4 py-2 bg-neutral-50 rounded-lg shadow-sm">
                <span className="font-medium text-gray-700">Pending KYC</span>
                <span className="text-xs text-gray-500">3</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
