import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import apiClient from '../../src/utils/api/apiClient'; // Adjust path if needed
import { IconEdit } from "../../constants";

// --- Country codes data (can be moved to a separate file if needed) ---
const countryCodes = [
  { code: "+91", label: "India", flag: "🇮🇳" },
  { code: "+1", label: "USA", flag: "🇺🇸" },
  { code: "+44", label: "UK", flag: "🇬🇧" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
  { code: "+971", label: "UAE", flag: "🇦🇪" },
];

// Initial state matching the API structure (flattened)
const initialProfileState = {
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    countryCode: "+91",
    photo: "",
    town: "",
    city: "",
    state: "",
    country: "",
};

const AdminProfilePage: React.FC = () => {
  const [profile, setProfile] = useState(initialProfileState);
  const [editProfile, setEditProfile] = useState(profile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // --- Fetch Admin Profile Data on Load ---
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setIsLoading(false);
      // Optional: Redirect to login if no token
      // navigate('/admin/login');
      return;
    }
    try {
      const user = await apiClient.get("/user/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const loadedProfile = {
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.mobile_number || "",
        countryCode: user.country_code || "+91",
        photo: user.photo_url || "", // Assuming a photo URL is provided
        town: user.town || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        dob: user.date_of_birth || "",
        gender: user.gender || "",
      };
      setProfile(loadedProfile);
      setEditProfile(loadedProfile);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setErrors({ general: "Could not load your profile data." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  // --- Save Updated Profile Data ---
  const handleSave = async () => {
    // Basic validation can be added here if needed
    setIsSaving(true);
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
      town: editProfile.town,
      city: editProfile.city,
      state: editProfile.state,
      country: editProfile.country,
      // Note: Photo upload would typically be a separate multipart/form-data request
    };

    try {
      await apiClient.put('/user/profile/', payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile(editProfile); // Update the main profile state
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/admin/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Failed to save profile:", error.response?.data);
      const errorData = error.response?.data;
      const errorMessage = typeof errorData === 'object' ? Object.values(errorData).flat().join(' ') : "Failed to save. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto mt-8 p-0 flex gap-8">
        <div className="flex-1 p-6 rounded-2xl shadow-xl bg-white">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-primary agent-photo profile-pulse">
                {editProfile.photo ? (
                  <img src={editProfile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (editProfile.firstName[0] || "A") + (editProfile.lastName[0] || "")
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white border border-primary rounded-full p-2 cursor-pointer hover:bg-primary hover:text-white transition" title="Upload Photo">
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
            <h2 className="mt-4 text-2xl font-bold text-primary-light tracking-wide">Edit Admin Profile</h2>
          </div>
          <form className="space-y-5" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">First Name</label>
                <input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" value={editProfile.firstName} onChange={e => setEditProfile({ ...editProfile, firstName: e.target.value })} placeholder="First Name" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                <input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" value={editProfile.lastName} onChange={e => setEditProfile({ ...editProfile, lastName: e.target.value })} placeholder="Last Name" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Gender</label>
                <select className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" value={editProfile.gender} onChange={e => setEditProfile({ ...editProfile, gender: e.target.value })} required>
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date of Birth</label>
                <input type="date" className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" value={editProfile.dob} onChange={e => setEditProfile({ ...editProfile, dob: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <select className="border rounded px-2 py-2 bg-white text-base focus:border-primary transition" value={editProfile.countryCode} onChange={e => setEditProfile({ ...editProfile, countryCode: e.target.value })} required>
                    {countryCodes.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                  </select>
                  <input className="border rounded px-2 py-2 w-full text-base focus:border-primary transition" value={editProfile.phone} onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })} placeholder="Phone Number" required maxLength={15} pattern="\d*" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input disabled className="border rounded px-3 py-2 w-full text-base bg-gray-100 cursor-not-allowed" value={editProfile.email} type="email" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Address</label>
              <div className="grid grid-cols-2 gap-4">
                <div><input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" value={editProfile.town} onChange={e => setEditProfile({ ...editProfile, town: e.target.value })} placeholder="Town" required /></div>
                <div><input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" value={editProfile.city} onChange={e => setEditProfile({ ...editProfile, city: e.target.value })} placeholder="City" required /></div>
                <div><input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" value={editProfile.state} onChange={e => setEditProfile({ ...editProfile, state: e.target.value })} placeholder="State" required /></div>
                <div><input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" value={editProfile.country} onChange={e => setEditProfile({ ...editProfile, country: e.target.value })} placeholder="Country" required /></div>
              </div>
            </div>
            {errors.general && <span className="text-sm text-red-500">{errors.general}</span>}
            <div className="flex gap-2 mt-6">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded text-base font-semibold shadow-lg hover:scale-105 transition-transform duration-200" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
              <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded text-base font-semibold shadow hover:scale-105 transition-transform duration-200" onClick={() => setEditProfile(profile)}>
                Cancel
              </button>
            </div>
          </form>
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="relative bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg"><svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                <div className="text-2xl font-bold text-primary mb-2 text-center">Profile Saved!</div>
              </div>
            </div>
          )}
        </div>
        <div className="w-[22rem] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-primary-light mb-3">Admin Summary</h3>
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
                <span className="font-medium text-gray-700">Pending Bookings</span>
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