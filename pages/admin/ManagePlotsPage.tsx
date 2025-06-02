
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { MOCK_PLOTS, IconPlus, IconPencil, IconTrash } from '../../constants';
import { PlotInfo } from '../../types';

const initialPlotFormState: Omit<PlotInfo, 'id' | 'plotValue'> = {
  projectName: '',
  phase: '',
  plotNo: '',
  sqFt: 0,
  ratePerSqFt: 0,
  isAvailable: true,
  plotImageUrl: '',
};

const ManagePlotsPage: React.FC = () => {
  const [plots, setPlots] = useState<PlotInfo[]>(MOCK_PLOTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<PlotInfo | null>(null);
  const [plotFormData, setPlotFormData] = useState<Omit<PlotInfo, 'id'| 'plotValue'>>(initialPlotFormState);

  useEffect(() => {
    if (editingPlot) {
      const { id, plotValue, ...editableData } = editingPlot;
      setPlotFormData(editableData);
    } else {
      setPlotFormData(initialPlotFormState);
    }
  }, [editingPlot]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseFloat(value) || 0 : value);
    setPlotFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plotValue = plotFormData.sqFt * plotFormData.ratePerSqFt;
    if (editingPlot) {
      setPlots(plots.map(p => p.id === editingPlot.id ? { ...plotFormData, id: editingPlot.id, plotValue } : p));
    } else {
      const newPlot: PlotInfo = { 
        ...plotFormData, 
        id: `plot-${Date.now().toString()}`, // Simple unique ID
        plotValue 
      };
      setPlots([...plots, newPlot]);
    }
    closeModal();
  };

  const openModalForEdit = (plot: PlotInfo) => {
    setEditingPlot(plot);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingPlot(null);
    setPlotFormData(initialPlotFormState);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlot(null);
    setPlotFormData(initialPlotFormState);
  };

  const handleDeletePlot = (plotId: string) => {
    if (window.confirm('Are you sure you want to delete this plot?')) {
      setPlots(plots.filter(p => p.id !== plotId));
    }
  };
  
  const renderInputField = (label: string, name: keyof typeof plotFormData, type: string = 'text', required: boolean = true) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={plotFormData[name]?.toString() || (type === 'number' ? '0' : '')}
        onChange={handleInputChange}
        required={required}
        className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        min={type === 'number' ? 0 : undefined}
      />
    </div>
  );


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Manage Plots</h1>
        <Button onClick={openModalForNew} leftIcon={<IconPlus className="w-5 h-5"/>}>Add New Plot</Button>
      </div>
      
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {['Plot No', 'Project', 'Phase', 'Sq. Ft.', 'Rate/Sq.Ft', 'Total Value', 'Status', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {plots.map((plot) => (
                <tr key={plot.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{plot.plotNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{plot.projectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{plot.phase}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{plot.sqFt.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">₹{plot.ratePerSqFt.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">₹{plot.plotValue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plot.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {plot.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openModalForEdit(plot)} leftIcon={<IconPencil className="w-4 h-4"/>}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeletePlot(plot.id)} leftIcon={<IconTrash className="w-4 h-4"/>}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {plots.length === 0 && <p className="text-center py-4 text-neutral-500">No plots found.</p>}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingPlot ? 'Edit Plot' : 'Add New Plot'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderInputField('Project Name', 'projectName')}
          {renderInputField('Phase', 'phase')}
          {renderInputField('Plot Number', 'plotNo')}
          {renderInputField('Area (Sq. Ft.)', 'sqFt', 'number')}
          {renderInputField('Rate per Sq. Ft. (₹)', 'ratePerSqFt', 'number')}
          {renderInputField('Image URL (Optional)', 'plotImageUrl', 'url', false)}
          <div>
            <label className="block text-sm font-medium text-neutral-700">Availability</label>
            <div className="mt-1">
              <label htmlFor="isAvailable" className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  id="isAvailable"
                  checked={plotFormData.isAvailable}
                  onChange={handleInputChange}
                  className="rounded h-4 w-4 text-primary border-neutral-300 focus:ring-primary"
                />
                <span className="ml-2 text-sm text-neutral-600">Is Available</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">{editingPlot ? 'Save Changes' : 'Add Plot'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManagePlotsPage;
