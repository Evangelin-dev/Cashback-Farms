import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import apiClient from '../../../src/utils/api/apiClient'; // Your API client
import { useAuth } from '../../../contexts/AuthContext'; // Your Auth context
import AuthForm from '../../auth/AuthForm';     // Adjust this import path if needed
// --- ICONS ---
import { FaSpinner, FaHeart, FaUserCheck } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { LuRectangleHorizontal, LuPencil } from "react-icons/lu";
import { GoCalendar, GoVerified } from "react-icons/go";

// --- TYPE DEFINITIONS ---
interface Plot {
    id: number;
    title: string;
    location: string;
    area: number;
    pricePerSqFt: number;
    ownerName: string;
    isVerified: boolean;
    postedOn: string;
    lastUpdated: string;
    imageUrl?: string;
    hasPhotos: boolean;
    isShortlisted: boolean;
}

interface ApiPlot {
    id: number;
    title: string;
    location: string;
    total_area_sqft: string;
    price_per_sqft: string;
    plot_file: string | null;
    owner_name: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

interface ShortlistItem {
  id: number;
  item_id: number;
  item_type: string;
}

// --- CARD COMPONENT ---
const PlotCard: React.FC<{ plot: Plot; onToggleWishlist: (plotId: number) => void; onViewDetails: (id: number) => void; isWishlistLoading: boolean; }> = ({ plot, onToggleWishlist, onViewDetails, isWishlistLoading }) => {
    const total_price = plot.area * plot.pricePerSqFt;
    return (
        <div className="bg-white border rounded-lg overflow-hidden flex flex-col sm:flex-row mb-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="sm:w-1/3 p-2">{plot.hasPhotos && plot.imageUrl ? (<img src={plot.imageUrl} alt={plot.title} className="w-full h-full object-cover rounded-md" />) : (<div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-md"><LuRectangleHorizontal className="text-gray-400 text-5xl" /></div>)}</div>
            <div className="sm:w-2/3 flex flex-col p-4">
                <h2 className="font-bold text-lg text-gray-800">{plot.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{plot.location}</p>
                <div className="flex items-center border-y py-4 mb-4">
                    <div className="flex-1 pr-4"><p className="text-lg font-bold text-gray-900">₹{total_price > 10000000 ? `${(total_price / 10000000).toFixed(2)} Cr` : `${(total_price / 100000).toFixed(2)} Lacs`}</p><p className="text-xs text-gray-500">Total Price</p></div>
                    <div className="flex-1 px-4 border-l border-r"><p className="text-lg font-bold text-gray-900">₹{plot.pricePerSqFt.toLocaleString('en-IN')}</p><p className="text-xs text-gray-500">per sq. ft.</p></div>
                    <div className="flex-1 pl-4"><p className="text-lg font-bold text-gray-900">{plot.area.toLocaleString('en-IN')}</p><p className="text-xs text-gray-500">Plot Area</p></div>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mb-4">
                    <div className="flex items-center text-gray-700"><GoCalendar className="mr-2 text-gray-500 text-base" /><div><p className="font-semibold">{plot.postedOn}</p><p className="text-xs text-gray-500">Posted On</p></div></div>
                    <div className="flex items-center text-gray-700"><LuPencil className="mr-2 text-gray-500 text-base" /><div><p className="font-semibold">{plot.lastUpdated}</p><p className="text-xs text-gray-500">Last Updated</p></div></div>
                    <div className="flex items-center text-gray-700"><FaUserCheck className="mr-2 text-gray-500 text-base" /><div><p className="font-semibold">{plot.ownerName}</p><p className="text-xs text-gray-500">Owner</p></div></div>
                    <div className="flex items-center text-gray-700"><GoVerified className={`mr-2 ${plot.isVerified ? 'text-green-500' : 'text-gray-500'}`} /><div><p className={`font-semibold ${plot.isVerified ? 'text-green-600' : 'text-gray-600'}`}>{plot.isVerified ? 'Verified' : 'Not Verified'}</p><p className="text-xs text-gray-500">Verification</p></div></div>
                </div>
                <div className="mt-auto flex items-center">
                    <button onClick={() => onViewDetails(plot.id)} className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition-colors flex-grow">View Details</button>
                    <button onClick={() => onToggleWishlist(plot.id)} disabled={isWishlistLoading} className="ml-4 p-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:cursor-wait">{isWishlistLoading ? <FaSpinner className="animate-spin" /> : plot.isShortlisted ? <FaHeart className="text-red-500" /> : <FiHeart />}</button>
                </div>
            </div>
        </div>
    );
};

