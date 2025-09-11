import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../common/Button';

interface PlanCardProps {
  icon: React.ReactNode;
  text: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ icon, text }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/plans'); // Navigate to the subscription page
  };

  return (
    <div
      className="bg-green-100 rounded-lg shadow-md p-6 flex flex-col items-center w-96 text-center cursor-pointer hover:shadow-lg transition duration-300 h-[200px] justify-center"
      onClick={handleClick}
    >
      <span className="mb-4">{icon}</span>
      <p className="text-gray-700 text-sm">{text}</p>
    </div>
  );
};

const AssistedPlans: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Assisted Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 justify-center">
        <PlanCard
          icon={<svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 4.75 7.5 4.75a12.742 12.742 0 00-3 1m18.341 0a12.707 12.707 0 00-3.1 1m-5.166 0C15.8 5.477 14.214 4.75 12.5 4.75a12.742 12.742 0 00-3 1" /></svg>}
          text="Dedicated property expert to guide you"
        />
        <PlanCard
          icon={<svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          text="Guaranteed property or 100% refund"
        />
        <PlanCard
          icon={<svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-6-6V3a2.002 2.002 0 00-2-2a2.002 2.002 0 00-2 2v8a6.002 6.002 0 00-6 6v3.158a2.032 2.032 0 01.595 1.405L4 17h5m6 0v1a3 3 0 01-3 3H7a3 3 0 01-3-3v-1m9 0h6" /></svg>}
          text="Receive instant property alerts"
        />
      </div>
      <div className="text-center">
        <Link to="/plans">
        <Button >Explore More</Button>
        </Link>
      </div>
    </div>
  );
};

export default AssistedPlans;
