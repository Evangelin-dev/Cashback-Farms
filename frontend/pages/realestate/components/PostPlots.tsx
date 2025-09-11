import apiClient from "@/src/utils/api/apiClient";
import { PlusOutlined } from '@ant-design/icons';
import { Card, Form, Input, InputNumber, message, Modal, Select, Table, Tag, Tooltip, Upload } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../components/common/Button";

type Plot = {
  key: number;
  id: number;
  title: string;
  owner: string;
  location: string;
  area: number;
  price: number;
  status: string;
  description: string;
  images: Array<File | string>;
  google_maps_link?: string;
  facing?: string;
  near_by?: string;
  is_available_full: boolean;
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

const PostPlots: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  // fileList for antd Upload (keeps originFileObj for FormData)
  const [fileList, setFileList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // units for area/price dropdowns (default choices)
  const AREA_UNITS = [
    { label: 'Sqft', value: 'sqft' },
    { label: 'Sqyards', value: 'sqyards' },
    { label: 'Cent', value: 'cent' },
    { label: 'Acres', value: 'acres' },
  ];
  const PRICE_UNITS = AREA_UNITS; // same unit options for price-per

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
    fetchLocationSuggestions(locationInput);
  }, [locationInput, fetchLocationSuggestions]);

  const fetchPlots = useCallback(async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
  const response = await apiClient.get("/plots/", { headers: { Authorization: `Bearer ${accessToken}` } });
  const res = response?.data || [];
  const mappedPlots = (res || []).map((plot: any) => ({
        key: plot.id,
        id: plot.id,
        title: plot.title,
        owner: plot.owner_name || plot.owner_username,
        location: plot.location,
        facing: plot.facing || '',
  google_maps_link: plot.google_maps_link || '',
  near_by: plot.near_by || plot.nearby || '',
  area: Number(plot.total_area_sqft) || 0,
  area_unit: plot.area_unit || 'sqft',
  price: Number(plot.price_per_sqft) || 0,
  price_unit: plot.price_unit || 'sqft',
  plot_type: plot.plot_type || '',
  survey_number: plot.survey_number || '',
        status: plot.is_available_full ? "Available" : "Unavailable",
        is_available_full: plot.is_available_full,
        description: "",
        // backend may return image URLs or file objects; attempt to map common fields
        images: plot.images || plot.plot_files || [],
      }));
      setPlots(mappedPlots.reverse());
    } catch (err) {
      console.error("Error fetching plots:", err);
      setPlots([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlots();
  }, [fetchPlots]);

  // Upload handled by antd Upload component; we store list in fileList
  
  const resetAndCloseModal = () => {
    setModalVisible(false);
    form.resetFields();
    setDescription("");
  setFileList([]);
    setLocationInput("");
    setLocationSuggestions([]);
    setShowSuggestions(true);
  };

  // try to get current user's display name from localStorage (common keys)
  const getCurrentUserName = () => {
    try {
      const maybeUser = localStorage.getItem('user') || localStorage.getItem('profile');
      if (maybeUser) {
        const parsed = JSON.parse(maybeUser);
        return parsed.full_name || parsed.name || parsed.username || parsed.first_name || parsed.owner_name || '';
      }
      // fallback to other common keys
      return localStorage.getItem('owner_name') || localStorage.getItem('username') || localStorage.getItem('full_name') || '';
    } catch (e) {
      return localStorage.getItem('username') || '';
    }
  };

  const openModal = () => {
    const name = getCurrentUserName();
    if (name) form.setFieldsValue({ owner: name });
    setModalVisible(true);
  };

  const handleAdd = async (values: any) => {
    try {
      // ensure at least one image is uploaded
      if (!fileList || fileList.length === 0) {
        message.error('Please upload at least one image.');
        return;
      }
      const accessToken = localStorage.getItem("access_token");
      
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('owner_name', values.owner);
      formData.append('location', values.location);
      formData.append('total_area_sqft', String(values.area));
      formData.append('price_per_sqft', String(values.price));
  // include unit fields
  formData.append('area_unit', values.area_unit || 'sqft');
  formData.append('price_unit', values.price_unit || 'sqft');
  formData.append('plot_type', values.plot_type || 'Residential');
  formData.append('survey_number', values.survey_number || '');
  formData.append('description', description);
  // include new fields
  formData.append('google_maps_link', values.google_maps_link || '');
  formData.append('facing', values.facing || '');
  formData.append('near_by', values.near_by || '');
      
      // Append each image file to the FormData (server expects multiple 'plot_file' entries)
      // fileList items contain originFileObj when beforeUpload returns false
      fileList.forEach((file) => {
        const f = file.originFileObj || file;
        formData.append('plot_file', f);
      });
      
      await apiClient.post("/plots/", formData, { 
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        } 
      });
      
      // Refresh plots after adding a new one
      fetchPlots();
      resetAndCloseModal();
      message.success("Plot added successfully!");
    } catch (err) {
      console.error("Error adding plot:", err);
      message.error("Failed to add plot.");
    }
  };

  // ✨ NEW FUNCTION TO HANDLE API CALL FOR TOGGLING STATUS
  const handleToggleAvailability = async (plotId: number) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await apiClient.patch(`/plots/${plotId}/toggle-availability/`, {}, { 
        headers: { Authorization: `Bearer ${accessToken}` } 
      });
      message.success("Plot status updated successfully!");
      // Refresh the entire plot list to get the latest data
      fetchPlots();
    } catch (err) {
      console.error("Failed to toggle plot status:", err);
      message.error("Failed to update plot status.");
    }
  };
  
  const handleLocationBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const columns = [
    { title: "Plot Title", dataIndex: "title" },
    { title: "Plot Type", dataIndex: "plot_type", render: (v: string) => v || '-' },
    { title: "Owner", dataIndex: "owner" },
    { title: "Location", dataIndex: "location" },
    { title: "Survey No.", dataIndex: "survey_number" },
  { title: "Facing", dataIndex: "facing", render: (v: string) => v || '-' },
  { title: "Near By", dataIndex: "near_by", render: (v: string) => v ? (<Tooltip title={v}><span>{v.length > 40 ? `${v.slice(0,40)}...` : v}</span></Tooltip>) : '-' },
    { title: "Area", dataIndex: "area", render: (_: any, record: any) => `${record.area || 0} ${record.area_unit || 'sqft'}` },
  { title: "Map", dataIndex: "google_maps_link", render: (link: string) => link ? (<a href={link} target="_blank" rel="noreferrer" className="text-blue-600">Map</a>) : '-' },
    { title: "Price", dataIndex: "price", render: (_: any, record: any) => `₹${(record.price || 0).toLocaleString("en-IN")}/${(record.price_unit || 'sqft')}` },
    { 
      title: "Status", 
      dataIndex: "status", 
      render: (status: string) => (
        <Tag color={status === "Available" ? "green" : "red"}>{status}</Tag>
      ) 
    },
    { 
      title: "Images", 
      dataIndex: "images", 
      render: (imgs: Array<File | string> | undefined) => imgs && imgs.length > 0 ? (
        <div style={{ display: "flex", gap: 8 }}>
          {imgs.map((img, idx) => {
            const src = typeof img === 'string' ? img : URL.createObjectURL(img as File);
            return <img key={idx} src={src} alt={`Plot Img ${idx + 1}`} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }} />;
          })}
        </div>
      ) : ( "-" )
    },
    { 
      title: "Action", 
      render: (_: any, record: Plot) => (
        // ✨ BUTTON NOW CALLS THE NEW API FUNCTION
        <Button 
          variant={record.status === "Unavailable" ? "primary" : "outline"} 
          size="sm" 
          onClick={() => handleToggleAvailability(record.id)}
        >
          Set {record.status === "Unavailable" ? "Available" : "Unavailable"}
        </Button>
      ) 
    },
  ];

  return (
    <>
      <Card title={<span style={{ fontWeight: 700, fontSize: 22, color: "#1e293b" }}>Post Plots for Clients</span>} extra={<Button variant="primary" onClick={openModal} style={{ borderRadius: 8, fontWeight: 600, fontSize: 16, padding: "8px 20px" }}>+ Add Plot</Button>} style={{ marginBottom: 32, borderRadius: 16, boxShadow: "0 4px 24px #e0e7ef", background: "linear-gradient(90deg, #f0f9ff 0%, #fff 100%)", border: "none" }} bodyStyle={{ background: "#fff", borderRadius: 16, padding: 32 }}>
  <Table dataSource={plots} columns={columns} pagination={false} rowKey="key" style={{ borderRadius: 12, overflow: "hidden" }} rowClassName={() => "custom-table-row"} loading={isLoading} scroll={{ x: '100%', y: 420 }} />
      </Card>
      
  <Modal title={<span style={{ fontWeight: 700, fontSize: 20, color: "#059669" }}>Add Plot</span>} open={modalVisible} onCancel={resetAndCloseModal} footer={[<div key="footer-actions" style={{ display: "flex", gap: 16, justifyContent: "flex-end", padding: "8px 0" }}><Button key="cancel" variant="outline" onClick={resetAndCloseModal} style={{ borderRadius: 8, fontWeight: 600, fontSize: 15, padding: "7px 18px", color: "#059669", borderColor: "#059669", background: "#f0fdf4" }}>Cancel</Button><Button key="submit" variant="primary" onClick={() => form.submit()} style={{ borderRadius: 8, fontWeight: 600, fontSize: 15, padding: "7px 18px", background: "#059669", color: "#fff", border: "none" }}>Add Plot</Button></div>]} width={900} style={{ borderRadius: 16, overflow: "hidden", top: 40 }} bodyStyle={{ borderRadius: 16, background: "#f0fdf4", padding: 28 }}>
  <Form form={form} layout="vertical" onFinish={handleAdd} initialValues={{ area_unit: 'sqft', price_unit: 'sqft', plot_type: 'Residential' }} style={{ gap: 12, display: "flex", flexDirection: "column" }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            <Form.Item name="title" label={<span style={{ fontWeight: 600, color: "#065f46" }}>Plot Title</span>} rules={[{ required: true }]} style={{ marginBottom: 12 }}>
              <Input style={{ borderRadius: 8, fontSize: 15, padding: "8px 12px", background: "#dcfce7", color: "#065f46", border: "1.5px solid #bbf7d0" }} placeholder="e.g. Sunshine Meadows" />
            </Form.Item>

            <Form.Item name="plot_type" label={<span style={{ fontWeight: 600, color: "#065f46" }}>Plot Type</span>} style={{ marginBottom: 12 }} initialValue={"Residential"} rules={[{ required: true, message: 'Please select plot type' }] }>
              <Select className="custom-select" size="small" placeholder="Select plot type" style={{ borderRadius: 8 }}>
                <Select.Option value="Residential">Residential</Select.Option>
                <Select.Option value="Farms">Farms</Select.Option>
                <Select.Option value="Commercial">Commercial</Select.Option>
              </Select>
            </Form.Item>

            <div style={{ position: 'relative' }} onBlur={handleLocationBlur}>
                <Form.Item name="location" label={<span style={{ fontWeight: 600, color: "#065f46" }}>Location</span>} rules={[{ required: true, message: 'Please select a location!' }]} style={{ marginBottom: 12 }}>
                <Input
                  size="small"
                  style={{ borderRadius: 8, padding: "6px 10px", background: "#dcfce7", color: "#065f46", border: "1.5px solid #bbf7d0" }}
                  placeholder="Start typing an address..."
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    form.setFieldsValue({ location: e.target.value });
                    setShowSuggestions(true);
                  }}
                  autoComplete="off"
                />
              </Form.Item>
              {isLocationLoading && <span style={{ position: 'absolute', right: 12, top: 40, color: '#065f46' }}>...</span>}
              {showSuggestions && locationSuggestions.length > 0 && (
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

            <Form.Item name="google_maps_link" label={<span style={{ fontWeight: 600, color: "#065f46" }}>Google Maps Link</span>} style={{ marginBottom: 12 }} rules={[{ required: true, message: 'Please provide Google Maps link' }]}>
              <Input size="small" style={{ borderRadius: 8, padding: "6px 10px", background: "#dcfce7", color: "#065f46", border: "1.5px solid #bbf7d0" }} placeholder="https://maps.google.com/..." />
            </Form.Item>

            <Form.Item name="facing" label={<span style={{ fontWeight: 600, color: "#065f46" }}>Facing</span>} style={{ marginBottom: 12 }} rules={[{ required: true, message: 'Please select facing' }] }>
              <Select className="custom-select" size="small" placeholder="Select facing" style={{ borderRadius: 8 }}>
                <Select.Option value="North">North</Select.Option>
                <Select.Option value="South">South</Select.Option>
                <Select.Option value="East">East</Select.Option>
                <Select.Option value="West">West</Select.Option>
                <Select.Option value="Northeast">Northeast</Select.Option>
                <Select.Option value="Northwest">Northwest</Select.Option>
                <Select.Option value="Southeast">Southeast</Select.Option>
                <Select.Option value="Southwest">Southwest</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="survey_number" label={<span style={{ fontWeight: 600, color: "#065f46" }}>Survey Number</span>} style={{ marginBottom: 12 }} rules={[{ required: true, message: 'Please enter survey number' }] }>
              <Input size="small" style={{ borderRadius: 8, padding: "6px 10px", background: "#dcfce7", color: "#065f46", border: "1.5px solid #bbf7d0" }} placeholder="e.g. 123/45" />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 600, color: "#065f46" }}>Area</span>} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Form.Item name="area" noStyle rules={[{ required: true, message: 'Please enter area' }]}>
                  <InputNumber size="small" min={0} style={{ width: '100%', borderRadius: 8, padding: "6px 10px", background: "#dcfce7", color: "#065f46", border: "1.5px solid #bbf7d0" }} placeholder="e.g. 1800" />
                </Form.Item>
                <Form.Item name="area_unit" noStyle initialValue={'sqft'}>
                  <Select className="custom-select" size="small" style={{ width: 120, minWidth: 100, borderRadius: 8 }} options={AREA_UNITS} />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 600, color: "#065f46" }}>Price</span>} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Form.Item name="price" noStyle rules={[{ required: true, message: 'Please enter price' }]}>
                  <InputNumber size="small" min={0} style={{ width: '100%', borderRadius: 8, padding: "6px 10px", background: "#dcfce7", color: "#065f46", border: "1.5px solid #bbf7d0" }} placeholder="e.g. 1200000" />
                </Form.Item>
                <Form.Item name="price_unit" noStyle initialValue={'sqft'}>
                  <Select className="custom-select" size="small" style={{ width: 120, minWidth: 100, borderRadius: 8 }} options={PRICE_UNITS} />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item name="near_by" label={<span style={{ fontWeight: 600, color: "#065f46" }}>Near By</span>} style={{ marginBottom: 12 }}>
              <Input size="small" style={{ borderRadius: 8, padding: "6px 10px", background: "#dcfce7", color: "#065f46", border: "1.5px solid #bbf7d0" }} placeholder="Nearby landmarks (e.g. school, market)" />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 600, color: "#065f46" }}>Description</span>} style={{ marginBottom: 12 }}>
              <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the plot..." rows={3} style={{ fontSize: 13, color: "#065f46", resize: "vertical", borderRadius: 8, background: "#dcfce7", border: "1.5px solid #bbf7d0", padding: "8px 10px" }} maxLength={500} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, alignItems: 'start', marginBottom: 12 }}>
            <Form.Item name="owner" label={<span style={{ fontWeight: 600, color: "#065f46" }}>Owner Name</span>} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Input size="small" style={{ borderRadius: 8, padding: "6px 10px", background: "#dcfce7", color: "#065f46", border: "1.5px solid #bbf7d0" }} placeholder="Owner name" />
            </Form.Item>

            <Form.Item name="plot_images" label="Plot Images (max 5)" style={{ marginBottom: 0 }} rules={[{ validator: () => (fileList && fileList.length > 0) ? Promise.resolve() : Promise.reject(new Error('Please upload at least one image.')) }]}>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList: newList }) => {
                  if (newList.length > 5) {
                    message.warning('You can upload up to 5 images.');
                    newList = newList.slice(0, 5);
                  }
                  setFileList(newList);
                }}
                beforeUpload={() => false}
                multiple
                maxCount={5}
                accept="image/*"
              >
                {fileList.length >= 5 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              <div className="text-xs text-gray-500 mt-1" style={{ fontSize: 12 }}>You can upload up to 5 images.</div>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <style>{`
        .custom-table-row:hover td { background: #f0f9ff !important; transition: background 0.2s; }
        .suggestions-list { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #bbf7d0; border-radius: 8px; list-style: none; margin-top: -12px; padding: 4px 0; z-index: 1050; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .suggestions-list li { padding: 10px 15px; cursor: pointer; font-size: 14px; }
        .suggestions-list li:hover { background-color: #f0fdf4; }

        /* table appearance: prevent header wrap, use ellipsis for long content and keep table clean */
        .ant-table {
          /* allow headers to size naturally so full titles can show */
          table-layout: auto;
        }
        .ant-table-thead th {
          /* allow header text to wrap / show fully */
          white-space: normal;
          overflow: visible;
          text-overflow: unset;
        }
        .ant-table-tbody td {
          /* keep cells compact but allow header-driven widths; show ellipsis for long cell content */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
          vertical-align: middle;
        }
        /* reduce header padding slightly for better fit */
        .ant-table-thead > tr > th {
          padding: 14px 12px;
        }
        /* ensure the table wrapper allows horizontal scroll when needed */
        .ant-table-wrapper {
          overflow: auto;
        }

        /* custom select to visually match inputs */
        .custom-select .ant-select-selector {
          background: #dcfce7 !important;
          border: 1.5px solid #bbf7d0 !important;
          border-radius: 8px !important;
          padding: 6px 8px !important;
          color: #065f46 !important;
          min-height: 36px !important;
        }
        .custom-select .ant-select-selection-placeholder,
        .custom-select .ant-select-selection-item {
          color: #065f46 !important;
        }
        @media (max-width: 768px) {
          /* make modal full width on small screens */
          .ant-modal {
            padding: 12px !important;
          }
        }
      `}</style>
    </>
  );
};

export default PostPlots;