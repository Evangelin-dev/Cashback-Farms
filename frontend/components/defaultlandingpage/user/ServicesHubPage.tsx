import React, { useMemo, useState } from 'react';
import DProfessionalCard from '../../defaultlandingpage/defaultlandingcomponents/service/ProfessionalCard';
import { ExtendedServiceType, MOCK_PROFESSIONALS } from '../../../constants';
import { ServiceType } from '../../../../types';

const DServicesHubPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Add new service types for filtering
  const serviceTypes = [
    ...Object.values(ServiceType),
    ExtendedServiceType.BUY_SERVICE,
    ExtendedServiceType.SELL_SERVICE,
    ExtendedServiceType.COMMERCIAL_SERVICE,
  ];

  const filteredProfessionals = useMemo(() => {
    return MOCK_PROFESSIONALS.filter(prof => {
      const matchesService = !selectedService || prof.service === selectedService;
      const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prof.specialization && prof.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesService && matchesSearch;
    });
  }, [selectedService, searchTerm]);

  // For MVP, show all service types including new ones
  const mvpServiceTypes = [
    ServiceType.ARCHITECT,
    ServiceType.INTERIOR_DESIGNER,
    ExtendedServiceType.BUY_SERVICE,
    ExtendedServiceType.SELL_SERVICE,
    ExtendedServiceType.COMMERCIAL_SERVICE,
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Professional Services Hub</h1>
        <p className="mt-2 text-lg text-gray-600">Connect with verified experts for your construction and design needs.</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or specialization..."
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
            All Professionals
          </button>
          {mvpServiceTypes.map(type => (
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
          {filteredProfessionals
            .filter(prof => mvpServiceTypes.includes(prof.service as any))
            .map(professional => (
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
      <div className="mt-10 p-6 bg-green-50 rounded-lg border border-green-200 text-center">
        <h3 className="text-xl font-semibold text-green-700 mb-3">Looking for Civil Engineers or Structural Consultants?</h3>
        <p className="text-gray-600 mb-4">
          Listings for Civil Engineers and Structural Consultants will be available soon as we expand our network of verified professionals. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default DServicesHubPage;
