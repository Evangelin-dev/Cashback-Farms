import { Card, Col, Progress, Row, Statistic } from "antd";
import React from "react";

const stats = [
  { label: "Total Commission Earned", value: 120000, prefix: "₹" },
  { label: "Pending Commission", value: 25000, prefix: "₹" },
  { label: "Plots Sold", value: 8 },
  { label: "Active Leads", value: 5 },
];

const CommissionDashboard: React.FC = () => (
  <Card
    title="Commission Dashboard"
    style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb" }}
    bodyStyle={{ background: "#fff" }}
  >
    <Row gutter={24}>
      {stats.map((stat, idx) => (
        <Col xs={24} md={12} lg={6} key={idx}>
          <Statistic
            title={stat.label}
            value={stat.value}
            prefix={stat.prefix}
            valueStyle={{ color: "#1e293b" }}
          />
        </Col>
      ))}
    </Row>
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Commission Target Progress</h3>
      <Progress percent={60} status="active" strokeColor="#22c55e" />
    </div>
  </Card>
);

export default CommissionDashboard;
