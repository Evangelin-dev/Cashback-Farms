import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- API Client and Types ---
import apiClient from '@/src/utils/api/apiClient'; // Adjust path if needed
import { Plot, Professional } from '../../types'; // Adjust path if needed

// --- Reusable Components ---
import Button from '../Button.tsx';
import AssistedPlans from '../landingpage/landingpagecomponents/assistedplans/assistedplans';
import FinancialServices from '../landingpage/landingpagecomponents/financialservices/financialservices';
import Payments from '../landingpage/landingpagecomponents/payments/payments';
import ProfessionalCard from '../landingpage/landingpagecomponents/service/ProfessionalCard.tsx';
import PlotCard from './landingpagecomponents/plot/PlotCard.tsx';

// --- Slider Data with Correct String Paths ---
// We reference the images directly as strings from the public folder.
const slides = [
  {
    ctaText: "Know More",
    ctaLink: "/services",
    image: '/images/EarnRentaYieldsfo.png',
  },
  {
     ctaText: "Explore Plots",
    ctaLink: "/Dplots",
    image: '/images/OwningaPlotWasNeverThisEasy.png',
  },
  {
       ctaText: "Start Earning",
    ctaLink: "/services",
    image: '/images/LetYourPlotEarn.png',
  },
  {
    ctaText: "Book Now",
    ctaLink: "/Dplots",
    image: '/images/BookYourFarmHouseToday.png',
  },
];


