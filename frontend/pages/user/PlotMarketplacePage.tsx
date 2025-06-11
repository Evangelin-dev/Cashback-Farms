
import React, { useState, useMemo } from 'react';
import { MOCK_PLOTS } from '../../constants';
import PlotCard from '../../components/landingpage/landingpagecomponents/plot/PlotCard';
import { Plot, PlotType } from '../../types';
import Button from '../../components/common/Button.tsx';

const PlotMarketplacePage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | PlotType>( 'all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlots = useMemo(() => {
    return MOCK_PLOTS.filter(plot => {
      const matchesFilter = filter === 'all' || plot.type === filter;
      const matchesSearch = plot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            plot.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

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
    </div>
  );
};

export default PlotMarketplacePage;
    