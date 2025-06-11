import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateUserCode, IconAlertCircle, IconCheck, IconEdit } from "../../../constants.tsx";
import "../AgentProfileSection.css";

const initialProfile = {
  firstName: "Priya",
  lastName: "Sharma",
  gender: "Female",
  dob: "1990-01-01",
  company: "Greenheap Realty",
  email: "priya.sharma@email.com",
  phone: "9123456789",
  countryCode: "+91",
  companyNumber: "080-12345678",
  photo: "",
  address: {
    town: "MG Road",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
  },
  kycStatus: "Not Verified",
  companyCountryCode: "+91",
  gstNumber: "", // <-- Add this line
};


// Move the useCountUp hook and totalEarnings definition INSIDE the RealProfile component
const RealProfile: React.FC = () => {
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

  // Country codes state and fetching logic
  const [countryCodes, setCountryCodes] = useState<{ code: string; label: string; flag: string }[]>([]);

  useEffect(() => {
    // Use only restcountries API for reliable country code data
    fetch("https://restcountries.com/v3.1/all?fields=idd,name,flags")
      .then(res => res.json())
      .then((data) => {
        const codes = data
          .filter((c: any) => c.idd && c.idd.root)
          .flatMap((c: any) => {
            const root = c.idd.root || "";
            const suffixes = Array.isArray(c.idd.suffixes) && c.idd.suffixes.length > 0 ? c.idd.suffixes : [""];
            return suffixes.map((suffix: string) => ({
              code: (root + suffix).replace(/\s/g, ""),
              label: c.name.common,
              flag: c.flag || "",
            }));
          })
          .filter((c: any) => c.code && c.label)
          .reduce((acc: any[], curr: any) => {
            // Avoid duplicates
            if (!acc.some(item => item.code === curr.code && item.label === curr.label)) acc.push(curr);
            return acc;
          }, [])
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
        setCountryCodes(codes);
      });
  }, []);

  const mockRecentPurchases = [
    { id: "r1", name: "Serene Valley Plot", date: "2024-05-10" },
    { id: "r2", name: "Greenheap Prime Location", date: "2024-04-22" },
    { id: "r3", name: "Riverside Retreat", date: "2024-03-15" },
  ];

  // Validation
  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!editProfile.firstName.trim()) errs.firstName = "First name is required";
    if (!editProfile.lastName.trim()) errs.lastName = "Last name is required";
    if (!editProfile.gender.trim()) errs.gender = "Gender is required";
    if (!editProfile.dob.trim()) errs.dob = "Date of Birth is required";
    if (!editProfile.company.trim()) errs.company = "Company name is required";
    if (!editProfile.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editProfile.email)) errs.email = "Invalid email";
    if (!editProfile.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\d{7,15}$/.test(editProfile.phone)) errs.phone = "Invalid phone number";
    if (!editProfile.companyNumber.trim()) errs.companyNumber = "Company number is required";
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
      setTimeout(() => {
        setShowPopup(false);
        navigate("/realestate/post-plots");
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
        }, 2000); // Simulate verification time
      }, 1000); // Simulate submission processing
    }
  };

  // Move these lines inside the component to avoid hook call errors
  const totalEarnings = 12500;
  const animatedEarnings = useCountUp(totalEarnings, 1200);

  // Generate User Code
  const userCode = generateUserCode(
    `${profile.firstName} ${profile.lastName}`,
    new Date() // or use a joiningDate if available
  );

  return (
    <>
    <div className="max-w-4xl mx-auto mt-8 p-0 flex gap-6">
      {/* Left: Profile Form */}
      <div className={`flex-1 p-4 rounded-2xl shadow-xl bg-white real-profile-anim ${profileAnim ? "profile-anim-pop" : ""}`}>
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-primary agent-photo profile-pulse">
              {profile.photo ? (
                <img src={profile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                (profile.firstName[0] || "U") + (profile.lastName[0] || "")
              )}
            </div>
            <label
              className="absolute bottom-0 right-0 bg-white border border-primary rounded-full p-1 cursor-pointer hover:bg-primary hover:text-white transition"
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
              <IconEdit className="w-4 h-4" />
            </label>
          </div>
          <h2 className="mt-2 text-lg font-bold text-primary-light tracking-wide animate-fadein">Edit RealEstate Profile</h2>
          {/* Creative User Code display */}
          <div className="mt-1 text-xs text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded shadow-sm">
              User Code: <span className="text-primary font-semibold">{userCode}</span>
            </div>
        </div>
        <form className="space-y-3 animate-slidein" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">First Name</label>
              <input
                className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.firstName ? "border-red-400" : ""}`}
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
                className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.lastName ? "border-red-400" : ""}`}
                value={editProfile.lastName}
                onChange={e => setEditProfile({ ...editProfile, lastName: e.target.value })}
                placeholder="Last Name"
                required
              />
              {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Gender</label>
              <select
                className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.gender ? "border-red-400" : ""}`}
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
                className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.dob ? "border-red-400" : ""}`}
                value={editProfile.dob}
                onChange={e => setEditProfile({ ...editProfile, dob: e.target.value })}
                required
              />
              {errors.dob && <span className="text-xs text-red-500">{errors.dob}</span>}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Company Name</label>
            <input
              className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.company ? "border-red-400" : ""}`}
              value={editProfile.company}
              onChange={e => setEditProfile({ ...editProfile, company: e.target.value })}
              placeholder="Company Name"
              required
            />
            {errors.company && <span className="text-xs text-red-500">{errors.company}</span>}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
            <div className="flex gap-2">
              <select
                className="border rounded px-2 py-1 bg-white text-xs focus:border-primary transition min-w-[3.5rem]"
                value={editProfile.countryCode}
                onChange={e => setEditProfile({ ...editProfile, countryCode: e.target.value })}
                required
              >
                <option value="">Select</option>
                {countryCodes.map(c => (
                  <option key={c.code + c.label} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.phone ? "border-red-400" : ""}`}
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
            <label className="block text-xs text-gray-500 mb-1">Company Number</label>
            <div className="flex gap-2">
              <select
                className="border rounded px-2 py-1 bg-white text-xs focus:border-primary transition min-w-[3.5rem]"
                value={editProfile.companyCountryCode ?? editProfile.countryCode}
                onChange={e => setEditProfile({ ...editProfile, companyCountryCode: e.target.value })}
                required
              >
                <option value="">Select</option>
                {countryCodes.map(c => (
                  <option key={c.code + c.label} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.companyNumber ? "border-red-400" : ""}`}
                value={editProfile.companyNumber}
                onChange={e => setEditProfile({ ...editProfile, companyNumber: e.target.value })}
                placeholder="Company Number"
                required
                maxLength={15}
                pattern="\d*"
              />
            </div>
            {errors.companyNumber && <span className="text-xs text-red-500">{errors.companyNumber}</span>}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.email ? "border-red-400" : ""}`}
              value={editProfile.email}
              onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
              placeholder="Email"
              required
              type="email"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Address</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.town ? "border-red-400" : ""}`}
                  value={editProfile.address.town}
                  onChange={e => setEditProfile({ ...editProfile, address: { ...editProfile.address, town: e.target.value } })}
                  placeholder="Town"
                  required
                />
                {errors.town && <span className="text-xs text-red-500">{errors.town}</span>}
              </div>
              <div>
                <input
                  className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.city ? "border-red-400" : ""}`}
                  value={editProfile.address.city}
                  onChange={e => setEditProfile({ ...editProfile, address: { ...editProfile.address, city: e.target.value } })}
                  placeholder="City"
                  required
                />
                {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
              </div>
              <div>
                <input
                  className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.state ? "border-red-400" : ""}`}
                  value={editProfile.address.state}
                  onChange={e => setEditProfile({ ...editProfile, address: { ...editProfile.address, state: e.target.value } })}
                  placeholder="State"
                  required
                />
                {errors.state && <span className="text-xs text-red-500">{errors.state}</span>}
              </div>
              <div>
                <input
                  className={`border rounded px-2 py-1 w-full text-xs focus:border-primary transition ${errors.country ? "border-red-400" : ""}`}
                  value={editProfile.address.country}
                  onChange={e => setEditProfile({ ...editProfile, address: { ...editProfile.address, country: e.target.value } })}
                  placeholder="Country"
                  required
                />
                {errors.country && <span className="text-xs text-red-500">{errors.country}</span>}
              </div>
            </div>
          </div>
          {/* --- KYC Document Upload Section --- */}
          <div className="flex flex-col items-start mt-1 mb-1">
            <label className="text-xs text-gray-500 mb-1 font-semibold">KYC Documents:</label>
            <div className="flex gap-3">
              {/* Aadhaar Upload */}
              <label
                className="flex flex-col items-center justify-center cursor-pointer bg-green-50 border-2 border-dashed border-green-300 rounded-xl px-3 py-2 hover:bg-green-100 transition shadow-sm"
                style={{ minWidth: 80, minHeight: 70 }}
                title="Upload Aadhaar Card"
              >
                <svg className="w-6 h-6 mb-1 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-semibold text-green-700 mb-0.5">Aadhaar</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={e => {
                    // Handle Aadhaar upload here
                  }}
                />
                <span className="text-[10px] text-gray-400 mt-0.5">PDF/JPG/PNG</span>
              </label>
              {/* PAN Upload */}
              <label
                className="flex flex-col items-center justify-center cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl px-3 py-2 hover:bg-blue-100 transition shadow-sm"
                style={{ minWidth: 80, minHeight: 70 }}
                title="Upload PAN Card"
              >
                <svg className="w-6 h-6 mb-1 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h4" />
                </svg>
                <span className="text-xs font-semibold text-blue-700 mb-0.5">PAN</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={e => {
                    // Handle PAN upload here
                  }}
                />
                <span className="text-[10px] text-gray-400 mt-0.5">PDF/JPG/PNG</span>
              </label>
            </div>
          </div>
          {/* --- KYC Status --- */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">KYC Status:</span>
            {kycStatus === "Verified" ? (
              <span className="text-green-600 font-semibold flex items-center gap-1 animate-bounce text-xs" title="Verified">
                <IconCheck className="w-4 h-4" /> Verified
              </span>
            ) : (
              <span className="text-red-600 font-semibold flex items-center gap-1 animate-pulse text-xs" title="Not Verified">
                <IconAlertCircle className="w-4 h-4" /> Not Verified
              </span>
            )}
            {kycStatus !== "Verified" && (
              <button
                className="ml-2 px-2 py-0.5 text-xs bg-primary text-white rounded hover:bg-primary-dark transition animate-kyc-btn"
                onClick={handleKyc}
                disabled={showKyc}
              >
                {showKyc ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
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
          {/* --- GST Number Section --- */}
          <div className="flex flex-col items-start mt-2">
            <label className="text-xs text-gray-500 mb-1">GST Number:</label>
            <input
              className="border rounded px-2 py-1 w-full text-xs focus:border-primary transition"
              type="text"
              value={editProfile.gstNumber || ""}
              onChange={e => setEditProfile({ ...editProfile, gstNumber: e.target.value })}
              placeholder="Enter GST Number"
              maxLength={15}
              pattern="[0-9A-Z]{1,15}"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-1 rounded-md shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-2 text-xs"
            >
              {editMode ? "Save Changes" : "Edit Profile"}
              {!editMode && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              )}
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-1 rounded-md shadow-md hover:bg-red-600 transition-all text-xs"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>
        </form>
      </div>
      {/* Right: Side Navigation and Panels */}
      <div className="w-[18rem] flex-shrink-0 flex flex-col gap-4">
        {/* --- Bank Details Module Card --- */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-4">
          <h3 className="text-base font-bold text-primary-light mb-2 animate-fadein">Bank Details Module</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Account Holder Name</label>
              <input
                className="border rounded px-2 py-1 w-full text-xs focus:border-primary transition"
                value={"Priya Sharma"}
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Account Number</label>
              <input
                className="border rounded px-2 py-1 w-full text-xs focus:border-primary transition"
                value={"123456789012"}
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">IFSC</label>
              <input
                className="border rounded px-2 py-1 w-full text-xs focus:border-primary transition"
                value={"SBIN0001234"}
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bank Name</label>
              <input
                className="border rounded px-2 py-1 w-full text-xs focus:border-primary transition"
                value={"State Bank of India"}
                readOnly
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">Status:</span>
              <span className="text-yellow-600 font-semibold flex items-center gap-1 animate-pulse text-xs" title="Pending">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Pending
              </span>
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
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="bg-primary text-white px-4 py-1 rounded text-xs font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
              >
                Save Bank Detail
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-xs font-semibold shadow hover:scale-105 transition-transform duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        {/* --- Referral & Commission System Card --- */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-4">
          <h3 className="text-base font-bold text-primary-light mb-2 animate-fadein">Referral & Commission System</h3>
          <div className="space-y-1 text-gray-700 text-xs">
            <div>• Agents get a unique referral code.</div>
            <div>• Multi-layer Referral Structure (Max 3 levels):</div>
            <ul className="ml-3 list-disc">
              <li>
                <span className="font-semibold text-green-700">Level 1:</span> <span className="font-bold text-green-700">1.5%</span>
              </li>
              <li>
                <span className="font-semibold text-green-700">Level 2:</span> <span className="font-bold text-green-700">0.25%</span>
              </li>
              <li>
                <span className="font-semibold text-green-700">Level 3:</span> <span className="font-bold text-green-500">0.25%</span>
              </li>
              <li>
                <span className="font-semibold text-gray-500">No commission beyond level 3.</span>
              </li>
            </ul>
          </div>
          <button
            className="mt-4 px-4 py-1 bg-primary text-white rounded-lg font-semibold shadow hover:bg-green-700 transition text-xs"
            onClick={() => window.location.href = "/#/refer-earn"}
          >
            Go to Referral Page
          </button>
        </div>
      </div>
    </div>
    {/* --- Commission Tracking Dashboard --- */}
      <div className="mt-6 w-full bg-gradient-to-br from-green-50 via-white to-green-100 rounded-2xl shadow-2xl border border-green-200 p-3 flex flex-col items-center animate-fadein">
        <h2 className="text-base font-extrabold text-green-700 mb-2 tracking-tight flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500 animate-pulse" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Commission Tracking Dashboard
        </h2>
        <div className="w-full flex flex-col md:flex-row gap-3 mb-3">
          {/* Total Earnings Card */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-3 flex flex-col items-center border border-green-100 animate-fadein-up">
            <span className="text-xs text-gray-500 mb-1">Total Earnings</span>
            <span className="text-lg font-bold text-green-700 mb-1">
              ₹{animatedEarnings.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-gray-600">All levels combined</span>
          </div>
          {/* Commission Breakup Card */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-3 flex flex-col items-center border border-green-100">
            <span className="text-xs text-gray-500 mb-1">Commission Breakup</span>
            <div className="w-full flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-green-700 text-xs">Level 1</span>
                <span className="font-bold text-green-700 text-xs">₹9,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-green-700 text-xs">Level 2</span>
                <span className="font-bold text-green-600 text-xs">₹2,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-green-700 text-xs">Level 3</span>
                <span className="font-bold text-green-500 text-xs">₹1,500</span>
              </div>
            </div>
          </div>
          {/* Withdrawal Requests Card */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-3 flex flex-col items-center border border-green-100">
            <span className="text-xs text-gray-500 mb-1">Withdrawal Requests</span>
            <div className="w-full flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-xs">#REQ1234</span>
                <span className="text-yellow-600 font-semibold animate-pulse text-xs">Pending</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-xs">#REQ1222</span>
                <span className="text-green-600 font-semibold text-xs">Paid</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-xs">#REQ1201</span>
                <span className="text-red-600 font-semibold text-xs">Rejected</span>
              </div>
            </div>
            <button className="mt-2 px-2 py-1 bg-primary text-white rounded-lg font-semibold shadow hover:bg-green-700 transition animate-bounce text-xs">
              Request Withdrawal
            </button>
          </div>
        </div>
        {/* Payment Status Timeline */}
        <div className="w-full mt-3">
          <h4 className="text-base font-bold text-green-700 mb-1 text-center">Payment Status Timeline</h4>
          <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-base font-bold shadow-lg animate-bounce">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="mt-1 text-xs text-green-700 font-semibold">Requested</span>
            </div>
            <div className="w-6 h-1 bg-green-200 rounded-full mx-1 md:mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-white text-base font-bold shadow-lg animate-pulse">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              </div>
              <span className="mt-1 text-xs text-yellow-700 font-semibold">Processing</span>
            </div>
            <div className="w-6 h-1 bg-green-200 rounded-full mx-1 md:mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-white text-base font-bold shadow-lg animate-bounce">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="mt-1 text-xs text-green-800 font-semibold">Paid</span>
            </div>
          </div>
        </div>
        <style>{`
          .animate-fadein { animation: fadein 0.7s; }
          @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
          .animate-fadein-up { animation: fadein-up 0.7s cubic-bezier(.68,-0.55,.27,1.55); }
          @keyframes fadein-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fadein-up.delay-100 { animation-delay: 0.1s; }
          .animate-fadein-up.delay-200 { animation-delay: 0.2s; }
          .animate-fadein-up.delay-300 { animation-delay: 0.3s; }
          .animate-glow {
            animation: glow-green 1.6s infinite alternate;
          }
          @keyframes glow-green {
            0% { box-shadow: 0 0 0 0 #22c55e33; }
            100% { box-shadow: 0 0 16px 4px #22c55e55; }
          }
          .animate-glow-yellow {
            animation: glow-yellow 1.6s infinite alternate;
          }
          @keyframes glow-yellow {
            0% { box-shadow: 0 0 0 0 #fde04733; }
            100% { box-shadow: 0 0 16px 4px #fde04788; }
          }
        `}</style>
      </div>
    </>
  );
};

// Move the useCountUp hook definition OUTSIDE the component (top-level, not inside the component)
function useCountUp(target: number, duration = 2500) {
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

export default RealProfile;
