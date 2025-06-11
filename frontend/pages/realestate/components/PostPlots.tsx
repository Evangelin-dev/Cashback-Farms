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
  const [dragOver, setDragOver] = useState(false);

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
      title: "Description",
      dataIndex: "description",
      render: (desc: string) => desc || "-",
    },
    {
      title: "Images",
      dataIndex: "images",
      render: (imgs: File[] | undefined) =>
        imgs && imgs.length > 0 ? (
          <div style={{ display: "flex", gap: 8 }}>
            {imgs.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`Plot Img ${idx + 1}`}
                style={{
                  width: 44,
                  height: 44,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1.5px solid #dbeafe",
                  boxShadow: "0 2px 8px #dbeafe55",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  background: "#f1f5f9",
                }}
                onMouseOver={e => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            ))}
          </div>
        ) : (
          "-"
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
      title={
        <span style={{ fontWeight: 700, fontSize: 22, color: "#1e293b" }}>
          Post Plots for Clients
        </span>
      }
      extra={
        <Button
          variant="primary"
          onClick={() => setModalVisible(true)}
          style={{
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            padding: "8px 20px",
            boxShadow: "0 2px 8px #2563eb22",
          }}
        >
          + Add Plot
        </Button>
      }
      style={{
        marginBottom: 32,
        borderRadius: 16,
        boxShadow: "0 4px 24px #e0e7ef",
        background: "linear-gradient(90deg, #f0f9ff 0%, #fff 100%)",
        border: "none",
      }}
      bodyStyle={{
        background: "#fff",
        borderRadius: 16,
        padding: 32,
      }}
    >
      <Table
        dataSource={plots}
        columns={columns}
        pagination={false}
        rowKey="key"
        style={{ borderRadius: 12, overflow: "hidden" }}
        rowClassName={() => "custom-table-row"}
      />
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: 20, color: "#059669" }}>
            Add Plot
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <div
            key="footer-actions"
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "flex-end",
              padding: "8px 0",
            }}
          >
            <Button
              key="cancel"
              variant="outline"
              onClick={() => setModalVisible(false)}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                padding: "7px 18px",
                color: "#059669",
                borderColor: "#059669",
                background: "#f0fdf4",
              }}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              variant="primary"
              onClick={() => form.submit()}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                padding: "7px 18px",
                boxShadow: "0 2px 8px #05966922",
                background: "#059669",
                color: "#fff",
                border: "none",
              }}
            >
              Add Plot
            </Button>
          </div>,
        ]}
        style={{
          borderRadius: 16,
          overflow: "hidden",
          top: 40,
        }}
        bodyStyle={{
          borderRadius: 16,
          background: "#f0fdf4",
          padding: 28,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          style={{ gap: 12, display: "flex", flexDirection: "column" }}
        >
          <Form.Item
            name="title"
            label={
              <span style={{ fontWeight: 600, color: "#065f46" }}>
                Plot Title
              </span>
            }
            rules={[{ required: true }]}
            style={{ marginBottom: 16 }}
          >
            <Input
              style={{
                borderRadius: 8,
                fontSize: 15,
                padding: "8px 12px",
                background: "#dcfce7",
                color: "#065f46",
                border: "1.5px solid #bbf7d0",
              }}
              placeholder="e.g. Sunshine Meadows"
            />
          </Form.Item>
          <Form.Item
            name="owner"
            label={
              <span style={{ fontWeight: 600, color: "#065f46" }}>
                Owner Name
              </span>
            }
            rules={[{ required: true }]}
            style={{ marginBottom: 16 }}
          >
            <Input
              style={{
                borderRadius: 8,
                fontSize: 15,
                padding: "8px 12px",
                background: "#dcfce7",
                color: "#065f46",
                border: "1.5px solid #bbf7d0",
              }}
              placeholder="e.g. Ravi Kumar"
            />
          </Form.Item>
          <Form.Item
            name="location"
            label={
              <span style={{ fontWeight: 600, color: "#065f46" }}>
                Location
              </span>
            }
            rules={[{ required: true }]}
            style={{ marginBottom: 16 }}
          >
            <Input
              style={{
                borderRadius: 8,
                fontSize: 15,
                padding: "8px 12px",
                background: "#dcfce7",
                color: "#065f46",
                border: "1.5px solid #bbf7d0",
              }}
              placeholder="e.g. Sector 45, Gurgaon"
            />
          </Form.Item>
          <Form.Item
            name="area"
            label={
              <span style={{ fontWeight: 600, color: "#065f46" }}>
                Area (sqft)
              </span>
            }
            rules={[{ required: true }]}
            style={{ marginBottom: 16 }}
          >
            <InputNumber
              min={100}
              style={{
                width: "100%",
                borderRadius: 8,
                fontSize: 15,
                padding: "8px 12px",
                background: "#dcfce7",
                color: "#065f46",
                border: "1.5px solid #bbf7d0",
              }}
              placeholder="e.g. 1800"
            />
          </Form.Item>
          <Form.Item
            name="price"
            label={
              <span style={{ fontWeight: 600, color: "#065f46" }}>
                Price
              </span>
            }
            rules={[{ required: true }]}
            style={{ marginBottom: 16 }}
          >
            <InputNumber
              min={10000}
              style={{
                width: "100%",
                borderRadius: 8,
                fontSize: 15,
                padding: "8px 12px",
                background: "#dcfce7",
                color: "#065f46",
                border: "1.5px solid #bbf7d0",
              }}
              placeholder="e.g. 1200000"
            />
          </Form.Item>
          {/* Simple Description Box */}
          <div style={{ marginBottom: 18 }}>
            <label
              className="block text-xs font-semibold text-gray-600 mb-2"
              style={{
                fontWeight: 600,
                color: "#059669",
                fontSize: 15,
                marginBottom: 6,
              }}
            >
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
                borderRadius: 8,
                background: "#dcfce7",
                border: "1.5px solid #bbf7d0",
                padding: "10px 12px",
              }}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </div>
          {/* More Creative Image Upload */}
          <div
            style={{
              marginBottom: 10,
              transition: "box-shadow 0.2s, border 0.2s",
              border: dragOver
                ? "2.5px solid #059669"
                : "2px dashed #bbf7d0",
              borderRadius: 14,
              background: dragOver ? "#bbf7d0" : "#f0fdf4",
              padding: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: dragOver
                ? "0 4px 16px #05966933"
                : "0 2px 8px #bbf7d033",
            }}
            onDragOver={e => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              const files = Array.from(e.dataTransfer.files).filter(f =>
                f.type.startsWith("image/")
              );
              setImages(files);
              setImagePreviews([]);
              files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  setImagePreviews((prev) => [
                    ...prev,
                    ev.target?.result as string,
                  ]);
                };
                reader.readAsDataURL(file);
              });
            }}
          >
            <label
              className="cursor-pointer flex flex-col items-center"
              style={{
                color: "#059669",
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 8,
                transition: "color 0.2s",
                cursor: "pointer",
              }}
            >
              <svg
                className="w-8 h-8 mb-1"
                fill="none"
                stroke="#059669"
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
                {images.length > 0 ? "Change Images" : "Click or Drag to select images"}
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
                gap: 12,
                flexWrap: "wrap",
                marginTop: 8,
                minHeight: 64,
              }}
            >
              {imagePreviews.map((src, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1.5px solid #bbf7d0",
                    borderRadius: 10,
                    overflow: "hidden",
                    width: 64,
                    height: 64,
                    background: "#fff",
                    boxShadow: "0 1px 4px #bbf7d022",
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
                      borderRadius: 10,
                      transition: "transform 0.2s",
                    }}
                  />
                </div>
              ))}
            </div>
            {images.length === 0 && (
              <span
                className="text-xs text-gray-400 mt-2"
                style={{
                  color: "#059669",
                  fontSize: 13,
                  marginTop: 8,
                  fontWeight: 500,
                }}
              >
                No images selected
              </span>
            )}
          </div>
        </Form>
      </Modal>
      {/* Custom Table Row Hover Style */}
      <style>
        {`
          .custom-table-row:hover td {
            background: #f0f9ff !important;
            transition: background 0.2s;
          }
          @keyframes popIn {
            0% { transform: scale(0.7); opacity: 0; }
            80% { transform: scale(1.08); opacity: 1; }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Card>
  );
};

export default PostPlots;
