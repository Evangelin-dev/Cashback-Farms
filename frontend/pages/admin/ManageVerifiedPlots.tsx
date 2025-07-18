import React, { useEffect, useState, useCallback } from 'react';
import { Card, Form, Input, InputNumber, Modal, Table, Tag, message, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import Button from '../../components/common/Button'; // Assuming your custom button
import apiClient from '@/src/utils/api/apiClient';
import { IconPencil, IconPlus, IconTrash } from '../../constants'; // Your custom icons

type Plot = {
  id: number;
  key: number;
  title: string;
  owner_name: string;
  location: string;
  total_area_sqft: string;
  price_per_sqft: string;
  description: string;
  is_verified: boolean;
  plot_file: string | null;
};

const normFile = (e: any) => {
  if (Array.isArray(e)) { return e; }
  return e?.fileList;
};

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const ManageVerifiedPlots: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();

  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const fetchLocationSuggestions = useCallback(
    debounce(async (text: string) => {
      if (!GEOAPIFY_API_KEY) { console.error("Geoapify API key is missing."); return; }
      if (!text || text.length < 3) { setLocationSuggestions([]); return; }
      
      setIsLocationLoading(true);
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setLocationSuggestions(data.features || []);
      } catch (error) {
        console.error("Error fetching Geoapify suggestions:", error);
        setLocationSuggestions([]);
      } finally {
        setIsLocationLoading(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    if (showSuggestions) {
      fetchLocationSuggestions(locationInput);
    }
  }, [locationInput, fetchLocationSuggestions, showSuggestions]);

  const fetchPlots = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const res = await apiClient.get("/plots/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const allPlots = (res || []).map((plot: any) => ({ ...plot, key: plot.id }));
      const verifiedPlots = allPlots.filter((plot: Plot) => plot.is_verified === true);
      setPlots(verifiedPlots.reverse());
    } catch (err) {
      console.error("Error fetching verified plots:", err);
      message.error("Failed to fetch verified plots.");
      setPlots([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlots();
  }, [fetchPlots]);

  const resetLocationState = () => {
    setLocationInput("");
    setLocationSuggestions([]);
    setShowSuggestions(true);
  };

  const openModalForNew = () => {
    setEditingPlot(null);
    form.resetFields();
    resetLocationState();
    setIsModalOpen(true);
  };

  const openModalForEdit = (plot: Plot) => {
    setEditingPlot(plot);
    const fileList: UploadFile[] = plot.plot_file ? [{ uid: '-1', name: 'image.png', status: 'done', url: plot.plot_file }] : [];
    form.setFieldsValue({
      ...plot,
      total_area_sqft: Number(plot.total_area_sqft),
      price_per_sqft: Number(plot.price_per_sqft),
      // plot_file: fileList,
    });
    setLocationInput(plot.location);
    setShowSuggestions(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlot(null);
    form.resetFields();
    resetLocationState();
  };

  const handleFormSubmit = async (values: any) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      message.error("Authentication error. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('owner_name', values.owner_name);
    formData.append('location', values.location);
    formData.append('description', values.description || '');
    formData.append('total_area_sqft', String(values.total_area_sqft));
    formData.append('price_per_sqft', String(values.price_per_sqft));
    formData.append('is_verified', 'true');

    // const fileList = values.plot_file as UploadFile[] | undefined;
    // if (fileList && fileList.length > 0 && fileList[0].originFileObj) {
    //   formData.append('plot_file', fileList[0].originFileObj);
    // } else if (!fileList || fileList.length === 0) {
    //   if (editingPlot) {
    //     formData.append('plot_file', '');
    //   }
    // }

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      if (editingPlot) {
        await apiClient.patch(`/plots/${editingPlot.id}/`, formData, config);
        message.success("Verified Plot updated successfully!");
      } else {
        await apiClient.post("/plots/", formData, config);
        message.success("Verified Plot added successfully!");
      }
      fetchPlots();
      closeModal();
    } catch (err: any) {
      console.error("Failed to save plot:", err.response?.data || err.message);
      message.error("Failed to save plot. Please check the details.");
    }
  };

  const handleDeletePlot = async (plotId: number) => {
    if (window.confirm('Are you sure you want to delete this plot?')) {
      try {
        const accessToken = localStorage.getItem("access_token");
        await apiClient.delete(`/plots/${plotId}/`, { headers: { Authorization: `Bearer ${accessToken}` } });
        message.success("Plot deleted successfully!");
        fetchPlots();
      } catch (err) {
        message.error("Failed to delete plot.");
      }
    }
  };
  
  const handleLocationBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const columns = [
    { title: "Image", dataIndex: "plot_file", key: "plot_file", render: (url: string | null) => url ? <img src={url} alt="Plot" className="w-16 h-16 object-cover rounded-md" /> : 'No Image' },
    { title: "Plot Title", dataIndex: "title", key: "title" },
    { title: "Owner", dataIndex: "owner_name", key: "owner_name" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Area (sqft)", dataIndex: "total_area_sqft", key: "total_area_sqft" },
    { title: "Price/sqft", dataIndex: "price_per_sqft", key: "price_per_sqft", render: (v: string) => `₹${Number(v).toLocaleString("en-IN")}` },
    { title: "Status", key: "status", render: () => (<Tag color="green">Verified</Tag>) },
    { 
      title: "Actions", key: "actions", 
      render: (_: any, record: Plot) => (
        <div className="flex flex-col items-start space-y-1">
          <Button size="sm" variant="outline" onClick={() => openModalForEdit(record)} leftIcon={<IconPencil className="w-4 h-4" />}>Edit</Button>
          <button className="text-red-600 ms-1 hover:text-red-800 text-sm hover:underline" onClick={() => handleDeletePlot(record.id)}>Delete</button>
        </div>
      )
    },
  ];

  return (
    <>
      <Card
        title={<span className="text-2xl font-semibold text-neutral-800">Manage Verified Plots</span>}
        extra={<Button onClick={openModalForNew} leftIcon={<IconPlus className="w-5 h-5"/>}>Add New Verified Plot</Button>}
        bordered={false}
        className="shadow-md"
      >
        <Table dataSource={plots} columns={columns} loading={isLoading} rowKey="key" pagination={{ pageSize: 10 }} />
      </Card>
      
      <Modal
        title={<span className="font-bold text-xl text-gray-700">{editingPlot ? 'Edit Verified Plot' : 'Add New Verified Plot'}</span>}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={{ description: '' }}>
          <Form.Item name="title" label="Plot Title" rules={[{ required: true }]}><Input placeholder="e.g. Premium Lakeview Plot" /></Form.Item>
          <Form.Item name="owner_name" label="Owner Name" rules={[{ required: true }]}><Input placeholder="e.g. Jane Smith" /></Form.Item>
          
          <div style={{ position: 'relative' }} onBlur={handleLocationBlur}>
            <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please select a location!' }]}>
              <Input
                placeholder="Start typing an address..."
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  form.setFieldsValue({ location: e.target.value });
                  if (!showSuggestions) setShowSuggestions(true);
                }}
                autoComplete="off"
              />
            </Form.Item>
            {isLocationLoading && <span style={{ position: 'absolute', right: 12, top: 40, color: '#065f46' }}>...</span>}
            {showSuggestions && locationInput.length >= 3 && locationSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {locationSuggestions.map((suggestion, index) => (
                  <li key={index} onMouseDown={() => {
                      const selectedAddress = suggestion.properties.formatted;
                      form.setFieldsValue({ location: selectedAddress });
                      setLocationInput(selectedAddress);
setShowSuggestions(false);
                    }}>
                    {suggestion.properties.formatted}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="total_area_sqft" label="Total Area (sqft)" rules={[{ required: true }]}><InputNumber min={1} className="w-full" placeholder="e.g. 3000" /></Form.Item>
            <Form.Item name="price_per_sqft" label="Price per sqft (₹)" rules={[{ required: true }]}><InputNumber min={1} className="w-full" placeholder="e.g. 2500" /></Form.Item>
          </div>
          <Form.Item name="description" label="Description"><Input.TextArea rows={4} placeholder="Description for the verified plot." /></Form.Item>
          <Form.Item name="plot_file" label="Plot Image/File" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload name="plot_file" listType="picture-card" beforeUpload={() => false} maxCount={1}>
              <div><IconPlus /><div style={{ marginTop: 8 }}>Upload</div></div>
            </Upload>
          </Form.Item>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">{editingPlot ? 'Save Changes' : 'Add Plot'}</Button>
          </div>
        </Form>
      </Modal>

      <style>{`.suggestions-list { position: absolute; background: white; border: 1px solid #d9d9d9; border-radius: 6px; list-style: none; margin: 0; padding: 4px; z-index: 1050; max-height: 200px; overflow-y: auto; box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05); } .suggestions-list li { padding: 5px 12px; cursor: pointer; } .suggestions-list li:hover { background-color: #f5f5f5; }`}</style>
    </>
  );
};

export default ManageVerifiedPlots;