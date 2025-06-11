import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { IconPencil, IconPlus, IconTrash, MOCK_COMMERCIAL_PROPERTIES } from '../../constants';
import { CommercialPropertyInfo, CommercialPropertyType, PropertyLocation } from '../../types';

const initialCommercialPropertyFormState: Omit<CommercialPropertyInfo, 'id' | 'addedDate'> = {
  propertyName: '',
  commercialType: CommercialPropertyType.OFFICE_SPACE,
  location: { locality: '', city: '', pincode: '', addressLine1: '' },
  areaSqFt: 0,
  isForSale: false,
  salePrice: 0,
  isForRent: false,
  rentPerMonth: 0,
  availabilityStatus: 'Available',
  description: '',
  amenities: [],
  imagesUrls: [],
  floor: '',
  totalFloors: 0,
  parkingSpaces: 0,
  yearBuilt: new Date().getFullYear(),
  contactPerson: '',
  contactNumber: '',
};

const ManageCommercialPage: React.FC = () => {
  const [commercialProperties, setCommercialProperties] = useState<CommercialPropertyInfo[]>(MOCK_COMMERCIAL_PROPERTIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<CommercialPropertyInfo | null>(null);
  const [formData, setFormData] = useState<Omit<CommercialPropertyInfo, 'id' | 'addedDate'>>(initialCommercialPropertyFormState);
  const [amenitiesInput, setAmenitiesInput] = useState<string>('');
  const [imagesInput, setImagesInput] = useState<string>('');


  useEffect(() => {
    if (editingProperty) {
      const { id, addedDate, ...dataForForm } = editingProperty;
      setFormData(dataForForm);
      setAmenitiesInput(dataForForm.amenities.join(', '));
      setImagesInput(dataForForm.imagesUrls.join(', '));
    } else {
      setFormData(initialCommercialPropertyFormState);
      setAmenitiesInput('');
      setImagesInput('');
    }
  }, [editingProperty]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith("location.")) {
        const locField = name.split(".")[1] as keyof PropertyLocation;
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [locField]: value
            }
        }));
        return;
    }

    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };
  
  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmenitiesInput(e.target.value);
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagesInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFormData = {
        ...formData,
        amenities: amenitiesInput.split(',').map(a => a.trim()).filter(a => a),
        imagesUrls: imagesInput.split(',').map(img => img.trim()).filter(img => img)
    };

    if (editingProperty) {
      const updatedProperty: CommercialPropertyInfo = { ...editingProperty, ...finalFormData };
      setCommercialProperties(commercialProperties.map(p => p.id === editingProperty.id ? updatedProperty : p));
      // Update mock global array
      const mockIndex = MOCK_COMMERCIAL_PROPERTIES.findIndex(p => p.id === editingProperty.id);
      if (mockIndex !== -1) MOCK_COMMERCIAL_PROPERTIES[mockIndex] = updatedProperty;

    } else {
      const newProperty: CommercialPropertyInfo = {
        ...finalFormData,
        id: `comm-${Date.now().toString()}`,
        addedDate: new Date().toISOString().split('T')[0],
      };
      setCommercialProperties([...commercialProperties, newProperty]);
      MOCK_COMMERCIAL_PROPERTIES.push(newProperty); // Add to mock global array
    }
    closeModal();
  };

  const openModalForEdit = (property: CommercialPropertyInfo) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
    // Resetting form data is handled by useEffect when editingProperty becomes null
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this commercial property?')) {
      setCommercialProperties(commercialProperties.filter(p => p.id !== propertyId));
      // Remove from mock global array
      const mockIndex = MOCK_COMMERCIAL_PROPERTIES.findIndex(p => p.id === propertyId);
      if (mockIndex !== -1) MOCK_COMMERCIAL_PROPERTIES.splice(mockIndex, 1);
    }
  };
  
  const renderInputField = (label: string, name: string, type: string = 'text', required: boolean = true, isTextarea: boolean = false) => {
      let value: any;
      if (name.startsWith("location.")) {
          const locField = name.split(".")[1] as keyof PropertyLocation;
          value = formData.location[locField];
      } else {
          value = (formData as any)[name];
      }

      if (type === 'number' && (value === undefined || value === null)) value = 0;
      if (type !== 'number' && (value === undefined || value === null)) value = '';


      return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-neutral-700">{label}</label>
            {isTextarea ? (
            <textarea
                name={name}
                id={name}
                value={value}
                onChange={handleInputChange}
                required={required}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            ) : (
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={handleInputChange}
                required={required}
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                min={type === 'number' ? 0 : undefined}
            />
            )}
        </div>
    );
 };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-2">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shadow-xl">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4M4 21h16" />
            </svg>
          </span>
          <div>
            <h1 className="text-xl font-bold text-primary mb-1 tracking-tight drop-shadow">Manage Commercial Properties</h1>
            <div className="text-xs text-neutral-500">Add, edit, and manage all commercial properties for your projects.</div>
          </div>
        </div>
        <Button
          onClick={openModalForNew}
          leftIcon={<IconPlus className="w-5 h-5" />}
          className="shadow-xl px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 transition"
        >
          Add New Property
        </Button>
      </div>
      <Card bodyClassName="p-0 shadow-2xl rounded-2xl border border-green-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-100">
            <thead className="bg-gradient-to-r from-primary/10 via-white to-primary/10">
              <tr>
                {['Name', 'Type', 'Location', 'Area (SqFt)', 'Sale Price', 'Rent/Month', 'Status', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-bold text-primary uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-50">
              {commercialProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-green-50 transition">
                  <td className="px-4 py-2 whitespace-nowrap text-xs font-semibold text-neutral-900">{prop.propertyName}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-primary font-semibold">{prop.commercialType}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-neutral-500">{prop.location.locality}, {prop.location.city}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-neutral-500">{prop.areaSqFt.toLocaleString()}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-green-700 font-bold">{prop.isForSale ? `₹${(prop.salePrice || 0).toLocaleString()}` : 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-green-700 font-bold">{prop.isForRent ? `₹${(prop.rentPerMonth || 0).toLocaleString()}` : 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow ${prop.availabilityStatus === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {prop.availabilityStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs font-medium space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openModalForEdit(prop)} leftIcon={<IconPencil className="w-4 h-4"/>} className="text-xs px-3 py-1">Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteProperty(prop.id)} leftIcon={<IconTrash className="w-4 h-4"/>} className="text-xs px-3 py-1 bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {commercialProperties.length === 0 && (
            <div className="text-center py-10 text-neutral-400 text-xs">
              <svg className="w-12 h-12 mx-auto mb-2 text-primary/20" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4M4 21h16" />
              </svg>
              No commercial properties found. Click "Add New Property" to get started.
            </div>
          )}
        </div>
      </Card>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProperty ? 'Edit Commercial Property' : 'Add New Commercial Property'}>
        <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto p-2 text-xs">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {renderInputField('Property Name', 'propertyName')}
              <div>
                <label htmlFor="commercialType" className="block text-xs font-medium text-neutral-700">Commercial Type</label>
                <select name="commercialType" id="commercialType" value={formData.commercialType} onChange={handleInputChange} required
                        className="mt-1 block w-full px-2 py-1.5 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-xs">
                  {Object.values(CommercialPropertyType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderInputField('Address Line 1', 'location.addressLine1', 'text', false)}
              {renderInputField('Locality', 'location.locality')}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderInputField('City', 'location.city')}
              {renderInputField('Pincode', 'location.pincode', 'text', false)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderInputField('Area (Sq. Ft.)', 'areaSqFt', 'number')}
              <div className="flex items-center gap-2">
                <label htmlFor="isForSale" className="flex items-center text-xs font-medium text-neutral-700">
                  <input type="checkbox" name="isForSale" id="isForSale" checked={formData.isForSale} onChange={handleInputChange} className="mr-2 h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"/>
                  For Sale
                </label>
                {formData.isForSale && renderInputField('Sale Price (₹)', 'salePrice', 'number', false)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="isForRent" className="flex items-center text-xs font-medium text-neutral-700">
                  <input type="checkbox" name="isForRent" id="isForRent" checked={formData.isForRent} onChange={handleInputChange} className="mr-2 h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"/>
                  For Rent
                </label>
                {formData.isForRent && renderInputField('Rent per Month (₹)', 'rentPerMonth', 'number', false)}
              </div>
              <div>
                <label htmlFor="availabilityStatus" className="block text-xs font-medium text-neutral-700">Availability Status</label>
                <select name="availabilityStatus" id="availabilityStatus" value={formData.availabilityStatus} onChange={handleInputChange} required
                        className="mt-1 block w-full px-2 py-1.5 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-xs">
                  {['Available', 'Leased', 'Sold', 'Under Offer'].map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            {renderInputField('Description', 'description', 'text', true, true)}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="amenitiesInput" className="block text-xs font-medium text-neutral-700">Amenities (comma-separated)</label>
                <input type="text" name="amenitiesInput" id="amenitiesInput" value={amenitiesInput} onChange={handleAmenitiesChange}
                       className="mt-1 block w-full px-2 py-1.5 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-xs" />
              </div>
              <div>
                <label htmlFor="imagesInput" className="block text-xs font-medium text-neutral-700">Image URLs (comma-separated)</label>
                <input type="text" name="imagesInput" id="imagesInput" value={imagesInput} onChange={handleImagesChange}
                       className="mt-1 block w-full px-2 py-1.5 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderInputField('Floor (e.g., Ground, 3rd)', 'floor', 'text', false)}
              {renderInputField('Total Floors in Building', 'totalFloors', 'number', false)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderInputField('Parking Spaces', 'parkingSpaces', 'number', false)}
              {renderInputField('Year Built', 'yearBuilt', 'number', false)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderInputField('Contact Person Name', 'contactPerson')}
              {renderInputField('Contact Person Number', 'contactNumber', 'tel')}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-3">
            <Button type="button" variant="secondary" onClick={closeModal} className="px-4 py-1 text-xs bg-gradient-to-r from-green-200 to-green-400 text-green-900 hover:from-green-300 hover:to-green-500">Cancel</Button>
            <Button type="submit" variant="primary" className="px-4 py-1 text-xs bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800">{editingProperty ? 'Save Changes' : 'Add Property'}</Button>
          </div>
        </form>
      </Modal>
      <style>{`
        .shadow-2xl { box-shadow: 0 8px 32px 0 rgba(31, 41, 55, 0.12); }
        .drop-shadow { filter: drop-shadow(0 2px 8px #22c55e33); }
      `}</style>
    </div>
  );
};

export default ManageCommercialPage;