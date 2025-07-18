import apiClient from "@/src/utils/api/apiClient";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateUserCode,
  IconAlertCircle,
  IconCheck,
  IconEdit,
} from "../../../constants.tsx";
import "../AgentProfileSection.css";
import { UploadCloud, X } from "lucide-react";

// --- FIX: DEFINING 'initialProfile' AT THE TOP LEVEL ---
// This ensures it's available to the component before it renders.
const initialProfile = {
  firstName: "",
  lastName: "",
  gender: "",
  dob: "",
  company: "",
  email: "",
  phone: "",
  countryCode: "+91",
  companyNumber: "",
  companyCountryCode: "+91",
  photo: "",
  address: {
    town: "",
    city: "",
    state: "",
    country: "",
  },
  gstNumber: "",
};

// --- KYC DOCUMENT INTERFACE & CONSTANTS ---
interface IKycDocument {
    id: number;
    document_type: string;
    file: string;
    status: 'submitted' | 'pending' | 'approved' | 'rejected';
    upload_date: string;
}
const DOCUMENT_TYPES = [
    { value: 'pan_card', label: 'PAN Card' },
    { value: 'aadhaar_card', label: 'Aadhaar Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID' },
];

// --- HELPER COMPONENTS AND HOOKS (DEFINED OUTSIDE) ---
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

const KycModal: React.FC<{ onClose: () => void; onSubmit: (docType: string, file: File) => Promise<void>; }> = ({ onClose, onSubmit }) => {
    const [docType, setDocType] = useState("pan_card");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { setError(null); if (e.target.files && e.target.files[0]) { setFile(e.target.files[0]); } };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) { setError("Please select a file to upload."); return; }
        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit(docType, file);
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
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label><select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm">{DOCUMENT_TYPES.map(doc => <option key={doc.value} value={doc.value}>{doc.label}</option>)}</select></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Upload File</label><label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-primary"><span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-500" /><span className="font-medium text-gray-600">{file ? file.name : "Click to upload a file"}</span></span><input type="file" onChange={handleFileChange} className="hidden" /></label></div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <button type="submit" disabled={isSubmitting || !file} className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-green-500 to-primary text-white font-bold text-lg shadow-lg hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? "Submitting..." : "Submit for Verification"}</button>
                </form>
            </div>
            <style>{`@keyframes adminpop {0%{transform:scale(.8) rotate(-5deg);opacity:0}60%{transform:scale(1.05) rotate(2deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}.animate-adminpop{animation:adminpop .6s cubic-bezier(.68,-.55,.27,1.55)}`}</style>
        </div>
    );
};

const WithdrawPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => { /* ... (WithdrawPopup remains the same) ... */ return null; };

