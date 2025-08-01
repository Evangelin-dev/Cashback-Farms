import React, { useEffect, useState, useCallback } from 'react';
import { Card, Form, Input, InputNumber, Modal, Select, Table, Tag, message, Checkbox, Tooltip, Row, Col, Space } from 'antd';
import Button from '../../components/Button';
import apiClient from '../../src/utils/api/apiClient';
import { IconPencil, IconPlus, IconTrash } from '../../constants';

const useWindowSize = () => {
    const [size, setSize] = useState({ width: window.innerWidth });
    useEffect(() => {
        const handleResize = () => setSize({ width: window.innerWidth });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
};

interface CommercialProperty {
  id: number;
  key: number;
  property_name: string;
  commercial_type: string;
  address_line1: string;
  locality: string;
  city: string;
  pincode: string;
  area_sqft: string;
  is_for_sale: boolean;
  sale_price: string | null;
  is_for_rent: boolean;
  rent_per_month: string | null;
  availability_status: string;
  description: string;
  amenities: string[];
  images_urls: string[];
  floor: string;
  total_floors: number;
  parking_spaces: number;
  year_built: number;
  contact_person: string;
  contact_number: string;
}

const COMMERCIAL_TYPE_CHOICES = ['Office Space', 'Shop', 'Warehouse', 'Showroom', 'Co-working'];
const AVAILABILITY_CHOICES = ['Available', 'Leased', 'Sold', 'Under Offer'];

const ManageCommercialPage: React.FC = () => {
  const [properties, setProperties] = useState<CommercialProperty[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<CommercialProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const { width } = useWindowSize();
  const isDesktop = width >= 768;


  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<CommercialProperty | null>(null);


  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await apiClient.get('/admin/commercial-properties/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProperties((response || []).map((p: any) => ({ ...p, key: p.id })).sort((a: CommercialProperty, b: CommercialProperty) => b.id - a.id));
    } catch (error) {
      message.error("Failed to load commercial properties.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    const accessToken = localStorage.getItem("access_token");
    const payload = {
        ...values,
        amenities: values.amenities ? values.amenities.split(',').map((a: string) => a.trim()).filter(Boolean) : [],
        images_urls: values.images_urls ? values.images_urls.split(',').map((img: string) => img.trim()).filter(Boolean) : [],
    };

    try {
      if (editingProperty) {
        await apiClient.put(`/admin/commercial-properties/${editingProperty.id}/`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        message.success("Property updated successfully!");
      } else {
        await apiClient.post('/admin/commercial-properties/', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        message.success("Property added successfully!");
      }
      closeModal();
      fetchProperties();
    } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage = typeof errorData === 'object' && errorData !== null
          ? Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ')
          : "An error occurred. Please try again.";
        message.error(errorMessage, 5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;
    setIsSubmitting(true);
    try {
        const accessToken = localStorage.getItem("access_token");
        await apiClient.delete(`/admin/commercial-properties/${propertyToDelete.id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        message.success("Property deleted successfully.");
        fetchProperties();
    } catch (error) {
        message.error("Failed to delete property.");
    } finally {
        setIsDeleteModalVisible(false);
        setPropertyToDelete(null);
        setIsSubmitting(false);
    }
  };
  
  const openModalForNew = () => {
    setEditingProperty(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (property: CommercialProperty) => {
    setEditingProperty(property);
    form.setFieldsValue({
        ...property,
        amenities: property.amenities.join(', '),
        images_urls: property.images_urls.join(', '),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
    form.resetFields();
  };

  const showDeleteModal = (property: CommercialProperty) => {
    setPropertyToDelete(property);
    setIsDeleteModalVisible(true);
  };
  
  const columns = [
    { title: 'Name', dataIndex: 'property_name', key: 'property_name', fixed: isDesktop ? 'left' : undefined, width: 150 },
    { title: 'Type', dataIndex: 'commercial_type', key: 'commercial_type' },
    { title: 'Location', key: 'location', render: (_: any, record: CommercialProperty) => `${record.locality}, ${record.city}` },
    { title: 'Area (SqFt)', dataIndex: 'area_sqft', key: 'area_sqft' },
    { title: 'Sale Price', dataIndex: 'sale_price', key: 'sale_price', render: (price: string) => price ? `₹${parseFloat(price).toLocaleString('en-IN')}` : 'N/A' },
    { title: 'Rent/Month', dataIndex: 'rent_per_month', key: 'rent_per_month', render: (price: string) => price ? `₹${parseFloat(price).toLocaleString('en-IN')}` : 'N/A' },
    { title: 'Status', dataIndex: 'availability_status', key: 'availability_status', render: (status: string) => <Tag color="blue">{status}</Tag> },
    { title: 'Actions', key: 'actions', fixed: isDesktop ? 'right' : undefined, width: 100, render: (_: any, record: CommercialProperty) => (
        <Space direction="vertical" align="center">
          <Tooltip title="Edit Property">
            <Button size="sm" variant="outline" onClick={() => openModalForEdit(record)} leftIcon={<IconPencil className="w-4 h-4"/>} />
          </Tooltip>
          <Tooltip title="Delete Property">
            <Button size="sm" variant="danger" onClick={() => showDeleteModal(record)} leftIcon={<IconTrash className="w-4 h-4"/>} />
          </Tooltip>
        </Space>
    )},
  ];

  return (
    <div>
      <Card title="Manage Commercial Properties" extra={<Button onClick={openModalForNew} leftIcon={<IconPlus/>}>Add Property</Button>} style={{ marginBottom: 20 }}>
        <div className="overflow-x-auto">
          <Table dataSource={properties} columns={columns} loading={isLoading} rowKey="key" scroll={{ x: 1200 }} />
        </div>
      </Card>

      <Modal open={isModalOpen} onCancel={closeModal} title={editingProperty ? 'Edit Commercial Property' : 'Add New Commercial Property'} footer={null} width={800} destroyOnClose centered>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-4 max-h-[70vh] overflow-y-auto p-2">
            <Row gutter={16}>
                <Col xs={24} sm={12}><Form.Item name="property_name" label="Property Name" rules={[{ required: true }]}><Input/></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="commercial_type" label="Commercial Type" rules={[{ required: true }]}><Select options={COMMERCIAL_TYPE_CHOICES.map(c => ({ label: c, value: c }))}/></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="address_line1" label="Address Line 1"><Input/></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="locality" label="Locality" rules={[{ required: true }]}><Input/></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="city" label="City" rules={[{ required: true }]}><Input/></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="pincode" label="Pincode"><Input/></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="area_sqft" label="Area (SqFt)" rules={[{ required: true }]}><InputNumber style={{width: '100%'}}/></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="availability_status" label="Availability Status" rules={[{ required: true }]}><Select options={AVAILABILITY_CHOICES.map(c => ({ label: c, value: c }))}/></Form.Item></Col>
                <Col xs={8}><Form.Item name="is_for_sale" valuePropName="checked"><Checkbox>For Sale</Checkbox></Form.Item></Col>
                <Col xs={16}><Form.Item name="sale_price" label="Sale Price (₹)"><InputNumber style={{width: '100%'}} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value!.replace(/\$\s?|(,*)/g, '')}/></Form.Item></Col>
                <Col xs={8}><Form.Item name="is_for_rent" valuePropName="checked"><Checkbox>For Rent</Checkbox></Form.Item></Col>
                <Col xs={16}><Form.Item name="rent_per_month" label="Rent per Month (₹)"><InputNumber style={{width: '100%'}} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value!.replace(/\$\s?|(,*)/g, '')}/></Form.Item></Col>
                <Col span={24}><Form.Item name="description" label="Description"><Input.TextArea rows={3}/></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="amenities" label="Amenities (comma-separated)"><Input/></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="images_urls" label="Image URLs (comma-separated)"><Input/></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="floor" label="Floor"><Input/></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="total_floors" label="Total Floors"><InputNumber style={{width: '100%'}}/></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="parking_spaces" label="Parking Spaces"><InputNumber style={{width: '100%'}}/></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="year_built" label="Year Built"><InputNumber style={{width: '100%'}}/></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="contact_person" label="Contact Person" rules={[{ required: true }]}><Input/></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="contact_number" label="Contact Number" rules={[{ required: true }]}><Input/></Form.Item></Col>
            </Row>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" variant="primary" loading={isSubmitting}>{editingProperty ? 'Save Changes' : 'Add Property'}</Button>
            </div>
        </Form>
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={null}
        width={400}
        centered
      >
        <p className="py-4">Are you sure you want to permanently delete the property: <strong className="text-primary">{propertyToDelete?.property_name}</strong>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleteModalVisible(false)} disabled={isSubmitting}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmDelete} loading={isSubmitting}>Delete Property</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCommercialPage;