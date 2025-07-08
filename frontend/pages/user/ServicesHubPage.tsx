import React, { useMemo, useState, useEffect } from 'react';
import apiClient from '@/src/utils/api/apiClient'; // Adjust path if needed
import DProfessionalCard from '@/components/defaultlandingpage/defaultlandingcomponents/service/ProfessionalCard';
import { ServiceType } from '@/types';

// This type definition correctly matches the data structure from your API
type ApiService = {
  id: number;
  vendor: number;
  vendor_username: string;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const DServicesHubPage: React.FC = () => {
  const [services, setServices] = useState<ApiService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          throw new Error("User authentication is required.");
        }

        // --- THE FIX IS HERE ---
        // The API endpoint is now updated to the correct one you provided.
        const response = await apiClient.get<ApiService[]>('/ecommerce/services/?category=service', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setServices(response || []);

      } catch (err: any) {
        setError("Failed to load services. Please try again later.");
        console.error("Error fetching services:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // --- The rest of the component remains unchanged as it's already correct ---

  const serviceCategories = useMemo(() => {
    const activeServices = services.filter(s => s.is_active);
    const uniqueNames = new Set(activeServices.map(s => s.name));
    return Array.from(uniqueNames);
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      if (!service.is_active) {
        return false;
      }
      const matchesService = !selectedService || service.name === selectedService;
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesService && matchesSearch;
    });
  }, [services, selectedService, searchTerm]);


  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-500">Loading Professional Services...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center bg-red-50 p-6 rounded-lg">
        <h1 className="text-xl font-bold text-red-700">An Error Occurred</h1>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Professional Services Hub</h1>
        <p className="mt-2 text-lg text-gray-600">Connect with verified experts for your construction and design needs.</p>
      </div>

      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by service name or description..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Filter by Service:</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedService(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedService === null
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            All Services
          </button>
          {serviceCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedService(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedService === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => {
            const professionalProps = {
              id: String(service.id),
              name: service.name,
              service: service.name as ServiceType,
              specialization: `Provided by: ${service.vendor_username}`,
              rate: `Starts at ₹${parseFloat(service.price).toLocaleString('en-IN')}`,
              imageUrl: `https://picsum.photos/seed/${service.id}/400/300`,
              rating: 4.5,
              bio: service.description,
              portfolioImages: []
            };

            return <DProfessionalCard key={service.id} professional={professionalProps} />;
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No services found matching your criteria.</p>
          <p className="text-gray-400">Please broaden your search or check back later.</p>
        </div>
      )}

      <div className="mt-10 p-6 bg-green-50 rounded-lg border border-green-200 text-center">
        <h3 className="text-xl font-semibold text-green-700 mb-3">Looking for other services?</h3>
        <p className="text-gray-600 mb-4">
          Our network of professionals is always growing. New services like Civil Engineering and Structural Consulting will be available soon. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default DServicesHubPage;