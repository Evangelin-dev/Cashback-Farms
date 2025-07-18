import React, { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Modal, Space, Table, Tag, Tooltip, message } from "antd";
import Button from '../../components/Button';
import apiClient from '../../src/utils/api/apiClient';
import { IconPencil, IconPlus, IconTrash } from '@/constants';

// Define the shape of the Material object based on the API
interface Material {
  id: number;
  key: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  moq: number;
  vendor: string;
  status: "Active" | "Inactive";
}

const ManageMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [form] = Form.useForm();

 
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/materials/');
      const transformedData: Material[] = response.map((m: any) => ({
        id: m.id,
        key: m.id,
        name: m.name,
        description: m.description,
        price: parseFloat(m.price),
        quantity: m.stock_quantity,
        category: m.category,
        moq: m.moq,
        vendor: m.vendor_username || 'N/A',
        status: m.status === 'Active' ? 'Active' : 'Inactive',
      }));
    
      setMaterials(transformedData.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Failed to fetch materials:", error);
      message.error("Failed to load your materials. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);


  const handleFormFinish = async (values: any) => {
    setSubmitting(true);
    const payload = {
      name: values.name,
      description: values.description,
      price: values.price,
      stock_quantity: values.quantity,
      category: "material",
      moq: values.moq,
    };

    try {
      if (editingMaterial) {
        await apiClient.put(`/materials/${editingMaterial.id}/`, payload);
        message.success("Material updated successfully!");
      } else {
        await apiClient.post('/materials/', payload);
        message.success("Material added successfully!");
      }
      setIsModalOpen(false);
      await fetchMaterials();
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage = typeof errorData === 'object' && errorData !== null
        ? Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ')
        : "An error occurred. Please try again.";
      message.error(errorMessage || "An error occurred.", 5);
    } finally {
      setSubmitting(false);
    }
  };


  const handleToggleStatus = async (materialToToggle: Material) => {
    const originalStatus = materialToToggle.status;
    const newStatus = originalStatus === 'Active' ? 'Inactive' : 'Active';
  
    setMaterials(materials.map(m => m.id === materialToToggle.id ? { ...m, status: newStatus } : m));
    try {
      await apiClient.patch(`/materials/${materialToToggle.id}/toggle-status/`);
      message.success(`Material status changed to ${newStatus}.`);
    } catch (error) {
      message.error("Failed to update status. Reverting change.");
    
      setMaterials(materials.map(m => m.id === materialToToggle.id ? { ...m, status: originalStatus } : m));
    }
  };


  const handleConfirmDelete = async () => {
    if (!materialToDelete) return;
    setSubmitting(true);
    try {
      await apiClient.delete(`/materials/${materialToDelete.id}/`);
      message.success("Material deleted successfully!");
      setIsDeleteModalVisible(false);
      setMaterials(materials.filter(m => m.id !== materialToDelete.id));
    } catch (error) {
      message.error("Failed to delete material.");
    } finally {
      setSubmitting(false);
      setMaterialToDelete(null);
    }
  };

 
  const showAddModal = () => { setEditingMaterial(null); form.resetFields(); setIsModalOpen(true); };
  const showEditModal = (record: Material) => { setEditingMaterial(record); form.setFieldsValue(record); setIsModalOpen(true); };
  const handleCancelModal = () => setIsModalOpen(false);
  const showDeleteModal = (record: Material) => { setMaterialToDelete(record); setIsDeleteModalVisible(true); };

  const columns = [
    { title: "Material", dataIndex: "name", key: "name", render: (text: string) => <span className="font-semibold text-primary text-xs">{text}</span> },
    { title: "Qty", dataIndex: "quantity", key: "quantity", render: (qty: number) => <span className="text-green-700 font-semibold text-xs">{qty}</span> },
    { title: "Price", dataIndex: "price", key: "price", render: (v: number) => <span className="font-bold text-green-600 text-xs">₹{v.toLocaleString("en-IN")}</span> },
    { title: "Vendor", dataIndex: "vendor", key: "vendor", responsive: ['md'], render: (vendor: string) => <span className="text-blue-700 font-medium text-xs">{vendor}</span> },
    { title: "Status", dataIndex: "status", key: "status", render: (status: string) => <Tag className={`w-16 text-center m-0 px-2 py-0.5 rounded text-xs font-semibold shadow-sm ${status === "Active" ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>{status}</Tag> },
    {
      title: "Action", key: 'action', fixed: 'right' as const, width: 120,
      render: (_: any, record: Material) => (
        <Space size="small">
          <Tooltip title={record.status === "Inactive" ? "Activate" : "Deactivate"}><Button variant={record.status === "Inactive" ? "primary" : "outline"} size="sm" className="!px-2 !py-0.5" onClick={() => handleToggleStatus(record)}>{record.status === "Inactive" ? "Active" : "Inactive"}</Button></Tooltip>
          <Tooltip title="Edit Material"><Button variant="outline" size="sm" className="!p-1.5" onClick={() => showEditModal(record)}><IconPencil className="h-4 w-4" /></Button></Tooltip>
          <Tooltip title="Delete Material"><Button variant="danger" size="sm" className="!p-1.5" onClick={() => showDeleteModal(record)}><IconTrash className="h-4 w-4" /></Button></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<div className="flex items-center gap-3"><span className="text-xl font-bold text-primary-light">Manage Construction Materials</span></div>}
        extra={<Button variant="primary" onClick={showAddModal} leftIcon={<IconPlus className="h-4 w-4" />}>Add Material</Button>}
        style={{ marginBottom: 32, borderRadius: 18, boxShadow: "0 2px 16px #60a5fa22", background: "linear-gradient(135deg, #f0f9ff 0%, #f9fafb 100%)", border: "none" }}
        styles={{ body: { background: "transparent", padding: "16px" } }}
      >
        <Table dataSource={materials} columns={columns} loading={loading} pagination={false} rowClassName="hover:bg-blue-50 transition" bordered={false} size="small" className="rounded-xl shadow" rowKey="key" />
      </Card>

      <Modal
        title={<span className="font-semibold text-primary-light">{editingMaterial ? "Edit Material" : "Add New Material"}</span>}
        open={isModalOpen} onCancel={handleCancelModal} footer={null} centered
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <Form.Item name="name" label="Material Name" rules={[{ required: true }]}><Input placeholder="e.g. TMT Steel Bars" /></Form.Item>
            <Form.Item name="quantity" label="Stock Quantity" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 500" /></Form.Item>
            <Form.Item name="moq" label="MOQ" dependencies={['quantity']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('quantity') >= value) return Promise.resolve(); return Promise.reject(new Error('MOQ cannot be greater than quantity!')); }, })]}>
              <InputNumber min={1} style={{ width: "100%" }} placeholder="Minimum Order Quantity" />
            </Form.Item>
            <Form.Item name="price" label="Price (per unit)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 75000" addonBefore="₹" /></Form.Item>
          </div>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input.TextArea rows={4} placeholder="Description of the material..." maxLength={120} showCount /></Form.Item>
          <div className="flex justify-end gap-3 mt-4">
            <Button key="cancel" variant="outline" onClick={handleCancelModal} disabled={submitting}>Cancel</Button>
            <Button key="submit" variant="primary" htmlType="submit" loading={submitting || undefined}>{editingMaterial ? "Save Changes" : "Add Material"}</Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Confirm Deletion" open={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)}
        footer={null} width={400} centered
      >
        <p className="py-4">Are you sure you want to delete <strong className="text-primary">{materialToDelete?.name}</strong>? This action is permanent.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleteModalVisible(false)} disabled={submitting}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmDelete} loading={submitting || undefined}>Delete Material</Button>
        </div>
      </Modal>
    </>
  );
};

export default ManageMaterialsPage;