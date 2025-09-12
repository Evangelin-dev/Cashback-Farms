import apiClient from "@/src/utils/api/apiClient";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/contexts/AuthContext.tsx';

// UI Components
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import Button from '../../components/common/Button.tsx';
import CardShell from '../../components/common/CardShell.tsx';

// Type Definitions
interface Material {
  id: number;
  vendor_username: string;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  category: string;
  is_active?: boolean;
  status : string;
  moq: number;
  imageUrl: string;
}

interface ShortlistItem {
  id: number;
  item_id: number;
}

// Small auto-sliding image component used inside material cards
const AutoSlideImage: React.FC<{ imageUrl: string; name: string }> = ({ imageUrl, name }) => {
  const [current, setCurrent] = useState(0);
  const imgs = [
    imageUrl || `https://picsum.photos/seed/${name}/300/200`,
    `https://picsum.photos/seed/${name}1/300/200`,
    `https://picsum.photos/seed/${name}2/300/200`,
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % imgs.length), 2800);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <div className="relative w-full h-32 overflow-hidden rounded-md">
      {imgs.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${name}-${i}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          onError={e => (e.currentTarget.src = 'https://picsum.photos/300/200')}
        />
      ))}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {imgs.map((_, i) => (
          <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === current ? 'bg-green-500' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
};

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
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

      try {
        // Fetch public materials list (no auth required). If user is logged in, also fetch shortlist.
        const materialsResponse = await apiClient.get('/materials/', headers ? { headers } : undefined);
        let shortlistResponse: any[] = [];
        if (currentUser && headers) {
          shortlistResponse = await apiClient.get('/cart/', { headers });
        }

        setMaterials(materialsResponse || []);
        setShortlistedItems(shortlistResponse || []);
      } catch (err) {
        setError("Failed to fetch materials. Please try refreshing the page.");
        console.error("Error fetching materials:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Always try to fetch public materials; shortlist only loads for authenticated users.
    fetchPageData();
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

  // Always show these categories in the filter
  const fixedCategories = [
    "Cement & Concrete Products",
    "Bricks & Blocks",
    "Steel & Metals",
    "Sand & Aggregates",
    "Wood & Plywood",
    "Roofing Materials",
    "Paints & Finishes",
    "Plumbing", 
    "Sanitary", 
    "Electricals", 
    "Interior Designing", 
  ];

  const materialCategories = useMemo(() => {
    const categories = new Set<string>(fixedCategories);
    materials.forEach(m => categories.add(m.category));
    return Array.from(categories);
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      if (material.status !== 'Active') return false; 
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
    <div className="relative min-h-screen py-8">
      {/* background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-0 w-60 h-60 bg-green-200 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute right-0 top-10 w-72 h-72 bg-emerald-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/2 -bottom-16 w-80 h-80 bg-green-300 rounded-full opacity-18 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">Construction Materials Store</h1>
          <p className="text-sm text-gray-600">Find all your building material needs in one place.</p>
        </div>

        {/* If user is not logged in, show a gentle prompt that ordering requires login */}
        {!currentUser && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-center">
            Please login to proceed order
          </div>
        )}

        <div className="mb-6 p-4 bg-white/80 rounded-xl shadow-md border border-green-50 backdrop-blur-sm">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search materials by name or vendor..."
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Browse by Category:</h2>

          {/* Mobile: dropdown select */}
          <div className="md:hidden mb-3">
            <label htmlFor="mobile-category" className="sr-only">Select category</label>
            <select
              id="mobile-category"
              value={selectedCategory ?? ''}
              onChange={(e) => setSelectedCategory(e.target.value === '' ? null : e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-white"
            >
              <option value="">All Categories</option>
              {materialCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Desktop: pill buttons */}
          <div className="hidden md:flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${selectedCategory === null
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-green-50'
              }`}
            >
              All Categories
            </button>
            {materialCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 capitalize ${selectedCategory === category
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-green-50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMaterials.map(material => {
              const isAlreadyShortlisted = shortlistedItems.some(item => item.item_id === material.id);
              const isCurrentlySubmitting = submittingId === material.id;

              return (
                <CardShell key={material.id} className="relative overflow-hidden p-0">
                  {currentUser && (
                    <button
                      onClick={() => handleAddToWishlist(material.id)}
                      disabled={isAlreadyShortlisted || isCurrentlySubmitting}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110 disabled:cursor-not-allowed"
                      aria-label="Add to wishlist"
                    >
                      {isAlreadyShortlisted ? (
                        <SolidHeartIcon className="w-4 h-4 text-red-500" />
                      ) : (
                        <OutlineHeartIcon className="w-4 h-4 text-gray-700 hover:text-red-500" />
                      )}
                    </button>
                  )}
                  <AutoSlideImage imageUrl={material.imageUrl || `https://picsum.photos/seed/material${material.id}/300/200`} name={material.name} />
                  <div className="p-3 text-left">
                    <h3 className="text-sm font-semibold text-gray-800 mb-0.5 truncate">{material.name}</h3>
                    <p className="text-[10px] text-gray-500 mb-1 capitalize">Category: {material.category}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm text-green-600 font-bold">₹{parseFloat(material.price).toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-gray-500">MOQ: {material.moq}</div>
                      </div>
                      <div className="text-[10px] text-gray-500">{material.vendor_username}</div>
                    </div>
                    <div className="mt-2">
                      <Link to={`/materials/${material.id}`}>
                        <Button variant="outline" size="sm" className="w-full text-xs py-1">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </CardShell>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-semibold text-gray-600">No Materials Found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsStorePage;

// Inline styles for simple blob animations (if you have a global CSS file, consider moving these there)
const style = document.createElement('style');
style.innerHTML = `
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob { animation: blob 8s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
`.trim();
document.head.appendChild(style);