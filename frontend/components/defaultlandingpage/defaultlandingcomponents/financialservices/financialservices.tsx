import React from 'react';
import { useNavigate } from 'react-router-dom';

const DFinancialServices: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/Dpaymentvai');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Financial Services</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Explore our range of financial services to support your property journey.
      </p>
      <div
        className="flex flex-row flex-nowrap overflow-x-auto gap-4 sm:gap-4 financial-cards-row"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Card 1 */}
        <div onClick={handleCardClick} className="cursor-pointer relative bg-transparent shadow-none p-10 flex flex-col items-center justify-center group overflow-visible w-72 h-72 mx-auto financial-card">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 220 220"
            width="220"
            height="220"
            style={{ minWidth: '100%', minHeight: '100%' }}
          >
            <rect
              x="12"
              y="12"
              width="196"
              height="196"
              rx="0"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              style={{
                stroke: '#22c55e',
                filter: 'drop-shadow(0 0 12px #bbf7d0)',
                opacity: 0.7,
              }}
            />
          </svg>
          <img src="https://img.icons8.com/ios-filled/50/4ade80/receive-cash.png" alt="Rent payment" className="w-16 h-16 mb-4 mx-auto z-10" />
          <h2 className="text-xl font-semibold text-green-700 mb-2 z-10 text-center">Rent payment</h2>
        </div>
        {/* Card 2 */}
        <div onClick={handleCardClick} className="cursor-pointer relative bg-transparent shadow-none p-10 flex flex-col items-center justify-center group overflow-visible w-72 h-72 mx-auto financial-card">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 220 220"
            width="220"
            height="220"
            style={{ minWidth: '100%', minHeight: '100%' }}
          >
            <rect
              x="12"
              y="12"
              width="196"
              height="196"
              rx="0"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              style={{
                stroke: '#22c55e',
                filter: 'drop-shadow(0 0 12px #bbf7d0)',
                opacity: 0.7,
              }}
            />
          </svg>
          <img src="https://img.icons8.com/ios-filled/50/4ade80/light-on.png" alt="Utility Bill Payment" className="w-16 h-16 mb-4 mx-auto z-10" />
          <h2 className="text-xl font-semibold text-green-700 mb-2 z-10 text-center">Utility Bill Payment</h2>
        </div>
        {/* Card 3 */}
        <div onClick={handleCardClick} className="cursor-pointer relative bg-transparent shadow-none p-10 flex flex-col items-center justify-center group overflow-visible w-72 h-72 mx-auto financial-card">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 220 220"
            width="220"
            height="220"
            style={{ minWidth: '100%', minHeight: '100%' }}
          >
            <rect
              x="12"
              y="12"
              width="196"
              height="196"
              rx="0"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              style={{
                stroke: '#22c55e',
                filter: 'drop-shadow(0 0 12px #bbf7d0)',
                opacity: 0.7,
              }}
            />
          </svg>
          <img src="https://img.icons8.com/ios-filled/50/4ade80/maintenance.png" alt="Maintenance Plot Payment" className="w-16 h-16 mb-4 mx-auto z-10" />
          <h2 className="text-xl font-semibold text-green-700 mb-2 z-10 text-center">Maintenance Plot Payment</h2>
        </div>
        {/* Card 4 */}
        <div onClick={handleCardClick} className="cursor-pointer relative bg-transparent shadow-none p-10 flex flex-col items-center justify-center group overflow-visible w-72 h-72 mx-auto financial-card">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 220 220"
            width="220"
            height="220"
            style={{ minWidth: '100%', minHeight: '100%' }}
          >
            <rect
              x="12"
              y="12"
              width="196"
              height="196"
              rx="0"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              style={{
                stroke: '#22c55e',
                filter: 'drop-shadow(0 0 12px #bbf7d0)',
                opacity: 0.7,
              }}
            />
          </svg>
          <img src="https://img.icons8.com/ios-filled/50/4ade80/receipt-dollar.png" alt="Fees" className="w-16 h-16 mb-4 mx-auto z-10" />
          <h2 className="text-xl font-semibold text-green-700 mb-2 z-10 text-center">Fees</h2>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .financial-cards-row {
            gap: 0.3rem !important;
            padding-bottom: 0.3rem !important;
          }
          .financial-card {
            width: 6rem !important;
            min-width: 6rem !important;
            max-width: 6rem !important;
            height: 6rem !important;
            min-height: 6rem !important;
            max-height: 6rem !important;
            padding: 0.2rem !important;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .financial-card img {
            width: 1.1rem !important;
            height: 1.1rem !important;
          }
          .financial-card h2 {
            font-size: 0.62rem !important;
            margin-bottom: 0.2rem !important;
            line-height: 1.1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DFinancialServices;
