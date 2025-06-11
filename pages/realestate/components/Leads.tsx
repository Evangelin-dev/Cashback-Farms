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
