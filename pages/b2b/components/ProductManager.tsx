import { Card, Form, Input, InputNumber, Modal, Table } from "antd";
import React, { useState } from "react";
import Button from "../../../components/common/Button";

const initialProducts = [
  { key: 1, name: "UltraTech Cement", price: 380, quantity: 100, category: "Cement" },
  { key: 2, name: "Red Clay Bricks", price: 8, quantity: 1000, category: "Bricks" },
];

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState(
    initialProducts.map((p) => ({ ...p, status: "Active" }))
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = (values: any) => {
    setProducts([
      ...products,
      { key: Date.now(), ...values, status: "Active" }
    ]);
    setModalVisible(false);
    form.resetFields();
  };

  const handleToggleStatus = (key: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.key === key
          ? { ...product, status: product.status === "Active" ? "Inactive" : "Active" }
          : product
      )
    );
  };

  const columns = [
    { title: "Product Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Price", dataIndex: "price", render: (v: number) => `₹${v.toLocaleString("en-IN")}` },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, record: any) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            record.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {record.status || "Active"}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: any, idx: number) => (
        <Button
          variant={record.status === "Inactive" ? "primary" : "outline"}
          size="sm"
          className={`transition-colors duration-150 ${
            record.status === "Inactive"
              ? "bg-primary text-white border-primary hover:bg-primary-dark"
              : "border-primary text-primary hover:bg-primary hover:text-white"
          }`}
          onClick={() => handleToggleStatus(record.key)}
        >
          Set {record.status === "Inactive" ? "Active" : "Inactive"}
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="Manage Products"
      extra={
        <Button variant="primary" onClick={() => setModalVisible(true)}>
          Add Product
        </Button>
      }
      style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb" }}
      bodyStyle={{ background: "#fff" }}
    >
      <Table dataSource={products} columns={columns} pagination={false} />
      <Modal
        title="Add Product"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <div key="footer-actions" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button
              key="cancel"
              variant="outline"
              className="transition-colors duration-150 hover:bg-red-600 hover:text-white"
              onClick={() => setModalVisible(false)}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              variant="primary"
              className="transition-colors duration-150 hover:bg-red-600 hover:text-white"
              onClick={() => form.submit()}
            >
              Add Product
            </Button>
          </div>
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductManager;