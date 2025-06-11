import { Card, InputNumber, message, Table, Tooltip } from "antd";
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
    {
      title: "Product",
      dataIndex: "name",
      render: (name: string) => (
        <span className="font-semibold text-primary text-xs">{name}</span>
      ),
    },
    {
      title: "Cat.",
      dataIndex: "category",
      render: (cat: string) => (
        <span className="text-blue-600 font-medium text-xs">{cat}</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (value: number, record: any) =>
        editingKey === record.key ? (
          <InputNumber
            min={1}
            value={editCache.price}
            onChange={val => handleChange("price", val)}
            style={{ width: "100%", borderRadius: 8, background: "#f0fdf4" }}
            addonBefore={<span className="text-green-600 font-bold">₹</span>}
            className="py-1 px-2"
          />
        ) : (
          <span className="font-bold text-green-600 text-xs">₹{value.toLocaleString("en-IN")}</span>
        )
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      render: (value: number, record: any) =>
        editingKey === record.key ? (
          <InputNumber
            min={1}
            value={editCache.quantity}
            onChange={val => handleChange("quantity", val)}
            style={{ width: "100%", borderRadius: 8, background: "#f0fdf4" }}
            className="py-1 px-2"
          />
        ) : (
          <span className="text-green-700 font-semibold text-xs">{value}</span>
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
            style={{ width: "100%", borderRadius: 8, background: "#fef9c3" }}
            addonAfter={<span className="text-yellow-700 font-bold">%</span>}
            className="py-1 px-2"
          />
        ) : (
          <span className="text-yellow-700 font-semibold text-xs">{value}%</span>
        )
    },
    {
      title: "Action",
      render: (_: any, record: any) =>
        editingKey === record.key ? (
          <Tooltip title="Save changes">
            <Button
              variant="primary"
              size="sm"
              className="rounded-full px-3 py-0.5 text-xs bg-primary text-white border-primary hover:bg-primary-dark"
              onClick={() => handleSave(record.key)}
            >
              Save
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="Edit price, quantity or offer">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-3 py-0.5 text-xs border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          </Tooltip>
        )
    }
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <rect x="3" y="7" width="18" height="13" rx="3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
          </svg>
          <span className="text-xfont-bold text-primary-light ">Pricing & Offers</span>
        </div>
      }
      style={{
        marginBottom: 24,
        borderRadius: 16,
        boxShadow: "0 2px 16px #60a5fa22",
        background: "linear-gradient(135deg, #f0f9ff 0%, #f9fafb 100%)",
        border: "none",
      }}
      bodyStyle={{ background: "transparent", padding: 24 }}
    >
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        rowClassName="hover:bg-blue-50 transition"
        bordered={false}
        size="small"
        className="rounded-xl shadow"
      />
      <style>{`
        .ant-card-head {
          background: linear-gradient(90deg,#f0f9ff 60%,#bae6fd 100%);
          border-radius: 16px 16px 0 0;
        }
        .ant-table-thead > tr > th {
          background: #f0f9ff;
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

export default PriceStockManager;