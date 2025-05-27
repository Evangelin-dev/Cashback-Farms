
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PLOTS, MOCK_MATERIAL_CATEGORIES, MOCK_PROFESSIONALS } from '../constants';
import PlotCard from '../components/plot/PlotCard';
import MaterialCard from '../components/material/MaterialCard'; // Placeholder, using category card instead
import ProfessionalCard from '../components/service/ProfessionalCard';
import Button from '../components/common/Button';
import CardShell from '../components/common/CardShell';

const HomePage: React.FC = () => {
  const featuredPlots = MOCK_PLOTS.slice(0, 3);
  const featuredCategories = MOCK_MATERIAL_CATEGORIES.slice(0, 4);
  const featuredProfessionals = MOCK_PROFESSIONALS.filter(p => 
    p.service === "Architect" || p.service === "Interior Designer"
  ).slice(0,3);

  return (
    <div className="space-y-12">
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
            <Link to="/plots">
              <Button size="lg" variant="secondary" className="text-green-700 hover:bg-green-200">
                Explore Plots
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Plots Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Featured Plots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlots.map(plot => <PlotCard key={plot.id} plot={plot} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/plots">
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
            <Link to="/book-my-sqft">
                <Button size="lg" variant="primary">Explore Book My SqFt</Button>
            </Link>
        </div>
      </section>

      {/* Popular Material Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Shop Construction Materials</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredCategories.map(category => (
            <Link key={category.id} to="/materials"> {/* Simplified: links to main material page */}
              <CardShell className="text-center p-4 hover:shadow-xl transition-shadow">
                <img src={category.imageUrl} alt={category.name} className="w-20 h-20 mx-auto mb-2 rounded-full object-cover"/>
                <h3 className="font-medium text-gray-700">{category.name}</h3>
              </CardShell>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/materials">
            <Button variant="outline">Browse All Materials</Button>
          </Link>
        </div>
      </section>

      {/* Featured Professionals Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Hire Top Professionals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProfessionals.map(prof => <ProfessionalCard key={prof.id} professional={prof} />)}
            </div>
            <div className="text-center mt-8">
            <Link to="/services">
                <Button variant="primary">Find Professionals</Button>
            </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
    