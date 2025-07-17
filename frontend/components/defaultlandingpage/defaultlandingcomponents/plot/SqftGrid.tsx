import React, { useRef, useState } from 'react';

// Assuming these types exist in your project
interface BaseSqftUnit {
  id: string;
  row: number;
  col: number;
  isAvailable: boolean;
  isSelected: boolean;
  isBooked: boolean;
}

interface ExtendedSqftUnit extends BaseSqftUnit {
  imageUrl?: string;
}

interface SqftGridProps {
  gridData: ExtendedSqftUnit[][];
  onUnitSelect: (row: number, col: number) => void;
  projectLayoutImage?: string;
  unitSize?: number;
}

// Example subplot details (in real use, this should come from props or context)
const SUBPLOT_DETAILS: Record<string, {
  imageUrl: string;
  dimension: string;
  facing: string;
  sqft: number;
}> = {};
for (let i = 1; i <= 100; i++) {
  SUBPLOT_DETAILS[i] = {
    imageUrl: `https://picsum.photos/seed/${i}/100/80`,
    dimension: `${30 + ((i - 1) % 10)} x ${40 + Math.floor((i - 1) / 10)} ft`,
    facing: ['East', 'West', 'North', 'South'][(i - 1) % 4],
    sqft: (30 + ((i - 1) % 10)) * (40 + Math.floor((i - 1) / 10)),
  };
}

// Helper to get label for a cell (1 to N)
function getGridLabel(row: number, col: number, page = 1, pageSize = 100) {
  return ((page - 1) * pageSize + (row * 10 + col) + 1).toString();
}

interface SqftUnit {
  id: string;
  row: number;
  col: number;
  isAvailable: boolean;
  isSelected: boolean;
  isBooked: boolean;
  imageUrl?: string;
  dimension?: string;
  facing?: string;
  sqft?: number;
}

const PAGE_SIZE = 100;

