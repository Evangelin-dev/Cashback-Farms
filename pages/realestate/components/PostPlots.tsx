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
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setImagePreviews([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAdd = (values: any) => {
    setPlots([
      ...plots,
      { key: Date.now(), ...values, status: "Active", description, images },
    ]);
    setModalVisible(false);
    form.resetFields();
    setDescription("");
    setImages([]);
    setImagePreviews([]);
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
    {
      title: "Price",
      dataIndex: "price",
      render: (v: number) => `₹${v.toLocaleString("en-IN")}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, record: any) => (
        <Tag color={record.status === "Active" ? "green" : "red"}>
          {record.status}
        </Tag>
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
    {
      title: "Description",
      dataIndex: "description",
      render: (desc: string) => desc || "-",
    },
    {
      title: "Images",
      dataIndex: "images",
      render: (imgs: File[] | undefined) =>
        imgs && imgs.length > 0 ? (
          <div style={{ display: "flex", gap: 4 }}>
            {imgs.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`Plot Img ${idx + 1}`}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        ) : (
          "-"
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
      style={{
        marginBottom: 24,
        borderRadius: 8,
        boxShadow: "0 1px 4px #e5e7eb",
      }}
      bodyStyle={{ background: "#fff" }}
    >
      <Table
        dataSource={plots}
        columns={columns}
        pagination={false}
        rowKey="key"
      />
      <Modal
        title="Add Plot"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <div
            key="footer-actions"
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
            }}
          >
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
          </div>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="title"
            label="Plot Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="owner"
            label="Owner Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="area"
            label="Area (sqft)"
            rules={[{ required: true }]}
          >
            <InputNumber min={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true }]}
          >
            <InputNumber min={10000} style={{ width: "100%" }} />
          </Form.Item>
          {/* Simple Description Box */}
          <div style={{ marginBottom: 16 }}>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Description
            </label>
            <Input.TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the plot, highlights, features, etc."
              rows={4}
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#065f46",
                resize: "vertical",
              }}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </div>
          {/* More Creative Image Upload */}
          <div style={{ marginBottom: 16 }}>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              <svg
                className="w-6 h-6 inline-block mr-1"
                fill="none"
                stroke="#2563eb"
                strokeWidth={2}
                viewBox="0 0 24 24"
                style={{ verticalAlign: "middle" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span style={{ color: "#2563eb", fontWeight: 600, fontSize: 15 }}>
                Choose Image
              </span>
            </label>
            <div
              style={{
                border: "2px dashed #93c5fd",
                borderRadius: 12,
                background: "#f0f9ff",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "box-shadow 0.2s",
                boxShadow: "0 2px 8px #93c5fd33",
              }}
            >
              <label
                className="cursor-pointer flex flex-col items-center"
                style={{
                  color: "#2563eb",
                  fontWeight: 600,
                  fontSize: 15,
                  marginBottom: 8,
                  transition: "color 0.2s",
                }}
              >
                <svg
                  className="w-8 h-8 mb-1"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>
                  {images.length > 0 ? "Change Images" : "Click to select images"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {imagePreviews.map((src, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1.5px solid #93c5fd",
                      borderRadius: 8,
                      overflow: "hidden",
                      width: 64,
                      height: 64,
                      background: "#fff",
                      boxShadow: "0 1px 4px #93c5fd22",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "box-shadow 0.2s",
                    }}
                  >
                    <img
                      src={src}
                      alt={`Plot Preview ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                        transition: "transform 0.2s",
                      }}
                    />
                  </div>
                ))}
              </div>
              {images.length === 0 && (
                <span className="text-xs text-gray-400 mt-2">
                  No images selected
                </span>
              )}
            </div>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default PostPlots;
