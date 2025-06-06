import { Card, Select, Table } from "antd";
import React, { useState } from "react";

const initialLeads = [
  {
    key: 1,
    name: "Anjali Mehra",
    contact: "+91-9876543210",
    plot: "Sunshine Meadows",
    status: "New",
  },
  {
    key: 2,
    name: "Vikas Singh",
    contact: "+91-9123456789",
    plot: "Sunshine Meadows",
    status: "Contacted",
  },
];

const statusOptions = ["New", "Contacted", "Converted", "Lost"];

const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState(initialLeads);

  const handleStatusChange = (key: number, value: string) => {
    setLeads(leads.map(lead =>
      lead.key === key ? { ...lead, status: value } : lead
    ));
  };

  const columns = [
    { title: "Lead Name", dataIndex: "name" },
    { title: "Contact", dataIndex: "contact" },
    { title: "Plot", dataIndex: "plot" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string, record: any) => (
        <Select
          value={status}
          onChange={value => handleStatusChange(record.key, value)}
          style={{ width: 120 }}
        >
          {statusOptions.map(opt => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <Card
      title="Lead Management"
      style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb" }}
      bodyStyle={{ background: "#fff" }}
    >
      <Table dataSource={leads} columns={columns} pagination={false} />
    </Card>
  );
};

export default LeadManagement;
