import React, { useState, useEffect } from "react";
import { Card, Input, Table, Tag } from "antd";
import apiClient from "@/src/utils/api/apiClient"; // Adjust the import path if needed

const Leads: React.FC = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

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
                console.log("Fetched leads:", res);
                // Map API response to table format if needed
<<<<<<< HEAD
                const mappedLeads = (res.data || []).map((lead: any, idx: number) => ({
                    key: lead.id || idx,
                    name: lead.lead_name || lead.inquirer_name || "N/A",
                    contact: lead.contact || lead.phone || "N/A",
                    plot: lead.plot_name || lead.plot || "N/A",
                    inquiry: lead.inquiry || lead.message || "N/A",
                    status: lead.status || "New",
=======
                const mappedLeads = (res.data || []).map((lead: any) => ({
                    name: lead.lead_name || "N/A",
                    contact: lead.contact || "N/A",
                    plot: lead.plot_name || "N/A",
                    inquiry: lead.inquiry || "N/A",
                    status: lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : "New",
>>>>>>> a7649c49c7fc9ceee2f7bc49f42e93d295b88226
                }));
                setLeads(mappedLeads);
            } catch (err) {
                setLeads([]);
            }
             setLoading(false);
        };
        fetchLeads();
    }, []);

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
                <Tag
                    color={
                        status === "New"
                            ? "#2563eb"
                            : status === "Contacted"
                            ? "#22c55e"
                            : "#f59e42"
                    }
                    style={{
                        fontWeight: 600,
                        fontSize: 14,
                        borderRadius: 8,
                        padding: "2px 14px",
                        background:
                            status === "New"
                                ? "#eff6ff"
                                : status === "Contacted"
                                ? "#f0fdf4"
                                : "#fff7ed",
                        color:
                            status === "New"
                                ? "#2563eb"
                                : status === "Contacted"
                                ? "#15803d"
                                : "#b45309",
                    }}
                >
                    {status}
                </Tag>
            ),
        },
    ];

    return (
        <Card
            title={
                <span
                    style={{
                        fontWeight: 700,
                        fontSize: 22,
                        color: "#1e293b",
                    }}
                >
                    Plot Inquiries & Leads
                </span>
            }
            style={{
                marginBottom: 32,
                borderRadius: 16,
                boxShadow: "0 4px 24px #e0e7ef",
                background:
                    "linear-gradient(90deg, #f0f9ff 0%, #fff 100%)",
                border: "none",
            }}
            bodyStyle={{
                background: "#fff",
                borderRadius: 16,
                padding: 32,
            }}
            extra={
                <Input.Search
                    placeholder="Search by name or plot"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: 260,
                        borderRadius: 12,
                        fontSize: 16,
                        padding: "8px 16px",
                        background: "#f1f5f9",
                        boxShadow: "0 2px 8px #2563eb11",
                        border: "1.5px solid #dbeafe",
                    }}
                    allowClear
                />
            }
        >
            <Table
                dataSource={filteredLeads}
                columns={columns}
                pagination={false}
                style={{
                    borderRadius: 12,
                    overflow: "hidden",
                }}
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
          }
          .ant-table-tbody > tr > td {
            font-size: 15px;
            padding: 14px 12px;
          }
        `}
            </style>
        </Card>
    );
};

export default Leads;