// --- SIDEBAR COMPONENT ---
const FilterSidebar: React.FC<{
    priceRange: { min: number; max: number }; setPriceRange: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
    areaRange: { min: number; max: number }; setAreaRange: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
    showWithPhotos: boolean; setShowWithPhotos: React.Dispatch<React.SetStateAction<boolean>>;
    resetFilters: () => void;
}> = ({ priceRange, setPriceRange, areaRange, setAreaRange, showWithPhotos, setShowWithPhotos, resetFilters }) => {
    return (
        <div className="w-full lg:w-1/4 lg:sticky lg:top-24 bg-white p-4 border rounded-lg shadow-sm h-fit">
            <div className="flex justify-between items-center mb-4 pb-3 border-b"><h3 className="font-bold text-xl">Filters</h3><button onClick={resetFilters} className="text-sm font-semibold text-red-500">Reset</button></div>
            <div className="mb-6"><label className="font-semibold text-gray-700">Total Price Range</label><p className="text-sm text-gray-500 mb-2">Up to ₹{(priceRange.max / 100000).toFixed(1)} Lacs</p><input type="range" min="0" max="200000000" step="100000" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })} className="w-full accent-green-600" /></div>
            <div className="mb-6"><label className="font-semibold text-gray-700">Plot Area (sq. ft.)</label><p className="text-sm text-gray-500 mb-2">Up to {areaRange.max.toLocaleString('en-IN')} sq.ft.</p><input type="range" min="0" max="10000" step="100" value={areaRange.max} onChange={(e) => setAreaRange({ ...areaRange, max: Number(e.target.value) })} className="w-full accent-green-600" /></div>
            <div className="mb-6"><label className="font-semibold text-gray-700">Show Only</label><div className="mt-2 flex items-center"><input type="checkbox" id="with-photos" checked={showWithPhotos} onChange={(e) => setShowWithPhotos(e.target.checked)} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-600"/><label htmlFor="with-photos" className="ml-2 text-sm text-gray-600">Plots with Photos</label></div></div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const DPlotMarketplacePage: React.FC = () => {
    const [plots, setPlots] = useState<ApiPlot[]>([]);
    const [shortlistedItems, setShortlistedItems] = useState<ShortlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [wishlistLoadingId, setWishlistLoadingId] = useState<number | null>(null);

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const initialPriceRange = { min: 0, max: 200000000 };
    const initialAreaRange = { min: 0, max: 10000 };
    const [priceRange, setPriceRange] = useState(initialPriceRange);
    const [areaRange, setAreaRange] = useState(initialAreaRange);
    const [showWithPhotos, setShowWithPhotos] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('All Locations');
    const tamilNaduCities = ["All Locations", "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"];

    const fetchShortlist = useCallback(async () => {
        if (!currentUser) return;
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;
        try {
            const response = await apiClient.get('/cart/', { headers: { Authorization: `Bearer ${accessToken}` } });
            setShortlistedItems(response || []);
        } catch (err) { console.error("Could not refresh shortlist:", err); }
    }, [currentUser]);

    // **MAJOR FIX HERE**
    useEffect(() => {
        const fetchPageData = async () => {
            setIsLoading(true);
            setError(null);
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            try {
                const [plotsResponse, shortlistResponse] = await Promise.all([
                    apiClient.get('/public/plots/'), // Always fetch public plots
                    currentUser ? apiClient.get('/cart/', { headers }) : Promise.resolve([]), // Only fetch cart if logged in
                ]);
                
                setPlots(plotsResponse || []);
                setShortlistedItems(shortlistResponse || []);

            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPageData();
    }, [currentUser]);

    const [ showAuth,setShowAuth] = useState(false);
    const handleToggleWishlist = async (plotId: number) => {
        if (!currentUser) { setShowAuth(true); return; }
        
        setWishlistLoadingId(plotId); 
        const accessToken = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${accessToken}` };
        
        const isCurrentlyShortlisted = shortlistedItems.some(item => item.item_id === plotId);

        try {
            if (isCurrentlyShortlisted) {
                const itemToRemove = shortlistedItems.find(item => item.item_id === plotId);
                if (itemToRemove) {
                    await apiClient.delete(`/cart/remove-item/${itemToRemove.id}/`, { headers });
                }
            } else {
                await apiClient.post('/cart/add/', { item_type: "plot", item_id: plotId, quantity: 1 }, { headers });
            }
            await fetchShortlist();
        } catch (error) {
            console.error("Failed to update wishlist:", error);
            alert("There was an error updating your wishlist.");
        } finally {
            setWishlistLoadingId(null);
        }
    };
    
    const handleViewDetails = (id: number) => {
        navigate(`/Dbook-my-sqft/${id}`);
    };

    const finalFilteredPlots = useMemo(() => {
        const shortlistedIds = new Set(shortlistedItems.map(item => item.item_id));
        return plots
            .map(apiPlot => ({ // Map raw API plots to client-side plots
                id: apiPlot.id,
                title: apiPlot.title,
                location: apiPlot.location,
                area: Number(apiPlot.total_area_sqft),
                pricePerSqFt: Number(apiPlot.price_per_sqft),
                ownerName: apiPlot.owner_name,
                isVerified: apiPlot.is_verified,
                postedOn: new Date(apiPlot.created_at).toLocaleDateString(),
                lastUpdated: new Date(apiPlot.updated_at).toLocaleDateString(),
                imageUrl: apiPlot.plot_file || undefined,
                hasPhotos: !!apiPlot.plot_file,
                isShortlisted: shortlistedIds.has(apiPlot.id),
            }))
            .filter(plot => {
                const totalPrice = plot.area * plot.pricePerSqFt;
                const withinPrice = totalPrice >= priceRange.min && totalPrice <= priceRange.max;
                const withinArea = plot.area >= areaRange.min && plot.area <= areaRange.max;
                const hasPhotosMatch = !showWithPhotos || (showWithPhotos && plot.hasPhotos);
                const matchesLocation = locationFilter === 'All Locations' || plot.location.toLowerCase().includes(locationFilter.toLowerCase());
                const matchesSearch = plot.title.toLowerCase().includes(searchTerm.toLowerCase());
                return withinPrice && withinArea && hasPhotosMatch && matchesLocation && matchesSearch;
            });
    }, [plots, shortlistedItems, priceRange, areaRange, showWithPhotos, locationFilter, searchTerm]);

    const resetFilters = () => {
        setPriceRange(initialPriceRange); setAreaRange(initialAreaRange);
        setShowWithPhotos(false); setSearchTerm(''); setLocationFilter('All Locations');
    };
    

    return (
        <div className="bg-gray-50 min-h-screen">
             <header className="bg-white shadow-sm sticky top-0 z-10"><div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center"><div className="text-2xl font-bold text-green-600">PLOT-MARKET</div></div></header>
            <main className="max-w-screen-xl mx-auto p-4">
                <div className="bg-white p-3 rounded-lg border shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
                    <select className="w-full md:w-auto md:min-w-[180px] px-4 py-2 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>{tamilNaduCities.map(city => (<option key={city} value={city}>{city}</option>))}</select>
                    <div className="flex-grow"><input type="text" placeholder="Search by plot title..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>
                    <button className="bg-green-600 text-white font-bold px-8 py-2 rounded-md w-full md:w-auto hover:bg-green-700">Search</button>
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                    <FilterSidebar priceRange={priceRange} setPriceRange={setPriceRange} areaRange={areaRange} setAreaRange={setAreaRange} showWithPhotos={showWithPhotos} setShowWithPhotos={setShowWithPhotos} resetFilters={resetFilters}/>
                    <div className="flex-1">
                        {isLoading ? ( <div className="flex justify-center items-center h-96"><FaSpinner className="animate-spin text-green-600 text-5xl" /></div>
                        ) : error ? ( <div className="text-center py-20 bg-white border rounded-lg"><p className="text-xl text-red-600">{error}</p></div>
                        ): finalFilteredPlots.length > 0 ? (
                            <div>
                                {finalFilteredPlots.map(plot => (
                                    <PlotCard key={plot.id} plot={plot} onToggleWishlist={handleToggleWishlist} onViewDetails={handleViewDetails} isWishlistLoading={wishlistLoadingId === plot.id} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white border rounded-lg"><p className="text-xl text-gray-600">No properties found matching your criteria.</p><p className="text-gray-400 mt-2">Try adjusting or resetting your filters.</p></div>
                        )}
                    </div>
                </div>
            <AuthForm isOpen={showAuth} onClose={() => setShowAuth(false)} />
            </main>
        </div>
    );
};

export default DPlotMarketplacePage;