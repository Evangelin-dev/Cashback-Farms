import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// --- API Client and Types ---
import apiClient from '@/src/utils/api/apiClient';
import { Plot, Professional } from '@/types';

// --- Reusable Components ---
import Button from '@/components/Button';
import DAssistedPlans from '@/components/defaultlandingpage/defaultlandingcomponents/assistedplans/assistedplans';
import DPlotCard from '@/components/defaultlandingpage/defaultlandingcomponents/plot/PlotCard';
import DProfessionalCard from '@/components/defaultlandingpage/defaultlandingcomponents/service/ProfessionalCard';

// --- Slider Data ---
const slides = [
  {
    headline: "💰 Earn Rental Yields for Up to 30 Years!",
    subtext: "Secure your future with our long-term rental income plans.",
    ctaText: "Know More",
    ctaLink: "/services",
    image: '/images/EarnRentaYieldsfo.png',
  },
  {
    headline: "🏡 Owning a Plot Was Never This Easy!",
    subtext: "Verified listings, transparent pricing, and easy booking — all in one place.",
    ctaText: "Explore Plots",
    ctaLink: "/plots",
    image: '/images/OwningaPlotWasNeverThisEasy.png',
  },
  {
    headline: "🌱 Let Your Plot Earn For You",
    subtext: "Invest in Greenheap-verified properties and enjoy assured returns.",
    ctaText: "Start Earning",
    ctaLink: "/services",
    image: '/images/LetYourPlotEarn.png',
  },
  {
    headline: "🌿 Book Your Farm House Today",
    subtext: "Weekend getaway or long-term investment — find your ideal plot.",
    ctaText: "Book Now",
    ctaLink: "/plots",
    image: '/images/BookYourFarmHouseToday.png',
  },
];

