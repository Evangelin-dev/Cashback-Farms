import apiClient from "@/src/utils/api/apiClient"; // Adjust the import path if needed
import { Card, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";

const statusOptions = ["New", "Contacted", "Interested","Converted", "Lost"];

const statusColors: Record<string, string> = {
  New: "#2563eb",
  Contacted: "#22c55e",
  Interested: "#f59e42",
  Converted: "#059669",
  Lost: "#ef4444",
};

const statusBgColors: Record<string, string> = {
  New: "#eff6ff",
  Contacted: "#f0fdf4",
  Interested: "#f59e42",
  Converted: "#ecfdf5",
  Lost: "#fef2f2",
};

const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("access_token");
        const res = await apiClient.get("/plot-inquiries/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // Map API response to table format if needed
        const mappedLeads = (res.data || []).map((lead: any, idx: number) => ({
          key: lead.id || idx,
          id: lead.id,
          name: lead.lead_name || lead.inquirer_name || "N/A",
          contact: lead.contact || lead.phone || "N/A",
          plot: lead.plot_title || lead.plot_name || "N/A",
          inquiry: lead.inquiry || lead.message || "N/A",
          status: lead.status || "New",
        }));
        setLeads(mappedLeads);
      } catch (err) {
        setLeads([]);
        message.error("Failed to fetch leads");
      }
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const handleStatusChange = async (key: number, value: string) => {
    const lead = leads.find((l) => l.key === key);
    if (!lead) return;
    try {
      const accessToken = localStorage.getItem("access_token");
      await apiClient.patch(`/plot-inquiries/${lead.id}/`, { status: value }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLeads(leads.map((l) => (l.key === key ? { ...l, status: value } : l)));
      message.success("Status updated");
    } catch (err) {
      message.error("Failed to update status");
    }
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
          onChange={(value) => handleStatusChange(record.key, value)}
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
          {statusOptions.map((opt) => (
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

  // Filter leads by location (case-insensitive, partial match)
  const filteredLeads = locationFilter.trim()
    ? leads.filter(l => (l.plot || '').toLowerCase().includes(locationFilter.trim().toLowerCase()))
    : leads;

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
        background: "linear-gradient(90deg, #18191aff 0%, #fff 100%)",
        border: "none",
      }}
      bodyStyle={{
        background: "#fff",
        borderRadius: 18,
        padding: 36,
      }}
    >
      {/* Location Filter - top right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="text"
            placeholder="Search by location or plot name..."
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 15,
              width: 320,
              outline: 'none',
              boxShadow: '0 1px 4px #e0e7ef33',
            }}
          />
          {locationFilter && (
            <button
              onClick={() => setLocationFilter('')}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <Table
        dataSource={filteredLeads}
        columns={columns}
        pagination={false}
        style={{ borderRadius: 14, overflow: "hidden" }}
        rowClassName={() => "custom-leads-row"}
        loading={loading}
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
