import React, { useEffect, useState } from "react";
import { generateUserCode } from "../../constants";

// Example mock for recent purchases
const mockRecentPurchases = [
  { id: "r1", name: "Serene Valley Plot", date: "2024-05-10" },
  { id: "r2", name: "Greenheap Prime Location", date: "2024-04-22" },
  { id: "r3", name: "Riverside Retreat", date: "2024-03-15" },
];

const roleOptions = [
  "Plot Buyer",
  "Plot Seller",
  "Agent",
  "B2B Vendor"
];

// Add this hook for counting animation
function useCountUp(target: number, duration = 2500) { // duration increased for slower animation
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(target / (duration / 16));
    let raf: number;
    function step() {
      start += increment;
      if (start >= target) {
        setCount(target);
      } else {
        setCount(start);
        raf = requestAnimationFrame(step);
      }
    }
    setCount(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

// UserProfile component, enhanced for user account management
const MyProfile: React.FC = () => {
  const [editMode, setEditMode] = useState(true);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
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
    dob: "1990-01-01",
    gender: "Male",
    joiningDate: new Date(),
    role: "Plot Buyer",
    aadharFile: null as File | null,
    panFile: null as File | null,
    aadharFileName: "",
    panFileName: "",
  });
  const [editProfile, setEditProfile] = useState(profile);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [profileAnim, setProfileAnim] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [kycStatus, setKycStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [countryCodes, setCountryCodes] = useState<{ code: string; label: string; flag: string }[]>([]);

  // Generate User Code
  const userCode = generateUserCode(
    `${profile.firstName} ${profile.lastName}`,
    profile.joiningDate
  );

  // Fetch country codes from an API (restcountries.com)
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=idd,name,flags")
      .then(res => res.json())
      .then((data) => {
        // Flatten and filter for countries with calling codes
        const codes = data
          .filter((c: any) => c.idd && c.idd.root)
          .map((c: any) => {
            const code = c.idd.suffixes && c.idd.suffixes.length > 0
              ? c.idd.suffixes.map((s: string) => `${c.idd.root}${s}`)
              : [c.idd.root];
            return code.map((cc: string) => ({
              code: cc,
              label: c.name.common,
              flag: c.flags && c.flags.png ? (
                <img src={c.flags.png} alt={c.name.common} style={{ width: 18, display: "inline" }} />
              ) : "🌐"
            }));
          })
          .flat()
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
        setCountryCodes(codes);
      })
      .catch(() => {
        // fallback to a minimal set if API fails
        setCountryCodes([
          { code: "+91", label: "India", flag: "🇮🇳" },
          { code: "+1", label: "USA", flag: "🇺🇸" },
          { code: "+44", label: "UK", flag: "🇬🇧" }
        ]);
      });
  }, []);

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
    if (!editProfile.role) errs.role = "Role is required";
    return errs;
  };

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditProfile((prev) => ({
      ...prev,
      aadharFile: file,
      aadharFileName: file ? file.name : "",
    }));
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditProfile((prev) => ({
      ...prev,
      panFile: file,
      panFileName: file ? file.name : "",
    }));
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
      setTimeout(() => {
        setShowPopup(false);
      }, 1200);
    }, 1200);
  };

  // KYC simulation (for demo: toggles through statuses)
  const handleKyc = () => {
    if (kycStatus === "Pending") setKycStatus("Approved");
    else if (kycStatus === "Approved") setKycStatus("Rejected");
    else setKycStatus("Pending");
  };

  // For demo, hardcoded total earnings
  const totalEarnings = 12500;
  const animatedEarnings = useCountUp(totalEarnings, 1200);

  return (
    <>
      <div className="max-w-4xl mx-auto mt-8 p-0 flex gap-8">
        {/* Left: Profile Form */}
        <div className={`flex-1 p-6 rounded-2xl shadow-xl bg-white user-profile-anim ${profileAnim ? "profile-anim-pop" : ""}`}>
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
                <span className="text-xs">✎</span>
              </label>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-primary-light tracking-wide animate-fadein">Edit User Profile</h2>
            <div className="mt-2 text-sm text-gray-600 font-mono bg-gray-100 px-4 py-1 rounded shadow-sm">
              User Code: <span className="text-primary font-semibold">{userCode}</span>
            </div>
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
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-2 py-2 bg-white text-base focus:border-primary transition"
                    value={editProfile.countryCode}
                    onChange={e => setEditProfile({ ...editProfile, countryCode: e.target.value })}
                    required
                    style={{ maxWidth: 70, minWidth: 70 }}
                  >
                    {countryCodes.map(c => (
                      <option key={c.code + c.label} value={c.code}>
                        {typeof c.flag === "string" ? c.flag : ""}
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    className={`border rounded px-2 py-2 text-base focus:border-primary transition ${errors.phone ? "border-red-400" : ""}`}
                    value={editProfile.phone}
                    onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })}
                    placeholder="Phone Number"
                    required
                    maxLength={10}
                    pattern="\d*"
                    style={{ flex: 8, minWidth: 0, width: "100%" }} // Increased width further
                  />
                </div>
                {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
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
            {/* Role selection */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Role</label>
              <select
                className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.role ? "border-red-400" : ""}`}
                value={editProfile.role}
                onChange={e => setEditProfile({ ...editProfile, role: e.target.value })}
                required
              >
                <option value="">Select Role</option>
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && <span className="text-xs text-red-500">{errors.role}</span>}
            </div>
            {/* KYC Document Upload Section - Aadhaar & PAN (remove old, add creative) */}
            <div className="flex flex-col items-start mt-2 mb-2">
              <label className="text-xs text-gray-500 mb-2 font-semibold">KYC Documents:</label>
              <div className="flex gap-6">
                {/* Aadhaar Upload */}
                <label
                  className="flex flex-col items-center justify-center cursor-pointer bg-green-50 border-2 border-dashed border-green-300 rounded-xl px-5 py-4 hover:bg-green-100 transition shadow-sm"
                  style={{ minWidth: 120, minHeight: 110 }}
                  title="Upload Aadhaar Card"
                >
                  <svg className="w-8 h-8 mb-2 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-semibold text-green-700 mb-1">Aadhaar Card</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={e => {
                      // Handle Aadhaar upload here
                    }}
                  />
                  <span className="text-[11px] text-gray-400 mt-1">PDF/JPG/PNG</span>
                </label>
                {/* PAN Upload */}
                <label
                  className="flex flex-col items-center justify-center cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl px-5 py-4 hover:bg-blue-100 transition shadow-sm"
                  style={{ minWidth: 120, minHeight: 110 }}
                  title="Upload PAN Card"
                >
                  <svg className="w-8 h-8 mb-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h4" />
                  </svg>
                  <span className="text-xs font-semibold text-blue-700 mb-1">PAN Card</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={e => {
                      // Handle PAN upload here
                    }}
                  />
                  <span className="text-[11px] text-gray-400 mt-1">PDF/JPG/PNG</span>
                </label>
              </div>
            </div>
            {/* KYC Status Section - moved above Save Profile */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">KYC Status:</span>
                {kycStatus === "Approved" && (
                  <span className="text-green-600 font-semibold flex items-center gap-1 animate-bounce" title="Approved">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Approved
                  </span>
                )}
                {kycStatus === "Pending" && (
                  <span className="text-yellow-600 font-semibold flex items-center gap-1 animate-pulse" title="Pending">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Pending
                  </span>
                )}
                {kycStatus === "Rejected" && (
                  <span className="text-red-600 font-semibold flex items-center gap-1 animate-pulse" title="Rejected">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rejected
                  </span>
                )}
                {/* No approve/reject button here, admin will handle KYC approval */}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 mt-1">
                <span>• Admin Approval Required:</span>
                <span className="text-green-600 font-bold flex items-center gap-1">
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Yes
                </span>
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
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="relative bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center animate-adminpop">
                <div className="absolute top-2 right-2">
                  <button
                    className="text-gray-400 hover:text-red-500 text-2xl font-bold"
                    onClick={() => setShowPopup(false)}
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
                  Your profile changes have been saved.
                </div>
                <button
                  className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary-dark transition"
                  onClick={() => setShowPopup(false)}
                >
                  OK
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
          <style>{`
            .profile-anim-pop { animation: pop-in 0.5s; }
            @keyframes pop-in { 0% { transform: scale(0.95); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
            .profile-pulse { animation: pulse 1.5s infinite alternate; }
            @keyframes pulse { 0% { box-shadow: 0 0 0 0 #22c55e33; } 100% { box-shadow: 0 0 0 8px #22c55e11; } }
            .animate-fadein { animation: fadein 1s; }
            @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
            .animate-slidein { animation: slidein 0.7s; }
            @keyframes slidein { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .animate-listitem { animation: fadein 0.8s; }
          `}</style>
        </div>
        {/* Right: Recent Purchases and Ad Content */}
        <div className="w-[28rem] flex-shrink-0 flex flex-col gap-6">
          {/* --- Recent Purchases Card --- */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-primary-light mb-3 animate-fadein">Recent Purchased Plots</h3>
            <ul className="space-y-2">
              {mockRecentPurchases.map(purchase => (
                <li key={purchase.id} className="flex items-center justify-between px-4 py-2 bg-neutral-50 rounded-lg shadow-sm hover:bg-primary/10 transition animate-listitem">
                  <span className="font-medium text-gray-700">{purchase.name}</span>
                  <span className="text-xs text-gray-500">{purchase.date}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* --- Ad Content Card (same as Recent Purchases card style) --- */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center">
              <img
                src="https://img.freepik.com/free-vector/real-estate-sale-banner-template_23-2148686847.jpg?w=826"
                alt="Ad Banner"
                className="rounded-xl mb-4 shadow-md object-cover"
                style={{ width: "100%", maxHeight: 140 }}
              />
              <div className="text-lg font-bold text-primary mb-2 text-center">Special Offer!</div>
              <div className="text-sm text-gray-700 mb-2 text-center">
                Get <span className="text-primary font-semibold">10% cashback</span> on your next plot purchase.<br />
                Limited time only.
              </div>
              <button
                className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary-dark transition"
                onClick={() => window.open("https://your-offer-link.com", "_blank")}
              >
                Grab Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
