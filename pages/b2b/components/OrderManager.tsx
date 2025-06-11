import { Button, Card, message, Table, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import { generateOrderId } from "../../../constants.tsx";

// Use e-commerce product mock data
const initialOrders = [
  { key: 1, orderId: generateOrderId(), productName: "UltraTech Cement", category: "Cement", qty: 50, status: "Pending", buyer: "Ravi Kumar" },
  { key: 2, orderId: generateOrderId(), productName: "Red Clay Bricks", category: "Bricks", qty: 500, status: "Pending", buyer: "Priya Sharma" },
];

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState(initialOrders);

  const handleDispatch = (key: number) => {
    setOrders(orders.map(order =>
      order.key === key
        ? { ...order, status: order.status === "Dispatched" ? "Pending" : "Dispatched" }
        : order
    ));
    message.success("Order status updated!");
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      render: (id: string) => (
        <span className="font-mono text-blue-600 text-xs bg-blue-50 px-1.5 py-0.5 rounded">{id}</span>
      ),
    },
    {
      title: "Product",
      dataIndex: "productName",
      render: (name: string) => (
        <span className="font-semibold text-primary text-xs">{name}</span>
      ),
    },
    {
      title: "Cat.",
      dataIndex: "category",
      render: (cat: string) => (
        <Tag color="cyan" className="font-medium px-2 py-0.5 rounded text-xs">{cat}</Tag>
      ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      render: (qty: number) => (
        <span className="text-green-800 font-bold text-xs bg-green-50 px-2 py-0.5 rounded">{qty}</span>
      ),
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      render: (buyer: string) => (
        <span className="font-semibold text-gray-700 text-xs">{buyer}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) =>
        <Tag
          color={status === "Dispatched" ? "green" : "orange"}
          className={`font-bold px-2 py-0.5 rounded-full text-xs border ${
            status === "Dispatched"
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-yellow-100 text-yellow-700 border-yellow-300"
          }`}
        >
          {status}
        </Tag>
    },
    {
      title: "Action",
      render: (_: any, record: any) =>
        record.status === "Dispatched" ? (
          <Tooltip title="Cancel dispatch">
            <Button
              type="primary"
              size="small"
              style={{
                background: "#ef4444",
                border: "none",
                color: "#fff",
                borderRadius: 12,
                fontWeight: 500,
                padding: "0 10px"
              }}
              onClick={() => handleDispatch(record.key)}
            >
              Cancel
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="Dispatch">
            <Button
              type="primary"
              size="small"
              style={{
                background: "#22c55e",
                border: "none",
                color: "#fff",
                borderRadius: 12,
                fontWeight: 500,
                padding: "0 10px"
              }}
              onClick={() => handleDispatch(record.key)}
            >
              Dispatch
            </Button>
          </Tooltip>
        )
    }
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-100 p-1">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="13" rx="3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
            </svg>
          </span>
          <span className="text-base font-bold text-primary-light">Orders</span>
        </div>
      }
      style={{
        marginBottom: 16,
        borderRadius: 14,
        boxShadow: "0 2px 8px #22c55e11",
        background: "linear-gradient(135deg, #f0fdf4 0%, #f9fafb 100%)",
        border: "none",
      }}
      bodyStyle={{ background: "transparent", padding: 16 }}
    >
      <Table
        dataSource={orders}
        columns={columns}
        pagination={false}
        rowClassName="hover:bg-green-50 transition"
        bordered={false}
        size="small"
        className="rounded-lg shadow"
      />
      <style>{`
        .ant-card-head {
          background: linear-gradient(90deg,#f0fdf4 60%,#bbf7d0 100%);
          border-radius: 14px 14px 0 0;
        }
        .ant-table-thead > tr > th {
          background: #f0fdf4;
          font-weight: 700;
          font-size: 13px;
        }
        .ant-table-tbody > tr > td {
          font-size: 13px;
        }
      `}</style>
    </Card>
  );
};

export default OrderManager;