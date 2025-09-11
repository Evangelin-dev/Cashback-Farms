import { Button, Card, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Space, Table, Tag, Tooltip } from "antd";
import React, { useState, useEffect } from "react";
import { generateOrderId } from "../../../constants.tsx";
import apiClient from "../../../src/utils/api/apiClient";
import dayjs from 'dayjs';

// Import the phone number input component and its styles
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Define the Order interface to match the component's state needs
type CustomerType = 'B2C' | 'B2B';
type OrderStatus = "PENDING" | "CONFIRMED" | "DISPATCHED" | "DELIVERED" | "CANCELLED";

interface Order {
  id: number;
  key: React.Key;
  orderId: string;
  productName: string;
  category: string;
  qty: number;
  unitPrice: number;
  totalAmount: number;
  status: OrderStatus;
  customerType: CustomerType;
  buyerName: string;
  buyerPhoneNumber: string;
  gstNumber?: string;
  shippingAddress: string;
  orderDate: string;
  expectedDeliveryDate: string;
}

// Backend-defined valid transitions
const validTransitions: { [key in OrderStatus]?: OrderStatus[] } = {
  "PENDING": ["CONFIRMED", "CANCELLED"],
  "CONFIRMED": ["PENDING", "DISPATCHED", "CANCELLED"],
  "DISPATCHED": ["CONFIRMED", "DELIVERED", "CANCELLED"],
  "DELIVERED": ["DISPATCHED"],
  "CANCELLED": []
};

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTotalPrice, setFormTotalPrice] = useState(0);
  const [customerType, setCustomerType] = useState<CustomerType>('B2C');
  const [form] = Form.useForm();
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/web/orders/');
      const transformedData: Order[] = response.map((p: any) => ({
        id: p.id, key: p.id, orderId: p.order_id, productName: p.product_name, category: p.category,
        qty: p.qty, unitPrice: parseFloat(p.unit_price), totalAmount: parseFloat(p.total_amount),
        status: p.status.toUpperCase() as OrderStatus, // Ensure status is uppercase
        customerType: p.customer_type, buyerName: p.buyer_name, buyerPhoneNumber: p.buyer_phone_number,
        gstNumber: p.gst_number, shippingAddress: p.shipping_address, orderDate: p.order_date,
        expectedDeliveryDate: p.expected_delivery_date,
      })).sort((a: Order, b: Order) => b.id - a.id);
      setOrders(transformedData);
    } catch (error) { message.error("Failed to load orders."); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    setLoading(true);
    try {
      await apiClient.post(`/orders/${orderId}/update-status/`, { status: newStatus });
      message.success(`Order status updated to ${newStatus.toLowerCase()}!`);
      await fetchOrders();
    } catch (error) {
      console.error(`Failed to update status to ${newStatus}:`, error);
      message.error("Failed to update order status.");
      setLoading(false);
    }
  };

  const handleAddOrder = async (values: any) => {
    setSubmitting(true);
    const payload = {
      order_id: generateOrderId(), product_name: values.productName, category: values.category,
      qty: values.qty, unit_price: values.unitPrice.toFixed(2), total_amount: (values.qty * values.unitPrice).toFixed(2),
      customer_type: values.customerType, buyer_name: values.buyerName,
      buyer_phone_number: values.buyerPhoneNumber, // Already includes country code
      shipping_address: values.shippingAddress, expected_delivery_date: values.expectedDeliveryDate.format('YYYY-MM-DD'),
      gst_number: values.customerType === 'B2B' ? values.gstNumber : undefined,
    };

    try {
      await apiClient.post('/api/web/orders/', payload);
      message.success("New order posted successfully!");
      setIsModalOpen(false);
      await fetchOrders();
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage = typeof errorData === 'object' && errorData !== null ? Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ') : "Failed to post order.";
      message.error(errorMessage || "Failed to post order.", 5);
    } finally { setSubmitting(false); }
  };
  
  const showPostOrderModal = () => {
    setCustomerType('B2C'); setFormTotalPrice(0); form.resetFields();
    form.setFieldsValue({ customerType: 'B2C' }); setIsModalOpen(true);
  };
  
  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.customerType) setCustomerType(changedValues.customerType);
    if (changedValues.qty !== undefined || changedValues.unitPrice !== undefined) {
      const { qty = 0, unitPrice = 0 } = allValues;
      setFormTotalPrice(qty * unitPrice);
    }
  };

  const columns = [
    { title: "Order ID", dataIndex: "orderId", render: (id: string) => <span className="font-mono text-blue-600 text-xs bg-blue-50 px-1.5 py-0.5 rounded">{id}</span> },
    { title: "Product", dataIndex: "productName", render: (name: string) => <span className="font-semibold text-primary text-xs">{name}</span> },
    { title: "Qty", dataIndex: "qty", render: (qty: number) => <span className="font-bold text-xs">{qty}</span> },
    { title: "Total", dataIndex: "totalAmount", render: (price: number) => <span className="font-semibold text-gray-700 text-xs">₹{price.toLocaleString('en-IN')}</span> },
    { title: "Buyer", dataIndex: "buyerName", render: (buyer: string) => <span className="font-semibold text-gray-700 text-xs">{buyer}</span> },
    {
      title: "Status", dataIndex: "status",
      render: (status: OrderStatus) => {
        const colorMap: { [key in OrderStatus]: string } = { PENDING: "orange", CONFIRMED: "cyan", DISPATCHED: "blue", DELIVERED: "green", CANCELLED: "red" };
        const bgMap: { [key in OrderStatus]: string } = { PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300", CONFIRMED: "bg-cyan-100 text-cyan-700 border-cyan-300", DISPATCHED: "bg-blue-100 text-blue-700 border-blue-300", DELIVERED: "bg-green-100 text-green-700 border-green-300", CANCELLED: "bg-red-100 text-red-700 border-red-300" };
        const capitalizedStatus = status.charAt(0) + status.slice(1).toLowerCase();
        return <Tag color={colorMap[status]} className={`font-bold px-2 py-0.5 rounded-full text-xs border ${bgMap[status]}`}>{capitalizedStatus}</Tag>;
      }
    },
    {
      title: "Action",
      render: (_: any, record: Order) => (
        <Space>
          {(validTransitions[record.status] || []).map(newStatus => (
            <Tooltip key={newStatus} title={`Change to ${newStatus.toLowerCase()}`}>
              <Button size="small" type="primary" danger={newStatus === 'CANCELLED'} onClick={() => handleUpdateStatus(record.id, newStatus)} disabled={loading}>
                {newStatus.charAt(0) + newStatus.slice(1).toLowerCase()}
              </Button>
            </Tooltip>
          ))}
        </Space>
      )
    }
  ];

  return (
    <>
      <Card
        title={<div className="flex items-center gap-2"><span className="rounded-full bg-green-100 p-1"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></span><span className="text-base font-bold text-primary-light">Manage Orders</span></div>}
        extra={<Button type="primary" onClick={showPostOrderModal} className="!bg-primary hover:!bg-primary-dark !flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>Post Order</Button>}
        style={{ marginBottom: 16, borderRadius: 14, boxShadow: "0 2px 8px #22c55e11", background: "linear-gradient(135deg, #f0fdf4 0%, #f9fafb 100%)", border: "none" }}
        styles={{ body: { background: "transparent", padding: 16 } }}
      >
        <Table dataSource={orders} columns={columns} loading={loading} pagination={false} size="small" className="rounded-lg shadow" rowKey="key"
          expandable={{
            expandedRowRender: record => (
              <div className="p-3 bg-gray-50 rounded text-xs grid grid-cols-2 gap-x-8 gap-y-2">
                <div><strong className="font-semibold text-gray-600">Total Price:</strong> <span className="font-mono text-green-700 font-bold">₹{record.totalAmount.toLocaleString('en-IN')}</span></div>
                <div><strong className="font-semibold text-gray-600">Buyer Phone:</strong> <span className="font-mono">{record.buyerPhoneNumber}</span></div>
                <div><strong className="font-semibold text-gray-600">Order Date:</strong> {dayjs(record.orderDate).format('DD MMM YYYY, h:mm A')}</div>
                <div><strong className="font-semibold text-gray-600">Expected Delivery:</strong> {dayjs(record.expectedDeliveryDate).format('DD MMM YYYY')}</div>
                {record.gstNumber && <div className="col-span-2"><strong className="font-semibold text-gray-600">GSTIN:</strong> {record.gstNumber}</div>}
                <div className="col-span-2"><strong className="font-semibold text-gray-600">Shipping Address:</strong> {record.shippingAddress}</div>
              </div>
            ),
          }}
        />
        <style>{`.phone-input-container .PhoneInputInput { border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.5rem 0.75rem; width: 100%; font-size: 1rem; transition: border-color 0.2s; } .phone-input-container .PhoneInputInput:focus { border-color: #22c55e; outline: none; box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2); } .ant-card-head { background: linear-gradient(90deg,#f0fdf4 60%,#bbf7d0 100%); border-radius: 14px 14px 0 0; } .ant-table-thead > tr > th { background: #f0fdf4; font-weight: 700; font-size: 13px; } .ant-table-tbody > tr > td { font-size: 13px; } .ant-table-row-expand-icon { background: #e0f2fe; border-radius: 4px; }`}</style>
      </Card>
      
      <Modal
        title="Post a New Order" open={isModalOpen} onCancel={() => setIsModalOpen(false)}
        footer={[ <Button key="back" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</Button>, <Button key="submit" type="primary" htmlType="submit" form="order-form" loading={submitting}>Submit Order</Button> ]}
        width={700} centered
      >
        <Form form={form} id="order-form" layout="vertical" onFinish={handleAddOrder} onValuesChange={handleFormValuesChange} initialValues={{ customerType: 'B2C' }} className="mt-4">
          <Form.Item name="customerType" label="Select Customer Type" rules={[{ required: true }]}><Radio.Group><Radio.Button value="B2C">Individual (B2C)</Radio.Button><Radio.Button value="B2B">Business (B2B)</Radio.Button></Radio.Group></Form.Item>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="buyerName" label={customerType === 'B2B' ? "Buyer's Registered Business Name" : "Customer Name"} rules={[{ required: true }]}><Input placeholder={customerType === 'B2B' ? "Enter company name" : "Enter full name"} /></Form.Item>
            <Form.Item name="buyerPhoneNumber" label="Buyer's Phone Number" rules={[{ required: true, message: 'Phone number is required!' }]}><PhoneInput placeholder="Enter phone number" defaultCountry="IN" className="phone-input-container" /></Form.Item>
            <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}><Input placeholder="e.g. UltraTech Cement" /></Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}><Input placeholder="e.g. Cement" /></Form.Item>
            <Form.Item name="qty" label="Quantity" rules={[{ required: true, type: 'number', min: 1 }]}><InputNumber style={{ width: "100%" }} placeholder="e.g. 50" /></Form.Item>
            <Form.Item name="unitPrice" label="Unit Price (₹)" rules={[{ required: true, type: 'number', min: 0 }]}><InputNumber style={{ width: "100%" }} placeholder="e.g. 380" /></Form.Item>
            <Form.Item label="Total Price (Auto-Calculated)"><InputNumber style={{ width: "100%" }} value={formTotalPrice} prefix="₹" disabled /></Form.Item>
            <Form.Item name="expectedDeliveryDate" label="Expected Delivery Date" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          </div>
          {customerType === 'B2B' && (<Form.Item name="gstNumber" label="Buyer's GSTIN" rules={[{ required: true, message: 'GSTIN is required for B2B orders' }, { pattern: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/, message: 'Please enter a valid GSTIN' }]}><Input placeholder="e.g. 22AAAAA0000A1Z5" /></Form.Item>)}
          <Form.Item name="shippingAddress" label="Full Shipping Address" rules={[{ required: true }]}><Input.TextArea rows={3} placeholder="Enter site/building, area, city, and pincode" /></Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OrderManager;