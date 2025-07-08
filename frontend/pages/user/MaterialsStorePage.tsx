import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from "@/src/utils/api/apiClient";
import { useAuth } from '../../contexts/AuthContext.tsx';

// UI Components
import CardShell from '../../components/common/CardShell.tsx';
import Button from '../../components/common/Button.tsx';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';

// Type Definitions
interface Material {
  id: number;
  vendor_username: string;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  category: string;
  is_active: boolean;
  moq: number; // Assuming MOQ and ImageUrl are part of the type
  imageUrl: string;
}

interface ShortlistItem {
  id: number;
  item_id: number;
}

const MaterialsStorePage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [shortlistedItems, setShortlistedItems] = useState<ShortlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const { currentUser } = useAuth();

  const fetchShortlist = useCallback(async () => {
    if (!currentUser) return;
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    try {
      const response = await apiClient.get('/cart/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setShortlistedItems(response || []);
    } catch (err) {
      console.error("Could not refresh shortlist:", err);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      setError(null);
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("Authorization token not found.");
        setIsLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${accessToken}` };

      try {
        const [materialsResponse, shortlistResponse] = await Promise.all([
          apiClient.get('/materials/', { headers }),
          apiClient.get('/cart/', { headers })
        ]);

        setMaterials(materialsResponse || []);
        setShortlistedItems(shortlistResponse || []);

      } catch (err) {
        setError("Failed to fetch materials. Please try refreshing the page.");
        console.error("Error fetching materials:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
        fetchPageData();
    } else {
        setIsLoading(false);
    }
  }, [currentUser]);

  const handleAddToWishlist = async (materialId: number) => {
    setSubmittingId(materialId);
    const accessToken = localStorage.getItem("access_token");

    const payload = {
      item_type: "material",
      item_id: materialId,
      quantity: 1,
    };

    try {
      await apiClient.post('/cart/add/', payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await fetchShortlist();
    } catch (error) {
      console.error("Failed to add material to wishlist:", error);
      alert("There was an error adding this item.");
    } finally {
      setSubmittingId(null);
    }
  };

  const materialCategories = useMemo(() => {
    if (materials.length === 0) return [];
    const categories = new Set(materials.map(m => m.category));
    return Array.from(categories);
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      if (!material.is_active) return false;
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
      
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredMaterials.map(material => {
            const isAlreadyShortlisted = shortlistedItems.some(item => item.item_id === material.id);
            const isCurrentlySubmitting = submittingId === material.id;
            
            return (
                <CardShell key={material.id} className="relative">
                    {currentUser && (
                        <button
                          onClick={() => handleAddToWishlist(material.id)}
                          disabled={isAlreadyShortlisted || isCurrentlySubmitting}
                          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 backdrop-blur-sm transition-colors disabled:cursor-not-allowed"
                          aria-label="Add to wishlist"
                        >
                          {isAlreadyShortlisted ? (
                            <SolidHeartIcon className="w-6 h-6 text-red-500" />
                          ) : (
                            <OutlineHeartIcon className="w-6 h-6 text-gray-700 hover:text-red-500" />
                          )}
                        </button>
                    )}
                    <img src={material.imageUrl || 'https://picsum.photos/seed/material/300/200'} alt={material.name} className="w-full h-40 object-cover"/>
                    <div className="p-4">
                        <h3 className="text-md font-semibold text-gray-800 mb-1 truncate">{material.name}</h3>
                        <p className="text-xs text-gray-500 mb-1 capitalize">Category: {material.category}</p>
                        <p className="text-sm text-green-600 font-bold mb-1">₹{parseFloat(material.price).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500 mb-1">MOQ: {material.moq}</p>
                        <p className="text-xs text-gray-500 mb-2">Vendor: {material.vendor_username}</p>
                        <Link to={`/materials/${material.id}`}>
                        <Button variant="outline" size="sm" className="w-full">View Details</Button>
                        </Link>
                    </div>
                </CardShell>
            );
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