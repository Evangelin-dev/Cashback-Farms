import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../src/utils/api/apiClient";


import { FaSpinner } from 'react-icons/fa';
import { IoLocationOutline } from "react-icons/io5";


interface MicroPlot {
    id: number;
    name: string;
    location: string;
    pricePerUnit: number;
    unit: string;
    imageUrl: string;
}

interface ApiMicroPlot {
    id: number;
    project_name: string;
    location: string;
    price: string;
    unit: string;
    project_image: string | null;
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


const MicroPlotCard: React.FC<{ plot: MicroPlot; onViewDetails: (id: number) => void; }> = ({ plot, onViewDetails }) => {
    return (
        <div className="bg-white border rounded-lg overflow-hidden flex flex-col sm:flex-row mb-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="sm:w-1/3 p-2">
                <img src={plot.imageUrl} alt={plot.name} className="w-full h-full object-cover rounded-md" />
            </div>
            <div className="sm:w-2/3 flex flex-col p-4">
                <h2 className="font-bold text-xl text-gray-800">{plot.name}</h2>
                <div className="flex items-center text-gray-600 text-sm mt-2 mb-4">
                    <IoLocationOutline className="mr-2 flex-shrink-0" />
                    <span>{plot.location}</span>
                </div>
                <div className="border-y py-4 mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                        ₹{plot.pricePerUnit.toLocaleString('en-IN')}
                        <span className="text-base font-medium text-gray-500"> / {plot.unit}</span>
                    </p>
                    <p className="text-xs text-gray-500">Price per Unit</p>
                </div>
                <div className="mt-auto flex items-center">
                    <button onClick={() => onViewDetails(plot.id)} className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition-colors w-full">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};


const FilterSidebar: React.FC<{
    locationSearchInput: string;
    setLocationSearchInput: (value: string) => void;
    suggestions: any[];
    handleSuggestionClick: (suggestion: any) => void;
    isSearching: boolean;
    showSuggestions: boolean;
    setShowSuggestions: (value: boolean) => void;
    priceRange: { min: number; max: number };
    setPriceRange: (value: { min: number; max: number }) => void;
    resetFilters: () => void;
}> = ({
    locationSearchInput,
    setLocationSearchInput,
    suggestions,
    handleSuggestionClick,
    isSearching,
    showSuggestions,
    setShowSuggestions,
    priceRange,
    setPriceRange,
    resetFilters
}) => {
    return (
        <div className="w-full lg:w-1/4 lg:sticky lg:top-24 bg-white p-4 border rounded-lg shadow-sm h-fit">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 className="font-bold text-xl">Filters</h3>
                <button onClick={resetFilters} className="text-sm font-semibold text-red-500">Reset</button>
            </div>
            {/* --- NEW GEOAPIFY SEARCH BAR --- */}
            <div 
                className="mb-6 relative" 
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            >
                <label className="font-semibold text-gray-700 block mb-2">Search by Location</label>
                <input
                    type="text"
                    placeholder="e.g. Koramangala, Bangalore"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600"
                    value={locationSearchInput}
                    onChange={(e) => {
                        setLocationSearchInput(e.target.value);
                        setShowSuggestions(true);
                    }}
                    autoComplete="off"
                />
                {isSearching && <FaSpinner className="animate-spin absolute right-3 top-10 text-gray-400" />}
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute top-full left-0 right-0 bg-white border mt-1 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                        {suggestions.map((s, i) => (
                            <li
                                key={s.properties.place_id || i}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={() => handleSuggestionClick(s)}
                            >
                                {s.properties.formatted}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="mb-6">
                <label className="font-semibold text-gray-700">Price Per Unit</label>
                <p className="text-sm text-gray-500 mb-2">Up to ₹{priceRange.max.toLocaleString('en-IN')}</p>
                <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full accent-green-600"
                />
            </div>
        </div>
    );
};



const DMySqftListing: React.FC = () => {
    const navigate = useNavigate();
    
    const [plots, setPlots] = useState<ApiMicroPlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    
    const initialPriceRange = { min: 0, max: 100000 };
    const [priceRange, setPriceRange] = useState(initialPriceRange);
    
    
    const [searchTerm, setSearchTerm] = useState(''); 
    const [locationSearchInput, setLocationSearchInput] = useState(''); 
    const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
    const [isLocationSearching, setIsLocationSearching] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(true);
    const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

    useEffect(() => {
        const fetchPageData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get('/public/micro-plots/');
                setPlots(response || []);
            } catch (err) {
                setError("Could not load listings. Please try again later.");
                console.error("Failed to fetch micro-plots:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPageData();
    }, []);

    
    const fetchLocationSuggestions = useCallback(
        debounce(async (text: string) => {
            if (!GEOAPIFY_API_KEY) { return; }
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

    const handleViewDetails = (id: number) => {
        navigate(`/micro-plots/${id}`);
    };

	const finalFilteredPlots = useMemo(() => {
        return plots
            .map(apiPlot => ({
                id: apiPlot.id,
                name: apiPlot.project_name,
                location: apiPlot.location,
                pricePerUnit: Number(apiPlot.price),
                unit: apiPlot.unit,
                imageUrl: apiPlot.project_image || `https://picsum.photos/seed/${apiPlot.id}/600/400`,
            }))
            .filter(plot => {
                
                const matchesLocation = !searchTerm || plot.location.toLowerCase().includes(searchTerm.toLowerCase());
                const withinPrice = plot.pricePerUnit <= priceRange.max;
                return matchesLocation && withinPrice;
            });
    }, [plots, searchTerm, priceRange]);

    const resetFilters = () => {
        setPriceRange(initialPriceRange);
        setSearchTerm('');
        setLocationSearchInput('');
    };

    const handleSuggestionClick = (suggestion: any) => {
        const term = suggestion.properties.name || suggestion.properties.city || suggestion.properties.formatted;
        setLocationSearchInput(term);
        setSearchTerm(term); 
        setShowLocationSuggestions(false); 
    };

	return (
		<div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-10"><div className="max-w-screen-xl mx-auto px-4 py-3"><h1 className="text-2xl font-bold text-green-700">Book My SqFt</h1></div></header>
            <main className="max-w-screen-xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
                {/* --- PASSING NEW GEOAPIFY PROPS TO SIDEBAR --- */}
                <FilterSidebar
                    locationSearchInput={locationSearchInput}
                    setLocationSearchInput={setLocationSearchInput}
                    suggestions={locationSuggestions}
                    handleSuggestionClick={handleSuggestionClick}
                    isSearching={isLocationSearching}
                    showSuggestions={showLocationSuggestions}
                    setShowSuggestions={setShowLocationSuggestions}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    resetFilters={resetFilters}
                />
                <div className="flex-1">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-96"><FaSpinner className="animate-spin text-green-700 text-5xl" /></div>
                    ) : error ? (
                        <div className="text-center py-20 bg-white border rounded-lg"><p className="text-xl text-red-600">{error}</p></div>
                    ) : finalFilteredPlots.length > 0 ? (
                        <div>
                            {finalFilteredPlots.map((plot) => (
                                <MicroPlotCard key={plot.id} plot={plot} onViewDetails={handleViewDetails} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white border rounded-lg"><p className="text-xl text-gray-600">No listings match your current filters.</p><p className="text-gray-400 mt-2">Try adjusting or resetting your filters.</p></div>
                    )}
                </div>
            </main>
		</div>
	);
};

export default DMySqftListing;