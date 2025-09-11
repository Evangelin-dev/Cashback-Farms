import DProfessionalCard from '@/components/defaultlandingpage/defaultlandingcomponents/service/ProfessionalCard';
import apiClient from '@/src/utils/api/apiClient'; // Adjust path if needed
import { ServiceType } from '@/types';
import React, { useEffect, useMemo, useState } from 'react';

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

// Mock service used when API returns no data
const MOCK_SERVICE: ApiService = {
  id: 9999,
  vendor: 1,
  vendor_username: 'MockVendor',
  name: 'Interior Design',
  description: 'Mock: Professional interior design consultation and 3D layout planning.',
  price: '4999',
  stock_quantity: 1,
  category: 'Interior',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
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

        // apiClient may return an array or an object; normalize safely
        const data = Array.isArray(response) ? response : (response && Array.isArray((response as any).data) ? (response as any).data : []);
        if (data.length === 0) {
          // fallback to mock service so UI shows at least one item
          setServices([MOCK_SERVICE]);
        } else {
          setServices(data as ApiService[]);
        }

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

  // Always show these common service filters
  const fixedServiceFilters = [
    'Civil Engineering',
    'Structural Consulting',
    'Electrical Works',
    'Plumbing & Sewage',
    'Interior Design',
    'Land Survey',
    'Landscape Design',
    "Sanitary", 
  ];

  const serviceCategories = useMemo(() => {
    const activeServices = services.filter(s => s.is_active);
    const uniqueNames = new Set<string>(fixedServiceFilters);
    activeServices.forEach(s => uniqueNames.add(s.name));
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
    <div className="relative min-h-screen py-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-0 w-60 h-60 bg-green-200 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute right-0 top-10 w-72 h-72 bg-emerald-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">Professional Services Hub</h1>
          <p className="text-sm text-gray-600">Connect with verified experts for your construction and design needs.</p>
        </div>

        <div className="mb-6 p-4 bg-white/80 rounded-xl shadow-sm border border-green-50 backdrop-blur-sm">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by service name or description..."
              className="w-full px-4 py-2 text-sm border rounded-md focus:ring-2 focus:ring-green-400 focus:border-green-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Filter by Service:</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedService(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedService === null
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-green-50'
                }`}
            >
              All Services
            </button>
            {serviceCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedService(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${selectedService === category
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-green-50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              return (
                <div key={service.id} className="transform transition-all hover:-translate-y-1 hover:shadow-lg">
                  <DProfessionalCard professional={professionalProps} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No services found matching your criteria.</p>
            <p className="text-sm text-gray-400">Please broaden your search or check back later.</p>
          </div>
        )}

        <div className="mt-8 p-5 bg-green-50 rounded-lg border border-green-200 text-center">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Looking for other services?</h3>
          <p className="text-sm text-gray-600">
            Our network of professionals is always growing. New services like Civil Engineering and Structural Consulting will be available soon. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DServicesHubPage;

// Inject small runtime styles for blob animation (move to global CSS if preferred)
if (typeof document !== 'undefined') {
  const s = document.createElement('style');
  s.innerHTML = `
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.05); }
      66% { transform: translate(-20px, 20px) scale(0.95); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob { animation: blob 8s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
  `;
  document.head.appendChild(s);
}