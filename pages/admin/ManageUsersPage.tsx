import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { IconPencil, IconPlus, IconTrash, MOCK_USERS } from '../../constants';
import { User, UserRole } from '../../types';

const initialUserFormState: Omit<User, 'id' | 'createdAt'> = {
  name: '',
  email: '',
  role: UserRole.USER,
};

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<Omit<User, 'id' | 'createdAt'>>(initialUserFormState);

  useEffect(() => {
    if (editingUser) {
      const { id, createdAt, ...editableData } = editingUser;
      setUserFormData(editableData);
    } else {
      setUserFormData(initialUserFormState);
    }
  }, [editingUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...userFormData } : u));
    } else {
      const newUser: User = { 
        ...userFormData, 
        id: `user-${Date.now().toString()}`, // Simple unique ID
        createdAt: new Date().toISOString().split('T')[0], 
      };
      setUsers([...users, newUser]);
    }
    closeModal();
  };

  const openModalForEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingUser(null);
    setUserFormData(initialUserFormState)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
     setUserFormData(initialUserFormState);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shadow">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" />
            </svg>
          </span>
          <div>
            <h1 className="text-2xl font-bold text-primary mb-1">Manage Users</h1>
            <div className="text-sm text-neutral-500">Add, edit, and manage all users of the platform.</div>
          </div>
        </div>
        <Button onClick={openModalForNew} leftIcon={<IconPlus className="w-5 h-5"/>} className="shadow-lg">
          Add New User
        </Button>
      </div>
      
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-gradient-to-r from-primary/10 via-white to-primary/10">
              <tr>
                {['Name', 'Email', 'Role', 'Created At', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-primary/5 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-semibold">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{user.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openModalForEdit(user)} leftIcon={<IconPencil className="w-4 h-4"/>}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteUser(user.id)} leftIcon={<IconTrash className="w-4 h-4"/>}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {users.length === 0 && (
             <div className="text-center py-10 text-neutral-400 text-lg">
               <svg className="w-16 h-16 mx-auto mb-2 text-primary/20" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" />
               </svg>
               No users found. Click "Add New User" to get started.
             </div>
           )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? 'Edit User' : 'Add New User'}>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-neutral-700">Full Name</label>
              <input type="text" name="name" id="name" value={userFormData.name} onChange={handleInputChange} required 
                     className="mt-1 block w-full px-2 py-1.5 border border-neutral-300 rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-xs" />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-neutral-700">Email Address</label>
              <input type="email" name="email" id="email" value={userFormData.email} onChange={handleInputChange} required 
                     className="mt-1 block w-full px-2 py-1.5 border border-neutral-300 rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-xs" />
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-xs font-medium text-neutral-700">Role</label>
            <select name="role" id="role" value={userFormData.role} onChange={handleInputChange} 
                    className="mt-1 block w-full px-2 py-1.5 border border-neutral-300 bg-white rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-xs">
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          {/* KYC Documents Upload */}
          <div className="bg-gradient-to-r from-blue-50 via-white to-blue-100 rounded-lg p-2 shadow-inner mt-2">
            <h3 className="text-xs font-semibold text-primary mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              KYC Documents
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Aadhar Upload</label>
                <label className="inline-flex items-center px-2 py-1.5 bg-gradient-to-r from-green-400 to-green-600 text-white rounded shadow cursor-pointer hover:from-green-500 hover:to-green-700 transition font-semibold text-xs gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Choose File</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                </label>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">PAN Upload</label>
                <label className="inline-flex items-center px-2 py-1.5 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded shadow cursor-pointer hover:from-blue-500 hover:to-blue-700 transition font-semibold text-xs gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Choose File</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                </label>
              </div>
            </div>
          </div>
          {/* Bank Details Section */}
          <div className="bg-gradient-to-r from-green-50 via-white to-green-100 rounded-lg p-2 shadow-inner mt-2">
            <h3 className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Bank Details
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Account Holder Name</label>
                <input type="text" name="accountHolder" placeholder="Account Holder Name"
                  className="border rounded px-2 py-1.5 w-full text-xs focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Account Number</label>
                <input type="text" name="accountNumber" placeholder="Account Number"
                  className="border rounded px-2 py-1.5 w-full text-xs focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">IFSC Code</label>
                <input type="text" name="ifsc" placeholder="IFSC Code"
                  className="border rounded px-2 py-1.5 w-full text-xs focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bank Name</label>
                <input type="text" name="bankName" placeholder="Bank Name"
                  className="border rounded px-2 py-1.5 w-full text-xs focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">D.O.B (for bank KYC)</label>
                <input type="date" name="bankDob"
                  className="border rounded px-2 py-1.5 w-full text-xs focus:border-primary transition" />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal} className="text-xs px-3 py-1.5">Cancel</Button>
            <Button type="submit" variant="primary" className="text-xs px-3 py-1.5">{editingUser ? 'Save Changes' : 'Add User'}</Button>
          </div>
        </form>
      </Modal>
      <style>{`
        .animate-fadein { animation: fadein 0.7s; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        .animate-listitem { animation: fadein 0.8s; }
      `}</style>
    </div>
  );
};

export default ManageUsersPage;
