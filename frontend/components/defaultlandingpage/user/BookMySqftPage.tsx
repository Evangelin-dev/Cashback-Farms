import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_BMS_PLOT_INFO } from '../../../constants';
import { BookMySqftPlotInfo, SqftUnit } from '../../../types';
import Button from '../../common/Button';
import SqftGrid from '../defaultlandingcomponents/plot/SqftGrid';



const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [idx, setIdx] = useState(0);
  if (!images.length) return null;
  return (
    <div className="w-full flex flex-col items-center mb-8">
      <div className="relative w-full flex justify-center" style={{ aspectRatio: '16/9', maxHeight: 280 }}>
        <img
          src={images[idx]}
          alt={`carousel-${idx}`}
          className="rounded-xl shadow-xl object-cover w-full md:w-[420px] h-[280px] transition-all duration-300"
          style={{ aspectRatio: '16/9', maxHeight: 280 }}
        />
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center z-10"
              onClick={() => setIdx((idx - 1 + images.length) % images.length)}
              type="button"
              tabIndex={0}
            >
              &#8592;
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center z-10"
              onClick={() => setIdx((idx + 1) % images.length)}
              type="button"
              tabIndex={0}
            >
              &#8594;
            </button>
          </>
        )}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${i === idx ? 'bg-green-500' : 'bg-white/70 border border-green-400'} inline-block`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DBookMySqftPage: React.FC = () => {
  const { plotId } = useParams<{ plotId: string }>();
  const navigate = useNavigate();

  // In a real app, fetch this data based on plotId
  const [plotInfo, setPlotInfo] = useState<BookMySqftPlotInfo | null>(MOCK_BMS_PLOT_INFO);
  const [grid, setGrid] = useState<SqftUnit[][]>(plotInfo?.initialGrid || []);
  const [selectedUnits, setSelectedUnits] = useState<SqftUnit[]>([]);
  const [paymentOption, setPaymentOption] = useState("");
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // Simulate fetching plot data if plotId changes or for initial load
    // For now, we only have one mock plot for BMS
    if (plotId !== MOCK_BMS_PLOT_INFO.id) {
      // Handle case where plotId is not the expected mock ID, e.g. navigate to error or default
      console.warn(`BookMySqftPage: Plot ID ${plotId} not found, using default mock plot.`);
    }
    setPlotInfo(MOCK_BMS_PLOT_INFO);
    setGrid(MOCK_BMS_PLOT_INFO.initialGrid);
    setSelectedUnits([]); // Reset selection when plot changes
  }, [plotId]);

  const handleUnitSelect = (row: number, col: number) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => r.map(unit => ({ ...unit })));
      const unit = newGrid[row][col];
      if (unit.isAvailable) {
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

  if (!plotInfo) {
    return null;
  }

  const totalSelectedArea = selectedUnits.length;
  const totalCost = totalSelectedArea * plotInfo.sqftPricePerUnit;

  const handleBooking = () => {
    if (totalSelectedArea === 0) {
      alert("Please select at least one unit to book.");
      return;
    }
    // Remove payment option check
    setShowPaymentPopup(true);
  };

  // Use fallback image/video if not present in plotInfo
  const plotImageUrl =
    (plotInfo && (plotInfo as any).imageUrl)
      ? (plotInfo as any).imageUrl
      : "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80";
  const plotVideoUrl =
    (plotInfo && (plotInfo as any).videoUrl && (plotInfo as any).videoUrl.trim() !== "")
      ? (plotInfo as any).videoUrl
      : "https://www.w3schools.com/html/mov_bbb.mp4";

  // Example carousel images (replace with real images if available)
  const carouselImages = [
    plotImageUrl,
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-6 px-2">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        {/* Title at the top */}
        <h1 className="text-3xl font-extrabold text-green-800 mb-2 mt-4 tracking-tight drop-shadow">
          {/* ...your page title here... */}
          Book My SqFt
        </h1>
        {/* SqftGrid at the top */}
        <div className="w-full flex flex-col items-center">
          {/* Remove Zoom controls */}
          {/* SqftGrid - larger and zoomable */}
          <div
            className="flex justify-center items-center"
            style={{
              overflow: 'auto',
              borderRadius: 12,
              border: '2px solid #bbf7d0',
              background: '#fff',
              marginBottom: 16,
              width: '100%',
              minHeight: 350,
            }}
          >
            <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}>
              <SqftGrid gridData={grid} onUnitSelect={handleUnitSelect}  unitSize={28} />
            </div>
          </div>
        </div>
        {/* Carousel outside the summary card */}
        <div className="w-full flex flex-col items-center">
          <ImageCarousel images={carouselImages} />
        </div>
        {/* Move the summary/info card to the bottom, horizontal layout */}
        <div className="w-full mt-4 flex flex-col items-center">
          <div
            className="md:col-span-1 bg-white p-10 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center md:items-stretch gap-10 w-full max-w-5xl"
          >
            {/* Image/Video on hover on the left */}
            <div
              className="flex-shrink-0 flex items-center justify-center w-full md:w-[420px]"
              style={{ position: 'relative', aspectRatio: '16/9', maxHeight: 280 }}
              onMouseEnter={e => {
                const video = (e.currentTarget.querySelector('video') as HTMLVideoElement | null);
                if (video) {
                  video.style.opacity = '1';
                  video.currentTime = 0;
                  video.play();
                }
                const img = (e.currentTarget.querySelector('img') as HTMLImageElement | null);
                if (img) img.style.opacity = '0';
              }}
              onMouseLeave={e => {
                const video = (e.currentTarget.querySelector('video') as HTMLVideoElement | null);
                if (video) {
                  video.pause();
                  video.style.opacity = '0';
                }
                const img = (e.currentTarget.querySelector('img') as HTMLImageElement | null);
                if (img) img.style.opacity = '1';
              }}
            >
              <img
                src={plotImageUrl}
                alt="Plot"
                className="rounded-xl shadow-xl object-cover w-full md:w-[420px] h-[280px] transition-opacity duration-200"
                style={{ aspectRatio: '16/9', maxHeight: 280, position: 'absolute', top: 0, left: 0, opacity: 1, zIndex: 1 }}
              />
              <video
                src={plotVideoUrl}
                loop
                muted
                playsInline
                className="rounded-xl shadow-xl object-cover w-full md:w-[420px] h-[280px] transition-opacity duration-200"
                style={{ aspectRatio: '16/9', maxHeight: 280, position: 'absolute', top: 0, left: 0, opacity: 0, zIndex: 2 }}
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded pointer-events-none z-10">
                Hover to preview video
              </div>
            </div>
            {/* Text and details on the right */}
            <div className="flex-1 flex flex-col justify-center items-start w-full text-lg">
              {/* ...existing code... */}
              <h2 className="text-2xl font-bold text-green-700 mb-4">Booking Summary</h2>
              <div className="text-gray-700 mb-4 space-y-2">
                <p><strong>Plot:</strong> {plotInfo.name}</p>
                <p><strong>Price per Unit:</strong> ₹{plotInfo.sqftPricePerUnit.toLocaleString('en-IN')}</p>
                <p><strong>Selected Units:</strong> {totalSelectedArea}</p>
                <p className="text-2xl font-bold text-green-600">
                  Total Cost: ₹{totalCost.toLocaleString('en-IN')}
                </p>
              </div>
              {/* Booking Button */}
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
      </div>

      <div className="mt-12 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-xl font-semibold text-green-700 mb-2">How it works:</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1">
            <li>Visually select the square footage units you wish to purchase from the grid.</li>
            <li>The grid shows available, selected, and already booked units.</li>
            <li>Your total cost is updated in real-time.</li>
            <li>Proceed to book and make payment (mocked for MVP).</li>
            <li>Receive your digital booking receipt.</li>
        </ol>
      </div>
      {/* BookMySqftPayment as popup */}
     
    </div>
  );
};

export default DBookMySqftPage;

