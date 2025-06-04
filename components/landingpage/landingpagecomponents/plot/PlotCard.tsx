import React from 'react';
import { Link } from 'react-router-dom';
import { Plot, PlotType } from '../../../../types';
// FIX: Icons are functional components and should be used as JSX tags.
import { LocationMarkerIcon, CheckBadgeIcon,  , RupeeIcon } from '../../../../constants.tsx';
import CardShell from '../../../common/CardShell';
import Button from '../../..//common/Button';

interface PlotCardProps {
  plot: Plot;
}

const PlotCard: React.FC<PlotCardProps> = ({ plot }) => {
  return (
    <CardShell className="flex flex-col">
      <img src={plot.imageUrl} alt={plot.title} className="w-full h-48 object-cover"/>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{plot.title}</h3>
        {plot.type === PlotType.VERIFIED && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2 self-start">
            {/* FIX: Invoke CheckBadgeIcon as a JSX component */}
            <CheckBadgeIcon /> <span className="ml-1">Greenheap Verified</span>
            {plot.isFlagship && <span className="ml-1 font-bold">(Flagship)</span>}
          </span>
        )}
         {plot.type === PlotType.PUBLIC && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2 self-start">
            Public Listing
          </span>
        )}
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          {/* FIX: Invoke LocationMarkerIcon as a JSX component */}
          <LocationMarkerIcon /> {plot.location}
        </p>
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            {/* FIX: Invoke RupeeIcon as a JSX component */}
            <p className="text-gray-700 flex items-center"><RupeeIcon /> <span className="font-semibold">{plot.price > 0 ? plot.price.toLocaleString('en-IN') : 'Price on selection'}</span></p>
            {/* FIX: Invoke AreaIcon as a JSX component */}
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
        <div className="mt-auto">
          {plot.id === 'plot4-bms' || (plot.sqftPrice && plot.title.toLowerCase().includes("book my sqft")) ? (
             <Link to={`/book-my-sqft/bms-plot-alpha`}>
               <Button variant="primary" className="w-full">Book My SqFt</Button>
             </Link>
          ) : (
             <Link to={`/plots/${plot.id}`}>
               <Button variant="outline" className="w-full">View Details</Button>
             </Link>
          )}
        </div>
      </div>
    </CardShell>
  );
};

export default PlotCard;