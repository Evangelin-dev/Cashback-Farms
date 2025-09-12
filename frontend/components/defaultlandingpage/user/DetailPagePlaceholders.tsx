import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/common/Button';
import apiClient from '../../../src/utils/api/apiClient';
import { Material, Professional } from '../../../types';
import { useAuth } from '../../contexts/AuthContext'; // 1. IMPORT a custom hook

// --- Layout Component (Unchanged) ---
const DDetailPageLayout: React.FC<{title: string; children: React.ReactNode; backLink: string; backLinkText: string}> = ({ title, children, backLink, backLinkText }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
            <Link to={backLink} className="text-green-600 hover:text-green-800 hover:underline">
                ← {backLinkText}
            </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {children}
        </div>
    </div>
);

// --- Login Popup Component ---
const AuthPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center">
            <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" /></svg>
            <div className="text-xl font-bold text-green-700 mb-2 text-center">Authentication Required</div>
            <div className="text-gray-600 text-center mb-6">Please login or sign up to continue.</div>
            <button className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition" onClick={onClose}>
            Close
            </button>
        </div>
    </div>
);


// --- Plot Detail Page (Unchanged) ---
export const DPlotDetailPage: React.FC = () => {
    // ... existing DPlotDetailPage code ...
    return (
        <DDetailPageLayout title="Mock Plot" backLink="/Dplots" backLinkText="Back to Plot Marketplace" children={undefined}>
           
        </DDetailPageLayout>
    );
};

// --- Material Detail Page (with Auth Check) ---
export const DMaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    if (!id) { setIsLoading(false); setError("No material ID found in URL."); return; }
    
    const fetchMaterial = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/public/materials/${id}/`);
            const apiMaterial = response;
            const mappedMaterial: Material = {
              id: apiMaterial?.id,
              name: apiMaterial.name,
              description: apiMaterial.description || 'No description available.',
              price: Number(apiMaterial.price),
              vendor: apiMaterial.vendor_username,
              category: apiMaterial.category,
              stockQuantity: apiMaterial.stock_quantity,
              imageUrl: apiMaterial.image_url || `https://picsum.photos/seed/${apiMaterial.name}/600/400`,
              moq: 0,
              shippingTime: ''
            };
            setMaterial(mappedMaterial);
        } catch (err) {
            setError("The material you are looking for does not exist or could not be loaded.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchMaterial();
  }, [id]);

  const handleRequestCall = () => {
      if (!currentUser) {
          setShowLoginPopup(true);
      } else {
          navigate(`/Dcart`, { 
              state: {
                  requestType: 'material',
                  itemId: material?.id,
                  itemName: material?.name,
                  vendor: material?.vendor,
              }
          });
      }
  };
console.log('test',material?.id , material?.vendor,material?.name);
  if (isLoading) return <DDetailPageLayout title="Loading..." backLink="/Dmaterials" backLinkText="Back to Materials Store"><FaSpinner className="animate-spin" /></DDetailPageLayout>;
  if (error || !material) return <DDetailPageLayout title="Error" backLink="/Dmaterials" backLinkText="Back to Materials Store"><p>{error}</p></DDetailPageLayout>;

  return (
    <>
        <DDetailPageLayout title={material.name} backLink="/Dmaterials" backLinkText="Back to Materials Store">
            <img src={material.imageUrl} alt={material.name} className="w-full h-64 object-contain rounded-md mb-6 bg-gray-100 p-4" />
            <p className="text-gray-700 mb-2 capitalize"><span className="font-semibold">Category:</span> {material.category}</p>
            <p className="text-gray-700 mb-2"><span className="font-semibold">Price:</span> ₹{material.price.toLocaleString('en-IN')}</p>
            <p className="text-gray-700 mb-2"><span className="font-semibold">Available Stock:</span> {material.stockQuantity} units</p>
            <p className="text-gray-700 mb-4"><span className="font-semibold">Vendor:</span> {material.vendor}</p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line mb-4">{material.description}</p>
            <div className="mt-6">
                <Button variant="primary" onClick={handleRequestCall}>
                    Request a Call for Order
                </Button>
            </div>
        </DDetailPageLayout>
        {showLoginPopup && <AuthPopup onClose={() => setShowLoginPopup(false)} />}
    </>
  );
};

// --- Professional Detail Page (with Auth Check) ---
export const DProfessionalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    if (!id) { setIsLoading(false); setError("No service ID found in URL."); return; }

    const fetchProfessional = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/public/services/${id}/`);
            const apiService = response; // Correctly access response.data

            const mappedProfessional: Professional = {
                id: apiService.id,
                name: apiService.vendor_username,
                service: apiService.name,
                specialization: 'Service Provider',
                bio: apiService.description,
                rate: `₹${Number(apiService.price).toLocaleString('en-IN')}`,
                rating: 4.5,
                imageUrl: `https://picsum.photos/seed/${apiService.vendor_username}/400`,
                portfolioImages: [],
            };
            setProfessional(mappedProfessional);
        } catch (err) {
            setError("This service could not be found or there was an error loading it.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchProfessional();
  }, [id]);

  const handleBookingAction = () => {
      if (!currentUser) {
          setShowLoginPopup(true);
      } else {
          navigate('/bookconsultation');
      }
  };
  
  if (isLoading) return <DDetailPageLayout title="Loading..." backLink="/Dservices" backLinkText="Back to Services Hub"><FaSpinner className="animate-spin" /></DDetailPageLayout>;
  if (error || !professional) return <DDetailPageLayout title="Error" backLink="/Dservices" backLinkText="Back to Services Hub"><p>{error}</p></DDetailPageLayout>;

  return (
    <>
        <DDetailPageLayout title={professional.service} backLink="/Dservices" backLinkText="Back to Services Hub">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <img src={professional.imageUrl} alt={professional.name} className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-green-200 mb-4 md:mb-0" />
                <div className="flex-grow">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">{professional.service}</span>
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">{professional.specialization}</span>
                    </div>
                    <p className="text-lg font-bold text-green-700 mb-1">Provided by: {professional.name}</p>
                    <p className="text-gray-700 mb-1"><span className="font-semibold">Starting Price:</span> {professional.rate}</p>
                    <p className="text-yellow-600 mb-2"><span className="font-semibold">Rating:</span> {professional.rating}/5.0 (Default)</p>
                    <div className="flex gap-4 mt-4">
                        <Button variant="primary" className="shadow-lg" onClick={handleBookingAction}>
                            Book Consultation
                        </Button>
                        <Button variant="outline" className="shadow-lg" onClick={handleBookingAction}>
                            Request Callback
                        </Button>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mt-8 mb-2">Service Description</h3>
            <p className="text-gray-600 whitespace-pre-line mb-4">{professional.bio}</p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Portfolio</h3>
            <p className="text-gray-500">Portfolio images for this service are not available yet.</p>
        </DDetailPageLayout>
        {showLoginPopup && <AuthPopup onClose={() => setShowLoginPopup(false)} />}
    </>
  );
};