import React from 'react';

const FinancialServices: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Financial Services</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Explore our range of financial services to support your property journey.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        {/* Card 1 */}
        <div className="relative bg-transparent shadow-none p-10 flex flex-col items-center justify-center group overflow-visible w-72 h-72 mx-auto">
          {/* Solid card border stock (green, no curved edge) */}
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
              className="transition-all duration-500"
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
        <div className="relative bg-transparent rounded-lg shadow-none p-10 flex flex-col items-center justify-center group overflow-visible w-72 h-72 mx-auto">
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
              className="transition-all duration-500"
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
        <div className="relative bg-transparent rounded-lg shadow-none p-10 flex flex-col items-center justify-center group overflow-visible w-72 h-72 mx-auto">
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
              className="transition-all duration-500"
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
        <div className="relative bg-transparent rounded-lg shadow-none p-10 flex flex-col items-center justify-center group overflow-visible w-72 h-72 mx-auto">
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
              className="transition-all duration-500"
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
    </div>
  );
};

export default FinancialServices;
