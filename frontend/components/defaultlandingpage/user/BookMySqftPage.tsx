import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // 1. IMPORT the useAuth hook
import apiClient from "../../../src/utils/api/apiClient";
import { BookMySqftPlotInfo, SqftUnit } from '../../../types';
import Button from '../../common/Button';
import SqftGrid from '../defaultlandingcomponents/plot/SqftGrid';

// Helper function to generate a default grid since the API doesn't provide one
const generateInitialGrid = (rows: number, cols: number): SqftUnit[][] => {
    const totalUnits = rows * cols;
    const bookedUnits = Math.floor(totalUnits * 0.52); // 52% of units will be booked
    
    // Create array of all unit positions
    const allPositions = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            allPositions.push({ row: r, col: c });
        }
    }
    
    // Randomly select 52% of positions to be booked
    const bookedPositions = new Set();
    for (let i = 0; i < bookedUnits; i++) {
        const randomIndex = Math.floor(Math.random() * allPositions.length);
        const position = allPositions.splice(randomIndex, 1)[0];
        bookedPositions.add(`${position.row}-${position.col}`);
    }
    
    return Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
            const unitId = `${r}-${c}`;
            const isBooked = bookedPositions.has(unitId);
            
            return {
                id: unitId,
                row: r,
                col: c,
                isAvailable: !isBooked,
                isSelected: false,
                isBooked: isBooked,
            };
        })
    );
};

// Auth Popup Component
const AuthPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 animate-fade-in px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm mx-4 flex flex-col items-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" /></svg>
            <div className="text-lg sm:text-xl font-bold text-green-700 mb-2 text-center">Authentication Required</div>
            <div className="text-sm sm:text-base text-gray-600 text-center mb-6">Please login or sign up to continue.</div>
            <button className="w-full py-2.5 sm:py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm sm:text-base" onClick={onClose}>
                Close
            </button>
        </div>
    </div>
);

