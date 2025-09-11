import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../services/api';
import { formatCurrency } from '../utils/format';

interface PropertyListingCardProps {
  listing: Property;
}

const PropertyListingCard: React.FC<PropertyListingCardProps> = ({ listing }) => {
  const primaryImage = listing.images.find(img => img.is_primary)?.image || listing.images[0]?.image;
  
  return (
    <Link to={`/property/${listing.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <span className="text-neutral-400">No image available</span>
            </div>
          )}
          {listing.is_verified && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              Verified
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-neutral-800 mb-1 truncate">
            {listing.title}
          </h3>
          
          <p className="text-neutral-600 text-sm mb-2">
            {listing.location.locality}, {listing.location.city}
          </p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-primary font-semibold">
              {formatCurrency(listing.price)}
            </span>
            <span className="text-neutral-500 text-sm">
              {listing.area} sq.ft
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-neutral-500">
            {listing.bedrooms && (
              <span>{listing.bedrooms} Beds</span>
            )}
            {listing.bathrooms && (
              <span>{listing.bathrooms} Baths</span>
            )}
            {listing.parking_spots && (
              <span>{listing.parking_spots} Parking</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyListingCard; 