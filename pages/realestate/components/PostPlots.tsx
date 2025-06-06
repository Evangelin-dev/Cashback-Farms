import { Card, Form, Input, InputNumber, Modal, Table, Tag } from "antd";
import React, { useState } from "react";
import Button from "../../../components/common/Button";

const initialPlots = [
  {
    key: 1,
    title: "Sunshine Meadows",
    owner: "Ravi Kumar",
    location: "Sector 45, Gurgaon",
    area: 1800,
    price: 1200000,
    status: "Active",
  },
];

const PostPlots: React.FC = () => {
  const [plots, setPlots] = useState(initialPlots);
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
    { title: "Plot Title", dataIndex: "title" },
    { title: "Owner", dataIndex: "owner" },
    { title: "Location", dataIndex: "location" },
    { title: "Area (sqft)", dataIndex: "area" },
    { title: "Price", dataIndex: "price", render: (v: number) => `₹${v.toLocaleString("en-IN")}` },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, record: any) => (
        <Tag color={record.status === "Active" ? "green" : "red"}>{record.status}</Tag>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Button
          variant={record.status === "Inactive" ? "primary" : "outline"}
          size="sm"
          onClick={() => handleToggleStatus(record.key)}
        >
          Set {record.status === "Inactive" ? "Active" : "Inactive"}
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="Post Plots for Clients"
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
          <div key="footer-actions" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button
              key="cancel"
              variant="outline"
              onClick={() => setModalVisible(false)}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              variant="primary"
              onClick={() => form.submit()}
            >
              Add Plot
            </Button>
          </div>
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="title" label="Plot Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="owner" label="Owner Name" rules={[{ required: true }]}>
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

export default PostPlots;
