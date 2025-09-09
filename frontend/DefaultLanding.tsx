import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import apiClient from '@/src/utils/api/apiClient';
import { Plot, Professional } from '@/types';

// --- Reusable Components ---
import Button from './components/Button';
import DAssistedPlans from './components/defaultlandingpage/defaultlandingcomponents/assistedplans/assistedplans';
import DPlotCard from './components/defaultlandingpage/defaultlandingcomponents/plot/PlotCard';
import DProfessionalCard from './components/defaultlandingpage/defaultlandingcomponents/service/ProfessionalCard';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

// --- Slider Data ---
const slides = [
  {
    headline: "💰 Earn Rental Yields for Up to 30 Years!",
    subtext: "Secure your future with our long-term rental income plans.",
    ctaText: "Know More",
    ctaLink: "/Dmysqft-listing",
    image: '/images/EarnRentaYieldsfo.png',
  },
  {
    headline: "🏡 Owning a Plot Was Never This Easy!",
    subtext: "Verified listings, transparent pricing, and easy booking — all in one place.",
    ctaText: "Explore Plots",
    ctaLink: "/Dplots",
    image: '/images/OwningaPlotWasNeverThisEasy.png',
  },
  {
    headline: "🌱 Let Your Plot Earn For You",
    subtext: "Invest in Greenheap-verified properties and enjoy assured returns.",
    ctaText: "Start Earning",
    ctaLink: "/Dmysqft-listing",
    image: '/images/LetYourPlotEarn.png',
  },
  {
    headline: "🌿 Book Your Farm House Today",
    subtext: "Weekend getaway or long-term investment — find your ideal plot.",
    ctaText: "Book Now",
    ctaLink: "/Dplots",
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
          imageUrl: plot.plot_file || ``,
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
      window.location.href = `/Dplots?search=${encodeURIComponent(searchInput)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Hero Section (Unchanged) --- */}
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
              className="hidden md:block w-full h-full object-cover"
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
            <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 bg-white' : 'bg-white/50'}`} />
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
            <div className="relative w-full">
              <input
                type="text"
                className="w-full border rounded px-4 py-3 text-base"
                placeholder="Search by city, locality, or landmark..."
                value={searchInput}
                onChange={e => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true); // Re-open suggestions when user starts typing again
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
                        setLocationSuggestions([]);
                        setShowSuggestions(false); // Close dropdown on selection
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

      {/* --- Enhanced Featured Plots Section --- */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-green-400 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-green-400 rounded-lg rotate-45"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-green-400 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Plots</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <p className="mt-2">Loading featured plots...</p>
            </div>
          ) : (
            <>
              {/* Desktop Enhanced Grid */}
              <div className="hidden md:block">
                <div className="grid md:grid-cols-3 gap-8 relative">
                  {/* Connection Lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                          <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                        </linearGradient>
                      </defs>
                      <line x1="16.5" y1="50" x2="50" y2="50" stroke="url(#lineGradient)" strokeWidth="0.2" strokeDasharray="2,1" />
                      <line x1="50" y1="50" x2="83.5" y2="50" stroke="url(#lineGradient)" strokeWidth="0.2" strokeDasharray="2,1" />
                    </svg>
                  </div>

                  {featuredPlots.map((plot, index) => (
                    <div 
                      key={plot.id} 
                      className="relative transform transition-all duration-700 hover:scale-105"
                      style={{
                        animationDelay: `${index * 200}ms`
                      }}
                    >
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-xl transform scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Enhanced Plot Card Container */}
                      <div className="relative bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-gray-200/50 group hover:shadow-green-500/25 transition-all duration-500">
                        <DPlotCard plot={plot} />
                        
                        {/* Connection Point */}
                        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg 
                                      right-0 translate-x-2 opacity-80"></div>
                        
                        {index === 0 && (
                          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg 
                                        left-0 -translate-x-2 opacity-80"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Mobile Slider */}
              <div className="md:hidden">
                <div className="overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                  <div className="inline-flex gap-6 py-4 px-2">
                    {featuredPlots.map((plot, index) => (
                      <div key={plot.id} className="w-[85vw] flex-shrink-0 snap-center">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-gray-200/50">
                          <DPlotCard plot={plot} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 bg-gradient-to-r from-slate-900 to-transparent h-full pointer-events-none" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 bg-gradient-to-l from-slate-900 to-transparent h-full pointer-events-none" />
              </div>
            </>
          )}
          
          <div className="text-center mt-12">
            <Link to="/Dplots">
              <Button variant="outline" className="bg-transparent border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 px-8 py-3 text-lg font-semibold">
                View All Plots
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Enhanced Plot Type Cards Section --- */}
      <section className="py-16 bg-gradient-to-br from-gray-100 via-green-50 to-gray-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-64 h-64 bg-green-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-blue-200 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Desktop Enhanced Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-16">
              {/* Left Column */}
              <div className="space-y-12">
                {[
                  { title: 'Farms Plots', img: '/images/farmplot.jpg', type: 'farms', description: 'Agricultural land for farming ventures' },
                  { title: 'Rental Yield Plots', img: '/images/rentalplot.jpeg', type: 'rental', description: 'High-return investment properties' }
                ].map((card, index) => (
                  <div
                    key={card.type}
                    className="group relative transform transition-all duration-700 hover:scale-105"
                    style={{
                      animationDelay: `${index * 300}ms`
                    }}
                  >
                    {/* Connection Arrow */}
                    {/* <div className="absolute -right-8 top-1/2 -translate-y-1/2 z-20">
                      <div className="flex items-center">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
                        <div className="w-0 h-0 border-l-[8px] border-l-green-500 border-y-[4px] border-y-transparent"></div>
                      </div>
                    </div> */}

                    {/* Enhanced Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 flex items-center space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg ring-4 ring-green-100 group-hover:ring-green-300 transition-all duration-300">
                            <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors duration-300">
                            {card.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300"
                            onClick={() => window.location.href = `/Dplots?type=${card.type}`}
                          >
                            Explore →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-12">
                {[
                  { title: 'Residential Plots', img: '/images/Residentialplots.jpg', type: 'residential', description: 'Prime residential development land' },
                  { title: 'Commercial Plots', img: '/images/commercialplot.jpeg', type: 'commercial', description: 'Strategic business location plots' }
                ].map((card, index) => (
                  <div
                    key={card.type}
                    className="group relative transform transition-all duration-700 hover:scale-105"
                    style={{
                      animationDelay: `${(index + 1) * 300}ms`
                    }}
                  >
                    {/* Connection Arrow (Left pointing) */}
                    {/* <div className="absolute -left-8 top-1/2 -translate-y-1/2 z-20">
                      <div className="flex items-center">
                        <div className="w-0 h-0 border-r-[8px] border-r-green-500 border-y-[4px] border-y-transparent"></div>
                        <div className="w-12 h-0.5 bg-gradient-to-l from-green-500 to-transparent"></div>
                      </div>
                    </div> */}

                    {/* Enhanced Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-bl from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 flex items-center space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg ring-4 ring-green-100 group-hover:ring-green-300 transition-all duration-300">
                            <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors duration-300">
                            {card.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300"
                            onClick={() => window.location.href = `/Dplots?type=${card.type}`}
                          >
                            Explore →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Slider */}
          <div className="md:hidden">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Plot Categories</h2>
              <div className="w-16 h-1 bg-green-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="overflow-x-auto snap-x snap-mandatory hide-scrollbar">
              <div className="inline-flex gap-6 py-4">
                {[
                  { title: 'Residential Plots', img: '/images/Residentialplots.jpg', type: 'residential' },
                  { title: 'Farms', img: '/images/farmplot.jpg', type: 'farms' },
                  { title: 'Commercial', img: '/images/commercialplot.jpeg', type: 'commercial' },
                  { title: 'Rental Yield Plots', img: '/images/rentalplot.jpeg', type: 'rental' }
                ].map((card, index) => (
                  <div
                    key={card.type}
                    className="w-[70vw] flex-shrink-0 snap-center"
                  >
                    <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden h-full">
                      <div className="relative h-40">
                        <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                      <div className="p-6 text-center">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">{card.title}</h3>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300"
                          onClick={() => window.location.href = `/Dplots?type=${card.type}`}
                        >
                          Explore
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 bg-gradient-to-r from-gray-100 to-transparent h-full pointer-events-none" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 bg-gradient-to-l from-gray-100 to-transparent h-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* --- Other Sections (Unchanged) --- */}
      {/* Combined section: left ribbons (Introducing GIOO & Hire) and right Assisted Plans */}
     <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-200 rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Enhanced stacked ribbons */}
          <div className="space-y-8 relative">
            {/* Main GIOO card with enhanced styling */}
            <div className="group relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              
              {/* Main card */}
              <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white rounded-xl p-8 shadow-xl transform group-hover:scale-[1.02] transition-all duration-300 border border-green-400/20">
                {/* Sparkle icon */}
                <div className="absolute top-4 right-4 opacity-60">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                
                {/* Content */}
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold tracking-tight">
                      Introducing GIOO Plots!
                    </h3>
                    <p className="text-lg text-green-100 leading-relaxed max-w-md">
                      Book exact square footage — flexible, affordable, transparent.
                    </p>
                    
                    {/* Feature highlights */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                        Flexible
                      </span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                        Affordable
                      </span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                        Transparent
                      </span>
                    </div>
                  </div>
                  
                  {/* Enhanced button */}
                  <div className="hidden sm:block">
                    <Link to="/Dmysqft-listing">
                      <Button 
                        size="md" 
                        variant="secondary" 
                        className="group/btn hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Mobile button */}
                <div className="sm:hidden mt-6">
                  <Link to="/Dmysqft-listing">
                    <Button 
                      size="md" 
                      variant="secondary" 
                      className="w-full justify-center group/btn hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <span>Explore GIOO Plots</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative connecting arrow for desktop */}
          <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg border-4 border-blue-100">
              <ArrowRight className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </div>

          {/* Right: Assisted Plans card */}
          <div className="space-y-8 relative">
            <div className="group relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              
              {/* Main card */}
              <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-400 text-white rounded-xl p-8 shadow-xl transform group-hover:scale-[1.02] transition-all duration-300 border border-blue-400/20">
                {/* Sparkle icon */}
                <div className="absolute top-4 right-4 opacity-60">
                  <TrendingUp className="w-6 h-6 animate-pulse" />
                </div>
                
                {/* Content */}
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold tracking-tight">
                      Assisted Plans
                    </h3>
                    <p className="text-lg text-blue-100 leading-relaxed max-w-md">
                      Dedicated property expert to guide you Guaranteed property viewing or 100% refund Receive instant property alerts
                    </p>
                    
                    {/* Feature highlights */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                        Expert Guidance
                      </span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                        100% Refund
                      </span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                        Instant Alerts
                      </span>
                    </div>
                  </div>
                  
                  {/* Enhanced button */}
                  <div className="hidden sm:block">
                    <Link to="/assisted-plans">
                      <Button 
                        size="md" 
                        variant="secondary" 
                        className="group/btn hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Mobile button */}
                <div className="sm:hidden mt-6">
                  <Link to="/assisted-plans">
                    <Button 
                      size="md" 
                      variant="secondary" 
                      className="w-full justify-center group/btn hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <span>Explore Assisted Plans</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-16 text-white"
          style={{transform: 'rotate(180deg)'}}
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            fill="currentColor"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            fill="currentColor"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </section>

      <section className="py-12 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 relative overflow-hidden">
        {/* Reuse background pattern from Featured Plots */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-green-400 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-green-400 rounded-lg rotate-45"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-green-400 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">Hire Top Professionals</h2>
          {isLoading ? (
            <div className="text-center text-gray-200">Loading professionals...</div>
          ) : (
            <>
              {/* Desktop grid */}
              <div className="hidden md:block">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProfessionals.map(prof => (
                    <DProfessionalCard key={prof.id} professional={prof} />
                  ))}
                </div>
              </div>

              {/* Mobile slider */}
              <div className="md:hidden">
                <div className="overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                  <div className="inline-flex gap-6 py-4 px-2">
                    {featuredProfessionals.map(prof => (
                      <div key={prof.id} className="w-[85vw] flex-shrink-0 snap-center">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-gray-200/50 p-4">
                          <DProfessionalCard professional={prof} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 bg-gradient-to-r from-slate-900 to-transparent h-full pointer-events-none" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 bg-gradient-to-l from-slate-900 to-transparent h-full pointer-events-none" />
              </div>
            </>
          )}
          <div className="text-center mt-8"><Link to="/Dservices"><Button variant="primary">Find Professionals</Button></Link></div>
        </div>
      </section>

      {/* --- Enhanced Styles --- */}
      <style>{`
        /* Hide scrollbar for mobile sliders */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Enhanced animations */
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%) rotate(-5deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%) rotate(5deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.6);
          }
        }

        .animate-slide-in {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slide-in:nth-child(2n) {
          animation-name: slideInRight;
        }

        .animate-slide-in:nth-child(2n+1) {
          animation-name: slideInLeft;
        }

        /* Connection line animations */
        @keyframes drawLine {
          from {
            stroke-dasharray: 0, 100;
          }
          to {
            stroke-dasharray: 100, 0;
          }
        }

        .connection-line {
          animation: drawLine 2s ease-in-out infinite alternate;
        }

        /* Glow effects */
        .glow-card:hover {
          animation: glowPulse 2s ease-in-out infinite;
        }

        /* Snap scrolling for mobile sliders */
        .snap-x {
          scroll-snap-type: x mandatory;
        }

        .snap-center {
          scroll-snap-align: center;
        }

        /* Enhanced gradient backgrounds */
        .bg-gradient-mesh {
          background: radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
        }

        /* Floating animation for background elements */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }

        .float-animation:nth-child(2) {
          animation-delay: 2s;
        }

        .float-animation:nth-child(3) {
          animation-delay: 4s;
        }

        /* Enhanced card hover effects */
        .enhanced-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .enhanced-card:hover {
          transform: translateY(-8px) rotateX(5deg);
        }

        .enhanced-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .enhanced-card:hover::before {
          opacity: 1;
        }

        /* Suggestions list styling */
        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          list-style: none;
          margin-top: 0.25rem;
          padding: 0;
          z-index: 10;
          max-height: 250px;
          overflow-y: auto;
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);
        }
        
        .suggestions-list li {
          padding: 0.75rem 1rem;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .suggestions-list li:last-child {
          border-bottom: none;
        }
        
        .suggestions-list li:hover {
          background-color: #f8fafc;
          color: #059669;
        }

        /* Responsive enhancements */
        @media (max-width: 768px) {
          .enhanced-card {
            transform: none;
          }
          
          .enhanced-card:hover {
            transform: translateY(-4px);
          }
        }

        /* Loading animation */
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        /* Button enhanced styling */
        .enhanced-button {
          position: relative;
          overflow: hidden;
        }

        .enhanced-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .enhanced-button:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
};

export default DefaultLanding;