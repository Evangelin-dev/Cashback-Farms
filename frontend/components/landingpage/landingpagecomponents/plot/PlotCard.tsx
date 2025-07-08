import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plot, PlotType } from '../../../../types';
import { AreaIcon, CheckBadgeIcon, LocationMarkerIcon, RupeeIcon } from '../../../../constants';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';
import Button from '../../../common/Button';
import CardShell from '../../../common/CardShell';
import { useAuth } from '../../../../contexts/AuthContext';
import apiClient from '@/src/utils/api/apiClient';

interface ShortlistItem {
  id: number;
  item_id: number;
}

interface PlotCardProps {
  plot: Plot;
  showViewDetailButton?: boolean;
  shortlistedItems: ShortlistItem[];
  onShortlistChange: () => void;
}

const PlotCard: React.FC<PlotCardProps> = ({ plot, showViewDetailButton, shortlistedItems = [], onShortlistChange }) => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAlreadyShortlisted = useMemo(() => {
    return shortlistedItems.some(item => item.item_id === plot.id);
  }, [shortlistedItems, plot.id]);

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAlreadyShortlisted) return;

    setIsSubmitting(true);
    const accessToken = localStorage.getItem("access_token");
    if (!currentUser || !accessToken) {
      alert("You must be logged in to add items.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      item_type: "plot",
      item_id: plot.id,
      quantity: 1,
    };

    try {
      await apiClient.post('/cart/add/', payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      onShortlistChange();
    } catch (error) {
      console.error("Failed to add item to wishlist:", error);
      alert("There was an error adding this item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardShell className="flex flex-col relative">
      {currentUser && (
        <button
          onClick={handleAddToWishlist}
          disabled={isSubmitting || isAlreadyShortlisted}
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
          {showViewDetailButton ? (
            <Link to={`/plot-details/${plot.id}`}>
              <Button variant="outline" className="w-full">View Details</Button>
            </Link>
          ) : plot.sqftPrice ? (
             <Link to={`/book-my-sqft/${plot.id}`}>
               <Button variant="primary" className="w-full">Book My SqFt</Button>
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
};

export default PlotCard;