const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
    const [idx, setIdx] = useState(0);
    if (!images || images.length === 0) return null;
    return (
        <div className="w-full flex flex-col items-center mb-6 sm:mb-8">
            <div className="relative w-full flex justify-center" style={{ aspectRatio: '16/9' }}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`carousel-${index}`}
                        className={`rounded-xl shadow-xl object-cover w-full max-w-2xl h-48 sm:h-64 md:h-72 lg:h-80 transition-opacity duration-500 absolute ${index === idx ? 'opacity-100' : 'opacity-0'}`}
                        style={{ aspectRatio: '16/9' }}
                    />
                ))}
                {images.length > 1 && (
                    <>
                        <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center z-10 hover:bg-black/60 transition" onClick={() => setIdx((idx - 1 + images.length) % images.length)} type="button" tabIndex={0}>←</button>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center z-10 hover:bg-black/60 transition" onClick={() => setIdx((idx + 1) % images.length)} type="button" tabIndex={0}>→</button>
                    </>
                )}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
                    {images.map((_, i) => (<span key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${i === idx ? 'bg-green-500' : 'bg-white/70 border border-green-400'} inline-block`}/>))}
                </div>
            </div>
        </div>
    );
};

const DBookMySqftPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // 2. GET THE CURRENT USER

    const [plotInfo, setPlotInfo] = useState<(BookMySqftPlotInfo & { imageUrl?: string }) | null>(null);
    const [grid, setGrid] = useState<SqftUnit[][]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUnits, setSelectedUnits] = useState<SqftUnit[]>([]);
    const [showLoginPopup, setShowLoginPopup] = useState(false); // 3. State for the popup
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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
                const apiPlot = response.data || response; // Correctly access response.data
                const mappedPlotInfo: BookMySqftPlotInfo & { imageUrl?: string } = {
                    id: apiPlot.id,
                    name: apiPlot.project_name,
                    location: apiPlot.location,
                    totalUnits: 100, // Default value
                    unitsWide: 10, // Default value
                    unitsTall: 10, // Default value
                    sqftPricePerUnit: Number(apiPlot.price),
                    emiOptions: [], // Default empty array
                    initialGrid: generateInitialGrid(10, 10),
                    imageUrl: apiPlot.project_image || `https://picsum.photos/seed/${apiPlot.id}/600/400`,
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
            // Only allow selection if unit is available and not booked
            if (unit.isAvailable && !unit.isBooked) {
                unit.isSelected = !unit.isSelected;
                if (unit.isSelected) {
                    setSelectedUnits(prevSelected => [...prevSelected, unit]);
                } else {
                    setSelectedUnits(prevSelected => prevSelected.filter(u => u.id !== unit.id));
                }
            }
            // If unit is booked, show a message
            if (unit.isBooked) {
                alert("This unit is already booked and cannot be selected.");
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
        // Show payment popup
        setShowPaymentPopup(true);
    };

    // Handler for payment done
    const handlePaymentDone = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowPaymentPopup(false);
            navigate('/mysqft-listing');
        }, 2000);
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <FaSpinner className="animate-spin text-green-600 text-3xl sm:text-4xl" />
        </div>
    );
    
    if (error || !plotInfo) return (
        <div className="text-center py-12 sm:py-20 px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">{error}</p>
            <Button className="mt-4" onClick={() => navigate('/Dbook-my-sqft')}>Back to Listings</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-4 sm:py-6 px-3 sm:px-4">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 sm:gap-6">
                {/* Back Button at the top */}
                <div className="w-full flex justify-start mb-1 sm:mb-2">
                    <button
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-green-100 text-green-800 font-semibold shadow hover:bg-green-200 transition text-sm sm:text-base"
                        onClick={() => navigate(-1)}
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        Back
                    </button>
                </div>

                {/* Image at the top */}
                <div className="w-full max-w-4xl">
                    <img
                        src={plotInfo.imageUrl}
                        alt={plotInfo.name}
                        className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover rounded-2xl shadow-xl border border-green-200 mt-2 sm:mt-6 mb-2"
                        style={{ aspectRatio: '16/9' }}
                    />
                </div>

                {/* Description below image */}
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-start mb-2 sm:mb-4">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-green-800 mb-2 sm:mb-3 tracking-tight drop-shadow leading-tight">
                        {plotInfo.name}
                    </h1>
                    <div className="space-y-1 sm:space-y-2 text-sm sm:text-base lg:text-lg text-gray-700">
                        <p><strong>Location:</strong> {plotInfo.location}</p>
                        <p><strong>Price per SqFt Unit:</strong> ₹{plotInfo.sqftPricePerUnit.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Booking Status Graph */}
                <div className="w-full max-w-4xl mb-6">
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-green-200">
                        <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-4 text-center">Booking Status Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* 52% Already Booked - Orange */}
                            <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-4 text-center">
                                <div className="w-16 h-16 mx-auto mb-3 bg-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">52%</span>
                                </div>
                                <h3 className="font-semibold text-orange-800 mb-2">Already Booked</h3>
                                <p className="text-sm text-orange-700">Units that have been purchased</p>
                            </div>
                            
                            {/* Available - Light Green */}
                            <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 text-center">
                                <div className="w-16 h-16 mx-auto mb-3 bg-green-400 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">48%</span>
                                </div>
                                <h3 className="font-semibold text-green-800 mb-2">Available</h3>
                                <p className="text-sm text-green-700">Units ready for booking</p>
                            </div>
                            
                            {/* Reserved - Dark Green */}
                            <div className="bg-green-600 border-2 border-green-700 rounded-xl p-4 text-center">
                                <div className="w-16 h-16 mx-auto mb-3 bg-green-800 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">0%</span>
                                </div>
                                <h3 className="font-semibold text-white mb-2">Reserved</h3>
                                <p className="text-sm text-green-100">Units in high demand</p>
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                            <div className="flex h-4 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full" style={{ width: '52%' }}></div>
                                <div className="bg-green-400 h-full" style={{ width: '48%' }}></div>
                                <div className="bg-green-800 h-full" style={{ width: '0%' }}></div>
                            </div>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                <span className="text-gray-700">Booked (52%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-400 rounded"></div>
                                <span className="text-gray-700">Available (48%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-800 rounded"></div>
                                <span className="text-gray-700">Reserved (0%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid section */}
                <div className="w-full max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-green-200">
                        <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-4 text-center">Select Your Units</h2>
                        <div className="flex justify-center items-center overflow-auto" style={{ minHeight: '300px' }}>
                            <div className="flex-shrink-0">
                                <SqftGrid 
                                    gridData={grid} 
                                    onUnitSelect={handleUnitSelect} 
                                    unitSize={window.innerWidth < 640 ? 24 : window.innerWidth < 1024 ? 26 : 28} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking summary */}
                <div className="w-full max-w-4xl">
                    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 sm:gap-6">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700 text-center">Booking Summary</h2>
                        <div className="text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base lg:text-lg w-full max-w-md">
                            <div className="grid grid-cols-1 gap-1 sm:gap-2">
                                <p><strong>Location:</strong> {plotInfo.location}</p>
                                <p><strong>Price per SqFt Unit:</strong> ₹{plotInfo.sqftPricePerUnit.toLocaleString('en-IN')}</p>
                                <p><strong>Selected Units:</strong> {totalSelectedArea}</p>
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 pt-2 border-t border-green-200">
                                    Total Cost: ₹{totalCost.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                        <div className="w-full max-w-md">
                            <Button 
                                variant="primary" 
                                size="lg" 
                                className="w-full text-sm sm:text-base lg:text-lg py-3 sm:py-4"
                                onClick={handleBooking}
                                disabled={totalSelectedArea === 0}
                            >
                                Proceed to Book ({totalSelectedArea} Units)
                            </Button>
                            {totalSelectedArea === 0 && (
                                <p className="text-xs sm:text-sm text-red-500 text-center mt-2 sm:mt-3">
                                    Please select units from the grid.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* How it works section */}
                <div className="w-full max-w-4xl mt-8 sm:mt-12 p-4 sm:p-6 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-3 sm:mb-4">How it works:</h3>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1 sm:space-y-2 text-sm sm:text-base pl-2">
                        <li>Visually select the square footage units you wish to purchase from the grid.</li>
                        <li>The grid shows available, selected, and already booked units.</li>
                        <li>Your total cost is updated in real-time.</li>
                        <li>Proceed to book and make your payment.</li>
                        <li>Receive your digital booking receipt.</li>
                    </ol>
                </div>
            </div>

            {/* 5. RENDER THE POPUP CONDITIONALLY */}
            {showLoginPopup && <AuthPopup onClose={() => setShowLoginPopup(false)} />}
            
            {/* Payment Popup */}
            {showPaymentPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-sm mx-4 flex flex-col items-center relative">
                        {isProcessing ? (
                            <div className="flex flex-col items-center justify-center py-4">
                                <FaSpinner className="animate-spin text-green-600 text-3xl sm:text-4xl mb-4" />
                                <div className="text-base sm:text-lg font-semibold text-green-700 mb-2 text-center">
                                    Processing Payment...
                                </div>
                            </div>
                        ) : (
                            <>
                                <img
                                    src="/QRcode/microplotpayment.jpg"
                                    alt="Sample QR Code"
                                    className="w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 object-contain mb-4 border border-green-200 rounded-xl shadow"
                                />
                                <div className="text-xs sm:text-sm text-green-700 mb-4 text-center font-mono">
                                    UPI ID: 8190019991.eazypay@icici
                                </div>
                                <div className="text-base sm:text-lg font-bold text-green-700 mb-2 text-center">
                                    Scan to Pay
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 text-center mb-4 sm:mb-6 leading-relaxed">
                                    Scan this QR code to complete your payment.<br/>
                                    After payment, click below.
                                </div>
                                <div className="w-full space-y-2 sm:space-y-3">
                                    <button
                                        className="w-full py-2.5 sm:py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm sm:text-base"
                                        onClick={handlePaymentDone}
                                    >
                                        Payment Done
                                    </button>
                                    <button
                                        className="w-full py-2.5 sm:py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition text-sm sm:text-base"
                                        onClick={() => setShowPaymentPopup(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DBookMySqftPage;