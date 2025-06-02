
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { MOCK_USERS, IconPlus, IconPencil, IconTrash } from '../../constants';
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Manage Users</h1>
        <Button onClick={openModalForNew} leftIcon={<IconPlus className="w-5 h-5"/>}>Add New User</Button>
      </div>
      
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {['Name', 'Email', 'Role', 'Created At', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{user.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openModalForEdit(user)} leftIcon={<IconPencil className="w-4 h-4"/>}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteUser(user.id)} leftIcon={<IconTrash className="w-4 h-4"/>}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {users.length === 0 && <p className="text-center py-4 text-neutral-500">No users found.</p>}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? 'Edit User' : 'Add New User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
            <input type="text" name="name" id="name" value={userFormData.name} onChange={handleInputChange} required 
                   className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
            <input type="email" name="email" id="email" value={userFormData.email} onChange={handleInputChange} required 
                   className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-neutral-700">Role</label>
            <select name="role" id="role" value={userFormData.role} onChange={handleInputChange} 
                    className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">{editingUser ? 'Save Changes' : 'Add User'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsersPage;
