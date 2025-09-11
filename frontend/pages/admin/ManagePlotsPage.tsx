import apiClient from '@/src/utils/api/apiClient';
import { PlusOneOutlined } from '@mui/icons-material';
import { Card, Form, Input, InputNumber, message, Modal, Select, Table, Tag, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import { IconPlus } from '../../constants';

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
  if (Array.isArray(e)) {
    return e;
  }
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

const ManagePlotsPage: React.FC = () => {
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
      const mappedPlots = (res || []).map((plot: any) => ({ ...plot, key: plot.id }));
      setPlots(mappedPlots.reverse());
    } catch (err) {
      console.error("Error fetching plots:", err);
      message.error("Failed to fetch plots.");
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

  const getCurrentUserName = () => {
    return (
      localStorage.getItem('user_name') ||
      localStorage.getItem('name') ||
      localStorage.getItem('username') ||
      ''
    );
  };

  const openModalForNew = () => {
    setEditingPlot(null);
    form.resetFields();
    resetLocationState();
  // prefill owner name from localStorage if available
  const ownerPrefill = getCurrentUserName();
  if (ownerPrefill) form.setFieldsValue({ owner_name: ownerPrefill });
  setIsModalOpen(true);
  };

  const openModalForEdit = (plot: Plot) => {
    setEditingPlot(plot);
    const fileList: UploadFile[] = [];
    try {
      if (Array.isArray((plot as any).plot_file)) {
        ((plot as any).plot_file as string[]).forEach((u: string, i: number) => fileList.push({ uid: `-p-${i}`, name: `image-${i}.jpg`, status: 'done', url: u }));
      } else if (plot.plot_file) {
        fileList.push({ uid: '-1', name: 'image.png', status: 'done', url: plot.plot_file });
      }
    } catch (e) {
      // ignore
    }

    form.setFieldsValue({
      ...plot,
      total_area_sqft: Number(plot.total_area_sqft),
      price_per_sqft: Number(plot.price_per_sqft),
      plot_file: fileList,
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
  // new fields to match PostPlots UI
  formData.append('area_unit', values.area_unit || 'sqft');
  formData.append('price_unit', values.price_unit || 'sqft');
  formData.append('plot_type', values.plot_type || 'Residential');
  formData.append('survey_number', values.survey_number || '');
  formData.append('google_maps_link', values.google_maps_link || '');
  formData.append('facing', values.facing || '');
  formData.append('near_by', values.near_by || '');

    // Handle file uploads
  const fileList = values.plot_file as UploadFile[] | undefined;
    if (fileList && fileList.length > 0) {
      // append all selected files that are newly added (originFileObj exists)
      for (const f of fileList) {
        if ((f as any).originFileObj) {
          formData.append('plot_file', (f as any).originFileObj);
        }
      }
    } else if (!fileList || fileList.length === 0) {
      if(editingPlot) { // Only send empty if it's an edit, to clear the image
        formData.append('plot_file', '');
      }
    }

    const config = {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      },
    };

    try {
      if (editingPlot) {
        await apiClient.patch(`/plots/${editingPlot.id}/`, formData, config);
        message.success("Plot updated successfully!");
      } else {
        await apiClient.post("/plots/", formData, config);
        message.success("Plot added successfully!");
      }
      fetchPlots();
      closeModal();
    } catch (err: any) {
      console.error("Failed to save plot:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.plot_file?.[0] || "Failed to save plot. Please check the details.";
      message.error(errorMsg);
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
        console.error("Failed to delete plot:", err);
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
    {
      title: "Image / Owner",
      dataIndex: "plot_file",
      key: "plot_file_owner",
      render: (_: any, record: Plot) => (
        <div className="flex items-center">
          {record.plot_file ? (
            <img src={Array.isArray((record as any).plot_file) ? (record as any).plot_file[0] : (record as any).plot_file} alt="Plot" className="w-16 h-16 object-cover rounded-md" />
          ) : (
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md text-gray-400">No Image</div>
          )}
          <div className="ml-3">
            <div className="font-medium">{(record as any).owner_name || '—'}</div>
            <div className="text-sm text-gray-500">{(record as any).title || ''}</div>
          </div>
        </div>
      ),
    },
    { title: "Plot Title", dataIndex: "title", key: "title" },
    { title: "Type", dataIndex: "plot_type", key: "plot_type" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Survey No.", dataIndex: "survey_number", key: "survey_number" },
    { title: "Facing", dataIndex: "facing", key: "facing" },
    { title: "Area", dataIndex: "total_area_sqft", key: "total_area_sqft", render: (_: any, record: Plot) => `${record.total_area_sqft} ${((record as any).area_unit) || 'sqft'}` },
    { title: "Price", dataIndex: "price_per_sqft", key: "price_per_sqft", render: (v: string, record: Plot) => `₹${Number(v).toLocaleString("en-IN")} / ${((record as any).price_unit) || 'sqft'}` },
    { title: "Google Maps", dataIndex: "google_maps_link", key: "google_maps_link", render: (link: string) => link ? <a href={link} target="_blank" rel="noreferrer">Map</a> : '—' },
    { title: "Near By", dataIndex: "near_by", key: "near_by" },
    { title: "Status", dataIndex: "is_verified", key: "is_verified", render: (isVerified: boolean) => (<Tag color={isVerified ? "green" : "red"}>{isVerified ? "Verified" : "Not Verified"}</Tag>) },
    { title: "Actions", key: "actions", render: (_: any, record: Plot) => (<div className="flex flex-col items-start space-y-1"><Button size="sm" variant="outline" onClick={() => openModalForEdit(record)}>Edit</Button><button className="text-red-600 ms-1 hover:text-red-800 text-sm hover:underline" onClick={() => handleDeletePlot(record.id)}>Delete</button></div>) },
  ];

  return (
    <>
      <Card title={<span className="text-2xl font-semibold text-neutral-800">Manage Plots</span>} extra={<Button onClick={openModalForNew} leftIcon={<IconPlus className="w-5 h-5"/>}>Add New Plot</Button>} bordered={false} className="shadow-md">
        <Table dataSource={plots} columns={columns} loading={isLoading} rowKey="key" pagination={{ pageSize: 10 }} scroll={{ x: 1200, y: 520 }} />
      </Card>
      
      <Modal width={900} title={<span className="font-bold text-xl text-gray-700">{editingPlot ? 'Edit Plot' : 'Add New Plot'}</span>} open={isModalOpen} onCancel={closeModal} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={{ description: '', plot_type: 'Residential', area_unit: 'sqft', price_unit: 'sqft' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {/* Row 1: Plot Title + Plot Type */}
            <Form.Item name="title" label="Plot Title" rules={[{ required: true }]}><Input size="small" placeholder="e.g. Green Acres Plot 12" /></Form.Item>
            <Form.Item name="plot_type" label="Plot Type" rules={[{ required: true }]}>
              <Select size="small">
                <Select.Option value="Residential">Residential</Select.Option>
                <Select.Option value="Farms">Farms</Select.Option>
                <Select.Option value="Commercial">Commercial</Select.Option>
              </Select>
            </Form.Item>

            {/* Row 2: Location + Google Maps Link */}
            <div style={{ position: 'relative' }} onBlur={handleLocationBlur}>
              <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please select a location!' }]}>
                <Input size="small"
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
            <Form.Item name="google_maps_link" label="Google Maps Link" rules={[{ required: true }]}>
              <Input size="small" placeholder="https://maps.google.com/..." />
            </Form.Item>

            {/* Row 3: Facing + Survey Number */}
            <Form.Item name="facing" label="Facing" rules={[{ required: true }]}>
              <Select size="small">
                <Select.Option value="North">North</Select.Option>
                <Select.Option value="South">South</Select.Option>
                <Select.Option value="East">East</Select.Option>
                <Select.Option value="West">West</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="survey_number" label="Survey Number" rules={[{ required: true }]}>
              <Input size="small" placeholder="e.g. 123/45" />
            </Form.Item>

            {/* Row 4: Area + Price */}
            <Form.Item label="Area">
              <div style={{ display: 'flex', gap: 8 }}>
                <Form.Item name="total_area_sqft" noStyle rules={[{ required: true }]}>
                  <InputNumber size="small" min={1} className="w-full" placeholder="e.g. 2500" />
                </Form.Item>
                <Form.Item name="area_unit" noStyle initialValue={'sqft'} rules={[{ required: true }]}>
                  <Select size="small" style={{ width: 120 }} options={[{ label: 'Sqft', value: 'sqft' }, { label: 'Sqyards', value: 'sqyards' }, { label: 'Cent', value: 'cent' }, { label: 'Acres', value: 'acres' }]} />
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item label="Price">
              <div style={{ display: 'flex', gap: 8 }}>
                <Form.Item name="price_per_sqft" noStyle rules={[{ required: true }]}>
                  <InputNumber size="small" min={1} className="w-full" placeholder="e.g. 1200" />
                </Form.Item>
                <Form.Item name="price_unit" noStyle initialValue={'sqft'} rules={[{ required: true }]}>
                  <Select size="small" style={{ width: 120 }} options={[{ label: 'Sqft', value: 'sqft' }, { label: 'Sqyards', value: 'sqyards' }, { label: 'Cent', value: 'cent' }, { label: 'Acres', value: 'acres' }]} />
                </Form.Item>
              </div>
            </Form.Item>

            {/* Row 5: Near By + Description (description not required) */}
            <Form.Item name="near_by" label="Near By" rules={[{ required: false }]}>
              <Input size="small" placeholder="Nearby landmarks (e.g. school, market)" />
            </Form.Item>
            <Form.Item name="description" label="Description"><Input.TextArea rows={3} placeholder="Premium plot ideal for residential development." /></Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 8 }}>
            <Form.Item name="plot_file" label="Plot Images" valuePropName="fileList" getValueFromEvent={normFile} style={{ marginBottom: 0 }}>
              <Upload name="plot_file" listType="picture-card" beforeUpload={() => false} multiple accept="image/*" maxCount={5}>
                <div> <PlusOneOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
              </Upload>
            </Form.Item>

            <Form.Item name="owner_name" label="Owner Name" rules={[{ required: true }]} style={{ minWidth: 220 }}>
              <Input size="small" placeholder="Owner name" />
            </Form.Item>
          </div>
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

export default ManagePlotsPage;