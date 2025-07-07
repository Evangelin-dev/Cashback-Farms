<<<<<<< HEAD
import { Card, Form, Input, InputNumber, Modal, Table, Tag } from "antd";
=======
import { Card, Form, Input, InputNumber, Modal, Select, Table, Tag } from "antd";
>>>>>>> a7649c49c7fc9ceee2f7bc49f42e93d295b88226
import React, { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import apiClient from "@/src/utils/api/apiClient";

type Project = {
  key: number;
  projectName: string;
  location: string;
  projectType: string;
  price: number;
  unit: string; // <-- Add this line
  status: string;
  description: string;
  images: File[];
};

const RealMySqft: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("access_token");
        const res = await apiClient.get("/sqlft-projects/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // Map API response to table data
        const mappedProjects = (res.data.data || res.data || []).map((project: any) => ({
          key: project.id,
          projectName: project.project_name,
          location: project.location,
          projectType: project.plot_type,
          price: Number(project.price) || 0,
          unit: project.unit || "", // <-- Add this line
          status: project.is_active ? "Active" : "Inactive",
          description: project.description || "",
          images: [], // Map project images if available
        }));
        setProjects(mappedProjects);
      } catch (err) {
        setProjects([]);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

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

  const handleAdd = async (values: any) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const payload = {
        project_name: values.projectName,
        location: values.location,
        plot_type: values.projectType,
        price: String(values.price),
        unit: values.unit, // <-- Add this line
        description,
        // Add other fields if needed
      };

      await apiClient.post("/sqlft-projects/", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Refresh the projects list after adding
      const res = await apiClient.get("/sqlft-projects/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const mappedProjects = (res.data.data || res.data || []).map((project: any) => ({
        key: project.id,
        projectName: project.project_name,
        location: project.location,
        plot_type: project.project_type,
        price: Number(project.price) || 0,
        status: project.is_active ? "Active" : "Inactive",
        description: project.description || "",
        images: [],
      }));
      setProjects(mappedProjects);

      setModalVisible(false);
      form.resetFields();
      setDescription("");
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      alert("Failed to add project.");
    }
  };

  const handleToggleStatus = (key: number) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.key === key
          ? { ...project, status: project.status === "Active" ? "Inactive" : "Active" }
          : project
      )
    );
  };

  const columns = [
    { title: "Project Name", dataIndex: "projectName" },
    { title: "Location", dataIndex: "location" },
    { title: "Type", dataIndex: "projectType" },
    { title: "Price", dataIndex: "price", render: (v: number) => `₹${v.toLocaleString("en-IN")}` },
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
                alt={`Project Img ${idx + 1}`}
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
          My Sqft Projects
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
          + Add Project
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
        dataSource={projects}
        columns={columns}
        pagination={false}
        rowKey="key"
        style={{ borderRadius: 12, overflow: "hidden" }}
        rowClassName={() => "custom-table-row"}
        loading={loading}
      />
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: 20, color: "#059669" }}>
            Add Project
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
              Add Project
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
            name="projectName"
            label={
              <span style={{ fontWeight: 600, color: "#065f46" }}>
                Project Name
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
              placeholder="e.g. Green Acres"
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
            name="projectType"
            label={
              <span style={{ fontWeight: 600, color: "#065f46" }}>
                Project Type
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
              placeholder="e.g. Plot, Villa, Skyrise"
            />
          </Form.Item>
          <Form.Item
            name="price"
            label={
              <span style={{ fontWeight: 600, color: "#065f46" }}>
                price
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
            name="unit"
            label={
              <span style={{ fontWeight: 600, color: "#065f46" }}>
                Unit
              </span>
            }
<<<<<<< HEAD
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
              placeholder="e.g. per sqft, per acre"
            />
=======
            rules={[{ required: true, message: 'Please select a measurement unit!' }]}
            style={{ marginBottom: 16 }}
          >
            <Select
              placeholder="Select a unit for the price"
              style={{ width: '100%' }}
              // Optional: you can add this styling to the dropdown itself to match your form
              dropdownStyle={{
                borderRadius: 8,
                background: "#dcfce7",
                border: "1.5px solid #bbf7d0",
              }}
            >
              {/* The `value` prop MUST be 'sqft' or 'sqyd' to match your backend */}
              <Select.Option value="sqft">Per Square Feet</Select.Option>
              <Select.Option value="sqyd">Per Square Yards</Select.Option>
            </Select>
>>>>>>> a7649c49c7fc9ceee2f7bc49f42e93d295b88226
          </Form.Item>
          {/* Description Box */}
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
              placeholder="Describe the project, highlights, features, etc."
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
          {/* Image Upload */}
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
                    alt={`Project Preview ${idx + 1}`}
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
        `}
      </style>
    </Card>
  );
};

export default RealMySqft;
