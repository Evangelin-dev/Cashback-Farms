import React, { useState, useEffect } from "react";
import { IconAlertCircle, IconCheck } from "../../../constants.tsx";
import "../../realestate/AgentProfileSection.css";
import apiClient from "../../../src/utils/api/apiClient";
import { useAuth } from "../../../contexts/AuthContext";
import { message } from 'antd';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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
    { value: 'address_proof', label: 'Address Proof' },
];

const mockRecentListings = [
    { id: "p1", name: "UltraTech Cement PPC", date: "2024-06-01" },
    { id: "p2", name: "Red Clay Bricks", date: "2024-05-28" },
];

const B2BProfile: React.FC = () => {
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        company_name: "",
        mobile_number: "",
        gst_number: "",
        town: "",
        city: "",
        state: "",
        country: "",
    });

    const [kycDocuments, setKycDocuments] = useState<IKycDocument[]>([]);
    const [isKycLoading, setIsKycLoading] = useState(true);
    const [isKycSubmitting, setIsKycSubmitting] = useState(false);
    const [kycDocumentType, setKycDocumentType] = useState(DOCUMENT_TYPES[0].value);
    const [kycFile, setKycFile] = useState<File | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setIsKycLoading(true);
            try {
                const [profileResponse, kycStatusResponse] = await Promise.all([
                    apiClient.get('/b2b/profile/'),
                    apiClient.get('/user/kyc/status/')
                ]);
                if (profileResponse) setProfile(profileResponse);
                
                if (kycStatusResponse?.documents && Array.isArray(kycStatusResponse.documents)) {
                    const sortedDocs = [...kycStatusResponse.documents].sort((a, b) => 
                        new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
                    );
                    setKycDocuments(sortedDocs);
                }

            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                message.error("Could not load profile data.");
            } finally {
                setIsLoading(false);
                setIsKycLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const hasPendingDocuments = kycDocuments.some(doc => doc.status === 'submitted' || doc.status === 'pending');
        if (!hasPendingDocuments) return;
        const intervalId = setInterval(async () => {
            try {
                const kycStatusResponse = await apiClient.get('/user/kyc/status/');
                
                if (kycStatusResponse?.documents && Array.isArray(kycStatusResponse.documents)) {
                    const sortedDocs = [...kycStatusResponse.documents].sort((a, b) => 
                        new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
                    );
                    setKycDocuments(sortedDocs);
                }

            } catch (error) { console.error("Polling KYC status failed:", error); }
        }, 30000);
        return () => clearInterval(intervalId);
    }, [kycDocuments]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePhoneChange = (value: string | undefined) => {
        setProfile(prev => ({ ...prev, mobile_number: value || '' }));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        message.loading({ content: 'Saving profile...', key: 'save_profile' });
        try {
            await apiClient.put('/b2b/profile/', profile);
            message.success({ content: 'Profile saved successfully!', key: 'save_profile', duration: 2 });
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 2500);
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || "An error occurred.";
            message.error({ content: `Save failed: ${errorMsg}`, key: 'save_profile', duration: 3 });
        } finally {
            setIsSaving(false);
        }
    };

    const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { setKycFile(e.target.files?.[0] || null); };
    
    const handleKycSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!kycFile) { message.error("Please select a document file to upload."); return; }
        setIsKycSubmitting(true);
        message.loading({ content: 'Submitting KYC document...', key: 'kyc_submit' });
        
        const formData = new FormData();
        formData.append('document_type', kycDocumentType);
        formData.append('file', kycFile);
        
        try {
            await apiClient.post('/user/kyc/submit/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            message.success({ content: 'KYC document submitted! Verification is in progress.', key: 'kyc_submit', duration: 4 });
            
            const optimisticNewDocument: IKycDocument = {
              id: Date.now(),
              document_type: kycDocumentType,
              status: 'submitted',
              file: '',
              upload_date: new Date().toISOString(),
            };
            
            setKycDocuments(prevDocs => [optimisticNewDocument, ...prevDocs]);
            
            setKycFile(null);
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || "An error occurred.";
            message.error({ content: `Submission failed: ${errorMsg}`, key: 'kyc_submit', duration: 3 });
        } finally {
            setIsKycSubmitting(false);
        }
    };

    const renderKycSection = () => {
        if (isKycLoading) return <div className="text-sm text-gray-500">Loading KYC status...</div>;
        
        const latestDocument = kycDocuments.length > 0 ? kycDocuments[0] : null;

        if (latestDocument) {
            switch (latestDocument.status) {
                case 'approved': return (<div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"><IconCheck className="w-6 h-6 text-green-600" /><div><p className="font-semibold text-green-700">KYC Verified</p><p className="text-xs text-green-600">Your account is fully verified.</p></div></div>);
                case 'submitted': case 'pending': return (<div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"><svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg><div><p className="font-semibold text-blue-700">Verification in Progress</p><p className="text-xs text-blue-600">We are reviewing your documents.</p></div></div>);
            }
        }

        return (
            <form onSubmit={handleKycSubmit} className="p-4 border border-gray-300 rounded-lg space-y-3 bg-gray-50">
                {latestDocument?.status === 'rejected' && (<div className="flex items-center gap-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm"><IconAlertCircle className="w-5 h-5" /><span>Previous submission rejected. Please re-upload.</span></div>)}
                <h3 className="font-semibold text-gray-800">Complete Your KYC</h3>
                <div><label className="block text-xs text-gray-600 mb-1">Document Type</label><select value={kycDocumentType} onChange={(e) => setKycDocumentType(e.target.value)} className="border rounded px-3 py-2 w-full text-base bg-white focus:border-primary transition">{DOCUMENT_TYPES.map(doc => <option key={doc.value} value={doc.value}>{doc.label}</option>)}</select></div>
                <div><label className="block text-xs text-gray-600 mb-1">Upload Document</label><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleKycFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" required /></div>
                <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded text-sm font-semibold shadow hover:bg-primary-dark transition disabled:bg-gray-400" disabled={isKycSubmitting || !kycFile}>{isKycSubmitting ? 'Submitting...' : 'Submit for Verification'}</button>
            </form>
        );
    };
    
    if (isLoading) return <div className="text-center py-20 text-lg font-semibold text-gray-600">Loading Profile...</div>;

    return (
        <>
            <div className="max-w-4xl mx-auto mt-8 p-0 flex flex-col md:flex-row gap-8">
                <div className="flex-1 p-6 rounded-2xl shadow-xl bg-white">
                    <div className="flex flex-col items-center mb-6"><h2 className="mt-4 text-2xl font-bold text-primary-light tracking-wide">Edit B2B Profile</h2></div>
                    <form className="space-y-5" onSubmit={handleSaveProfile}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label className="block text-xs text-gray-500 mb-1">First Name</label><input name="first_name" className="border rounded px-3 py-2 w-full" value={profile.first_name || ''} onChange={handleProfileChange} required /></div>
                            <div><label className="block text-xs text-gray-500 mb-1">Last Name</label><input name="last_name" className="border rounded px-3 py-2 w-full" value={profile.last_name || ''} onChange={handleProfileChange} required /></div>
                        </div>
                        <div><label className="block text-xs text-gray-500 mb-1">Email</label><input className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed" value={currentUser?.email || ''} readOnly disabled /></div>
                        <div><label className="block text-xs text-gray-500 mb-1">Company / Seller Name</label><input name="company_name" className="border rounded px-3 py-2 w-full" value={profile.company_name || ''} onChange={handleProfileChange} required /></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="w-full">
                                <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                                <PhoneInput placeholder="Enter phone number" value={profile.mobile_number || ''} onChange={handlePhoneChange} defaultCountry="IN" className="phone-input-container" required />
                            </div>
                            <div><label className="block text-xs text-gray-500 mb-1">GST Number (Optional)</label><input name="gst_number" className="border rounded px-3 py-2 w-full" value={profile.gst_number || ''} onChange={handleProfileChange} /></div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Address</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input name="town" className="border rounded px-3 py-2 w-full" value={profile.town || ''} onChange={handleProfileChange} placeholder="Town/Area" required />
                                <input name="city" className="border rounded px-3 py-2 w-full" value={profile.city || ''} onChange={handleProfileChange} placeholder="City" required />
                                <input name="state" className="border rounded px-3 py-2 w-full" value={profile.state || ''} onChange={handleProfileChange} placeholder="State" required />
                                <input name="country" className="border rounded px-3 py-2 w-full" value={profile.country || ''} onChange={handleProfileChange} placeholder="Country" required />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6"><button type="submit" className="bg-primary text-white px-6 py-2 rounded font-semibold shadow-lg hover:scale-105 transition disabled:bg-gray-400" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Profile'}</button></div>
                    </form>
                </div>
                <div className="w-full md:w-[28rem] flex-shrink-0 space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">{renderKycSection()}</div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-lg font-bold text-primary-light mb-3">Recent Product Listings</h3>
                        <ul className="space-y-2">
                            {mockRecentListings.map(listing => (
                                <li key={listing.id} className="flex items-center justify-between px-4 py-2 bg-neutral-50 rounded-lg shadow-sm hover:bg-primary/10 transition">
                                    <span className="font-medium text-gray-700">{listing.name}</span><span className="text-xs text-gray-500">{listing.date}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {showPopup && ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"><div className="relative bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center animate-adminpop"><div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg animate-bounce-slow"><svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div><div className="text-2xl font-bold text-primary mb-2 text-center">Profile Saved!</div><div className="text-base text-gray-700 mb-4 text-center">Your profile changes have been saved.</div></div><style>{`@keyframes adminpop { 0% { transform: scale(0.8) rotate(-5deg); opacity: 0; } 60% { transform: scale(1.05) rotate(2deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } } .animate-adminpop { animation: adminpop 0.6s cubic-bezier(.68,-0.55,.27,1.55); } @keyframes bounce-slow { 0%, 100% { transform: translateY(0);} 50% { transform: translateY(-10px);} } .animate-bounce-slow { animation: bounce-slow 1.5s infinite; }`}</style></div> )}
            </div>
            <style>{`
                .phone-input-container .PhoneInputInput {
                  border: 1px solid #d1d5db;
                  border-radius: 0.375rem;
                  padding-left: 0.75rem;
                  padding-right: 0.75rem;
                  height: 42px;
                  width: 100%;
                  transition: border-color 0.2s;
                }
                .phone-input-container .PhoneInputInput:focus {
                  border-color: #2563eb;
                  outline: none;
                  box-shadow: 0 0 0 1px #2563eb;
                }
            `}</style>
        </>
    );
};

export default B2BProfile;