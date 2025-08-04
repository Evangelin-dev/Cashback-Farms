import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext'; // Your Auth context
import apiClient from '../../../src/utils/api/apiClient'; // Your API client
import AuthForm from '../../auth/AuthForm'; // Adjust this import path if needed
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
        <div className="bg-white border rounded-lg overflow-hidden flex flex-col sm:flex-row mb-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="sm:w-1/3 p-2">{plot.hasPhotos && plot.imageUrl ? (<img src={plot?.imageUrl} alt={plot.title} className="w-full h-full rounded-md" />) : (<div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-md"><LuRectangleHorizontal className="text-gray-400 text-5xl" /></div>)}</div>
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
    showVerified: boolean; setShowVerified: React.Dispatch<React.SetStateAction<boolean>>;
    showAgentPlot: boolean; setShowAgentPlot: React.Dispatch<React.SetStateAction<boolean>>;
    plotType: string; setPlotType: React.Dispatch<React.SetStateAction<string>>;
    resetFilters: () => void;
}> = ({ priceRange, setPriceRange, areaRange, setAreaRange, showWithPhotos, setShowWithPhotos, showVerified, setShowVerified, showAgentPlot, setShowAgentPlot, plotType, setPlotType, resetFilters }) => {
    const formatPriceLabel = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
        return `₹${(price / 100000).toFixed(1)} Lacs`;
    };

    return (
        <div className="w-full lg:w-1/4 lg:sticky lg:top-24 bg-white p-4 border rounded-lg shadow-sm h-fit">
            <div className="flex justify-between items-center mb-4 pb-3 border-b"><h3 className="font-bold text-xl">Filters</h3><button onClick={resetFilters} className="text-sm font-semibold text-red-500">Reset</button></div>
            <div className="mb-6">
                <label className="font-semibold text-gray-700">Plot Type</label>
                <select className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-600 focus:border-green-600" value={plotType} onChange={e => setPlotType(e.target.value)}>
                    <option value="">All Types</option><option value="residential">Residential Plots</option><option value="farms">Farms</option><option value="commercial">Commercial</option><option value="rental">Rental Yield Plots</option>
                </select>
            </div>
            <div className="mb-6">
                <label className="font-semibold text-gray-700">Show Only</label>
                <div className="mt-2 grid grid-cols-1 gap-3">
                    <div className="flex items-center min-h-[56px] w-full bg-green-100 border border-green-300 rounded-lg px-3 py-2 shadow-sm flex-grow">
                        <input type="checkbox" id="verified-plots" checked={showVerified} onChange={(e) => setShowVerified(e.target.checked)} className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-600"/><span className="ml-3 text-green-800 font-bold flex items-center"><GoVerified className="mr-2 text-2xl text-green-600" /> Green Heap Verified</span>
                    </div>
                    <div className="flex items-center min-h-[48px] w-full bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 shadow-sm flex-grow">
                        <input type="checkbox" id="agent-plots" checked={showAgentPlot} onChange={(e) => setShowAgentPlot(e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-600"/><span className="ml-3 text-blue-800 font-bold flex items-center">Agent Plot (Not Verified)</span>
                    </div>
                </div>
            </div>
            <div className="mb-6"><label className="font-semibold text-gray-700">Total Price Range</label><p className="text-sm text-gray-500 mb-2">Up to {formatPriceLabel(priceRange.max)}</p><input type="range" min="0" max="1000000000" step="100000" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })} className="w-full accent-green-600" /></div>
            <div className="mb-6"><label className="font-semibold text-gray-700">Plot Area (sq. ft.)</label><p className="text-sm text-gray-500 mb-2">Up to {areaRange.max.toLocaleString('en-IN')} sq.ft.</p><input type="range" min="0" max="100000" step="100" value={areaRange.max} onChange={(e) => setAreaRange({ ...areaRange, max: Number(e.target.value) })} className="w-full accent-green-600" /></div>
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
    }, [plots, shortlistedItems, priceRange, areaRange, showWithPhotos, locationFilter, searchTerm, showVerified, showAgentPlot, plotType]);

    const resetFilters = () => {
        setPriceRange(initialPriceRange);
        setAreaRange(initialAreaRange);
        setShowWithPhotos(false);
        setShowVerified(false);
        setShowAgentPlot(false);
        setSearchTerm('');
        setLocationSearchInput('');
        setLocationFilter('All Locations');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-10"><div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center"><div className="text-2xl font-bold text-green-600">PLOT-MARKET</div></div></header>
            <main className="max-w-screen-xl mx-auto p-4">
                <div className="bg-white p-3 rounded-lg border shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
                    <select className="w-full md:w-auto md:min-w-[180px] px-4 py-2 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>{metropolitanCities.map(city => (<option key={city} value={city}>{city}</option>))}</select>
                    
                    <div className="flex-grow relative w-full" onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}>
                        <input type="text" placeholder="Search by location (e.g., Koramangala, Bangalore)..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600" value={locationSearchInput} onChange={(e) => { setLocationSearchInput(e.target.value); if(e.target.value === '') { setSearchTerm(''); } setShowLocationSuggestions(true); }}/>
                        {isLocationSearching && <FaSpinner className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 bg-white border mt-1 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                                {locationSuggestions.map((s, i) => (
                                    <li key={s.properties.place_id || i} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onMouseDown={() => { const term = s.properties.name || s.properties.city || s.properties.formatted; setLocationSearchInput(term); setSearchTerm(term); setShowLocationSuggestions(false); }}>
                                        {s.properties.formatted}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button className="bg-green-600 text-white font-bold px-8 py-2 rounded-md w-full md:w-auto hover:bg-green-700" onClick={() => setSearchTerm(locationSearchInput)}>Search</button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <FilterSidebar priceRange={priceRange} setPriceRange={setPriceRange} areaRange={areaRange} setAreaRange={setAreaRange} showWithPhotos={showWithPhotos} setShowWithPhotos={setShowWithPhotos} showVerified={showVerified} setShowVerified={setShowVerified} showAgentPlot={showAgentPlot} setShowAgentPlot={setShowAgentPlot} plotType={plotType} setPlotType={setPlotType} resetFilters={resetFilters} />
                    <div className="flex-1">
                        {isLoading ? ( <div className="flex justify-center items-center h-96"><FaSpinner className="animate-spin text-green-600 text-5xl" /></div>
                        ) : error ? ( <div className="text-center py-20 bg-white border rounded-lg"><p className="text-xl text-red-600">{error}</p></div>
                        ): finalFilteredPlots.length > 0 ? (
                            <div>{finalFilteredPlots.map(plot => (<PlotCard key={plot.id} plot={plot} onToggleWishlist={handleToggleWishlist} onViewDetails={handleViewDetails} isWishlistLoading={wishlistLoadingId === plot.id} />))}</div>
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