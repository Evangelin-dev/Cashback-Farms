import React, { useState, useMemo, useEffect } from 'react';
import apiClient from '../../src/utils/api/apiClient';
import PlotCard from '../../components/landingpage/landingpagecomponents/plot/PlotCard';
import { Plot, PlotType } from '../../types';
import Button from '../../components/common/Button.tsx';

const PlotMarketplacePage: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<'all' | PlotType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlots = async () => {
      // --- FIX STARTS HERE ---
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setError("You must be logged in to view plots.");
        setIsLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${accessToken}` };
      // --- FIX ENDS HERE ---

      try {
        setIsLoading(true);
        setError(null);
        // Pass the headers with the request
        const response = await apiClient.get('/plots/', { headers });
        
        const formattedPlots: Plot[] = response.map((apiPlot: any) => ({
          id: apiPlot.id.toString(),
          title: apiPlot.title,
          location: apiPlot.location,
          area: parseFloat(apiPlot.total_area_sqft),
          sqftPrice: parseFloat(apiPlot.price_per_sqft),
          price: parseFloat(apiPlot.total_area_sqft) * parseFloat(apiPlot.price_per_sqft),
          type: apiPlot.is_verified ? PlotType.VERIFIED : PlotType.PUBLIC,
          imageUrl: apiPlot.plot_file || ``,
          description: `A prime piece of land located in ${apiPlot.location}, owned by ${apiPlot.owner_name}.`,
          amenities: apiPlot.joint_owners.length > 0 ? ['Joint Ownership'] : [],
        }));
        
        setPlots(formattedPlots);
      } catch (err) {
        setError('Failed to fetch plots. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlots();
  }, []);

  const filteredPlots = useMemo(() => {
    return plots.filter(plot => {
      const matchesFilter = filter === 'all' || plot.type === filter;
      const matchesSearch = plot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            plot.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [plots, filter, searchTerm]);

  // --- Unchanged JSX from here down ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Plot Marketplace</h1>
        <p className="mt-2 text-lg text-gray-600">Discover your ideal piece of land.</p>
      </div>

      <div className="mb-8 p-4 bg-white rounded-lg shadow flex flex-col md:flex-row items-center gap-4">
        <div className="flex-grow w-full md:w-auto">
            <input 
                type="text"
                placeholder="Search by title or location..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex space-x-2">
          <Button variant={filter === 'all' ? 'primary' : 'outline'} onClick={() => setFilter('all')}>All Plots</Button>
          <Button variant={filter === PlotType.PUBLIC ? 'primary' : 'outline'} onClick={() => setFilter(PlotType.PUBLIC)}>Public Listings</Button>
          <Button variant={filter === PlotType.VERIFIED ? 'primary' : 'outline'} onClick={() => setFilter(PlotType.VERIFIED)}>Greenheap Verified</Button>
        </div>
      </div>
      
      {isLoading && <div className="text-center py-12 text-lg text-gray-500">Loading plots...</div>}
      {error && <div className="text-center py-12 text-lg text-red-500">{error}</div>}

      {!isLoading && !error && (
        <>
          {filteredPlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlots.map(plot => (
                <PlotCard key={plot.id} plot={plot} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <img src="https://picsum.photos/seed/empty/300/200" alt="No plots found" className="mx-auto mb-4 rounded-lg" />
              <p className="text-xl text-gray-500">No plots found matching your criteria.</p>
              <p className="text-gray-400">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlotMarketplacePage;