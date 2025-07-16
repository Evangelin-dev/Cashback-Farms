import { Card, InputNumber, message, Table, Tooltip } from "antd";
import React, { useState, useEffect } from "react";
import Button from "../../../components/common/Button";
import apiClient from "../../../src/utils/api/apiClient";

// Define an interface for the product data structure
interface Product {
  id: number;
  key: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  offer: number; // For frontend calculations
  moq: number;
  description: string;
}

// Define the structure for the cache during editing
interface EditCache extends Product {
  originalPrice: number;
}

const PriceStockManager: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editCache, setEditCache] = useState<Partial<EditCache>>({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/ecommerce/materials/my-products/');
      const transformedData = response.filter((p: any) => p.status === 'Active').map((p: any) => ({
        id: p.id,
        key: p.id,
        name: p.name,
        category: p.category,
        price: parseFloat(p.price),
        quantity: p.stock_quantity,
        offer: 0, // Initialize offer percentage on the frontend
        moq: p.moq,
        description: p.description,
      })).sort((a: Product, b: Product) => b.id - a.id); // Show newest first
      setData(transformedData);
    } catch (error) {
      message.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (record: Product) => {
    setEditingKey(record.key);
    // Store the original price to calculate discounts against a stable value
    setEditCache({ ...record, originalPrice: record.price });
  };

  const handleSave = async (key: number) => {
    setLoading(true);
    try {
      const { name, description, moq, price, quantity } = editCache;
      const payload = {
        name,
        description,
        price, // Send the final, calculated price
        stock_quantity: quantity,
        category: "material", // As per requirement
        moq,
      };

      await apiClient.put(`/api/materials/${key}/`, payload);

      // Update the local data to reflect the save
      const newData = data.map(item => (item.key === key ? { ...item, ...editCache, price: editCache.price as number } : item));
      setData(newData);

      message.success("Updated successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      message.error("Update failed. Please try again.");
    } finally {
      setEditingKey(null);
      setEditCache({});
      setLoading(false);
    }
  };

  // Handles real-time changes and calculates price/offer
  const handleChange = (field: keyof EditCache, value: any) => {
    setEditCache(prev => {
      const newCache = { ...prev, [field]: value };

      // Two-way calculation logic
      if (field === 'offer') {
        const offerPercent = value || 0;
        const originalPrice = newCache.originalPrice || 0;
        // Calculate new price based on offer, rounding to 2 decimal places
        const newPrice = originalPrice * (1 - offerPercent / 100);
        newCache.price = Math.round(newPrice * 100) / 100;
      } else if (field === 'price') {
        const newPrice = value || 0;
        const originalPrice = newCache.originalPrice || 0;
        // If price is changed manually, recalculate the offer percentage
        if (originalPrice > 0) {
          const newOffer = ((originalPrice - newPrice) / originalPrice) * 100;
          newCache.offer = Math.max(0, Math.round(newOffer * 100) / 100); // Ensure offer isn't negative
        } else {
          newCache.offer = 0;
        }
      }
      return newCache;
    });
  };

  const columns = [
    { title: "Product", dataIndex: "name", render: (name: string) => <span className="font-semibold text-primary text-xs">{name}</span> },
    // FIX: This column will now hide on extra-small screens
    { title: "Cat.", dataIndex: "category", responsive: ['sm'], render: (cat: string) => <span className="text-blue-600 font-medium text-xs">{cat}</span> },
    {
      title: "Price",
      dataIndex: "price",
      render: (value: number, record: Product) =>
        editingKey === record.key ? (
          <InputNumber value={editCache.price} onChange={val => handleChange("price", val)} style={{ width: "100%" }} addonBefore="₹" />
        ) : (
          <span className="font-bold text-green-600 text-xs">₹{value.toLocaleString("en-IN")}</span>
        )
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      render: (value: number, record: Product) =>
        editingKey === record.key ? (
          <InputNumber value={editCache.quantity} onChange={val => handleChange("quantity", val)} style={{ width: "100%" }} />
        ) : (
          <span className="text-green-700 font-semibold text-xs">{value}</span>
        )
    },
    {
      title: "Offer (%)",
      dataIndex: "offer",
      render: (value: number, record: Product) =>
        editingKey === record.key ? (
          <InputNumber min={0} max={100} value={editCache.offer} onChange={val => handleChange("offer", val)} style={{ width: "100%" }} addonAfter="%" />
        ) : (
          <span className="text-yellow-700 font-semibold text-xs">{value}%</span>
        )
    },
    {
      title: "Action",
      render: (_: any, record: Product) =>
        editingKey === record.key ? (
          <Tooltip title="Save changes">
            <Button variant="primary" size="sm" onClick={() => handleSave(record.key)} loading={loading || undefined}>Save</Button>
          </Tooltip>
        ) : (
          <Tooltip title="Edit price, quantity or offer">
            <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>Edit</Button>
          </Tooltip>
        )
    }
  ];

  return (
    <Card
      title={<div className="flex items-center gap-3"><svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M3 10h18" /></svg><span className="text-x font-bold text-primary-light ">Pricing & Offers</span></div>}
      style={{ marginBottom: 24, borderRadius: 16, boxShadow: "0 2px 16px #60a5fa22", background: "linear-gradient(135deg, #f0f9ff 0%, #f9fafb 100%)", border: "none" }}
      styles={{ body: { background: "transparent", padding: "24px" } }}
    >
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        loading={loading}
        rowClassName="hover:bg-blue-50 transition"
        bordered={false}
        size="small"
        className="rounded-xl shadow"
        rowKey="key"
      />
      <style>{`
        .ant-card-head { background: linear-gradient(90deg,#f0f9ff 60%,#bae6fd 100%); border-radius: 16px 16px 0 0; }
        .ant-table-thead > tr > th { background: #f0f9ff; font-weight: 700; font-size: 13px; }
        .ant-table-tbody > tr > td { font-size: 13px; vertical-align: middle; }
      `}</style>
    </Card>
  );
};

export default PriceStockManager;