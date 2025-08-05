import apiClient from "@/src/utils/api/apiClient";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // 1. IMPORT THE AUTH CONTEXT HOOK

// Mock data and useCountUp hook for the side panel
const mockRecentPurchases = [
  { id: "r1", name: "Serene Valley Plot", date: "2024-05-10" },
  { id: "r2", name: "Greenheap Prime Location", date: "2024-04-22" },
  { id: "r3", name: "Riverside Retreat", date: "2024-03-15" },
];

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

// Define a type for the local editable state for clarity
interface EditableProfile {
  firstName: string;
  lastName: string;
  email: string;
  user_code: string;
  phone: string;
  countryCode: string;
  photo: string;
  town: string;
  city: string;
  state: string;
  country: string;
  dob: string;
  gender: string;
  role: string;
}

const MyProfile: React.FC = () => {
  // GET THE GLOBAL PROFILE DATA FROM THE CONTEXT
  const { profile: globalProfile, isProfileLoading, refetchProfile } = useAuth();

  // Local state for the form fields
  const [editProfile, setEditProfile] = useState<EditableProfile | null>(null);

  // Local state for UI feedback and page-specific data
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [profileAnim, setProfileAnim] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>("Not Verified");
  const [countryCodes, setCountryCodes] = useState<{ code: string; label: string; }[]>([]);

  // This effect syncs the local `editProfile` state when the global profile loads/changes
  useEffect(() => {
    if (globalProfile) {
      setEditProfile({
        firstName: globalProfile.first_name || "",
        lastName: globalProfile.last_name || "",
        email: globalProfile.email || "",
        user_code: globalProfile.user_code || "",
        phone: globalProfile.mobile_number || "",
        countryCode: globalProfile.country_code || "+91",
        photo: globalProfile.photo_url || "",
        town: globalProfile.town || "",
        city: globalProfile.city || "",
        state: globalProfile.state || "",
        country: globalProfile.country || "",
        dob: globalProfile.date_of_birth || "",
        gender: globalProfile.gender || "",
        role: globalProfile.user_type || "User",
      });
      // Trigger animation once data is loaded
      setTimeout(() => setProfileAnim(true), 100);
    }
  }, [globalProfile]);

  // This effect fetches KYC status, which is specific to this page
  useEffect(() => {
    const fetchKyc = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return;
      const headers = { Authorization: `Bearer ${accessToken}` };
      try {
        const kycRes = await apiClient.get("/user/kyc/status/", { headers });
        setKycStatus(kycRes.data.status || "Not Verified");
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setKycStatus("Not Verified");
        } else {
          console.error("Failed to fetch KYC status:", err);
        }
      }
    };
    fetchKyc();
  }, []);

  // This effect for country codes can remain as it is page-specific
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=idd,name")
      .then(res => res.json())
      .then((data) => {
        const codes = data
          .filter((c: any) => c.idd && c.idd.root)
          .flatMap((c: any) => {
            const root = c.idd.root;
            const suffixes = c.idd.suffixes || [''];
            return suffixes.map((suffix: string) => ({
              code: `${root}${suffix}`,
              label: c.name.common,
            }));
          })
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
        setCountryCodes(codes);
      }).catch(() => { setCountryCodes([{ code: "+91", label: "India" }, { code: "+1", label: "USA" }]); });
  }, []);

  const handleInputChange = (field: keyof EditableProfile, value: string) => {
    if (editProfile) {
      setEditProfile({ ...editProfile, [field]: value });
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleSave = async () => {
    if (!editProfile) return;

    setErrors({});
    setIsSaving(true);

    const accessToken = localStorage.getItem("access_token");
    const payload = {
      first_name: editProfile.firstName,
      last_name: editProfile.lastName,
      mobile_number: editProfile.phone,
      country_code: editProfile.countryCode,
      gender: editProfile.gender,
      date_of_birth: editProfile.dob,
      town: editProfile.town,
      city: editProfile.city,
      state: editProfile.state,
      country: editProfile.country,
    };

    try {
      await apiClient.put('/user/profile/', payload, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });

      // ON SUCCESS, REFETCH THE GLOBAL PROFILE SO THE WHOLE APP UPDATES
      refetchProfile();

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);

    } catch (error: any) {
      console.error("Failed to save profile:", error.response?.data);
      setErrors({ general: error.response?.data?.detail || "Failed to save profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const totalEarnings = 12500;
  const animatedEarnings = useCountUp(totalEarnings, 1200);

  // Use the loading state from the context
  if (isProfileLoading || !editProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto mt-8 p-0 flex gap-8">
        <div className={`flex-1 p-6 rounded-2xl shadow-xl bg-white user-profile-anim ${profileAnim ? "profile-anim-pop" : ""}`}>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-primary agent-photo profile-pulse">
              {editProfile.photo ? <img src={editProfile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" /> : ((editProfile.firstName?.[0] || "U") + (editProfile.lastName?.[0] || ""))}
            </div>
            <label className="absolute bottom-0 right-0 bg-white border border-primary rounded-full p-2 cursor-pointer hover:bg-primary hover:text-white transition" title="Upload Photo">
              <input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = ev => handleInputChange('photo', ev.target?.result as string); reader.readAsDataURL(file); } }} />
              <span className="text-xs">✎</span>
            </label>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-primary-light tracking-wide animate-fadein">Edit User Profile</h2>
          <div className="mt-2 text-l text-gray-600 font-mono bg-gray-100 px-4 py-1 rounded shadow-sm">User Code: <span className="text-primary font-semibold">{editProfile.user_code}</span></div>
        </div>
        <form className="space-y-5 animate-slidein" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-gray-500 mb-1">First Name</label><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.firstName ? "border-red-400" : ""}`} value={editProfile.firstName} onChange={e => handleInputChange('firstName', e.target.value)} placeholder="First Name" required />{errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}</div>
            <div><label className="block text-xs text-gray-500 mb-1">Last Name</label><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.lastName ? "border-red-400" : ""}`} value={editProfile.lastName} onChange={e => handleInputChange('lastName', e.target.value)} placeholder="Last Name" required />{errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-gray-500 mb-1">Gender</label><select className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.gender ? "border-red-400" : ""}`} value={editProfile.gender} onChange={e => handleInputChange('gender', e.target.value)} required><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select>{errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}</div>
            <div><label className="block text-xs text-gray-500 mb-1">Date of Birth</label><input type="date" className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.dob ? "border-red-400" : ""}`} value={editProfile.dob} onChange={e => handleInputChange('dob', e.target.value)} required />{errors.dob && <span className="text-xs text-red-500">{errors.dob}</span>}</div>
          </div>
          <div><label className="block text-xs text-gray-500 mb-1">Email</label><input disabled className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition bg-gray-100 cursor-not-allowed`} value={editProfile.email} type="email" /></div>
          <div><label className="block text-xs text-gray-500 mb-1">Phone Number</label><div className="flex gap-2"><select className="border rounded px-2 py-2 bg-white text-base focus:border-primary transition" value={editProfile.countryCode} onChange={e => handleInputChange('countryCode', e.target.value)} required>{countryCodes.map(c => (<option key={c.code + c.label} value={c.code}>{c.code} ({c.label})</option>))}</select><input className={`border rounded px-2 py-2 text-base focus:border-primary transition flex-1 ${errors.phone ? "border-red-400" : ""}`} value={editProfile.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="Phone Number" required maxLength={15} /></div>{errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}</div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Address</label>
            <div className="grid grid-cols-2 gap-4">
              <div><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition`} value={editProfile.town} onChange={e => handleInputChange('town', e.target.value)} placeholder="Town" required /></div>
              <div><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition`} value={editProfile.city} onChange={e => handleInputChange('city', e.target.value)} placeholder="City" required /></div>
              <div><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition`} value={editProfile.state} onChange={e => handleInputChange('state', e.target.value)} placeholder="State" required /></div>
              <div><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition`} value={editProfile.country} onChange={e => handleInputChange('country', e.target.value)} placeholder="Country" required /></div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Role</label>
            <input type="text" disabled value={editProfile.role} className="border rounded px-3 py-2 w-full text-base bg-gray-100" />
          </div>
          {/* <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">KYC Status:</span>
            <span className={`font-semibold flex items-center gap-1 ${kycStatus.toLowerCase() === 'approved' ? 'text-green-600' : kycStatus.toLowerCase() === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
              {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
            </span>
          </div> */}
          <div className="flex gap-2 mt-6">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded text-base font-semibold shadow-lg hover:scale-105 transition-transform duration-200" disabled={isSaving}>{isSaving ? "Saving..." : "Save Profile"}</button>
            <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded text-base font-semibold shadow hover:scale-105 transition-transform duration-200" onClick={() => globalProfile && setEditProfile(globalProfile)}>Cancel</button>
          </div>
        </form>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg"><svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
              <div className="text-2xl font-bold text-primary mb-2 text-center">Profile Saved!</div>
              <button className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary-dark transition" onClick={() => setShowPopup(false)}>OK</button>
            </div>
          </div>
        )}
      </div>
        <div className="w-[28rem] flex-shrink-0 flex flex-col gap-6">
          {/* <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-primary-light mb-3 animate-fadein">Recent Purchased Plots</h3>
            <ul className="space-y-2">
              {mockRecentPurchases.map(purchase => (
                <li key={purchase.id} className="flex items-center justify-between px-4 py-2 bg-neutral-50 rounded-lg shadow-sm hover:bg-primary/10 transition animate-listitem">
                  <span className="font-medium text-gray-700">{purchase.name}</span>
                  <span className="text-xs text-gray-500">{purchase.date}</span>
                </li>
              ))}
            </ul>
          </div> */}
          {/* <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex flex-col items-center justify-center">
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
          </div> */}
        </div>
      </div>
    </>
  );
};

export default MyProfile;