const LandingPage: React.FC = () => {
  // --- State Management ---
  const [featuredPlots, setFeaturedPlots] = useState<Plot[]>([]);
  const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchType, setSearchType] = useState<'buy' | 'sell' | 'commercial'>('buy');
  const [searchInput, setSearchInput] = useState('');
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting...');
  
  // --- Effects ---

  // Auto-playing slider effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);
  
  // Fetch featured data and current location on mount
  useEffect(() => {
    // Fetch Plots and Services
    const fetchFeaturedData = async () => {
      setIsLoading(true);
      try {
        const [plotsResponse, servicesResponse] = await Promise.all([
          apiClient.get('/public/plots/'),
          apiClient.get('/public/services/')
        ]);

        // Map and set featured plots
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

        // Map and set featured professionals/services
        const allServices = (servicesResponse.data || []).map((service: any) => ({
            id: service.id,
            name: service.vendor_username,
            service: service.name,
            specialization: service.description,
            rate: `₹${Number(service.price).toLocaleString('en-IN')}`,
            imageUrl: `https://picsum.photos/seed/${service.vendor_username}/400/300`,
            rating: 4.5,
        })).reverse(); // Show latest services first
        setFeaturedProfessionals(allServices.slice(0, 3));

      } catch (error) {
        console.error("Failed to fetch featured data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch User Location
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async pos => {
            try {
              const { latitude, longitude } = pos.coords;
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
              const data = await res.json();
              setCurrentLocation(data.address?.city || data.address?.town || 'Location Found');
            } catch {
              setCurrentLocation('Location Unavailable');
            }
          },
          () => setCurrentLocation('Location Unavailable')
        );
      } else {
        setCurrentLocation('Location Unavailable');
      }
    };

    fetchFeaturedData();
    fetchLocation();
  }, []);

  // --- Render Functions (unchanged logic) ---
  const renderSearchInput = () => {
    if (searchType === 'buy') return <input type="text" className="w-full border rounded px-4 py-2 text-sm" placeholder="Search by locality or landmark" value={searchInput} onChange={e => setSearchInput(e.target.value)} />;
    if (searchType === 'sell') return <input type="text" className="w-full border rounded px-4 py-2 text-sm" placeholder="Sell by location" value={searchInput} onChange={e => setSearchInput(e.target.value)} />;
    return <input type="text" className="w-full border rounded px-4 py-2 text-sm" placeholder="Search up to 3 localities (comma separated)" value={searchInput} onChange={e => setSearchInput(e.target.value)} />;
  };

  const buyServices = [ { title: 'Builder Projects', desc: 'Explore top builder projects', icon: '🏗️', link: '/services/buy' }, { title: 'Construction materials', desc: 'Get quality materials for your home', icon: '🧱', link: '/services/buy' }, { title: 'Property Legal Services', desc: 'Legal help for your property', icon: '⚖️', link: '/services/buy' }, { title: 'Home Interiors', desc: 'Design your dream home', icon: '🛋️', link: '/services/buy' }, { title: 'Plot Maintenance', desc: 'Keep your plot in top shape', icon: '🌱', link: '/services/buy' }];
  const sellServices = [ { title: 'Free Property Listing', desc: 'List your property for free', icon: '📝', link: '/services/sell' }, { title: 'Professional Photography', desc: 'Attract buyers with great photos', icon: '📸', link: '/services/sell' }, { title: 'Seller Support', desc: 'Get help from our team', icon: '🤝', link: '/services/sell' }];
  const commercialServices = [ { title: 'Packers & Movers', desc: 'Hassle-free shifting', icon: '🚚', link: '/services/commercial' }, { title: 'Building Materials', desc: 'All materials for your commercial needs', icon: '🏢', link: '/services/commercial' }, { title: 'Home Cleaning', desc: 'Professional cleaning for your premises', icon: '🧹', link: '/services/commercial' }];
  
  const renderHomeServices = () => {
    let services, heading, link;
    if (searchType === 'buy') { services = buyServices; heading = 'Home Services for Buyers'; link = '/services'; }
    else if (searchType === 'sell') { services = sellServices; heading = 'Home Services for Sellers'; link = '/services'; }
    else { services = commercialServices; heading = 'Commercial Services'; link = '/services'; }
    return (
      <div className="mt-8">
        <div className="text-lg font-semibold text-green-700 mb-3 text-center">{heading}</div>
        <div className="flex flex-row justify-center gap-4">
          {services.slice(0, 3).map(s => (
            <Link key={s.title} to={link} className="bg-white rounded shadow p-4 flex flex-col items-center border border-green-100 hover:shadow-lg transition w-64">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-semibold text-green-700">{s.title}</div>
              <div className="text-xs text-gray-500 text-center">{s.desc}</div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4"><Link to={link}><Button variant="outline">View All Services</Button></Link></div>
      </div>
    );
  };
  
  // --- Main Component JSX ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- REVISED Hero Section: Image Slider --- */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'}`}
          >
            <img src={slide.image} alt={`Slide ${index + 1}`} className="w-full h-full object-fill" />
            <div className="absolute bottom-10 left-10 z-20">
              {/* <Link to={slide.ctaLink}>
                <Button size="lg" variant="secondary" className="text-green-700 hover:bg-green-200 shadow-lg animate-fade-in">
                  {slide.ctaText}
                </Button>
              </Link> */}
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

      {/* --- Search Section --- */}
      <section className="bg-white py-8 shadow-sm border-b border-green-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-center mb-4 gap-2">
            <button className={`px-4 py-2 rounded-l font-medium border border-green-600 ${searchType === 'buy' ? 'bg-green-600 text-white' : 'bg-white text-green-700 hover:bg-green-50'}`} onClick={() => { setSearchType('buy'); setSearchInput(''); }}>Buy</button>
            <button className={`px-4 py-2 font-medium border-t border-b border-green-600 ${searchType === 'sell' ? 'bg-green-600 text-white' : 'bg-white text-green-700 hover:bg-green-50'}`} onClick={() => { setSearchType('sell'); setSearchInput(''); }}>Sell</button>
            <button className={`px-4 py-2 rounded-r font-medium border border-green-600 ${searchType === 'commercial' ? 'bg-green-600 text-white' : 'bg-white text-green-700 hover:bg-green-50'}`} onClick={() => { setSearchType('commercial'); setSearchInput(''); }}>Commercial</button>
          </div>
          <div className="flex items-center justify-center mb-3 text-sm text-gray-600">
            <span className="mr-2">📍</span><span>Current Location: <span className="font-semibold text-green-700">{currentLocation}</span></span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <form className="w-full flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
              {renderSearchInput()}
              <button type="submit" className="w-full mt-2 bg-green-600 text-white rounded px-4 py-2 font-semibold hover:bg-green-700">
                {searchType === 'buy' ? 'Search Plots' : searchType === 'sell' ? 'Sell Property' : 'Search Commercial'}
              </button>
            </form>
          </div>
          {renderHomeServices()}
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
                    {featuredPlots.map((plot, idx) => <PlotCard key={plot.id || idx} plot={plot} />)}
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
      <section className="py-12 bg-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><AssistedPlans /></div></section>
      <section className="py-12 bg-white"><Payments /></section>
      <section className="py-12 bg-white"><FinancialServices /></section>

      {/* --- Featured Professionals Section --- */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Hire Top Professionals</h2>
            {isLoading ? (
                 <div className="text-center text-gray-500">Loading professionals...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProfessionals.map(prof => <ProfessionalCard key={prof.id} professional={prof} />)}
                </div>
            )}
            <div className="text-center mt-8">
                <Link to="/services"><Button variant="primary">Find Professionals</Button></Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;