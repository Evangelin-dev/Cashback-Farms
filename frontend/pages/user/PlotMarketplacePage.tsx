import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import apiClient from '../../src/utils/api/apiClient';
import { Plot, PlotType } from '../../types';

// UI Components
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import Button from '../../components/common/Button.tsx';
import CardShell from '../../components/common/CardShell.tsx';
import { AreaIcon, CheckBadgeIcon, LocationMarkerIcon, RupeeIcon } from '../../constants';

// Interfaces
interface ShortlistItem {
  id: number;
  item_id: number;
}

const PlotMarketplacePage: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [shortlistedItems, setShortlistedItems] = useState<ShortlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | PlotType>('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const { currentUser } = useAuth();

  // This function is now only for refreshing the shortlist after an action.
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
      // Ensure we start in a loading state every time.
      setIsLoading(true);
      setError(null);
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setError("You must be logged in to view plots.");
        setIsLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${accessToken}` };

      try {
        const [plotsResponse, shortlistResponse] = await Promise.all([
          apiClient.get('/plots/', { headers }),
          apiClient.get('/cart/', { headers }),
        ]);

        const formattedPlots: Plot[] = plotsResponse.map((apiPlot: any) => ({
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
        
        // Set both states *before* we stop loading.
        setPlots(formattedPlots.reverse());
        setShortlistedItems(shortlistResponse || []);

      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        // This only runs after both API calls are done and states are set.
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchPageData();
    } else {
      // If there's no user, stop loading and show an appropriate message.
      setIsLoading(false);
      setPlots([]);
      setShortlistedItems([]);
    }
  }, [currentUser]); // This effect runs once when the component loads or the user changes.

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

  const filteredPlots = useMemo(() => {
    return plots.filter(plot => {
      const matchesFilter = filter === 'all' || plot.type === filter;
      const matchesSearch = plot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plot.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVerified = !showVerifiedOnly || plot.type === PlotType.VERIFIED;
      return matchesFilter && matchesSearch && matchesVerified;
    });
  }, [plots, filter, searchTerm, showVerifiedOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Plot Marketplace</h1>
        <p className="mt-2 text-lg text-gray-600">Discover your ideal piece of land.</p>
      </div>

      <div className="mb-8 p-4 bg-white rounded-lg shadow flex flex-col md:flex-row items-center gap-4">
        <div className="flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by title or location..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button variant={filter === 'all' ? 'primary' : 'outline'} onClick={() => setFilter('all')}>All Plots</Button>
          <Button variant={filter === PlotType.PUBLIC ? 'primary' : 'outline'} onClick={() => setFilter(PlotType.PUBLIC)}>Public Listings</Button>
          <Button variant={filter === PlotType.VERIFIED ? 'primary' : 'outline'} onClick={() => setFilter(PlotType.VERIFIED)}>Greenheap Verified</Button>
        </div>
        <div className="flex items-center mt-3 md:mt-0 md:ml-4">
          <input
            type="checkbox"
            id="verified-plots"
            checked={showVerifiedOnly}
            onChange={e => setShowVerifiedOnly(e.target.checked)}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-600"
          />
          <label htmlFor="verified-plots" className="ml-2 text-sm text-gray-700">Green Heap Verified Plot</label>
        </div>
      </div>

      {isLoading && <div className="text-center py-12 text-lg text-gray-500">Loading plots...</div>}
      {error && <div className="text-center py-12 text-lg text-red-500">{error}</div>}

      {!isLoading && !error && (
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
    </div>
  );
};

export default PlotMarketplacePage;