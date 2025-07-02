import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/src/utils/api/apiClient"; // Make sure this path is correct

// Define a type for our plot data to get better autocompletion and type safety
type MicroPlot = {
  id: number;
  project_name: string;
  location: string;
  price: string;
  unit: string;
  project_image: string;
  description: string;
};

const MySqftListing: React.FC = () => {
  const navigate = useNavigate();
  const [plots, setPlots] = useState<MicroPlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMicroPlots = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          throw new Error("Access token not found. Please log in.");
        }

        const res = await apiClient.get("/micro-plots/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
console.log(res,'res')
        // The response data is the array of plots
        setPlots(res || []);

      } catch (err: any) {
        setError("Failed to fetch plot listings. Please try again later.");
        console.error("Fetch error:", err);
        setPlots([]); // Clear any existing plots on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchMicroPlots();
  }, []); // The empty dependency array ensures this runs only once on mount

  // Display a loading message
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-600">Loading listings...</h1>
      </div>
    );
  }

  // Display an error message if something went wrong
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center bg-red-50 border border-red-200 rounded-lg">
        <h1 className="text-xl font-bold text-red-700">An Error Occurred</h1>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary-light mb-8 text-center">
        Discover Micro-Plot Investment Opportunities
      </h1>

      {/* Display a message if no plots are available */}
      {!isLoading && plots.length === 0 && (
        <div className="text-center bg-gray-50 p-10 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">No Listings Found</h2>
          <p className="text-gray-500 mt-2">There are currently no micro-plot listings available. Please check back later.</p>
        </div>
      )}

      {/* Grid for the plot cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plots.map((plot) => (
          <div
            key={plot.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-neutral-200 p-5 flex flex-col group overflow-hidden"
          >
            <div className="mb-4 overflow-hidden rounded-lg h-48">
              <img
                src={plot.project_image}
                alt={plot.project_name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-green-800 mb-2 truncate" title={plot.project_name}>
                {plot.project_name}
              </h2>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2" title={plot.description}>
                {plot.description}
              </p>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Location:</span> {plot.location}
              </div>
              <div className="text-sm text-gray-700 mb-4">
                <span className="font-semibold">Price:</span> ₹
                {parseFloat(plot.price).toLocaleString("en-IN")}
                <span className="text-gray-500"> / {plot.unit}</span>
              </div>
            </div>
            <button
              className="w-full mt-auto bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
              onClick={() => navigate(`/mysqft-listing/${plot.id}`)} // Updated navigation to a dynamic route
            >
              View Details & Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySqftListing;