
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { MOCK_COMMERCIAL_PROPERTIES, IconPlus, IconPencil, IconTrash } from '../../constants';
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Manage Commercial Properties</h1>
        <Button onClick={openModalForNew} leftIcon={<IconPlus className="w-5 h-5"/>}>Add New Property</Button>
      </div>
      
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {['Name', 'Type', 'Location', 'Area (SqFt)', 'Sale Price', 'Rent/Month', 'Status', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {commercialProperties.map((prop) => (
                <tr key={prop.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{prop.propertyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{prop.commercialType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{prop.location.locality}, {prop.location.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{prop.areaSqFt.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{prop.isForSale ? `₹${(prop.salePrice || 0).toLocaleString()}` : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{prop.isForRent ? `₹${(prop.rentPerMonth || 0).toLocaleString()}` : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prop.availabilityStatus === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {prop.availabilityStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openModalForEdit(prop)} leftIcon={<IconPencil className="w-4 h-4"/>}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteProperty(prop.id)} leftIcon={<IconTrash className="w-4 h-4"/>}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {commercialProperties.length === 0 && <p className="text-center py-4 text-neutral-500">No commercial properties found.</p>}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProperty ? 'Edit Commercial Property' : 'Add New Commercial Property'}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
          {renderInputField('Property Name', 'propertyName')}
          <div>
            <label htmlFor="commercialType" className="block text-sm font-medium text-neutral-700">Commercial Type</label>
            <select name="commercialType" id="commercialType" value={formData.commercialType} onChange={handleInputChange} required
                    className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
              {Object.values(CommercialPropertyType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {renderInputField('Address Line 1', 'location.addressLine1', 'text', false)}
          {renderInputField('Locality', 'location.locality')}
          {renderInputField('City', 'location.city')}
          {renderInputField('Pincode', 'location.pincode', 'text', false)}
          {renderInputField('Area (Sq. Ft.)', 'areaSqFt', 'number')}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="isForSale" className="flex items-center text-sm font-medium text-neutral-700">
                <input type="checkbox" name="isForSale" id="isForSale" checked={formData.isForSale} onChange={handleInputChange} className="mr-2 h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"/>
                For Sale
                </label>
                {formData.isForSale && renderInputField('Sale Price (₹)', 'salePrice', 'number', false)}
            </div>
            <div>
                <label htmlFor="isForRent" className="flex items-center text-sm font-medium text-neutral-700">
                <input type="checkbox" name="isForRent" id="isForRent" checked={formData.isForRent} onChange={handleInputChange} className="mr-2 h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"/>
                For Rent
                </label>
                {formData.isForRent && renderInputField('Rent per Month (₹)', 'rentPerMonth', 'number', false)}
            </div>
          </div>

          <div>
            <label htmlFor="availabilityStatus" className="block text-sm font-medium text-neutral-700">Availability Status</label>
            <select name="availabilityStatus" id="availabilityStatus" value={formData.availabilityStatus} onChange={handleInputChange} required
                    className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
              {['Available', 'Leased', 'Sold', 'Under Offer'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          {renderInputField('Description', 'description', 'text', true, true)}
          
          <div>
            <label htmlFor="amenitiesInput" className="block text-sm font-medium text-neutral-700">Amenities (comma-separated)</label>
            <input type="text" name="amenitiesInput" id="amenitiesInput" value={amenitiesInput} onChange={handleAmenitiesChange}
                   className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="imagesInput" className="block text-sm font-medium text-neutral-700">Image URLs (comma-separated)</label>
            <input type="text" name="imagesInput" id="imagesInput" value={imagesInput} onChange={handleImagesChange}
                   className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>

          {renderInputField('Floor (e.g., Ground, 3rd)', 'floor', 'text', false)}
          {renderInputField('Total Floors in Building', 'totalFloors', 'number', false)}
          {renderInputField('Parking Spaces', 'parkingSpaces', 'number', false)}
          {renderInputField('Year Built', 'yearBuilt', 'number', false)}
          {renderInputField('Contact Person Name', 'contactPerson')}
          {renderInputField('Contact Person Number', 'contactNumber', 'tel')}


          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">{editingProperty ? 'Save Changes' : 'Add Property'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCommercialPage;