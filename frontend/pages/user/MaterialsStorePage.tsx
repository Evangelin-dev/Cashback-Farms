import React, { useState, useMemo, useEffect } from 'react';
import apiClient from "@/src/utils/api/apiClient"; // Ensure this path is correct
import MaterialCard from '../../components/landingpage/landingpagecomponents/material/MaterialCard.tsx'; // Ensure this path is correct

// Define a type for the material data from your API
type Material = {
  id: number;
  vendor_username: string;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  category: string;
  is_active: boolean;
};

const MaterialsStorePage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          throw new Error("Authorization token not found.");
        }

        const response = await apiClient.get<Material[]>('/materials/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        setMaterials(response || []);

      } catch (err) {
        setError("Failed to fetch materials. Please try refreshing the page.");
        console.error("Error fetching materials:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Dynamically generate categories from the fetched materials
  const materialCategories = useMemo(() => {
    if (materials.length === 0) return [];
    const categories = new Set(materials.map(m => m.category));
    return Array.from(categories);
  }, [materials]);

  // Filter materials based on the selected category and search term
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      // Filter out inactive materials so they don't show up for clients
      if (!material.is_active) {
        return false;
      }
      const matchesCategory = !selectedCategory || material.category === selectedCategory;
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            material.vendor_username.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [materials, selectedCategory, searchTerm]);


  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-500">Loading Materials...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center bg-red-50 p-6 rounded-lg">
        <h1 className="text-xl font-bold text-red-700">Something Went Wrong</h1>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-700">Construction Materials Store</h1>
        <p className="mt-2 text-lg text-gray-600">Find all your building material needs in one place.</p>
      </div>

      {/* Categories & Search */}
      <div className="mb-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="mb-6">
            <input 
                type="text"
                placeholder="Search materials by name or vendor..."
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Browse by Category:</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === null 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-800'
            }`}
          >
            All Categories
          </button>
          {materialCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Material Listings */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredMaterials.map(material => {
            // We need to map our API data to the props that MaterialCard expects.
            // Here, we assume MaterialCard needs a 'vendor' prop, so we map 'vendor_username' to it.
            const cardProps = {
                ...material,
                vendor: material.vendor_username
            };
            return <MaterialCard key={material.id} material={cardProps} />
          })}
        </div>
      ) : (
         <div className="text-center py-16">
          <p className="text-2xl font-semibold text-gray-600">No Materials Found</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or category filters.</p>
        </div>
      )}
    </div>
  );
};

export default MaterialsStorePage;