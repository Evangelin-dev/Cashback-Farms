
import React, { useState, useMemo } from 'react';
import { MOCK_MATERIALS, MOCK_MATERIAL_CATEGORIES } from '../constants';
import MaterialCard from '../components/material/MaterialCard';
import { Material } from '../types';
import CardShell from '../components/common/CardShell';

const MaterialsStorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = useMemo(() => {
    return MOCK_MATERIALS.filter(material => {
      const matchesCategory = !selectedCategory || material.category === selectedCategory;
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            material.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

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
          {MOCK_MATERIAL_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.name 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
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
          <p className="text-xl text-gray-500">No materials found for "{selectedCategory || 'All Categories'}"{searchTerm && ` with search "${searchTerm}"`}.</p>
          <p className="text-gray-400">Try a different category or search term.</p>
        </div>
      )}
    </div>
  );
};

export default MaterialsStorePage;
    