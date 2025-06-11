import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { IconPencil, IconPlus, IconTrash, MOCK_PLOTS } from '../../constants';
import { Plot } from '../../types';

const initialPlotFormState: Omit<Plot, 'id' | 'plotValue'> = {
  title: '',
  location: '',
  price: 0,
  area: 0,
  imageUrl: '',
  type: undefined as any, // PlotType, must be set by user
  description: '',
  amenities: [],
  isFlagship: false,
  documents: [],
  sqftPrice: 0,
  value: 0, // Add this line to satisfy the required property
};

const ManagePlotsPage: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>(MOCK_PLOTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [plotFormData, setPlotFormData] = useState<Omit<Plot, 'id' | 'plotValue'>>(initialPlotFormState);

  useEffect(() => {
    if (editingPlot) {
      const { id, plotValue, ...editableData } = editingPlot;
      setPlotFormData(editableData as typeof plotFormData);
    } else {
      setPlotFormData(initialPlotFormState);
    }
  }, [editingPlot]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let val: any;
    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      val = parseFloat(value) || 0;
    } else {
      val = value;
    }
    setPlotFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plotValue = plotFormData.area * (plotFormData.sqftPrice || 0);
    if (editingPlot) {
      setPlots(plots.map(p => p.id === editingPlot.id ? { ...plotFormData, id: editingPlot.id, plotValue } : p));
    } else {
      const newPlot: Plot = { 
        ...plotFormData, 
        id: `plot-${Date.now().toString()}`,
        plotValue 
      };
      setPlots([...plots, newPlot]);
    }
    closeModal();
  };

  const openModalForEdit = (plot: Plot) => {
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
  
  const renderInputField = (
    label: string,
    name: keyof typeof plotFormData,
    type: string = 'text',
    required: boolean = true
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={
          type === 'number'
            ? plotFormData[name] !== undefined && plotFormData[name] !== null
              ? plotFormData[name] === 0 ? '' : Number(plotFormData[name])
              : ''
            : typeof plotFormData[name] === 'boolean'
              ? undefined // checkboxes handled separately
              : plotFormData[name] ?? ''
        }
        onChange={handleInputChange}
        required={required}
        className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        min={type === 'number' ? 0 : undefined}
      />
    </div>
  );

  // For textarea fields
  const renderTextAreaField = (
    label: string,
    name: keyof typeof plotFormData,
    required: boolean = true
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">{label}</label>
      <textarea
        name={name}
        id={name}
        value={
          typeof plotFormData[name] === "string"
            ? (plotFormData[name] as string)
            : ""
        }
        onChange={handleInputChange}
        required={required}
        className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        rows={3}
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
                {['Plot Title', 'Location', 'Area (Sq.Ft)', 'Price', 'Type', 'Status', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {plots.map((plot) => (
                <tr key={plot.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{plot.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{plot.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{plot.area?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">₹{plot.price?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{plot.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plot.isFlagship ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {plot.isFlagship ? 'Flagship' : 'Standard'}
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title="">
        <div className="max-w-lg mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-0">
          <div className="flex items-center justify-between px-8 pt-8 pb-2">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              {editingPlot ? (
                <>
                  <IconPencil className="w-5 h-5 text-primary" />
                  Edit Plot
                </>
              ) : (
                <>
                  <IconPlus className="w-5 h-5 text-primary" />
                  Add New Plot
                </>
              )}
            </h2>
            {/* Keep the inside close/back icon, remove any outside/Modal-level close icon if present */}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 px-8 pb-8 pt-2">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {renderInputField('Plot Title', 'title')}
                {renderInputField('Location', 'location')}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {renderInputField('Area (Sq. Ft.)', 'area', 'number')}
                {renderInputField('Price (₹)', 'price', 'number')}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {renderInputField('Sqft Price (₹)', 'sqftPrice', 'number', false)}
                {renderInputField('Image URL', 'imageUrl', 'url', false)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {renderInputField('Type', 'type')}
                <div className="flex items-center gap-2">
                  {renderInputField('Flagship', 'isFlagship', 'checkbox', false)}
                  <span className="text-xs text-gray-500">Mark as flagship plot</span>
                </div>
              </div>
              {renderTextAreaField('Description', 'description', false)}
              {/* Add amenities/documents as needed */}
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="secondary" onClick={closeModal}>Back</Button>
              <Button type="submit" variant="primary">{editingPlot ? 'Save Changes' : 'Add Plot'}</Button>
            </div>
          </form>
        </div>
        <style>{`
          .modal-card-creative {
            background: linear-gradient(135deg, #e0e7ff 0%, #fff 60%, #bae6fd 100%);
            border-radius: 1.5rem;
            box-shadow: 0 8px 32px 0 rgba(31, 41, 55, 0.12);
            animation: pop-in-modal 0.5s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes pop-in-modal {
            0% { transform: scale(0.95) translateY(40px); opacity: 0.5; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
        `}</style>
      </Modal>
    </div>
  );
};

export default ManagePlotsPage;
