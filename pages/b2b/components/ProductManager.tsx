import { Card, Form, Input, InputNumber, Modal, Table } from "antd";
import React, { useState } from "react";
import Button from "../../../components/common/Button";

const initialPlots = [
  { key: 1, name: "Green Acres", price: 1500000, area: 2400, location: "Sector 21, Noida" },
  { key: 2, name: "Sunrise Meadows", price: 1200000, area: 1800, location: "Yamuna Expressway" },
];

const ProductManager: React.FC = () => {
  const [plots, setPlots] = useState(
    initialPlots.map((p) => ({ ...p, status: "Active" }))
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = (values: any) => {
    setPlots([
      ...plots,
      { key: Date.now(), ...values, status: "Active" }
    ]);
    setModalVisible(false);
    form.resetFields();
  };

  // Move columns inside the component to access handleToggleStatus
  const handleToggleStatus = (key: number) => {
    setPlots((prev) =>
      prev.map((plot) =>
        plot.key === key
          ? { ...plot, status: plot.status === "Active" ? "Inactive" : "Active" }
          : plot
      )
    );
  };

  const columns = [
    { title: "Plot Name", dataIndex: "name" },
    { title: "Location", dataIndex: "location" },
    { title: "Area (sqft)", dataIndex: "area" },
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
      title="Manage Plots"
      extra={
        <Button variant="primary" onClick={() => setModalVisible(true)}>
          Add Plot
        </Button>
      }
      style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb" }}
      bodyStyle={{ background: "#fff" }}
    >
      <Table dataSource={plots} columns={columns} pagination={false} />
      <Modal
        title="Add Plot"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <div
            key="footer-actions"
            style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
          >
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
              Add Plot
            </Button>
          </div>
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="name" label="Plot Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="area" label="Area (sqft)" rules={[{ required: true }]}>
            <InputNumber min={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={10000} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductManager;