import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import apiClient from '@/src/utils/api/apiClient'; // <-- Make sure this path is correct

// MOCK_MATERIALS is no longer needed, but we keep the others for the other components in this file
import { MOCK_PLOTS, MOCK_PROFESSIONALS } from '../../constants';

// --- TYPE DEFINITION for the API data ---
type Material = {
  id: number;
  vendor_username: string;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  category: string;
};


// --- This Layout component remains the same ---
const DetailPageLayout: React.FC<{title: string; children: React.ReactNode; backLink: string; backLinkText: string}> = ({ title, children, backLink, backLinkText }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
            <Link to={backLink} className="text-green-600 hover:text-green-800 hover:underline">
                ← {backLinkText}
            </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100">
            {children}
        </div>
    </div>
);

// --- PlotDetailPage remains the same ---
export const PlotDetailPage: React.FC = () => {
    // ... no changes here
    const { id } = useParams<{ id: string }>();
    const plot = MOCK_PLOTS.find(p => p.id === id);

    if (!plot) {
        return <DetailPageLayout title="Plot Not Found" backLink="/plots" backLinkText="Back to Plot Marketplace"><p>The plot you are looking for does not exist or has been removed.</p></DetailPageLayout>;
    }

    return (
        <DetailPageLayout title={plot.title} backLink="/plots" backLinkText="Back to Plot Marketplace">
            <img src={plot.imageUrl} alt={plot.title} className="w-full h-64 object-cover rounded-md mb-6" />
            <p className="text-gray-700 mb-2"><span className="font-semibold">Location:</span> {plot.location}</p>
            <p className="text-gray-700 mb-2"><span className="font-semibold">Price:</span> ₹{plot.price > 0 ? plot.price.toLocaleString('en-IN') : 'N/A (Book My SqFt)'}</p>
            <p className="text-gray-700 mb-2"><span className="font-semibold">Area:</span> {plot.area.toLocaleString('en-IN')} sqft</p>
            {plot.sqftPrice && <p className="text-gray-700 mb-2"><span className="font-semibold">Price per SqFt (for BMS):</span> ₹{plot.sqftPrice.toLocaleString('en-IN')}</p>}
            <p className="text-gray-700 mb-2"><span className="font-semibold">Type:</span> {plot.type} {plot.isFlagship && '(Flagship Plot)'}</p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line mb-4">{plot.description}</p>
            {plot.amenities && plot.amenities.length > 0 && (
                <>
                    <h3 className="text-xl font-semibold mt-4 mb-2">Amenities</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        {plot.amenities.map(amenity => <li key={amenity}>{amenity}</li>)}
                    </ul>
                </>
            )}
            <div className="mt-6">
                <Button variant="primary">Contact Owner/Agent (Mock)</Button>
                {plot.sqftPrice && (
                    <Link to={`/book-my-sqft/${plot.id.includes('bms') ? 'bms-plot-alpha' : plot.id}`}>
                        <Button variant="secondary" className="ml-4">Book My SqFt</Button>
                    </Link>
                )}
            </div>
        </DetailPageLayout>
    );
};

