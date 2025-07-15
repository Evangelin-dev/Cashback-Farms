import React, { ChangeEvent, useEffect, useState } from 'react';
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
  type: 'Verified Plot', // Predefined and not editable
  description: '',
  amenities: [],
  isFlagship: true,
  documents: [],
  sqftPrice: 0,
  value: 0,
};

const ManageVerifiedPlots: React.FC = () => {
  // Only flagship plots
  const [plots, setPlots] = useState<Plot[]>(MOCK_PLOTS.filter(p => p.isFlagship));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [plotFormData, setPlotFormData] = useState<Omit<Plot, 'id' | 'plotValue'>>(initialPlotFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (editingPlot) {
      const { id, plotValue, ...editableData } = editingPlot;
      setPlotFormData(editableData as typeof plotFormData);
      setImagePreview(editableData.imageUrl || '');
      setImageFile(null);
    } else {
      setPlotFormData(initialPlotFormState);
      setImagePreview('');
      setImageFile(null);
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plotValue = plotFormData.area * (plotFormData.sqftPrice || 0);
    let imageUrl = plotFormData.imageUrl;
    if (imageFile) {
      // In a real app, upload the file and get the URL
      imageUrl = imagePreview;
    }
    if (editingPlot) {
      setPlots(plots.map(p => p.id === editingPlot.id ? { ...plotFormData, id: editingPlot.id, plotValue, imageUrl, isFlagship: true } : p));
    } else {
      const newPlot: Plot = {
        ...plotFormData,
        id: `plot-${Date.now().toString()}`,
        plotValue,
        imageUrl,
        isFlagship: true,
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
    setImagePreview('');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlot(null);
    setPlotFormData(initialPlotFormState);
    setImagePreview('');
    setImageFile(null);
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
    <div className="px-2 sm:px-4 md:px-8 py-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 text-center md:text-left">Manage Verified (Flagship) Plots</h1>
        <div className="flex justify-center md:justify-end">
          <Button onClick={openModalForNew} leftIcon={<IconPlus className="w-5 h-5"/>} className="w-full md:w-auto">Add New Verified Plot</Button>
        </div>
      </div>
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50">
              <tr>
                {['Plot Title', 'Location', 'Area (Sq.Ft)', 'Price', 'Type', 'Status', 'Image', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-3 py-3 text-left font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {plots.map((plot) => (
                <tr key={plot.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-3 py-4 whitespace-nowrap font-medium text-neutral-900 max-w-[160px] truncate">{plot.title}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-neutral-500 max-w-[120px] truncate">{plot.location}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-neutral-500">{plot.area?.toLocaleString()}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-neutral-500">₹{plot.price?.toLocaleString()}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-neutral-500">{plot.type}</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Flagship</span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {plot.imageUrl ? <img src={plot.imageUrl} alt="Plot" className="w-16 h-12 object-cover rounded shadow" /> : <span className="text-xs text-gray-400">No Image</span>}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap font-medium space-x-2 flex flex-col sm:flex-row gap-2">
                    <Button size="sm" variant="outline" onClick={() => openModalForEdit(plot)} leftIcon={<IconPencil className="w-4 h-4"/>} className="w-full sm:w-auto">Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeletePlot(plot.id)} leftIcon={<IconTrash className="w-4 h-4"/>} className="w-full sm:w-auto">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {plots.length === 0 && <p className="text-center py-4 text-neutral-500">No flagship plots found.</p>}
        </div>
      </Card>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="">
        <div className="max-w-lg mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-0">
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 pt-8 pb-2 gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
              {editingPlot ? (
                <>
                  <IconPencil className="w-5 h-5 text-primary" />
                  Edit Verified Plot
                </>
              ) : (
                <>
                  <IconPlus className="w-5 h-5 text-primary" />
                  Add New Verified Plot
                </>
              )}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-8 pt-2">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInputField('Plot Title', 'title')}
                {renderInputField('Location', 'location')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInputField('Area (Sq. Ft.)', 'area', 'number')}
                {renderInputField('Price (₹)', 'price', 'number')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInputField('Sqft Price (₹)', 'sqftPrice', 'number', false)}
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Image Upload</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm" />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded shadow" />}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Type</label>
                  <input
                    type="text"
                    name="type"
                    id="type"
                    value="Verified Plot"
                    readOnly
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm"
                  />
                </div>
              </div>
              {renderTextAreaField('Description', 'description', false)}
              {/* Add amenities/documents as needed */}
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button type="button" variant="secondary" onClick={closeModal} className="w-full sm:w-auto">Back</Button>
              <Button type="submit" variant="primary" className="w-full sm:w-auto">{editingPlot ? 'Save Changes' : 'Add Verified Plot'}</Button>
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

export default ManageVerifiedPlots;