// Debounce helper function to limit API calls while typing
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const DefaultLanding: React.FC = () => {
  // --- State Management ---
  const [featuredPlots, setFeaturedPlots] = useState<Plot[]>([]);
  const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- Geolocation State ---
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting...');

  // --- NEW: Location Search Autocomplete State ---
  const [searchInput, setSearchInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  // --- Effects ---

  // Auto-playing slider effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  // --- NEW: Geoapify Autocomplete API Call ---
  const fetchLocationSuggestions = useCallback(
    debounce(async (text: string) => {
      if (!GEOAPIFY_API_KEY) { console.error("Geoapify API key is missing."); return; }
      if (!text || text.length < 3) { setLocationSuggestions([]); return; }

      setIsLocationLoading(true);
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setLocationSuggestions(data.features || []);
      } catch (error) {
        console.error("Error fetching Geoapify suggestions:", error);
        setLocationSuggestions([]);
      } finally {
        setIsLocationLoading(false);
      }
    }, 400), // 400ms debounce delay
    [GEOAPIFY_API_KEY]
  );

  // Effect to trigger autocomplete search when user types in the search input
  useEffect(() => {
    if (searchInput.length > 2) {
      fetchLocationSuggestions(searchInput);
    } else {
      setLocationSuggestions([]);
    }
  }, [searchInput, fetchLocationSuggestions]);

  // Fetch initial page data (featured plots, services, and user's current location)
  useEffect(() => {
    const fetchFeaturedData = async () => {
      setIsLoading(true);
      try {
        const [plotsResponse, servicesResponse] = await Promise.all([
          apiClient.get('/public/plots/'),
          apiClient.get('/public/services/')
        ]);

        const allPlots = (plotsResponse || []).map((plot: any) => ({
          id: plot.id,
          title: plot.title,
          location: plot.location,
          area: Number(plot.total_area_sqft),
          price: Number(plot.price_per_sqft),
          imageUrl: plot.plot_file || `https://picsum.photos/seed/${plot.id}/400/300`,
          type: plot.is_verified ? 'VERIFIED' : 'PUBLIC',
          description: plot.description || `A prime plot in ${plot.location}.`
        }));
        setFeaturedPlots(allPlots.slice(0, 3));

        const allServices = (servicesResponse || []).map((service: any) => ({
          id: service.id,
          name: service.vendor_username,
          service: service.name,
          specialization: service.description,
          rate: `₹${Number(service.price).toLocaleString('en-IN')}`,
          imageUrl: `https://picsum.photos/seed/${service.vendor_username}/400/300`,
          rating: 4.5,
        })).reverse();
        setFeaturedProfessionals(allServices.slice(0, 3));

      } catch (error) {
        console.error("Failed to fetch featured data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCurrentLocation = () => {
      if (!navigator.geolocation) {
        setCurrentLocation('Geolocation is not supported.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                referrerPolicy: 'no-referrer',
                headers: { 'User-Agent': 'GreenheapWebApp/1.0' },
              }
            );
            if (!response.ok) throw new Error('Failed to reverse geocode');
            const data = await response.json();
            const locationName = data.address?.city || data.address?.state_district || data.address?.county || 'Location Found';
            setCurrentLocation(locationName);
          } catch (error) {
            setCurrentLocation('Could not determine location.');
          }
        },
        () => { setCurrentLocation('Location access denied.'); }
      );
    };

    fetchFeaturedData();
    fetchCurrentLocation();
  }, []);

  // --- NEW: Handler for Search Button Click ---
  const handleSearch = () => {
    if (searchInput.trim()) {
      // Redirect to the plots page with the search term as a query parameter
      window.location.href = `/plots?search=${encodeURIComponent(searchInput)}`;
    }
  };

  // --- Main Component JSX ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- REVISED Hero Section --- */}
      <section className="relative h-[70vh] md:h-[60vh] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-green-700 md:hidden"></div>
            <img
              src={slide.image}
              alt={slide.headline}
              className="hidden md:block w-full h-full object-fill"
            />
            <div className="md:hidden absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-20">
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{slide.headline}</h1>
              <p className="text-lg text-white/90 mb-8 max-w-2xl">{slide.subtext}</p>
              <Link to={slide.ctaLink}><Button size="lg" className="bg-black text-green-700 font-bold hover:bg-green-100 shadow-lg">{slide.ctaText}</Button></Link>
            </div>
            <div className="hidden md:flex w-full justify-center absolute bottom-8 z-20">
              <Link to={slide.ctaLink}><Button size="lg" variant="secondary" className="text-green-700 hover:bg-green-200 shadow-lg animate-fade-in">{slide.ctaText}</Button></Link>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* --- REVISED Search Section --- */}
      <section className="bg-white py-8 shadow-sm border-b border-green-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center mb-3 text-sm text-gray-600">
            <span className="mr-2">📍</span><span>Current Location: <span className="font-semibold text-green-700">{currentLocation}</span></span>
          </div>

          <div className="w-full flex flex-col items-center gap-2">
            {/* NEW: Autocomplete Search Input */}
            <div
              className="relative w-full"
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            >
              <input
                type="text"
                className="w-full border rounded px-4 py-3 text-base"
                placeholder="Search by city, locality, or landmark..."
                value={searchInput}
                onChange={e => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                autoComplete="off"
              />
              {isLocationLoading && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">...</span>}

              {showSuggestions && locationSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {locationSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onMouseDown={() => {
                        const selectedAddress = suggestion.properties.formatted;
                        setSearchInput(selectedAddress);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion.properties.formatted}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              className="w-full mt-2 bg-green-600 text-white rounded px-4 py-3 font-semibold hover:bg-green-700"
              onClick={handleSearch}
            >
              Search Plots
            </button>
          </div>
        </div>
      </section>

      {/* --- Featured Plots Section --- */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Featured Plots</h2>
          {isLoading ? (
            <div className="text-center text-gray-500">Loading plots...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPlots.map(plot => <DPlotCard key={plot.id} plot={plot} />)}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/plots"><Button variant="outline">View All Plots</Button></Link>
          </div>
        </div>
      </section>

      {/* --- Other Sections --- */}
      <section className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-green-700 mb-4">Introducing Book My SqFt!</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">Don't want to buy a whole plot? Now you can book the exact square footage you need. Flexible, affordable, and transparent.</p>
          <Link to="/mysqft-listing"><Button size="lg" variant="primary">Explore Book My SqFt</Button></Link>
        </div>
      </section>
      <section className="py-12 bg-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><DAssistedPlans /></div></section>

      {/* --- Featured Professionals Section --- */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Hire Top Professionals</h2>
          {isLoading ? (
            <div className="text-center text-gray-500">Loading professionals...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProfessionals.map(prof => <DProfessionalCard key={prof.id} professional={prof} />)}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/services"><Button variant="primary">Find Professionals</Button></Link>
          </div>
        </div>
      </section>

      {/* --- NEW: Styles for the suggestions dropdown --- */}
      <style>{`
        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          list-style: none;
          margin-top: 0.25rem;
          padding: 0;
          z-index: 10;
          max-height: 250px;
          overflow-y: auto;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .suggestions-list li {
          padding: 0.75rem 1rem;
          cursor: pointer;
          font-size: 1rem;
        }
        .suggestions-list li:hover {
          background-color: #f7fafc;
        }
      `}</style>
    </div>
  );
};

export default DefaultLanding;