
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_BMS_PLOT_INFO } from '../constants';
import { BookMySqftPlotInfo, SqftUnit } from '../types';
import SqftGrid from '../components/plot/SqftGrid';
import Button from '../components/common/Button';

const BookMySqftPage: React.FC = () => {
  const { plotId } = useParams<{ plotId: string }>();
  const navigate = useNavigate();
  
  // In a real app, fetch this data based on plotId
  const [plotInfo, setPlotInfo] = useState<BookMySqftPlotInfo | null>(MOCK_BMS_PLOT_INFO); 
  const [grid, setGrid] = useState<SqftUnit[][]>(plotInfo?.initialGrid || []);
  const [selectedUnits, setSelectedUnits] = useState<SqftUnit[]>([]);

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
    return <div className="text-center py-10">Loading plot information...</div>;
  }

  const totalSelectedArea = selectedUnits.length; // Assuming each unit is 1 "unit" of area
  const totalCost = totalSelectedArea * plotInfo.sqftPricePerUnit;

  const handleBooking = () => {
    if(totalSelectedArea === 0) {
        alert("Please select at least one unit to book.");
        return;
    }
    // Mock booking action
    alert(`Booking ${totalSelectedArea} units for a total of ₹${totalCost.toLocaleString('en-IN')}. \nPlot: ${plotInfo.name}\nSelected Units: ${selectedUnits.map(u => u.id).join(', ')}\nThis is a mock confirmation.`);
    // In a real app, this would navigate to a payment page or show a success modal.
    // For MVP, we can reset selection or navigate away.
    // navigate('/booking-confirmation'); // Example
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Book My SqFt</h1>
        <p className="mt-2 text-lg text-gray-600">
          Select your desired area from <span className="font-semibold">{plotInfo.name}</span> located at {plotInfo.location}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex justify-center md:justify-start">
            <SqftGrid gridData={grid} onUnitSelect={handleUnitSelect} />
        </div>
        
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Booking Summary</h2>
          <div className="space-y-3">
            <p><strong>Plot:</strong> {plotInfo.name}</p>
            <p><strong>Price per Unit:</strong> ₹{plotInfo.sqftPricePerUnit.toLocaleString('en-IN')}</p>
            <p><strong>Selected Units:</strong> {totalSelectedArea}</p>
            <p className="text-xl font-bold text-green-600">
              Total Cost: ₹{totalCost.toLocaleString('en-IN')}
            </p>
          </div>
          
          {plotInfo.emiOptions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">EMI Options Available:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {plotInfo.emiOptions.map(emi => <li key={emi}>{emi}</li>)}
              </ul>
            </div>
          )}

          <Button 
            variant="primary" 
            size="lg" 
            className="w-full mt-8"
            onClick={handleBooking}
            disabled={totalSelectedArea === 0}
          >
            Proceed to Book ({totalSelectedArea} Units)
          </Button>
          {totalSelectedArea === 0 && <p className="text-xs text-red-500 text-center mt-2">Please select units from the grid.</p>}
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

export default BookMySqftPage;
    