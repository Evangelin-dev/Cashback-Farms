import React, { useEffect, useRef, useState } from "react";
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
    const [isPaused, setIsPaused] = useState(false);
    const autoplayRef = useRef<number | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchDeltaX = useRef<number>(0);
    const AUTOPLAY_MS = 3500;

    if (!images || images.length === 0) return null;

    // autoplay effect
    useEffect(() => {
        // clear any existing interval
        if (autoplayRef.current) {
            window.clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
        if (!isPaused && images.length > 1) {
            autoplayRef.current = window.setInterval(() => {
                setIdx((prev) => (prev + 1) % images.length);
            }, AUTOPLAY_MS);
        }
        return () => {
            if (autoplayRef.current) {
                window.clearInterval(autoplayRef.current);
                autoplayRef.current = null;
            }
        };
    }, [images.length, isPaused]);

    const goPrev = () => {
        setIdx((s) => (s - 1 + images.length) % images.length);
    };
    const goNext = () => {
        setIdx((s) => (s + 1) % images.length);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
        setIsPaused(true);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current == null) return;
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    };

    const onTouchEnd = () => {
        const delta = touchDeltaX.current;
        const SWIPE_THRESHOLD = 40; // pixels
        if (delta > SWIPE_THRESHOLD) {
            goPrev();
        } else if (delta < -SWIPE_THRESHOLD) {
            goNext();
        }
        touchStartX.current = null;
        touchDeltaX.current = 0;
        // resume autoplay after a short delay so user can view
        setTimeout(() => setIsPaused(false), 600);
    };

    return (
        <div className="w-full flex flex-col items-center mb-6 sm:mb-8">
            <div
                className="relative w-full flex justify-center"
                style={{ aspectRatio: '16/9' }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`carousel-${index}`}
                        className={`rounded-xl shadow-xl object-cover w-full max-w-2xl h-48 sm:h-64 md:h-72 lg:h-80 transition-opacity duration-500 absolute ${index === idx ? 'opacity-100' : 'opacity-0'}`}
                        style={{ aspectRatio: '16/9' }}
                        draggable={false}
                    />
                ))}

                {images.length > 1 && (
                    <>
                        <button
                            aria-label="previous image"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center z-10 hover:bg-black/60 transition"
                            onClick={() => { goPrev(); setIsPaused(true); setTimeout(() => setIsPaused(false), 1200); }}
                            type="button"
                            tabIndex={0}
                        >
                            ←
                        </button>
                        <button
                            aria-label="next image"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center z-10 hover:bg-black/60 transition"
                            onClick={() => { goNext(); setIsPaused(true); setTimeout(() => setIsPaused(false), 1200); }}
                            type="button"
                            tabIndex={0}
                        >
                            →
                        </button>
                    </>
                )}

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            aria-label={`go to image ${i + 1}`}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${i === idx ? 'bg-green-500' : 'bg-white/70 border border-green-400'} inline-block`}
                            onClick={() => { setIdx(i); setIsPaused(true); setTimeout(() => setIsPaused(false), 1200); }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const DBookMySqftPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // 2. GET THE CURRENT USER

    const [plotInfo, setPlotInfo] = useState<(BookMySqftPlotInfo & { imageUrl?: string; images?: string[]; google_maps_link?: string }) | null>(null);
    const [grid, setGrid] = useState<SqftUnit[][]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUnits, setSelectedUnits] = useState<SqftUnit[]>([]);
    const [showLoginPopup, setShowLoginPopup] = useState(false); // 3. State for the popup
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // Zoom / pan state for the large image
    const [zoomScale, setZoomScale] = useState<number>(1);
    const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const isPanningRef = useRef(false);
    const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
    // Buyer listing pagination
    const [buyerPage, setBuyerPage] = useState(0);

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
                // Build an images array from multiple possible fields (support up to 5)
                const collectedImages: string[] = [];
                // If API provides an array of images
                if (Array.isArray(apiPlot.images) && apiPlot.images.length) {
                    collectedImages.push(...apiPlot.images);
                }
                // push common single fields
                if (apiPlot.project_image) collectedImages.push(apiPlot.project_image);
                if (apiPlot.image_1) collectedImages.push(apiPlot.image_1);
                if (apiPlot.image_2) collectedImages.push(apiPlot.image_2);
                if (apiPlot.image_3) collectedImages.push(apiPlot.image_3);
                if (apiPlot.image_4) collectedImages.push(apiPlot.image_4);
                if (apiPlot.image_5) collectedImages.push(apiPlot.image_5);
                if (apiPlot.gallery && Array.isArray(apiPlot.gallery)) collectedImages.push(...apiPlot.gallery);
                // filter falsy and unique, limit to 5
                const uniqueImages = Array.from(new Set(collectedImages.filter(Boolean))).slice(0, 5);

                const mappedPlotInfo: BookMySqftPlotInfo & { imageUrl?: string; images?: string[]; google_maps_link?: string } = {
                    id: apiPlot.id,
                    name: apiPlot.project_name || apiPlot.title || apiPlot.name,
                    location: apiPlot.location || apiPlot.address || '',
                    totalUnits: 100, // Default value
                    unitsWide: 10, // Default value
                    unitsTall: 10, // Default value
                    sqftPricePerUnit: Number(apiPlot.price || apiPlot.price_per_unit || apiPlot.sqft_price_per_unit || 0),
                    emiOptions: [], // Default empty array
                    initialGrid: generateInitialGrid(10, 10),
                    imageUrl: uniqueImages[0] || `https://picsum.photos/seed/${apiPlot.id}/600/400`,
                    images: uniqueImages.length ? uniqueImages : undefined,
                    // Accept several possible names for a map URL from the backend
                    google_maps_link: apiPlot.google_maps_link || apiPlot.map_url || apiPlot.mapUrl || apiPlot.google_map || apiPlot.embed_map_url || null,
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

                                {/* Two-column layout: left 40% (image + map stacked), right 60% (dashboard + description) */}
                                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
                                    {/* Left column: 40% */}
                                    <div className="md:col-span-4 space-y-4">
                                        <div>
                                            {plotInfo.images && plotInfo.images.length ? (
                                                <ImageCarousel images={plotInfo.images} />
                                            ) : (
                                                <div className="bg-white rounded-xl shadow p-2 border border-green-100 h-48 overflow-hidden">
                                                    <img src={plotInfo.imageUrl} alt={plotInfo.name} className="w-full h-full object-cover rounded-md" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-white rounded-xl shadow p-2 border border-green-100 h-48 overflow-hidden">
                                            <h4 className="text-sm font-semibold text-green-700 mb-2">Map</h4>
                                            {plotInfo.google_maps_link ? (
                                                <div className="w-full h-36 rounded-md overflow-hidden border border-gray-100">
                                                    <iframe
                                                        src={plotInfo.google_maps_link}
                                                        title="Plot Map"
                                                        className="w-full h-full border-0"
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-600">{plotInfo.location || 'Map unavailable'}</div>
                                            )}
                                            {plotInfo.google_maps_link && (
                                                <div className="mt-2">
                                                    <a href={plotInfo.google_maps_link} target="_blank" rel="noreferrer" className="inline-block text-xs bg-green-600 text-white px-3 py-1 rounded">Open in Maps</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right column: 60% */}
                                    <div className="md:col-span-6 space-y-4">
                                        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-green-200">
                                            <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-4 text-center">Booking Status Overview</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-4 text-center">
                                                    <div className="w-16 h-16 mx-auto mb-3 bg-orange-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">52%</span>
                                                    </div>
                                                    <h3 className="font-semibold text-orange-800 mb-2">Already Booked</h3>
                                                    <p className="text-sm text-orange-700">Units that have been purchased</p>
                                                </div>

                                                <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 text-center">
                                                    <div className="w-16 h-16 mx-auto mb-3 bg-green-400 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">48%</span>
                                                    </div>
                                                    <h3 className="font-semibold text-green-800 mb-2">Available</h3>
                                                    <p className="text-sm text-green-700">Units ready for booking</p>
                                                </div>

                                                <div className="bg-green-600 border-2 border-green-700 rounded-xl p-4 text-center">
                                                    <div className="w-16 h-16 mx-auto mb-3 bg-green-800 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">0%</span>
                                                    </div>
                                                    <h3 className="font-semibold text-white mb-2">Reserved</h3>
                                                    <p className="text-sm text-green-100">Units in high demand</p>
                                                </div>
                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                                                <div className="flex h-4 rounded-full overflow-hidden">
                                                    <div className="bg-orange-500 h-full" style={{ width: '52%' }}></div>
                                                    <div className="bg-green-400 h-full" style={{ width: '48%' }}></div>
                                                    <div className="bg-green-800 h-full" style={{ width: '0%' }}></div>
                                                </div>
                                            </div>

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

                                        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col border border-green-200">
                                            <h1 className="text-xl sm:text-2xl font-extrabold text-green-800 mb-2 tracking-tight">{plotInfo.name}</h1>
                                            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
                                                <p><strong>Location:</strong> {plotInfo.location}</p>
                                                <p><strong>Price per SqFt Unit:</strong> ₹{plotInfo.sqftPricePerUnit.toLocaleString('en-IN')}</p>
                                                <p className="text-sm text-gray-600">{plotInfo.description || ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                {/* Two-column info + zoom image (left) and How it works + Buyer Listing (right) */}
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 border border-green-200">
                        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
                            {/* Left: zoomable image (60%) */}
                            <div className="md:col-span-6 flex flex-col items-center">
                                <div
                                    className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-100"
                                >
                                    <div
                                        className="w-full h-96 flex items-center justify-center bg-white relative overflow-hidden touch-none"
                                        // mouse events for pan
                                        onMouseDown={(e) => {
                                            if (zoomScale <= 1) return;
                                            isPanningRef.current = true;
                                            lastPointerRef.current = { x: e.clientX, y: e.clientY };
                                        }}
                                        onMouseMove={(e) => {
                                            if (!isPanningRef.current || !lastPointerRef.current) return;
                                            const dx = e.clientX - lastPointerRef.current.x;
                                            const dy = e.clientY - lastPointerRef.current.y;
                                            setPan(p => ({ x: p.x + dx, y: p.y + dy }));
                                            lastPointerRef.current = { x: e.clientX, y: e.clientY };
                                        }}
                                        onMouseUp={() => { isPanningRef.current = false; lastPointerRef.current = null; }}
                                        onMouseLeave={() => { isPanningRef.current = false; lastPointerRef.current = null; }}
                                        // touch events
                                        onTouchStart={(e) => {
                                            if (zoomScale <= 1) return;
                                            const t = e.touches[0];
                                            isPanningRef.current = true;
                                            lastPointerRef.current = { x: t.clientX, y: t.clientY };
                                        }}
                                        onTouchMove={(e) => {
                                            if (!isPanningRef.current || !lastPointerRef.current) return;
                                            const t = e.touches[0];
                                            const dx = t.clientX - lastPointerRef.current.x;
                                            const dy = t.clientY - lastPointerRef.current.y;
                                            setPan(p => ({ x: p.x + dx, y: p.y + dy }));
                                            lastPointerRef.current = { x: t.clientX, y: t.clientY };
                                        }}
                                        onTouchEnd={() => { isPanningRef.current = false; lastPointerRef.current = null; }}
                                    >
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <img
                                                src={plotInfo.imageUrl}
                                                alt={plotInfo.name}
                                                className="object-cover w-full h-full transition-transform duration-150"
                                                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`, cursor: zoomScale > 1 ? 'grab' : 'auto' }}
                                                draggable={false}
                                            />

                                            {/* Zoom controls (overlay) */}
                                            <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                                                <button
                                                    type="button"
                                                    className="px-3 py-2 bg-green-600 text-white rounded-md text-sm shadow"
                                                    onClick={() => setZoomScale(s => Math.min(3, +(s + 0.25).toFixed(2)))}
                                                >+</button>
                                                <button
                                                    type="button"
                                                    className="px-3 py-2 bg-white text-gray-800 rounded-md text-sm shadow"
                                                    onClick={() => setZoomScale(s => Math.max(1, +(s - 0.25).toFixed(2)))}
                                                >−</button>
                                                <button
                                                    type="button"
                                                    className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm shadow"
                                                    onClick={() => { setZoomScale(1); setPan({ x: 0, y: 0 }); }}
                                                >Reset</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: two rows - How it works & Buyer Listing (40%) */}
                            <div className="md:col-span-4 space-y-4">
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-2">How it works:</h3>
                                    <ol className="list-decimal list-inside text-gray-600 space-y-1 sm:space-y-2 text-sm sm:text-base pl-2">
                                        <li>Visually select the square footage units you wish to purchase from the grid.</li>
                                        <li>The grid shows available, selected, and already booked units.</li>
                                        <li>Your total cost is updated in real-time.</li>
                                        <li>Proceed to book and make your payment.</li>
                                        <li>Receive your digital booking receipt.</li>
                                    </ol>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-gray-100">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Buyer Listing</h3>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        {grid && grid.length ? (
                                            (() => {
                                                const booked = grid.flat().filter(u => u.isBooked);
                                                const perPage = 3;
                                                const totalPages = Math.max(1, Math.ceil(booked.length / perPage));
                                                const start = buyerPage * perPage;
                                                const pageItems = booked.slice(start, start + perPage);

                                                return (
                                                    <div>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {pageItems.map((u, i) => (
                                                                <div key={u.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                                    <div>
                                                                        <div className="text-sm font-medium">Buyer {start + i + 1}</div>
                                                                        <div className="text-xs text-gray-500">Unit {u.id}</div>
                                                                    </div>
                                                                    <div className="text-xs text-green-700 font-semibold">Booked</div>
                                                                </div>
                                                            ))}
                                                            {booked.length === 0 && (
                                                                <div className="text-xs text-gray-500">No recent buyers to show.</div>
                                                            )}
                                                        </div>

                                                        {/* Pagination controls */}
                                                        {booked.length > perPage && (
                                                            <div className="mt-3 flex items-center justify-between">
                                                                <button
                                                                    className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
                                                                    onClick={() => setBuyerPage(p => Math.max(0, p - 1))}
                                                                    disabled={buyerPage === 0}
                                                                >Prev</button>
                                                                <div className="text-xs text-gray-600">Page {buyerPage + 1} of {totalPages}</div>
                                                                <button
                                                                    className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
                                                                    onClick={() => setBuyerPage(p => Math.min(totalPages - 1, p + 1))}
                                                                    disabled={buyerPage >= totalPages - 1}
                                                                >Next</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="text-xs text-gray-500">Buyer data unavailable.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Ranges + Grid + Selected plots */}
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-green-200">
                        <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-4 text-center">Choose Range & Select Units</h2>

                        {/* First row: ranges */}
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {Array.from({ length: 30 }).map((_, i) => {
                                    const start = i * 100 + 1;
                                    const end = (i + 1) * 100;
                                    const label = `${start}-${end}`;
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            className="text-xs sm:text-sm px-3 py-1 rounded-full bg-gray-100 border border-gray-200 hover:bg-green-50"
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Second row: grid (left) and selected plots (right) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                            <div className="md:col-span-2">
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 overflow-auto" style={{ minHeight: '300px' }}>
                                    <SqftGrid
                                        gridData={grid}
                                        onUnitSelect={handleUnitSelect}
                                        unitSize={window.innerWidth < 640 ? 24 : window.innerWidth < 1024 ? 26 : 28}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-1 bg-white rounded-lg p-3 border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">Selected Plots</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            className="text-xs px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                                            onClick={() => {
                                                // clear all selections
                                                setGrid(prev => prev.map(row => row.map(u => ({ ...u, isSelected: false }))));
                                                setSelectedUnits([]);
                                            }}
                                            disabled={selectedUnits.length === 0}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-700">
                                    <div className="text-xs text-gray-500">Total selected: <strong>{totalSelectedArea}</strong></div>
                                    <div className="text-xs text-gray-500">Total cost: <strong>₹{totalCost.toLocaleString('en-IN')}</strong></div>

                                    <div className="mt-3 space-y-2">
                                        {selectedUnits.length ? (
                                            selectedUnits.map(u => (
                                                <div key={u.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                    <div>
                                                        <div className="text-sm font-medium">Unit {u.id}</div>
                                                        <div className="text-xs text-gray-500">Row {u.row + 1}, Col {u.col + 1}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm text-green-700">₹{(plotInfo?.sqftPricePerUnit || 0).toLocaleString('en-IN')}</div>
                                                        <button
                                                            type="button"
                                                            className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded"
                                                            onClick={() => {
                                                                // remove this unit from selection
                                                                setGrid(prev => prev.map(row => row.map(unit => unit.id === u.id ? { ...unit, isSelected: false } : unit)));
                                                                setSelectedUnits(prev => prev.filter(x => x.id !== u.id));
                                                            }}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-xs text-gray-500">No units selected yet.</div>
                                        )}
                                    </div>
                                </div>
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