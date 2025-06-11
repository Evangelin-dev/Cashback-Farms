import React, { useState, useEffect } from 'react';
import { IconSearch } from '../constants';
import { ListingType, PropertyCategory } from '../types';
import PropertyListingCard from '../components/PropertyListingCard';
import Button from '../components/Button';
import Card from '../components/Card';
import apiService, { Property } from '../services/api';

const HomePage: React.FC = () => {
  const [activeListingType, setActiveListingType] = useState<ListingType>(ListingType.BUY);
  const [city, setCity] = useState<string>('Bengaluru');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [activeListingType, city, propertyType]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        listing_type: activeListingType,
        city: city,
      };
      
      if (propertyType) {
        params.category = propertyType;
      }

      const data = await apiService.getProperties(params);
      setProperties(data);
    } catch (err) {
      setError('Failed to fetch properties. Please try again later.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProperties();
  };

  return (
    <div className="space-y-8">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-light p-6 md:p-10 rounded-lg shadow-xl text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Find Your Perfect Property</h1>
        <p className="text-center text-primary-light/90 mb-6 md:mb-8">Zero Brokerage on Owner Properties. Buy, Sell, Rent with Ease.</p>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          {/* Buy/Rent Tabs */}
          <div className="flex border-b border-neutral-200 mb-4">
            {(Object.values(ListingType) as ListingType[]).map(type => (
              <button
                key={type}
                onClick={() => setActiveListingType(type)}
                className={`flex-1 py-3 text-sm sm:text-base font-semibold transition-colors duration-150
                            ${activeListingType === type 
                              ? 'border-b-2 border-primary text-primary' 
                              : 'text-neutral-500 hover:text-primary'}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 items-end">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">City</label>
              <select 
                id="city" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="searchTerm" className="block text-sm font-medium text-neutral-700 mb-1">Locality / Project / Landmark</label>
              <input 
                type="text" 
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., Koramangala or Prestige Lakeside"
                className="w-full p-2.5 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
               <Button 
                variant="primary" 
                size="lg" 
                className="w-full py-2.5"
                onClick={handleSearch}
                leftIcon={<IconSearch className="w-5 h-5"/>}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Listings Section */}
      <div>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-1">
            Properties {activeListingType === ListingType.BUY ? "for Sale" : "for Rent"} in {city}
        </h2>
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-neutral-500">Loading properties...</p>
          </div>
        ) : error ? (
          <Card>
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          </Card>
        ) : properties.length > 0 ? (
          <>
            <p className="text-neutral-500 mb-6">
              Showing {properties.length} properties.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map(property => (
                <PropertyListingCard key={property.id} listing={property} />
              ))}
            </div>
          </>
        ) : (
          <Card>
            <div className="text-center py-10">
              <IconSearch className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Properties Found</h3>
              <p className="text-neutral-500">Try adjusting your search filters or check back later.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomePage; 