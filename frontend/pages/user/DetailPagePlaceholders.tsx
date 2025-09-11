import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import apiClient from '@/src/utils/api/apiClient';
import { MOCK_PLOTS, MOCK_PROFESSIONALS } from '../../constants';
import { FaSpinner, FaArrowLeft, FaMapMarkerAlt, FaRulerCombined, FaTag, FaStar, FaUser, FaClock, FaPhone, FaShoppingCart, FaComments } from 'react-icons/fa';

// TYPE DEFINITION for the API data
type Material = {
  id: number;
  vendor_username: string;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  category: string;
};

// Enhanced Layout component with modern design
const DetailPageLayout: React.FC<{title: string; children: React.ReactNode; backLink: string; backLinkText: string}> = ({ title, children, backLink, backLinkText }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Enhanced Back Navigation */}
            <div className="mb-8">
                <Link 
                    to={backLink} 
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors duration-200 group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-medium">{backLinkText}</span>
                </Link>
            </div>
            
            {/* Enhanced Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent mb-2">
                    {title}
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
            </div>
            
            {/* Enhanced Content Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-8 lg:p-12">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

// Enhanced PlotDetailPage with better visual hierarchy
export const PlotDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const plot = MOCK_PLOTS.find(p => p.id === id);

    if (!plot) {
        return (
            <DetailPageLayout title="Plot Not Found" backLink="/plots" backLinkText="Back to Plot Marketplace">
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🏗️</div>
                    <p className="text-gray-600 text-lg">The plot you are looking for does not exist or has been removed.</p>
                </div>
            </DetailPageLayout>
        );
    }

    return (
        <DetailPageLayout title={plot.title} backLink="/plots" backLinkText="Back to Plot Marketplace">
            {/* Hero Image Section */}
            <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
                <img 
                    src={plot.imageUrl} 
                    alt={plot.title} 
                    className="w-full h-80 object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                {plot.isFlagship && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                        ⭐ Flagship Plot
                    </div>
                )}
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                        <FaMapMarkerAlt className="text-blue-600 text-lg" />
                        <span className="font-semibold text-gray-800">Location</span>
                    </div>
                    <p className="text-gray-700 font-medium">{plot.location}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                        <FaTag className="text-green-600 text-lg" />
                        <span className="font-semibold text-gray-800">Price</span>
                    </div>
                    <p className="text-gray-700 font-bold text-lg">
                        ₹{plot.price > 0 ? plot.price.toLocaleString('en-IN') : 'N/A (Book My SqFt)'}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                        <FaRulerCombined className="text-purple-600 text-lg" />
                        <span className="font-semibold text-gray-800">Area</span>
                    </div>
                    <p className="text-gray-700 font-medium">{plot.area.toLocaleString('en-IN')} sqft</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-3 mb-2">
                        <FaTag className="text-orange-600 text-lg" />
                        <span className="font-semibold text-gray-800">Type</span>
                    </div>
                    <p className="text-gray-700 font-medium">{plot.type}</p>
                </div>
            </div>

            {plot.sqftPrice && (
                <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Price per SqFt (for BMS)</h3>
                    <p className="text-2xl font-bold text-indigo-700">₹{plot.sqftPrice.toLocaleString('en-IN')}</p>
                </div>
            )}

            {/* Description Section */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    📄 Description
                </h3>
                <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{plot.description}</p>
                </div>
            </div>

            {/* Amenities Section */}
            {plot.amenities && plot.amenities.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        ⭐ Amenities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {plot.amenities.map((amenity, index) => (
                            <div key={amenity} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700">{amenity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200">
                <Button variant="primary" className="flex-1 min-w-fit shadow-lg hover:shadow-xl transition-shadow">
                    <FaPhone className="mr-2" />
                    Contact Owner/Agent
                </Button>
                {plot.sqftPrice && (
                    <Link to={`/book-my-sqft/${plot.id.includes('bms') ? 'bms-plot-alpha' : plot.id}`} className="flex-1 min-w-fit">
                        <Button variant="secondary" className="w-full shadow-lg hover:shadow-xl transition-shadow">
                            🎯 Book My SqFt
                        </Button>
                    </Link>
                )}
            </div>
        </DetailPageLayout>
    );
};

// Enhanced MaterialDetailPage with improved loading and error states
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
      <DetailPageLayout 
        title="Loading Material..." 
        backLink="/Dmaterials" 
        backLinkText="Back to Materials Store"
      >
          <div className="flex flex-col justify-center items-center py-20">
              <FaSpinner className="animate-spin text-green-600 text-6xl mb-4" />
              <p className="text-gray-600 text-lg">Fetching material details...</p>
          </div>
      </DetailPageLayout>
    );
  }

  if (error || !material) {
    return (
      <DetailPageLayout 
        title="Material Not Found" 
        backLink="/Dmaterials" 
        backLinkText="Back to Materials Store"
      >
          <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg mb-4">{error}</p>
              <Button variant="primary" onClick={() => navigate('/Dmaterials')}>
                  Browse Materials
              </Button>
          </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout 
      title={material.name} 
      backLink="/Dmaterials" 
      backLinkText="Back to Materials Store"
    >
        {/* Material Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Image Placeholder */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 flex flex-col justify-center items-center h-80 border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">📦</div>
                <span className="text-gray-500 font-medium">Product Image Coming Soon</span>
            </div>

            {/* Material Info */}
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-3xl font-bold text-green-700 mb-2">
                        ₹{parseFloat(material.price).toLocaleString('en-IN')}
                    </h3>
                    <p className="text-green-600 font-medium">Competitive Market Price</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <FaTag className="text-blue-600 text-xl" />
                        <div>
                            <span className="font-semibold text-gray-800">Category:</span>
                            <p className="text-gray-700 capitalize font-medium">{material.category}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <FaUser className="text-purple-600 text-xl" />
                        <div>
                            <span className="font-semibold text-gray-800">Vendor:</span>
                            <p className="text-gray-700 font-medium">{material.vendor_username}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <FaShoppingCart className="text-orange-600 text-xl" />
                        <div>
                            <span className="font-semibold text-gray-800">Stock Availability:</span>
                            <p className={`font-medium ${material.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {material.stock_quantity > 0 ? 
                                    `${material.stock_quantity.toLocaleString('en-IN')} units available` : 
                                    'Out of Stock'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Description Section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                📝 Product Description
            </h3>
            <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{material.description}</p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
            <Button
                variant="primary"
                onClick={() => navigate(`/cart`)}
                disabled={material.stock_quantity === 0}
                className="flex-1 min-w-fit shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FaPhone className="mr-2" />
                Request a Call to Order
            </Button>
            <Button
                variant="outline"
                onClick={() => navigate('/bookconsultation')}
                className="flex-1 min-w-fit shadow-lg hover:shadow-xl transition-all duration-200"
            >
                <FaComments className="mr-2" />
                Ask an Expert
            </Button>
        </div>
    </DetailPageLayout>
  );
};

// Enhanced ProfessionalDetailPage with improved profile design
export const ProfessionalDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const professional = MOCK_PROFESSIONALS.find(p => p.id === id);
    const navigate = useNavigate();

    if (!professional) {
        return (
            <DetailPageLayout title="Professional Not Found" backLink="/services" backLinkText="Back to Services Hub">
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">👨‍💼</div>
                    <p className="text-gray-600 text-lg">The professional you are looking for does not exist.</p>
                </div>
            </DetailPageLayout>
        );
    }

    return (
        <DetailPageLayout title={professional.name} backLink="/services" backLinkText="Back to Services Hub">
            {/* Professional Hero Section */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                    {/* Profile Image */}
                    <div className="relative">
                        <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src={professional.imageUrl}
                                alt={professional.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Rating Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center gap-1">
                            <FaStar className="text-xs" />
                            {professional.rating}/5.0
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">{professional.name}</h2>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-semibold text-sm border border-green-300">
                                {professional.service}
                            </span>
                            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-semibold text-sm border border-blue-300">
                                {professional.specialization}
                            </span>
                        </div>

                        {/* Rate Display */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 inline-block">
                            <div className="flex items-center gap-3">
                                <FaClock className="text-indigo-600" />
                                <span className="font-semibold text-gray-800">Rate:</span>
                                <span className="text-xl font-bold text-indigo-700">{professional.rate}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <Button
                                variant="primary"
                                className="shadow-xl hover:shadow-2xl transition-all duration-200"
                                onClick={() => navigate('/logbookconsultation')}
                            >
                                📅 Book Consultation
                            </Button>
                            <Button
                                variant="outline"
                                className="shadow-xl hover:shadow-2xl transition-all duration-200"
                                onClick={() => navigate('/logbookconsultation')}
                            >
                                📞 Request Callback
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Biography Section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    📖 Professional Biography
                </h3>
                <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{professional.bio}</p>
                </div>
            </div>

            {/* Portfolio Section */}
            {professional.portfolioImages && professional.portfolioImages.length > 0 ? (
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        🎨 Portfolio Gallery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {professional.portfolioImages.map((img, idx) => (
                            <div key={idx} className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <img 
                                    src={img} 
                                    alt={`Portfolio ${idx + 1}`} 
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-4 left-4 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Project {idx + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-4xl mb-4">🎨</div>
                    <p className="text-gray-500 font-medium">Portfolio images coming soon.</p>
                </div>
            )}
        </DetailPageLayout>
    );
};