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

const statusColors: Record<string, string> = {
  New: "#2563eb",
  Contacted: "#22c55e",
  Converted: "#059669",
  Lost: "#ef4444",
};

const statusBgColors: Record<string, string> = {
  New: "#eff6ff",
  Contacted: "#f0fdf4",
  Converted: "#ecfdf5",
  Lost: "#fef2f2",
};

const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState(initialLeads);

  const handleStatusChange = (key: number, value: string) => {
    setLeads(leads.map(lead =>
      lead.key === key ? { ...lead, status: value } : lead
    ));
  };

  const columns = [
    {
      title: "Lead Name",
      dataIndex: "name",
      render: (name: string) => (
        <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 16 }}>{name}</span>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact",
      render: (contact: string) => (
        <span style={{ color: "#2563eb", fontWeight: 500 }}>{contact}</span>
      ),
    },
    {
      title: "Plot",
      dataIndex: "plot",
      render: (plot: string) => (
        <span style={{ color: "#059669", fontWeight: 500 }}>{plot}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string, record: any) => (
        <Select
          value={status}
          onChange={value => handleStatusChange(record.key, value)}
          style={{
            width: 148,
            borderRadius: 20,
            background: statusBgColors[status],
            fontWeight: 600,
            fontSize: 15,
            border: "none",
            boxShadow: "0 2px 8px #dbeafe33",
            outline: "none",
            padding: 0,
          }}
          dropdownStyle={{
            borderRadius: 14,
            padding: 6,
            background: "#f8fafc",
          }}
          optionLabelProp="label"
          bordered={false}
        >
          {statusOptions.map(opt => (
            <Select.Option
              key={opt}
              value={opt}
              label={
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  color: "#111"
                }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: statusColors[opt],
                      marginRight: 6,
                    }}
                  />
                  {opt}
                </span>
              }
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 600,
                color: "#111",
                fontSize: 15,
                padding: "4px 0"
              }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: statusColors[opt],
                    marginRight: 6,
                  }}
                />
                {opt}
              </div>
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <Card
      title={
        <span style={{ fontWeight: 700, fontSize: 22, color: "#1e293b", letterSpacing: 0.2 }}>
          Lead Management
        </span>
      }
      style={{
        marginBottom: 32,
        borderRadius: 18,
        boxShadow: "0 6px 32px #e0e7ef",
        background: "linear-gradient(90deg, #f0f9ff 0%, #fff 100%)",
        border: "none",
      }}
      bodyStyle={{
        background: "#fff",
        borderRadius: 18,
        padding: 36,
      }}
    >
      <Table
        dataSource={leads}
        columns={columns}
        pagination={false}
        style={{ borderRadius: 14, overflow: "hidden" }}
        rowClassName={() => "custom-leads-row"}
      />
      <style>
        {`
          .custom-leads-row:hover td {
            background: #f0f9ff !important;
            transition: background 0.2s;
          }
          .ant-table-thead > tr > th {
            background: #f1f5f9 !important;
            font-weight: 700;
            font-size: 15px;
            color: #2563eb;
            border-bottom: 2px solid #dbeafe !important;
            letter-spacing: 0.03em;
          }
          .ant-table-tbody > tr > td {
            font-size: 15px;
            padding: 16px 14px;
            background: #fff;
          }
        `}
      </style>
    </Card>
  );
};

export default LeadManagement;
