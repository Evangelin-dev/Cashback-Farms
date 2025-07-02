// src/components/pages/PlotDetailsPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "@/src/utils/api/apiClient"; // Make sure this path is correct
import { Button } from "antd";

// Define the type for the detailed plot data
type PlotDetail = {
  id: number;
  project_name: string;
  location: string;
  google_map_link: string | null;
  description: string;
  plot_type: string;
  unit: string;
  price: string;
  project_layout: string | null;
  project_image: string | null;
  project_video: string | null;
  land_document: string | null;
  created_at: string;
};

const PlotDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the plot ID from the URL
  const navigate = useNavigate();
  const [plot, setPlot] = useState<PlotDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard clause in case the ID is not present in the URL
    if (!id) {
      setError("Plot ID not found in the URL.");
      setIsLoading(false);
      return;
    }

    const fetchPlotDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          // Redirect to login if not authenticated
          navigate("/login", { replace: true, state: { message: "Please log in to view plot details." } });
          return;
        }

        const res = await apiClient.get<PlotDetail>(`/micro-plots/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setPlot(res);
        
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
           setError("The plot you are looking for does not exist.");
        } else {
           setError("Failed to fetch plot details. Please try again later.");
        }
        console.error("Fetch details error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlotDetails();
  }, [id, navigate]); // Rerun effect if id or navigate function changes

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold text-gray-600">Loading Plot Details...</h1>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center bg-red-50 border border-red-200 rounded-lg mt-10">
        <h1 className="text-xl font-bold text-red-700">An Error Occurred</h1>
        <p className="text-red-600 mt-2">{error}</p>
        <Link to="/mysqft-listing" className="inline-block mt-4 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark">
          ← Back to Listings
        </Link>
      </div>
    );
  }

  // If plot is not found after loading
  if (!plot) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700">Plot Not Found</h2>
        <p className="text-gray-500 mt-2">The requested plot could not be found.</p>
        <Link to="/mysqft-listing" className="inline-block mt-4 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark">
          ← Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <Link to="/mysqft-listing" className="text-primary hover:text-primary-dark font-medium mb-4 inline-block">
            ← Back to All Listings
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-800">{plot.project_name}</h1>
          <p className="text-lg text-gray-500 mt-2">{plot.location}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image and Booking */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={plot.project_image || "https://via.placeholder.com/800x500.png?text=Image+Not+Available"}
                alt={plot.project_name}
                className="w-full h-96 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Description</h2>
                <p className="text-gray-600 leading-relaxed">{plot.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Details and Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <span className="text-gray-500 text-sm">Price per {plot.unit}</span>
                <p className="text-3xl font-bold text-primary">
                  ₹{parseFloat(plot.price).toLocaleString("en-IN")}
                </p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between">
                  <span className="font-semibold">Plot Type:</span>
                  <span className="capitalize">{plot.plot_type}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Unit:</span>
                  <span>{plot.unit}</span>
                </li>
                 <li className="flex justify-between">
                  <span className="font-semibold">Listed On:</span>
                  <span>{new Date(plot.created_at).toLocaleDateString()}</span>
                </li>
              </ul>
              <Link to={`/book-my-sqft`}>
              <Button  className="w-full mt-6 bg-green-600 text-white font-bold py-5 rounded-lg hover:bg-green-700 transition-colors duration-300 text-lg">
                Book This Plot Now
              </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">Project Resources</h3>
              {plot.google_map_link && (
                <a
                  href={plot.google_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  View on Google Maps
                </a>
              )}
              {plot.project_layout && (
                 <a href={plot.project_layout} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                  Download Project Layout
                </a>
              )}
              {plot.land_document && (
                <a href={plot.land_document} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                  Download Land Document
                </a>
              )}
              {/* Add video link if available */}
              {plot.project_video && (
                <a href={plot.project_video} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition">
                  Watch Project Video
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotDetailsPage;