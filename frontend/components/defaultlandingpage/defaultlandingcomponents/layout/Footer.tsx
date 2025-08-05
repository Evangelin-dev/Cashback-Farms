import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Link } from 'react-router-dom';

// 2. A single, unified source for navigation links
const NAVIGATION_LINKS = [
  { name: 'Home', authPath: '/Landing', defaultPath: '/D' },
  { name: 'Plot Marketplace', authPath: '/plots', defaultPath: '/Dplots' },
  { name: 'GIOO Plots', authPath: '/mysqft-listing', defaultPath: '/Dmysqft-listing' },
  { name: 'Materials Store', authPath: '/materials', defaultPath: '/Dmaterials' },
  { name: 'Professional Services', authPath: '/services', defaultPath: '/Dservices' },
];

// Main Footer component (Now dynamic)
const Footer: React.FC = () => {
  // 3. Get the current user from the authentication context
  const { currentUser } = useAuth();

  return (
    <footer className="bg-white text-black border-t border-green-100 shadow-[0_-2px_24px_0_rgba(34,197,94,0.07)]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-extrabold text-green-600 flex items-center gap-2">
              <img src="/images/logobg.png" className='w-20 h-20' alt="Cashback Farms Logo" />
              Cashback Farms
            </h3>
            <p className="mt-3 text-base text-gray-600 font-medium">
              Your trusted partner in land, construction, and interior solutions.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-green-700 tracking-wider uppercase mb-2">Quick Links</h4>
            <ul className="mt-3 space-y-2">
              {/* 4. Map over the unified links and choose path based on user status */}
              {NAVIGATION_LINKS.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <Link
                    to={currentUser ? link.authPath : link.defaultPath}
                    className="text-base text-black hover:text-green-600 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-green-700 tracking-wider uppercase mb-2">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/Privacy_Policy" className="text-base text-black hover:text-green-600 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/Terms_&_Conditions" className="text-base text-black hover:text-green-600 transition-colors font-medium">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/cancellation-refunds" className="text-base text-black hover:text-green-600 transition-colors font-medium">Refund Policy</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-green-700 tracking-wider uppercase mb-2">Contact Us</h4>
            <ul className="mt-3 space-y-2 text-base">
              <li className="flex items-center gap-2">
                <span className="inline-block w-5 h-5 text-green-600">
                  <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" /></svg>
                </span>
                support@cashbackfarms.com
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-5 h-5 text-green-600">
                   <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm12-12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </span>
                +91 123 456 7890
              </li>
              <li className="flex items-start gap-2">
                {/* Corrected icon size for better alignment */}
                <span className="inline-block w-6 h-6 text-green-600 flex-shrink-0 mt-1">
                  <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M7 20H2v-2a4 4 0 014-4h1m6 0V4a4 4 0 00-8 0v10" /></svg>
                </span>
                <span>Sri,Anant,GF NO: 1B, 11th Sector, 66th Street,Kalaignar Karunanidhi Nagar,Chennai 600 078</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-green-100 pt-8 text-center">
          <p className="text-base text-gray-600 font-medium tracking-wide">
            © {new Date().getFullYear()} <span className="text-green-700 font-bold">Cashback Farms</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Footer for DefaultLayout (Also updated to use the new links array)
export const DefaultFooter: React.FC = () => (
  <footer className="bg-white text-black border-t border-green-100 shadow-[0_-2px_24px_0_rgba(34,197,94,0.07)]">
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h3 className="text-2xl font-extrabold text-green-600 flex items-center gap-2">
            <img src="/images/logobg.png" className='w-12 h-12' alt="Cashback Farms Logo" />
            Cashback Farms
          </h3>
          <p className="text-sm text-gray-600 mt-1">Land, Construction & Interiors</p>
        </div>
        <div className="flex gap-8">
          {NAVIGATION_LINKS.slice(0, 3).map(link => (
            <Link key={link.name} to={link.defaultPath} className="text-black hover:text-green-600 text-base font-medium transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link to="/Privacy_Policy" className="text-gray-700 hover:text-green-600 text-sm underline transition-colors">Privacy Policy</Link>
          <Link to="/Terms_&_Conditions" className="text-gray-700 hover:text-green-600 text-sm underline transition-colors">Terms & Conditions</Link>
        </div>
        <div className="text-sm text-gray-600">© {new Date().getFullYear()} Cashback Farms</div>
      </div>
    </div>
  </footer>
);

// Footer for RealLayout
export const RealFooter: React.FC = () => (
  <footer className="bg-white text-black border-t border-green-100 shadow-[0_-2px_24px_0_rgba(34,197,94,0.07)]">
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center gap-8">
      <div>
        <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
          <span className="inline-block w-7 h-7 rounded-full bg-gradient-to-br from-green-400 via-green-200 to-green-600 shadow flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4" />
            </svg>
          </span>
          Real Estate Agent Panel
        </h3>
        <p className="text-sm text-gray-600 mt-1">Powered by Cashback Farms</p>
      </div>
      <div className="flex gap-6">
        <Link to="/realestate/post-plots" className="text-black hover:text-green-600 font-medium transition-colors">Post Plots</Link>
        <Link to="/realestate/leads" className="text-black hover:text-green-600 font-medium transition-colors">Leads</Link>
        <Link to="/realestate/commission" className="text-black hover:text-green-600 font-medium transition-colors">Commission</Link>
      </div>
      <div className="flex gap-4 mt-4 md:mt-0">
        <Link to="/privacypolicy" className="text-gray-700 hover:text-green-600 text-xs underline transition-colors">Privacy Policy</Link>
        <Link to="/termsandconditions" className="text-gray-700 hover:text-green-600 text-xs underline transition-colors">Terms & Conditions</Link>
      </div>
      <div className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Greenheap Agro Farms</div>
    </div>
  </footer>
);

// Footer for AdminLayout
export const AdminFooter: React.FC = () => (
  <footer className="bg-white text-black border-t border-green-100 shadow-[0_-2px_24px_0_rgba(34,197,94,0.07)]">
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center gap-8">
      <div>
        <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
          <span className="inline-block w-7 h-7 rounded-full bg-gradient-to-br from-green-400 via-green-200 to-green-600 shadow flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4" />
            </svg>
          </span>
          Admin Panel
        </h3>
        <p className="text-sm text-gray-600 mt-1">Cashback Farms Admin Dashboard</p>
      </div>
      <div className="flex gap-6">
        <Link to="/admin/dashboard" className="text-black hover:text-green-600 font-medium transition-colors">Dashboard</Link>
        <Link to="/admin/plots" className="text-black hover:text-green-600 font-medium transition-colors">Plots</Link>
        <Link to="/admin/users" className="text-black hover:text-green-600 font-medium transition-colors">Users</Link>
      </div>
      <div className="flex gap-4 mt-4 md:mt-0">
        <Link to="/privacypolicy" className="text-gray-700 hover:text-green-600 text-xs underline transition-colors">Privacy Policy</Link>
        <Link to="/termsandconditions" className="text-gray-700 hover:text-green-600 text-xs underline transition-colors">Terms & Conditions</Link>
      </div>
      <div className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Cashback Farms</div>
    </div>
  </footer>
);

// Footer for B2BLayout
export const B2BFooter: React.FC = () => (
  <footer className="bg-white text-black border-t border-green-100 shadow-[0_-2px_24px_0_rgba(34,197,94,0.07)]">
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center gap-8">
      <div>
        <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
          <span className="inline-block w-7 h-7 rounded-full bg-gradient-to-br from-green-400 via-green-200 to-green-600 shadow flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4" />
            </svg>
          </span>
          B2B Vendor Panel
        </h3>
        <p className="text-sm text-gray-600 mt-1">Cashback Farms B2B</p>
      </div>
      <div className="flex gap-6">
        <Link to="/b2b/products" className="text-black hover:text-green-600 font-medium transition-colors">Products</Link>
        <Link to="/b2b/orders" className="text-black hover:text-green-600 font-medium transition-colors">Orders</Link>
        <Link to="/b2b/customers" className="text-black hover:text-green-600 font-medium transition-colors">Customers</Link>
      </div>
      <div className="flex gap-4 mt-4 md:mt-0">
        <Link to="/privacypolicy" className="text-gray-700 hover:text-green-600 text-xs underline transition-colors">Privacy Policy</Link>
        <Link to="/termsandconditions" className="text-gray-700 hover:text-green-600 text-xs underline transition-colors">Terms & Conditions</Link>
      </div>
      <div className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Cashback Farms</div>
    </div>
  </footer>
);

export default Footer;
