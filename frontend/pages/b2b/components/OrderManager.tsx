import { Button, Card, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Space, Table, Tag, Tooltip } from "antd";
import React,{ useState } from "react";
import { generateOrderId } from "../../../constants.tsx";
import dayjs from 'dayjs';

type CustomerType = 'B2C' | 'B2B';

interface Order {
  key: React.Key;
  orderId: string;
  productName: string;
  category: string;
  qty: number;
  unitPrice: number;
  status: "Pending" | "Confirmed" | "Dispatched" | "Delivered" | "Cancelled";
  customerType: CustomerType;
  buyerName: string;
  buyerPhoneNumber: string;
  gstNumber?: string;
  shippingAddress: string;
  orderDate: string;
  expectedDeliveryDate: string;
}

const initialOrders: Order[] = [
  { 
    key: 1, 
    orderId: generateOrderId(), 
    productName: "UltraTech Cement", 
    category: "Cement", 
    qty: 50, 
    unitPrice: 380,
    status: "Confirmed", 
    customerType: 'B2B',
    buyerName: "Ravi Kumar Construction",
    buyerPhoneNumber: "9876543210",
    shippingAddress: "Site 42, Industrial Area, Phase 2, Chandigarh, 160002",
    gstNumber: "04AAFCE1234A1Z5",
    orderDate: new Date().toISOString(),
    expectedDeliveryDate: dayjs().add(5, 'day').toISOString()
  },
  { 
    key: 2, 
    orderId: generateOrderId(), 
    productName: "TATA Tiscon Rebar", 
    category: "Steel", 
    qty: 20, 
    unitPrice: 75,
    status: "Pending", 
    customerType: 'B2C',
    buyerName: "Priya Sharma",
    buyerPhoneNumber: "9123456789",
    shippingAddress: "House 123, Sector 45, Gurgaon, Haryana, 122003",
    orderDate: dayjs().subtract(1, 'day').toISOString(),
    expectedDeliveryDate: dayjs().add(7, 'day').toISOString()
  },
];

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTotalPrice, setFormTotalPrice] = useState(0);
  const [customerType, setCustomerType] = useState<CustomerType>('B2C');
  const [form] = Form.useForm();

  const showPostOrderModal = () => {
    setCustomerType('B2C');
    setFormTotalPrice(0);
    form.resetFields();
    form.setFieldsValue({ customerType: 'B2C' });
    setIsModalOpen(true);
  };
  
  const handleUpdateStatus = (key: React.Key, currentStatus: Order['status']) => {
    let nextStatus: Order['status'] | null = null;
    let messageText = '';
    
    switch (currentStatus) {
      case 'Pending':
        nextStatus = 'Confirmed';
        messageText = 'Order Confirmed!';
        break;
      case 'Confirmed':
        nextStatus = 'Dispatched';
        messageText = 'Order Dispatched!';
        break;
      case 'Dispatched':
        nextStatus = 'Delivered';
        messageText = 'Order Marked as Delivered!';
        break;
      default:
        return;
    }

    if (nextStatus) {
      setOrders(orders.map(order => order.key === key ? { ...order, status: nextStatus! } : order));
      message.success(messageText);
    }
  };
  
  const handleCancelOrder = (key: React.Key) => {
    Modal.confirm({
      title: 'Are you sure you want to cancel this order?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Cancel Order',
      okType: 'danger',
      onOk: () => {
        setOrders(orders.map(order => order.key === key ? { ...order, status: 'Cancelled' } : order));
        message.warning('Order has been cancelled.');
      }
    });
  };

  const handleAddOrder = (values: any) => {
    const newOrder: Order = {
      key: Date.now(),
      orderId: generateOrderId(),
      status: "Pending",
      orderDate: new Date().toISOString(),
      ...values,
      expectedDeliveryDate: values.expectedDeliveryDate.toISOString(),
      gstNumber: values.customerType === 'B2B' ? values.gstNumber : undefined,
    };
    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
    message.success("New order has been successfully posted!");
  };

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.customerType) {
      setCustomerType(changedValues.customerType);
    }
    if (changedValues.qty !== undefined || changedValues.unitPrice !== undefined) {
      const { qty = 0, unitPrice = 0 } = allValues;
      setFormTotalPrice(qty * unitPrice);
    }
  };

  const getNextAction = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return { text: 'Confirm Order', action: 'Confirm' };
      case 'Confirmed': return { text: 'Dispatch', action: 'Dispatch' };
      case 'Dispatched': return { text: 'Mark Delivered', action: 'Deliver' };
      default: return null;
    }
  };

  const columns = [
    { title: "Order ID", dataIndex: "orderId", render: (id: string) => <span className="font-mono text-blue-600 text-xs bg-blue-50 px-1.5 py-0.5 rounded">{id}</span> },
    { title: "Product", dataIndex: "productName", render: (name: string) => <span className="font-semibold text-primary text-xs">{name}</span> },
    { title: "Qty", dataIndex: "qty", render: (qty: number) => <span className="font-bold text-xs">{qty}</span> },
    { title: "Unit Price", dataIndex: "unitPrice", render: (price: number) => <span className="font-semibold text-gray-700 text-xs">₹{price.toLocaleString('en-IN')}</span> },
    { title: "Buyer", dataIndex: "buyerName", render: (buyer: string) => <span className="font-semibold text-gray-700 text-xs">{buyer}</span> },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: Order['status']) => {
        const colorMap = {
          Pending: "orange", Confirmed: "cyan", Dispatched: "blue", Delivered: "green", Cancelled: "red"
        };
        const bgMap = {
          Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
          Confirmed: "bg-cyan-100 text-cyan-700 border-cyan-300",
          Dispatched: "bg-blue-100 text-blue-700 border-blue-300",
          Delivered: "bg-green-100 text-green-700 border-green-300",
          Cancelled: "bg-red-100 text-red-700 border-red-300",
        };
        return <Tag color={colorMap[status]} className={`font-bold px-2 py-0.5 rounded-full text-xs border ${bgMap[status]}`}>{status}</Tag>
      }
    },
    {
      title: "Action",
      render: (_: any, record: Order) => {
        const nextAction = getNextAction(record.status);
        return (
          <Space>
            {nextAction && (
               <Tooltip title={`${nextAction.text}`}>
                <Button size="small" type="primary" className="!bg-green-500 hover:!bg-green-600" onClick={() => handleUpdateStatus(record.key, record.status)}>
                  {nextAction.action}
                </Button>
               </Tooltip>
            )}
            {record.status !== 'Delivered' && record.status !== 'Cancelled' && (
              <Tooltip title="Cancel Order">
                <Button size="small" danger onClick={() => handleCancelOrder(record.key)}>
                  Cancel
                </Button>
              </Tooltip>
            )}
          </Space>
        )
      }
    }
  ];

  return (
    <>
      <Card
        title={
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-100 p-1">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            <span className="text-base font-bold text-primary-light">Manage Orders</span>
          </div>
        }
        extra={
          <Button type="primary" onClick={showPostOrderModal} className="!bg-primary hover:!bg-primary-dark !flex items-center gap-1">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Post Order
          </Button>
        }
        style={{ marginBottom: 16, borderRadius: 14, boxShadow: "0 2px 8px #22c55e11", background: "linear-gradient(135deg, #f0fdf4 0%, #f9fafb 100%)", border: "none" }}
        bodyStyle={{ background: "transparent", padding: 16 }}
      >
        <Table
          dataSource={orders}
          columns={columns}
          pagination={false}
          size="small"
          className="rounded-lg shadow"
          rowKey="key"
          expandable={{
            expandedRowRender: record => (
              <div className="p-3 bg-gray-50 rounded text-xs grid grid-cols-2 gap-x-8 gap-y-2">
                <div><strong className="font-semibold text-gray-600">Total Price:</strong> <span className="font-mono text-green-700 font-bold">₹{(record.qty * record.unitPrice).toLocaleString('en-IN')}</span></div>
                <div><strong className="font-semibold text-gray-600">Buyer Phone:</strong> <span className="font-mono">{record.buyerPhoneNumber}</span></div>
                <div><strong className="font-semibold text-gray-600">Order Date:</strong> {dayjs(record.orderDate).format('DD MMM YYYY, h:mm A')}</div>
                <div><strong className="font-semibold text-gray-600">Expected Delivery:</strong> {dayjs(record.expectedDeliveryDate).format('DD MMM YYYY')}</div>
                {record.gstNumber && <div className="col-span-2"><strong className="font-semibold text-gray-600">GSTIN:</strong> {record.gstNumber}</div>}
                <div className="col-span-2"><strong className="font-semibold text-gray-600">Shipping Address:</strong> {record.shippingAddress}</div>
              </div>
            ),
          }}
        />
        <style>{`
          .ant-card-head { background: linear-gradient(90deg,#f0fdf4 60%,#bbf7d0 100%); border-radius: 14px 14px 0 0; }
          .ant-table-thead > tr > th { background: #f0fdf4; font-weight: 700; font-size: 13px; }
          .ant-table-tbody > tr > td { font-size: 13px; }
          .ant-table-row-expand-icon { background: #e0f2fe; border-radius: 4px; }
        `}</style>
      </Card>
      
      <Modal
        title="Post a New Order"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[ <Button key="back" onClick={() => setIsModalOpen(false)}>Cancel</Button>, <Button key="submit" type="primary" onClick={() => form.submit()}>Submit Order</Button> ]}
        width={700}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrder} onValuesChange={handleFormValuesChange} initialValues={{ customerType: 'B2C' }} className="mt-4">
          
          <Form.Item name="customerType" label="Select Customer Type" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio.Button value="B2C">Individual (B2C)</Radio.Button>
              <Radio.Button value="B2B">Business (B2B)</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item 
              name="buyerName" 
              label={customerType === 'B2B' ? "Buyer's Registered Business Name" : "Customer Name"}
              rules={[{ required: true }]}
            >
              <Input placeholder={customerType === 'B2B' ? "Enter company name" : "Enter full name"} />
            </Form.Item>
             <Form.Item name="buyerPhoneNumber" label="Buyer's Phone Number" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }]}>
              <Input placeholder="e.g. 9876543210" />
            </Form.Item>
            <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}><Input placeholder="e.g. UltraTech Cement" /></Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}><Input placeholder="e.g. Cement" /></Form.Item>
            <Form.Item name="qty" label="Quantity" rules={[{ required: true, type: 'number', min: 1 }]}><InputNumber style={{ width: "100%" }} placeholder="e.g. 50" /></Form.Item>
            <Form.Item name="unitPrice" label="Unit Price (₹)" rules={[{ required: true, type: 'number', min: 0 }]}><InputNumber style={{ width: "100%" }} placeholder="e.g. 380" /></Form.Item>
            <Form.Item label="Total Price (Auto-Calculated)"><InputNumber style={{ width: "100%" }} value={formTotalPrice} prefix="₹" disabled /></Form.Item>
            <Form.Item name="expectedDeliveryDate" label="Expected Delivery Date" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          </div>
          
          {customerType === 'B2B' && (
            <Form.Item 
              name="gstNumber" 
              label="Buyer's GSTIN" 
              rules={[{ 
                required: customerType === 'B2B', 
                message: "GSTIN is required for B2B customers" 
              }, {
                pattern: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/,
                message: 'Please enter a valid GSTIN format'
              }]}
            >
              <Input placeholder="e.g. 22AAAAA0000A1Z5" />
            </Form.Item>
          )}

          <Form.Item name="shippingAddress" label="Full Shipping Address" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Enter site/building, area, city, and pincode" />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};

export default OrderManager;