
import React from 'react';
import { IconMapPin } from '../../../constants'; // Assuming IconMapPin is available
import { CommercialPropertyType, ListingType, PropertyCategory, PropertyListing, ResidentialPropertyType } from '../../../types';
import Button from '../../Button';
import Card from './Card'; // Assuming Card component can be reused or adapted

interface PropertyListingCardProps {
  listing: PropertyListing;
}

const PropertyListingCard: React.FC<PropertyListingCardProps> = ({ listing }) => {
  const displayPrice = listing.listingType === ListingType.RENT 
    ? `₹${(listing.rentPerMonth || 0).toLocaleString()}/month` 
    : `₹${listing.price.toLocaleString()}`;

  let propertyTypeDisplay = '';
  if (listing.propertyCategory === PropertyCategory.RESIDENTIAL) {
    // Safely access residentialType, use a fallback if undefined
    const type = listing.residentialType || ResidentialPropertyType.APARTMENT;
    propertyTypeDisplay = `${listing.bedrooms} BHK ${type}`;
  } else if (listing.propertyCategory === PropertyCategory.COMMERCIAL) {
    propertyTypeDisplay = listing.commercialType || CommercialPropertyType.OFFICE_SPACE;
  } else if (listing.propertyCategory === PropertyCategory.PLOT){
    propertyTypeDisplay = 'Plot';
  }


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <img 
        src={listing.images[0] || 'https://picsum.photos/seed/defaultprop/600/400'} 
        alt={listing.title} 
        className="w-full h-48 object-cover"
        onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/errorprop/600/400')}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-primary mb-1 truncate" title={listing.title}>{listing.title}</h3>
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <IconMapPin className="w-4 h-4 mr-1 text-primary-dark flex-shrink-0" />
          <span className="truncate">{listing.location.locality}, {listing.location.city}</span>
        </div>
        
        <p className="text-sm text-neutral-600 mb-1">{propertyTypeDisplay}</p>
        <p className="text-sm text-neutral-600 mb-3">{listing.areaSqFt.toLocaleString()} sq. ft.</p>

        <p className="text-xl font-bold text-neutral-800 mb-3">{displayPrice}</p>
        
        {listing.isOwnerListing && (
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full mb-3 self-start">
                Owner Listing - No Brokerage
            </span>
        )}

        <div className="mt-auto flex justify-between items-center">
          <Button variant="primary" size="sm" onClick={() => alert(`Contact for: ${listing.title}`)}>Contact Owner</Button>
          <span className="text-xs text-neutral-400">Posted: {new Date(listing.postedDate).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default PropertyListingCard;