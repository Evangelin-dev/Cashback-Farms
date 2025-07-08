import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../src/utils/api/apiClient";
import { BookMySqftPlotInfo, SqftUnit } from '../../../types';
import Button from '../../common/Button';
import SqftGrid from '../defaultlandingcomponents/plot/SqftGrid';
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext"; // 1. IMPORT the useAuth hook

// Helper function to generate a default grid since the API doesn't provide one
const generateInitialGrid = (rows: number, cols: number): SqftUnit[][] => {
    return Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => ({
            id: `${r}-${c}`,
            row: r,
            col: c,
            isAvailable: true,
            isSelected: false,
            isBooked: false,
        }))
    );
};

// Auth Popup Component
const AuthPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center">
            <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" /></svg>
            <div className="text-xl font-bold text-green-700 mb-2 text-center">Authentication Required</div>
            <div className="text-gray-600 text-center mb-6">Please login or sign up to continue.</div>
            <button className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition" onClick={onClose}>
            Close
            </button>
        </div>
    </div>
);


const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
    const [idx, setIdx] = useState(0);
    if (!images || images.length === 0) return null;
    return (
      <div className="w-full flex flex-col items-center mb-8">
        <div className="relative w-full flex justify-center" style={{ aspectRatio: '16/9', maxHeight: 280 }}>
            {images.map((image, index) => (
                 <img
                    key={index}
                    src={image}
                    alt={`carousel-${index}`}
                    className={`rounded-xl shadow-xl object-cover w-full md:w-[420px] h-[280px] transition-opacity duration-500 absolute ${index === idx ? 'opacity-100' : 'opacity-0'}`}
                    style={{ aspectRatio: '16/9', maxHeight: 280 }}
                />
            ))}
          {images.length > 1 && (
            <>
              <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center z-10" onClick={() => setIdx((idx - 1 + images.length) % images.length)} type="button" tabIndex={0}>←</button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center z-10" onClick={() => setIdx((idx + 1) % images.length)} type="button" tabIndex={0}>→</button>
            </>
          )}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (<span key={i} className={`w-3 h-3 rounded-full ${i === idx ? 'bg-green-500' : 'bg-white/70 border border-green-400'} inline-block`}/>))}
          </div>
        </div>
      </div>
    );
};

const DBookMySqftPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // 2. GET THE CURRENT USER

  const [plotInfo, setPlotInfo] = useState<BookMySqftPlotInfo | null>(null);
  const [grid, setGrid] = useState<SqftUnit[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<SqftUnit[]>([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // 3. State for the popup

  useEffect(() => {
    if (!id) {
        setIsLoading(false);
        setError("No Micro-Plot ID was provided in the URL.");
        return;
    }

    const fetchMicroPlot = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/public/micro-plots/${id}/`);
            const apiPlot = response; // Correctly access response.data
            const mappedPlotInfo: BookMySqftPlotInfo = {
                id: apiPlot.id,
                name: apiPlot.project_name,
                location: apiPlot.location,
                sqftPricePerUnit: Number(apiPlot.price),
                imageUrl: apiPlot.project_image || `https://picsum.photos/seed/${apiPlot.id}/600/400`,
                initialGrid: generateInitialGrid(10, 10), 
            };
            setPlotInfo(mappedPlotInfo);
            setGrid(mappedPlotInfo.initialGrid);
            setSelectedUnits([]);
        } catch (err) {
            setError("This micro-plot could not be found or there was an error loading it.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchMicroPlot();
  }, [id]);

  const handleUnitSelect = (row: number, col: number) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => r.map(unit => ({ ...unit })));
      const unit = newGrid[row][col];
      if (unit.isAvailable && !unit.isBooked) {
        unit.isSelected = !unit.isSelected;
        if (unit.isSelected) {
          setSelectedUnits(prevSelected => [...prevSelected, unit]);
        } else {
          setSelectedUnits(prevSelected => prevSelected.filter(u => u.id !== unit.id));
        }
      }
      return newGrid;
    });
  };

  const totalSelectedArea = selectedUnits.length;
  const totalCost = totalSelectedArea * (plotInfo?.sqftPricePerUnit || 0);

  // 4. MODIFIED booking handler
  const handleBooking = () => {
    if (totalSelectedArea === 0) {
      alert("Please select at least one unit to book.");
      return;
    }
    // Check for user before proceeding
    if (!currentUser) {
        setShowLoginPopup(true);
        return;
    }
    // If user exists, proceed with booking
    alert(`Booking ${totalSelectedArea} units for a total of ₹${totalCost.toLocaleString('en-IN')}`);
    // Here you would navigate to a checkout page, e.g., navigate('/checkout');
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-green-600 text-4xl" /></div>;
  if (error || !plotInfo) return <div className="text-center py-20"><h2 className="text-2xl font-bold text-red-600">Error</h2><p className="mt-2 text-gray-600">{error}</p><Button className="mt-4" onClick={() => navigate('/Dbook-my-sqft')}>Back to Listings</Button></div>;

  const carouselImages = [ plotInfo.imageUrl, "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-6 px-2">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        <h1 className="text-3xl font-extrabold text-green-800 mb-2 mt-4 tracking-tight drop-shadow">
          {plotInfo.name}
        </h1>
        <div className="w-full flex flex-col items-center">
          <div className="flex justify-center items-center" style={{ overflow: 'auto', borderRadius: 12, border: '2px solid #bbf7d0', background: '#fff', marginBottom: 16, width: '100%', minHeight: 350 }}>
            <div>
              <SqftGrid gridData={grid} onUnitSelect={handleUnitSelect} unitSize={28} />
            </div>
          </div>
        </div>
        
        <ImageCarousel images={carouselImages} />

        <div className="w-full mt-4 flex flex-col items-center">
          <div className="md:col-span-1 bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-10 w-full max-w-5xl">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Booking Summary</h2>
            <div className="text-gray-700 mb-4 space-y-2 text-lg">
                <p><strong>Location:</strong> {plotInfo.location}</p>
                <p><strong>Price per SqFt Unit:</strong> ₹{plotInfo.sqftPricePerUnit.toLocaleString('en-IN')}</p>
                <p><strong>Selected Units:</strong> {totalSelectedArea}</p>
                <p className="text-2xl font-bold text-green-600">Total Cost: ₹{totalCost.toLocaleString('en-IN')}</p>
            </div>
            <Button 
                variant="primary" 
                size="lg" 
                className="w-full mt-6 text-lg py-3"
                onClick={handleBooking}
                disabled={totalSelectedArea === 0}
            >
                Proceed to Book ({totalSelectedArea} Units)
            </Button>
            {totalSelectedArea === 0 && <p className="text-sm text-red-500 text-center mt-3">Please select units from the grid.</p>}
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto mt-12 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-xl font-semibold text-green-700 mb-2">How it works:</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1">
            <li>Visually select the square footage units you wish to purchase from the grid.</li>
            <li>The grid shows available, selected, and already booked units.</li>
            <li>Your total cost is updated in real-time.</li>
            <li>Proceed to book and make your payment.</li>
            <li>Receive your digital booking receipt.</li>
        </ol>
      </div>

      {/* 5. RENDER THE POPUP CONDITIONALLY */}
      {showLoginPopup && <AuthPopup onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};

export default DBookMySqftPage;