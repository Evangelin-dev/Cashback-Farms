import React, { ChangeEvent, useState } from 'react';
import { BookMySqftPlotInfo, PlotType, SqftUnit } from '../../../../types';
import PlotCard from '../plot/PlotCard';
import SqftGrid from '../plot/SqftGrid';

interface Plot {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  price: number;
  area: number;
  description: string;
  type: PlotType;
  sqftPrice?: number;
  isFlagship?: boolean;
}

const MyProperty: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [showPlotForm, setShowPlotForm] = useState(false);
  const [plotForm, setPlotForm] = useState<Omit<Plot, 'id' | 'imageUrl'>>({
    title: '',
    location: '',
    price: 0,
    area: 0,
    description: '',
    type: PlotType.PUBLIC,
    sqftPrice: undefined,
    isFlagship: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddPlot = () => {
    if (!imageFile) {
      alert('Please upload an image.');
      return;
    }
    const newPlot: Plot = {
      ...plotForm,
      id: `plot-${Date.now()}`,
      imageUrl: imagePreview,
    };
    setPlots([...plots, newPlot]);
    setPlotForm({
      title: '',
      location: '',
      price: 0,
      area: 0,
      description: '',
      type: PlotType.PUBLIC,
      sqftPrice: undefined,
      isFlagship: false,
    });
    setImageFile(null);
    setImagePreview('');
    setShowPlotForm(false);
  };

  // BookMySqftPlotInfo state
  const [bmsPlots, setBmsPlots] = useState<BookMySqftPlotInfo[]>([]);
  const [showBmsForm, setShowBmsForm] = useState(false);
  const [bmsForm, setBmsForm] = useState<Omit<BookMySqftPlotInfo, 'id' | 'initialGrid'>>({
    name: '',
    location: '',
    totalUnits: 25,
    unitsWide: 5,
    unitsTall: 5,
    sqftPricePerUnit: 0,
    emiOptions: [],
  });
  const [emiInput, setEmiInput] = useState('');

  // Helper to create initial grid for BookMySqft
  const createInitialGrid = (rows: number, cols: number): SqftUnit[][] =>
    Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => ({
        id: `unit-${Date.now()}-${row}-${col}`,
        row,
        col,
        isAvailable: true,
        isSelected: false,
        isBooked: false,
      }))
    );

  // Add BookMySqft Plot card
  const handleAddBmsPlot = () => {
    const { name, location, unitsWide, unitsTall, sqftPricePerUnit, emiOptions } = bmsForm;
    if (!name || !location || unitsWide < 1 || unitsTall < 1) {
      alert('Please fill all required fields.');
      return;
    }
    const totalUnits = unitsWide * unitsTall;
    const newPlot: BookMySqftPlotInfo = {
      id: `bms-${Date.now()}`,
      name,
      location,
      totalUnits,
      unitsWide,
      unitsTall,
      sqftPricePerUnit,
      emiOptions,
      initialGrid: createInitialGrid(unitsTall, unitsWide),
    };
    setBmsPlots([...bmsPlots, newPlot]);
    setBmsForm({
      name: '',
      location: '',
      totalUnits: 25,
      unitsWide: 5,
      unitsTall: 5,
      sqftPricePerUnit: 0,
      emiOptions: [],
    });
    setEmiInput('');
    setShowBmsForm(false);
  };

  // BookMySqft: Save selection state per plot
  const handleUnitSelect = (plotId: string, row: number, col: number) => {
    setBmsPlots(prev =>
      prev.map(plot => {
        if (plot.id !== plotId) return plot;
        // Deep copy grid
        const newGrid = plot.initialGrid.map(r => r.map(unit => ({ ...unit })));
        const unit = newGrid[row][col];
        if (unit.isAvailable) {
          unit.isSelected = !unit.isSelected;
        }
        return {
          ...plot,
          initialGrid: newGrid,
        };
      })
    );
  };

  const getSelectedUnits = (grid: SqftUnit[][]) =>
    grid.flat().filter(unit => unit.isSelected);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-green-700">My Property</h1>
      <div className="bg-white rounded-lg shadow p-6 border border-green-100 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-600">Add Property</h2>
          <button
            onClick={() => setShowPlotForm(true)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
        {showPlotForm && (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Title"
              value={plotForm.title}
              onChange={e => setPlotForm({ ...plotForm, title: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Location"
              value={plotForm.location}
              onChange={e => setPlotForm({ ...plotForm, location: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Price"
              value={plotForm.price}
              onChange={e => setPlotForm({ ...plotForm, price: Number(e.target.value) })}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Area (sqft)"
              value={plotForm.area}
              onChange={e => setPlotForm({ ...plotForm, area: Number(e.target.value) })}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Sqft Price (optional)"
              value={plotForm.sqftPrice || ''}
              onChange={e => setPlotForm({ ...plotForm, sqftPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
            <select
              className="border p-2 rounded"
              value={plotForm.type}
              onChange={e => setPlotForm({ ...plotForm, type: e.target.value as PlotType })}
            >
              <option value={PlotType.PUBLIC}>Public</option>
              <option value={PlotType.VERIFIED}>Verified</option>
            </select>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={plotForm.isFlagship || false}
                onChange={e => setPlotForm({ ...plotForm, isFlagship: e.target.checked })}
              />
              <span>Flagship</span>
            </label>
            <textarea
              className="border p-2 rounded col-span-2"
              placeholder="Description"
              value={plotForm.description}
              onChange={e => setPlotForm({ ...plotForm, description: e.target.value })}
            />
            <div className="col-span-2">
              <label className="block mb-1 font-medium">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded w-full"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-cover rounded" />
              )}
            </div>
            <div className="col-span-2 flex space-x-2">
              <button
                onClick={handleAddPlot}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowPlotForm(false);
                  setImageFile(null);
                  setImagePreview('');
                }}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plots.map(plot => (
            <PlotCard key={plot.id} plot={plot} />
          ))}
        </div>
      </div>

      {/* MySqft Plot Section */}
      <div className="bg-white rounded-lg shadow p-6 border border-green-100 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-600">MySqft Plot</h2>
          <button
            onClick={() => setShowBmsForm(true)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
        {showBmsForm && (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Name"
              value={bmsForm.name}
              onChange={e => setBmsForm({ ...bmsForm, name: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Location"
              value={bmsForm.location}
              onChange={e => setBmsForm({ ...bmsForm, location: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              type="number"
              min={1}
              placeholder="Units Wide"
              value={bmsForm.unitsWide}
              onChange={e => setBmsForm({ ...bmsForm, unitsWide: Number(e.target.value) })}
            />
            <input
              className="border p-2 rounded"
              type="number"
              min={1}
              placeholder="Units Tall"
              value={bmsForm.unitsTall}
              onChange={e => setBmsForm({ ...bmsForm, unitsTall: Number(e.target.value) })}
            />
            <input
              className="border p-2 rounded"
              type="number"
              min={0}
              placeholder="Sqft Price Per Unit"
              value={bmsForm.sqftPricePerUnit}
              onChange={e => setBmsForm({ ...bmsForm, sqftPricePerUnit: Number(e.target.value) })}
            />
            <input
              className="border p-2 rounded col-span-2"
              placeholder="EMI Options (comma separated)"
              value={emiInput}
              onChange={e => {
                setEmiInput(e.target.value);
                setBmsForm({ ...bmsForm, emiOptions: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean) });
              }}
            />
            <div className="col-span-2 flex space-x-2">
              <button
                onClick={handleAddBmsPlot}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowBmsForm(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="space-y-8">
          {bmsPlots.map((plot) => {
            const selectedUnits = getSelectedUnits(plot.initialGrid);
            const totalSelected = selectedUnits.length;
            const totalCost = totalSelected * plot.sqftPricePerUnit;

            return (
              <div key={plot.id} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{plot.name} ({plot.location})</h3>
                <div className="mb-2 text-sm text-gray-600">
                  Units: {plot.totalUnits} | Size: {plot.unitsWide} x {plot.unitsTall} | Price/unit: ₹{plot.sqftPricePerUnit}
                </div>
                <div className="mb-2 text-sm text-gray-600">
                  EMI Options: {plot.emiOptions.join(', ') || 'None'}
                </div>
                <SqftGrid
                  gridData={plot.initialGrid}
                  onUnitSelect={(row, col) => handleUnitSelect(plot.id, row, col)}
                />
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-8">
                  <div className="text-green-700 font-semibold">
                    Selected Units: {totalSelected}
                  </div>
                  <div className="text-green-700 font-semibold">
                    Total Cost: ₹{totalCost.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyProperty;
