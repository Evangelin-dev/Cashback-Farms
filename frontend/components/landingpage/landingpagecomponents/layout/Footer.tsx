
import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../../../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-green-400">Cashback Farms</h3>
            <p className="mt-2 text-sm text-gray-300">
              Your trusted partner in land, construction, and interior solutions.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.slice(0,4).map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-base text-gray-300 hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Refund Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact Us</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-base text-gray-300">support@cashbackfarms.com</li>
              <li className="text-base text-gray-300">+91 123 456 7890</li>
              <li className="text-base text-gray-300">123 Green Avenue, Bangalore, India</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} Cashback Farms. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
    