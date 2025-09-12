
import React from 'react';
import { IconMapPin } from '../../../constants';
import { SiteDetails } from '../../../types';
import Card from './Card';

interface SiteInfoCardProps {
  siteDetails: SiteDetails;
}

const SiteInfoCard: React.FC<SiteInfoCardProps> = ({ siteDetails }) => {
  return (
    <Card title="Project Site Information" className="h-full flex flex-col">
      <div className="flex-grow space-y-4">
        {siteDetails.sitePlanImageUrl && (
          <img 
            src={siteDetails.sitePlanImageUrl} 
            alt={`${siteDetails.name} Site Plan`}
            className="w-full h-48 object-cover rounded-lg mb-4 shadow"
          />
        )}
        <h4 className="text-xl font-semibold text-primary">{siteDetails.name}</h4>
        <div className="flex items-center text-neutral-600">
          <IconMapPin className="w-5 h-5 mr-2 text-primary-dark" />
          <span>{siteDetails.location}</span>
        </div>
        <p className="text-sm text-neutral-600 leading-relaxed">{siteDetails.description}</p>
        
        {siteDetails.amenities && siteDetails.amenities.length > 0 && (
          <div>
            <h5 className="font-semibold text-neutral-700 mb-2">Key Amenities:</h5>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-neutral-600">
              {siteDetails.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SiteInfoCard;
    