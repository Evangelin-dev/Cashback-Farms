
import React from 'react';
import { SqftUnit } from '../../../../types';

interface SqftGridProps {
  gridData: SqftUnit[][];
  onUnitSelect: (row: number, col: number) => void;
  unitSize?: number; // in pixels
}

const SqftGrid: React.FC<SqftGridProps> = ({ gridData, onUnitSelect, unitSize = 28 }) => {
  if (!gridData || gridData.length === 0) {
    return <p className="text-center text-gray-500">No grid data available.</p>;
  }

  const getUnitClasses = (unit: SqftUnit): string => {
    let base = 'border border-gray-300 flex items-center justify-center text-xs transition-colors duration-150';
    if (unit.isBooked) {
      base += ' bg-gray-400 cursor-not-allowed text-white';
    } else if (unit.isSelected) {
      base += ' bg-green-500 hover:bg-green-600 text-white cursor-pointer';
    } else if (unit.isAvailable) {
      base += ' bg-green-100 hover:bg-green-200 text-green-700 cursor-pointer';
    }
    return base;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid gap-1" style={{ 
        gridTemplateColumns: `repeat(${gridData[0]?.length || 1}, minmax(0, 1fr))`,
        width: (gridData[0]?.length || 1) * (unitSize + 4) // unitSize + gap
      }}>
        {gridData.map((row, rowIndex) =>
          row.map((unit) => (
            <div
              key={unit.id}
              className={getUnitClasses(unit)}
              style={{ width: `${unitSize}px`, height: `${unitSize}px` }}
              onClick={() => !unit.isBooked && onUnitSelect(unit.row, unit.col)}
              title={unit.isBooked ? 'Booked' : unit.isSelected ? 'Selected (Click to deselect)' : 'Available (Click to select)'}
            >
              {/* Optionally display unit ID or status icon */}
              {/* {unit.id} */}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex space-x-4 text-sm">
        <div className="flex items-center"><div className="w-4 h-4 bg-green-100 border border-gray-300 mr-2"></div> Available</div>
        <div className="flex items-center"><div className="w-4 h-4 bg-green-500 border border-gray-300 mr-2"></div> Selected</div>
        <div className="flex items-center"><div className="w-4 h-4 bg-gray-400 border border-gray-300 mr-2"></div> Booked</div>
      </div>
    </div>
  );
};

export default SqftGrid;
    