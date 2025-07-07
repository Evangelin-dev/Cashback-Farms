import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "@/src/utils/api/apiClient";
import { useAuth } from '../../contexts/AuthContext.tsx'; // Adjust path if needed

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
      item_type: "microplot", // The only change needed, as requested
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
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-600">Loading listings...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center bg-red-50 border border-red-200 rounded-lg">
        <h1 className="text-xl font-bold text-red-700">An Error Occurred</h1>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary-light mb-8 text-center">
        Discover Micro-Plot Investment Opportunities
      </h1>

      {!isLoading && plots.length === 0 && (
        <div className="text-center bg-gray-50 p-10 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">No Listings Found</h2>
          <p className="text-gray-500 mt-2">There are currently no micro-plot listings available.</p>
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plots.map((plot) => {
          const isAlreadyShortlisted = shortlistedItems.some(item => item.item_id === plot.id);
          const isCurrentlySubmitting = submittingId === plot.id;

          return (
            <div
              key={plot.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-neutral-200 p-5 flex flex-col group overflow-hidden relative"
            >
              {currentUser && (
                <button
                  onClick={() => handleAddToWishlist(plot.id)}
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

              <div className="mb-4 overflow-hidden rounded-lg h-48">
                <img
                  src={plot.project_image}
                  alt={plot.project_name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-green-800 mb-2 truncate" title={plot.project_name}>
                  {plot.project_name}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2" title={plot.description}>
                  {plot.description}
                </p>
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Location:</span> {plot.location}
                </div>
                <div className="text-sm text-gray-700 mb-4">
                  <span className="font-semibold">Price:</span> ₹
                  {parseFloat(plot.price).toLocaleString("en-IN")}
                  <span className="text-gray-500"> / {plot.unit}</span>
                </div>
              </div>
              <button
                className="w-full mt-auto bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
                onClick={() => navigate(`/mysqft-listing/${plot.id}`)}
              >
                View Details & Book
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MySqftListing;