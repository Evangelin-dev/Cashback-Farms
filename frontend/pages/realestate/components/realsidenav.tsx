import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  generateUserCode,
  IconAlertCircle,
  IconCheck,
  IconCollection,
  IconEdit,
  IconLogout,
  IconMapPin,
  IconPlus,
  IconRupee,
  IconUsers,
} from "../../../constants.tsx";
import { LayoutDashboard, UploadCloud, X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "@/src/utils/api/apiClient"; // Make sure this path is correct
import "../AgentProfileSection.css";

// --- INTERFACE FOR THE KYC DOCUMENT RESPONSE ---
interface IKycDocument {
    id: number;
    document_type: string;
    file: string;
    status: 'submitted' | 'pending' | 'approved' | 'rejected';
    upload_date: string;
}

// Menu items for real estate agent panel (Unchanged)
const menuItems = [
    { key: "/realestate/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "My Dashboard" },
    { key: "/realestate/post-plots", icon: <IconMapPin className="w-5 h-5" />, label: "Post Plots" },
    { key: "/realestate/post-micro-plots", icon: <IconMapPin className="w-5 h-5" />, label: "Post Micro Plots" },
    { key: "/realestate/leads", icon: <IconUsers className="w-5 h-5" />, label: "Plot Inquiries & Leads" },
    { key: "/realestate/commission", icon: <IconRupee className="w-5 h-5" />, label: "Commission Dashboard" },
    { key: "/realestate/lead-management", icon: <IconCollection className="w-5 h-5" />, label: "Lead Management" },
    { key: "/referrealestate", icon: <IconPlus className="w-5 h-5" />, label: "Refer and Earn" },
];

// --- KYC Submission Modal Component (Unchanged) ---
const KycModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (docType: string, file: File) => Promise<void>;
}) => {
  const [docType, setDocType] = useState("national_id");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Please select a file to upload."); return; }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(docType, file);
      // The parent component handles closing on success.
    } catch (apiError: any) {
      setError(apiError.message || "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-adminpop">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition" aria-label="Close"><X className="w-6 h-6" /></button>
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Submit KYC Document</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm">
              <option value="national_id">National ID</option>
              <option value="aadhaar_card">Aadhaar Card</option>
              <option value="passport">Passport</option>
              <option value="pan_card">PAN Card</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File</label>
            <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-primary">
              <span className="flex items-center space-x-2">
                <UploadCloud className="w-6 h-6 text-gray-500" />
                <span className="font-medium text-gray-600">{file ? file.name : "Click to upload a file"}</span>
              </span>
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit" disabled={isSubmitting || !file} className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-green-500 to-primary text-white font-bold text-lg shadow-lg hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>
      <style>{`@keyframes adminpop {0%{transform:scale(.8) rotate(-5deg);opacity:0}60%{transform:scale(1.05) rotate(2deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}.animate-adminpop{animation:adminpop .6s cubic-bezier(.68,-.55,.27,1.55)}`}</style>
    </div>
  );
};

// --- ProfileSection with REFACTORED KYC Logic ---
const ProfileSection: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", photo: "" });
  const [showKycModal, setShowKycModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [kycDataLoaded, setKycDataLoaded] = useState(false);

  // --- REFACTORED KYC STATE ---
  const [kycDocuments, setKycDocuments] = useState<IKycDocument[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setKycDataLoaded(false);
      const accessToken = localStorage.getItem("access_token");      
      if (!accessToken) { setIsLoading(false); setKycDataLoaded(true); return; }
      
      const headers = { Authorization: `Bearer ${accessToken}` };
      
      try {
        const [profileRes, kycRes] = await Promise.all([
          apiClient.get("/user/profile/", { headers }),
          apiClient.get("/user/kyc/status/", { headers }),
        ]);

        if (profileRes) {
          setProfile({ name: profileRes.username || "User", email: profileRes.email || "", phone: profileRes.mobile_number || "", photo: "" });
        }
        if (kycRes?.documents) {
          setKycDocuments(kycRes.documents);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setKycDataLoaded(true);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser]); // Refetch when user logs in/out

  // --- REFACTORED KYC SUBMISSION FOR INSTANT UI UPDATE ---
  const handleKycSubmit = async (docType: string, file: File) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("Authentication token not found.");

    const formData = new FormData();
    formData.append("document_type", docType);
    formData.append("file", file);

    try {
      // The API call just needs to succeed. We don't need its response for the optimistic update.
      await apiClient.post("/user/kyc/submit/", formData, {
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "multipart/form-data" },
      });
      
      alert("KYC document submitted successfully! Status is now pending review.");
      setShowKycModal(false);
      
      // OPTIMISTIC UPDATE: Manually create a document object to update the UI instantly.
      const optimisticNewDocument: IKycDocument = {
        id: Date.now(), // Temporary key for React
        document_type: docType,
        status: 'submitted',
        file: '', // File path is not needed for this UI
        upload_date: new Date().toISOString(),
      };
      setKycDocuments(prevDocs => [optimisticNewDocument, ...prevDocs]);
      
    } catch (error: any) {
      console.error("KYC submission failed:", error);
      const errorMessage = error.response?.data?.detail || "KYC submission failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  // Derive the current KYC status from the documents array
  const latestDocument = kycDocuments.length > 0 ? kycDocuments[0] : null;
  const currentKycStatus = latestDocument?.status || "Not Verified";

  const getKycDisplay = () => {
    switch (currentKycStatus) {
      case "approved": return <span className="text-green-600 font-semibold flex items-center gap-2 text-sm"><IconCheck className="w-5 h-5 animate-bounce" /> Verified</span>;
      case "pending": case "submitted": return <span className="text-yellow-600 font-semibold flex items-center gap-2 text-sm"><IconAlertCircle className="w-5 h-5 animate-pulse" /> Pending Review</span>;
      case "rejected": return <span className="text-red-600 font-semibold flex items-center gap-2 text-sm"><IconAlertCircle className="w-5 h-5" /> Rejected</span>;
      default: return <span className="text-red-600 font-semibold flex items-center gap-2 text-sm"><IconAlertCircle className="w-5 h-5 animate-pulse" /> Not Verified</span>;
    }
  };

  const shouldShowVerifyButton = kycDataLoaded && (currentKycStatus === "Not Verified" || currentKycStatus === "rejected");
  const userName = currentUser?.username || profile.name || "User";
  const userEmail = currentUser?.email || profile.email || "";

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg" style={{ minHeight: 56 }}>
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex flex-col min-w-0 flex-1"><div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div><div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div></div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {showKycModal && <KycModal onClose={() => setShowKycModal(false)} onSubmit={handleKycSubmit} />}
      <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-primary/10 transition" onClick={() => setDropdownOpen(o => !o)} style={{ minHeight: 56 }}>
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-2 border-primary agent-photo">
          {profile.photo ? <img src={profile.photo} alt="avatar" className="w-full h-full rounded-full object-cover" /> : (userName[0]?.toUpperCase() || "U")}
        </div>
        <div className="flex flex-col min-w-0"><span className="font-semibold text-primary-light truncate">EDIT PROFILE</span><span className="text-xs text-gray-500 truncate">{userEmail}</span></div>
        <span className="ml-auto"><svg className={`w-5 h-5 text-primary transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></span>
      </div>
      <div className={`absolute left-0 right-0 z-30 bg-white rounded-lg shadow-lg border border-neutral-200 mt-2 transition-all duration-200 origin-top ${dropdownOpen ? "scale-y-100 opacity-100" : "scale-y-95 opacity-0 pointer-events-none"}`}>
        <div className="p-4 flex flex-col items-center">
          <div className="mt-1 text-lg font-semibold text-primary-light">{userName}</div>
          <div className="text-xs text-gray-500 mb-2">{userEmail}</div>
          <div className="w-full flex flex-col items-center mt-4 mb-2">
            <div className="flex flex-col items-center w-full px-2 py-2 bg-neutral-100 rounded-lg border border-neutral-200">
              <span className="text-xs text-gray-500 mb-1 tracking-wide">KYC Status</span>
              {!kycDataLoaded ? ( <div className="text-sm text-gray-500 animate-pulse">Loading...</div> ) : (
                <>
                  {getKycDisplay()}
                  {shouldShowVerifyButton && (
                    <button className="mt-2 px-4 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark transition animate-kyc-btn" onClick={() => setShowKycModal(true)}>
                      {currentKycStatus === "rejected" ? "Re-submit KYC" : "Verify KYC"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <button className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition font-semibold flex items-center gap-2" onClick={() => { setDropdownOpen(false); navigate("/realestate/realprofile"); }}>
            <IconEdit className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>
      {dropdownOpen && <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />}
    </div>
  );
};

// --- Main Sidebar Component (Unchanged) ---
const RealSideNav: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <button className="md:hidden fixed top-4 left-4 z-50 bg-gradient-to-br from-green-500 to-green-700 text-white p-2 rounded-full shadow-lg" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <div className={`fixed z-40 top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col p-4 space-y-2 border-r border-green-200 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}>
        <ProfileSection />
        <div className="text-2xl font-bold text-primary-light py-4 px-2 mb-4 border-b border-neutral-200">RealEstate<span className="text-black"> Agent</span></div>
        <nav className="flex-grow space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink key={item.key} to={item.key} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center px-4 py-3 text-sm transition-colors duration-150 rounded-md ${isActive || location.pathname === item.key ? "bg-primary text-white font-semibold shadow-md" : "text-black hover:bg-primary hover:text-white"}`}>
              <span className="mr-3 w-5 h-5">{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <hr className="my-2 border-t border-neutral-300" />
          <button onClick={() => { logout(); navigate("/"); setSidebarOpen(false); }} className="flex items-center w-full px-4 py-3 text-sm font-semibold text-black hover:bg-red-600 hover:text-white transition-colors duration-150 rounded-md">
            <IconLogout className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </div>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
    </>
  );
};

export default RealSideNav;