import apiClient from "@/src/utils/api/apiClient";
import React, { useEffect, useState } from "react";
import { generateUserCode } from "../../constants";



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

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    photo: "",
    town: "",
    city: "",
    state: "",
    country: "",
    dob: "",
    gender: "",
    joiningDate: new Date(),
    role: "Plot Buyer",
    aadharFile: null as File | null,
    panFile: null as File | null,
    aadharFileName: "",
    panFileName: "",
  });

  const [editProfile, setEditProfile] = useState(profile);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [profileAnim, setProfileAnim] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>("Not Verified");
  const [countryCodes, setCountryCodes] = useState<{ code: string; label: string; flag: string }[]>([]);

  const userCode = generateUserCode(
    `${profile.firstName || 'User'} ${profile.lastName || ''}`,
    profile.joiningDate
  );

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      console.log(accessToken, "accessToken");
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${accessToken}` };

      try {
        const [profileRes, kycRes] = await Promise.all([
          apiClient.get("/user/profile/", { headers }),
          apiClient.get("/user/kyc/status/", { headers }).catch(err => {
            if (err.response && err.response.status === 404) {
              return { data: { status: "Not Verified" } };
            }
            throw err;
          })
        ]);
        console.log(profileRes, "profileRes");
        if (profileRes) {
          const user = profileRes;
          const loadedProfile = {
            firstName: user.first_name || "",
            lastName: user.last_name || "",
            email: user.email || "",
            phone: user.mobile_number || "",
            countryCode: user.country_code || "+91",
            photo: user.photo_url || "",
            town: user.town || "",
            city: user.city || "",
            state: user.state || "",
            country: user.country || "",
            dob: user.date_of_birth || "",
            gender: user.gender || "",
            joiningDate: user.date_joined ? new Date(user.date_joined) : new Date(),
            role: user.user_type,
            aadharFile: null,
            panFile: null,
            aadharFileName: user.aadhar_filename || "",
            panFileName: user.pan_filename || "",
          };
          setProfile(loadedProfile);
          setEditProfile(loadedProfile);
        }

        if (kycRes && kycRes.status) {
          setKycStatus(kycRes.status);
        }

      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setErrors({ general: "Could not load page data." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=idd,name,flags")
      .then(res => res.json())
      .then((data) => {
        const codes = data.filter((c: any) => c.idd && c.idd.root).map((c: any) => { const code = c.idd.suffixes && c.idd.suffixes.length > 0 ? c.idd.suffixes.map((s: string) => `${c.idd.root}${s}`) : [c.idd.root]; return code.map((cc: string) => ({ code: cc, label: c.name.common, flag: c.flags && c.flags.png ? (<img src={c.flags.png} alt={c.name.common} style={{ width: 18, display: "inline" }} />) : "🌐" })); }).flat().sort((a: any, b: any) => a.label.localeCompare(b.label));
        setCountryCodes(codes);
      }).catch(() => { setCountryCodes([{ code: "+91", label: "India", flag: "🇮🇳" }, { code: "+1", label: "USA", flag: "🇺🇸" }, { code: "+44", label: "UK", flag: "🇬🇧" }]); });
  }, []);

  const validate = () => { return {}; };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    const accessToken = localStorage.getItem("access_token");

    const payload = {
      first_name: editProfile.firstName,
      last_name: editProfile.lastName,
      email: editProfile.email,
      mobile_number: editProfile.phone,
      country_code: editProfile.countryCode,
      gender: editProfile.gender,
      date_of_birth: editProfile.dob,
      user_type: editProfile.role,
      town: editProfile.town,
      city: editProfile.city,
      state: editProfile.state,
      country: editProfile.country,
    };

    try {
      await apiClient.put('/user/profile/', payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      setProfile(editProfile);

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);

    } catch (error: any) {
      console.error("Failed to save profile:", error.response?.data);
      setErrors({ general: error.response?.data?.detail || "Failed to save profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const totalEarnings = 12500;
  const animatedEarnings = useCountUp(totalEarnings, 1200);

  if (isLoading && !showPopup) {
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
                {editProfile.photo ? <img src={editProfile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" /> : ((editProfile.firstName[0] || "U") + (editProfile.lastName[0] || ""))}
              </div>
              <label className="absolute bottom-0 right-0 bg-white border border-primary rounded-full p-2 cursor-pointer hover:bg-primary hover:text-white transition" title="Upload Photo">
                <input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = ev => setEditProfile({ ...editProfile, photo: ev.target?.result as string }); reader.readAsDataURL(file); } }} />
                <span className="text-xs">✎</span>
              </label>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-primary-light tracking-wide animate-fadein">Edit User Profile</h2>
            <div className="mt-2 text-sm text-gray-600 font-mono bg-gray-100 px-4 py-1 rounded shadow-sm">User Code: <span className="text-primary font-semibold">{userCode}</span></div>
          </div>
          <form className="space-y-5 animate-slidein" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-500 mb-1">First Name</label><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.firstName ? "border-red-400" : ""}`} value={editProfile.firstName} onChange={e => setEditProfile({ ...editProfile, firstName: e.target.value })} placeholder="First Name" required />{errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}</div>
              <div><label className="block text-xs text-gray-500 mb-1">Last Name</label><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.lastName ? "border-red-400" : ""}`} value={editProfile.lastName} onChange={e => setEditProfile({ ...editProfile, lastName: e.target.value })} placeholder="Last Name" required />{errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-500 mb-1">Gender</label><select className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.gender ? "border-red-400" : ""}`} value={editProfile.gender} onChange={e => setEditProfile({ ...editProfile, gender: e.target.value })} required><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select>{errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}</div>
              <div><label className="block text-xs text-gray-500 mb-1">Date of Birth</label><input type="date" className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.dob ? "border-red-400" : ""}`} value={editProfile.dob} onChange={e => setEditProfile({ ...editProfile, dob: e.target.value })} required />{errors.dob && <span className="text-xs text-red-500">{errors.dob}</span>}</div>
            </div>
            <div><label className="block text-xs text-gray-500 mb-1">Email</label><input disabled className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.email ? "border-red-400" : ""}`} value={editProfile.email} onChange={e => setEditProfile({ ...editProfile, email: e.target.value })} placeholder="Email" required type="email" />{errors.email && <span className="text-xs text-red-500">{errors.email}</span>}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-500 mb-1">Phone Number</label><div className="flex gap-2"><select className="border rounded px-2 py-2 bg-white text-base focus:border-primary transition" value={editProfile.countryCode} onChange={e => setEditProfile({ ...editProfile, countryCode: e.target.value })} required>{countryCodes.map(c => (<option key={c.code + c.label} value={c.code}>{c.code}</option>))}</select><input className={`border rounded px-2 py-2 text-base focus:border-primary transition ${errors.phone ? "border-red-400" : ""}`} value={editProfile.phone} onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })} placeholder="Phone Number" required maxLength={15}  /></div>{errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}</div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Address</label>
              <div className="grid grid-cols-2 gap-4">
                <div><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.town ? "border-red-400" : ""}`} value={editProfile.town} onChange={e => setEditProfile({ ...editProfile, town: e.target.value })} placeholder="Town" required />{errors.town && <span className="text-xs text-red-500">{errors.town}</span>}</div>
                <div><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.city ? "border-red-400" : ""}`} value={editProfile.city} onChange={e => setEditProfile({ ...editProfile, city: e.target.value })} placeholder="City" required />{errors.city && <span className="text-xs text-red-500">{errors.city}</span>}</div>
                <div><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.state ? "border-red-400" : ""}`} value={editProfile.state} onChange={e => setEditProfile({ ...editProfile, state: e.target.value })} placeholder="State" required />{errors.state && <span className="text-xs text-red-500">{errors.state}</span>}</div>
                <div><input className={`border rounded px-3 py-2 w-full text-base focus:border-primary transition ${errors.country ? "border-red-400" : ""}`} value={editProfile.country} onChange={e => setEditProfile({ ...editProfile, country: e.target.value })} placeholder="Country" required />{errors.country && <span className="text-xs text-red-500">{errors.country}</span>}</div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Role</label>
              <input type="text" disabled value={editProfile.role} className="border rounded px-3 py-2 w-full text-base bg-gray-100" />
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">KYC Status:</span>
                <span className={`font-semibold flex items-center gap-1 ${kycStatus.toLowerCase() === 'approved' ? 'text-green-600' : kycStatus.toLowerCase() === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded text-base font-semibold shadow-lg hover:scale-105 transition-transform duration-200" disabled={isLoading}>{isLoading ? "Saving..." : "Save Profile"}</button>
              <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded text-base font-semibold shadow hover:scale-105 transition-transform duration-200" onClick={() => setEditProfile(profile)}>Cancel</button>
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