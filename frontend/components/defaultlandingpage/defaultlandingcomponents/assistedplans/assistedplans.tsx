import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../common/Button';

interface PlanCardProps {
  icon: React.ReactNode;
  text: string;
}

const DPlanCard: React.FC<PlanCardProps> = ({ icon, text }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Dplans'); // Navigate to the subscription page
  };

  return (
    <div
      className="bg-green-100 rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg transition-shadow duration-300 w-full h-full min-h-[180px]"
      onClick={handleClick}
    >
      <span className="mb-4">{icon}</span>
      <p className="text-gray-700 text-sm font-medium">{text}</p>
    </div>
  );
};

const DAssistedPlans: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/Dplans');
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Assisted Plans</h2>
      {/* Mobile: horizontal slider */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory hide-scrollbar mb-6">
        <div className="inline-flex gap-4 py-4 px-2">
          <div className="w-[85vw] flex-shrink-0 snap-center">
            <DPlanCard
              icon={<svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              text="Dedicated property expert to guide you"
            />
          </div>
          <div className="w-[85vw] flex-shrink-0 snap-center">
            <DPlanCard
              icon={<svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              text="Guaranteed property viewing or 100% refund"
            />
          </div>
          <div className="w-[85vw] flex-shrink-0 snap-center">
            <DPlanCard
              icon={<svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.158c0 .538-.214 1.055-.595 1.437L4 17h5m6 0v1a3 3 0 01-3 3H7a3 3 0 01-3-3v-1m9 0h-6" /></svg>}
              text="Receive instant property alerts"
            />
          </div>
        </div>
      </div>

      {/* Desktop grid: 1 column on mobile hidden above, 3 on desktop */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8 mb-8">
        <DPlanCard
          icon={<svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          text="Dedicated property expert to guide you"
        />
        <DPlanCard
          icon={<svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          text="Guaranteed property viewing or 100% refund"
        />
        <DPlanCard
          icon={<svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.158c0 .538-.214 1.055-.595 1.437L4 17h5m6 0v1a3 3 0 01-3 3H7a3 3 0 01-3-3v-1m9 0h-6" /></svg>}
          text="Receive instant property alerts"
        />
      </div>
      <div className="text-center">
        <Button onClick={handleClick} size="lg" variant="primary">
          Explore All Plans
        </Button>
      </div>
    </div>
  );
};

export default DAssistedPlans;  