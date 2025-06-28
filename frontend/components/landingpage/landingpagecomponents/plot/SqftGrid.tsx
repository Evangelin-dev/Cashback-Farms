import React, { useState } from 'react';
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
  unitSize = 40,
}) => {
  const [hoveredUnit, setHoveredUnit] = useState<SqftUnit | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<SqftUnit[]>([]);

  // Handle unit selection
  const handleUnitClick = (unit: SqftUnit) => {
    if (!unit.isAvailable) return;
    onUnitSelect(unit.row, unit.col);
    setSelectedUnits(prev =>
      prev.some(u => u.id === unit.id)
        ? prev.filter(u => u.id !== unit.id)
        : [...prev, unit]
    );
  };

  return (
    <div className="flex flex-col items-center w-full gap-8">
      {/* Top: Plot layout image */}
      <div
        className="flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow border border-green-100 mb-6"
        style={{
          width: 480,
          height: 320,
          overflow: 'hidden',
        }}
      >
        <img
          src="/PlotLayoutGrid/kanathur.png"
          alt="Plot Layout"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            userSelect: 'none',
          }}
          draggable={false}
        />
      </div>
      {/* Center: Grid */}
      <div
        className="flex flex-col items-center justify-center"
        style={{
          width: 480,
          height: 480,
          background: '#fff',
          borderRadius: 16,
          border: '2px solid #bbf7d0',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridData[0]?.length || 1}, ${unitSize}px)`,
            gap: 8, // Increased gap for more visible spacing
          }}
        >
          {gridData.map((row, rowIdx) =>
            row.map((unit, colIdx) => {
              const label = getGridLabel(unit.row, unit.col);
              const subplot = SUBPLOT_DETAILS[label];
              return (
                <div
                  key={unit.id}
                  className={`w-10 h-10 flex items-center justify-center rounded cursor-pointer border relative
                    ${unit.isBooked ? 'bg-gray-300 border-gray-400' : unit.isSelected ? 'bg-green-400 border-green-600' : 'bg-white border-green-200'}
                  `}
                  onClick={() => handleUnitClick(unit)}
                  onMouseEnter={() => setHoveredUnit({ ...unit, ...subplot })}
                  onMouseLeave={() => setHoveredUnit(null)}
                >
                  <span className="text-xs font-bold">{label}</span>
                  {/* Hover: Show all subplot details */}
                  {hoveredUnit && hoveredUnit.id === unit.id && (
                    <div
                      className="absolute z-50 left-1/2 top-full mt-2 -translate-x-1/2 bg-white border border-green-200 rounded shadow-lg p-2"
                      style={{ width: 180 }}
                    >
                      <img
                        src={subplot.imageUrl}
                        alt="Subplot"
                        className="w-full h-16 object-cover rounded mb-1"
                      />
                      <div className="text-xs text-green-700 font-semibold mb-1">{label}</div>
                      <div className="text-xs text-gray-700">
                        <div><b>Dimension:</b> {subplot.dimension}</div>
                        <div><b>Facing:</b> {subplot.facing}</div>
                        <div><b>Sqft:</b> {subplot.sqft}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Right: Selected plot details */}
      <div className="w-72">
        {selectedUnits.length > 0 && (
          <div className="bg-white rounded-xl shadow p-4 border border-green-100">
            <h3 className="text-lg font-bold text-green-700 mb-2">Selected Plot Details</h3>
            <div className="flex flex-col gap-3">
              {selectedUnits.map(unit => {
                const label = getGridLabel(unit.row, unit.col);
                const subplot = SUBPLOT_DETAILS[label];
                return (
                  <div key={unit.id} className="flex items-center gap-3 border-b pb-2 last:border-b-0">
                    <img
                      src={subplot.imageUrl}
                      alt="Subplot"
                      className="w-12 h-12 object-cover rounded border border-green-200"
                    />
                    <div>
                      <div className="font-semibold text-green-700">{label}</div>
                      <div className="text-xs text-gray-500">Dimension: {subplot.dimension}</div>
                      <div className="text-xs text-gray-500">Facing: {subplot.facing}</div>
                      <div className="text-xs text-gray-500">Sqft: {subplot.sqft}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SqftGrid;



