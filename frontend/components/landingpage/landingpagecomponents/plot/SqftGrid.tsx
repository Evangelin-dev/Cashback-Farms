import React, { useRef, useState } from 'react';
import { SqftUnit as BaseSqftUnit } from '../../../../types';

interface ExtendedSqftUnit extends BaseSqftUnit {
  imageUrl?: string;
}

interface SqftGridProps {
  gridData: ExtendedSqftUnit[][];
  onUnitSelect: (row: number, col: number) => void;
  // plotImageUrl: string; // No longer needed as prop, using static image below
  unitSize?: number;
}

// Example GRID_LABELS and additional subplot data for demonstration
const GRID_LABELS = {
  rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  cols: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
};

// Example subplot details (in real use, this should come from props or context)
const SUBPLOT_DETAILS: Record<string, {
  imageUrl: string;
  dimension: string;
  facing: string;
  sqft: number;
}> = {};
for (let r = 0; r < GRID_LABELS.rows.length; r++) {
  for (let c = 0; c < GRID_LABELS.cols.length; c++) {
    const key = `${GRID_LABELS.rows[r]}${GRID_LABELS.cols[c]}`;
    SUBPLOT_DETAILS[key] = {
      imageUrl: `https://picsum.photos/seed/${key}/100/80`,
      dimension: `${30 + r} x ${40 + c} ft`,
      facing: ['East', 'West', 'North', 'South'][(r + c) % 4],
      sqft: (30 + r) * (40 + c),
    };
  }
}