// --- MAIN COMPONENT ---
const RealProfile: React.FC = () => {
  const [editMode, setEditMode] = useState(true);
  const [profileAnim, setProfileAnim] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [agentId, setAgentId] = useState<string | number | null>(null);
  const [bankDetails, setBankDetails] = useState({ id: "", accountHolder: "", accountNumber: "", ifsc: "", bankName: "", status: "" });
  const navigate = useNavigate();

  const [kycDocuments, setKycDocuments] = useState<IKycDocument[]>([]);
  const [kycDataLoaded, setKycDataLoaded] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  const formik = useFormik({
    initialValues: initialProfile,
    enableReinitialize: true,
    onSubmit: async (values) => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken || !agentId) return;
        try {
            await apiClient.put(`/agents/${agentId}/`, {
                first_name: values.firstName,
                last_name: values.lastName,
                gender: values.gender,
                date_of_birth: values.dob,
                company_name: values.company,
                email: values.email,
                phone_number: `${values.countryCode}${values.phone}`,
                company_number: `${values.companyCountryCode}${values.companyNumber}`,
                gst_number: values.gstNumber,
                city: values.address.city,
                state: values.address.state,
                country: values.address.country,
            }, { headers: { Authorization: `Bearer ${accessToken}` } });
            
            setEditMode(false);
            setProfileAnim(true);
            setShowPopup(true);
            setTimeout(() => { setProfileAnim(false); setTimeout(() => { setShowPopup(false); }, 1200); }, 1200);
        } catch (err) {
            alert("Failed to update agent profile.");
        }
    },
  });

  const [countryCodes, setCountryCodes] = useState<{ code: string; label: string; flag: string }[]>([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=idd,name,flags")
      .then((res) => res.json())
      .then((data) => {
        const codes = data.filter((c: any) => c.idd && c.idd.root).flatMap((c: any) => { const root = c.idd.root || ""; const suffixes = Array.isArray(c.idd.suffixes) && c.idd.suffixes.length > 0 ? c.idd.suffixes : [""]; return suffixes.map((suffix: string) => ({ code: (root + suffix).replace(/\s/g, ""), label: c.name.common, flag: c.flag || "" })); }).filter((c: any) => c.code && c.label).reduce((acc: any[], curr: any) => { if (!acc.some((item) => item.code === curr.code && item.label === curr.label)) acc.push(curr); return acc; }, []).sort((a: any, b: any) => a.label.localeCompare(b.label));
        setCountryCodes(codes);
      });
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return;
      const headers = { Authorization: `Bearer ${accessToken}` };
      
      setKycDataLoaded(false);
      try {
        const [agentRes, bankRes, kycRes] = await Promise.all([
          apiClient.get("/agents/", { headers }),
          apiClient.get("/bank-details/", { headers }),
          apiClient.get("/user/kyc/status/", { headers })
        ]);

        const agent = Array.isArray(agentRes) ? agentRes[0] : agentRes;
        if (agent) {
          setAgentId(agent.id);
          formik.setValues({
            firstName: agent.first_name || "",
            lastName: agent.last_name || "",
            gender: agent.gender || "",
            dob: agent.date_of_birth || "",
            company: agent.company_name || "",
            email: agent.email || "",
            phone: agent.phone_number || "",
            companyNumber: agent.company_number || "",
            address: { town: "", city: agent.city || "", state: agent.state || "", country: agent.country || "" },
            gstNumber: agent.gst_number || "",
            countryCode: "+91",
            companyCountryCode: "+91",
            photo: "",
          });
        }

        const bank = Array.isArray(bankRes) ? bankRes[0] : bankRes;
        if (bank) { setBankDetails({ id: bank.id || "", accountHolder: bank.account_holder_name || "", accountNumber: bank.account_number || "", ifsc: bank.ifsc || "", bankName: bank.bank_name || "", status: bank.status || "Pending" }); }
        
        if (kycRes?.documents) { setKycDocuments(kycRes.documents); }

      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setKycDataLoaded(true);
      }
    };
    fetchAllData();
  }, []);

  const handleKycSubmit = async (docType: string, file: File) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("Authentication token not found.");
    const formData = new FormData();
    formData.append("document_type", docType);
    formData.append("file", file);
    try {
      await apiClient.post("/user/kyc/submit/", formData, { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "multipart/form-data" } });
      alert("KYC document submitted successfully! Status is now pending review.");
      setShowKycModal(false);
      const optimisticNewDocument: IKycDocument = { id: Date.now(), document_type: docType, status: 'submitted', file: '', upload_date: new Date().toISOString() };
      setKycDocuments(prevDocs => [optimisticNewDocument, ...prevDocs]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "KYC submission failed.";
      throw new Error(errorMessage);
    }
  };

  const handleSaveBankDetail = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      if (bankDetails.id) {
        // Update existing bank details
        await apiClient.put(
          `/bank-details/${bankDetails.id}/`,
          {
            account_holder_name: bankDetails.accountHolder,
            account_number: bankDetails.accountNumber,
            ifsc: bankDetails.ifsc,
            bank_name: bankDetails.bankName,
            status: bankDetails.status,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        alert("Bank details updated successfully!");
      } else {
        // Create new bank details
        await apiClient.post(
          `/bank-details/`,
          {
            account_holder_name: bankDetails.accountHolder,
            account_number: bankDetails.accountNumber,
            ifsc: bankDetails.ifsc,
            bank_name: bankDetails.bankName,
            status: bankDetails.status,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        alert("Bank details created successfully!");
      }
    } catch (err) {
      alert("Failed to save bank details.");
    }
  };

  const latestDocument = kycDocuments.length > 0 ? kycDocuments[0] : null;
  const currentKycStatus = latestDocument?.status || "Not Verified";
  const shouldShowVerifyButton = kycDataLoaded && (currentKycStatus === "Not Verified" || currentKycStatus === "rejected");
  const userCode = generateUserCode(`${formik.values.firstName} ${formik.values.lastName}`, new Date());
  const animatedEarnings = useCountUp(12500, 1200);

  const getKycDisplay = () => {
    switch (currentKycStatus) {
      case "approved": return <span className="text-green-600 font-semibold flex items-center gap-1 animate-bounce text-xs"><IconCheck className="w-4 h-4" /> Verified</span>;
      case "pending": case "submitted": return <span className="text-yellow-600 font-semibold flex items-center gap-1 animate-pulse text-xs"><IconAlertCircle className="w-4 h-4" /> Pending</span>;
      case "rejected": return <span className="text-red-600 font-semibold flex items-center gap-1 text-xs"><IconAlertCircle className="w-4 h-4" /> Rejected</span>;
      default: return <span className="text-red-600 font-semibold flex items-center gap-1 animate-pulse text-xs"><IconAlertCircle className="w-4 h-4" /> Not Verified</span>;
    }
  };

  return (
    <>
      {showKycModal && <KycModal onClose={() => setShowKycModal(false)} onSubmit={handleKycSubmit} />}
      <div className="max-w-4xl mx-auto mt-8 p-0 flex gap-6">
        <div className={`flex-1 p-4 rounded-2xl shadow-xl bg-white real-profile-anim ${profileAnim ? "profile-anim-pop" : ""}`}>
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-primary agent-photo profile-pulse">
                {formik.values.photo ? <img src={formik.values.photo} alt="avatar" className="w-full h-full rounded-full object-cover" /> : ( (formik.values.firstName[0] || "U") + (formik.values.lastName[0] || "") )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white border border-primary rounded-full p-1 cursor-pointer hover:bg-primary hover:text-white transition" title="Upload Photo" style={{ boxShadow: "0 2px 8px #22c55e33" }}>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => formik.setFieldValue("photo", ev.target?.result as string); reader.readAsDataURL(file); } }}/>
                <IconEdit className="w-4 h-4" />
              </label>
            </div>
            <h2 className="mt-2 text-lg font-bold text-primary-light tracking-wide animate-fadein">Edit RealEstate Profile</h2>
            <div className="mt-1 text-xs text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded shadow-sm">User Code:{" "}<span className="text-primary font-semibold">{userCode}</span></div>
          </div>
          
          <form className="space-y-3 animate-slidein" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1">First Name</label><input name="firstName" className="border rounded px-2 py-1 w-full text-xs" value={formik.values.firstName} onChange={formik.handleChange} readOnly={!editMode}/></div>
              <div><label className="block text-xs text-gray-500 mb-1">Last Name</label><input name="lastName" className="border rounded px-2 py-1 w-full text-xs" value={formik.values.lastName} onChange={formik.handleChange} readOnly={!editMode}/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1">Gender</label><select name="gender" value={formik.values.gender} onChange={formik.handleChange} className="border rounded px-2 py-1 w-full text-xs"><option value="">Select Gender</option><option value="Female">Female</option><option value="Male">Male</option><option value="Other">Other</option></select></div>
              <div><label className="block text-xs text-gray-500 mb-1">Date of Birth</label><input type="date" name="dob" className="border rounded px-2 py-1 w-full text-xs" value={formik.values.dob} onChange={formik.handleChange} readOnly={!editMode}/></div>
            </div>
            <div><label className="block text-xs text-gray-500 mb-1">Company Name</label><input name="company" className="border rounded px-2 py-1 w-full text-xs" value={formik.values.company} onChange={formik.handleChange} readOnly={!editMode}/></div>
            <div><label className="block text-xs text-gray-500 mb-1">Email</label><input name="email" type="email" className="border rounded px-2 py-1 w-full text-xs bg-gray-100" value={formik.values.email} readOnly/></div>
            <div><label className="block text-xs text-gray-500 mb-1">Phone Number</label><div className="flex gap-2"><select name="countryCode" value={formik.values.countryCode} onChange={formik.handleChange} className="border rounded px-2 py-1 bg-white text-xs min-w-[3.5rem]"><option value="">Select</option>{countryCodes.map((c) => (<option key={c.code + c.label} value={c.code}>{c.flag} {c.code}</option>))}</select><input name="phone" className="border rounded px-2 py-1 w-full text-xs" value={formik.values.phone} onChange={formik.handleChange} maxLength={15} readOnly={!editMode}/></div></div>
            <div><label className="block text-xs text-gray-500 mb-1">Company Number</label><div className="flex gap-2"><select name="companyCountryCode" value={formik.values.companyCountryCode} onChange={formik.handleChange} className="border rounded px-2 py-1 bg-white text-xs min-w-[3.5rem]"><option value="">Select</option>{countryCodes.map((c) => (<option key={c.code + c.label} value={c.code}>{c.flag} {c.code}</option>))}</select><input name="companyNumber" className="border rounded px-2 py-1 w-full text-xs" value={formik.values.companyNumber} onChange={formik.handleChange} maxLength={15} readOnly={!editMode}/></div></div>
            <div><label className="block text-xs text-gray-500 mb-1">GST Number (Optional)</label><input name="gstNumber" className="border rounded px-2 py-1 w-full text-xs" value={formik.values.gstNumber} onChange={formik.handleChange} readOnly={!editMode}/></div>
            <div><label className="block text-xs text-gray-500 mb-1">Address</label><div className="grid grid-cols-2 gap-3"><input name="address.town" value={formik.values.address.town} onChange={formik.handleChange} placeholder="Town/Area" className="border rounded px-2 py-1 w-full text-xs" readOnly={!editMode}/><input name="address.city" value={formik.values.address.city} onChange={formik.handleChange} placeholder="City" className="border rounded px-2 py-1 w-full text-xs" readOnly={!editMode}/><input name="address.state" value={formik.values.address.state} onChange={formik.handleChange} placeholder="State" className="border rounded px-2 py-1 w-full text-xs" readOnly={!editMode}/><input name="address.country" value={formik.values.address.country} onChange={formik.handleChange} placeholder="Country" className="border rounded px-2 py-1 w-full text-xs" readOnly={!editMode}/></div></div>
            <div className="pt-2"><label className="text-sm text-gray-700 mb-1 font-semibold">KYC Status</label><div className="flex items-center gap-4 mt-1 p-3 bg-gray-50 border rounded-lg justify-between">{kycDataLoaded ? getKycDisplay() : <span className="text-xs text-gray-500 animate-pulse">Loading...</span>}{shouldShowVerifyButton && (<button type="button" className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary-dark transition animate-kyc-btn" onClick={() => setShowKycModal(true)}>{currentKycStatus === "rejected" ? "Re-submit" : "Verify Now"}</button>)}</div></div>
            <div className="flex gap-2 mt-4">{editMode ? (<><button type="submit" className="bg-primary text-white px-4 py-1 rounded-md text-xs">Save Changes</button><button type="button" className="bg-red-500 text-white px-4 py-1 rounded-md text-xs" onClick={() => { setEditMode(false); formik.resetForm(); }}>Cancel</button></>) : (<button type="button" className="bg-primary text-white px-4 py-1 rounded-md text-xs" onClick={() => setEditMode(true)}>Edit Profile</button>)}</div>
          </form>
        </div>
        <div className="w-[18rem] flex-shrink-0 flex flex-col gap-4">
          <div className="w-[18rem] flex-shrink-0 flex flex-col gap-4">
          {/* --- Bank Details Module Card --- */}
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-4">
            <h3 className="text-base font-bold text-primary-light mb-2 animate-fadein">
              Bank Details Module
            </h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Account Holder Name
                </label>
                <input
                className="border rounded px-2 py-1 w-full text-xs focus:border-primary transition"
                value={bankDetails.accountHolder}
                onChange={e => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                readOnly={!editMode}
              />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Account Number
                </label>
                <input
                  className="border rounded px-2 py-1 w-full text-xs focus:border-primary transition"
                  value={bankDetails.accountNumber}
                  onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  readOnly={!editMode}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">IFSC</label>
                <input
                  className="border rounded px-2 py-1 w-full text-xs focus:border-primary transition"
                  value={bankDetails.ifsc}
                  onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                  readOnly={!editMode}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Bank Name
                </label>
                <input
                  className="border rounded px-2 py-1 w-full text-xs focus:border-primary transition"
                  value={bankDetails.bankName}
                  onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  readOnly={!editMode}
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">Status:</span>
                <span
                  className={`font-semibold flex items-center gap-1 text-xs ${
                    bankDetails.status === "Verified"
                      ? "text-green-600"
                      : bankDetails.status === "Pending"
                      ? "text-yellow-600 animate-pulse"
                      : "text-red-600"
                  }`}
                  title={bankDetails.status}
                >
                  {bankDetails.status}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  className="bg-primary text-white px-4 py-1 rounded text-xs font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
                  onClick={handleSaveBankDetail}
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
            <h3 className="text-base font-bold text-primary-light mb-2 animate-fadein">
              Referral & Commission System
            </h3>
            <div className="space-y-1 text-gray-700 text-xs">
              <div>• Agents get a unique referral code.</div>
              <div>• Multi-layer Referral Structure (Max 3 levels):</div>
              <ul className="ml-3 list-disc">
                <li>
                  <span className="font-semibold text-green-700">Level 1:</span>{" "}
                  <span className="font-bold text-green-700">1.5%</span>
                </li>
                <li>
                  <span className="font-semibold text-green-700">Level 2:</span>{" "}
                  <span className="font-bold text-green-700">0.25%</span>
                </li>
                <li>
                  <span className="font-semibold text-green-700">Level 3:</span>{" "}
                  <span className="font-bold text-green-500">0.25%</span>
                </li>
                <li>
                  <span className="font-semibold text-gray-500">
                    No commission beyond level 3.
                  </span>
                </li>
              </ul>
            </div>
            <button
              className="mt-4 px-4 py-1 bg-primary text-white rounded-lg font-semibold shadow hover:bg-green-700 transition text-xs"
              onClick={() => navigate("/referrealestate")} // Replace with your actual route "referrealestate"}
            >
              Go to Referral Page
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default RealProfile;