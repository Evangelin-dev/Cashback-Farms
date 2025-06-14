import React from "react";
import { useNavigate } from "react-router-dom";

const plotData = [
	{
		id: "bms-plot-alpha",
		name: "Alpha Residency - Book My SqFt",
		location: "Sector 21, Noida",
		totalUnits: 100,
		sqftPricePerUnit: 25000,
		imageUrl: "https://picsum.photos/seed/bms1/400/220",
	},
	{
		id: "bms-plot-beta",
		name: "Beta Square - Book My SqFt",
		location: "Tech Park, Bengaluru",
		totalUnits: 80,
		sqftPricePerUnit: 22000,
		imageUrl: "https://picsum.photos/seed/bms2/400/220",
	},
	{
		id: "bms-plot-gamma",
		name: "Gamma Greens - Book My SqFt",
		location: "Green Meadows, Pune",
		totalUnits: 120,
		sqftPricePerUnit: 18000,
		imageUrl: "https://picsum.photos/seed/bms3/400/220",
	},
];

const DMySqftListing: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-primary-light mb-6">
				Book My SqFt Listings
			</h1>
			<div className="grid gap-6 sm:grid-cols-2">
				{plotData.map((plot) => (
					<div
						key={plot.id}
						className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-neutral-200 p-6 flex flex-col group"
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
						<div className="text-sm text-gray-600 mb-1">
							<span className="font-medium">Total Units:</span>{" "}
							{plot.totalUnits}
						</div>
						<div className="text-sm text-gray-600 mb-2">
							<span className="font-medium">Price per Unit:</span>₹
							{plot.sqftPricePerUnit.toLocaleString("en-IN")}
						</div>
						<button
							className="mt-auto bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
							onClick={() => navigate(`/Dbook-my-sqft`)}
						>
							Book Now
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default DMySqftListing;
