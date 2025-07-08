import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { IconPencil, IconPlus, IconTrash, MOCK_MATERIALS } from '../../constants';
import { MaterialDetail } from '../../types';

const initialMaterialFormState: Omit<MaterialDetail, 'id'> = {
  name: '',
  description: '',
  qualityStandard: '', // Will be used for Category
  supplier: '',       // Will be used for Vendor
  imageUrl: '',
  pricing: 0,         // Should be number, not string
  moq: 0,             // Should be number, not string
  // category: undefined, // Remove or comment out if not used in your form
};

const ManageMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialDetail[]>(() => 
    MOCK_MATERIALS.map(m => ({
      name: m.name,
      description: m.description,
      qualityStandard: 'qualityStandard' in m ? (m as any).qualityStandard : '',
      supplier: 'supplier' in m ? (m as any).supplier : '',
      imageUrl: 'imageUrl' in m ? (m as any).imageUrl : '',
      pricing: typeof (m as any).pricing === "number" ? (m as any).pricing : 0,
      moq: typeof (m as any).moq === "number" ? (m as any).moq : 0,
      id: m.id,
      // category: (m as any).category, // Remove or comment out if not used in your table
    }))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialDetail | null>(null);
  const [materialFormData, setMaterialFormData] = useState<Omit<MaterialDetail, 'id'>>(initialMaterialFormState);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (editingMaterial) {
      const { id, ...editableData } = editingMaterial;
      setMaterialFormData({ ...initialMaterialFormState, ...editableData });
    } else {
      setMaterialFormData(initialMaterialFormState);
    }
  }, [editingMaterial]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setMaterialFormData(prev => ({
      ...prev,
      [name]: (type === "number" || name === "pricing" || name === "moq") ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert pricing and moq to number for MaterialDetail type
    const parsedPricing = Number(materialFormData.pricing) || 0;
    const parsedMoq = Number(materialFormData.moq) || 0;
    const newMaterialData = {
      ...materialFormData,
      pricing: parsedPricing,
      moq: parsedMoq,
    };
    if (editingMaterial) {
      setMaterials(materials.map(m => m.id === editingMaterial.id ? { ...editingMaterial, ...newMaterialData } : m));
    } else {
      const newMaterial: MaterialDetail = { 
        ...newMaterialData, 
        id: `mat-${Date.now().toString()}`,
      };
      setMaterials([...materials, newMaterial]);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1800);
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
  
  const renderInputField = (
    label: string,
    name: keyof typeof materialFormData,
    type: string = 'text',
    required: boolean = true,
    isTextarea: boolean = false
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">{label}</label>
      {isTextarea ? (
        <textarea
          name={name}
          id={name}
          value={
            typeof materialFormData[name] === "string" || typeof materialFormData[name] === "number"
              ? String(materialFormData[name])
              : ""
          }
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
          value={
            typeof materialFormData[name] === "number"
              ? materialFormData[name] === 0 ? '' : materialFormData[name]
              : materialFormData[name] || ''
          }
          onChange={handleInputChange}
          required={required}
          className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-2">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shadow-lg">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" />
            </svg>
          </span>
          <div>
            <h1 className="text-xl font-bold text-primary mb-1 tracking-tight drop-shadow">Manage Construction Materials</h1>
            <div className="text-xs text-neutral-500">Add, edit, and manage all construction materials for your projects.</div>
          </div>
        </div>
        <Button
          onClick={openModalForNew}
          leftIcon={<IconPlus className="w-5 h-5" />}
          className="shadow-xl px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 transition"
        >
          Add New Material
        </Button>
      </div>
      
      <Card bodyClassName="p-0 shadow-2xl rounded-2xl border border-green-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-gradient-to-r from-primary/10 via-white to-primary/10">
              <tr>
                {['Name', 'Description', 'Category', 'Vendor', 'Pricing', 'MOQ', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-bold text-primary uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-green-50 transition">
                  <td className="px-4 py-2 whitespace-nowrap text-xs font-semibold text-neutral-900">
                    <div className="flex items-center">
                      {material.imageUrl && <img src={material.imageUrl} alt={material.name} className="w-8 h-8 rounded-md mr-2 object-cover shadow border border-primary/20" onError={(e) => e.currentTarget.style.display = 'none'}/>}
                      {material.name}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-normal text-xs text-neutral-600 max-w-xs break-words">{material.description}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-primary font-semibold">{material.qualityStandard}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-neutral-500">{material.supplier}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-green-700 font-bold">₹{material.pricing?.toLocaleString?.() ?? material.pricing}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-neutral-500">{material.moq}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs font-medium space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openModalForEdit(material)} leftIcon={<IconPencil className="w-4 h-4"/>} className="text-xs px-3 py-1">Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteMaterial(material.id)} leftIcon={<IconTrash className="w-4 h-4"/>} className="text-xs px-3 py-1 bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {materials.length === 0 && (
            <div className="text-center py-10 text-neutral-400 text-xs">
              <svg className="w-12 h-12 mx-auto mb-2 text-primary/20" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" />
              </svg>
              No materials found. Click "Add New Material" to get started.
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="">
        <div className="max-w-lg mx-auto bg-gradient-to-br from-green-50 via-white to-green-100 rounded-2xl shadow-2xl p-0">
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              {editingMaterial ? (
                <>
                  <IconPencil className="w-4 h-4 text-primary" />
                  Edit Material
                </>
              ) : (
                <>
                  <IconPlus className="w-4 h-4 text-primary" />
                  Add New Material
                </>
              )}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 px-6 pb-6 pt-2 text-xs">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                {renderInputField('Material Name', 'name')}
                {renderInputField('Category', 'qualityStandard')}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {renderInputField('Vendor (Optional)', 'supplier', 'text', false)}
                {renderInputField('Image URL (Optional)', 'imageUrl', 'url', false)}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {renderInputField('Pricing', 'pricing', 'number', false)}
                {renderInputField('MOQ', 'moq', 'number', false)}
              </div>
              {renderInputField('Description', 'description', 'text', true, true)}
            </div>
            <div className="flex justify-end space-x-2 pt-3">
              <Button type="button" variant="secondary" onClick={closeModal} className="px-4 py-1 text-xs bg-gradient-to-r from-green-200 to-green-400 text-green-900 hover:from-green-300 hover:to-green-500">Back</Button>
              <Button type="submit" variant="primary" className="px-4 py-1 text-xs bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800">{editingMaterial ? 'Save Changes' : 'Add Material'}</Button>
            </div>
          </form>
        </div>
        <style>{`
          .modal-card-creative {
            background: linear-gradient(135deg, #bbf7d0 0%, #fff 60%, #a7f3d0 100%);
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
      {/* Creative popup after adding material */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative pointer-events-auto animate-materialpop">
            <div className="bg-gradient-to-br from-green-200 via-white to-green-100 rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-green-700 mb-2 text-center">Material Added!</div>
              <div className="text-base text-gray-700 mb-2 text-center">
                Your material has been successfully added.
              </div>
            </div>
          </div>
          <style>{`
            @keyframes materialpop {
              0% { transform: translateY(100%) scale(0.8) rotate(-5deg); opacity: 0; }
              60% { transform: translateY(-20%) scale(1.05) rotate(2deg); opacity: 1; }
              100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
            }
            .animate-materialpop { 
              animation: materialpop 0.7s cubic-bezier(.68,-0.55,.27,1.55); 
            }
            @keyframes bounce-slow {
              0%, 100% { transform: translateY(0);}
              50% { transform: translateY(-10px);}
            }
            .animate-bounce-slow { animation: bounce-slow 1.5s infinite; }
          `}</style>
        </div>
      )}
      <style>{`
        .shadow-2xl { box-shadow: 0 8px 32px 0 rgba(31, 41, 55, 0.12); }
        .drop-shadow { filter: drop-shadow(0 2px 8px #22c55e33); }
      `}</style>
    </div>
  );
};

export default ManageMaterialsPage;
