import React, { useRef, useState } from 'react';
import { SqftUnit } from '../../../../types';

interface GridLabelInfo {
  label: string;
  sqft: string;
  dimensions: string;
  direction: string;
}

interface SqftGridProps {
  gridData: SqftUnit[][];
  onUnitSelect: (row: number, col: number) => void;
  unitSize?: number; // in pixels
  imageUrl?: string;
}

const GRID_LABELS: GridLabelInfo[] = [
  { label: "93",    sqft: "1000 SqFt", dimensions: "104' x 100'", direction: "N" },
  { label: "2C1A",  sqft: "900 SqFt",  dimensions: "90' x 100'",  direction: "E" },
  { label: "5",     sqft: "1200 SqFt", dimensions: "120' x 100'", direction: "S" },
  { label: "2C1B",  sqft: "950 SqFt",  dimensions: "95' x 100'",  direction: "W" },
  { label: "7A",    sqft: "1100 SqFt", dimensions: "110' x 100'", direction: "N" },
  { label: "7B",    sqft: "1050 SqFt", dimensions: "105' x 100'", direction: "E" },
  { label: "8A",    sqft: "980 SqFt",  dimensions: "98' x 100'",  direction: "S" },
  { label: "8B",    sqft: "1020 SqFt", dimensions: "102' x 100'", direction: "W" },
  { label: "9A",    sqft: "1150 SqFt", dimensions: "115' x 100'", direction: "N" },
  { label: "9B",    sqft: "1080 SqFt", dimensions: "108' x 100'", direction: "E" },
  { label: "10A",   sqft: "1120 SqFt", dimensions: "112' x 100'", direction: "S" },
  { label: "10B",   sqft: "990 SqFt",  dimensions: "99' x 100'",  direction: "W" },
];

