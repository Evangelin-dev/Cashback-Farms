import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "@/src/utils/api/apiClient";
import { useAuth } from '../../contexts/AuthContext.tsx';

// UI Components - Assuming these are in your project
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';

// Type Definitions
interface MicroPlot {
  id: number;
  project_name: string;
  location: string;
  price: string;
  unit: string;
  project_image: string;
  description: string;
}

interface ShortlistItem {
  id: number;
  item_id: number;
}

const MySqftListing: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [plots, setPlots] = useState<MicroPlot[]>([]);
  const [shortlistedItems, setShortlistedItems] = useState<ShortlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

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
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("Access token not found. Please log in.");
        setIsLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${accessToken}` };

      try {
        const [plotsResponse, shortlistResponse] = await Promise.all([
          apiClient.get("/micro-plots/", { headers }),
          apiClient.get('/cart/', { headers })
        ]);

        setPlots(plotsResponse || []);
        setShortlistedItems(shortlistResponse || []);

      } catch (err: any) {
        setError("Failed to fetch listings. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [currentUser]);

  const handleAddToWishlist = async (plotId: number) => {
    setSubmittingId(plotId);
    const accessToken = localStorage.getItem("access_token");

    const payload = {
      item_type: "microplot",
      item_id: plotId,
      quantity: 1,
    };

    try {
      await apiClient.post('/cart/add/', payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await fetchShortlist();
    } catch (error) {
      console.error("Failed to add micro-plot to wishlist:", error);
      alert("There was an error adding this item.");
    } finally {
      setSubmittingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-600">Loading listings...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-red-700 mb-2">An Error Occurred</h1>
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-3 sm:mb-4">
            Discover Micro-Plot Investment Opportunities
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Explore premium micro-plot investments with guaranteed returns and flexible payment options
          </p>
        </div>

        {/* Empty State */}
        {!isLoading && plots.length === 0 && (
          <div className="text-center bg-white shadow-lg rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Listings Found</h2>
            <p className="text-gray-500 text-sm sm:text-base">There are currently no micro-plot listings available. Check back soon!</p>
          </div>
        )}

        {/* Enhanced Grid Layout */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plots.map((plot) => {
            const isAlreadyShortlisted = shortlistedItems.some(item => item.item_id === plot.id);
            const isCurrentlySubmitting = submittingId === plot.id;

            return (
              <div
                key={plot.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group transform hover:-translate-y-1 flex flex-col"
              >
                {/* Enhanced Wishlist Button */}
                {currentUser && (
                  <button
                    onClick={() => handleAddToWishlist(plot.id)}
                    disabled={isAlreadyShortlisted || isCurrentlySubmitting}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all duration-200 hover:bg-white hover:scale-110 disabled:cursor-not-allowed disabled:opacity-70"
                    aria-label="Add to wishlist"
                  >
                    {isCurrentlySubmitting ? (
                      <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-red-500"></div>
                    ) : isAlreadyShortlisted ? (
                      <SolidHeartIcon className="w-6 h-6 text-red-500" />
                    ) : (
                      <OutlineHeartIcon className="w-6 h-6 text-gray-600 hover:text-red-500" />
                    )}
                  </button>
                )}

                {/* Enhanced Image Container */}
                <div className="relative overflow-hidden h-48 sm:h-52 lg:h-56">
                  <img
                    src={plot.project_image}
                    alt={plot.project_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Enhanced Content */}
                <div className="p-4 sm:p-5 flex-grow flex flex-col">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2" title={plot.project_name}>
                    {plot.project_name}
                  </h2>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow" title={plot.description}>
                    {plot.description}
                  </p>

                  {/* Enhanced Info Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">Location:</span>
                      <span className="ml-1 truncate">{plot.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="font-medium">Price:</span>
                      <span className="ml-1 font-bold text-green-600">
                        ₹{parseFloat(plot.price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-gray-500 ml-1">/ {plot.unit}</span>
                    </div>
                  </div>

                  {/* Enhanced CTA Button */}
                  <button
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] text-sm sm:text-base"
                    onClick={() => navigate(`/mysqft-listing/${plot.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MySqftListing;