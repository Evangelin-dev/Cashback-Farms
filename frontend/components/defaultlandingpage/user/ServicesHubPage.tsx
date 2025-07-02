import React, { useEffect, useMemo, useState } from 'react';
import DProfessionalCard from '../../defaultlandingpage/defaultlandingcomponents/service/ProfessionalCard';
import { Professional } from '../../../types'; // Assuming you have a Professional type
import apiClient from '../../../src/utils/api/apiClient'; // Ensure this path is correct
import { FaSpinner } from 'react-icons/fa'; // For loading state

const DServicesHubPage: React.FC = () => {
  // State for fetched data, loading, and errors
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and searching
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/public/services/');
        const data = response || [];

        // Map the raw API data to the 'Professional' type structure
        const mappedServices: Professional[] = data.map((apiService: any) => ({
          id: apiService.id,
          name: apiService.vendor_username, // The vendor is the 'professional'
          service: apiService.name, // The service they offer
          specialization: apiService.description, // A good fit for specialization
          rate: `₹${Number(apiService.price).toLocaleString('en-IN')}`, // Format the price
          imageUrl: `https://picsum.photos/seed/${apiService.vendor_username}/400/300`, // Placeholder image
          rating: 4.5, // Default rating as API doesn't provide it
        }));

        // Reverse the array to show the latest entries first
        const reversedServices = mappedServices.reverse();
        setProfessionals(reversedServices);

        // Dynamically create a unique list of categories from the fetched data
        const uniqueCategories = [...new Set(reversedServices.map(p => p.service))];
        setServiceCategories(uniqueCategories);

      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError("Could not load services. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []); // Empty dependency array means this runs only once

  // Memoized filtering based on live data
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(prof => {
      const matchesService = !selectedService || prof.service === selectedService;
      // Search by professional's name (vendor) or the service name
      const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            prof.service.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesService && matchesSearch;
    });
  }, [professionals, selectedService, searchTerm]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-green-700 text-5xl" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Services</h2>
          <p className="mt-2 text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Professional Services Hub</h1>
        <p className="mt-2 text-lg text-gray-600">Connect with experts for your construction and design needs.</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by professional or service name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Filter by Service:</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedService(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedService === null
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Services
          </button>
          {/* Render category buttons dynamically */}
          {serviceCategories.map(type => (
            <button
              key={type}
              onClick={() => setSelectedService(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedService === type
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Professional Listings */}
      {filteredProfessionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfessionals.map(professional => (
            <DProfessionalCard key={professional.id} professional={professional} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <img src="https://picsum.photos/seed/no-pros/300/200" alt="No professionals found" className="mx-auto mb-4 rounded-lg" />
          <p className="text-xl text-gray-500">No professionals found matching your criteria.</p>
          <p className="text-gray-400">Please broaden your search or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default DServicesHubPage;