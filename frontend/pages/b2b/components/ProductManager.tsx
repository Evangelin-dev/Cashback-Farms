import { Card, Form, Input, InputNumber, Modal, Space, Table, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import Button from "../../../components/common/Button";

interface Product {
  key: React.Key;
  name: string;
  price: number;
  quantity: number;
  category: string;
  moq: number;
  description: string;
  vendor: string;
  status: "Active" | "Inactive";
}

const initialProducts: Product[] = [
  { key: 1, name: "UltraTech Cement", price: 380, quantity: 100, category: "Cement", moq: 50, description: "Premium cement for construction", vendor: "Acme Supplies", status: "Active" },
  { key: 2, name: "Red Clay Bricks", price: 8, quantity: 1000, category: "Bricks", moq: 500, description: "High quality red bricks", vendor: "BrickMart", status: "Active" },
];

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const handleFormFinish = (values: any) => {
    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.key === editingProduct.key
            ? { ...product, ...values }
            : product
        )
      );
    } else {
      setProducts([
        ...products,
        { key: Date.now(), ...values, status: "Active" },
      ]);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };
  
  const showAddModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };
  
  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleDelete = (key: React.Key) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      centered: true,
      onOk: () => {
        setProducts(products.filter(p => p.key !== key));
      },
    });
  };

  const handleToggleStatus = (key: React.Key) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.key === key
          ? { ...product, status: product.status === "Active" ? "Inactive" : "Active" }
          : product
      )
    );
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      render: (text: string) => (
        <span className="font-semibold text-primary text-xs">{text}</span>
      ),
    },
    {
      title: "Cat.",
      dataIndex: "category",
      render: (cat: string) => (
        <Tag color="blue" className="font-medium text-xs px-2 py-0.5">{cat}</Tag>
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      render: (qty: number) => (
        <span className="text-green-700 font-semibold text-xs">{qty}</span>
      ),
    },
    {
      title: "MOQ",
      dataIndex: "moq",
      render: (moq: number) => (
        <span className="text-yellow-700 font-semibold text-xs">{moq}</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (v: number) => (
        <span className="font-bold text-green-600 text-xs">₹{v.toLocaleString("en-IN")}</span>
      ),
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      render: (vendor: string) => (
        <span className="text-blue-700 font-medium text-xs">{vendor}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (desc: string) => (
        <span className="text-gray-600 text-xs truncate" title={desc}>{desc}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold shadow-sm ${
            status === "Active"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: 'action',
      render: (_: any, record: Product) => (
        <Space size="small">
          <Tooltip title={record.status === "Inactive" ? "Activate" : "Deactivate"}>
            <Button
              variant={record.status === "Inactive" ? "primary" : "outline"}
              size="sm"
              className={`transition-colors duration-150 rounded-full px-2 py-0.5 text-xs ${
                record.status === "Inactive"
                  ? "bg-primary text-white border-primary hover:bg-primary-dark"
                  : "border-primary text-primary hover:bg-primary hover:text-white"
              }`}
              onClick={() => handleToggleStatus(record.key)}
            >
              {record.status === "Inactive" ? "Active" : "Inactive"}
            </Button>
          </Tooltip>
          <Tooltip title="Edit Product">
            <Button
              variant="outline"
              size="sm"
              className="transition-colors duration-150 rounded-full !p-1.5 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              onClick={() => showEditModal(record)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip title="Delete Product">
            <Button
              variant="outline"
              size="sm"
              className="transition-colors duration-150 rounded-full !p-1.5 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => handleDelete(record.key)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-3">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <rect x="3" y="7" width="18" height="13" rx="3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
          </svg>
          <span className="text-x  font-bold text-primary-light ">Manage Products</span>
        </div>
      }
      extra={
        <Button variant="primary" onClick={showAddModal}>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </span>
        </Button>
      }
      style={{
        marginBottom: 32,
        borderRadius: 18,
        boxShadow: "0 2px 16px #60a5fa22",
        background: "linear-gradient(135deg, #f0f9ff 0%, #f9fafb 100%)",
        border: "none",
      }}
      bodyStyle={{ background: "transparent", padding: 32 }}
    >
      <Table
        dataSource={products}
        columns={columns}
        pagination={false}
        rowClassName="hover:bg-blue-50 transition"
        bordered={false}
        size="small"
        className="rounded-xl shadow"
        rowKey="key"
      />
      <Modal
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {editingProduct ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              )}
            </svg>
            <span className="font-semibold text-primary-light">{editingProduct ? "Edit Product" : "Add New Product"}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancelModal}
        footer={[
          <div key="footer-actions" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button
              key="cancel"
              variant="outline"
              className="transition-colors duration-150 hover:bg-red-600 hover:text-white"
              onClick={handleCancelModal}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              variant="primary"
              className="transition-colors duration-150 hover:bg-green-600 hover:text-white"
              onClick={() => form.submit()}
            >
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        ]}
        centered
        style={{ borderRadius: 16 }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item name="name" label={<span className="font-semibold text-primary">Product Name</span>} rules={[{ required: true }]} className="mb-2">
              <Input
                placeholder="Enter product name"
                prefix={
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="4" />
                  </svg>
                }
                className="rounded-lg py-2 px-3 border border-blue-200 focus:border-primary transition bg-blue-50"
                style={{ fontSize: 15 }}
              />
            </Form.Item>
            <Form.Item name="category" label={<span className="font-semibold text-primary">Category</span>} rules={[{ required: true }]} className="mb-2">
              <Input
                placeholder="e.g. Cement, Bricks"
                prefix={
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="4" />
                  </svg>
                }
                className="rounded-lg py-2 px-3 border border-blue-200 focus:border-primary transition bg-blue-50"
                style={{ fontSize: 15 }}
              />
            </Form.Item>
            <Form.Item name="quantity" label={<span className="font-semibold text-green-700">Quantity</span>} rules={[{ required: true }]} className="mb-2">
              <InputNumber
                min={1}
                style={{ width: "100%", fontSize: 15, borderRadius: 8, borderColor: "#bae6fd", background: "#f0fdf4" }}
                placeholder="Enter quantity"
                className="py-2 px-3"
                addonAfter={<span className="text-green-700 font-bold">pcs</span>}
              />
            </Form.Item>
            <Form.Item name="moq" label={<span className="font-semibold text-yellow-700">MOQ</span>} rules={[{ required: true }]} className="mb-2">
              <InputNumber
                min={1}
                style={{ width: "100%", fontSize: 15, borderRadius: 8, borderColor: "#fde68a", background: "#fef9c3" }}
                placeholder="Minimum Order Quantity"
                className="py-2 px-3"
                addonAfter={<span className="text-yellow-700 font-bold">pcs</span>}
              />
            </Form.Item>
            <Form.Item name="price" label={<span className="font-semibold text-green-600">Price</span>} rules={[{ required: true }]} className="mb-2">
              <InputNumber
                min={1}
                style={{ width: "100%", fontSize: 15, borderRadius: 8, borderColor: "#bbf7d0", background: "#f0fdf4" }}
                placeholder="Enter price"
                className="py-2 px-3"
                addonBefore={<span className="text-green-600 font-bold">₹</span>}
              />
            </Form.Item>
            <Form.Item name="vendor" label={<span className="font-semibold text-blue-700">Vendor</span>} rules={[{ required: true }]} className="mb-2">
              <Input
                placeholder="Vendor name"
                prefix={
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                }
                className="rounded-lg py-2 px-3 border border-blue-200 focus:border-primary transition bg-blue-50"
                style={{ fontSize: 15 }}
              />
            </Form.Item>
          </div>
          <Form.Item name="description" label={<span className="font-semibold text-gray-700">Description</span>} rules={[{ required: true }]} className="mb-2">
            <Input.TextArea
              rows={4}
              placeholder="Short description"
              maxLength={120}
              className="rounded-lg border border-blue-200 focus:border-primary transition bg-blue-50"
              style={{ fontSize: 15, minHeight: 80 }}
              showCount
            />
          </Form.Item>
        </Form>
        <style>{`
          .ant-modal-content {
            padding-bottom: 0 !important;
            min-height: 480px !important;
            background: linear-gradient(135deg, #f0f9ff 0%, #f9fafb 100%);
          }
          .ant-form-item {
            margin-bottom: 16px;
          }
          .ant-modal-body {
            min-height: 420px !important;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .ant-input-affix-wrapper, .ant-input-number, .ant-input, .ant-input-number-input {
            background: transparent !important;
          }
          @media (max-width: 600px) {
            .grid-cols-2 {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </Modal>
      <style>{`
        .ant-card-head {
          background: linear-gradient(90deg,#f0f9ff 60%,#bae6fd 100%);
          border-radius: 18px 18px 0 0;
        }
        .ant-table-thead > tr > th {
          background: #f0f9ff;
          font-weight: 700;
          font-size: 13px;
        }
        .ant-table-tbody > tr > td {
          font-size: 13px;
        }
      `}</style>
    </Card>
  );
};

export default ProductManager;