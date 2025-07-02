import React, { useState, useMemo, useEffect } from 'react';
import apiClient from '../../../src/utils/api/apiClient'; // Assuming you have this API client set up

// Assuming Plot and PlotType are defined like this. Adjust if necessary.
import { Plot, PlotType } from '../../../types'; 
import Button from '../../../components/common/Button';
import DPlotCard from '../defaultlandingcomponents/plot/PlotCard';
import { FaSpinner } from 'react-icons/fa'; // Example for a loading spinner

const DPlotMarketplacePage: React.FC = () => {
  // State for fetched data, loading, and errors
  const [allPlots, setAllPlots] = useState<Plot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filtering and searching remains the same
  const [filter, setFilter] = useState<'all' | PlotType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get('/public/plots/');
        const data = response || []; // Ensure data is an array

        // Map the raw API data to the structure your 'Plot' type expects
        const mappedPlots: Plot[] = data.map((apiPlot: any) => ({
          id: apiPlot.id,
          title: apiPlot.title,
          location: apiPlot.location,
          area: Number(apiPlot.total_area_sqft),
          price: Number(apiPlot.price_per_sqft),
          imageUrl: apiPlot.plot_file || 'https://picsum.photos/seed/placeholder/400/300', // Use a placeholder if no image
          type: apiPlot.is_verified ? PlotType.VERIFIED : PlotType.PUBLIC,
          // Add other fields from your Plot type if needed, e.g., owner
          ownerName: apiPlot.owner_name,
        }));
        
        setAllPlots(mappedPlots.reverse());
      } catch (err) {
        console.error("Failed to fetch plots:", err);
        setError("Could not load plots. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlots();
  }, []); // Empty dependency array means this runs only once on mount

  // This useMemo now filters the live data from the `allPlots` state
  const filteredPlots = useMemo(() => {
    return allPlots.filter(plot => {
      const matchesFilter = filter === 'all' || plot.type === filter;
      const matchesSearch = plot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            plot.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [allPlots, filter, searchTerm]); // It now depends on `allPlots`

  // Render a loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
            <FaSpinner className="animate-spin text-green-700 text-5xl mx-auto" />
            <p className="mt-4 text-lg text-gray-600">Loading Plots...</p>
        </div>
      </div>
    );
  }

  // Render an error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600">Oops! Something went wrong.</h2>
            <p className="mt-2 text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Main component render (same as before)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Plot Marketplace</h1>
        <p className="mt-2 text-lg text-gray-600">Discover your ideal piece of land.</p>
      </div>

      {/* Filters and Search */}
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
      
      {/* Plot Listings */}
      {filteredPlots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlots.map(plot => (
            <DPlotCard key={plot.id} plot={plot} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <img src="https://picsum.photos/seed/empty/300/200" alt="No plots found" className="mx-auto mb-4 rounded-lg" />
          <p className="text-xl text-gray-500">No plots found matching your criteria.</p>
          <p className="text-gray-400">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default DPlotMarketplacePage;