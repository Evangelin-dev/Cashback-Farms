import { PlusOutlined } from '@ant-design/icons';
import { Card, Carousel, Form, Input, InputNumber, message, Modal, Select, Space, Table, Tag, Tooltip, Upload } from 'antd';
import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import { Professional, ServiceType } from '../../../types';

// Minimal shape used by the UI — only the keys that will be taken/used.
type SimpleProfessional = Pick<Professional, 'id' | 'name' | 'service' | 'rating' | 'rate' | 'imageUrl' | 'specialization'>;

const initialServices: SimpleProfessional[] = [
  {
    id: 'prof1',
    name: 'Ar. Priya Sharma',
    service: ServiceType.ARCHITECT,
    rating: 4.8,
    rate: '₹3000/consultation',
    imageUrl:
      'https://plus.unsplash.com/premium_photo-1661335257817-4552acab9656?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    specialization: 'Residential & Sustainable Design',
  },
];

const ServiceManage: React.FC = () => {
  const [services, setServices] = useState<SimpleProfessional[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<SimpleProfessional | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [filterService, setFilterService] = useState<string | undefined>(undefined);

  // generate preview URLs for uploaded files and clean up created object URLs
  React.useEffect(() => {
    const created: string[] = [];
    const urls = fileList.map((f: any) => {
      if (f.url) return f.url;
      if (f.thumbUrl) return f.thumbUrl;
      if (f.originFileObj) {
        const u = URL.createObjectURL(f.originFileObj);
        created.push(u);
        return u;
      }
      return '';
    }).filter(Boolean);
    setPreviews(urls as string[]);
    return () => { created.forEach(u => URL.revokeObjectURL(u)); };
  }, [fileList]);

  const showAddModal = () => { setEditing(null); form.resetFields(); setFileList([]); setIsModalOpen(true); };
  const showEditModal = (record: SimpleProfessional) => { setEditing(record); form.setFieldsValue(record); setFileList([]); setIsModalOpen(true); };
  const handleCancelModal = () => { setEditing(null); form.resetFields(); setFileList([]); setIsModalOpen(false); };

  const handleFormFinish = async (values: any) => {
    // derive imageUrl from uploaded files (if any). We convert the first file to a data URL
    // so the saved service has a persistent image that will render after modal close.
    let imageUrlToSave = '';
    if (fileList.length > 0) {
      const f = fileList[0] as any;
      if (f.url) imageUrlToSave = f.url;
      else if (f.thumbUrl) imageUrlToSave = f.thumbUrl;
      else if (f.originFileObj) {
        imageUrlToSave = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(f.originFileObj);
        });
      }
    } else if (editing) {
      // keep existing image when editing and no new upload
      imageUrlToSave = editing.imageUrl || '';
    }

    const payload = { ...values, imageUrl: imageUrlToSave };

    if (editing) {
      setServices(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p));
      message.success('Service updated');
    } else {
      const genId = `svc_${Math.random().toString(36).slice(2,9)}`;
      setServices(prev => [{ id: genId, ...payload }, ...prev]);
      message.success('Service added');
    }

    // reset upload state and close modal
    setFileList([]);
    setIsModalOpen(false);
  };

  const handleRemove = (id: string) => setServices(prev => prev.filter(s => s.id !== id));

  const columns = [
    {
      title: 'Service',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: SimpleProfessional) => (
        <div className="flex items-center">
          {record.imageUrl ? <img src={record.imageUrl} alt={record.name} className="w-10 h-10 rounded mr-3 object-cover" /> : <div className="w-10 h-10 rounded mr-3 bg-gray-200" />}
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-xs text-gray-600">{record.service}</div>
          </div>
        </div>
      ),
    },
    { title: 'Specialization', dataIndex: 'specialization', key: 'specialization', render: (v: string) => <span className="text-sm text-gray-700">{v}</span> },
    { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (r: number) => <Tag className="m-0">{r}</Tag> },
    { title: 'Rate', dataIndex: 'rate', key: 'rate', render: (r: string) => <div className="font-semibold">{r}</div> },
    {
      title: 'Action', key: 'action', fixed: 'right' as const, width: 140,
      render: (_: any, record: SimpleProfessional) => (
        <Space size="small">
          <Tooltip title="Edit"><Button variant="outline" size="sm" className="!p-1.5" onClick={() => showEditModal(record)}>Edit</Button></Tooltip>
          <Tooltip title="Delete"><Button variant="outline" size="sm" className="!p-1.5 !border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white" onClick={() => handleRemove(record.id)}>Delete</Button></Tooltip>
        </Space>
      ),
    }
  ];

  return (
    <>
      <Card
        title={<div className="flex items-center gap-3"><svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" /></svg><span className="text-x font-bold text-primary-light">Manage Services</span></div>}
  extra={<button onClick={showAddModal} className="px-3 py-1.5 bg-primary text-white rounded flex items-center gap-2 text-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>Add Service</button>}
        style={{ marginBottom: 32, borderRadius: 18, boxShadow: '0 2px 16px #60a5fa22', background: 'linear-gradient(135deg, #f0f9ff 0%, #f9fafb 100%)', border: 'none' }}
        styles={{ body: { background: 'transparent', padding: '16px' } }}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-semibold text-primary-light">Categories:</span>
          <Select
            allowClear
            placeholder="All Categories"
            value={filterService}
            onChange={(val) => setFilterService(val as string | undefined)}
            style={{ minWidth: 180 }}
            options={Object.values(ServiceType).map(s => ({ label: s, value: s }))}
          />
        </div>

        <Table dataSource={filterService ? services.filter(s => s.service === filterService) : services} columns={columns} pagination={false} rowKey="id" size="small" className="rounded-xl shadow" />
      </Card>

      <Modal
        title={<div className="flex items-center gap-2"><svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg><span className="font-medium text-primary-light text-sm">{editing ? 'Edit Service' : 'Add Service'}</span></div>}
        open={isModalOpen} onCancel={handleCancelModal} footer={null} centered width={520} bodyStyle={{ padding: '12px 16px' }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish} className="mt-2 text-sm" initialValues={{ rating: 4.5 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input size="small" placeholder="Name" /></Form.Item>
            <Form.Item name="service" label="Service" rules={[{ required: true }]}>
              <Select size="small" placeholder="Select service">
                {Object.values(ServiceType).map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="rating" label="Rating"><InputNumber size="small" min={0} max={5} step={0.1} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="rate" label="Rate"><Input size="small" placeholder="Eg: ₹3000/consultation" /></Form.Item>
            {/* imageUrl removed from the form - uploads are used instead */}
            <Form.Item name="specialization" label="Specialization" className="md:col-span-2"><Input size="small" placeholder="Specialization" /></Form.Item>
            <Form.Item className="md:col-span-2">
              {previews.length > 0 && (
                <div className="mb-2">
                  <Carousel autoplay autoplaySpeed={2500} dots={false}>
                    {previews.map((src, i) => (
                      <div key={i} className="flex items-center justify-center h-28 bg-gray-50 rounded overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`preview-${i}`} className="max-h-28 object-contain" />
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}
              <Upload listType="picture" maxCount={5} fileList={fileList} onChange={({ fileList: newList }) => setFileList(newList)} beforeUpload={() => false} multiple>
                {fileList.length >= 5 ? null : (
                  <div className="text-center text-xs p-2 border rounded">
                    <PlusOutlined />
                    <div style={{ marginTop: 6 }}>Upload (max 5)</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={handleCancelModal}>Cancel</Button>
            <button type="submit" className="px-3 py-1 bg-primary text-white rounded text-sm">{editing ? 'Save Changes' : 'Add Service'}</button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ServiceManage;