const DSqftGrid: React.FC<SqftGridProps> = ({
  gridData,
  onUnitSelect,
  projectLayoutImage,
  unitSize = 44,
}) => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [hoveredUnit, setHoveredUnit] = useState<SqftUnit | null>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredDetail, setHoveredDetail] = useState<{
    unit: SqftUnit & { imageUrl?: string; dimension?: string; facing?: string; sqft?: number };
    x: number;
    y: number;
  } | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<SqftUnit[]>([]);
  
  // State for zoom and pan
  const [zoom, setZoom] = useState(1);
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const imgFrameRef = useRef<HTMLDivElement>(null);

  // Maintain local grid state to reflect selection/removal
  const [localGrid, setLocalGrid] = useState(() =>
    gridData.map(row =>
      row.map(unit => ({ ...unit }))
    )
  );

  // Calculate total units and pages
  const totalUnits = localGrid.flat().length;
  const totalPages = Math.ceil(totalUnits / PAGE_SIZE);

  // Handle unit selection
  const handleUnitClick = (unit: SqftUnit) => {
    if (!unit.isAvailable) return;
    onUnitSelect(unit.row, unit.col);
    setSelectedUnits(prev =>
      prev.some(u => u.id === unit.id)
        ? prev.filter(u => u.id !== unit.id)
        : [...prev, unit]
    );
    setLocalGrid(prev =>
      prev.map(row =>
        row.map(u =>
          u.id === unit.id ? { ...u, isSelected: !u.isSelected } : u
        )
      )
    );
  };

  // Remove selected plot (from both selectedUnits and grid)
  const handleRemoveSelected = (unitId: string) => {
    setSelectedUnits(prev => prev.filter(u => u.id !== unitId));
    setLocalGrid(prev =>
      prev.map(row =>
        row.map(u =>
          u.id === unitId ? { ...u, isSelected: false } : u
        )
      )
    );
  };

  // Helper to show hover detail at correct position (relative to grid container)
  const handleMouseEnter = (
    e: React.MouseEvent,
    unit: SqftUnit,
    subplot: { imageUrl: string; dimension: string; facing: string; sqft: number }
  ) => {
    const gridRect = gridContainerRef.current?.getBoundingClientRect();
    const cellRect = (e.target as HTMLElement).getBoundingClientRect();
    if (gridRect) {
      setHoveredUnit({ ...unit, ...subplot });
      setHoveredDetail({
        unit: { ...unit, ...subplot },
        x: cellRect.left - gridRect.left + cellRect.width / 2,
        y: cellRect.top - gridRect.top + cellRect.height,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredUnit(null);
    setHoveredDetail(null);
  };

  // Mouse/touch handlers for drag
  const handleImgMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - imgOffset.x, y: clientY - imgOffset.y });
  };

  const handleImgMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging || !dragStart) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setImgOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleImgMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  // Smoother zoom with pointer-centered zoom
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const imgOffsetRef = useRef(imgOffset);
  imgOffsetRef.current = imgOffset;

  const handleImgWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!imgFrameRef.current) return;
    const rect = imgFrameRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    let newZoom = zoomRef.current - e.deltaY * 0.0015;
    newZoom = Math.max(1, Math.min(2.5, newZoom));
    if (newZoom === zoomRef.current) return;

    // Calculate new offset so that zoom centers on pointer
    const scaleChange = newZoom / zoomRef.current;
    const newOffsetX = (imgOffsetRef.current.x - pointerX) * scaleChange + pointerX;
    const newOffsetY = (imgOffsetRef.current.y - pointerY) * scaleChange + pointerY;

    setZoom(newZoom);
    setImgOffset({ x: newOffsetX, y: newOffsetY });
  };

  // Reset zoom and pan
  const handleReset = () => {
    setZoom(1);
    setImgOffset({ x: 0, y: 0 });
  };

  // Download PDF (dummy link, replace with actual PDF if needed)
  const handleDownload = () => {
    window.open('/PlotLayoutGrid/kanathur.pdf', '_blank');
  };

  // Plot counts for summary
  const totalPlots = localGrid.reduce((sum, row) => sum + row.length, 0);
  const bookedPlots = localGrid.flat().filter(u => u.isBooked).length;
  const availablePlots = localGrid.flat().filter(u => u.isAvailable && !u.isBooked).length;

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-4 py-6 gap-4 sm:gap-6 lg:gap-8">
      {/* Plot summary - Enhanced responsive layout */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-2 mt-2 w-full max-w-4xl">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-200 border border-green-400 inline-block" />
          <span className="text-xs sm:text-sm text-green-700 font-semibold">Available Plots: {availablePlots}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-300 border border-gray-400 inline-block" />
          <span className="text-xs sm:text-sm text-gray-600 font-semibold">Booked Plots: {bookedPlots}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-300 inline-block" />
          <span className="text-xs sm:text-sm text-indigo-700 font-semibold">Total Plots: {totalPlots}</span>
        </div>
      </div>

      {/* Plot layout image with controls - Enhanced responsive sizing */}
      <div className="flex flex-col items-center justify-center w-full max-w-lg mb-4 sm:mb-6 pt-4 sm:pt-6">
        <div
          ref={imgFrameRef}
          className="flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow border border-green-100 overflow-hidden"
          style={{
            width: 'min(480px, 90vw)',
            height: 'min(320px, 60vw)',
            maxWidth: 480,
            maxHeight: 320,
            paddingTop: 16,
            position: 'relative',
            userSelect: 'none',
            touchAction: 'none',
          }}
          onWheel={handleImgWheel}
          onMouseDown={handleImgMouseDown}
          onMouseMove={dragging ? handleImgMouseMove : undefined}
          onMouseUp={handleImgMouseUp}
          onMouseLeave={handleImgMouseUp}
          onTouchStart={handleImgMouseDown}
          onTouchMove={dragging ? handleImgMouseMove : undefined}
          onTouchEnd={handleImgMouseUp}
        >
          <img
            src={projectLayoutImage || "/PlotLayoutGrid/kanathur.png"}
            alt="Plot Layout"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              userSelect: 'none',
              pointerEvents: 'none',
              transform: `scale(${zoom}) translate(${imgOffset.x / zoom}px, ${imgOffset.y / zoom}px)`,
              transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(.4,0,.2,1)',
              cursor: dragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default',
            }}
            draggable={false}
          />
          {/* Zoom hint */}
          <div className="absolute top-2 right-3 bg-white/80 rounded px-2 py-0.5 text-xs text-green-700 shadow border border-green-100 select-none pointer-events-none">
            Zoom: {(zoom * 100).toFixed(0)}%
          </div>
        </div>
        
        {/* Controls below the image - Enhanced responsive layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 w-full max-w-xs">
          <button
            className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg px-3 py-2 shadow border border-green-200 transition text-xs flex items-center justify-center gap-1 min-h-[36px]"
            onClick={handleReset}
            type="button"
            tabIndex={0}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.582 9A7.003 7.003 0 0112 5c3.314 0 6.127 2.163 6.918 5M18.418 15A7.003 7.003 0 0112 19c-3.314 0-6.127-2.163-6.918-5" />
            </svg>
            Reset
          </button>
          <button
            className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg px-3 py-2 shadow border border-green-200 transition text-xs flex items-center justify-center gap-1 min-h-[36px]"
            onClick={handleDownload}
            type="button"
            tabIndex={0}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Main content: Grid and Selected plot details - Enhanced responsive layout */}
      <div className="flex flex-col xl:flex-row w-full max-w-7xl justify-center gap-6 lg:gap-8 xl:gap-10">
        {/* Grid section - Enhanced responsive sizing */}
        <div
          ref={gridContainerRef}
          className="relative flex flex-col items-center justify-center rounded-3xl shadow-2xl border-0 bg-white/60 backdrop-blur-lg p-4 sm:p-6 order-1"
          style={{
            width: '100%',
            maxWidth: 'min(560px, 95vw)',
            height: 'min(560px, 70vh)',
            minHeight: 400,
            boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15), 0 1.5px 6px 0 rgba(0,0,0,0.04)',
            border: '1.5px solid #bbf7d0',
          }}
        >
          {/* Grid header (sticky) */}
          <div
            className="sticky top-0 z-20 flex flex-row gap-2 bg-white/80 backdrop-blur-md rounded-t-2xl px-2 py-1"
            style={{ marginLeft: 0 }}
          >
          </div>
          
          <div
            ref={gridScrollRef}
            className="flex flex-col w-full h-full overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent"
            style={{ maxHeight: 'calc(100% - 80px)', marginTop: 8, borderRadius: 18, position: 'relative' }}
          >
            {/* Grid */}
            <div
              className="grid gap-2 sm:gap-3 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${localGrid[0]?.length || 1}, ${Math.min(unitSize, 40)}px)`,
                justifyContent: 'center',
                padding: '8px',
              }}
            >
              {localGrid.map((row, rowIdx) =>
                row.map((unit, colIdx) => {
                  const label = getGridLabel(unit.row, unit.col, page, PAGE_SIZE);
                  const subplot = SUBPLOT_DETAILS[label];
                  // Only render units for the current page
                  const flatIndex = rowIdx * localGrid[0].length + colIdx;
                  if (flatIndex < (page - 1) * PAGE_SIZE || flatIndex >= page * PAGE_SIZE) return null;
                  
                  const responsiveUnitSize = Math.min(unitSize, 40);
                  
                  return (
                    <div
                      key={unit.id}
                      className={`
                        group relative flex items-center justify-center rounded-xl shadow-md border-2 transition-all duration-200
                        ${unit.isBooked
                          ? 'bg-gray-200 border-gray-400 cursor-not-allowed opacity-60'
                          : unit.isSelected
                          ? 'bg-gradient-to-br from-green-300 to-green-500 border-green-700 scale-105 ring-2 ring-green-300'
                          : 'bg-white/80 border-green-200 hover:bg-green-50 hover:border-green-400'}
                      `}
                      style={{
                        width: responsiveUnitSize,
                        height: responsiveUnitSize,
                        boxShadow: unit.isSelected ? '0 0 0 4px #bbf7d0' : undefined,
                        cursor: unit.isBooked ? 'not-allowed' : 'pointer',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'box-shadow 0.2s, transform 0.2s',
                      }}
                      onClick={() => handleUnitClick(unit)}
                      onMouseEnter={e => handleMouseEnter(e, unit, SUBPLOT_DETAILS[label])}
                      onMouseLeave={handleMouseLeave}
                    >
                      <span className={`text-xs font-bold ${unit.isBooked ? 'text-gray-400' : 'text-green-800'}`}>
                        {label}
                      </span>
                      {/* Dot indicator for selected */}
                      {unit.isSelected && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-700 border-2 border-white shadow"></span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Hover detail rendered inside grid container, absolutely positioned */}
            {hoveredDetail && (
              <div
                className="z-[9999] absolute animate-fade-in bg-white/95 border border-green-200 rounded-2xl shadow-2xl p-3"
                style={{
                  width: 'min(220px, 90vw)',
                  left: Math.max(10, Math.min(hoveredDetail.x, window.innerWidth - 230)),
                  top: hoveredDetail.y + 8,
                  transform: 'translate(-50%, 0)',
                  pointerEvents: 'none'
                }}
              >
                <img
                  src={hoveredDetail.unit.imageUrl}
                  alt="Subplot"
                  className="w-full h-16 sm:h-20 object-cover rounded mb-2 border border-green-100"
                />
                <div className="text-xs text-green-700 font-semibold mb-1">
                  {getGridLabel(hoveredDetail.unit.row, hoveredDetail.unit.col)}
                </div>
                <div className="text-xs text-gray-700">
                  <div><b>Dimension:</b> {hoveredDetail.unit.dimension}</div>
                  <div><b>Facing:</b> {hoveredDetail.unit.facing}</div>
                  <div><b>Sqft:</b> {hoveredDetail.unit.sqft}</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination controls - Enhanced responsive layout */}
          {totalPages > 1 && (
            <div className="flex flex-row gap-2 justify-center items-center mt-4 sticky bottom-0 bg-white/90 backdrop-blur-md rounded-b-2xl p-2">
              <button
                className="px-2 sm:px-3 py-1 rounded bg-green-100 text-green-700 font-semibold border border-green-200 disabled:opacity-50 text-xs sm:text-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-green-700 font-bold text-xs sm:text-sm">Page {page} of {totalPages}</span>
              <button
                className="px-2 sm:px-3 py-1 rounded bg-green-100 text-green-700 font-semibold border border-green-200 disabled:opacity-50 text-xs sm:text-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Selected plot details - Enhanced responsive layout */}
        <div className="w-full xl:w-80 order-2 xl:order-2">
          {selectedUnits.length > 0 && (
            <div className="bg-white/80 rounded-3xl shadow-2xl border border-green-100 h-full max-h-[560px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent p-4 flex flex-col gap-3 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-extrabold text-green-700 mb-2 sticky top-0 bg-white/90 backdrop-blur-md z-10 pb-2 rounded-t-2xl">
                Selected Plot Details
              </h3>
              {selectedUnits.map(unit => {
                const label = getGridLabel(unit.row, unit.col);
                const subplot = SUBPLOT_DETAILS[label];
                return (
                  <div
                    key={unit.id}
                    className="relative flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-green-50 via-white to-green-100 rounded-2xl border border-green-100 shadow p-3 transition-all duration-150 hover:shadow-lg"
                  >
                    <img
                      src={subplot.imageUrl}
                      alt="Subplot"
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl border border-green-200 shadow flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-green-700 text-sm sm:text-base truncate">{label}</div>
                      <div className="text-xs text-gray-500 truncate">Dimension: {subplot.dimension}</div>
                      <div className="text-xs text-gray-500 truncate">Facing: {subplot.facing}</div>
                      <div className="text-xs text-gray-500 truncate">Sqft: {subplot.sqft}</div>
                    </div>
                    <button
                      className="absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full p-1 shadow transition flex-shrink-0"
                      title="Remove"
                      onClick={() => handleRemoveSelected(unit.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSqftGrid;