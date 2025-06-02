import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Welcome to the Admin Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8">Manage your plots, users, and settings from here.</p>
      {/* Add more dashboard/landing content here */}
    </div>
  );
};

export default LandingPage;
