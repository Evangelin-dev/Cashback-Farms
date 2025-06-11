import React, { useState } from 'react';
import AssistedPlansRoadmap from './AssistedPlansRoadmap';

const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-4 max-h-[70vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Terms and Conditions</h2>
        <p className="text-gray-700 text-sm mb-4">
          <b>Freedom Plan:</b><br />
          Valid for 3 Months.<br /><br />
          <b>Relax Plan:</b><br />
          Valid for 45 days.<br /><br />
          <b>MoneyBack Plan:</b><br />
          Valid for 45 days.<br /><br />
          100% refund has to be claimed within a week of plan expiry. The refund will be processed once you shift to your new property which is not available on NoBroker website.<br /><br />
          For claiming the refund, you just need to submit a valid copy of your rental agreement. The rental agreement should match the requirement given to NoBroker. NoBroker will verify the claim, this may include physical visit of the property premises.<br /><br />
          The rent and deposit amount in the registered rental agreement should be equal or lower than the one given to NoBroker relationship manager at the time of plan subscription.
        </p>
        <div className="text-center">
          <button onClick={onClose} className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition duration-300">Close</button>
        </div>
      </div>
    </div>
  );
};

const PlansPage: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const openTermsModal = () => {
    setIsTermsOpen(true);
  };

  const closeTermsModal = () => {
    setIsTermsOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Subscription Plans</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Choose the plan that best suits your needs.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Freedom Plan Card */}
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-4 px-6 bg-green-100">
            <h3 className="text-xl font-semibold text-green-700 text-center">Freedom Plan</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-green-700">₹ 1,499</span>
              <span className="text-gray-500 ml-2 line-through">₹ 1,999</span>
            </div>
            <p className="text-gray-600 text-sm text-center mb-4">+18% GST</p>

            <ul className="text-gray-700 text-sm">
              <li className="mb-2"><span className="mr-2">✅</span>Get genuine house owner contacts matching your requirements</li>
              <li className="mb-2"><span className="mr-2">✅</span>Complete Relocation Assistance on Call</li>
              <li className="mb-2"><span className="mr-2">✅</span>Free Customized Packer and Mover Quote</li>
              <li className="mb-2"><span className="mr-2">✅</span>Free Rental Agreement consultation with expert</li>
              <li className="mb-2"><span className="mr-2">✅</span>On-Demand Support</li>
              <li className="mb-2"><span className="mr-2">✅</span>Premium Filters</li>
              <li className="mb-2"><span className="mr-2">✅</span>Number of Contacts upto 25</li>
              <li className="mb-2"><span className="mr-2">✅</span>Instant Property Alerts on SMS</li>
              <li className="mb-2"><span className="mr-2">✅</span>Locality Experts</li>
              <li><span className="mr-2">✅</span>Rent Negotiation</li>
            </ul>

            <button className="mt-6 bg-green-600 text-white rounded px-4 py-2 block w-full hover:bg-green-700 transition duration-300">
              Subscribe Now
            </button>
          </div>
        </div>

        {/* Relax Plan Card */}
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-4 px-6 bg-green-100">
            <h3 className="text-xl font-semibold text-green-700 text-center">Relax Plan</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-green-700">₹ 3,499</span>
              <span className="text-gray-500 ml-2 line-through">₹ 4,499</span>
            </div>
            <p className="text-gray-600 text-sm text-center mb-4">+18% GST</p>

            <ul className="text-gray-700 text-sm">
              <li className="mb-2"><span className="mr-2">✅</span>Get Relationship Manager to help you SAVE time and money</li>
              <li className="mb-2"><span className="mr-2">✅</span>Relationship Manager</li>
              <li className="mb-2"><span className="mr-2">✅</span>Contacts owners and fixes meetings</li>
              <li className="mb-2"><span className="mr-2">✅</span>Negotiates rent on your behalf</li>
              <li className="mb-2"><span className="mr-2">✅</span>Provides locality level expertise</li>
              <li className="mb-2"><span className="mr-2">✅</span>Premium Filters</li>
              <li className="mb-2"><span className="mr-2">✅</span>Number of Contacts upto 50</li>
              <li className="mb-2"><span className="mr-2">✅</span>Instant Property Alerts</li>
              <li className="mb-2"><span className="mr-2">✅</span>Locality Experts</li>
              <li><span className="mr-2">✅</span>Rent Negotiation</li>
            </ul>

            <button className="mt-6 bg-green-600 text-white rounded px-4 py-2 block w-full hover:bg-green-700 transition duration-300">
              Subscribe Now
            </button>
          </div>
        </div>

        {/* MoneyBack Plan Card (Example - Adjust content as needed) */}
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-4 px-6 bg-green-100">
            <h3 className="text-xl font-semibold text-green-700 text-center">MoneyBack Plan</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-green-700">₹ 5,999</span>
              <span className="text-gray-500 ml-2 line-through">₹ 7,999</span>
            </div>
            <p className="text-gray-600 text-sm text-center mb-4">+18% GST</p>

            <ul className="text-gray-700 text-sm">
              <li className="mb-2"><span className="mr-2">✅</span>Get Relationship Manager to help you SAVE time and money</li>
              <li className="mb-2"><span className="mr-2">✅</span>Relationship Manager</li>
              <li className="mb-2"><span className="mr-2">✅</span>Contacts owners and fixes meetings</li>
              <li className="mb-2"><span className="mr-2">✅</span>Negotiates rent on your behalf</li>
              <li className="mb-2"><span className="mr-2">✅</span>Provides locality level expertise</li>
              <li className="mb-2"><span className="mr-2">✅</span>Premium Filters</li>
              <li className="mb-2"><span className="mr-2">✅</span>Number of Contacts upto 50</li>
              <li className="mb-2"><span className="mr-2">✅</span>Instant Property Alerts</li>
              <li className="mb-2"><span className="mr-2">✅</span>Locality Experts</li>
              <li><span className="mr-2">✅</span>Rent Negotiation</li>
            </ul>

            <button className="mt-6 bg-green-600 text-white rounded px-4 py-2 block w-full hover:bg-green-700 transition duration-300">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Additional Content */}
      <div className="text-center mt-8">
        <p className="text-gray-700 text-sm">Plan Validity: MoneyBack & Relax (45 Days), Freedom & Basic (90 days). T&C apply.</p>
        <p onClick={openTermsModal} className="text-blue-500 text-sm mt-2 underline cursor-pointer">Terms and Conditions</p>
        <p className="text-green-700 text-sm mt-2">Click here for Owner Plans</p>
        <p className="text-gray-700 text-sm mt-2">For assistance call us at: +91-89-055-522-22</p>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={closeTermsModal} />

      {/* Roadmap */}
      <AssistedPlansRoadmap />
    </div>
  );
};

export default PlansPage;
