import React from 'react';

const AssistedplansRoadmap: React.FC = () => {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h2 className="text-3xl font-semibold text-gray-800 mb-10 text-center">HOW ASSISTED PLANS WORK</h2>
      <div className="relative w-full flex flex-col items-center" style={{ minHeight: 750 }}>
        {/* SVG treasure map path connecting all points */}
        <svg
          className="absolute left-0 top-0 z-0"
          width="100%"
          height="750"
          viewBox="0 0 800 750"
          fill="none"
          style={{ pointerEvents: 'none' }}
        >
          <path
            d="
              M 120 100
              Q 400 120, 680 170
              Q 400 220, 120 320
              Q 400 340, 680 420
              Q 400 520, 120 600
              Q 400 700
            "
            stroke="#a3e635"
            strokeWidth="6"
            strokeDasharray="18,18"
            fill="none"
          />
        </svg>

        {/* 1 */}
        <div className="absolute" style={{ top: 40, left: 0, width: '50%', display: 'flex', justifyContent: 'flex-start' }}>
          <div className="flex flex-col items-center ml-0 sm:ml-12">
            <img src="placeholder-image-1.png" alt="Step 1" className="w-20 h-20 rounded-full border-4 border-green-300 bg-white mb-2" />
            <div className="bg-transparent text-left max-w-xs">
              <h3 className="text-lg font-bold text-green-700">LOOKING FOR A HOUSE?</h3>
              <p className="text-gray-600">Just get one of our Assisted Plans and make your lives simpler.</p>
            </div>
          </div>
        </div>
        {/* 2 */}
        <div className="absolute" style={{ top: 120, right: 0, width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
          <div className="flex flex-col items-center mr-0 sm:mr-12">
            <img src="placeholder-image-2.png" alt="Step 2" className="w-20 h-20 rounded-full border-4 border-green-300 bg-white mb-2" />
            <div className="bg-transparent text-right max-w-xs">
              <h3 className="text-lg font-bold text-green-700">Say HELLO to your HOUSE-HUNT ASSISTANT</h3>
            </div>
          </div>
        </div>
        {/* 3 */}
        <div className="absolute" style={{ top: 260, left: 0, width: '50%', display: 'flex', justifyContent: 'flex-start' }}>
          <div className="flex flex-col items-center ml-0 sm:ml-12">
            <img src="placeholder-image-3.png" alt="Step 3" className="w-20 h-20 rounded-full border-4 border-green-300 bg-white mb-2" />
            <div className="bg-transparent text-left max-w-xs">
              <h3 className="text-lg font-bold text-green-700">Who gather all your requirements and provides you with CITY LEVEL EXPERTISE</h3>
            </div>
          </div>
        </div>
        {/* 4 */}
        <div className="absolute" style={{ top: 370, right: 0, width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
          <div className="flex flex-col items-center mr-0 sm:mr-12">
            <img src="placeholder-image-4.png" alt="Step 4" className="w-20 h-20 rounded-full border-4 border-green-300 bg-white mb-2" />
            <div className="bg-transparent text-right max-w-xs">
              <h3 className="text-lg font-bold text-green-700">Contacts Owners, Schedule property visits, and Negotiates Rent *</h3>
            </div>
          </div>
        </div>
        {/* 5 */}
        <div className="absolute" style={{ top: 600, left: 0, width: '50%', display: 'flex', justifyContent: 'flex-start' }}>
          <div className="flex flex-col items-center ml-0 sm:ml-12">
            <img src="placeholder-image-5.png" alt="Step 5" className="w-20 h-20 rounded-full border-4 border-green-300 bg-white mb-2" />
            <div className="bg-transparent text-left max-w-xs">
              <h3 className="text-lg font-bold text-green-700">Helping you find best HOUSE FOR YOUR NEEDS</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistedplansRoadmap;
