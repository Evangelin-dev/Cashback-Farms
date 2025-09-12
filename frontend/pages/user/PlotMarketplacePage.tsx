import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/contexts/AuthContext.tsx';
import apiClient from '../../src/utils/api/apiClient';
import { Plot, PlotType } from '../../types';

// UI Components
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { SplinePointerIcon } from 'lucide-react';
import Button from '../../components/common/Button.tsx';
import CardShell from '../../components/common/CardShell.tsx';
import { AreaIcon, CheckBadgeIcon, LocationMarkerIcon, RupeeIcon } from '../../constants';

// Interfaces
interface ShortlistItem {
  id: number;
  item_id: number;
}

// Debounce helper function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const PlotMarketplacePage: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [shortlistedItems, setShortlistedItems] = useState<ShortlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  // Filter states
  const [filter, setFilter] = useState<'all' | PlotType>('all');
  
  // --- NEW: Autocomplete and Search State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isLocationSearching, setIsLocationSearching] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(true);
  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const { currentUser } = useAuth();

  // --- NEW: useEffect to read search query from URL ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQueryFromUrl = params.get('search');
    if (searchQueryFromUrl) {
      const decodedQuery = decodeURIComponent(searchQueryFromUrl);
      setSearchTerm(decodedQuery);
      setLocationSearchInput(decodedQuery);
    }
  }, []); // Runs once on component mount

  // Fetch initial plot and shortlist data

    const fetchShortlist = useCallback(async () => {
    if (!currentUser) return;
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    try {
      const response = await apiClient.get('/cart/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setShortlistedItems(response || []);
    } catch (err) {
      console.error("Could not refresh shortlist:", err);
    }
  }, [currentUser]);
  
  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      setError(null);
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setIsLoading(false);
        setError("You must be logged in to view plots.");
        return;
      }
      const headers = { Authorization: `Bearer ${accessToken}` };
      try {
        const [plotsResponse, shortlistResponse] = await Promise.all([
          apiClient.get('/plots/', { headers }),
          apiClient.get('/cart/', { headers }),
        ]);

        const formattedPlots: Plot[] = (plotsResponse || []).map((apiPlot: any) => ({
          id: apiPlot.id,
          title: apiPlot.title,
          location: apiPlot.location,
          area: parseFloat(apiPlot.total_area_sqft),
          sqftPrice: parseFloat(apiPlot.price_per_sqft),
          price: parseFloat(apiPlot.total_area_sqft) * parseFloat(apiPlot.price_per_sqft),
          type: apiPlot.is_verified ? PlotType.VERIFIED : PlotType.PUBLIC,
          imageUrl: apiPlot.plot_file || ``,
          description: `A prime piece of land in ${apiPlot.location}, owned by ${apiPlot.owner_name}.`,
          amenities: apiPlot.joint_owners.length > 0 ? ['Joint Ownership'] : [],
        }));
        
        setPlots(formattedPlots.reverse());
        setShortlistedItems(shortlistResponse || []);

      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchPageData();
    }
  }, [currentUser]);

  // Fetch location suggestions from Geoapify
  const fetchLocationSuggestions = useCallback(debounce(async (text: string) => {
    if (!GEOAPIFY_API_KEY || text.length < 3) {
      setLocationSuggestions([]);
      return;
    }
    setIsLocationSearching(true);
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setLocationSuggestions(data.features || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setIsLocationSearching(false);
    }
  }, 400), [GEOAPIFY_API_KEY]);

  useEffect(() => {
    if (showLocationSuggestions) {
      fetchLocationSuggestions(locationSearchInput);
    }
  }, [locationSearchInput, showLocationSuggestions, fetchLocationSuggestions]);

  // Filter plots based on user selections
  const filteredPlots = useMemo(() => {
    return plots.filter(plot => {
      const matchesFilter = filter === 'all' || plot.type === filter;
      const matchesSearch = !searchTerm ||
        plot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plot.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [plots, filter, searchTerm]);

  // Wishlist handler
  const handleAddToWishlist = async (plotId: number) => {
    setSubmittingId(plotId);
    const accessToken = localStorage.getItem("access_token");

    const payload = {
      item_type: "plot",
      item_id: plotId,
      quantity: 1,
    };

    try {
      await apiClient.post('/cart/add/', payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // After adding, just refresh the shortlist to update the hearts.
      await fetchShortlist();
    } catch (error) {
      console.error("Failed to add item to wishlist:", error);
      alert("There was an error adding this item.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Plot Marketplace</h1>
        <p className="mt-2 text-lg text-gray-600">Discover your ideal piece of land.</p>
      </div>

      {/* --- NEW Search Bar --- */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow flex flex-col md:flex-row items-center gap-4">
        <div className="flex-grow relative w-full" onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}>
          <input
            type="text"
            placeholder="Search by title, location, or landmark..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            value={locationSearchInput}
            onChange={(e) => {
              setLocationSearchInput(e.target.value);
              if (e.target.value === '') setSearchTerm('');
              setShowLocationSuggestions(true);
            }}
          />
          {isLocationSearching && <SplinePointerIcon className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />}
          {showLocationSuggestions && locationSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border mt-1 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
              {locationSuggestions.map((s, i) => (
                <li
                  key={s.properties.place_id || i}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => {
                    const term = s.properties.formatted;
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
          className="bg-green-600 text-white font-bold px-8 py-2 rounded-md w-full md:w-auto hover:bg-green-700"
          onClick={() => setSearchTerm(locationSearchInput)}
        >
          Search
        </button>
      </div>
      
      <div className="flex space-x-2 mb-8">
        <Button variant={filter === 'all' ? 'primary' : 'outline'} onClick={() => setFilter('all')}>All Plots</Button>
        <Button variant={filter === PlotType.PUBLIC ? 'primary' : 'outline'} onClick={() => setFilter(PlotType.PUBLIC)}>Public Listings</Button>
        <Button variant={filter === PlotType.VERIFIED ? 'primary' : 'outline'} onClick={() => setFilter(PlotType.VERIFIED)}>Greenheap Verified</Button>
      </div>

      {isLoading && <div className="text-center py-12 text-lg text-gray-500">Loading plots...</div>}
      {error && <div className="text-center py-12 text-lg text-red-500">{error}</div>}

      {!isLoading && !error && filteredPlots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlots.map(plot => {
            const isAlreadyShortlisted = shortlistedItems.some(item => item.item_id === plot.id);
            const isCurrentlySubmitting = submittingId === Number(plot.id);
            return (
               <CardShell key={plot.id} className="flex flex-col relative">
                {currentUser && (
                  <button
                    onClick={() => handleAddToWishlist(Number(plot.id))}
                    disabled={isAlreadyShortlisted || isCurrentlySubmitting}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 backdrop-blur-sm transition-colors disabled:cursor-not-allowed"
                    aria-label="Add to wishlist"
                  >
                    {isAlreadyShortlisted ? (
                      <SolidHeartIcon className="w-6 h-6 text-red-500" />
                    ) : (
                      <OutlineHeartIcon className="w-6 h-6 text-gray-700 hover:text-red-500" />
                    )}
                  </button>
                )}

                <img src={plot.imageUrl || 'https://picsum.photos/seed/plot/400/300'} alt={plot.title} className="w-full h-48 object-cover"/>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{plot.title}</h3>
                  {plot.type === PlotType.VERIFIED && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2 self-start">
                      <CheckBadgeIcon /> <span className="ml-1">Greenheap Verified</span>
                    </span>
                  )}
                  {plot.type === PlotType.PUBLIC && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2 self-start">
                      Public Listing
                    </span>
                  )}
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <LocationMarkerIcon /> {plot.location}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <p className="text-gray-700 flex items-center"><RupeeIcon /> <span className="font-semibold">{plot.price > 0 ? plot.price.toLocaleString('en-IN') : 'Price on selection'}</span></p>
                      <p className="text-gray-700 flex items-center"><AreaIcon /> {plot.area.toLocaleString('en-IN')} sqft</p>
                  </div>
                   {plot.sqftPrice && (
                       <p className="text-xs text-gray-500 mb-3">
                          Plot also available via Book My SqFt @ ₹{plot.sqftPrice.toLocaleString('en-IN')}/sqft
                      </p>
                   )}
                  <p className="text-xs text-gray-500 mb-3 flex-grow h-12 overflow-hidden">
                      {plot.description.substring(0,100)}{plot.description.length > 100 ? '...' : ''}
                  </p>
                  <div className="mt-auto pt-3">
                    {plot.sqftPrice ? (
                       <Link to={`/book-my-sqft/${plot.id}`}>
                         <Button variant="primary" className="w-full">Book Now</Button>
                       </Link>
                    ) : (
                       <Link to={`/plot-details/${plot.id}`}>
                         <Button variant="outline" className="w-full">View Details</Button>
                       </Link>
                    )}
                  </div>
                </div>
              </CardShell>
            );
          })}
        </div>
      )}

      {!isLoading && !error && filteredPlots.length === 0 && (
          <div className="text-center col-span-full py-20 bg-white border rounded-lg">
            <p className="text-xl text-gray-600">No properties found.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
       )}
    </div>
  );
};

export default PlotMarketplacePage;