import { Card, Col, message, Row, Statistic, Table, Tag } from "antd";
import React, { useState, useEffect } from "react";
import apiClient from "../../../src/utils/api/apiClient"; // Make sure this path is correct

// Define TypeScript types for our data for better code quality and type safety
interface IPaymentSummary {
  vendor: string;
  total_earned: string;
  currency: string;
}

interface IPaymentHistoryItem {
  order_id: string;
  product: string;
  quantity: number;
  unit_price: string;
  total: string;
  delivered_on: string;
}

const PaymentsPage: React.FC = () => {
  // State is initialized empty or null. It will be filled exclusively by the API call.
  const [summary, setSummary] = useState<IPaymentSummary | null>(null);
  const [history, setHistory] = useState<IPaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from both endpoints when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch summary and history data in parallel for efficiency
        // As per your instruction, the response is used directly (not response.data)
        const [summaryResponse, historyResponse] = await Promise.all([
          apiClient.get('/vendor/payments/summary/'),
          apiClient.get('/vendor/payments/history/')
        ]);

        // Populate state with data from the APIs
        setSummary(summaryResponse);
        setHistory(historyResponse);
        
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
        message.error("Could not load payment information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  // Define columns for the payment history table
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right' as const,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      align: 'right' as const,
      render: (price: string) => `₹${Number(price).toLocaleString('en-IN')}`,
    },
    {
      title: 'Delivered On',
      dataIndex: 'delivered_on',
      key: 'delivered_on',
      align: 'center' as const,
    },
    {
      title: 'Total Amount',
      dataIndex: 'total',
      key: 'total',
      align: 'right' as const,
      render: (total: string) => <span className="font-bold text-green-600">₹{Number(total).toLocaleString('en-IN')}</span>,
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment Overview</h1>

      {/* Top Section: Summary Card */}
      <Row justify="center" className="mb-8">
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card
            loading={isLoading}
            style={{
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(22, 163, 74, 0.1)",
              background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
            }}
          >
            <Statistic
              title={
                <div className="flex items-center gap-2 text-gray-600 font-semibold">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Total Earnings
                </div>
              }
              value={summary?.total_earned ? Number(summary.total_earned) : 0}
              precision={2}
              prefix="₹"
              valueStyle={{
                color: "#15803d",
                fontWeight: 700,
                fontSize: "2.25rem",
                letterSpacing: "-0.5px"
              }}
            />
            <p className="text-xs text-gray-400 mt-2">
              Vendor: {summary?.vendor || 'Loading...'}
            </p>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section: Payment History Table */}
      <Card
        title="Payment History"
        style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      >
        <Table
          columns={columns}
          dataSource={history}
          loading={isLoading}
          rowKey="order_id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 'max-content' }} // For better mobile responsiveness
        />
      </Card>
    </div>
  );
};

export default PaymentsPage;  