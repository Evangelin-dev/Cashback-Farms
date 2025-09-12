import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import apiClient from '../../../src/utils/api/apiClient'; // Your API client
import AuthForm from '../../auth/AuthForm'; // Adjust this import path if needed
import { useAuth } from '../../contexts/AuthContext'; // Your Auth context
// --- ICONS ---
import { FaHeart, FaSpinner, FaUserCheck } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { GoCalendar, GoVerified } from "react-icons/go";
import { LuPencil, LuRectangleHorizontal } from "react-icons/lu";

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

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// --- CARD COMPONENT ---
const PlotCard: React.FC<{ plot: Plot; onToggleWishlist: (plotId: number) => void; onViewDetails: (id: number) => void; isWishlistLoading: boolean; }> = ({ plot, onToggleWishlist, onViewDetails, isWishlistLoading }) => {
    const total_price = plot.area * plot.pricePerSqFt;
    return (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col sm:flex-row mb-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group text-sm">
            <div className="sm:w-1/3 p-3 relative overflow-hidden">
                {plot.hasPhotos && plot.imageUrl ? (
                    <div className="relative overflow-hidden rounded-lg">
                        <img 
                            src={plot?.imageUrl} 
                            alt={plot.title} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200">
                        <LuRectangleHorizontal className="text-gray-300 text-5xl" />
                    </div>
                )}
                {plot.isVerified && (
                    <div className="absolute top-5 right-5 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                        <GoVerified className="mr-1" />
                        Verified
                    </div>
                )}
            </div>
            <div className="sm:w-2/3 flex flex-col p-4">
                <div className="flex items-start justify-between mb-2">
                    <h2 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors">{plot.title}</h2>
                    <button 
                        onClick={() => onToggleWishlist(plot.id)} 
                        disabled={isWishlistLoading} 
                        className="ml-3 p-1.5 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 disabled:cursor-wait transition-all duration-200"
                    >
                        {isWishlistLoading ? 
                            <FaSpinner className="animate-spin text-gray-400" /> : 
                            plot.isShortlisted ? 
                                <FaHeart className="text-red-500" /> : 
                                <FiHeart className="hover:scale-110 transition-transform" />
                        }
                    </button>
                </div>
                <p className="text-xs text-gray-600 mb-3 flex items-center">
                    📍 {plot.location}
                </p>
                
                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg py-2 mb-3">
                    <div className="flex-1 px-3 text-center">
                        <p className="text-lg font-bold text-green-600 leading-tight">
                            ₹{total_price > 10000000 ? `${(total_price / 10000000).toFixed(2)} Cr` : `${(total_price / 100000).toFixed(2)} Lacs`}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">Total Price</p>
                    </div>
                    <div className="flex-1 px-3 border-l border-gray-200 text-center">
                        <p className="text-sm font-bold text-gray-900">₹{plot.pricePerSqFt.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500 font-medium">per sq. ft.</p>
                    </div>
                    <div className="flex-1 px-3 border-l border-gray-200 text-center">
                        <p className="text-sm font-bold text-blue-600">{plot.area.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500 font-medium">Plot Area</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm mb-4">
                    <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                        <GoCalendar className="mr-2 text-blue-500 text-base" />
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{plot.postedOn}</p>
                            <p className="text-xs text-gray-500">Posted</p>
                        </div>
                    </div>
                    <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                        <LuPencil className="mr-2 text-orange-500 text-base" />
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{plot.lastUpdated}</p>
                            <p className="text-xs text-gray-500">Updated</p>
                        </div>
                    </div>
                    <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                        <FaUserCheck className="mr-2 text-purple-500 text-base" />
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{plot.ownerName}</p>
                            <p className="text-xs text-gray-500">Owner</p>
                        </div>
                    </div>
                    <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                        <GoVerified className={`mr-2 text-base ${plot.isVerified ? 'text-green-500' : 'text-gray-400'}`} />
                        <div>
                            <p className={`font-semibold text-sm ${plot.isVerified ? 'text-green-600' : 'text-gray-600'}`}>
                                {plot.isVerified ? 'Verified' : 'Not Verified'}
                            </p>
                            <p className="text-xs text-gray-500">Verification</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-auto">
                    <button 
                        onClick={() => onViewDetails(plot.id)} 
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-2 px-4 rounded-md hover:from-green-700 hover:to-green-800 transition-all duration-150 transform hover:scale-[1.01] shadow-md"
                    >
                        <span className="text-sm">View Details</span>
                    </button>
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
    showVerified: boolean; setShowVerified: React.Dispatch<React.SetStateAction<boolean>>;
    showAgentPlot: boolean; setShowAgentPlot: React.Dispatch<React.SetStateAction<boolean>>;
    showCashbackFarms: boolean; setShowCashbackFarms: React.Dispatch<React.SetStateAction<boolean>>;
    plotType: string; setPlotType: React.Dispatch<React.SetStateAction<string>>;
    resetFilters: () => void;
}> = ({ priceRange, setPriceRange, areaRange, setAreaRange, showWithPhotos, setShowWithPhotos, showVerified, setShowVerified, showAgentPlot, setShowAgentPlot, showCashbackFarms, setShowCashbackFarms, plotType, setPlotType, resetFilters }) => {
    const formatPriceLabel = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
        return `₹${(price / 100000).toFixed(1)} Lacs`;
    };

    return (
        <div className="w-full lg:w-1/4 lg:sticky lg:top-24 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-2 bg-white p-6 border border-gray-100 rounded-xl shadow-lg h-fit">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-xl text-gray-900">🔍 Filters</h3>
                <button 
                    onClick={resetFilters} 
                    className="text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                >
                    Reset
                </button>
            </div>
            
            <div className="mb-6">
                <label className="font-semibold text-gray-800 block mb-3">Plot Type</label>
                <select 
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white" 
                    value={plotType} 
                    onChange={e => setPlotType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="residential">Residential Plots</option>
                    <option value="farms">Farms</option>
                    <option value="commercial">Commercial</option>
                    <option value="rental">Rental Yield Plots</option>
                </select>
            </div>
            
            <div className="mb-6">
                <label className="font-semibold text-gray-800 block mb-3">Show Only</label>
                <div className="space-y-3">
                    <label className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl cursor-pointer hover:from-blue-100 hover:to-blue-150 transition-all">
                        <input 
                            type="checkbox" 
                            checked={showAgentPlot} 
                            onChange={(e) => setShowAgentPlot(e.target.checked)} 
                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                        />
                        <div className="flex items-center">
                            <span className="text-blue-800 font-bold">Agent Plot (Not Verified)</span>
                        </div>
                    </label>
                    
                    <label className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl cursor-pointer hover:from-green-100 hover:to-green-150 transition-all">
                        <input 
                            type="checkbox" 
                            checked={showVerified} 
                            onChange={(e) => setShowVerified(e.target.checked)} 
                            className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
                        />
                        <div className="flex items-center">
                            <span className="text-green-800 font-bold">Greenheap Verified</span>
                        </div>
                    </label>
                    
                    <label className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl cursor-pointer hover:from-yellow-100 hover:to-yellow-150 transition-all">
                        <input 
                            type="checkbox" 
                            checked={showCashbackFarms} 
                            onChange={(e) => setShowCashbackFarms(e.target.checked)} 
                            className="h-5 w-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 mr-3"
                        />
                        <div className="flex items-center">
                            <span className="text-yellow-800 font-bold">Greenheap Cashback Farms</span>
                        </div>
                    </label>
                </div>
            </div>
            
            <div className="mb-6">
                <label className="font-semibold text-gray-800 block mb-3">Total Price Range</label>
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-3 font-medium">Up to {formatPriceLabel(priceRange.max)}</p>
                    <input 
                        type="range" 
                        min="0" 
                        max="1000000000" 
                        step="100000" 
                        value={priceRange.max} 
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })} 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green" 
                    />
                </div>
            </div>
            
            <div className="mb-6">
                <label className="font-semibold text-gray-800 block mb-3">📐 Plot Area (sq. ft.)</label>
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-3 font-medium">Up to {areaRange.max.toLocaleString('en-IN')} sq.ft.</p>
                    <input 
                        type="range" 
                        min="0" 
                        max="100000" 
                        step="100" 
                        value={areaRange.max} 
                        onChange={(e) => setAreaRange({ ...areaRange, max: Number(e.target.value) })} 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green" 
                    />
                </div>
            </div>
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

    const initialPriceRange = { min: 0, max: 1000000000 };
    const initialAreaRange = { min: 0, max: 100000 };
    const [priceRange, setPriceRange] = useState(initialPriceRange);
    const [areaRange, setAreaRange] = useState(initialAreaRange);
    const [showWithPhotos, setShowWithPhotos] = useState(false);
    const [showVerified, setShowVerified] = useState(false);
    const [showAgentPlot, setShowAgentPlot] = useState(false);
    const [showCashbackFarms, setShowCashbackFarms] = useState(false);
    const [locationFilter, setLocationFilter] = useState('All Locations');
    const [plotType, setPlotType] = useState("");
    
    const [searchTerm, setSearchTerm] = useState('');
    const [locationSearchInput, setLocationSearchInput] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
    const [isLocationSearching, setIsLocationSearching] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(true);
    const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

    const metropolitanCities = ["All Locations", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"];

    const fetchShortlist = useCallback(async () => {
        if (!currentUser) return;
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;
        try {
            const response = await apiClient.get('/cart/', { headers: { Authorization: `Bearer ${accessToken}` } });
            setShortlistedItems(response || []);
        } catch (err) { console.error("Could not refresh shortlist:", err); }
    }, [currentUser]);

    // *** NEW: useEffect to read search query from URL ***
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const searchQueryFromUrl = params.get('search');

        if (searchQueryFromUrl) {
            // Decode the URL component to handle spaces and special characters
            const decodedSearchQuery = decodeURIComponent(searchQueryFromUrl);
            // Set the search term for filtering
            setSearchTerm(decodedSearchQuery);
            // Set the value for the input box so the user sees their search term
            setLocationSearchInput(decodedSearchQuery);
        }
    }, []); // Empty dependency array [] means this runs only once when the component mounts.

    useEffect(() => {
        const fetchPageData = async () => {
            setIsLoading(true);
            setError(null);
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
            try {
                const [plotsResponse, shortlistResponse] = await Promise.all([
                    apiClient.get('/public/plots/'),
                    currentUser ? apiClient.get('/cart/', { headers }) : Promise.resolve([]),
                ]);
                
                setPlots(plotsResponse || []);
                setShortlistedItems(shortlistResponse || []);
                console.log(plotsResponse, 'plots');

            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPageData();
    }, [currentUser]);

    const fetchLocationSuggestions = useCallback(
      debounce(async (text: string) => {
        if (!GEOAPIFY_API_KEY) return;
        if (!text || text.length < 3) { setLocationSuggestions([]); return; }
        setIsLocationSearching(true);
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_API_KEY}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setLocationSuggestions(data.features || []);
        } catch (error) {
          console.error("Error fetching location suggestions:", error);
        } finally {
          setIsLocationSearching(false);
        }
      }, 400),
      [GEOAPIFY_API_KEY]
    );

    useEffect(() => {
      if (showLocationSuggestions) {
        fetchLocationSuggestions(locationSearchInput);
      }
    }, [locationSearchInput, showLocationSuggestions, fetchLocationSuggestions]);

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
                if (itemToRemove) await apiClient.delete(`/cart/remove-item/${itemToRemove.id}/`, { headers });
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
    
    const handleViewDetails = (id: number) => { navigate(`/book-my-sqft/${id}`); };

    const finalFilteredPlots = useMemo(() => {
        const shortlistedIds = new Set(shortlistedItems.map(item => item.item_id));
        let filtered = plots
            .map(apiPlot => ({
                id: apiPlot.id,
                title: apiPlot.title,
                location: apiPlot.location,
                area: Number(apiPlot.total_area_sqft),
                pricePerSqFt: Number(apiPlot.price_per_sqft),
                ownerName: apiPlot.owner_name,
                isVerified: apiPlot.is_verified,
                postedOn: new Date(apiPlot.created_at).toLocaleDateString(),
                lastUpdated: new Date(apiPlot.updated_at).toLocaleDateString(),
                imageUrl: apiPlot.plot_file || ``,
                hasPhotos: !!apiPlot.plot_file,
                isShortlisted: shortlistedIds.has(apiPlot.id),
            }));

        if (showAgentPlot) filtered = filtered.filter(plot => !plot.isVerified);
        if (showCashbackFarms) {
            // Example logic: filter by title or location containing 'cashback farm' (case-insensitive)
            filtered = filtered.filter(plot =>
                plot.title.toLowerCase().includes('cashback farm') || plot.location.toLowerCase().includes('cashback farm')
            );
        }
        if (plotType) {
            const type = plotType.toLowerCase();
            filtered = filtered.filter(plot => 
                (plot.title.toLowerCase().includes(type) || plot.location.toLowerCase().includes(type))
            );
        }

        filtered = filtered.filter(plot => {
            const totalPrice = plot.area * plot.pricePerSqFt;
            const withinPrice = totalPrice >= priceRange.min && totalPrice <= priceRange.max;
            const withinArea = plot.area >= areaRange.min && plot.area <= areaRange.max;
            const hasPhotosMatch = !showWithPhotos || (showWithPhotos && plot.hasPhotos);
            const verifiedMatch = !showVerified || (showVerified && plot.isVerified);
            const matchesLocation = locationFilter === 'All Locations' || plot.location.toLowerCase().includes(locationFilter.toLowerCase());
            const matchesSearch = !searchTerm || plot.location.toLowerCase().includes(searchTerm.toLowerCase());
            return withinPrice && withinArea && hasPhotosMatch && verifiedMatch && matchesLocation && matchesSearch;
        });
        return filtered;
    }, [plots, shortlistedItems, priceRange, areaRange, showWithPhotos, locationFilter, searchTerm, showVerified, showAgentPlot, showCashbackFarms, plotType]);

    const resetFilters = () => {
        setPriceRange(initialPriceRange);
        setAreaRange(initialAreaRange);
        setShowWithPhotos(false);
        setShowVerified(false);
        setShowAgentPlot(false);
        setShowCashbackFarms(false);
        setSearchTerm('');
        setLocationSearchInput('');
        setLocationFilter('All Locations');
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-xs">
            <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-20 border-b border-gray-100">
                <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        PLOT-MARKET
                    </div>
                </div>
            </header>
            
            <main className="max-w-screen-xl mx-auto p-3">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-gray-100 shadow-xl mb-4 flex flex-col md:flex-row items-center gap-2">
                    <select 
            className="w-full md:w-auto md:min-w-[160px] px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white text-xs" 
                        value={locationFilter} 
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        {metropolitanCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    
                    <div className="flex-grow relative w-full" onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}>
                        <input 
                            type="text" 
                            placeholder="🔍 Search by location (e.g., Koramangala, Bangalore)..." 
                            className="w-full px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white text-xs" 
                            value={locationSearchInput} 
                            onChange={(e) => { 
                                setLocationSearchInput(e.target.value); 
                                if(e.target.value === '') { 
                                    setSearchTerm(''); 
                                } 
                                setShowLocationSuggestions(true); 
                            }}
                        />
                        {isLocationSearching && 
                            <FaSpinner className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        }
                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-100 mt-2 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                                {locationSuggestions.map((s, i) => (
                                    <li 
                                        key={s.properties.place_id || i} 
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors" 
                                        onMouseDown={() => { 
                                            const term = s.properties.name || s.properties.city || s.properties.formatted; 
                                            setLocationSearchInput(term); 
                                            setSearchTerm(term); 
                                            setShowLocationSuggestions(false); 
                                        }}
                                    >
                                        {s.properties.formatted}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button 
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-4 py-1 rounded-lg w-full md:w-auto hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-xs" 
                        onClick={() => setSearchTerm(locationSearchInput)}
                    >
                        Search
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <FilterSidebar 
                        priceRange={priceRange} 
                        setPriceRange={setPriceRange} 
                        areaRange={areaRange} 
                        setAreaRange={setAreaRange} 
                        showWithPhotos={showWithPhotos} 
                        setShowWithPhotos={setShowWithPhotos} 
                        showVerified={showVerified} 
                        setShowVerified={setShowVerified} 
                        showAgentPlot={showAgentPlot} 
                        setShowAgentPlot={setShowAgentPlot} 
                        showCashbackFarms={showCashbackFarms} 
                        setShowCashbackFarms={setShowCashbackFarms} 
                        plotType={plotType} 
                        setPlotType={setPlotType} 
                        resetFilters={resetFilters} 
                    />
                    
                    <div className="flex-1">
                        {isLoading ? ( 
                            <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-gray-100 shadow-lg">
                                <div className="text-center">
                                    <FaSpinner className="animate-spin text-green-600 text-4xl mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium text-sm">Loading amazing plots for you...</p>
                                </div>
                            </div>
                        ) : error ? ( 
                            <div className="text-center py-20 bg-white border border-red-100 rounded-xl shadow-lg">
                                <div className="text-6xl mb-4">😔</div>
                                <p className="text-xl text-red-600 font-semibold mb-2">Oops! Something went wrong</p>
                                <p className="text-gray-600">{error}</p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ): finalFilteredPlots.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center">
                                        <span className="font-semibold text-gray-800 text-sm">
                                            Found {finalFilteredPlots.length} plots
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Perfect matches for your search
                                    </div>
                                </div>
                                
                                {finalFilteredPlots.map(plot => (
                                    <PlotCard 
                                        key={plot.id} 
                                        plot={plot} 
                                        onToggleWishlist={handleToggleWishlist} 
                                        onViewDetails={handleViewDetails} 
                                        isWishlistLoading={wishlistLoadingId === plot.id} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white border border-gray-100 rounded-xl shadow-lg">
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-xl text-gray-700 font-semibold mb-2">No properties found</p>
                                <p className="text-gray-500 mb-4">We couldn't find any plots matching your criteria.</p>
                                <div className="space-y-3">
                                    <p className="text-gray-400 text-sm">Try:</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">Adjusting your filters</span>
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">Expanding your search area</span>
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">Increasing your budget</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={resetFilters}
                                    className="mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 text-xs"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <AuthForm isOpen={showAuth} onClose={() => setShowAuth(false)} />
            </main>
            
            <style>{`
                .slider-green::-webkit-slider-thumb {
                    appearance: none;
                    height: 14px;
                    width: 14px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #059669, #10b981);
                    cursor: pointer;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                    transition: all 0.15s ease;
                }
                
                .slider-green::-webkit-slider-thumb:hover {
                    transform: scale(1.05);
                    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
                }
                
                .slider-green::-moz-range-thumb {
                    height: 14px;
                    width: 14px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #059669, #10b981);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                }
                
                .slider-green::-webkit-slider-track {
                    height: 6px;
                    border-radius: 4px;
                    background: linear-gradient(90deg, #10b981, #d1d5db);
                }
                
                .slider-green::-moz-range-track {
                    height: 6px;
                    border-radius: 4px;
                    background: linear-gradient(90deg, #10b981, #d1d5db);
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default DPlotMarketplacePage;