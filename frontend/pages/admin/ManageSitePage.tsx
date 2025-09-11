
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { MOCK_SITE_DETAILS } from '../../constants';
import { SiteDetails } from '../../types';

const ManageSitePage: React.FC = () => {
  const [siteDetails, setSiteDetails] = useState<SiteDetails>(MOCK_SITE_DETAILS);
  const [formData, setFormData] = useState<SiteDetails>(MOCK_SITE_DETAILS);
  const [amenitiesInput, setAmenitiesInput] = useState<string>('');

  useEffect(() => {
    setFormData(siteDetails);
    setAmenitiesInput(siteDetails.amenities.join(', '));
  }, [siteDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmenitiesInput(e.target.value);
    setFormData(prev => ({ ...prev, amenities: e.target.value.split(',').map(a => a.trim()).filter(a => a) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    MOCK_SITE_DETAILS.name = formData.name;
    MOCK_SITE_DETAILS.location = formData.location;
    MOCK_SITE_DETAILS.description = formData.description;
    MOCK_SITE_DETAILS.amenities = formData.amenities;
    MOCK_SITE_DETAILS.sitePlanImageUrl = formData.sitePlanImageUrl;
    
    setSiteDetails({...MOCK_SITE_DETAILS});
    alert('Site details updated successfully!');
  };
  
  const renderInputField = (label: string, name: keyof Omit<SiteDetails, 'id' | 'amenities'>, type: string = 'text', isTextarea: boolean = false) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">{label}</label>
      {isTextarea ? (
        <textarea
          name={name}
          id={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      )}
    </div>
  );


  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Manage Site Details</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInputField('Site Name', 'name')}
          {renderInputField('Location', 'location')}
          {renderInputField('Description', 'description', 'text', true)}
          
          <div>
            <label htmlFor="amenities" className="block text-sm font-medium text-neutral-700">Amenities (comma-separated)</label>
            <input
              type="text"
              name="amenities"
              id="amenities"
              value={amenitiesInput}
              onChange={handleAmenitiesChange}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="e.g., Clubhouse, Swimming Pool, Gym"
            />
          </div>
          
          {renderInputField('Site Plan Image URL', 'sitePlanImageUrl', 'url')}

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">Save Site Details</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ManageSitePage;
