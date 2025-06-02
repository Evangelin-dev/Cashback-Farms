
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { MOCK_MATERIALS, IconPlus, IconPencil, IconTrash } from '../../constants';
import { MaterialDetail } from '../../types';

const initialMaterialFormState: Omit<MaterialDetail, 'id'> = {
  name: '',
  description: '',
  qualityStandard: '',
  supplier: '',
  imageUrl: '',
};

const ManageMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialDetail[]>(MOCK_MATERIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialDetail | null>(null);
  const [materialFormData, setMaterialFormData] = useState<Omit<MaterialDetail, 'id'>>(initialMaterialFormState);

  useEffect(() => {
    if (editingMaterial) {
      const { id, ...editableData } = editingMaterial;
      setMaterialFormData(editableData);
    } else {
      setMaterialFormData(initialMaterialFormState);
    }
  }, [editingMaterial]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMaterialFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMaterial) {
      setMaterials(materials.map(m => m.id === editingMaterial.id ? { ...editingMaterial, ...materialFormData } : m));
    } else {
      const newMaterial: MaterialDetail = { 
        ...materialFormData, 
        id: `mat-${Date.now().toString()}`, // Simple unique ID
      };
      setMaterials([...materials, newMaterial]);
    }
    closeModal();
  };

  const openModalForEdit = (material: MaterialDetail) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingMaterial(null);
    setMaterialFormData(initialMaterialFormState);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMaterial(null);
    setMaterialFormData(initialMaterialFormState);
  };

  const handleDeleteMaterial = (materialId: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter(m => m.id !== materialId));
    }
  };
  
  const renderInputField = (label: string, name: keyof typeof materialFormData, type: string = 'text', required: boolean = true, isTextarea: boolean = false) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">{label}</label>
      {isTextarea ? (
        <textarea
          name={name}
          id={name}
          value={materialFormData[name] || ''}
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
          value={materialFormData[name] || ''}
          onChange={handleInputChange}
          required={required}
          className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Manage Construction Materials</h1>
        <Button onClick={openModalForNew} leftIcon={<IconPlus className="w-5 h-5"/>}>Add New Material</Button>
      </div>
      
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {['Name', 'Description', 'Standard', 'Supplier', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {materials.map((material) => (
                <tr key={material.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    <div className="flex items-center">
                      {material.imageUrl && <img src={material.imageUrl} alt={material.name} className="w-10 h-10 rounded-md mr-3 object-cover" onError={(e) => e.currentTarget.style.display = 'none'}/>}
                      {material.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-neutral-500 max-w-xs break-words">{material.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{material.qualityStandard}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{material.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openModalForEdit(material)} leftIcon={<IconPencil className="w-4 h-4"/>}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteMaterial(material.id)} leftIcon={<IconTrash className="w-4 h-4"/>}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {materials.length === 0 && <p className="text-center py-4 text-neutral-500">No materials found.</p>}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingMaterial ? 'Edit Material' : 'Add New Material'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderInputField('Material Name', 'name')}
          {renderInputField('Description', 'description', 'text', true, true)}
          {renderInputField('Quality Standard', 'qualityStandard')}
          {renderInputField('Supplier (Optional)', 'supplier', 'text', false)}
          {renderInputField('Image URL (Optional)', 'imageUrl', 'url', false)}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">{editingMaterial ? 'Save Changes' : 'Add Material'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageMaterialsPage;
