import { Card, Input, Table, Tag } from "antd";
import React, { useState } from "react";

const initialLeads = [
  {
    key: 1,
    name: "Anjali Mehra",
    contact: "+91-9876543210",
    plot: "Sunshine Meadows",
    inquiry: "Interested in site visit",
    status: "New",
  },
  {
    key: 2,
    name: "Vikas Singh",
    contact: "+91-9123456789",
    plot: "Sunshine Meadows",
    inquiry: "Wants price negotiation",
    status: "Contacted",
  },
];

const Leads: React.FC = () => {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.plot.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "Lead Name", dataIndex: "name" },
    { title: "Contact", dataIndex: "contact" },
    { title: "Plot", dataIndex: "plot" },
    { title: "Inquiry", dataIndex: "inquiry" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "New" ? "blue" : "green"}>{status}</Tag>
      ),
    },
  ];

  return (
    <Card
      title="Plot Inquiries & Leads"
      style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb" }}
      bodyStyle={{ background: "#fff" }}
      extra={
        <Input.Search
          placeholder="Search by name or plot"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 240 }}
        />
      }
    >
      <Table dataSource={filteredLeads} columns={columns} pagination={false} />
    </Card>
  );
};

export default Leads;
