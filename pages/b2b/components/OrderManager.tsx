import { Button, Card, Table, Tag, message } from "antd";
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
    { title: "Order ID", dataIndex: "orderId" },
    { title: "Product Name", dataIndex: "productName" },
    { title: "Category", dataIndex: "category" },
    { title: "Quantity", dataIndex: "qty" },
    { title: "Buyer", dataIndex: "buyer" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) =>
        <Tag color={status === "Dispatched" ? "green" : "orange"}>{status}</Tag>
    },
    {
      title: "Action",
      render: (_: any, record: any) =>
        record.status === "Dispatched" ? (
          <Button
            type="primary"
            style={{
              background: "#ef4444", // red-500
              borderColor: "#ef4444",
              color: "#fff"
            }}
            onClick={() => handleDispatch(record.key)}
          >
            Cancel Dispatch
          </Button>
        ) : (
          <Button
            type="primary"
            style={{
              background: "#22c55e", // green-500
              borderColor: "#22c55e",
              color: "#fff"
            }}
            onClick={() => handleDispatch(record.key)}
          >
            Process Dispatch
          </Button>
        )
    }
  ];

  return (
    <Card title="Product Orders" style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb" }} bodyStyle={{ background: "#fff" }}>
      <Table dataSource={orders} columns={columns} pagination={false} />
    </Card>
  );
};

export default OrderManager;