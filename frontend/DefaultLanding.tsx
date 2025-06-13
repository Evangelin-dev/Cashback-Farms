import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/common/Button';

import ProfessionalCard from '@/components/landingpage/landingpagecomponents/service/ProfessionalCard';
import { MOCK_MATERIAL_CATEGORIES, MOCK_PLOTS, MOCK_PROFESSIONALS } from '@/constants';
import DFinancialServices from './components/defaultlandingpage/defaultlandingcomponents/financialservices/financialservices';
import DAssistedPlans from './components/defaultlandingpage/defaultlandingcomponents/assistedplans/assistedplans';
import DPayments from './components/defaultlandingpage/defaultlandingcomponents/payments/payments';
import DPlotCard from './components/defaultlandingpage/defaultlandingcomponents/plot/PlotCard';
import DProfessionalCard from './components/defaultlandingpage/defaultlandingcomponents/service/ProfessionalCard';

const DefaultLanding: React.FC = () => {
  const featuredPlots = MOCK_PLOTS.slice(0, 3);
  const featuredCategories = MOCK_MATERIAL_CATEGORIES.slice(0, 4);
  const featuredProfessionals = MOCK_PROFESSIONALS.filter(p => 
    p.service === "Architect" || p.service === "Interior Designer"
  ).slice(0,3);

  // Search section state
  const [searchType, setSearchType] = useState<'buy' | 'sell' | 'commercial'>('buy');
  const [searchInput, setSearchInput] = useState('');
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting...');

  // Get current location (city) on mount
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          try {
            const { latitude, longitude } = pos.coords;
            // Use Nominatim OpenStreetMap API (no key required, reliable for most locations)
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            setCurrentLocation(
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.state ||
              data.address?.county ||
              data.display_name?.split(',')[0] ||
              'Location Unavailable'
            );
          } catch {
            setCurrentLocation('Location Unavailable');
          }
        },
        () => setCurrentLocation('Location Unavailable')
      );
    } else {
      setCurrentLocation('Location Unavailable');
    }
  }, []);

  // Home services cards for each search type
  const buyServices = [
    { title: 'Builder Projects', desc: 'Explore top builder projects', icon: '🏗️', link: '/services/buy' },
    { title: 'Construction materials', desc: 'Get quality materials for your home', icon: '🧱', link: '/services/buy' },
    { title: 'Property Legal Services', desc: 'Legal help for your property', icon: '⚖️', link: '/services/buy' },
    { title: 'Home Interiors', desc: 'Design your dream home', icon: '🛋️', link: '/services/buy' },
    { title: 'Plot Maintenance', desc: 'Keep your plot in top shape', icon: '🌱', link: '/services/buy' },
  ];
  const sellServices = [
    { title: 'Free Property Listing', desc: 'List your property for free', icon: '📝', link: '/services/sell' },
    { title: 'Professional Photography', desc: 'Attract buyers with great photos', icon: '📸', link: '/services/sell' },
    { title: 'Seller Support', desc: 'Get help from our team', icon: '🤝', link: '/services/sell' },
  ];
  const commercialServices = [
    { title: 'Packers & Movers', desc: 'Hassle-free shifting for your business', icon: '🚚', link: '/services/commercial' },
    { title: 'Building Materials', desc: 'All materials for your commercial needs', icon: '🏢', link: '/services/commercial' },
    { title: 'Home Cleaning', desc: 'Professional cleaning for your premises', icon: '🧹', link: '/services/commercial' },
    { title: 'Sanitary Kitchen Electric Shop', desc: 'Sanitary, kitchen, and electrical supplies', icon: '🔌', link: '/services/commercial' },
    { title: 'Building Planner', desc: 'Plan your commercial building efficiently', icon: '📐', link: '/services/commercial' },
    { title: 'Construction Materials', desc: 'Quality construction materials', icon: '🧱', link: '/services/commercial' },
    { title: 'Carpenter Labour', desc: 'Skilled carpenters for your project', icon: '🪚', link: '/services/commercial' },
    { title: 'Bathroom Cleaning', desc: 'Deep cleaning for bathrooms', icon: '🛁', link: '/services/commercial' },
    { title: 'Vehichle shifting', desc: 'Move your vehicles safely', icon: '🚗', link: '/services/commercial' },
  ];

  // Render search bar input(s) based on type
  const renderSearchInput = () => {
    if (searchType === 'buy') {
      return (
        <input
          type="text"
          className="w-full border rounded px-4 py-2 text-sm"
          placeholder="Search by locality or landmark"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      );
    }
    if (searchType === 'sell') {
      return (
        <input
          type="text"
          className="w-full border rounded px-4 py-2 text-sm"
          placeholder="Sell by location"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      );
    }
    // commercial: single input, comma separated
    return (
      <input
        type="text"
        className="w-full border rounded px-4 py-2 text-sm"
        placeholder="Search up to 3 localities or landmarks (comma separated)"
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
      />
    );
  };

  // Render home service cards based on search type, with heading and navigation
  const renderHomeServices = () => {
    let services, heading, link;
    if (searchType === 'buy') {
      services = buyServices;
      heading = 'Home Services for Buyers';
      link = '/Dservices/';
    } else if (searchType === 'sell') {
      services = sellServices;
      heading = 'Home Services for Sellers';
      link = '/Dservices/';
    } else {
      services = commercialServices;
      heading = 'Commercial Services';
      link = '/Dservices/';
    }
    // Show only first 3 cards
    const visibleServices = services.slice(0, 3);
    return (
      <div className="mt-8">
        <div className="text-lg font-semibold text-green-700 mb-3 text-center">{heading}</div>
        <div className="flex flex-row justify-center gap-4">
          {visibleServices.map(s => (
            <Link
              key={s.title}
              to={link}
              className="bg-white rounded shadow p-4 flex flex-col items-center border border-green-100 hover:shadow-lg transition w-64"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-semibold text-green-700">{s.title}</div>
              <div className="text-xs text-gray-500 text-center">{s.desc}</div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to={link}>
            <Button variant="outline">View All Services</Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Find Your Perfect Plot & Build Your Dream
          </h1>
          <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
            Cashback Farms offers verified plots, quality construction materials, and expert professionals, all in one place.
          </p>
          <div className="mt-10">
            <Link to="/Dplots">
              <Button size="lg" variant="secondary" className="text-green-700 hover:bg-green-200">
                Explore Plots
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-sm border-b border-green-100">
        <div className="max-w-3xl mx-auto px-4">
          {/* Selection buttons */}
          <div className="flex justify-center mb-4 gap-2">
            <button
              className={`px-4 py-2 rounded-l font-medium border border-green-600 ${
                searchType === 'buy'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
              onClick={() => {
                setSearchType('buy');
                setSearchInput('');
              }}
            >
              Buy
            </button>
            <button
              className={`px-4 py-2 font-medium border-t border-b border-green-600 ${
                searchType === 'sell'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
              onClick={() => {
                setSearchType('sell');
                setSearchInput('');
              }}
            >
              Sell
            </button>
            <button
              className={`px-4 py-2 rounded-r font-medium border border-green-600 ${
                searchType === 'commercial'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
              onClick={() => {
                setSearchType('commercial');
                setSearchInput('');
              }}
            >
              Commercial
            </button>
          </div>
          {/* Current location display */}
          <div className="flex items-center justify-center mb-3 text-sm text-gray-600">
            <span className="mr-2">📍</span>
            <span>
              Current Location: <span className="font-semibold text-green-700">{currentLocation}</span>
            </span>
          </div>
          {/* Search bar */}
          <div className="flex flex-col items-center gap-2">
            <form
              className="w-full flex flex-col gap-2"
              onSubmit={e => {
                e.preventDefault();
                // Implement search logic as needed
              }}
            >
              {renderSearchInput()}
              <button
                type="submit"
                className="w-full mt-2 bg-green-600 text-white rounded px-4 py-2 font-semibold hover:bg-green-700"
              >
                {searchType === 'buy'
                  ? 'Search Plots'
                  : searchType === 'sell'
                  ? 'Sell Property'
                  : 'Search Commercial'}
              </button>
            </form>
          </div>
          {/* Home services cards with heading and navigation */}
          {renderHomeServices()}
        </div>
      </section>

      {/* Featured Plots Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Featured Plots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlots.map(plot => <DPlotCard key={plot.id} plot={plot} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/Dplots">
            <Button variant="outline">View All Plots</Button>
          </Link>
        </div>
      </section>

      {/* Book My SqFt Promo */}
      <section className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-semibold text-green-700 mb-4">Introducing Book My SqFt!</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Don't want to buy a whole plot? Now you can book the exact square footage you need.
                Flexible, affordable, and transparent.
            </p>
            <Link to="/Dbook-my-sqft">
                <Button size="lg" variant="primary">Explore Book My SqFt</Button>
            </Link>
        </div>
      </section>

      {/* Assisted Plans Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DAssistedPlans />
        </div>
      </section>

      {/* Payments Section */}
      <section className="py-12 bg-white">
        <DPayments />
      </section>

      {/* Financial Services Section */}
      <section className="py-12 bg-white">
        <DFinancialServices />
      </section>

      {/* Featured Professionals Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Hire Top Professionals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProfessionals.map(prof => <DProfessionalCard key={prof.id} professional={prof} />)}
            </div>
            <div className="text-center mt-8">
            <Link to="/Dservices">
                <Button variant="primary">Find Professionals</Button>
            </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default DefaultLanding;
