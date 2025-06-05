import { Button, Card, Table, Tag, message } from "antd";
import React, { useState } from "react";

// Use plot-related mock data instead of products
const initialOrders = [
  { key: 1, orderId: "ORD001", plotName: "Green Acres", location: "Sector 21, Noida", qty: 1, status: "Pending" },
  { key: 2, orderId: "ORD002", plotName: "Sunrise Meadows", location: "Yamuna Expressway", qty: 1, status: "Pending" },
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
    { title: "Plot Name", dataIndex: "plotName" },
    { title: "Location", dataIndex: "location" },
    { title: "Quantity", dataIndex: "qty" },
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
    <Card title="Plot Orders" style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb" }} bodyStyle={{ background: "#fff" }}>
      <Table dataSource={orders} columns={columns} pagination={false} />
    </Card>
  );
};

export default OrderManager;