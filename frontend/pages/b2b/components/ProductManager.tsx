import { Card, Form, Input, InputNumber, Modal, Space, Table, Tag, Tooltip, message } from "antd";
import React, { useState, useEffect } from "react";
import Button from "../../../components/common/Button";
import apiClient from "../../../src/utils/api/apiClient";

interface Product {
  id: number;
  key: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  moq: number;
  description: string;
  vendor: string;
  status: "Active" | "Inactive";
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/ecommerce/materials/my-products/');
      const transformedData: Product[] = response.map((p: any) => ({
        id: p.id,
        key: p.id,
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        quantity: p.stock_quantity,
        category: p.category,
        moq: p.moq,
        vendor: p.vendor_username,
        status: p.status,
      }));

      // FIX: Sort the products by ID in descending order to show the newest first.
      transformedData.sort((a, b) => b.id - a.id);

      setProducts(transformedData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      message.error("Failed to load your products. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
      if (editingProduct) {
        await apiClient.put(`/materials/${editingProduct.id}/`, payload);
        message.success("Product updated successfully!");
      } else {
        await apiClient.post('/materials/', payload);
        message.success("Product added successfully!");
      }
      setIsModalOpen(false);
      await fetchProducts();
    } catch (error: any) {
      console.error("Failed to save product:", error.response);
      const errorData = error.response?.data;
      let errorMessage = "An error occurred. Please try again.";
      if (typeof errorData === 'object' && errorData !== null) {
        const fieldErrors = Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        if (fieldErrors) errorMessage = fieldErrors;
      }
      message.error(errorMessage, 5);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (productToToggle: Product) => {
    const originalStatus = productToToggle.status;
    const newStatus = originalStatus === 'Active' ? 'Inactive' : 'Active';
    setProducts(products.map(p => p.id === productToToggle.id ? { ...p, status: newStatus } : p));
    try {
      await apiClient.patch(`/materials/${productToToggle.id}/toggle-status/`);
      message.success(`Product status changed to ${newStatus}.`);
    } catch (error) {
      message.error("Failed to update status. Reverting change.");
      setProducts(products.map(p => p.id === productToToggle.id ? { ...p, status: originalStatus } : p));
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setSubmitting(true);
    try {
      await apiClient.delete(`/materials/${productToDelete.id}/`);
      message.success("Product deleted successfully!");
      setIsDeleteModalVisible(false);
      setProducts(products.filter(p => p.id !== productToDelete.id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      message.error("Failed to delete product.");
    } finally {
      setSubmitting(false);
      setProductToDelete(null);
    }
  };

  const showAddModal = () => { setEditingProduct(null); form.resetFields(); setIsModalOpen(true); };
  const showEditModal = (record: Product) => { setEditingProduct(record); form.setFieldsValue(record); setIsModalOpen(true); };
  const handleCancelModal = () => { setEditingProduct(null); form.resetFields(); setIsModalOpen(false); };
  const showDeleteModal = (record: Product) => { setProductToDelete(record); setIsDeleteModalVisible(true); };

  const columns = [
    { title: "Product", dataIndex: "name", key: "name", render: (text: string) => <span className="font-semibold text-primary text-xs">{text}</span> },
    { title: "Qty", dataIndex: "quantity", key: "quantity", render: (qty: number) => <span className="text-green-700 font-semibold text-xs">{qty}</span> },
    { title: "Price", dataIndex: "price", key: "price", render: (v: number) => <span className="font-bold text-green-600 text-xs">₹{v.toLocaleString("en-IN")}</span> },
    { title: "Vendor", dataIndex: "vendor", key: "vendor", responsive: ['md'], render: (vendor: string) => <span className="text-blue-700 font-medium text-xs">{vendor}</span> },
    { title: "Status", dataIndex: "status", key: "status", render: (status: string) => <Tag className={`w-16 text-center m-0 px-2 py-0.5 rounded text-xs font-semibold shadow-sm ${status === "Active" ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>{status}</Tag> },
    {
      title: "Action", key: 'action', fixed: 'right' as const, width: 120,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Tooltip title={record.status === "Inactive" ? "Activate" : "Deactivate"}><Button variant={record.status === "Inactive" ? "primary" : "outline"} size="sm" className="!px-2 !py-0.5" onClick={() => handleToggleStatus(record)}>{record.status === "Inactive" ? "Active" : "Inactive"}</Button></Tooltip>
          <Tooltip title="Edit Product"><Button variant="outline" size="sm" className="!p-1.5" onClick={() => showEditModal(record)}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></Button></Tooltip>
          <Tooltip title="Delete Product"><Button variant="outline" size="sm" className="!p-1.5 !border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white" onClick={() => showDeleteModal(record)}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></Button></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<div className="flex items-center gap-3"><svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" /></svg><span className="text-x font-bold text-primary-light">Manage My Products</span></div>}
        extra={<Button variant="primary" onClick={showAddModal}><span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>Add Product</span></Button>}
        style={{ marginBottom: 32, borderRadius: 18, boxShadow: "0 2px 16px #60a5fa22", background: "linear-gradient(135deg, #f0f9ff 0%, #f9fafb 100%)", border: "none" }}
        styles={{ body: { background: "transparent", padding: "16px" } }}
      >
        <Table dataSource={products} columns={columns} loading={loading} pagination={false} rowClassName="hover:bg-blue-50 transition" bordered={false} size="small" className="rounded-xl shadow" rowKey="key" />
      </Card>

      <Modal
        title={<div className="flex items-center gap-2"><svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">{editingProduct ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />}</svg><span className="font-semibold text-primary-light">{editingProduct ? "Edit Product" : "Add New Product"}</span></div>}
        open={isModalOpen} onCancel={handleCancelModal} footer={null} centered
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}><Input placeholder="Enter product name" /></Form.Item>
            <Form.Item name="quantity" label="Stock Quantity" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} placeholder="Enter quantity" /></Form.Item>
            <Form.Item
              name="moq"
              label="MOQ"
              dependencies={['quantity']}
              rules={[
                { required: true, message: "Please input the MOQ!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('quantity') >= value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('MOQ cannot be greater than quantity!'));
                  },
                }),
              ]}
            >
              <InputNumber min={1} style={{ width: "100%" }} placeholder="Minimum Order Quantity" />
            </Form.Item>
            <Form.Item name="price" label="Price (per unit)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} placeholder="Enter price" addonBefore="₹" /></Form.Item>
          </div>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input.TextArea rows={4} placeholder="Short description" maxLength={120} showCount /></Form.Item>
          <div className="flex justify-end gap-3 mt-4">
            <Button key="cancel" variant="outline" onClick={handleCancelModal} disabled={submitting}>Cancel</Button>
            <Button key="submit" variant="primary" htmlType="submit" loading={submitting || undefined}>
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={null} width={400} centered
      >
        <p className="py-4">Are you sure you want to permanently delete the product: <strong className="text-primary">{productToDelete?.name}</strong>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleteModalVisible(false)} disabled={submitting}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmDelete} loading={submitting || undefined}>Delete Product</Button>
        </div>
      </Modal>
    </>
  );
};

export default ProductManager;