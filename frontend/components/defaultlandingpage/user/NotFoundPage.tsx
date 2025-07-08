
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <img src="https://picsum.photos/seed/404page/300/250" alt="Page not found illustration" className="mb-8 rounded-lg shadow-md" />
      <h1 className="text-6xl font-bold text-green-600">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mt-4">Oops! Page Not Found.</p>
      <p className="text-gray-500 mt-2 mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Go Back to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
    