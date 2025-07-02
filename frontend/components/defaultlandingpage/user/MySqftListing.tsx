import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../src/utils/api/apiClient"; // Make sure this path is correct
import { FaSpinner } from 'react-icons/fa';

// Define a type for the fetched micro-plot data for better type safety
interface MicroPlot {
    id: number;
    name: string;
    location: string;
    pricePerUnit: number;
    unit: string;
    imageUrl: string;
}

const DMySqftListing: React.FC = () => {
    const navigate = useNavigate();
    
    // State for live data, loading, and errors
    const [plots, setPlots] = useState<MicroPlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMicroPlots = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch data from the API
                const response = await apiClient.get('/public/micro-plots/');
                
                // Use the response directly as requested, defaulting to an empty array
                const apiData = response || [];

                // Map the API data to the structure needed by the component
                const mappedPlots: MicroPlot[] = apiData.map((plot: any) => ({
                    id: plot.id,
                    name: plot.project_name,
                    location: plot.location,
                    pricePerUnit: Number(plot.price),
                    unit: plot.unit,
                    imageUrl: plot.project_image || `https://picsum.photos/seed/${plot.id}/600/400`, // Use a placeholder image if null
                }));

                setPlots(mappedPlots);

            } catch (err) {
                console.error("Failed to fetch micro-plots:", err);
                setError("Could not load listings. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMicroPlots();
    }, []); // Empty dependency array ensures this runs only once on mount

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <FaSpinner className="animate-spin text-green-600 text-4xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 font-semibold">{error}</p>
            </div>
        );
    }

	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-green-700 mb-6">
				Book My SqFt Listings
			</h1>
			<div className="grid gap-6 sm:grid-cols-2">
				{plots.map((plot) => (
					<div
						key={plot.id}
						className="bg-white rounded-lg shadow hover:shadow-lg transition border border-neutral-200 p-6 flex flex-col group"
					>
						<div className="mb-3 overflow-hidden rounded">
							<img
								src={plot.imageUrl}
								alt={plot.name}
								className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
							/>
						</div>
						<div className="mb-2">
							<span className="text-lg font-semibold text-green-700">
								{plot.name}
							</span>
						</div>
						<div className="text-sm text-gray-600 mb-1">
							<span className="font-medium">Location:</span> {plot.location}
						</div>
						<div className="text-sm text-gray-600 mb-2">
							<span className="font-medium">Price:</span> ₹
							{plot.pricePerUnit.toLocaleString("en-IN")} per {plot.unit}
						</div>
						<button
							className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
							onClick={() => navigate(`/micro-plots/${plot.id}`)} // Navigate to the specific plot detail page
						>
							View Details
						</button>
					</div>
				))}
			</div>
            {plots.length === 0 && (
                <div className="text-center py-10 col-span-full">
                    <p className="text-gray-500">No "Book My SqFt" listings are available at the moment.</p>
                </div>
            )}
		</div>
	);
};

export default DMySqftListing;