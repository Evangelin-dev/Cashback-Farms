import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../../../constants';

interface NavbarProps {
  onAuthClick: () => void;
}

interface AgentProfile {
  id: number;
  user_code: string;
  first_name: string;
  last_name: string | null;
  gender: string | null;
  date_of_birth: string | null;
  company_name: string;
  phone_number: string;
  company_number: string;
  email: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  kyc_documents: string | null;
  gst_number: string | null;
  license_number: string | null;
  commission_rate: string;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [agent, setAgent] = useState<AgentProfile | null>(null);

  useEffect(() => {
    // Fetch agent profile from backend
    fetch('http://127.0.0.1:8000/api/agents/')
      .then(res => res.json())
      .then(data => {
        // If the response is an array, take the first agent
        if (Array.isArray(data)) {
          setAgent(data[0]);
        } else {
          setAgent(data);
        }
      })
      .catch(() => setAgent(null));
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-green-600">Cashback Farms</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 hover:bg-green-500 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Agent Profile Section */}
          {agent ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">{agent.first_name}</span>
                <span className="ml-2 text-gray-500">{agent.company_name}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                {agent.first_name ? agent.first_name[0].toUpperCase() : 'A'}
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <button
                onClick={onAuthClick}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Login / Sign Up
              </button>
            </div>
          )}

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-green-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-green-500 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {agent ? (
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                  {agent.first_name ? agent.first_name[0].toUpperCase() : 'A'}
                </div>
                <span className="text-sm text-gray-700">{agent.first_name}</span>
              </div>
            ) : (
              <button
                className="w-full mt-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => {
                  setIsOpen(false);
                  onAuthClick();
                }}
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;