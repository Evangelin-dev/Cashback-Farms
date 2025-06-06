import { Card, InputNumber, message, Table } from "antd";
import React, { useState } from "react";
import Button from "../../../components/common/Button";

const initialData = [
  { key: 1, name: "UltraTech Cement", category: "Cement", price: 380, quantity: 100, offer: 0 },
  { key: 2, name: "Red Clay Bricks", category: "Bricks", price: 8, quantity: 1000, offer: 10 },
];

const PriceStockManager: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editCache, setEditCache] = useState<any>({});

  const handleEdit = (record: any) => {
    setEditingKey(record.key);
    setEditCache({ ...record });
  };

  const handleSave = (key: number) => {
    setData(data.map(item => (item.key === key ? { ...editCache, key } : item)));
    setEditingKey(null);
    setEditCache({});
    message.success("Updated successfully!");
  };

  const handleChange = (field: string, value: any) => {
    setEditCache((prev: any) => ({ ...prev, [field]: value }));
  };

  const columns = [
    { title: "Product Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    {
      title: "Price",
      dataIndex: "price",
      render: (value: number, record: any) =>
        editingKey === record.key ? (
          <InputNumber
            min={1}
            value={editCache.price}
            onChange={val => handleChange("price", val)}
            style={{ width: "100%" }}
          />
        ) : (
          `₹${value.toLocaleString("en-IN")}`
        )
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (value: number, record: any) =>
        editingKey === record.key ? (
          <InputNumber
            min={1}
            value={editCache.quantity}
            onChange={val => handleChange("quantity", val)}
            style={{ width: "100%" }}
          />
        ) : (
          value
        )
    },
    {
      title: "Offer (%)",
      dataIndex: "offer",
      render: (value: number, record: any) =>
        editingKey === record.key ? (
          <InputNumber
            min={0}
            max={100}
            value={editCache.offer}
            onChange={val => handleChange("offer", val)}
            style={{ width: "100%" }}
          />
        ) : (
          value
        )
    },
    {
      title: "Action",
      render: (_: any, record: any) =>
        editingKey === record.key ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave(record.key)}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        )
    }
  ];

  return (
    <Card title="Pricing & Offers" style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb" }} bodyStyle={{ background: "#fff" }}>
      <Table dataSource={data} columns={columns} pagination={false} />
    </Card>
  );
};

export default PriceStockManager;