// Helper to get label for a cell
function getGridLabel(row: number, col: number) {
  const rowLabel = GRID_LABELS.rows[row] ?? `R${row + 1}`;
  const colLabel = GRID_LABELS.cols[col] ?? `C${col + 1}`;
  return `${rowLabel}${colLabel}`;
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

const SqftGrid: React.FC<SqftGridProps> = ({
  gridData,
  onUnitSelect,
  unitSize = 44,
}) => {
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

  // Update localGrid if gridData changes (optional, if gridData is dynamic)
  // React.useEffect(() => {
  //   setLocalGrid(gridData.map(row => row.map(unit => ({ ...unit }))));
  // }, [gridData]);

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
    <div className="flex flex-col items-center w-full gap-8">
      {/* Plot summary */}
      <div className="flex flex-row items-center gap-6 mb-2 mt-2">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-200 border border-green-400 inline-block" />
          <span className="text-xs text-green-700 font-semibold">Available Plots: {availablePlots}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-300 border border-gray-400 inline-block" />
          <span className="text-xs text-gray-600 font-semibold">Booked Plots: {bookedPlots}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-300 inline-block" />
          <span className="text-xs text-indigo-700 font-semibold">Total Plots: {totalPlots}</span>
        </div>
      </div>
      {/* Top: Plot layout image with controls below */}
      <div className="flex flex-col items-center justify-center w-[480px] mb-6 pt-6">
        <div
          ref={imgFrameRef}
          className="flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow border border-green-100 overflow-hidden"
          style={{
            width: 480,
            height: 320,
            paddingTop: 24,
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
            src="/PlotLayoutGrid/kanathur.png"
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
        {/* Controls below the image */}
        <div className="flex flex-row gap-3 mt-4">
          <button
            className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg px-3 py-2 shadow border border-green-200 transition text-xs flex items-center gap-1"
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
            className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg px-3 py-2 shadow border border-green-200 transition text-xs flex items-center gap-1"
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
      {/* Main content: Grid left, Details right */}
      <div className="flex flex-row w-full justify-center gap-10">
        {/* Left: Redesigned Grid */}
        <div
          ref={gridContainerRef}
          className="relative flex flex-col items-center justify-center rounded-3xl shadow-2xl border-0 bg-white/60 backdrop-blur-lg p-6"
          style={{
            width: 560,
            height: 560,
            boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15), 0 1.5px 6px 0 rgba(0,0,0,0.04)',
            border: '1.5px solid #bbf7d0',
          }}
        >
          {/* Grid header (sticky) */}
          <div
            className="sticky top-0 z-20 flex flex-row gap-2 bg-white/80 backdrop-blur-md rounded-t-2xl px-2 py-1"
            style={{ marginLeft: unitSize + 16 }}
          >
            {GRID_LABELS.cols.map(col => (
              <div
                key={col}
                className="w-11 text-center text-green-700 font-bold text-xs tracking-wide"
                style={{ width: unitSize }}
              >
                {col}
              </div>
            ))}
          </div>
          <div
            ref={gridScrollRef}
            className="flex flex-row w-full h-full overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent"
            style={{ maxHeight: 500, marginTop: 8, borderRadius: 18, position: 'relative' }}
          >
            {/* Row labels (sticky) */}
            <div className="flex flex-col gap-2 sticky left-0 z-10 bg-white/70 backdrop-blur-md rounded-l-2xl px-1 py-1">
              {GRID_LABELS.rows.map(row => (
                <div
                  key={row}
                  className="h-11 flex items-center justify-center text-green-700 font-bold text-xs tracking-wide"
                  style={{ height: unitSize }}
                >
                  {row}
                </div>
              ))}
            </div>
            {/* Grid */}
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${localGrid[0]?.length || 1}, ${unitSize}px)`,
                marginLeft: 8,
              }}
            >
              {localGrid.map((row, rowIdx) =>
                row.map((unit, colIdx) => {
                  const label = getGridLabel(unit.row, unit.col);
                  const subplot = SUBPLOT_DETAILS[label];
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
                        w-11 h-11
                      `}
                      style={{
                        width: unitSize,
                        height: unitSize,
                        boxShadow: unit.isSelected ? '0 0 0 4px #bbf7d0' : undefined,
                        cursor: unit.isBooked ? 'not-allowed' : 'pointer',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'box-shadow 0.2s, transform 0.2s',
                      }}
                      onClick={() => handleUnitClick(unit)}
                      onMouseEnter={e => handleMouseEnter(e, unit, SUBPLOT_DETAILS[getGridLabel(unit.row, unit.col)])}
                      onMouseLeave={handleMouseLeave}
                    >
                      <span className={`text-xs font-bold ${unit.isBooked ? 'text-gray-400' : 'text-green-800'}`}>
                        {getGridLabel(unit.row, unit.col)}
                      </span>
                      {/* Dot indicator for selected */}
                      {unit.isSelected && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-700 border-2 border-white shadow"></span>
                      )}
                      {/* No hover detail here */}
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
                  width: 220,
                  left: hoveredDetail.x,
                  top: hoveredDetail.y + 8,
                  transform: 'translate(-50%, 0)',
                  pointerEvents: 'none'
                }}
              >
                <img
                  src={hoveredDetail.unit.imageUrl}
                  alt="Subplot"
                  className="w-full h-20 object-cover rounded mb-2 border border-green-100"
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
        </div>
        {/* Right: Selected plot details (scrollable, card style) */}
        <div className="w-80 max-h-[560px]">
          {selectedUnits.length > 0 && (
            <div className="bg-white/80 rounded-3xl shadow-2xl border border-green-100 h-full max-h-[560px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent p-4 flex flex-col gap-4">
              <h3 className="text-xl font-extrabold text-green-700 mb-2 sticky top-0 bg-white/90 z-10 pb-2 rounded-t-2xl">
                Selected Plot Details
              </h3>
              {selectedUnits.map(unit => {
                const label = getGridLabel(unit.row, unit.col);
                const subplot = SUBPLOT_DETAILS[label];
                return (
                  <div
                    key={unit.id}
                    className="relative flex items-center gap-4 bg-gradient-to-r from-green-50 via-white to-green-100 rounded-2xl border border-green-100 shadow p-3 transition-all duration-150 hover:shadow-lg"
                  >
                    <img
                      src={subplot.imageUrl}
                      alt="Subplot"
                      className="w-16 h-16 object-cover rounded-xl border border-green-200 shadow"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-green-700 text-base">{label}</div>
                      <div className="text-xs text-gray-500">Dimension: {subplot.dimension}</div>
                      <div className="text-xs text-gray-500">Facing: {subplot.facing}</div>
                      <div className="text-xs text-gray-500">Sqft: {subplot.sqft}</div>
                    </div>
                    <button
                      className="absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full p-1 shadow transition"
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

export default SqftGrid;



