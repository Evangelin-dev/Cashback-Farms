import React, { useState, useMemo, useEffect } from 'react';
import apiClient from '../../../src/utils/api/apiClient'; // Ensure this path is correct
import { Material } from '../../../types'; // Assuming you have a Material type
import MaterialCard from '../defaultlandingcomponents/material/MaterialCard';
import { FaSpinner } from 'react-icons/fa'; // Example for a loading spinner

const DMaterialsStorePage: React.FC = () => {
  // State for fetched data, loading, and errors
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filtering and searching remains the same
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/public/materials/'); // Assuming this is the correct endpoint
        const data = response || [];

        // Map the raw API data to the structure your 'Material' type expects
        const mappedMaterials: Material[] = data.map((apiMaterial: any) => ({
          id: apiMaterial.id,
          name: apiMaterial.name,
          vendor: apiMaterial.vendor_username, // Using vendor_username as the vendor
          price: Number(apiMaterial.price),
          category: apiMaterial.category,
          imageUrl: apiMaterial.image_url || `https://picsum.photos/seed/${apiMaterial.name}/400/300`, // Placeholder image
          // Add any other fields your MaterialCard expects
        }));

        setAllMaterials(mappedMaterials.reverse());

        // Dynamically create a unique list of categories from the fetched data
        const uniqueCategories = [...new Set(mappedMaterials.map(m => m.category))];
        setCategories(uniqueCategories);

      } catch (err) {
        console.error("Failed to fetch materials:", err);
        setError("Could not load materials. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []); // Empty dependency array means this runs only once on mount

  // This useMemo now filters the live data from the `allMaterials` state
  const filteredMaterials = useMemo(() => {
    return allMaterials.filter(material => {
      const matchesCategory = !selectedCategory || material.category === selectedCategory;
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            material.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allMaterials, selectedCategory, searchTerm]); // It now depends on `allMaterials`

  // Render a loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
            <FaSpinner className="animate-spin text-green-700 text-5xl mx-auto" />
            <p className="mt-4 text-lg text-gray-600">Loading Materials...</p>
        </div>
      </div>
    );
  }

  // Render an error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600">Failed to Load Store</h2>
            <p className="mt-2 text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Construction Materials Store</h1>
        <p className="mt-2 text-lg text-gray-600">Find all your building material needs in one place.</p>
      </div>

      {/* Categories & Search */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="mb-6">
            <input 
                type="text"
                placeholder="Search materials by name or vendor..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Browse by Category:</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          {/* Map over the dynamic categories from the API */}
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`capitalize px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Material Listings */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMaterials.map(material => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      ) : (
         <div className="text-center py-12">
          <img src="https://picsum.photos/seed/no-materials/300/200" alt="No materials found" className="mx-auto mb-4 rounded-lg" />
          <p className="text-xl text-gray-500">No materials found matching your criteria.</p>
          <p className="text-gray-400">Try a different category or search term.</p>
        </div>
      )}
    </div>
  );
};

export default DMaterialsStorePage;