const SqftGrid: React.FC<SqftGridProps> = ({
  gridData,
  onUnitSelect,
  unitSize = 28,
  imageUrl = "/PlotLayoutGrid/kanathur.png"
}) => {
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);
  const [showSelectedDetails, setShowSelectedDetails] = useState(false);

  // For drag
  const dragFrameRef = useRef<HTMLDivElement>(null);
  const dragImgRef = useRef<HTMLImageElement>(null);
  const [dragState, setDragState] = useState<{ dragging: boolean; x: number; y: number; offsetX: number; offsetY: number }>({
    dragging: false, x: 0, y: 0, offsetX: 0, offsetY: 0
  });

  // Flatten gridData and only use as many as GRID_LABELS.length
  const flatUnits = gridData.flat().slice(0, GRID_LABELS.length);

  // Stats
  const totalPlots = flatUnits.length;
  const availablePlots = flatUnits.filter(u => u.isAvailable && !u.isBooked).length;
  const bookedPlots = flatUnits.filter(u => u.isBooked).length;

  if (!flatUnits.length) {
    return <p className="text-center text-gray-500">No grid data available.</p>;
  }

  const getUnitClasses = (unit: SqftUnit, idx: number): string => {
    let base = 'border border-gray-300 flex items-center justify-center text-xs transition-colors duration-150 relative group';
    if (unit.isBooked) {
      base += ' bg-gray-400 cursor-not-allowed text-white';
    } else if (unit.isSelected || selectedIdxs.includes(idx)) {
      base += ' bg-green-500 hover:bg-green-600 text-white cursor-pointer';
    } else if (unit.isAvailable) {
      base += ' bg-green-100 hover:bg-green-200 text-green-700 cursor-pointer';
    }
    return base;
  };

  // Handle selection and booking logic
  const handleBlockClick = (unit: SqftUnit, idx: number) => {
    if (unit.isBooked) return;
    onUnitSelect(unit.row, unit.col);
    setSelectedIdxs(prev => {
      if (prev.includes(idx)) {
        // Deselect
        return prev.filter(i => i !== idx);
      } else {
        // Select
        return [...prev, idx];
      }
    });
  };

  // Show details for all selected plots
  const selectedGridInfos: GridLabelInfo[] = selectedIdxs
    .filter(idx => GRID_LABELS[idx])
    .map(idx => GRID_LABELS[idx]);

  // Booking handler (mock)
  const handleBookSelected = () => {
    setShowSelectedDetails(true);
  };

  // Minimize total plots after booking
  const effectiveTotalPlots = totalPlots - selectedIdxs.length;

  // Drag handlers for popup image
  const handleDragStart = (e: React.MouseEvent) => {
    if (!dragImgRef.current) return;
    setDragState({
      dragging: true,
      x: dragState.x,
      y: dragState.y,
      offsetX: e.clientX - dragState.x,
      offsetY: e.clientY - dragState.y,
    });
  };
  const handleDrag = (e: React.MouseEvent) => {
    if (!dragState.dragging || !dragFrameRef.current || !dragImgRef.current) return;
    const frame = dragFrameRef.current.getBoundingClientRect();
    const img = dragImgRef.current.getBoundingClientRect();
    let newX = e.clientX - dragState.offsetX;
    let newY = e.clientY - dragState.offsetY;

    // Clamp image inside frame
    const maxX = 0;
    const maxY = 0;
    const minX = frame.width - img.width * zoom;
    const minY = frame.height - img.height * zoom;
    if (img.width * zoom > frame.width) {
      newX = Math.min(maxX, Math.max(minX, newX));
    } else {
      newX = (frame.width - img.width * zoom) / 2;
    }
    if (img.height * zoom > frame.height) {
      newY = Math.min(maxY, Math.max(minY, newY));
    } else {
      newY = (frame.height - img.height * zoom) / 2;
    }
    setDragState({ ...dragState, x: newX, y: newY });
  };
  const handleDragEnd = () => setDragState(prev => ({ ...prev, dragging: false }));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Image on top with View button */}
      {imageUrl && (
        <div className="mb-4 flex flex-col items-center">
          <div className="relative w-full flex justify-center">
            <img
              src={imageUrl}
              alt="Plot Layout"
              className="w-full h-auto rounded border max-h-56 object-contain"
              style={{ maxWidth: 400 }}
            />
            <button
              className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700 transition"
              onClick={() => { setShowImagePopup(true); setZoom(1); setDragState({ dragging: false, x: 0, y: 0, offsetX: 0, offsetY: 0 }); }}
              type="button"
            >
              View
            </button>
          </div>
        </div>
      )}

      {/* Image Popup with Zoom and Drag */}
      {showImagePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div
            ref={dragFrameRef}
            className="relative bg-white rounded-lg shadow-2xl p-4 flex flex-col items-center animate-fade-in-fast"
            style={{ width: 700, height: 520, overflow: "hidden", touchAction: "none", userSelect: "none" }}
            onMouseMove={e => dragState.dragging && handleDrag(e)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                cursor: dragState.dragging ? "grabbing" : "grab",
                overflow: "hidden",
                position: "relative"
              }}
              onMouseDown={handleDragStart}
            >
              <img
                ref={dragImgRef}
                src={imageUrl}
                alt="Zoomed Plot Layout"
                className="rounded border"
                style={{
                  position: "absolute",
                  left: dragState.x,
                  top: dragState.y,
                  width: `${zoom * 600}px`,
                  height: "auto",
                  maxWidth: "none",
                  maxHeight: "none",
                  transition: dragState.dragging ? "none" : "transform 0.2s"
                }}
                draggable={false}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setZoom(z => Math.max(1, z - 0.2))}
                disabled={zoom <= 1}
                type="button"
              >-</button>
              <span className="px-2 text-green-700 font-semibold">Zoom: {Math.round(zoom * 100)}%</span>
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setZoom(z => Math.min(3, z + 0.2))}
                disabled={zoom >= 3}
                type="button"
              >+</button>
              <button
                className="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => setShowImagePopup(false)}
                type="button"
              >Close</button>
            </div>
          </div>
          <style>{`
            .animate-fade-in-fast {
              animation: fadeInFast 0.3s;
            }
            @keyframes fadeInFast {
              from { opacity: 0; transform: scale(0.95);}
              to { opacity: 1; transform: scale(1);}
            }
          `}</style>
        </div>
      )}

      {/* Grid: show only as many blocks as GRID_LABELS */}
      <div
        className="grid gap-1 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${GRID_LABELS.length}, minmax(0, 1fr))`,
          width: GRID_LABELS.length * (unitSize + 4)
        }}
      >
        {flatUnits.map((unit, idx) => (
          <div
            key={unit.id}
            className={getUnitClasses(unit, idx)}
            style={{ width: `${unitSize}px`, height: `${unitSize}px`, position: "relative" }}
            onClick={() => handleBlockClick(unit, idx)}
            title={unit.isBooked ? 'Booked' : unit.isSelected || selectedIdxs.includes(idx) ? 'Selected (Click to deselect)' : 'Available (Click to select)'}
          >
            {/* Main label */}
            <span>{GRID_LABELS[idx].label}</span>
            {/* Sublabel on hover */}
            <div
              className="absolute left-1/2 top-full z-20 mt-1 px-2 py-1 rounded bg-white border border-green-200 text-xs text-green-700 shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ transform: "translateX(-50%)" }}
            >
              <div><b>SqFt:</b> {GRID_LABELS[idx].sqft}</div>
              <div><b>Dimensions:</b> {GRID_LABELS[idx].dimensions}</div>
              <div><b>Direction:</b> {GRID_LABELS[idx].direction}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center"><div className="w-4 h-4 bg-green-100 border border-gray-300 mr-2"></div> Available</div>
        <div className="flex items-center"><div className="w-4 h-4 bg-green-500 border border-gray-300 mr-2"></div> Selected</div>
        <div className="flex items-center"><div className="w-4 h-4 bg-gray-400 border border-gray-300 mr-2"></div> Booked</div>
      </div>
      {/* Show button for selected grid block info */}
      {selectedGridInfos.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg shadow text-green-800 text-sm max-w-xs mx-auto animate-fade-in-fast">
          <div className="font-bold mb-1">Selected Plots: {selectedGridInfos.map(info => info.label).join(', ')}</div>
          <button
            className="mt-2 w-full py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            onClick={handleBookSelected}
          >
            Show All Selected Plot Details
          </button>
        </div>
      )}
      {/* Popup for all selected plot details */}
      {showSelectedDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center animate-fade-in-fast">
            <h2 className="text-xl font-bold text-green-700 mb-4">All Selected Plot Details</h2>
            <div className="w-full">
              {selectedGridInfos.map(info => (
                <div key={info.label} className="mb-4 border-b border-green-100 pb-2">
                  <div className="font-semibold text-green-800">Plot: {info.label}</div>
                  <div className="text-sm text-gray-700"><b>SqFt:</b> {info.sqft}</div>
                  <div className="text-sm text-gray-700"><b>Dimensions:</b> {info.dimensions}</div>
                  <div className="text-sm text-gray-700"><b>Direction:</b> {info.direction}</div>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              onClick={() => setShowSelectedDetails(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Plot stats */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center font-semibold text-green-700">
          Total Plots: <span className="ml-1">{effectiveTotalPlots}</span>
        </div>
        <div className="flex items-center font-semibold text-green-700">
          Available Plots: <span className="ml-1">{availablePlots}</span>
        </div>
        <div className="flex items-center font-semibold text-green-700">
          Booked Plots: <span className="ml-1">{bookedPlots}</span>
        </div>
      </div>
      <style>{`
        .grid > div:hover > .absolute {
          opacity: 1 !important;
        }
        .animate-fade-in-fast {
          animation: fadeInFast 0.3s;
        }
        @keyframes fadeInFast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SqftGrid;


