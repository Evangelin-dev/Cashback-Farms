import React, { useEffect, useState, useCallback } from 'react';
import { Card, Form, Input, Modal, Select, Table, Tag, message, Tooltip } from 'antd';
import Button from '../../components/Button';
import apiClient from '../../src/utils/api/apiClient';
import { IconPencil, IconPlus } from '../../constants';

// --- NEW: Import the phone number input library ---
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // This is also needed

// --- Type definition for a user from the API ---
interface User {
  id: number;
  key: number;
  username: string;
  email: string;
  mobile_number: string;
  first_name: string;
  last_name: string;
  user_type: 'client' | 'real_estate_agent' | 'admin' | 'b2b_vendor';
  is_active: boolean;
  date_joined: string;
  company_name: string | null;
  gst_number: string | null;
}

const USER_TYPES = ['client', 'real_estate_agent', 'b2b_vendor', 'admin'];

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  // --- NEW: State for the block/unblock confirmation modal ---
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await apiClient.get('/admin/users/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const mappedUsers = (response || []).map((user: any) => ({
        ...user,
        key: user.id,
      }));
      setUsers(mappedUsers.sort((a: User, b: User) => b.id - a.id));
    } catch (error) {
      console.error("Failed to fetch users:", error);
      message.error("Could not load user data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    const accessToken = localStorage.getItem("access_token");
    const payload = {
      ...values,
      gst_number: values.gst_number || "",
    };

    try {
      if (editingUser) {
        await apiClient.put(`/admin/users/${editingUser.id}/`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        message.success("User updated successfully!");
      } else {
        await apiClient.post('/admin/users/', { ...payload, is_active: true }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        message.success("User created successfully!");
      }
      closeModal();
      fetchUsers();
    } catch (error: any) {
      // --- NEW: Advanced error handling ---
      if (error.response && error.response.data && typeof error.response.data === 'object') {
        const errorData = error.response.data;
        const fieldErrors = Object.keys(errorData).map(key => ({
            name: key, // e.g., 'email' or 'mobile_number'
            errors: Array.isArray(errorData[key]) ? errorData[key] : [errorData[key]],
        }));
        form.setFields(fieldErrors);
        message.error("Please correct the errors below.");
      } else {
        message.error("An unknown error occurred. Please try again.", 5);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // --- NEW: Renamed to handle the final confirmation ---
  const handleConfirmToggleStatus = async () => {
    if (!userToToggle) return;
    const actionText = userToToggle.is_active ? 'block' : 'unblock';
    try {
        const accessToken = localStorage.getItem("access_token");
        await apiClient.post(`/admin/users/${userToToggle.id}/toggle-status/`, {}, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        message.success(`User has been ${actionText}ed.`);
        fetchUsers();
    } catch (error) {
        message.error(`Failed to ${actionText} user.`);
    } finally {
        setIsBlockModalVisible(false);
        setUserToToggle(null);
    }
  };

  const openModalForNew = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openModalForEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };
  
  // --- NEW: Function to show the confirmation modal ---
  const showBlockModal = (user: User) => {
    setUserToToggle(user);
    setIsBlockModalVisible(true);
  };

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username', render: (text: string) => <span className="font-semibold text-neutral-900">{text}</span> },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Mobile Number', dataIndex: 'mobile_number', key: 'mobile_number' },
    { title: 'User Role', dataIndex: 'user_type', key: 'user_type', render: (role: string) => <Tag color="blue">{role.replace(/_/g, ' ').toUpperCase()}</Tag> },
    { title: 'Status', dataIndex: 'is_active', key: 'is_active', render: (isActive: boolean) => <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Blocked'}</Tag> },
    { title: 'Date Joined', dataIndex: 'date_joined', key: 'date_joined', render: (date: string) => new Date(date).toLocaleDateString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <div className="space-x-2">
          <Tooltip title="Edit User">
            <Button size="sm" variant="outline" onClick={() => openModalForEdit(record)} leftIcon={<IconPencil className="w-4 h-4"/>} />
          </Tooltip>
          <Tooltip title={record.is_active ? 'Block User' : 'Unblock User'}>
            {/* --- CHANGED: This button now opens the modal --- */}
            <Button size="sm" variant={record.is_active ? 'danger' : 'primary'} onClick={() => showBlockModal(record)}>
              {record.is_active ? 'Block' : 'Unblock'}
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shadow">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
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
          <Table dataSource={users} columns={columns} loading={isLoading} rowKey="key" pagination={{ pageSize: 10 }} />
        </div>
      </Card>

      <Modal
        open={isModalOpen}
        title={<span className="font-semibold text-lg">{editingUser ? 'Edit User' : 'Add New User'}</span>}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item name="username" label="Username" rules={[{ required: true }]}><Input placeholder="unique_username" /></Form.Item>
            <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}><Input placeholder="user@example.com" /></Form.Item>
            <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}><Input placeholder="Enter first name" /></Form.Item>
            <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}><Input placeholder="Enter last name" /></Form.Item>
            
            {/* --- NEW: Phone Number Input --- */}
            <Form.Item
              name="mobile_number"
              label="Mobile Number"
              rules={[{ required: true, message: 'Mobile number is required!' }]}
            >
              <PhoneInput
                placeholder="Enter phone number"
                defaultCountry="IN"
                international
                withCountryCallingCode
                className="ant-phone-input"
              />
            </Form.Item>

            <Form.Item name="user_type" label="User Role" rules={[{ required: true }]}>
              <Select placeholder="Select a role">
                {USER_TYPES.map(role => <Select.Option key={role} value={role}>{role.replace('_', ' ').toUpperCase()}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="company_name" label="Company Name (Optional)"><Input placeholder="Test Co" /></Form.Item>
            <Form.Item name="gst_number" label="GST Number (Optional)"><Input placeholder="22AAAAA0000A1Z5" /></Form.Item>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>{editingUser ? 'Save Changes' : 'Add User'}</Button>
          </div>
        </Form>
      </Modal>

      {/* --- NEW: Block/Unblock Confirmation Modal --- */}
      <Modal
        title={`Confirm Action: ${userToToggle?.is_active ? 'Block' : 'Unblock'} User`}
        open={isBlockModalVisible}
        onCancel={() => setIsBlockModalVisible(false)}
        footer={null}
        width={400}
        centered
      >
        <p className="py-4">Are you sure you want to {userToToggle?.is_active ? 'block' : 'unblock'} the user: <strong className="text-primary">{userToToggle?.username}</strong>?</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsBlockModalVisible(false)}>Cancel</Button>
          <Button
            variant={userToToggle?.is_active ? 'danger' : 'primary'}
            onClick={handleConfirmToggleStatus}
          >
            {userToToggle?.is_active ? 'Confirm Block' : 'Confirm Unblock'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsersPage;