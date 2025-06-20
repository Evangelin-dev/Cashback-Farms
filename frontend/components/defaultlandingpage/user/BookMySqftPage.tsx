import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from '../../../components/common/Button';
import SqftGrid from '../../../components/landingpage/landingpagecomponents/plot/SqftGrid';
import { MOCK_BMS_PLOT_INFO } from '../../../constants';
import { BookMySqftPlotInfo, SqftUnit } from '../../../types';


const DBookMySqftPage: React.FC = () => {
  const { plotId } = useParams<{ plotId: string }>();
  const navigate = useNavigate();

  // In a real app, fetch this data based on plotId
  const [plotInfo, setPlotInfo] = useState<BookMySqftPlotInfo | null>(MOCK_BMS_PLOT_INFO);
  const [grid, setGrid] = useState<SqftUnit[][]>(plotInfo?.initialGrid || []);
  const [selectedUnits, setSelectedUnits] = useState<SqftUnit[]>([]);
  const [paymentOption, setPaymentOption] = useState("");
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  const PAYMENT_OPTIONS = [
    "20% Booking Advance",
    "50% 2nd Installment",
    "30% Final Amount"
  ];

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

  const handleUnitSelect = useCallback((row: number, col: number) => {
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
  }, []);

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
    if (!paymentOption) {
      alert("Please select a PAYMENT OPTION before proceeding.");
      return;
    }
    alert(`Booking ${totalSelectedArea} units for a total of ₹${totalCost.toLocaleString('en-IN')}. \nPlot: ${plotInfo.name}\nSelected Units: ${selectedUnits.map(u => u.id).join(', ')}\nPayment Option: ${paymentOption}\nThis is a mock confirmation.`);
    // In a real app, this would navigate to a payment page or show a success modal.
    // For MVP, we can reset selection or navigate away.
    // navigate('/booking-confirmation'); // Example
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Book My (SqFt,SqYd,SqCm)</h1>
        <p className="mt-2 text-lg text-gray-600">
          Select your desired area from <span className="font-semibold">{plotInfo.name}</span> located at {plotInfo.location}.
        </p>
      </div>

      {/* ...LandPlotSelector UI if needed... */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col items-center md:items-start">
          <SqftGrid gridData={grid} onUnitSelect={handleUnitSelect} />
        </div>
        {/* Plot detail card (right) */}
        <div
          className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
          style={{ minWidth: 320, maxWidth: 320 }}
        >
          {/* Plot image with video on hover, above Booking Summary */}
          <div
            className="mb-6 w-full flex justify-center"
            style={{ maxWidth: 320 }}
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
            <div className="relative w-full" style={{ aspectRatio: '16/9', maxHeight: 180 }}>
              <img
                src={plotImageUrl}
                alt="Plot"
                className="rounded-lg shadow-lg w-full object-cover transition-opacity duration-200"
                style={{ aspectRatio: '16/9', maxHeight: 180, position: 'absolute', top: 0, left: 0, opacity: 1, zIndex: 1 }}
              />
              <video
                src={plotVideoUrl}
                loop
                muted
                playsInline
                className="rounded-lg shadow-lg w-full object-cover transition-opacity duration-200"
                style={{ aspectRatio: '16/9', maxHeight: 180, position: 'absolute', top: 0, left: 0, opacity: 0, zIndex: 2 }}
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded pointer-events-none z-10">
                Hover to preview video
              </div>
            </div>
          </div>
          {/* Booking Summary */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Booking Summary</h2>
          <div className="space-y-3">
            <p><strong>Plot:</strong> {plotInfo.name}</p>
            <p><strong>Price per Unit:</strong> ₹{plotInfo.sqftPricePerUnit.toLocaleString('en-IN')}</p>
            <p><strong>Selected Units:</strong> {totalSelectedArea}</p>
            <p className="text-xl font-bold text-green-600">
              Total Cost: ₹{totalCost.toLocaleString('en-IN')}
            </p>
          </div>
          {/* PAYMENT OPTIONS Dropdown - improved UI */}
          <div className="w-full mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">PAYMENT OPTIONS</label>
            <div className="relative">
              <button
                type="button"
                className={`border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow flex justify-between items-center bg-white ${!paymentOption ? "text-gray-400" : "text-gray-800"}`}
                onClick={() => setShowPaymentDropdown(open => !open)}
                tabIndex={0}
              >
                <span>{paymentOption || "Choose the PAYMENT OPTIONS"}</span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${showPaymentDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPaymentDropdown && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border border-green-100 rounded-lg shadow-lg z-10 animate-dropdown-fade">
                  {PAYMENT_OPTIONS.map(opt => (
                    <li
                      key={opt}
                      className={`px-4 py-2 cursor-pointer hover:bg-green-50 ${paymentOption === opt ? "bg-green-100 font-semibold text-green-700" : ""}`}
                      onClick={() => {
                        setPaymentOption(opt);
                        setShowPaymentDropdown(false);
                      }}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
              <style>{`
                .animate-dropdown-fade {
                  animation: dropdownFade 0.18s;
                }
                @keyframes dropdownFade {
                  from { opacity: 0; transform: translateY(-8px);}
                  to { opacity: 1; transform: translateY(0);}
                }
              `}</style>
            </div>
          </div>
          {/* Booking Button */}
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full mt-8"
            onClick={handleBooking}
            disabled={totalSelectedArea === 0 || !paymentOption}
          >
            Proceed to Book ({totalSelectedArea} Units)
          </Button>
          {totalSelectedArea === 0 && <p className="text-xs text-red-500 text-center mt-2">Please select units from the grid.</p>}
          {!paymentOption && (
            <p className="text-xs text-red-500 text-center mt-2">Please select a PAYMENT OPTION.</p>
          )}
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
    </div>
  );
};

export default DBookMySqftPage;