// --- THIS IS THE FULLY UPDATED COMPONENT ---
export const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
        setIsLoading(false);
        setError("Material ID is missing.");
        return;
    }

    const fetchMaterialDetails = async () => {
        setIsLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                throw new Error("You must be logged in to view this page.");
            }

            const response = await apiClient.get<Material>(`/materials/${id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            
            setMaterial(response);
            setError(null);
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                setError("The material you are looking for could not be found.");
            } else {
                setError(err.message || "An error occurred while fetching material details.");
            }
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    fetchMaterialDetails();
  }, [id]);

  if (isLoading) {
    return (
        <DetailPageLayout title="Loading Details..." backLink="/materials" backLinkText="Back to Materials Store">
            <div className="text-center py-10">Loading...</div>
        </DetailPageLayout>
    );
  }

  if (error || !material) {
    return (
        <DetailPageLayout title="Error" backLink="/materials" backLinkText="Back to Materials Store">
            <p className="text-red-500">{error}</p>
        </DetailPageLayout>
    );
  }

  // Once data is loaded successfully, render the details
  return (
    <DetailPageLayout title={material.name} backLink="/materials" backLinkText="Back to Materials Store">
        <div className="mb-6 bg-gray-100 rounded-lg p-6 flex justify-center items-center h-64">
            {/* Your API does not provide an image, so we show a placeholder. */}
            <span className="text-gray-500">Image Not Available</span>
        </div>
        
        <div className="space-y-3">
            <p className="text-gray-700 text-lg"><span className="font-semibold text-gray-800">Category:</span> <span className="capitalize">{material.category}</span></p>
            <p className="text-gray-700 text-lg"><span className="font-semibold text-gray-800">Vendor:</span> {material.vendor_username}</p>
            <p className="text-2xl font-bold text-green-700 mt-2">₹{parseFloat(material.price).toLocaleString('en-IN')}</p>
            <p className="text-gray-600"><span className="font-semibold text-gray-800">Stock Availability:</span> {material.stock_quantity > 0 ? `${material.stock_quantity.toLocaleString('en-IN')} units available` : 'Out of Stock'}</p>
        </div>

        <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line mb-4">{material.description}</p>
        </div>

        <div className="mt-6 flex gap-4">
            <Button
              variant="primary"
              onClick={() => navigate(`/cart`)} // Mock navigation to cart
              disabled={material.stock_quantity === 0} // Disable button if out of stock
            >
              Request a Call to Order
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/bookconsultation')} // Mock navigation
            >
              Ask an Expert
            </Button>
        </div>
    </DetailPageLayout>
  );
};


// --- ProfessionalDetailPage remains the same ---
export const ProfessionalDetailPage: React.FC = () => {
    // ... no changes here
    const { id } = useParams<{ id: string }>();
    const professional = MOCK_PROFESSIONALS.find(p => p.id === id);
    const navigate = useNavigate();

    if (!professional) {
        return <DetailPageLayout title="Professional Not Found" backLink="/services" backLinkText="Back to Services Hub"><p>The professional you are looking for does not exist.</p></DetailPageLayout>;
    }
    return (
        <DetailPageLayout title={professional.name} backLink="/services" backLinkText="Back to Services Hub">
        <div className="flex flex-col md:flex-row gap-8 items-center">
            <img
            src={professional.imageUrl}
            alt={professional.name}
            className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-green-200 mb-4 md:mb-0"
            />
            <div className="flex-grow">
            <div className="mb-2 flex items-center gap-2">
                <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">{professional.service}</span>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">{professional.specialization}</span>
            </div>
            <p className="text-lg font-bold text-green-700 mb-1">{professional.name}</p>
            <p className="text-gray-700 mb-1"><span className="font-semibold">Rate:</span> {professional.rate}</p>
            <p className="text-yellow-600 mb-2"><span className="font-semibold">Rating:</span> {professional.rating}/5.0</p>
            <div className="flex gap-4 mt-4">
                <Button
                variant="primary"
                className="shadow-lg"
                onClick={() => navigate('/logbookconsultation')}
                >
                Book Consultation
                </Button>
                <Button
                variant="outline"
                className="shadow-lg"
                onClick={() => navigate('/logbookconsultation')}
                >
                Request Callback
                </Button>
            </div>
            </div>
        </div>
        <h3 className="text-xl font-semibold mt-8 mb-2">Biography</h3>
        <p className="text-gray-600 whitespace-pre-line mb-4">{professional.bio}</p>
        {professional.portfolioImages && professional.portfolioImages.length > 0 && (
            <>
            <h3 className="text-xl font-semibold mt-6 mb-2">Portfolio</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {professional.portfolioImages.map((img, idx) => (
                <img key={idx} src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-32 object-cover rounded-md shadow" />
                ))}
            </div>
            </>
        )}
        {!professional.portfolioImages && <p className="text-gray-500">Portfolio images coming soon.</p>}
        </DetailPageLayout>
    );
};